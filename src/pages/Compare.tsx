import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Mail, Phone, MessageCircle, ExternalLink, Store } from "lucide-react";
import { AIRecommendation } from "@/components/AIRecommendation";
import { toast } from "sonner";
import { NavBar } from "@/components/NavBar";

interface VendorListing {
  id: string;
  price: number;
  vendor_profiles: {
    id: string;
    company_name: string;
    whatsapp: string | null;
    website: string | null;
    user_id: string;
  };
}

interface CatalogProduct {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  category: string;
  description: string | null;
  image_url: string | null;
  specs: any;
  listings: VendorListing[];
}

interface VendorProfile {
  email: string;
  phone: string | null;
}

const Compare = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const catalogIds = searchParams.get("products")?.split(",") || [];
  
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>([]);
  const [vendorProfiles, setVendorProfiles] = useState<Record<string, VendorProfile>>({});
  const [loading, setLoading] = useState(true);
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);

  useEffect(() => {
    if (catalogIds.length === 0) {
      toast.error("No products selected for comparison");
      navigate("/browse");
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch catalog items
      const { data: catalogData, error: catalogError } = await supabase
        .from("product_catalog")
        .select("*")
        .in("id", catalogIds);

      if (catalogError) throw catalogError;

      // Fetch all vendor listings for these catalog items
      const { data: listingsData, error: listingsError } = await supabase
        .from("products")
        .select(`
          id,
          catalog_id,
          price,
          vendor_profiles (
            id,
            company_name,
            whatsapp,
            website,
            user_id
          )
        `)
        .in("catalog_id", catalogIds)
        .eq("status", "approved")
        .order("price", { ascending: true });

      if (listingsError) throw listingsError;

      // Combine catalog data with listings
      const combined: CatalogProduct[] = (catalogData || []).map(catalog => ({
        id: catalog.id,
        name: catalog.name,
        brand: catalog.brand,
        model: catalog.model,
        category: catalog.category,
        description: catalog.description,
        image_url: catalog.image_url,
        specs: catalog.specs,
        listings: (listingsData || [])
          .filter(listing => listing.catalog_id === catalog.id)
          .map(listing => ({
            id: listing.id,
            price: listing.price,
            vendor_profiles: listing.vendor_profiles as VendorListing['vendor_profiles']
          }))
      }));

      setCatalogProducts(combined);

      // Fetch vendor user profiles for contact info
      const userIds = (listingsData || []).map(l => l.vendor_profiles?.user_id).filter(Boolean);
      if (userIds.length > 0) {
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

  const removeProduct = (catalogId: string) => {
    const newIds = catalogIds.filter(id => id !== catalogId);
    if (newIds.length === 0) {
      navigate("/browse");
      return;
    }
    navigate(`/compare?products=${newIds.join(",")}`);
  };

  const handleWhatsAppContact = (whatsapp: string, productName: string, vendorName: string) => {
    const message = encodeURIComponent(`Hi! I'm interested in ${productName} from ${vendorName} (found on TechPrice).`);
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
    catalogProducts.forEach(product => {
      if (product.specs && typeof product.specs === 'object') {
        Object.keys(product.specs).forEach(key => allSpecs.add(key));
      }
    });
    return Array.from(allSpecs);
  };

  // For AI recommendation, we need to convert to a format it expects
  const getProductsForAI = () => {
    return catalogProducts.map(catalog => ({
      id: catalog.id,
      name: catalog.name,
      price: catalog.listings[0]?.price || 0,
      brand: catalog.brand,
      model: catalog.model,
      category: catalog.category,
      description: catalog.description,
      image_url: catalog.image_url,
      specs: catalog.specs,
      vendor_profiles: catalog.listings[0]?.vendor_profiles || {
        company_name: "N/A",
        whatsapp: null,
        website: null,
        user_id: ""
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading comparison...</p>
      </div>
    );
  }

  const specKeys = getAllSpecs();

  const VendorListingCard = ({ listing, productName }: { listing: VendorListing; productName: string }) => {
    const vendorProfile = vendorProfiles[listing.vendor_profiles.user_id];
    
    return (
      <Card className="p-3 bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">{listing.vendor_profiles.company_name}</span>
          </div>
          <span className="text-lg font-bold text-primary">
            KES {listing.price.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {listing.vendor_profiles.whatsapp && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => handleWhatsAppContact(listing.vendor_profiles.whatsapp!, productName, listing.vendor_profiles.company_name)}
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              WhatsApp
            </Button>
          )}
          {vendorProfile?.email && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => handleEmailContact(vendorProfile.email, productName)}
            >
              <Mail className="h-3 w-3 mr-1" />
              Email
            </Button>
          )}
          {vendorProfile?.phone && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => handlePhoneContact(vendorProfile.phone!)}
            >
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
          )}
          {listing.vendor_profiles.website && (
            <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
              <a href={listing.vendor_profiles.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Website
              </a>
            </Button>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar showBackButton />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Product Comparison</h1>
          <p className="text-muted-foreground">
            Compare {catalogProducts.length} product(s) side-by-side with all vendor prices
          </p>
        </div>

        {/* AI Recommendation Section */}
        {catalogProducts.length >= 2 && (
          <div className="mb-8">
            <AIRecommendation 
              products={getProductsForAI()} 
              onHighlight={(id) => setHighlightedProductId(id)}
            />
          </div>
        )}

        {/* Desktop View - Table */}
        <div className="hidden lg:block overflow-x-auto">
          <div className="min-w-full">
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${catalogProducts.length}, 1fr)` }}>
              {/* Header Row - Product Cards */}
              <div className="font-semibold text-lg flex items-end pb-4">
                Features
              </div>
              {catalogProducts.map((product) => (
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
                  {product.listings.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <span className="text-2xl font-bold text-primary">
                        KES {product.listings[0].price.toLocaleString()}
                      </span>
                      {product.listings.length > 1 && (
                        <span className="ml-1">
                          - {product.listings[product.listings.length - 1].price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.listings.length} vendor{product.listings.length !== 1 ? 's' : ''}
                  </p>
                </Card>
              ))}

              {/* Basic Info */}
              <div className="font-medium py-3 border-t">Model</div>
              {catalogProducts.map((product) => (
                <div key={`model-${product.id}`} className="py-3 border-t">
                  {product.model || "N/A"}
                </div>
              ))}

              <div className="font-medium py-3 border-t">Category</div>
              {catalogProducts.map((product) => (
                <div key={`cat-${product.id}`} className="py-3 border-t capitalize">
                  {product.category}
                </div>
              ))}

              <div className="font-medium py-3 border-t">Description</div>
              {catalogProducts.map((product) => (
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
                  {catalogProducts.map((product) => (
                    <div key={`spec-header-${product.id}`} className="pt-6 pb-3 border-t-2" />
                  ))}

                  {specKeys.map((specKey) => (
                    <div key={`spec-row-${specKey}`} className="contents">
                      <div className="font-medium py-3 border-t capitalize">
                        {specKey.replace(/_/g, " ")}
                      </div>
                      {catalogProducts.map((product) => (
                        <div key={`spec-${product.id}-${specKey}`} className="py-3 border-t">
                          {product.specs?.[specKey] || "N/A"}
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}

              {/* Vendor Listings Section */}
              <div className="font-semibold text-lg pt-6 pb-3 border-t-2">
                Vendor Prices
              </div>
              {catalogProducts.map((product) => (
                <div key={`vendor-header-${product.id}`} className="pt-6 pb-3 border-t-2" />
              ))}

              <div className="font-medium py-3 border-t">All Vendors</div>
              {catalogProducts.map((product) => (
                <div key={`vendors-${product.id}`} className="py-3 border-t">
                  {product.listings.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No vendors available</p>
                  ) : (
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-2">
                        {product.listings.map((listing, index) => (
                          <div key={listing.id} className="relative">
                            {index === 0 && (
                              <Badge variant="secondary" className="absolute -top-1 -left-1 text-xs z-10">
                                Best Price
                              </Badge>
                            )}
                            <VendorListingCard listing={listing} productName={product.name} />
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View - Stacked Cards */}
        <div className="lg:hidden space-y-6">
          {catalogProducts.map((product) => (
            <Card 
              key={product.id} 
              className={`p-6 ${
                highlightedProductId === product.id 
                  ? "ring-2 ring-primary shadow-lg shadow-primary/20" 
                  : ""
              }`}
            >
              {highlightedProductId === product.id && (
                <Badge className="mb-2 bg-primary">AI Recommended</Badge>
              )}
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
              
              {product.listings.length > 0 && (
                <div className="mb-4">
                  <span className="text-3xl font-bold text-primary">
                    KES {product.listings[0].price.toLocaleString()}
                  </span>
                  {product.listings.length > 1 && (
                    <span className="text-muted-foreground ml-2">
                      - {product.listings[product.listings.length - 1].price.toLocaleString()}
                    </span>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {product.listings.length} vendor{product.listings.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              )}

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
                <h4 className="font-semibold flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  All Vendors ({product.listings.length})
                </h4>
                {product.listings.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No vendors available</p>
                ) : (
                  <div className="space-y-2">
                    {product.listings.map((listing, index) => (
                      <div key={listing.id} className="relative">
                        {index === 0 && (
                          <Badge variant="secondary" className="absolute -top-1 -left-1 text-xs z-10">
                            Best Price
                          </Badge>
                        )}
                        <VendorListingCard listing={listing} productName={product.name} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Compare;
