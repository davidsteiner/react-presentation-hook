import { useEffect, useRef, useState } from 'react';

import { ChildMessage, ParentEnvelope } from './messages';

type Connection<TCustomPayload> = {
  parentWindow: Window;
  sessionId: string;
  send: (message: ChildMessage<TCustomPayload>) => void;
};

const PING_TIMEOUT = 3000;

export function useChildWindowManager<
  TInitialState,
  TCustomInboundPayload,
  TCustomOutboundPayload
>(onMessage: (message: TCustomInboundPayload) => void) {
  const [connection, setConnection] =
    useState<Connection<TCustomOutboundPayload> | null>(null);
  const [initialState, setInitialState] = useState<TInitialState | null>(null);
  const [closeWithParent, setCloseWithParent] = useState<boolean>(false);
  const lastPingTimeRef = useRef<number>(Date.now());
  const parentCheckIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!window.opener) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const urlSessionId = urlParams.get('sessionId');

    if (!urlSessionId) {
      return;
    }

    const parentWindow = window.opener as Window;
    const connection = {
      sessionId: urlSessionId,
      parentWindow,
      send: (message: ChildMessage<TCustomOutboundPayload>) => {
        const envelope = {
          sessionId: urlSessionId,
          ...message,
        };
        parentWindow.postMessage(envelope, '*');
      },
    };
    setConnection(connection);

    // Send ready message to parent
    connection.send({ type: 'ready' });

    const handleMessage = (event: MessageEvent) => {
      const message = event.data as ParentEnvelope<
        TInitialState,
        TCustomInboundPayload
      >;

      if (
        !message ||
        typeof message !== 'object' ||
        !message.sessionId ||
        message.sessionId !== connection.sessionId
      ) {
        return; // Not our message
      }

      if (!message.type) {
        onMessage(message);
      }

      switch (message.type) {
        case 'close': {
          window.close();
          break;
        }
        case 'init': {
          setInitialState(message.state);
          setCloseWithParent(message.closeWithParent);
          break;
        }
        case 'ping': {
          lastPingTimeRef.current = message.timestamp;
          break;
        }
        case 'custom': {
          onMessage(message.payload);
          break;
        }
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onMessage]);

  // Set up the parent window check interval when closeWithParent changes
  useEffect(() => {
    // Clean up any existing interval
    if (parentCheckIntervalRef.current !== null) {
      clearInterval(parentCheckIntervalRef.current);
      parentCheckIntervalRef.current = null;
    }

    if (closeWithParent && connection) {
      parentCheckIntervalRef.current = window.setInterval(() => {
        try {
          if (connection.parentWindow.closed) {
            window.close();
            return;
          }

          // Next check if the parent is still the same page by checking ping time
          const timeSinceLastPing = Date.now() - lastPingTimeRef.current;
          if (timeSinceLastPing > PING_TIMEOUT) {
            window.close();
            return;
          }
        } catch {
          window.close();
          return;
        }
      }, 1000);
    }

    return () => {
      if (parentCheckIntervalRef.current !== null) {
        clearInterval(parentCheckIntervalRef.current);
        parentCheckIntervalRef.current = null;
      }
    };
  }, [connection, closeWithParent]);

  useEffect(() => {
    if (connection) {
      connection.send({ type: 'ready' });
    }
  }, [connection]);

  const isConnected = connection !== null;
  const sendMessage = connection
    ? (payload: TCustomOutboundPayload) => {
        const message = {
          type: 'custom' as const,
          payload,
        };
        connection?.send(message);
      }
    : null;

  return {
    isConnected,
    sendMessage,
    initialState,
  };
}
