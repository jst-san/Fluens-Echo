"use client";

import { useFormEditorStore } from "@/stores/form-editor-store";
import QuestionOptions from "./QuestionOptions";
import QuestionText from "./QuestionText";
import { Question as TQuestion } from "@/types/form";
import { useShallow } from "zustand/react/shallow";
import Textarea from "react-textarea-autosize";
import QuestionSettings from "./QuestionSettings";
import { LuPlus, LuTrash, LuTrash2, LuX } from "react-icons/lu";
import QuestionCard from "@/app/components/ui/form/QuestionCard";
import { PrimaryBtn, ToggleBtn } from "@/app/components/ui/buttons";
import { NumberInput } from "@/app/components/ui/inputs";
import QuestionGrid from "./QuestionGrid";
import PreviewQuestionText from "./PreviewQuestionText";
import PreviewQuestionOptions from "./PreviewQuestionOptions";
import PreviewQuestionGrid from "./PreviewQuestionGrid";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import QuestionSortButtons from "./QuestionSortButtons";

export default function EditorQuestion({
  qId,
  qi,
  focused,
  onFocus,
}: {
  qId: string;
  qi: number;
  focused: boolean;
  onFocus: () => void;
}) {
  const q = useFormEditorStore((s) =>
    s.form.questions.find((q) => q.id === qId),
  ) as TQuestion;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: q.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 101 : 99 - qi,
    opacity: isDragging ? 0.4 : 1,
    transition: "linear",
  };

  const { isQuiz, addQuestion, updateQuestion, changeQuestionScore } =
    useFormEditorStore(
      useShallow((s) => ({
        isQuiz: s.form.settings.isQuiz,
        addQuestion: s.addQuestion,
        updateQuestion: s.updateQuestion,
        changeQuestionScore: s.changeQuestionScore,
      })),
    );

  return (
    <QuestionCard
      className="relative"
      style={{ ...style }}
      onFocus={onFocus}
      ref={setNodeRef}
    >
      {focused ? (
        <>
          <QuestionSortButtons qi={qi} {...{ attributes, listeners }} />
          <div className="flex justify-between items-start mb-6 gap-4 relative z-80">
            <div className="flex-1 flex flex-col gap-6">
              {q.attached?.image && (
                <div className="relative w-full max-w-7/10 mx-auto group/img">
                  <img className="w-full" src={q.attached.image} />
                  <button
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 backdrop-blur-xs opacity-0 transition-opacity group-hover/img:opacity-100 group-hover/img:pointer-events-auto group-focus-within/img:opacity-100 group-focus-within/img:pointer-events-auto"
                    onClick={() => updateQuestion(q.id, {attached: {...q.attached, image: undefined }})}
                  >
                    <LuX className="text-muted-darker/70 stroke-1" size={80} />
                    <div className="text-sm text-center text-muted-darker/70">
                      Hapus gambar
                    </div>
                  </button>
                </div>
              )}
              <Textarea
                className="w-full leading-[1.7] overflow-hidden resize-none outline-none focus-within:bg-muted-light"
                defaultValue={q.title}
                onBlur={(e) =>
                  updateQuestion(q.id, {
                    title: e.target.value,
                  })
                }
              />
            </div>

            <QuestionSettings qId={q.id} />
          </div>

          <div className="relative z-70">
            {q.type === "text" && <QuestionText {...q} />}
            {["radio", "checkbox", "select"].includes(q.type) && (
              <QuestionOptions {...q} />
            )}
            {["grid-radio", "grid-checkbox"].includes(q.type) && (
              <QuestionGrid {...q} />
            )}
          </div>

          <div className="flex items-center mt-4 pt-4 border-t border-muted">
            <div className="flex-1">
              {isQuiz && (
                <div className="flex items-center gap-2">
                  <NumberInput
                    min={0}
                    onBlur={(e) => {
                      let n = Number(e.target.value);
                      if (!n || n < 0) {
                        n = 0;
                      }
                      changeQuestionScore(q.id, n);
                      e.target.value = n.toString();
                    }}
                    disabled={q.type.startsWith("grid")}
                    {...(q.type.startsWith("grid")
                      ? {
                          value: q.totalScore,
                          onChange: (e) =>
                            changeQuestionScore(q.id, Number(e.target.value)),
                        }
                      : {
                          defaultValue: q.totalScore,
                        })}
                  />
                  <div className="text-sm">Poin</div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium text-muted-darker">
                Wajib diisi
              </div>
              <ToggleBtn
                active={q.required}
                onClick={() => updateQuestion(q.id, { required: !q.required })}
              />
            </div>
          </div>

          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 z-60 opacity-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 translate-y-2 transition-all duration-300 pointer-events-none group-focus-within:pointer-events-auto">
            <PrimaryBtn
              className="h-12! w-12! p-0! flex items-center justify-center text-foreground shadow-lg"
              onClick={() => addQuestion(qi + 1)}
            >
              <LuPlus size={24} strokeWidth={2.5} />
            </PrimaryBtn>
          </div>
        </>
      ) : (
        <>
          <div className="flex mb-6 gap-4 relative z-10">
            <div className="flex-1 flex flex-col gap-6">
              {q.attached?.image && (
                <img
                  className="w-full max-w-7/10 mx-auto"
                  src={q.attached.image}
                />
              )}
              <div className="leading-[1.7] outline-none resize-none whitespace-pre-wrap">
                {q.title}
                {q.required && <span className="text-red-500 ml-1.5">*</span>}
              </div>
            </div>
          </div>

          <div className="relative z-10">
            {q.type === "text" && <PreviewQuestionText {...q} />}
            {["radio", "checkbox", "select"].includes(q.type) && (
              <PreviewQuestionOptions {...q} />
            )}
            {["grid-radio", "grid-checkbox"].includes(q.type) && (
              <PreviewQuestionGrid {...q} />
            )}
          </div>
        </>
      )}
    </QuestionCard>
  );
}
