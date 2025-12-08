import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const productImages = [
  {
    src: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80",
    alt: "iPhone 17 Pro",
    category: "Smartphones",
    description: "The most advanced iPhone ever with A19 Pro chip, titanium design, and revolutionary camera system.",
    price: "KES 245,000"
  },
  {
    src: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
    alt: "Samsung Galaxy Z Fold",
    category: "Smartphones",
    description: "Unfold your world with the ultimate foldable smartphone featuring a 7.6-inch immersive display.",
    price: "KES 285,000"
  },
  {
    src: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=600&q=80",
    alt: "Samsung Galaxy Z Flip",
    category: "Smartphones",
    description: "Compact and stylish flip phone with Flex Mode and stunning camera capabilities.",
    price: "KES 165,000"
  }
];

const TechShowcase3D = () => {
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [speed, setSpeed] = useState(0.4);
  const [selectedProduct, setSelectedProduct] = useState<typeof productImages[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setRotation((prev) => prev + speed);
    }, 30);
    return () => clearInterval(interval);
  }, [isPaused, speed]);

  const handleMouseEnter = useCallback(() => {
    setSpeed(0.15);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setSpeed(0.4);
    setHoveredIndex(null);
  }, []);

  const handleImageHover = useCallback((index: number) => {
    setHoveredIndex(index);
    setIsPaused(true);
  }, []);

  const handleImageLeave = useCallback(() => {
    setHoveredIndex(null);
    setIsPaused(false);
  }, []);

  const handleImageClick = useCallback((product: typeof productImages[0]) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setIsPaused(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setIsPaused(false);
  }, []);

  const handleBrowseCategory = useCallback((category: string) => {
    handleModalClose();
    navigate(`/browse?category=${category.toLowerCase()}`);
  }, [navigate, handleModalClose]);

  const radius = 320;
  const angleStep = (2 * Math.PI) / productImages.length;

  return (
    <>
      <div 
        className="w-full h-[550px] relative overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Animated glow effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 rounded-full blur-3xl opacity-40 animate-pulse" />
        <div 
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/40 rounded-full blur-3xl opacity-30"
          style={{ 
            animation: "pulse 3s ease-in-out infinite",
            transform: `translate(${Math.sin(rotation * 0.02) * 20}px, ${Math.cos(rotation * 0.02) * 20}px)`
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-secondary/30 rounded-full blur-3xl opacity-25"
          style={{ 
            animation: "pulse 4s ease-in-out infinite",
            animationDelay: "1s",
            transform: `translate(${Math.cos(rotation * 0.015) * 15}px, ${Math.sin(rotation * 0.015) * 15}px)`
          }}
        />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/50 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
        
        {/* 3D Rotating Carousel */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: "1200px" }}
        >
          <div
            className="relative w-[200px] h-[200px]"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(${rotation}deg)`,
              transition: isPaused ? "transform 0.3s ease-out" : "none",
            }}
          >
            {productImages.map((image, index) => {
              const angle = angleStep * index;
              const x = Math.sin(angle) * radius;
              const z = Math.cos(angle) * radius;
              const isHovered = hoveredIndex === index;
              
              return (
                <div
                  key={index}
                  className={`absolute w-[160px] h-[160px] rounded-2xl overflow-hidden border backdrop-blur-sm transition-all duration-300 cursor-pointer ${
                    isHovered 
                      ? "shadow-[0_0_40px_rgba(var(--primary),0.5)] border-primary/50 scale-125 z-50" 
                      : "shadow-2xl border-white/10"
                  }`}
                  style={{
                    transform: `translateX(-50%) translateZ(${z}px) translateX(${x}px) rotateY(${-rotation + (index * 360 / productImages.length)}deg) ${isHovered ? 'scale(1.25)' : ''}`,
                    left: "50%",
                    backfaceVisibility: "hidden",
                  }}
                  onMouseEnter={() => handleImageHover(index)}
                  onMouseLeave={handleImageLeave}
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isHovered ? "scale-110" : ""
                    }`}
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 transition-opacity duration-300 ${
                    isHovered 
                      ? "bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-100" 
                      : "bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70"
                  }`} />
                  
                  {/* Hover label */}
                  <div className={`absolute bottom-0 left-0 right-0 p-3 text-center transition-all duration-300 ${
                    isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}>
                    <span className="text-white text-sm font-semibold drop-shadow-lg">
                      Click to view
                    </span>
                  </div>
                  
                  {/* Shine effect */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transition-opacity duration-300 ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      transform: "skewX(-20deg) translateX(-100%)",
                      animation: isHovered ? "shine 0.8s ease-out forwards" : "none",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-muted-foreground/60 text-sm animate-pulse">
          Hover to explore • Click for details
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
          }
          @keyframes shine {
            0% { transform: skewX(-20deg) translateX(-100%); }
            100% { transform: skewX(-20deg) translateX(200%); }
          }
        `}</style>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-lg overflow-hidden p-0">
          {selectedProduct && (
            <>
              {/* Product Image */}
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={selectedProduct.src}
                  alt={selectedProduct.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <Badge 
                  className="absolute top-4 right-4 bg-primary/90 hover:bg-primary"
                >
                  {selectedProduct.category}
                </Badge>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    {selectedProduct.alt}
                  </DialogTitle>
                </DialogHeader>

                <p className="text-muted-foreground">
                  {selectedProduct.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    {selectedProduct.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Starting price
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    className="flex-1 gap-2"
                    onClick={() => handleBrowseCategory(selectedProduct.category)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Browse {selectedProduct.category}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => handleBrowseCategory(selectedProduct.category)}
                  >
                    <ExternalLink className="w-4 h-4" />
                    View All
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TechShowcase3D;
