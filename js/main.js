const WHATSAPP_NUMBER = "5491127495859"; // Cambiar este numero si Lumen Paper usa otro WhatsApp.
const ALL_CATEGORIES_LABEL = "Todos";
const CUSTOM_DESIGN_VALUE = "personalizado";
const BABY_DESIGN_CATEGORY = "Bebes";
const BABY_DESIGN_ONLY_PRODUCT_IDS = ["cuaderno-pediatrico", "libro-de-recuerdos", "combo-bebe"];
const DESIGN_BATCH_SIZE = 8;
const SIZES = {
  A5: "14,8 x 21 cm",
  B5: "18,2 x 25,7 cm",
  Combo: "Cuaderno A5 + Libro B5",
  Anotador: "12 x 18 cm aprox.",
  Calendario: "Calendario de escritorio",
  ComboCalendarioAnotador: "Calendario 2027 + Anotador"
};
const DEFAULT_PRODUCT_IMAGE_SIZE = {
  width: 1086,
  height: 1448
};
const LANDSCAPE_PRODUCT_IMAGE_PATTERNS = [
  "assets/img/libro-firmas/",
  "assets/img/libro-de-recuerdos/",
  "assets/img/devocionales/devocional-mujer-1a.png",
  "assets/img/devocionales/devocional-mujer-1b.png",
  "assets/img/devocionales/devocional-mujer-1c.png",
  "assets/img/devocionales/devocional-mujer-1d.png",
  "assets/img/devocionales/devocional-mujer-1e.png",
  "assets/img/devocionales/devocional-mujer-1f.png",
  "assets/img/devocionales/devocional-nino-1a.jpeg",
  "assets/img/devocionales/devocional-nino-1b.jpeg",
  "assets/img/devocionales/devocional-nino-1c.jpeg",
  "assets/img/devocionales/devocional-nino-1d.jpeg",
  "assets/img/devocionales/devocional-nino-1e.jpeg"
];
const ORIGINAL_PRODUCT_IMAGE_PATTERNS = [
  "assets/img/anotador/",
  "assets/img/calendario-2027/",
  "assets/img/combo-anotador-calendario/"
];

const restoredCart = LumenCartStorage.load();
const cart = restoredCart.items;
let cartStorageMessage = restoredCart.message;
let catalogReady = false;
let orderSubmitting = false;
let orderUncertain = LumenOrders.isSubmissionBlocked();
let paymentUncertain = false;
let paymentStarting = false;
let orderRestoring = false;
let createdOrder = null;
let orderReference = null;
let catalogProducts = typeof productos === "undefined" ? [] : LumenCatalog.resolve(productos, []);
let activeProductCategory = ALL_CATEGORIES_LABEL;
let catalogLoading = false;
let activeDesignCategory = ALL_CATEGORIES_LABEL;
let visibleDesignsCount = DESIGN_BATCH_SIZE;

const productsGrid = document.querySelector("#productsGrid");
const categoryFilters = document.querySelector("#categoryFilters");
const designsGrid = document.querySelector("#designsGrid");
const designFilters = document.querySelector("#designFilters");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const cartSummary = document.querySelector("#cartSummary");
const cartOpenButton = document.querySelector("#cartOpenButton");
const cartModal = document.querySelector("#cartModal");
const cartModalOverlay = document.querySelector("#cartModalOverlay");
const cartCloseButton = document.querySelector("#cartCloseButton");
const checkoutStartButton = document.querySelector("#checkoutStartButton");
const checkoutForm = document.querySelector("#checkoutForm");
const checkoutMessage = document.querySelector("#checkoutMessage");
const checkoutNote = document.querySelector("#checkoutNote");
const clearCartButton = document.querySelector("#clearCartButton");
const customerName = document.querySelector("#customerName");
const customerLastName = document.querySelector("#customerLastName");
const customerPhone = document.querySelector("#customerPhone");
const navToggle = document.querySelector("#navToggle");
const mainNav = document.querySelector("#mainNav");
const headerWhatsapp = document.querySelector("#headerWhatsapp");
const heroWhatsapp = document.querySelector("#heroWhatsapp");
const footerWhatsapp = document.querySelector("#footerWhatsapp");
const customWhatsapp = document.querySelector("#customWhatsapp");
const orderWhatsapp = document.querySelector("#orderWhatsapp");
const floatingWhatsapp = document.querySelector("#floatingWhatsapp");
const productModal = document.querySelector("#productModal");
const modalOverlay = document.querySelector("#modalOverlay");
const modalClose = document.querySelector("#modalClose");
const modalBody = document.querySelector("#modalBody");
const addCartModal = document.querySelector("#addCartModal");
const addCartModalOverlay = document.querySelector("#addCartModalOverlay");
const goToCartButton = document.querySelector("#goToCartButton");
const keepShoppingButton = document.querySelector("#keepShoppingButton");
const designLightbox = document.querySelector("#designLightbox");
const designLightboxOverlay = document.querySelector("#designLightboxOverlay");
const designLightboxClose = document.querySelector("#designLightboxClose");
const designLightboxImage = document.querySelector("#designLightboxImage");
const designLightboxTitle = document.querySelector("#designLightboxTitle");
const designLightboxCategory = document.querySelector("#designLightboxCategory");
const showMoreDesignsButton = document.querySelector("#showMoreDesignsButton");

function buildWhatsappUrl(message) {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

function createWhatsappLink(productName, customMessage) {
  const message = customMessage
    ? customMessage
    : productName
    ? `Hola, quiero consultar por el producto ${productName} de Lumen Paper.`
    : "Hola, quiero consultar por los productos de Lumen Paper.";

  return buildWhatsappUrl(message);
}

function isPriceToCoordinate(product) {
  return Boolean(product && product.precioAcoordinar);
}

function getCoordinatedPriceMessage(product) {
  if (product && product.consultaWhatsappMensaje) {
    return product.consultaWhatsappMensaje;
  }

  return `Hola, quiero consultar por un diseño personalizado de Lumen Paper.

Me gustaría coordinar un producto especial personalizado.

Muchas gracias.`;
}

function openCoordinatedPriceWhatsapp(product) {
  window.open(createWhatsappLink("", getCoordinatedPriceMessage(product)), "_blank", "noopener");
}

function formatPrice(value) {
  return `$${Number(value).toLocaleString("es-AR")}`;
}

function createList(items) {
  if (!items || items.length === 0) {
    return "<p>No hay informacion cargada por el momento.</p>";
  }

  return `
    <ul>
      ${items.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;
}

function createAvailableDesignsMarkup(product) {
  if (!product || !product.disenosDisponibles) {
    return "";
  }

  const coverDesignLink = product.disenosDisponibles.tapaUrl
    ? `<p><a href="${escapeAttribute(product.disenosDisponibles.tapaUrl)}">${product.disenosDisponibles.tapaTexto}</a></p>`
    : "";

  return `
        <div class="modal-info-block modal-info-highlight">
          <h3>${product.disenosDisponibles.titulo}</h3>
          <p>${product.disenosDisponibles.texto}</p>
          <p>${product.disenosDisponibles.aclaracion}</p>
          ${coverDesignLink}
        </div>
  `;
}

function escapeAttribute(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

function getImageSize(src) {
  if (!src) {
    return null;
  }

  if (src === "assets/img/marca/logo-lumen-paper.png") {
    return { width: 2750, height: 2750 };
  }

  if (src.includes("assets/img/diseno-tapa-contratapa/")) {
    return { width: 3508, height: 2480 };
  }

  if (LANDSCAPE_PRODUCT_IMAGE_PATTERNS.some((pattern) => src.startsWith(pattern) || src === pattern)) {
    return { width: 1448, height: 1086 };
  }

  if (src.startsWith("assets/img/")) {
    return DEFAULT_PRODUCT_IMAGE_SIZE;
  }

  return null;
}

function getOptimizedImageSrc(src) {
  if (!src || !src.startsWith("assets/img/") || src.includes("assets/img/optimized/")) {
    return src;
  }

  if (
    src === "assets/img/diseno-tapa-contratapa/cristianos/036-guitarra-marron.png" ||
    src === "assets/img/diseno-tapa-contratapa/cristianos/037-guitarra-azul.png" ||
    src === "assets/img/diseno-tapa-contratapa/cristianos/038-cruz.png"
  ) {
    return src;
  }

  if (src === "assets/img/marca/logo-lumen-paper.png") {
    return src;
  }

  if (ORIGINAL_PRODUCT_IMAGE_PATTERNS.some((pattern) => src.startsWith(pattern))) {
    return src;
  }

  return src.replace("assets/img/", "assets/img/optimized/").replace(/\.(png|jpe?g)$/i, ".jpg");
}

function createImageMarkup({ src, alt, className = "", loading = "lazy", fetchpriority = "auto", id = "" }) {
  const size = getImageSize(src);
  const displaySrc = getOptimizedImageSrc(src);
  const idAttribute = id ? ` id="${escapeAttribute(id)}"` : "";
  const classAttribute = className ? ` class="${escapeAttribute(className)}"` : "";
  const sizeAttributes = size ? ` width="${size.width}" height="${size.height}"` : "";

  return `<img${idAttribute}${classAttribute} src="${escapeAttribute(displaySrc)}" alt="${escapeAttribute(
    alt
  )}"${sizeAttributes} loading="${loading}" decoding="async" fetchpriority="${fetchpriority}">`;
}

