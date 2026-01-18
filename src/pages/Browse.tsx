import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { NavBar } from "@/components/NavBar";

interface CatalogProduct {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  image_url: string | null;
  min_price: number;
  max_price: number;
  vendor_count: number;
  created_at: string;
}

type SortOption = "price_low" | "price_high" | "vendors" | "newest";

const PRODUCTS_PER_PAGE = 20;

const Browse = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "all"
  );
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, priceRange, selectedBrand]);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, searchQuery, sortBy, selectedBrand]);

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from("product_catalog")
        .select(`
          id,
          name,
          brand,
          category,
          image_url,
          created_at,
          products!inner (
            price,
            status
          )
        `);

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory as any);
      }

      const { data, error } = await query;

      if (error) throw error;

      const processedProducts: CatalogProduct[] = (data || []).map((item: any) => {
        const approvedProducts = item.products.filter((p: any) => p.status === 'approved');
        const prices = approvedProducts.map((p: any) => Number(p.price));
        
        return {
          id: item.id,
          name: item.name,
          brand: item.brand,
          category: item.category,
          image_url: item.image_url,
          min_price: prices.length > 0 ? Math.min(...prices) : 0,
          max_price: prices.length > 0 ? Math.max(...prices) : 0,
          vendor_count: approvedProducts.length,
          created_at: item.created_at,
        };
      }).filter((p: CatalogProduct) => p.vendor_count > 0);

      // Extract unique brands for filter dropdown
      const brands = [...new Set(processedProducts.map(p => p.brand).filter(Boolean))] as string[];
      setAvailableBrands(brands.sort());

      let filteredData = processedProducts;

      // Filter by brand
      if (selectedBrand !== "all") {
        filteredData = filteredData.filter((p) => p.brand === selectedBrand);
      }

      // Filter by price range
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        filteredData = filteredData.filter((p) => {
          if (max) {
            return p.min_price <= max && p.max_price >= min;
          }
          return p.max_price >= min;
        });
      }

      setProducts(filteredData);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Filter by search query
  const searchFilteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort products
  const sortedProducts = [...searchFilteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return a.min_price - b.min_price;
      case "price_high":
        return b.max_price - a.max_price;
      case "vendors":
        return b.vendor_count - a.vendor_count;
      case "newest":
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handleToggleCompare = (productId: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        toast.error("You can only compare up to 4 products");
        return prev;
      }
      return [...prev, productId];
    });
  };

  const handleCompare = () => {
    if (selectedProducts.length < 2) {
      toast.error("Please select at least 2 products to compare");
      return;
    }
    navigate(`/compare?products=${selectedProducts.join(",")}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (showEllipsisStart) pages.push("...");
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (showEllipsisEnd) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {pages.map((page, index) => (
          typeof page === "number" ? (
            <Button
              key={index}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ) : (
            <span key={index} className="px-2 text-muted-foreground">...</span>
          )
        ))}
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar showBackButton />

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="laptops">Laptops</SelectItem>
                <SelectItem value="smartphones">Smartphones</SelectItem>
                <SelectItem value="tablets">Tablets</SelectItem>
                <SelectItem value="monitors">Monitors</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {availableBrands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-50000">Under KES 50,000</SelectItem>
                <SelectItem value="50000-100000">KES 50,000 - 100,000</SelectItem>
                <SelectItem value="100000-200000">KES 100,000 - 200,000</SelectItem>
                <SelectItem value="200000-999999999">Over KES 200,000</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger>
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="vendors">Most Vendors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + PRODUCTS_PER_PAGE, sortedProducts.length)} of {sortedProducts.length} products
          </p>
          {totalPages > 1 && (
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* Compare Bar */}
        {selectedProducts.length > 0 && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <Card className="p-4 shadow-lg">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedProducts.length} product(s) selected
                </span>
                <Button onClick={handleCompare}>
                  Compare Now
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedProducts([])}
                >
                  Clear
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.min_price}
                  maxPrice={product.max_price}
                  vendorCount={product.vendor_count}
                  brand={product.brand || undefined}
                  category={product.category}
                  imageUrl={product.image_url || undefined}
                  isSelected={selectedProducts.includes(product.id)}
                  onToggleCompare={handleToggleCompare}
                  onViewDetails={(id) => navigate(`/product/${id}`)}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default Browse;