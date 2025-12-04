import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Plus } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
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
  brand,
  category,
  imageUrl,
  isSelected = false,
  onToggleCompare,
  onViewDetails,
}: ProductCardProps) => {
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
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        {onToggleCompare && (
          <div className="absolute top-2 right-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleCompare(id)}
              className="bg-background"
            />
          </div>
        )}
        <Badge className="absolute top-2 left-2">{category}</Badge>
      </div>
      <CardContent className="p-4">
        {brand && (
          <p className="text-sm text-muted-foreground mb-1">{brand}</p>
        )}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{name}</h3>
        <p className="text-2xl font-bold text-primary">
          KES {price.toLocaleString()}
        </p>
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
