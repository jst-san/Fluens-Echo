"use client";

import { SubmissionQuestion } from "@/types/form";
import Textarea from "react-textarea-autosize";

export default function QuestionText(q: SubmissionQuestion) {
  return (
    <div className="relative">
      <Textarea
        value={q.answers as string}
        className="w-full min-h-[120px] p-5 border border-[#e2e8f0] rounded-[24px] outline-none resize-none text-[15px] text-[#0f172a] bg-[#f8fbff] transition-all focus:bg-white focus:border-[#168bff] focus:shadow-[0_0_0_5px_rgba(22,139,255,0.12)] pointer-events-none"
        readOnly
      />
    </div>
  );
}