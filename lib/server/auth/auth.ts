import db from "../db";

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const {data, error} = await db.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("signIn: ", error)
    return null
  }

  
}
