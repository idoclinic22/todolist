"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const errDesc = url.searchParams.get("error_description");

      if (errDesc) {
        setError(errDesc);
        return;
      }
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setError(error.message);
          return;
        }
      }
      router.replace("/");
    };
    run();
  }, [router]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-5">
      {error ? (
        <div className="text-center">
          <p className="text-sm text-red-600">로그인 처리 중 오류: {error}</p>
          <Link href="/" className="mt-3 inline-block text-sm underline">
            처음으로 돌아가기
          </Link>
        </div>
      ) : (
        <p className="eyebrow text-muted">로그인 중…</p>
      )}
    </main>
  );
}
