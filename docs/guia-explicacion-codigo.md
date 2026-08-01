# Guía para explicar el código

Este documento sirve para explicar el proyecto en futuras sesiones con lenguaje simple.

## Idea general

La web es estática. Muestra productos y diseños, permite armar un pedido en un carrito simple y finalmente abre WhatsApp con un mensaje ya preparado.

## `data/disenos.js`

Este archivo guarda la lista de diseños de tapa y contratapa.

Cada diseño tiene:

- `id`: nombre interno para identificarlo.
- `nombre`: texto que ve el cliente.
- `categoriaDiseno`: puede ser `Cristianos`, `Generales`, `Bebes` u otra categoría nueva.
- `imagen`: ruta real de la imagen.

Para agregar un diseño cristiano, guardar la imagen en `assets/img/diseno-tapa-contratapa/cristianos/` y sumar un objeto con `categoriaDiseno: "Cristianos"`.

Para agregar un diseño general, guardar la imagen en `assets/img/diseno-tapa-contratapa/generales/` y sumar un objeto con `categoriaDiseno: "Generales"`.

Para agregar un diseño de bebés o cuadernos pediátricos, guardar la imagen en `assets/img/diseno-tapa-contratapa/bebes/` y sumar un objeto con `categoriaDiseno: "Bebes"`.

## Página de diseños

La home tiene un resumen de diseños con un botón a `disenos.html`.

En `disenos.html` existe la grilla completa. En `js/main.js`, la función `renderDesigns()` crea las cards usando el array `disenos`.

Los filtros `Todos` y las categorías cargadas solo ayudan a mirar la galería. No limitan qué diseño puede usarse para cada producto.

Al tocar una card de diseño, `openDesignLightbox()` abre un modal simple con imagen grande, nombre y categoría. Se puede cerrar con el botón `Cerrar`, con Escape o tocando el fondo.

## Productos y diseños

Los productos no tienen una lista propia de diseños. Cuando se abre un producto, el select toma los diseños permitidos desde `data/disenos.js`.

Como regla general, una agenda, un cuaderno o un devocional pueden usar cualquier diseño.

Los productos `libro-de-recuerdos` y `combo-bebe` están limitados a diseños de la categoría `Bebes`. Esa regla se define en `BABY_DESIGN_ONLY_PRODUCT_IDS` dentro de `js/main.js`.

El producto `cuaderno-pediatrico` funciona como un único producto con dos diseños de interior disponibles. Mantiene el selector de tapa con los diseños disponibles del sitio; el detalle informa las opciones de interior y el mensaje final de WhatsApp agrega una línea para consultarlas cuando ese producto está en el carrito.

## Select de diseño

El select del modal tiene:

- `Seleccionar diseño`
- `Diseño personalizado`, salvo en productos infantiles limitados a diseños de bebé
- diseños agrupados por cada `categoriaDiseno` cargada en `data/disenos.js`

Si no se elige diseño, JavaScript muestra un mensaje y no permite agregar al carrito.

## Tamaño

El tamaño se elige con radio buttons:

- A5 - 14,8 x 21 cm
- B5 - 18,2 x 25,7 cm

La opción inicial es A5.

## Precios

Los precios están en `data/productos.js`, dentro de `preciosPorTamano`.

Ejemplo:

```js
preciosPorTamano: {
  A5: 20000,
  B5: 25000
}
```

La función `getUnitPrice()` busca el precio según el producto y el tamaño elegido.

Los productos personalizados sin precio fijo funcionan distinto. En `data/productos.js` tienen:

```js
precio: "Consultar presupuesto",
precioAcoordinar: true,
consultaWhatsappMensaje: "Hola, quisiera consultar por un Producto personalizado."
```

No tienen `preciosPorTamano`, porque el valor se define por WhatsApp según el pedido. En `js/main.js`, `isPriceToCoordinate()` detecta esa marca para no calcular precio, no mostrar total y no permitir que el producto se agregue al carrito. Si existe `consultaWhatsappMensaje`, se usa ese mensaje específico al tocar `Consultar por WhatsApp`.

## Cantidad, subtotal y total

La cantidad se escribe en un input numérico con mínimo 1. Si el usuario escribe algo inválido, se usa 1.

