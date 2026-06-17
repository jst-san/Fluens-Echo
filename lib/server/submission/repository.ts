import { Submission, SubmissionData } from "@/types/form";
import db from "../db";
import { toCamel, toSnake } from "@/helpers/case-converter";
import { AppError } from "@/lib/app-error";

export async function getSubmissionsByFormId(formId: string) {
  const { data, error } = await db
    .from("submissions")
    .select("*")
    .eq("form_id", formId);

  if (error) {
    console.error("getSubmissionsByFormId", error);
    if(error.code === "22P02") return null;
    throw new AppError(error)
  }

  return toCamel(data) as Submission[] | null;
}

export async function getSubmissionByToken(uuid: string) {
  const { data, error } = await db
    .from("submissions")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error) {
    console.error("getSubmissionByToken", error);
    if(error.code === "22P02") return null;
    throw new AppError(error)
  }

  return toCamel(data) as Submission | null;
}

export async function createSubmission(
  form: CreateParams,
): Promise<Partial<Submission> | null> {
  const { data, error } = await db
    .from("submissions")
    .insert(toSnake(form))
    .select("uuid")
    .single();

  if (error) {
    console.error("createSubmission:", error);
    throw new AppError(error);
  }

  return toCamel(data);
}

export async function deleteSubmission(uuid: string) {
  const { error } = await db.from("submissions").delete().eq("uuid", uuid);

  if (error) {
    console.error("deleteSubmission:", error);
    throw new AppError(error)
  }

  return true;
}


interface CreateParams {
  formId:number;
  data:SubmissionData
}