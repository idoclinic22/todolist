"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Course,
  CourseRow,
  Priority,
  Todo,
  TodoRow,
  rowToCourse,
  rowToTodo,
} from "@/lib/types";

interface State {
  courses: Course[];
  todos: Todo[];
}

interface WriteResult {
  error: { message: string } | null;
}

export interface TodoStore {
  state: State;
  /** 최초 로드 완료 여부 */
  hydrated: boolean;
  /** 마지막 오류 메시지 (없으면 null) */
  error: string | null;

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

const EMPTY: State = { courses: [], todos: [] };

export function useTodoStore(userId: string | null): TodoStore {
  const [state, setState] = useState<State>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stateRef = useRef(state);
  stateRef.current = state;

  const reload = useCallback(async () => {
    if (!userId) {
      setState(EMPTY);
      setHydrated(true);
      return;
    }
    const [courseRes, todoRes] = await Promise.all([
      supabase.from("courses").select("*").order("sort_order"),
      supabase.from("todos").select("*").order("sort_order"),
    ]);
    if (courseRes.error || todoRes.error) {
      setError((courseRes.error ?? todoRes.error)!.message);
      setHydrated(true);
      return;
    }
    setState({
      courses: (courseRes.data as CourseRow[]).map(rowToCourse),
      todos: (todoRes.data as TodoRow[]).map(rowToTodo),
    });
    setError(null);
    setHydrated(true);
  }, [userId]);

  useEffect(() => {
    setHydrated(false);
    reload();
  }, [reload]);

  /** 낙관적 업데이트 후 DB 반영. 실패 시 서버 상태로 되돌림. */
  const mutate = useCallback(
    async (
      optimistic: (s: State) => State,
      write: () => PromiseLike<WriteResult>,
    ) => {
      setState(optimistic(stateRef.current));
      const { error: writeError } = await write();
      if (writeError) {
        setError(writeError.message);
        await reload();
      } else {
        setError(null);
      }
    },
    [reload],
  );

  // ---------- 강좌 ----------

  const addCourse = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed || !userId) return;
      const id = crypto.randomUUID();
      const order = stateRef.current.courses.length;
      mutate(
        (s) => ({
          ...s,
          courses: [
            ...s.courses,
            { id, name: trimmed, order, createdAt: Date.now() },
          ],
        }),
        () =>
          supabase
            .from("courses")
            .insert({ id, user_id: userId, name: trimmed, sort_order: order }),
      );
    },
    [userId, mutate],
  );

  const renameCourse = useCallback(
    (courseId: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      mutate(
        (s) => ({
          ...s,
          courses: s.courses.map((c) =>
            c.id === courseId ? { ...c, name: trimmed } : c,
          ),
        }),
        () =>
          supabase.from("courses").update({ name: trimmed }).eq("id", courseId),
      );
    },
    [mutate],
  );

  const deleteCourse = useCallback(
    (courseId: string) => {
      mutate(
        (s) => ({
          courses: s.courses.filter((c) => c.id !== courseId),
          todos: s.todos.filter((t) => t.courseId !== courseId),
        }),
        () => supabase.from("courses").delete().eq("id", courseId),
      );
    },
    [mutate],
  );

  // ---------- 할 일 ----------

  const addTodo = useCallback(
    (courseId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !userId) return;
      const id = crypto.randomUUID();
      const order = stateRef.current.todos.filter(
        (t) => t.courseId === courseId,
      ).length;
      mutate(
        (s) => ({
          ...s,
          todos: [
            ...s.todos,
            {
              id,
              courseId,
              text: trimmed,
              done: false,
              priority: "normal",
              dueDate: null,
              order,
              createdAt: Date.now(),
            },
          ],
        }),
        () =>
          supabase.from("todos").insert({
            id,
            user_id: userId,
            course_id: courseId,
            text: trimmed,
            sort_order: order,
          }),
      );
    },
    [userId, mutate],
  );

  const toggleTodo = useCallback(
    (todoId: string) => {
      const current = stateRef.current.todos.find((t) => t.id === todoId);
      if (!current) return;
      const next = !current.done;
      mutate(
        (s) => ({
          ...s,
          todos: s.todos.map((t) =>
            t.id === todoId ? { ...t, done: next } : t,
          ),
        }),
        () => supabase.from("todos").update({ done: next }).eq("id", todoId),
      );
    },
    [mutate],
  );

  const editTodo = useCallback(
    (todoId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      mutate(
        (s) => ({
          ...s,
          todos: s.todos.map((t) =>
            t.id === todoId ? { ...t, text: trimmed } : t,
          ),
        }),
        () =>
          supabase.from("todos").update({ text: trimmed }).eq("id", todoId),
      );
    },
    [mutate],
  );

  const setPriority = useCallback(
    (todoId: string, priority: Priority) => {
      mutate(
        (s) => ({
          ...s,
          todos: s.todos.map((t) =>
            t.id === todoId ? { ...t, priority } : t,
          ),
        }),
        () => supabase.from("todos").update({ priority }).eq("id", todoId),
      );
    },
    [mutate],
  );

  const setDueDate = useCallback(
    (todoId: string, dueDate: string | null) => {
      const value = dueDate || null;
      mutate(
        (s) => ({
          ...s,
          todos: s.todos.map((t) =>
            t.id === todoId ? { ...t, dueDate: value } : t,
          ),
        }),
        () =>
          supabase.from("todos").update({ due_date: value }).eq("id", todoId),
      );
    },
    [mutate],
  );

  const deleteTodo = useCallback(
    (todoId: string) => {
      mutate(
        (s) => ({
          ...s,
          todos: s.todos.filter((t) => t.id !== todoId),
        }),
        () => supabase.from("todos").delete().eq("id", todoId),
      );
    },
    [mutate],
  );

  return {
    state,
    hydrated,
    error,
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
