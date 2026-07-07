"use client";

import { useFormEditorStore } from "@/stores/form-editor-store";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { TabContext } from "../page";
import { PrimaryBtn, SecondaryBtn } from "@/app/components/ui/buttons";
import { useShallow } from "zustand/react/shallow";
import {
  LuArrowDownToLine,
  LuCheck,
  LuChevronDown,
  LuChevronUp,
  LuClipboard,
  LuClipboardCopy,
  LuCopy,
  LuCopyleft,
  LuCopyright,
  LuDock,
  LuEllipsisVertical,
  LuFile,
  LuFileDown,
  LuFilePlus,
  LuFilePlus2,
  LuFileQuestion,
  LuLogOut,
  LuRefreshCcw,
  LuSave,
} from "react-icons/lu";
import { FaCheck, FaCopy, FaHandSparkles, FaSave } from "react-icons/fa";
import ImportQuestion from "./header/ImportQuestion";
import { formatTimestamp } from "@/helpers/timestamp-formatter";
import ExtractPdf from "./header/ExtractPdf";

export default function EditorHeader({
  isSaving,
  handleSaveForm,
}: {
  isSaving: boolean;
  handleSaveForm: () => void;
}) {
  const [isMinimize, setIsMinimize] = useState<boolean>(false);
  const scrollPos = useRef(0);
  const router = useRouter();
  const [openOptions, setOpenOptions] = useState(false);

  const { activeTab, setActiveTab } = useContext(TabContext);

  const { title, shareToken, totalScore, isQuiz, createdAt, updatedAt } =
    useFormEditorStore(
      useShallow((s) => ({
        title: s.form.title,
        shareToken: s.form.shareToken,
        totalScore: s.form.totalScore,
        isQuiz: s.form.settings.isQuiz,
        createdAt: s.form.createdAt,
        updatedAt: s.form.updatedAt,
      })),
    );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollPos.current) {
        if (!isMinimize) setIsMinimize(true);
      } else {
        setIsMinimize(false);
      }

      scrollPos.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {}
  };

  return (
    <header className="fixed inset-0 h-max top-0 bg-foreground border-b border-border px-3 sm:px-6 z-500">
      <div className="h-20 flex items-center gap-3 sm:gap-6 relative">
        <div className="">
          <button
            className="flex items-center"
            onClick={() => router.push("/app")}
          >
            <img src="/fluens.png" className="w-16" />
          </button>
        </div>
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-sm">
            <div className="line-clamp-1 text-xl break-all">{title}</div>
            {isQuiz && (
              <div className="text-xs text-muted-darker">
                <span className="text-brand">{totalScore} </span>
                Total Poin
              </div>
            )}
          </div>
        </div>
        <div className="w-max absolute left-1/2 -translate-x-1/2 top-1 sm:top-2 text-xs text-muted-dark">
          {updatedAt ? (
            `Diperbarui pada ${formatTimestamp(updatedAt)}`
          ) : createdAt ? (
            `Dibuat pada ${formatTimestamp(createdAt)}`
          ) : (
            <span className="">
              Formulir belum disimpan.{" "}
              <button
                className="text-brand-light transition-colors hover:text-brand"
                onClick={handleSaveForm}
                disabled={isSaving}
              >
                {isSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </span>
          )}
        </div>
        <div className="flex gap-3 justify-end">
          <ExtractPdf />
          <PrimaryBtn
            className="max-[400px]:hidden h-10! px-3! sm:px-4! rounded-lg! text-xs"
            onClick={handleSaveForm}
            disabled={isSaving}
          >
            {isSaving ? "Menyimpan..." : "Simpan"}
          </PrimaryBtn>
          <div className="relative h-max flex self-center">
            {openOptions && (
              <div
                className="fixed inset-0 z-999"
                onClick={() => setOpenOptions(false)}
              ></div>
            )}
            <button
              className={`p-2 rounded-full transition-colors ${openOptions ? "z-999 bg-muted text-brand" : "hover:bg-muted-light active:bg-muted"}`}
              onClick={() => setOpenOptions(!openOptions)}
            >
              <LuEllipsisVertical size={18} />
            </button>
            {openOptions && (
              <div className="absolute top-full right-0 mt-2 min-w-50 w-max bg-foreground z-999 border border-border shadow-lg rounded-3xl p-2">
                <div className="flex flex-col gap-1 relative">
                  <button
                    className="px-4 h-11 flex items-center gap-3 rounded-full text-sm text-brand hover:bg-brand-light/10 transition-colors group"
                    onClick={handleSaveForm}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <LuRefreshCcw
                        size={18}
                        className="animate-[spin_1s_linear_reverse_infinite]"
                      />
                    ) : (
                      <FaSave size={18} />
                    )}
                    {isSaving ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button
                    className="px-4 h-11 flex items-center gap-3 rounded-full text-sm hover:bg-brand-light/10 transition-colors group"
                    onClick={() =>
                      handleCopy(`${location.origin}/f/${shareToken}`)
                    }
                    disabled={copied}
                  >
                    {copied ? (
                      <LuCheck size={18} className="text-brand" />
                    ) : (
                      <LuCopy
                        size={18}
                        className="group-hover:text-brand transition-colors"
                      />
                    )}{" "}
                    {copied ? (
                      <span className="text-brand">Link disalin</span>
                    ) : (
                      "Salin link respon"
                    )}
                  </button>
                  <ImportQuestion />
                  <button
                    className="px-4 h-11 flex items-center gap-3 rounded-full text-sm text-red-500 hover:bg-red-50 transition-colors group"
                    onClick={() => router.push("/app")}
                  >
                    <LuLogOut size={18} /> Keluar editor
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        hidden={isMinimize}
        className="pb-1 flex justify-center gap-6 relative"
      >
        <div className="w-12 sm:absolute"></div>
        <div className="flex gap-1">
          <button
            className={`${activeTab === "content" && "bg-brand-light/10 text-brand"} transition-colors p-2 px-4 rounded-full text-sm hover:bg-brand-light/10`}
            onClick={() => setActiveTab("content")}
          >
            Konten
          </button>
          <button
            className={`${activeTab === "responses" && "bg-brand-light/10 text-brand"} transition-colors p-2 px-4 rounded-full text-sm hover:bg-brand-light/10`}
            onClick={() => setActiveTab("responses")}
          >
            Respon
          </button>
          <button
            className={`${activeTab === "settings" && "bg-brand-light/10 text-brand"} transition-colors p-2 px-4 rounded-full text-sm hover:bg-brand-light/10`}
            onClick={() => setActiveTab("settings")}
          >
            Pengaturan
          </button>
        </div>

        <div className="w-12 sm:absolute right-0 bottom-4 flex items-center">
          <button
            className="h-2 flex items-center overflow-hidden group"
            onClick={() =>
              window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth",
              })
            }
          >
            <LuChevronDown
              className="fill-muted-darker transition-colors group-hover:fill-brand stroke-0"
              size={20}
            />
          </button>
          <button
            className="h-2 flex items-center overflow-hidden group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <LuChevronUp
              className="fill-muted-darker transition-colors group-hover:fill-brand stroke-0"
              size={20}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
