import { NextResponse } from "next/server";

export const ApiResponse = {
  ok: <T>(data: T, message?: string) =>
    NextResponse.json<SuccessResponse<T>>(
      { success: true, data, message },
      { status: 200 },
    ),
  created: <T>(data: T, message?: string) =>
    NextResponse.json<SuccessResponse<T>>(
      { success: true, data, message },
      { status: 201 },
    ),

  error: (status: number, message?: string, errorCode?: string) =>
    NextResponse.json<ErrorResponse>(
      {
        success: false,
        message: message ?? defaultValue[status].message,
        error: errorCode ?? defaultValue[status].errorCode,
      },
      { status },
    ),
};

const defaultValue: Record<number, { message: string; errorCode: string }> = {
  400: { message: "Format tidak valid", errorCode: "BAD_REQUEST" },
  401: { message: "Kredensial tidak valid", errorCode: "UNAUTHORIZED" },
  403: { message: "Anda tidak memiliki akses", errorCode: "FORBIDDEN" },
  404: { message: "Resource tidak ditemukan", errorCode: "NOT_FOUND" },
  422: { message: "Validasi gagal", errorCode: "VALIDATION_ERROR" },
  500: {
    message: "Terjadi masalah, coba lagi",
    errorCode: "INTERNAL_ERROR",
  },
};

type SuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

type ErrorResponse = {
  success: false;
  error: string;
  message: string;
};
