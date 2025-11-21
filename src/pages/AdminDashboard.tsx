import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  LogOut, 
  Package, 
  Users, 
  TrendingUp, 
  Clock,
  BarChart3,
  Home
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
  created_at: string;
}

interface VendorWithProfile extends Product {
  vendor_profiles: VendorProfile;
}

interface CategoryData {
  category: string;
  count: number;
}

interface StatusData {
  name: string;
  value: number;
}

const COLORS = ['hsl(220, 70%, 45%)', 'hsl(25, 100%, 55%)', 'hsl(180, 60%, 50%)', 'hsl(142, 70%, 50%)', 'hsl(38, 92%, 55%)'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [pendingVendors, setPendingVendors] = useState<VendorProfile[]>([]);
  const [allVendors, setAllVendors] = useState<VendorProfile[]>([]);
  const [pendingProducts, setPendingProducts] = useState<VendorWithProfile[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [stats, setStats] = useState({
    totalVendors: 0,
    totalProducts: 0,
    pendingApprovals: 0,
    approvedProducts: 0,
    rejectedProducts: 0,
    approvedVendors: 0,
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
      const { data: vendors } = await supabase
        .from("vendor_profiles")
        .select("*")
        .eq("is_approved", false)
        .order("created_at", { ascending: false });

      setPendingVendors(vendors || []);

      const { data: allVendorsData } = await supabase
        .from("vendor_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      setAllVendors(allVendorsData || []);

      const { data: products } = await supabase
        .from("products")
        .select("*, vendor_profiles(*)")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      setPendingProducts(products || []);

      const { data: allProducts } = await supabase
        .from("products")
        .select("category, status");

      const categoryMap = new Map<string, number>();
      const statusMap = { approved: 0, pending: 0, rejected: 0 };

      allProducts?.forEach((product) => {
        categoryMap.set(product.category, (categoryMap.get(product.category) || 0) + 1);
        if (product.status === 'approved') statusMap.approved++;
        if (product.status === 'pending') statusMap.pending++;
        if (product.status === 'rejected') statusMap.rejected++;
      });

      const categoryChartData = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        count,
      }));

      setCategoryData(categoryChartData);
      setStatusData([
        { name: 'Approved', value: statusMap.approved },
        { name: 'Pending', value: statusMap.pending },
        { name: 'Rejected', value: statusMap.rejected },
      ]);

      const { count: vendorCount } = await supabase
        .from("vendor_profiles")
        .select("*", { count: "exact", head: true });

      const { count: productCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      const { count: approvedVendorCount } = await supabase
        .from("vendor_profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_approved", true);

      const { count: approvedProductCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");

      const { count: rejectedProductCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("status", "rejected");

      setStats({
        totalVendors: vendorCount || 0,
        totalProducts: productCount || 0,
        pendingApprovals: (vendors?.length || 0) + (products?.length || 0),
        approvedProducts: approvedProductCount || 0,
        rejectedProducts: rejectedProductCount || 0,
        approvedVendors: approvedVendorCount || 0,
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
      toast({ title: "Error approving vendor", variant: "destructive" });
    }
  };

  const handleRejectVendor = async (vendorId: string) => {
    try {
      await supabase
        .from("vendor_profiles")
        .delete()
        .eq("id", vendorId);

      toast({ title: "Vendor rejected and removed" });
      await loadAdminData();
    } catch (error) {
      toast({ title: "Error rejecting vendor", variant: "destructive" });
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
      toast({ title: "Error approving product", variant: "destructive" });
    }
  };

  const handleRejectProduct = async (productId: string) => {
    try {
      await supabase
        .from("products")
        .update({ status: "rejected" })
        .eq("id", productId);

      toast({ title: "Product rejected" });
      await loadAdminData();
    } catch (error) {
      toast({ title: "Error rejecting product", variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">Manage vendors, products, and platform analytics</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
              <Button variant="destructive" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Vendors</CardTitle>
              <Users className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalVendors}</div>
              <p className="text-xs text-success mt-1">{stats.approvedVendors} approved</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 hover:border-accent/40 transition-all hover:shadow-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              <Package className="w-5 h-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalProducts}</div>
              <p className="text-xs text-success mt-1">{stats.approvedProducts} approved</p>
            </CardContent>
          </Card>

          <Card className="border-warning/20 hover:border-warning/40 transition-all hover:shadow-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
              <Clock className="w-5 h-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground mt-1">Requires action</p>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 hover:border-destructive/40 transition-all hover:shadow-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejected Products</CardTitle>
              <XCircle className="w-5 h-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.rejectedProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">Quality control</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Products by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="category" className="text-muted-foreground text-xs" />
                  <YAxis className="text-muted-foreground text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(220, 70%, 45%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Product Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="hsl(220, 70%, 45%)"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50">
          <Tabs defaultValue="all-vendors" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all-vendors" className="gap-2">
                  <Users className="w-4 h-4" />
                  All Vendors ({allVendors.length})
                </TabsTrigger>
                <TabsTrigger value="vendors" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Pending Vendors ({pendingVendors.length})
                </TabsTrigger>
                <TabsTrigger value="products" className="gap-2">
                  <Package className="w-4 h-4" />
                  Pending Products ({pendingProducts.length})
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="all-vendors" className="mt-4">
                {allVendors.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No vendors registered yet</p>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-semibold text-sm">Company</th>
                          <th className="text-left p-4 font-semibold text-sm">Status</th>
                          <th className="text-left p-4 font-semibold text-sm">Contact</th>
                          <th className="text-left p-4 font-semibold text-sm">Joined</th>
                          <th className="text-right p-4 font-semibold text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {allVendors.map((vendor) => (
                          <tr key={vendor.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                              <div>
                                <p className="font-medium text-foreground">{vendor.company_name}</p>
                                {vendor.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-1">{vendor.description}</p>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              {vendor.is_approved ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                                  <CheckCircle className="w-3 h-3" />
                                  Approved
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                                  <Clock className="w-3 h-3" />
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="text-sm space-y-1">
                                {vendor.website && (
                                  <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block">
                                    Website
                                  </a>
                                )}
                                {vendor.whatsapp && (
                                  <p className="text-muted-foreground">{vendor.whatsapp}</p>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {new Date(vendor.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2 justify-end">
                                {!vendor.is_approved && (
                                  <Button onClick={() => handleApproveVendor(vendor.id)} size="sm" variant="outline" className="gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Approve
                                  </Button>
                                )}
                                <Button 
                                  onClick={() => window.open('/vendor', '_blank')} 
                                  size="sm" 
                                  variant="secondary"
                                  className="gap-1"
                                >
                                  View Panel
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="vendors" className="space-y-4 mt-4">
                {pendingVendors.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                    <p className="text-muted-foreground">No pending vendor approvals</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingVendors.map((vendor) => (
                      <Card key={vendor.id} className="border-warning/20 bg-card/50">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-foreground">{vendor.company_name}</h3>
                              {vendor.description && (
                                <p className="text-muted-foreground mt-2">{vendor.description}</p>
                              )}
                              <div className="flex gap-4 mt-4 text-sm">
                                {vendor.website && (
                                  <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    Website
                                  </a>
                                )}
                                {vendor.whatsapp && (
                                  <span className="text-muted-foreground">WhatsApp: {vendor.whatsapp}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button onClick={() => handleApproveVendor(vendor.id)} size="sm" className="gap-2 bg-success hover:bg-success/90">
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </Button>
                              <Button onClick={() => handleRejectVendor(vendor.id)} variant="destructive" size="sm" className="gap-2">
                                <XCircle className="w-4 h-4" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="products" className="space-y-4 mt-4">
                {pendingProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                    <p className="text-muted-foreground">No pending product approvals</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingProducts.map((product) => (
                      <Card key={product.id} className="border-warning/20 bg-card/50">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            {product.image_url && (
                              <img src={product.image_url} alt={product.name} className="w-24 h-24 object-cover rounded-lg border border-border" />
                            )}
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                              {product.brand && <p className="text-sm text-muted-foreground">Brand: {product.brand}</p>}
                              {product.model && <p className="text-sm text-muted-foreground">Model: {product.model}</p>}
                              <div className="flex gap-4 mt-2">
                                <span className="text-sm font-medium text-primary">${product.price.toLocaleString()}</span>
                                <span className="text-sm text-muted-foreground capitalize">{product.category}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">Vendor: {product.vendor_profiles.company_name}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={() => handleApproveProduct(product.id)} size="sm" className="gap-2 bg-success hover:bg-success/90">
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </Button>
                              <Button onClick={() => handleRejectProduct(product.id)} variant="destructive" size="sm" className="gap-2">
                                <XCircle className="w-4 h-4" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
