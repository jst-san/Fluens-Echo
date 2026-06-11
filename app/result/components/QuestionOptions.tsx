"use client";

import { useFormSubmissionStore } from "@/stores/form-submission-store";
import { SubmissionQuestion } from "@/types/form";
import { useState } from "react";
import { LuCheck, LuChevronDown, LuX } from "react-icons/lu";

export default function QuestionOptions(q: SubmissionQuestion) {
  const [openSelect, setOpenSelect] = useState(false);
  const updateAnswers = useFormSubmissionStore((s) => s.updateAnswers);

  return (
    <>
      {(q.type === "radio" || q.type === "checkbox") && (
        <div className="space-y-3">
          {(q.options || []).map((o, oi) => {
            const isSelected = q.answers?.includes(o.id);
            const isCorrect = q.correctAnswers?.includes(o.id);
            const isWrong = !isCorrect && isSelected;

            return (
              <label 
                key={o.id} 
                htmlFor={o.id}
                className={`relative flex items-center gap-4 p-4 rounded-[24px] border border-[#e2e8f0] bg-white transition-all 
                  ${isSelected ? "bg-[#f2f7fd] border-[#4ca9ff]" : "hover:border-[#b0c4db]"} 
                  ${isWrong ? "border-red-200! bg-red-50/50!" : ""} 
                  ${isCorrect && isSelected ? "border-green-200 bg-green-50/50!" : ""}
                `}
              >
                <input
                  id={o.id}
                  type={q.type}
                  className="w-5 h-5 accent-[#168bff] border-[#e2e8f0] pointer-events-none"
                  checked={isSelected}
                  name={q.id}
                  readOnly
                />

                <span className="flex-1 text-[15px] outline-none resize-none text-[#0f172a]">
                  {o.title}
                </span>

                {isWrong && (
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
                    <LuX strokeWidth={3} size={14} />
                  </span>
                )}
                {isCorrect && (
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                    <LuCheck strokeWidth={3} size={14} />
                  </span>
                )}
              </label>
            );
          })}
        </div>
      )}

      {q.type === "select" && (
        <>
          {openSelect && (
            <div
              className="w-screen h-screen fixed inset-0 z-40"
              onClick={() => setOpenSelect(false)}
            ></div>
          )}
          <div className={`w-full max-w-sm relative text-[15px] ${openSelect ? "z-50" : ""}`}>
            <button
              type="button"
              className={`flex items-center justify-between px-6 w-full h-[58px] border border-[#e2e8f0] rounded-full cursor-default bg-[#f8fbff] transition-all outline-none
                ${openSelect ? "bg-white border-[#168bff] shadow-[0_0_0_5px_rgba(22,139,255,0.12)]" : ""}
              `}
            >
              <span className="text-left text-[#0f172a] truncate">
                {q.options.filter((o) => o.id === q.answers)[0]?.title || <span className="opacity-50">Tidak dijawab</span>}
              </span>
              <LuChevronDown className="text-[#64748b]" size={20} />
            </button>
          </div>
        </>
      )}
    </>
  );
}