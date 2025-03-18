import { useCallback, useEffect, useRef, useState } from "react";

import {
  ChildEnvelope,
  InitMessage,
  ParentEnvelope,
  ParentMessage,
  PingMessage,
} from "./messages";

export type ChildWindowOptions<T> = {
  url: string;
  initialState: T;
  name?: string;
  features?: string;
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

type UnopenedState = {
  type: "unopened";
};

type OpeningState<TInitialState> = {
  type: "opening";
  sessionId: string;
  state: TInitialState;
  childWindow: Window;
};

type ReadyState<TInitialState, TCustomOutboundPayload> = {
  type: "ready";
  sessionId: string;
  childWindow: Window;
  sendMessage: (
    message: ParentMessage<TInitialState, TCustomOutboundPayload>
  ) => void;
};

type ChildWindowState<TInitialState, TParentMessage> =
  | OpeningState<TInitialState>
  | ReadyState<TInitialState, TParentMessage>
  | UnopenedState;

export function useWindowManager<
  TInitialState,
  TCustomOutboundPayload,
  TCustomInboundPayload,
>(onMessage: (message: TCustomInboundPayload) => void, closeWithParent = true) {
  const [childWindowState, setChildWindowState] = useState<
    ChildWindowState<TInitialState, TCustomOutboundPayload>
  >({ type: "unopened" });
  // this duplicates local state to avoid race conditions
  // where handleMessage may be called before the state is updated
  // TODO: I'm sure there is a better way
  const childWindowStateRef = useRef<
    ChildWindowState<TInitialState, TCustomOutboundPayload>
  >({
    type: "unopened",
  });

  const updateChildWindowState = useCallback(
    (newState: ChildWindowState<TInitialState, TCustomOutboundPayload>) => {
      childWindowStateRef.current = newState;
      setChildWindowState(newState);
    },
    []
  );

  const openChildWindow = ({
    url,
    name = "child-window",
    initialState,
    features = "width=1024,height=768",
  }: ChildWindowOptions<TInitialState>) => {
    const sessionId = generateId();
    const urlObject = new URL(url, window.location.origin);
    urlObject.searchParams.append("sessionId", sessionId);

    const newWindow = window.open(urlObject.toString(), name, features);
    if (!newWindow) {
      throw new Error(
        "Failed to open child window. Check popup blocker settings."
      );
    }

    const openingState: OpeningState<TInitialState> = {
      type: "opening",
      sessionId,
      state: initialState,
      childWindow: newWindow,
    };
    updateChildWindowState(openingState);

    // Set up window close detection
    const checkIfChildClosed = setInterval(() => {
      if (newWindow.closed) {
        clearInterval(checkIfChildClosed);
        if (childWindowStateRef.current.type !== "unopened") {
          updateChildWindowState({ type: "unopened" });
        }
      }
    }, 500);

    return newWindow;
  };

  const closeChildWindow = () => {
    if (childWindowState.type !== "unopened") {
      const childWindow = getChildWindow();
      if (childWindow && !childWindow.closed) {
        sendMessage({ type: "close" });
        childWindow.close();
      }
      updateChildWindowState({ type: "unopened" });
    }
  };

  const getChildWindow = () => {
    if (childWindowStateRef.current.type !== "unopened") {
      return childWindowStateRef.current.childWindow;
    }

    return null;
  };

  const handleParentUnload = useCallback(() => {
    const childWindow = getChildWindow();
    if (childWindow && !childWindow.closed) {
      childWindow.close();
    }
  }, []);

  const sendMessage = useCallback(
    (message: ParentMessage<TInitialState, TCustomOutboundPayload>) => {
      if (childWindowStateRef.current.type !== "unopened") {
        const childWindow = childWindowStateRef.current.childWindow;

        if (childWindow.closed) {
          return false;
        }

        const envelope: ParentEnvelope<TInitialState, TCustomOutboundPayload> =
          {
            sessionId: childWindowStateRef.current.sessionId,
            ...message,
          };
        childWindow.postMessage(envelope, "*");
        return true;
      } else {
        return false;
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      handleParentUnload();
    };
  }, [handleParentUnload]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data as ChildEnvelope<TCustomInboundPayload>;

      if (!message || typeof message !== "object" || !message.type) {
        return; // Not our message format
      }

      // We are not ready to process messages, probably a stale message
      const childWindowState = childWindowStateRef.current;
      if (childWindowState.type === "unopened") {
        return;
      }

      // A stale message or a message for another window manager
      if (message.sessionId !== childWindowState.sessionId) {
        return;
      }

      switch (message.type) {
        case "ready": {
          if (childWindowState.type === "opening") {
            const childWindow = childWindowState.childWindow;
            const initMessage: InitMessage<TInitialState> = {
              type: "init",
              state: childWindowState.state,
              closeWithParent,
            };
            sendMessage(initMessage);
            updateChildWindowState({
              type: "ready",
              sessionId: childWindowState.sessionId,
              childWindow: childWindow,
              sendMessage: (
                message: ParentMessage<TInitialState, TCustomOutboundPayload>
              ) => {
                const envelope = {
                  sessionId: childWindowState.sessionId,
                  ...message,
                };
                childWindow.postMessage(envelope, "*");
              },
            });
          }
          break;
        }
        case "custom": {
          onMessage(message.payload);
          break;
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [
    closeWithParent,
    handleParentUnload,
    onMessage,
    sendMessage,
    updateChildWindowState,
  ]);

  useEffect(() => {
    // Only send pings if we have a ready child window
    if (childWindowState?.type === "ready") {
      const pingIntervalId = setInterval(() => {
        const pingMessage: PingMessage = {
          type: "ping",
          timestamp: Date.now(),
        };

        // Use the existing sendSystemMessage function
        sendMessage(pingMessage);
      }, 1000); // Send ping every second

      return () => {
        clearInterval(pingIntervalId);
      };
    }

    return;
  }, [childWindowState, sendMessage]);

  const isConnected = childWindowState?.type === "ready";
  const sendCustomMessage =
    childWindowState?.type === "ready"
      ? (payload: TCustomOutboundPayload) =>
          childWindowState.sendMessage({ type: "custom" as const, payload })
      : null;

  return {
    isConnected,
    sendMessage: sendCustomMessage,
    openChildWindow,
    closeChildWindow,
  };
}
