"use client";

import { PrimaryTextarea } from "@/app/components/ui/textareas";
import { Question } from "@/types/form";

export default function PreviewQuestionText(q: Question) {

  return (
    <div className="relative">
      <PrimaryTextarea
        placeholder="Jawab..."
        readOnly
      />
    </div>
  );
}