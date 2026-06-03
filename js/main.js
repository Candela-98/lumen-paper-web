const WHATSAPP_NUMBER = "5491127495859"; // Cambiar este número si Lumen Paper usa otro WhatsApp.
const ALL_CATEGORIES_LABEL = "Todos";

const productsGrid = document.querySelector("#productsGrid");
const categoryFilters = document.querySelector("#categoryFilters");
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

function createWhatsappLink(productName, customMessage) {
  const message = customMessage
    ? customMessage
    : productName
    ? `Hola, quiero comprar o consultar por el producto ${productName} de Lumen Paper.`
    : "Hola, quiero consultar por los productos de Lumen Paper.";

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function createList(items) {
  if (!items || items.length === 0) {
    return "<p>No hay información cargada por el momento.</p>";
  }

  return `
    <ul>
      ${items.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;
}

function createProductCard(product) {
  const article = document.createElement("article");
  article.className = "product-card";
  article.tabIndex = 0;
  article.dataset.productId = product.id;
  article.setAttribute("aria-label", `Ver detalle de ${product.nombre}`);

  article.innerHTML = `
    <img class="product-image" src="${product.imagenPrincipal}" alt="${product.nombre}" loading="lazy">
    <div class="product-content">
      <p class="product-category">${product.categoria}</p>
      <h3>${product.nombre}</h3>
      <p class="product-description">${product.descripcion}</p>
      <p class="product-price">${product.precio}</p>
      <a class="button product-buy-button" href="${createWhatsappLink(product.nombre)}" target="_blank" rel="noopener">
        Comprar
      </a>
    </div>
  `;

  article.addEventListener("click", () => openProductModal(product));
  article.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProductModal(product);
    }
  });

  const buyButton = article.querySelector(".product-buy-button");
  buyButton.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  return article;
}

function renderProducts(category = ALL_CATEGORIES_LABEL) {
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
  const categories = productos.map((product) => product.categoria);
  return [ALL_CATEGORIES_LABEL, ...new Set(categories)];
}

function renderCategoryFilters() {
  getCategories().forEach((category) => {
    const button = document.createElement("button");
    button.className = "filter-button";
    button.type = "button";
    button.textContent = category;

    if (category === ALL_CATEGORIES_LABEL) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-button").forEach((filterButton) => {
        filterButton.classList.remove("active");
      });

      button.classList.add("active");
      renderProducts(category);
    });

    categoryFilters.appendChild(button);
  });
}

function createProductGallery(product) {
  const thumbnails = product.imagenes
    .map(
      (image, index) => `
        <button class="modal-thumbnail ${index === 0 ? "active" : ""}" type="button" data-image="${image}">
          <img src="${image}" alt="${product.nombre} imagen ${index + 1}">
        </button>
      `
    )
    .join("");

  return `
    <div class="modal-gallery">
      <img class="modal-main-image" id="modalMainImage" src="${product.imagenPrincipal}" alt="${product.nombre}">
      <div class="modal-thumbnails" aria-label="Imágenes de ${product.nombre}">
        ${thumbnails}
      </div>
    </div>
  `;
}

function openProductModal(product) {
  modalBody.innerHTML = `
    <div class="modal-layout">
      ${createProductGallery(product)}
      <div class="modal-detail">
        <p class="product-category">${product.categoria}</p>
        <h2 id="modalTitle">${product.nombre}</h2>
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

        <a class="button modal-buy-button" href="${createWhatsappLink(product.nombre)}" target="_blank" rel="noopener">
          Comprar
        </a>
      </div>
    </div>
  `;

  productModal.classList.add("is-open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalClose.focus();
  setupGalleryEvents();
}

function setupGalleryEvents() {
  const mainImage = document.querySelector("#modalMainImage");
  const thumbnails = document.querySelectorAll(".modal-thumbnail");

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      mainImage.src = thumbnail.dataset.image;
      thumbnails.forEach((item) => item.classList.remove("active"));
      thumbnail.classList.add("active");
    });
  });
}

function closeProductModal() {
  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalBody.innerHTML = "";
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

  headerWhatsapp.href = generalLink;
  heroWhatsapp.href = generalLink;
  footerWhatsapp.href = generalLink;
  customWhatsapp.href = customLink;
  orderWhatsapp.href = orderLink;
  floatingWhatsapp.href = floatingLink;
}

modalClose.addEventListener("click", closeProductModal);
modalOverlay.addEventListener("click", closeProductModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && productModal.classList.contains("is-open")) {
    closeProductModal();
  }
});

setGeneralWhatsappLinks();
renderCategoryFilters();
renderProducts();
