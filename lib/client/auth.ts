import { validateCredentials } from "@/helpers/inputs-validator";
import { supabase } from "../../utils/supabase/client";
import { SupabaseAuthError } from "../supabase-auth-error";

export async function getUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new SupabaseAuthError(error);
  }

  return user;
}

export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new SupabaseAuthError(error);
  }

  return session;
}

export async function signUp(credentials: { email: string; password: string }) {
  validateCredentials(credentials.email, credentials.password);

  const { data, error } = await supabase.auth.signUp(credentials);

  if (error) {
    throw new SupabaseAuthError(error);
  }

  return data;
}

export async function signInWithPassword(credentials: {
  email: string;
  password: string;
}) {
  validateCredentials(credentials.email, credentials.password);

  const { data, error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    throw new SupabaseAuthError(error);
  }

  return data;
}
