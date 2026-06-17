import { toCamel, toSnake } from "@/helpers/case-converter";
import db from "../db";
import { Session, User } from "@supabase/supabase-js";
import { SupabaseAuthError } from "../../supabase-auth-error";

export async function signUp(
  params: SignUpParams
): Promise<Partial<{user:User|null,session:Session|null}> | null> {
  const res = await db.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: toSnake(params.metadata ?? {}),
    },
  });

  if (res.error) {
    console.error("signUp:", res.error);
    throw new SupabaseAuthError(res.error);
  }

  return toCamel(res.data);
}

export async function signInWithPassword(
  params: SignInParams
): Promise<Partial<User> | null> {
  const { data, error } = await db.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  });

  if (error) {
    console.error("signInWithPassword:", error);
    throw new Error(error.message);
  }

  return toCamel(data.user ?? {});
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await db.auth.getUser();

    if (error) {
      console.error("getCurrentUser: ", error);
      return null;
    }

    if (!user) return null;

    return toCamel(user) as User;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function signOut(): Promise<void> {
  const { error } = await db.auth.signOut();

  if (error) {
    console.error("signOut:", error);
    throw new Error(error.message);
  }
}

export interface SignInParams {
  email: string;
  password:  string;
}

export interface SignUpParams extends SignInParams {
  metadata?: {
    fullName?: string;
    phoneNumber?: string;
    [key: string]: any;
  };
}