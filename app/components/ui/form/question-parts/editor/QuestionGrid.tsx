"use client";

import { CheckInput } from "@/app/components/ui/inputs";
import { useFormEditorStore } from "@/stores/form-editor-store";
import { Question } from "@/types/form";
import { useState } from "react";
import { LuArrowLeftRight, LuPlus, LuX } from "react-icons/lu";
import Textarea from "react-textarea-autosize";
import { useShallow } from "zustand/react/shallow";

export default function QuestionGrid(q: Question) {
  const [view, setView] = useState<"table" | "list">("list");
  const { rows, columns } = q.grid;
  const {
    isQuiz,
    addCol,
    addRow,
    editRow,
    editCol,
    linkAnswer,
    deleteRow,
    deleteCol,
  } = useFormEditorStore(
    useShallow((s) => ({
      isQuiz: s.form.settings.isQuiz,
      addRow: s.addRow,
      addCol: s.addCol,
      editRow: s.editRow,
      editCol: s.editCol,
      linkAnswer: s.linkAnswer,
      deleteRow: s.deleteRow,
      deleteCol: s.deleteCol,
    })),
  );

  return (
    <div className="">
      {view === "list" && (
        <div className="w-full grid grid-cols-2 gap-6">
          <div className="">
            {rows.map((r) => (
              <div
                className="flex p-3 relative border-b border-border"
                key={r.id}
              >
                <Textarea
                  className="w-full pr-8 resize-none outline-none overflow-hidden focus-within:bg-muted-light"
                  defaultValue={r.title}
                  onBlur={(e) => editRow(q.id, r.id, { title: e.target.value })}
                />
                <button
                  className="absolute right-1.5 top-1.5 w-9 h-9 flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                  onClick={() => deleteRow(q.id, r.id)}
                >
                  <LuX size={18} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addRow(q.id)}
              className="flex items-center gap-2 mt-2 px-4 py-2 text-sm font-semibold text-brand hover:text-brand-dark hover:bg-brand-light/10 rounded-full transition-colors"
            >
              <LuPlus size={18} /> Tambah Baris
            </button>
          </div>
          <div className="">
            {columns.map((c) => (
              <div
                className="flex p-3 relative border-b border-border"
                key={c.id}
              >
                <CheckInput
                  className="mt-0.5 mr-3"
                  type={q.type.replaceAll("grid-", "") as "radio" | "checkbox"}
                  checked={false}
                  readOnly
                />
                <Textarea
                  className="w-full pr-8 resize-none outline-none overflow-hidden focus-within:bg-muted-light"
                  defaultValue={c.title}
                  onBlur={(e) => editCol(q.id, c.id, { title: e.target.value })}
                />
                <button
                  className="absolute right-1.5 top-1.5 w-9 h-9 flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                  onClick={() => deleteCol(q.id, c.id)}
                >
                  <LuX size={18} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addCol(q.id)}
              className="flex items-center gap-2 mt-2 px-4 py-2 text-sm font-semibold text-brand hover:text-brand-dark hover:bg-brand-light/10 rounded-full transition-colors"
            >
              <LuPlus size={18} /> Tambah Kolom
            </button>
          </div>
        </div>
      )}
      {view === "table" && (
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
                {isQuiz && (
                  <th className="sticky right-0 z-20 bg-foreground p-3 text-center font-normal divide-x divide-border">
                    Poin
                  </th>
                )}
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
                        {...(q.type === "grid-radio"
                          ? {
                              onClick: (e) => {
                                linkAnswer(
                                  q.id,
                                  r.id,
                                  c.id,
                                  !Boolean(
                                    q.correctAnswers.find(
                                      ([rowId, colId]) =>
                                        rowId === r.id && colId === c.id,
                                    ),
                                  ),
                                );
                              },
                            }
                          : {
                              onChange: (e) =>
                                linkAnswer(q.id, r.id, c.id, e.target.checked),
                            })}
                      />
                    </td>
                  ))}

                  {isQuiz && (
                    <td className="sticky right-0 z-20 bg-foreground py-3 focus-within:bg-muted-light divide-x divide-border">
                      <input
                        className="w-full px-3 text-center outline-none"
                        type="number"
                        defaultValue={r.totalScore}
                        onBlur={(e) => {
                          let n = Number(e.target.value);
                          if (!n || n < 0) {
                            n = 0;
                          }
                          editRow(q.id, r.id, { totalScore: n });
                          e.target.value = n.toString();
                        }}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        className="flex items-center gap-2 mt-2 px-4 py-2 text-sm font-semibold transition-colors"
        onClick={() => setView(view === "list" ? "table" : "list")}
      >
        <LuArrowLeftRight size={18} />{" "}
        {view === "list" ? "Atur jawaban" : "Baris dan kolom"}
      </button>
    </div>
  );
}
