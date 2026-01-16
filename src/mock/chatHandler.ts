// src/mock/chatHandler.ts
import { http, HttpResponse, delay } from "msw";
import { httpUrl } from "./mockData";

// 메시지 목록 조회 Mock
const getMessages = http.get(
  `${httpUrl}/chats/:meetingId/messages`,
  async ({ params }) => {
    const { meetingId } = params;
    await delay(300);

    return HttpResponse.json({
      meetingId: Number(meetingId),
      messages: [
        {
          id: 1,
          senderId: 101, // 상대방 ID
          content: "안녕하세요! 모임 관련해서 궁금한 게 있습니다.",
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          meetingId: Number(meetingId),
          sender: {
            id: 101,
            nickname: "상대방1",
          },
        },
        {
          id: 2,
          senderId: 46, // 내 ID (가정)
          content: "반갑습니다! 어떤 점이 궁금하신가요?",
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          meetingId: Number(meetingId),
          sender: {
            id: 46,
            nickname: "나",
          },
        },
      ],
    });
  }
);

// 채팅방 목록 조회 Mock
const getChatRooms = http.get(`${httpUrl}/chats/rooms`, async () => {
  await delay(300);

  return HttpResponse.json([
    {
      meetingId: 201,
      title: "주말 하이킹 모임",
      image: "https://picsum.photos/id/10/200/200",
      memberCount: 5,
      isLeader: true,
      lastMessage: {
        sender: "상대방1",
        content: "이번 주말 날씨가 좋아서 기대되네요!",
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      },
    },
    {
      meetingId: 202,
      title: "코딩 스터디 그룹",
      image: "https://picsum.photos/id/20/200/200",
      memberCount: 3,
      isLeader: false,
      lastMessage: {
        sender: "나",
        content: "다음 프로젝트 아이디어 있으신 분?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    },
  ]);
});

export const chatHandler = [getMessages, getChatRooms];
