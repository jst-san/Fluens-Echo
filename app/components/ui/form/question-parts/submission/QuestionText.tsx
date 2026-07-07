"use client";

import { PrimaryTextarea } from "@/app/components/ui/textareas";
import { useFormSubmissionStore } from "@/stores/form-submission-store";
import { SubmissionQuestion } from "@/types/form";

export default function QuestionText(q: SubmissionQuestion) {
  const setAnswers = useFormSubmissionStore((s) => s.setAnswers);

  return (
    <div className="relative">
      <PrimaryTextarea
        defaultValue={q.answers[0]}
        placeholder="Ketik jawaban Anda di sini..."
        onBlur={(e) => setAnswers(q.id, e.target.value)}
      />
    </div>
  );
}