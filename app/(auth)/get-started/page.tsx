"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaHome } from "react-icons/fa";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ForgetPasswordForm from "./components/ForgetPasswordForm";
import VerificationForm from "./components/VerificationForm";

export default function GetStartedPage() {
  const router = useRouter();
  const [action, setAction] = useState<
    "login" | "register" | "verification" | "forget-password"
  >("login");
  const [email, setEmail] = useState<string>("");

  return (
    <div className="container py-0 bg-linear-to-bl from-brand-light via-brand to-brand-dark min-h-screen relative z-1">
      <div className="absolute -z-1 top-0 left-0 rotate-x-180 rotate-y-180 w-full h-2/10 bg-brand-light/25 shape-wave"></div>
      <div className="absolute -z-1 bottom-0 left-0 w-full h-4/10 bg-brand-light/25 shape-wave"></div>
      <div className="absolute -z-1 bottom-0 left-0 w-full h-3/10 bg-brand-light/25 shape-wave"></div>

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
                className={`${!["register", "verification"].includes(action) && "translate-y-10 opacity-0"} transition-all duration-300 absolute max-w-2xl text-7xl text-foreground font-bold text-shadow-xs md:text-shadow-sm text-shadow-brand-light`}
              >
                Halo, Pengguna Baru!
              </h1>
              <h1
                className={`${!["login", "forget-password"].includes(action) && "translate-y-10 opacity-0"} transition-all duration-300 max-w-2xl text-7xl text-foreground font-bold text-shadow-xs md:text-shadow-sm text-shadow-brand-light`}
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

        <div className="bg-foreground w-full max-w-md sm:max-w-lg sm:min-h-screen flex items-center border-2 rounded-lg sm:rounded-none border-border shadow-lg">
          <div className="w-full h-full relative overflow-hidden">
            <div className="flex flex-col gap-6 justify-center py-12 px-6 sm:px-12">
              {action === "login" && (
                <LoginForm
                  email={email}
                  setEmail={setEmail}
                  onActionChange={setAction}
                />
              )}
              {action === "register" && (
                <RegisterForm
                  email={email}
                  setEmail={setEmail}
                  onActionChange={setAction}
                  onSuccess={() => setAction("verification")}
                />
              )}
              {action === "forget-password" && (
                <ForgetPasswordForm
                  email={email}
                  setEmail={setEmail}
                  onActionChange={setAction}
                />
              )}
              {action === "verification" && (
                <VerificationForm email={email} onActionChange={setAction} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
