const LumenCatalog = Object.freeze({
  resolve(localProducts, apiProducts) {
    if (!Array.isArray(apiProducts)) throw new Error("La API devolvió un catálogo inválido.");
    const bySlug = new Map();
    const seenIds = new Set();
    const seenSkus = new Set();
    for (const product of apiProducts) {
      if (!product || typeof product.slug !== "string" || !product.slug ||
          bySlug.has(product.slug) || !Array.isArray(product.variants)) {
        throw new Error("La API devolvió productos inválidos o duplicados.");
      }
      const variants = new Map();
      for (const variant of product.variants) {
        if (!variant || !Number.isSafeInteger(variant.id) || variant.id <= 0 || seenIds.has(variant.id) ||
            typeof variant.sku !== "string" || !variant.sku || seenSkus.has(variant.sku) ||
            typeof variant.name !== "string" ||
            typeof variant.price !== "number" || !Number.isFinite(variant.price) || variant.price < 0) {
          throw new Error("La API devolvió variantes inválidas o duplicadas.");
        }
        seenIds.add(variant.id);
        seenSkus.add(variant.sku);
        variants.set(variant.sku, variant);
      }
      bySlug.set(product.slug, variants);
    }

    return localProducts.map((product) => {
      if (product.precioAcoordinar) return { ...product };
      const backendVariants = bySlug.get(product.backendSlug);
      const variantesResueltas = {};
      const tamanosNoDisponibles = [];
      for (const [size, sku] of Object.entries(product.skuPorTamano || {})) {
        const variant = backendVariants && backendVariants.get(sku);
        if (variant && variant.price > 0) {
          variantesResueltas[size] = {
            variant_id: variant.id,
            sku: variant.sku,
            nombre: variant.name,
            precio: variant.price
          };
        } else {
          tamanosNoDisponibles.push(size);
        }
      }
      // Los precios locales se conservan en el archivo fuente, pero no habilitan compras.
      return { ...product, precio: "", preciosPorTamano: {}, variantesResueltas, tamanosNoDisponibles };
    });
  }
});
