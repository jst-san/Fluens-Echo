import { NumberInput } from "@/app/components/ui/inputs";
import { Question, SubmissionQuestion } from "@/types/form";
import { useState } from "react";
import { LuCheck } from "react-icons/lu";

export default function TextResponses({
  sq,
  isQuiz,
}: {
  sq: SubmissionQuestion[] | undefined;
  isQuiz: boolean;
}) {
  const answers = sq?.map((sq, idx) => ({
    id: `${sq.answers[0]}_${idx}`,
    text: sq.answers[0],
    isCorrect:
      sq.correctAnswers?.length && sq.correctAnswers[0] === sq.answers[0],
  }));
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
          <div className="inline">
            {isQuiz && a.isCorrect && (
              <LuCheck
                className="text-green-600 mr-2 mb-0.5 p-1 bg-green-100 rounded-full inline"
                size={16}
              />
            )}
            {a.text}
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
