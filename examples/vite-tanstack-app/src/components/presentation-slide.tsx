import { Slide } from "@/types";

type Props = {
  slide: Slide;
};

export function PresentationSlide({ slide }: Props) {
  const { title, subtitle, content } = slide;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
        {subtitle && (
          <h3 className="text-xl text-slate-600 mt-2">{subtitle}</h3>
        )}
      </div>

      <div className="flex-1">
        {content.text && (
          <p className="text-lg text-slate-700 mb-6">{content.text}</p>
        )}

        {content.bullets && content.bullets.length > 0 && (
          <ul className="space-y-3 my-6">
            {content.bullets.map((bullet, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex mr-2 mt-1 h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                  •
                </span>
                <span className="text-slate-700">{bullet}</span>
              </li>
            ))}
          </ul>
        )}

        {content.codeBlock && (
          <div className="my-6 bg-slate-800 text-slate-100 p-4 rounded-md overflow-x-auto">
            <pre className="font-mono text-sm">
              <code>{content.codeBlock.code}</code>
            </pre>
          </div>
        )}
      </div>

      {slide.notes && (
        <div className="mt-8 text-sm border-t border-slate-200 pt-4 text-slate-500 italic">
          <p>{slide.notes}</p>
        </div>
      )}
    </div>
  );
}
