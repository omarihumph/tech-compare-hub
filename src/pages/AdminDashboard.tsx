import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, LogOut, Package, Users, TrendingUp } from "lucide-react";

interface VendorProfile {
  id: string;
  company_name: string;
  description: string | null;
  website: string | null;
  whatsapp: string | null;
  is_approved: boolean;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  category: string;
  price: number;
  status: string;
  image_url: string | null;
  vendor_id: string;
}

interface VendorWithProfile extends Product {
  vendor_profiles: VendorProfile;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [pendingVendors, setPendingVendors] = useState<VendorProfile[]>([]);
  const [pendingProducts, setPendingProducts] = useState<VendorWithProfile[]>([]);
  const [stats, setStats] = useState({
    totalVendors: 0,
    totalProducts: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if user has admin role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (!roles) {
        toast({
          title: "Access Denied",
          description: "You need admin role to access this page",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      await loadAdminData();
    } catch (error) {
      console.error("Error checking access:", error);
      navigate("/");
    }
  };

  const loadAdminData = async () => {
    try {
      // Load pending vendors
      const { data: vendors } = await supabase
        .from("vendor_profiles")
        .select("*")
        .eq("is_approved", false)
        .order("created_at", { ascending: false });

      setPendingVendors(vendors || []);

      // Load pending products
      const { data: products } = await supabase
        .from("products")
        .select("*, vendor_profiles(*)")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      setPendingProducts(products || []);

      // Load stats
      const { count: vendorCount } = await supabase
        .from("vendor_profiles")
        .select("*", { count: "exact", head: true });

      const { count: productCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      setStats({
        totalVendors: vendorCount || 0,
        totalProducts: productCount || 0,
        pendingApprovals: (vendors?.length || 0) + (products?.length || 0),
      });
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVendor = async (vendorId: string) => {
    try {
      await supabase
        .from("vendor_profiles")
        .update({ is_approved: true })
        .eq("id", vendorId);

      toast({ title: "Vendor approved successfully" });
      await loadAdminData();
    } catch (error) {
      console.error("Error approving vendor:", error);
      toast({
        title: "Error",
        description: "Failed to approve vendor",
        variant: "destructive",
      });
    }
  };

  const handleRejectVendor = async (vendorId: string) => {
    if (!confirm("Are you sure you want to reject this vendor?")) return;

    try {
      await supabase.from("vendor_profiles").delete().eq("id", vendorId);
      toast({ title: "Vendor rejected" });
      await loadAdminData();
    } catch (error) {
      console.error("Error rejecting vendor:", error);
      toast({
        title: "Error",
        description: "Failed to reject vendor",
        variant: "destructive",
      });
    }
  };

  const handleApproveProduct = async (productId: string) => {
    try {
      await supabase
        .from("products")
        .update({ status: "approved" })
        .eq("id", productId);

      toast({ title: "Product approved successfully" });
      await loadAdminData();
    } catch (error) {
      console.error("Error approving product:", error);
      toast({
        title: "Error",
        description: "Failed to approve product",
        variant: "destructive",
      });
    }
  };

  const handleRejectProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to reject this product?")) return;

    try {
      await supabase
        .from("products")
        .update({ status: "rejected" })
        .eq("id", productId);

      toast({ title: "Product rejected" });
      await loadAdminData();
    } catch (error) {
      console.error("Error rejecting product:", error);
      toast({
        title: "Error",
        description: "Failed to reject product",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Manage vendors and products</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/")} variant="outline">
              Home
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Vendors
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalVendors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Approvals
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.pendingApprovals}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Vendors and Products */}
        <Tabs defaultValue="vendors" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="vendors">
              Pending Vendors ({pendingVendors.length})
            </TabsTrigger>
            <TabsTrigger value="products">
              Pending Products ({pendingProducts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vendors" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingVendors.map((vendor) => (
                <Card key={vendor.id}>
                  <CardHeader>
                    <CardTitle>{vendor.company_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {vendor.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {vendor.description}
                        </p>
                      )}
                      {vendor.website && (
                        <p className="text-sm">
                          <span className="font-medium">Website:</span>{" "}
                          <a
                            href={vendor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {vendor.website}
                          </a>
                        </p>
                      )}
                      {vendor.whatsapp && (
                        <p className="text-sm">
                          <span className="font-medium">WhatsApp:</span> {vendor.whatsapp}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Registered: {new Date(vendor.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveVendor(vendor.id)}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectVendor(vendor.id)}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {pendingVendors.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground">No pending vendors</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingProducts.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-2xl font-bold text-primary">
                        ETB {product.price.toLocaleString()}
                      </p>
                      {product.brand && (
                        <p className="text-sm text-muted-foreground">
                          {product.brand} {product.model}
                        </p>
                      )}
                      <p className="text-sm">
                        <span className="font-medium">Category:</span>{" "}
                        <span className="capitalize">{product.category}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Vendor:</span>{" "}
                        {product.vendor_profiles.company_name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveProduct(product.id)}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectProduct(product.id)}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {pendingProducts.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground">No pending products</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
