import { createFileRoute } from '@tanstack/react-router';

import { useEffect, useState } from 'react';
import { useChildWindowManager } from 'react-presentation-hook';

import { ChildMessage, ParentMessage, PresentationState } from '../types';

export const Route = createFileRoute('/presented-view')({
  component: PresentedView,
});

function PresentedView() {
  const [presentationState, setPresentationState] =
    useState<PresentationState | null>(null);
  const onMessage = ({ newState }: ParentMessage) => {
    setPresentationState(newState);
  };
  const { initialState } = useChildWindowManager<
    PresentationState,
    ParentMessage,
    ChildMessage
  >(onMessage);

  useEffect(() => {
    if (initialState) {
      setPresentationState(initialState);
    }
  }, [initialState]);

  if (presentationState === null) {
    return <div>Loading...</div>;
  }

  const {
    currentSlide: { title, content },
    currentIndex: index,
    length,
  } = presentationState;

  return (
    <div>
      <div>
        Slide ({index + 1} / {length})
      </div>
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
}
