"use client"

import { PrimaryBtn, SecondaryBtn } from "@/app/components/ui/buttons";
import { TextInput } from "@/app/components/ui/inputs";
import { validateCredentials } from "@/helpers/inputs-validator";
import { AppError } from "@/lib/app-error";
import { SupabaseAuthError } from "@/lib/supabase-auth-error";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

export default function RegisterForm({ email, setEmail, onActionChange, onSuccess }: any) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; code: string } | null>(null);

  const handleRegister = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      validateCredentials(email, password);

      const signUpRes = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });

      const isExistingUser =
        signUpRes.data.user &&
        signUpRes.data.user.identities &&
        signUpRes.data.user.identities.length === 0;

      if (isExistingUser) {
        const loginRes = await supabase.auth.signInWithPassword({ email, password });
        if (loginRes.error) {
           onActionChange("login");
           return; 
        } else {
           router.replace("/app");
        }
      } else if (signUpRes.error) {
        throw new SupabaseAuthError(signUpRes.error);
      } else {
        onSuccess();
      }
    } catch (err) {
      if (err instanceof SupabaseAuthError || err instanceof AppError) {
        setError({ message: err.message, code: err.code });
      } else {
        setError({ message: "Terjadi kesalahan, coba lagi", code: "UNKNOWN_ERROR" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center">Daftar di Fluens Echo</h2>
      {error && (
        <div className="min-h-12 px-5 py-3 rounded-[20px] bg-red-50 border border-red-100 text-sm text-red-600">
          {error.message}
        </div>
      )}
      <div className="w-full">
        <label htmlFor="register-email">Email</label>
        <TextInput
          className="bg-background mt-3"
          id="register-email"
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
      <div className="w-full">
        <label htmlFor="register-password">Password</label>
        <div className="relative mt-3 flex items-center">
          <TextInput
            type={showPassword ? "text" : "password"}
            className="bg-background pr-12"
            id="register-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
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
      <PrimaryBtn className="w-full" onClick={handleRegister} disabled={isLoading}>
        Daftar
      </PrimaryBtn>
      <div className="p-3 flex flex-col gap-3 items-center rounded-3xl border border-border">
        <div className="text-muted-darker text-center pt-2">Sudah memiliki akun sebelumnya?</div>
        <SecondaryBtn
          className="w-max h-max py-3 px-6! text-sm"
          onClick={() => onActionChange("login")}
          disabled={isLoading}
        >
          Masuk
        </SecondaryBtn>
      </div>
    </>
  );
}
