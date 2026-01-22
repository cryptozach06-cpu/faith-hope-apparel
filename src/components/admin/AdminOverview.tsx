import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/contexts/ProductContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

export const AdminOverview = () => {
  const { products } = useProducts();

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders-overview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching orders:', error);
        return [];
      }
      return data || [];
    },
  });

  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'PAID' || o.status === 'PROCESSING').length;
  const shippedOrders = orders.filter(o => o.status === 'SHIPPED' || o.status === 'DELIVERED').length;

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      description: "Active products in store",
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      description: "All time orders",
    },
    {
      title: "Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: "Total revenue",
    },
    {
      title: "Pending",
      value: pendingOrders,
      icon: TrendingUp,
      description: "Orders to fulfill",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No orders yet</p>
            ) : (
              <div className="space-y-2">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm font-medium">Order #{order.id}</span>
                    <span className="text-sm text-muted-foreground">${Number(order.total || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <p className="text-muted-foreground text-sm">No products yet</p>
            ) : (
              <div className="space-y-2">
                {['T-Shirts', 'Hoodies', 'Caps', 'Accessories'].map((category) => {
                  const count = products.filter(p => p.category === category).length;
                  return (
                    <div key={category} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm text-muted-foreground">{count} items</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
