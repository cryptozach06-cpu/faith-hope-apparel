import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ShieldAlert, LayoutDashboard, Package, ShoppingCart, Truck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { ProductsManager } from "@/components/admin/ProductsManager";
import { ShippingEditor } from "@/components/admin/ShippingEditor";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

type AdminTab = 'overview' | 'products' | 'orders' | 'shipping';

const navItems = [
  { id: 'overview' as AdminTab, label: 'Overview', icon: LayoutDashboard },
  { id: 'products' as AdminTab, label: 'Products', icon: Package },
  { id: 'orders' as AdminTab, label: 'Orders', icon: ShoppingCart },
  { id: 'shipping' as AdminTab, label: 'Shipping', icon: Truck },
];

const Admin = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto text-center"
          >
            <Card className="p-8">
              <ShieldAlert className="h-16 w-16 mx-auto mb-4 text-destructive" />
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-muted-foreground mb-6">
                You don't have admin privileges to access this page.
              </p>
              <Button onClick={() => navigate("/")} variant="outline">
                Go to Home
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'products':
        return <ProductsManager />;
      case 'orders':
        return <OrdersTable />;
      case 'shipping':
        return <ShippingEditor />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 min-h-screen bg-background border-r">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold font-montserrat">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your store</p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Mobile Header */}
          <header className="md:hidden flex items-center justify-between p-4 border-b bg-background">
            <h1 className="text-lg font-bold">Admin</h1>
            <AdminMobileNav
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab as AdminTab)}
              onSignOut={handleSignOut}
            />
          </header>

          {/* Page Content */}
          <div className="p-4 md:p-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
