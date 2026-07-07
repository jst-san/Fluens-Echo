import { Question, SubmissionQuestion } from "@/types/form";
import { useEffect, useMemo, useRef, useState, useContext } from "react";
import { useFormEditorStore } from "@/stores/form-editor-store";
import { useShallow } from "zustand/react/shallow";
import { LuCheck } from "react-icons/lu";
import OptionsTypeChart from "./charts/OptionsTypeChart";
import GridTypeChart from "./charts/GridTypeChart";
import TextTypeChart from "./charts/TextTypeChart";
import { ResponsesContext } from "../../ResponsesSection";
import QuestionItem from "./SummaryQuestions";

export default function SummaryQuestions() {
  const questions = useFormEditorStore((s) => s.form.questions);
  const questionIds = questions.map((q) => q.id);
  const responses = useContext(ResponsesContext);

  return questionIds.map((qId) => {
    const sq = responses
      ?.map((r) => r.data.submissionQuestions.find((sq) => sq.id === qId))
      .filter((sq) => sq !== undefined);
    const { question, isQuiz } = useFormEditorStore(
      useShallow((s) => ({
        question: s.form.questions.find((q) => q.id === qId),
        isQuiz: s.form.settings.isQuiz,
      })),
    );
    if (!question) return;
    const titleRef = useRef<HTMLDivElement>(null);

    const [expanded, setExpanded] = useState(false);
    const [isClamped, setIsClamped] = useState(false);

    useEffect(() => {
      if (!titleRef.current) return;

      const check = () => {
        setIsClamped(
          titleRef.current!.scrollHeight > titleRef.current!.clientHeight,
        );
      };

      check();
    }, [question.title]);

    return (
      <div
        key={question.id}
        className="bg-foreground border border-border p-8 space-y-6 rounded-3xl"
      >
        <div>
          <div className={`${expanded ? "" : "line-clamp-3"}`} ref={titleRef}>
            {question.title}
          </div>
          {isClamped && (
            <button
              className="text-brand"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Lebih sedikit" : "Lebih banyak"}
            </button>
          )}
        </div>

        <>
          {["radio", "checkbox", "select"].includes(question.type) && (
            <OptionsTypeChart
              options={question.options}
              correctAnswers={question.correctAnswers}
              sq={sq}
              isQuiz={isQuiz}
            />
          )}
          {question.type === "text" && (
            <TextTypeChart
              correctAnswers={question.correctAnswers}
              sq={sq}
              isQuiz={isQuiz}
            />
          )}
          {["grid-radio", "grid-checkbox"].includes(question.type) && (
            <GridTypeChart
              rows={question.grid.rows}
              cols={question.grid.columns}
              correctAnswers={question.correctAnswers}
              sq={sq}
              isQuiz={isQuiz}
            />
          )}
        </>
      </div>
    );
  });
}
