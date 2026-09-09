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
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="할 일 입력 후 Enter"
        className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        aria-label="할 일 입력"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
        disabled={!text.trim()}
      >
        추가
      </button>
    </form>
  );
}
