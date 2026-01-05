import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import TopicCard from "../components/common/TopicCard";
import MeetingCard from "../components/common/MeetingCard";
// import { Search } from "lucide-react";

// 나중에 URL만 추가
const TOPIC_CATEGORIES = [
  { id: 1, name: "인간관계", imageUrl: "" },
  { id: 2, name: "술", imageUrl: "" },
  { id: 3, name: "게임", imageUrl: "" },
  { id: 4, name: "책/독서", imageUrl: "" },
  { id: 5, name: "스포츠", imageUrl: "" },
  { id: 6, name: "방탈출", imageUrl: "" },
  { id: 7, name: "음악", imageUrl: "" },
  { id: 8, name: "공부", imageUrl: "" },
  { id: 9, name: "여행", imageUrl: "" },
  { id: 10, name: "코딩", imageUrl: "" },
];

// 나중에 mock 사용
const MEETING_CATEGORIES = [
  {
    id: 1,
    name: "크리스마스 솔로 모임",
    location: "서울",
    participantsCount: 10,
    imageUrl: "",
  },
  {
    id: 2,
    name: "술 마실 사람~",
    location: "서울",
    participantsCount: 5,
    imageUrl: "",
  },
  {
    id: 3,
    name: "게임 하자",
    location: "서울",
    participantsCount: 100000,
    imageUrl: "",
  },
  {
    id: 4,
    name: "책 먹는 여우",
    location: "서울",
    participantsCount: 0,
    imageUrl: "",
  },
  {
    id: 5,
    name: "안녕하십니까저는축구를좋아하는축구왕슛돌이라고합니다 길이테스트 입니다",
    location: "서울",
    participantsCount: 2,
    imageUrl: "",
  },
];

function Home() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="h-[300px]">
        <div className="text-center mt-12 mb-12">
          <p className="text-xl font-bold">
            당신의 관심사로 시작하는 새로운 만남, 어떤 모임을 찾으시나요?
          </p>
        </div>
        <div className="relative w-full max-w-lg bg-card">
          <Input
            type="text"
            placeholder="관심있는 모임 주제를 검색해 보세요"
            className="pl-4 pr-20"
          />
          <Button type="submit" className="absolute top-0 right-0 h-full">
            {/* <Search className="h-4 w-4 mr-2" /> */}
            찾기
          </Button>
        </div>
      </div>
      <div className="flex flex-col pt-8 items-center w-full bg-card h-[1100px]">
        <div className="h-[400px]">
          <div className="grid grid-cols-5 gap-3">
            {TOPIC_CATEGORIES.map((topic) => (
              <TopicCard
                key={topic.id}
                topicName={topic.name}
                imageUrl={topic.imageUrl}
              />
            ))}
          </div>
        </div>
        <div className="w-full max-w-6xl mx-auto py-8">
          <div className="flex justify-between w-full mb-4">
            <div className="text-xl font-bold">주간 인기 모임 List</div>
            <div className="text-sm cursor-pointer">전체보기</div>
          </div>
          <div className="grid grid-cols-4 gap-4 justify-items-center">
            {MEETING_CATEGORIES.map((topic) => (
              <MeetingCard
                key={topic.id}
                title={topic.name}
                location={topic.location}
                participantsCount={topic.participantsCount}
                imageUrl={topic.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
