import { useContext } from "react";
import { ResponsesContext } from "../../ResponsesSection";
import { useFormEditorStore } from "@/stores/form-editor-store";

export default function Statistic() {
  const totalScore = useFormEditorStore((s) => s.form.totalScore);
  const scores = useContext(ResponsesContext)?.map((r) => r.data.score ?? 0);
  if (!scores) return;

  const sum = scores.reduce((a, c) => a + c);
  const avg = sum / scores.length;
  const min = scores.sort((a, b) => a - b)[0];
  const max = scores.sort((a, b) => b - a)[0];
  const median = findMedian(scores);

  function findMedian(array: number[]) {
    const sorted = array.sort((a, b) => a - b);
    if (array.length % 2 === 0) {
      return (sorted[array.length / 2 - 1] + array[array.length / 2]) / 2;
    } else {
      return sorted[Math.floor(array.length / 2)];
    }
  }

  return (
    <div className="bg-foreground border border-border p-8 space-y-6 rounded-3xl">
      <div className="text-lg font-bold">Statistik</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
        <div className="p-6 flex flex-col gap-3 items-center bg-brand-light/10 border border-border rounded-3xl">
          <div>Rata-rata</div>
          <div className="text-muted-darker text-sm">
            <span className="text-brand">{Number(avg.toFixed(1))}</span> /{" "}
            {totalScore} Poin
          </div>
        </div>
        <div className="p-6 flex flex-col gap-3 items-center bg-brand-light/10 border border-border rounded-3xl">
          <div>Median</div>
          <div className="text-muted-darker text-sm">
            <span className="text-brand">{Number(median.toFixed(1))}</span> /{" "}
            {max} Poin
          </div>
        </div>
        <div className="p-6 flex flex-col gap-3 items-center bg-brand-light/10 border border-border rounded-3xl">
          <div>Jangkauan</div>
          <div className="text-muted-darker text-sm">
            {min} - {max} Poin
          </div>
        </div>
      </div>
    </div>
  );
}
