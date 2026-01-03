import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

interface ComparisonContextType {
  selectedProducts: string[];
  toggleProduct: (productId: string) => void;
  clearSelection: () => void;
  compareProducts: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial auth state
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        setShowAuthModal(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleProduct = (productId: string) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

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
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (selectedProducts.length < 2) {
      toast.error("Please select at least 2 products to compare");
      return;
    }
    navigate(`/compare?products=${selectedProducts.join(",")}`);
  };

  return (
    <ComparisonContext.Provider
      value={{ selectedProducts, toggleProduct, clearSelection, compareProducts, showAuthModal, setShowAuthModal }}
    >
      {children}
      
      {/* Sign In Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Sign In Required
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Create an account or sign in to compare products and unlock all features
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              size="lg" 
              onClick={() => {
                setShowAuthModal(false);
                navigate("/auth");
              }}
              className="w-full"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Sign In
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => {
                setShowAuthModal(false);
                navigate("/auth");
              }}
              className="w-full"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Create Account
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center pt-2">
            By signing up, you can compare products, save your favorites, and access exclusive deals.
          </p>
        </DialogContent>
      </Dialog>
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
