# Lumen Paper

Sitio web estático para mostrar el catálogo online de Lumen Paper, un emprendimiento de papelería artesanal.

## Objetivo

La web permite ver productos, entrar a una página propia de diseños de tapa y contratapa, elegir tamaño, elegir diseño, armar un carrito simple y enviar el pedido final por WhatsApp. No hay backend, base de datos ni pasarela de pago.

## Tecnologías utilizadas

- HTML para la estructura.
- CSS para el diseño visual y responsive.
- JavaScript puro para productos, diseños, modal, carrito, precios y WhatsApp.

## Cómo abrir el proyecto

Abrir `index.html` en el navegador. No hace falta instalar dependencias ni usar frameworks.

## Funcionalidades principales

- Home orientada primero al catálogo de productos.
- Recuadro resumido de diseños debajo del catálogo.
- Página `disenos.html` con todos los diseños de tapa y contratapa.
- Filtros visuales de diseños: `Todos`, `Cristianos` y `Generales`.
- Modal para agrandar una imagen de diseño.
- Catálogo dinámico con una card por producto.
- Modal de producto con fotos, tamaño, diseño, cantidad, precio unitario y total.
- Producto `Diseños Personalizados` con precio a coordinar y consulta directa por WhatsApp.
- Botón de carrito en el header con contador y panel lateral.
- Carrito simple con subtotal por producto y total general sin envío.
- Formulario de nombre, apellido y teléfono visible solo después de tocar `Finalizar compra`.
- Mensaje final a WhatsApp con el pedido completo.
- Sección `Envíos y entregas`.
- Menú hamburguesa en celular.
- Botón flotante de WhatsApp.

## Estructura general

```txt
lumen-paper-web/
├─ index.html
├─ disenos.html
├─ README.md
├─ css/styles.css
├─ js/main.js
├─ data/productos.js
├─ data/disenos.js
├─ docs/
└─ assets/img/
```

## Cómo agregar diseños

Para diseños cristianos, guardar la imagen en:

```txt
assets/img/diseno-tapa-contratapa/cristianos/
```

Para diseños generales, guardar la imagen en:

```txt
assets/img/diseno-tapa-contratapa/generales/
```

Después abrir `data/disenos.js` y agregar un objeto nuevo con `id`, `nombre`, `categoriaDiseno` e `imagen`.

## Cómo cambiar precios

Abrir `data/productos.js` y modificar `preciosPorTamano` en el producto correspondiente:

```js
preciosPorTamano: {
  A5: 20000,
  B5: 25000
}
```

El texto visible de la card está en `precio`, por ejemplo `Desde $20.000`.

Para un producto sin precio fijo, usar:

```js
precio: "A coordinar",
precioAcoordinar: true
```

Ese producto no debe tener `preciosPorTamano`; se consulta por WhatsApp y no se agrega al carrito.

## Cómo cambiar el número o mensaje de WhatsApp

Abrir `js/main.js` y cambiar:

```js
const WHATSAPP_NUMBER = "5491127495859";
```

El mensaje final se arma en la función `buildOrderMessage()`.
