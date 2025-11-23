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

export const mockInventory: Product[] = [
  { id: 1, sku: "RWCT001", category: "T-Shirts", name: "Jesus Saves Tee", price_usd: 24.99, price_php: 1390, sizes: ["S","M","L","XL"], colors: ["White","Black","Navy"], images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop"], description: "Soft cotton tee with bold Gospel message." },
  { id: 2, sku: "RWCT002", category: "T-Shirts", name: "Redeemed Script Tee", price_usd: 26.99, price_php: 1490, sizes: ["S","M","L","XL"], colors: ["Sand","Olive","Black"], images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop"], description: "Script typography tee inspired by Scripture." },
  { id: 3, sku: "RWCT003", category: "T-Shirts", name: "Be Still Psalm 46:10 Tee", price_usd: 24.99, price_php: 1390, sizes: ["S","M","L","XL"], colors: ["White","Heather Gray"], images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop"], description: "Typographic design reminding believers to be still." },
  { id: 4, sku: "RWCH001", category: "Hoodies", name: "Cross Minimalist Hoodie", price_usd: 49.99, price_php: 2790, sizes: ["S","M","L","XL"], colors: ["Black","Navy"], images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop"], description: "Minimal cross emblem hoodie in premium fleece." },
  { id: 5, sku: "RWCH002", category: "Hoodies", name: "Walk by Faith Hoodie", price_usd: 52.99, price_php: 2990, sizes: ["S","M","L","XL"], colors: ["White","Sand"], images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop"], description: "A hoodie that proclaims faith in action." },
  { id: 6, sku: "RWCH003", category: "Hoodies", name: "Lion of Judah Hoodie", price_usd: 54.99, price_php: 3190, sizes: ["S","M","L","XL"], colors: ["Black","Maroon"], images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop"], description: "Premium hoodie honoring Christ the King." },
  { id: 7, sku: "RWCC001", category: "Caps", name: "RedeemWear Cross Cap", price_usd: 19.99, price_php: 990, sizes: ["One Size"], colors: ["Black","White"], images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop"], description: "Classic embroidered cross cap." },
  { id: 8, sku: "RWCC002", category: "Caps", name: "Blessed Embroidered Cap", price_usd: 21.99, price_php: 1090, sizes: ["One Size"], colors: ["Navy","Olive"], images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop"], description: "Detailed embroidery for daily wear." },
  { id: 9, sku: "RWCC003", category: "Caps", name: "Saved by Grace Cap", price_usd: 19.99, price_php: 990, sizes: ["One Size"], colors: ["Khaki","Black"], images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop"], description: "Comfortable cap with Gospel message." },
  { id: 10, sku: "RWCA001", category: "Accessories", name: "Cross Bracelet", price_usd: 14.99, price_php: 790, sizes: ["Adjustable"], colors: ["Black Leather"], images: ["https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800&h=800&fit=crop"], description: "Simple cross bracelet for daily testimony." },
  { id: 11, sku: "RWCA002", category: "Accessories", name: "Faith Keychain", price_usd: 9.99, price_php: 490, sizes: ["One Size"], colors: ["Silver"], images: ["https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800&h=800&fit=crop"], description: "Keychain with scripture reference." },
  { id: 12, sku: "RWCA003", category: "Accessories", name: "Scripture Tote Bag", price_usd: 17.99, price_php: 890, sizes: ["One Size"], colors: ["Beige"], images: ["https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800&h=800&fit=crop"], description: "Tote bag for daily errands with faith message." }
];
