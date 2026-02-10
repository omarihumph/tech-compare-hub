import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Globe, 
  MessageCircle, 
  Package, 
  Building2,
  Loader2,
  ExternalLink,
  Store,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { PriceAlertButton } from "@/components/PriceAlertButton";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

interface CatalogProduct {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  category: string;
  description: string | null;
  image_url: string | null;
  specs: unknown;
}

interface VendorListing {
  id: string;
  price: number;
  vendor_profiles: {
    id: string;
    company_name: string;
    description: string | null;
    whatsapp: string | null;
    address: string | null;
    website: string | null;
    logo_url: string | null;
  };
}

interface VendorRatingMap {
  [vendorId: string]: { avg: number; count: number };
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [listings, setListings] = useState<VendorListing[]>([]);
  const [vendorRatings, setVendorRatings] = useState<VendorRatingMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProductAndListings();
    }
  }, [id]);

  const fetchProductAndListings = async () => {
    try {
      // Fetch product from catalog
      const { data: catalogData, error: catalogError } = await supabase
        .from("product_catalog")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (catalogError) throw catalogError;

      if (!catalogData) {
        toast({
          title: "Product not found",
          description: "This product may have been removed or is not available.",
          variant: "destructive",
        });
        navigate("/browse");
        return;
      }

      setProduct(catalogData);

      // Fetch all vendor listings for this product
      const { data: listingsData, error: listingsError } = await supabase
        .from("products")
        .select(`
          id,
          price,
          vendor_profiles (
            id,
            company_name,
            description,
            whatsapp,
            address,
            website,
            logo_url
          )
        `)
        .eq("catalog_id", id)
        .eq("status", "approved")
        .order("price", { ascending: true });

      if (listingsError) throw listingsError;
      setListings(listingsData || []);

      // Fetch vendor ratings
      const vendorIds = (listingsData || []).map(l => l.vendor_profiles.id).filter(Boolean);
      if (vendorIds.length > 0) {
        const { data: reviews } = await supabase
          .from("vendor_reviews")
          .select("vendor_id, rating")
          .in("vendor_id", vendorIds);
        
        const ratingsMap: VendorRatingMap = {};
        (reviews || []).forEach(r => {
          if (!ratingsMap[r.vendor_id]) {
            ratingsMap[r.vendor_id] = { avg: 0, count: 0 };
          }
          ratingsMap[r.vendor_id].count++;
          ratingsMap[r.vendor_id].avg += r.rating;
        });
        Object.keys(ratingsMap).forEach(id => {
          ratingsMap[id].avg = ratingsMap[id].avg / ratingsMap[id].count;
        });
        setVendorRatings(ratingsMap);
      }

    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = (vendor: VendorListing['vendor_profiles']) => {
    if (vendor?.whatsapp) {
      const phoneNumber = vendor.whatsapp.replace(/[^0-9]/g, "");
      const message = encodeURIComponent(
        `Hi! I'm interested in the ${product?.name} listed on TechPrice. Is it still available?`
      );
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const specs = product.specs && typeof product.specs === 'object' && !Array.isArray(product.specs) 
    ? (product.specs as Record<string, string>) 
    : null;

  const lowestPrice = listings.length > 0 ? listings[0].price : 0;
  const highestPrice = listings.length > 0 ? listings[listings.length - 1].price : 0;
  const savings = highestPrice - lowestPrice;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-24 w-24 text-muted-foreground/50" />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.brand && (
                <p className="text-lg text-muted-foreground">
                  {product.brand} {product.model && `• ${product.model}`}
                </p>
              )}
            </div>

            {/* Price Summary */}
            {listings.length > 0 && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-primary" />
                      <span className="font-medium">{listings.length} vendor{listings.length > 1 ? 's' : ''} selling</span>
                    </div>
                    {savings > 0 && (
                      <Badge variant="default" className="bg-green-600">
                        Save up to {formatPrice(savings)}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-primary">{formatPrice(lowestPrice)}</span>
                    {highestPrice !== lowestPrice && (
                      <span className="text-muted-foreground">to {formatPrice(highestPrice)}</span>
                    )}
                  </div>
                  <PriceAlertButton
                    catalogId={product.id}
                    productName={product.name}
                    currentLowestPrice={lowestPrice}
                  />
                </CardContent>
              </Card>
            )}

            {product.description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Specifications */}
            {specs && Object.keys(specs).length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(specs).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/_/g, " ")}:
                        </span>{" "}
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Vendor Listings */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Store className="h-6 w-6" />
            Compare Prices from {listings.length} Vendor{listings.length > 1 ? 's' : ''}
          </h2>

          <div className="space-y-4">
            {listings.map((listing, index) => (
              <Card 
                key={listing.id} 
                className={`${index === 0 ? 'border-green-500 bg-green-500/5' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{listing.vendor_profiles.company_name}</h3>
                          {index === 0 && (
                            <Badge variant="default" className="bg-green-600 text-xs">
                              <TrendingDown className="h-3 w-3 mr-1" />
                              Lowest Price
                            </Badge>
                          )}
                        </div>
                        {/* Vendor Rating */}
                        {vendorRatings[listing.vendor_profiles.id] && (
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`h-3.5 w-3.5 ${s <= Math.round(vendorRatings[listing.vendor_profiles.id].avg) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">{vendorRatings[listing.vendor_profiles.id].avg.toFixed(1)}</span>
                            <Link
                              to={`/vendor/${listing.vendor_profiles.id}/reviews`}
                              className="text-xs text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              ({vendorRatings[listing.vendor_profiles.id].count} review{vendorRatings[listing.vendor_profiles.id].count > 1 ? 's' : ''})
                            </Link>
                          </div>
                        )}
                        {!vendorRatings[listing.vendor_profiles.id] && (
                          <Link
                            to={`/vendor/${listing.vendor_profiles.id}/reviews`}
                            className="text-xs text-muted-foreground hover:text-primary mt-1 inline-block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            No reviews yet — Be the first
                          </Link>
                        )}
                        {listing.vendor_profiles.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {listing.vendor_profiles.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                          {listing.vendor_profiles.address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{listing.vendor_profiles.address}</span>
                            </div>
                          )}
                          {listing.vendor_profiles.website && (
                            <a
                              href={listing.vendor_profiles.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              <Globe className="h-3 w-3" />
                              <span>Website</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{formatPrice(listing.price)}</p>
                        {index > 0 && (
                          <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {formatPrice(listing.price - lowestPrice)} more
                          </p>
                        )}
                      </div>
                      {listing.vendor_profiles.whatsapp && (
                        <Button
                          onClick={() => handleWhatsAppClick(listing.vendor_profiles)}
                          className="gap-2 bg-green-600 hover:bg-green-700 whitespace-nowrap"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Contact Vendor
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;