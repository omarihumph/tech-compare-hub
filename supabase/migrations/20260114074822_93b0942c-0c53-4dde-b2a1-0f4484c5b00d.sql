-- Insert new Dell laptop models into product_catalog
INSERT INTO product_catalog (name, brand, model, category, description, specs, image_url) VALUES
('Dell Inspiron 15', 'Dell', 'Inspiron-15-3520', 'laptops', 'Reliable mainstream laptop perfect for everyday tasks and students', '{"processor": "Intel Core i5-1235U", "ram": "8GB DDR4", "storage": "256GB SSD", "display": "15.6-inch FHD", "graphics": "Intel UHD Graphics"}', 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500'),
('Dell Inspiron 16', 'Dell', 'Inspiron-16-5620', 'laptops', 'Large screen mainstream laptop ideal for movies and entertainment', '{"processor": "Intel Core i7-1255U", "ram": "16GB DDR4", "storage": "512GB SSD", "display": "16-inch FHD+", "graphics": "Intel Iris Xe"}', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500'),
('Dell Latitude 5420', 'Dell', 'Latitude-5420', 'laptops', 'Professional business laptop built for work and travel', '{"processor": "Intel Core i5-1145G7", "ram": "16GB DDR4", "storage": "256GB SSD", "display": "14-inch FHD", "graphics": "Intel Iris Xe", "features": "vPro, Thunderbolt 4"}', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'),
('Dell Vostro 3510', 'Dell', 'Vostro-3510', 'laptops', 'Affordable business laptop designed for small businesses', '{"processor": "Intel Core i3-1115G4", "ram": "8GB DDR4", "storage": "256GB SSD", "display": "15.6-inch FHD", "graphics": "Intel UHD Graphics"}', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500'),
('Dell XPS 13', 'Dell', 'XPS13-9315', 'laptops', 'Ultra-portable premium laptop for creatives on the go', '{"processor": "Intel Core i7-1250U", "ram": "16GB LPDDR5", "storage": "512GB SSD", "display": "13.4-inch FHD+ InfinityEdge", "graphics": "Intel Iris Xe", "weight": "1.17kg"}', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'),
('Dell XPS 16', 'Dell', 'XPS16-9640', 'laptops', 'Powerful premium laptop for designers and developers', '{"processor": "Intel Core Ultra 7 155H", "ram": "32GB LPDDR5x", "storage": "1TB SSD", "display": "16.3-inch OLED 4K+", "graphics": "NVIDIA RTX 4060", "weight": "2.13kg"}', 'https://images.unsplash.com/photo-1504707748692-419802c2c3dc?w=500'),
('Dell Alienware X15', 'Dell', 'Alienware-X15-R2', 'laptops', 'High-end gaming laptop with slim design and powerful performance', '{"processor": "Intel Core i9-12900H", "ram": "32GB DDR5", "storage": "1TB SSD", "display": "15.6-inch QHD 240Hz", "graphics": "NVIDIA RTX 3080 Ti", "cooling": "Cryo-Tech"}', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500'),
('Dell Alienware M15 R7', 'Dell', 'Alienware-M15-R7', 'laptops', 'Gaming powerhouse perfect for gaming and streaming', '{"processor": "AMD Ryzen 9 6900HX", "ram": "32GB DDR5", "storage": "1TB SSD", "display": "15.6-inch FHD 360Hz", "graphics": "NVIDIA RTX 3080", "cooling": "Alienware Cryo-Tech"}', 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=500');

-- Create vendor listings for all new Dell laptops
DO $$
DECLARE
    catalog_item RECORD;
    vendor_rec RECORD;
    base_price NUMERIC;
    price_variation NUMERIC;
    final_price NUMERIC;
BEGIN
    -- Loop through all newly added Dell laptops
    FOR catalog_item IN 
        SELECT id, name, brand, model, category, description, specs, image_url 
        FROM product_catalog 
        WHERE brand = 'Dell' AND name IN (
            'Dell Inspiron 15', 'Dell Inspiron 16', 'Dell Latitude 5420', 
            'Dell Vostro 3510', 'Dell XPS 13', 'Dell XPS 16', 
            'Dell Alienware X15', 'Dell Alienware M15 R7'
        )
    LOOP
        -- Set base price based on laptop category
        CASE catalog_item.name
            WHEN 'Dell Inspiron 15' THEN base_price := 65000;
            WHEN 'Dell Inspiron 16' THEN base_price := 85000;
            WHEN 'Dell Latitude 5420' THEN base_price := 95000;
            WHEN 'Dell Vostro 3510' THEN base_price := 55000;
            WHEN 'Dell XPS 13' THEN base_price := 145000;
            WHEN 'Dell XPS 16' THEN base_price := 285000;
            WHEN 'Dell Alienware X15' THEN base_price := 320000;
            WHEN 'Dell Alienware M15 R7' THEN base_price := 280000;
            ELSE base_price := 80000;
        END CASE;
        
        -- Loop through all vendors
        FOR vendor_rec IN SELECT id FROM vendor_profiles WHERE is_approved = true
        LOOP
            -- Random price variation between -8% and +12%
            price_variation := (random() * 0.20 - 0.08);
            final_price := ROUND(base_price * (1 + price_variation));
            
            INSERT INTO products (
                catalog_id, vendor_id, name, brand, model, category, 
                description, specs, image_url, price, status
            ) VALUES (
                catalog_item.id, vendor_rec.id, catalog_item.name, 
                catalog_item.brand, catalog_item.model, catalog_item.category,
                catalog_item.description, catalog_item.specs, catalog_item.image_url,
                final_price, 'approved'
            );
        END LOOP;
    END LOOP;
END $$;