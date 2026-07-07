"use client";

import QuestionCard from "@/app/components/ui/form/QuestionCard";
import QuestionOptions from "./QuestionOptions";
import QuestionText from "./QuestionText";
import { SubmissionQuestion as TSubmissionQuestion } from "@/types/form";
import QuestionGrid from "./QuestionGrid";

export default function SubmissionQuestion({ q, qi }: { q: TSubmissionQuestion, qi:number }) {
  return (
    <QuestionCard className="shadow-none!" style={{zIndex: 99-qi}}>
      <div className="flex mb-6 gap-4 relative z-10">
        <div className="flex-1 flex flex-col gap-6">
          {q.attached?.image && (
            <img className="w-full max-w-7/10 mx-auto" src={q.attached.image} />
          )}
          <div className="leading-[1.7] outline-none resize-none">
            {q.title}
            {q.required && <span className="text-red-500 ml-1.5">*</span>}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {q.type === "text" && <QuestionText {...q} />}
        {["radio", "checkbox", "select"].includes(q.type) && (
          <QuestionOptions {...q} />
        )}
        {["grid-radio", "grid-checkbox"].includes(q.type) && (
          <QuestionGrid {...q} />
        )}
      </div>
    </QuestionCard>
  );
}
