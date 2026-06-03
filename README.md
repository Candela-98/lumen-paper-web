# Lumen Paper

Sitio web estático para mostrar el catálogo online de Lumen Paper, un emprendimiento de papelería artesanal.

## Objetivo

La web muestra productos como agendas, cuadernos, devocionales y diseños únicos. La compra no se finaliza dentro del sitio: cada producto tiene un botón `Comprar` que abre WhatsApp con un mensaje preparado automáticamente.

## Tecnologías utilizadas

- HTML para la estructura.
- CSS para el diseño visual y responsive.
- JavaScript puro para cargar productos, filtros, modal de detalle, galería y enlaces de WhatsApp.

## Cómo abrir el proyecto

Abrir el archivo `index.html` en el navegador. No hace falta instalar dependencias ni usar frameworks.

## Funcionalidades principales

- Catálogo dinámico con una card por producto.
- Modal de detalle con galería de imágenes.
- Filtros por categoría.
- Botones de compra por WhatsApp.
- Botón flotante de WhatsApp visible en toda la página.
- Sección `Personalizá tu producto`.
- Sección `Cómo comprar` con pasos numerados.
- SEO básico, Open Graph y favicon con el logo real.

## Estructura general

```txt
lumen-paper-web/
├─ index.html
├─ README.md
├─ css/styles.css
├─ js/main.js
├─ data/productos.js
├─ docs/
└─ assets/img/
```

## Cómo agregar productos

Abrir `data/productos.js` y copiar un objeto de producto existente. Cambiar:

- `id`
- `nombre`
- `categoria`
- `descripcion`
- `precio`
- `imagenPrincipal`
- `imagenes`
- `destacado`
- `descripcionLarga`
- `incluye`
- `medidas`
- `idealPara`
- `aclaracion`

Cada producto debe tener una sola card. Si tiene varias fotos, se agregan todas en `imagenes`.

## Cómo cambiar el número de WhatsApp

Abrir `js/main.js` y cambiar esta constante:

```js
const WHATSAPP_NUMBER = "5491127495859";
```

Los mensajes del botón flotante y de personalización también se configuran en `js/main.js`, dentro de `setGeneralWhatsappLinks()`.

El mensaje del botón `Quiero hacer un pedido` también está en `setGeneralWhatsappLinks()`.

## Cómo comprar

La sección `Cómo comprar` está en `index.html`, después de `Personalizá tu producto`. Muestra cinco pasos en cards numeradas y tiene un botón que abre WhatsApp para iniciar un pedido.

## Cómo cambiar imágenes

Guardar la imagen nueva dentro de la carpeta correcta en `assets/img/` y actualizar la ruta en `data/productos.js`.

Para sumar más imágenes a la galería de un producto, agregar rutas dentro de `imagenes`.

## SEO y favicon

Las etiquetas SEO están en el `<head>` de `index.html`. El favicon usa el archivo real `assets/img/marca/logo-lumen-paper.png`.

## Próximas mejoras posibles

- Revisar textos definitivos y precios reales.
- Crear una sección de productos destacados.
- Mejorar enlaces reales de redes sociales.
- Publicar la web online.
