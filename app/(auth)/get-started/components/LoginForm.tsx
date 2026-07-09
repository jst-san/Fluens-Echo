"use client"

import { PrimaryBtn, SecondaryBtn } from "@/app/components/ui/buttons";
import { TextInput } from "@/app/components/ui/inputs";
import { validateCredentials } from "@/helpers/inputs-validator";
import { SupabaseAuthError } from "@/lib/supabase-auth-error";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

export default function LoginForm({ email, setEmail, onActionChange }: any) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; code: string } | null>(null);

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      validateCredentials(email, password);
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw new SupabaseAuthError(authError);
      router.replace("/app");
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

  return (
    <>
      <h2 className="text-3xl font-bold text-center">Masuk ke Fluens Echo</h2>
      {error && (
        <div className="min-h-12 px-5 py-3 rounded-[20px] bg-red-50 border border-red-100 text-sm text-red-600">
          {error.message}
        </div>
      )}
      <div className="w-full">
        <label htmlFor="login-email">Email</label>
        <TextInput
          className="bg-background mt-3"
          id="login-email"
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
        <div className="flex justify-between items-center">
          <label htmlFor="login-password">Password</label>
          <button 
            type="button" 
            onClick={() => onActionChange("forget-password")} 
            className="text-sm font-semibold text-brand hover:underline transition-all"
            disabled={isLoading}
          >
            Lupa password?
          </button>
        </div>
        <div className="relative mt-3 flex items-center">
          <TextInput
            type={showPassword ? "text" : "password"}
            className="bg-background pr-12"
            id="login-password"
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
      <PrimaryBtn className="w-full" onClick={handleLogin} disabled={isLoading}>
        Masuk
      </PrimaryBtn>
      <div className="p-3 flex flex-col gap-3 items-center rounded-3xl border border-border">
        <div className="text-muted-darker text-center pt-2">Belum memiliki akun? buat baru</div>
        <SecondaryBtn
          className="w-max h-max py-3 px-6! text-sm"
          onClick={() => onActionChange("register")}
          disabled={isLoading}
        >
          Daftar
        </SecondaryBtn>
      </div>
    </>
  );
}