import { NumberInput } from "@/app/components/ui/inputs";
import { Question, SubmissionQuestion } from "@/types/form";
import { useState } from "react";
import { LuCheck } from "react-icons/lu";

export default function GridResponses({
  sq,
  isQuiz,
}: {
  sq: SubmissionQuestion[] | undefined;
  isQuiz: boolean;
}) {
  const answers: {
    id: string;
    rows: { id: string; title: string; cols: string[]; isCorrect?: boolean }[];
  }[] = [];

  sq?.forEach((i, idx) => {
    const answer: {
      id: string;
      rows: {
        id: string;
        title: string;
        cols: string[];
        isCorrect?: boolean;
      }[];
    } = {
      id: `${i.id}_${idx}`,
      rows: [],
    };

    i.answers.forEach((a) => {
      const idx = answer.rows.findIndex((r) => r.id === a[0]);
      if (idx === -1)
        return answer.rows.push({
          id: a[0],
          title: i.grid.rows.find((r) => r.id === a[0])?.title ?? "",
          cols: [` ${i.grid.columns.find((c) => c.id === a[1])?.title}`],
        });

      answer.rows[idx].cols.push(
        ` ${i.grid.columns.find((c) => c.id === a[1])?.title}`,
      );
    });

    answer.rows.forEach((r, idx) => {
      let isCorrect = false;
      const rowCorrectAnswers = i.correctAnswers
        ?.filter((ca) => ca[0] === r.id)
        .sort();
      const rowAnswers = r.cols.sort();

      if (rowCorrectAnswers?.length && rowCorrectAnswers?.length === rowAnswers.length) {
        isCorrect = rowCorrectAnswers.every(
          (ca, idx) => ca[1] === rowAnswers[idx],
        );
      }

      answer.rows[idx].isCorrect = isCorrect;
    });

    answers.push(answer);
  });

  if (!answers?.length)
    return (
      <div className="text-center italic text-lg text-muted-dark">
        Tidak ada data
      </div>
    );

  const [showed, setShowed] = useState(
    answers?.length > 5 ? 5 : answers?.length,
  );
  return (
    <div className="space-y-6">
      {answers?.slice(0, showed).map((a, idx) => (
        <div key={a.id} className="text-sm flex">
          <span className="mr-2">{idx + 1}.</span>
          <div className="flex flex-col">
            {a.rows.map((r) => (
              <div key={r.id} className="inline">
                {isQuiz && r.isCorrect && (
                  <LuCheck
                    className="text-green-600 mr-2 mb-0.5 p-1 bg-green-100 rounded-full inline"
                    size={16}
                  />
                )}
                {r.title} : {r.cols.toString()}
              </div>
            ))}
          </div>
        </div>
      ))}
      <hr className="border-border rounded-full" />
      <div className="w-full flex justify-end">
        <div className="flex items-center">
          <NumberInput
            defaultValue={showed}
            onBlur={(e) => {
              let n = Number(e.target.value);

              if (e.target.value === "")
                n = answers.length > 5 ? 5 : answers.length;

              e.target.value = n.toString();
              setShowed(n);
            }}
            min={1}
            max={answers.length}
          />
          <span className="ml-3">
            /<span className="ml-3">{answers.length}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
