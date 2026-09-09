import { PRIORITY_WEIGHT, Todo } from "./types";

/**
 * 할 일 정렬:
 * 1) 미완료 우선
 * 2) 우선순위 높음 > 보통 > 낮음
 * 3) 추가한 순서 (order → createdAt)
 */
export function sortTodos(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const w = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
    if (w !== 0) return w;
    if (a.order !== b.order) return a.order - b.order;
    return a.createdAt - b.createdAt;
  });
}

/** 오늘 날짜를 "YYYY-MM-DD" 로 (로컬 타임존 기준) */
export function todayISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60_000).toISOString().slice(0, 10);
}
