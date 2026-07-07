import ResultQuestion from "@/app/components/ui/form/question-parts/result/ResultQuestion";
import { FormSettings, SubmissionData, SubmissionQuestion } from "@/types/form";
import { SecondaryBtn } from "@/app/components/ui/buttons";
import LoadingForm from "@/app/components/ui/loadingviews";
import { getSubmissionByToken } from "@/lib/server/submission/repository";
import { NextRequest } from "next/server";
import { supabase } from "@/utils/supabase/admin";

export default async function ResultPage(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id || typeof id !== 'string') return

  const submission = await getSubmissionByToken(id)
  
  const {data, error} = await supabase.from("forms").select("settings").eq("id",submission?.formId ).single()

  if (!data) return
  
  const settings = data.settings as FormSettings

  const result = submission?.data


  return result ? (
      <div className="min-h-screen pb-24">
        <div className="md:px-8 pt-12">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="relative bg-foreground rounded-4xl p-10 overflow-hidden border border-border">
              <div className="absolute -top-30 -right-30 w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(22,139,255,0.15),transparent)]"></div>

              <div className="relative z-10">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 outline-none resize-none">
                  {result?.title}
                </h1>

                <p className="text-lg text-muted-darker leading-[1.8] outline-none resize-none">
                  {result?.description}
                </p>

                {settings.isQuiz && settings.allowSeeScore &&
                <div className="mt-8 inline-flex items-center gap-2 h-9 px-5 rounded-full bg-brand-light/10 text-brand text-sm font-semibold">
                  Poin: {result.score} / {result.totalScore}
                </div>}
              </div>
            </div>

            <div className="space-y-6">
              {result.submissionQuestions.map((q: SubmissionQuestion) => (
                <ResultQuestion key={q.id} {...{q, settings}} />
              ))}
            </div>

            <div className="flex px-4 md:px-0 justify-end pt-4">
              {/* <SecondaryBtn onClick={() => router.push("/")}>
                Kembali
              </SecondaryBtn> */}
            </div>
          </div>
        </div>
      </div>
  ) : (
    <LoadingForm text="Mengambil hasil" />
  );
}

// export const ResultContext = createContext<Partial<SubmissionData> | null>(
//   null,
// );
