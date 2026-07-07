"use client";

import { PrimaryBtn, SecondaryBtn } from "@/app/components/ui/buttons";
import CopyText from "@/app/components/ui/CopyText";
import { allowScroll } from "@/helpers/dom";
import { LuCheck, LuX, LuExternalLink } from "react-icons/lu";

export function SuccessModal({
  url,
  close,
}: {
  url: string;
  close: () => void;
}) {

  return (
    <div className="fixed inset-0 z-999 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md p-10 rounded-4xl bg-foreground flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-brand-light/10 text-brand rounded-full flex items-center justify-center mb-6">
          <LuCheck size={40} strokeWidth={3} />
        </div>

        <h2 className="font-bold text-2xl mb-6">Formulir berhasil disimpan</h2>

        <div className="text-left w-full mb-8">
          <label className="text-sm font-medium text-muted-darker ml-2">
            Bagikan Tautan
          </label>
          <CopyText className="mt-2" text={url} />
        </div>

        <div className="w-full space-y-3">
          <PrimaryBtn
            className="w-full flex items-center justify-center gap-2"
            onClick={() => {
              allowScroll();
              window.open(url, "_blank")
            }}
          >
            Buka Halaman Formulir <LuExternalLink size={18} />
          </PrimaryBtn>
          <SecondaryBtn className="w-full" onClick={close}>
            Tutup
          </SecondaryBtn>
        </div>
      </div>
    </div>
  );
}

export function ErrorModal({
  message,
  code,
  close,
}: {
  message: string;
  code: string;
  close: () => void;
}) {
  return (
    <div className="fixed inset-0 z-999 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md p-10 rounded-4xl bg-foreground flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <LuX size={40} strokeWidth={3} />
        </div>

        <h2 className="font-bold text-2xl mb-6">Gagal menyimpan form</h2>

        <div className="text-left w-full space-y-4 mb-8">
          <div>
            <div className="text-sm font-medium text-muted-darker ml-2">
              Penyebab
            </div>
            <div className="min-h-12 px-5 py-3 mt-1 rounded-[20px] bg-red-50 border border-red-100 text-sm text-red-600">
              {message}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-darker ml-2">
              Kode Error
            </div>
            <div className="min-h-12 px-5 py-3 mt-1 rounded-[20px] bg-red-50 border border-red-100 text-sm text-red-600">
              {code}
            </div>
          </div>
        </div>

        <button
          className="w-full h-14 bg-foreground border border-border rounded-full font-semibold hover:border-red-500 hover:text-red-500 hover:-translate-y-px transition-all"
          onClick={close}
        >
          Tutup & Coba Lagi
        </button>
      </div>
    </div>
  );
}
