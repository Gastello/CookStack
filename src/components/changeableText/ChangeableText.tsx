import { useRef, useEffect } from "react";

export type ChangeableTextProps = {
  styles?: string;
  text: string;
  onChange: (value: string) => void;
  digitsOnly?: boolean;
  editable?: boolean;
};

export default function ChangeableText({
  styles = "",
  text,
  onChange,
  digitsOnly = false,
  editable = false,
}: ChangeableTextProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const cleanText = (raw: string) =>
    digitsOnly ? raw.replace(/[^\d]/g, "") : raw;

  const placeCaretAtEnd = (el: HTMLElement) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  useEffect(() => {
    if (divRef.current && divRef.current.innerText !== text) {
      divRef.current.innerText = text;
    }
  }, [text]);

  const handleInput = () => {
    if (!divRef.current) return;
    const raw = divRef.current.innerText || "";
    const cleaned = cleanText(raw);

    if (raw !== cleaned) {
      divRef.current.innerText = cleaned;
      placeCaretAtEnd(divRef.current);
    }

    onChange(cleaned);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain");
    const clean = cleanText(pasted);

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(clean));
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);

    // Важливо — явно тригеримо оновлення
    onChange(clean);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <div
      ref={divRef}
      className={`inline-block relative ${
        editable ? "focus:outline-none" : "cursor-default select-none"
      } ${styles}`}
      contentEditable={editable}
      suppressContentEditableWarning
      spellCheck={false}
      onInput={editable ? handleInput : undefined}
      onPaste={editable ? handlePaste : undefined}
      onKeyDown={editable ? handleKeyDown : undefined}
      style={{
        minWidth: "1ch",
        background: "transparent",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        verticalAlign: "baseline",
      }}
    />
  );
}
