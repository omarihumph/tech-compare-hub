-- Create product_catalog table for base products (what the product IS)
CREATE TABLE public.product_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  category product_category NOT NULL,
  description TEXT,
  specs JSONB DEFAULT '{}'::jsonb,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on product_catalog
ALTER TABLE public.product_catalog ENABLE ROW LEVEL SECURITY;

-- Anyone can view product catalog
CREATE POLICY "public_view_catalog" ON public.product_catalog
  FOR SELECT USING (true);

-- Admins can manage catalog
CREATE POLICY "admin_manage_catalog" ON public.product_catalog
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add catalog_id to products table (products become vendor listings)
ALTER TABLE public.products ADD COLUMN catalog_id UUID REFERENCES public.product_catalog(id);

-- Create index for faster catalog lookups
CREATE INDEX idx_products_catalog_id ON public.products(catalog_id);
CREATE INDEX idx_product_catalog_brand ON public.product_catalog(brand);
CREATE INDEX idx_product_catalog_category ON public.product_catalog(category);