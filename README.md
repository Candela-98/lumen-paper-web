# Lumen Paper

Sitio web estático para mostrar el catálogo online de Lumen Paper, un emprendimiento de papelería artesanal.

## Objetivo

La web permite ver productos, entrar a una página propia de diseños de tapa y contratapa, elegir tamaño, elegir diseño, armar un carrito persistente y crear un pedido con datos del cliente y método de entrega. El catálogo y los pedidos utilizan la API local o productiva según el dominio. WhatsApp se conserva para consultas y coordinación. Checkout Pro está implementado, pero Mercado Pago permanece deshabilitado en producción.

## Tecnologías utilizadas

- HTML para la estructura.
- CSS para el diseño visual y responsive.
- JavaScript puro para productos, diseños, modal, carrito, precios y WhatsApp.

## Cómo abrir el proyecto

Servir el proyecto por HTTP local (ver la sección de conexión al catálogo). Abrir el archivo directamente permite ver el contenido, pero no habilita compras con precio. No hace falta instalar dependencias ni usar frameworks.

## Funcionalidades principales

- Home orientada primero al catálogo de productos.
- Recuadro resumido de diseños debajo del catálogo.
- Página `disenos.html` con todos los diseños de tapa y contratapa.
- Filtros visuales de diseños: `Todos`, `Cristianos`, `Generales` y `Bebes`.
- Modal para agrandar una imagen de diseño.
- Catálogo dinámico con una card por producto.
- Modal de producto con fotos, tamaño, diseño, cantidad, precio unitario y total.
- Productos personalizados sin precio fijo, como `Diseños Personalizados` y `Libro de firmas personalizado`, con consulta directa por WhatsApp.
- Producto `Cuaderno pediátrico` con dos diseños de interior disponibles dentro del mismo producto y tapa a elección entre los diseños disponibles.
- Botón de carrito en el header con contador y panel lateral.
- Carrito simple con subtotal por producto y total general sin envío.
- Formulario de nombre, apellido, DNI, teléfono, email y entrega visible después de tocar `Finalizar compra`.
- Creación de pedido real en el backend y resumen con importes calculados por el servidor.
- Coordinación por WhatsApp con la referencia del pedido, sin enviar datos personales en el enlace.
- Limpieza automática del formulario tras crear el pedido; se conserva ante errores.
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

Los precios comprables provienen de la API. Modificar `preciosPorTamano` o `precio` en los datos locales no cambia los importes cobrables. `backendSlug` y `skuPorTamano` vinculan los productos visuales con sus variantes remotas. La gestión de precios del backend queda fuera de este repositorio.

Para un producto sin precio fijo, usar:

```js
precio: "Consultar presupuesto",
precioAcoordinar: true,
consultaWhatsappMensaje: "Hola, quisiera consultar por un Producto personalizado."
```

Ese producto no debe tener `preciosPorTamano`; se consulta por WhatsApp y no se agrega al carrito. Si el producto tiene imágenes apaisadas que deben verse completas en el modal, agregar `imagenAjuste: "contain"`.

## Productos personalizados sin precio fijo

Los productos cuyo valor depende de la personalización se gestionan como consulta directa por WhatsApp. En `data/productos.js` deben tener `precioAcoordinar: true`, un texto visible en `precio` y, si corresponde, un `consultaWhatsappMensaje` específico. JavaScript reutiliza el mismo número configurado en `WHATSAPP_NUMBER`, no muestra precio numérico, no calcula subtotal y no permite agregarlos al carrito.

El producto `Libro de firmas personalizado` usa la categoría `Libros de firmas`, muestra `Consultar presupuesto`, carga sus imágenes desde `assets/img/libro-firmas/` y usa versiones optimizadas en `assets/img/optimized/libro-firmas/`.

## Cuaderno pediátrico con dos diseños de interior

El `Cuaderno pediátrico` sigue siendo un único producto con el mismo precio y el mismo flujo de carrito. La tapa se elige entre los diseños disponibles del sitio, igual que en el resto del flujo de productos personalizables.

