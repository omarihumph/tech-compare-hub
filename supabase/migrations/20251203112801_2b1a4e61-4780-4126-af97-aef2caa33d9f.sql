-- STEP 1: Create auto-assign vendor_id function and trigger
CREATE OR REPLACE FUNCTION public.assign_vendor_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.vendor_id IS NULL THEN
    SELECT id INTO NEW.vendor_id
    FROM public.vendor_profiles
    WHERE user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger (drop if exists first)
DROP TRIGGER IF EXISTS trg_assign_vendor_id ON public.products;
CREATE TRIGGER trg_assign_vendor_id
BEFORE INSERT ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.assign_vendor_id();

-- STEP 2: Drop existing policies on products
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view approved products" ON public.products;
DROP POLICY IF EXISTS "Approved vendors can insert own products" ON public.products;
DROP POLICY IF EXISTS "Vendors can delete own products" ON public.products;
DROP POLICY IF EXISTS "Vendors can update own products" ON public.products;

-- Drop existing policies on product_images
DROP POLICY IF EXISTS "Admins can manage all product images" ON public.product_images;
DROP POLICY IF EXISTS "Anyone can view product images" ON public.product_images;
DROP POLICY IF EXISTS "Vendors can delete own product images" ON public.product_images;
DROP POLICY IF EXISTS "Vendors can insert own product images" ON public.product_images;
DROP POLICY IF EXISTS "Vendors can update own product images" ON public.product_images;

-- Drop existing policies on vendor_profiles
DROP POLICY IF EXISTS "Admins can manage all vendor profiles" ON public.vendor_profiles;
DROP POLICY IF EXISTS "Anyone can view vendor profiles" ON public.vendor_profiles;
DROP POLICY IF EXISTS "Vendors can insert own profile" ON public.vendor_profiles;
DROP POLICY IF EXISTS "Vendors can update own profile" ON public.vendor_profiles;

-- STEP 3: NEW PRODUCT POLICIES

-- Admin full access
CREATE POLICY "admin_all_products"
ON public.products FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Vendor insert (only if approved)
CREATE POLICY "vendor_insert_products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.vendor_profiles v
    WHERE v.user_id = auth.uid() AND v.is_approved = true
  )
);

-- Vendor select own + approved products visible to all
CREATE POLICY "vendor_select_products"
ON public.products FOR SELECT
TO authenticated
USING (
  status = 'approved'::product_status
  OR EXISTS (
    SELECT 1 FROM public.vendor_profiles v
    WHERE v.user_id = auth.uid() AND v.id = products.vendor_id
  )
);

-- Public can view approved products (anon)
CREATE POLICY "public_view_approved_products"
ON public.products FOR SELECT
TO anon
USING (status = 'approved'::product_status);

-- Vendor update own
CREATE POLICY "vendor_update_products"
ON public.products FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.vendor_profiles v
    WHERE v.user_id = auth.uid() AND v.id = products.vendor_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.vendor_profiles v
    WHERE v.user_id = auth.uid() AND v.id = products.vendor_id
  )
);

-- Vendor delete own
CREATE POLICY "vendor_delete_products"
ON public.products FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.vendor_profiles v
    WHERE v.user_id = auth.uid() AND v.id = products.vendor_id
  )
);

-- STEP 4: NEW PRODUCT_IMAGES POLICIES

-- Admin full access
CREATE POLICY "admin_all_product_images"
ON public.product_images FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view images
CREATE POLICY "public_view_product_images"
ON public.product_images FOR SELECT
USING (true);

-- Vendor insert own product images
CREATE POLICY "vendor_insert_product_images"
ON public.product_images FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.vendor_profiles v ON v.id = p.vendor_id
    WHERE p.id = product_id AND v.user_id = auth.uid()
  )
);

-- Vendor update own product images
CREATE POLICY "vendor_update_product_images"
ON public.product_images FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.vendor_profiles v ON v.id = p.vendor_id
    WHERE p.id = product_images.product_id AND v.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.vendor_profiles v ON v.id = p.vendor_id
    WHERE p.id = product_images.product_id AND v.user_id = auth.uid()
  )
);

-- Vendor delete own product images
CREATE POLICY "vendor_delete_product_images"
ON public.product_images FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.vendor_profiles v ON v.id = p.vendor_id
    WHERE p.id = product_images.product_id AND v.user_id = auth.uid()
  )
);

-- STEP 5: NEW VENDOR_PROFILES POLICIES

-- Admin full access
CREATE POLICY "admin_all_vendor_profiles"
ON public.vendor_profiles FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view approved profiles + vendors see own
CREATE POLICY "view_vendor_profiles"
ON public.vendor_profiles FOR SELECT
USING (is_approved = true OR user_id = auth.uid());

-- Vendor insert own profile
CREATE POLICY "vendor_insert_profile"
ON public.vendor_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND has_role(auth.uid(), 'vendor'::app_role));

-- Vendor update own profile
CREATE POLICY "vendor_update_profile"
ON public.vendor_profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());