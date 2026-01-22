/**
 * ============================================================================
 * PRODUCT INVENTORY - EDIT THIS FILE TO ADD/UPDATE YOUR PRODUCTS
 * ============================================================================
 * 
 * HOW TO ADD A NEW PRODUCT:
 * -------------------------
 * 1. Copy an existing product entry (everything between { and },)
 * 2. Paste it at the end of the list (before the closing bracket ])
 * 3. Update the values for your new product
 * 4. Make sure to change the "id" to a unique number (just use the next number)
 * 5. Save the file and refresh your browser
 * 
 * PRODUCT FIELDS EXPLAINED:
 * -------------------------
 * - id: A unique number for each product (1, 2, 3, etc.) - MUST BE UNIQUE!
 * - sku: Product code (format: RWCT001 for T-Shirts, RWCH001 for Hoodies, etc.)
 * - category: "T-Shirts", "Hoodies", "Caps", or "Accessories"
 * - name: Product name shown to customers
 * - price_usd: Price in US Dollars (e.g., 24.99)
 * - price_php: Price in Philippine Pesos (e.g., 1390)
 * - sizes: Available sizes in quotes, separated by commas: ["S","M","L","XL"]
 * - colors: Available colors in quotes, separated by commas: ["White","Black"]
 * - images: Image URLs in quotes (can add multiple): ["url1", "url2"]
 * - description: Product description, can include Bible verses
 * 
 * IMAGE GUIDELINES:
 * -----------------
 * - Recommended size: 800x800 pixels (square images work best)
 * - Supported formats: JPG, PNG, WebP
 * - You can use external image URLs (like Unsplash) or upload to the public folder
 * - If uploading images: put them in public/products/ and use "/products/filename.jpg"
 * 
 * EXAMPLE - Adding a new T-Shirt:
 * -------------------------------
 * {
 *   id: 13,
 *   sku: "RWCT004",
 *   category: "T-Shirts",
 *   name: "My New Design Tee",
 *   price_usd: 24.99,
 *   price_php: 1390,
 *   sizes: ["S", "M", "L", "XL"],
 *   colors: ["White", "Black"],
 *   images: ["https://your-image-url.jpg"],
 *   description: "Your product description here. - Philippians 4:13"
 * },
 * 
 * TIPS:
 * -----
 * - Always include a comma after each product entry (except the very last one)
 * - Keep quotes around text values
 * - Keep prices as numbers (no quotes, no dollar sign)
 * - Test after adding to make sure the site still works
 * 
 * ============================================================================
 */

export interface Product {
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
}

// Default/fallback image if product image is missing or broken
export const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop";

// Default values for missing product data
const DEFAULT_PRODUCT_VALUES = {
  name: "Product",
  price_usd: 0,
  price_php: 0,
  sizes: ["One Size"],
  colors: ["Default"],
  description: "No description available."
};

/**
 * Validates and sanitizes a product to ensure it has all required fields.
 * This prevents the site from crashing if product data is incomplete.
 */
function validateProduct(product: Partial<Product>, index: number): Product {
  return {
    id: product.id ?? index + 1,
    sku: product.sku ?? `SKU${index + 1}`,
    category: product.category ?? "Uncategorized",
    name: product.name ?? DEFAULT_PRODUCT_VALUES.name,
    price_usd: typeof product.price_usd === 'number' && product.price_usd >= 0 ? product.price_usd : DEFAULT_PRODUCT_VALUES.price_usd,
    price_php: typeof product.price_php === 'number' && product.price_php >= 0 ? product.price_php : DEFAULT_PRODUCT_VALUES.price_php,
    sizes: Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : DEFAULT_PRODUCT_VALUES.sizes,
    colors: Array.isArray(product.colors) && product.colors.length > 0 ? product.colors : DEFAULT_PRODUCT_VALUES.colors,
    images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [FALLBACK_IMAGE],
    description: product.description ?? DEFAULT_PRODUCT_VALUES.description,
  };
}

/**
 * ============================================================================
 * YOUR PRODUCT LIST - EDIT BELOW TO ADD/UPDATE PRODUCTS
 * ============================================================================
 */
