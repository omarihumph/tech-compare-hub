import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, Upload, LogOut, Clock, AlertCircle } from "lucide-react";

interface VendorProfile {
  id: string;
  company_name: string;
  description: string | null;
  website: string | null;
  whatsapp: string | null;
  address: string | null;
  is_approved: boolean;
}

interface Product {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  category: string;
  price: number;
  description: string | null;
  specs: any;
  status: string;
  image_url: string | null;
}

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [productForm, setProductForm] = useState({
    name: "",
    brand: "",
    model: "",
    category: "laptop",
    price: "",
    description: "",
    specs: {} as Record<string, string>,
    image: null as File | null,
  });

  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  useEffect(() => {
    checkVendorAccess();
  }, []);

  const checkVendorAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      console.log("Checking vendor access for user:", user.id);

      // Check if user has vendor role - use maybeSingle to avoid error on no rows
      const { data: roles, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "vendor")
        .maybeSingle();

      console.log("Role check result:", { roles, roleError });

      if (roleError) {
        console.error("Error fetching role:", roleError);
        toast({
          title: "Error",
          description: "Failed to verify access permissions",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      if (!roles) {
        console.log("No vendor role found for user");
        toast({
          title: "Access Denied",
          description: "You need vendor role to access this page",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      console.log("Vendor access granted, loading data...");
      await loadVendorData(user.id);
    } catch (error) {
      console.error("Error checking access:", error);
      navigate("/");
    }
  };

  const loadVendorData = async (userId: string) => {
    try {
      // Load vendor profile
      const { data: profile, error: profileError } = await supabase
        .from("vendor_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (profileError) {
        console.error("Error loading vendor profile:", profileError);
      }

      console.log("Loaded vendor profile:", profile);
      setVendorProfile(profile);

      if (profile) {
        // Load vendor's products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("vendor_id", profile.id)
          .order("created_at", { ascending: false });

        if (productsError) {
          console.error("Error loading products:", productsError);
        }

        console.log("Loaded products:", productsData);
        setProducts(productsData || []);
      }
    } catch (error) {
      console.error("Error loading vendor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmitProduct = async () => {
    if (!vendorProfile) {
      toast({
        title: "Error",
        description: "No vendor profile found",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      let imageUrl = editingProduct?.image_url || null;

      if (productForm.image) {
        imageUrl = await handleImageUpload(productForm.image);
      }

      const productData = {
        name: productForm.name,
        brand: productForm.brand || null,
        model: productForm.model || null,
        category: productForm.category as any,
        price: parseFloat(productForm.price),
        description: productForm.description || null,
        specs: productForm.specs,
        image_url: imageUrl,
        vendor_id: vendorProfile.id,
        status: "pending" as any,
      };

      console.log("Submitting product data:", productData);

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);
        
        if (error) {
          console.error("Update error:", error);
          toast({
            title: "Update Failed",
            description: error.message || "Failed to update product",
            variant: "destructive",
          });
          return;
        }
        toast({ title: "Product updated successfully" });
      } else {
        const { data, error } = await supabase.from("products").insert([productData]).select();
        
        if (error) {
          console.error("Insert error:", error);
          toast({
            title: "Insert Failed",
            description: error.message || "Failed to add product",
            variant: "destructive",
          });
          return;
        }
        console.log("Product inserted:", data);
        toast({ title: "Product added successfully" });
      }

      setShowProductDialog(false);
      resetForm();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await loadVendorData(user.id);
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", productId);
      
      if (error) {
        console.error("Delete error:", error);
        toast({
          title: "Delete Failed",
          description: error.message || "Failed to delete product",
          variant: "destructive",
        });
        return;
      }
      
      toast({ title: "Product deleted successfully" });
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await loadVendorData(user.id);
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      brand: product.brand || "",
      model: product.model || "",
      category: product.category,
      price: product.price.toString(),
      description: product.description || "",
      specs: product.specs || {},
      image: null,
    });
    setShowProductDialog(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      brand: "",
      model: "",
      category: "laptop",
      price: "",
      description: "",
      specs: {},
      image: null,
    });
    setSpecKey("");
    setSpecValue("");
  };

  const addSpec = () => {
    if (specKey && specValue) {
      setProductForm({
        ...productForm,
        specs: { ...productForm.specs, [specKey]: specValue },
      });
      setSpecKey("");
      setSpecValue("");
    }
  };

  const removeSpec = (key: string) => {
    const newSpecs = { ...productForm.specs };
    delete newSpecs[key];
    setProductForm({ ...productForm, specs: newSpecs });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vendorProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>No Vendor Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You need to create a vendor profile first. Please contact admin.
            </p>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Vendor Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">{vendorProfile.company_name}</p>
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

        {!vendorProfile.is_approved && (
          <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
            <Clock className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-900 dark:text-amber-100 font-semibold">
              Account Pending Approval
            </AlertTitle>
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              Your vendor account is currently under review by our admin team. You can add products now, 
              but they won't be visible to customers until your account is approved. We'll notify you once approved.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Products</h2>
          <Dialog open={showProductDialog} onOpenChange={(open) => {
            setShowProductDialog(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={productForm.model}
                      onChange={(e) => setProductForm({ ...productForm, model: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={productForm.category} onValueChange={(value) => setProductForm({ ...productForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="laptop">Laptop</SelectItem>
                        <SelectItem value="desktop">Desktop</SelectItem>
                        <SelectItem value="smartphone">Smartphone</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="accessory">Accessory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price">Price (ETB) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Product Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.files?.[0] || null })}
                  />
                </div>

                <div>
                  <Label>Specifications</Label>
                  <div className="space-y-2">
                    {Object.entries(productForm.specs).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 p-2 bg-secondary rounded">
                        <span className="font-medium">{key}:</span>
                        <span className="flex-1">{value}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeSpec(key)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Spec name (e.g., RAM)"
                      value={specKey}
                      onChange={(e) => setSpecKey(e.target.value)}
                    />
                    <Input
                      placeholder="Value (e.g., 16GB)"
                      value={specValue}
                      onChange={(e) => setSpecValue(e.target.value)}
                    />
                    <Button onClick={addSpec} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleSubmitProduct}
                  disabled={uploading || !productForm.name || !productForm.price}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>{editingProduct ? "Update Product" : "Add Product"}</>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <CardTitle className="flex items-start justify-between">
                  <span>{product.name}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    product.status === "approved"
                      ? "bg-green-500/20 text-green-700 dark:text-green-300"
                      : product.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
                      : "bg-red-500/20 text-red-700 dark:text-red-300"
                  }`}>
                    {product.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">
                  ETB {product.price.toLocaleString()}
                </p>
                {product.brand && (
                  <p className="text-sm text-muted-foreground">
                    {product.brand} {product.model}
                  </p>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No products yet</p>
              <Button onClick={() => setShowProductDialog(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add Your First Product
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
