"use client";

import { allowScroll } from "@/helpers/dom";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuCheck, LuCopy, LuX, LuExternalLink } from "react-icons/lu";

export function SuccessModal({
  url,
  close,
}: {
  url: string;
  close: () => void;
}) {
  const [copied, setCopied] = useState<boolean | null>(null);
  const router = useRouter();
  
  const handleCopy = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(null), 3000);
      })
      .catch(() => setCopied(false));
  };

  return (
    <div className="fixed inset-0 z-[999] bg-[#0f172a]/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md p-10 rounded-[32px] bg-white flex flex-col items-center text-center shadow-[0_12px_40px_rgba(15,23,42,0.12)] animate-in fade-in zoom-in-95 duration-200">
        
        <div className="w-20 h-20 bg-[#f2f7fd] text-[#168bff] rounded-full flex items-center justify-center mb-6">
          <LuCheck size={40} strokeWidth={3} />
        </div>
        
        <h2 className="font-bold text-[24px] text-[#0f172a] mb-6">Form berhasil disimpan</h2>
        
        <div className="text-left w-full mb-8">
          <label className="text-[14px] font-medium text-[#64748b] ml-2">Bagikan Tautan</label>
          <div className="mt-2 flex bg-[#f8fbff] rounded-full border border-[#e2e8f0] focus-within:border-[#168bff] focus-within:shadow-[0_0_0_5px_rgba(22,139,255,0.12)] overflow-hidden transition-all h-[56px]">
            <input
              value={url}
              readOnly
              className="min-w-0 flex-1 bg-transparent outline-none px-6 text-[14px] text-[#0f172a]"
            />
            <button
              onClick={handleCopy}
              className={`px-6 flex items-center gap-2 text-[14px] font-semibold transition-colors ${
                copied ? "bg-green-500 text-white" : "bg-[#e2e8f0] text-[#0f172a] hover:bg-[#d0d8e2]"
              }`}
            >
              {copied ? <LuCheck size={18} /> : <LuCopy size={18} />}
              {copied ? "Tersalin" : "Salin"}
            </button>
          </div>
        </div>

        <div className="w-full space-y-3">
          <button
            className="w-full h-[56px] bg-[linear-gradient(135deg,#48a7ff,#168bff,#005ed9)] text-white rounded-full font-semibold shadow-[0_12px_30px_rgba(22,139,255,0.25)] hover:-translate-y-[2px] transition-all flex justify-center items-center gap-2"
            onClick={() => {allowScroll();router.push(url)}}
          >
            Buka Halaman Form <LuExternalLink size={18} />
          </button>
          <button
            className="w-full h-[56px] bg-white border border-[#e2e8f0] text-[#0f172a] rounded-full font-semibold hover:border-[#168bff] hover:text-[#168bff] hover:-translate-y-[1px] transition-all"
            onClick={close}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export function ErrorModal({
  cause,
  code,
  close,
}: {
  cause: string;
  code: string;
  close: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[999] bg-[#0f172a]/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md p-10 rounded-[32px] bg-white flex flex-col items-center text-center shadow-[0_12px_40px_rgba(15,23,42,0.12)] animate-in fade-in zoom-in-95 duration-200">
        
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <LuX size={40} strokeWidth={3} />
        </div>
        
        <h2 className="font-bold text-[24px] text-[#0f172a] mb-6">Gagal menyimpan form</h2>
        
        <div className="text-left w-full space-y-4 mb-8">
          <div>
            <div className="text-[14px] font-medium text-[#64748b] ml-2">Penyebab</div>
            <div className="min-h-[48px] px-5 py-3 mt-1 rounded-[20px] bg-red-50 border border-red-100 text-[14px] text-red-600">
              {cause}
            </div>
          </div>
          <div>
            <div className="text-[14px] font-medium text-[#64748b] ml-2">Kode Error</div>
            <div className="min-h-[48px] px-5 py-3 mt-1 rounded-[20px] bg-red-50 border border-red-100 text-[14px] font-mono text-red-600">
              {code}
            </div>
          </div>
        </div>

        <button
          className="w-full h-[56px] bg-white border border-[#e2e8f0] text-[#0f172a] rounded-full font-semibold hover:border-red-500 hover:text-red-500 hover:-translate-y-[1px] transition-all"
          onClick={close}
        >
          Tutup & Coba Lagi
        </button>
      </div>
    </div>
  );
}