function getUnitPrice(product, size) {
  if (isPriceToCoordinate(product)) {
    return null;
  }

  const variant = product.variantesResueltas && product.variantesResueltas[size];
  return variant ? variant.precio : null;
}

function getAvailableSizes(product) {
  return product && product.variantesResueltas ? Object.keys(product.variantesResueltas) : [];
}

function getValidQuantity(value) {
  const quantity = Number.parseInt(value, 10);
  return Number.isFinite(quantity) && quantity >= 1 ? Math.min(quantity, 1000) : 1;
}

function getCartTotal() {
  return cart.reduce((total, item) => total + (item.disponible ? item.subtotal : 0), 0);
}

function persistCart() {
  cartStorageMessage = LumenCartStorage.save(cart);
}

function canFinalizeCart() {
  return catalogReady && !catalogLoading && !orderSubmitting && !orderUncertain && !paymentStarting && !orderRestoring && !orderReference && cart.length > 0 && cart.every((item) => item.disponible);
}

function reconcileCart() {
  const updated = cart.map((saved) => {
    const product = catalogProducts.find((candidate) => candidate.id === saved.productoId);
    const expectedSku = product && product.skuPorTamano && product.skuPorTamano[saved.tamano];
    const variant = product && product.variantesResueltas && product.variantesResueltas[saved.tamano];
    const design = product && getDesignsForProduct(product).find((candidate) => candidate.id === saved.disenoId);
    const customAllowed = product && !product.omitirSeleccionDiseno && !isBabyDesignOnlyProduct(product);
    const designValid = product && (product.omitirSeleccionDiseno ? saved.disenoId === null
      : Boolean(design) || (saved.disenoId === CUSTOM_DESIGN_VALUE && customAllowed));
    const available = Boolean(catalogReady && !catalogLoading && product && !isPriceToCoordinate(product) &&
      expectedSku === saved.sku && variant && variant.precio > 0 && designValid);
    let reason = "Estamos verificando disponibilidad y precios del carrito.";
    if (catalogReady && !catalogLoading) {
      reason = !product || !variant || expectedSku !== saved.sku || (variant && variant.precio <= 0)
        ? "Esta variante ya no está disponible. Eliminá el producto para continuar."
        : "El diseño elegido ya no está disponible. Eliminá el producto y elegí otro diseño.";
    }
    return { ...saved,
      producto: product ? product.nombre : "Producto no disponible",
      categoria: product ? product.categoria : "",
      backendSlug: product ? product.backendSlug : null,
      medida: SIZES[saved.tamano] || saved.tamano,
      diseno: design ? design.nombre : saved.disenoId === CUSTOM_DESIGN_VALUE ? "Diseño personalizado"
        : saved.disenoId === null ? "Diseño a consultar por WhatsApp" : "Diseño no disponible",
      categoriaDiseno: design ? design.categoriaDiseno : "",
      variant_id: available ? variant.variant_id : saved.variant_id,
      precioUnitario: available ? variant.precio : null,
      subtotal: available ? variant.precio * saved.cantidad : null,
      disponible: available,
      motivoNoDisponible: available ? "" : reason
    };
  });
  cart.splice(0, cart.length, ...updated);
  renderCart();
}

function setupCartPersistence() {
  // Guards outside the existing checkout handlers keep its fields and WhatsApp flow intact.
  for (const [target, eventName] of [[checkoutStartButton, "click"], [checkoutForm, "submit"]]) {
    if (target) target.addEventListener(eventName, (event) => {
      if (!canFinalizeCart()) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (checkoutMessage) checkoutMessage.textContent = "Revisá los productos no disponibles o esperá la validación del catálogo.";
      }
    }, true);
  }
  const openFromHash = () => {
    if (window.location.hash === "#carrito" && cartModal) openCartModal();
  };
  window.addEventListener("hashchange", openFromHash);
  window.addEventListener("storage", (event) => {
    if (event.key !== LumenCartStorage.key && event.key !== null) return;
    const restored = LumenCartStorage.load();
    cartStorageMessage = restored.message;
    cart.splice(0, cart.length, ...restored.items);
    reconcileCart();
  });
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    const restored = LumenCartStorage.load();
    cartStorageMessage = restored.message;
    cart.splice(0, cart.length, ...restored.items);
    paymentStarting = false;
    loadLocalCatalog();
    restoreOrderReference();
  });
  openFromHash();
}

window.addEventListener("pagehide", () => {
  performCheckout.sequence = (performCheckout.sequence || 0) + 1;
});

function updateCartCounters() {
  const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);
  document.querySelectorAll(".cart-count-inline").forEach((counter) => {
    counter.textContent = totalItems;
  });
}

function getProductPriceLabel(product) {
  if (isPriceToCoordinate(product)) return product.precio || "Precio a coordinar";
  const prices = getAvailableSizes(product).map((size) => getUnitPrice(product, size));
  if (!prices.length) return "Precio no disponible";
  return `${prices.length > 1 ? "Desde " : ""}${formatPrice(Math.min(...prices))}`;
}

