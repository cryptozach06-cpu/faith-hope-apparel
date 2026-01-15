import { motion } from "framer-motion";
import { RotateCcw, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ReturnsExchanges = () => {
  const policies = [
    {
      icon: RotateCcw,
      title: "30-Day Returns",
      description: "Return any unworn item within 30 days of delivery for a full refund.",
    },
    {
      icon: RefreshCw,
      title: "Free Exchanges",
      description: "Exchange for a different size or color at no additional cost.",
    },
    {
      icon: CheckCircle,
      title: "Easy Process",
      description: "Simple online return portal with prepaid shipping labels.",
    },
    {
      icon: AlertCircle,
      title: "Quality Guarantee",
      description: "Defective items replaced immediately, no questions asked.",
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
            Returns & Exchanges
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-primary-foreground/80 max-w-2xl mx-auto"
          >
            We want you to love your purchase. If something isn't right, we're here to help.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Policy Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {policies.map((policy, index) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardHeader>
                    <policy.icon className="h-12 w-12 mx-auto text-primary mb-4" />
                    <CardTitle className="text-xl">{policy.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{policy.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Detailed Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <div>
            <h3 className="text-2xl font-bold mb-4">Return Policy</h3>
            <p className="text-muted-foreground mb-4">
              We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in 
              their original condition with all tags attached. To initiate a return, please contact 
              our customer service team.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Items must be in original, unused condition</li>
              <li>All tags must be attached</li>
              <li>Original packaging preferred but not required</li>
              <li>Refunds processed within 5-7 business days of receiving your return</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Exchange Process</h3>
            <p className="text-muted-foreground mb-4">
              Need a different size or color? We offer free exchanges on all orders. Simply contact 
              us within 30 days of receiving your order, and we'll arrange the exchange.
            </p>
            <ol className="list-decimal list-inside text-muted-foreground space-y-2">
              <li>Contact our customer service team</li>
              <li>Receive a prepaid return label</li>
              <li>Ship the original item back to us</li>
              <li>We'll ship your new item once we receive the return</li>
            </ol>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Non-Returnable Items</h3>
            <p className="text-muted-foreground mb-4">
              The following items cannot be returned or exchanged:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Items marked as final sale</li>
              <li>Items that have been worn, washed, or altered</li>
              <li>Items without original tags</li>
              <li>Gift cards</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Defective Items</h3>
            <p className="text-muted-foreground">
              If you receive a defective item, please contact us immediately. We will replace the 
              item at no cost to you or provide a full refund. Please include photos of the defect 
              in your communication to help us process your request quickly.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
            <p className="text-muted-foreground">
              For any questions about returns or exchanges, please email us at{" "}
              <a href="mailto:support@redeemedwearclothing.com" className="text-primary hover:underline">
                support@redeemedwearclothing.com
              </a>{" "}
              or visit our Contact page.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReturnsExchanges;
