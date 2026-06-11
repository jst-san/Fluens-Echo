"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Question from "../components/submission/Question";
import { useFormSubmissionStore } from "@/stores/form-submission-store";
import { LuCheck } from "react-icons/lu";

export default function SubmissionPage() {
  const router = useRouter();
  const { id } = useParams();
  const [status, setStatus] = useState<string>("filling");
  const [result, setResult] = useState<string | null>(null);

  const { form, getByToken, validated } = useFormSubmissionStore();

  useEffect(() => {
    if (!id) return;
    (async () => {
      getByToken(id as string);
    })();
  }, [id, getByToken]);

  const submit = async () => {
    if (status === "sending") return;

    setStatus("sending");

    if (!validated) return setStatus("filling");

    const res = await fetch("/api/submission", {
      method: "post",
      body: JSON.stringify({
        submission: form,
      }),
    });

    const payload = await res.json();

    if (!res.ok || !payload.success) return setStatus("error");

    setResult(payload.data.uuid);

    setStatus("sent");
  };

  return form ? (
    <div className="min-h-screen bg-[#f8fbff] text-[#0f172a] font-sans pb-24">
      <div className="md:px-8 pt-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {status === "sent" ? (
            <div className="relative bg-white rounded-[32px] p-12 overflow-hidden border border-[#e2e8f0] shadow-[0_12px_40px_rgba(15,23,42,0.08)] flex flex-col items-center text-center mt-12">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                <LuCheck size={40} strokeWidth={4} />
              </div>
              <h2 className="text-3xl font-bold text-[#0f172a] mb-2">
                {form?.title}
              </h2>
              <p className="text-[16px] text-[#64748b] mb-8">
                {form?.description}
              </p>

              <div className="inline-flex items-center gap-2 h-[36px] px-5 rounded-full bg-green-50 border border-green-100 text-green-600 font-semibold mb-8">
                Respon terkirim
              </div>

              <div className="w-full space-y-3">
                {status === "sent" && result && (
                  <button
                    className="w-full h-[56px] bg-[linear-gradient(135deg,#48a7ff,#168bff,#005ed9)] text-white rounded-full font-semibold shadow-[0_12px_30px_rgba(22,139,255,0.25)] hover:-translate-y-[2px] transition-all flex justify-center items-center gap-2"
                    onClick={() => router.push(`/result/${result}`)}
                  >
                    Lihat hasil
                  </button>
                )}
                <button
                  className="w-full h-[56px] bg-white border border-[#e2e8f0] text-[#0f172a] rounded-full font-semibold hover:border-[#168bff] hover:text-[#168bff] hover:-translate-y-[1px] transition-all"
                  onClick={() => getByToken(id as string)}
                >
                  Kirim respon lain
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6" spellCheck={false}>
              <div className="relative bg-white rounded-[32px] p-10 overflow-hidden border border-[#e2e8f0] shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
                <div className="absolute -top-[120px] -right-[120px] w-[240px] h-[240px] rounded-full bg-[radial-gradient(circle,rgba(22,139,255,0.15),transparent)]"></div>

                <div className="relative z-10">
                  <h1 className="text-3xl md:text-[42px] font-bold tracking-tight mb-4 outline-none resize-none">
                    {form?.title}
                  </h1>
                  <p className="text-[18px] text-[#64748b] leading-[1.8] outline-none resize-none">
                    {form?.description}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {form.submissionQuestions.map((q) => (
                  <Question key={q.id} q={q} />
                ))}
              </div>

              <div className="flex px-4 md:px-0 gap-4 justify-end pt-4">
                <button
                  className="h-[56px] px-8 bg-white border border-[#e2e8f0] rounded-full font-semibold text-[#0f172a] transition-all hover:border-[#168bff] hover:text-[#168bff] hover:-translate-y-[2px] shadow-sm"
                  onClick={() => router.push("/")}
                >
                  Kembali
                </button>
                <button
                  className="h-[56px] px-8 bg-[linear-gradient(135deg,#48a7ff,#168bff,#005ed9)] text-white rounded-full font-semibold transition-all hover:-translate-y-[2px] shadow-[0_12px_30px_rgba(22,139,255,0.25)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
                  disabled={status === "sending" || !validated}
                  onClick={submit}
                >
                  {status === "sending" ? "Mengirim..." : "Kirim"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="fixed inset-0 bg-[#f8fbff] flex justify-center items-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-[80px] h-[80px]">
          <div className="absolute inset-0 rounded-full border-[8px] border-[#168bff]/20"></div>
          <div className="absolute inset-0 rounded-full border-[8px] border-transparent border-t-[#168bff] animate-spin"></div>
        </div>
        <div className="text-[16px] text-[#64748b] font-medium tracking-wide">
          Menyiapkan formulir<span className="animate-pulse">...</span>
        </div>
      </div>
    </div>
  );
}
