-- Migrate existing products to catalog (unique products)
INSERT INTO public.product_catalog (name, brand, model, category, description, specs, image_url)
SELECT DISTINCT ON (name, brand, model) 
  name, brand, model, category, description, specs, image_url
FROM public.products
WHERE status = 'approved';

-- Update existing products to reference their catalog entries
UPDATE public.products p
SET catalog_id = pc.id
FROM public.product_catalog pc
WHERE p.name = pc.name 
  AND COALESCE(p.brand, '') = COALESCE(pc.brand, '')
  AND COALESCE(p.model, '') = COALESCE(pc.model, '');