# Arquitectura del proyecto

## Tecnologias

El proyecto usa HTML, CSS y JavaScript puro. Se eligio esta base porque es simple, facil de entender y suficiente para un catalogo estatico que deriva consultas a WhatsApp.

## Estructura de carpetas

- `index.html`: contiene la estructura principal de la pagina.
- `css/styles.css`: contiene colores, tipografias, layout, cards y responsive.
- `data/productos.js`: guarda la informacion de productos.
- `js/main.js`: crea cards, filtros y enlaces de WhatsApp.
- `assets/img/`: guarda imagenes reales del emprendimiento.
- `docs/`: guarda documentacion para continuar el proyecto.

## Productos

Cada producto es un objeto dentro del array `productos`. Una card representa un producto, no una imagen. Si un producto tiene varias fotos, todas se guardan en `imagenes`.

Ejemplo:

```js
{
  id: "agenda-club",
  nombre: "Agenda Club",
  categoria: "Agendas",
  imagenPrincipal: "assets/img/agendas/agenda-club-1.png",
  imagenes: [
    "assets/img/agendas/agenda-club-1.png",
    "assets/img/agendas/agenda-club-1a.png"
  ]
}
```

## Imagenes detectadas y agrupadas

- Agenda Club: `agenda-club-1.png` a `agenda-club-1e.png`.
- Agenda Diaria: `agenda-diaria-1.png` a `agenda-diaria-1h.png`.
- Agenda Docente: `agenda-docente-1.png` a `agenda-docente-1j.png`.
- Cuaderno A5: `cuaderno-A5-1.png` a `cuaderno-A5-1e.png`.
- Devocional Mujer: `devocional-mujer-1.png` a `devocional-mujer-1f.png`.
- Devocional Nino: `devocional-nino-1.png` y `devocional-nino-1a.jpeg` a `devocional-nino-1e.jpeg`.
- Cancionero: `cancionero-1.png`, `cancionero-1a.png`, `cancionero-2.png`, `cancionero-3.png`.

La ruta de carpeta es `disenos-unicos` sin ñ para evitar problemas de archivos, pero la categoría visible en la web dice `Diseños únicos`.

## Colores y tipografias

Los colores estan en variables CSS dentro de `:root` en `css/styles.css`. El color principal es `#4cb1b1`. Las tipografias principales son `DM Serif Display`, `Belleza` y `Nunito`.

## WhatsApp

`js/main.js` usa la constante `WHATSAPP_NUMBER`. La funcion `createWhatsappLink` arma un mensaje y lo codifica con `encodeURIComponent` para que WhatsApp lo reciba bien.

## Filtros

Los filtros se crean desde las categorias de los productos. Al hacer click en una categoria, JavaScript muestra solo los productos que coinciden.

## Buenas practicas aplicadas

- Archivos separados por responsabilidad.
- HTML semantico.
- Cards renderizadas desde JavaScript.
- Variables CSS.
- Responsive design.
- Textos alternativos en imagenes.
- Preparacion para galeria futura con `imagenes`.

## Mejoras futuras

- Galeria o pagina de detalle por producto.
- Productos destacados.
- Precios reales.
- Publicacion online.
