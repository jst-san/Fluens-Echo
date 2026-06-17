import { AppError } from "@/lib/app-error";
import { ClientSubmission } from "@/types/form";

import { create } from "zustand";

interface FormSubmissionStore {
  form: ClientSubmission | null;
  validated: boolean;
  setForm: (data: ClientSubmission) => void;
  updateAnswers: (
    questionId: string,
    answer: string,
    condition?: boolean,
  ) => void;
  validate: () => void;
}

export const useFormSubmissionStore = create<FormSubmissionStore>(
  (set, get) => ({
    // === STATE === //

    form: null,
    validated: false,

    // === ACTIONS === //

    updateAnswers: (questionId, answer, condition = true) => {
      const { form, validate } = get();
      if (!form) return set({ validated: false });
      set({
        form: {
          ...form,
          submissionQuestions: form.submissionQuestions.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  answers:
                    q.type === "checkbox"
                      ? condition
                        ? [...q.answers, answer]
                        : q.answers.filter((a: string) => a !== answer)
                      : condition
                        ? answer
                        : "",
                }
              : q,
          ),
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
          if (Array.isArray(q.answers))
            return !q.answers.length && (validated = false);

          q.answers.trim() === "" && (validated = false);
        });
      set({ validated });
    },
  }),
);
