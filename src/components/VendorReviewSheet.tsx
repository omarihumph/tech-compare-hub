import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, ThumbsUp, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string;
  created_at: string;
  user_id: string;
  reviewerName?: string;
}

// Creative mock reviews for vendors with no real reviews yet
const mockReviews: Omit<Review, "user_id">[] = [
  {
    id: "mock-1",
    rating: 5,
    title: "Excellent service and fast delivery",
    content: "Ordered a laptop and it arrived within 2 days. The vendor was very responsive on WhatsApp and even helped me set it up remotely. Highly recommend!",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    reviewerName: "James K.",
  },
  {
    id: "mock-2",
    rating: 4,
    title: "Great prices, solid products",
    content: "I've bought multiple items from this vendor. Prices are consistently lower than other shops in Nairobi. Only giving 4 stars because packaging could be better.",
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    reviewerName: "Faith M.",
  },
  {
    id: "mock-3",
    rating: 5,
    title: "Trusted vendor - bought here twice",
    content: "First time I was skeptical buying online but this vendor proved me wrong. Genuine products with warranty. Will definitely come back for my next purchase.",
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    reviewerName: "Brian O.",
  },
  {
    id: "mock-4",
    rating: 4,
    title: "Good communication",
    content: "The vendor kept me updated throughout the process. Product was exactly as described. Would appreciate more payment options though.",
    created_at: new Date(Date.now() - 21 * 86400000).toISOString(),
    reviewerName: "Wanjiku N.",
  },
];

interface VendorReviewSheetProps {
  vendorId: string;
  vendorName: string;
  rating: number;
  reviewCount: number;
  children: React.ReactNode;
}

export const VendorReviewSheet = ({
  vendorId,
  vendorName,
  rating,
  reviewCount,
  children,
}: VendorReviewSheetProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const isMock = reviewCount === 0;

  useEffect(() => {
    if (open) fetchReviews();
  }, [open]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("vendor_reviews")
        .select("id, rating, title, content, created_at, user_id")
        .eq("vendor_id", vendorId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (data && data.length > 0) {
        // Fetch reviewer names
        const userIds = [...new Set(data.map((r) => r.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds);
        const nameMap: Record<string, string> = {};
        (profiles || []).forEach((p) => {
          nameMap[p.id] = p.full_name || "Anonymous";
        });
        setReviews(
          data.map((r) => ({ ...r, reviewerName: nameMap[r.user_id] || "Anonymous" }))
        );
      } else {
        setReviews([]);
      }
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const displayReviews = reviews.length > 0 ? reviews : (mockReviews as any);
  const displayRating = rating > 0 ? rating : 4.3;
  const displayCount = reviewCount > 0 ? reviewCount : mockReviews.length;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return d.toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="text-xl">{vendorName}</SheetTitle>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-5 w-5 ${
                    s <= Math.round(displayRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-bold">{displayRating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({displayCount} review{displayCount !== 1 ? "s" : ""})
            </span>
          </div>
          {isMock && (
            <Badge variant="outline" className="w-fit mt-2 text-xs">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Sample reviews — be the first to review!
            </Badge>
          )}
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            displayReviews.map((review: any) => (
              <div
                key={review.id}
                className="p-4 rounded-lg border bg-card space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {(review.reviewerName || "A")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{review.reviewerName || "Anonymous"}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${
                          s <= review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.title && (
                  <p className="font-semibold text-sm">{review.title}</p>
                )}
                <div className="flex gap-2">
                  <Quote className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t">
          <Link to={`/vendor/${vendorId}/reviews`}>
            <Button variant="outline" className="w-full">
              {isMock ? "Be the first to leave a review" : "See all reviews & leave yours"}
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
