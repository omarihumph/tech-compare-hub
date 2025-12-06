import { useState, useEffect, useCallback } from "react";

const productImages = [
  {
    src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    alt: "MacBook Pro"
  },
  {
    src: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80",
    alt: "iPhone"
  },
  {
    src: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80",
    alt: "Smart Watch"
  },
  {
    src: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80",
    alt: "PlayStation 5"
  },
  {
    src: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
    alt: "iMac"
  },
  {
    src: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80",
    alt: "Mechanical Keyboard"
  },
  {
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    alt: "Headphones"
  },
  {
    src: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
    alt: "iPad"
  },
  {
    src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80",
    alt: "Xbox Controller"
  },
  {
    src: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=600&q=80",
    alt: "Gaming Mouse"
  }
];

const TechShowcase3D = () => {
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [speed, setSpeed] = useState(0.4);

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

  const radius = 320;
  const angleStep = (2 * Math.PI) / productImages.length;

  return (
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
                className={`absolute w-[160px] h-[160px] rounded-2xl overflow-hidden border backdrop-blur-sm transition-all duration-300 ${
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
                    {image.alt}
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
        Hover to explore
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
  );
};

export default TechShowcase3D;
