export const getCartFromLocalStorage = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error getting cart from localStorage:", error);
    return [];
  }
};

export const saveCartToLocalStorage = (cart: any[]) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

export const addToLocalStorageCart = (productToAdd: any) => {
  const cart = getCartFromLocalStorage();

  // Match based on unique combination: productId + roastId + grindOptionId
  // This mirrors the database @@unique constraint
  const existingItemIndex = cart.findIndex(
    (item: any) =>
      item.id === productToAdd.id &&
      (item.roastId ?? null) === (productToAdd.roastId ?? null) &&
      (item.grindOptionId ?? null) === (productToAdd.grindOptionId ?? null)
  );

  if (existingItemIndex > -1) {
    // If item exists with same roast/grind combo, increment quantity
    cart[existingItemIndex].quantity += 1;
  } else {
    // If item does not exist with this roast/grind combo, add it with quantity 1
    // Ensure productToAdd has an id and basePrice, and add quantity
    if (productToAdd.id && productToAdd.basePrice !== undefined) {
      cart.push({
        ...productToAdd,
        quantity: 1,
        roastId: productToAdd.roastId ?? null,
        grindOptionId: productToAdd.grindOptionId ?? null,
      });
    } else {
      console.error(
        "Product missing id or basePrice for localStorage cart:",
        productToAdd
      );
      return; // Do not add if essential properties are missing
    }
  }

  saveCartToLocalStorage(cart);
  // Optionally, you might want to return the updated cart or trigger a state update
};

export const removeFromLocalStorageCart = (productId: string | number) => {
  const cart = getCartFromLocalStorage();
  const updatedCart = cart.filter((item: any) => item.id !== productId);
  saveCartToLocalStorage(updatedCart);
};

export const updateLocalStorageCartQuantity = (
  productId: string | number,
  quantity: number
) => {
  const cart = getCartFromLocalStorage();
  const itemIndex = cart.findIndex((item: any) => item.id === productId);

  if (itemIndex > -1) {
    if (quantity > 0) {
      cart[itemIndex].quantity = quantity;
    } else {
      // If quantity is 0 or less, remove the item
      cart.splice(itemIndex, 1);
    }
    saveCartToLocalStorage(cart);
  }
};

export const getCartItemCount = () => {
  const cart = getCartFromLocalStorage();
  return cart.reduce((total: number, item: any) => total + item.quantity, 0);
};

export function clearLocalStorageCart() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cart");
  }
}
