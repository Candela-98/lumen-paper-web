# Próximos pasos

## Estado actual del proyecto

El sitio estático de Lumen Paper tiene:

- Header con logo, navegación, botón de carrito, WhatsApp y menú hamburguesa en mobile.
- Hero principal.
- Recuadro resumido de diseños debajo del catálogo.
- Página `disenos.html` con galería completa de diseños de tapa y contratapa.
- Filtros de diseños por `Todos`, `Cristianos` y `Generales`.
- Modal para ver cada diseño en grande.
- Catálogo dinámico.
- Modal de detalle de producto con galería.
- Selección de tamaño A5 o B5.
- Select de diseño con todos los diseños cargados.
- Opción `Diseño personalizado`.
- Selección de cantidad.
- Precio unitario y total por producto.
- Producto `Diseños Personalizados` con precio a coordinar y consulta directa por WhatsApp.
- Carrito simple en panel lateral abierto desde el header.
- Subtotal por producto y total general sin envío.
- Formulario de nombre, apellido y teléfono visible solo después de tocar `Finalizar compra`.
- Finalización del pedido por WhatsApp.
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

## Decisiones tomadas

- No se agregó backend.
- No se agregó pasarela de pago.
- No se usa `localStorage`; el carrito dura mientras la página está abierta.
- Todos los diseños pueden usarse para cualquier producto.
- La categoría de diseño solo ordena visualmente la galería y el select.
- El total general siempre se muestra sin envío.
- La entrega o envío se coordina por WhatsApp.
- El color principal sigue siendo `#4cb1b1`.
- `Diseños Personalizados` no entra al carrito porque su precio depende del pedido y se coordina por WhatsApp.

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
