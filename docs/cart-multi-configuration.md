# Cart Multi-Configuration Support

## Overview

Your cart system now fully supports adding the same product multiple times with different roast and grind configurations. Each unique combination of `productId + roastId + grindOptionId` creates a separate cart item.

## Database Schema

The Prisma schema enforces uniqueness with:

```prisma
@@unique([cartId, productId, roastId, grindOptionId])
```

This means:

- ✅ Same product + different roast = separate cart items
- ✅ Same product + different grind = separate cart items
- ✅ Same product + same roast + same grind = quantity increment

## Example Scenarios

### Scenario 1: Different Roasts

```
Product: Brazil Coffee
- Medium Roast + Fine Grind (Qty: 1)
- Dark Roast + Fine Grind (Qty: 2)
```

Result: **2 separate cart items**

### Scenario 2: Different Grinds

```
Product: Brazil Coffee
- Medium Roast + Fine Grind (Qty: 1)
- Medium Roast + Coarse Grind (Qty: 1)
```

Result: **2 separate cart items**

### Scenario 3: Same Configuration

```
Product: Brazil Coffee
- Medium Roast + Fine Grind (Qty: 1)
- Medium Roast + Fine Grind (added again)
```

Result: **1 cart item with Qty: 2**

## Implementation Details

### 1. Server-Side (Already Implemented ✅)

**File:** `app/api/cart/route.ts`

The POST endpoint already checks for existing items with the same configuration:

```typescript
const existing = await tx.cartItem.findFirst({
  where: {
    cartId,
    productId,
    roastId: roastId ?? null,
    grindOptionId: grindOptionId ?? null,
  },
});

if (existing) {
  // Increment quantity
  await tx.cartItem.update({
    where: { id: existing.id },
    data: { quantity: { increment: quantity } },
  });
} else {
  // Create new cart item
  await tx.cartItem.create({
    /* ... */
  });
}
```

### 2. Local Storage (Updated ✅)

**File:** `lib/localStorageCart.ts`

The `addToLocalStorageCart` function now matches items based on the unique combination:

```typescript
const existingItemIndex = cart.findIndex(
  (item: any) =>
    item.id === productToAdd.id &&
    (item.roastId ?? null) === (productToAdd.roastId ?? null) &&
    (item.grindOptionId ?? null) === (productToAdd.grindOptionId ?? null)
);
```

### 3. useCart Hook (Updated ✅)

**File:** `hooks/useCart.ts`

The `addToCart` function now accepts optional roast and grind parameters:

```typescript
const addToCart = async (
  productToAdd: {
    id: string | number;
    name: string;
    image?: string | null;
    basePrice: number;
  },
  quantity = 1,
  options?: {
    roastId?: string | null;
    grindOptionId?: string | null;
  }
): Promise<{ success: true } | { success: false; error: string }>
```

### 4. Cart Display (Already Working ✅)

**File:** `components/cart/CartItemDisplay.tsx`

The cart display already:

- Shows separate items for different configurations
- Displays roast and grind selectors per item
- Calculates prices based on selected options
- Shows price breakdown with roast multiplier and grind extra cost

## Usage Examples

### Basic Add to Cart (No Options)

```typescript
const { addToCart } = useCart();

await addToCart({
  id: product.id,
  name: product.name,
  image: product.image,
  basePrice: product.basePrice,
});
```

### Add to Cart with Roast and Grind Options

```typescript
const { addToCart } = useCart();

// Add with medium roast and fine grind
await addToCart(
  {
    id: product.id,
    name: product.name,
    image: product.image,
    basePrice: product.basePrice,
  },
  1, // quantity
  {
    roastId: "medium-roast-id",
    grindOptionId: "fine-grind-id",
  }
);

// Add same product with different roast - creates separate item
await addToCart(
  {
    id: product.id,
    name: product.name,
    image: product.image,
    basePrice: product.basePrice,
  },
  2, // quantity
  {
    roastId: "dark-roast-id",
    grindOptionId: "coarse-grind-id",
  }
);
```

