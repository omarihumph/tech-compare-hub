import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  fallbackPath?: string;
  className?: string;
}

export const BackButton = ({ fallbackPath = "/", className }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className={`gap-2 ${className || ""}`}
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
};
