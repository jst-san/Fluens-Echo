import { Question, SubmissionQuestion } from "@/types/form";
import { useMemo } from "react";
import { LuCheck } from "react-icons/lu";

export default function TextTypeChart({
  correctAnswers,
  sq,
  isQuiz,
}: {
  correctAnswers: Question["correctAnswers"];
  sq: SubmissionQuestion[] | undefined;
  isQuiz: boolean;
}) {
  const data = useMemo(() => {
    let result: { text: string; isCorrect: boolean; total: number }[] = [];

    sq?.forEach((qr) => {
      if (!Array.isArray(qr.answers) || qr.answers.length === 0) return;

      const text = qr.answers[0];
      if (!text) return;
      const idx = result.findIndex((r) => r.text === text);

      if (idx === -1) {
        result.push({
          text: text,
          isCorrect: [...correctAnswers].map((ca) => ca.toLowerCase()).includes(text.toLowerCase()),
          total: 1,
        });
      } else {
        result[idx].total++;
      }
    });

    return result;
  }, [correctAnswers, sq]);
  const max = Math.max(...data.map((d) => d.total), 1);
  return (
    <div className="space-y-6">
      {data.map((i) => (
        <div key={i.text} className="space-y-2">
          <div className="flex justify-between gap-3 text-sm">
            <div className="flex items-center">
              {isQuiz && i.isCorrect && (
                <div className="mr-2 p-1 bg-green-100 rounded-full">
                  <LuCheck className="text-green-500" size={12} />
                </div>
              )}
              {i.text}
            </div>
            <div>{i.total}</div>
          </div>

          <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-br from-brand-dark via-brand-light to-brand transition-all duration-300"
              style={{
                width: `${(i.total / max) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
      <div className="text-right text-brand">
        Total : {data.reduce((p, c) => p + c.total, 0)}
      </div>
    </div>
  );
}