async function loadLocalCatalog() {
  if (typeof productos === "undefined" || catalogLoading) return;
  const status = document.querySelector("#catalogStatus");
  const retry = document.querySelector("#catalogRetryButton");
  if (!LUMEN_CONFIG.apiBaseUrl) {
    if (status) status.textContent = "La API del catálogo no está configurada para este sitio. Las compras con precio están deshabilitadas.";
    if (retry) retry.hidden = true;
    reconcileCart();
    return;
  }
  catalogLoading = true;
  catalogReady = false;
  reconcileCart();
  if (status) status.textContent = "Cargando precios y disponibilidad…";
  if (retry) retry.hidden = true;
  if (productsGrid) productsGrid.setAttribute("aria-busy", "true");
  try {
    const response = await LumenApi.getPublicProducts();
    catalogProducts = LumenCatalog.resolve(productos, response);
    if (productModal && productModal.classList.contains("is-open")) closeProductModal();
    renderProducts(activeProductCategory);
    const incomplete = catalogProducts.some((product) =>
      !isPriceToCoordinate(product) && product.tamanosNoDisponibles.length > 0);
    catalogReady = true;
    if (status) status.textContent = incomplete
      ? "Catálogo conectado. Algunas opciones no están disponibles en el backend."
      : "Catálogo conectado. Precios y variantes actualizados.";
    if (retry) retry.hidden = !incomplete;
  } catch (error) {
    catalogProducts = LumenCatalog.resolve(productos, []);
    if (productModal && productModal.classList.contains("is-open")) closeProductModal();
    renderProducts(activeProductCategory);
    if (status) status.textContent = `No se pudo cargar el catálogo. ${error.message} Podés reintentar en unos momentos.`;
    if (retry) retry.hidden = false;
  } finally {
    catalogLoading = false;
    if (productsGrid) productsGrid.setAttribute("aria-busy", "false");
    reconcileCart();
  }
}

function createProductCard(product, index = 0) {
  const article = document.createElement("article");
  const hasCoordinatedPrice = isPriceToCoordinate(product);
  const isPriorityImage = index === 0;
  article.className = "product-card";
  article.tabIndex = 0;
  article.dataset.productId = product.id;
  article.setAttribute("aria-label", `Ver detalle de ${product.nombre}`);

  article.innerHTML = `
    ${createImageMarkup({
      src: product.imagenPrincipal,
      alt: product.nombre,
      className: "product-image",
      loading: isPriorityImage ? "eager" : "lazy",
      fetchpriority: isPriorityImage ? "high" : "low"
    })}
    <div class="product-content">
      <p class="product-category">${product.categoria}</p>
      <h3>${product.nombre}</h3>
      <p class="product-description">${product.descripcion}</p>
      <p class="product-price">${getProductPriceLabel(product)}</p>
      <button class="button product-buy-button" type="button">
        ${hasCoordinatedPrice ? "Consultar por WhatsApp" : "Ver opciones"}
      </button>
    </div>
  `;

  article.addEventListener("click", () => openProductModal(product));
  article.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProductModal(product);
    }
  });

  article.querySelector(".product-buy-button").addEventListener("click", (event) => {
    event.stopPropagation();
    if (hasCoordinatedPrice) {
      openCoordinatedPriceWhatsapp(product);
      return;
    }

    openProductModal(product);
  });

  return article;
}

function renderProducts(category = activeProductCategory) {
  if (!productsGrid || typeof productos === "undefined") {
    return;
  }

  activeProductCategory = category;
  const filteredProducts =
    category === ALL_CATEGORIES_LABEL
      ? catalogProducts
      : catalogProducts.filter((product) => product.categoria === category);

  productsGrid.innerHTML = "";
  filteredProducts.forEach((product, index) => {
    productsGrid.appendChild(createProductCard(product, index));
  });
}

function getCategories() {
  if (typeof productos === "undefined") {
    return [ALL_CATEGORIES_LABEL];
  }

  const categories = productos.map((product) => product.categoria);
  return [ALL_CATEGORIES_LABEL, ...new Set(categories)];
}

function renderCategoryFilters() {
  if (!categoryFilters || typeof productos === "undefined") {
    return;
  }

  getCategories().forEach((category) => {
    const button = document.createElement("button");
    button.className = "filter-button";
    button.type = "button";
    button.textContent = category;

    if (category === ALL_CATEGORIES_LABEL) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      categoryFilters.querySelectorAll(".filter-button").forEach((filterButton) => {
        filterButton.classList.remove("active");
      });

      button.classList.add("active");
      renderProducts(category);
    });

    categoryFilters.appendChild(button);
  });
}

function createDesignCard(design, index = 0) {
  const article = document.createElement("article");
  const isPriorityImage = index === 0;
  article.className = "design-card";
  article.tabIndex = 0;
  article.setAttribute("role", "button");
  article.setAttribute("aria-label", `Ver diseño ${design.nombre} en grande`);
  article.innerHTML = `
    ${createImageMarkup({
      src: design.imagen,
      alt: design.nombre,
      className: "design-image",
      loading: isPriorityImage ? "eager" : "lazy",
      fetchpriority: isPriorityImage ? "high" : "low"
    })}
    <div class="design-content">
      <p class="product-category">${design.categoriaDiseno}</p>
      <h3>${design.nombre}</h3>
      <p>Apto para personalizar en agendas, cuadernos o devocionales.</p>
    </div>
  `;

  article.addEventListener("click", () => openDesignLightbox(design));
  article.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDesignLightbox(design);
    }
  });

  return article;
}

function getFilteredDesigns(category) {
  if (typeof disenos === "undefined") {
    return [];
  }

  return category === ALL_CATEGORIES_LABEL
    ? disenos
    : disenos.filter((design) => design.categoriaDiseno === category);
}

function getDesignCategories() {
  if (typeof disenos === "undefined") {
    return [ALL_CATEGORIES_LABEL];
  }

  const categories = disenos.map((design) => design.categoriaDiseno);
  return [ALL_CATEGORIES_LABEL, ...new Set(categories)];
}

function normalizeCategory(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isBabyDesignOnlyProduct(product) {
  return Boolean(product && BABY_DESIGN_ONLY_PRODUCT_IDS.includes(product.id));
}

function getDesignsForProduct(product) {
  if (typeof disenos === "undefined") {
    return [];
  }

  if (isBabyDesignOnlyProduct(product)) {
    const babyDesignCategory = normalizeCategory(BABY_DESIGN_CATEGORY);
    return disenos.filter((design) => normalizeCategory(design.categoriaDiseno) === babyDesignCategory);
  }

  return disenos;
}

function updateShowMoreDesignsButton(totalDesigns) {
  if (!showMoreDesignsButton) {
    return;
  }

  const remainingDesigns = totalDesigns - visibleDesignsCount;
  showMoreDesignsButton.hidden = remainingDesigns <= 0;
  showMoreDesignsButton.textContent =
    remainingDesigns > 0 ? `Ver más diseños (${remainingDesigns})` : "Ver más diseños";
}

function renderDesigns(category = activeDesignCategory) {
  if (!designsGrid || typeof disenos === "undefined") {
    return;
  }

  activeDesignCategory = category;
  const filteredDesigns = getFilteredDesigns(category);
  const designsToShow = filteredDesigns.slice(0, visibleDesignsCount);

  designsGrid.innerHTML = "";
  designsToShow.forEach((design, index) => {
    designsGrid.appendChild(createDesignCard(design, index));
  });
  updateShowMoreDesignsButton(filteredDesigns.length);
}

function renderDesignFilters() {
  if (!designFilters || typeof disenos === "undefined") {
    return;
  }

  getDesignCategories().forEach((category) => {
    const button = document.createElement("button");
    button.className = "filter-button";
    button.type = "button";
    button.textContent = category;

    if (category === ALL_CATEGORIES_LABEL) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      designFilters.querySelectorAll(".filter-button").forEach((filterButton) => {
        filterButton.classList.remove("active");
      });

      button.classList.add("active");
      visibleDesignsCount = DESIGN_BATCH_SIZE;
      renderDesigns(category);
    });

    designFilters.appendChild(button);
  });
}

function openDesignLightbox(design) {
  if (!designLightbox) {
    return;
  }

  designLightboxImage.src = getOptimizedImageSrc(design.imagen);
  designLightboxImage.alt = design.nombre;
  const imageSize = getImageSize(design.imagen);

  if (imageSize) {
    designLightboxImage.width = imageSize.width;
    designLightboxImage.height = imageSize.height;
  }

  designLightboxTitle.textContent = design.nombre;
  designLightboxCategory.textContent = design.categoriaDiseno;
  designLightbox.classList.add("is-open");
  designLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  designLightboxClose.focus();
}