La página de detalle informa que hay dos diseños de interior disponibles. Cuando el carrito contiene `cuaderno-pediatrico`, el formulario muestra un aviso para consultar esas dos opciones de interior por WhatsApp. Ambas opciones pertenecen al mismo producto y no deben cargarse como productos separados.

Para sumar imágenes de futuros diseños de interior del cuaderno pediátrico sin duplicar el producto, guardar las imágenes exportadas en:

```txt
assets/img/cuaderno-pediatrico/
assets/img/optimized/cuaderno-pediatrico/
```

Nombres recomendados para el segundo diseño de animalitos:

```txt
cuaderno-p-animalitos-1.png
cuaderno-p-animalitos-1a.png
cuaderno-p-animalitos-1b.png
```

Luego agregar esas rutas al array `imagenes` del producto `cuaderno-pediatrico` en `data/productos.js`. No usar el PDF directamente como imagen de catálogo; primero exportar cada página o vista necesaria como imagen.

Archivos relacionados con este comportamiento: `data/productos.js`, `js/main.js`, `index.html`, `css/styles.css` y esta documentación.

## Cómo cambiar el número o mensaje de WhatsApp

Abrir `js/main.js` y cambiar:

```js
const WHATSAPP_NUMBER = "5491127495859";
```

Los enlaces de coordinación usan la referencia del pedido, sin incluir datos del comprador. Las páginas de retorno también tienen el número de contacto en `js/order-return.js`.

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


## API y entorno

| Frontend | API | Mercado Pago |
|---|---|---|
| HTTP(S) en localhost o 127.0.0.1 | http://localhost:8080 | Flujo local conservado |
| www.lumenpaper.com.ar o lumenpaper.com.ar | https://api.lumenpaper.com.ar | Deshabilitado |
| Otros hosts y file:// | Sin API | Deshabilitado |

La bandera mercadoPagoEnabled en js/config.js controla el botón, el handler y la API de checkout. No es una medida de autorización del backend: el servidor debe controlar el acceso a sus endpoints.

## Catálogo y carrito

js/catalog.js combina el contenido visual de data/productos.js con slugs, SKU, IDs y precios de la API. Se rechazan IDs/SKU duplicados, importes inválidos y catálogos mal formados. Las variantes ausentes o con precio cero no habilitan compras. No se inventan reglas de stock: la respuesta actual no contiene stock ni un indicador de disponibilidad; el backend debe excluir variantes no comprables y validar el pedido.

Un error de catálogo bloquea compras, retira los precios antiguos y conserva las referencias del carrito. Reintentar solo vuelve a ejecutar un GET. Los productos a coordinar mantienen su consulta por WhatsApp.

localStorage guarda lumen-paper.cart.v1 con productoId, tamano, sku, variant_id, cantidad y disenoId. Nunca conserva importes ni datos personales. Al recuperar se recalculan precios e IDs mediante el catálogo actual. Las pestañas del mismo origen sincronizan cambios. El almacenamiento dañado o bloqueado muestra un aviso; la compra puede continuar en memoria, pero la persistencia no está garantizada.

## Pedidos y respuestas inciertas

El formulario solicita nombre, apellido, DNI, teléfono, email y entrega. PICKUP omite datos postales; CORREO_ARGENTINO requiere dirección, código postal, ciudad y provincia. El envío se cotiza y paga por separado; no se modificó esta política.

Se envían 1–50 líneas con variant_id, quantity (1–1000) y personalization, sin importes. POST /api/v1/public/orders espera 201. El formulario bloquea solicitudes simultáneas y no reintenta POST. La referencia UUID y la asociación con el carrito se conservan en sessionStorage sin datos del comprador.

Antes de enviar se marca la solicitud en sessionStorage. Un timeout, error de red, HTTP 408/5xx o respuesta de éxito ilegible conserva ese marcador y bloquea otro envío, incluso después de recargar la misma pestaña. Comenzar una compra nueva exige confirmar que ya se verificó la situación con Lumen Paper. Una respuesta de rechazo inequívoco permite corregir y reenviar manualmente. Si el almacenamiento está bloqueado, la protección persiste solo durante la carga actual.

