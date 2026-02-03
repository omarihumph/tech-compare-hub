import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, BellOff, ExternalLink, Trash2, TrendingDown, Package } from "lucide-react";
import { toast } from "sonner";

interface PriceAlert {
  id: string;
  catalog_id: string;
  original_price: number;
  target_price: number | null;
  is_active: boolean;
  notified_at: string | null;
  created_at: string;
  catalog?: {
    name: string;
    brand: string | null;
    image_url: string | null;
    category: string;
  };
  current_lowest_price?: number;
}

const MyAlerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchAlerts();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
  };

  const fetchAlerts = async () => {
    try {
      // Fetch alerts with catalog info
      const { data: alertsData, error: alertsError } = await supabase
        .from("price_alerts")
        .select(`
          id,
          catalog_id,
          original_price,
          target_price,
          is_active,
          notified_at,
          created_at
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (alertsError) throw alertsError;

      // Fetch catalog info for each alert
      const catalogIds = alertsData?.map(a => a.catalog_id) || [];
      const { data: catalogData } = await supabase
        .from("product_catalog")
        .select("id, name, brand, image_url, category")
        .in("id", catalogIds);

      // Fetch current lowest prices from products
      const { data: pricesData } = await supabase
        .from("products")
        .select("catalog_id, price")
        .in("catalog_id", catalogIds)
        .eq("status", "approved");

      // Calculate lowest prices per catalog
      const lowestPrices: Record<string, number> = {};
      pricesData?.forEach(p => {
        if (!lowestPrices[p.catalog_id] || p.price < lowestPrices[p.catalog_id]) {
          lowestPrices[p.catalog_id] = p.price;
        }
      });

      // Combine data
      const enrichedAlerts = alertsData?.map(alert => ({
        ...alert,
        catalog: catalogData?.find(c => c.id === alert.catalog_id),
        current_lowest_price: lowestPrices[alert.catalog_id],
      })) || [];

      setAlerts(enrichedAlerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      toast.error("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("price_alerts")
        .update({ is_active: false })
        .eq("id", alertId);

      if (error) throw error;

      setAlerts(prev => prev.map(a => 
        a.id === alertId ? { ...a, is_active: false } : a
      ));
      toast.success("Alert removed");
    } catch (error) {
      console.error("Error removing alert:", error);
      toast.error("Failed to remove alert");
    }
  };

  const handleReactivateAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("price_alerts")
        .update({ is_active: true, notified_at: null })
        .eq("id", alertId);

      if (error) throw error;

      setAlerts(prev => prev.map(a => 
        a.id === alertId ? { ...a, is_active: true, notified_at: null } : a
      ));
      toast.success("Alert reactivated");
    } catch (error) {
      console.error("Error reactivating alert:", error);
      toast.error("Failed to reactivate alert");
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("price_alerts")
        .delete()
        .eq("id", alertId);

      if (error) throw error;

      setAlerts(prev => prev.filter(a => a.id !== alertId));
      toast.success("Alert deleted permanently");
    } catch (error) {
      console.error("Error deleting alert:", error);
      toast.error("Failed to delete alert");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const activeAlerts = alerts.filter(a => a.is_active);
  const inactiveAlerts = alerts.filter(a => !a.is_active);

  return (
    <div className="min-h-screen bg-background">
      <NavBar showBackButton backTo="/browse" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Bell className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">My Price Alerts</h1>
              <p className="text-muted-foreground">
                Track prices and get notified when they drop
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="h-20 w-20 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Price Alerts Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start tracking products to get notified when prices drop!
                </p>
                <Button onClick={() => navigate("/browse")}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {activeAlerts.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Active Alerts ({activeAlerts.length})
                  </h2>
                  <div className="space-y-4">
                    {activeAlerts.map(alert => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        onRemove={handleRemoveAlert}
                        onDelete={handleDeleteAlert}
                        onNavigate={() => navigate(`/product/${alert.catalog_id}`)}
                        formatPrice={formatPrice}
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                </section>
              )}

              {inactiveAlerts.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
                    <BellOff className="h-5 w-5" />
                    Inactive Alerts ({inactiveAlerts.length})
                  </h2>
                  <div className="space-y-4 opacity-75">
                    {inactiveAlerts.map(alert => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        onReactivate={handleReactivateAlert}
                        onDelete={handleDeleteAlert}
                        onNavigate={() => navigate(`/product/${alert.catalog_id}`)}
                        formatPrice={formatPrice}
                        formatDate={formatDate}
                        inactive
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

interface AlertCardProps {
  alert: PriceAlert;
  onRemove?: (id: string) => void;
  onReactivate?: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate: () => void;
  formatPrice: (price: number) => string;
  formatDate: (date: string) => string;
  inactive?: boolean;
}

const AlertCard = ({
  alert,
  onRemove,
  onReactivate,
  onDelete,
  onNavigate,
  formatPrice,
  formatDate,
  inactive = false,
}: AlertCardProps) => {
  const priceDropped = alert.current_lowest_price && 
    alert.current_lowest_price < alert.original_price;
  const priceDrop = priceDropped 
    ? alert.original_price - alert.current_lowest_price! 
    : 0;
  const targetReached = alert.target_price && 
    alert.current_lowest_price && 
    alert.current_lowest_price <= alert.target_price;
  const hasNotification = alert.notified_at && !inactive;

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${
      hasNotification ? "ring-2 ring-primary/50 bg-primary/5" : ""
    }`}>
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Product Image */}
          <div 
            className="sm:w-32 h-32 sm:h-auto bg-muted cursor-pointer flex-shrink-0"
            onClick={onNavigate}
          >
            {alert.catalog?.image_url ? (
              <img
                src={alert.catalog.image_url}
                alt={alert.catalog.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-10 w-10 text-muted-foreground/50" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Title and badges */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 
                    className="font-semibold truncate cursor-pointer hover:text-primary transition-colors"
                    onClick={onNavigate}
                  >
                    {alert.catalog?.name || "Unknown Product"}
                  </h3>
                  {hasNotification && (
                    <Badge className="bg-primary text-primary-foreground">
                      Price Dropped!
                    </Badge>
                  )}
                  {targetReached && (
                    <Badge variant="secondary">
                      Target Reached
                    </Badge>
                  )}
                </div>

                {/* Brand and category */}
                <p className="text-sm text-muted-foreground mb-3">
                  {alert.catalog?.brand && `${alert.catalog.brand} • `}
                  {alert.catalog?.category}
                </p>

                {/* Price info */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Original: </span>
                    <span className="font-medium">{formatPrice(alert.original_price)}</span>
                  </div>
                  {alert.current_lowest_price && (
                    <div>
                      <span className="text-muted-foreground">Current: </span>
                    <span className={`font-medium ${priceDropped ? "text-primary" : ""}`}>
                        {formatPrice(alert.current_lowest_price)}
                      </span>
                      {priceDropped && (
                        <span className="text-primary ml-1 inline-flex items-center gap-0.5">
                          <TrendingDown className="h-3 w-3" />
                          {formatPrice(priceDrop)}
                        </span>
                      )}
                    </div>
                  )}
                  {alert.target_price && (
                    <div>
                      <span className="text-muted-foreground">Target: </span>
                      <span className="font-medium">{formatPrice(alert.target_price)}</span>
                    </div>
                  )}
                </div>

                {/* Date */}
                <p className="text-xs text-muted-foreground mt-2">
                  Alert set on {formatDate(alert.created_at)}
                  {alert.notified_at && ` • Notified on ${formatDate(alert.notified_at)}`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNavigate}
                  className="gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sm:hidden lg:inline">View</span>
                </Button>
                {inactive ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onReactivate?.(alert.id)}
                    className="gap-1"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="sm:hidden lg:inline">Reactivate</span>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove?.(alert.id)}
                    className="gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <BellOff className="h-4 w-4" />
                    <span className="sm:hidden lg:inline">Pause</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(alert.id)}
                  className="gap-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sm:hidden lg:inline">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyAlerts;
