"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LuAArrowDown,
  LuArrowDown,
  LuArrowDownAZ,
  LuArrowDownWideNarrow,
  LuArrowUp,
  LuArrowUpAZ,
  LuArrowUpDown,
  LuArrowUpWideNarrow,
  LuCalendar,
  LuCalendar1,
  LuChevronsUpDown,
  LuListFilter,
  LuPlus,
  LuSearch,
  LuSquareArrowDown,
  LuX,
} from "react-icons/lu";
import { PrimaryBtn, SecondaryBtn } from "../../../components/ui/buttons";
import { useEffect, useState } from "react";
import { Form } from "@/types/form";
import { supabase } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { toCamel } from "@/helpers/case-converter";
import FormCard, {
  SkeletonFormCard,
} from "../../../components/ui/form/FormCard";
import HeaderProfile from "../../../components/ui/profiles/HeaderProfile";
import {
  FaCross,
  FaDizzy,
  FaFax,
  FaMeh,
  FaMehBlank,
  FaSearch,
  FaSortAlphaDown,
  FaThList,
} from "react-icons/fa";
import { TextInput } from "@/app/components/ui/inputs";
import { deleteForm } from "@/lib/client/supabase/forms-actions";
import { AppError } from "@/lib/app-error";
import { SupabaseAuthError } from "@/lib/supabase-auth-error";

export default function Home() {
  const router = useRouter();
  const [forms, setForms] = useState<Partial<Form>[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
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

  const handleDelete = async (shareToken: string) => {
    try {
      await deleteForm(shareToken);

      const selectFormsRes = await supabase
        .from("forms")
        .select("title, share_token, created_at, updated_at");

      if (selectFormsRes.error) {
        throw new AppError(error);
      }
      const forms = selectFormsRes.data?.map((f) =>
        toCamel(f),
      ) as Partial<Form>[];

      setForms(forms);
    } catch (err) {
      if (err instanceof AppError || err instanceof SupabaseAuthError) {
        setError(err);
      } else {
        setError({
          message: "Terjadi kesalahan, coba lagi",
          code: "UNKNOWN_ERROR",
        });
      }
    }
  };

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
        const getUserRes = await supabase.auth.getUser();
        const user = getUserRes.data.user;

        if (!user) return;

        setUser(user);

        const selectFormsRes = await supabase
          .from("forms")
          .select("title, share_token, created_at, updated_at");

        const forms = selectFormsRes.data?.map((f) =>
          toCamel(f),
        ) as Partial<Form>[];

        setForms(forms);
      } catch (err) {}
    })();
  }, []);
  return (
    <div className="px-3 sm:px-6 py-6 min-h-screen flex pt-23 sm:pt-26">
      <div className="mx-auto w-full max-w-6xl flex flex-col gap-3 sm:gap-6">
        <button
          className="w-full flex items-center justify-center gap-3 p-4 rounded-3xl text-white bg-linear-to-r from-brand-dark via-brand to-brand border border-border hover:brightness-105 active:scale-[0.99] transition-all duration-300 hover:shadow-[0_0_0_5px_var(--brand)]/12 active:shadow-[0_0_0_5px_var(--brand)]/12"
          onClick={() => router.push("/app/form/new/edit")}
        >
          <LuPlus size={48} strokeWidth={2.5} />
          <span className="text-3xl font-semibold">Form Baru</span>
        </button>
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
                <div
                  className="fixed inset-0 z-100"
                  onClick={() => setOpenSortBy(false)}
                ></div>
              )}
              <button
                className={`relative p-2 rounded-full transition-colors ${openSortBy ? "z-100! bg-muted text-brand" : "hover:bg-muted/30 active:bg-muted"}`}
                onClick={() => setOpenSortBy(!openSortBy)}
              >
                <LuChevronsUpDown size={18} />
              </button>
              {openSortBy && (
                <div className="absolute top-full right-0 mt-2 min-w-50 w-max bg-foreground z-100 border border-border shadow-lg rounded-3xl p-2">
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
              )}
            </div>
            <button
              className="p-2 rounded-full transition-colors hover:bg-muted/30 active:bg-muted"
              onClick={() => setSortMode(sortMode === "desc" ? "asc" : "desc")}
            >
              {sortMode === "desc" ? (
                <LuArrowDown size={18} />
              ) : (
                <LuArrowUp size={18} />
              )}
            </button>
          </div>
        </div>
        {forms !== null ? (
          displayedForms?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {sort(displayedForms).map((f) => (
                <FormCard
                  key={f.shareToken!}
                  {...f}
                  highlight={searchKeyword}
                  deleteForm={handleDelete}
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
            {Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonFormCard
                key={idx}
                className="last:md:hidden last:xl:flex"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