Estas protecciones no reemplazan la idempotencia del servidor ni evitan duplicados entre dispositivos/pestañas independientes. Si no llegó el UUID, el frontend no puede recuperar el pedido automáticamente; hay que conciliarlo por un canal de soporte.

GET /api/v1/public/orders/{publicId} debe responder el mismo UUID solicitado. Se admiten PENDING_PAYMENT, PAID, CANCELLED y PAYMENT_REVIEW con importes numéricos y resumen válido. PAYMENT_REVIEW muestra pago en revisión, conserva el carrito y no permite abrir checkout ni comenzar otra compra desde ese pedido.

## Mercado Pago

Solo un pedido pendiente y una bandera habilitada permiten iniciar checkout. POST /api/v1/public/orders/{publicId}/checkout espera 200 con preference_id y checkout_url. El destino debe ser HTTPS, sin credenciales ni puerto alternativo, en www.mercadopago.com.ar o sandbox.mercadopago.com.ar y bajo /checkout/. No se acepta cualquier subdominio ni un dominio parecido. No se carga SDK ni se guardan tokens o URLs de checkout.

Una solicitud en curso, exitosa o incierta queda bloqueada para ese UUID en memoria y sessionStorage. Recuperar enlace de pago usa exclusivamente GET /api/v1/public/orders/{publicId}/checkout, sin fallback a POST. Creación y recuperación comparten un bloqueo de solicitudes concurrentes. Antes de navegar se vuelve a consultar el resumen y se exige PENDING_PAYMENT del mismo UUID.

CHECKOUT_UNCERTAIN, CHECKOUT_REVIEW_REQUIRED, CHECKOUT_EXPIRED, ORDER_NOT_PENDING_PAYMENT y conflictos desconocidos conservan el bloqueo. Sólo GET 409 CHECKOUT_NOT_STARTED permite ofrecer el primer POST manual; no lo ejecuta automáticamente. Un rechazo POST 400 previo a creación permite corregir. Producción bloquea también la recuperación; no abre ni crea preferencias mientras Mercado Pago esté deshabilitado.

Los dominios admitidos deben verificarse con el entorno de prueba autorizado antes de habilitar pagos. No habilitar producción ni cambiar credenciales para probar este repositorio.

## Retorno y limpieza del carrito

pago-exitoso.html, pago-pendiente.html y pago-fallido.html comparten js/order-return.js. Solo el estado del backend confirma pagos; status, collection_status y payment_id de la URL no tienen autoridad. Se usa un external_reference UUID único o el UUID guardado en la pestaña como respaldo. Sin una referencia válida no hay solicitud.

Se realizan hasta seis GET automáticos, separados por cinco segundos tras respuestas pendientes. Al fallar, confirmar, cancelar o pasar a PAYMENT_REVIEW se detienen; Actualizar estado permite un GET manual. Al abandonar la página se detienen las consultas. Nunca se inicia checkout desde un retorno. El enlace a la home conserva external_reference, incluso sin almacenamiento disponible.

Solo PAID y un carrito que coincide con la asociación guardada para ese UUID permiten vaciarlo. Si cambió el carrito, no hay asociación o falla el almacenamiento, se conserva. La home también aplica esta regla al recuperar un pedido pagado. Las páginas de retorno usan noindex y no-referrer.

## Pruebas y publicación

Ejecutar todas las pruebas con Node, sin dependencias externas:

```powershell
node --test tests/order-return.test.cjs tests/production-config.test.cjs tests/frontend-readiness.test.cjs tests/backend-contract.test.cjs
```

Las pruebas usan API, navegación y almacenamiento simulados: no crean pedidos, preferencias ni pagos. Para desarrollo manual servir la raíz del repositorio en http://localhost:3000 con el backend en localhost:8080; CORS debe permitir ese origen exacto. Las rutas y recursos se resuelven desde la raíz del sitio.

La preparación de Amplify, el dominio canónico, las URLs de retorno, los bloqueos externos y el orden de verificación están documentados en [docs/produccion.md](docs/produccion.md). [docs/amplify-redirects.json](docs/amplify-redirects.json) es una propuesta para revisar y aplicar en la consola; guardarla en Git no configura redirecciones automáticamente.
