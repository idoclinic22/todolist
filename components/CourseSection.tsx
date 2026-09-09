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
  const allDone = todos.length > 0 && doneCount === todos.length;

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
    <section className="rounded-[28px] bg-paper p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-12px_rgba(0,0,0,0.12)]">
      <header className="flex flex-wrap items-start gap-x-3 gap-y-3">
        <div className="min-w-0 flex-1">
          {editingName ? (
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={commitName}
              onKeyDown={onNameKey}
              className="w-full rounded-lg bg-background px-2 py-1 text-xl font-extrabold tracking-tight outline-none"
            />
          ) : (
            <h2
              className="cursor-text truncate text-xl font-extrabold tracking-tight"
              onDoubleClick={() => setEditingName(true)}
              title="더블클릭하여 강좌 이름 수정"
            >
              {course.name}
            </h2>
          )}
          <div className="mt-1.5 flex items-center gap-2">
            <span
              className={
                "rounded-full px-2.5 py-0.5 text-xs font-bold " +
                (allDone
                  ? "bg-lime text-ink"
                  : "bg-background text-muted")
              }
            >
              {doneCount} / {todos.length} 완료
            </span>
            {allDone && (
              <span className="eyebrow text-lime-deep">DONE</span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setNameDraft(course.name);
              setEditingName(true);
            }}
            className="rounded-full px-2.5 py-1 text-xs font-medium text-muted hover:bg-background hover:text-ink"
          >
            이름수정
          </button>
          <button
            type="button"
            onClick={() => onRequestDeleteCourse(course)}
            className="rounded-full px-2.5 py-1 text-xs font-medium text-muted hover:bg-red-50 hover:text-red-600"
          >
            삭제
          </button>
        </div>
      </header>

      <div className="mt-4">
        <FilterTabs value={filter} onChange={setFilter} />
      </div>

      <div className="mt-3 space-y-1">
        {todos.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">
            이 강좌에 할 일이 없습니다.
          </p>
        ) : visible.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">
            {filter === "done"
              ? "완료된 할 일이 없습니다."
              : "진행 중인 할 일이 없습니다."}
          </p>
        ) : (
          <ul>
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

      <div className="mt-3 border-t border-line pt-3">
        <AddTodoForm onAdd={(text) => onAddTodo(course.id, text)} />
      </div>
    </section>
  );
}
