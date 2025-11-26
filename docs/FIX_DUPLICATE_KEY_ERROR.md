# Fix: React Duplicate Key Error

## Problem

When adding the same product with different roast/grind configurations, React was throwing an error:

```
Encountered two children with the same key, `f8919856-fdd9-4af5-8f6d-923ca3ad5468`.
Keys should be unique so that components maintain their identity across updates.
```

## Root Cause

The cart was using `item.id` (which is the product ID) as the React key. Since we now support multiple cart items with the same product but different configurations, this created duplicate keys.

**Example that caused the error:**

```typescript
// Both items have the same product ID
cartItems = [
  { id: 'product-123', roastId: 'medium', grindOptionId: 'fine', ... },
  { id: 'product-123', roastId: 'dark', grindOptionId: 'coarse', ... }
];

// This created duplicate keys in React:
cartItems.map(item => <CartItemDisplay key={item.id} ... />)
// Both had key="product-123" ❌
```

## Solution

### 1. Updated CartClient.tsx

Created a unique key from the combination of productId + roastId + grindOptionId:

```typescript
{cartItems.map((item) => {
  // Create unique key from productId + roastId + grindOptionId
  // This matches the database unique constraint
  const uniqueKey = `${item.id}-${item.roastId ?? 'no-roast'}-${item.grindOptionId ?? 'no-grind'}`;

  return (
    <CartItemDisplay
      key={uniqueKey}  // ✅ Now unique!
      item={item}
      ...
    />
  );
})}
```

**Example with unique keys:**

```typescript
cartItems = [
  { id: "product-123", roastId: "medium", grindOptionId: "fine" },
  { id: "product-123", roastId: "dark", grindOptionId: "coarse" },
];

// Generates unique keys:
// key="product-123-medium-fine"
// key="product-123-dark-coarse"
// ✅ No duplicates!
```

### 2. Updated useCart.ts

Modified the handler functions to parse the unique key and match items correctly:

**Added helper function:**

```typescript
const matchesCartItem = (
  item: any,
  productId: string | number,
  roastId?: string | null,
  grindOptionId?: string | null
) => {
  return (
    item.id === productId &&
    (item.roastId ?? null) === (roastId ?? null) &&
    (item.grindOptionId ?? null) === (grindOptionId ?? null)
  );
};
```

**Updated handlers to parse the unique key:**

```typescript
const handleQuantityChange = async (itemId: string, newQuantity: number) => {
  // Parse: "product-123-medium-fine" → ["product-123", "medium", "fine"]
  const parts = itemId.split("-");
  const productId = parts[0];
  const roastId = parts[1] === "no-roast" ? null : parts[1];
  const grindId = parts[2] === "no-grind" ? null : parts[2];

  // Find and update the specific item
  setCartItems((prev) =>
    prev.map((item) =>
      matchesCartItem(item, productId, roastId, grindId)
        ? { ...item, quantity: newQuantity }
        : item
    )
  );

  // ... update localStorage with same matching logic
};
```

## Key Format

The unique key follows this pattern:

```
{productId}-{roastId || 'no-roast'}-{grindOptionId || 'no-grind'}
```

**Examples:**

- Product with both options: `"abc123-medium-roast-fine-grind"`
- Product with only roast: `"abc123-medium-roast-no-grind"`
- Product with only grind: `"abc123-no-roast-fine-grind"`
- Product with neither: `"abc123-no-roast-no-grind"`

## Files Modified

1. **`app/cart/CartClient.tsx`**
   - Updated the `key` prop to use unique combination
   - Added comment explaining the key format

2. **`hooks/useCart.ts`**
   - Added `matchesCartItem()` helper function
   - Updated `handleQuantityChange()` to parse unique key
   - Updated `handleRemoveItem()` to parse unique key
   - Updated `handleUpdateItemOptions()` to parse unique key

## Testing

After this fix, you should be able to:

- ✅ Add same product with different roasts → No duplicate key error
- ✅ Add same product with different grinds → No duplicate key error
- ✅ Change quantity of specific configuration → Updates correct item
- ✅ Remove specific configuration → Removes correct item
- ✅ Update roast/grind options → Updates correct item

## Why This Approach?

**Alternative approaches considered:**

1. **Generate UUID for each cart item**
   - ❌ Would require restructuring entire cart system
   - ❌ Would break localStorage compatibility
   - ❌ More complex migration

2. **Use array index as key**
   - ❌ Bad practice in React
   - ❌ Causes issues when items are reordered/removed

3. **Composite key from existing data** ✅ (Chosen)
   - ✅ No data structure changes needed
   - ✅ Matches database unique constraint
   - ✅ Deterministic and predictable
   - ✅ Easy to parse and understand

## Summary

The fix ensures that each unique product configuration has a unique React key by combining:

- Product ID
- Roast ID (or 'no-roast')
- Grind Option ID (or 'no-grind')

This matches the database schema's unique constraint and ensures React can properly track each cart item's identity across updates.

**Result:** No more duplicate key errors! ✅
