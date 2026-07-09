"use client";

import { PrimaryBtn, SecondaryBtn } from "@/app/components/ui/buttons";
import { TextInput } from "@/app/components/ui/inputs";
import { SupabaseAuthError } from "@/lib/supabase-auth-error";
import { supabase } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { LuArrowLeft, LuEye, LuEyeOff } from "react-icons/lu";

export default function ForgetPasswordForm({
  email,
  setEmail,
  onActionChange,
}: any) {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; code: string } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const [countdown, setCountdown] = useState(60);
  
  useEffect(() => {
    if (step === "otp" && countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  const handleSendOtp = async (isResend = false) => {
    if (isLoading) return;
    if (!email) {
      return setError({ message: "Email tidak boleh kosong", code: "EMPTY_EMAIL" });
    }
    
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      
      if (resetError) throw new SupabaseAuthError(resetError);

      if (!isResend) {
        setStep("otp");
      }
      setCountdown(60);
      setIsSuccess(true);
    } catch (err) {
      if (err instanceof SupabaseAuthError) {
        setError({ message: err.message, code: err.code });
      } else {
        setError({ message: "Terjadi kesalahan, coba lagi", code: "UNKNOWN_ERROR" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndReset = async () => {
    if (isLoading) return;
    if (!otp || !newPassword) {
      return setError({ message: "OTP dan Password baru harus diisi", code: "EMPTY_FIELDS" });
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "recovery",
      });

      if (verifyError) throw new SupabaseAuthError(verifyError);

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw new SupabaseAuthError(updateError);

      onActionChange("login");
      
    } catch (err) {
      if (err instanceof SupabaseAuthError) {
        setError({ message: err.message, code: err.code });
      } else {
        setError({ message: "Kode OTP tidak valid atau kedaluwarsa", code: "UNKNOWN_ERROR" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="w-max flex items-center gap-2 text-sm font-semibold transition-colors hover:text-muted-darker active:text-brand"
        onClick={() => {
          if (step === "otp") {
            setStep("email");
            setError(null);
            setIsSuccess(false);
            setCountdown(60);
          } else {
            onActionChange("login");
          }
        }}
        disabled={isLoading}
      >
        <LuArrowLeft size={18} /> Kembali
      </button>
      
      <h2 className="text-2xl font-bold">Lupa Password</h2>
      
      {error && (
        <div className="min-h-12 px-5 py-3 rounded-[20px] bg-red-50 border border-red-100 text-sm text-red-600">
          {error.message}
        </div>
      )}

      {isSuccess && step === "otp" && (
        <div className="text-muted-darker text-sm">
          Kode OTP telah dikirim ke <span className="text-brand">{email}</span>
        </div>
      )}

      {step === "email" ? (
        <>
          <div className="w-full">
            <label htmlFor="reset-email">Email</label>
            <TextInput
              className="bg-background mt-3"
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                error && setError(null);
              }}
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          <PrimaryBtn className="w-full" onClick={() => handleSendOtp(false)} disabled={isLoading}>
            Kirim Kode OTP
          </PrimaryBtn>
        </>
      ) : (
        <>
          <div className="w-full">
            <label htmlFor="reset-otp">Kode OTP</label>
            <TextInput
              className="bg-background mt-3 tracking-widest text-center text-xl font-bold"
              id="reset-otp"
              type="text"
              maxLength={8}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                error && setError(null);
              }}
              disabled={isLoading}
              placeholder="• • • • • • • •"
            />
          </div>
          
          <div className="w-full">
            <label htmlFor="new-password">Password Baru</label>
            <div className="relative mt-3 flex items-center">
              <TextInput
                type={showPassword ? "text" : "password"}
                className="bg-background pr-12"
                id="new-password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  error && setError(null);
                }}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 text-muted-darker p-2 grid place-content-center rounded-full transition-colors hover:bg-muted/30 active:bg-muted"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
              </button>
            </div>
          </div>
          <PrimaryBtn className="w-full" onClick={handleVerifyAndReset} disabled={isLoading}>
            Ubah Password
          </PrimaryBtn>

          <div className="flex flex-col items-center gap-2 mt-2">
            <p className="text-sm text-muted-darker">Tidak menerima kode?</p>
            {countdown > 0 ? (
              <span className="text-sm text-brand font-medium">
                Tunggu {countdown} detik...
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleSendOtp(true)}
                disabled={isLoading}
                className="text-sm font-semibold text-brand hover:underline"
              >
                Kirim Ulang OTP
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}