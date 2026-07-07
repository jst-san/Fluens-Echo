"use client";

import EditorQuestion from "@/app/components/ui/form/question-parts/editor/EditorQuestion";
import { useFormEditorStore } from "@/stores/form-editor-store";
import { useShallow } from "zustand/react/shallow";
import { LuPlus } from "react-icons/lu";
import Textarea from "react-textarea-autosize";
import { useContext, useEffect, useRef, useState } from "react";
import { TabContext } from "../page";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PrimaryBtn } from "@/app/components/ui/buttons";

export default function ContentSection() {
  const { activeTab } = useContext(TabContext);
  const {
    title,
    description,
    questions,
    isQuiz,
    updateForm,
    addQuestion,
    moveQuestion,
  } = useFormEditorStore(
    useShallow((s) => ({
      title: s.form.title,
      description: s.form.description,
      questions: s.form.questions,
      isQuiz: s.form.settings.isQuiz,
      updateForm: s.updateForm,
      addQuestion: s.addQuestion,
      moveQuestion: s.moveQuestion,
    })),
  );

  const questionIds = questions.map((q) => q.id);

  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (titleRef) titleRef.current!.value = title;
    if (descriptionRef) descriptionRef.current!.value = description;
  }, [title, description]);

  const [focused, setFocused] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  return (
    <div className={`${activeTab !== "content" && "hidden"} pb-24`}>
      <div className="md:px-8">
        <div className="max-w-3xl mx-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e: DragEndEvent) => {
              const { active, over } = e;

              if (over && active.id !== over.id) {
                moveQuestion(active.id, over.id);
              }
            }}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={questionIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3 sm:space-y-6" spellCheck={false}>
                <div
                  className="relative bg-foreground rounded-4xl p-10 border border-border focus-within:shadow-lg transition-all z-100 group"
                  onFocus={() => setFocused("header")}
                  tabIndex={1}
                >
                  <div className="absolute inset-0 rounded-4xl overflow-hidden">

                  <div className="absolute -top-30 -right-30 w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(22,139,255,0.15),transparent)]"></div>
                  </div>

                  <div className="relative">
                    <Textarea
                      ref={titleRef}
                      className="w-full text-3xl md:text-4xl font-bold tracking-tight mb-4 outline-none resize-none"
                      minRows={1}
                      defaultValue={title}
                      onBlur={(e) => {
                        let v = e.target.value.trim();
                        if (!v) v = "Formulir Tanpa Judul";
                        updateForm({
                          title: v,
                        });
                        e.target.value = v;
                      }}
                    />
                    <Textarea
                      ref={descriptionRef}
                      className="w-full text-lg text-muted-darker leading-[1.8] overflow-hidden outline-none resize-none"
                      defaultValue={description}
                      onBlur={(e) =>
                        updateForm({ description: e.target.value })
                      }
                      placeholder="Deskripsi singkat (opsional)"
                      minRows={1}
                    />
                  </div>

                  <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 z-60 opacity-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 translate-y-2 transition-all duration-300 pointer-events-none group-focus-within:pointer-events-auto">
                    <PrimaryBtn
                      className="h-12! w-12! p-0! flex items-center justify-center text-foreground shadow-lg"
                      onClick={() => addQuestion(0)}
                    >
                      <LuPlus size={24} strokeWidth={2.5} />
                    </PrimaryBtn>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-6">
                  {questionIds.length ? (
                    questionIds.map((qId, qi) => (
                      <EditorQuestion
                        key={qId}
                        qId={qId}
                        qi={qi}
                        focused={focused === qId}
                        onFocus={() => setFocused(qId)}
                      />
                    ))
                  ) : (
                    <div className="justify-self-center z-100 transition-all duration-300">
                      <button
                        type="button"
                        className="h-12 w-12 flex items-center justify-center bg-linear-to-br from-brand-light via-brand to-brand-dark text-foreground rounded-full hover:-translate-y-1  shadow-xl transition-all"
                        onClick={() => addQuestion()}
                      >
                        <LuPlus size={24} strokeWidth={2.5} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
