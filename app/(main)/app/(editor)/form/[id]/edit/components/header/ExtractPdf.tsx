"use client";

import { allowScroll, preventScroll } from "@/helpers/dom";
import { AppError } from "@/lib/app-error";
import { useFormEditorStore } from "@/stores/form-editor-store";
import { EditorForm } from "@/types/form";
import { useState } from "react";
import { LuFile, LuSparkle, LuX } from "react-icons/lu";
import { extractText } from "unpdf";
import { useShallow } from "zustand/react/shallow";
import { SupabaseAuthError } from "@/lib/supabase-auth-error";
import { supabase } from "@/utils/supabase/client";

export default function ExtractPdf() {
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState<{
    message: string;
    code: string;
  } | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const { shareToken, setForm } = useFormEditorStore(
    useShallow((s) => ({ shareToken: s.form.shareToken, setForm: s.setForm })),
  );

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragging(false);

    handleSetFile(e.dataTransfer.files[0]);
  };

  const handleSetFile = (file: File | null) => {
    if (!file) return;

    setUploadError(null);

    if (file.type !== "application/pdf") {
      return setUploadError("Hanya PDF yang diperbolehkan.");
    }

    setFile(file);
  };

  const handleExtract = async () => {
    if (!file) return;

    preventScroll();
    setLoading(true);
    try {
      const session = await supabase.auth.getSession()

      const arrayBuffer = await file.arrayBuffer();

      const uint8Array = new Uint8Array(arrayBuffer);

      const { text } = await extractText(uint8Array, {
        mergePages: true,
      });

      const res = await fetch("/api/form/text-to-form", {
        method: "post",
        body: JSON.stringify({ extracted: text }),
        headers: {
          Authorization: `Bearer ${session.data.session?.access_token}`
        }
      });

      if (!res.ok) {
        const {error} = await res.json()
        throw new AppError(error)
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      let result = "";

      while (true) {
        const { done, value } = await reader?.read();
        if (done) break;

        result += decoder.decode(value);
      }

      let form = JSON.parse(result) as Omit<EditorForm, "shareToken">;

      form.questions.forEach((q, idx) => {
        if (idx === 0) form.totalScore = 0;
        form.totalScore += q.totalScore;
        if (q.type.startsWith("grid")) {
          form.questions[idx].correctAnswers = q.correctAnswers.map(
            (ca: string) => ca.split(",").map((t) => t.trim()),
          );
        }
      });

      setForm({ ...form, shareToken });
      setLoading(false);
      allowScroll();
    } catch (err) {
      setLoading(false);
      if (err instanceof AppError || err instanceof SupabaseAuthError) {
        return setError({ message: err.message, code: err.code });
      }
      setError({
        message: "Terjadi kesalahan, coba lagi",
        code: "UNKNOWN_ERROR",
      });
    }
  };
  return (
    <>
      <button
        className={`h-10 px-3 sm:px-4 bg-linear-to-t from-[#b516ff] via-[#6f16ff] to-brand flex items-center text-foreground border border-border text-xs rounded-lg font-semibold transition-all duration-300 hover:brightness-120 active:brightness-110`}
        onClick={() => {
          preventScroll();
          setOpenModal(true);
        }}
      >
        Ekstrak PDF
        <LuSparkle className="stroke-0 fill-foreground ml-0.5 mb-0.5" />
      </button>
      {openModal && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-6 bg-foreground rounded-3xl space-y-6 border border-border shadow-lg">
            <button
              className="absolute right-3 top-3 p-2 rounded-full transition-all hover:bg-muted-light active:bg-muted"
              onClick={() => {
                allowScroll();
                setOpenModal(false);
              }}
            >
              <LuX size={18} />
            </button>
            <div className="">
              <div className="text-2xl">Upload file</div>
              <div className="text-xs text-muted-darker">
                Format yang didukung: pdf
              </div>
            </div>
            {uploadError && (
              <div className="min-h-12 px-5 py-3 rounded-[20px] bg-red-50 border border-red-100 text-sm text-red-600">
                {uploadError}
              </div>
            )}
            <label
              htmlFor="pdfInput"
              className={`${dragging && "bg-brand-light/10"} duration-300 block w-full rounded-lg border border-border`}
              onDragEnter={() => setDragging(true)}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => handleDrop(e)}
            >
              <div className="flex flex-col justify-center items-center p-6 text-brand-light">
                <LuFile className="stroke-1" size={96} />
                <div className="text-center max-w-full">
                  {file ? (
                    <>
                      <div className="text-sm font-medium flex">
                        <div className="flex-1 line-clamp-1">{file.name}</div>
                        <button
                          className="ml-1 text-muted-darker hover:text-text"
                          onClick={() => setFile(null)}
                        >
                          <LuX size={16} />
                        </button>
                      </div>
                      <div className="text-xs opacity-50">
                        {Number((file.size * 0.000001).toFixed(2))}mb
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm font-medium">
                        Klik untuk upload, atau jatuhkan file
                      </div>
                      <div className="text-xs opacity-50">Maksimal 5mb</div>
                    </>
                  )}
                </div>
              </div>
              <input
                id="pdfInput"
                type="file"
                accept=".pdf"
                size={50}
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files) return;
                  handleSetFile(files[0]);
                }}
                hidden
              />
            </label>
            <div className="flex justify-end">
              <button
                className={`h-10 px-3 sm:px-4 bg-linear-to-t from-[#b516ff] via-[#6f16ff] to-brand flex items-center text-foreground border border-border text-xs rounded-lg font-semibold transition-all duration-300 hover:brightness-120 active:brightness-110`}
                onClick={async () => {
                  setOpenModal(false);
                  await handleExtract();
                  setFile(null);
                }}
              >
                Ekstrak
                <LuSparkle className="stroke-0 fill-foreground ml-0.5 mb-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 z-999 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-10 rounded-4xl bg-foreground flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
              <LuX size={40} strokeWidth={3} />
            </div>

            <h2 className="font-bold text-2xl mb-6">Gagal mengekstrak PDF</h2>

            <div className="text-left w-full space-y-4 mb-8">
              <div>
                <div className="text-sm font-medium text-muted-darker ml-2">
                  Penyebab
                </div>
                <div className="min-h-12 px-5 py-3 mt-1 rounded-[20px] bg-red-50 border border-red-100 text-sm text-red-600">
                  {error.message}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-darker ml-2">
                  Kode Error
                </div>
                <div className="min-h-12 px-5 py-3 mt-1 rounded-[20px] bg-red-50 border border-red-100 text-sm text-red-600">
                  {error.code}
                </div>
              </div>
            </div>

            <button
              className="w-full h-14 bg-foreground border border-border rounded-full font-semibold hover:border-red-500 hover:text-red-500 hover:-translate-y-px transition-all"
              onClick={() => {
                setError(null);
                allowScroll();
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {loading && !error && (
        <div className="fixed inset-0 z-999 bg-black/10 backdrop-blur-xs flex items-center justify-center">
          <div className="w-full max-w-xl space-y-6">
            <div className="flex gap-3 items-center justify-center relative z-1">
              <div className="absolute -z-1 w-48 h-48 rounded-full border-t border-t-[#b516ff] drop-shadow-xs drop-shadow-brand animate-spin"></div>
              <div className="absolute -z-1 w-38 h-38 rounded-full border-t border-t-[#6f16ff] drop-shadow-xs drop-shadow-brand animate-[1s_spin_linear_infinite_reverse]"></div>
              <LuSparkle
                className="stroke-0 fill-[#b516ff] drop-shadow-sm drop-shadow-[#b516ff] animate-[1.5s_scale-pulse_infinite_ease-in-out]"
                size={24}
              />
              <LuSparkle
                className="stroke-0 fill-[#6f16ff] drop-shadow-sm drop-shadow-[#6f16ff] animate-[1.5s_scale-pulse_infinite_ease-in-out] [animation-delay:0.15s]"
                size={24}
              />
              <LuSparkle
                className="stroke-0 fill-brand drop-shadow-sm drop-shadow-brand animate-[1.5s_scale-pulse_infinite_ease-in-out] [animation-delay:0.3s]"
                size={24}
              />
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <div className="text-muted-darker">Powered by Gemini</div>
            <div className="text-sm text-muted-darker">
              AI mungkin saja melakukan kesalahan. Silahkan tinjau kembali
              formulir anda
            </div>
          </div>
        </div>
      )}
    </>
  );
}
