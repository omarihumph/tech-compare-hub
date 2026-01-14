
-- First, let's add new products to the catalog
INSERT INTO product_catalog (name, brand, model, category, description, specs, image_url) VALUES
-- Dell Laptops
('Dell XPS 15', 'Dell', 'XPS15-9530', 'laptops', 'Premium ultrabook with OLED display and Intel Core i7', '{"processor": "Intel Core i7-13700H", "ram": "16GB DDR5", "storage": "512GB SSD", "display": "15.6-inch OLED 3.5K", "graphics": "NVIDIA RTX 4050"}', 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500'),
('Dell Latitude 5540', 'Dell', 'LAT5540', 'laptops', 'Business laptop with enhanced security features', '{"processor": "Intel Core i5-1345U", "ram": "16GB DDR4", "storage": "256GB SSD", "display": "15.6-inch FHD", "graphics": "Intel Iris Xe"}', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500'),
('Dell Inspiron 15', 'Dell', 'INS15-3520', 'laptops', 'Everyday laptop for work and entertainment', '{"processor": "Intel Core i5-1235U", "ram": "8GB DDR4", "storage": "512GB SSD", "display": "15.6-inch FHD", "graphics": "Intel UHD"}', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'),
('Dell G15 Gaming', 'Dell', 'G15-5530', 'laptops', 'Gaming laptop with RTX graphics', '{"processor": "Intel Core i7-13650HX", "ram": "16GB DDR5", "storage": "512GB SSD", "display": "15.6-inch FHD 165Hz", "graphics": "NVIDIA RTX 4060"}', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500'),

-- HP Laptops
('HP Pavilion 15', 'HP', 'PAV15-EG3000', 'laptops', 'Stylish laptop for everyday computing', '{"processor": "Intel Core i5-1335U", "ram": "8GB DDR4", "storage": "512GB SSD", "display": "15.6-inch FHD IPS", "graphics": "Intel Iris Xe"}', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500'),
('HP EliteBook 840 G10', 'HP', 'EB840G10', 'laptops', 'Enterprise-grade business laptop', '{"processor": "Intel Core i7-1365U", "ram": "16GB DDR5", "storage": "512GB SSD", "display": "14-inch WUXGA", "graphics": "Intel Iris Xe"}', 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500'),
('HP Victus 16', 'HP', 'VICTUS16', 'laptops', 'Affordable gaming laptop', '{"processor": "AMD Ryzen 5 7640HS", "ram": "16GB DDR5", "storage": "512GB SSD", "display": "16.1-inch FHD 144Hz", "graphics": "NVIDIA RTX 4050"}', 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=500'),
('HP Spectre x360', 'HP', 'SPECTRE14', 'laptops', '2-in-1 premium convertible laptop', '{"processor": "Intel Core i7-1355U", "ram": "16GB LPDDR5", "storage": "1TB SSD", "display": "13.5-inch OLED 3K2K", "graphics": "Intel Iris Xe"}', 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=500'),

-- Lenovo Laptops
('Lenovo ThinkPad X1 Carbon', 'Lenovo', 'X1C-G11', 'laptops', 'Legendary business ultrabook', '{"processor": "Intel Core i7-1365U", "ram": "16GB LPDDR5", "storage": "512GB SSD", "display": "14-inch 2.8K OLED", "graphics": "Intel Iris Xe"}', 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=500'),
('Lenovo IdeaPad Slim 5', 'Lenovo', 'IPS5-14', 'laptops', 'Thin and light everyday laptop', '{"processor": "AMD Ryzen 5 7530U", "ram": "8GB DDR4", "storage": "512GB SSD", "display": "14-inch FHD IPS", "graphics": "AMD Radeon"}', 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500'),
('Lenovo Legion 5 Pro', 'Lenovo', 'L5P-16', 'laptops', 'High-performance gaming laptop', '{"processor": "AMD Ryzen 7 7745HX", "ram": "16GB DDR5", "storage": "1TB SSD", "display": "16-inch WQXGA 165Hz", "graphics": "NVIDIA RTX 4070"}', 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500'),
('Lenovo ThinkPad E15', 'Lenovo', 'E15-G4', 'laptops', 'Affordable business laptop', '{"processor": "Intel Core i5-1235U", "ram": "8GB DDR4", "storage": "256GB SSD", "display": "15.6-inch FHD", "graphics": "Intel UHD"}', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'),

-- ASUS Laptops
('ASUS ZenBook 14', 'ASUS', 'UX3402', 'laptops', 'Ultra-slim premium laptop', '{"processor": "Intel Core i7-1360P", "ram": "16GB LPDDR5", "storage": "512GB SSD", "display": "14-inch 2.8K OLED", "graphics": "Intel Iris Xe"}', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500'),
('ASUS VivoBook 15', 'ASUS', 'X1502', 'laptops', 'Everyday laptop with modern design', '{"processor": "Intel Core i5-1235U", "ram": "8GB DDR4", "storage": "512GB SSD", "display": "15.6-inch FHD", "graphics": "Intel Iris Xe"}', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'),
('ASUS ROG Strix G16', 'ASUS', 'G614JV', 'laptops', 'Gaming powerhouse laptop', '{"processor": "Intel Core i9-13980HX", "ram": "32GB DDR5", "storage": "1TB SSD", "display": "16-inch QHD 240Hz", "graphics": "NVIDIA RTX 4060"}', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500'),
('ASUS TUF Gaming A15', 'ASUS', 'FA507', 'laptops', 'Durable gaming laptop', '{"processor": "AMD Ryzen 7 7735HS", "ram": "16GB DDR5", "storage": "512GB SSD", "display": "15.6-inch FHD 144Hz", "graphics": "NVIDIA RTX 4050"}', 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=500'),

-- Monitors
('Dell UltraSharp U2723QE', 'Dell', 'U2723QE', 'accessories', '27-inch 4K USB-C Hub Monitor', '{"type": "Monitor", "size": "27-inch", "resolution": "4K UHD", "panel": "IPS Black", "ports": "USB-C 90W, HDMI, DP", "features": "HDR 400"}', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500'),
('HP M27f FHD Monitor', 'HP', 'M27f', 'accessories', '27-inch Full HD IPS Monitor', '{"type": "Monitor", "size": "27-inch", "resolution": "1920x1080", "panel": "IPS", "ports": "HDMI, VGA", "refresh": "75Hz"}', 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=500'),
('LG UltraWide 34WN80C', 'LG', '34WN80C', 'accessories', '34-inch Curved UltraWide Monitor', '{"type": "Monitor", "size": "34-inch", "resolution": "3440x1440", "panel": "IPS", "ports": "USB-C 60W, HDMI", "features": "HDR10"}', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'),
('Samsung Odyssey G5', 'Samsung', 'G5-27', 'accessories', '27-inch Curved Gaming Monitor', '{"type": "Monitor", "size": "27-inch", "resolution": "2560x1440", "panel": "VA", "refresh": "165Hz", "features": "1ms, FreeSync"}', 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=500'),
('ASUS ProArt PA278QV', 'ASUS', 'PA278QV', 'accessories', '27-inch Professional Monitor', '{"type": "Monitor", "size": "27-inch", "resolution": "2560x1440", "panel": "IPS", "color": "100% sRGB", "features": "Calman Verified"}', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500'),

-- Laptop Stands
('Rain Design mStand', 'Rain Design', 'mStand-360', 'accessories', 'Premium aluminum laptop stand with 360° swivel', '{"type": "Laptop Stand", "material": "Aluminum", "height": "15cm", "rotation": "360°", "compatibility": "Up to 17-inch"}', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'),
('Nexstand K2 Portable', 'Nexstand', 'K2', 'accessories', 'Foldable portable laptop stand', '{"type": "Laptop Stand", "material": "Nylon + Metal", "height": "Adjustable 6 levels", "weight": "234g", "compatibility": "11-17 inch"}', 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500'),
('UGREEN Laptop Stand Aluminum', 'UGREEN', 'LP339', 'accessories', 'Ergonomic aluminum laptop riser', '{"type": "Laptop Stand", "material": "Aluminum Alloy", "height": "5 adjustable levels", "ventilation": "Yes", "compatibility": "10-17 inch"}', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'),
('Twelve South Curve', 'Twelve South', 'CURVE-BLK', 'accessories', 'Desktop stand for MacBook', '{"type": "Laptop Stand", "material": "Steel + Chrome", "height": "16cm", "design": "Minimal", "compatibility": "All laptops"}', 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500'),

-- Laptop Bags
('Targus CityGear 15.6"', 'Targus', 'TCG460', 'accessories', 'Professional laptop backpack', '{"type": "Laptop Bag", "size": "Up to 15.6-inch", "material": "Water-resistant nylon", "compartments": "Multiple", "features": "Checkpoint friendly"}', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'),
('Samsonite Classic Business', 'Samsonite', 'SB-CLASSIC', 'accessories', 'Premium leather laptop briefcase', '{"type": "Laptop Bag", "size": "Up to 15.6-inch", "material": "Genuine Leather", "style": "Briefcase", "features": "TSA approved"}', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500'),
('SwissGear ScanSmart', 'SwissGear', 'SG1900', 'accessories', 'TSA-friendly laptop backpack', '{"type": "Laptop Bag", "size": "Up to 17-inch", "material": "1200D Ballistic Nylon", "capacity": "31L", "features": "Lay-flat TSA"}', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'),
('HP Renew Business Backpack', 'HP', 'RENEW-15', 'accessories', 'Eco-friendly laptop backpack', '{"type": "Laptop Bag", "size": "Up to 15.6-inch", "material": "Recycled Ocean Plastic", "compartments": "Multiple", "features": "Water resistant"}', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500'),
('Dell Pro Slim Briefcase', 'Dell', 'PRO-SLIM15', 'accessories', 'Slim professional briefcase', '{"type": "Laptop Bag", "size": "Up to 15-inch", "material": "Heathered fabric", "style": "Slim Briefcase", "features": "Trolley strap"}', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'),

-- Stickers
('Laptop Skin Marble White', 'DBrand', 'MARBLE-WHT', 'accessories', 'Premium vinyl laptop skin', '{"type": "Laptop Skin", "material": "3M Vinyl", "finish": "Matte", "sizes": "Universal cut", "adhesive": "Residue-free"}', 'https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=500'),
('Tech Sticker Pack (50pcs)', 'StickerBomb', 'TECH50', 'accessories', 'Programming and tech themed stickers', '{"type": "Sticker Pack", "quantity": "50 pieces", "material": "Waterproof vinyl", "themes": "Coding, Tech, Geek", "size": "5-10cm each"}', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'),
('Carbon Fiber Laptop Skin', 'DBrand', 'CARBON-BLK', 'accessories', 'Textured carbon fiber vinyl wrap', '{"type": "Laptop Skin", "material": "3M Carbon Fiber Vinyl", "finish": "Textured", "sizes": "Universal", "adhesive": "Easy apply/remove"}', 'https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=500'),
('Developer Sticker Bundle', 'DevStickers', 'DEV-BUNDLE', 'accessories', 'Programming language and framework stickers', '{"type": "Sticker Pack", "quantity": "30 pieces", "material": "Vinyl", "themes": "JavaScript, Python, React, Git", "size": "Various"}', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'),

-- Oraimo Products
('Oraimo FreePods 4', 'Oraimo', 'OEB-E104D', 'accessories', 'True wireless earbuds with ANC', '{"type": "True Wireless Earbuds", "anc": "Active Noise Cancelling", "battery": "7h + 28h case", "driver": "12mm", "bluetooth": "5.3"}', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500'),
('Oraimo SoundPro 2', 'Oraimo', 'OEB-H110', 'accessories', 'Over-ear wireless headphones', '{"type": "Over-ear Headphones", "battery": "40 hours", "driver": "40mm", "anc": "Yes", "bluetooth": "5.0"}', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'),
('Oraimo PowerBank 20000mAh', 'Oraimo', 'OPB-P204D', 'accessories', 'High capacity power bank with fast charging', '{"type": "Power Bank", "capacity": "20000mAh", "output": "22.5W", "ports": "2 USB-A, 1 USB-C", "features": "LED Display"}', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500'),
('Oraimo Watch 3 Pro', 'Oraimo', 'OSW-31', 'accessories', 'Smart watch with health monitoring', '{"type": "Smartwatch", "display": "1.32-inch AMOLED", "battery": "5 days", "features": "SpO2, Heart Rate, IP68", "compatibility": "iOS, Android"}', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500'),
('Oraimo Necklace 3', 'Oraimo', 'OEB-E74D', 'accessories', 'Neckband wireless earphones', '{"type": "Neckband Earphones", "battery": "100 hours", "driver": "13mm", "features": "ENC, Fast Charge", "bluetooth": "5.3"}', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500'),
('Oraimo 65W GaN Charger', 'Oraimo', 'OCW-U66S', 'accessories', 'Compact GaN USB-C charger', '{"type": "Wall Charger", "power": "65W", "ports": "2 USB-C, 1 USB-A", "technology": "GaN III", "features": "PD 3.0, QC 4.0"}', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500'),

-- Keyboards
('Logitech MX Keys', 'Logitech', 'MX-KEYS', 'accessories', 'Premium wireless illuminated keyboard', '{"type": "Wireless Keyboard", "connectivity": "Bluetooth + USB", "battery": "10 days backlit", "features": "Smart illumination, Multi-device", "layout": "Full-size"}', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'),
('Keychron K2 Pro', 'Keychron', 'K2P-RGB', 'accessories', 'Wireless mechanical keyboard', '{"type": "Mechanical Keyboard", "switches": "Gateron G Pro", "connectivity": "Bluetooth + USB-C", "battery": "4000mAh", "layout": "75%"}', 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500'),
('Razer BlackWidow V4', 'Razer', 'RZ03-04690', 'accessories', 'RGB mechanical gaming keyboard', '{"type": "Mechanical Keyboard", "switches": "Razer Green", "lighting": "Chroma RGB", "features": "Media keys, Wrist rest", "layout": "Full-size"}', 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500'),
('Apple Magic Keyboard', 'Apple', 'MK2C3', 'accessories', 'Wireless keyboard with Touch ID', '{"type": "Wireless Keyboard", "connectivity": "Bluetooth", "features": "Touch ID, Rechargeable", "layout": "Compact", "compatibility": "Mac only"}', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'),
('HP 475 Dual-Mode', 'HP', 'HP475-WL', 'accessories', 'Wireless dual-mode keyboard', '{"type": "Wireless Keyboard", "connectivity": "Bluetooth + 2.4GHz", "battery": "24 months", "features": "Quiet keys, Multi-device", "layout": "Full-size"}', 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500'),
('Corsair K100 RGB', 'Corsair', 'K100-OPX', 'accessories', 'Flagship mechanical gaming keyboard', '{"type": "Mechanical Keyboard", "switches": "Corsair OPX", "features": "iCUE wheel, Stream Deck", "lighting": "RGB per-key", "layout": "Full-size"}', 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500'),

-- Mice
('Logitech MX Master 3S', 'Logitech', 'MX-MASTER3S', 'accessories', 'Advanced wireless mouse for productivity', '{"type": "Wireless Mouse", "sensor": "8000 DPI", "connectivity": "Bluetooth + USB", "battery": "70 days", "features": "MagSpeed wheel, Quiet clicks"}', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'),
('Razer DeathAdder V3', 'Razer', 'RZ01-04640', 'accessories', 'Ergonomic esports mouse', '{"type": "Gaming Mouse", "sensor": "30000 DPI", "weight": "59g", "switches": "Optical Gen-3", "features": "Speedflex cable"}', 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500'),
('Apple Magic Mouse', 'Apple', 'MK2E3', 'accessories', 'Wireless multi-touch mouse', '{"type": "Wireless Mouse", "surface": "Multi-Touch", "connectivity": "Bluetooth", "battery": "Rechargeable", "compatibility": "Mac only"}', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'),
('SteelSeries Aerox 3', 'SteelSeries', 'AEROX3-WL', 'accessories', 'Ultra-lightweight wireless gaming mouse', '{"type": "Gaming Mouse", "sensor": "18000 DPI", "weight": "68g", "battery": "200 hours", "features": "IP54 water resistant"}', 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500'),
('Microsoft Arc Mouse', 'Microsoft', 'ELG-00001', 'accessories', 'Slim travel mouse', '{"type": "Wireless Mouse", "design": "Foldable arc", "connectivity": "Bluetooth", "features": "Snap flat, Touch scroll", "compatibility": "Windows, Mac"}', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'),
('Logitech G502 X Plus', 'Logitech', 'G502X-PLUS', 'accessories', 'Wireless gaming mouse with LIGHTSPEED', '{"type": "Gaming Mouse", "sensor": "25600 DPI", "switches": "LIGHTFORCE hybrid", "battery": "130 hours", "features": "LIGHTSYNC RGB"}', 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500'),

-- USB Hubs and Docks
('Anker 7-in-1 USB-C Hub', 'Anker', 'A8346', 'accessories', 'Versatile USB-C hub', '{"type": "USB-C Hub", "ports": "HDMI, USB-A x2, USB-C, SD, microSD", "power": "100W passthrough", "output": "4K@60Hz"}', 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500'),
('CalDigit TS4 Dock', 'CalDigit', 'TS4', 'accessories', 'Thunderbolt 4 docking station', '{"type": "Docking Station", "ports": "18 ports total", "power": "98W charging", "display": "Dual 6K or triple 4K", "features": "2.5GbE, SD 4.0"}', 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500'),
('UGREEN 9-in-1 USB-C Hub', 'UGREEN', 'CM498', 'accessories', 'Premium multi-port USB-C adapter', '{"type": "USB-C Hub", "ports": "HDMI x2, USB-A x3, USB-C, Ethernet, SD", "power": "100W PD", "output": "Dual 4K"}', 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500'),

-- Webcams
('Logitech C920x HD Pro', 'Logitech', 'C920X', 'accessories', '1080p HD webcam', '{"type": "Webcam", "resolution": "1080p 30fps", "features": "Autofocus, Stereo mic", "fov": "78°", "mount": "Universal clip"}', 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500'),
('Razer Kiyo Pro Ultra', 'Razer', 'RZ19-04170', 'accessories', '4K webcam with large sensor', '{"type": "Webcam", "resolution": "4K 30fps", "sensor": "1/1.2-inch", "features": "HDR, AI Noise Reduction", "fov": "Adjustable"}', 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500'),
('Elgato Facecam Pro', 'Elgato', 'FC-PRO', 'accessories', 'Professional 4K webcam', '{"type": "Webcam", "resolution": "4K 60fps", "sensor": "Sony STARVIS", "features": "Uncompressed video, Flash OLED", "fov": "90°"}', 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500'),

-- Cables
('Anker USB-C to Lightning Cable', 'Anker', 'A8612', 'accessories', 'MFi certified fast charging cable', '{"type": "Cable", "length": "1.8m", "rating": "30W", "material": "Braided Nylon", "certification": "MFi"}', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500'),
('UGREEN HDMI 2.1 Cable', 'UGREEN', 'HD140', 'accessories', '8K HDMI cable', '{"type": "Cable", "length": "2m", "spec": "HDMI 2.1", "rating": "8K@60Hz, 4K@120Hz", "features": "eARC, VRR"}', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500'),
('Thunderbolt 4 Cable', 'Apple', 'MU883', 'accessories', 'Pro-grade Thunderbolt cable', '{"type": "Cable", "length": "1m", "spec": "Thunderbolt 4", "rating": "40Gbps, 100W", "features": "USB4 compatible"}', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500'),

-- Headsets
('HyperX Cloud III', 'HyperX', 'CLOUD3', 'accessories', 'Premium gaming headset', '{"type": "Gaming Headset", "driver": "53mm", "connectivity": "USB, 3.5mm", "mic": "Detachable", "features": "DTS Spatial Audio"}', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'),
('Sony WH-1000XM5', 'Sony', 'WH1000XM5', 'accessories', 'Premium ANC headphones', '{"type": "Over-ear Headphones", "driver": "30mm", "anc": "Industry-leading", "battery": "30 hours", "features": "LDAC, Speak-to-Chat"}', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'),
('Jabra Evolve2 75', 'Jabra', 'EVOLVE2-75', 'accessories', 'Professional wireless headset', '{"type": "Business Headset", "anc": "Advanced ANC", "battery": "36 hours", "mic": "8 mics", "features": "Certified for Zoom, Teams"}', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500');

-- Now create vendor listings for all new catalog items
DO $$
DECLARE
    catalog_item RECORD;
    vendor_rec RECORD;
    base_price NUMERIC;
    variance NUMERIC;
    final_price NUMERIC;
BEGIN
    -- Loop through all catalog items
    FOR catalog_item IN 
        SELECT id, name, brand, model, category, description, specs, image_url 
        FROM product_catalog 
        WHERE id NOT IN (SELECT DISTINCT catalog_id FROM products WHERE catalog_id IS NOT NULL)
    LOOP
        -- Set base price based on category and brand
        base_price := CASE 
            WHEN catalog_item.category = 'laptops' THEN
                CASE 
                    WHEN catalog_item.brand IN ('Apple', 'Dell', 'HP') AND catalog_item.name LIKE '%XPS%' THEN 185000
                    WHEN catalog_item.brand IN ('Apple', 'Dell', 'HP') AND catalog_item.name LIKE '%EliteBook%' THEN 165000
                    WHEN catalog_item.brand = 'Lenovo' AND catalog_item.name LIKE '%ThinkPad X1%' THEN 195000
                    WHEN catalog_item.name LIKE '%Gaming%' OR catalog_item.name LIKE '%ROG%' OR catalog_item.name LIKE '%Legion%' THEN 175000
                    WHEN catalog_item.name LIKE '%Victus%' OR catalog_item.name LIKE '%TUF%' THEN 125000
                    ELSE 85000
                END
            WHEN catalog_item.category = 'accessories' THEN
                CASE
                    WHEN catalog_item.name LIKE '%Monitor%' OR catalog_item.name LIKE '%UltraSharp%' OR catalog_item.name LIKE '%UltraWide%' THEN 55000
                    WHEN catalog_item.name LIKE '%Dock%' OR catalog_item.name LIKE '%TS4%' THEN 45000
                    WHEN catalog_item.name LIKE '%MX Master%' OR catalog_item.name LIKE '%MX Keys%' THEN 18000
                    WHEN catalog_item.name LIKE '%Keyboard%' AND catalog_item.brand IN ('Razer', 'Corsair') THEN 22000
                    WHEN catalog_item.name LIKE '%Keyboard%' THEN 14000
                    WHEN catalog_item.name LIKE '%Mouse%' AND catalog_item.brand IN ('Razer', 'Logitech', 'SteelSeries') THEN 12000
                    WHEN catalog_item.name LIKE '%Headphone%' OR catalog_item.name LIKE '%WH-1000XM5%' THEN 45000
                    WHEN catalog_item.name LIKE '%Headset%' THEN 15000
                    WHEN catalog_item.name LIKE '%Webcam%' AND catalog_item.name LIKE '%4K%' THEN 35000
                    WHEN catalog_item.name LIKE '%Webcam%' THEN 15000
                    WHEN catalog_item.name LIKE '%Stand%' THEN 4500
                    WHEN catalog_item.name LIKE '%Bag%' OR catalog_item.name LIKE '%Backpack%' THEN 8500
                    WHEN catalog_item.name LIKE '%Sticker%' OR catalog_item.name LIKE '%Skin%' THEN 1500
                    WHEN catalog_item.name LIKE '%Hub%' THEN 7500
                    WHEN catalog_item.name LIKE '%Cable%' THEN 2500
                    WHEN catalog_item.brand = 'Oraimo' THEN
                        CASE
                            WHEN catalog_item.name LIKE '%PowerBank%' THEN 4500
                            WHEN catalog_item.name LIKE '%Watch%' THEN 8500
                            WHEN catalog_item.name LIKE '%Charger%' THEN 3500
                            ELSE 3000
                        END
                    ELSE 5000
                END
            ELSE 50000
        END;
        
        -- Create listing for each vendor with price variance
        FOR vendor_rec IN SELECT id FROM vendor_profiles WHERE is_approved = true LOOP
            -- Random variance between -15% and +20%
            variance := (random() * 0.35 - 0.15);
            final_price := ROUND(base_price * (1 + variance));
            
            INSERT INTO products (
                catalog_id, vendor_id, name, brand, model, category, 
                price, description, specs, image_url, status
            ) VALUES (
                catalog_item.id,
                vendor_rec.id,
                catalog_item.name,
                catalog_item.brand,
                catalog_item.model,
                catalog_item.category,
                final_price,
                catalog_item.description,
                catalog_item.specs,
                catalog_item.image_url,
                'approved'
            );
        END LOOP;
    END LOOP;
END $$;
