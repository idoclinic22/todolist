"use client";

import { FormEvent, useState } from "react";

interface Props {
  onAdd: (text: string) => void;
}

export default function AddTodoForm({ onAdd }: Props) {
  const [text, setText] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="할 일 추가…"
        className="h-11 flex-1 rounded-full bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted/70 focus:bg-line/60"
        aria-label="할 일 입력"
      />
      <button
        type="submit"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-lime transition-transform hover:scale-105 active:scale-95 disabled:opacity-25 disabled:hover:scale-100"
        disabled={!text.trim()}
        aria-label="할 일 추가"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 4v12M4 10h12"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </form>
  );
}
