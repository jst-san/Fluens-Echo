import type { DBForm, EditorForm, Form } from "../../../types/form";
import db from "../db";
import { toCamel, toSnake } from "@/helpers/case-converter";

export async function getForms(): Promise<Form[]> {
  try {
    const { data, error } = await db.from("forms").select("*");

    if (error) {
      console.error(error);
      return [];
    }

    return (data.map((f) => toCamel(f)) as Form[]) ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getForm(id: string): Promise<Form | null> {
  try {
    const { data, error } = await db
      .from("forms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return toCamel(data) as Form;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getFormByToken(shareToken: string): Promise<Form | null> {
  try {
    const { data, error } = await db
      .from("forms")
      .select("*")
      .eq("share_token", shareToken)
      .single();

    if (error) {
      console.error("getFormByToken: ", error);
      return null;
    }

    return toCamel(data) as Form;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getFormsByUserId(userId: string): Promise<Form[]> {
  try {
    const { data, error } = await db
      .from("forms")
      .select("*")
      .eq("creator_id", userId);

    if (error) {
      console.error(error);
      return [];
    }

    return (data.map((f) => toCamel(f)) as Form[]) ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function createForm(
  form: CreateParams,
): Promise<Partial<Form> | null> {
  const { data, error } = await db
    .from("forms")
    .insert(toSnake(form))
    .select("share_token")
    .single();

  if (error) {
    console.error("createForm:", error);
    throw new Error(error.message);
  }

  return toCamel(data ?? {});
}

export async function updateForm(
  form: UpdateParams,
): Promise<Partial<Form> | null> {
  const { data, error } = await db
    .from("forms")
    .update(toSnake(form))
    .eq("share_token", form.shareToken)

  if (error) {
    console.error("updateForm:", error);
    throw new Error(error.message);
  }

  return toCamel(data ?? {});
}

export async function deleteForm(id: Form["id"]): Promise<boolean> {
  const { error } = await db.from("forms").delete().eq("id", id);

  if (error) {
    console.error("deleteForm:", error);
    return false;
  }

  return true;
}

type UpdateParams = Omit<
  Form,
  "id" | "createdAt" | "updatedAt"
>
type CreateParams = Omit<Form, "id" | "shareToken" | "createdAt" | "updatedAt">;