function closeDesignLightbox() {
  if (!designLightbox) {
    return;
  }

  designLightbox.classList.remove("is-open");
  designLightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  designLightboxImage.src = "";
  designLightboxImage.alt = "";
  designLightboxTitle.textContent = "";
  designLightboxCategory.textContent = "";
}

function createProductGallery(product) {
  const imageFitClass = product.imagenAjuste === "contain" ? " modal-main-image-contain" : "";
  const thumbnails = product.imagenes
    .map(
      (image, index) => `
        <button class="modal-thumbnail ${index === 0 ? "active" : ""}" type="button" data-image="${image}">
          ${createImageMarkup({
            src: image,
            alt: `${product.nombre} imagen ${index + 1}`,
            loading: index === 0 ? "eager" : "lazy",
            fetchpriority: index === 0 ? "high" : "low"
          })}
        </button>
      `
    )
    .join("");

  return `
    <div class="modal-gallery">
      ${createImageMarkup({
        src: product.imagenPrincipal,
        alt: product.nombre,
        id: "modalMainImage",
        className: `modal-main-image${imageFitClass}`,
        loading: "eager",
        fetchpriority: "high"
      })}
      <div class="modal-thumbnails" aria-label="Imágenes de ${product.nombre}">
        ${thumbnails}
      </div>
    </div>
  `;
}

function createDesignOptions(product) {
  const availableDesigns = getDesignsForProduct(product);
  const categories = [...new Set(availableDesigns.map((design) => design.categoriaDiseno))];
  const customDesignOption = isBabyDesignOnlyProduct(product)
    ? ""
    : `<option value="${CUSTOM_DESIGN_VALUE}">Diseño personalizado</option>`;

  return `
    <option value="">Seleccionar diseño</option>
    ${customDesignOption}
    ${categories
      .map((category) => {
        const categoryDesigns = availableDesigns.filter((design) => design.categoriaDiseno === category);
        return `
    <optgroup label="${category}">
      ${categoryDesigns.map((design) => `<option value="${design.id}">${design.nombre}</option>`).join("")}
    </optgroup>`;
      })
      .join("")}
  `;
}

function createSizeOptionsMarkup(product) {
  const availableSizes = getAvailableSizes(product);

  if (availableSizes.length === 0) {
    return "";
  }

  if (availableSizes.length === 1) {
    const size = availableSizes[0];
    return `
          <input type="hidden" name="productSize" value="${escapeAttribute(size)}">
          <div class="price-box">
            Tamaño: ${escapeAttribute(size)} - ${escapeAttribute(SIZES[size] || size)}
          </div>
    `;
  }

  return `
          <fieldset class="option-group">
            <legend>Elegí el tamaño</legend>
            ${availableSizes
              .map(
                (size, index) => `
            <label class="radio-option">
              <input type="radio" name="productSize" value="${escapeAttribute(size)}" ${index === 0 ? "checked" : ""}>
              <span>${escapeAttribute(size)} - ${escapeAttribute(SIZES[size] || size)}</span>
            </label>
              `
              )
              .join("")}
          </fieldset>
  `;
}

function createProductOptionsMarkup(product) {
  if (isPriceToCoordinate(product)) {
    return `
        <div class="product-options">
          <p class="price-box">
            El precio de este producto se coordina por WhatsApp según el diseño, tamaño y personalización solicitada.
          </p>
          <button class="button modal-buy-button" id="coordinatedPriceWhatsapp" type="button">
            Consultar por WhatsApp
          </button>
        </div>
    `;
  }

  if (getAvailableSizes(product).length === 0) {
    return `<div class="product-options"><p class="price-box">No hay variantes disponibles para comprar este producto. Necesitamos consultar el catálogo actualizado.</p><button class="button modal-buy-button" type="button" disabled>Agregar al carrito</button></div>`;
  }

  const unavailableNote = product.tamanosNoDisponibles.length
    ? `<p class="form-message">Opciones no disponibles: ${product.tamanosNoDisponibles.map(escapeAttribute).join(", ")}.</p>`
    : "";
  const designSelectMarkup = product.omitirSeleccionDiseno
    ? ""
    : `
          <label class="select-option">
            Elegí el diseño
            <select id="productDesign">
              ${createDesignOptions(product)}
            </select>
          </label>
    `;

  return `
        <form class="product-options" id="productOptionsForm">
          ${createSizeOptionsMarkup(product)}
          ${unavailableNote}

          ${designSelectMarkup}

          <label class="quantity-option">
            Cantidad
            <input id="productQuantity" type="number" min="1" value="1">
          </label>

          <div class="price-box" aria-live="polite">
            <p id="unitPriceText"></p>
            <p id="subtotalText"></p>
          </div>

          <p class="form-message" id="productOptionMessage" aria-live="polite"></p>
          <button class="button modal-buy-button" type="submit">Agregar al carrito</button>
        </form>
    `;
}

function openProductModal(product) {
  modalBody.innerHTML = `
    <div class="modal-layout">
      ${createProductGallery(product)}
      <div class="modal-detail">
        <p class="product-category">${product.categoria}</p>
        <h2 id="modalTitle">${product.nombre}</h2>

        ${createProductOptionsMarkup(product)}

        <p class="modal-description">${product.descripcionLarga}</p>

        ${createAvailableDesignsMarkup(product)}

        <div class="modal-info-block">
          <h3>Incluye</h3>
          ${createList(product.incluye)}
        </div>

        <div class="modal-info-block">
          <h3>Medidas aproximadas</h3>
          ${createList(product.medidas)}
        </div>

        <div class="modal-info-block">
          <h3>Ideal para</h3>
          <p>${product.idealPara}</p>
        </div>

        ${
          product.aclaracion
            ? `<div class="modal-info-block"><h3>Aclaración</h3><p>${product.aclaracion}</p></div>`
            : ""
        }
      </div>
    </div>
  `;

  productModal.classList.add("is-open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalClose.focus();
  setupGalleryEvents();

  if (isPriceToCoordinate(product)) {
    document
      .querySelector("#coordinatedPriceWhatsapp")
      .addEventListener("click", () => openCoordinatedPriceWhatsapp(product));
    return;
  }

  setupProductOptions(product);
}

function setupGalleryEvents() {
  const mainImage = document.querySelector("#modalMainImage");
  const thumbnails = document.querySelectorAll(".modal-thumbnail");

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      mainImage.src = getOptimizedImageSrc(thumbnail.dataset.image);
      mainImage.alt = thumbnail.querySelector("img").alt;
      const imageSize = getImageSize(thumbnail.dataset.image);

      if (imageSize) {
        mainImage.width = imageSize.width;
        mainImage.height = imageSize.height;
      }

      thumbnails.forEach((item) => item.classList.remove("active"));
      thumbnail.classList.add("active");
    });
  });
}

