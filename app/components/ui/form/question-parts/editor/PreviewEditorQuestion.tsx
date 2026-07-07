import { Question } from "@/types/form";
import QuestionCard from "../../QuestionCard";
import PreviewQuestionText from "./PreviewQuestionText";
import PreviewQuestionOptions from "./PreviewQuestionOptions";
import PreviewQuestionGrid from "./PreviewQuestionGrid";

export default function PreviewEditorQuestion({ q }: { q: Question }) {
  return (
    <QuestionCard>
      <div className="flex mb-6 gap-4 relative z-10">
        <div className="flex-1 flex flex-col gap-6">
          {q.attached?.image && (
            <img className="w-full max-w-7/10 mx-auto" src={q.attached.image} />
          )}
          <div className="leading-[1.7] outline-none resize-none whitespace-pre-wrap">
            {q.title}
            {q.required && <span className="text-red-500 ml-1.5">*</span>}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {q.type === "text" && <PreviewQuestionText {...q} />}
        {["radio", "checkbox", "select"].includes(q.type) && (
          <PreviewQuestionOptions {...q} />
        )}
        {["grid-radio", "grid-checkbox"].includes(q.type) && (
          <PreviewQuestionGrid {...q} />
        )}
      </div>
    </QuestionCard>
  );
}
