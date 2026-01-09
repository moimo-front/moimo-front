import { http, HttpResponse, delay } from 'msw';
import { httpUrl } from './mockData';

export const extraInfo = http.put(`${httpUrl}/users/extraInfo`, async ({ request }) => {
    // 추가 정보 핸들러
    // const { bio, interests, id, email, nickname } = (await request.json()) as any;
    // console.log("Joined User Extra Info:", { id, email, nickname, bio, interests });

    // 토큰 기반 식별 로직 (request 헤더 확인)
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        return new HttpResponse(null, { status: 401 });
    }

    const { bio, interests } = (await request.json()) as any;
    console.log("Joined User Extra Info (Token Based):", {
        bio,
        interests,
        token: authHeader
    });
    // 임시 더미 데이터 (토큰에서 추출했다고 가정)
    const id = 3;
    const email = "user@example.com";
    const nickname = "userNickname";

    await delay(1000);
    return HttpResponse.json(
        {
            id,
            email,
            nickname,
            bio,
            interests
        }
    );
});