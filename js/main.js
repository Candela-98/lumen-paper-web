const WHATSAPP_NUMBER = "5491127495859"; // Cambiar este numero si Lumen Paper usa otro WhatsApp.
const ALL_CATEGORIES_LABEL = "Todos";
const CUSTOM_DESIGN_VALUE = "personalizado";
const DESIGN_BATCH_SIZE = 8;
const SIZES = {
  A5: "14,8 x 21 cm",
  B5: "18,2 x 25,7 cm"
};

const cart = [];
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

function getCoordinatedPriceMessage() {
  return `Hola, quiero consultar por un diseño personalizado de Lumen Paper.

Me gustaría coordinar un producto especial personalizado.

Muchas gracias.`;
}

function openCoordinatedPriceWhatsapp() {
  window.open(createWhatsappLink("", getCoordinatedPriceMessage()), "_blank", "noopener");
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

function getUnitPrice(product, size) {
  if (isPriceToCoordinate(product)) {
    return null;
  }

  return product.preciosPorTamano ? product.preciosPorTamano[size] : null;
}

function getValidQuantity(value) {
  const quantity = Number.parseInt(value, 10);
  return Number.isFinite(quantity) && quantity >= 1 ? quantity : 1;
}

function getCartTotal() {
  return cart.reduce((total, item) => total + item.subtotal, 0);
}

function updateCartCounters() {
  const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);
  document.querySelectorAll(".cart-count-inline").forEach((counter) => {
    counter.textContent = totalItems;
  });
}

function createProductCard(product) {
  const article = document.createElement("article");
  const hasCoordinatedPrice = isPriceToCoordinate(product);
  article.className = "product-card";
  article.tabIndex = 0;
  article.dataset.productId = product.id;
  article.setAttribute("aria-label", `Ver detalle de ${product.nombre}`);

  article.innerHTML = `
    <img class="product-image" src="${product.imagenPrincipal}" alt="${product.nombre}" loading="lazy" decoding="async">
    <div class="product-content">
      <p class="product-category">${product.categoria}</p>
      <h3>${product.nombre}</h3>
      <p class="product-description">${product.descripcion}</p>
      <p class="product-price">${product.precio || "Precio a coordinar"}</p>
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
      openCoordinatedPriceWhatsapp();
      return;
    }

    openProductModal(product);
  });

  return article;
}

function renderProducts(category = ALL_CATEGORIES_LABEL) {
  if (!productsGrid || typeof productos === "undefined") {
    return;
  }

  const filteredProducts =
    category === ALL_CATEGORIES_LABEL
      ? productos
      : productos.filter((product) => product.categoria === category);

  productsGrid.innerHTML = "";
  filteredProducts.forEach((product) => {
    productsGrid.appendChild(createProductCard(product));
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

function createDesignCard(design) {
  const article = document.createElement("article");
  article.className = "design-card";
  article.tabIndex = 0;
  article.setAttribute("role", "button");
  article.setAttribute("aria-label", `Ver diseño ${design.nombre} en grande`);
  article.innerHTML = `
    <img class="design-image" src="${design.imagen}" alt="${design.nombre}" loading="lazy" decoding="async">
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
  designsToShow.forEach((design) => {
    designsGrid.appendChild(createDesignCard(design));
  });
  updateShowMoreDesignsButton(filteredDesigns.length);
}

