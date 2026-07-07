"use client";

import { FormSettings, SubmissionQuestion } from "@/types/form";
import { PrimaryTextarea } from "@/app/components/ui/textareas";

export default function QuestionText({
  q,
  settings,
}: {
  q: SubmissionQuestion;
  settings: FormSettings;
}) {
  const { isQuiz, allowSeeCorrectAnswers } = settings;

  return (
    <div className="relative">
      <PrimaryTextarea
        className="pointer-events-none"
        value={q.answers[0] as string}
        readOnly
      />
      {isQuiz && allowSeeCorrectAnswers && (
        <div className="mt-3 p-4 bg-green-50/50 border border-green-100 rounded-[20px]">
          <div className="text-sm font-semibold text-green-600 mb-2">
            Kunci Jawaban:
          </div>
          <div className="space-y-1">
            {q.correctAnswers?.length ? (
              q.correctAnswers?.map((ca, idx) => (
                <div className="text-sm text-green-400">
                  {idx + 1}. {ca}
                </div>
              ))
            ) : (
              <div className="text-sm italic text-muted-dark">
                Tidak ada kunci jawaban
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
