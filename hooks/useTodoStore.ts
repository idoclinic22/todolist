"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Priority } from "@/lib/types";
import {
  createId,
  emptyState,
  loadState,
  saveState,
} from "@/lib/storage";

interface UseTodoStore {
  state: AppState;
  hydrated: boolean;
  /** localStorage 저장이 불가능한 환경인지 (사생활 모드 등) */
  persistError: boolean;

  addCourse: (name: string) => void;
  renameCourse: (courseId: string, name: string) => void;
  deleteCourse: (courseId: string) => void;

  addTodo: (courseId: string, text: string) => void;
  toggleTodo: (todoId: string) => void;
  editTodo: (todoId: string, text: string) => void;
  setPriority: (todoId: string, priority: Priority) => void;
  setDueDate: (todoId: string, dueDate: string | null) => void;
  deleteTodo: (todoId: string) => void;
}

export function useTodoStore(): UseTodoStore {
  const [state, setState] = useState<AppState>(emptyState);
  const [hydrated, setHydrated] = useState(false);
  const [persistError, setPersistError] = useState(false);
  const firstSave = useRef(true);

  // 마운트 후 클라이언트에서만 로드 (SSR hydration 안전)
  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  // 상태 변경 시 자동 저장 (하이드레이션 완료 후)
  useEffect(() => {
    if (!hydrated) return;
    // 로드 직후 첫 실행은 저장 생략 (불필요한 write 방지)
    if (firstSave.current) {
      firstSave.current = false;
      return;
    }
    const ok = saveState(state);
    setPersistError(!ok);
  }, [state, hydrated]);

  const addCourse = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((s) => ({
      ...s,
      courses: [
        ...s.courses,
        {
          id: createId(),
          name: trimmed,
          order: s.courses.length,
          createdAt: Date.now(),
        },
      ],
    }));
  }, []);

  const renameCourse = useCallback((courseId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((s) => ({
      ...s,
      courses: s.courses.map((c) =>
        c.id === courseId ? { ...c, name: trimmed } : c,
      ),
    }));
  }, []);

  const deleteCourse = useCallback((courseId: string) => {
    setState((s) => ({
      ...s,
      courses: s.courses.filter((c) => c.id !== courseId),
      todos: s.todos.filter((t) => t.courseId !== courseId),
    }));
  }, []);

  const addTodo = useCallback((courseId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setState((s) => {
      const count = s.todos.filter((t) => t.courseId === courseId).length;
      return {
        ...s,
        todos: [
          ...s.todos,
          {
            id: createId(),
            courseId,
            text: trimmed,
            done: false,
            priority: "normal",
            dueDate: null,
            order: count,
            createdAt: Date.now(),
          },
        ],
      };
    });
  }, []);

  const toggleTodo = useCallback((todoId: string) => {
    setState((s) => ({
      ...s,
      todos: s.todos.map((t) =>
        t.id === todoId ? { ...t, done: !t.done } : t,
      ),
    }));
  }, []);

  const editTodo = useCallback((todoId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setState((s) => ({
      ...s,
      todos: s.todos.map((t) =>
        t.id === todoId ? { ...t, text: trimmed } : t,
      ),
    }));
  }, []);

  const setPriority = useCallback((todoId: string, priority: Priority) => {
    setState((s) => ({
      ...s,
      todos: s.todos.map((t) =>
        t.id === todoId ? { ...t, priority } : t,
      ),
    }));
  }, []);

  const setDueDate = useCallback((todoId: string, dueDate: string | null) => {
    setState((s) => ({
      ...s,
      todos: s.todos.map((t) =>
        t.id === todoId ? { ...t, dueDate: dueDate || null } : t,
      ),
    }));
  }, []);

  const deleteTodo = useCallback((todoId: string) => {
    setState((s) => ({
      ...s,
      todos: s.todos.filter((t) => t.id !== todoId),
    }));
  }, []);

  return {
    state,
    hydrated,
    persistError,
    addCourse,
    renameCourse,
    deleteCourse,
    addTodo,
    toggleTodo,
    editTodo,
    setPriority,
    setDueDate,
    deleteTodo,
  };
}
