import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { interestImageMap } from "@/lib/interestImageMap";

interface TopicCardProps {
  topicName: string;
  to: string;
  imageUrl?: string;
  size?: "sm" | "md";
}

function TopicCard({
  topicName,
  to,
  imageUrl = interestImageMap[topicName],
  size = "md",
}: TopicCardProps) {
  const sizeStyles = {
    sm: {
      padding: "p-1",
      imageDimensions: "w-16 h-16",
      textSize: "text-sm",
      initialSize: "text-lg",
    },
    md: {
      padding: "p-8",
      imageDimensions: "w-24 h-24",
      textSize: "text-base",
      initialSize: "text-xl",
    },
  };

  const { padding, imageDimensions, textSize, initialSize } = sizeStyles[size];

  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-accent/50",
        padding
      )}
    >
      <div
        className={cn(
          "rounded-full bg-secondary flex items-center justify-center overflow-hidden mb-3 border border-black",
          imageDimensions
        )}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={topicName}
            className="w-full h-full object-cover scale-120"
          />
        ) : (
          <span
            className={cn("font-bold text-primary-foreground", initialSize)}
          >
            {topicName.charAt(0)}
          </span>
        )}
      </div>
      <p className={cn("font-medium text-center", textSize)}>{topicName}</p>
    </Link>
  );
}

export default TopicCard;
