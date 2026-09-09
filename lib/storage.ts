import { AppState, CURRENT_VERSION, Priority, Todo, Course } from "./types";

export const STORAGE_KEY = "ak-todo:v1";

export function emptyState(): AppState {
  return { version: CURRENT_VERSION, courses: [], todos: [] };
}

export function createId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  // 폴백: 구형 환경
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isPriority(v: unknown): v is Priority {
  return v === "high" || v === "normal" || v === "low";
}

/** 저장된 임의 데이터를 안전한 AppState로 정규화 (손상/구버전 방어) */
function normalize(raw: unknown): AppState {
  if (!raw || typeof raw !== "object") return emptyState();
  const obj = raw as Record<string, unknown>;

  const courses: Course[] = Array.isArray(obj.courses)
    ? (obj.courses as unknown[]).flatMap((c, i) => {
        if (!c || typeof c !== "object") return [];
        const o = c as Record<string, unknown>;
        if (typeof o.id !== "string" || typeof o.name !== "string") return [];
        return [
          {
            id: o.id,
            name: o.name,
            order: typeof o.order === "number" ? o.order : i,
            createdAt:
              typeof o.createdAt === "number" ? o.createdAt : Date.now(),
          },
        ];
      })
    : [];

  const courseIds = new Set(courses.map((c) => c.id));

  const todos: Todo[] = Array.isArray(obj.todos)
    ? (obj.todos as unknown[]).flatMap((t, i) => {
        if (!t || typeof t !== "object") return [];
        const o = t as Record<string, unknown>;
        if (
          typeof o.id !== "string" ||
          typeof o.courseId !== "string" ||
          typeof o.text !== "string" ||
          !courseIds.has(o.courseId)
        ) {
          return [];
        }
        return [
          {
            id: o.id,
            courseId: o.courseId,
            text: o.text,
            done: o.done === true,
            priority: isPriority(o.priority) ? o.priority : "normal",
            dueDate:
              typeof o.dueDate === "string" && o.dueDate ? o.dueDate : null,
            order: typeof o.order === "number" ? o.order : i,
            createdAt:
              typeof o.createdAt === "number" ? o.createdAt : Date.now(),
          },
        ];
      })
    : [];

  return { version: CURRENT_VERSION, courses, todos };
}

export function loadState(): AppState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    return normalize(JSON.parse(raw));
  } catch {
    return emptyState();
  }
}

/** @returns 저장 성공 여부 */
export function saveState(state: AppState): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
