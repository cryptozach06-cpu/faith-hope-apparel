import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mockInventory, Product, FALLBACK_IMAGE } from '@/data/inventory';
import { useToast } from '@/hooks/use-toast';

export interface ManagedProduct {
  id: number;
  sku: string;
  category: string;
  name: string;
  price_usd: number;
  price_php: number;
  sizes: string[];
  colors: string[];
  images: string[];
  description: string;
  stock?: number;
}

interface ProductContextType {
  products: ManagedProduct[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<ManagedProduct, 'id'>) => Promise<boolean>;
  updateProduct: (id: number, product: Partial<ManagedProduct>) => Promise<boolean>;
  deleteProduct: (id: number) => Promise<boolean>;
  refreshProducts: () => Promise<void>;
  getProductById: (id: number) => ManagedProduct | undefined;
  getProductsByCategory: (category: string) => ManagedProduct[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

// Convert inventory.ts Product to ManagedProduct format
const convertToManagedProduct = (product: Product): ManagedProduct => ({
  ...product,
  stock: 100, // Default stock for static products
});

// Convert Supabase product to ManagedProduct format
const convertSupabaseProduct = (dbProduct: any): ManagedProduct => ({
  id: dbProduct.id,
  sku: dbProduct.sku || `SKU${dbProduct.id}`,
  category: dbProduct.category,
  name: dbProduct.name,
  price_usd: Number(dbProduct.price_usd) || 0,
  price_php: Math.round((Number(dbProduct.price_usd) || 0) * 56), // Approximate PHP conversion
  sizes: ['S', 'M', 'L', 'XL'], // Default sizes
  colors: ['Black', 'White'], // Default colors
  images: dbProduct.images?.length > 0 ? dbProduct.images : [FALLBACK_IMAGE],
  description: dbProduct.description || 'No description available.',
  stock: dbProduct.stock || 0,
});

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useSupabase, setUseSupabase] = useState(true);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to fetch from Supabase first
      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (supabaseError) {
        console.warn('Supabase fetch failed, using static inventory:', supabaseError);
        setUseSupabase(false);
        setProducts(mockInventory.map(convertToManagedProduct));
      } else {
        // Supabase is reachable — always use it for writes
        setUseSupabase(true);
        if (data && data.length > 0) {
          setProducts(data.map(convertSupabaseProduct));
        } else {
          // No products yet in DB, show static inventory as read-only preview
          console.info('No products in DB yet, showing static inventory preview');
          setProducts(mockInventory.map(convertToManagedProduct));
        }
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      // Fallback to static inventory
      setProducts(mockInventory.map(convertToManagedProduct));
      setUseSupabase(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (product: Omit<ManagedProduct, 'id'>): Promise<boolean> => {
    try {
      if (useSupabase) {
        const { data, error: insertError } = await supabase
          .from('products')
          .insert({
            name: product.name,
            category: product.category,
            price_usd: product.price_usd,
            sku: product.sku,
            images: product.images,
            description: product.description,
            stock: product.stock || 0,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        if (data) {
          // Refresh all products to get accurate state
          await fetchProducts();
          toast({ title: 'Product added successfully!' });
          return true;
        }
      } else {
        // Local mode - add to state only
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        const newProduct: ManagedProduct = { ...product, id: newId };
        setProducts(prev => [...prev, newProduct]);
        toast({ title: 'Product added (local mode)', description: 'Changes will not persist after refresh.' });
        return true;
      }
    } catch (err: any) {
      console.error('Error adding product:', err);
      toast({ title: 'Failed to add product', description: err.message, variant: 'destructive' });
    }
    return false;
  };

  const updateProduct = async (id: number, updates: Partial<ManagedProduct>): Promise<boolean> => {
    try {
      if (useSupabase) {
        // Check if product actually exists in DB
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .eq('id', id)
          .maybeSingle();

        if (existing) {
          // Product exists in DB — update it
          const { error: updateError } = await supabase
            .from('products')
            .update({
              name: updates.name,
              category: updates.category,
              price_usd: updates.price_usd,
              sku: updates.sku,
              images: updates.images,
              description: updates.description,
              stock: updates.stock,
            })
            .eq('id', id);

          if (updateError) throw updateError;
        } else {
          // Product is a static preview — insert as new DB product
          const { error: insertError } = await supabase
            .from('products')
            .insert({
              name: updates.name,
              category: updates.category,
              price_usd: updates.price_usd,
              sku: updates.sku,
              images: updates.images,
              description: updates.description,
              stock: updates.stock || 0,
            });

          if (insertError) throw insertError;
        }

        await fetchProducts();
        toast({ title: 'Product saved successfully!' });
        return true;
      } else {
        // Local mode
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
        toast({ title: 'Product updated (local mode)', description: 'Changes will not persist after refresh.' });
        return true;
      }
    } catch (err: any) {
      console.error('Error updating product:', err);
      toast({ title: 'Failed to update product', description: err.message, variant: 'destructive' });
    }
    return false;
  };

  const deleteProduct = async (id: number): Promise<boolean> => {
    try {
      if (useSupabase) {
        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;

        setProducts(prev => prev.filter(p => p.id !== id));
        toast({ title: 'Product deleted successfully!' });
        return true;
      } else {
        // Local mode
        setProducts(prev => prev.filter(p => p.id !== id));
        toast({ title: 'Product deleted (local mode)', description: 'Changes will not persist after refresh.' });
        return true;
      }
    } catch (err: any) {
      console.error('Error deleting product:', err);
      toast({ title: 'Failed to delete product', description: err.message, variant: 'destructive' });
    }
    return false;
  };

  const getProductById = (id: number): ManagedProduct | undefined => {
    return products.find(p => p.id === id);
  };

  const getProductsByCategory = (category: string): ManagedProduct[] => {
    if (category === 'All') return products;
    return products.filter(p => p.category === category);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts: fetchProducts,
        getProductById,
        getProductsByCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
