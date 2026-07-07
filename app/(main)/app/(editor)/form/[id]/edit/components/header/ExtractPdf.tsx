"use client";

import AlertModal from "@/app/components/ui/AlertModal";
import { SecondaryBtn } from "@/app/components/ui/buttons";
import { allowScroll, preventScroll } from "@/helpers/dom";
import { useFormEditorStore } from "@/stores/form-editor-store";
import { EditorForm } from "@/types/form";
import { JSX, useEffect, useRef, useState } from "react";
import { LuCircleAlert, LuFile, LuSparkle, LuX } from "react-icons/lu";

export default function ExtractPdf() {
  const [openAlert, setOpenAlert] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const setForm = useFormEditorStore((s) => s.setForm);

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

    setLoading(true);

    try {
      // 1. Secara dinamis me-load pdfjs-dist hanya di browser
      const pdfjs = await import("pdfjs-dist");

      // 2. Set worker secara lokal agar terhindar dari CORS
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.mjs",
        import.meta.url,
      ).toString();

      // 3. Baca file PDF dari input ke ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // 4. Load dokumen PDF
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      console.log(`Total halaman: ${pdf.numPages}`);

      interface PdfElement {
        type: "text" | "image";
        text?: string;
        imgName?: string;
        page?: any;
        y: number;
      }

      let allElements: PdfElement[] = [];

      // Loop per halaman untuk mengambil teks dan melacak koordinat Y
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        const textContent = await page.getTextContent();
        textContent.items.forEach((item: any) => {
          if (item.str.trim()) {
            const yPos = item.transform[5] * -1;
            allElements.push({
              type: "text",
              text: item.str,
              y: yPos + i * 10000,
            });
          }
        });

        const operatorList = await page.getOperatorList();
        let currentYForImg = 0;

        for (let j = 0; j < operatorList.fnArray.length; j++) {
          if (operatorList.fnArray[j] === pdfjs.OPS.transform) {
            currentYForImg = operatorList.argsArray[j][5] * -1;
          }

          if (operatorList.fnArray[j] === pdfjs.OPS.paintImageXObject) {
            const imageName = operatorList.argsArray[j][0];
            allElements.push({
              type: "image",
              imgName: imageName,
              page: page,
              y: currentYForImg + i * 10000,
            });
          }
        }
      }

      // Urutkan berdasarkan posisi Y
      allElements.sort((a, b) => a.y - b.y);

      // LANGKAH 1: GABUNGKAN TEKS SEBARIS
      let mergedElements: PdfElement[] = [];
      let currentElement: PdfElement | null = null;
      const Y_TOLERANCE = 5;

      allElements.forEach((el) => {
        if (!currentElement) {
          currentElement = { ...el };
          return;
        }

        if (
          el.type === "text" &&
          currentElement.type === "text" &&
          Math.abs(el.y - currentElement.y) < Y_TOLERANCE
        ) {
          currentElement.text += " " + el.text;
        } else {
          mergedElements.push(currentElement);
          currentElement = { ...el };
        }
      });
      if (currentElement) mergedElements.push(currentElement);

      // ========================================================
      // LANGKAH 2: MATS (MAPPING) DAN FORMAT SESUAI RESPONSE SCHEMA
      // ========================================================

      interface OptionItem {
        id: string;
        title: string;
      }
      interface QuestionItem {
        id: string;
        title: string;
        type: "text" | "radio" | "checkbox" | "select";
        totalScore: number;
        correctAnswers: string[];
        options: OptionItem[];
        required: boolean;
        _tempImages?: any[]; // Menyimpan data gambar internal sementara sebelum di-upload
      }

      let questions: QuestionItem[] = [];
      let currentQuestion: QuestionItem | null = null;

      const questionRegex = /^(\d+)[.)\s\-]/;

      mergedElements.forEach((el) => {
        if (el.type === "text" && el.text) {
          const trimmedText = el.text.trim();
          const match = trimmedText.match(questionRegex);

          if (match) {
            if (currentQuestion) questions.push(currentQuestion);

            // Inisialisasi awal objek Question sesuai dengan skema properti Anda
            currentQuestion = {
              id: `q-${Date.now()}-${match[1]}`,
              title: trimmedText.replace(questionRegex, "").trim(),
              type: "radio", // Default ke radio button (pilihan ganda tunggal)
              totalScore: 0,
              correctAnswers: [], // Diisi manual lewat UI/kunci jawaban nanti
              options: [],
              required: true, // Default wajib diisi
              _tempImages: [],
            };
          } else {
            if (currentQuestion) {
              // Deteksi Opsi Pilihan Ganda (A., B., C., D.)
              if (/^[A-D][.)\s]/.test(trimmedText)) {
                // Bersihkan teks "A. " agar title opsi bersih
                const optionTitle = trimmedText
                  .replace(/^[A-D][.)\s]/, "")
                  .trim();

                currentQuestion.options.push({
                  id: `o-${Date.now()}-${currentQuestion.options.length}`,
                  title: optionTitle,
                });
              } else {
                // Jika terdeteksi indikasi teks "Jawaban benar lebih dari satu" (Contoh di soal no 30 Anda)
                if (trimmedText.toLowerCase().includes("lebih dari satu")) {
                  currentQuestion.type = "checkbox";
                }

                // Gabungkan lanjutan narasi soal
                currentQuestion.title += "\n" + trimmedText;
              }
            }
          }
        } else if (el.type === "image" && el.imgName) {
          if (currentQuestion) {
            currentQuestion._tempImages?.push({
              imgName: el.imgName,
              page: el.page,
            });
            // Opsional: Anda bisa tambahkan teks penanda gambar di dalam title soal
            currentQuestion.title += `\n[Gambar: ${el.imgName}]`;
          }
        }
      });

      if (currentQuestion) questions.push(currentQuestion);

      // Hitung total score (Contoh: Berikan nilai 5 untuk setiap butir soal yang berhasil diekstrak)
      const DEFAULT_SCORE_PER_QUESTION = 1;
      questions.forEach((q) => {
        q.totalScore = DEFAULT_SCORE_PER_QUESTION;
      });

      // Bungkus data ke dalam format Root Object sesuai dengan responseSchema Anda
      const formattedResponseData = {
        title: file.name.replace(".pdf", ""), // Mengambil judul dari nama file PDF
        description: `Hasil impor otomatis dari file ${file.name} berisi ${questions.length} soal.`,
        questions: questions.map(({ _tempImages, ...rest }) => rest), // Hapus property temporary gambar saat dilem ke state
        settings: {
          isQuiz: true,
          allowSeeWrongAnswers: true,
          allowSeeCorrectAnswers: true,
          allowSeeScore: true,
          defaultScoreValue: DEFAULT_SCORE_PER_QUESTION,
          shuffleQuestions: false,
          allowSeeResult: true,
          questionRequiredDefault: true,
        },
        totalScore: questions.length * DEFAULT_SCORE_PER_QUESTION,
      };

      console.log("Format JSON Sesuai Schema:", formattedResponseData);

      // Silakan pasang ke state Anda di bawah ini
      // setSchemaData(formattedResponseData);
      setForm(formattedResponseData as EditorForm);
    } catch (error) {
      console.error("Gagal memproses PDF:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <button
        className={`h-10 px-3 sm:px-4 bg-linear-to-t from-[#b516ff] via-[#6f16ff] to-brand flex items-center text-foreground border border-border text-xs rounded-lg font-semibold transition-all duration-300 hover:brightness-120`}
        onClick={() => {
          preventScroll();
          setOpenAlert(true);
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
    </>
  );
}
