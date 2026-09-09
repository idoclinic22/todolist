-- ============================================================
--  AK 강의 할 일 — Supabase 스키마
--  Supabase 대시보드 > SQL Editor 에 붙여넣고 RUN 하세요.
--  (여러 번 실행해도 안전하도록 작성)
-- ============================================================

-- ---------- 강좌 ----------
create table if not exists public.courses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  name       text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- 할 일 ----------
create table if not exists public.todos (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  course_id  uuid not null references public.courses (id) on delete cascade,
  text       text not null,
  done       boolean not null default false,
  priority   text not null default 'normal' check (priority in ('high', 'normal', 'low')),
  due_date   date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists courses_user_idx on public.courses (user_id);
create index if not exists todos_user_idx   on public.todos (user_id);
create index if not exists todos_course_idx on public.todos (course_id);

-- ---------- Row Level Security ----------
-- 로그인한 본인의 행만 읽기/쓰기 가능
alter table public.courses enable row level security;
alter table public.todos   enable row level security;

drop policy if exists "own courses" on public.courses;
create policy "own courses" on public.courses
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own todos" on public.todos;
create policy "own todos" on public.todos
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
