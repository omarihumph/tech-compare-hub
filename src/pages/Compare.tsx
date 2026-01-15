import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Mail, Phone, MessageCircle, ExternalLink } from "lucide-react";
import { AIRecommendation } from "@/components/AIRecommendation";
import { toast } from "sonner";
import { NavBar } from "@/components/NavBar";

interface Product {
  id: string;
  name: string;
  price: number;
  brand: string | null;
  model: string | null;
  category: string;
  description: string | null;
  image_url: string | null;
  specs: any;
  vendor_profiles: {
    company_name: string;
    whatsapp: string | null;
    website: string | null;
    user_id: string;
  };
}

interface VendorProfile {
  email: string;
  phone: string | null;
}

const Compare = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productIds = searchParams.get("products")?.split(",") || [];
  
  const [products, setProducts] = useState<Product[]>([]);
  const [vendorProfiles, setVendorProfiles] = useState<Record<string, VendorProfile>>({});
  const [loading, setLoading] = useState(true);
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);

  useEffect(() => {
    if (productIds.length === 0) {
      toast.error("No products selected for comparison");
      navigate("/browse");
      return;
    }
    fetchProducts();
  }, [productIds]);

  const fetchProducts = async () => {
    try {
      // First try to fetch from products table (for individual product IDs)
      let { data, error } = await supabase
        .from("products")
        .select(`
          *,
          vendor_profiles (
            company_name,
            whatsapp,
            website,
            user_id
          )
        `)
        .in("id", productIds)
        .eq("status", "approved");

      // If no results, try fetching by catalog_id (Browse page uses catalog IDs)
      if (!error && (!data || data.length === 0)) {
        const catalogResult = await supabase
          .from("products")
          .select(`
            *,
            vendor_profiles (
              company_name,
              whatsapp,
              website,
              user_id
            )
          `)
          .in("catalog_id", productIds)
          .eq("status", "approved");
        
        if (catalogResult.error) throw catalogResult.error;
        
        // Get the lowest priced product for each catalog item
        const catalogProducts = catalogResult.data || [];
        const bestByCategory = new Map<string, typeof catalogProducts[0]>();
        
        catalogProducts.forEach(product => {
          const existing = bestByCategory.get(product.catalog_id!);
          if (!existing || product.price < existing.price) {
            bestByCategory.set(product.catalog_id!, product);
          }
        });
        
        data = Array.from(bestByCategory.values());
      }

      if (error) throw error;
      setProducts(data || []);

      // Fetch vendor profiles separately
      if (data && data.length > 0) {
        const userIds = data.map(p => p.vendor_profiles.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, email, phone")
          .in("id", userIds);

        if (profiles) {
          const profileMap: Record<string, VendorProfile> = {};
          profiles.forEach(p => {
            profileMap[p.id] = { email: p.email, phone: p.phone };
          });
          setVendorProfiles(profileMap);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = (productId: string) => {
    const newIds = productIds.filter(id => id !== productId);
    if (newIds.length === 0) {
      navigate("/browse");
      return;
    }
    navigate(`/compare?products=${newIds.join(",")}`);
  };

  const handleWhatsAppContact = (whatsapp: string, productName: string) => {
    const message = encodeURIComponent(`Hi! I'm interested in ${productName} from TechPrice.`);
    const phoneNumber = whatsapp.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const handleEmailContact = (email: string, productName: string) => {
    const subject = encodeURIComponent(`Inquiry about ${productName}`);
    const body = encodeURIComponent(`Hi,\n\nI found ${productName} on TechPrice and would like to know more about it.\n\nThank you!`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const handlePhoneContact = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const getAllSpecs = () => {
    const allSpecs = new Set<string>();
    products.forEach(product => {
      if (product.specs && typeof product.specs === 'object') {
        Object.keys(product.specs).forEach(key => allSpecs.add(key));
      }
    });
    return Array.from(allSpecs);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading comparison...</p>
      </div>
    );
  }

  const specKeys = getAllSpecs();

  return (
    <div className="min-h-screen bg-background">
      <NavBar showBackButton />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Product Comparison</h1>
          <p className="text-muted-foreground">
            Compare {products.length} product(s) side-by-side
          </p>
        </div>

        {/* AI Recommendation Section */}
        {products.length >= 2 && (
          <div className="mb-8">
            <AIRecommendation 
              products={products} 
              onHighlight={(id) => setHighlightedProductId(id)}
            />
          </div>
        )}

        {/* Desktop View - Table */}
        <div className="hidden lg:block overflow-x-auto">
          <div className="min-w-full">
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
              {/* Header Row - Product Cards */}
              <div className="font-semibold text-lg flex items-end pb-4">
                Features
              </div>
              {products.map((product) => (
                <Card 
                  key={product.id} 
                  className={`relative p-4 transition-all duration-300 ${
                    highlightedProductId === product.id 
                      ? "ring-2 ring-primary shadow-lg shadow-primary/20" 
                      : ""
                  }`}
                >
                  {highlightedProductId === product.id && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      AI Recommended
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeProduct(product.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">No image</span>
                      </div>
                    )}
                  </div>
                  <Badge className="mb-2">{product.category}</Badge>
                  {product.brand && (
                    <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
                  )}
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-4">
                    KES {product.price.toLocaleString()}
                  </p>
                </Card>
              ))}

              {/* Basic Info */}
              <div className="font-medium py-3 border-t">Model</div>
              {products.map((product) => (
                <div key={`model-${product.id}`} className="py-3 border-t">
                  {product.model || "N/A"}
                </div>
              ))}

              <div className="font-medium py-3 border-t">Category</div>
              {products.map((product) => (
                <div key={`cat-${product.id}`} className="py-3 border-t capitalize">
                  {product.category}
                </div>
              ))}

              <div className="font-medium py-3 border-t">Description</div>
              {products.map((product) => (
                <div key={`desc-${product.id}`} className="py-3 border-t text-sm">
                  {product.description || "No description available"}
                </div>
              ))}

              {/* Specifications */}
              {specKeys.length > 0 && (
                <>
                  <div className="font-semibold text-lg pt-6 pb-3 border-t-2">
                    Specifications
                  </div>
                  {products.map((product) => (
                    <div key={`spec-header-${product.id}`} className="pt-6 pb-3 border-t-2" />
                  ))}

                  {specKeys.map((specKey) => (
                    <>
                      <div key={`spec-label-${specKey}`} className="font-medium py-3 border-t capitalize">
                        {specKey.replace(/_/g, " ")}
                      </div>
                      {products.map((product) => (
                        <div key={`spec-${product.id}-${specKey}`} className="py-3 border-t">
                          {product.specs?.[specKey] || "N/A"}
                        </div>
                      ))}
                    </>
                  ))}
                </>
              )}

              {/* Vendor Contact */}
              <div className="font-semibold text-lg pt-6 pb-3 border-t-2">
                Vendor
              </div>
              {products.map((product) => (
                <div key={`vendor-header-${product.id}`} className="pt-6 pb-3 border-t-2" />
              ))}

              <div className="font-medium py-3 border-t">Company</div>
              {products.map((product) => (
                <div key={`company-${product.id}`} className="py-3 border-t">
                  {product.vendor_profiles.company_name}
                </div>
              ))}

              <div className="font-medium py-3 border-t">Contact</div>
              {products.map((product) => {
                const vendorProfile = vendorProfiles[product.vendor_profiles.user_id];
                return (
                  <div key={`contact-${product.id}`} className="py-3 border-t">
                    <div className="flex flex-col gap-2">
                      {product.vendor_profiles.whatsapp && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="justify-start"
                          onClick={() =>
                            handleWhatsAppContact(
                              product.vendor_profiles.whatsapp!,
                              product.name
                            )
                          }
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          WhatsApp
                        </Button>
                      )}
                      {vendorProfile?.email && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="justify-start"
                          onClick={() =>
                            handleEmailContact(
                              vendorProfile.email,
                              product.name
                            )
                          }
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                      )}
                      {vendorProfile?.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="justify-start"
                          onClick={() =>
                            handlePhoneContact(vendorProfile.phone!)
                          }
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                      )}
                      {product.vendor_profiles.website && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="justify-start"
                          asChild
                        >
                          <a
                            href={product.vendor_profiles.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Website
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile View - Stacked Cards */}
        <div className="lg:hidden space-y-6">
          {products.map((product) => (
            <Card key={product.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <Badge>{product.category}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProduct(product.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
              </div>

              {product.brand && (
                <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
              )}
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-3xl font-bold text-primary mb-4">
                KES {product.price.toLocaleString()}
              </p>

              <Separator className="my-4" />

              <div className="space-y-3">
                {product.model && (
                  <div>
                    <span className="font-medium">Model: </span>
                    <span className="text-muted-foreground">{product.model}</span>
                  </div>
                )}
                {product.description && (
                  <div>
                    <span className="font-medium">Description: </span>
                    <span className="text-muted-foreground text-sm">
                      {product.description}
                    </span>
                  </div>
                )}
              </div>

              {product.specs && Object.keys(product.specs).length > 0 && (
                <>
                  <Separator className="my-4" />
                  <h4 className="font-semibold mb-3">Specifications</h4>
                  <div className="space-y-2">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/_/g, " ")}:
                        </span>
                        <span className="font-medium">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <Separator className="my-4" />

              <div className="space-y-3">
                <h4 className="font-semibold">Vendor</h4>
                <p className="text-sm">{product.vendor_profiles.company_name}</p>
                <div className="flex flex-col gap-2">
                  {product.vendor_profiles.whatsapp && (
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() =>
                        handleWhatsAppContact(
                          product.vendor_profiles.whatsapp!,
                          product.name
                        )
                      }
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact via WhatsApp
                    </Button>
                  )}
                  {vendorProfiles[product.vendor_profiles.user_id]?.email && (
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() =>
                        handleEmailContact(
                          vendorProfiles[product.vendor_profiles.user_id].email,
                          product.name
                        )
                      }
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                  )}
                  {vendorProfiles[product.vendor_profiles.user_id]?.phone && (
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() =>
                        handlePhoneContact(vendorProfiles[product.vendor_profiles.user_id].phone!)
                      }
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Vendor
                    </Button>
                  )}
                  {product.vendor_profiles.website && (
                    <Button variant="outline" className="justify-start" asChild>
                      <a
                        href={product.vendor_profiles.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Compare;