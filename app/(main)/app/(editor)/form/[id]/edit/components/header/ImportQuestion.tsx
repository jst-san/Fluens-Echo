"use client";

import { TextInput } from "@/app/components/ui/inputs";
import { toCamel } from "@/helpers/case-converter";
import { formatTimestamp } from "@/helpers/timestamp-formatter";
import { AppError } from "@/lib/app-error";
import { deleteForm } from "@/lib/client/supabase/forms-actions";
import { useFormEditorStore } from "@/stores/form-editor-store";
import { Form, Question } from "@/types/form";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { FaThList } from "react-icons/fa";
import {
  LuAArrowDown,
  LuArrowDown,
  LuArrowUp,
  LuCalendar,
  LuChevronsUpDown,
  LuFilePlus2,
  LuPlus,
  LuSearch,
  LuX,
} from "react-icons/lu";

export default function ImportQuestion() {
  const [openModal, setOpenModal] = useState(false);
  const addQuestion = useFormEditorStore((s) => s.addQuestion);
  const handleImport = async (shareToken: string) => {
    try {
      const { data, error } = await supabase
        .from("forms")
        .select("questions")
        .eq("share_token", shareToken)
        .single();

      if (error) {
        throw new AppError(error);
      }

      if (!data.questions.length) return;

      data.questions.forEach((q: Question) => addQuestion("last", q));
      setOpenModal(false);
    } catch (err) {}
  };
  return (
    <>
      <button
        className="px-4 h-11 flex items-center gap-3 rounded-full text-sm hover:bg-brand-light/10 transition-colors group"
        onClick={() => setOpenModal(!openModal)}
      >
        <LuFilePlus2
          size={18}
          className="group-hover:text-brand transition-colors"
        />
        Import pertanyaan
      </button>
      {openModal && (
        <>
          <div
            className="fixed inset-0 z-999 bg-black/10 blur-sm"
            onClick={() => setOpenModal(false)}
          ></div>
          <ImportModal handleImport={handleImport} />
        </>
      )}
    </>
  );
}

