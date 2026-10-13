// URL parameters identify a lookup; only the backend can confirm payment.
const LumenOrderReturn = Object.freeze({
  resolveReference(search, savedId) {
    const references = new URLSearchParams(search).getAll("external_reference");
    if (references.length === 1 && LumenOrders.validId(references[0])) {
      return { id: references[0].toLowerCase(), notice: "" };
    }
    const invalid = references.length > 0;
    if (LumenOrders.validId(savedId)) return { id: savedId.toLowerCase(),
      notice: invalid ? "La referencia del retorno no es válida. Consultamos el pedido guardado en esta pestaña." : "" };
    return { id: null, notice: invalid ? "La referencia del pedido no es válida. Volvé al carrito para consultar tu pedido."
      : "No encontramos la referencia del pedido. Volvé al carrito o abrí el enlace con su external_reference." };
  },
  createController({ id, getOrder, render, setTimer = setTimeout, clearTimer = clearTimeout }) {
    const maxAutomaticChecks = 6;
    let automaticChecks = 0, busy = false, stopped = false, timer = null;
    function cancelTimer() { if (timer !== null) clearTimer(timer); timer = null; }
    async function check(automatic = false) {
      if (stopped || busy || !LumenOrders.validId(id)) return;
      if (automatic && automaticChecks >= maxAutomaticChecks) return;
      cancelTimer();
      busy = true;
      if (automatic) automaticChecks++;
      render({ kind: "loading", id });
      try {
        const order = LumenOrders.validateSummary(await getOrder(id));
        if (stopped) return;
        if (order.public_id.toLowerCase() !== id.toLowerCase()) throw new Error("La respuesta corresponde a otro pedido.");
        const pending = order.status === "PENDING_PAYMENT";
        const willPoll = pending && automaticChecks < maxAutomaticChecks;
        render({ kind: "order", order, willPoll, cartMessage: LumenOrders.clearPaidCart(order) });
        if (willPoll) timer = setTimer(() => { timer = null; return check(true); }, 5000);
      } catch (error) {
        if (!stopped) render({ kind: "error", id, message: error.status === 404
          ? "No encontramos este pedido en el backend. Revisá su referencia."
          : "No pudimos verificar el estado del pedido. No podemos confirmar el pago. Podés volver a consultar manualmente." });
      } finally { busy = false; }
    }
    return Object.freeze({ start: () => check(true), refresh: () => check(false),
      stop() { stopped = true; cancelTimer(); } });
  }
});

if (typeof document !== "undefined") {
  const title = document.querySelector("#returnTitle");
  const message = document.querySelector("#returnMessage");
  const summary = document.querySelector("#returnSummary");
  const refresh = document.querySelector("#refreshOrder");
  const reference = LumenOrderReturn.resolveReference(window.location.search, LumenOrders.readReference());
  if (reference.id) {
    LumenOrders.saveReference(reference.id);
    document.querySelector("#returnHomeLink").href = `index.html?external_reference=${encodeURIComponent(reference.id)}#carrito`;
  }
  document.querySelector("#returnNotice").textContent = reference.notice;
  document.querySelector("#returnReference").textContent = reference.id ? `Pedido: ${reference.id}` : "";
  const whatsapp = document.querySelector("#returnWhatsapp");
  whatsapp.href = `https://wa.me/5491127495859?text=${encodeURIComponent(reference.id
    ? `Hola, quiero consultar el pedido ${reference.id}.` : "Hola, quiero consultar por mi pedido.")}`;
  const money = amount => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount);
  function render(state) {
    refresh.disabled = state.kind === "loading";
    summary.replaceChildren();
    document.querySelector("#returnCartMessage").textContent = "";
    if (state.kind === "loading") {
      title.textContent = "Consultando tu pedido";
      message.textContent = "Estamos verificando el estado con Lumen Paper…";
      return;
    }
    if (state.kind === "error") {
      title.textContent = "No pudimos verificar el pago";
      message.textContent = state.message;
      return;
    }
    const order = state.order;
    const messages = {
      PAID: ["Pago confirmado", "Lumen Paper confirmó el pago de tu pedido. Gracias por tu compra."],
      CANCELLED: ["Pedido cancelado", "El backend informa que este pedido está cancelado. Contactanos si necesitás ayuda."],
      PAYMENT_REVIEW: ["Pago en revisión", "El pago de este pedido requiere revisión. Puede haber un reembolso, contracargo o una inconsistencia. No podemos confirmar la compra ni ofrecer otro pago. Tu carrito se conserva; contactá a Lumen Paper por WhatsApp."],
      PENDING_PAYMENT: ["Pago todavía no confirmado", "Tu pedido sigue pendiente de pago. La confirmación puede demorar después de volver de Mercado Pago; este estado no significa que el pago haya sido rechazado."]
    };
    title.textContent = messages[order.status][0];
    message.textContent = messages[order.status][1] + (order.status === "PENDING_PAYMENT"
      ? (state.willPoll ? " Volveremos a consultar en unos segundos." : " Terminamos las consultas automáticas. Podés actualizar el estado manualmente.") : "");
    const list = document.createElement("ul");
    for (const item of order.items) {
      const line = document.createElement("li");
      line.textContent = `${item.product_name} · ${item.variant_name} × ${item.quantity}: ${money(item.subtotal)}`;
      list.append(line);
    }
    const total = document.createElement("p");
    total.textContent = `Total del pedido: ${money(order.total)}`;
    const delivery = document.createElement("p");
    delivery.textContent = order.delivery.method === "PICKUP" ? "Retiro gratuito: coordiná con nosotros por WhatsApp."
      : order.delivery.shipping_cost === null ? "El envío se cotiza y paga por separado; no está incluido en este total."
      : `Envío informado por el backend: ${money(order.delivery.shipping_cost)}.`;
    summary.append(list, total, delivery);
    document.querySelector("#returnCartMessage").textContent = state.cartMessage;
  }
  if (!reference.id) {
    title.textContent = "No podemos consultar el pedido";
    message.textContent = "No hay una referencia válida para verificar el pago.";
    refresh.disabled = true;
  } else {
    const controller = LumenOrderReturn.createController({ id: reference.id, getOrder: id => LumenApi.getPublicOrder(id), render });
    refresh.addEventListener("click", () => controller.refresh());
    window.addEventListener("pagehide", () => controller.stop(), { once: true });
    window.addEventListener("pageshow", event => { if (event.persisted) window.location.reload(); });
    controller.start();
  }
}
