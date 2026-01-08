interface TopicCardProps {
  topicName: string;
  imageUrl?: string;
  onClick?: () => void;
}

function TopicCard({ topicName, imageUrl, onClick }: TopicCardProps) {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 rounded-lg transition-colors"
      onClick={onClick}
    >
      <div
        className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden cursor-pointer mb-2 border border-black"
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
          <span className="text-xl font-bold text-primary-foreground">
            {topicName.charAt(0)}
          </span>
        )}
      </div>
      <p className="text-base font-medium text-center">{topicName}</p>
    </div>
  );
}

export default TopicCard;
