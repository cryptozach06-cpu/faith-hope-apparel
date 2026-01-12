import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Eye, Package, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

type Order = {
  id: number;
  created_at: string | null;
  status: string | null;
  total: number | null;
  items: unknown;
  paypal_order_id: string | null;
  redeem_tracking_code: string | null;
  pod_status: string | null;
  pod_tracking: string | null;
  pod_order_id: string | null;
  pod_provider: string | null;
  user_id: string | null;
};

const statusColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  DELIVERED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

const ORDER_STATUSES = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export const OrdersTable = () => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated");
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Error loading orders: {error.message}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No orders yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {orders.length} order{orders.length !== 1 ? "s" : ""} found
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>POD Status</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">
                  {order.redeem_tracking_code || `#${order.id}`}
                </TableCell>
                <TableCell>
                  {order.created_at
                    ? format(new Date(order.created_at), "MMM d, yyyy HH:mm")
                    : "N/A"}
                </TableCell>
                <TableCell>
                  ${order.total?.toFixed(2) || "0.00"}
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status || "PENDING"}
                    onValueChange={(value) => handleStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue>
                        <Badge
                          variant="secondary"
                          className={statusColors[order.status || "PENDING"] || ""}
                        >
                          {order.status || "PENDING"}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          <Badge
                            variant="secondary"
                            className={statusColors[status] || ""}
                          >
                            {status}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {order.pod_status ? (
                    <Badge variant="outline">{order.pod_status}</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {order.pod_tracking || "—"}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          Order Details — {order.redeem_tracking_code || `#${order.id}`}
                        </DialogTitle>
                      </DialogHeader>
                      <OrderDetails order={order} />
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const OrderDetails = ({ order }: { order: Order }) => {
  const items = order.items as OrderItem[] | null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Order ID</p>
          <p className="font-medium">{order.redeem_tracking_code || `#${order.id}`}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Date</p>
          <p className="font-medium">
            {order.created_at
              ? format(new Date(order.created_at), "PPpp")
              : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Status</p>
          <Badge className={statusColors[order.status || "PENDING"] || ""}>
            {order.status || "PENDING"}
          </Badge>
        </div>
        <div>
          <p className="text-muted-foreground">Total</p>
          <p className="font-medium">${order.total?.toFixed(2) || "0.00"}</p>
        </div>
        {order.paypal_order_id && (
          <div>
            <p className="text-muted-foreground">PayPal Order ID</p>
            <p className="font-mono text-xs">{order.paypal_order_id}</p>
          </div>
        )}
        {order.pod_provider && (
          <div>
            <p className="text-muted-foreground">POD Provider</p>
            <p className="font-medium">{order.pod_provider}</p>
          </div>
        )}
        {order.pod_order_id && (
          <div>
            <p className="text-muted-foreground">POD Order ID</p>
            <p className="font-mono text-xs">{order.pod_order_id}</p>
          </div>
        )}
        {order.pod_tracking && (
          <div>
            <p className="text-muted-foreground">Tracking Number</p>
            <p className="font-mono text-xs">{order.pod_tracking}</p>
          </div>
        )}
      </div>

      <div>
        <h4 className="font-semibold mb-3">Order Items</h4>
        {items && items.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.size || "—"}</TableCell>
                    <TableCell>{item.color || "—"}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-muted-foreground">No items data available</p>
        )}
      </div>
    </div>
  );
};
