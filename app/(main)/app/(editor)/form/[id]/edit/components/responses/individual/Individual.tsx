import { useContext, useEffect, useState } from "react";
import { ResponsesContext } from "../../ResponsesSection";
import { NumberInput } from "@/app/components/ui/inputs";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import ResultQuestion from "@/app/components/ui/form/question-parts/result/ResultQuestion";
import CopyText from "@/app/components/ui/CopyText";
import { formatTimestamp } from "@/helpers/timestamp-formatter";

export default function Individual() {
  const responses = useContext(ResponsesContext);

  if (!responses?.length) return <></>;

  const responseIds = responses.map((r) => r.uuid);
  const [displayed, setDisplayed] = useState<string>(responseIds[0]);
  const [index, setIndex] = useState<number>(0);
  const [number, setNumber] = useState<number>(1);

  const sq = responses
    ?.map((r) => r.data.submissionQuestions.find((sq) => sq.id === displayed))
    .filter((sq) => sq !== undefined);

  const changeDisplayed = (value: string) => {
    const idx = responseIds.findIndex((id) => id === value);
    if (idx === -1) {
      const fallbackIdx = responseIds.findIndex((id) => id === displayed);
      setNumber(fallbackIdx + 1);
      setIndex(fallbackIdx);
      return;
    }
    setDisplayed(value);
    setNumber(idx + 1);
    setIndex(idx);
  };

  useEffect(() => {
    setDisplayed(responseIds[0]);
    setIndex(0);
    setNumber(1);
  }, [responses]);
  return (
    <>
      <div className="bg-foreground border border-border p-8 space-y-6 rounded-3xl">
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
          <CopyText
            className="w-full sm:max-w-sm"
            text={`${location.origin}/r/${responses[index].uuid}`}
          />
          <div className="flex gap-3 items-center">
            <button
              className="p-2 rounded-full transition-colors hover:bg-muted-light active:bg-muted"
              onClick={() => changeDisplayed(responseIds[number - 2])}
              disabled={index === 0}
            >
              <LuChevronLeft size={18} />
            </button>
            <NumberInput
              value={number ?? 1}
              onChange={(e) => setNumber(Number(e.target.value))}
              onBlur={(e) =>
                changeDisplayed(responseIds[Number(e.target.value) - 1])
              }
              min={1}
              max={responseIds?.length}
            />
            <span className="ml-3">
              /<span className="ml-3">{responseIds.length}</span>
            </span>
            <button
              className="p-2 rounded-full transition-colors hover:bg-muted-light active:bg-muted"
              onClick={() => changeDisplayed(responseIds[number])}
              disabled={index === responseIds.length - 1}
            >
              <LuChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-foreground border border-border p-8 space-y-6 rounded-3xl">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
          {responses[index].data.settings.isQuiz && (
            <div className="inline-flex items-center gap-2 w-max h-9 px-5 rounded-full bg-brand-light/10 text-brand text-sm font-semibold">
              Poin: {responses[index].data.score} /{" "}
              {responses[index].data.totalScore}
            </div>
          )}
          <div className="text-sm text-muted-darker">Dikirim pada: {formatTimestamp(responses[index].createdAt)}</div>
        </div>
      </div>
      {responses[index].data.submissionQuestions.map((sq) => (
        <ResultQuestion
          key={`${sq.id}_${index}`}
          q={sq}
          settings={responses[index].data.settings}
          view="creator"
        />
      ))}
    </>
  );
}
