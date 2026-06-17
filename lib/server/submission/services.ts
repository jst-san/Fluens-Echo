import {
  Submission,
  ClientSubmission,
  ClientForm,
  SubmissionQuestion,
} from "@/types/form";
import { getFormByToken } from "../form/repository";
import { createSubmission } from "./repository";
import { createHash } from "crypto";
import { AppError } from "@/lib/app-error";

export async function saveSubmission(responseForm: ClientSubmission) {
  const form = await getFormByToken(responseForm.shareToken);

  if (!form)
    throw new AppError({
      message: "Formulir ini tidak dapat diakses.",
      code: "FORBIDDEN",
      status: 403,
    });

  const submissionData: Submission["data"] = {
    title: form.title,
    description: form.description,
    submissionQuestions: [],
    score: null,
    totalScore: null,
  };

  if (form.totalScore) {
    let scoreObj: Record<string, { ca: string[]; ts: number; a: number }> = {};
    form.questions.forEach(
      (q) =>
        q.totalScore &&
        (scoreObj[q.id] = {
          ca: q.correctAnswers,
          ts: q.totalScore,
          a: q.totalScore / q.correctAnswers.length,
        }),
    );
    submissionData.submissionQuestions = responseForm.submissionQuestions.map(
      (r) => {
        const sc = scoreObj[r.id];

        if (!sc) return r;
        let score = 0;
        if (r.type === "checkbox") {
          r.answers.forEach((a: string) => {
            if (sc.ca.includes(a)) score += sc.a;
          });
        } else {
          r.type === "text"
            ? sc.ca
                .map((ca) => ca.toLowerCase())
                .includes(r.answers.toLowerCase()) && (score = sc.ts)
            : sc.ca.includes(r.answers) && (score = sc.ts);
        }
        submissionData.score
          ? (submissionData.score += score)
          : (submissionData.score = score);
        return { ...r, correctAnswers: sc.ca, totalScore: sc.ts, score };
      },
    );

    submissionData.totalScore = form.totalScore;
  } else {
    submissionData.submissionQuestions = responseForm.submissionQuestions;
  }

  const data = await createSubmission({
    formId: form.id,
    data: submissionData,
  });

  return form.settings.allowSeeResult ? data : {};
}

export async function getSubmissionForm(token: string) {
  if (!token) {
    throw new AppError({
      message: "Format request tidak valid.",
      code: "BAD_REQUEST",
      status: 400,
    });
  }

  const form = await getFormByToken(token);

  if (!form) {
    throw new AppError({
      message: "Formulir tidak ditemukan.",
      code: "NOT_FOUND",
      status: 404,
    });
  }

  const submissionForm: ClientSubmission = {
    title: form.title,
    description: form.description,
    shareToken: form.shareToken,
    submissionQuestions: form.questions.map((q) => {
      let question: any = { ...q };
      delete question.totalScore;
      delete question.correctAnswers;
      question.answers = [];
      question.score = q.totalScore ? 0 : null;
      return question as SubmissionQuestion;
    }),
    settings: form.settings,
  };

  return submissionForm;
}
