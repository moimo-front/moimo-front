import TopicCard from "@features/topics/TopicCard";
import { useInterestQuery } from "@/hooks/useInterestQuery";

const Interests = () => {
  const { data: interests, isLoading, error } = useInterestQuery();

  if (isLoading) return <div>Loading interests...</div>;
  if (error) return <div>Error loading interests: {error.message}</div>;

  return (
    <div className="py-4">
      <div className="grid grid-cols-4">
        {interests?.map((interest) => (
          <TopicCard
            key={interest.id}
            topicName={interest.name}
            imageUrl={""} // TODO: 추후에 이미지 링크 추가
            size="sm"
          />
        ))}
      </div>
    </div>
  );
};

export default Interests;
