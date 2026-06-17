import { PostgrestError } from '@supabase/supabase-js';

const GENERAL_ERROR_MAP_ID: Record<string, string> = {
  'PGRST116': "Data yang Anda cari tidak ditemukan.", 
  '23505': "Data gagal disimpan karena sudah terdaftar di sistem.", 
  '23503': "Data tidak dapat disimpan karena terikat dengan data lain yang tidak valid.",
  '42P01': "Terjadi kesalahan internal pada konfigurasi tabel database.",
  'P0001': "Tindakan ditolak oleh sistem keamanan database.",
  
  'network_error': "Gagal terhubung ke server. Periksa kembali koneksi internet Anda.",
  'unauthorized': "Akses ditolak. Anda tidak memiliki otoritas untuk melihat data ini.",
  'not_found': "Data tidak ditemukan atau sudah dihapus.",
  'validation_failed': "Format data yang Anda masukkan tidak valid.",
  'unknown': "Terjadi kesalahan internal pada sistem. Silakan coba lagi.",
};

const DEFAULT_GENERAL_MESSAGE = "Terjadi kesalahan pada sistem. Silakan coba lagi nanti.";

interface GeneralErrorPayload {
  code?: string;
  message?: string;
  status?: number;
}

export class AppError extends Error {
  code: string;
  status: number | null;
  originalMessage: string | null;

  constructor(errorPayload: GeneralErrorPayload | PostgrestError | string | any) {
    let code = 'unknown';
    let status: number | null = null;
    let originalMessage: string | null = null;
    let localizedMessage = '';

    if (typeof errorPayload === 'string') {
      localizedMessage = errorPayload;
    } else if (errorPayload && typeof errorPayload === 'object') {
      code = errorPayload.code || 'unknown';
      status = errorPayload.status || null;
      originalMessage = errorPayload.message || null;
      
      localizedMessage = GENERAL_ERROR_MAP_ID[code] || originalMessage || DEFAULT_GENERAL_MESSAGE;
    } else {
      localizedMessage = DEFAULT_GENERAL_MESSAGE;
    }

    super(localizedMessage);

    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.originalMessage = originalMessage;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}