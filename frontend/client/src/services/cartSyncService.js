import API_BASE_URL from "../Constants/CommonConst";

const CART_LS_KEY = "urban_muse_cart";
const SYNC_FLAG_KEY = "urban_muse_cart_synced";

/**
 * Reads cart items from localStorage and aggregates quantities by variantId
 * into the backend-expected format: { cartProdIdAndQuantity: { variantId: totalQty } }
 *
 * Each variant (size/color) is a distinct entry — the backend stores cart
 * items by productVariantId.
 */
export function transformCartForBackend(cartItems) {
  const quantityMap = {};

  for (const item of cartItems) {
    const variantId = Number(item.variantId);
    const quantity = Number(item.quantity);

    // Skip entries with invalid or non-positive values
    if (!Number.isInteger(variantId) || variantId <= 0) continue;
    if (!Number.isInteger(quantity) || quantity <= 0) continue;

    quantityMap[variantId] = (quantityMap[variantId] || 0) + quantity;
  }

  return { cartProdIdAndQuantity: quantityMap };
}

/**
 * Syncs the current localStorage cart to the backend.
 * Returns { success: true } on success, or { success: false, error } on failure.
 *
 * Caller is responsible for duplicate-prevention (via sessionStorage flag).
 */
export async function syncCartToBackend() {
  try {
    const raw = localStorage.getItem(CART_LS_KEY);
    if (!raw) return { success: true }; // Nothing to sync

    let cartItems;
    try {
      cartItems = JSON.parse(raw);
    } catch {
      console.warn("[CartSync] Corrupt localStorage cart data, skipping sync.");
      return { success: false, error: "invalid_data" };
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return { success: true }; // Empty cart, nothing to sync
    }

    const payload = transformCartForBackend(cartItems);

    // If after filtering there are no valid items, skip the API call
    if (Object.keys(payload.cartProdIdAndQuantity).length === 0) {
      return { success: true };
    }

    const response = await fetch(`${API_BASE_URL}/api/cart/add/products`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn(`[CartSync] Backend returned ${response.status}`);
      return { success: false, error: `http_${response.status}` };
    }

    return { success: true };
  } catch (err) {
    console.error("[CartSync] Network/fetch error during cart sync:", err);
    return { success: false, error: "network" };
  }
}

/**
 * Fetches the user's cart from the backend after login.
 * Returns { success: true, cart: [...] } or { success: false, error }.
 */
export async function fetchBackendCart() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/get-cart`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      console.warn(`[CartSync] Failed to fetch backend cart: ${response.status}`);
      return { success: false, error: `http_${response.status}` };
    }

    const items = await response.json();

    // Transform to CartContext format (add client-side fields)
    const cart = (Array.isArray(items) ? items : []).map(item => ({
      id: _generateId(),
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      isOverStock: false,
      availableStock: undefined,
    }));

    return { success: true, cart };
  } catch (err) {
    console.error("[CartSync] Failed to fetch backend cart:", err);
    return { success: false, error: "network" };
  }
}

/** Simple unique ID generator for cart items. */
function _generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/** Mark the sync as completed for this login session. */
export function markCartSynced() {
  sessionStorage.setItem(SYNC_FLAG_KEY, "true");
}

/** Check whether the cart has already been synced in this login session. */
export function isCartAlreadySynced() {
  return sessionStorage.getItem(SYNC_FLAG_KEY) === "true";
}

/** Clear the sync flag (call on logout so next login triggers a fresh sync). */
export function clearCartSyncFlag() {
  sessionStorage.removeItem(SYNC_FLAG_KEY);
}
