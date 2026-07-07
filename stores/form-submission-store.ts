import { AppError } from "@/lib/app-error";
import { ClientSubmission } from "@/types/form";

import { create } from "zustand";

interface FormSubmissionStore {
  form: ClientSubmission | null;
  validated: boolean;
  setForm: (data: ClientSubmission) => void;
  setAnswers: (questionId: string, answer: any, condition?: boolean) => void;
  validate: () => void;
}

export const useFormSubmissionStore = create<FormSubmissionStore>(
  (set, get) => ({
    // === STATE === //

    form: null,
    validated: false,

    // === ACTIONS === //

    setAnswers: (questionId, answer, condition = true) => {
      const { form, validate } = get();
      if (!form) return set({ validated: false });
      set({
        form: {
          ...form,
          submissionQuestions: form.submissionQuestions.map((q) => {
            if (q.id !== questionId) return q;

            if (["radio", "checkbox", "text", "select"].includes(q.type)) {
              return {
                ...q,
                answers:
                  q.type === "checkbox"
                    ? condition
                      ? [...q.answers, answer]
                      : q.answers.filter((a: string) => a !== answer)
                    : condition
                      ? [answer]
                      : [],
              };
            } else if (["grid-radio", "grid-checkbox"].includes(q.type)) {
              return {
                ...q,
                answers:
                  q.type === "grid-checkbox"
                    ? condition
                      ? [...q.answers, answer]
                      : q.answers.filter(
                          (a) => !(a[0] === answer[0] && a[1] === answer[1]),
                        )
                    : condition
                      ? [...q.answers.filter((a) => a[0] !== answer[0]), answer]
                      : q.answers.filter(
                            (a) => !(a[0] === answer[0] && a[1] === answer[1]),
                          )
                        ,
              };
            } else return q;
          }),
        },
      });
      validate();
    },

    setForm: (data) => {
      set({ form: data });
    },

    validate: () => {
      let validated = true;
      get()
        .form?.submissionQuestions.filter((q) => q.required)
        .forEach((q) => {
          if (!q.answers.length) return (validated = false);
          if (q.type === "text") {
            return (validated = q.answers[0].trim() !== "");
          }
        });
      set({ validated });
    },
  }),
);
