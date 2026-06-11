import { saveForm } from "@/lib/server/form/services";
import { ApiResponse } from "@/lib/server/response";
import { EditorForm, Form } from "@/types/form";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const form: EditorForm = body.form;

    if (!form) ApiResponse.error(400);

    const data = await saveForm(form, "insert");

    return ApiResponse.created(data);
  } catch (err) {
    console.error(err);
    return ApiResponse.error(500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const form: EditorForm = body.form;

    if (!form) ApiResponse.error(400);

    const data = await saveForm(form, "update");

    return ApiResponse.ok(data);
  } catch (err) {
    console.error(err);
    return ApiResponse.error(500);
  }
}