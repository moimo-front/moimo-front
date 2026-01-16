import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FixedBottomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

function FixedBottomButton({ 
  children, 
  onClick, 
  className,
  disabled 
}: FixedBottomButtonProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-primary p-4 shadow-lg z-40 mt-auto">
      <div className="max-w-7xl mx-auto">
        <Button
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-none border-none",
            className
          )}
        >
          {children}
        </Button>
      </div>
    </div>
  );
}

export default FixedBottomButton;
