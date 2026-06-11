import { createHash } from "crypto";
import { EditorForm, Form } from "@/types/form";
import { createForm, updateForm } from "./repository";

export async function saveForm(form: EditorForm, method: "insert" | "update") {
  const userUUID = "720568da-9d8d-40b1-9fcd-1421d35b9c94";

  let totalScore = 0;

  form.questions.forEach((q) => {
    totalScore += q.totalScore;
  });

  let data;

  if (method === "insert") {
    data = await createForm({
      title: form.title,
      description: form.description,
      questions: form.questions,
      options: form.options,
      creatorId: userUUID,
      totalScore: totalScore ?? null,
    });
  } else if (method === "update") {
    if (!form.shareToken) throw new Error("Form token empty");
    data = await updateForm({
      title: form.title,
      description: form.description,
      shareToken: form.shareToken,
      questions: form.questions,
      options: form.options,
      creatorId: userUUID,
      totalScore: totalScore ?? null,
    });
  }

  return data;
}
