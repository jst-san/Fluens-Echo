"use client";

import { CheckInput } from "@/app/components/ui/inputs";
import OptionLabel from "@/app/components/ui/form/OptionLabel";
import { Question } from "@/types/form";
import { LuChevronDown } from "react-icons/lu";

export default function PreviewQuestionOptions(q: Question) {

  return (
    <>
      {(q.type === "radio" || q.type === "checkbox") && (
        <div className="space-y-3">
          {(q.options || []).map((o) => 
              <OptionLabel
                key={o.id}
                className="bg-foreground border-border hover:border-muted-dark hover:bg-brand-light/10"
              >
                <CheckInput
                  id={o.id}
                  type={q.type as any}
                  name={q.id}
                  checked={Boolean(q.correctAnswers.find((ca) => ca=== o.id))}
                  readOnly
                />
                <span className="flex-1 text-sm outline-none resize-none">
                  {o.title}
                </span>
              </OptionLabel>
          )}
        </div>
      )}

      {q.type === "select" && (
        <>
          <div
            className="w-full max-w-sm relative text-sm"
          >
            <button
              type="button"
              className="flex items-center justify-between px-6 w-full h-14 border rounded-full transition-all outline-none bg-brand-light/10 border-border hover:border-muted-dark"
            >
              <span className="text-left truncate">
                  Pilih opsi...
              </span>
              <LuChevronDown className="text-muted-darker" size={18} />
            </button>
          </div>

        </>
      )}
    </>)
}
