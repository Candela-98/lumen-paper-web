# Próximos pasos

## Estado actual del proyecto

El sitio estático de Lumen Paper tiene:

- Header con logo, navegación, botón de carrito, WhatsApp y menú hamburguesa en mobile.
- Hero principal.
- Recuadro resumido de diseños debajo del catálogo.
- Página `disenos.html` con galería completa de diseños de tapa y contratapa.
- Filtros de diseños por `Todos`, `Cristianos`, `Generales` y `Bebes`.
- Modal para ver cada diseño en grande.
- Catálogo dinámico.
- Modal de detalle de producto con galería.
- Selección de tamaño A5 o B5.
- Select de diseño con los diseños permitidos para cada producto.
- Opción `Diseño personalizado`.
- Selección de cantidad.
- Precio unitario y total por producto.
- Cuaderno pediátrico con dos diseños de interior disponibles dentro del mismo producto.
- Productos con precio a coordinar y consulta directa por WhatsApp.
- Carrito simple en panel lateral abierto desde el header.
- Subtotal por producto y total general sin envío.
- Formulario de nombre, apellido y teléfono visible solo después de tocar `Finalizar compra`.
- Finalización del pedido por WhatsApp.
- Limpieza automática del formulario después de enviar el pedido por WhatsApp.
- Sección `Personalizá tu producto`.
- Sección `Cómo comprar`.
- Sección `Envíos y entregas`.
- Footer con redes y contacto.

## Productos cargados

1. Agenda Club.
2. Agenda Diaria.
3. Agenda Docente.
4. Cuaderno A5.
5. Devocional Mujer.
6. Devocional Niño.
7. Cancionero.
8. Diseños Personalizados como producto especial sin precio fijo.
9. Libro de firmas personalizado como producto de consulta por WhatsApp.

## Decisiones tomadas

- No se agregó backend.
- No se agregó pasarela de pago.
- No se usa `localStorage`; el carrito dura mientras la página está abierta.
- Como regla general, todos los diseños pueden usarse para cualquier producto.
- Libro de Recuerdos y Combo Bebé muestran solo diseños de la categoría `Bebes`.
- Cuaderno pediátrico mantiene un único producto, tapa elegible entre los diseños disponibles y consulta sus dos diseños de interior por WhatsApp al finalizar la compra.
- La categoría de diseño ordena visualmente la galería y permite limitar el select de productos infantiles.
- El total general siempre se muestra sin envío.
- La entrega o envío se coordina por WhatsApp.
- El carrito no se vacía automáticamente después de enviar el pedido; conserva el comportamiento manual con `Vaciar carrito`.
- El color principal sigue siendo `#4cb1b1`.
- Los productos con `precioAcoordinar: true`, como `Diseños Personalizados` y `Libro de firmas personalizado`, no entran al carrito porque su precio depende del pedido y se coordina por WhatsApp.

## Historial de avances

### Sesión 1

- Se creó la estructura inicial del proyecto.
- Se creó el catálogo dinámico.
- Se agregaron filtros por categoría.
- Se agregó redirección a WhatsApp.
- Se documentó la arquitectura inicial.

### Sesión 2

- Se agregó modal de detalle de producto.
- Se agregó galería con imagen grande y miniaturas.
- Se agregaron textos largos, listas, medidas, ideal para y aclaraciones.

### Sesión 3

- Se agregó botón flotante de WhatsApp.
- Se agregó la sección `Personalizá tu producto`.
- Se agregaron mejoras SEO, favicon y Open Graph.

### Sesión 4

- Se agregó la sección `Cómo comprar`.
- Se conectó el botón de pedido a WhatsApp.

### Sesión 5

- Se agregó `data/disenos.js`.
- Se agregó la galería `Diseños de tapa y contratapa`.
- Se agregaron precios por tamaño en productos.
- Se cambió el modal para elegir tamaño, diseño y cantidad.
- Se agregó carrito simple con total sin envío.
- Se agregó formulario de datos antes de finalizar.
- Se armó mensaje final de WhatsApp con pedido completo.
- Se agregó la sección `Envíos y entregas`.
- Se agregó menú hamburguesa responsive.

### Sesión 6

- Se simplificó el menú superior para escritorio.
- Se mantuvo el menú hamburguesa en celular.
- Se movió la galería completa de diseños fuera de la home.
- Se agregó un resumen de diseños debajo del catálogo.
- Se creó `disenos.html` para ver todos los diseños.
- Se agregó un modal simple para agrandar imágenes de diseños.

