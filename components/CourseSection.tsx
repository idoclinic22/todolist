"use client";

import { KeyboardEvent, useMemo, useState } from "react";
import { Course, Priority, Todo, TodoFilter } from "@/lib/types";
import { sortTodos } from "@/lib/sort";
import AddTodoForm from "./AddTodoForm";
import FilterTabs from "./FilterTabs";
import TodoItem from "./TodoItem";

interface Props {
  course: Course;
  todos: Todo[];
  onRenameCourse: (id: string, name: string) => void;
  onRequestDeleteCourse: (course: Course) => void;
  onAddTodo: (courseId: string, text: string) => void;
  onToggleTodo: (id: string) => void;
  onEditTodo: (id: string, text: string) => void;
  onSetPriority: (id: string, priority: Priority) => void;
  onSetDueDate: (id: string, dueDate: string | null) => void;
  onDeleteTodo: (id: string) => void;
}

export default function CourseSection({
  course,
  todos,
  onRenameCourse,
  onRequestDeleteCourse,
  onAddTodo,
  onToggleTodo,
  onEditTodo,
  onSetPriority,
  onSetDueDate,
  onDeleteTodo,
}: Props) {
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(course.name);

  const doneCount = todos.filter((t) => t.done).length;

  const visible = useMemo(() => {
    const filtered = todos.filter((t) =>
      filter === "all" ? true : filter === "done" ? t.done : !t.done,
    );
    return sortTodos(filtered);
  }, [todos, filter]);

  function commitName() {
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== course.name) onRenameCourse(course.id, trimmed);
    else setNameDraft(course.name);
    setEditingName(false);
  }

  function onNameKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") commitName();
    else if (e.key === "Escape") {
      setNameDraft(course.name);
      setEditingName(false);
    }
  }

  return (
    <section className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-neutral-100 px-4 py-3">
        {editingName ? (
          <input
            autoFocus
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={commitName}
            onKeyDown={onNameKey}
            className="min-w-0 flex-1 rounded border border-accent px-1.5 py-0.5 text-base font-semibold outline-none"
          />
        ) : (
          <h2
            className="min-w-0 flex-1 cursor-text truncate text-base font-semibold text-neutral-900"
            onDoubleClick={() => setEditingName(true)}
            title="더블클릭하여 강좌 이름 수정"
          >
            {course.name}
          </h2>
        )}

        <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-xs tabular-nums text-neutral-500">
          {doneCount} / {todos.length}
        </span>

        <FilterTabs value={filter} onChange={setFilter} />

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setNameDraft(course.name);
              setEditingName(true);
            }}
            className="rounded px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100"
          >
            이름수정
          </button>
          <button
            type="button"
            onClick={() => onRequestDeleteCourse(course)}
            className="rounded px-2 py-1 text-xs text-neutral-500 hover:bg-red-50 hover:text-red-600"
          >
            삭제
          </button>
        </div>
      </header>

      <div className="space-y-2 px-4 py-3">
        <AddTodoForm onAdd={(text) => onAddTodo(course.id, text)} />

        {todos.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-neutral-400">
            이 강좌에 할 일이 없습니다.
          </p>
        ) : visible.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-neutral-400">
            {filter === "done"
              ? "완료된 할 일이 없습니다."
              : "진행 중인 할 일이 없습니다."}
          </p>
        ) : (
          <ul className="-mx-2">
            {visible.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggleTodo}
                onEdit={onEditTodo}
                onSetPriority={onSetPriority}
                onSetDueDate={onSetDueDate}
                onDelete={onDeleteTodo}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
