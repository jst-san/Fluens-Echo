import { AppError } from "@/lib/app-error";
import { ApiResponse } from "@/lib/server/response";
import { getSubmissionByToken } from "@/lib/server/submission/repository";
import { SupabaseAuthError } from "@/lib/supabase-auth-error";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    if (!token) {
      throw new AppError({
        message: "Format tidak valid.",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    const submission = await getSubmissionByToken(token);

    if (!submission)
      throw new AppError({
        status: 404,
        message: "Respon tidak ditemukan.",
        code: "NOT_FOUND",
      });

    return ApiResponse.ok({submission});
  } catch (err) {
    if (err instanceof AppError || err instanceof SupabaseAuthError) {
      return ApiResponse.error(err.status ?? 500, err);
    } else {
      return ApiResponse.error(500);
    }
  }
}