function setupProductOptions(product) {
  if (isPriceToCoordinate(product)) {
    return;
  }

  const form = document.querySelector("#productOptionsForm");
  if (!form) return;
  const quantityInput = document.querySelector("#productQuantity");
  const designSelect = document.querySelector("#productDesign");
  const unitPriceText = document.querySelector("#unitPriceText");
  const subtotalText = document.querySelector("#subtotalText");
  const message = document.querySelector("#productOptionMessage");

  function getSelectedSize() {
    const selectedSizeInput = form.querySelector('input[name="productSize"]:checked, input[name="productSize"][type="hidden"]');
    return selectedSizeInput ? selectedSizeInput.value : "";
  }

  function updatePricePreview() {
    const selectedSize = getSelectedSize();
    const quantity = getValidQuantity(quantityInput.value);
    const unitPrice = getUnitPrice(product, selectedSize);

    if (unitPrice === null || unitPrice <= 0) {
      unitPriceText.textContent = "Precio no configurado para este tamaño.";
      subtotalText.textContent = "";
      return;
    }

    unitPriceText.textContent = `Precio unitario: ${formatPrice(unitPrice)}`;
    subtotalText.textContent = `Total: ${formatPrice(unitPrice * quantity)}`;
  }

  form.addEventListener("input", updatePricePreview);
  form.addEventListener("change", updatePricePreview);
  quantityInput.addEventListener("blur", () => {
    quantityInput.value = getValidQuantity(quantityInput.value);
    updatePricePreview();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    message.textContent = "";

    if (!catalogReady || catalogLoading) {
      message.textContent = "Esperá a que se verifique el catálogo para agregar productos.";
      return;
    }
    const selectedSize = getSelectedSize();
    const selectedDesignId = designSelect ? designSelect.value : "";
    const quantity = getValidQuantity(quantityInput.value);
    const unitPrice = getUnitPrice(product, selectedSize);

    if (!selectedSize) {
      message.textContent = "Elegí un tamaño para continuar.";
      return;
    }

    if (designSelect && !selectedDesignId) {
      message.textContent = "Elegí un diseño para agregar el producto al carrito.";
      return;
    }

    if (unitPrice === null || unitPrice <= 0) {
      message.textContent = "Este producto no tiene precio configurado para el tamaño elegido.";
      return;
    }

    const selectedDesign =
      selectedDesignId === CUSTOM_DESIGN_VALUE
        ? null
        : disenos.find((design) => design.id === selectedDesignId);
    const designName = designSelect
      ? selectedDesign
        ? selectedDesign.nombre
        : "Diseño personalizado"
      : "Diseño a consultar por WhatsApp";

    if (cart.length >= 50) {
      message.textContent = "El carrito admite hasta 50 líneas. Eliminá una para agregar otro producto.";
      return;
    }
    cart.push({
      productoId: product.id,
      backendSlug: product.backendSlug,
      variant_id: product.variantesResueltas[selectedSize].variant_id,
      sku: product.variantesResueltas[selectedSize].sku,
      producto: product.nombre,
      categoria: product.categoria,
      tamano: selectedSize,
      medida: SIZES[selectedSize],
      disenoId: designSelect ? selectedDesignId : null,
      disponible: true,
      motivoNoDisponible: "",
      diseno: designName,
      categoriaDiseno: selectedDesign ? selectedDesign.categoriaDiseno : "",
      cantidad: quantity,
      precioUnitario: unitPrice,
      subtotal: unitPrice * quantity
    });

    persistCart();
    quantityInput.value = 1;
    renderCart();
    openAddCartModal();
  });

  updatePricePreview();
}

function openAddCartModal() {
  if (!addCartModal) {
    return;
  }

  addCartModal.classList.add("is-open");
  addCartModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (goToCartButton) {
    goToCartButton.focus();
  }
}

function closeAddCartModal() {
  if (!addCartModal) {
    return;
  }

  addCartModal.classList.remove("is-open");
  addCartModal.setAttribute("aria-hidden", "true");

  const hasOpenProductModal = productModal && productModal.classList.contains("is-open");
  const hasOpenCartModal = cartModal && cartModal.classList.contains("is-open");
  const hasOpenDesignLightbox = designLightbox && designLightbox.classList.contains("is-open");

  if (!hasOpenProductModal && !hasOpenCartModal && !hasOpenDesignLightbox) {
    document.body.classList.remove("modal-open");
  }
}

function goToCartAfterAdd() {
  closeAddCartModal();
  closeProductModal();
  openCartModal();
}

