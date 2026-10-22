# Quick Reference: Multi-Configuration Cart

## 🚀 Quick Start

### Add to Cart with Options

```typescript
import { useCart } from "@/hooks/useCart";

const { addToCart } = useCart();

// Add product with specific roast and grind
await addToCart(
  product, // { id, name, image, basePrice }
  1, // quantity
  {
    roastId: "medium-roast-id",
    grindOptionId: "fine-grind-id",
  }
);
```

### Add to Cart without Options (Backward Compatible)

```typescript
// Still works! Uses default options
await addToCart(product);
```

## 📊 How Matching Works

### Creates SEPARATE Items ✅

```typescript
// Item 1
addToCart(product, 1, { roastId: "A", grindOptionId: "X" });

// Item 2 (different roast)
addToCart(product, 1, { roastId: "B", grindOptionId: "X" });

// Item 3 (different grind)
addToCart(product, 1, { roastId: "A", grindOptionId: "Y" });
```

### Increments SAME Item ✅

```typescript
// Item 1 (qty: 1)
addToCart(product, 1, { roastId: "A", grindOptionId: "X" });

// Item 1 (qty: 2) - same configuration
addToCart(product, 1, { roastId: "A", grindOptionId: "X" });
```

## 💰 Price Calculation

```typescript
// Formula
finalPrice = (basePrice × roastMultiplier) + grindExtraCost
totalPrice = finalPrice × quantity

// Example
basePrice = ₹400
roastMultiplier = 1.1 (Dark Roast)
grindExtraCost = ₹50 (Fine Grind)

finalPrice = (400 × 1.1) + 50 = ₹490
totalPrice = 490 × 2 = ₹980 (for qty: 2)
```

## 🎨 UI Integration

### Product Detail Page

```typescript
const [selectedRoast, setSelectedRoast] = useState(roasts[0]?.id);
const [selectedGrind, setSelectedGrind] = useState(grindOptions[0]?.id);

<select value={selectedRoast} onChange={e => setSelectedRoast(e.target.value)}>
  {roasts.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
</select>

<button onClick={() => addToCart(product, 1, {
  roastId: selectedRoast,
  grindOptionId: selectedGrind
})}>
  Add to Cart
</button>
```

### Cart Display

Already handled automatically! Each unique configuration shows as separate item.

## 🔍 Debugging

### Check Local Storage

```javascript
// In browser console
JSON.parse(localStorage.getItem("cart"));
```

### Expected Structure

```json
[
  {
    "id": "product-123",
    "name": "Brazil Coffee",
    "basePrice": 400,
    "quantity": 2,
    "roastId": "medium-roast-id",
    "grindOptionId": "fine-grind-id"
  },
  {
    "id": "product-123",
    "name": "Brazil Coffee",
    "basePrice": 400,
    "quantity": 1,
    "roastId": "dark-roast-id",
    "grindOptionId": "coarse-grind-id"
  }
]
```

## ⚠️ Common Mistakes

### ❌ Don't Do This

```typescript
// Passing options as separate parameters
addToCart(product, 1, roastId, grindOptionId); // WRONG
```

### ✅ Do This Instead

```typescript
// Pass options as an object
addToCart(product, 1, { roastId, grindOptionId }); // CORRECT
```

### ❌ Don't Do This

```typescript
// Forgetting to await
addToCart(product); // No await - won't wait for result
```

### ✅ Do This Instead

```typescript
// Always await
const result = await addToCart(product);
if (result.success) {
  // Handle success
}
```

## 📱 Example: Complete Flow

```typescript
'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';

export default function ProductPage({ product, roasts, grindOptions }) {
  const { addToCart } = useCart();
  const [roastId, setRoastId] = useState(roasts[0]?.id);
  const [grindId, setGrindId] = useState(grindOptions[0]?.id);
  const [qty, setQty] = useState(1);

  const handleAdd = async () => {
    const result = await addToCart(product, qty, {
      roastId,
      grindOptionId: grindId,
    });

    if (result.success) {
      alert('Added to cart!');
      setQty(1); // Reset
    }
  };

  return (
    <div>
      <h1>{product.name}</h1>

      <select value={roastId} onChange={e => setRoastId(e.target.value)}>
        {roasts.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>

      <select value={grindId} onChange={e => setGrindId(e.target.value)}>
        {grindOptions.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>

      <input
        type="number"
        value={qty}
        onChange={e => setQty(Number(e.target.value))}
        min="1"
      />

      <button onClick={handleAdd}>Add to Cart</button>
    </div>
  );
}
```

## 🧪 Testing Scenarios

### Test 1: Different Roasts

```typescript
await addToCart(product, 1, { roastId: "light", grindOptionId: "fine" });
await addToCart(product, 1, { roastId: "dark", grindOptionId: "fine" });
// Expected: 2 cart items
```

### Test 2: Different Grinds

```typescript
await addToCart(product, 1, { roastId: "medium", grindOptionId: "fine" });
await addToCart(product, 1, { roastId: "medium", grindOptionId: "coarse" });
// Expected: 2 cart items
```

### Test 3: Same Configuration

```typescript
await addToCart(product, 1, { roastId: "medium", grindOptionId: "fine" });
await addToCart(product, 1, { roastId: "medium", grindOptionId: "fine" });
// Expected: 1 cart item with qty: 2
```

### Test 4: No Options

```typescript
await addToCart(product);
await addToCart(product);
// Expected: 1 cart item with qty: 2
```

## 📚 Related Files

- **Hook:** `hooks/useCart.ts`
- **Types:** `lib/types/cart.ts`
- **Storage:** `lib/localStorageCart.ts`
- **API:** `app/api/cart/route.ts`
- **Display:** `components/cart/CartItemDisplay.tsx`
- **Example:** `components/examples/ProductDetailWithOptions.tsx`
- **Docs:** `docs/cart-multi-configuration.md`

## 🆘 Troubleshooting

### Items not separating?

Check that you're passing different `roastId` or `grindOptionId` values.

### Price not updating?

Ensure roast and grind data includes `defaultMultiplier` and `extraCost`.

### Type errors?

Make sure `roastId` and `grindOptionId` are strings or null, not undefined.

### Cart not persisting?

Check localStorage is enabled and not full.

---

**Need more help?** See `docs/cart-multi-configuration.md` for detailed documentation.
