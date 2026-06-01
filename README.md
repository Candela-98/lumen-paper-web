# Lumen Paper

Sitio web estatico para mostrar el catalogo online de Lumen Paper, un emprendimiento de papeleria artesanal.

## Objetivo

La web muestra productos como agendas, cuadernos, devocionales y disenos unicos. La compra no se finaliza dentro del sitio: cada producto tiene un boton que abre WhatsApp con un mensaje preparado.

## Tecnologias utilizadas

- HTML para la estructura.
- CSS para el diseno visual y responsive.
- JavaScript puro para cargar productos, filtros y enlaces de WhatsApp.

## Como abrir el proyecto

Abrir el archivo `index.html` en el navegador. No hace falta instalar dependencias ni usar frameworks.

## Estructura general

```txt
lumen-paper-web/
├─ index.html
├─ README.md
├─ css/styles.css
├─ js/main.js
├─ data/productos.js
├─ docs/
└─ assets/img/
```

## Como agregar productos

Abrir `data/productos.js` y copiar un objeto de producto existente. Cambiar:

- `id`
- `nombre`
- `categoria`
- `descripcion`
- `precio`
- `imagenPrincipal`
- `imagenes`
- `destacado`

Cada producto debe tener una sola card. Si tiene varias fotos, se agregan todas en `imagenes`.

Para la categoría de diseños únicos, la ruta usa `disenos-unicos`, pero el texto visible puede decir `Diseños únicos`.

## Como cambiar el numero de WhatsApp

Abrir `js/main.js` y cambiar esta constante:

```js
const WHATSAPP_NUMBER = "5491127495859";
```

## Como cambiar imagenes

Guardar la imagen nueva dentro de la carpeta correcta en `assets/img/` y actualizar la ruta en `data/productos.js`.

## Como funciona una card

JavaScript lee cada objeto de `productos.js`, toma su imagen principal, nombre, categoria, descripcion, precio y crea la card automaticamente dentro del catalogo.

## Proximas mejoras posibles

- Agregar galeria por producto usando la propiedad `imagenes`.
- Mejorar textos y precios reales.
- Crear una seccion de productos destacados.
- Publicar la web online.
