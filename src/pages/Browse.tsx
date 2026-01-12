import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, SlidersHorizontal } from "lucide-react";
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
}

const Browse = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, priceRange]);

  const fetchProducts = async () => {
    try {
      // Fetch from product_catalog with aggregated pricing from products
      let query = supabase
        .from("product_catalog")
        .select(`
          id,
          name,
          brand,
          category,
          image_url,
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

      // Process data to get min/max prices and vendor counts
      const processedProducts: CatalogProduct[] = (data || []).map((item: any) => {
        const approvedProducts = item.products.filter((p: any) => p.status === 'approved');
        const prices = approvedProducts.map((p: any) => Number(p.price));
        
        return {
          id: item.id,
          name: item.name,
          brand: item.brand,
          category: item.category,
          image_url: item.image_url,
          min_price: Math.min(...prices),
          max_price: Math.max(...prices),
          vendor_count: approvedProducts.length,
        };
      }).filter((p: CatalogProduct) => p.vendor_count > 0);

      // Apply price filter
      let filteredData = processedProducts;
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="grid md:grid-cols-3 gap-4">
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
          </div>
        </Card>

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
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
        )}
      </div>
    </div>
  );
};

export default Browse;