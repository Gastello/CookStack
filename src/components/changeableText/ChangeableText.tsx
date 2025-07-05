import { useRef, useEffect } from "react";

type ChangeableTextProps = {
  styles?: string;
  text: string;
  onChange: (value: string) => void;
  digitsOnly?: boolean;
  bordered?: boolean;
};

export default function ChangeableText({
  styles = "",
  text,
  onChange,
  digitsOnly = false,
}: ChangeableTextProps) {
  const divRef = useRef<HTMLDivElement>(null);

  // Очистка від нецифрових символів
  const cleanText = (raw: string) => {
    return digitsOnly ? raw.replace(/[^\d]/g, "") : raw;
  };

  // Ставимо курсор у кінець
  const placeCaretAtEnd = (el: HTMLElement) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false); // false = курсор у кінець
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  // Синхронізація innerText при зміні text пропа
  useEffect(() => {
    if (divRef.current && divRef.current.innerText !== text) {
      divRef.current.innerText = text;
    }
  }, [text]);

  return (
    <div
      ref={divRef}
      className={`inline-block focus:outline-none relative ${styles}`}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onInput={() => {
        if (!divRef.current) return;

        const raw = divRef.current.innerText || "";
        const cleaned = cleanText(raw);

        if (raw !== cleaned) {
          divRef.current.innerText = cleaned;
          placeCaretAtEnd(divRef.current);
        }

        onChange(cleaned);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
      onPaste={(e) => {
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
      }}
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
