import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";

const Shop = () => {
  const products = [
    { name: "Jesus Saves Tee", price: "₱899", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop" },
    { name: "Faith Over Fear Hoodie", price: "₱1,499", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop" },
    { name: "God Is Greater Sweatshirt", price: "₱1,299", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&h=800&fit=crop" },
    { name: "Blessed Cap", price: "₱599", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop" },
    { name: "Chosen Tee", price: "₱899", image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&h=800&fit=crop" },
    { name: "Grace & Truth Hoodie", price: "₱1,499", image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=800&fit=crop" },
    { name: "Armor of God Tee", price: "₱899", image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&h=800&fit=crop" },
    { name: "Hope Anchor Sweatshirt", price: "₱1,299", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=800&fit=crop" },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Shop All Products</h1>
          <p className="text-xl text-muted-foreground">Premium Christian apparel for believers worldwide</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.name}
              {...product}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
