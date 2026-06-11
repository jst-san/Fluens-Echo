import { Question, QuestionType, EditorForm } from "@/types/form";
import { create } from "zustand";

interface FormEditorStore {
  form: EditorForm;
  getForm: () => EditorForm;
  newForm: () => void;
  setForm: (form: EditorForm) => void;
  updateForm: (data: Partial<EditorForm>) => void;
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
    options: {},
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
            title: "Pertanyaan tanpa judul",
            totalScore: 0,
            correctAnswers: [],
            options: [
              { id: "o" + Date.now().toString(), title: "Opsi 1" },
              { id: "o" + (Date.now() + 300).toString(), title: "Opsi 2" },
            ],
            required: false,
          },
        ],
        options: {},
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

  addQuestion: (position = "last") => {
    const newQuestion: Question = {
      id: "q" + Date.now().toString(),
      type: "radio",
      title: "Pertanyaan tanpa judul",
      totalScore: 0,
      correctAnswers: [],
      options: [
        { id: "o" + Date.now().toString(), title: "Opsi 1" },
        { id: "o" + (Date.now() + 300).toString(), title: "Opsi 2" },
      ],
      required: false,
    };

    set((s) => {
      const questions = [...s.form.questions];
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
                      :[
                        { id: "o" + Date.now().toString(), title: "Opsi 1" },
                        { id: "o" + (Date.now() + 300).toString(), title: "Opsi 2" },
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
