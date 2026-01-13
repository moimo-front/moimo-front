import { TOPIC_CATEGORIES } from "@/constants/topics";
import TopicCard from "@features/topics/TopicCard";

function TopicSection() {
  return (
    <div className="py-4">
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
  );
}

export default TopicSection;
