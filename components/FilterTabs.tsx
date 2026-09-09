"use client";

import { TodoFilter } from "@/lib/types";

const TABS: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "done", label: "완료" },
];

interface Props {
  value: TodoFilter;
  onChange: (value: TodoFilter) => void;
}

export default function FilterTabs({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-full bg-background p-1" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={
            "rounded-full px-3 py-1 text-xs font-bold transition-colors " +
            (value === tab.value
              ? "bg-ink text-lime"
              : "text-muted hover:text-ink")
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
