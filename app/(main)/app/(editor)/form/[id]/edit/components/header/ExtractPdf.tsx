"use client";

import AlertModal from "@/app/components/ui/AlertModal";
import { SecondaryBtn } from "@/app/components/ui/buttons";
import { allowScroll, preventScroll } from "@/helpers/dom";
import { AppError } from "@/lib/app-error";
import { useFormEditorStore } from "@/stores/form-editor-store";
import { EditorForm } from "@/types/form";
import { JSX, useEffect, useRef, useState } from "react";
import {
  LuCircleAlert,
  LuFile,
  LuSparkle,
  LuSparkles,
  LuX,
} from "react-icons/lu";
import { extractText } from "unpdf";
import { useShallow } from "zustand/react/shallow";

export default function ExtractPdf() {
  const [openAlert, setOpenAlert] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
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

    if (file.type !== "application/pdf") {
      alert("Hanya PDF yang diperbolehkan");
      return;
    }

    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    preventScroll()
    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();

      const uint8Array = new Uint8Array(arrayBuffer);

      const { text } = await extractText(uint8Array, {
        mergePages: true,
      });

      console.log(text);

      const res = await fetch("/api/form/text-to-form", {
        method: "post",
        body: JSON.stringify({ extracted: text }),
      });

      const { data, error } = await res.json();

      if (error) {
        throw new AppError(error);
      }

      setForm({ ...data.form, shareToken });
    } catch (error) {
      console.error("Gagal memproses PDF:", error);
    } finally {
      allowScroll()
      setLoading(false);
    }
  };
  return (
    <>
      <button
        className={`h-10 px-3 sm:px-4 bg-linear-to-t from-[#b516ff] via-[#6f16ff] to-brand flex items-center text-foreground border border-border text-xs rounded-lg font-semibold transition-all duration-300 hover:brightness-120`}
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
              className="absolute right-3 top-3 p-2 rounded-full transition-all hover:bg-brand-light/10"
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
                className={`h-10 px-3 sm:px-4 bg-linear-to-t from-[#b516ff] via-[#6f16ff] to-brand flex items-center text-foreground border border-border text-xs rounded-lg font-semibold transition-all`}
                onClick={async () => {
                  allowScroll();
                  setOpenModal(false);
                  await handleUpload();
                  setFile(null);
                }}
              >
                Generate
                <LuSparkle className="stroke-0 fill-foreground ml-0.5 mb-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
      {openAlert && (
        <div className="fixed inset-0 z-999 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-10 rounded-4xl bg-foreground flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-amber-50 text-amber-300 rounded-full flex items-center justify-center mb-6">
              <LuCircleAlert size={40} strokeWidth={3} />
            </div>

            <h2 className="font-bold text-2xl mb-6">
              Fitur ini belum tersedia
            </h2>

            <div className="w-full space-y-2">
              <SecondaryBtn
                className="w-full hover:text-amber-300! hover:border-amber-300!"
                onClick={() => {
                  allowScroll();
                  setOpenAlert(false);
                }}
              >
                Tutup
              </SecondaryBtn>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 z-999 bg-black/10 backdrop-blur-xs flex items-center justify-center">
          <div className="flex flex-col gap-6 items-center text-center">
            <div>
              <LuSparkle
                className="rotate-15 stroke-0 fill-[#6f16ff] animate-[3s_bounce_ease-in-out_infinite]"
                size={96}
              />
            </div>
            <div className="text-xl animate-pulse">Mengekstrak</div>
            <div className="mt-6 text-muted-darker">Powered by Gemini</div>
          </div>
        </div>
      )}
    </>
  );
}