function ImportModal({
  handleImport,
}: {
  handleImport: (shareToken: string) => Promise<void>;
}) {
  const [forms, setForms] = useState<Partial<Form>[] | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [error, setError] = useState<{ message: string; code: string } | null>(
    null,
  );
  const [sortBy, setSortBy] = useState<"modified" | "created" | "title">(
    "modified",
  );
  const [sortMode, setSortMode] = useState<"desc" | "asc">("desc");
  const [openSortBy, setOpenSortBy] = useState(false);

  const displayedForms = forms?.filter((f) =>
    searchKeyword !== ""
      ? f.title?.toLowerCase().includes(searchKeyword.toLowerCase())
      : true,
  );

  const sort = (forms: Partial<Form>[]) => {
    const isDesc = sortMode === "desc";
    if (sortBy === "modified") {
      return forms.sort((a, b) => {
        const aTime = Date.parse(a.updatedAt ?? a.createdAt!);
        const bTime = Date.parse(b.updatedAt ?? b.createdAt!);
        return isDesc ? bTime - aTime : aTime - bTime;
      });
    } else if (sortBy === "created") {
      return forms.sort((a, b) => {
        const aTime = Date.parse(a.createdAt!);
        const bTime = Date.parse(b.createdAt!);
        return isDesc ? bTime - aTime : aTime - bTime;
      });
    } else if (sortBy === "title") {
      return forms.sort((a, b) =>
        isDesc
          ? b.title!.localeCompare(a.title!)
          : a.title!.localeCompare(b.title!),
      );
    } else return forms;
  };

  useEffect(() => {
    (async () => {
      try {
        const selectFormsRes = await supabase
          .from("forms")
          .select("title, share_token, created_at, updated_at");

        const forms = selectFormsRes.data?.map((f) =>
          toCamel(f),
        ) as Partial<Form>[];

        if (!forms?.length) return;

        setForms(forms);
      } catch (err) {}
    })();
  }, []);
  return (
    <div className="py-3 sm:py-6 bg-foreground rounded-3xl border border-border w-full max-w-xl h-full max-h-8/10 fixed top-1/2 left-1/2 -translate-1/2 z-999">
      <div className="mx-auto w-full h-full px-3 sm:px-6 flex flex-col gap-3 sm:gap-6 overflow-auto">
        <div className="sticky top-0 z-1 bg-foreground pb-3 space-y-3">
          <div className="text-center text-lg">Import dari Formulir</div>
          <div className="w-full flex gap-3 sm:gap-6 flex-col sm:flex-row">
            <div className="relative flex-1 flex items-center">
              <TextInput
                className="bg-foreground pl-12 peer"
                type="text"
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Cari"
              />
              <LuSearch
                className="absolute left-4 text-muted-dark peer-focus-within:text-brand transition-colors"
                size={20}
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              <div className="relative">
                {openSortBy && (
                  <>
                    <div
                      className="fixed inset-0 z-50"
                      onClick={() => setOpenSortBy(false)}
                    ></div>

                    <div className="absolute top-full right-0 mt-2 min-w-50 w-max bg-foreground z-50 border border-border shadow-lg rounded-3xl p-2">
                      <div className="flex flex-col gap-1 relative">
                        <div className="px-4 h-11 flex items-center gap-3 text-sm">
                          Urutkan menurut :
                        </div>
                        <button
                          className={`px-4 h-11 flex items-center gap-3 rounded-full text-sm hover:bg-brand-light/10 transition-colors group ${sortBy === "modified" && "text-brand"}`}
                          onClick={() => {
                            setSortBy("modified");
                            setOpenSortBy(false);
                          }}
                        >
                          <LuCalendar size={18} />
                          Terakhir diubah
                        </button>
                        <button
                          className={`px-4 h-11 flex items-center gap-3 rounded-full text-sm hover:bg-brand-light/10 transition-colors group ${sortBy === "created" && "text-brand"}`}
                          onClick={() => {
                            setSortBy("created");
                            setOpenSortBy(false);
                          }}
                        >
                          <LuCalendar size={18} />
                          Terakhir dibuat
                        </button>
                        <button
                          className={`px-4 h-11 flex items-center gap-3 rounded-full text-sm hover:bg-brand-light/10 transition-colors group ${sortBy === "title" && "text-brand"}`}
                          onClick={() => {
                            setSortBy("title");
                            setOpenSortBy(false);
                          }}
                        >
                          <LuAArrowDown size={18} />
                          Judul
                        </button>
                      </div>
                    </div>
                  </>
                )}
                <button
                  className="p-2 rounded-full hover:bg-brand-light/10"
                  onClick={() => setOpenSortBy(!openSortBy)}
                >
                  <LuChevronsUpDown size={18} />
                </button>
              </div>
              <button
                className="p-2 rounded-full hover:bg-brand-light/10"
                onClick={() =>
                  setSortMode(sortMode === "desc" ? "asc" : "desc")
                }
              >
                {sortMode === "desc" ? (
                  <LuArrowDown size={18} />
                ) : (
                  <LuArrowUp size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
        {forms ? (
          displayedForms?.length ? (
            <div className="flex flex-col gap-3 sm:gap-6">
              {sort(displayedForms).map((f) => (
                <ListItem
                  key={f.shareToken!}
                  {...f}
                  highlight={searchKeyword}
                  onClick={() => handleImport(f.shareToken!)}
                />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative">
                <FaThList className="text-muted" size={96} />
                <LuX
                  className="absolute right-0 bottom-0 translate-1/2 text-muted-dark"
                  size={64}
                />
              </div>
              <div className="mt-8 text-center font-bold text-2xl text-muted">
                Form Tidak Ditemukan
              </div>
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {/* {Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonFormCard
                key={idx}
                className="last:md:hidden last:xl:flex"
              />
            ))} */}
          </div>
        )}
      </div>
    </div>
  );
}

function ListItem({
  title,
  shareToken,
  createdAt,
  updatedAt,
  highlight,
  onClick,
}: Partial<Form> & {
  highlight?: string;
  onClick: () => void;
}) {
  const formattedCreated = createdAt ? formatTimestamp(createdAt) : "-";
  const formattedUpdated = updatedAt ? formatTimestamp(updatedAt) : "-";

  const renderTitle = () => {
    if (!title) return "-";
    if (!highlight) return title;

    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedHighlight})`, "gi");
    const parts = title.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="text-brand bg-transparent">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  return (
    <button
      className="p-4 rounded-3xl border border-border flex gap-4"
      onClick={onClick}
    >
      <div className="relative">
        <FaThList className="text-brand w-12 h-12" />
        <div className="w-max h-4 absolute inset-0 overflow-hidden flex items-start">
          <FaThList className="text-brand-light w-12 h-12" />
        </div>
        <div className="w-max h-4 absolute bottom-0 overflow-hidden flex items-end">
          <FaThList className="text-brand-dark w-12 h-12" />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div className="line-clamp-1 text-left">{renderTitle()}</div>
        <div className="w-full text-right text-xs text-muted-dark">
          Dibuat: {formattedCreated}
        </div>
      </div>
    </button>
  );
}