El subtotal se calcula así:

```txt
precio unitario x cantidad
```

El total general sin envío suma todos los subtotales del carrito.

Los productos con precio a coordinar no participan de estos cálculos.

## Carrito

El carrito es un array llamado `cart` en `js/main.js`. Cada vez que se toca `Agregar al carrito`, se guarda un objeto con:

- producto
- categoría
- tamaño
- medida
- diseño
- categoría del diseño
- cantidad
- precio unitario
- subtotal

El acceso al carrito está en el header como botón de texto `Carrito (0)`. No usa ícono. La función `updateCartCounters()` actualiza el número según la cantidad total agregada.

Cuando se toca el botón, `openCartModal()` abre un panel lateral. La función `renderCart()` muestra los productos, el total y los botones para eliminar dentro de ese panel. Si el carrito está vacío, muestra solo el mensaje de carrito vacío y no muestra el formulario.

Después de agregar correctamente un producto, `openAddCartModal()` muestra el aviso `Producto agregado correctamente`. El botón `Ir al carrito` cierra el aviso, cierra el modal de producto y abre el panel del carrito. El botón `Seguir comprando` cierra el aviso, cierra el modal de producto y vuelve a la sección `#catalogo`.

Si un producto tiene `precioAcoordinar: true`, el botón visible dice `Consultar por WhatsApp`. Ese producto no ejecuta `Agregar al carrito`.

## Eliminar o vaciar

Cada item tiene un botón `Eliminar`. Ese botón borra solo ese producto del array `cart`.

El botón `Vaciar carrito` borra todos los productos.

## Finalizar por WhatsApp

El formulario no aparece desde el inicio. Primero el cliente revisa el carrito y toca `Finalizar compra`. Recién ahí se muestra el formulario para completar:

- nombre
- apellido
- teléfono

Si falta un dato o el carrito está vacío, no se abre WhatsApp.

La función `buildOrderMessage()` arma el mensaje final. Después `createWhatsappLink()` usa `encodeURIComponent` para que el texto llegue bien a WhatsApp.

Después de abrir WhatsApp, el formulario se limpia con `checkoutForm.reset()`. El mensaje enviado no cambia porque se arma antes de limpiar los campos, y el carrito conserva su comportamiento actual.

Para productos con precio a coordinar, `openCoordinatedPriceWhatsapp()` abre WhatsApp con una consulta breve y usa el mismo número configurado en `WHATSAPP_NUMBER`.

## Envíos y entregas

La sección `#envios` explica:

- puntos de entrega sin costo en San Miguel y Los Polvorines
- envío por correo con costo a coordinar

El carrito y el mensaje de WhatsApp aclaran que el total general no incluye envío.

## Menú hamburguesa

El botón `#navToggle` aparece en pantallas chicas. Al tocarlo, JavaScript agrega o quita la clase `.is-open` en `#mainNav`.

También cambia `aria-expanded` entre `true` y `false`. Cuando el usuario toca un link del menú, el menú se cierra automáticamente.

## Dónde cambiar cosas comunes

- Agregar productos: `data/productos.js`.
- Cambiar precios: `preciosPorTamano` en `data/productos.js`.
- Marcar un producto sin precio fijo: agregar `precio: "Consultar presupuesto"` y `precioAcoordinar: true`, sin `preciosPorTamano`. Si hace falta un mensaje propio, agregar `consultaWhatsappMensaje`.
- Agregar imágenes de futuros diseños de interior del cuaderno pediátrico: guardar las imágenes exportadas en `assets/img/cuaderno-pediatrico/`, generar sus versiones en `assets/img/optimized/cuaderno-pediatrico/` y sumar las rutas al array `imagenes` de `cuaderno-pediatrico`. No duplicar el producto ni usar el PDF directamente como imagen.
- Agregar diseños: `data/disenos.js`.
- Cambiar textos de secciones: `index.html`.
- Cambiar estilos: `css/styles.css`.
- Cambiar el mensaje final de WhatsApp: función `buildOrderMessage()` en `js/main.js`.
- Cambiar el número de WhatsApp: constante `WHATSAPP_NUMBER` en `js/main.js`.
