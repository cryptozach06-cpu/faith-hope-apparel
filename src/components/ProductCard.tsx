import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Product } from "@/data/inventory";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ProductCardProps {
  product: Product;
  index?: number;
  onClick: () => void;
}

export const ProductCard = ({ product, index = 0, onClick }: ProductCardProps) => {
  const { formatPrice } = useCurrency();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card 
        className="overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={onClick}
      >
        <div className="relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6 space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <p className="text-2xl font-bold text-accent">{formatPrice(product.price_usd)}</p>
        </div>
      </Card>
    </motion.div>
  );
};
