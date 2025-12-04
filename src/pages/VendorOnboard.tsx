import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Store, ArrowRight } from "lucide-react";

const VendorOnboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    checkAuthAndVendorStatus();
  }, []);

  const checkAuthAndVendorStatus = async () => {
    try {
      // Check if user is authenticated
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to become a vendor",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      setUser(authUser);

      // Check if user is already a vendor
      const { data: vendorRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authUser.id)
        .eq("role", "vendor")
        .maybeSingle();

      if (vendorRole) {
        toast({
          title: "Already a Vendor",
          description: "Redirecting to your dashboard...",
        });
        navigate("/vendor");
        return;
      }

      // Check if vendor profile already exists (shouldn't happen but just in case)
      const { data: vendorProfile } = await supabase
        .from("vendor_profiles")
        .select("id")
        .eq("user_id", authUser.id)
        .maybeSingle();

      if (vendorProfile) {
        toast({
          title: "Already a Vendor",
          description: "Redirecting to your dashboard...",
        });
        navigate("/vendor");
        return;
      }

      // Get user profile for pre-filling
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", authUser.id)
        .single();

      if (profile?.full_name) {
        setCompanyName(profile.full_name);
      }

    } catch (error) {
      console.error("Error checking status:", error);
      toast({
        title: "Error",
        description: "Failed to verify your status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Error",
        description: "User session not found",
        variant: "destructive",
      });
      return;
    }

    if (!companyName.trim() || !whatsapp.trim() || !address.trim()) {
      toast({
        title: "Required Fields",
        description: "Please fill in company name, WhatsApp number, and location",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Step 1: Insert vendor role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: user.id,
          role: "vendor",
        });

      if (roleError) {
        console.error("Role creation error:", roleError);
        throw new Error("Failed to assign vendor role");
      }

      // Step 2: Create vendor profile
      const { error: profileError } = await supabase
        .from("vendor_profiles")
        .insert({
          user_id: user.id,
          company_name: companyName.trim(),
          description: description.trim() || null,
          whatsapp: whatsapp.trim(),
          address: address.trim(),
          website: website.trim() || null,
          is_approved: false,
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw new Error("Failed to create vendor profile");
      }

      toast({
        title: "Success!",
        description: "Your vendor account has been created. Redirecting to dashboard...",
      });

      // Redirect to vendor dashboard
      setTimeout(() => {
        navigate("/vendor");
      }, 1500);

    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete vendor registration",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Store className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Become a Vendor</h1>
          <p className="text-muted-foreground text-lg">
            Start selling your tech products on TechPrice
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Registration</CardTitle>
            <CardDescription>
              Fill in your business details below. Your account will be reviewed by our admin team before approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="companyName">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your company name"
                  required
                  disabled={submitting}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about your business and what products you'll be selling..."
                  rows={4}
                  disabled={submitting}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  This will be displayed on your vendor profile
                </p>
              </div>

              <div>
                <Label htmlFor="whatsapp">
                  WhatsApp Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="whatsapp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+254712345678"
                  required
                  disabled={submitting}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="address">
                  Business Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g., Westlands, Nairobi, Kenya"
                  required
                  disabled={submitting}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  disabled={submitting}
                  className="mt-2"
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">What happens next?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Your vendor account will be created instantly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>You can start adding products immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Admin will review and approve your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Once approved, your products will be visible to customers</span>
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={submitting || !companyName.trim() || !whatsapp.trim() || !address.trim()}
                className="w-full"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Vendor Account...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/")}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorOnboard;
