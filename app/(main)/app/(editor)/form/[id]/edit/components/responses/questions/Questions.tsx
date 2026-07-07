import EditorQuestion from "@/app/components/ui/form/question-parts/editor/EditorQuestion";
import { NumberInput } from "@/app/components/ui/inputs";
import { useFormEditorStore } from "@/stores/form-editor-store";
import { useContext, useEffect, useRef, useState } from "react";
import { LuChevronDown, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { ResponsesContext } from "../../ResponsesSection";
import { useShallow } from "zustand/react/shallow";
import PreviewEditorQuestion from "@/app/components/ui/form/question-parts/editor/PreviewEditorQuestion";
import TextResponses from "./responses-parts/TextResponses";
import OptionsResponses from "./responses-parts/OptionsResponses";
import GridResponses from "./responses-parts/GridResponses";

export default function Questions() {
  const { questions, isQuiz } = useFormEditorStore(
    useShallow((s) => ({
      questions: s.form.questions,
      isQuiz: s.form.settings.isQuiz,
    })),
  );

  if (!questions.length) return <></>;

  const questionIds = questions.map((q) => q.id);
  const [displayed, setDisplayed] = useState<string>(questionIds[0]);
  const [index, setIndex] = useState<number>(0);
  const [number, setNumber] = useState<number>(1);
  const [openSelect, setOpenSelect] = useState(false);

  const responses = useContext(ResponsesContext);
  const sq = responses
    ?.map((r) => r.data.submissionQuestions.find((sq) => sq.id === displayed))
    .filter((sq) => sq !== undefined);

  const changeDisplayed = (value: string) => {
    const idx = questionIds.findIndex((id) => id === value);
    if (idx === -1) {
      const fallbackIdx = questionIds.findIndex((id) => id === displayed);
      setNumber(fallbackIdx + 1);
      setIndex(fallbackIdx);
      return;
    }
    setDisplayed(value);
    setNumber(idx + 1);
    setIndex(idx);
  };

  useEffect(() => {
    setDisplayed(questionIds[0]);
    setNumber(1);
  }, [questions]);

  return (
    <>
      <div className="bg-foreground border border-border p-8 space-y-6 rounded-3xl">
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
          <>
            {openSelect && (
              <div
                className="w-screen h-screen fixed inset-0 z-100"
                onClick={() => setOpenSelect(false)}
              ></div>
            )}
            <div
              className={`w-full sm:max-w-sm relative text-sm ${openSelect ? "z-110" : ""}`}
            >
              <button
                type="button"
                className={`flex items-center justify-between px-6 w-full h-14 border rounded-full transition-all outline-none
                        ${openSelect ? "bg-foreground border-brand shadow-[0_0_0_5px_var(--brand)]/12" : "bg-brand-light/10 border-border hover:border-muted-dark"}
                      `}
                onClick={() => setOpenSelect(!openSelect)}
              >
                <span className="text-left truncate">
                  {questions.find((q) => q.id === displayed)?.title}
                </span>
                <LuChevronDown className="text-muted-darker" size={18} />
              </button>
              <div
                hidden={!openSelect || !questions.length}
                className="absolute mt-2 left-0 w-full bg-foreground border border-border rounded-3xl shadow-lg p-2 z-50"
              >
                <div className="max-h-64 overflow-auto">
                  <div className="w-full flex flex-col gap-1">
                    {questions.map((q) => (
                      <button
                        type="button"
                        key={q.id}
                        className="w-full text-left px-5 py-3 rounded-4xl hover:bg-brand-light/10 transition-colors outline-none"
                        onClick={() => {
                          changeDisplayed(q.id);
                          setOpenSelect(false);
                        }}
                      >
                        <div className="min-h-9 flex items-center">
                          <span className="line-clamp-4">{q.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
          <div className="flex gap-3 items-center">
            <button
              className="p-2 rounded-full hover:bg-muted-light active:bg-muted"
              onClick={() => changeDisplayed(questionIds[number - 2])}
              disabled={index === 0}
            >
              <LuChevronLeft size={18} />
            </button>
            <NumberInput
              value={number ?? 1}
              onChange={(e) => setNumber(Number(e.target.value))}
              onBlur={(e) =>
                changeDisplayed(questionIds[Number(e.target.value) - 1])
              }
              min={1}
              max={questionIds?.length}
            />
            <span className="ml-3">
              /<span className="ml-3">{questionIds.length}</span>
            </span>
            <button
              className="p-2 rounded-full hover:bg-muted-light active:bg-muted"
              onClick={() => changeDisplayed(questionIds[number])}
              disabled={index === questionIds.length - 1}
            >
              <LuChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <PreviewEditorQuestion q={questions[index]} />

      <div className="bg-foreground border border-border p-8 space-y-6 rounded-3xl">
        <div>Respon</div>
        <hr className="border-border rounded-full" />
        {["radio", "checkbox", "select"].includes(questions[index].type) && (
          <OptionsResponses sq={sq} isQuiz={isQuiz} />
        )}
        {["text"].includes(questions[index].type) && (
          <TextResponses sq={sq} isQuiz={isQuiz} />
        )}
        {["grid-radio", "grid-checkbox"].includes(questions[index].type) && (
          <GridResponses sq={sq} isQuiz={isQuiz} />
        )}
      </div>
    </>
  );
}
