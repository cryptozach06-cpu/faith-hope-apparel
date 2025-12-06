import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Collections = () => {
  const navigate = useNavigate();
  
  const collections = [
    {
      name: "Scripture Tees",
      description: "Bold scripture verses on premium cotton tees",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop",
      items: 12,
      category: "T-Shirts"
    },
    {
      name: "Faith Hoodies",
      description: "Cozy hoodies with powerful faith messages",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=600&fit=crop",
      items: 8,
      category: "Hoodies"
    },
    {
      name: "Christian Accessories",
      description: "Caps, bags, and more to complete your look",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=600&fit=crop",
      items: 15,
      category: "Accessories"
    },
    {
      name: "Worship Collection",
      description: "Designed for those who lead worship and praise",
      image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&h=600&fit=crop",
      items: 10,
      category: "All"
    },
    {
      name: "Youth Line",
      description: "Fresh designs for the next generation of believers",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop",
      items: 14,
      category: "All"
    },
    {
      name: "Seasonal Specials",
      description: "Limited edition designs for special occasions",
      image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&h=600&fit=crop",
      items: 6,
      category: "All"
    },
  ];

  const handleViewCollection = (category: string) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-montserrat">Collections</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
            Curated collections of modern faith-inspired streetwear, designed to help you 
            share your faith with style.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="relative overflow-hidden h-80">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
                    <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                    <p className="text-primary-foreground/90 mb-4">{collection.description}</p>
                    <p className="text-sm text-primary-foreground/80">{collection.items} items</p>
                  </div>
                </div>
                <div className="p-6">
                  <Button 
                    className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
                    onClick={() => handleViewCollection(collection.category)}
                  >
                    View Collection <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
