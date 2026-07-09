import { toCamel, toSnake } from "@/helpers/case-converter";
import { AppError } from "@/lib/app-error";
import { getSession } from "@/lib/client/auth";
import { supabase } from "@/utils/supabase/client";
import { SupabaseAuthError } from "@/lib/supabase-auth-error";
import {
  Question,
  QuestionType,
  EditorForm,
  FormSettings,
  QuestionGrid,
} from "@/types/form";
import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import { UniqueIdentifier } from "@dnd-kit/core";

interface FormEditorStore {
  form: EditorForm;
  getForm: () => EditorForm;
  newForm: () => void;
  setForm: (form: EditorForm) => void;
  updateForm: (data: Partial<EditorForm>) => void;
  saveForm: () => Promise<EditorForm>;
  updateSettings: (data: Partial<FormSettings>) => void;
  addQuestion: (position?: "last" | number, data?: Question) => void;
  updateQuestion: (questionId: string, data: Partial<Question>) => void;
  moveQuestion: (activeId: UniqueIdentifier, overId: UniqueIdentifier) => void;
  moveQuestionByIndex: (prevIdx:number, newIdx:number) => void;
  removeQuestion: (questionId: string) => void;
  changeQuestionType: (questionId: string, newType: QuestionType) => void;
  changeQuestionScore: (questionId: string, newScore: number) => void;
  insertToQuestion: (questionId: string, data: Question["attached"]) => void;
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
  addRow: (questionId: string) => void;
  addCol: (questionId: string) => void;
  editRow: (
    questionId: string,
    rowId: string,
    data: Partial<{ id: string; title: string; totalScore: number }>,
  ) => void;
  editCol: (
    questionId: string,
    colId: string,
    data: Partial<{ id: string; title: string }>,
  ) => void;
  linkAnswer: (
    questionId: string,
    rowId: string,
    colId: string,
    condition?: boolean,
  ) => void;
  deleteRow: (questionId: string, rowId: string) => void;
  deleteCol: (questionId: string, colId: string) => void;
}

