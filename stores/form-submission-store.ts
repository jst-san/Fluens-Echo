import type { ClientForm, Form } from "@/types/form";
import { ClientSubmission } from "@/types/form";

import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

// Reminder
// trim before saving

interface FormSubmissionStore {
  form: ClientSubmission | null;
  status: "none" | "sending" | "sent" | "error" | "loading";
  validated: boolean;
  getByToken: (shareToken: string) => void;
  updateAnswers: (
    questionId: string,
    answer: string,
    condition?: boolean,
  ) => void;
  validate: () => void;
  submit: () => void;
}

export const useFormSubmissionStore = create<FormSubmissionStore>(
  (set, get) => ({
    // === STATE === //

    form: null,
    status: "none",
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
    getByToken: async (shareToken) => {
      set({ status: "loading" });
      const res = await fetch(`/api/form/${shareToken}/public`);

      if (!res.ok) return set({ status: "none" });

      const payload = await res.json();

      if (!payload.success) return set({ status: "none" });

      set({ form: payload.data.submissionForm, status: "none" });
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
    submit: async () => {
      const { status, form, validated } = get();

      if (status === "sending") return;

      set({ status: "sending" });

      if (!validated) return set({ status: "none" });

      const res = await fetch("/api/submission", {
        method: "post",
        body: JSON.stringify({
          submission: form,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) return set({ status: "error" });

      set({ status: "sent" });
    },
  }),
);
