-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('customer', 'vendor', 'admin');

-- Create enum for product status
CREATE TYPE public.product_status AS ENUM ('pending', 'approved', 'rejected');

-- Create enum for product category
CREATE TYPE public.product_category AS ENUM (
  'laptops',
  'desktops',
  'monitors',
  'smartphones',
  'tablets',
  'accessories',
  'components',
  'networking',
  'storage',
  'audio',
  'gaming',
  'other'
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create vendor_profiles table
CREATE TABLE public.vendor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  whatsapp TEXT,
  address TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category product_category NOT NULL,
  brand TEXT,
  model TEXT,
  image_url TEXT,
  status product_status NOT NULL DEFAULT 'pending',
  specs JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create product_images table for multiple images
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_products_vendor ON public.products(vendor_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_vendor_profiles_user ON public.vendor_profiles(user_id);
CREATE INDEX idx_product_images_product ON public.product_images(product_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Vendor profiles policies
CREATE POLICY "Anyone can view approved vendors"
  ON public.vendor_profiles FOR SELECT
  USING (is_approved = true OR user_id = auth.uid());

CREATE POLICY "Vendors can insert own profile"
  ON public.vendor_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Vendors can update own profile"
  ON public.vendor_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Products policies
CREATE POLICY "Anyone can view approved products"
  ON public.products FOR SELECT
  USING (status = 'approved' OR vendor_id IN (
    SELECT id FROM public.vendor_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Vendors can insert own products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (vendor_id IN (
    SELECT id FROM public.vendor_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Vendors can update own products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (vendor_id IN (
    SELECT id FROM public.vendor_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Vendors can delete own products"
  ON public.products FOR DELETE
  TO authenticated
  USING (vendor_id IN (
    SELECT id FROM public.vendor_profiles WHERE user_id = auth.uid()
  ));

-- Product images policies
CREATE POLICY "Anyone can view product images"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "Vendors can manage own product images"
  ON public.product_images FOR ALL
  TO authenticated
  USING (product_id IN (
    SELECT p.id FROM public.products p
    JOIN public.vendor_profiles vp ON p.vendor_id = vp.id
    WHERE vp.user_id = auth.uid()
  ));

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_profiles_updated_at
  BEFORE UPDATE ON public.vendor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();