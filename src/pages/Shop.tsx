import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { mockInventory, getProductsByCategory, PRODUCT_CATEGORIES } from "@/data/inventory";
import { Button } from "@/components/ui/button";

const Shop = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Set category from URL param on mount
  useEffect(() => {
    if (categoryParam && PRODUCT_CATEGORIES.includes(categoryParam as typeof PRODUCT_CATEGORIES[number])) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);
  
  // Get filtered products using the helper function
  const filteredProducts = getProductsByCategory(selectedCategory);

  // If no products available, show a friendly message
  if (mockInventory.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Shop</h1>
          <p className="text-muted-foreground">Products coming soon! Check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-montserrat">Shop</h1>
          <p className="text-xl text-muted-foreground font-inter">
            Premium Christian streetwear designed for the modern believer
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {PRODUCT_CATEGORIES.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onClick={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
