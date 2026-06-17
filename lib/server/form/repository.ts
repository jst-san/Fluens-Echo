import { AppError } from "@/lib/app-error";
import type { Form } from "../../../types/form";
import db from "../db";
import { toCamel, toSnake } from "@/helpers/case-converter";

export async function getFormByToken(shareToken: string) {
  const { data, error } = await db
    .from("forms")
    .select("*")
    .eq("share_token", shareToken)
    .single();

  if (error) {
    console.error("getFormByToken: ", error);
    if(error.code === "22P02") return null;
    throw new AppError(error);
  }

  return toCamel(data) as Form | null;
}