-- Drop existing policies to recreate them correctly
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view approved products" ON public.products;
DROP POLICY IF EXISTS "Vendors can delete own products" ON public.products;
DROP POLICY IF EXISTS "Vendors can insert own products" ON public.products;
DROP POLICY IF EXISTS "Vendors can update own products" ON public.products;

DROP POLICY IF EXISTS "Anyone can view product images" ON public.product_images;
DROP POLICY IF EXISTS "Vendors can manage own product images" ON public.product_images;

DROP POLICY IF EXISTS "Admins can manage all vendor profiles" ON public.vendor_profiles;
DROP POLICY IF EXISTS "Anyone can view approved vendors" ON public.vendor_profiles;
DROP POLICY IF EXISTS "Vendors can insert own profile" ON public.vendor_profiles;
DROP POLICY IF EXISTS "Vendors can update own profile" ON public.vendor_profiles;

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own vendor role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- ========================================
-- PROFILES POLICIES
-- ========================================

-- Everyone can view profiles (public information)
CREATE POLICY "Anyone can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- ========================================
-- USER_ROLES POLICIES
-- ========================================

-- Admins can manage all roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own vendor role
CREATE POLICY "Users can insert own vendor role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND role = 'vendor'::app_role
);

-- ========================================
-- VENDOR_PROFILES POLICIES
-- ========================================

-- Admins can manage all vendor profiles
CREATE POLICY "Admins can manage all vendor profiles"
ON public.vendor_profiles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view approved vendor profiles
CREATE POLICY "Anyone can view vendor profiles"
ON public.vendor_profiles
FOR SELECT
TO authenticated
USING (is_approved = true OR user_id = auth.uid());

-- Vendors can insert their own profile
CREATE POLICY "Vendors can insert own profile"
ON public.vendor_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND has_role(auth.uid(), 'vendor'::app_role)
);

-- Vendors can update their own profile (but not is_approved)
CREATE POLICY "Vendors can update own profile"
ON public.vendor_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ========================================
-- PRODUCTS POLICIES
-- ========================================

-- Admins can manage all products
CREATE POLICY "Admins can manage all products"
ON public.products
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view approved products
CREATE POLICY "Anyone can view approved products"
ON public.products
FOR SELECT
TO authenticated
USING (
  status = 'approved'::product_status 
  OR vendor_id IN (
    SELECT id FROM public.vendor_profiles 
    WHERE user_id = auth.uid()
  )
);

-- Approved vendors can insert their own products
CREATE POLICY "Approved vendors can insert own products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'vendor'::app_role)
  AND vendor_id IN (
    SELECT id FROM public.vendor_profiles 
    WHERE user_id = auth.uid() 
    AND is_approved = true
  )
);

-- Vendors can update their own products
CREATE POLICY "Vendors can update own products"
ON public.products
FOR UPDATE
TO authenticated
USING (
  vendor_id IN (
    SELECT id FROM public.vendor_profiles 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  vendor_id IN (
    SELECT id FROM public.vendor_profiles 
    WHERE user_id = auth.uid()
  )
);

-- Vendors can delete their own products
CREATE POLICY "Vendors can delete own products"
ON public.products
FOR DELETE
TO authenticated
USING (
  vendor_id IN (
    SELECT id FROM public.vendor_profiles 
    WHERE user_id = auth.uid()
  )
);

-- ========================================
-- PRODUCT_IMAGES POLICIES
-- ========================================

-- Admins can manage all product images
CREATE POLICY "Admins can manage all product images"
ON public.product_images
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view product images
CREATE POLICY "Anyone can view product images"
ON public.product_images
FOR SELECT
TO authenticated
USING (true);

-- Vendors can insert images for their own products
CREATE POLICY "Vendors can insert own product images"
ON public.product_images
FOR INSERT
TO authenticated
WITH CHECK (
  product_id IN (
    SELECT p.id FROM public.products p
    JOIN public.vendor_profiles vp ON p.vendor_id = vp.id
    WHERE vp.user_id = auth.uid()
  )
);

-- Vendors can update images for their own products
CREATE POLICY "Vendors can update own product images"
ON public.product_images
FOR UPDATE
TO authenticated
USING (
  product_id IN (
    SELECT p.id FROM public.products p
    JOIN public.vendor_profiles vp ON p.vendor_id = vp.id
    WHERE vp.user_id = auth.uid()
  )
)
WITH CHECK (
  product_id IN (
    SELECT p.id FROM public.products p
    JOIN public.vendor_profiles vp ON p.vendor_id = vp.id
    WHERE vp.user_id = auth.uid()
  )
);

-- Vendors can delete images for their own products
CREATE POLICY "Vendors can delete own product images"
ON public.product_images
FOR DELETE
TO authenticated
USING (
  product_id IN (
    SELECT p.id FROM public.products p
    JOIN public.vendor_profiles vp ON p.vendor_id = vp.id
    WHERE vp.user_id = auth.uid()
  )
);