function keepShoppingAfterAdd() {
  closeAddCartModal();
  closeProductModal();

  const catalogSection = document.querySelector("#catalogo");
  if (catalogSection) {
    catalogSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function closeProductModal() {
  if (!productModal || !modalBody) {
    return;
  }

  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalBody.innerHTML = "";
}

function openCartModal() {
  if (!cartModal) {
    return;
  }

  renderCart();
  cartModal.classList.add("is-open");
  cartModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (cartCloseButton) {
    cartCloseButton.focus();
  }
}

function closeCartModal() {
  if (!cartModal) {
    return;
  }

  cartModal.classList.remove("is-open");
  cartModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function hideCheckoutForm() {
  if (checkoutForm) {
    checkoutForm.classList.add("checkout-form-hidden");
  }

  if (checkoutNote) {
    checkoutNote.hidden = true;
  }
}

function renderCart() {
  updateCartCounters();
  const cartStatus = document.querySelector("#cartStatus");
  const blocked = cart.length > 0 && (!catalogReady || catalogLoading || cart.some((item) => !item.disponible));
  if (cartStatus) cartStatus.textContent = [cartStorageMessage,
    blocked ? (!catalogReady || catalogLoading ? "No se puede finalizar hasta verificar el catálogo actual."
      : "Hay productos o diseños no disponibles. Eliminá esas líneas para continuar.") : ""].filter(Boolean).join(" ");
  if (checkoutStartButton) checkoutStartButton.disabled = !canFinalizeCart();
  if (!cartItems || !cartTotal) {
    return;
  }

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <p>El carrito está vacío.</p>
        <p>Elegí un producto del catálogo para empezar a armar tu pedido.</p>
      </div>
    `;
    cartTotal.textContent = "Total general sin envío: $0";
    if (cartSummary) {
      cartSummary.classList.add("cart-summary-hidden");
    }
    hideCheckoutForm();
    return;
  }

  if (cartSummary) {
    cartSummary.classList.remove("cart-summary-hidden");
  }

  if (blocked) hideCheckoutForm();

  cartItems.innerHTML = cart
    .map(
      (item, index) => `
        <article class="cart-item">
          <div>
            <h3>${escapeAttribute(item.producto)}</h3>
            <p>Tamaño: ${escapeAttribute(item.tamano)} - ${escapeAttribute(item.medida)}</p>
            <p>Diseño: ${escapeAttribute(item.diseno)}${item.categoriaDiseno ? ` (${escapeAttribute(item.categoriaDiseno)})` : ""}</p>
            <p>Cantidad: ${item.cantidad}</p>
            ${item.disponible
              ? `<p>Precio unitario: ${formatPrice(item.precioUnitario)}</p><p>Subtotal: ${formatPrice(item.subtotal)}</p>`
              : `<p class="form-message">${escapeAttribute(item.motivoNoDisponible)}</p>`}
          </div>
          <button class="button button-secondary cart-remove-button" type="button" data-index="${index}" ${orderSubmitting ? "disabled" : ""}>
            Eliminar
          </button>
        </article>
      `
    )
    .join("");

  cartTotal.textContent = blocked
    ? `Subtotal de productos verificados, sin envío: ${formatPrice(getCartTotal())}. Carrito pendiente de revisión.`
    : `Total general sin envío: ${formatPrice(getCartTotal())}`;

  cartItems.querySelectorAll(".cart-remove-button").forEach((button) => {
    button.addEventListener("click", () => {
      cart.splice(Number(button.dataset.index), 1);
      persistCart();
      renderCart();
    });
  });
}

function buildOrderMessage(customerData) {
  const productsText = cart
    .map(
      (item, index) => `${index + 1}. Producto: ${item.producto}
Tamaño: ${item.tamano} - ${item.medida}
Diseño: ${item.diseno}${item.categoriaDiseno ? ` (${item.categoriaDiseno})` : ""}
Cantidad: ${item.cantidad}
Precio unitario: ${formatPrice(item.precioUnitario)}
Subtotal: ${formatPrice(item.subtotal)}`
    )
    .join("\n\n");
  const pediatricDesignsNote = cart.some((item) => item.productoId === "cuaderno-pediatrico")
    ? "\n\nQuisiera consultar los dos diseños de interior disponibles para el cuaderno pediátrico."
    : "";

  return `Hola, quiero realizar un pedido en Lumen Paper.

Mis datos:
Nombre: ${customerData.name}
Apellido: ${customerData.lastName}
Teléfono: ${customerData.phone}

Pedido:
${productsText}
${pediatricDesignsNote}

Total general sin envío: ${formatPrice(getCartTotal())}

Aclaración: el envío por correo o punto de entrega se coordina por WhatsApp.

Muchas gracias.`;
}

function setOrderBusy(busy) {
  orderSubmitting = busy;
  const fields = document.querySelector("#checkoutFields");
  if (fields) fields.disabled = busy || orderUncertain || Boolean(orderReference);
  if (clearCartButton) clearCartButton.disabled = busy;
  const newOrderButton = document.querySelector("#newOrderButton");
  if (newOrderButton) {
    newOrderButton.disabled = busy || orderRestoring || paymentStarting || Boolean(createdOrder && createdOrder.status === "PAYMENT_REVIEW");
    newOrderButton.hidden = Boolean(createdOrder && createdOrder.status === "PAYMENT_REVIEW");
  }
  const refreshOrderButton = document.querySelector("#refreshOrderButton");
  if (refreshOrderButton) refreshOrderButton.disabled = busy || orderRestoring || paymentStarting;
  updatePaymentButton();
  if (checkoutForm) checkoutForm.setAttribute("aria-busy", String(busy));
  renderCart();
}

function updateDeliveryFields() {
  const method = document.querySelector("#deliveryMethod");
  const shipping = document.querySelector("#shippingFields");
  if (!method || !shipping) return;
  const isShipping = method.value === "CORREO_ARGENTINO";
  shipping.hidden = !isShipping;
  shipping.disabled = !isShipping;
  document.querySelector("#deliveryNote").textContent = isShipping
    ? "El envío se cotiza y paga por separado. No está incluido en el total del pedido."
    : "El retiro no tiene costo. Coordinamos el punto de encuentro por WhatsApp.";
}

function canPayOrder() {
  return Boolean(LUMEN_CONFIG.mercadoPagoEnabled === true && createdOrder && LumenOrders.validId(orderReference) && createdOrder.public_id.toLowerCase() === orderReference.toLowerCase() &&
    createdOrder.status === "PENDING_PAYMENT" && !orderSubmitting && !orderRestoring && !paymentStarting && !paymentUncertain && !LumenApi.isCheckoutBlocked(orderReference));
}

function canRecoverCheckout() {
  return Boolean(LUMEN_CONFIG.mercadoPagoEnabled === true && createdOrder && LumenOrders.validId(orderReference) &&
    createdOrder.public_id.toLowerCase() === orderReference.toLowerCase() && createdOrder.status === "PENDING_PAYMENT" &&
    !orderSubmitting && !orderRestoring && !paymentStarting);
}

function updatePaymentButton() {
  const button = document.querySelector("#payOrderButton");
  if (!button) return;
  button.disabled = !canPayOrder();
  button.hidden = Boolean(createdOrder && createdOrder.status !== "PENDING_PAYMENT");
  button.textContent = LUMEN_CONFIG.mercadoPagoEnabled !== true ? "Mercado Pago no habilitado"
    : paymentStarting ? "Abriendo Mercado Pago…" : "Pagar con Mercado Pago";
  button.setAttribute("aria-busy", String(paymentStarting));
  const recover = document.querySelector("#recoverCheckoutButton");
  if (recover) {
    recover.disabled = !canRecoverCheckout();
    recover.hidden = LUMEN_CONFIG.mercadoPagoEnabled !== true || Boolean(createdOrder && createdOrder.status !== "PENDING_PAYMENT");
    recover.setAttribute("aria-busy", String(paymentStarting));
  }
}

async function startPayment() {
  if (!canPayOrder()) return;
  return performCheckout(false);
}

async function recoverCheckout() {
  if (!canRecoverCheckout()) return;
  return performCheckout(true);
}

async function performCheckout(recover) {
  const message = document.querySelector("#paymentMessage");
  const id = orderReference;
  const sequence = (performCheckout.sequence || 0) + 1;
  performCheckout.sequence = sequence;
  paymentStarting = true;
  setOrderBusy(false);
  message.textContent = recover ? "Consultando el enlace de pago existente…" : "Preparando el enlace de pago…";
  let redirected = false;
  let checkoutReceived = false;
  try {
    const checkout = await (recover ? LumenApi.recoverOrderCheckout(id) : LumenApi.startOrderCheckout(id));
    checkoutReceived = true;
    if (sequence !== performCheckout.sequence) return;
    // Never navigate using a cached order status after recovering or creating a preference.
    const current = LumenOrders.validateSummary(await LumenApi.getPublicOrder(id), id);
    if (sequence !== performCheckout.sequence) return;
    if (id !== orderReference || orderRestoring) throw new Error("La referencia del pedido cambió durante la consulta.");
    createdOrder = current;
    if (current.status !== "PENDING_PAYMENT") {
      showOrderSummary(current, "Consultamos el estado actual del pedido.");
      const error = new Error("El pedido ya no está pendiente de pago.");
      error.code = "ORDER_NOT_PENDING_PAYMENT";
      throw error;
    }
    message.textContent = "Redirigiendo a Mercado Pago…";
    window.location.assign(checkout.checkout_url);
    redirected = true;
  } catch (error) {
    if (sequence !== performCheckout.sequence) return;
    if (error.code === "CHECKOUT_NOT_STARTED" && recover && error.status === 409) {
      paymentUncertain = false;
      await restoreOrderReference();
      message.textContent = createdOrder && createdOrder.status === "PENDING_PAYMENT"
        ? "El servidor no encontró un checkout anterior. Podés iniciar el primer pago con el botón Pagar; no lo iniciamos automáticamente."
        : "No recuperamos un enlace. Revisá el estado del pedido antes de continuar.";
    } else if (error.code === "CHECKOUT_EXPIRED" || error.code === "CHECKOUT_REVIEW_REQUIRED") {
      paymentUncertain = true;
      message.textContent = error.code === "CHECKOUT_EXPIRED"
        ? "El enlace de pago venció. No abrimos ni creamos otra preferencia. Contactá a Lumen Paper por WhatsApp para revisar el pedido."
        : "El enlace de pago requiere revisión. No abrimos ni creamos otra preferencia. Contactá a Lumen Paper por WhatsApp.";
    } else if (error.code === "ORDER_NOT_PENDING_PAYMENT") {
      await restoreOrderReference(); // GET only: never retry checkout.
      message.textContent = createdOrder && createdOrder.status === "PAYMENT_REVIEW"
        ? "El pago está en revisión. No confirmamos la compra ni ofrecemos otro checkout. Tu carrito se conserva; contactá a Lumen Paper por WhatsApp."
        : "El pedido ya no está pendiente de pago. Consultamos su estado actual; no iniciamos otro checkout.";
    } else if (error.code === "PAYMENT_DISABLED" || error.code === "PAYMENT_NOT_CONFIGURED") {
      message.textContent = "El pago con Mercado Pago no está habilitado en este ambiente. Tu pedido y carrito se conservan; podés coordinar por WhatsApp.";
    } else if (error.code === "NOT_FOUND") {
      createdOrder = null;
      message.textContent = "No encontramos el pedido en el servidor. Conservamos su referencia y tu carrito; consultá por WhatsApp.";
    } else if (error.code === "ORDER_AMOUNT_INVALID") {
      message.textContent = "El servidor no pudo validar el importe del pedido. Conservamos el pedido y carrito; consultá por WhatsApp.";
    } else if (error.uncertain || checkoutReceived || ["CHECKOUT_ALREADY_STARTED", "CHECKOUT_BUSY", "CHECKOUT_UNCERTAIN", "PAYMENT_TIMEOUT", "PAYMENT_UNAVAILABLE", "PAYMENT_PROVIDER_ERROR"].includes(error.code)) {
      paymentUncertain = true;
      message.textContent = "No pudimos confirmar el enlace de pago. Tu pedido y carrito se conservan y no creamos otra preferencia. Podés consultar el enlace existente con Recuperar enlace de pago; si no aparece, contactá a Lumen Paper por WhatsApp.";
    } else {
      message.textContent = "No pudimos iniciar el pago. El pedido y carrito se conservan; revisá la conexión o consultá por WhatsApp.";
    }
  } finally {
    // Stay locked until navigation completes; back/forward restoration unlocks and reads the order again.
    if (sequence === performCheckout.sequence) {
      if (!redirected) paymentStarting = false;
      setOrderBusy(false);
    }
  }
}

function showOrderSummary(order, message) {
  const result = document.querySelector("#orderResult");
  result.hidden = false;
  document.querySelector("#orderResultMessage").textContent = order.status === "PAYMENT_REVIEW"
    ? "Pago en revisión. Puede haber un reembolso, contracargo o una inconsistencia. No podemos confirmar la compra. Tu carrito se conserva; contactá a Lumen Paper por WhatsApp."
    : message;
  const details = document.querySelector("#orderResultDetails");
  const statuses = { PENDING_PAYMENT: "Pendiente de pago", PAID: "Pagado", CANCELLED: "Cancelado", PAYMENT_REVIEW: "Pago en revisión" };
  details.innerHTML = `<p>Referencia: ${escapeAttribute(order.public_id)}</p><p>Estado: ${statuses[order.status]}</p>
    ${order.items.map(item => `<article class="cart-item"><div><h3>${escapeAttribute(item.product_name)}</h3>
      <p>${escapeAttribute(item.variant_name)} · Cantidad: ${item.quantity}</p>
      ${item.personalization ? `<p>${escapeAttribute(item.personalization)}</p>` : ""}
      <p>Precio unitario: ${formatPrice(item.unit_price)} · Subtotal: ${formatPrice(item.subtotal)}</p></div></article>`).join("")}
    <p>Subtotal de productos: ${formatPrice(order.subtotal)}</p><p>Total del pedido: ${formatPrice(order.total)}</p>
    <p>${order.delivery.method === "PICKUP" ? "Retiro gratuito. Punto de encuentro pendiente de coordinación."
      : "Envío por Correo Argentino: pendiente de cotización y pago por separado. No incluido en el total."}</p>
    <p>Coordiná los detalles de tu pedido por WhatsApp.</p>`;
  document.querySelector("#orderCoordinationWhatsapp").href = buildWhatsappUrl(`Hola, quiero coordinar el pedido ${order.public_id} de Lumen Paper.`);
  hideCheckoutForm();
  if (order.status === "PAYMENT_REVIEW") {
    document.querySelector("#paymentMessage").textContent = "No ofrecemos otro pago mientras el pedido está en revisión.";
  } else if (LumenApi.isCheckoutBlocked(order.public_id) && order.status === "PENDING_PAYMENT") {
    document.querySelector("#paymentMessage").textContent = "Ya se consultó un enlace para este pedido. Recuperá la preferencia existente; no inicies otro checkout.";
  }
  updatePaymentButton();
}

async function restoreOrderReference() {
  if (!checkoutForm || orderRestoring) return;
  orderReference = LumenOrders.readReference() || orderReference;
  const references = new URLSearchParams(window.location.search).getAll("external_reference");
  if (references.length === 1 && LumenOrders.validId(references[0])) {
    orderReference = references[0].toLowerCase();
    LumenOrders.saveReference(orderReference);
  }
  createdOrder = null;
  if (!orderReference) return;
  const result = document.querySelector("#orderResult");
  result.hidden = false;
  document.querySelector("#orderResultMessage").textContent = "Consultando el último pedido creado…";
  document.querySelector("#orderCoordinationWhatsapp").href = buildWhatsappUrl(`Hola, quiero consultar por el pedido ${orderReference} de Lumen Paper.`);
  orderRestoring = true;
  setOrderBusy(false);
  try {
    createdOrder = LumenOrders.validateSummary(await LumenApi.getPublicOrder(orderReference), orderReference);
    orderUncertain = false;
    LumenOrders.setSubmissionBlocked(false);
    const cartMessage = LumenOrders.clearPaidCart(createdOrder);
    if (createdOrder.status === "PAID") {
      const restored = LumenCartStorage.load();
      if (!restored.message) cart.splice(0, cart.length, ...restored.items);
      else cartStorageMessage = restored.message;
      reconcileCart();
    }
    showOrderSummary(createdOrder, "Recuperamos el resumen del pedido desde el servidor. " + cartMessage);
  } catch {
    document.querySelector("#orderResultMessage").textContent = `No pudimos consultar el pedido ${orderReference}. Conservamos su referencia; podés consultarlo por WhatsApp.`;
  } finally { orderRestoring = false; setOrderBusy(false); }
}

function setupCheckout() {
  if (!checkoutForm || !clearCartButton || !checkoutStartButton) return;
  updatePaymentButton();
  const method = document.querySelector("#deliveryMethod");
  method.addEventListener("change", updateDeliveryFields);
  updateDeliveryFields();
  if (orderUncertain) {
    document.querySelector("#orderResult").hidden = false;
    document.querySelector("#orderResultMessage").textContent = "Hay un envío de pedido sin confirmar. Consultá por WhatsApp antes de crear otro pedido.";
    document.querySelector("#orderCoordinationWhatsapp").href = buildWhatsappUrl("Hola, envié un pedido pero no recibí confirmación. Quiero verificarlo antes de repetirlo.");
    setOrderBusy(false);
  }
  checkoutStartButton.addEventListener("click", () => {
    if (!canFinalizeCart()) return;
    checkoutMessage.textContent = "";
    checkoutForm.classList.remove("checkout-form-hidden");
    if (checkoutNote) checkoutNote.hidden = !cart.some(item => item.productoId === "cuaderno-pediatrico");
    customerName.focus();
  });
  checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!canFinalizeCart()) return;
    checkoutMessage.textContent = "";
    let request;
    try {
      const value = id => document.querySelector(`#${id}`).value;
      request = LumenOrders.buildRequest({first_name: customerName.value, last_name: customerLastName.value,
        dni: value("customerDni"), phone: customerPhone.value, email: value("customerEmail"), delivery_method: method.value,
        address: value("shippingAddress"), floor_apartment: value("shippingFloor"), postal_code: value("shippingPostalCode"),
        city: value("shippingCity"), province: value("shippingProvince")}, cart);
      if (!checkoutForm.reportValidity()) return;
    } catch (error) { checkoutMessage.textContent = error.message; return; }
    const submittedCart = LumenCartStorage.sanitize(cart);
    LumenOrders.setSubmissionBlocked(true);
    setOrderBusy(true);
    checkoutMessage.textContent = "Creando tu pedido…";
    let responseReceived = false;
    try {
      const response = await LumenApi.createOrder(request);
      responseReceived = true;
      // Retain a valid UUID even if another response field is malformed.
      if (LumenOrders.validId(response && response.public_id)) {
        orderReference = response.public_id;
        LumenOrders.saveReference(orderReference);
        LumenOrders.rememberCart(orderReference, submittedCart);
      }
      createdOrder = LumenOrders.validateSummary(response);
      const stored = LumenOrders.saveReference(createdOrder.public_id);
      if (stored) LumenOrders.setSubmissionBlocked(false);
      showOrderSummary(createdOrder, stored ? "Pedido creado. Estos importes fueron calculados por el servidor."
        : "Pedido creado. Guardá su referencia: el navegador no permite conservarla al recargar.");
      checkoutMessage.textContent = "";
      checkoutForm.reset();
      updateDeliveryFields();
    } catch (error) {
      orderUncertain = Boolean(error.uncertain || responseReceived);
      if (!orderUncertain) LumenOrders.setSubmissionBlocked(false);
      if (orderUncertain && !orderReference) {
        document.querySelector("#orderResult").hidden = false;
        document.querySelector("#orderResultMessage").textContent = "El pedido podría haberse creado. Conservamos el carrito y bloqueamos otro envío hasta que lo verifiques por WhatsApp.";
        document.querySelector("#orderCoordinationWhatsapp").href = buildWhatsappUrl("Hola, envié un pedido pero no recibí confirmación. Quiero verificarlo antes de repetirlo.");
      }
      if (orderReference) {
        document.querySelector("#orderResult").hidden = false;
        document.querySelector("#orderResultMessage").textContent = `El servidor devolvió la referencia ${orderReference}, pero no pudimos leer el resumen. Consultá por WhatsApp antes de crear otro pedido.`;
        document.querySelector("#orderCoordinationWhatsapp").href = buildWhatsappUrl(`Hola, quiero consultar el pedido ${orderReference}.`);
      } else if (!orderUncertain && (error.code === "VARIANT_NOT_PURCHASABLE" || error.code === "NOT_FOUND")) {
        await loadLocalCatalog();
        checkoutMessage.textContent = "Algún producto ya no está disponible. Actualizamos el catálogo; revisá el carrito. Tus datos y productos se conservaron.";
      } else if (!orderUncertain && error.code === "VALIDATION_ERROR") {
        checkoutMessage.textContent = "El servidor rechazó los datos. Revisá los campos obligatorios, el email y las cantidades; el carrito se conservó.";
      } else {
        checkoutMessage.textContent = (error.uncertain || responseReceived)
          ? "No recibimos confirmación. El pedido podría haberse creado. Consultá por WhatsApp antes de volver a enviarlo; conservamos tu carrito y tus datos en esta página."
          : "No pudimos crear el pedido. Revisá la conexión y los datos; tu carrito se conserva.";
      }
    } finally { setOrderBusy(false); }
  });
  clearCartButton.addEventListener("click", () => {
    if (orderSubmitting) return;
    cart.length = 0;
    persistCart();
    renderCart();
  });
  document.querySelector("#payOrderButton").addEventListener("click", startPayment);
  document.querySelector("#recoverCheckoutButton").addEventListener("click", recoverCheckout);
  document.querySelector("#refreshOrderButton").addEventListener("click", () => {
    if (!orderSubmitting && !orderRestoring && !paymentStarting) restoreOrderReference();
  });
  document.querySelector("#newOrderButton").addEventListener("click", () => {
    if (orderSubmitting || orderRestoring || paymentStarting) return;
    if (createdOrder && createdOrder.status === "PAYMENT_REVIEW") return;
    if ((orderUncertain || paymentUncertain || LumenApi.isCheckoutBlocked(orderReference)) &&
        !window.confirm("El pedido anterior podría existir o tener un pago en curso. ¿Ya verificaste con Lumen Paper que podés crear una compra nueva sin duplicarlo?")) return;
    orderUncertain = false;
    paymentUncertain = false;
    LumenOrders.setSubmissionBlocked(false);
    LumenOrders.clearReference();
    document.querySelector("#paymentMessage").textContent = "";
    checkoutMessage.textContent = "";
    orderReference = null;
    createdOrder = null;
    document.querySelector("#orderResult").hidden = true;
    document.querySelector("#orderResultDetails").textContent = "";
    checkoutForm.reset();
    updateDeliveryFields();
    setOrderBusy(false);
  });
}

