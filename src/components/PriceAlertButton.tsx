import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PriceAlertButtonProps {
  catalogId: string;
  productName: string;
  currentLowestPrice: number;
}

export const PriceAlertButton = ({
  catalogId,
  productName,
  currentLowestPrice,
}: PriceAlertButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [existingAlert, setExistingAlert] = useState<{
    id: string;
    target_price: number | null;
    original_price: number;
  } | null>(null);
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user && catalogId) {
      checkExistingAlert();
    } else {
      setChecking(false);
    }
  }, [user, catalogId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const checkExistingAlert = async () => {
    try {
      const { data, error } = await supabase
        .from("price_alerts")
        .select("id, target_price, original_price")
        .eq("catalog_id", catalogId)
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      setExistingAlert(data);
      if (data?.target_price) {
        setTargetPrice(data.target_price.toString());
      }
    } catch (error) {
      console.error("Error checking alert:", error);
    } finally {
      setChecking(false);
    }
  };

  const handleCreateAlert = async () => {
    if (!user) {
      toast.error("Please sign in to set price alerts");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("price_alerts").insert({
        user_id: user.id,
        catalog_id: catalogId,
        original_price: currentLowestPrice,
        target_price: targetPrice ? parseFloat(targetPrice) : null,
      });

      if (error) throw error;

      toast.success("Price alert created! We'll notify you when the price drops.");
      setIsOpen(false);
      checkExistingAlert();
    } catch (error: any) {
      console.error("Error creating alert:", error);
      toast.error("Failed to create price alert");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAlert = async () => {
    if (!existingAlert) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("price_alerts")
        .update({ is_active: false })
        .eq("id", existingAlert.id);

      if (error) throw error;

      toast.success("Price alert removed");
      setExistingAlert(null);
      setTargetPrice("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error removing alert:", error);
      toast.error("Failed to remove price alert");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAlert = async () => {
    if (!existingAlert) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("price_alerts")
        .update({ 
          target_price: targetPrice ? parseFloat(targetPrice) : null 
        })
        .eq("id", existingAlert.id);

      if (error) throw error;

      toast.success("Price alert updated!");
      setIsOpen(false);
      checkExistingAlert();
    } catch (error) {
      console.error("Error updating alert:", error);
      toast.error("Failed to update price alert");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (checking) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        onClick={() => toast.info("Please sign in to set price alerts")}
        className="gap-2"
      >
        <Bell className="h-4 w-4" />
        Price Alert
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={existingAlert ? "default" : "outline"}
          className="gap-2"
        >
          {existingAlert ? (
            <>
              <Bell className="h-4 w-4" />
              Alert Active
            </>
          ) : (
            <>
              <Bell className="h-4 w-4" />
              Price Alert
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            {existingAlert ? "Manage Price Alert" : "Set Price Alert"}
          </DialogTitle>
          <DialogDescription>
            {existingAlert
              ? `You're tracking "${productName}" for price drops.`
              : `Get notified when the price of "${productName}" drops.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Current lowest price</Label>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(currentLowestPrice)}
            </p>
          </div>

          {existingAlert && (
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <Label className="text-muted-foreground text-sm">Price when you subscribed</Label>
              <p className="font-medium">{formatPrice(existingAlert.original_price)}</p>
              {existingAlert.original_price > currentLowestPrice && (
                <p className="text-sm text-green-600 font-medium">
                  🎉 Price dropped {formatPrice(existingAlert.original_price - currentLowestPrice)}!
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="target-price">
              Target price (optional)
            </Label>
            <Input
              id="target-price"
              type="number"
              placeholder="Alert me when price drops below..."
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to get notified on any price drop
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {existingAlert ? (
            <>
              <Button
                variant="destructive"
                onClick={handleRemoveAlert}
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <BellOff className="h-4 w-4" />
                )}
                Remove Alert
              </Button>
              <Button onClick={handleUpdateAlert} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Update Alert
              </Button>
            </>
          ) : (
            <Button onClick={handleCreateAlert} disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Create Alert
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
