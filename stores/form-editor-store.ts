import { toCamel, toSnake } from "@/helpers/case-converter";
import { AppError } from "@/lib/app-error";
import { getSession } from "@/lib/client/auth";
import { supabase } from "@/utils/supabase/client";
import { SupabaseAuthError } from "@/lib/supabase-auth-error";
import { Question, QuestionType, EditorForm, FormSettings } from "@/types/form";
import { create } from "zustand";

interface FormEditorStore {
  form: EditorForm;
  getForm: () => EditorForm;
  newForm: () => void;
  setForm: (form: EditorForm) => void;
  updateForm: (data: Partial<EditorForm>) => void;
  saveForm: () => Promise<EditorForm>;
  updateSettings: (data: Partial<FormSettings>) => void;
  addQuestion: (position?: "last" | number) => void;
  updateQuestion: (questionId: string, data: Partial<Question>) => void;
  removeQuestion: (questionId: string) => void;
  changeQuestionType: (questionId: string, newType: QuestionType) => void;
  addQuestionOption: (questionId: string, title?: string) => void;
  updateQuestionOptionTitle: (
    questionId: string,
    optionId: string,
    newTitle: string,
  ) => void;
  setAsCorrect: (
    questionId: string,
    optionId: string,
    correct?: boolean,
  ) => void;
  removeQuestionOption: (questionId: string, optionId: string) => void;
}

