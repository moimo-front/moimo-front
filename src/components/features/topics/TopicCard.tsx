import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TopicCardProps {
  topicName: string;
  to: string;
  imageUrl?: string;
  size?: "sm" | "md";
}

function TopicCard({
  topicName,
  to,
  imageUrl,
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
        style={
          imageUrl
            ? {
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        {!imageUrl && (
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
