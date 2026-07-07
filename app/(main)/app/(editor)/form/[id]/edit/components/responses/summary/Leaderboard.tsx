import { useContext, useEffect, useState } from "react";
import { ResponsesContext } from "../../ResponsesSection";
import { NumberInput } from "@/app/components/ui/inputs";
import { useFormEditorStore } from "@/stores/form-editor-store";
import { LuChevronDown } from "react-icons/lu";
import { useShallow } from "zustand/react/shallow";

export default function Leaderboard() {
  const { questions, totalScore } = useFormEditorStore(
    useShallow((s) => ({
      questions: s.form.questions,
      totalScore: s.form.totalScore,
    })),
  );
  const standing = useContext(ResponsesContext)?.sort(
    (a, b) => (b.data.score ?? 0) - (a.data.score ?? 0),
  );
  const [basedId, setBasedId] = useState<string>();
  const [limit, setLimit] = useState<number>(10);

  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    setBasedId(
      questions.filter((q) => q.type === "text" || q.type === "select")[0]?.id,
    );
  }, [questions]);

  return (
    <div className="bg-foreground border border-border p-8 space-y-6 rounded-3xl">
      <div className="text-lg font-bold">Leaderboard</div>
      {basedId ? (
        <>
          <div className="">
            <div className="border border-border rounded-lg">
              <table className="text-left table-fixed divide-y divide-border">
                <thead className="">
                  <tr className="divide-x divide-border">
                    <th className="p-3 text-center font-normal">No</th>
                    <th className="relative w-full p-3 font-normal">
                      <button
                        className="w-full flex justify-between items-center gap-3"
                        onClick={() => setOpenDropdown(!openDropdown)}
                      >
                        <div className="line-clamp-1">
                          {questions.find((q) => q.id === basedId)?.title ?? ""}
                        </div>
                        <LuChevronDown />
                      </button>
                      {openDropdown && (
                        <div className="w-full absolute left-0 top-full bg-foreground rounded-lg border border-border shadow-lg overflow-hidden">
                          <div className="max-h-64 overflow-auto">
                            <div className="h-max divide-y divide-transparent">
                              {questions
                                .filter(
                                  (q) =>
                                    q.type === "text" || q.type === "select",
                                )
                                .map((q) => (
                                  <button
                                    key={q.id}
                                    className="w-full flex line-clamp-1 p-3 text-left hover:bg-brand-light/10 transition-all"
                                    onClick={() => {
                                      setBasedId(q.id);
                                      setOpenDropdown(false);
                                    }}
                                  >
                                    {q.title}
                                  </button>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </th>
                    <th className="p-3 text-center font-normal">Poin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {standing?.slice(0, limit).map((s, idx) => {
                    const type = questions.find((q) => q.id === basedId)?.type;

                    if (!type) return;

                    return (
                      <tr key={s.uuid} className="divide-x divide-border">
                        <td className="p-3 text-center">{idx + 1}</td>
                        <td className="p-3">
                          <div className="line-clamp-1">
                            {(type === "text" &&
                              s.data.submissionQuestions.find(
                                (sq) => sq.id === basedId,
                              )?.answers[0]) ?? 
                              <span className="italic text-muted-dark">
                                Kosong
                              </span>}
                            {type === "select" &&
                              (questions
                                .find((q) => q.id === basedId)
                                ?.options.find(
                                  (o) =>
                                    o.id ===
                                    s.data.submissionQuestions.find(
                                      (sq) => sq.id === basedId,
                                    )?.answers[0],
                                )?.title ?? (
                                <span className="italic text-muted-dark">
                                  Kosong
                                </span>
                              ))}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {s.data.score ?? 0}/{totalScore}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <div>Jumlah</div>
            <NumberInput
              defaultValue={limit}
              onBlur={(e) => {
                let n = Number(e.target.value);
                if (!n || n < 1) {
                  n = 1;
                }
                setLimit(n);
                e.target.value = n.toString();
              }}
              min={1}
            />
          </div>
        </>
      ) : (
        <div className="text-center italic text-lg text-muted-darker">
          Tidak ada data
        </div>
      )}
    </div>
  );
}
