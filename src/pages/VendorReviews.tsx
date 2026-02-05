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
import { Star, Loader2, ArrowLeft } from "lucide-react";
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

const VendorReviews = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  
  // Form state
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
    if (vendorId) {
      fetchVendorAndReviews();
    }
  }, [vendorId, user]);

  const fetchVendorAndReviews = async () => {
    try {
      setLoading(true);
      
      // Fetch vendor
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendor_profiles")
        .select("id, company_name, description, logo_url")
        .eq("id", vendorId)
        .single();

      if (vendorError) throw vendorError;
      setVendor(vendorData);

      // Fetch reviews - we'll get profile info separately due to RLS
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("vendor_reviews")
        .select("*")
        .eq("vendor_id", vendorId)
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;

      // Get unique user IDs and fetch their profiles
      const userIds = [...new Set(reviewsData?.map(r => r.user_id) || [])];
      const profilesMap: Record<string, { full_name: string | null }> = {};
      
      // Fetch profiles for each reviewer (this works because reviews are public)
      for (const userId of userIds) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", userId)
          .single();
        if (profile) {
          profilesMap[userId] = profile;
        }
      }

      const reviewsWithProfiles = (reviewsData || []).map(review => ({
        ...review,
        profiles: profilesMap[review.user_id] || { full_name: null }
      }));

      setReviews(reviewsWithProfiles);

      // Check if current user has already reviewed
      if (user) {
        const existingReview = reviewsWithProfiles.find(r => r.user_id === user.id);
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
        // Update existing review
        const { error } = await supabase
          .from("vendor_reviews")
          .update({
            rating,
            title: title.trim() || null,
            content: content.trim(),
          })
          .eq("id", userReview.id);

        if (error) throw error;
        toast.success("Review updated!");
      } else {
        // Create new review
        const { error } = await supabase
          .from("vendor_reviews")
          .insert({
            vendor_id: vendorId,
            user_id: user.id,
            rating,
            title: title.trim() || null,
            content: content.trim(),
          });

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
      const { error } = await supabase
        .from("vendor_reviews")
        .delete()
        .eq("id", userReview.id);

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

  const StarRating = ({ value, onChange, hover, onHover, interactive = true }: { 
    value: number; 
    onChange?: (val: number) => void; 
    hover?: number;
    onHover?: (val: number) => void;
    interactive?: boolean;
  }) => (
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
            className={`h-6 w-6 ${
              star <= (hover || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <NavBar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <NavBar />
        <div className="container mx-auto px-4 py-10 text-center">
          <h1 className="text-2xl font-bold">Vendor not found</h1>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Vendor Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {vendor.company_name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{vendor.company_name}</CardTitle>
                <CardDescription>{vendor.description}</CardDescription>
                {averageRating && (
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating value={Math.round(Number(averageRating))} interactive={false} />
                    <span className="text-sm text-muted-foreground">
                      {averageRating} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Review Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{userReview ? "Update Your Review" : "Write a Review"}</CardTitle>
                <CardDescription>
                  Share your experience with this vendor
                </CardDescription>
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
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">
                      Sign in to leave a review
                    </p>
                    <Button onClick={() => navigate("/auth")}>
                      Sign In
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">
              All Reviews ({reviews.length})
            </h2>
            
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  No reviews yet. Be the first to review this vendor!
                </CardContent>
              </Card>
            ) : (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-muted">
                          {(review.profiles?.full_name || "U").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {review.profiles?.full_name || "Anonymous User"}
                            </p>
                            <div className="flex items-center gap-2">
                              <StarRating value={review.rating} interactive={false} />
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {review.user_id === user?.id && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              Your review
                            </span>
                          )}
                        </div>
                        {review.title && (
                          <h4 className="font-medium mt-2">{review.title}</h4>
                        )}
                        <p className="text-muted-foreground mt-1">{review.content}</p>
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