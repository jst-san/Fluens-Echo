import { Question, SubmissionQuestion } from "@/types/form";
import { useMemo } from "react";
import { LuCheck } from "react-icons/lu";

export default function OptionsTypeChart({
  options,
  correctAnswers,
  sq,
  isQuiz,
}: {
  options: Question["options"];
  correctAnswers: Question["correctAnswers"];
  sq: SubmissionQuestion[] | undefined;
  isQuiz: boolean;
}) {
  const data = useMemo(() => {
    const result = options.map((o) => ({
      id: o.id,
      option: o.title,
      isCorrect: correctAnswers.includes(o.id),
      total: 0,
    }));

    sq?.forEach((qr) => {
      if (!Array.isArray(qr.answers) || qr.answers.length === 0) return;

      qr.answers.forEach((a) => {
        const opt = qr.options.find((o) => o.id === a);
        if (!opt) return;

        const idx = result.findIndex((d) => d.id === opt.id);

        if (idx !== -1) {
          result[idx].total++;
        }
      });
    });

    return result;
  }, [options, correctAnswers, sq]);
  const max = Math.max(...data.map((d) => d.total), 1);
  return (
    <div className="space-y-6">
      {data.map((i) => (
        <div key={i.id} className="space-y-2">
          <div className="flex justify-between gap-3 text-sm">
            <div className="flex items-center">
              {isQuiz && i.isCorrect && (
                <div className="mr-2 p-1 bg-green-100 rounded-full">
                  <LuCheck className="text-green-500" size={12} />
                </div>
              )}
              {i.option}
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
