import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Users, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

interface TopVendor {
  id: string;
  company_name: string;
  logo_url: string | null;
  description: string | null;
  avg_rating: number;
  review_count: number;
}

export const TopVendors = () => {
  const [vendors, setVendors] = useState<TopVendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopVendors();
  }, []);

  const fetchTopVendors = async () => {
    try {
      // Fetch all reviews
      const { data: reviews, error } = await supabase
        .from("vendor_reviews")
        .select("vendor_id, rating");

      if (error) throw error;
      if (!reviews || reviews.length === 0) {
        setVendors([]);
        return;
      }

      // Aggregate by vendor
      const vendorStats: Record<string, { total: number; count: number }> = {};
      reviews.forEach((r) => {
        if (!vendorStats[r.vendor_id]) {
          vendorStats[r.vendor_id] = { total: 0, count: 0 };
        }
        vendorStats[r.vendor_id].total += r.rating;
        vendorStats[r.vendor_id].count += 1;
      });

      // Sort by review count, then by average rating
      const sorted = Object.entries(vendorStats)
        .map(([id, stats]) => ({
          id,
          avg: stats.total / stats.count,
          count: stats.count,
        }))
        .sort((a, b) => b.count - a.count || b.avg - a.avg)
        .slice(0, 6);

      // Fetch vendor profiles
      const vendorIds = sorted.map((v) => v.id);
      const { data: profiles } = await supabase
        .from("vendor_profiles")
        .select("id, company_name, logo_url, description")
        .in("id", vendorIds);

      const profileMap: Record<string, any> = {};
      profiles?.forEach((p) => (profileMap[p.id] = p));

      setVendors(
        sorted
          .filter((v) => profileMap[v.id])
          .map((v) => ({
            id: v.id,
            company_name: profileMap[v.id].company_name,
            logo_url: profileMap[v.id].logo_url,
            description: profileMap[v.id].description,
            avg_rating: Math.round(v.avg * 10) / 10,
            review_count: v.count,
          }))
      );
    } catch (error) {
      console.error("Error fetching top vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || vendors.length === 0) return null;

  return (
    <section className="relative py-24 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <p className="text-xs uppercase tracking-[0.5em] text-primary font-medium">
            Top Rated
          </p>
          <h2 className="text-4xl md:text-5xl font-light tracking-wide">
            Most Reviewed <span className="font-semibold">Vendors</span>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Trusted Sellers
            </span>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor, index) => (
            <Link key={vendor.id} to={`/vendor/${vendor.id}/reviews`}>
              <Card className="relative p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all duration-500 group overflow-hidden cursor-pointer">
                {index < 3 && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">
                      #{index + 1}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    {vendor.logo_url ? (
                      <img src={vendor.logo_url} alt={vendor.company_name} className="h-full w-full object-cover" />
                    ) : (
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                        {vendor.company_name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{vendor.company_name}</p>
                    {vendor.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {vendor.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold">{vendor.avg_rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span className="text-sm">
                      {vendor.review_count} review{vendor.review_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
