"use client";

import { useFormEditorStore } from "@/stores/form-editor-store";
import QuestionOptions from "./QuestionOptions";
import QuestionText from "./QuestionText";
import { Question as TQuestion } from "@/types/form";
import { useShallow } from "zustand/react/shallow";
import Textarea from "react-textarea-autosize";
import QuestionSettings from "./QuestionSettings";
import { LuPlus } from "react-icons/lu";

export default function Question({ qId, qi }: { qId: string; qi: number }) {
  const q = useFormEditorStore((s) =>
    s.form.questions.find((q) => q.id === qId),
  ) as TQuestion;

  const { addQuestion, updateQuestion } = useFormEditorStore(
    useShallow((s) => ({
      addQuestion: s.addQuestion,
      updateQuestion: s.updateQuestion,
    })),
  );
  return (
    <div
      className="relative bg-white border border-[#e2e8f0] rounded-[32px] p-8 shadow-[0_12px_40px_rgba(15,23,42,0.04)] transition-all hover:shadow-[0_12px_40px_rgba(15,23,42,0.08)] group focus-within:z-50"
      tabIndex={1}
    >
      <div className="flex justify-between items-start mb-6 gap-4 relative z-80">
        <Textarea
          className="flex-1 text-[18px] leading-[1.7] font-medium text-[#0f172a] outline-none resize-none"
          defaultValue={q.title}
          onBlur={(e) =>
            updateQuestion(q.id, {
              title: !q.title.trim() ? "Pertanyaan baru" : e.target.value,
            })
          }
        />

        {q.totalScore !== null && (
          <div className="shrink-0 px-4 py-1.5 rounded-full bg-[#f2f7fd] border border-[#e2e8f0] text-[13px] font-semibold tracking-wide text-[#64748b]">
            {Math.round(q.totalScore)} Poin
          </div>
        )}
        <QuestionSettings qId={q.id} />
      </div>

      <div className="relative z-70">
        {q.type === "text" ? (
          <QuestionText {...q} />
        ) : (
          <QuestionOptions {...q} />
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f2f7fd]">
          <div className="text-[14px] font-medium text-[#64748b]">Wajib diisi</div>
          <button
            className={`relative inline-flex h-[28px] w-[52px] items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#168bff] focus:ring-offset-2 ${
              q.required ? "bg-[#168bff]" : "bg-[#e2e8f0]"
            }`}
            onClick={() => updateQuestion(q.id, { required: !q.required })}
          >
            <span
              className={`inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                q.required ? "translate-x-[28px]" : "translate-x-[4px]"
              }`}
            />
          </button>
        </div>

      <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 z-60 opacity-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 translate-y-2 transition-all duration-300 pointer-events-none group-focus-within:pointer-events-auto">
        <button
          type="button"
          className="h-12 w-12 flex items-center justify-center bg-[linear-gradient(135deg,#48a7ff,#168bff,#005ed9)] text-white rounded-full hover:-translate-y-1 shadow-[0_12px_30px_rgba(22,139,255,0.3)] transition-all"
          onClick={() => addQuestion(qi + 1)}
        >
          <LuPlus size={24} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
