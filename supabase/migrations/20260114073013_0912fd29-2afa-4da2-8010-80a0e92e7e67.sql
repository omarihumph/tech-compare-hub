-- Fix Issue 1: Public Profile Data Exposure
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Create a policy allowing users to view only their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow admins to view all profiles (needed for admin dashboard)
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix Issue 2: Storage Cross-Vendor Access
-- Drop existing permissive storage policies
DROP POLICY IF EXISTS "Vendors can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can update their product images" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can delete their product images" ON storage.objects;

-- Create ownership-based policies with folder structure {user_id}/{filename}
CREATE POLICY "Vendors can upload own product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' 
  AND public.has_role(auth.uid(), 'vendor'::app_role)
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Vendors can update own product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND public.has_role(auth.uid(), 'vendor'::app_role)
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'product-images'
  AND public.has_role(auth.uid(), 'vendor'::app_role)
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Vendors can delete own product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND public.has_role(auth.uid(), 'vendor'::app_role)
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Also allow admins to manage all product images
CREATE POLICY "Admins can manage all product images"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'product-images'
  AND public.has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  bucket_id = 'product-images'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);