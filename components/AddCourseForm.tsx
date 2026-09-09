"use client";

import { FormEvent, useState } from "react";

interface Props {
  onAdd: (name: string) => void;
}

export default function AddCourseForm({ onAdd }: Props) {
  const [name, setName] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name);
    setName("");
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="새 강좌 이름 (예: AK 기초과정 3기)"
        className="h-12 flex-1 rounded-full border border-line bg-paper px-5 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-ink"
        aria-label="새 강좌 이름"
      />
      <button
        type="submit"
        className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-lime transition-transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
        disabled={!name.trim()}
        aria-label="강좌 추가"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
