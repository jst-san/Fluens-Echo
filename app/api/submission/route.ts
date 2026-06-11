import { ApiResponse } from "@/lib/server/response";
import { saveSubmission } from "@/lib/server/submission/services";
import { ClientSubmission } from "@/types/form";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const submission: ClientSubmission = body.submission;

    if (!submission) return ApiResponse.error(400);

    const data = await saveSubmission(submission);

    return ApiResponse.created(data);
  } catch (err) {
    console.log(err);
    ApiResponse.error(500);
  }
}
