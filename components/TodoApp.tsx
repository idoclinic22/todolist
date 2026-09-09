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

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-2xl font-bold text-neutral-900">AK 강의 할 일</h1>
        <p className="text-sm text-neutral-500">
          강좌별로 준비할 일을 관리하세요. 입력한 내용은 이 브라우저에 자동
          저장되어 새로고침해도 유지됩니다.
        </p>
        <AddCourseForm onAdd={store.addCourse} />
      </header>

      {store.persistError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          이 브라우저에서 저장소를 사용할 수 없어 변경 내용이 유지되지 않을 수
          있습니다. (사생활 보호 모드 또는 저장 공간 부족)
        </div>
      )}

      {!store.hydrated ? (
        <p className="py-10 text-center text-sm text-neutral-400">
          불러오는 중…
        </p>
      ) : courses.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 py-12 text-center text-sm text-neutral-400">
          아직 강좌가 없습니다. 위에서 첫 강좌를 추가해 보세요.
        </p>
      ) : (
        <div className="space-y-4">
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
