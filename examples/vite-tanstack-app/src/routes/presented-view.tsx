import { createFileRoute } from "@tanstack/react-router";

import { useCallback, useEffect, useState } from "react";
import { useChildWindowManager } from "react-presentation-hook";

import { Navigation } from "@/components/navigation";
import { PresentationSlide } from "@/components/presentation-slide";
import { ChildMessage, ParentMessage, PresentationState } from "@/types";

export const Route = createFileRoute("/presented-view")({
  component: PresentedView,
});

function PresentedView() {
  const [presentationState, setPresentationState] =
    useState<PresentationState | null>(null);
  const onMessage = useCallback(({ newState }: ParentMessage) => {
    setPresentationState(newState);
  }, []);

  const { initialState, sendMessage } = useChildWindowManager<
    PresentationState,
    ParentMessage,
    ChildMessage
  >({ onMessage });

  useEffect(() => {
    if (initialState) {
      setPresentationState(initialState);
    }
  }, [initialState]);

  const onNext = () => {
    if (sendMessage) {
      sendMessage({ type: "move-next" });
    }
  };

  const onBack = () => {
    if (sendMessage) {
      sendMessage({ type: "move-back" });
    }
  };

  if (presentationState === null) {
    return <div>Loading...</div>;
  }

  const { currentSlide, currentIndex, length } = presentationState;

  return (
    <>
      <PresentationSlide slide={currentSlide} showNotes={false} />
      <div className="flex justify-center">
        <Navigation
          currentIndex={currentIndex}
          length={length}
          onNext={onNext}
          onBack={onBack}
        />
      </div>
    </>
  );
}
