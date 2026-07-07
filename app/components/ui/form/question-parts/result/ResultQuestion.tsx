import QuestionCard from "@/app/components/ui/form/QuestionCard";
import QuestionOptions from "./QuestionOptions";
import QuestionText from "./QuestionText";
import { FormSettings, SubmissionQuestion } from "@/types/form";
import QuestionGrid from "./QuestionGrid";

export default function ResultQuestion({
  q,
  settings,
  view = "responders",
}: {
  q: SubmissionQuestion;
  settings: FormSettings;
  view?: "responders" | "creator";
}) {
  if (view === "creator") {
    settings.allowSeeCorrectAnswers = true;
    settings.allowSeeScore = true;
    settings.allowSeeWrongAnswers = true;
  }
  const { isQuiz, allowSeeScore } = settings;
  return (
    <QuestionCard className="shadow-none!">
      <div className="flex justify-between items-start mb-6 gap-4 relative z-10">
        <div className="flex-1 flex flex-col gap-6">
          {q.attached?.image && (
            <img className="w-full max-w-7/10 mx-auto" src={q.attached.image} />
          )}
          <div className="leading-[1.7] outline-none resize-none">
            {q.title}
            {q.required && <span className="text-red-500 ml-1.5">*</span>}
          </div>
        </div>

        {isQuiz && allowSeeScore && q.score !== null && (
          <div className="shrink-0 px-4 py-1.5 rounded-full bg-brand-light/10 border border-border text-sm font-semibold tracking-wide text-muted-darker">
            {q.score}/{q.totalScore} Poin
          </div>
        )}
      </div>

      <div className="relative z-10">
        {q.type === "text" && <QuestionText {...{ q, settings }} />}
        {["radio", "checkbox", "select"].includes(q.type) && (
          <QuestionOptions {...{ q, settings }} />
        )}
        {["grid-radio", "grid-checkbox"].includes(q.type) && (
          <QuestionGrid {...{ q, settings }} />
        )}
      </div>
    </QuestionCard>
  );
}
