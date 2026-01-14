-- Update product images with more reliable, category-appropriate Unsplash images

-- Dell laptops
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=400&fit=crop' WHERE name LIKE 'Dell XPS%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop' WHERE name LIKE 'Dell Inspiron%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop' WHERE name LIKE 'Dell Latitude%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=400&fit=crop' WHERE name LIKE 'Dell Vostro%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=400&fit=crop' WHERE name LIKE 'Dell Alienware%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=600&h=400&fit=crop' WHERE name = 'Dell G15 Gaming';

-- HP laptops
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop' WHERE name LIKE 'HP Spectre%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop' WHERE name LIKE 'HP EliteBook%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop' WHERE name LIKE 'HP Pavilion%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=600&h=400&fit=crop' WHERE name LIKE 'HP Omen%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=400&fit=crop' WHERE name LIKE 'HP Victus%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=400&fit=crop' WHERE name LIKE 'HP ProBook%';

-- Lenovo laptops
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&h=400&fit=crop' WHERE name LIKE 'Lenovo ThinkPad%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop' WHERE name LIKE 'Lenovo IdeaPad%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=400&fit=crop' WHERE name LIKE 'Lenovo Legion%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=400&fit=crop' WHERE name LIKE 'Lenovo Yoga%';

-- ASUS laptops
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=400&fit=crop' WHERE name LIKE 'ASUS ZenBook%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop' WHERE name LIKE 'ASUS VivoBook%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=600&h=400&fit=crop' WHERE name LIKE '%ROG%' OR name LIKE '%TUF%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop' WHERE name LIKE 'ASUS ProArt%';

-- Acer laptops
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=400&fit=crop' WHERE name LIKE 'Acer Aspire%' OR name LIKE 'Acer Swift%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=600&h=400&fit=crop' WHERE name LIKE 'Acer Nitro%' OR name LIKE 'Acer Predator%';

-- Monitors
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=400&fit=crop' WHERE category = 'monitors' AND name LIKE '%LG%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&h=400&fit=crop' WHERE category = 'monitors' AND name LIKE '%Samsung%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&h=400&fit=crop' WHERE category = 'monitors' AND name LIKE '%Dell%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&h=400&fit=crop' WHERE category = 'monitors' AND name LIKE '%ASUS%';

-- Accessories
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop' WHERE name LIKE '%Laptop Stand%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop' WHERE name LIKE '%Laptop Bag%' OR name LIKE '%Backpack%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=600&h=400&fit=crop' WHERE name LIKE '%Keyboard%' AND category = 'accessories';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop' WHERE name LIKE '%Mouse%' AND category = 'accessories';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop' WHERE name LIKE '%Webcam%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=400&fit=crop' WHERE name LIKE '%Headset%' OR name LIKE '%Headphone%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1606293926249-ed22f1e3de8f?w=600&h=400&fit=crop' WHERE name LIKE '%USB%Cable%' OR name LIKE '%HDMI%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=400&fit=crop' WHERE name LIKE '%Oraimo%';
UPDATE product_catalog SET image_url = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop' WHERE name LIKE '%Sticker%';

-- Sync product listings with catalog images
UPDATE products p
SET image_url = pc.image_url
FROM product_catalog pc
WHERE p.catalog_id = pc.id;