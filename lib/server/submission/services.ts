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
    score: 0,
    totalScore: 0,
    settings: form.settings,
  };

  if (form.settings.isQuiz) {
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

        if (sc.ca.length) {
          if (
            ["radio", "select"].includes(r.type) &&
            r.answers[0] === sc.ca[0]
          ) {
            score = sc.ts;
          } else if (r.type === "checkbox") {
            const sortedCorrectAnswers = sc.ca.sort();
            const sortedAnswers = r.answers.sort();
            if (
              sortedCorrectAnswers.length === sortedAnswers.length &&
              sortedCorrectAnswers.every((ca, idx) => ca === sortedAnswers[idx])
            ) {
              score = sc.ts;
            }
          } else if (r.type === "text") {
            const answer = r.answers[0].trim().toLowerCase();
            if (sc.ca.some((ca) => ca.trim().toLowerCase() === answer)) {
              score = sc.ts;
            }
          } else if (r.type === "grid-radio") {
            let scores: number[] = [];

            r.grid.rows.forEach((row, rowIdx) => {
              const matchedCorrectAnswers = sc.ca
                .filter((ca) => ca[0] === row.id)
                .sort();
              const matchedAnswers = r.answers
                .filter((a) => a[0] === row.id)
                .sort();

              if (matchedCorrectAnswers.length !== matchedAnswers.length)
                return (scores[rowIdx] = 0);

              if (!matchedCorrectAnswers.length) {
                return (scores[rowIdx] = row.totalScore);
              }

              const isCorrect =
                matchedCorrectAnswers[0][1] === matchedAnswers[0][1];
              scores[rowIdx] = isCorrect ? row.totalScore : 0;
            });

            score = scores.reduce((p, c) => (p += c), 0);
          } else if (r.type === "grid-checkbox") {
            let scores: number[] = [];

            r.grid.rows.forEach((row, rowIdx) => {
              const matchedCorrectAnswers = sc.ca
                .filter((ca) => ca[0] === row.id)
                .sort();
              const matchedAnswers = r.answers
                .filter((a) => a[0] === row.id)
                .sort();

              if (matchedCorrectAnswers.length !== matchedAnswers.length)
                return (scores[rowIdx] = 0);

              if (!matchedCorrectAnswers.length) {
                return (scores[rowIdx] = row.totalScore);
              }

              const isCorrect = matchedCorrectAnswers.every(
                (ca, caIdx) => ca[1] === matchedAnswers[caIdx][1],
              );
              scores[rowIdx] = isCorrect ? row.totalScore : 0;
            });

            score = scores.reduce((p, c) => (p += c), 0);
          }
        }

        submissionData.score += score;
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

  let submissionForm: ClientSubmission = {
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

  // Form Settings Handling
  if (form.settings.shuffleQuestions) {
    const sq = submissionForm.submissionQuestions;
    for (let i = 0; i < submissionForm.submissionQuestions.length; i++) {
      console.log(i, sq.length);
      const r = Math.floor(Math.random() * (i + 1));
      [sq[i], sq[r]] = [sq[r], sq[i]];
    }
  }

  return submissionForm;
}
