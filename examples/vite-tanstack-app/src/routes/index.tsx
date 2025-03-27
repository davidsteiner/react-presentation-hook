import { createFileRoute } from "@tanstack/react-router";

import { useCallback, useEffect, useState } from "react";
import { useWindowManager } from "react-presentation-hook";

import { MonitorUp, MonitorX } from "lucide-react";

import { Navigation } from "@/components/navigation";
import { PresentationSlide } from "@/components/presentation-slide";
import { Button } from "@/components/ui/button";
import { ChildMessage, ParentMessage, PresentationState, Slide } from "@/types";

export const Route = createFileRoute("/")({
  component: Index,
});

const getBasePath = () => {
  // In development, this will be an empty string
  // In production on GitHub Pages, it will be '/react-presentation-hook'
  return import.meta.env.BASE_URL || "/";
};

function Index() {
  const [presentationState, setPresentationState] = useState<PresentationState>(
    {
      currentSlide: slides[0],
      currentIndex: 0,
      length: slides.length,
    }
  );

  const onBack = useCallback(() => {
    setPresentationState((previousState) => {
      const newIndex = previousState.currentIndex - 1;
      if (newIndex < slides.length) {
        return {
          currentIndex: newIndex,
          currentSlide: slides[newIndex],
          length: slides.length,
        };
      }
      return previousState;
    });
  }, []);

  const onNext = useCallback(() => {
    setPresentationState((previousState) => {
      const newIndex = previousState.currentIndex + 1;
      if (newIndex < slides.length) {
        return {
          currentIndex: newIndex,
          currentSlide: slides[newIndex],
          length: slides.length,
        };
      }
      return previousState;
    });
  }, []);

  const onMessage = useCallback(
    ({ type }: ChildMessage) => {
      switch (type) {
        case "move-next": {
          onNext();
          break;
        }
        case "move-back": {
          onBack();
          break;
        }
      }
    },
    [onBack, onNext]
  );

  const { openChildWindow, closeChildWindow, isConnected, sendMessage } =
    useWindowManager<PresentationState, ParentMessage, ChildMessage>({
      onMessage,
    });

  const onOpen = () => {
    const url = `${getBasePath()}/#/presented-view`;
    openChildWindow({
      url,
      initialState: presentationState,
    });
  };

  useEffect(() => {
    if (sendMessage) {
      sendMessage({ newState: presentationState });
    }
  }, [presentationState, sendMessage]);

  return (
    <>
      <PresentationSlide slide={presentationState.currentSlide} />
      <div className="flex gap-2 justify-center">
        {isConnected ? (
          <Button onClick={closeChildWindow}>
            <MonitorX />
          </Button>
        ) : (
          <Button onClick={onOpen}>
            <MonitorUp />
          </Button>
        )}
        <Navigation
          currentIndex={presentationState.currentIndex}
          length={presentationState.length}
          onNext={onNext}
          onBack={onBack}
        />
      </div>
    </>
  );
}

const slides: Slide[] = [
  {
    title: "React Presentation Hook",
    subtitle:
      "A React hook for managing child windows with type-safe communication",
    content: {
      text: "Simplify parent-child window management in your React applications",
    },
    notes: "Start by introducing yourself and the problem this library solves",
  },
  {
    title: "The Problem",
    content: {
      text: "Managing separate windows in web applications is challenging:",
      bullets: [
        "Presenter needs a different view than the audience",
        "Both windows need to stay synchronized",
        "Communication between windows must be reliable",
        "Type safety helps prevent communication bugs",
      ],
    },
    notes: "Emphasize the complexity that this library helps solve",
  },
  {
    title: "Key Features",
    content: {
      text: "react-presentation-hook provides:",
      bullets: [
        "Type-safe bidirectional communication between windows",
        "Simple API for opening and managing child windows",
        "Connection status tracking between parent and child",
        "Initial state passing from parent to child",
      ],
    },
  },
  {
    title: "Parent Window Implementation",
    content: {
      text: "Using useWindowManager in the parent:",
      codeBlock: {
        language: "typescript",
        code: 'function ParentComponent() {\n  const onMessage = useCallback((message: ChildMessage) => {\n    // Handle messages from child\n    console.log("Received from child:", message);\n  }, []);\n\n  const { openChildWindow, closeChildWindow,\n         isConnected, sendMessage } =\n    useWindowManager<State, ParentMessage, ChildMessage>({\n      onMessage,\n    });\n\n  // Use these functions to control the presentation\n}',
      },
    },
    notes:
      "Walk through each part of the hook's return values and their purpose",
  },
  {
    title: "Child Window Implementation",
    content: {
      text: "Using useChildWindowManager in the child:",
      codeBlock: {
        language: "typescript",
        code: 'function ChildComponent() {\n  const onMessage = useCallback((message: ParentMessage) => {\n    // Handle messages from parent\n    console.log("Received from parent:", message);\n  }, []);\n\n  const { initialState, sendMessage } = \n    useChildWindowManager<State, ParentMessage, ChildMessage>({\n      onMessage,\n    });\n\n  // Use initialState to set up view\n  // Use sendMessage to communicate back to parent\n}',
      },
    },
  },
  {
    title: "Use Cases",
    content: {
      text: "Perfect for:",
      bullets: [
        "Presentations with separate presenter and audience views",
        "Multi-screen applications requiring synchronization",
        "Interactive demos with control panels",
        "Any scenario needing a controlled additional window with communication",
      ],
    },
    notes:
      "Mention that while presentations are the primary use case, the implementation is generic",
  },
  {
    title: "Demo",
    subtitle: "See it in action",
    content: {
      text: "This presentation itself uses react-presentation-hook!",
      bullets: [
        "Parent window: This controller with speaker notes",
        "Child window: The presentation audience is seeing",
        "Try navigating slides to see synchronization",
        "Changes in one window are reflected in the other",
      ],
    },
    notes:
      "Walk through the implementation of this demonstration to showcase the library's capabilities",
  },
  {
    title: "Get Started",
    content: {
      text: "Find documentation and examples on GitHub:",
      codeBlock: {
        language: "text",
        code: "github.com/davidsteiner/react-presentation-hook",
      },
    },
    notes:
      "Mention that the library has no external dependencies and is lightweight",
  },
];
