import { motion } from "framer-motion";
import { Truck, Clock, Globe, Package, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ShippingInfo = () => {
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
            Shipping & Delivery
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
        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Alert className="border-primary/20 bg-primary/5">
            <Info className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">Made-to-Order Products</AlertTitle>
            <AlertDescription className="text-base mt-2">
              All RedeemedWearClothing products are made-to-order and printed just for you. This means your 
              order goes through a production process before it ships. Please allow <strong>2–5 business days</strong> for 
              production, after which shipping time begins.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Shipping Timelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Estimated Delivery Times</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* US Shipping */}
            <Card className="h-full border-2">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-primary/10 mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">United States</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Production Time</p>
                  <p className="text-lg font-semibold">2–5 Business Days</p>
                </div>
                <div className="text-2xl font-bold text-primary">+</div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Shipping Time</p>
                  <p className="text-lg font-semibold">3–5 Business Days</p>
                </div>
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Estimated Delivery</p>
                  <p className="text-xl font-bold text-primary">5–10 Business Days</p>
                </div>
              </CardContent>
            </Card>

            {/* International Shipping */}
            <Card className="h-full border-2">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-primary/10 mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">International</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Production Time</p>
                  <p className="text-lg font-semibold">2–5 Business Days</p>
                </div>
                <div className="text-2xl font-bold text-primary">+</div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Shipping Time</p>
                  <p className="text-lg font-semibold">5–20 Business Days</p>
                </div>
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Estimated Delivery</p>
                  <p className="text-xl font-bold text-primary">7–25 Business Days</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Varies by destination country
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Production Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Package,
                step: "1",
                title: "Order Placed",
                description: "Your order is received and confirmed"
              },
              {
                icon: Clock,
                step: "2",
                title: "Production",
                description: "Your item is printed and quality-checked (2–5 days)"
              },
              {
                icon: Truck,
                step: "3",
                title: "Shipped",
                description: "Your order is on its way with tracking info"
              },
              {
                icon: Info,
                step: "4",
                title: "Delivered",
                description: "Enjoy your new faith-inspired apparel!"
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="pt-6">
                    <div className="relative inline-block mb-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
                        <item.icon className="h-7 w-7 text-primary" />
                      </div>
                      <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Important Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Important Information</h2>
          
          {/* International Customers Alert */}
          <Alert className="border-destructive/50 bg-destructive/5">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertTitle className="text-lg font-semibold">
              For International Customers
            </AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p>
                <strong>Customs fees, duties, and import taxes</strong> are NOT included in the product price 
                or shipping cost. These charges are determined by your country's customs office and are the 
                responsibility of the customer.
              </p>
              <p>
                Delivery times may be affected by customs processing in your country. We cannot 
                predict or control these delays.
              </p>
            </AlertDescription>
          </Alert>

          {/* Additional Info Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Tracking Your Order</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>
                  Once your order ships, you'll receive an email with tracking information. 
                  You can use this to follow your package's journey.
                </p>
                <p>
                  Please note that tracking updates may be delayed for international shipments, 
                  especially during customs processing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Address Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>
                  Please double-check your shipping address before placing your order. 
                  We are not responsible for orders shipped to incorrect addresses provided by the customer.
                </p>
                <p>
                  Orders marked as delivered by the carrier based on the address you provided 
                  cannot be refunded or reshipped.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Peak Season Delays</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>
                  During holidays and peak shopping seasons (Black Friday, Christmas, etc.), 
                  production and shipping times may be longer than usual.
                </p>
                <p>
                  We recommend ordering early for time-sensitive deliveries.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>
                  If you have questions about your order or shipping, please don't hesitate 
                  to reach out to our customer support team.
                </p>
                <p>
                  We're here to help and will do our best to assist you with any concerns.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Final Disclaimer */}
          <div className="text-center text-sm text-muted-foreground bg-muted/30 rounded-lg p-6 mt-8">
            <p className="mb-2">
              <strong>Please Note:</strong> All delivery times are estimates and not guaranteed. 
              Actual delivery times may vary based on carrier performance, customs processing, 
              weather conditions, and other factors beyond our control.
            </p>
            <p>
              We appreciate your patience and understanding as we work to get your order to you safely.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShippingInfo;
