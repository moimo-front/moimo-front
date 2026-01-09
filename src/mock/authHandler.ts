import { INTEREST_CATEGORIES } from '@/constants/interests';
import { http, HttpResponse, delay } from 'msw';

const httpUrl = import.meta.env.VITE_API_URL || 'https://moimo-back.vercel.app';

// 일반 로그인 핸들러
export const login = http.post(`${httpUrl}/users/login`, async ({ request }) => {
    const { email, password } = (await request.json()) as any;
    await delay(1000);

    if (email === "moimo@email.com" && password === "12345678") {
        return HttpResponse.json({
            user: {
                email,
                nickname: "테스터",
            },
        }, {
            headers: {
                'Authorization': 'Bearer mock-jwt-token',
                'Set-Cookie': 'refreshToken=mock-refresh-token; HttpOnly; Secure; SameSite=Strict'
            }
        });
    }

    return new HttpResponse(
        JSON.stringify({ message: "이메일 또는 비밀번호가 일치하지 않습니다." }),
        { status: 401 }
    );
});

// 구글 로그인
export const googleLogin = http.post(`${httpUrl}/users/login/google`, async ({ request }) => {
    try {
        const { code, redirectUri } = (await request.json()) as any;
        console.log('google login request:', { code, redirectUri });
        await delay(1000);
        return HttpResponse.json({
            user: {
                email: "google-user@email.com",
                nickname: "구글사용자",
            },
            isNewUser: true,
        }, {
            status: 200,
            headers: {
                'Authorization': `Bearer mock-jwt-token`,
                'Set-Cookie': 'refreshToken=mock-refresh-token; HttpOnly; Secure; SameSite=Strict'
            }
        });
    } catch (error) {
        console.error('MSW googleLogin error:', error);
        return new HttpResponse(
            JSON.stringify({ error: { code: "500", message: error instanceof Error ? error.message : "Unknown error" } }),
            { status: 500 }
        );
    }
});

// 로그아웃 핸들러
export const logout = http.post(`${httpUrl}/users/logout`, async () => {
    await delay(1000);
    return HttpResponse.json({ message: "로그아웃이 완료되었습니다." });
});

// 회원가입 핸들러
export const join = http.post(`${httpUrl}/users/register`, async () => {
    await delay(1000);
    return HttpResponse.json({ message: "회원가입이 완료되었습니다." });
});

// 이메일 중복 확인
export const checkEmail = http.post(`${httpUrl}/users/check-email`, async ({ request }) => {
    const { email } = (await request.json()) as any;
    await delay(500);

    if (email === "taken@email.com") {
        return new HttpResponse(
            JSON.stringify({ message: "이미 사용 중인 이메일입니다." }),
            { status: 409 }
        );
    }

    return HttpResponse.json({ message: "사용 가능한 이메일입니다." },
        { status: 200 }
    );
});

// 닉네임 중복 확인
export const checkNickname = http.post(`${httpUrl}/users/check-nickname`, async ({ request }) => {
    const { nickname } = (await request.json()) as any;
    await delay(500);

    if (nickname === "nickname123") {
        return new HttpResponse(
            JSON.stringify({ message: "이미 사용 중인 닉네임입니다." }),
            { status: 409 }
        );
    }
    return HttpResponse.json({ message: "사용 가능한 닉네임입니다." },
        { status: 200 }
    );
});

// 추가정보 핸들러
export const extraInfo = http.patch(`${httpUrl}/users/extraInfo`, async ({ request }) => {
    // const { bio, interests } = (await request.json()) as any;
    await delay(1000);
    return HttpResponse.json({ message: "추가정보가 완료되었습니다." },
        { status: 200 }
    );
});

// 관심사 조회 핸들러
export const getInterests = http.get(`${httpUrl}/interests`, async () => {
    await delay(1000);
    return HttpResponse.json({ interests: INTEREST_CATEGORIES },
        { status: 200 }
    );
});

// 비밀번호 찾기
export const findPassword = http.post(`${httpUrl}/users/find-password`, async ({ request }) => {
    const { email } = (await request.json()) as any;
    await delay(1000);

    if (email === "moimo@email.com") {
        return HttpResponse.json({ message: "비밀번호 재설정 이메일이 발송되었습니다." });
    }
    return HttpResponse.json({ message: "이메일이 일치하지 않습니다." },
        { status: 404 }
    );
});

// 비밀번호 재설정
export const resetPassword = http.post(`${httpUrl}/users/reset-password`, async ({ request }) => {
    // const { email, code, newPassword } = (await request.json()) as any;
    await delay(1000);
    return HttpResponse.json({ message: "비밀번호가 성공적으로 변경되었습니다." });
});

// 토큰 갱신 핸들러
export const refresh = http.post(`${httpUrl}/users/refresh`, async ({ request }) => {
    const cookies = request.headers.get('cookie');
    await delay(500);

    if (cookies?.includes('refreshToken=mock-refresh-token')) {
        return new HttpResponse(null, {
            status: 200,
            headers: {
                'Authorization': 'Bearer new-mock-jwt-token',
            }
        });
    }

    return new HttpResponse(
        JSON.stringify({ message: "유효하지 않은 리프레시 토큰입니다." }),
        { status: 401 }
    );
});

// 사용자 인증 핸들러
export const verify = http.get(`${httpUrl}/users/verify`, async () => {
    await delay(1000);
    return HttpResponse.json({
        authenticated: true,
        message: '인증이 완료되었습니다.',
        user: {
            email: "moimo@email.com",
            nickname: "테스터",
        }
    });
});