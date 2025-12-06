import { useState, useEffect } from "react";

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
    src: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
    alt: "iMac"
  },
  {
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    alt: "Headphones"
  },
  {
    src: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&q=80",
    alt: "AirPods"
  },
  {
    src: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
    alt: "iPad"
  }
];

const TechShowcase3D = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 0.5);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const radius = 280;
  const angleStep = (2 * Math.PI) / productImages.length;

  return (
    <div className="w-full h-[500px] relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 rounded-full blur-3xl opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-2xl opacity-30 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/20 rounded-full blur-2xl opacity-20 animate-pulse" style={{ animationDelay: "1.5s" }} />
      
      {/* 3D Rotating Carousel */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative w-[200px] h-[200px]"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${rotation}deg)`,
          }}
        >
          {productImages.map((image, index) => {
            const angle = angleStep * index;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            
            return (
              <div
                key={index}
                className="absolute w-[180px] h-[180px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm"
                style={{
                  transform: `translateX(-50%) translateZ(${z}px) translateX(${x}px) rotateY(${-rotation + (index * 360 / productImages.length)}deg)`,
                  left: "50%",
                  backfaceVisibility: "hidden",
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TechShowcase3D;
