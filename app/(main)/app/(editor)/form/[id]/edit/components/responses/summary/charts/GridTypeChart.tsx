import { Question, QuestionGrid, SubmissionQuestion } from "@/types/form";
import { useMemo, useState } from "react";
import { LuCheck, LuChevronDown, LuChevronRight } from "react-icons/lu";

export default function GridTypeChart({
  rows,
  cols,
  correctAnswers,
  sq,
  isQuiz,
}: {
  rows: QuestionGrid["rows"];
  cols: QuestionGrid["columns"];
  correctAnswers: Question["correctAnswers"];
  sq: SubmissionQuestion[] | undefined;
  isQuiz: boolean;
}) {
  const [opened, setOpened] = useState<string[]>([]);
  const data = useMemo(() => {
    const result = rows.map((r) => ({
      id: r.id,
      title: r.title,
      cols: cols.map((c) => ({
        ...c,
        isCorrect: Boolean(
          correctAnswers.find((ca) => ca[0] === r.id && ca[1] === c.id),
        ),
        total: 0,
      })),
    }));

    sq?.forEach((qr) => {
      if (!Array.isArray(qr.answers) || qr.answers.length === 0) return;

      qr.answers.forEach(([rowId, colId]) => {
        const rowIdx = result.findIndex((r) => r.id === rowId);

        if (rowIdx === -1) return;

        const colIdx = result[rowIdx].cols.findIndex((c) => c.id === colId);

        if (colIdx === -1) return;

        result[rowIdx].cols[colIdx].total++;
      });
    });

    return result;
  }, [rows, cols, correctAnswers, sq]);
  const toggleOpened = (id: string) => {
    opened.includes(id)
      ? setOpened(opened.filter((o) => o !== id))
      : setOpened([...opened, id]);
  };
  return (
    <div className="">
      {data.map((i) => {
        const max = Math.max(...i.cols.map((c) => c.total), 1);
        return (
          <div key={i.id}>
            <button
              className="p-3 w-full flex justify-between items-center gap-3 text-sm text-left rounded-lg hover:bg-muted-light z-1 relative"
              onClick={() => toggleOpened(i.id)}
            >
              <div className="flex items-center">{i.title}</div>
              <div>
                <LuChevronRight
                  className={`${opened.includes(i.id) && "rotate-90"} transition-transform`}
                />
              </div>
            </button>

            <div
              className={`${opened.includes(i.id) ? "p-4 my-1 transition-[opacity,translate]" : "-translate-y-3 opacity-0 h-0 pointer-events-none"} bg-muted-light rounded-lg space-y-6 overflow-hidden`}
            >
              {i.cols.map((c) => (
                <div key={c.id} className="space-y-2">
                  <div className="flex justify-between gap-3 text-sm">
                    <div className="flex items-center">
                      {isQuiz && c.isCorrect && (
                        <LuCheck
                          className="text-green-600 mr-2 mb-0.5 p-1 bg-green-100 rounded-full inline"
                          size={16}
                        />
                      )}
                      {c.title}
                    </div>
                    <div>{c.total}</div>
                  </div>

                  <div className="h-3 w-full rounded-full bg-muted-dark overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-br from-brand-dark via-brand-light to-brand transition-all duration-300"
                      style={{
                        width: `${(c.total / max) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="text-right text-brand">
                Total : {i.cols.reduce((p, c) => p + c.total, 0)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
