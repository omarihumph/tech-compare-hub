import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Package, Store, Eye, Plus } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  maxPrice?: number;
  vendorCount?: number;
  brand?: string;
  category: string;
  imageUrl?: string;
  isSelected?: boolean;
  onToggleCompare?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export const ProductCard = ({
  id,
  name,
  price,
  maxPrice,
  vendorCount,
  brand,
  category,
  imageUrl,
  isSelected = false,
  onToggleCompare,
  onViewDetails,
}: ProductCardProps) => {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const hasMultipleVendors = vendorCount && vendorCount > 1;
  const hasPriceRange = maxPrice && maxPrice !== price;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        {onToggleCompare && (
          <div className="absolute top-2 right-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleCompare(id)}
              className="h-5 w-5 bg-background/80 border-2"
            />
          </div>
        )}
        <Badge className="absolute top-2 left-2 capitalize">{category}</Badge>
      </div>
      <CardContent className="p-4">
        {brand && (
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {brand}
          </p>
        )}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">{name}</h3>
        <div className="space-y-1">
          {hasPriceRange ? (
            <div>
              <p className="text-lg font-bold text-primary">
                {formatPrice(price)} - {formatPrice(maxPrice)}
              </p>
            </div>
          ) : (
            <p className="text-lg font-bold text-primary">{formatPrice(price)}</p>
          )}
          {hasMultipleVendors && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Store className="h-3 w-3" />
              <span>{vendorCount} vendors</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        {onViewDetails && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails(id)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
        )}
        {onToggleCompare && (
          <Button
            variant={isSelected ? "default" : "outline"}
            className="flex-1"
            onClick={() => onToggleCompare(id)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {isSelected ? "Selected" : "Compare"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};