# 🛍️ How to Add and Edit Products - Step-by-Step Guide

This guide will show you how to add new T-shirt designs to your website. **No coding experience required!**

---

## 📁 Where is the Product File?

All your products are stored in one file:
```
src/data/inventory.ts
```

---

## 🖼️ Step 1: Upload Your Product Image

### Option A: Use an External Image URL (Easier)
1. Upload your image to a free image hosting service like [Imgur](https://imgur.com) or [ImgBB](https://imgbb.com)
2. Copy the direct image URL (should end in .jpg, .png, or .webp)
3. Use this URL in your product entry

### Option B: Upload to Your Website (More Professional)
1. Create a folder called `products` inside the `public` folder
2. Put your image file there (e.g., `my-new-design.jpg`)
3. Use this path in your product: `/products/my-new-design.jpg`

### 📐 Image Requirements
- **Size:** 800x800 pixels (square works best)
- **Format:** JPG, PNG, or WebP
- **File size:** Keep under 500KB for fast loading

---

## ✏️ Step 2: Edit the Product File

1. Open the file `src/data/inventory.ts`
2. Scroll down to find the product list
3. Look for the section marked: `// ==================== T-SHIRTS ====================`

---

## ➕ Step 3: Add a New Product

### Copy This Template:
```javascript
{ 
  id: 13,                                    // Change to next available number
  sku: "RWCT004",                            // Product code (see below)
  category: "T-Shirts",                      // Category name
  name: "Your Product Name Here",            // What customers see
  price_usd: 24.99,                          // Price in US Dollars
  price_php: 1390,                           // Price in Philippine Pesos
  sizes: ["S", "M", "L", "XL"],              // Available sizes
  colors: ["White", "Black"],                // Available colors
  images: ["https://your-image-url.jpg"],    // Product image URL
  description: "Your description here. - Bible Verse Reference"
},
```

### Where to Paste:
- Find the comment `// ==================== ADD NEW PRODUCTS ABOVE THIS LINE ====================`
- Paste your new product ABOVE that line
- Make sure there's a comma after the previous product

---

## 📝 Step 4: Fill in Your Product Details

### Product ID (id)
- Use the next number in sequence
- If the last product has `id: 12`, use `id: 13`
- **Each product must have a unique ID!**

### SKU Code (sku)
- T-Shirts: Use `RWCT` + 3 numbers (e.g., `RWCT004`)
- Hoodies: Use `RWCH` + 3 numbers (e.g., `RWCH004`)
- Caps: Use `RWCC` + 3 numbers (e.g., `RWCC004`)
- Accessories: Use `RWCA` + 3 numbers (e.g., `RWCA004`)

### Category (category)
Choose one of:
- `"T-Shirts"`
- `"Hoodies"`
- `"Caps"`
- `"Accessories"`

### Name (name)
- Keep it short and descriptive
- Example: `"Faith Over Fear Tee"`

### Prices (price_usd and price_php)
- Enter numbers only, no currency symbols
- Example: `24.99` (not `$24.99`)

### Sizes (sizes)
- List available sizes in quotes, separated by commas
- Example: `["S", "M", "L", "XL", "2XL"]`
- For one-size items: `["One Size"]`

### Colors (colors)
- List available colors in quotes, separated by commas
- Example: `["White", "Black", "Navy", "Gray"]`

### Images (images)
- Put the image URL in quotes inside square brackets
- Example: `["https://example.com/my-image.jpg"]`
- For multiple images: `["image1.jpg", "image2.jpg"]`

### Description (description)
- Keep it brief (1-2 sentences)
- Include Bible verse references if applicable
- Example: `"Premium cotton tee featuring Philippians 4:13 design."`

---

## ✅ Step 5: Verify Your Changes

After saving the file:

1. **Refresh your browser** (Ctrl+R or Cmd+R)
2. **Go to the Shop page**
3. **Check that your new product appears**
4. **Click on the product** to make sure the details look correct

---

## ⚠️ Common Mistakes to Avoid

### ❌ Missing Comma
**Wrong:**
```javascript
}
{ 
  id: 13,
```

**Correct:**
```javascript
},
{ 
  id: 13,
```

### ❌ Missing Quotes Around Text
**Wrong:**
```javascript
name: My New Tee,
```

**Correct:**
```javascript
name: "My New Tee",
```

### ❌ Using Same ID Twice
Every product must have a unique `id` number!

### ❌ Wrong Category Name
Must match exactly: `"T-Shirts"`, `"Hoodies"`, `"Caps"`, or `"Accessories"`

---

## 🔧 Troubleshooting

### "The site shows an error after I edited the file"
- Check for missing commas between products
- Check for missing quotes around text values
- Make sure all brackets `{ }` and `[ ]` are properly closed

### "My new product doesn't appear"
- Make sure you saved the file
- Refresh your browser (Ctrl+Shift+R for hard refresh)
- Check that the product is in the correct section

### "The image doesn't show"
- The site has a fallback image, so it won't crash
- Check that your image URL is correct
- Make sure the URL ends in .jpg, .png, or .webp
- Try opening the image URL directly in your browser

---

## 📞 Need Help?

If something isn't working:
1. Check the troubleshooting section above
2. Make sure you followed all steps exactly
3. Try reverting to a backup if you made one

---

## 💡 Pro Tips

1. **Always backup first!** Copy the entire file before making changes
2. **Test with one product** before adding many
3. **Use consistent naming** for easier management
4. **Optimize images** before uploading (compress them for faster loading)

---

*Last updated: January 2026*
