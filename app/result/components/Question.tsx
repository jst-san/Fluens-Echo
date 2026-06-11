"use client";

import QuestionOptions from "./QuestionOptions";
import QuestionText from "./QuestionText";
import { SubmissionQuestion } from "@/types/form";

export default function Question({ q }: { q: SubmissionQuestion }) {
  return (
    <div className="relative bg-white border border-[#e2e8f0] rounded-[32px] p-8 shadow-[0_12px_40px_rgba(15,23,42,0.04)] transition-all hover:shadow-[0_12px_40px_rgba(15,23,42,0.08)] group overflow-hidden">
      <div className="flex justify-between items-start mb-6 gap-4 relative z-10">
        <div className="text-[18px] leading-[1.7] font-medium text-[#0f172a] outline-none resize-none">
          {q.title}
          {q.required && <span className="text-red-500 ml-1.5">*</span>}
        </div>
        
        {q.score !== null && (
          <div className="shrink-0 px-4 py-1.5 rounded-full bg-[#f2f7fd] border border-[#e2e8f0] text-[13px] font-semibold tracking-wide text-[#64748b]">
            {Math.round(q.score)}/{q.totalScore} Poin
          </div>
        )}
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