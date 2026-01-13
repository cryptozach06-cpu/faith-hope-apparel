import { Card } from "@/components/ui/card";
import { DollarSign, Package, TrendingUp, Clock } from "lucide-react";

interface OrderStatsProps {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  shippedOrders: number;
}

export const OrderStats = ({
  totalOrders,
  totalRevenue,
  pendingOrders,
  shippedOrders,
}: OrderStatsProps) => {
  const stats = [
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      label: "Processing",
      value: pendingOrders.toString(),
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
    },
    {
      label: "Shipped",
      value: shippedOrders.toString(),
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
