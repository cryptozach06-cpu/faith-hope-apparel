import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProductCardProps {
  name: string;
  price: string;
  image: string;
  index?: number;
}

export const ProductCard = ({ name, price, image, index = 0 }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300">
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-semibold text-foreground">{name}</h3>
          <p className="text-2xl font-bold text-accent">{price}</p>
          <Button className="w-full">Add to Cart</Button>
        </div>
      </Card>
    </motion.div>
  );
};
