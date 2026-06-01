const WHATSAPP_NUMBER = "5491127495859"; // Cambiar este numero si Lumen Paper usa otro WhatsApp.
const ALL_CATEGORIES_LABEL = "Todos";

const productsGrid = document.querySelector("#productsGrid");
const categoryFilters = document.querySelector("#categoryFilters");
const headerWhatsapp = document.querySelector("#headerWhatsapp");
const heroWhatsapp = document.querySelector("#heroWhatsapp");
const footerWhatsapp = document.querySelector("#footerWhatsapp");

function createWhatsappLink(productName) {
  const message = productName
    ? `Hola, quiero consultar por el producto ${productName} de Lumen Paper.`
    : "Hola, quiero consultar por los productos de Lumen Paper.";

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function createProductCard(product) {
  const article = document.createElement("article");
  article.className = "product-card";

  article.innerHTML = `
    <img class="product-image" src="${product.imagenPrincipal}" alt="${product.nombre}" loading="lazy">
    <div class="product-content">
      <p class="product-category">${product.categoria}</p>
      <h3>${product.nombre}</h3>
      <p class="product-description">${product.descripcion}</p>
      <p class="product-price">${product.precio}</p>
      <a class="button" href="${createWhatsappLink(product.nombre)}" target="_blank" rel="noopener">
        Consultar por WhatsApp
      </a>
    </div>
  `;

  // Las imagenes extra quedan guardadas en productos.js para una futura galeria.
  article.dataset.productId = product.id;

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

function setGeneralWhatsappLinks() {
  const generalLink = createWhatsappLink();
  headerWhatsapp.href = generalLink;
  heroWhatsapp.href = generalLink;
  footerWhatsapp.href = generalLink;
}

setGeneralWhatsappLinks();
renderCategoryFilters();
renderProducts();
