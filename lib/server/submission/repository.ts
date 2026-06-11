import { Submission, SubmissionData } from "@/types/form";
import db from "../db";
import { toCamel, toSnake } from "@/helpers/case-converter";

export async function getSubmissionsByFormId(formId: string) {
  const { data, error } = await db
    .from("submissions")
    .select("*")
    .eq("form_id", formId);

  if (error) {
    console.error("getSubmissionsByFormId", error);
    return null;
  }

  return toCamel(data) as Submission[];
}

export async function getSubmissionById(id: number) {
  const { data, error } = await db
    .from("submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getSubmissionById", error);
    return null;
  }

  return toCamel(data) as Submission;
}
export async function getSubmissionByToken(uuid: string) {
  const { data, error } = await db
    .from("submissions")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error) {
    console.error("getSubmissionByToken", error);
    return null;
  }

  return toCamel(data) as Submission;
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
    throw new Error(error.message);
  }

  return toCamel(data);
}

interface CreateParams {
  formId:number;
  data:SubmissionData
}


export async function deleteSubmission(uuid: string) {
  const { error } = await db.from("submissions").delete().eq("uuid", uuid);

  if (error) {
    console.error("deleteSubmission:", error);
    return false;
  }

  return true;
}
