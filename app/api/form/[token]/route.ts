import { getFormByToken } from "@/lib/server/form/repository";
import { saveForm } from "@/lib/server/form/services";
import { ApiResponse } from "@/lib/server/response";
import { getSubmissionByToken } from "@/lib/server/submission/repository";
import { EditorForm } from "@/types/form";
import { NextRequest } from "next/server";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ token: string }> },
// ) {
//   try {
//     const { token } = await params;

//     if (!token) return ApiResponse.error(400)

//     const form = await getFormByToken(token);

//     if (!form) return ApiResponse.error(404, "Form tidak ditemukan");

//     return ApiResponse.ok(form);
//   } catch (err) {
//     return ApiResponse.error(500)
//   }
// }
