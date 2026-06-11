"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Question from "../../components/editor/Question";
import { useFormEditorStore } from "@/stores/form-editor-store";
import { useShallow } from "zustand/react/shallow";
import { LuCheck, LuPlus } from "react-icons/lu";
import { ErrorModal, SuccessModal } from "../../components/editor/modals";
import { allowScroll, preventScroll } from "@/helpers/dom";
import Textarea from "react-textarea-autosize";

export default function SubmissionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [status, setStatus] = useState("editing");
  const [error, setError] = useState<{ cause: string; code: string } | null>(
    null,
  );

  const {
    title,
    description,
    questions,
    shareToken,
    getForm,
    newForm,
    setForm,
    updateForm,
    addQuestion,
  } = useFormEditorStore(
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
    })),
  );

  const isNew = id === "new" && !shareToken;

  useEffect(() => {
    if (id === "new") return newForm();
    (async () => {
      const token = id;
      try {
        const res = await fetch(`/api/form/${token}`);
        const payload = await res.json();

        if (!res.ok) return;

        setForm(payload.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [id]);

  const saveForm = async () => {
    if (status === "saving") return;
    setStatus("saving");
    try {
      const form = getForm();

      const isCreating = !shareToken; 

      const res = await fetch("/api/form", {
        method: isCreating ? "POST" : "PUT",
        body: JSON.stringify({ form }),
      });

      const payload = await res.json();
      if (!res.ok || !payload.success) {
        setError({ cause: payload.message, code: payload.error });
        setStatus("error");
        return;
      }

      if (isCreating && payload.data) {
        setForm({...form, shareToken: payload.data.shareToken});
      }

      const finalToken = payload.data?.shareToken || shareToken;

      preventScroll();
      setStatus("success");

      if (isCreating && finalToken) {
        window.history.replaceState(null, "", `/form/${finalToken}/edit`);
      }
    } catch (err) {
      preventScroll();
      setError({ cause: "Terjadi kesalahan, coba lagi", code: "CLIENT_ERROR" });
      setStatus("error");
    }
  };

  const questionIds = questions.map((q) => q.id);

  return title ? (
    <div className="min-h-screen bg-[#f8fbff] text-[#0f172a] font-sans pb-24">
      <div className="md:px-8 pt-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-6" spellCheck={false}>
            <div className="relative bg-white rounded-[32px] p-10 overflow-hidden border border-[#e2e8f0] shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
              <div className="absolute -top-[120px] -right-[120px] w-[240px] h-[240px] rounded-full bg-[radial-gradient(circle,rgba(22,139,255,0.15),transparent)]"></div>

              <div className="relative z-10">
                <Textarea
                  className="w-full text-3xl md:text-[42px] font-bold tracking-tight mb-4 outline-none resize-none"
                  minRows={1}
                  defaultValue={title}
                  // onBlur={() =>
                  //   !title.trim() &&
                  //   updateForm({ title: "Formulir Tanpa Judul" })
                  // }
                  onBlur={(e) => updateForm({ title: !title.trim() ? "Formulir Tanpa Judul" : e.target.value })}
                />
                <Textarea
                  className="w-full text-[18px] text-[#64748b] leading-[1.8] overflow-hidden outline-none resize-none"
                  defaultValue={description}
                  onBlur={(e) => updateForm({ description: e.target.value })}
                  placeholder="Deskripsi singkat (opsional)"
                  minRows={1}
                />
              </div>
            </div>

            <div className="space-y-6">
              {questionIds.length ? (
                questionIds.map((qId, qi) => (
                  <Question key={qId} qId={qId} qi={qi} />
                ))
              ) : (
                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 z-[100] opacity-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 translate-y-2 transition-all duration-300 pointer-events-none group-focus-within:pointer-events-auto">
                  <button
                    type="button"
                    className="h-12 w-12 flex items-center justify-center bg-[linear-gradient(135deg,#48a7ff,#168bff,#005ed9)] text-white rounded-full hover:-translate-y-1 shadow-[0_12px_30px_rgba(22,139,255,0.3)] transition-all"
                    onClick={() => addQuestion()}
                  >
                    <LuPlus size={24} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex px-4 md:px-0 gap-4 justify-end pt-10">
              {isNew && (
                <button
                  className="h-[56px] px-8 bg-white border border-[#e2e8f0] rounded-full font-semibold text-[#0f172a] transition-all hover:border-[#168bff] hover:text-[#168bff] hover:-translate-y-[2px] shadow-sm"
                  onClick={newForm}
                >
                  Reset Draft
                </button>
              )}
              <button
                className="h-[56px] px-8 bg-[linear-gradient(135deg,#48a7ff,#168bff,#005ed9)] text-white rounded-full font-semibold transition-all hover:-translate-y-[2px] shadow-[0_12px_30px_rgba(22,139,255,0.25)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
                onClick={saveForm}
                disabled={status === "saving"}
              >
                {status === "saving" ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {status === "success" && (
        <SuccessModal
          url={window.location.href.replace("/edit", "")}
          close={() => {
            setStatus("editing");
            allowScroll();
          }}
        />
      )}
      
      {error && (
        <ErrorModal
          {...error}
          close={() => {
            setError(null);
            setStatus("editing");
            allowScroll();
          }}
        />
      )}
    </div>
  ) : (
    <div className="fixed inset-0 bg-[#f8fbff] flex justify-center items-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-[80px] h-[80px]">
          <div className="absolute inset-0 rounded-full border-[8px] border-[#168bff]/20"></div>
          <div className="absolute inset-0 rounded-full border-[8px] border-transparent border-t-[#168bff] animate-spin"></div>
        </div>
        <div className="text-[16px] text-[#64748b] font-medium tracking-wide">
          Membuka editor<span className="animate-pulse">...</span>
        </div>
      </div>
    </div>
  );
}