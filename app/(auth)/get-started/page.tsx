"use client";

import { PrimaryBtn, SecondaryBtn } from "@/app/components/ui/buttons";
import { TextInput } from "@/app/components/ui/inputs";
import { validateCredentials } from "@/helpers/inputs-validator";
import { SupabaseAuthError } from "@/lib/supabase-auth-error";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaHome, FaThList } from "react-icons/fa";
import {
  LuArrowLeft,
  LuArrowLeftToLine,
  LuArrowRightLeft,
  LuEye,
  LuEyeOff,
  LuHouse,
} from "react-icons/lu";

export default function GetStartedPage() {
  const [action, setAction] = useState<"login" | "register">("login");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<{ message: string; code: string } | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (isLoading) return;
    try {
      setIsLoading(true);

      validateCredentials(email, password);

      const { data, error } = await (action === "login"
        ? supabase.auth.signInWithPassword({
            email,
            password,
          })
        : supabase.auth.signUp({ email, password }));

      if (error) {
        throw new SupabaseAuthError(error);
      }
    } catch (err) {
      if (err instanceof SupabaseAuthError) {
        return setError({ message: err.message, code: err.code });
      }
      setError({
        message: "Terjadi kesalahan, coba lagi",
        code: "UNKNOWN_ERROR",
      });
    } finally {
      setIsLoading(false);
      router.refresh()
    }
  };
  return (
    <div className="container py-0 bg-linear-to-bl from-brand-light via-brand to-brand-dark min-h-screen relative z-1">
      <div className="absolute -z-1 top-0 left-0 rotate-x-180 rotate-y-180 w-full h-2/10 bg-brand-light/25 [clip-path:shape(from_0_100%,vline_to_0,curve_to_37.5%_5rem_with_25%_5rem,curve_to_62.5%_3rem_with_50%_5rem,curve_to_100%_0_with_75%_1rem,vline_to_100%,_hline_to_0)]"></div>
      <div className="absolute -z-1 bottom-0 left-0 w-full h-4/10 bg-brand-light/25 [clip-path:shape(from_0_100%,vline_to_0,curve_to_37.5%_5rem_with_25%_5rem,curve_to_62.5%_3rem_with_50%_5rem,curve_to_100%_0_with_75%_1rem,vline_to_100%,_hline_to_0)]"></div>
      <div className="absolute -z-1 bottom-0 left-0 w-full h-3/10 bg-brand-light/25 [clip-path:shape(from_0_100%,vline_to_0,curve_to_37.5%_5rem_with_25%_5rem,curve_to_62.5%_3rem_with_50%_5rem,curve_to_100%_0_with_75%_1rem,vline_to_100%,_hline_to_0)]"></div>
      <div className="fixed z-999 inset-0 w-max h-max p-3 pr-6 pb-6 overflow-hidden">
        <button
          className="w-max h-max flex text-foreground transition-colors hover:text-brand active:text-brand peer"
          onClick={() => router.push("/")}
        >
          <FaHome size={18} />
        </button>
        <div className="absolute inset-0 w-full h-full -z-1 bg-foreground rounded-br-full origin-top-left scale-0 transition-all peer-hover:scale-100 peer-active:scale-100 peer-active:bg-muted-light"></div>
      </div>
      <div className="content min-h-screen flex items-center justify-center gap-12">
        <div className="hidden lg:flex sm:min-h-screen flex-1 items-center">
          <div className="space-y-6">
            <div className="relative">
              <h1
                className={`${action !== "register" && "translate-y-10 opacity-0"} transition-all duration-300 absolute max-w-2xl text-7xl text-foreground font-bold text-shadow-sm text-shadow-brand-light`}
              >
                Halo, Pengguna Baru!
              </h1>
              <h1
                className={`${action !== "login" && "translate-y-10 opacity-0"} transition-all duration-300 max-w-2xl text-7xl text-foreground font-bold text-shadow-sm text-shadow-brand-light`}
              >
                Selamat Datang Kembali!
              </h1>
            </div>
            <p className="max-w-2xl text-lg text-muted-light">
              Buat formulir, bagikan kepada responden, dan pantau hasilnya dalam
              satu tempat. Masuk ke akun Anda atau daftar untuk mulai
              menggunakan seluruh fitur.
            </p>
          </div>
        </div>
        <div className="bg-foreground py-12 px-6 sm:px-12 sm:min-w-lg sm:min-h-screen flex flex-col gap-6 justify-center border-2 rounded-lg sm:rounded-none border-border shadow-lg">
          <h2 className="text-3xl font-bold text-center">
            {action === "login" ? "Masuk ke" : "Daftar di"} Fluens Echo
          </h2>
          {error && (
            <div className="min-h-12 px-5 py-3 rounded-[20px] bg-red-50 border border-red-100 text-sm text-red-600">
              {error.message}
            </div>
          )}
          <div className="w-full">
            <label htmlFor="email">Email</label>
            <TextInput
              className="bg-background mt-3"
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                error && setError(null);
              }}
              autoComplete="email"
            />
          </div>
          <div className="w-full">
            <label htmlFor="email">Password</label>
            <div className="relative mt-3 flex items-center">
              <TextInput
                type={showPassword ? "text" : "password"}
                className="bg-background pr-12"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  error && setError(null);
                }}
              />
              <button
                className="absolute right-3 text-muted-darker p-2 grid place-content-center rounded-full transition-colors hover:bg-muted/30 active:bg-muted"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
              </button>
            </div>
          </div>
          <PrimaryBtn className="w-full" onClick={handleSubmit}>
            {action === "login" ? "Masuk" : "Daftar"}
          </PrimaryBtn>
          <div className="p-3 flex flex-col gap-3 items-center rounded-3xl border border-border">
            <div className="text-muted-darker text-center pt-2">
              {action === "login"
                ? "Belum memiliki akun? buat baru"
                : "Sudah memiliki akun sebelumnya?"}
            </div>
            <SecondaryBtn
              className="w-max h-max py-3 px-6! text-sm"
              onClick={() =>
                setAction(action === "login" ? "register" : "login")
              }
            >
              {action === "login" ? "Daftar" : "Masuk"}
            </SecondaryBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