export const useFormEditorStore = create<FormEditorStore>((set, get) => ({
  // === STATE === //

  form: {
    title: "",
    description: "",
    questions: [],
    settings: {
      isQuiz: false,
      allowSeeWrongAnswers: true,
      allowSeeCorrectAnswers: true,
      allowSeeScore: true,
      defaultScoreValue: 0,
      shuffleQuestions: false,
      allowSeeResult: false,
      questionRequiredDefault: false,
    },
    totalScore: 0,
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
            options: [{ id: "o" + Date.now().toString(), title: "Opsi 1" }],
            grid: { rows: [], columns: [] },
            required: false,
          },
        ],
        settings: {
          isQuiz: false,
          allowSeeWrongAnswers: true,
          allowSeeCorrectAnswers: true,
          allowSeeScore: true,
          defaultScoreValue: 0,
          shuffleQuestions: false,
          allowSeeResult: false,
          questionRequiredDefault: false,
        },
        totalScore: 0,
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
          "title, description, share_token, questions, settings, total_score, updated_at, created_at",
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
          "title, description, share_token, questions, settings, total_score, updated_at, created_at",
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

  addQuestion: (position = "last", data) => {
    if (data)
      return set((s) => ({
        form: {
          ...s.form,
          questions:
            position === "last"
              ? [...s.form.questions, data]
              : [...s.form.questions.splice(position, 0, data)],
          totalScore: s.form.totalScore + data.totalScore,
        },
      }));
    set((s) => {
      const questions = [...s.form.questions];
      const newQuestion: Question = {
        id: "q" + Date.now().toString(),
        type: "radio",
        title: "Pertanyaan baru",
        totalScore: s.form.settings.defaultScoreValue ?? 0,
        correctAnswers: [],
        options: [{ id: "o" + Date.now().toString(), title: "Opsi 1" }],
        grid: { rows: [], columns: [] },
        required: Boolean(s.form.settings.questionRequiredDefault),
      };
      if (position === "last") {
        questions.push(newQuestion);
      } else if (typeof position === "number") {
        questions.splice(position, 0, newQuestion);
      }
      const totalScore = s.form.totalScore + s.form.settings.defaultScoreValue;
      return { form: { ...s.form, questions, totalScore } };
    });
  },

  updateQuestion: (questionId, data) => {
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.map((q) =>
          q.id === questionId ? { ...q, ...data } : q,
        ),
      },
    }));
  },

  moveQuestion: (activeId, overId) => {
    set((s) => {
      const prevIdx = s.form.questions.findIndex((q) => q.id === activeId);

      const newIdx = s.form.questions.findIndex((q) => q.id === overId);

      if (prevIdx === -1 || newIdx === -1) return {};

      return {
        form: {
          ...s.form,
          questions: arrayMove(s.form.questions, prevIdx, newIdx),
        },
      };
    });
  },

  moveQuestionByIndex: (prevIdx, newIdx) => {
    set((s) => {
      if (
        prevIdx > s.form.questions.length - 1 ||
        newIdx > s.form.questions.length - 1
      )
        return {};

      return {
        form: {
          ...s.form,
          questions: arrayMove(s.form.questions, prevIdx, newIdx),
        },
      };
    });
  },

  removeQuestion: (questionId) => {
    set((s) => {
      const questions = s.form.questions;
      const totalScore =
        s.form.totalScore -
        (questions.find((q) => q.id === questionId)?.totalScore ?? 0);
      return {
        form: {
          ...s.form,
          questions: questions.filter((q) => q.id !== questionId),
          totalScore,
        },
      };
    });
  },

  changeQuestionType: (questionId, newType) => {
    set((s) => {
      let totalScoreAfter: number = s.form.totalScore;
      const formatQuestion = (q: Question) => {
        let formatted = q;

        if (newType === q.type) return formatted;

        if (newType === "text") {
          formatted = {
            ...q,
            type: newType,
            correctAnswers: [],
            options: [],
            grid: { rows: [], columns: [] },
          };
        }

        if (newType === "radio" || newType === "checkbox") {
          formatted = {
            ...q,
            type: newType,
            correctAnswers: [],
            options: q.options.length
              ? q.options
              : [
                  {
                    id: "o" + Date.now().toString(),
                    title: "Opsi 1",
                  },
                ],
            grid: { rows: [], columns: [] },
          };
        }

        if (newType === "select") {
          formatted = {
            ...q,
            totalScore: 0,
            type: newType,
            correctAnswers: [],
            options: q.options.length
              ? q.options
              : [
                  {
                    id: "o" + Date.now().toString(),
                    title: "Opsi 1",
                  },
                ],
            grid: { rows: [], columns: [] },
          };
          totalScoreAfter -= q.totalScore;
        }

        if (newType === "grid-radio" || newType === "grid-checkbox") {
          formatted = {
            ...q,
            totalScore: 0,
            type: newType,
            correctAnswers: [],
            options: [],
            grid: {
              rows: q.grid.rows.length
                ? q.grid.rows
                : [
                    {
                      id: "r" + Date.now().toString(),
                      title: "Baris 1",
                      totalScore: 0,
                    },
                  ],
              columns: q.grid.columns.length
                ? q.grid.columns
                : [
                    {
                      id: "c" + Date.now().toString(),
                      title: "Kolom 1",
                    },
                  ],
            },
          };
          totalScoreAfter -= q.totalScore;
        }

        return formatted;
      };
      return {
        form: {
          ...s.form,
          questions: s.form.questions.map((q) =>
            q.id === questionId ? formatQuestion(q) : q,
          ),
          totalScore: totalScoreAfter,
        },
      };
    });
  },

  changeQuestionScore: (questionId, newScore) => {
    const form = get().form;
    const type = form.questions.find((q) => q.id === questionId)?.type;
    if (type?.startsWith("grid")) return;
    set({
      form: {
        ...form,
        questions: form.questions.map((q) =>
          q.id === questionId ? { ...q, ...{ totalScore: newScore } } : q,
        ),
      },
    });
    set((s) => ({
      form: {
        ...s.form,
        totalScore: s.form.questions.reduce((a, c) => (a += c.totalScore), 0),
      },
    }));
  },

  insertToQuestion: (questionId, data) => {
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.map((q) =>
          q.id === questionId
            ? { ...q, attached: { ...q.attached, ...data } }
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
    const allowedTypes = ["radio", "text", "checkbox", "select"];
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.map((q) => {
          if (q.id !== questionId) return q;

          if (!allowedTypes.includes(q.type)) return q;

          let correctAnswersAfter: string[];

          if (correct) {
            if (q.correctAnswers.includes(questionId)) return q;
            if (["radio", "select"].includes(q.type)) {
              correctAnswersAfter = [correctAnswer];
            } else if (q.type === "text") {
              correctAnswersAfter = correctAnswer
                .split(";")
                .map((ca) => ca.trim())
                .filter((ca) => ca !== "");
            } else {
              correctAnswersAfter = [...q.correctAnswers, correctAnswer];
            }
          } else {
            if (!q.correctAnswers.includes(correctAnswer)) return q;
            if (q.type === "radio") {
              correctAnswersAfter = [];
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
            } else {
              correctAnswersAfter = q.correctAnswers.filter(
                (ca) => ca !== correctAnswer,
              );
            }
          }

          return {
            ...q,
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

  addRow: (questionId) => {
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                grid: {
                  rows: [
                    ...q.grid.rows,
                    {
                      id: "r" + Date.now().toString(),
                      title: `Baris ${q.grid.rows.length + 1}`,
                      totalScore: 0,
                    },
                  ],
                  columns: [...q.grid.columns],
                },
              }
            : q,
        ),
      },
    }));
  },

  addCol: (questionId) => {
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                grid: {
                  columns: [
                    ...q.grid.columns,
                    {
                      id: "c" + Date.now().toString(),
                      title: `Kolom ${q.grid.columns.length + 1}`,
                    },
                  ],
                  rows: [...q.grid.rows],
                },
              }
            : q,
        ),
      },
    }));
  },

  editRow: (questionId, rowId, data) => {
    let form = get().form;
    let newQuestion = {
      ...form.questions.find((q) => q.id === questionId),
    };

    newQuestion.grid = {
      rows: newQuestion.grid?.rows.map((r) =>
        r.id === rowId ? { ...r, ...data } : r,
      )!,
      columns: [...newQuestion.grid?.columns!],
    };

    if ("totalScore" in data) {
      newQuestion!.totalScore = newQuestion.grid?.rows
        .map((r) => r.totalScore)
        .reduce((p, c) => (p += c), 0);
    }

    form = {
      ...form,
      questions: form.questions.map((q) =>
        q.id === questionId ? newQuestion : q,
      ),
    } as EditorForm;

    set({ form });

    if ("totalScore" in data) {
      set({
        form: {
          ...form,
          totalScore: form.questions.reduce((a, c) => (a += c.totalScore), 0),
        },
      });
    }
  },

  editCol: (questionId, colId, data) => {
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                grid: {
                  columns: q.grid.columns.map((c) =>
                    c.id === colId ? { ...c, ...data } : c,
                  ),
                  rows: [...q.grid.rows],
                },
              }
            : q,
        ),
      },
    }));
  },

  linkAnswer: (questionId, rowId, colId, condition = true) => {
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                correctAnswers: condition
                  ? [
                      ...q.correctAnswers.filter((a) =>
                        q.type === "grid-radio" ? a[0] !== rowId : true,
                      ),
                      [rowId, colId],
                    ]
                  : q.correctAnswers.filter(
                      (a) => !(a[0] === rowId && a[1] === colId),
                    ),
              }
            : q,
        ),
      },
    }));
  },

  deleteRow: (questionId, rowId) => {
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                correctAnswers: q.correctAnswers.filter((a) => a[0] !== rowId),
                grid: {
                  rows: q.grid.rows.filter((r) => r.id !== rowId),
                  columns: q.grid.columns,
                },
              }
            : q,
        ),
      },
    }));
  },

  deleteCol: (questionId, colId) => {
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                correctAnswers: q.correctAnswers.filter((a) => a[1] !== colId),
                grid: {
                  columns: q.grid.columns.filter((c) => c.id !== colId),
                  rows: q.grid.rows,
                },
              }
            : q,
        ),
      },
    }));
  },
}));
