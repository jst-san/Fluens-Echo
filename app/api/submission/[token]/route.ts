import { ApiResponse } from "@/lib/server/response";
import { getSubmissionByToken } from "@/lib/server/submission/repository";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    const submission = await getSubmissionByToken(token);

    if (!submission) return ApiResponse.error(404, "Respon tidak ditemukan");

    return ApiResponse.ok(submission);
  } catch (err) {
    return ApiResponse.error(500)
  }
}

{
  /*
    try {
        
    } catch (err) {
        ApiResponse.error(500)
    }
    */
}