### Sesión 7

- Se quitó la sección fija de carrito de la home.
- Se agregó el botón `Carrito (0)` en el header, sin ícono.
- Se agregó un panel lateral para revisar el carrito.
- Se dejó el formulario oculto hasta tocar `Finalizar compra`.

### Sesión 8

- Se agregó un aviso centrado de `Producto agregado correctamente`.
- Se agregaron las acciones `Ir al carrito` y `Seguir comprando` después de agregar un producto.
- Se conectó `Ir al carrito` con el panel lateral existente.
- Se mantuvo el formulario de datos oculto hasta tocar `Finalizar compra`.

### Sesión 9

- Se marcó `Diseños Personalizados` como producto con precio a coordinar.
- Se evitó que aparezca un precio sin configurar cuando un producto no tiene precio numérico.
- Se cambió el botón de ese producto a `Consultar por WhatsApp`.
- Se evitó que ese producto calcule total o se agregue al carrito.
- Se mantuvo el flujo normal de carrito para los productos con precio por tamaño.

### Sesión 10

- Se agregó la categoría `Bebes` para diseños de bebés o cuadernos pediátricos.
- Se incorporaron las imágenes de `assets/img/diseno-tapa-contratapa/bebes/`.
- Se agregaron las versiones optimizadas en `assets/img/optimized/diseno-tapa-contratapa/bebes/`.
- Se ajustaron filtros y select de diseños para tomar las categorías desde `data/disenos.js`.
- Se limpió automáticamente el formulario de datos después de abrir WhatsApp con el pedido.
- Se limitó el selector de diseño de Libro de Recuerdos y Combo Bebé para mostrar solo diseños `Bebes`.

### Sesión 11

- Se agregó el producto `Libro de firmas personalizado`.
- Se agregó la categoría de producto `Libros de firmas`.
- Se cargó la galería desde `assets/img/libro-firmas/` y sus versiones optimizadas en `assets/img/optimized/libro-firmas/`.
- Se configuró como producto sin precio fijo con `Consultar presupuesto`.
- Se conectó el botón `Consultar por WhatsApp` con un mensaje específico para consultar por el libro de firmas.
- Se mantuvo fuera del carrito para que no calcule subtotales ni total.

### Sesión 12

- Se actualizó `Cuaderno pediátrico` para informar que cuenta con dos diseños de interior disponibles.
- Se agregó una aclaración en el detalle del producto y en el formulario de compra.
- Se conservó la elección de tapa entre los diseños disponibles del sitio.
- Se mantuvo el precio y el cálculo normal del carrito.
- Se agregó una línea condicional al mensaje de WhatsApp cuando el carrito contiene el cuaderno pediátrico.
- Se documentó dónde agregar imágenes exportadas de futuros diseños de interior sin duplicar el producto.

## Próximas tareas sugeridas

1. Abrir `index.html` en navegador.
2. Abrir `disenos.html` y revisar que carguen todas las imágenes de diseños.
3. Probar filtros de diseños y filtros de productos.
4. Abrir un producto y probar A5/B5.
5. Elegir diseño y cantidad.
6. Agregar productos al carrito y revisar que cambie el contador del header.
7. Revisar que aparezca el aviso `Producto agregado correctamente`.
8. Tocar `Ir al carrito` y revisar que se abra el panel lateral con el producto.
9. Tocar `Seguir comprando` y revisar que vuelva al catálogo.
10. Abrir el carrito desde el header.
11. Eliminar un producto y vaciar carrito.
12. Tocar `Finalizar compra` y verificar que recién ahí aparezca el formulario.
13. Probar finalizar compra sin datos para ver validaciones.
14. Completar datos y revisar el mensaje de WhatsApp.
15. Probar el menú hamburguesa en celular.
16. Revisar que `Diseños Personalizados` muestre `A coordinar` y abra WhatsApp sin entrar al carrito.
17. Revisar que `Libro de firmas personalizado` muestre `Consultar presupuesto`, abra WhatsApp y no se agregue al carrito.
18. Revisar que `Cuaderno pediátrico` muestre dos diseños de interior disponibles, permita elegir tapa y agregue la consulta de interiores al mensaje de WhatsApp.