function setupCartModal() {
  if (cartOpenButton) {
    cartOpenButton.addEventListener("click", () => {
      openCartModal();
      if (mainNav && navToggle) {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (cartCloseButton) {
    cartCloseButton.addEventListener("click", closeCartModal);
  }

  if (cartModalOverlay) {
    cartModalOverlay.addEventListener("click", closeCartModal);
  }
}

function setupAddCartModal() {
  if (goToCartButton) {
    goToCartButton.addEventListener("click", goToCartAfterAdd);
  }

  if (keepShoppingButton) {
    keepShoppingButton.addEventListener("click", keepShoppingAfterAdd);
  }

  if (addCartModalOverlay) {
    addCartModalOverlay.addEventListener("click", keepShoppingAfterAdd);
  }
}

function setGeneralWhatsappLinks() {
  const generalLink = createWhatsappLink();
  const customLink = createWhatsappLink(
    "",
    "Hola, quiero consultar por una personalización de Lumen Paper."
  );
  const floatingLink = createWhatsappLink(
    "",
    "Hola, quiero hacer una consulta sobre los productos de Lumen Paper."
  );
  const orderLink = createWhatsappLink("", "Hola, quiero hacer un pedido en Lumen Paper.");

  if (headerWhatsapp) headerWhatsapp.href = generalLink;
  if (heroWhatsapp) heroWhatsapp.href = generalLink;
  if (footerWhatsapp) footerWhatsapp.href = generalLink;
  if (customWhatsapp) customWhatsapp.href = customLink;
  if (orderWhatsapp) orderWhatsapp.href = orderLink;
  if (floatingWhatsapp) floatingWhatsapp.href = floatingLink;
}

function setupMobileNav() {
  if (!navToggle || !mainNav) {
    return;
  }

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (modalClose) {
  modalClose.addEventListener("click", closeProductModal);
}

if (modalOverlay) {
  modalOverlay.addEventListener("click", closeProductModal);
}

if (designLightboxClose) {
  designLightboxClose.addEventListener("click", closeDesignLightbox);
}

if (designLightboxOverlay) {
  designLightboxOverlay.addEventListener("click", closeDesignLightbox);
}

if (showMoreDesignsButton) {
  showMoreDesignsButton.addEventListener("click", () => {
    visibleDesignsCount += DESIGN_BATCH_SIZE;
    renderDesigns(activeDesignCategory);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (productModal && productModal.classList.contains("is-open")) {
    closeProductModal();
  }

  if (designLightbox && designLightbox.classList.contains("is-open")) {
    closeDesignLightbox();
  }

  if (cartModal && cartModal.classList.contains("is-open")) {
    closeCartModal();
  }

  if (addCartModal && addCartModal.classList.contains("is-open")) {
    keepShoppingAfterAdd();
  }
});

setGeneralWhatsappLinks();
setupMobileNav();
setupCartModal();
setupAddCartModal();
setupCartPersistence();
setupCheckout();
renderDesignFilters();
renderDesigns();
renderCategoryFilters();
renderProducts();
reconcileCart();

const catalogRetryButton = document.querySelector("#catalogRetryButton");
if (catalogRetryButton) catalogRetryButton.addEventListener("click", loadLocalCatalog);
loadLocalCatalog();

restoreOrderReference();
