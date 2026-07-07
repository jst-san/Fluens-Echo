"use client";

import { useFormEditorStore } from "@/stores/form-editor-store";
import { Question } from "@/types/form";
import { useShallow } from "zustand/react/shallow";
import {PrimaryTextarea} from "@/app/components/ui/textareas";

export default function QuestionText(q: Question) {
  const { isQuiz, updateQuestion } = useFormEditorStore(
    useShallow((s) => ({
      isQuiz: s.form.settings.isQuiz,
      updateQuestion: s.updateQuestion,
    })),
  );

  return (
    <div className="relative">
      <PrimaryTextarea
        placeholder="Teks jawaban akan muncul di sini..."
        disabled
      />

      {isQuiz && (
        <div className="mt-3 p-4 bg-green-50/50 border border-green-100 rounded-[20px]">
          <div className="text-sm font-semibold text-green-600 mb-2">
            Kunci Jawaban (Pisahkan dengan titik koma):
          </div>
          <PrimaryTextarea
            defaultValue={q.correctAnswers?.toString().replaceAll(",", "; ")}
            className="bg-foreground border-green-200 focus:border-green-400 focus:shadow-[0_0_0_4px_#00ff0010] rounded-xl transition-all"
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
