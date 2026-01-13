import { useState, useMemo } from "react";
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
import { Loader2, Eye, Package, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { OrderFilters } from "./OrderFilters";
import { OrderStats } from "./OrderStats";

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
const ITEMS_PER_PAGE = 10;

export const OrdersTable = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

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

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    return orders.filter((order) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        order.redeem_tracking_code?.toLowerCase().includes(searchLower) ||
        order.pod_tracking?.toLowerCase().includes(searchLower) ||
        order.paypal_order_id?.toLowerCase().includes(searchLower) ||
        order.id.toString().includes(searchLower);

      // Status filter
      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;

      // Date range filter
      let matchesDate = true;
      if (dateRange?.from && order.created_at) {
        const orderDate = new Date(order.created_at);
        if (dateRange.to) {
          matchesDate = isWithinInterval(orderDate, {
            start: startOfDay(dateRange.from),
            end: endOfDay(dateRange.to),
          });
        } else {
          matchesDate = orderDate >= startOfDay(dateRange.from);
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchQuery, statusFilter, dateRange]);

  const stats = useMemo(() => {
    if (!orders) return { totalOrders: 0, totalRevenue: 0, pendingOrders: 0, shippedOrders: 0 };

    return {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
      pendingOrders: orders.filter((o) => o.status === "PROCESSING" || o.status === "PAID").length,
      shippedOrders: orders.filter((o) => o.status === "SHIPPED" || o.status === "DELIVERED").length,
    };
  }, [orders]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "ALL" || dateRange !== undefined;

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setDateRange(undefined);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    if (!filteredOrders.length) {
      toast.error("No orders to export");
      return;
    }

    const headers = [
      "Order ID",
      "Date",
      "Status",
      "Total",
      "POD Status",
      "POD Provider",
      "Tracking",
      "PayPal Order ID",
      "Items",
    ];

    const rows = filteredOrders.map((order) => {
      const items = order.items as OrderItem[] | null;
      const itemsSummary = items?.map((i) => `${i.name} x${i.quantity}`).join("; ") || "";
      
      return [
        order.redeem_tracking_code || `#${order.id}`,
        order.created_at ? format(new Date(order.created_at), "yyyy-MM-dd HH:mm:ss") : "",
        order.status || "",
        order.total?.toFixed(2) || "0.00",
        order.pod_status || "",
        order.pod_provider || "",
        order.pod_tracking || "",
        order.paypal_order_id || "",
        `"${itemsSummary}"`,
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `orders-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    toast.success("Orders exported to CSV");
  };

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

  return (
    <div className="space-y-6">
      <OrderStats {...stats} />

      <OrderFilters
        searchQuery={searchQuery}
        onSearchChange={(v) => { setSearchQuery(v); setCurrentPage(1); }}
        statusFilter={statusFilter}
        onStatusFilterChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
        dateRange={dateRange}
        onDateRangeChange={(r) => { setDateRange(r); setCurrentPage(1); }}
        onExportCSV={handleExportCSV}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {paginatedOrders.length} of {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{hasActiveFilters ? "No orders match your filters" : "No orders yet"}</p>
        </div>
      ) : (
        <>
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
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.redeem_tracking_code || `#${order.id}`}
                    </TableCell>
                    <TableCell>
                      {order.created_at
                        ? format(new Date(order.created_at), "MMM d, yyyy HH:mm")
                        : "N/A"}
                    </TableCell>
                    <TableCell>${order.total?.toFixed(2) || "0.00"}</TableCell>
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
                              <Badge variant="secondary" className={statusColors[status] || ""}>
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
                          <Button variant="ghost" size="sm">
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

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
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
            {order.created_at ? format(new Date(order.created_at), "PPpp") : "N/A"}
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
