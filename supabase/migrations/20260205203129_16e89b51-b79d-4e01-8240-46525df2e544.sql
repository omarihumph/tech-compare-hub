-- Create vendor_reviews table
CREATE TABLE public.vendor_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unique constraint to prevent multiple reviews from same user for same vendor
ALTER TABLE public.vendor_reviews 
ADD CONSTRAINT unique_user_vendor_review UNIQUE (user_id, vendor_id);

-- Enable RLS
ALTER TABLE public.vendor_reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can view reviews (public)
CREATE POLICY "Anyone can view reviews"
ON public.vendor_reviews
FOR SELECT
USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews"
ON public.vendor_reviews
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
ON public.vendor_reviews
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
ON public.vendor_reviews
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_vendor_reviews_updated_at
BEFORE UPDATE ON public.vendor_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();