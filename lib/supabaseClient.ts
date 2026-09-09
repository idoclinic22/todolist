import { createClient } from "@supabase/supabase-js";

/**
 * Supabase 접속 정보.
 * URL 과 publishable(anon) 키는 원래 브라우저에 노출되는 공개 값이다.
 * 실제 데이터 보호는 DB의 RLS 정책(본인 행만 읽기/쓰기)이 담당한다.
 * 환경변수가 있으면 그것을 우선 사용하고, 없으면 아래 기본값으로 동작한다.
 */
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://zzoggygqnbuavwltxspk.supabase.co";

const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_ZolA15Mc6b0brFHd7fZnnw_6Nxya392";

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});
