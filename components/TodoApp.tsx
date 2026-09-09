"use client";

import { useMemo, useState } from "react";
import { Course, Todo } from "@/lib/types";
import { useTodoStore } from "@/hooks/useTodoStore";
import AddCourseForm from "./AddCourseForm";
import CourseSection from "./CourseSection";
import ConfirmDialog from "./ConfirmDialog";

export default function TodoApp() {
  const store = useTodoStore();
  const { courses: rawCourses, todos } = store.state;
  const [pendingDelete, setPendingDelete] = useState<Course | null>(null);

  const courses = useMemo(
    () => [...rawCourses].sort((a, b) => a.order - b.order),
    [rawCourses],
  );

  const todosByCourse = useMemo(() => {
    const map = new Map<string, Todo[]>();
    for (const t of todos) {
      const arr = map.get(t.courseId);
      if (arr) arr.push(t);
      else map.set(t.courseId, [t]);
    }
    return map;
  }, [todos]);

  const total = todos.length;
  const done = todos.filter((t) => t.done).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div>
      <header>
        <p className="eyebrow text-muted">AK 응용근신경학 강의</p>
        <h1 className="display mt-3 text-[15vw] leading-none sm:text-7xl">
          할 일
        </h1>

        {/* 블랙 요약 카드 — 참고 이미지의 포인트 카드 느낌 */}
        <div className="mt-7 rounded-[28px] bg-ink p-6 text-white">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-white/55">전체 진행률</span>
            <span className="rounded-full bg-lime px-3 py-1 text-xs font-bold text-ink">
              강좌 {courses.length}개
            </span>
          </div>

          {total === 0 ? (
            <p className="mt-4 text-sm text-white/60">
              아직 할 일이 없어요. 아래에서 강좌를 먼저 추가하세요.
            </p>
          ) : (
            <>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="display text-6xl text-lime">{done}</span>
                <span className="text-lg font-medium text-white/45">
                  / {total} 완료
                </span>
              </div>
              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-lime transition-[width] duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-2.5 text-xs font-medium text-white/45">
                {total - done}개 남음 · {pct}%
              </p>
            </>
          )}
        </div>

        <div className="mt-5">
          <AddCourseForm onAdd={store.addCourse} />
        </div>
      </header>

      {store.persistError && (
        <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          이 브라우저에서 저장소를 사용할 수 없어 변경 내용이 유지되지 않을 수
          있습니다. (사생활 보호 모드 또는 저장 공간 부족)
        </div>
      )}

      {!store.hydrated ? (
        <p className="eyebrow mt-10 text-center text-muted">불러오는 중…</p>
      ) : courses.length === 0 ? (
        <div className="mt-6 rounded-[28px] border-2 border-dashed border-line py-16 text-center">
          <p className="text-sm font-medium text-muted">
            아직 강좌가 없습니다.
          </p>
          <p className="mt-1 text-sm text-muted">
            위 입력창에 첫 강좌를 추가해 보세요.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {courses.map((course) => (
            <CourseSection
              key={course.id}
              course={course}
              todos={todosByCourse.get(course.id) ?? []}
              onRenameCourse={store.renameCourse}
              onRequestDeleteCourse={setPendingDelete}
              onAddTodo={store.addTodo}
              onToggleTodo={store.toggleTodo}
              onEditTodo={store.editTodo}
              onSetPriority={store.setPriority}
              onSetDueDate={store.setDueDate}
              onDeleteTodo={store.deleteTodo}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="강좌를 삭제할까요?"
        message={
          pendingDelete
            ? `"${pendingDelete.name}" 강좌와 그 안의 모든 할 일이 삭제됩니다. 되돌릴 수 없습니다.`
            : undefined
        }
        confirmLabel="강좌 삭제"
        onConfirm={() => {
          if (pendingDelete) store.deleteCourse(pendingDelete.id);
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
