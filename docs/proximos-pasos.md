# Próximos pasos

## Estado actual del proyecto

El sitio estático de Lumen Paper tiene:

- Header con logo, navegación y WhatsApp.
- Hero principal.
- Catálogo dinámico.
- Una card por producto.
- Agrupación de varias imágenes por producto.
- Filtro por categorías.
- Botón `Comprar` con enlace automático a WhatsApp.
- Modal de detalle al tocar una card.
- Galería simple dentro del modal.
- Botón flotante de WhatsApp.
- Sección `Personalizá tu producto`.
- Sección `Cómo comprar` con pasos numerados.
- SEO básico, Open Graph y favicon.
- Footer con redes y contacto.
- Diseño responsive.

## Productos cargados inicialmente

1. Agenda Club.
2. Agenda Diaria.
3. Agenda Docente.
4. Cuaderno A5.
5. Devocional Mujer.
6. Devocional Niño.
7. Cancionero.

## Decisiones tomadas

- Se usa HTML, CSS y JavaScript puro.
- Los productos se centralizan en `data/productos.js`.
- Las cards se crean desde `js/main.js`.
- El color principal es `#4cb1b1`.
- Las tipografías elegidas son `DM Serif Display`, `Belleza` y `Nunito`.
- La compra se deriva a WhatsApp.
- El botón visible de cada producto dice `Comprar`.
- La card completa abre el modal, pero el botón `Comprar` no lo abre gracias a `event.stopPropagation()`.
- El botón flotante usa un mensaje general de consulta.
- La sección de personalización usa un mensaje específico para WhatsApp.
- La sección `Cómo comprar` usa un mensaje específico para iniciar pedidos por WhatsApp.
- El favicon y Open Graph usan `assets/img/marca/logo-lumen-paper.png`.
- No se agregó carrito, login, backend ni pasarela de pago.
- La carpeta de ruta para diseños únicos es `assets/img/disenos-unicos/`.
- En pantalla la categoría se muestra como `Diseños únicos`.

## Pendientes

- Revisar nombres comerciales definitivos.
- Confirmar descripciones reales.
- Agregar precios si corresponde.
- Revisar que todas las imágenes carguen bien en navegador.
- Confirmar enlaces reales de Facebook e Instagram.
- Revisar el diseño final en celular real.
- Publicar la web.

## Próximas tareas sugeridas

1. Abrir `index.html` y revisar visualmente la web.
2. Probar el botón flotante de WhatsApp.
3. Probar el botón `Consultar personalización`.
4. Probar el botón `Quiero hacer un pedido`.
5. Probar que cada card abra su modal.
6. Probar que cada botón `Comprar` abra WhatsApp sin abrir el modal.
7. Ajustar nombres y descripciones de productos.
8. Agregar precios reales si corresponde.
9. Revisar el diseño en celular.
10. Publicar la web.

## Historial de avances

### Sesión 1

- Se creó la estructura inicial del proyecto.
- Se creó el catálogo dinámico.
- Se agregaron filtros por categoría.
- Se agregó redirección a WhatsApp.
- Se documentó la arquitectura inicial.

### Sesión 2

- Se cambió el botón de las cards a `Comprar`.
- Se agregó modal de detalle de producto.
- Se agregó galería con imagen grande y miniaturas.
- Se agregaron textos largos, listas, medidas, ideal para y aclaraciones en `productos.js`.
- Se agregó `event.stopPropagation()` para que el botón `Comprar` no abra el modal.

### Sesión 3

- Se agregó botón flotante de WhatsApp.
- Se agregó la sección `Personalizá tu producto`.
- Se agregó botón `Consultar personalización`.
- Se agregaron mejoras SEO.
- Se configuró favicon con el logo real.
- Se agregaron etiquetas Open Graph.
- Se actualizó la documentación.

### Sesión 4

- Se agregó la sección `Cómo comprar`.
- Se agregaron cinco pasos de compra en cards numeradas.
- Se agregó el botón `Quiero hacer un pedido`.
- Se conectó el botón de pedido a WhatsApp con un mensaje específico.
- Se agregó el link `Cómo comprar` en el menú.
- Se actualizó la documentación.

## Notas importantes

- No tocar la carpeta `.git`.
- Mantener el color principal `#4cb1b1`.
- No crear una card por cada imagen.
- Usar `imagenes` para guardar fotos extra de cada producto.
- Usar la ruta `disenos-unicos` sin ñ, pero mostrar `Diseños únicos` en pantalla.
- No agregar carrito de compras todavía.
- No agregar pasarela de pago todavía.
- Mantener explicaciones simples para futuras sesiones.
