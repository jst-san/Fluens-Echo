import { AppError } from "@/lib/app-error";
import { getFormByToken } from "@/lib/server/form/repository";
import { ApiResponse } from "@/lib/server/response";
import { getSubmissionForm } from "@/lib/server/submission/services";
import { SupabaseAuthError } from "@/lib/supabase-auth-error";
import { Form } from "@/types/form";
import { ClientSubmission } from "@/types/form";
import { NextRequest, NextResponse } from "next/server";

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

    const submissionForm = await getSubmissionForm(token);

    if (!submissionForm)
      throw new AppError({
        status: 404,
        message: "Formulir tidak ditemukan.",
        code: "NOT_FOUND",
      });

    return ApiResponse.ok({ submissionForm });
  } catch (err) {
    if (err instanceof AppError || err instanceof SupabaseAuthError) {
      return ApiResponse.error(err.status ?? 500, err);
    } else {
      return ApiResponse.error(500);
    }
  }
}
