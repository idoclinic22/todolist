import TodoApp from "@/components/TodoApp";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-20 pt-10 sm:pt-16">
      <TodoApp />
      <footer className="eyebrow mt-16 text-muted">
        AK 강의를 위해 · 군더더기 없이 · 할 일만
      </footer>
    </main>
  );
}