const rawInventory: Partial<Product>[] = [
  // ==================== T-SHIRTS ====================
  { 
    id: 1, 
    sku: "RWCT001", 
    category: "T-Shirts", 
    name: "Jesus Saves Tee", 
    price_usd: 24.99, 
    price_php: 1390, 
    sizes: ["S","M","L","XL"], 
    colors: ["White","Black","Navy"], 
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop"], 
    description: "Soft cotton tee with bold Gospel message." 
  },
  { 
    id: 2, 
    sku: "RWCT002", 
    category: "T-Shirts", 
    name: "Redeemed Script Tee", 
    price_usd: 26.99, 
    price_php: 1490, 
    sizes: ["S","M","L","XL"], 
    colors: ["Sand","Olive","Black"], 
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop"], 
    description: "Script typography tee inspired by Scripture." 
  },
  { 
    id: 3, 
    sku: "RWCT003", 
    category: "T-Shirts", 
    name: "Be Still Psalm 46:10 Tee", 
    price_usd: 24.99, 
    price_php: 1390, 
    sizes: ["S","M","L","XL"], 
    colors: ["White","Heather Gray"], 
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop"], 
    description: "Typographic design reminding believers to be still." 
  },
  
  // ==================== HOODIES ====================
  { 
    id: 4, 
    sku: "RWCH001", 
    category: "Hoodies", 
    name: "Cross Minimalist Hoodie", 
    price_usd: 49.99, 
    price_php: 2790, 
    sizes: ["S","M","L","XL"], 
    colors: ["Black","Navy"], 
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop"], 
    description: "Minimal cross emblem hoodie in premium fleece." 
  },
  { 
    id: 5, 
    sku: "RWCH002", 
    category: "Hoodies", 
    name: "Walk by Faith Hoodie", 
    price_usd: 52.99, 
    price_php: 2990, 
    sizes: ["S","M","L","XL"], 
    colors: ["White","Sand"], 
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop"], 
    description: "A hoodie that proclaims faith in action." 
  },
  { 
    id: 6, 
    sku: "RWCH003", 
    category: "Hoodies", 
    name: "Lion of Judah Hoodie", 
    price_usd: 54.99, 
    price_php: 3190, 
    sizes: ["S","M","L","XL"], 
    colors: ["Black","Maroon"], 
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop"], 
    description: "Premium hoodie honoring Christ the King." 
  },
  
  // ==================== CAPS ====================
  { 
    id: 7, 
    sku: "RWCC001", 
    category: "Caps", 
    name: "RedeemedWearClothing Cross Cap", 
    price_usd: 19.99, 
    price_php: 990, 
    sizes: ["One Size"], 
    colors: ["Black","White"], 
    images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop"], 
    description: "Classic embroidered cross cap." 
  },
  { 
    id: 8, 
    sku: "RWCC002", 
    category: "Caps", 
    name: "Blessed Embroidered Cap", 
    price_usd: 21.99, 
    price_php: 1090, 
    sizes: ["One Size"], 
    colors: ["Navy","Olive"], 
    images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop"], 
    description: "Detailed embroidery for daily wear." 
  },
  { 
    id: 9, 
    sku: "RWCC003", 
    category: "Caps", 
    name: "Saved by Grace Cap", 
    price_usd: 19.99, 
    price_php: 990, 
    sizes: ["One Size"], 
    colors: ["Khaki","Black"], 
    images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop"], 
    description: "Comfortable cap with Gospel message." 
  },
  
  // ==================== ACCESSORIES ====================
  { 
    id: 10, 
    sku: "RWCA001", 
    category: "Accessories", 
    name: "Cross Bracelet", 
    price_usd: 14.99, 
    price_php: 790, 
    sizes: ["Adjustable"], 
    colors: ["Black Leather"], 
    images: ["https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800&h=800&fit=crop"], 
    description: "Simple cross bracelet for daily testimony." 
  },
  { 
    id: 11, 
    sku: "RWCA002", 
    category: "Accessories", 
    name: "Faith Keychain", 
    price_usd: 9.99, 
    price_php: 490, 
    sizes: ["One Size"], 
    colors: ["Silver"], 
    images: ["https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800&h=800&fit=crop"], 
    description: "Keychain with scripture reference." 
  },
  { 
    id: 12, 
    sku: "RWCA003", 
    category: "Accessories", 
    name: "Scripture Tote Bag", 
    price_usd: 17.99, 
    price_php: 890, 
    sizes: ["One Size"], 
    colors: ["Beige"], 
    images: ["https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800&h=800&fit=crop"], 
    description: "Tote bag for daily errands with faith message." 
  }
  
  // ==================== ADD NEW PRODUCTS ABOVE THIS LINE ====================
  // Remember to add a comma after the previous product when adding new ones!
];

/**
 * The validated product inventory that is used throughout the app.
 * Products are automatically validated to prevent crashes from incomplete data.
 */
export const mockInventory: Product[] = rawInventory
  .filter(product => {
    // Filter out products without essential data
    if (!product.id || !product.name) {
      console.warn('Product missing id or name, skipping:', product);
      return false;
    }
    return true;
  })
  .map((product, index) => validateProduct(product, index));

/**
 * Helper function to get a product by ID.
 * Returns undefined if not found.
 */
export function getProductById(id: number): Product | undefined {
  return mockInventory.find(p => p.id === id);
}

/**
 * Helper function to get products by category.
 */
export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return mockInventory;
  return mockInventory.filter(p => p.category === category);
}

/**
 * Available product categories.
 */
export const PRODUCT_CATEGORIES = ["All", "T-Shirts", "Hoodies", "Caps", "Accessories"] as const;
