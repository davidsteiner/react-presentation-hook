import { Button } from "@/components/ui/button";

type Props = {
  currentIndex: number;
  length: number;
  onNext: () => void;
  onBack: () => void;
};

export function Navigation({ currentIndex, length, onNext, onBack }: Props) {
  const hasNext = currentIndex < length - 1;
  const hasBack = currentIndex > 0;

  return (
    <div className="flex gap-4 items-center">
      <Button onClick={onBack} disabled={!hasBack}>
        Back
      </Button>
      <div>
        {currentIndex + 1} / {length}
      </div>
      <Button onClick={onNext} disabled={!hasNext}>
        Next
      </Button>
    </div>
  );
}
