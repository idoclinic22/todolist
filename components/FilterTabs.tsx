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
    <div
      className="inline-flex rounded-lg border border-neutral-200 bg-neutral-50 p-0.5 text-xs"
      role="tablist"
    >
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={
            "rounded-md px-2.5 py-1 font-medium transition-colors " +
            (value === tab.value
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-800")
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
