import { useState, useEffect, lazy, Suspense, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ShoppingCart, Star, Shield, Zap, X, Menu, User, LogOut, Store, ChevronDown, ChevronLeft, ChevronRight, ArrowDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useComparison } from "@/contexts/ComparisonContext";
import { toast } from "sonner";

const TechShowcase3D = lazy(() => import("@/components/TechShowcase3D"));

interface Product {
  id: string;
  name: string;
  price: number;
  brand: string | null;
  category: string;
  image_url: string | null;
  description?: string | null;
}

const HERO_CONTENT = [
  { phrase: "Smarter Tech Deals", subtitle: "AI-powered recommendations for the best prices in Kenya" },
  { phrase: "Compare. Save. Win.", subtitle: "Side-by-side comparisons that help you make the right choice" },
  { phrase: "Your Price Hunter", subtitle: "Track prices and get notified when deals drop" },
  { phrase: "Tech Made Simple", subtitle: "From specs to purchase, we simplify every step" },
  { phrase: "Shop Like a Pro", subtitle: "Join thousands of savvy tech shoppers" },
];

const PRODUCT_TAGLINES = [
  "You can't hide who you are",
  "Dare to live more",
  "Beyond the ordinary",
  "Redefine performance",
  "Power meets precision",
  "Unleash your potential",
  "The future is here",
  "Excellence redefined",
];

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isVendor, setIsVendor] = useState(false);
  const { selectedProducts, toggleProduct, compareProducts } = useComparison();
  
  // Featured product showcase state
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  
  // Typewriter effect state
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [subtitleOpacity, setSubtitleOpacity] = useState(1);

  // Auto-rotate featured products
  useEffect(() => {
    if (featuredProducts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentProductIndex((prev) => (prev + 1) % Math.min(featuredProducts.length, 5));
    }, 6000);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  const goToProduct = useCallback((index: number) => {
    setCurrentProductIndex(index);
  }, []);

  const nextProduct = useCallback(() => {
    setCurrentProductIndex((prev) => (prev + 1) % Math.min(featuredProducts.length, 5));
  }, [featuredProducts.length]);

  const prevProduct = useCallback(() => {
    setCurrentProductIndex((prev) => (prev - 1 + Math.min(featuredProducts.length, 5)) % Math.min(featuredProducts.length, 5));
  }, [featuredProducts.length]);

  // Typewriter effect
  useEffect(() => {
    const currentPhrase = HERO_CONTENT[currentPhraseIndex].phrase;
    const typeSpeed = isDeleting ? 40 : 80;
    const pauseTime = isDeleting ? 300 : 2500;

    if (!isDeleting && displayedText === currentPhrase) {
      // Pause before starting to delete
      const timeout = setTimeout(() => {
        setSubtitleOpacity(0);
        setTimeout(() => setIsDeleting(true), 300);
      }, pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayedText === "") {
      // Move to next phrase
      setIsDeleting(false);
      setCurrentPhraseIndex((prev) => (prev + 1) % HERO_CONTENT.length);
      setTimeout(() => setSubtitleOpacity(1), 100);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedText((prev) =>
        isDeleting
          ? prev.slice(0, -1)
          : currentPhrase.slice(0, prev.length + 1)
      );
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentPhraseIndex]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsVendor(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const name = user.user_metadata?.full_name || user.email || "";
    if (user.user_metadata?.full_name) {
      return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return name.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (!user) return "";
    return user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  };

  useEffect(() => {
    fetchFeaturedProducts();
    checkUserStatus();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          checkVendorRole(session.user.id);
        }, 0);
      } else {
        setIsVendor(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserStatus = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    setUser(authUser);

    if (authUser) {
      checkVendorRole(authUser.id);
    }
  };

  const checkVendorRole = async (userId: string) => {
    const { data: vendorRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "vendor")
      .maybeSingle();
    
    setIsVendor(!!vendorRole);
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
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Abstract background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-blob-1 animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute top-0 right-0 w-full h-full bg-blob-2 animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-0 left-0 w-full h-full bg-blob-3 animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-0 right-0 w-full h-full bg-blob-4 animate-float" style={{ animationDelay: "3s" }} />
      </div>

      {/* Navigation */}
      <nav className="relative border-b border-border/50 bg-background/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">TechPrice</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground/90 hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/browse" className="text-foreground/90 hover:text-foreground transition-colors">
              Products
            </Link>
            <Link to="/compare" className="text-foreground/90 hover:text-foreground transition-colors">
              Compare
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block font-medium max-w-[120px] truncate">
                      {getUserDisplayName()}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border border-border z-50">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{getUserDisplayName()}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isVendor ? (
                    <DropdownMenuItem onClick={() => navigate("/vendor")} className="cursor-pointer">
                      <Store className="mr-2 h-4 w-4" />
                      Vendor Dashboard
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => navigate("/vendor/onboard")} className="cursor-pointer">
                      <Store className="mr-2 h-4 w-4" />
                      Become a Vendor
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/auth?vendor=true">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Abstract Modern Design */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6">
        <div className="relative container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-in">
              <div className="inline-block">
                <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                  <span className="text-sm font-semibold text-primary">✨ Compare. Decide. Win.</span>
                </div>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none min-h-[1.2em]">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  {displayedText}
                </span>
                <span className="animate-pulse text-primary ml-1">|</span>
              </h1>
              <p 
                className="text-xl text-muted-foreground max-w-xl leading-relaxed transition-opacity duration-300 min-h-[2em]"
                style={{ opacity: subtitleOpacity }}
              >
                {HERO_CONTENT[currentPhraseIndex].subtitle}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/browse">
                  <Button size="lg" className="group">
                    Explore Products
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/compare">
                  <Button size="lg" variant="outline">
                    Start Comparing
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* 3D Tech Showcase */}
            <div className="hidden lg:flex items-center justify-center relative">
              <Suspense fallback={
                <div className="relative w-full h-[500px]">
                  <div className="absolute inset-0 bg-gradient-primary rounded-full blur-3xl opacity-30 animate-glow-pulse" />
                  <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-secondary rounded-full blur-2xl opacity-40 animate-float" />
                  <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-accent rounded-full blur-2xl opacity-30 animate-float" style={{ animationDelay: "2s" }} />
                </div>
              }>
                <TechShowcase3D />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - Lamborghini Style Showcase */}
      <section className="relative bg-gradient-to-b from-background via-background to-card/50">
        {/* Section Header */}
        <div className="container mx-auto max-w-7xl px-6 pt-24 pb-8">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Models</p>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">Featured Products</h2>
            </div>
            <Link to="/browse" className="hidden sm:block">
              <Button variant="ghost" className="group text-sm uppercase tracking-widest">
                Discover All 
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="h-[70vh] flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
              <p className="text-muted-foreground mt-6 uppercase tracking-widest text-sm">Loading...</p>
            </div>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="h-[50vh] flex items-center justify-center">
            <p className="text-muted-foreground text-lg">No products available yet</p>
          </div>
        ) : (
          <div className="relative">
            {/* Main Showcase */}
            <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
              {featuredProducts.slice(0, 5).map((product, index) => (
                <div
                  key={product.id}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    index === currentProductIndex 
                      ? "opacity-100 translate-x-0" 
                      : index < currentProductIndex 
                        ? "opacity-0 -translate-x-full" 
                        : "opacity-0 translate-x-full"
                  }`}
                >
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
                  
                  {/* Product Image */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[60%] md:w-[55%] h-[80%] z-0">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-contain object-center drop-shadow-2xl"
                        style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.5))" }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-lg">
                        <span className="text-muted-foreground text-lg">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="relative z-20 h-full flex items-center">
                    <div className="container mx-auto max-w-7xl px-6">
                      <div className="max-w-xl space-y-6">
                        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                          {PRODUCT_TAGLINES[index % PRODUCT_TAGLINES.length]}
                        </p>
                        
                        {product.brand && (
                          <p className="text-lg text-primary font-medium">{product.brand}</p>
                        )}
                        
                        <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase leading-none">
                          {product.name}
                        </h3>
                        
                        <p className="text-3xl md:text-4xl font-bold text-primary">
                          KES {product.price.toLocaleString()}
                        </p>

                        <p className="text-sm text-muted-foreground capitalize">
                          {product.category}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                          <Button 
                            size="lg" 
                            className="group uppercase tracking-widest"
                            onClick={() => navigate(`/product/${product.id}`)}
                          >
                            Explore 
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                          <Button 
                            size="lg" 
                            variant="outline"
                            className="uppercase tracking-widest"
                            onClick={() => toggleProduct(product.id)}
                          >
                            {selectedProducts.includes(product.id) ? "Added ✓" : "Compare"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation Arrows */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 h-14 w-14 rounded-full bg-card/50 backdrop-blur-sm hover:bg-card/80 border border-border/50"
                onClick={prevProduct}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 h-14 w-14 rounded-full bg-card/50 backdrop-blur-sm hover:bg-card/80 border border-border/50"
                onClick={nextProduct}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>

              {/* Progress Indicators */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {featuredProducts.slice(0, 5).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToProduct(index)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === currentProductIndex 
                        ? "w-12 bg-primary" 
                        : "w-8 bg-muted hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Product Thumbnails Bar */}
            <div className="border-t border-border/30 bg-card/30 backdrop-blur-sm">
              <div className="container mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-0 divide-x divide-border/30">
                  {featuredProducts.slice(0, 5).map((product, index) => (
                    <button
                      key={product.id}
                      onClick={() => goToProduct(index)}
                      className={`group relative py-6 px-4 text-left transition-all duration-300 ${
                        index === currentProductIndex 
                          ? "bg-primary/10" 
                          : "hover:bg-card/50"
                      }`}
                    >
                      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-primary transition-transform duration-300 origin-left ${
                        index === currentProductIndex ? "scale-x-100" : "scale-x-0"
                      }`} />
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted/30 rounded-lg overflow-hidden flex-shrink-0">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="hidden md:block min-w-0">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide truncate">
                            {product.brand || product.category}
                          </p>
                          <p className="font-semibold truncate">{product.name}</p>
                          <p className="text-sm text-primary font-medium">
                            KES {product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Categories Grid */}
      <section className="relative py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-5xl font-bold text-center mb-16 tracking-tight">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link to="/browse" key={index}>
                <Card className="relative p-8 hover:scale-110 transition-all duration-500 text-center cursor-pointer group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-glow">
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-500">
                      {category.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-5xl font-bold text-center mb-16 tracking-tight">
            Why Choose TechPrice?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative p-10 hover:scale-105 transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group hover:shadow-glow">
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <div className="relative space-y-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Verified Vendors</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every vendor is thoroughly verified to ensure authenticity and quality. Shop with complete confidence.
                </p>
              </div>
            </Card>

            <Card className="relative p-10 hover:scale-105 transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group hover:shadow-glow">
              <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <div className="relative space-y-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow-pink">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Instant Compare</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Compare specifications, prices, and features across multiple vendors in real-time with our advanced tools.
                </p>
              </div>
            </Card>

            <Card className="relative p-10 hover:scale-105 transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group hover:shadow-glow">
              <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <div className="relative space-y-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-secondary flex items-center justify-center shadow-glow">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Best Prices</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Find the most competitive prices in the market. Save more on every purchase with our price comparison.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20" />
            <div className="relative space-y-8">
              <h2 className="text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
                Ready to Find Your
                <br />
                <span className="bg-gradient-accent bg-clip-text text-transparent">
                  Perfect Match?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of smart shoppers making informed decisions every day
              </p>
              <div className="pt-4">
                <Link to="/browse">
                  <Button size="lg" className="group text-lg px-12 py-8 h-auto">
                    Start Shopping Now
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Bar */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border/50 shadow-2xl z-50">
          <div className="container mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg">
                  {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                </span>
                <Button onClick={compareProducts} size="lg">
                  Compare Now
                  <ArrowRight className="ml-2 h-5 w-5" />
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
      <footer className="relative border-t border-border/50 py-16 px-6 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">TechPrice</span>
              </div>
              <p className="text-muted-foreground">
                Your trusted tech product comparison platform.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-lg">For Customers</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/browse" className="hover:text-primary transition-colors">Browse Products</Link></li>
                <li><Link to="/compare" className="hover:text-primary transition-colors">Compare</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-lg">For Vendors</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/auth?vendor=true" className="hover:text-primary transition-colors">Sign Up</Link></li>
                <li><Link to="/vendor" className="hover:text-primary transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-lg">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-center text-muted-foreground">
            © 2025 TechPrice. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
