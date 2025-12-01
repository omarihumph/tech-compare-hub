import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ShoppingCart, Star, Shield, Zap, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useComparison } from "@/contexts/ComparisonContext";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  brand: string | null;
  category: string;
  image_url: string | null;
}

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isVendor, setIsVendor] = useState(false);
  const { selectedProducts, toggleProduct, compareProducts } = useComparison();

  useEffect(() => {
    fetchFeaturedProducts();
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    setUser(authUser);

    if (authUser) {
      const { data: vendorRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authUser.id)
        .eq("role", "vendor")
        .maybeSingle();
      
      setIsVendor(!!vendorRole);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, brand, category, image_url")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw error;
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load featured products");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: "Laptops", icon: "💻", count: "200+ Products" },
    { name: "Smartphones", icon: "📱", count: "150+ Products" },
    { name: "Monitors", icon: "🖥️", count: "100+ Products" },
    { name: "Audio", icon: "🎧", count: "80+ Products" },
    { name: "Gaming", icon: "🎮", count: "120+ Products" },
    { name: "Accessories", icon: "⌨️", count: "250+ Products" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TechPrice</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/browse">
              <Button variant="ghost" className="hidden sm:inline-flex">Browse</Button>
            </Link>
            {user ? (
              <>
                {isVendor ? (
                  <Link to="/vendor">
                    <Button>Vendor Dashboard</Button>
                  </Link>
                ) : (
                  <Link to="/vendor/onboard">
                    <Button>Become a Vendor</Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/auth?vendor=true">
                  <Button>Become a Vendor</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Samsung Style */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            The Future of
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Tech Shopping
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl">
            Compare. Discover. Decide. Find the perfect tech products from verified vendors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/browse">
              <Button size="lg" className="text-base px-8 h-12">
                Explore Products
              </Button>
            </Link>
            <Link to="/compare">
              <Button size="lg" variant="outline" className="text-base px-8 h-12">
                Compare Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked deals from verified vendors</p>
            </div>
            <Link to="/browse">
              <Button variant="ghost" className="hidden sm:inline-flex">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products available yet</p>
            </div>
          ) : (
            <Carousel className="w-full">
              <CarouselContent>
                {featuredProducts.map((product) => (
                  <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      brand={product.brand || undefined}
                      category={product.category}
                      imageUrl={product.image_url || undefined}
                      isSelected={selectedProducts.includes(product.id)}
                      onToggleCompare={toggleProduct}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          )}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link to="/browse" key={index}>
                <Card className="p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 text-center cursor-pointer group">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Samsung Style */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose TechPrice?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Verified Vendors</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every vendor is thoroughly verified to ensure authenticity and quality. Shop with confidence.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2">
              <div className="h-14 w-14 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Instant Compare</h3>
              <p className="text-muted-foreground leading-relaxed">
                Compare specifications, prices, and features across multiple vendors in real-time.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2">
              <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <Star className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Best Prices</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find the most competitive prices in the market. Save more on every purchase.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Bold Samsung Style */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your
            <br />
            Perfect Tech Match?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10">
            Join thousands of smart shoppers making informed decisions every day
          </p>
          <Link to="/browse">
            <Button size="lg" className="text-base px-10 h-14 text-lg">
              Start Shopping Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Comparison Bar */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-semibold">
                  {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                </span>
                <Button onClick={compareProducts} size="lg">
                  Compare Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => selectedProducts.forEach(toggleProduct)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">TechPrice</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted tech product comparison platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/browse" className="hover:text-primary">Browse Products</Link></li>
                <li><Link to="/compare" className="hover:text-primary">Compare</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Vendors</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/auth?vendor=true" className="hover:text-primary">Sign Up</Link></li>
                <li><Link to="/vendor" className="hover:text-primary">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 TechPrice. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
