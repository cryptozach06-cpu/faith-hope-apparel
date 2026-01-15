import { motion } from "framer-motion";
import { Truck, Clock, Globe, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ShippingInfo = () => {
  const shippingMethods = [
    {
      icon: Package,
      title: "Standard Shipping",
      time: "5-7 Business Days",
      price: "Free on orders over $75",
      description: "Our most economical option for domestic orders.",
    },
    {
      icon: Truck,
      title: "Express Shipping",
      time: "2-3 Business Days",
      price: "$12.99",
      description: "Faster delivery for when you need it sooner.",
    },
    {
      icon: Clock,
      title: "Priority Shipping",
      time: "1-2 Business Days",
      price: "$19.99",
      description: "Our fastest domestic shipping option.",
    },
    {
      icon: Globe,
      title: "International Shipping",
      time: "7-14 Business Days",
      price: "Calculated at checkout",
      description: "We ship to most countries worldwide.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Shipping Information
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-primary-foreground/80 max-w-2xl mx-auto"
          >
            Everything you need to know about getting your RedeemedWearClothing order delivered.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Shipping Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Shipping Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shippingMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader className="text-center">
                    <method.icon className="h-12 w-12 mx-auto text-primary mb-4" />
                    <CardTitle className="text-xl">{method.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-lg font-semibold text-primary mb-2">{method.time}</p>
                    <p className="text-muted-foreground mb-2">{method.price}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <div>
            <h3 className="text-2xl font-bold mb-4">Order Processing</h3>
            <p className="text-muted-foreground">
              All orders are processed within 1-2 business days (excluding weekends and holidays). 
              Once your order has shipped, you will receive a confirmation email with tracking information.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Print-on-Demand Items</h3>
            <p className="text-muted-foreground">
              Some of our items are made-to-order using print-on-demand services. These items may take 
              an additional 3-5 business days to produce before shipping. This ensures each piece is 
              crafted with care specifically for you.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Tracking Your Order</h3>
            <p className="text-muted-foreground">
              Once your order ships, you'll receive an email with a tracking number. You can use this 
              to track your package's journey to your doorstep. If you have any questions about your 
              shipment, please contact our customer support team.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">International Orders</h3>
            <p className="text-muted-foreground">
              International customers may be subject to customs duties and taxes, which are the 
              responsibility of the recipient. Delivery times may vary based on customs processing 
              in your country.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShippingInfo;
