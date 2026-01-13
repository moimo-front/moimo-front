import { http, HttpResponse, delay } from 'msw';
import { httpUrl } from './mockData';

export const userUpdate = http.put(`${httpUrl}/users/user-update`, async ({ request }) => {
    try {
        // 토큰 기반 식별 로직 (request 헤더 확인)
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return new HttpResponse(null, { status: 401 });
        }

        const formData = await request.formData();
        const bio = formData.get("bio") as string;
        const interestsString = formData.get("interests") as string;
        const interests = interestsString ? JSON.parse(interestsString) : [];
        const file = formData.get("file");

        console.log("Joined User Extra Info (Token Based):", {
            bio,
            interests,
            file,
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
    } catch (error) {
        console.error("userUpdate handler error:", error);
        return new HttpResponse(null, { status: 500 });
    }
});