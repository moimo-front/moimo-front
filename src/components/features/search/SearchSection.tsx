import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useNavigate } from "react-router-dom";

function SearchSection() {
  // const navigate = useNavigate();
  const [searchTopic, setSearchTopic] = useState("");
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTopic.trim()) return;
    // TODO: 검색 로직 구현
    // navigate(`/meetings?로직`);
  };
  return (
    <div className="py-16 text-center">
      <div className="mb-12">
        <p className="text-xl font-bold">
          당신의 관심사로 시작하는 새로운 만남, 어떤 모임을 찾으시나요?
        </p>
      </div>
      <form
        onSubmit={handleSearch}
        className="relative w-full max-w-lg bg-card mx-auto"
      >
        <Input
          type="text"
          placeholder="관심있는 모임 제목을 검색해 보세요"
          className="pl-4 pr-20"
          value={searchTopic}
          onChange={(e) => setSearchTopic(e.target.value)}
        />
        <Button type="submit" className="absolute top-0 right-0 h-full">
          찾기
        </Button>
      </form>
    </div>
  );
}

export default SearchSection;
