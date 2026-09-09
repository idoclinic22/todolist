export type Priority = "high" | "normal" | "low";

export interface Course {
  id: string;
  name: string;
  order: number;
  createdAt: number;
}

export interface Todo {
  id: string;
  courseId: string;
  text: string;
  done: boolean;
  priority: Priority;
  /** "YYYY-MM-DD" 또는 null (선택적 강의 날짜) */
  dueDate: string | null;
  order: number;
  createdAt: number;
}

export interface AppState {
  version: number;
  courses: Course[];
  todos: Todo[];
}

export const CURRENT_VERSION = 1;

export const PRIORITY_LABEL: Record<Priority, string> = {
  high: "높음",
  normal: "보통",
  low: "낮음",
};

/** 정렬 시 우선순위 가중치 (작을수록 위) */
export const PRIORITY_WEIGHT: Record<Priority, number> = {
  high: 0,
  normal: 1,
  low: 2,
};

export type TodoFilter = "all" | "active" | "done";
