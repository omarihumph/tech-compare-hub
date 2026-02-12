import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { Link } from "react-router-dom";

interface ReviewWithVendor {
  id: string;
  rating: number;
  title: string | null;
  content: string;
  created_at: string;
  user_id: string;
  vendor_id: string;
  reviewer_name: string | null;
  vendor_name: string;
}

export const HomeReviews = () => {
  const [reviews, setReviews] = useState<ReviewWithVendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentReviews();
  }, []);

  const fetchRecentReviews = async () => {
    try {
      const { data: reviewsData, error } = await supabase
        .from("vendor_reviews")
        .select("id, rating, title, content, created_at, user_id, vendor_id")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      if (!reviewsData || reviewsData.length === 0) {
        setReviews([]);
        return;
      }

      // Fetch vendor names
      const vendorIds = [...new Set(reviewsData.map((r) => r.vendor_id))];
      const { data: vendors } = await supabase
        .from("vendor_profiles")
        .select("id, company_name")
        .in("id", vendorIds);

      const vendorMap: Record<string, string> = {};
      vendors?.forEach((v) => (vendorMap[v.id] = v.company_name));

      // Fetch reviewer names
      const userIds = [...new Set(reviewsData.map((r) => r.user_id))];
      const profilesMap: Record<string, string | null> = {};
      for (const uid of userIds) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", uid)
          .single();
        if (profile) profilesMap[uid] = profile.full_name;
      }

      setReviews(
        reviewsData.map((r) => ({
          ...r,
          reviewer_name: profilesMap[r.user_id] || null,
          vendor_name: vendorMap[r.vendor_id] || "Unknown Vendor",
        }))
      );
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || reviews.length === 0) return null;

  return (
    <section className="relative py-24 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <p className="text-xs uppercase tracking-[0.5em] text-primary font-medium">
            Trusted by Shoppers
          </p>
          <h2 className="text-4xl md:text-5xl font-light tracking-wide">
            Customer <span className="font-semibold">Reviews</span>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Real Feedback
            </span>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="relative p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all duration-500 group overflow-hidden"
            >
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="h-10 w-10 text-primary" />
              </div>

              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                    {(review.reviewer_name || "U").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">
                    {review.reviewer_name || "Anonymous"}
                  </p>
                  <Link
                    to={`/vendor/${review.vendor_id}/reviews`}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    on {review.vendor_name}
                  </Link>
                </div>
              </div>

              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s <= review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>

              {review.title && (
                <p className="font-semibold text-sm mb-1">{review.title}</p>
              )}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {review.content}
              </p>

              <p className="text-xs text-muted-foreground/60 mt-4">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
