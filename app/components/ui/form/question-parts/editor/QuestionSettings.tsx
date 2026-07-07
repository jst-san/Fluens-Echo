"use client";

import { useFormEditorStore } from "@/stores/form-editor-store";
import { useState } from "react";
import {
  LuChevronRight,
  LuCircleCheck,
  LuEllipsisVertical,
  LuGripHorizontal,
  LuList,
  LuSquareCheck,
  LuText,
} from "react-icons/lu";
import { useShallow } from "zustand/react/shallow";
import InsertImage from "./question-settings/InsertImage";
import { FaGripHorizontal } from "react-icons/fa";

export default function QuestionSettings({ qId }: { qId: string }) {
  const [openSettings, setOpenSettings] = useState(false);
  const [openChild, setOpenChild] = useState<string | null>(null);

  const chToggle = (chName: string) => {
    setOpenChild((prev) => (prev === chName ? null : chName));
  };
  const closeAll = () => {
    setOpenSettings(false);
    setOpenChild(null);
  };
  const { updateQuestion, removeQuestion, changeQuestionType } =
    useFormEditorStore(
      useShallow((s) => ({
        updateQuestion: s.updateQuestion,
        removeQuestion: s.removeQuestion,
        changeQuestionType: s.changeQuestionType,
      })),
    );

  return (
    <div className="relative">
      {openSettings && (
        <div className="fixed inset-0 z-100" onClick={() => closeAll()}></div>
      )}

      {openSettings && (
        <div className="absolute top-full right-0 mt-2 min-w-50 w-max bg-foreground z-100 border border-border shadow-lg rounded-3xl p-2">
          <div className="flex flex-col gap-1 relative">
            <button
              className={`w-full px-4 h-11 flex items-center justify-between rounded-full text-sm font-medium transition-colors ${
                openChild === "type"
                  ? "bg-brand-light/10 text-brand"
                  : "text-text hover:bg-brand-light/10"
              }`}
              onClick={() => chToggle("type")}
            >
              Ubah tipe soal
              <LuChevronRight
                className={`transition-transform ${openChild === "type" ? "rotate-90" : ""}`}
              />
            </button>

            {openChild === "type" && (
              <>
                <button
                  className="px-4 h-11 flex items-center gap-3 rounded-full text-sm hover:bg-brand-light/10 transition-colors"
                  onClick={() => {
                    changeQuestionType(qId, "radio");
                    closeAll();
                  }}
                >
                  <LuCircleCheck size={18} className="text-brand" /> Pilihan
                  ganda
                </button>
                <button
                  className="px-4 h-11 flex items-center gap-3 rounded-full text-sm hover:bg-brand-light/10 transition-colors"
                  onClick={() => {
                    changeQuestionType(qId, "checkbox");
                    closeAll();
                  }}
                >
                  <LuSquareCheck size={18} className="text-brand" /> Checkbox
                </button>
                <button
                  className="px-4 h-11 flex items-center gap-3 rounded-full text-sm hover:bg-brand-light/10 transition-colors"
                  onClick={() => {
                    changeQuestionType(qId, "select");
                    closeAll();
                  }}
                >
                  <LuList size={18} className="text-brand" /> Dropdown
                </button>
                <hr className="border-muted rounded-full mx-3" />
                <button
                  className="px-4 h-11 flex items-center gap-3 rounded-full text-sm hover:bg-brand-light/10 transition-colors"
                  onClick={() => {
                    changeQuestionType(qId, "text");
                    closeAll();
                  }}
                >
                  <LuText size={18} className="text-brand" /> Isian singkat
                </button>
                <hr className="border-muted rounded-full mx-3" />
                <button
                  className="px-4 h-11 flex items-center gap-3 rounded-full text-sm hover:bg-brand-light/10 transition-colors"
                  onClick={() => {
                    changeQuestionType(qId, "grid-radio");
                    closeAll();
                  }}
                >
                  <LuGripHorizontal size={18} className="text-brand" /> Pilihan
                  ganda grid
                </button>
                <button
                  className="px-4 h-11 flex items-center gap-3 rounded-full text-sm hover:bg-brand-light/10 transition-colors"
                  onClick={() => {
                    changeQuestionType(qId, "grid-checkbox");
                    closeAll();
                  }}
                >
                  <FaGripHorizontal size={18} className="text-brand" /> Checkbox
                  grid
                </button>
                <hr className="border-muted rounded-full mx-3" />
              </>
            )}

            <button
              className={`w-full px-4 h-11 flex items-center justify-between rounded-full text-sm font-medium transition-colors ${
                openChild === "insert"
                  ? "bg-brand-light/10 text-brand"
                  : "text-text hover:bg-brand-light/10"
              }`}
              onClick={() => chToggle("insert")}
            >
              Sisipkan
              <LuChevronRight
                className={`transition-transform ${openChild === "insert" ? "rotate-90" : ""}`}
              />
            </button>

            {openChild === "insert" && (
              <>
                <InsertImage qId={qId} />
              </>
            )}

            <button
              className="w-full px-4 h-11 flex items-center justify-between rounded-full text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              onClick={() => removeQuestion(qId)}
            >
              Hapus Soal
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          openSettings ? closeAll() : setOpenSettings(true);
        }}
        className={`relative p-2 flex items-center justify-center rounded-full transition-colors ${
          openSettings
            ? "z-100 bg-muted text-brand"
            : "hover:bg-muted-light active:bg-muted"
        }`}
      >
        <LuEllipsisVertical size={18} />
      </button>
    </div>
  );
}
