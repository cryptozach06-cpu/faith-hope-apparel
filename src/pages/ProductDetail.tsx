import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useProducts } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FALLBACK_IMAGE } from "@/data/inventory";
import { Loader2 } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { getProductById, loading } = useProducts();
  
  const product = getProductById(Number(id));
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState(0);

  // Set initial size and color when product loads
  useEffect(() => {
    if (product) {
      setSize(product.sizes?.[0] || "");
      setColor(product.colors?.[0] || "");
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate("/shop")}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Convert ManagedProduct to Product format for cart
    const cartProduct = {
      id: product.id,
      sku: product.sku,
      category: product.category,
      name: product.name,
      price_usd: product.price_usd,
      price_php: product.price_php,
      sizes: product.sizes,
      colors: product.colors,
      images: product.images,
      description: product.description,
    };
    
    addToCart(cartProduct, { size, color, qty });
    toast({
      title: "Added to cart",
      description: `${qty}x ${product.name} (${size}, ${color})`,
    });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          {/* Image Gallery */}
          <div>
            <div className="rounded-lg overflow-hidden mb-4 bg-muted">
              <img
                src={product.images[mainImage] || FALLBACK_IMAGE}
                alt={product.name}
                className="w-full object-cover aspect-square"
                onError={handleImageError}
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className={`w-20 h-20 object-cover rounded cursor-pointer transition ${
                      mainImage === i ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"
                    }`}
                    onClick={() => setMainImage(i)}
                    onError={handleImageError}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold mb-2 font-montserrat">{product.name}</h1>
            <p className="text-3xl font-bold text-accent mb-4">{formatPrice(product.price_usd)}</p>
            <p className="text-muted-foreground mb-6 font-inter">{product.description}</p>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block mb-2 font-semibold">Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-4 py-2 border rounded-lg transition ${
                        size === s
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:border-primary"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block mb-2 font-semibold">Color</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`px-4 py-2 border rounded-lg transition ${
                        color === c
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:border-primary"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold">Quantity</label>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                className="w-24 border rounded-lg px-3 py-2 bg-background"
              />
            </div>

            <Button size="lg" className="w-full mb-4" onClick={handleAddToCart}>
              Add to Cart
            </Button>

            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
