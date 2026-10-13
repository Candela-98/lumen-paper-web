const LumenOrders = Object.freeze({
  referenceKey: "lumen-paper.last-order.v1",
  submissionKey: "lumen-paper.order-submission.v1",
  isSubmissionBlocked() {
    try { return window.sessionStorage.getItem(this.submissionKey) === "uncertain"; } catch { return false; }
  },
  setSubmissionBlocked(blocked) {
    try {
      if (blocked) window.sessionStorage.setItem(this.submissionKey, "uncertain");
      else window.sessionStorage.removeItem(this.submissionKey);
      return true;
    } catch { return false; }
  },
  checkoutKey(id) { return "lumen-paper.checkout-started.v1." + id.toLowerCase(); },
  isCheckoutBlocked(id) {
    if (!this.validId(id)) return false;
    try { return window.sessionStorage.getItem(this.checkoutKey(id)) === "started"; } catch { return false; }
  },
  setCheckoutBlocked(id, blocked) {
    if (!this.validId(id)) return false;
    try {
      if (blocked) window.sessionStorage.setItem(this.checkoutKey(id), "started");
      else window.sessionStorage.removeItem(this.checkoutKey(id));
      return true;
    } catch { return false; }
  },
  validId(value) {
    return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
  },
  buildRequest(customer, items) {
    const text = (key, label, max, required = true) => {
      const value = String(customer[key] || "").trim();
      if ((required && !value) || value.length > max) throw new Error(`${label}: completá el campo (máximo ${max} caracteres).`);
      return value;
    };
    const request = {
      first_name: text("first_name", "Nombre", 100),
      last_name: text("last_name", "Apellido", 100),
      dni: text("dni", "DNI", 20), phone: text("phone", "Teléfono", 40),
      email: text("email", "Email", 254), delivery_method: customer.delivery_method
    };
    if (!/^[^\s@]+@[^\s@]+$/.test(request.email)) throw new Error("Ingresá un email válido.");
    if (!["PICKUP", "CORREO_ARGENTINO"].includes(request.delivery_method)) throw new Error("Elegí una forma de entrega.");
    if (request.delivery_method === "CORREO_ARGENTINO") {
      request.address = text("address", "Dirección", 250);
      request.postal_code = text("postal_code", "Código postal", 20);
      request.city = text("city", "Ciudad", 120);
      request.province = text("province", "Provincia", 120);
      const floor = text("floor_apartment", "Piso/departamento", 100, false);
      if (floor) request.floor_apartment = floor;
    }
    if (!Array.isArray(items) || !items.length || items.length > 50) throw new Error("El pedido debe tener entre 1 y 50 líneas.");
    request.items = items.map((item) => {
      if (!item.disponible || !Number.isSafeInteger(item.variant_id) || item.variant_id <= 0 ||
          !Number.isInteger(item.cantidad) || item.cantidad < 1 || item.cantidad > 1000) {
        throw new Error("Revisá las variantes y cantidades del carrito.");
      }
      const personalization = item.disenoId === null ? "Diseño a coordinar por WhatsApp"
        : `Diseño: ${item.diseno} (ID: ${item.disenoId})${item.categoriaDiseno ? `; Categoría: ${item.categoriaDiseno}` : ""}`;
      if (personalization.length > 1000) throw new Error("La personalización supera los 1000 caracteres.");
      return { variant_id: item.variant_id, quantity: item.cantidad, personalization };
    });
    return request;
  },
  validateSummary(order, expectedId) {
    const amount = value => typeof value === "number" && Number.isFinite(value) && value >= 0;
    if (!order || !this.validId(order.public_id) ||
        (expectedId !== undefined && (!this.validId(expectedId) || order.public_id.toLowerCase() !== expectedId.toLowerCase())) || !["PENDING_PAYMENT", "PAID", "CANCELLED", "PAYMENT_REVIEW"].includes(order.status) ||
        !amount(order.subtotal) || !amount(order.total) || !order.delivery ||
        !["PICKUP", "CORREO_ARGENTINO"].includes(order.delivery.method) ||
        !(order.delivery.shipping_cost === null || amount(order.delivery.shipping_cost)) ||
        !Array.isArray(order.items) || !order.items.length || order.items.length > 50 ||
        !order.items.every(item => item && typeof item.product_name === "string" && typeof item.variant_name === "string" &&
          amount(item.unit_price) && amount(item.subtotal) && Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 1000)) {
      throw new Error("La respuesta del pedido no tiene el formato esperado.");
    }
    // Keep the server summary in memory, excluding buyer/contact data.
    return { public_id: order.public_id, status: order.status, subtotal: order.subtotal, total: order.total,
      delivery: { method: order.delivery.method, shipping_cost: order.delivery.shipping_cost }, items: order.items.map(item => ({ product_name: item.product_name,
        variant_name: item.variant_name, quantity: item.quantity, unit_price: item.unit_price,
        subtotal: item.subtotal, personalization: item.personalization || "" })) };
  },
  readReference() {
    try {
      const id = window.sessionStorage.getItem(this.referenceKey);
      return this.validId(id) ? id : null;
    } catch { return null; }
  },
  saveReference(id) {
    if (!this.validId(id)) return false;
    try { window.sessionStorage.setItem(this.referenceKey, id.toLowerCase()); return true; } catch { return false; }
  },
  cartReferenceKey(id) { return `lumen-paper.order-cart.v1.${id.toLowerCase()}`; },
  rememberCart(id, items) {
    if (!this.validId(id)) return false;
    try {
      window.sessionStorage.setItem(this.cartReferenceKey(id), JSON.stringify(LumenCartStorage.sanitize(items)));
      return true;
    } catch { return false; }
  },
  clearPaidCart(order) {
    // A changed cart may belong to a newer purchase. Never guess which lines to delete.
    if (order.status !== "PAID" || !this.validId(order.public_id)) return "";
    try {
      const raw = window.sessionStorage.getItem(this.cartReferenceKey(order.public_id));
      const current = LumenCartStorage.load();
      if (current.message) return "El pago está confirmado, pero no pudimos revisar el carrito guardado.";
      if (!raw) return current.items.length ? "Conservamos el carrito porque no tenemos su asociación con este pedido." : "";
      const submitted = LumenCartStorage.sanitize(JSON.parse(raw));
      if (JSON.stringify(current.items) !== JSON.stringify(submitted)) {
        return "Conservamos el carrito porque cambió después de crear este pedido.";
      }
      const error = LumenCartStorage.save([]);
      if (error) return "El pago está confirmado, pero no pudimos limpiar el carrito guardado.";
      window.sessionStorage.removeItem(this.cartReferenceKey(order.public_id));
      return "El carrito de este pedido se limpió después de confirmar el pago.";
    } catch { return "El pago está confirmado. Conservamos el carrito porque no pudimos verificar su asociación."; }
  },
  clearReference() {
    try { window.sessionStorage.removeItem(this.referenceKey); } catch { /* memory remains usable */ }
  }
});
