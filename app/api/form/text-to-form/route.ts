import ai from "@/lib/server/google-ai";
import { ApiResponse } from "@/lib/server/response";
import { supabase } from "@/utils/supabase/admin";
import { Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return ApiResponse.error(401);
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return ApiResponse.error(401);
    }
    
    const body = await req.json();
    const extracted = body.extracted;

    if (!extracted) {
      return ApiResponse.error(400, {
        message: "Mohon upload file pdf terlebih dahulu",
      });
    }

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
        },
        description: {
          type: Type.STRING,
        },
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: {
                type: Type.STRING,
              },
              title: {
                type: Type.STRING,
              },
              type: {
                type: Type.STRING,
                enum: [
                  "text",
                  "radio",
                  "checkbox",
                  "select",
                  "grid-radio",
                  "grid-checkbox",
                ],
              },
              totalScore: {
                type: Type.NUMBER,
              },
              correctAnswers: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
              },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: {
                      type: Type.STRING,
                    },
                    title: {
                      type: Type.STRING,
                    },
                  },
                  required: ["id", "title"],
                },
              },
              grid: {
                type: Type.OBJECT,
                properties: {
                  rows: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: {
                          type: Type.STRING,
                        },
                        title: {
                          type: Type.STRING,
                        },
                        totalScore: {
                          type: Type.NUMBER,
                        },
                      },
                      required: ["id", "title", "totalScore"],
                    },
                  },
                  columns: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: {
                          type: Type.STRING,
                        },
                        title: {
                          type: Type.STRING,
                        },
                      },
                      required: ["id", "title"],
                    },
                  },
                },
                required: ["rows", "columns"],
              },
              required: {
                type: Type.BOOLEAN,
              },
              attached: {
                type: Type.OBJECT,
                nullable: true,
                properties: {
                  image: {
                    type: Type.STRING,
                  },
                },
              },
            },
            required: [
              "id",
              "title",
              "type",
              "totalScore",
              "correctAnswers",
              "options",
              "grid",
              "required",
            ],
          },
        },
        settings: {
          type: Type.OBJECT,
          properties: {
            isQuiz: {
              type: Type.BOOLEAN,
            },
            allowSeeWrongAnswers: {
              type: Type.BOOLEAN,
            },
            allowSeeCorrectAnswers: {
              type: Type.BOOLEAN,
            },
            allowSeeScore: {
              type: Type.BOOLEAN,
            },
            defaultScoreValue: {
              type: Type.NUMBER,
            },
            shuffleQuestions: {
              type: Type.BOOLEAN,
            },
            allowSeeResult: {
              type: Type.BOOLEAN,
            },
            questionRequiredDefault: {
              type: Type.BOOLEAN,
            },
          },
          required: [
            "isQuiz",
            "allowSeeWrongAnswers",
            "allowSeeCorrectAnswers",
            "allowSeeScore",
            "defaultScoreValue",
            "shuffleQuestions",
            "allowSeeResult",
            "questionRequiredDefault",
          ],
        },
        totalScore: {
          type: Type.NUMBER,
        },
      },
      required: ["title", "description", "questions", "settings", "totalScore"],
    };
    const prompt = `
              Tugasmu adalah merapikan teks hasil ekstraksi pdf menjadi formulir atau kuis yang terstruktur, lalu ubah menjadi format JSON yang diminta tanpa menghilangkan satupun informasi.
              
              ATURAN PALING PENTING (WAJIB)
              - Jangan meringkas, menyederhanakan, memperbaiki, atau menulis ulang isi soal.
              - Salin seluruh isi setiap soal apa adanya dari hasil ekstraksi PDF.
              - Semua kalimat, paragraf, tabel, daftar, rumus, contoh, ilustrasi, petunjuk, kasus, maupun informasi lain yang berada sebelum pilihan jawaban merupakan bagian dari pertanyaan dan WAJIB dimasukkan ke dalam question.title.
              - Jangan menghapus kalimat yang dianggap tidak penting.
              - Jangan menghilangkan konteks.
              - Jangan menggabungkan beberapa paragraf menjadi satu kalimat.
              - Pertahankan urutan paragraf persis seperti sumber.
              - Pertahankan line break (\n), bullet list, dan penomoran jika ada.
              - Jika soal terdiri dari beberapa paragraf, seluruh paragraf harus tetap berada di question.title.
              - Jika soal memiliki stimulus (bacaan, kasus, artikel, percakapan, tabel, kode program, gambar yang telah diekstrak menjadi teks, dll), seluruh stimulus harus dimasukkan ke question.title sebelum pertanyaan.
              - Pilihan jawaban hanya boleh dipisahkan ke options.
              - Jangan memindahkan isi stimulus ke field lain.
              - Jangan membuat versi yang lebih singkat.
              - Jangan melakukan parafrase.
              - Output harus mempertahankan seluruh informasi dari input 100%.
              
              VALIDASI SEBELUM MENGIRIM:
              Untuk setiap soal pastikan:
              1. Tidak ada kalimat pada soal asli yang hilang.
              2. Semua paragraf masih ada.
              3. Semua petunjuk masih ada.
              4. Semua contoh masih ada.
              5. Semua konteks masih ada.
              Jika ada satu kalimat yang hilang, lanjutkan memperbaiki sebelum menghasilkan output akhir.

              NORMALISASI FORMAT TEKS (WAJIB)

              Rapikan format teks hasil OCR/PDF TANPA mengubah isi.
              
              Yang BOLEH dilakukan:
              - Hapus spasi ganda atau lebih menjadi satu spasi.
              - Hapus spasi di awal dan akhir setiap baris.
              - Gabungkan baris yang sebenarnya merupakan satu kalimat tetapi terpotong karena line break hasil OCR.
              - Hapus baris kosong yang tidak memiliki fungsi.
              - Pertahankan line break hanya jika memang memisahkan paragraf, daftar, tabel, pilihan jawaban, atau bagian penting lainnya.
              - Rapikan indentasi yang tidak konsisten.
              - Pertahankan penomoran, bullet list, rumus, tabel, dan struktur dokumen.
              - Jika sebuah paragraf terpotong menjadi beberapa baris karena lebar halaman PDF, gabungkan kembali menjadi satu paragraf yang utuh.
              - Pastikan setiap paragraf memiliki format yang rapi dan mudah dibaca.
              
              Yang TIDAK BOLEH dilakukan:
              - Mengubah kata.
              - Mengganti susunan kalimat.
              - Memperbaiki ejaan.
              - Melakukan parafrase.
              - Meringkas isi.
              - Menghapus kalimat.
              - Menambahkan informasi baru.
              - Mengubah urutan informasi.
              
              Normalisasi hanya boleh mengubah whitespace (spasi, tab, dan line break), bukan isi teks.
              
              Aturan umum:
              - Jawab setiap pertanyaan dan masukkan jawaban kedalam question.correctAnswers sesuai aturan.
              - Semua id harus unik.
              - Gunakan format:
                - question.id = "q" + Date.now() + index
                - option.id = "o" + Date.now() + index
                - row.id = "r" + Date.now() + index
                - column.id = "c" + Date.now() + index

              Aturan settings:
              - Semua nilai default false.
              - defaultScoreValue = 0.
              - Jika yang dibuat adalah quiz maka:
                - settings.isQuiz = true
                - questions.required = true
                - totalScore = jumlah seluruh question.totalScore
              
              Aturan berdasarkan question.type:
              
              1. text
              - options = []
              - grid.rows = []
              - grid.columns = []
              - correctAnswers = ["jawaban benar 1", "jawaban benar 2", ...] (contoh)
              
              2. radio
              - correctAnswers = ["optionId"] (contoh)
              - grid.rows = []
              - grid.columns = []
              
              3. checkbox
              - correctAnswers = ["optionId1", "optionId2", ...] (contoh)
              - grid.rows = []
              - grid.columns = []
              
              4. select
              - correctAnswers = ["optionId"] (contoh)
              - grid.rows = []
              - grid.columns = []
              
              5. grid-radio
              - options = []
              - correctAnswers = ["rowId1, columnId1", "rowId2, "columnId1", ...] (contoh)
              - Setiap row hanya boleh memiliki satu column yang benar.
              - totalScore = jumlah totalScore seluruh row
              
              6. grid-checkbox
              - options = []
              - correctAnswers = ["rowId1, columnId2", "rowId1, columnId2", ...] (contoh)
              - Satu row boleh memiliki lebih dari satu column yang benar.
              - totalScore = jumlah totalScore seluruh row
              
              Aturan scoring:
              - Jika quiz:
                - question.totalScore default = 1.
                - Untuk grid, setiap row.totalScore default = 1.
              - Jika bukan quiz:
                - Semua score = 0.
                - correctAnswers = [].
              
              Jumlah pertanyaan output harus sama dengan pertanyaan input.
              Jangan berhenti sebelum semua soal selesai diproses.

              Berikut adalah hasil OCR/PDF extraction.

              Tugasmu BUKAN meringkas atau memperbaiki teks.
              Tugasmu hanya mengubah struktur menjadi JSON.

              Setiap karakter yang bukan bagian dari formatting JSON harus dipertahankan.

              INPUT:

              ${extracted}
              `;
    const stream = await ai.models.generateContentStream({
      model: "gemini-3.1-flash-lite",
      config: {
        responseMimeType: "application/json",
        responseSchema,
        maxOutputTokens: 50000,
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    const encoder = new TextEncoder();

    return new NextResponse(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              if (chunk.text) {
                controller.enqueue(encoder.encode(chunk.text) ?? "");
              }
            }

            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      }),
    );
  } catch (err) {
    console.error("Error converting:", err);
    return ApiResponse.error(500);
  }
}
