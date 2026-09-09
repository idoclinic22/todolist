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
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="새 강좌 이름 (예: AK 기초과정 3기)"
        className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        aria-label="새 강좌 이름"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
        disabled={!name.trim()}
      >
        강좌 추가
      </button>
    </form>
  );
}
