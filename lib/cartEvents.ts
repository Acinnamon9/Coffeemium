/**
 * Dispatches a custom browser event to signal that the cart state has been updated.
 * Components listening for this event can refresh their cart data.
 */
export function dispatchCartUpdateEvent() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartUpdated"));
  }
}
