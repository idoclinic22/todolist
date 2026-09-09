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
  high: "bg-red-50 text-red-700 border-red-200",
  normal: "bg-neutral-100 text-neutral-600 border-neutral-200",
  low: "bg-neutral-50 text-neutral-400 border-neutral-200",
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
          ? "text-accent font-medium"
          : "text-neutral-500"
      : "text-neutral-400";

  return (
    <li className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-neutral-50">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        className="size-4 shrink-0 accent-accent"
        aria-label={todo.done ? "완료 취소" : "완료 표시"}
      />

      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={onKey}
          className="flex-1 rounded border border-accent px-1.5 py-0.5 text-sm outline-none"
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          className={
            "flex-1 cursor-text text-sm " +
            (todo.done ? "text-neutral-400 line-through" : "text-neutral-800")
          }
          title="더블클릭하여 수정"
        >
          {todo.text}
        </span>
      )}

      {/* 날짜 */}
      <label className="relative">
        <span className={"text-xs tabular-nums " + dateTone}>
          {todo.dueDate ?? "＋날짜"}
        </span>
        <input
          type="date"
          value={todo.dueDate ?? ""}
          onChange={(e) => onSetDueDate(todo.id, e.target.value || null)}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="강의 날짜"
        />
      </label>

      {/* 우선순위 */}
      <select
        value={todo.priority}
        onChange={(e) => onSetPriority(todo.id, e.target.value as Priority)}
        className={
          "shrink-0 cursor-pointer rounded border px-1.5 py-0.5 text-xs outline-none " +
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

      {/* 편집 / 삭제 (호버 시 노출) */}
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700"
            aria-label="수정"
          >
            ✎
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          className="rounded p-1 text-neutral-400 hover:bg-red-100 hover:text-red-600"
          aria-label="삭제"
        >
          ✕
        </button>
      </div>
    </li>
  );
}
