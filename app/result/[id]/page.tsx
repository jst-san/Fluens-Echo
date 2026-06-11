"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Question from "../components/Question";
import { SubmissionQuestion } from "@/types/form";

export default function SubmissionPage() {
  const { id } = useParams();
  const [result, setResult] = useState<any | null>();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetch(`/api/submission/${id}`);
      const payload = await res.json();

      if (!res.ok || !payload.success) return;
      setResult(payload.data);
    })();
  }, [id]);

  return result ? (
    <div className="min-h-screen bg-[#f8fbff] text-[#0f172a] font-sans pb-24">
      <div className="md:px-8 pt-12">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Header Card bergaya Fluens UI */}
          <div className="relative bg-white rounded-[32px] p-10 overflow-hidden border border-[#e2e8f0] shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
            {/* Efek Glow Radial di pojok */}
            <div className="absolute -top-[120px] -right-[120px] w-[240px] h-[240px] rounded-full bg-[radial-gradient(circle,rgba(22,139,255,0.15),transparent)]"></div>
            
            <div className="relative z-10">
              <h1 className="text-3xl md:text-[42px] font-bold tracking-tight mb-4 outline-none resize-none">
                {result?.data.title}
              </h1>

              <p className="text-[18px] text-[#64748b] leading-[1.8] outline-none resize-none">
                {result?.data.description}
              </p>
              
              {/* Lencana (Badge) Skor */}
              <div className="mt-8 inline-flex items-center gap-2 h-[36px] px-5 rounded-full bg-[rgba(22,139,255,0.08)] text-[#168bff] text-[15px] font-semibold">
                Skor: {result.data.score} / {result.data.totalScore}
              </div>
            </div>
          </div>

          {/* Pertanyaan */}
          <div className="space-y-6">
            {result.data.submissionQuestions.map((q: SubmissionQuestion) => (
              <Question key={q.id} q={q} />
            ))}
          </div>

          {/* Tombol Aksi */}
          <div className="flex px-4 md:px-0 justify-end pt-4">
            <button 
              onClick={() => router.push("/")}
              className="h-[56px] px-8 bg-white border border-[#e2e8f0] rounded-full font-semibold text-[#0f172a] transition-all duration-250 hover:border-[#168bff] hover:text-[#168bff] hover:-translate-y-[2px] shadow-sm"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    // Fluens UI Loading State (Bentuk aliran bundar)
    <div className="fixed inset-0 bg-[#f8fbff] flex justify-center items-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-[80px] h-[80px]">
          <div className="absolute inset-0 rounded-full border-[8px] border-[#168bff]/20"></div>
          <div className="absolute inset-0 rounded-full border-[8px] border-transparent border-t-[#168bff] animate-spin"></div>
        </div>
        <div className="text-[16px] text-[#64748b] font-medium tracking-wide">
          Menyiapkan aliran data<span className="animate-pulse">...</span>
        </div>
      </div>
    </div>
  );
}