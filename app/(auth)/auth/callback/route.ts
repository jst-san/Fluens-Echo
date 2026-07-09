import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      throw new Error
    }

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      throw new Error
    }

    return NextResponse.redirect(new URL("/app", req.url));
  } catch (err) {
    return NextResponse.redirect(new URL("/get-started", req.url));
  }
}