function renderDesignFilters() {
  if (!designFilters || typeof disenos === "undefined") {
    return;
  }

  [ALL_CATEGORIES_LABEL, "Cristianos", "Generales"].forEach((category) => {
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

  designLightboxImage.src = design.imagen;
  designLightboxImage.alt = design.nombre;
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
  const thumbnails = product.imagenes
    .map(
      (image, index) => `
        <button class="modal-thumbnail ${index === 0 ? "active" : ""}" type="button" data-image="${image}">
          <img src="${image}" alt="${product.nombre} imagen ${index + 1}" loading="lazy" decoding="async">
        </button>
      `
    )
    .join("");

  return `
    <div class="modal-gallery">
      <img class="modal-main-image" id="modalMainImage" src="${product.imagenPrincipal}" alt="${product.nombre}" decoding="async">
      <div class="modal-thumbnails" aria-label="Imágenes de ${product.nombre}">
        ${thumbnails}
      </div>
    </div>
  `;
}

function createDesignOptions() {
  const cristianos = disenos.filter((design) => design.categoriaDiseno === "Cristianos");
  const generales = disenos.filter((design) => design.categoriaDiseno === "Generales");

  return `
    <option value="">Seleccionar diseño</option>
    <option value="${CUSTOM_DESIGN_VALUE}">Diseño personalizado</option>
    <optgroup label="Cristianos">
      ${cristianos
        .map((design) => `<option value="${design.id}">${design.nombre}</option>`)
        .join("")}
    </optgroup>
    <optgroup label="Generales">
      ${generales
        .map((design) => `<option value="${design.id}">${design.nombre}</option>`)
        .join("")}
    </optgroup>
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

  return `
        <form class="product-options" id="productOptionsForm">
          <fieldset class="option-group">
            <legend>Elegí el tamaño</legend>
            <label class="radio-option">
              <input type="radio" name="productSize" value="A5" checked>
              <span>A5 - ${SIZES.A5}</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="productSize" value="B5">
              <span>B5 - ${SIZES.B5}</span>
            </label>
          </fieldset>

          <label class="select-option">
            Elegí el diseño
            <select id="productDesign">
              ${createDesignOptions()}
            </select>
          </label>

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
      .addEventListener("click", openCoordinatedPriceWhatsapp);
    return;
  }

  setupProductOptions(product);
}

function setupGalleryEvents() {
  const mainImage = document.querySelector("#modalMainImage");
  const thumbnails = document.querySelectorAll(".modal-thumbnail");

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      mainImage.src = thumbnail.dataset.image;
      mainImage.alt = thumbnail.querySelector("img").alt;
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
  const quantityInput = document.querySelector("#productQuantity");
  const designSelect = document.querySelector("#productDesign");
  const unitPriceText = document.querySelector("#unitPriceText");
  const subtotalText = document.querySelector("#subtotalText");
  const message = document.querySelector("#productOptionMessage");

  function getSelectedSize() {
    return form.querySelector('input[name="productSize"]:checked').value;
  }

  function updatePricePreview() {
    const selectedSize = getSelectedSize();
    const quantity = getValidQuantity(quantityInput.value);
    const unitPrice = getUnitPrice(product, selectedSize);

    if (!unitPrice) {
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

    const selectedSize = getSelectedSize();
    const selectedDesignId = designSelect.value;
    const quantity = getValidQuantity(quantityInput.value);
    const unitPrice = getUnitPrice(product, selectedSize);

    if (!selectedSize) {
      message.textContent = "Elegí un tamaño para continuar.";
      return;
    }

    if (!selectedDesignId) {
      message.textContent = "Elegí un diseño para agregar el producto al carrito.";
      return;
    }

    if (!unitPrice) {
      message.textContent = "Este producto no tiene precio configurado para el tamaño elegido.";
      return;
    }

    const selectedDesign =
      selectedDesignId === CUSTOM_DESIGN_VALUE
        ? null
        : disenos.find((design) => design.id === selectedDesignId);

    cart.push({
      producto: product.nombre,
      categoria: product.categoria,
      tamano: selectedSize,
      medida: SIZES[selectedSize],
      diseno: selectedDesign ? selectedDesign.nombre : "Diseño personalizado",
      categoriaDiseno: selectedDesign ? selectedDesign.categoriaDiseno : "",
      cantidad: quantity,
      precioUnitario: unitPrice,
      subtotal: unitPrice * quantity
    });

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

  if (checkoutMessage) {
    checkoutMessage.textContent = "";
  }
}

function renderCart() {
  updateCartCounters();
  if (!cartItems || !cartTotal) {
    return;
  }

  if (checkoutMessage) {
    checkoutMessage.textContent = "";
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
      cartSummary.style.display = "none";
    }
    hideCheckoutForm();
    return;
  }

  if (cartSummary) {
    cartSummary.style.display = "grid";
  }

  hideCheckoutForm();

  cartItems.innerHTML = cart
    .map(
      (item, index) => `
        <article class="cart-item">
          <div>
            <h3>${item.producto}</h3>
            <p>Tamaño: ${item.tamano} - ${item.medida}</p>
            <p>Diseño: ${item.diseno}${item.categoriaDiseno ? ` (${item.categoriaDiseno})` : ""}</p>
            <p>Cantidad: ${item.cantidad}</p>
            <p>Precio unitario: ${formatPrice(item.precioUnitario)}</p>
            <p>Subtotal: ${formatPrice(item.subtotal)}</p>
          </div>
          <button class="button button-secondary cart-remove-button" type="button" data-index="${index}">
            Eliminar
          </button>
        </article>
      `
    )
    .join("");

  cartTotal.textContent = `Total general sin envío: ${formatPrice(getCartTotal())}`;

  cartItems.querySelectorAll(".cart-remove-button").forEach((button) => {
    button.addEventListener("click", () => {
      cart.splice(Number(button.dataset.index), 1);
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

  return `Hola, quiero realizar un pedido en Lumen Paper.

Mis datos:
Nombre: ${customerData.name}
Apellido: ${customerData.lastName}
Teléfono: ${customerData.phone}

Pedido:
${productsText}

Total general sin envío: ${formatPrice(getCartTotal())}

Aclaración: el envío por correo o punto de entrega se coordina por WhatsApp.

Muchas gracias.`;
}

function setupCheckout() {
  if (!checkoutForm || !clearCartButton || !checkoutStartButton) {
    return;
  }

  checkoutStartButton.addEventListener("click", () => {
    checkoutMessage.textContent = "";

    if (cart.length === 0) {
      checkoutMessage.textContent = "El carrito está vacío. Agregá un producto antes de finalizar.";
      return;
    }

    checkoutForm.classList.remove("checkout-form-hidden");
    customerName.focus();
  });

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    checkoutMessage.textContent = "";

    const customerData = {
      name: customerName.value.trim(),
      lastName: customerLastName.value.trim(),
      phone: customerPhone.value.trim()
    };

    if (cart.length === 0) {
      checkoutMessage.textContent = "El carrito está vacío. Agregá un producto antes de finalizar.";
      return;
    }

    if (!customerData.name || !customerData.lastName || !customerData.phone) {
      checkoutMessage.textContent = "Completá nombre, apellido y teléfono para finalizar.";
      return;
    }

    window.open(createWhatsappLink("", buildOrderMessage(customerData)), "_blank", "noopener");
  });

  clearCartButton.addEventListener("click", () => {
    cart.length = 0;
    renderCart();
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
setupCheckout();
renderDesignFilters();
renderDesigns();
renderCategoryFilters();
renderProducts();
renderCart();
