import { useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";

export default function CopyText({
  text,
  className,
  onCopied = () => {},
  onFailed = () => {},
}: {
  text: string;
  className?:string;
  onCopied?: () => void;
  onFailed?: () => void;
}) {
  const [copied, setCopied] = useState<boolean | null>(null);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(null), 3000);
        onCopied()
      })
      .catch(() => {
        setCopied(false);
        onFailed();
      });
  };
  return (
    <div className={`flex bg-brand-light/10 rounded-full border border-border focus-within:border-brand focus-within:shadow-[0_0_0_5px_var(--brand)]/12 overflow-hidden transition-all h-14 ${className}`}>
      <input
        value={text}
        readOnly
        className="min-w-0 flex-1 bg-transparent outline-none px-6 text-sm"
      />
      <button
        onClick={handleCopy}
        className={`px-6 flex items-center gap-2 text-sm font-semibold transition-colors ${
          copied ? "bg-brand text-foreground" : "bg-muted hover:bg-muted-dark"
        }`}
      >
        {copied ? <LuCheck size={18} /> : <LuCopy size={18} />}
        Salin
      </button>
    </div>
  );
}
