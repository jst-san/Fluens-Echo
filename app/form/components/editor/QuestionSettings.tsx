"use client";

import { useFormEditorStore } from "@/stores/form-editor-store";
import { useState } from "react";
import {
  LuChevronRight,
  LuCircleCheck,
  LuEllipsisVertical,
  LuList,
  LuSquareCheck,
  LuText,
} from "react-icons/lu";
import { useShallow } from "zustand/react/shallow";

export default function QuestionSettings({ qId }: { qId: string }) {
  const [openOptions, setOpenOptions] = useState(false);
  const [openChild, setOpenChild] = useState<string | null>(null);
  
  const chToggle = (chName: string) => {
    setOpenChild((prev) => (prev === chName ? null : chName));
  };
  const closeAll = () => {
    setOpenOptions(false);
    setOpenChild(null);
  };
  const { updateQuestion, removeQuestion, changeQuestionType } = useFormEditorStore(
    useShallow((s) => ({
      updateQuestion: s.updateQuestion,
      removeQuestion: s.removeQuestion,
      changeQuestionType: s.changeQuestionType,
    })),
  );

  return (
    <div className="relative">
      {openOptions && (
        <div
          className="fixed inset-0 z-90"
          onClick={() => closeAll()}
        ></div>
      )}
      
      <button
        onClick={() => {
          openOptions ? closeAll() : setOpenOptions(true);
        }}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
          openOptions ? "bg-[#f2f7fd] text-[#168bff]" : "text-[#64748b] hover:bg-[#f8fbff] hover:text-[#0f172a]"
        }`}
      >
        <LuEllipsisVertical size={20} />
      </button>


      {openOptions && (
        <div className="absolute top-full right-0 mt-2 min-w-[200px] w-max bg-white z-[100] border border-[#e2e8f0] shadow-[0_12px_40px_rgba(15,23,42,0.12)] rounded-[24px] p-2">
          <div className="flex flex-col gap-1 relative">
            <button
              className={`w-full px-4 h-11 flex items-center justify-between rounded-full text-[14px] font-medium transition-colors ${
                openChild === "type" ? "bg-[#f2f7fd] text-[#168bff]" : "text-[#0f172a] hover:bg-[#f8fbff]"
              }`}
              onClick={() => chToggle("type")}
            >
              Ubah tipe soal
              <LuChevronRight className={`transition-transform ${openChild === "type" ? "rotate-90" : ""}`} />
            </button>
            {openChild === "type" && <><button
                  className="px-4 h-11 flex items-center gap-3 rounded-full text-[14px] text-[#0f172a] hover:bg-[#f2f7fd] transition-colors"
                  onClick={() => { changeQuestionType(qId, "radio"); closeAll(); }}
                >
                  <LuCircleCheck size={18} className="text-[#168bff]" /> Pilihan ganda
                </button>
                <button
                  className="px-4 h-11 flex items-center gap-3 rounded-full text-[14px] text-[#0f172a] hover:bg-[#f2f7fd] transition-colors"
                  onClick={() => { changeQuestionType(qId, "text"); closeAll(); }}
                >
                  <LuText size={18} className="text-[#168bff]" /> Isian singkat
                </button>
                <button
                  className="px-4 h-11 flex items-center gap-3 rounded-full text-[14px] text-[#0f172a] hover:bg-[#f2f7fd] transition-colors"
                  onClick={() => { changeQuestionType(qId, "checkbox"); closeAll(); }}
                >
                  <LuSquareCheck size={18} className="text-[#168bff]" /> Kotak centang
                </button>
                <button
                  className="px-4 h-11 flex items-center gap-3 rounded-full text-[14px] text-[#0f172a] hover:bg-[#f2f7fd] transition-colors"
                  onClick={() => { changeQuestionType(qId, "select"); closeAll(); }}
                >
                  <LuList size={18} className="text-[#168bff]" /> Pilihan Dropdown
                </button></>}
            
            <button
              className="w-full px-4 h-11 flex items-center justify-between rounded-full text-[14px] font-medium text-red-500 hover:bg-red-50 transition-colors"
              onClick={() => removeQuestion(qId)}
            >
              Hapus Soal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}