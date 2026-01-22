import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ManagedProduct } from "@/contexts/ProductContext";
import { FALLBACK_IMAGE, PRODUCT_CATEGORIES } from "@/data/inventory";
import { X, Plus, ImageIcon } from "lucide-react";

interface ProductFormProps {
  product?: ManagedProduct;
  onSubmit: (product: Omit<ManagedProduct, 'id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', '2XL'];
const DEFAULT_COLORS = ['Black', 'White', 'Navy', 'Sand', 'Olive', 'Maroon', 'Heather Gray'];

export const ProductForm = ({ product, onSubmit, onCancel, isLoading }: ProductFormProps) => {
  const [name, setName] = useState(product?.name || '');
  const [sku, setSku] = useState(product?.sku || '');
  const [category, setCategory] = useState(product?.category || 'T-Shirts');
  const [priceUsd, setPriceUsd] = useState(product?.price_usd?.toString() || '');
  const [pricePhp, setPricePhp] = useState(product?.price_php?.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [sizes, setSizes] = useState<string[]>(product?.sizes || ['S', 'M', 'L', 'XL']);
  const [colors, setColors] = useState<string[]>(product?.colors || ['Black', 'White']);
  const [stock, setStock] = useState(product?.stock?.toString() || '100');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-calculate PHP price when USD changes
  useEffect(() => {
    const usdValue = parseFloat(priceUsd);
    if (!isNaN(usdValue) && usdValue > 0) {
      setPricePhp(Math.round(usdValue * 56).toString());
    }
  }, [priceUsd]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!category) newErrors.category = 'Category is required';
    if (!priceUsd || parseFloat(priceUsd) <= 0) newErrors.priceUsd = 'Valid price is required';
    if (sizes.length === 0) newErrors.sizes = 'At least one size is required';
    if (colors.length === 0) newErrors.colors = 'At least one color is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      sku: sku.trim() || `SKU${Date.now()}`,
      category,
      price_usd: parseFloat(priceUsd),
      price_php: parseInt(pricePhp) || Math.round(parseFloat(priceUsd) * 56),
      description: description.trim(),
      images: images.length > 0 ? images : [FALLBACK_IMAGE],
      sizes,
      colors,
      stock: parseInt(stock) || 0,
    });
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleSize = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter(s => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const toggleColor = (color: string) => {
    if (colors.includes(color)) {
      setColors(colors.filter(c => c !== color));
    } else {
      setColors([...colors, color]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Jesus Saves Tee"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g., RWCT001"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.filter(c => c !== 'All').map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
          </div>

          {/* Pricing */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="priceUsd">Price (USD) *</Label>
              <Input
                id="priceUsd"
                type="number"
                step="0.01"
                min="0"
                value={priceUsd}
                onChange={(e) => setPriceUsd(e.target.value)}
                placeholder="24.99"
                className={errors.priceUsd ? 'border-destructive' : ''}
              />
              {errors.priceUsd && <p className="text-sm text-destructive">{errors.priceUsd}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePhp">Price (PHP)</Label>
              <Input
                id="pricePhp"
                type="number"
                min="0"
                value={pricePhp}
                onChange={(e) => setPricePhp(e.target.value)}
                placeholder="1390"
              />
              <p className="text-xs text-muted-foreground">Auto-calculated from USD</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="100"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description (can include Bible verses)"
              rows={3}
            />
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <Label>Available Sizes *</Label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_SIZES.map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant={sizes.includes(size) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
            {errors.sizes && <p className="text-sm text-destructive">{errors.sizes}</p>}
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <Label>Available Colors *</Label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_COLORS.map((color) => (
                <Button
                  key={color}
                  type="button"
                  variant={colors.includes(color) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleColor(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
            {errors.colors && <p className="text-sm text-destructive">{errors.colors}</p>}
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Product Images</Label>
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste image URL here"
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addImage}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {images.length === 0 && (
              <div className="flex items-center justify-center h-24 border-2 border-dashed rounded text-muted-foreground">
                <ImageIcon className="h-8 w-8 mr-2" />
                <span className="text-sm">No images added (placeholder will be used)</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
