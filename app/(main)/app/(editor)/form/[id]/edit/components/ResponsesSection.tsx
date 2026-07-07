"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { TabContext } from "../page";
import { useFormEditorStore } from "@/stores/form-editor-store";
import { useShallow } from "zustand/react/shallow";
import { supabase } from "@/utils/supabase/client";
import { Submission } from "@/types/form";
import { toCamel } from "@/helpers/case-converter";
import { AppError } from "@/lib/app-error";
import { SupabaseAuthError } from "@/lib/supabase-auth-error";
import { LuRefreshCcw } from "react-icons/lu";
import { PrimaryBtn } from "@/app/components/ui/buttons";
import Statistic from "./responses/summary/Statistics";
import Leaderboard from "./responses/summary/Leaderboard";
import SummaryQuestions from "./responses/summary/SummaryQuestions";
import Questions from "./responses/questions/Questions";
import Individual from "./responses/individual/Individual";

export default function ResponsesSection() {
  const { activeTab } = useContext(TabContext);
  const [error, setError] = useState<{ message: string; code: string } | null>(
    null,
  );
  const [activeTabRTab, setActiveRTab] = useState<
    "summary" | "questions" | "individual"
  >("summary");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [responses, setResponses] = useState<Response[] | null>(null);
  const { formScore, shareToken, questions, totalScore, isQuiz } =
    useFormEditorStore(
      useShallow((s) => ({
        formScore: s.form.totalScore,
        shareToken: s.form.shareToken,
        questions: s.form.questions,
        totalScore: s.form.totalScore,
        isQuiz: s.form.settings.isQuiz,
      })),
    );

  const getData = async () => {
    try {
      const formIdRes = await supabase
        .from("forms")
        .select("id")
        .eq("share_token", shareToken)
        .single();
      if (formIdRes.error) throw new AppError(formIdRes.error);

      const formId = formIdRes.data.id;
      const submissionsRes = await supabase
        .from("submissions")
        .select("uuid, data, created_at, updated_at")
        .eq("form_id", formId);

      if (submissionsRes.error) throw new AppError(submissionsRes.error);

      setResponses(submissionsRes.data.map((s) => toCamel(s)) as Response[]);
    } catch (err) {
      if (err instanceof AppError || err instanceof SupabaseAuthError) {
        setError(err);
      } else {
        setError({
          message: "Terjadi kesalahan, coba lagi.",
          code: "UNKNOWN_ERROR",
        });
      }
      console.log(err);
    }
  };

  useEffect(() => {
    if (activeTab !== "responses" || !shareToken || responses?.length) return;
    getData();
  }, [activeTab]);

  return (
    <ResponsesContext.Provider value={responses}>
      <div className={`${activeTab !== "responses" && "hidden"} md:px-8 pb-6`}>
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-6">
          <div className="bg-foreground border border-border p-8 space-y-6 rounded-3xl">
            <div className="flex items-center justify-between">
              <div className="text-3xl">
                <span className="font-medium text-brand">
                  {responses?.length}
                </span>{" "}
                Respon
              </div>
              <PrimaryBtn
                className="w-10! h-10! p-0! rounded-lg! grid place-content-center"
                onClick={async () => {
                  setIsRefreshing(true);
                  await getData();
                  setIsRefreshing(false);
                }}
              >
                <LuRefreshCcw
                  className={`${isRefreshing && "animate-[spin_1s_linear_reverse_infinite]"}`}
                />
              </PrimaryBtn>
            </div>
          </div>
          <div className="p-1.5 bg-foreground rounded-full flex gap-1.5 border border-border">
            <button
              className={`${activeTabRTab === "summary" && "bg-brand-light/10 text-brand"} transition-colors p-3 flex-1 rounded-full hover:bg-brand-light/10`}
              onClick={() => setActiveRTab("summary")}
            >
              Ringkasan
            </button>
            <button
              className={`${activeTabRTab === "questions" && "bg-brand-light/10 text-brand"} transition-colors p-3 flex-1 rounded-full hover:bg-brand-light/10`}
              onClick={() => setActiveRTab("questions")}
            >
              Pertanyaan
            </button>
            <button
              className={`${activeTabRTab === "individual" && "bg-brand-light/10 text-brand"} transition-colors p-3 flex-1 rounded-full hover:bg-brand-light/10`}
              onClick={() => setActiveRTab("individual")}
            >
              Individu
            </button>
          </div>
          {activeTabRTab === "summary" && Boolean(responses?.length) && (
            <>
              {isQuiz && (
                <>
                  <Statistic />
                  <Leaderboard />
                </>
              )}
              <SummaryQuestions />
            </>
          )}
          {activeTabRTab === "questions" && (
            <>
              <Questions />
            </>
          )}
          {activeTabRTab === "individual" && (
            <>
              <Individual />
            </>
          )}
        </div>
      </div>
    </ResponsesContext.Provider>
  );
}

export const ResponsesContext = createContext<Response[] | null>(null);

type Response = Omit<Submission, "id" | "formId">;
