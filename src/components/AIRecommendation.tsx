import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Trophy, Lightbulb, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  brand: string | null;
  category: string;
  description: string | null;
  specs: any;
}

interface Recommendation {
  recommendedIndex: number;
  productName: string;
  reasoning: string;
  highlights: string[];
  considerations: string;
}

interface AIRecommendationProps {
  products: Product[];
  onHighlight?: (productId: string) => void;
}

export const AIRecommendation = ({ products, onHighlight }: AIRecommendationProps) => {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);

  const getRecommendation = async () => {
    if (products.length < 2) {
      toast.error("Need at least 2 products to compare");
      return;
    }

    setLoading(true);
    setHasAsked(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-recommend', {
        body: { products }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setRecommendation(data.recommendation);
      
      // Highlight the recommended product
      if (data.recommendation && products[data.recommendation.recommendedIndex]) {
        onHighlight?.(products[data.recommendation.recommendedIndex].id);
      }

      toast.success("AI recommendation ready!");
    } catch (error: any) {
      console.error("Error getting recommendation:", error);
      toast.error(error.message || "Failed to get AI recommendation");
    } finally {
      setLoading(false);
    }
  };

  if (!hasAsked) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Need Help Deciding?</h3>
            <p className="text-muted-foreground mb-4">
              Let AI analyze these products and recommend the best pick for you!
            </p>
          </div>
          <Button 
            onClick={getRecommendation} 
            disabled={loading || products.length < 2}
            className="gap-2"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Get AI Recommendation
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full animate-pulse">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Analyzing Products...</h3>
            <p className="text-muted-foreground">
              AI is comparing features, specs, and value to find the best option.
            </p>
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (!recommendation) {
    return (
      <Card className="p-6 bg-destructive/5 border-destructive/20">
        <div className="flex flex-col items-center text-center gap-4">
          <p className="text-muted-foreground">Failed to get recommendation</p>
          <Button onClick={getRecommendation} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <Badge variant="secondary" className="mb-1">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Recommendation
            </Badge>
            <h3 className="text-xl font-bold text-primary">
              {recommendation.productName}
            </h3>
          </div>
        </div>

        {/* Reasoning */}
        <div className="mb-4 p-4 bg-background/50 rounded-lg border border-border/50">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              {recommendation.reasoning}
            </p>
          </div>
        </div>

        {/* Highlights */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Key Advantages:</p>
          <div className="flex flex-wrap gap-2">
            {recommendation.highlights.map((highlight, index) => (
              <div 
                key={index}
                className="flex items-center gap-1.5 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {highlight}
              </div>
            ))}
          </div>
        </div>

        {/* Considerations */}
        {recommendation.considerations && (
          <p className="text-xs text-muted-foreground italic">
            💡 {recommendation.considerations}
          </p>
        )}

        {/* Reset button */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setRecommendation(null);
              setHasAsked(false);
            }}
            className="text-muted-foreground"
          >
            Ask Again
          </Button>
        </div>
      </div>
    </Card>
  );
};
