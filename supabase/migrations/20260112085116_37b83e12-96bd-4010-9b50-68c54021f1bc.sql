-- Create additional vendor listings for products (different vendors, different prices)
-- Vendor 2 listings (slightly lower prices)
INSERT INTO public.products (name, brand, model, category, description, specs, image_url, vendor_id, catalog_id, price, status)
SELECT 
  pc.name, pc.brand, pc.model, pc.category, pc.description, pc.specs, pc.image_url,
  '22222222-2222-2222-2222-222222222222'::uuid as vendor_id,
  pc.id as catalog_id,
  (p.price * 0.95)::numeric as price,
  'approved'
FROM public.product_catalog pc
JOIN public.products p ON p.catalog_id = pc.id
WHERE NOT EXISTS (
  SELECT 1 FROM public.products existing 
  WHERE existing.catalog_id = pc.id AND existing.vendor_id = '22222222-2222-2222-2222-222222222222'::uuid
)
GROUP BY pc.id, pc.name, pc.brand, pc.model, pc.category, pc.description, pc.specs, pc.image_url, p.price
LIMIT 80;

-- Vendor 3 listings (slightly higher prices)
INSERT INTO public.products (name, brand, model, category, description, specs, image_url, vendor_id, catalog_id, price, status)
SELECT 
  pc.name, pc.brand, pc.model, pc.category, pc.description, pc.specs, pc.image_url,
  '33333333-3333-3333-3333-333333333333'::uuid as vendor_id,
  pc.id as catalog_id,
  (p.price * 1.05)::numeric as price,
  'approved'
FROM public.product_catalog pc
JOIN public.products p ON p.catalog_id = pc.id
WHERE NOT EXISTS (
  SELECT 1 FROM public.products existing 
  WHERE existing.catalog_id = pc.id AND existing.vendor_id = '33333333-3333-3333-3333-333333333333'::uuid
)
GROUP BY pc.id, pc.name, pc.brand, pc.model, pc.category, pc.description, pc.specs, pc.image_url, p.price
LIMIT 80;

-- Vendor 4 listings (competitive prices)
INSERT INTO public.products (name, brand, model, category, description, specs, image_url, vendor_id, catalog_id, price, status)
SELECT 
  pc.name, pc.brand, pc.model, pc.category, pc.description, pc.specs, pc.image_url,
  '44444444-4444-4444-4444-444444444444'::uuid as vendor_id,
  pc.id as catalog_id,
  (p.price * 0.92)::numeric as price,
  'approved'
FROM public.product_catalog pc
JOIN public.products p ON p.catalog_id = pc.id
WHERE NOT EXISTS (
  SELECT 1 FROM public.products existing 
  WHERE existing.catalog_id = pc.id AND existing.vendor_id = '44444444-4444-4444-4444-444444444444'::uuid
)
GROUP BY pc.id, pc.name, pc.brand, pc.model, pc.category, pc.description, pc.specs, pc.image_url, p.price
LIMIT 80;

-- Vendor 5 (1b797605) listings (premium prices)
INSERT INTO public.products (name, brand, model, category, description, specs, image_url, vendor_id, catalog_id, price, status)
SELECT 
  pc.name, pc.brand, pc.model, pc.category, pc.description, pc.specs, pc.image_url,
  '1b797605-2e84-4b48-9e8a-b47c3866a788'::uuid as vendor_id,
  pc.id as catalog_id,
  (p.price * 1.08)::numeric as price,
  'approved'
FROM public.product_catalog pc
JOIN public.products p ON p.catalog_id = pc.id
WHERE NOT EXISTS (
  SELECT 1 FROM public.products existing 
  WHERE existing.catalog_id = pc.id AND existing.vendor_id = '1b797605-2e84-4b48-9e8a-b47c3866a788'::uuid
)
GROUP BY pc.id, pc.name, pc.brand, pc.model, pc.category, pc.description, pc.specs, pc.image_url, p.price
LIMIT 80;