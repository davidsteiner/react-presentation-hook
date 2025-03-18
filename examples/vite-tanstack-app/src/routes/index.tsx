import { createFileRoute } from '@tanstack/react-router';

import { useState } from 'react';
import { useWindowManager } from 'react-presentation-hook';

import {
  ChildMessage,
  ParentMessage,
  PresentationState,
  Slide,
} from '../types';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const [presentationState, setPresentationState] = useState<PresentationState>(
    {
      currentSlide: slides[0],
      currentIndex: 0,
      length: slides.length,
    }
  );

  const onMessage = ({ type }: ChildMessage) => {
    switch (type) {
      case 'move-next': {
        onNext();
        break;
      }
      case 'move-back': {
        onBack();
        break;
      }
    }
  };

  const { openChildWindow, sendMessage } = useWindowManager<
    PresentationState,
    ParentMessage,
    ChildMessage
  >(onMessage);

  const onOpen = () => {
    openChildWindow({
      url: '/presented-view',
      initialState: presentationState,
    });
  };

  const onNext = () => {
    setPresentationState((previousState) => {
      const newIndex = previousState.currentIndex + 1;
      if (newIndex < slides.length) {
        const newState = {
          currentIndex: newIndex,
          currentSlide: slides[newIndex],
          length: slides.length,
        };
        if (sendMessage) {
          sendMessage({ newState });
        }
        return newState;
      }
      return previousState;
    });
  };

  const onBack = () => {
    setPresentationState((previousState) => {
      const newIndex = previousState.currentIndex - 1;
      if (newIndex < slides.length) {
        const newState = {
          currentIndex: newIndex,
          currentSlide: slides[newIndex],
          length: slides.length,
        };
        if (sendMessage) {
          sendMessage({ newState });
        }
        return newState;
      }
      return previousState;
    });
  };

  return (
    <div className="p-2">
      <h1>A demo presentation</h1>

      <button onClick={onOpen}>Open external window</button>
      <button onClick={onNext}>Next</button>
      <button onClick={onBack}>Back</button>
    </div>
  );
}

const slides: Slide[] = [
  {
    title: 'Introduction',
    content: 'This will be a presentation about dolphins.',
  },
  {
    title: 'Something in the middle',
    content: 'Dolphins are smart.',
  },
  {
    title: 'Conclusion',
    content: 'This was a presentation about dolphins.',
  },
];
