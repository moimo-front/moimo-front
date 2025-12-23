# 모이모(MoiMo) 프로젝트

### 폴더 구조 생성
`src` 폴더 내부 구성
```text
src/
├── assets/
├── components/
│   ├── ui/           # shadcn 컴포넌트
│   ├── common/       # Header, Footer, Layout
│   ├── auth/         # 로그인, 회원가입 관련
│   ├── moim/         # 모임 관련 컴포넌트
│   ├── chat/         # 채팅 관련 컴포넌트
├── hooks/            # 커스텀 훅 (useAuth, useSocket)
├── lib/              # 유틸리티 (utils.ts, axios.ts)
├── pages/            # 라우트 페이지
├── store/            # Zustand 스토어
├── models/           # TypeScript 타입 정의
│   ├── user.model.ts
│   ├── interest.model.ts
│   ├── meeting.model.ts
│   ├── participation.model.ts
│   ├── chat.model.ts
```

---
---
---
