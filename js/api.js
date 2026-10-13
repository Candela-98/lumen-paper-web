async function requestOrderApi(path, method, body, expectedStatus = 201) {
  if (!LUMEN_CONFIG.apiBaseUrl) throw new Error("La API de pedidos no está configurada para este sitio.");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${LUMEN_CONFIG.apiBaseUrl}${path}`, {
      method, credentials: "omit", cache: "no-store", signal: controller.signal,
      headers: body ? { Accept: "application/json", "Content-Type": "application/json" } : { Accept: "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {})
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      const error = new Error(`La API respondió HTTP ${response.status}.`);
      error.code = typeof detail?.code === "string" ? detail.code : "HTTP_ERROR";
      error.status = response.status;
      error.uncertain = method === "POST" && (response.status >= 500 || response.status === 408);
      throw error;
    }
    if ((method === "POST" || path.endsWith("/checkout")) && response.status !== expectedStatus) throw new Error("Respuesta inesperada del servidor.");
    return await response.json();
  } catch (error) {
    if (method === "POST" && !error.status) error.uncertain = true;
    if (error.name === "AbortError") error.message = "La API no respondió dentro de los 15 segundos.";
    throw error;
  } finally { clearTimeout(timer); }
}

// Respaldo en memoria si sessionStorage no está disponible.
const checkoutAttempts = new Set();
const checkoutInFlight = new Set();

function validateCheckoutLink(result) {
  try {
    if (!result || typeof result.preference_id !== "string" || !result.preference_id.trim() || result.preference_id.length > 200 ||
        typeof result.checkout_url !== "string" || /[\u0000-\u0020\u007f]/.test(result.checkout_url)) throw new Error("Respuesta inválida");
    const url = new URL(result.checkout_url);
    if (url.protocol !== "https:" ||
        !["www.mercadopago.com.ar", "sandbox.mercadopago.com.ar"].includes(url.hostname) ||
        url.port || url.username || url.password || url.hash || !url.pathname.startsWith("/checkout/")) throw new Error("URL inválida");
    return { preference_id: result.preference_id, checkout_url: url.href };
  } catch {
    const error = new Error("No pudimos validar el enlace de pago recibido.");
    error.code = "CHECKOUT_LINK_INVALID";
    error.uncertain = true;
    throw error;
  }
}

async function requestCheckout(id, method) {
  if (LUMEN_CONFIG.mercadoPagoEnabled !== true) {
    const error = new Error("El pago con Mercado Pago no está habilitado en este ambiente.");
    error.code = "PAYMENT_DISABLED";
    throw error;
  }
  if (!LumenOrders.validId(id)) throw new Error("Identificador de pedido inválido.");
  const key = id.toLowerCase();
  if (method === "POST" && (checkoutAttempts.has(key) || LumenOrders.isCheckoutBlocked(id))) {
    const error = new Error("Ya se solicitó un enlace. Recuperalo antes de intentar otro pago.");
    error.code = "CHECKOUT_ALREADY_STARTED";
    throw error;
  }
  if (checkoutInFlight.has(key)) {
    const error = new Error("Hay una consulta de checkout en curso.");
    error.code = "CHECKOUT_BUSY";
    throw error;
  }
  checkoutInFlight.add(key);
  checkoutAttempts.add(key);
  LumenOrders.setCheckoutBlocked(id, true);
  try {
    // Neither action sends body, amounts, credentials or query parameters.
    return validateCheckoutLink(await requestOrderApi(`/api/v1/public/orders/${encodeURIComponent(id)}/checkout`, method, undefined, 200));
  } catch (error) {
    const notStarted = method === "GET" && error.status === 409 && error.code === "CHECKOUT_NOT_STARTED";
    const rejectedBeforeCreation = method === "POST" && error.status === 400 && !error.uncertain;
    if (notStarted || rejectedBeforeCreation) {
      checkoutAttempts.delete(key);
      LumenOrders.setCheckoutBlocked(id, false);
    } else {
      // Unknown 409s, provider failures and malformed successes never authorize a new preference.
      error.uncertain = error.uncertain || !error.status || error.status >= 500 || error.status === 408 ||
        ["CHECKOUT_UNCERTAIN", "CHECKOUT_REVIEW_REQUIRED", "CHECKOUT_EXPIRED"].includes(error.code);
    }
    throw error;
  } finally { checkoutInFlight.delete(key); }
}

const LumenApi = Object.freeze({
  createOrder(request) { return requestOrderApi("/api/v1/public/orders", "POST", request); },
  startOrderCheckout(id) { return requestCheckout(id, "POST"); },
  recoverOrderCheckout(id) { return requestCheckout(id, "GET"); },
  isCheckoutBlocked(id) { return LumenOrders.validId(id) && (checkoutAttempts.has(id.toLowerCase()) || LumenOrders.isCheckoutBlocked(id)); },
  getPublicOrder(id) {
    if (!LumenOrders.validId(id)) throw new Error("Identificador de pedido inválido.");
    return requestOrderApi(`/api/v1/public/orders/${encodeURIComponent(id)}`, "GET");
  },
  async getPublicProducts() {
    if (!LUMEN_CONFIG.apiBaseUrl) {
      throw new Error("La API del catálogo no está configurada para este sitio.");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`${LUMEN_CONFIG.apiBaseUrl}/api/v1/public/products`, {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "omit",
        cache: "no-store",
        signal: controller.signal
      });
      if (!response.ok) {
        throw new Error(`El catálogo respondió HTTP ${response.status}.`);
      }
      const products = await response.json();
      if (!Array.isArray(products)) {
        throw new Error("La API devolvió un catálogo con formato inválido.");
      }
      return products;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("La API no respondió dentro de los 10 segundos.");
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
});
