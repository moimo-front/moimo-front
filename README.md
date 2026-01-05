# 모이모(MoiMo) 프로젝트

### 폴더 구조 생성
`src` 폴더 내부 구성
```text
src/
├── api/              # API 호출 정의 (Axios client, auth.api.ts 등)
├── assets/           # 정적 파일 (이미지 등)
├── components/
│   ├── ui/           # shadcn/ui 컴포넌트
│   ├── common/       # 공통 및 레이아웃 컴포넌트
│   ├── auth/         # 인증 관련 컴포넌트
│   ├── moim/         # 모임 관련 컴포넌트
│   ├── chat/         # 채팅 관련 컴포넌트
├── constants/        # 상수 정의
│   ├── interests.ts  # 관심사 카테고리 정의
├── hooks/            # 커스텀 훅 (useAuthMutations 등)
├── lib/              # 공통 라이브러리 설정 (QueryClient, utils 등)
├── mock/             # MSW 핸들러 및 설정
├── models/           # TypeScript 타입/인터페이스 정의
├── pages/            # 페이지 컴포넌트
│   └── user/         # 사용자 관련 페이지 (Login, Join, ResetPassword 등)
├── routes/           # 라우팅 정보
├── store/            # 상태 관리 (Zustand 스토어)
```

---
---
---
