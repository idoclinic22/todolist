"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Priority, PRIORITY_LABEL, Todo } from "@/lib/types";
import { todayISO } from "@/lib/sort";

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onSetPriority: (id: string, priority: Priority) => void;
  onSetDueDate: (id: string, dueDate: string | null) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_STYLE: Record<Priority, string> = {
  high: "bg-red-100 text-red-700",
  normal: "bg-background text-muted",
  low: "bg-background text-muted/60",
};

export default function TodoItem({
  todo,
  onToggle,
  onEdit,
  onSetPriority,
  onSetDueDate,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== todo.text) onEdit(todo.id, trimmed);
    else setDraft(todo.text);
    setEditing(false);
  }

  function cancel() {
    setDraft(todo.text);
    setEditing(false);
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") commit();
    else if (e.key === "Escape") cancel();
  }

  const today = todayISO();
  const dateTone =
    todo.dueDate && !todo.done
      ? todo.dueDate < today
        ? "text-red-600"
        : todo.dueDate === today
          ? "text-ink font-semibold"
          : "text-muted"
      : "text-muted/60";

  return (
    <li className="group rounded-2xl px-2 py-2 transition-colors hover:bg-background">
      <div className="flex items-start gap-3">
        {/* 라임으로 채워지는 커스텀 체크박스 */}
        <button
          type="button"
          onClick={() => onToggle(todo.id)}
          aria-label={todo.done ? "완료 취소" : "완료 표시"}
          aria-pressed={todo.done}
          className={
            "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 transition-all " +
            (todo.done
              ? "border-lime bg-lime text-ink"
              : "border-ink/25 text-transparent hover:border-ink")
          }
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6.5l2.5 2.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={onKey}
            className="min-w-0 flex-1 rounded-lg bg-paper px-2 py-1 text-sm outline outline-2 outline-ink"
          />
        ) : (
          <span
            onDoubleClick={() => setEditing(true)}
            className={
              "min-w-0 flex-1 cursor-text break-words pt-0.5 text-sm " +
              (todo.done ? "text-muted/60 line-through" : "text-foreground")
            }
            title="더블클릭하여 수정"
          >
            {todo.text}
          </span>
        )}

        {/* 편집 / 삭제 (호버 시 노출) */}
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="grid size-7 place-items-center rounded-full text-muted hover:bg-line hover:text-ink"
              aria-label="수정"
            >
              ✎
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(todo.id)}
            className="grid size-7 place-items-center rounded-full text-muted hover:bg-red-100 hover:text-red-600"
            aria-label="삭제"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 메타 정보 (날짜 · 우선순위) — 체크박스 폭만큼 들여쓰기 */}
      <div className="mt-1.5 flex items-center gap-2 pl-9">
        <label className="relative">
          <span className={"text-xs tabular-nums " + dateTone}>
            {todo.dueDate ?? "＋ 날짜"}
          </span>
          <input
            type="date"
            value={todo.dueDate ?? ""}
            onChange={(e) => onSetDueDate(todo.id, e.target.value || null)}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label="강의 날짜"
          />
        </label>

        <select
          value={todo.priority}
          onChange={(e) => onSetPriority(todo.id, e.target.value as Priority)}
          className={
            "cursor-pointer rounded-full px-2.5 py-1 text-xs font-bold outline-none " +
            PRIORITY_STYLE[todo.priority]
          }
          aria-label="우선순위"
        >
          {(["high", "normal", "low"] as Priority[]).map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABEL[p]}
            </option>
          ))}
        </select>
      </div>
    </li>
  );
}
