import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Cart = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { cart, updateQty, removeFromCart, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const [customer, setCustomer] = useState({ name: "", email: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  useEffect(() => {
    const success = searchParams.get('success');
    const paypalOrderId = searchParams.get('token');
    
    if (success === 'true' && paypalOrderId) {
      handlePayPalReturn(paypalOrderId);
    }
  }, [searchParams]);

  const handlePayPalReturn = async (paypalOrderId: string) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('paypal-capture-order', {
        body: {
          orderId: paypalOrderId,
          customerEmail: customer.email,
          items: cart,
        },
      });

      if (error) throw error;

      clearCart();
      toast({
        title: "Payment successful!",
        description: "Your order has been placed and will be processed shortly.",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Payment capture error:', error);
      toast({
        title: "Payment processing failed",
        description: error.message || "Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = async () => {
    if (!customer.email) {
      toast({
        title: "Missing information",
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('paypal-create-order', {
        body: {
          items: cart,
          customerEmail: customer.email,
        },
      });

      if (error) throw error;

      // Redirect to PayPal
      if (data.approveUrl) {
        window.location.href = data.approveUrl;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
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

                <div className="space-y-3 mb-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={customer.email}
                    onChange={e => setCustomer(c => ({ ...c, email: e.target.value }))}
                    disabled={isProcessing}
                  />
                </div>

                <Button 
                  size="lg" 
                  className="w-full" 
                  onClick={handleCheckout}
                  disabled={isProcessing || cart.length === 0}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Checkout with PayPal'
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center mt-2">
                  You'll be redirected to PayPal to complete your purchase
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
