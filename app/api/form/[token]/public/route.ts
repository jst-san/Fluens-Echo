import { getFormByToken } from "@/lib/server/form/repository";
import { ApiResponse } from "@/lib/server/response";
import { getSubmissionForm } from "@/lib/server/submission/services";
import { Form } from "@/types/form";
import { ClientSubmission } from "@/types/form";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    if (!token) return ApiResponse.error(400);

    const result = await getSubmissionForm(token);

    if (!result.success)
      return ApiResponse.error(
        404,
        "Formulir tidak ditemukan",
        "FORM_NOT_FOUND",
      );

    return ApiResponse.ok({submissionForm:result.data});
  } catch (err) {
    return ApiResponse.error(500);
  }
}
