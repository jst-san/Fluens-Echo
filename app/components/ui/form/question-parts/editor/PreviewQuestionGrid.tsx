"use client";

import { CheckInput} from "@/app/components/ui/inputs";
import { Question } from "@/types/form";

export default function PreviewQuestionGrid(q: Question) {
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
              {rows.map((r) => (
                <tr key={r.id} className="divide-x divide-border">
                  <td className="sticky left-0 z-10 max-w-1/2 bg-foreground focus-within:bg-muted-light">
                    <div className="min-h-12 p-3 flex items-center">
                      {r.title}
                    </div>
                  </td>

                  {columns.map((c) => (
                    <td
                      key={c.id}
                      className="text-center align-middle bg-foreground"
                    >
                      <CheckInput
                        className="my-auto"
                        name={r.id}
                        type={
                          q.type.replaceAll("grid-", "") as "radio" | "checkbox"
                        }
                        checked={Boolean(
                          q.correctAnswers.find(
                            ([rowId, colId]) =>
                              rowId === r.id && colId === c.id,
                          ),
                        )}
                        readOnly
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
}
