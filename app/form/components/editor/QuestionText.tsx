"use client";

import { useFormEditorStore } from "@/stores/form-editor-store";
import { Question } from "@/types/form";
import { useState } from "react";
import { LuEllipsisVertical } from "react-icons/lu";
import Textarea from "react-textarea-autosize";
import { useShallow } from "zustand/react/shallow";

export default function QuestionText(q: Question) {
  const [openSettings, setOpenSettings] = useState(false);
  const { updateQuestion } = useFormEditorStore(
    useShallow((s) => ({
      updateQuestion: s.updateQuestion,
    })),
  );

  const [enablecorrectAnswers, setEnablecorrectAnswers] = useState(
    Boolean(q.correctAnswers?.length),
  );

  return (
    <div className="relative">
      <div className="absolute top-2 right-2">
        {openSettings && (
          <div
            className="fixed inset-0 z-90"
            onClick={() => setOpenSettings(false)}
          ></div>
        )}
        <button
          type="button"
          className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${openSettings ? "bg-[#f2f7fd] text-[#168bff]" : "text-[#64748b] hover:bg-[#e2e8f0]"}`}
          onClick={() => setOpenSettings(true)}
        >
          <LuEllipsisVertical size={18} />
        </button>

        {openSettings && (
          <div className="absolute top-full right-0 mt-2 min-w-[220px] w-max bg-white z-[100] border border-[#e2e8f0] shadow-[0_12px_40px_rgba(15,23,42,0.12)] rounded-[24px] p-2">
            {enablecorrectAnswers ? (
              <button
                className="w-full px-4 h-11 text-left rounded-full text-[14px] font-medium text-red-500 hover:bg-red-50 transition-colors"
                onClick={() => {
                  setEnablecorrectAnswers(false);
                  setOpenSettings(false);
                  updateQuestion(q.id, { correctAnswers: [] });
                }}
              >
                Hapus kunci jawaban
              </button>
            ) : (
              <button
                className="w-full px-4 h-11 text-left rounded-full text-[14px] font-medium text-[#0f172a] hover:bg-[#f2f7fd] transition-colors"
                onClick={() => {
                  setEnablecorrectAnswers(true);
                  setOpenSettings(false);
                }}
              >
                Tambahkan kunci jawaban
              </button>
            )}
          </div>
        )}
      </div>

      <Textarea
        className="w-full min-h-[120px] p-5 border border-[#e2e8f0] rounded-[24px] outline-none resize-none text-[15px] text-[#0f172a] bg-[#f8fbff] transition-all focus:bg-white focus:border-[#168bff] focus:shadow-[0_0_0_5px_rgba(22,139,255,0.12)]"
        placeholder="Teks jawaban akan muncul di sini..."
        disabled
      />

      {enablecorrectAnswers && (
        <div className="mt-3 p-4 bg-green-50/50 border border-green-100 rounded-[20px]">
          <div className="text-[13px] font-semibold text-green-600 mb-2">
            Kunci Jawaban Tepat (Pisahkan dengan titik koma):
          </div>
          <Textarea
            defaultValue={q.correctAnswers?.toString().replaceAll(",", "; ")}
            placeholder="contoh: jakarta; dki jakarta; kota jakarta"
            className="w-full p-3 bg-white border border-green-200 focus:border-green-400 focus:shadow-[0_0_0_4px_rgba(74,222,128,0.1)] rounded-xl outline-none text-[14px] text-[#0f172a] resize-none transition-all"
            onBlur={(e) => {
              updateQuestion(q.id, {
                correctAnswers: e.target.value.split(";").map((v) => v.trim()),
              });
              e.target.value = q.correctAnswers?.toString().replaceAll(",", "; ")
            }}
          />
        </div>
      )}
    </div>
  );
}
