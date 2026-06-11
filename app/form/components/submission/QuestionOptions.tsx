"use client";

import { useFormSubmissionStore } from "@/stores/form-submission-store";
import { SubmissionQuestion } from "@/types/form";
import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

export default function QuestionOptions(q: SubmissionQuestion) {
  const [openSelect, setOpenSelect] = useState(false);
  const updateAnswers = useFormSubmissionStore((s) => s.updateAnswers);

  return (
    <>
      {/* RADIO & CHECKBOX */}
      {(q.type === "radio" || q.type === "checkbox") && (
        <div className="space-y-3">
          {(q.options || []).map((o) => {
            const isSelected = q.answers?.includes(o.id);

            return (
              <label
                key={o.id}
                htmlFor={o.id}
                className={`relative flex items-center gap-4 p-4 rounded-[24px] border transition-all cursor-pointer group
                  ${isSelected ? "bg-[#f2f7fd] border-[#4ca9ff]" : "bg-white border-[#e2e8f0] hover:border-[#b0c4db] hover:bg-[#f8fbff]"}
                `}
              >
                <input
                  id={o.id}
                  type={q.type}
                  className="w-5 h-5 accent-[#168bff] border-[#e2e8f0] cursor-pointer"
                  onChange={(e) => {
                    updateAnswers(q.id, o.id, e.target.checked);
                  }}
                  checked={isSelected}
                  name={q.id}
                />
                <span className="flex-1 text-[15px] text-[#0f172a] outline-none resize-none">
                  {o.title}
                </span>
              </label>
            );
          })}

          {/* Tombol Hapus Jawaban */}
          {Boolean(q.answers.length && q.type === "radio") && (
            <button
              type="button"
              className="inline-block mt-2 px-2 py-1 text-[14px] text-[#64748b] hover:text-[#168bff] font-medium transition-colors"
              onClick={() => updateAnswers(q.id, q.answers, false)}
            >
              Hapus jawaban
            </button>
          )}
        </div>
      )}

      {q.type === "select" && (
        <>
          {openSelect && (
            <div
              className="w-screen h-screen fixed inset-0 z-[100]" // Diubah ke z-[100]
              onClick={() => setOpenSelect(false)}
            ></div>
          )}
          <div
            className={`w-full max-w-sm relative text-[15px] ${openSelect ? "z-[110]" : ""}`}
          >
            {" "}
            {/* Diubah ke z-[110] */}
            <button
              type="button"
              className={`flex items-center justify-between px-6 w-full h-[58px] border rounded-full transition-all outline-none
                ${openSelect ? "bg-white border-[#168bff] shadow-[0_0_0_5px_rgba(22,139,255,0.12)]" : "bg-[#f8fbff] border-[#e2e8f0] hover:border-[#b0c4db]"}
              `}
              onClick={() => setOpenSelect(!openSelect)}
            >
              <span className="text-left text-[#0f172a] truncate">
                {q.options.filter((o) => o.id === q.answers)[0]?.title ||
                  "Pilih opsi..."}
              </span>
              <LuChevronDown className="text-[#64748b]" size={20} />
            </button>
            <div
              hidden={!openSelect || !q.options.length}
              className="absolute mt-2 left-0 w-full bg-white border border-[#e2e8f0] rounded-[24px] shadow-[0_12px_40px_rgba(15,23,42,0.12)] p-2 z-50"
            >
              <div className="max-h-64 overflow-auto">
                <div className="w-full flex flex-col gap-1">
                  {q.options?.map((o) => (
                    <button
                      type="button"
                      key={o.id}
                      className="w-full text-left px-5 py-3 rounded-4xl hover:bg-[#f2f7fd] text-[#0f172a] transition-colors outline-none"
                      onClick={() => {
                        updateAnswers(q.id, o.id);
                        setOpenSelect(false);
                      }}
                    >
                      {o.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {Boolean(q.answers.length) && (
            <button
              type="button"
              className="block mt-3 px-2 py-1 text-[14px] text-[#64748b] hover:text-[#168bff] font-medium transition-colors"
              onClick={() => updateAnswers(q.id, q.answers, false)}
            >
              Hapus jawaban
            </button>
          )}
        </>
      )}
    </>
  );
}
