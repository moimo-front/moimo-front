import { Link } from "react-router-dom";
import { interestImageMap } from "@/lib/interestImageMap";

interface TopicCardProps {
  topicName: string;
  to: string;
  imageUrl?: string;
}

function TopicCard({
  topicName,
  to,
  imageUrl = interestImageMap[topicName],
}: TopicCardProps) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-accent/50 px-4 w-full"
    >
      <div className="w-full aspect-square rounded-full bg-secondary flex items-center justify-center overflow-hidden mb-3 border border-yellow-500">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={topicName}
            className="w-full h-full object-cover scale-120"
          />
        ) : (
          <span className="font-semibold text-primary-foreground text-2xl">
            {topicName.charAt(0)}
          </span>
        )}
      </div>
      <p className="font-medium text-center text-lg mt-1 whitespace-nowrap">{topicName}</p>
    </Link>
  );
}

export default TopicCard;
