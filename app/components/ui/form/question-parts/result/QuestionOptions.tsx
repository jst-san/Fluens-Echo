import { CheckInput } from "@/app/components/ui/inputs";
import { FormSettings, SubmissionQuestion } from "@/types/form";
import { LuCheck, LuChevronDown, LuX } from "react-icons/lu";
import OptionLabel from "@/app/components/ui/form/OptionLabel";

export default function QuestionOptions({
  q,
  settings,
}: {
  q: SubmissionQuestion;
  settings: FormSettings;
}) {
  const { isQuiz, allowSeeCorrectAnswers, allowSeeWrongAnswers } = settings;

  return (
    <>
      {(q.type === "radio" || q.type === "checkbox") && (
        <div className="space-y-3">
          {(q.options || []).map((o, oi) => {
            const isSelected = q.answers?.includes(o.id);
            const isCorrect = q.correctAnswers?.includes(o.id);
            const isWrong = !isCorrect && isSelected;

            return (
              <OptionLabel
                key={o.id}
                htmlFor={o.id}
                className={`relative 
                  ${isSelected ? "bg-brand-light/10 border-brand" : "hover:border-muted-dark"} 
                  ${isQuiz && allowSeeWrongAnswers && isWrong && "border-red-200! bg-red-50/50!"} 
                  ${isQuiz && allowSeeCorrectAnswers && isCorrect && isSelected && "border-green-200 bg-green-50/50!"}
                `}
              >
                <CheckInput
                  id={o.id}
                  type={q.type as any}
                  className="pointer-events-none"
                  checked={isSelected}
                  name={q.id}
                  readOnly
                />

                <span className="flex-1 text-sm outline-none resize-none">
                  {o.title}
                </span>

                {isQuiz && (
                  <>
                    {allowSeeWrongAnswers && isWrong && (
                      <span className="absolute right-3 flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
                        <LuX strokeWidth={3} size={14} />
                      </span>
                    )}
                    {allowSeeCorrectAnswers && isCorrect && (
                      <span className="absolute right-3 flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                        <LuCheck strokeWidth={3} size={13} />
                      </span>
                    )}
                  </>
                )}
              </OptionLabel>
            );
          })}
        </div>
      )}

      {q.type === "select" && (
        <>
          <div className="w-full max-w-sm relative text-sm">
            <button
              type="button"
              className="flex items-center justify-between px-6 w-full h-14 border border-border rounded-full cursor-default bg-brand-light/10 transition-all outline-none pointer-events-none"
            >
              <span className="text-left truncate">
                {q.options.find((o) => o.id === q.answers[0])?.title || (
                  <span className="opacity-50">Tidak dijawab</span>
                )}
              </span>
              <LuChevronDown className="text-muted-darker" size={18} />
            </button>
            {isQuiz && allowSeeCorrectAnswers && (
              <div className="mt-3 p-4 bg-green-50/50 border border-green-100 rounded-[20px]">
                <div className="text-sm font-semibold text-green-600 mb-2">
                  Kunci Jawaban:
                </div>
                <div className="space-y-1">
                  {q.correctAnswers?.length ? (
                    <div className="text-sm text-green-400">
                      1.{" "}
                      {
                        q.options.find((a) => a.id === q.correctAnswers![0])
                          ?.title
                      }
                    </div>
                  ) : (
                    <div className="text-sm italic text-muted-dark">
                      Tidak ada kunci jawaban
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
