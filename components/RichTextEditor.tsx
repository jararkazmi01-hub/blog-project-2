"use client";
import { useRef, useEffect } from "react";
import DOMPurify from "dompurify";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export default function RichTextEditor({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Set initial value only once
  useEffect(() => {
    if (ref.current && !initialized.current) {
      ref.current.innerHTML = DOMPurify.sanitize(value);
      initialized.current = true;
    }
  }, []);

  const ALLOWED_CMDS = ["bold", "italic", "underline", "insertUnorderedList", "formatBlock"];
  const ALLOWED_VALS = ["h2", "blockquote"];

  const exec = (cmd: string, val?: string) => {
    if (!ALLOWED_CMDS.includes(cmd)) return;
    const safeVal = val && ALLOWED_VALS.includes(val) ? val : undefined;
    document.execCommand(cmd, false, safeVal);
    if (ref.current) onChange(DOMPurify.sanitize(ref.current.innerHTML));
  };

  const handleInput = () => {
    if (ref.current) onChange(DOMPurify.sanitize(ref.current.innerHTML));
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border-b border-slate-200">
        {[
          { label: "B", cmd: "bold", style: "font-bold" },
          { label: "I", cmd: "italic", style: "italic" },
          { label: "U", cmd: "underline", style: "underline" },
        ].map(({ label, cmd, style }) => (
          <button key={cmd} type="button" onMouseDown={(e) => { e.preventDefault(); exec(cmd); }}
            className={`px-2.5 py-1 text-sm rounded-lg hover:bg-slate-200 transition-colors ${style}`}>
            {label}
          </button>
        ))}
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("insertUnorderedList"); }}
          className="px-2.5 py-1 text-sm rounded-lg hover:bg-slate-200 transition-colors">• List</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("formatBlock", "h2"); }}
          className="px-2.5 py-1 text-sm rounded-lg hover:bg-slate-200 transition-colors font-semibold">H2</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("formatBlock", "blockquote"); }}
          className="px-2.5 py-1 text-sm rounded-lg hover:bg-slate-200 transition-colors">&ldquo;&rdquo;</button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        dir="ltr"
        className="min-h-[300px] p-4 text-slate-800 focus:outline-none prose max-w-none"
      />
    </div>
  );
}
