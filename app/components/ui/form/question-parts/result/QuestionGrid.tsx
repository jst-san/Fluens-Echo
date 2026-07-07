import { CheckInput } from "@/app/components/ui/inputs";
import { FormSettings, SubmissionQuestion } from "@/types/form";
import { LuCheck } from "react-icons/lu";

export default function QuestionGrid({
  q,
  settings,
}: {
  q: SubmissionQuestion;
  settings: FormSettings;
}) {
  const { isQuiz, allowSeeCorrectAnswers, allowSeeWrongAnswers } = settings;
  const { rows, columns } = q.grid;

  return (
    <div className="">
      <div className="w-full overflow-x-auto border border-border rounded-lg">
        <table className="text-left table-fixed divide-y divide-border">
          <thead className="">
            <tr className="divide-x divide-border">
              <th className="sticky left-0 z-20 w-full min-w-48 sm:min-w-64 bg-foreground"></th>
              {columns.map((c) => (
                <th
                  key={c.id}
                  className="p-3 min-w-16 text-center font-normal focus-within:bg-muted-light"
                >
                  <span className="w-max line-clamp-1">{c.title}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border bg-foreground">
            {rows.map((r) => {
              const rowCorrectAnswers = q.correctAnswers?.filter(
                (ca) => ca[0] === r.id,
              );
              let isRowCorrect: boolean | undefined = undefined;
              return (
                <tr key={r.id} className="divide-x divide-border">
                  <td className="sticky left-0 z-10 max-w-1/2 bg-foreground focus-within:bg-muted-light">
                    <div className="min-h-12 p-3 flex items-center">
                      <span className="inline">
                        {isQuiz && allowSeeCorrectAnswers && isRowCorrect && (
                          <LuCheck
                            className="text-green-600 mr-2 mb-0.5 p-1 bg-green-100 rounded-full inline"
                            size={16}
                          />
                        )}
                        {r.title}
                      </span>
                    </div>
                  </td>

                  {columns.map((c, idx) => {
                    const isSelected = Boolean(
                      q.answers?.find((a) => a[0] === r.id && a[1] === c.id),
                    );
                    const isCorrect = Boolean(
                      rowCorrectAnswers?.find((ca) => ca[1] === c.id),
                    );
                    const isWrong =
                      rowCorrectAnswers?.length && !isCorrect && isSelected;
                    if (isWrong) isRowCorrect = false;
                    if (
                      rowCorrectAnswers?.length &&
                      isRowCorrect === undefined &&
                      idx === columns.length - 1
                    ) {
                      isRowCorrect = true;
                    }
                    return (
                      <td
                        key={c.id}
                        className={`text-center align-middle bg-foreground 
                        ${isSelected && "bg-brand-light/10"} 
                        ${isQuiz && allowSeeWrongAnswers && isWrong && "bg-red-50/50!"} 
                        ${isQuiz && allowSeeCorrectAnswers && isCorrect && isSelected && "bg-green-50/50!"}`}
                      >
                        <CheckInput
                          className={`my-auto ${allowSeeCorrectAnswers && isCorrect && !isSelected && "accent-green-600 opacity-50"}`}
                          type={
                            q.type.replaceAll("grid-", "") as
                              | "radio"
                              | "checkbox"
                          }
                          checked={
                            Boolean(
                              q.answers.find(
                                ([rowId, colId]) =>
                                  rowId === r.id && colId === c.id,
                              ),
                            ) || isCorrect
                          }
                          readOnly
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
