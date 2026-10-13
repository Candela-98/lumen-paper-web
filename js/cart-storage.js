// Solo referencias de productos: nunca precios, textos libres o datos del cliente.
const LumenCartStorage = Object.freeze({
  key: "lumen-paper.cart.v1",
  sanitize(items) {
    if (!Array.isArray(items) || items.length > 50) throw new Error("Carrito inválido");
    return items.map((item) => {
      if (!item || typeof item.productoId !== "string" || !item.productoId || item.productoId.length > 120 ||
          typeof item.tamano !== "string" || !item.tamano || item.tamano.length > 80 ||
          typeof item.sku !== "string" || !item.sku || item.sku.length > 80 ||
          !Number.isSafeInteger(item.variant_id) || item.variant_id <= 0 ||
          !Number.isInteger(item.cantidad) || item.cantidad < 1 || item.cantidad > 1000 ||
          !(item.disenoId === null || (typeof item.disenoId === "string" && item.disenoId.length > 0 && item.disenoId.length <= 120))) {
        throw new Error("Carrito inválido");
      }
      return { productoId: item.productoId, tamano: item.tamano, sku: item.sku,
        variant_id: item.variant_id, cantidad: item.cantidad, disenoId: item.disenoId };
    });
  },
  load() {
    try {
      const raw = window.localStorage.getItem(this.key);
      if (!raw) return { items: [], message: "" };
      const saved = JSON.parse(raw);
      if (!saved || saved.version !== 1) throw new Error("Versión inválida");
      return { items: this.sanitize(saved.items), message: "" };
    } catch (error) {
      return { items: [], message: "No pudimos recuperar el carrito guardado. Puede estar dañado o el navegador no permite acceder al almacenamiento." };
    }
  },
  save(items) {
    try {
      window.localStorage.setItem(this.key, JSON.stringify({ version: 1, items: this.sanitize(items) }));
      return "";
    } catch (error) {
      return "No pudimos guardar el carrito. Podés usarlo en esta página, pero los cambios pueden perderse al recargar.";
    }
  }
});
