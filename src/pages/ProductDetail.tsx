import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  ExternalLink
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  category: string;
  price: number;
  description: string | null;
  image_url: string | null;
  specs: unknown;
  vendor_id: string;
}

interface Vendor {
  id: string;
  company_name: string;
  description: string | null;
  whatsapp: string | null;
  address: string | null;
  website: string | null;
  logo_url: string | null;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProductAndVendor();
    }
  }, [id]);

  const fetchProductAndVendor = async () => {
    try {
      // Fetch product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("status", "approved")
        .maybeSingle();

      if (productError) throw productError;

      if (!productData) {
        toast({
          title: "Product not found",
          description: "This product may have been removed or is not available.",
          variant: "destructive",
        });
        navigate("/browse");
        return;
      }

      setProduct(productData);

      // Fetch vendor
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendor_profiles")
        .select("*")
        .eq("id", productData.vendor_id)
        .maybeSingle();

      if (vendorError) throw vendorError;
      setVendor(vendorData);

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

  const handleWhatsAppClick = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            TechPrice
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/browse">
              <Button variant="ghost">Browse</Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline">Sign In</Button>
            </Link>
          </nav>
        </div>
      </header>

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

            <div className="text-4xl font-bold text-primary">
              {formatPrice(product.price)}
            </div>

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

            <Separator />

            {/* Vendor Info */}
            {vendor && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{vendor.company_name}</h3>
                      {vendor.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {vendor.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {vendor.address && (
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{vendor.address}</span>
                      </div>
                    )}
                    {vendor.whatsapp && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{vendor.whatsapp}</span>
                      </div>
                    )}
                    {vendor.website && (
                      <div className="flex items-center gap-3 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={vendor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          {vendor.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {vendor.whatsapp && (
                    <Button
                      onClick={handleWhatsAppClick}
                      className="w-full mt-4 gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Contact on WhatsApp
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
