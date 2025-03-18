export type Slide = {
  title: string;
  content: string;
};

export type PresentationState = {
  currentIndex: number;
  currentSlide: Slide;
  length: number;
};

export type ParentMessage = {
  newState: PresentationState;
};

export type ChildMessage = { type: 'move-next' } | { type: 'move-back' };
