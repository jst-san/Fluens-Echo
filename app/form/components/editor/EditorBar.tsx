"use state";

import { useFormEditorStore } from "@/stores/form-editor-store";
import { Form } from "@/types/form";
import { useState } from "react";
import { LuSparkle } from "react-icons/lu";
import Textarea from "react-textarea-autosize";
import { useShallow } from "zustand/react/shallow";

export default function EditorBar() {
  const [open, setOpen] = useState<string | null>(null);
  const { setForm } = useFormEditorStore(
    useShallow((s) => ({ setForm: s.setForm })),
  );
  return (
    <header className="w-full bg-foreground container py-0">
      <div className="content flex items-center justify-between">
        <div>Formulir Baru</div>
        <div className="h-16 flex gap-4 text-xs text-neutral-700">
          <div className="h-full relative flex items-center">
            <button
            // onClick={() => setOpen(open === "option" ? null : "option")}
            >
              Opsi Lainnya
            </button>
          </div>
          <div className="h-full flex items-center">
            <button onClick={() => setOpen("inputJSON")}>Input JSON</button>

            {open === "inputJSON" && (
              <div className="fixed inset-0 z-999 w-screen h-screen flex items-center justify-center">
                <div
                  className="w-full h-full bg-black"
                  onClick={() => setOpen(null)}
                ></div>
                <div className="absolute w-full max-w-sm bg-foreground p-8 rounded">
                  <Textarea
                    className="w-full outline-none focus-within:bg-neutral-100"
                    minRows={4}
                    maxRows={8}
                    onBlur={(e) => {
                        if(e.target.value === "") return
                      setForm(JSON.parse(e.target.value) as Form);
                      e.target.value = "";
                      setOpen(null);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="h-full relative flex items-center">
            <label className="relative flex items-center justify-center py-2 px-4 bg-brand text-foreground rounded">
              <div className="flex">
                <div className="font-semibold">Ekstrak pdf</div>
                <LuSparkle className="ml-1 fill-foreground text-foreground w-2.5 h-2.5" />
              </div>
              <input type="file" className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </header>
  );
}
