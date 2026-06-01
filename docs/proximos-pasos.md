# Proximos pasos

## Estado actual del proyecto

Se creo la primera version del sitio estatico de Lumen Paper con:

- `index.html`
- `css/styles.css`
- `data/productos.js`
- `js/main.js`
- `README.md`
- `docs/arquitectura.md`
- `docs/proximos-pasos.md`
- `docs/guia-explicacion-codigo.md`

Funcionalidades creadas:

- Header con logo, navegacion y WhatsApp.
- Hero principal.
- Catalogo dinamico.
- Una card por producto.
- Agrupacion de varias imagenes por producto.
- Filtro por categorias.
- Enlace automatico a WhatsApp.
- Seccion sobre Lumen Paper.
- Footer con redes y contacto.
- Diseno responsive.

## Productos cargados inicialmente

1. Agenda Club.
2. Agenda Diaria.
3. Agenda Docente.
4. Cuaderno A5.
5. Devocional Mujer.
6. Devocional Nino.
7. Cancionero.

## Decisiones tomadas

- Se usa HTML, CSS y JavaScript puro.
- Los productos se centralizan en `data/productos.js`.
- Las cards se crean desde `js/main.js`.
- El color principal es `#4cb1b1`.
- Las tipografias elegidas son `DM Serif Display`, `Belleza` y `Nunito`.
- La compra se deriva a WhatsApp.
- No se agrego carrito, login, backend ni pasarela de pago.
- La carpeta de ruta para diseños únicos es `assets/img/disenos-unicos/`.
- En pantalla la categoría se muestra como `Diseños únicos`.

## Pendientes

- Revisar nombres comerciales definitivos.
- Confirmar descripciones reales.
- Agregar precios si corresponde.
- Revisar que todas las imagenes carguen bien en navegador.
- Confirmar enlaces reales de Facebook e Instagram.
- Agregar galeria por producto.

## Proximas tareas sugeridas

1. Abrir `index.html` y revisar visualmente la web.
2. Confirmar que las imagenes principales elegidas son correctas.
3. Ajustar nombres y descripciones de productos.
4. Agregar precios reales si corresponde.
5. Revisar el diseno en celular.
6. Agregar galeria de imagenes por producto.
7. Crear seccion de productos destacados.
8. Publicar la web.

## Historial de avances

### Sesion 1

- Se reviso el prompt inicial.
- Se detecto la estructura real de `assets/img`.
- Se agruparon imagenes relacionadas en un solo producto.
- Se creo la estructura inicial del proyecto.
- Se creo el catalogo dinamico.
- Se agregaron filtros por categoria.
- Se agrego redireccion a WhatsApp.
- Se documento la arquitectura inicial.

## Notas importantes

- No tocar la carpeta `.git`.
- Mantener el color principal `#4cb1b1`.
- No crear una card por cada imagen.
- Usar `imagenes` para guardar fotos extra de cada producto.
- Usar la ruta `disenos-unicos` sin ñ, pero mostrar `Diseños únicos` en pantalla.
- No agregar carrito de compras todavia.
- No agregar pasarela de pago todavia.
- Mantener explicaciones simples para futuras sesiones.
