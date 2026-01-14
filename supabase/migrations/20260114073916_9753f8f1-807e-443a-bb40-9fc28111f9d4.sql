-- Update the LG UltraWide 34WN80C monitor image
UPDATE product_catalog 
SET image_url = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500'
WHERE name = 'LG UltraWide 34WN80C' AND brand = 'LG';

-- Also update any products linked to this catalog item
UPDATE products p
SET image_url = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500'
FROM product_catalog pc
WHERE p.catalog_id = pc.id 
AND pc.name = 'LG UltraWide 34WN80C' 
AND pc.brand = 'LG';