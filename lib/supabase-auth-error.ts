import { AuthError } from "@supabase/supabase-js";

const ERROR_MAP_ID:Record<string, string> = {
  invalid_credentials: "Email atau kata sandi yang Anda masukkan salah.",
  same_password: "Kata sandi baru tidak boleh sama dengan kata sandi lama.",
  weak_password: "Kata sandi terlalu lemah. Gunakan kombinasi huruf, angka, dan simbol.",
  user_banned: "Akun Anda telah ditangguhkan. Silakan hubungi dukungan.",
  user_not_found: "Pengguna dengan data tersebut tidak ditemukan.",
  user_already_exists: "Pengguna dengan data tersebut sudah terdaftar.",
  no_authorization: "Anda tidak memiliki otoritas untuk melakukan tindakan ini.",
  not_admin: "Akses ditolak. Tindakan ini hanya untuk administrator.",
  email_address_invalid: "Format alamat email tidak valid.",
  email_address_not_authorized: "Alamat email ini tidak diizinkan untuk mendaftar.",
  email_exists: "Email ini sudah digunakan oleh akun lain.",
  email_not_confirmed: "Silakan konfirmasi email Anda terlebih dahulu.",
  phone_exists: "Nomor telepon ini sudah digunakan oleh akun lain.",
  phone_not_confirmed: "Silakan konfirmasi nomor telepon Anda terlebih dahulu.",
  signup_disabled: "Pendaftaran akun baru sedang dinonaktifkan.",
  over_request_rate_limit: "Terlalu banyak permintaan. Silakan coba lagi dalam beberapa menit.",
  over_email_send_rate_limit: "Batas pengiriman email habis. Silakan tunggu beberapa saat.",
  over_sms_send_rate_limit: "Batas pengiriman SMS habis. Silakan tunggu beberapa saat.",
  sms_send_failed: "Gagal mengirim SMS. Periksa kembali nomor Anda.",
  request_timeout: "Permintaan waktu habis (timeout). Periksa koneksi internet Anda.",
  otp_disabled: "Metode masuk dengan OTP sedang dinonaktifkan.",
  otp_expired: "Kode OTP Anda telah kedaluwarsa. Silakan minta kode baru.",
  session_expired: "Sesi Anda telah berakhir. Silakan masuk kembali.",
  session_not_found: "Sesi tidak ditemukan atau sudah tidak valid.",
  flow_state_expired: "Alur autentikasi telah kedaluwarsa. Silakan ulangi dari awal.",
  flow_state_not_found: "Alur autentikasi tidak valid atau tidak ditemukan.",
  refresh_token_already_used: "Sesi telah diperbarui di perangkat lain. Silakan masuk kembali.",
  refresh_token_not_found: "Token pembaruan sesi tidak ditemukan.",
  reauthentication_needed: "Silakan lakukan autentikasi ulang untuk melanjutkan.",
  reauthentication_not_valid: "Autentikasi ulang gagal atau tidak valid.",
  mfa_challenge_expired: "Tantangan MFA telah kedaluwarsa. Silakan coba lagi.",
  mfa_factor_name_conflict: "Nama faktor MFA ini sudah digunakan.",
  mfa_factor_not_found: "Faktor MFA tidak ditemukan.",
  mfa_ip_address_mismatch: "Perubahan IP terdeteksi selama proses verifikasi keamanan.",
  mfa_phone_enroll_not_enabled: "Pendaftaran MFA lewat telepon belum diaktifkan.",
  mfa_phone_verify_not_enabled: "Verifikasi MFA lewat telepon belum diaktifkan.",
  mfa_totp_enroll_not_enabled: "Pendaftaran MFA lewat aplikasi (TOTP) belum diaktifkan.",
  mfa_totp_verify_not_enabled: "Verifikasi MFA lewat aplikasi (TOTP) belum diaktifkan.",
  mfa_verification_failed: "Verifikasi dua faktor (MFA) gagal. Kode salah.",
  mfa_verification_rejected: "Verifikasi dua faktor ditolak.",
  mfa_verified_factor_exists: "Faktor MFA yang terverifikasi sudah ada.",
  mfa_web_authn_enroll_not_enabled: "Pendaftaran MFA lewat WebAuthn belum diaktifkan.",
  mfa_web_authn_verify_not_enabled: "Verifikasi MFA lewat WebAuthn belum diaktifkan.",
  too_many_enrolled_mfa_factors: "Anda telah mencapai batas maksimum metode MFA.",
  anonymous_provider_disabled: "Fitur masuk tanpa identitas (Anonymous) sedang dinonaktifkan.",
  bad_code_verifier: "Verifikasi kode OAuth gagal. Silakan coba masuk kembali.",
  bad_oauth_callback: "Terjadi kesalahan saat kembali dari penyedia layanan (OAuth callback).",
  bad_oauth_state: "Sesi OAuth tidak valid atau sudah kedaluwarsa.",
  oauth_provider_not_supported: "Metode masuk dengan penyedia pihak ketiga ini tidak didukung.",
  provider_disabled: "Metode masuk ini sedang dinonaktifkan.",
  email_provider_disabled: "Metode masuk dengan email sedang dinonaktifkan.",
  phone_provider_disabled: "Metode masuk dengan nomor telepon sedang dinonaktifkan.",
  provider_email_needs_verification: "Email dari penyedia pihak ketiga Anda harus diverifikasi terlebih dahulu.",
  identity_already_exists: "Identitas ini sudah terhubung dengan akun lain.",
  identity_not_found: "Identitas akun tidak ditemukan.",
  manual_linking_disabled: "Fitur untuk menghubungkan akun secara manual sedang dinonaktifkan.",
  saml_assertion_no_email: "Data SAML tidak menyertakan alamat email yang valid.",
  saml_assertion_no_user_id: "Data SAML tidak menyertakan ID pengguna yang valid.",
  saml_entity_id_mismatch: "ID Entitas SAML tidak cocok.",
  saml_idp_already_exists: "Penyedia Identitas (IdP) SAML ini sudah terdaftar.",
  saml_idp_not_found: "Penyedia Identitas (IdP) SAML tidak ditemukan.",
  saml_metadata_fetch_failed: "Gagal mengambil data metadata SAML.",
  saml_provider_disabled: "Penyedia layanan SAML sedang dinonaktifkan.",
  saml_relay_state_expired: "Status penerusan (Relay State) SAML telah kedaluwarsa.",
  saml_relay_state_not_found: "Status penerusan (Relay State) SAML tidak ditemukan.",
  sso_domain_already_exists: "Domain SSO ini sudah terdaftar.",
  sso_provider_not_found: "Penyedia layanan SSO tidak ditemukan.",
  user_sso_managed: "Akun Anda dikelola melalui SSO. Silakan masuk menggunakan SSO perusahaan Anda.",
  bad_json: "Format data yang dikirim rusak atau tidak valid (Bad JSON).",
  bad_jwt: "Token keamanan tidak valid atau telah dimanipulasi.",
  captcha_failed: "Verifikasi Captcha gagal. Silakan centang ulang.",
  conflict: "Terjadi konflik data pada sistem.",
  validation_failed: "Validasi data gagal. Periksa kembali input Anda.",
  unexpected_audience: "Target audiens token tidak sesuai.",
  unexpected_failure: "Terjadi kesalahan sistem yang tidak terduga.",
  insufficient_aal: "Tingkat keamanan akun Anda terlalu rendah. Diperlukan verifikasi tambahan.",
  email_conflict_identity_not_deletable: "Email tidak dapat diubah karena terikat dengan identitas utama.",
  single_identity_not_deletable: "Identitas terakhir tidak dapat dihapus demi keamanan akun.",
  hook_timeout: "Proses verifikasi internal mengalami kehabisan waktu.",
  hook_timeout_after_retry: "Proses verifikasi internal gagal setelah beberapa kali percobaan.",
  hook_payload_invalid_content_type: "Tipe konten data verifikasi tidak valid.",
  hook_payload_over_size_limit: "Ukuran data verifikasi melebihi batas yang ditentukan.",
};

const DEFAULT_MESSAGE = "Terjadi kesalahan pada sistem autentikasi. Silakan coba lagi.";

export class SupabaseAuthError extends Error {
  code:string
  status:number|null
  constructor(supabaseError:AuthError) {
    const code = supabaseError?.code || supabaseError?.message || 'unknown';
    
    const localizedMessage = ERROR_MAP_ID[code] || DEFAULT_MESSAGE;

    super(localizedMessage);

    this.name = "SupabaseAuthError";
    this.code = code;
    this.status = supabaseError?.status || null;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SupabaseAuthError);
    }
  }
}