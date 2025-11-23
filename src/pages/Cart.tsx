import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, updateQty, removeFromCart, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const [customer, setCustomer] = useState({ name: "", email: "" });

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const handlePlaceOrder = () => {
    if (!customer.name || !customer.email) {
      toast({
        title: "Missing information",
        description: "Please enter your name and email",
        variant: "destructive",
      });
      return;
    }

    const orderId = `ORD-${Date.now()}`;
    clearCart();
    toast({
      title: "Order placed successfully!",
      description: `Order ${orderId} - Thank you for your purchase!`,
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-8 font-montserrat">Your Cart</h1>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-6">Your cart is empty</p>
              <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
            </div>
          ) : (
            <div>
              {/* Cart Items */}
              <div className="space-y-4 mb-8">
                {cart.map(item => (
                  <motion.div
                    key={`${item.sku}-${item.size}-${item.color}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.size} • {item.color}
                      </p>
                      <p className="font-bold text-accent mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={e =>
                          updateQty(item.sku, item.size, item.color, Number(e.target.value))
                        }
                        className="w-20"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.sku, item.size, item.color)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="rounded-lg border p-6 bg-card">
                <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold">{formatPrice(total)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Shipping & taxes will be calculated at checkout.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <Input
                    placeholder="Full name"
                    value={customer.name}
                    onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))}
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={customer.email}
                    onChange={e => setCustomer(c => ({ ...c, email: e.target.value }))}
                  />
                </div>

                <Button size="lg" className="w-full" onClick={handlePlaceOrder}>
                  Place Order
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
