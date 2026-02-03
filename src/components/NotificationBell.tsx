import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, TrendingDown, ExternalLink, Package } from "lucide-react";

interface Notification {
  id: string;
  catalog_id: string;
  original_price: number;
  current_price: number;
  notified_at: string;
  catalog_name: string;
  catalog_image: string | null;
}

export const NotificationBell = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Subscribe to real-time updates
      const channel = supabase
        .channel("price_alerts_changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "price_alerts",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setNotifications([]);
      setLoading(false);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      // Fetch alerts that have been notified (price dropped)
      const { data: alertsData, error: alertsError } = await supabase
        .from("price_alerts")
        .select("id, catalog_id, original_price, notified_at")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .not("notified_at", "is", null)
        .order("notified_at", { ascending: false })
        .limit(10);

      if (alertsError) throw alertsError;

      if (!alertsData || alertsData.length === 0) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      // Fetch catalog info
      const catalogIds = alertsData.map(a => a.catalog_id);
      const { data: catalogData } = await supabase
        .from("product_catalog")
        .select("id, name, image_url")
        .in("id", catalogIds);

      // Fetch current lowest prices
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

      // Build notifications
      const notifs: Notification[] = alertsData
        .map(alert => {
          const catalog = catalogData?.find(c => c.id === alert.catalog_id);
          return {
            id: alert.id,
            catalog_id: alert.catalog_id,
            original_price: alert.original_price,
            current_price: lowestPrices[alert.catalog_id] || alert.original_price,
            notified_at: alert.notified_at!,
            catalog_name: catalog?.name || "Unknown Product",
            catalog_image: catalog?.image_url || null,
          };
        })
        .filter(n => n.current_price < n.original_price);

      setNotifications(notifs);
    } catch (error) {
      console.error("Error fetching notifications:", error);
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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-KE", { day: "numeric", month: "short" });
  };

  if (!user) return null;

  const unreadCount = notifications.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2">
          <h4 className="font-semibold">Price Drop Alerts</h4>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <DropdownMenuSeparator />
        
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              No price drops yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              We'll notify you when tracked prices drop
            </p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className="p-3 cursor-pointer"
                onClick={() => navigate(`/product/${notif.catalog_id}`)}
              >
                <div className="flex gap-3 w-full">
                  <div className="h-12 w-12 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                    {notif.catalog_image ? (
                      <img
                        src={notif.catalog_image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {notif.catalog_name}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-primary">
                      <TrendingDown className="h-3 w-3" />
                      <span className="line-through text-muted-foreground text-xs">
                        {formatPrice(notif.original_price)}
                      </span>
                      <span className="font-medium">
                        {formatPrice(notif.current_price)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatTimeAgo(notif.notified_at)}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="p-3 cursor-pointer justify-center text-primary"
          onClick={() => navigate("/my-alerts")}
        >
          View All Alerts
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
