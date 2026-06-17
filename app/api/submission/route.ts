import { AppError } from "@/lib/app-error";
import { ApiResponse } from "@/lib/server/response";
import { saveSubmission } from "@/lib/server/submission/services";
import { SupabaseAuthError } from "@/lib/supabase-auth-error";
import { ClientSubmission } from "@/types/form";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const submission: ClientSubmission = body.submission;

    if (!submission)
      throw new AppError({
        status: 400,
      });

    const data = await saveSubmission(submission);

    return ApiResponse.created(data);
  } catch (err) {
    if (err instanceof AppError || err instanceof SupabaseAuthError) {
      return ApiResponse.error(err.status ?? 500, err);
    } else {
      return ApiResponse.error(500);
    }
  }
}
