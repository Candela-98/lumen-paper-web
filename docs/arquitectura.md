# Arquitectura del proyecto

## Base técnica

El proyecto usa HTML, CSS y JavaScript puro. Sigue siendo una web estática: no guarda pedidos en servidor, no procesa pagos y no usa backend.

## Archivos principales

- `index.html`: contiene la estructura de la home, el catálogo, el resumen de diseños, el botón de carrito con panel lateral, el formulario de datos dentro del panel, el modal de producto, el aviso de producto agregado y los scripts.
- `disenos.html`: contiene la página completa de diseños de tapa y contratapa, con filtros y modal para ver cada imagen en grande.
- `css/styles.css`: contiene layout, colores, cards, modal, carrito, galería de diseños, sección de envíos y responsive.
- `data/productos.js`: guarda los productos y sus precios por tamaño.
- `data/disenos.js`: guarda los diseños de tapa y contratapa.
- `js/main.js`: renderiza productos y diseños según la página abierta, maneja modales, calcula precios, administra el carrito, arma el mensaje de WhatsApp y controla el menú mobile.
- `assets/img/`: guarda imágenes reales.
- `docs/`: guarda documentación del proyecto.

## Diseños

Los diseños están separados en carpetas solo para ordenar:

- `assets/img/diseno-tapa-contratapa/cristianos/`
- `assets/img/diseno-tapa-contratapa/generales/`

Esa separación no limita el uso. Cualquier diseño puede elegirse para agenda, cuaderno, devocional u otro producto.

La home muestra solo un resumen de diseños debajo del catálogo. La grilla completa vive en `disenos.html`, toma los datos desde `data/disenos.js` y permite filtrar por `Todos`, `Cristianos` y `Generales`. Al tocar una card se abre un lightbox simple con la imagen grande, nombre y categoría.

`data/disenos.js` expone un array llamado `disenos`. Cada objeto tiene:

- `id`
- `nombre`
- `categoriaDiseno`
- `imagen`

## Productos y precios

Cada producto vive dentro del array `productos` en `data/productos.js`. Además de los datos del catálogo, cada producto tiene:

```js
preciosPorTamano: {
  A5: 20000,
  B5: 25000
}
```

JavaScript usa esa propiedad para calcular precio unitario y subtotal.

El producto `disenos-unicos` es un caso especial: representa `Diseños Personalizados`, usa `precio: "A coordinar"` y `precioAcoordinar: true`, y no tiene `preciosPorTamano`. JavaScript detecta esa marca para no calcular precio, no mostrar total y no agregarlo al carrito.

## Modal de producto

Al tocar una card se abre el modal. El orden del contenido es:

1. Fotos del producto.
2. Nombre.
3. Tamaño A5 o B5.
4. Diseño.
5. Cantidad.
6. Precio unitario y total.
7. Botón `Agregar al carrito`.
8. Descripción, incluye, medidas, ideal para y aclaración.

El select de diseño muestra `Diseño personalizado` y todos los diseños cargados, agrupados por `Cristianos` y `Generales`.

Cuando el producto se agrega correctamente, aparece un aviso centrado con `Producto agregado correctamente`. Desde ese aviso se puede abrir el carrito o volver al catálogo para seguir comprando.

Para `Diseños Personalizados`, el modal mantiene fotos, nombre, descripción e información, pero reemplaza las opciones de compra por una aclaración de precio a coordinar y un botón `Consultar por WhatsApp`.

## Carrito

El carrito está en memoria mientras la página está abierta. No usa `localStorage`.

En la home no hay una sección fija de carrito. El acceso aparece como botón de texto en el header, al lado de WhatsApp, con el formato `Carrito (0)`. Al tocarlo se abre un panel lateral con el resumen del pedido. Si no hay productos, el panel muestra solo el mensaje de carrito vacío.

Cada item guarda producto, categoría, tamaño, medida, diseño, categoría del diseño, cantidad, precio unitario y subtotal. El total general suma todos los subtotales y siempre se muestra como total sin envío.

El formulario de nombre, apellido y teléfono aparece recién cuando el cliente toca `Finalizar compra` dentro del panel.

## WhatsApp

La constante `WHATSAPP_NUMBER` define el número usado por todos los links. La función `buildOrderMessage()` arma el mensaje final con datos del cliente, productos, subtotales, total general sin envío y aclaración de entrega o correo.

Los productos con `precioAcoordinar: true` usan el mismo número de WhatsApp y abren una consulta directa con un mensaje preparado mediante `encodeURIComponent`.

## Envíos y entregas

La sección `Envíos y entregas` está después de `Cómo comprar`. Explica puntos de entrega sin costo en San Miguel y Los Polvorines, y envío por correo con costo a coordinar.

## Menú mobile

En escritorio el menú se ve horizontal. En pantallas pequeñas aparece un botón hamburguesa con `aria-expanded`. Al tocarlo se abre o cierra el menú, y al elegir un link se cierra automáticamente.
