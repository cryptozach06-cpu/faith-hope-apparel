import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useProducts, ManagedProduct } from "@/contexts/ProductContext";
import { ProductForm } from "./ProductForm";
import { FALLBACK_IMAGE } from "@/data/inventory";
import { Plus, Edit, Trash2, Search, Package, Loader2 } from "lucide-react";

export const ProductsManager = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ManagedProduct | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = async (productData: Omit<ManagedProduct, 'id'>) => {
    setIsSubmitting(true);
    const success = await addProduct(productData);
    setIsSubmitting(false);
    if (success) {
      setShowForm(false);
    }
  };

  const handleUpdateProduct = async (productData: Omit<ManagedProduct, 'id'>) => {
    if (!editingProduct) return;
    setIsSubmitting(true);
    const success = await updateProduct(editingProduct.id, productData);
    setIsSubmitting(false);
    if (success) {
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = async () => {
    if (deleteId === null) return;
    await deleteProduct(deleteId);
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (showForm) {
    return (
      <ProductForm
        onSubmit={handleAddProduct}
        onCancel={() => setShowForm(false)}
        isLoading={isSubmitting}
      />
    );
  }

  if (editingProduct) {
    return (
      <ProductForm
        product={editingProduct}
        onSubmit={handleUpdateProduct}
        onCancel={() => setEditingProduct(null)}
        isLoading={isSubmitting}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Products</h2>
          <p className="text-muted-foreground text-sm">{products.length} products in your store</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products by name, SKU, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {searchQuery ? 'Try a different search term' : 'Get started by adding your first product'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Product Image */}
                  <div className="sm:w-32 h-32 flex-shrink-0">
                    <img
                      src={product.images[0] || FALLBACK_IMAGE}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 p-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{product.name}</h3>
                          <Badge variant="secondary">{product.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="font-bold text-lg">${product.price_usd.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">₱{product.price_php}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingProduct(product)}
                            className="gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteId(product.id)}
                            className="gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.sizes.map((size) => (
                        <Badge key={size} variant="outline" className="text-xs">
                          {size}
                        </Badge>
                      ))}
                      <span className="text-muted-foreground mx-1">|</span>
                      {product.colors.slice(0, 3).map((color) => (
                        <Badge key={color} variant="outline" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                      {product.colors.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.colors.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from your store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
