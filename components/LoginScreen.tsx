"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const { sendMagicLink } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "sending") return;
    setStatus("sending");
    const { error } = await sendMagicLink(email);
    if (error) {
      setStatus("error");
      setMessage(error);
    } else {
      setStatus("sent");
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <p className="eyebrow text-muted">AK 응용근신경학 강의</p>
      <h1 className="display mt-3 text-[13vw] leading-none sm:text-6xl">
        할 일
      </h1>

      <div className="mt-8 rounded-[28px] bg-ink p-6 text-white">
        {status === "sent" ? (
          <div>
            <p className="text-lg font-bold text-lime">메일을 보냈습니다</p>
            <p className="mt-2 text-sm text-white/70">
              <span className="font-medium text-white">{email}</span> 메일함에서
              로그인 링크를 눌러주세요. 이 창은 닫아도 됩니다.
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setEmail("");
              }}
              className="mt-4 text-xs text-white/50 underline"
            >
              다른 이메일로 다시 시도
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label className="eyebrow text-white/55">이메일로 로그인</label>
            <p className="mt-2 text-sm text-white/60">
              비밀번호 없이, 메일로 오는 링크를 눌러 로그인합니다.
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-4 h-12 w-full rounded-full border border-white/15 bg-white/5 px-5 text-sm text-white outline-none placeholder:text-white/40 focus:border-lime"
              aria-label="이메일"
            />
            <button
              type="submit"
              disabled={!email.trim() || status === "sending"}
              className="mt-3 h-12 w-full rounded-full bg-lime text-sm font-bold text-ink transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
            >
              {status === "sending" ? "보내는 중…" : "로그인 링크 받기"}
            </button>
            {status === "error" && (
              <p className="mt-3 text-xs text-red-300">{message}</p>
            )}
          </form>
        )}
      </div>

      <p className="eyebrow mt-8 text-muted">
        데이터는 Supabase 에 저장 · 로그인한 본인만 열람
      </p>
    </div>
  );
}
