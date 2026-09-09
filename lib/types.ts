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

// ---------- Supabase 행(row) <-> 앱 타입 매핑 ----------

export interface CourseRow {
  id: string;
  user_id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface TodoRow {
  id: string;
  user_id: string;
  course_id: string;
  text: string;
  done: boolean;
  priority: Priority;
  due_date: string | null;
  sort_order: number;
  created_at: string;
}

export function rowToCourse(r: CourseRow): Course {
  return {
    id: r.id,
    name: r.name,
    order: r.sort_order,
    createdAt: Date.parse(r.created_at),
  };
}

export function rowToTodo(r: TodoRow): Todo {
  return {
    id: r.id,
    courseId: r.course_id,
    text: r.text,
    done: r.done,
    priority: r.priority,
    dueDate: r.due_date,
    order: r.sort_order,
    createdAt: Date.parse(r.created_at),
  };
}
