"use client";

import QuestionOptions from "./QuestionOptions";
import QuestionText from "./QuestionText";
import { SubmissionQuestion } from "@/types/form";

export default function Question({ q }: { q: SubmissionQuestion }) {
  return (
    <div className="relative bg-white border border-[#e2e8f0] rounded-[32px] p-8 shadow-[0_12px_40px_rgba(15,23,42,0.04)] transition-all hover:shadow-[0_12px_40px_rgba(15,23,42,0.08)] group focus-within:z-50 hover:z-40">
      
      <div className="flex justify-between items-start mb-6 gap-4 relative z-10">
        <div className="text-[18px] leading-[1.7] font-medium text-[#0f172a] outline-none resize-none">
          {q.title}
          {q.required && <span className="text-red-500 ml-1.5">*</span>}
        </div>
      </div>

      <div className="relative z-10">
        {q.type === "text" ? (
          <QuestionText {...q} />
        ) : (
          <QuestionOptions {...q} />
        )}
      </div>
    </div>
  );
}