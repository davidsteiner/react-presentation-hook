export type SlideContent = {
  text: string;
  bullets?: string[];
  codeBlock?: {
    code: string;
    language: string;
  };
};

export type Slide = {
  title: string;
  subtitle?: string;
  content: SlideContent;
  notes?: string;
};

export type PresentationState = {
  currentIndex: number;
  currentSlide: Slide;
  length: number;
};

export type ParentMessage = {
  newState: PresentationState;
};

export type ChildMessage = { type: "move-next" } | { type: "move-back" };
