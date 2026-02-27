import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Product, FALLBACK_IMAGE } from "@/data/inventory";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ProductCardProps {
  product: Product;
  index?: number;
  onClick: () => void;
}

export const ProductCard = ({ product, index = 0, onClick }: ProductCardProps) => {
  const { formatPrice } = useCurrency();
  const [imageError, setImageError] = useState(false);
  
  // Use the first image, or fallback if it's missing or failed to load
  const imageSrc = imageError || !product.images?.[0]
    ? FALLBACK_IMAGE
    : product.images[0];

  // Some source images include large built-in whitespace; tighten visual crop for consistency
  const isBornReady = /born\s*ready/i.test(product.name || "");
  const imageClassName = [
    "absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300",
    isBornReady
      ? "object-[center_28%] scale-[1.18] group-hover:scale-[1.22]"
      : "group-hover:scale-105",
  ].join(" ");
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5) }}
    >
      <Card 
        className="h-full overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={onClick}
      >
        <div className="relative overflow-hidden bg-muted aspect-square">
          <img
            src={imageSrc}
            alt={product.name || "Product image"}
            className={imageClassName}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
        <div className="p-6 space-y-2">
          <h3 className="min-h-[3.5rem] text-xl font-semibold leading-snug text-foreground">{product.name || "Unnamed Product"}</h3>
          <p className="text-sm text-muted-foreground">{product.category || "Uncategorized"}</p>
          <p className="text-2xl font-bold text-accent">
            {formatPrice(typeof product.price_usd === 'number' ? product.price_usd : 0)}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