### Product Detail Page Example

```typescript
'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';

export default function ProductDetailPage({ product, roasts, grindOptions }) {
  const { addToCart } = useCart();
  const [selectedRoast, setSelectedRoast] = useState(roasts[0]?.id);
  const [selectedGrind, setSelectedGrind] = useState(grindOptions[0]?.id);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);

    const result = await addToCart(
      {
        id: product.id,
        name: product.name,
        image: product.image,
        basePrice: product.basePrice,
      },
      1,
      {
        roastId: selectedRoast,
        grindOptionId: selectedGrind,
      }
    );

    if (result.success) {
      alert('Added to cart!');
    } else {
      alert(`Error: ${result.error}`);
    }

    setIsAdding(false);
  };

  return (
    <div>
      <h1>{product.name}</h1>

      <select value={selectedRoast} onChange={(e) => setSelectedRoast(e.target.value)}>
        {roasts.map(roast => (
          <option key={roast.id} value={roast.id}>{roast.name}</option>
        ))}
      </select>

      <select value={selectedGrind} onChange={(e) => setSelectedGrind(e.target.value)}>
        {grindOptions.map(grind => (
          <option key={grind.id} value={grind.id}>{grind.name}</option>
        ))}
      </select>

      <button onClick={handleAddToCart} disabled={isAdding}>
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

## Cart Behavior

### Viewing Cart

Each unique configuration appears as a separate row:

```
Cart Items:
1. Brazil Coffee - Medium Roast - Fine Grind (Qty: 1) - ₹500
2. Brazil Coffee - Dark Roast - Coarse Grind (Qty: 2) - ₹1,100
```

### Updating Options in Cart

When a user changes the roast or grind option in the cart:

- The `onUpdateItemOptions` handler updates that specific cart item
- The price recalculates based on the new selection
- The item remains separate from other configurations

### Price Calculation

Each cart item's price is calculated as:

```
finalPrice = (basePrice × roastMultiplier) + grindExtraCost
totalPrice = finalPrice × quantity
```

## Migration Notes

### Existing Code Compatibility

- ✅ Existing `addToCart` calls without options still work (backward compatible)
- ✅ Cart display automatically handles separate items
- ✅ No database migration needed (schema already correct)

### What Changed

1. **Local storage matching logic** - Now checks roast + grind in addition to product ID
2. **useCart.addToCart signature** - Added optional `options` parameter
3. **Cart item creation** - Now includes roastId and grindOptionId

### What Didn't Change

- Database schema (already correct)
- Server API endpoints (already correct)
- Cart display component (already correct)
- Price calculation logic (already correct)

## Testing Checklist

- [ ] Add same product with different roasts → Creates separate items
- [ ] Add same product with different grinds → Creates separate items
- [ ] Add same product with same roast+grind → Increments quantity
- [ ] Change roast in cart → Updates price correctly
- [ ] Change grind in cart → Updates price correctly
- [ ] Remove item → Removes only that configuration
- [ ] Quantity change → Updates only that configuration
- [ ] Total price → Sums all configurations correctly

## Next Steps

To fully utilize this feature, you should:

1. **Update ProductCard component** to include roast/grind selectors
2. **Create a Product Detail page** with full configuration options
3. **Add visual indicators** in cart to distinguish different configurations
4. **Consider adding** a "duplicate with different options" button in cart
5. **Test thoroughly** with various combinations

## Summary

✅ **Schema**: Already supports unique combinations  
✅ **Server API**: Already handles matching correctly  
✅ **Local Storage**: Now updated to match by configuration  
✅ **useCart Hook**: Now accepts roast/grind options  
✅ **Cart Display**: Already shows separate items correctly

Your cart system is now fully configured to support multiple instances of the same product with different roast and grind configurations!
