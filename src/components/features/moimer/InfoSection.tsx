interface InfoSectionProps {
  title: string;
  description: string;
  illustration?: React.ReactNode;
}

function InfoSection({ title, description, illustration }: InfoSectionProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-foreground mb-8">{title}</h2>
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
        {illustration && (
          <div className="flex-1 flex justify-center items-center">
            {illustration}
          </div>
        )}
      </div>
    </section>
  );
}

export default InfoSection;
