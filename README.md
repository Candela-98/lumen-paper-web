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
- Filtros visuales de diseños: `Todos`, `Cristianos`, `Generales` y `Bebes`.
- Modal para agrandar una imagen de diseño.
- Catálogo dinámico con una card por producto.
- Modal de producto con fotos, tamaño, diseño, cantidad, precio unitario y total.
- Producto `Diseños Personalizados` con precio a coordinar y consulta directa por WhatsApp.
- Botón de carrito en el header con contador y panel lateral.
- Carrito simple con subtotal por producto y total general sin envío.
- Formulario de nombre, apellido y teléfono visible solo después de tocar `Finalizar compra`.
- Mensaje final a WhatsApp con el pedido completo.
- Limpieza automática del formulario después de enviar el pedido por WhatsApp.
- Sección `Envíos y entregas`.
- Menú hamburguesa en celular.
- Botón flotante de WhatsApp.

## Estructura general

```txt
lumen-paper-web/
├─ index.html
├─ disenos.html
├─ customHttp.yml
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

Para diseños de bebés o cuadernos pediátricos, guardar la imagen en:

```txt
assets/img/diseno-tapa-contratapa/bebes/
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

## Seguridad

El archivo `customHttp.yml` define cabeceras HTTP personalizadas para AWS Amplify. Está ubicado en la raíz del proyecto para que Amplify lo detecte durante el deploy y aplique automáticamente esas cabeceras a las respuestas servidas por el sitio estático.

Estas cabeceras se agregaron para reducir riesgos comunes en sitios web publicados, como carga accidental de recursos no autorizados, uso del sitio dentro de iframes, exposición innecesaria de información de navegación o abuso de permisos del navegador. La política actual permite los recursos propios del sitio y agrega excepciones puntuales para Google Fonts:

- `Strict-Transport-Security`: indica al navegador que use HTTPS para el dominio y sus subdominios durante un año.
- `X-Content-Type-Options`: evita que el navegador interprete archivos con un tipo distinto al declarado.
- `X-Frame-Options`: impide que el sitio se cargue dentro de frames o iframes.
- `Referrer-Policy`: limita la información enviada en el encabezado `Referer` al navegar fuera del sitio.
- `Permissions-Policy`: deshabilita permisos del navegador que el sitio no usa, como cámara, micrófono, geolocalización, pagos y USB.
- `Content-Security-Policy`: restringe desde dónde pueden cargarse scripts, estilos, imágenes, fuentes, formularios y otros recursos.

AWS Amplify toma el archivo `customHttp.yml` durante el proceso de publicación y aplica las cabeceras a todas las rutas que coinciden con el patrón `**/*`. No hace falta agregar lógica en HTML, CSS o JavaScript para activarlas.

Si en el futuro se agrega un recurso externo indispensable, primero hay que identificar qué tipo de recurso es y modificar solo la directiva correspondiente de la `Content-Security-Policy`. Por ejemplo, una nueva fuente externa debería agregarse en `font-src` y su hoja de estilos en `style-src`; una API externa debería agregarse en `connect-src`; una imagen remota debería agregarse en `img-src`. Evitar `unsafe-inline` y `unsafe-eval`, salvo que no exista otra alternativa y quede documentado el motivo.
