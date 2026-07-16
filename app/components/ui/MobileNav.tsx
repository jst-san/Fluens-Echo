"use client";

import { useState } from "react";
import { LuMenu, LuX } from "react-icons/lu";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className={`${open && "bg-brand-light/12 text-brand"} sm:hidden p-2 rounded-full transition-all hover:bg-muted-light active:bg-muted`}
        onClick={() => setOpen(!open)}
      >
        {open ? <LuX size={18} /> : <LuMenu size={18} />}
      </button>
      <div className="sm:hidden absolute overflow-hidden left-0 top-full w-full h-max -z-1">
        <div
          className={`${open && "max-h-72 border-b"} transition-all border-border w-full max-h-0 bg-foreground/90 flex items-end`}
        >
          <div className="w-full flex flex-col">
            <a
              className="py-6 text-center text-sm transition-colors hover:bg-muted-light/50 active:bg-muted/50 active:text-brand"
              href="/"
            >
              Beranda
            </a>

            <a
              className="py-6 text-center text-sm transition-colors hover:bg-muted-light/50 active:bg-muted/50 active:text-brand"
              href="/#features"
            >
              Fitur
            </a>

            <a
              className="py-6 text-center text-sm transition-colors hover:bg-muted-light/50 active:bg-muted/50 active:text-brand"
              href="/app"
            >
              Dashboard
            </a>
            <hr className="border-border" />
            <a
              className="py-6 text-center text-sm text-brand transition-colors hover:bg-muted-light/50 active:bg-brand-light/12"
              href="/app"
            >
              Ayo Mulai
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
