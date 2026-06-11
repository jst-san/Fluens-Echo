import {
  Submission,
  ClientSubmission,
  ClientForm,
  SubmissionQuestion,
} from "@/types/form";
import { getFormByToken } from "../form/repository";
import { createSubmission } from "./repository";
import { createHash } from "crypto";

export async function saveSubmission(responseForm: ClientSubmission) {
  const form = await getFormByToken(responseForm.shareToken);

  if (!form) throw new Error("Data empty");

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
    submissionData.submissionQuestions = responseForm.submissionQuestions.map((r) => {
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
      submissionData.score ? (submissionData.score += score) : (submissionData.score = score);
      return { ...r, correctAnswers: sc.ca, totalScore: sc.ts, score };
    });

    submissionData.totalScore = form.totalScore;
  } else {
    submissionData.submissionQuestions = responseForm.submissionQuestions;
  }

  const data = await createSubmission({
    formId: form.id,
    data:submissionData,
  });

  return !form.options.allowSeeResult ? data : {};
}

export async function getSubmissionForm(token: string) {
  console.log(token);
  if (!token) return { success: false };

  const form = await getFormByToken(token);

  console.error("getSubmission:", form);

  if (!form) return { success: false, data: {} };

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
    options: form.options,
  };

  return { success: true, data: submissionForm };
}
