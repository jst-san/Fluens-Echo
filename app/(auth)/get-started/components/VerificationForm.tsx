"use client"

import { PrimaryBtn } from "@/app/components/ui/buttons";
import { useEffect, useState } from "react";
import { LuArrowLeft } from "react-icons/lu";
import { supabase } from "@/utils/supabase/client";

export default function VerificationForm({ email, onActionChange }: any) {
  const [emailLink, setEmailLink] = useState<"sent" | "expired">("sent");
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (emailLink === "expired") return;
    const endTime = Date.now() + 60 * 1000;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));

      setSecondsLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        setEmailLink("expired");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [emailLink]);

  return (
    <>
      <button
        onClick={() => {
          onActionChange("login");
          setEmailLink("sent");
        }}
        className="w-max flex items-center gap-2 text-sm font-semibold transition-colors hover:text-muted-darker active:text-brand"
      >
        <LuArrowLeft size={18} /> Kembali
      </button>
      <h2 className="text-2xl font-bold">Silahkan membuka tautan verifikasi</h2>
      <p className="text-muted-darker text-sm">
        Tautan verifikasi telah dikirim ke email <span className="text-brand">{email}</span>
      </p>
      {emailLink === "expired" ? (
        <div className="text-muted-darker text-sm">Tidak menerima email?</div>
      ) : (
        <div className="text-sm">
          <span className="text-muted-darker">Kirim ulang tersedia dalam</span>{" "}
          <span className="text-brand">{secondsLeft}s</span>
        </div>
      )}

      <PrimaryBtn
        className="text-sm h-max w-full py-2 rounded-lg"
        onClick={() => {
          if (emailLink !== "expired") return;
          setSecondsLeft(60);
          supabase.auth.resend({ type: "signup", email: email });
          setEmailLink("sent");
        }}
        disabled={emailLink !== "expired"}
      >
        Kirim ulang
      </PrimaryBtn>
    </>
  );
}