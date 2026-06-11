"use client";

import { useFormEditorStore } from "@/stores/form-editor-store";
import { useFormSubmissionStore } from "@/stores/form-submission-store";
import { Question, SubmissionQuestion } from "@/types/form";
import { useState } from "react";
import {
  LuCheck,
  LuChevronDown,
  LuEllipsisVertical,
  LuPlus,
  LuTrash2,
  LuX,
} from "react-icons/lu";
import Textarea from "react-textarea-autosize";
import { useShallow } from "zustand/react/shallow";

export default function QuestionOptions(q: Question) {
  const [openSelect, setOpenSelect] = useState(false);
  const [openOption, setOpenOption] = useState<string | null>(null);
  const [openScoreModal, setOpenScoreModal] = useState<string | null>(null);

  const opToggle = (key: string) => {
    setOpenOption((prev) => (prev === key ? null : key));
  };

  const {
    updateQuestionOptionTitle,
    removeQuestionOption,
    addQuestionOption,
    setAsCorrect,
    // updateQuestionOption,
  } = useFormEditorStore(
    useShallow((s) => ({
      updateQuestionOptionTitle: s.updateQuestionOptionTitle,
      removeQuestionOption: s.removeQuestionOption,
      addQuestionOption: s.addQuestionOption,
      setAsCorrect: s.setAsCorrect,
      // updateQuestionOption: s.updateQuestionOption,
    })),
  );

  return (
    <>
      {(q.type === "radio" || q.type === "checkbox") && (
        <div className="space-y-3">
          {(q.options || []).map((o, oi) => {
            const isCorrect = q.correctAnswers?.includes(o.id);

            return (
              <label
                key={o.id}
                htmlFor={o.id}
                className={`relative flex items-center gap-4 p-4 rounded-[24px] border border-[#e2e8f0] bg-white transition-all 
                  ${isCorrect ? "border-[#168bff]! bg-blue-50/50!" : ""}
                `}
              >
                <input
                  id={o.id}
                  type={q.type}
                  className="w-5 h-5 accent-[#168bff] border-[#e2e8f0] pointer-events-none"
                  checked={isCorrect}
                  name={q.id}
                  readOnly
                />

                <Textarea
                  className="flex-1 text-[15px] outline-none resize-none text-[#0f172a]"
                  defaultValue={o.title}
                  onBlur={(e) =>
                    updateQuestionOptionTitle(q.id, o.id, e.target.value)
                  }
                  placeholder={`Opsi ${oi + 1}`}
                />

                <div className="relative mt-1 mr-1 flex items-center">
                  <button
                    className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${openOption === o.id ? "bg-[#f2f7fd] text-[#168bff]" : "text-[#64748b] hover:bg-[#e2e8f0]"}`}
                    onClick={() => opToggle(o.id)}
                  >
                    <LuEllipsisVertical size={18} />
                  </button>

                  {openOption === o.id && (
                    <>
                      <div
                        className="fixed inset-0 z-90"
                        onClick={() => setOpenOption(null)}
                      ></div>
                      <div className="absolute top-full right-0 mt-2 min-w-[200px] bg-white z-[100] border border-[#e2e8f0] shadow-[0_12px_40px_rgba(15,23,42,0.12)] rounded-[24px] p-2 flex flex-col gap-1">
                        <button
                          className="min-w-max px-4 h-11 text-left rounded-full text-[14px] font-medium text-[#0f172a] hover:bg-[#f2f7fd] transition-colors"
                          onClick={() => {
                            setAsCorrect(
                              q.id,
                              o.id,
                              !q.correctAnswers.includes(o.id),
                            );
                            setOpenOption(null);
                          }}
                        >
                          {q.correctAnswers?.includes(o.id)
                            ? "Hapus Kunci Jawaban"
                            : "Jadikan Kunci Jawaban"}
                        </button>
                        <button
                          className="min-w-max px-4 h-11 text-left rounded-full text-[14px] font-medium text-[#0f172a] hover:bg-[#f2f7fd] transition-colors"
                          onClick={() => {
                            setOpenScoreModal(o.id);
                            setOpenOption(null);
                          }}
                        >
                          Atur Poin
                        </button>
                        <button
                          className="min-w-max px-4 h-11 text-left rounded-full text-[14px] font-medium text-red-500 hover:bg-red-50 transition-colors"
                          onClick={() => {
                            setAsCorrect(q.id, o.id, false);
                            removeQuestionOption(q.id, o.id);
                            setOpenOption(null);
                          }}
                        >
                          Hapus Opsi
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </label>
            );
          })}

          <button
            onClick={() => addQuestionOption(q.id)}
            className="flex items-center gap-2 mt-2 px-4 py-2 text-[14px] font-semibold text-[#168bff] hover:text-[#005ed9] hover:bg-[#f2f7fd] rounded-full transition-colors"
          >
            <LuPlus size={18} /> Tambah Opsi
          </button>
        </div>
      )}

      {q.type === "select" && (
        <>
          <div className="w-full max-w-sm relative text-[15px]">
            <button
              type="button"
              className="flex items-center justify-between px-6 w-full h-[58px] border border-[#e2e8f0] rounded-full cursor-default bg-[#f8fbff] transition-all outline-none pointer-events-none"
              onClick={() => setOpenSelect(!openSelect)}
            >
              <span className="text-left text-[#0f172a] truncate">
                Pratinjau dropdown
              </span>
              <LuChevronDown className="text-[#64748b]" size={20} />
            </button>

            <div className="mt-2 left-0 w-full bg-white border border-[#e2e8f0] rounded-[24px] shadow-[0_12px_40px_rgba(15,23,42,0.12)] p-2 z-50">
              <div className="max-h-64 overflow-auto">
                <div className="w-full flex flex-col gap-1">
                  {q.options?.map((o, oi) => (
                    <label
                      key={o.id}
                      className="w-full flex items-center gap-2 px-5 py-3 rounded-4xl hover:bg-[#f2f7fd] focus-within:bg-[#f2f7fd] text-[#0f172a] transition-colors outline-none"
                    >
                      <Textarea
                        className="flex-1 text-[15px] outline-none resize-none text-[#0f172a]"
                        defaultValue={o.title}
                        onBlur={(e) =>
                          updateQuestionOptionTitle(q.id, o.id, e.target.value)
                        }
                        placeholder={`Opsi ${oi + 1}`}
                      />
                      <button
                        className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                        onClick={() => removeQuestionOption(q.id, o.id)}
                      >
                        <LuTrash2 size={16} />
                      </button>
                    </label>
                  ))}

                  <button
                    onClick={() => addQuestionOption(q.id)}
                    className="flex items-center gap-2 mt-2 px-4 py-2 text-[14px] font-semibold text-[#168bff] hover:text-[#005ed9] hover:bg-[#f2f7fd] rounded-full transition-colors"
                  >
                    <LuPlus size={18} /> Tambah Opsi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}