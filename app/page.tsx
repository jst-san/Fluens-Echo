"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuPlus } from "react-icons/lu";

export default function Home() {
    const router = useRouter()
  return (
    <div className="min-h-screen bg-[#f8fbff] text-[#0f172a] font-sans pb-24 flex justify-center">
      <button className="mt-8 h-32 w-32 flex items-center justify-center bg-[linear-gradient(135deg,#48a7ff,#168bff,#005ed9)] text-white rounded-4xl hover:-translate-y-1 shadow-[0_12px_30px_rgba(22,139,255,0.3)] transition-all">
        <LuPlus onClick={() => router.push("/form/new/edit")} className="w-16 h-16" />
      </button>
    </div>
  );
}
