"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useFormEditorStore } from "@/stores/form-editor-store";
import { useShallow } from "zustand/react/shallow";
import { ErrorModal, SuccessModal } from "./components/modals";
import { allowScroll, preventScroll } from "@/helpers/dom";
import LoadingForm from "@/app/components/ui/loadingviews";
import { supabase } from "@/utils/supabase/client";
import { toCamel } from "@/helpers/case-converter";
import { EditorForm, Form } from "@/types/form";
import { getSession, getUser } from "@/lib/client/auth";
import { SupabaseAuthError } from "@/lib/supabase-auth-error";
import { AppError } from "@/lib/app-error";
import AlertModal from "@/app/components/ui/AlertModal";
import EditorHeader from "./components/EditorHeader";
import ContentSection from "./components/ContentSection";
import ResponsesSection from "./components/ResponsesSection";
import SettingsSection from "./components/SettingsSection";

export const TabContext = createContext({
  activeTab: "content",
  setActiveTab: (tabName: string) => {},
});

export default function SubmissionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [status, setStatus] = useState("initialize");
  const [error, setError] = useState<{ message: string; code: string } | null>(
    null,
  );
  const [initError, setInitError] = useState<{
    message: string;
    code: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<string>("content");

  const { shareToken, newForm, setForm, saveForm } = useFormEditorStore(
    useShallow((s) => ({
      title: s.form.title,
      description: s.form.description,
      questions: s.form.questions,
      shareToken: s.form.shareToken,
      getForm: s.getForm,
      newForm: s.newForm,
      setForm: s.setForm,
      updateForm: s.updateForm,
      addQuestion: s.addQuestion,
      saveForm: s.saveForm,
    })),
  );

  useEffect(() => {
    if (!id) router.replace("/form/new/edit");
    if (id === "new") {
      newForm();
      return setStatus("editing");
    }
    (async () => {
      const token = id;
      try {
        const session = await getSession();

        if (!session)
          throw new AppError({
            message: "Silahkan login terlebih dahulu",
            code: "UNATHORIZED",
          });

        const { data, error } = await supabase
          .from("forms")
          .select(
            "share_token, title, description, questions, settings, total_score, created_at, updated_at",
          )
          .eq("share_token", token)
          .eq("creator_id", session.user.id)
          .single();

        if (error) {
          if (error.code === "PGRST116")
            throw new AppError({
              message: "Data tidak ada atau Anda tidak memiliki akses",
              code: "NOT_FOUND",
            });

          if (error.code === "22P02")
            throw new AppError({
              message: "URL tidak valid",
              code: "BAD_REQUEST",
            });
          throw new AppError(error);
        }

        setForm(toCamel(data) as EditorForm);

        setStatus("editing");
      } catch (err: any) {
        if (err.code.toUpperCase() === "UNATHORIZED")
          return router.replace(
            `/u/login?redirect=${window.location.pathname}`,
          );

        if (err instanceof AppError || err instanceof SupabaseAuthError) {
          return setInitError({ message: err.message, code: err.code });
        }

        setInitError({
          message: "Terjadi kesalahan, coba lagi.",
          code: "UNKNOWN_ERROR",
        });
        setStatus("error");
      }
    })();
  }, [id]);

  const handleSaveForm = async () => {
    if (status === "saving") return;
    setStatus("saving");
    try {
      const isCreating = !shareToken;

      const data = await saveForm();

      if (isCreating && data) {
        setForm(data);
      }

      const finalToken = data.shareToken || shareToken;

      preventScroll();
      setStatus("success");

      if (isCreating && finalToken) {
        window.history.replaceState(null, "", `app/form/${finalToken}/edit`);
      }
    } catch (err) {
      if (err instanceof AppError || err instanceof SupabaseAuthError) {
        setError(err);
      } else {
        setError({
          message: "Terjadi kesalahan, coba lagi.",
          code: "UNKNOWN_ERROR",
        });
      }
      preventScroll();
      setStatus("error");
    }
  };

  if (initError) {
    return AlertModal({ message: initError.message });
  }

  return status !== "initialize" ? (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <EditorHeader
        isSaving={status === "saving"}
        handleSaveForm={handleSaveForm}
      />
      <div className="pt-33 sm:pt-36">
        <ContentSection />
        <ResponsesSection />
        <SettingsSection />
      </div>

      {status === "success" && (
        <SuccessModal
          url={`${window.origin}/f/${shareToken}`}
          close={() => {
            setStatus("editing");
            allowScroll();
          }}
        />
      )}

      {error && (
        <ErrorModal
          message={error.message}
          code={error.code}
          close={() => {
            setError(null);
            setStatus("editing");
            allowScroll();
          }}
        />
      )}
    </TabContext.Provider>
  ) : (
    <LoadingForm text="Membuka editor" />
  );
}
