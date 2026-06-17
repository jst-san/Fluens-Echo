import { NextResponse } from "next/server";

export const ApiResponse = {
  ok: <T>(data: T) =>
    NextResponse.json<SuccessResponse<T>>(
      { data },
      { status: 200 },
    ),
  created: <T>(data: T) =>
    NextResponse.json<SuccessResponse<T>>(
      { data },
      { status: 201 },
    ),

  error: (status: number, error?: { message?: string; code?: string }) =>
    NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: {
          message: error?.message ?? defaultValue[status].message,
          code: error?.code ?? defaultValue[status].code,
          status,
        },
      },
      { status },
    ),
};

const defaultValue: Record<number, { message: string; code: string }> = {
  400: { message: "Format tidak valid.", code: "BAD_REQUEST" },
  401: { message: "Kredensial tidak valid.", code: "UNAUTHORIZED" },
  403: { message: "Anda tidak memiliki akses.", code: "FORBIDDEN" },
  404: { message: "Resource tidak ditemukan.", code: "NOT_FOUND" },
  422: { message: "Validasi gagal.", code: "VALIDATION_ERROR" },
  500: {
    message: "Terjadi masalah, coba lagi.",
    code: "INTERNAL_ERROR",
  },
};

type SuccessResponse<T> = {
  data: T
};

type ErrorResponse = {
  success: false;
  error: { message: string; code: string; status: number };
};