export const useFormEditorStore = create<FormEditorStore>((set, get) => ({
  // === STATE === //

  form: {
    title: "",
    description: "",
    questions: [],
    settings: {},
    totalScore: null,
    shareToken: null,
  },

  // === ACTIONS === //

  getForm: () => {
    return get().form;
  },

  newForm: () => {
    set({
      form: {
        title: "Formulir Tanpa Judul",
        description: "",
        questions: [
          {
            id: "q" + Date.now().toString(),
            type: "radio",
            title: "Pertanyaan baru",
            totalScore: 0,
            correctAnswers: [],
            options: [
              { id: "o" + Date.now().toString(), title: "Opsi 1" },
              { id: "o" + (Date.now() + 300).toString(), title: "Opsi 2" },
            ],
            required: false,
          },
        ],
        settings: {
          isQuiz: true,
        },
        totalScore: null,
        shareToken: null,
      },
    });
  },

  setForm: (data) => {
    set({ form: data });
  },

  updateForm: (data) => {
    set((s) => ({
      form: { ...s.form, ...data },
    }));
  },

  saveForm: async () => {
    const session = await getSession();

    if (!session) {
      throw new AppError({
        message: "Silahkan login terlebih dahulu",
        code: "UNATHORIZED",
      });
    }

    const uid = session?.user.id;

    const { form } = get();

    let totalScore = 0;

    form.questions.forEach((q) => {
      totalScore += q.totalScore;
    });

    let data;

    if (form.shareToken) {
      const res = await supabase
        .from("forms")
        .update({
          title: form.title,
          description: form.description,
          share_token: form.shareToken,
          questions: form.questions,
          settings: form.settings,
          total_score: totalScore ?? null,
        })
        .eq("share_token", form.shareToken)
        .eq("creator_id", uid)
        .select(
          "title, description, share_token, questions, settings, total_score",
        )
        .single();

      if (res.error) {
        throw new AppError(res.error);
      }

      data = res.data;
    } else {
      const res = await supabase
        .from("forms")
        .insert({
          title: form.title,
          description: form.description,
          questions: form.questions,
          settings: form.settings,
          total_score: totalScore ?? null,
        })
        .select(
          "title, description, share_token, questions, settings, total_score",
        )
        .single();

      if (res.error) {
        throw new AppError(res.error);
      }

      data = res.data;
    }

    return toCamel(data) as EditorForm;
  },

  updateSettings: (data) => {
    set((s) => ({
      form: { ...s.form, settings: { ...s.form.settings, ...data } },
    }));
  },

  addQuestion: (position = "last") => {
    set((s) => {
      const questions = [...s.form.questions];
      const newQuestion: Question = {
        id: "q" + Date.now().toString(),
        type: "radio",
        title: "Pertanyaan baru",
        totalScore: 0,
        correctAnswers: [],
        options: [
          { id: "o" + Date.now().toString(), title: "Opsi 1" },
          { id: "o" + (Date.now() + 300).toString(), title: "Opsi 2" },
        ],
        required: Boolean(s.form.settings.questionRequiredDefault),
      };
      if (position === "last") {
        questions.push(newQuestion);
      } else if (typeof position === "number") {
        questions.splice(position, 0, newQuestion);
      }
      return { form: { ...s.form, questions } };
    });
  },

  updateQuestion: (id, data) => {
    set((state) => ({
      form: {
        ...state.form,
        questions: state.form.questions.map((q) =>
          q.id === id ? { ...q, ...data } : q,
        ),
      },
    }));
  },

  removeQuestion: (questionId) => {
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.filter((q) => q.id !== questionId),
      },
    }));
  },

  changeQuestionType: (questionId, newType) => {
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                totalScore: 0,
                type: newType,
                correctAnswers: [],
                options:
                  newType === "text"
                    ? []
                    : q.options.length
                      ? q.options
                      : [
                          { id: "o" + Date.now().toString(), title: "Opsi 1" },
                          {
                            id: "o" + (Date.now() + 300).toString(),
                            title: "Opsi 2",
                          },
                        ],
              }
            : q,
        ),
      },
    }));
  },

  addQuestionOption: (questionId, title) => {
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: [
                  ...q.options,
                  {
                    id: "o" + Date.now().toString(),
                    title: title ?? "Opsi " + (q.options.length + 1).toString(),
                  },
                ],
              }
            : q,
        ),
      },
    }));
  },

  updateQuestionOptionTitle: (questionId, optionId, newTitle) => {
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: q.options.map((o) =>
                  o.id === optionId ? { ...o, title: newTitle } : o,
                ),
              }
            : q,
        ),
      },
    }));
  },

  setAsCorrect: (questionId, correctAnswer, correct = true) => {
    const allowedTypes = ["radio", "text", "checkbox"];
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.map((q) => {
          if (q.id !== questionId) return q;

          if (!allowedTypes.includes(q.type)) return q;

          let correctAnswersAfter: string[];
          let totalScoreAfter: number;

          if (correct) {
            if (q.correctAnswers.includes(questionId)) return q;
            if (q.type === "radio") {
              correctAnswersAfter = [correctAnswer];
              totalScoreAfter = correctAnswersAfter.length ? 1 : 0;
            } else if (q.type === "text") {
              correctAnswersAfter = correctAnswer
                .split(";")
                .map((ca) => ca.trim())
                .filter((ca) => ca !== "");
              totalScoreAfter = 1;
            } else {
              correctAnswersAfter = [...q.correctAnswers, correctAnswer];
              totalScoreAfter = q.totalScore + 1;
            }
          } else {
            if (!q.correctAnswers.includes(correctAnswer)) return q;
            if (q.type === "radio") {
              correctAnswersAfter = [];
              totalScoreAfter = 0;
            } else if (q.type === "text") {
              correctAnswersAfter = q.correctAnswers
                .filter(
                  (ca) =>
                    !correctAnswer
                      .split(";")
                      .map((i) => i.trim())
                      .includes(ca),
                )
                .filter((ca) => ca !== "");
              totalScoreAfter = correctAnswersAfter.length;
            } else {
              correctAnswersAfter = q.correctAnswers.filter(
                (ca) => ca !== correctAnswer,
              );
              totalScoreAfter = q.totalScore - 1;
            }
          }

          return {
            ...q,
            totalScore: totalScoreAfter,
            correctAnswers: correctAnswersAfter,
          };
        }),
      },
    }));
  },

  removeQuestionOption: (questionId, optionId) => {
    set((s) => {
      return {
        form: {
          ...s.form,
          questions: s.form.questions.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  options: q.options.filter((o) => o.id !== optionId),
                }
              : q,
          ),
        },
      };
    });
  },
}));
