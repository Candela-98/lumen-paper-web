# Arquitectura del proyecto

## Tecnologías

El proyecto usa HTML, CSS y JavaScript puro. Se eligió esta base porque es simple, fácil de entender y suficiente para un catálogo estático que deriva compras o consultas a WhatsApp.

## Estructura de carpetas

- `index.html`: contiene la estructura principal de la página, la sección de personalización, el modal, SEO y favicon.
- `css/styles.css`: contiene colores, tipografías, layout, cards, modal, galería, botón flotante, sección de personalización, sección de compra y responsive.
- `data/productos.js`: guarda la información de productos.
- `js/main.js`: crea cards, filtros, enlaces de WhatsApp, modal, galería y mensajes personalizados.
- `assets/img/`: guarda imágenes reales del emprendimiento.
- `docs/`: guarda documentación para continuar el proyecto.

## Productos

Cada producto es un objeto dentro del array `productos`. Una card representa un producto, no una imagen. Si un producto tiene varias fotos, todas se guardan en `imagenes`.

Además de los datos básicos, cada producto tiene `descripcionLarga`, `incluye`, `medidas`, `idealPara` y `aclaracion`. Estos campos se usan dentro del modal de detalle.

## Modal y galería

La card completa abre un modal dentro de la misma página. El modal muestra una imagen grande y miniaturas. Al tocar una miniatura, JavaScript cambia la imagen grande.

El modal tiene `role="dialog"`, `aria-modal="true"` y se puede cerrar con botón, tecla Escape o click fuera de la caja.

## WhatsApp

`js/main.js` usa la constante `WHATSAPP_NUMBER`. La función `createWhatsappLink` arma mensajes y los codifica con `encodeURIComponent`.

Hay distintos mensajes según el uso:

- Producto: compra o consulta por un producto específico.
- Botón flotante: consulta general sobre productos.
- Personalización: consulta por una personalización.
- Cómo comprar: mensaje para iniciar un pedido.

## Botón flotante

El botón flotante está en `index.html`, se posiciona con CSS y recibe su link desde `js/main.js`. Está fijo abajo a la derecha y se ve en toda la página.

## Personalizá tu producto

La sección `Personalizá tu producto` explica opciones de personalización y muestra pequeñas cards con alternativas como nombre en la tapa, temática, color principal, frase especial y tipo de interior.

## Cómo comprar

La sección `Cómo comprar` está ubicada después de `Personalizá tu producto` y antes de `Sobre Lumen Paper`. Muestra cinco cards numeradas para explicar el proceso: elegir producto, personalizarlo, tocar Comprar, confirmar el pedido y preparación con amor.

El botón `Quiero hacer un pedido` usa el mismo número de WhatsApp configurado en `WHATSAPP_NUMBER`.

## SEO, Open Graph y favicon

En `index.html` se agregaron:

- `title`
- `meta description`
- `meta keywords`
- `meta author`
- etiquetas Open Graph
- favicon

El favicon y la imagen Open Graph usan `assets/img/marca/logo-lumen-paper.png`, que existe en el proyecto.

## Click de card y botón Comprar

La card tiene un evento `click` que abre el modal. El botón `Comprar` está dentro de la card, pero usa `event.stopPropagation()` para que ese click no llegue a la card. Así el botón abre WhatsApp sin abrir el modal.

## Buenas prácticas aplicadas

- Archivos separados por responsabilidad.
- HTML semántico.
- Cards renderizadas desde JavaScript.
- Variables CSS.
- Responsive design.
- Textos alternativos en imágenes.
- Modal accesible.
- Galería basada en los datos del producto.
- SEO básico y favicon.
