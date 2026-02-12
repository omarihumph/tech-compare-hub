import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Loader2, ArrowLeft, Quote, TrendingUp, MessageSquare, Users } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string | null;
  };
}

interface VendorProfile {
  id: string;
  company_name: string;
  description: string | null;
  logo_url: string | null;
}

const StarRating = ({
  value,
  onChange,
  hover,
  onHover,
  interactive = true,
  size = "md",
}: {
  value: number;
  onChange?: (val: number) => void;
  hover?: number;
  onHover?: (val: number) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClass = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6";
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onHover?.(star)}
          onMouseLeave={() => onHover?.(0)}
          className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
        >
          <Star
            className={`${sizeClass} ${
              star <= (hover || value)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const VendorReviews = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (vendorId) fetchVendorAndReviews();
  }, [vendorId, user]);

  const fetchVendorAndReviews = async () => {
    try {
      setLoading(true);
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendor_profiles")
        .select("id, company_name, description, logo_url")
        .eq("id", vendorId)
        .single();
      if (vendorError) throw vendorError;
      setVendor(vendorData);

      const { data: reviewsData, error: reviewsError } = await supabase
        .from("vendor_reviews")
        .select("*")
        .eq("vendor_id", vendorId)
        .order("created_at", { ascending: false });
      if (reviewsError) throw reviewsError;

      const userIds = [...new Set(reviewsData?.map((r) => r.user_id) || [])];
      const profilesMap: Record<string, { full_name: string | null }> = {};
      for (const userId of userIds) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", userId)
          .single();
        if (profile) profilesMap[userId] = profile;
      }

      const reviewsWithProfiles = (reviewsData || []).map((review) => ({
        ...review,
        profiles: profilesMap[review.user_id] || { full_name: null },
      }));
      setReviews(reviewsWithProfiles);

      if (user) {
        const existingReview = reviewsWithProfiles.find((r) => r.user_id === user.id);
        if (existingReview) {
          setUserReview(existingReview);
          setRating(existingReview.rating);
          setTitle(existingReview.title || "");
          setContent(existingReview.content);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to leave a review");
      navigate("/auth");
      return;
    }
    if (!content.trim()) {
      toast.error("Please write a review");
      return;
    }
    setSubmitting(true);
    try {
      if (userReview) {
        const { error } = await supabase
          .from("vendor_reviews")
          .update({ rating, title: title.trim() || null, content: content.trim() })
          .eq("id", userReview.id);
        if (error) throw error;
        toast.success("Review updated!");
      } else {
        const { error } = await supabase
          .from("vendor_reviews")
          .insert({ vendor_id: vendorId, user_id: user.id, rating, title: title.trim() || null, content: content.trim() });
        if (error) throw error;
        toast.success("Review submitted!");
      }
      fetchVendorAndReviews();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("vendor_reviews").delete().eq("id", userReview.id);
      if (error) throw error;
      toast.success("Review deleted");
      setUserReview(null);
      setRating(5);
      setTitle("");
      setContent("");
      fetchVendorAndReviews();
    } catch (error: any) {
      console.error("Error deleting review:", error);
      toast.error(error.message || "Failed to delete review");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Vendor not found</h1>
          <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
        <div className="container mx-auto max-w-7xl px-6 py-12 relative">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-20 w-20 border-2 border-primary/30">
              <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                {vendor.company_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{vendor.company_name}</h1>
              {vendor.description && (
                <p className="text-muted-foreground mt-2 max-w-2xl">{vendor.description}</p>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-lg">
            <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">{averageRating > 0 ? averageRating.toFixed(1) : "—"}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Rating</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">{reviews.length}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Reviews</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">{new Set(reviews.map((r) => r.user_id)).size}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Reviewers</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left Column: Rating Summary + Review Form */}
          <div className="space-y-6">
            {/* Rating Distribution */}
            {reviews.length > 0 && (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Rating Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
                    <div>
                      <StarRating value={Math.round(averageRating)} interactive={false} size="sm" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  {ratingDistribution.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-sm w-8 text-right text-muted-foreground">{star}★</span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Review Form */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  {userReview ? "Update Your Review" : "Write a Review"}
                </CardTitle>
                <CardDescription>Share your experience with this vendor</CardDescription>
              </CardHeader>
              <CardContent>
                {user ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <StarRating
                        value={rating}
                        onChange={setRating}
                        hover={hoverRating}
                        onHover={setHoverRating}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title (optional)</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Summarize your experience"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Your Review</Label>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Tell others about your experience..."
                        rows={4}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={submitting} className="flex-1">
                        {submitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : userReview ? (
                          "Update Review"
                        ) : (
                          "Submit Review"
                        )}
                      </Button>
                      {userReview && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={handleDeleteReview}
                          disabled={submitting}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">Sign in to leave a review</p>
                    <Button onClick={() => navigate("/auth")}>Sign In</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold">All Reviews ({reviews.length})</h2>

            {reviews.length === 0 ? (
              <Card className="border-border/50 bg-card/50">
                <CardContent className="py-16 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">No reviews yet. Be the first to review this vendor!</p>
                </CardContent>
              </Card>
            ) : (
              reviews.map((review) => (
                <Card
                  key={review.id}
                  className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 group overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {(review.profiles?.full_name || "U").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-sm">
                              {review.profiles?.full_name || "Anonymous User"}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <StarRating value={review.rating} interactive={false} size="sm" />
                              <span className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                          {review.user_id === user?.id && (
                            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium shrink-0">
                              Your review
                            </span>
                          )}
                        </div>
                        {review.title && (
                          <h4 className="font-semibold mt-3 text-sm">{review.title}</h4>
                        )}
                        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorReviews;
