# AK 강의 할 일 (투두 리스트)

AK(응용근신경학) 강의 준비를 **강좌별로** 관리하는 개인용 투두 리스트.
서버·데이터베이스·로그인 없이, 입력한 내용은 **브라우저(localStorage)에 자동 저장**되어
새로고침하거나 나중에 다시 열어도 그대로 남습니다.

**배포 주소: https://todolist-idoclinic22-9180.vercel.app**

기획서: [`docs/기획서.md`](docs/기획서.md)

> `main` 브랜치에 `git push` 하면 Vercel이 자동으로 다시 배포합니다.
> 예전(미니멀 라이트) 디자인은 태그 `v1-original` 로 보존되어 있습니다.

## 주요 기능

- 강좌(그룹) 추가 · 이름 수정 · 삭제(확인 모달)
- 강좌별 할 일 추가 · 완료 체크 · 인라인 수정 · 삭제
- 우선순위(높음/보통/낮음) — 변경 시 자동 재정렬
- 할 일별 강의 날짜(선택) — 지난 날짜는 빨강, 오늘은 강조
- 강좌별 필터: 전체 / 진행 중 / 완료
- 모든 변경 즉시 자동 저장, 재방문 시 자동 복원

## 실행 방법

### 가장 쉬운 방법 (Windows)

바탕화면의 **`AK 할일앱 시작`** 아이콘을 더블클릭하면 서버가 켜지고 브라우저가
자동으로 열립니다. 다 쓰면 검은 창을 닫으면 됩니다.

> 앱을 볼 때마다 이 과정을 해야 합니다. 개발 서버는 컴퓨터를 껐다 켜면 사라지므로,
> `localhost:3000 연결 거부`가 뜨면 서버가 꺼진 것 — 아이콘을 다시 더블클릭하세요.

### 명령어로 실행

Node.js 18.18 이상 필요.

```bash
npm install   # 최초 1회만
npm run dev
```

브라우저에서 http://localhost:3000 접속.

프로덕션 빌드:

```bash
npm run build
npm run start
```

## 데이터 저장 / 초기화

- 저장 위치: 브라우저 `localStorage`, 키 이름 `ak-todo:v1`
- 브라우저·기기가 바뀌면 데이터는 공유되지 않습니다(개인 브라우저 전용).
- 전체 초기화: 브라우저 개발자도구(F12) → Application → Local Storage에서
  `ak-todo:v1` 삭제 후 새로고침. 또는 콘솔에서:

  ```js
  localStorage.removeItem("ak-todo:v1")
  ```

## 기술 스택

Next.js (App Router) · TypeScript · Tailwind CSS v4 · 상태는 React 훅 + localStorage

## 폴더 구조

```
app/            Next.js App Router (layout, page, globals.css)
components/      UI 컴포넌트 (TodoApp, CourseSection, TodoItem 등)
hooks/          useTodoStore — 상태 + localStorage 동기화
lib/            types, storage(직렬화/정규화), sort(정렬)
docs/           기획서
```
