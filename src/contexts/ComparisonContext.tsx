import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ComparisonContextType {
  selectedProducts: string[];
  toggleProduct: (productId: string) => void;
  clearSelection: () => void;
  compareProducts: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        toast.error("You can only compare up to 4 products");
        return prev;
      }
      toast.success("Product added to comparison");
      return [...prev, productId];
    });
  };

  const clearSelection = () => {
    setSelectedProducts([]);
  };

  const compareProducts = () => {
    if (selectedProducts.length < 2) {
      toast.error("Please select at least 2 products to compare");
      return;
    }
    navigate(`/compare?products=${selectedProducts.join(",")}`);
  };

  return (
    <ComparisonContext.Provider
      value={{ selectedProducts, toggleProduct, clearSelection, compareProducts }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
};
