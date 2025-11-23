import { motion } from "framer-motion";
import { mockInventory } from "@/data/inventory";
import { Card } from "@/components/ui/card";

const Admin = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-8 font-montserrat">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inventory */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Inventory</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Quick view of products (edit functionality coming soon)
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {mockInventory.map(item => (
                  <div
                    key={item.id}
                    className="text-sm p-2 border rounded flex justify-between"
                  >
                    <span>
                      {item.sku} — {item.name}
                    </span>
                    <span className="text-muted-foreground">Stock: 100</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Orders */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Orders</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Orders will appear here when placed (currently mocked client-side)
              </p>
              <div className="space-y-4">
                <p className="text-sm">
                  Export CSV / Connect to fulfillment partners from here.
                </p>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-semibold mb-2">Coming Soon:</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Real-time order tracking</li>
                    <li>• Inventory management</li>
                    <li>• Sales analytics</li>
                    <li>• Customer management</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
