# Prompt para Codex - Proyecto Web Lumen Paper

Quiero crear una página web para mi emprendimiento llamado **Lumen Paper**.

El objetivo de la web es mostrar los productos del emprendimiento como un catálogo online. La compra NO debe finalizarse dentro de la web. Cuando el cliente seleccione un producto, debe ser redirigido al WhatsApp del emprendimiento con un mensaje armado automáticamente para consultar o finalizar la compra.

Necesito que desarrolles el proyecto con **HTML, CSS y JavaScript puro**, porque tengo conocimientos básicos y quiero poder entenderlo.

No quiero usar frameworks por ahora. La idea es que el proyecto sea simple, ordenado, fácil de mantener y fácil de ampliar.

---

# 1. Contexto actual del proyecto

Ya creé manualmente la carpeta principal del proyecto:

```txt
lumen-paper-web
```

La carpeta ya tiene inicializado Git, por eso existe una carpeta:

```txt
.git
```

No modificar, borrar ni tocar la carpeta `.git`.

También ya creé manualmente las carpetas de imágenes dentro de:

```txt
assets/img/
```

La estructura actual de imágenes es:

```txt
assets/img/agendas/
assets/img/cuadernos/
assets/img/devocionales/
assets/img/disenos-unicos/
assets/img/marca/
```

Dentro de esas carpetas ya agregué imágenes reales de los productos y del logo/marca.

Antes de crear el código, revisar la estructura real del proyecto y detectar los nombres exactos de las imágenes disponibles.

---

# 2. Importante sobre las imágenes de productos

Algunas imágenes pertenecen al mismo producto.

No quiero que se cree una card por cada imagen.

Quiero que se cree **una card por producto**, y que cada producto pueda tener varias imágenes asociadas.

Por ejemplo:

```txt
agenda-club-1
agenda-club-1a
agenda-club-1b
agenda-club-1c
agenda-club-1d
agenda-club-1e
```

Todas esas imágenes pertenecen al mismo producto:

```txt
Agenda Club
```

Otro ejemplo:

```txt
agenda-diaria-1
agenda-diaria-1a
agenda-diaria-1b
agenda-diaria-1c
```

Pertenecen al producto:

```txt
Agenda Diaria
```

Otro ejemplo:

```txt
agenda-docente-1
agenda-docente-1a
agenda-docente-1b
```

Pertenecen al producto:

```txt
Agenda Docente
```

Otro ejemplo:

```txt
cuaderno-A5-1
cuaderno-A5-1a
cuaderno-A5-1b
cuaderno-A5-1c
```

Pertenecen al producto:

```txt
Cuaderno A5
```

También puede haber productos dentro de:

```txt
assets/img/devocionales/
assets/img/disenos-unicos/
```

En esos casos, revisar los nombres de archivo y agrupar las imágenes que parezcan pertenecer al mismo producto.

---

# 3. Cómo debe manejarse cada producto en JavaScript

En el archivo:

```txt
data/productos.js
```

Cada producto debe tener esta estructura:

```js
{
  id: "agenda-club",
  nombre: "Agenda Club",
  categoria: "Agendas",
  descripcion: "Agenda artesanal con diseño personalizado.",
  precio: "Consultar precio",
  imagenPrincipal: "assets/img/agendas/agenda-club-1.jpg",
  imagenes: [
    "assets/img/agendas/agenda-club-1.jpg",
    "assets/img/agendas/agenda-club-1a.jpg",
    "assets/img/agendas/agenda-club-1b.jpg"
  ],
  destacado: true
}
```

La propiedad `imagenPrincipal` se usa para mostrar la imagen principal en la card del catálogo.

La propiedad `imagenes` debe guardar todas las imágenes de ese producto, para que más adelante se pueda armar una galería o una página de detalle del producto.

Si una imagen todavía no se puede identificar bien, crear un nombre provisorio claro y dejar un comentario para que yo pueda modificarlo después.

---

# 4. Objetivo principal del proyecto

Crear una web para **Lumen Paper** que tenga:

- Página de inicio.
- Catálogo de productos.
- Categorías de productos.
- Cards de productos.
- Botón de consulta por WhatsApp.
- Diseño responsive para celular, tablet y escritorio.
- Estilo visual coherente con Instagram.
- Código separado en HTML, CSS y JavaScript.
- Documentación del proyecto en archivos `.md`.
- Preparación para agregar más productos fácilmente.
- Preparación para agregar una galería por producto más adelante.

---

# 5. Identidad visual

El sitio debe mantener el mismo estilo visual que estoy armando en Instagram.

## Estilo general

Quiero un diseño:

- delicado,
- artesanal,
- minimalista,
- cálido,
- prolijo,
- femenino,
- moderno,
- claro,
- fácil de navegar.

## Color principal

El color principal que uso en Instagram es:

```css
#4cb1b1
```

Quiero que uses una escala de colores basada en ese cian.

Crear variables CSS para la paleta, por ejemplo:

```css
:root {
  --color-primary: #4cb1b1;
  --color-primary-light: #dff5f5;
  --color-primary-soft: #edfafa;
  --color-primary-dark: #2f7f7f;

  --color-background: #ffffff;
  --color-surface: #f8fefe;
  --color-text: #2b2b2b;
  --color-muted: #6f6f6f;
  --color-border: #d7eeee;
}
```

Podés ajustar los tonos si encontrás una combinación más estética, pero siempre respetando el color principal `#4cb1b1`.

## Tipografías

Las tipografías que uso en Canva para publicaciones son:

- `DM Serif Display`
- `Belleza`

Usar Google Fonts si corresponde.

Quiero que el título principal y los títulos destacados usen una de esas tipografías, y que los textos largos usen una tipografía legible y simple.

---

# 6. Secciones principales de la web

Crear una web con estas secciones:

---

## 6.1 Header

El header debe incluir:

- Nombre del emprendimiento: **Lumen Paper**.
- Logo si se encuentra una imagen dentro de `assets/img/marca/`.
- Menú de navegación.
- Botón visible para WhatsApp.
- Diseño simple y limpio.
- En mobile, el menú puede adaptarse de forma simple.

El menú puede tener estos links:

- Inicio.
- Catálogo.
- Sobre Lumen Paper.
- Contacto.

---

## 6.2 Hero principal

Crear una sección principal de bienvenida.

Debe incluir:

- Título cálido.
- Subtítulo breve.
- Una frase relacionada con agendas, cuadernos, papelería artesanal, devocionales y organización.
- Botón “Ver catálogo”.
- Botón “Consultar por WhatsApp”.

Ejemplo de texto orientativo:

```txt
Papelería artesanal para organizar tus días con amor y propósito.
```

También puede decir algo como:

```txt
Agendas, cuadernos y detalles pensados para acompañarte todos los días.
```

---

## 6.3 Catálogo de productos

Crear una sección de catálogo.

Los productos deben mostrarse en cards.

Cada card debe tener:

- Imagen principal del producto.
- Nombre del producto.
- Categoría.
- Descripción breve.
- Precio opcional o texto “Consultar precio”.
- Botón “Consultar por WhatsApp”.

Cuando el cliente haga clic en el botón de WhatsApp, debe abrirse WhatsApp con un mensaje armado automáticamente.

Ejemplo de mensaje:

```txt
Hola, quiero consultar por el producto Agenda Docente de Lumen Paper.
```

El link debe tener este formato:

```txt
https://wa.me/NUMERO_DE_WHATSAPP?text=MENSAJE_CODIFICADO
```

Usar este número de WhatsApp del emprendimiento:

```js
const WHATSAPP_NUMBER = "5491127495859";
```

Dejarlo como constante fácil de modificar en JavaScript y agregar un comentario indicando que ese número puede cambiarse si hace falta.

---

## 6.4 Categorías

Crear categorías para organizar los productos.

Categorías iniciales:

- Agendas.
- Cuadernos.
- Devocionales.
- Diseños únicos.

Importante:

La carpeta debe llamarse:

```txt
disenos-unicos
```

Pero la categoría que se muestra en pantalla debe decir:

```txt
Diseños únicos
```

Me gustaría que el catálogo tenga filtros por categoría.

El usuario debe poder hacer clic en una categoría y ver solo esos productos.

También debe existir una opción para ver todos los productos.

---

## 6.5 Sobre Lumen Paper

Crear una sección breve sobre el emprendimiento.

El texto puede decir algo como:

```txt
Lumen Paper es un emprendimiento de papelería artesanal creado con dedicación, amor por los detalles y ganas de acompañar la organización diaria de cada persona.

Cada agenda, cuaderno, devocional y diseño especial está pensado para ser útil, lindo y único.
```

Podés mejorar el texto para que suene más natural, cálido y profesional.

---

## 6.6 Footer

El footer debe incluir:

- Nombre del emprendimiento.
- WhatsApp.
- Instagram.
- Facebook.
- Texto de derechos reservados.

Datos del emprendimiento:

```txt
Instagram: @lumenpaper.ok
Facebook: Lumen Paper
WhatsApp: 1127495859
```

Ejemplo:

```txt
© 2026 Lumen Paper. Todos los derechos reservados.
```

---

# 7. Estructura de carpetas esperada

La estructura final del proyecto debe quedar así:

```txt
lumen-paper-web/
├─ .git/
├─ index.html
├─ README.md
├─ docs/
│  ├─ arquitectura.md
│  ├─ proximos-pasos.md
│  └─ guia-explicacion-codigo.md
├─ css/
│  └─ styles.css
├─ js/
│  └─ main.js
├─ assets/
│  ├─ img/
│  │  ├─ agendas/
│  │  ├─ cuadernos/
│  │  ├─ devocionales/
│  │  ├─ disenos-unicos/
│  │  └─ marca/
│  └─ icons/
└─ data/
   └─ productos.js
```

Si alguna carpeta no existe, crearla.

No tocar la carpeta `.git`.

Usar `disenos-unicos` sin ñ para evitar problemas con rutas de archivos.

---

# 8. Organización de imágenes

Las imágenes deben organizarse según el tipo de producto.

La estructura es:

```txt
assets/img/agendas/
assets/img/cuadernos/
assets/img/devocionales/
assets/img/disenos-unicos/
assets/img/marca/
```

Usar las imágenes reales que ya existen en esas carpetas.

Detectar las extensiones reales de los archivos, por ejemplo:

```txt
.jpg
.jpeg
.png
.webp
```

No inventar extensiones si los archivos ya existen con una extensión específica.

Si los nombres tienen mayúsculas, respetarlos exactamente en las rutas, porque las rutas de imágenes pueden fallar si no coinciden.

---

# 9. Buenas prácticas obligatorias

Quiero que el proyecto tenga buenas prácticas desde el inicio.

Aplicar estas reglas:

1. Separar HTML, CSS y JavaScript.
2. Evitar código repetido.
3. Usar nombres de clases claros.
4. Usar variables CSS para:
   - colores,
   - tipografías,
   - espaciados,
   - bordes,
   - sombras.
5. Crear un archivo `data/productos.js` para centralizar la información de los productos.
6. Renderizar las cards de productos desde JavaScript.
7. Dejar el proyecto preparado para agregar nuevos productos fácilmente.
8. Hacer diseño responsive.
9. Usar HTML semántico.
10. Cuidar accesibilidad básica:
    - textos alternativos en imágenes,
    - buen contraste,
    - botones claros,
    - navegación simple,
    - etiquetas semánticas.
11. No usar frameworks.
12. No usar código innecesariamente complejo.
13. Agregar comentarios simples donde sea útil para una principiante.
14. Mantener una arquitectura simple, clara y mantenible.
15. Crear una card por producto, no una card por imagen.
16. Dejar preparada la estructura para una futura galería de imágenes por producto.

---

# 10. Archivo de productos

Crear el archivo:

```txt
data/productos.js
```

Ahí quiero guardar los productos como un array de objetos.

Ejemplo:

```js
const productos = [
  {
    id: "agenda-club",
    nombre: "Agenda Club",
    categoria: "Agendas",
    descripcion: "Agenda artesanal con diseño personalizado.",
    precio: "Consultar precio",
    imagenPrincipal: "assets/img/agendas/agenda-club-1.jpg",
    imagenes: [
      "assets/img/agendas/agenda-club-1.jpg",
      "assets/img/agendas/agenda-club-1a.jpg",
      "assets/img/agendas/agenda-club-1b.jpg"
    ],
    destacado: true
  },
  {
    id: "cuaderno-a5",
    nombre: "Cuaderno A5",
    categoria: "Cuadernos",
    descripcion: "Cuaderno artesanal ideal para apuntes, ideas y proyectos.",
    precio: "Consultar precio",
    imagenPrincipal: "assets/img/cuadernos/cuaderno-A5-1.jpg",
    imagenes: [
      "assets/img/cuadernos/cuaderno-A5-1.jpg",
      "assets/img/cuadernos/cuaderno-A5-1a.jpg",
      "assets/img/cuadernos/cuaderno-A5-1b.jpg"
    ],
    destacado: false
  },
  {
    id: "devocional",
    nombre: "Devocional",
    categoria: "Devocionales",
    descripcion: "Devocional artesanal pensado para acompañar momentos de reflexión y oración.",
    precio: "Consultar precio",
    imagenPrincipal: "assets/img/devocionales/devocional-1.jpg",
    imagenes: [
      "assets/img/devocionales/devocional-1.jpg",
      "assets/img/devocionales/devocional-1a.jpg"
    ],
    destacado: false
  },
  {
    id: "diseno-unico",
    nombre: "Diseño único",
    categoria: "Diseños únicos",
    descripcion: "Producto artesanal con diseño especial y personalizado.",
    precio: "Consultar precio",
    imagenPrincipal: "assets/img/disenos-unicos/diseno-unico-1.jpg",
    imagenes: [
      "assets/img/disenos-unicos/diseno-unico-1.jpg",
      "assets/img/disenos-unicos/diseno-unico-1a.jpg"
    ],
    destacado: false
  }
];
```

Importante: los nombres y rutas del ejemplo son orientativos. Revisar los nombres reales de las imágenes antes de cargar los productos.

El código debe estar preparado para que yo pueda agregar nuevos productos copiando y pegando un objeto nuevo.

Explicarme claramente cómo hacerlo.

---

# 11. JavaScript

Crear el archivo:

```txt
js/main.js
```

Ese archivo debe encargarse de:

- Leer la lista de productos desde `data/productos.js`.
- Crear las cards de productos dinámicamente.
- Insertarlas en el HTML.
- Crear el link de WhatsApp para cada producto.
- Codificar correctamente el mensaje de WhatsApp.
- Dejar el número de WhatsApp como constante fácil de cambiar.
- Agregar filtro por categoría.
- Mostrar todos los productos al cargar la página.
- Dejar preparado el código para futura galería de imágenes por producto.

El código debe ser claro y fácil de entender.

Agregar comentarios simples en las partes importantes.

---

# 12. CSS

Crear el archivo:

```txt
css/styles.css
```

Debe incluir:

- Variables CSS.
- Estilos generales.
- Reset básico.
- Estilos del header.
- Estilos del hero.
- Estilos del catálogo.
- Estilos de las cards.
- Estilos de filtros por categoría.
- Estilos de botones.
- Estilos del footer.
- Media queries para responsive design.

El diseño debe verse bien en:

- celular,
- tablet,
- escritorio.

---

# 13. HTML

Crear el archivo:

```txt
index.html
```

Debe tener estructura semántica:

- `header`
- `main`
- `section`
- `footer`

Debe enlazar correctamente:

- Google Fonts.
- `css/styles.css`.
- `data/productos.js`.
- `js/main.js`.

Recordar cargar primero:

```html
<script src="data/productos.js"></script>
```

Y después:

```html
<script src="js/main.js"></script>
```

Porque `main.js` necesita usar la lista de productos.

---

# 14. Documentación obligatoria

Además del código, necesito documentación clara.

Crear estos archivos:

```txt
README.md
docs/arquitectura.md
docs/proximos-pasos.md
docs/guia-explicacion-codigo.md
```

---

## 14.1 Archivo README.md

El `README.md` debe incluir:

1. Nombre del proyecto.
2. Descripción breve.
3. Objetivo de la web.
4. Tecnologías utilizadas.
5. Cómo abrir el proyecto.
6. Estructura general de carpetas.
7. Cómo agregar productos.
8. Cómo cambiar el número de WhatsApp.
9. Cómo cambiar imágenes.
10. Cómo funciona una card de producto.
11. Próximas mejoras posibles.

---

## 14.2 Archivo docs/arquitectura.md

Este archivo debe explicar la arquitectura del proyecto.

Debe incluir:

1. Qué tecnologías se usan.
2. Por qué se eligió HTML, CSS y JavaScript puro.
3. Cómo está organizada la estructura de carpetas.
4. Para qué sirve cada archivo.
5. Cómo se agregan nuevos productos.
6. Cómo se organizan las imágenes.
7. Cómo se agrupan varias imágenes en un solo producto.
8. Cómo se cambian colores y tipografías.
9. Cómo funciona la redirección a WhatsApp.
10. Cómo funciona el filtro por categorías.
11. Qué buenas prácticas se aplicaron.
12. Qué mejoras podrían agregarse más adelante.
13. Qué decisiones técnicas se tomaron y por qué.

Este archivo debe estar escrito de manera clara, como para una persona que recién está aprendiendo.

---

## 14.3 Archivo docs/proximos-pasos.md

Este archivo debe funcionar como el track del proyecto.

Lo necesito para poder avanzar con Codex en distintas sesiones sin perder el contexto.

Debe incluir:

### Estado actual del proyecto

Indicar:

- Qué partes ya están creadas.
- Qué archivos existen.
- Qué funcionalidades ya funcionan.
- Qué imágenes fueron detectadas.
- Qué productos fueron cargados inicialmente.

### Decisiones tomadas

Registrar:

- Tecnologías elegidas.
- Estructura de carpetas.
- Paleta de colores.
- Tipografías.
- Forma de manejar productos.
- Forma de agrupar imágenes por producto.
- Forma de redirigir a WhatsApp.
- Organización de imágenes.
- Uso de filtros por categoría.

### Pendientes

Indicar:

- Qué falta hacer.
- Qué se debería mejorar.
- Qué se podría agregar más adelante.

### Próximas tareas sugeridas

Crear una lista ordenada de pasos para seguir avanzando.

Separar tareas simples para poder trabajarlas de a poco.

Ejemplo:

```txt
1. Revisar que todas las imágenes carguen correctamente.
2. Confirmar nombres y descripciones reales de cada producto.
3. Agregar precios si corresponde.
4. Agregar link real de Instagram.
5. Agregar link real de Facebook.
6. Mejorar textos del catálogo.
7. Agregar galería de imágenes por producto.
8. Agregar sección de productos destacados.
9. Revisar diseño mobile.
10. Publicar la web.
```

### Historial de avances

Registrar brevemente qué se hizo en cada etapa.

Ejemplo:

```txt
## Sesión 1

- Se creó la estructura inicial del proyecto.
- Se detectaron las imágenes reales dentro de assets/img.
- Se creó el HTML principal.
- Se agregó la paleta de colores.
- Se creó el catálogo dinámico.
- Se agregó el filtro por categorías.
- Se documentó la arquitectura inicial.
```

### Notas importantes

Agregar cualquier cosa que deba recordarse para futuras sesiones.

Por ejemplo:

- Mantener el estilo visual de Instagram.
- Usar el color principal `#4cb1b1`.
- Usar tipografías similares a `DM Serif Display` o `Belleza`.
- Las compras se terminan por WhatsApp.
- No agregar carrito de compras todavía.
- No agregar pasarela de pago todavía.
- No crear una card por cada foto.
- Agrupar varias fotos en un solo producto usando la propiedad `imagenes`.
- Usar la carpeta `disenos-unicos` sin ñ en la ruta.
- Mostrar la categoría como `Diseños únicos` en pantalla.

Cada vez que se realice un cambio importante en el proyecto, actualizar este archivo.

---

## 14.4 Archivo docs/guia-explicacion-codigo.md

Este archivo debe guardar la forma en la que necesito que se me explique el proyecto, para no tener que repetirlo en cada sesión.

Debe incluir estas indicaciones:

1. Explicar todo de manera simple, como para una persona con conocimientos básicos de HTML, CSS y JavaScript.

2. Explicar cada archivo creado:
   - Para qué sirve.
   - Qué responsabilidad tiene dentro del proyecto.
   - Cómo se relaciona con otros archivos.

3. Explicar el código por secciones o línea por línea cuando sea necesario.

4. Evitar lenguaje demasiado técnico.

5. Si se usa una palabra técnica, explicarla con un ejemplo simple.

6. Cuando se agregue una funcionalidad nueva, explicar:
   - Qué problema resuelve.
   - Qué archivos se modificaron.
   - Qué parte del código se agregó.
   - Cómo probar que funciona.

7. Mantener explicaciones claras y ordenadas, usando:
   - títulos,
   - pasos,
   - ejemplos,
   - fragmentos de código comentados.

8. Incluir un pequeño glosario con conceptos importantes, por ejemplo:
   - HTML semántico.
   - CSS variables.
   - Responsive design.
   - Array de productos.
   - Objeto de JavaScript.
   - Función de JavaScript.
   - Evento click.
   - Redirección a WhatsApp.
   - Media query.
   - Renderizado dinámico.
   - Filtro por categoría.
   - Galería de imágenes.
   - Ruta de imagen.

9. Cada vez que se agregue código nuevo, actualizar este documento si aparece un concepto nuevo que necesite explicación.

---

# 15. Flujo de trabajo que quiero que sigas

Antes de empezar a escribir código, primero quiero que hagas esto:

1. Revisar la estructura actual del proyecto.
2. Revisar las carpetas dentro de `assets/img`.
3. Detectar los nombres exactos de las imágenes.
4. Proponer la arquitectura del proyecto.
5. Explicar por qué conviene esa estructura.
6. Explicar brevemente qué va a contener cada carpeta.
7. Después crear los archivos.

Cuando crees los archivos, quiero que lo hagas en este orden:

1. Crear carpetas faltantes.
2. Crear `index.html`.
3. Crear `css/styles.css`.
4. Crear `data/productos.js`.
5. Crear `js/main.js`.
6. Crear `README.md`.
7. Crear `docs/arquitectura.md`.
8. Crear `docs/proximos-pasos.md`.
9. Crear `docs/guia-explicacion-codigo.md`.

---

# 16. Explicación paso a paso

Es muy importante que me expliques todo de manera simple.

Después de crear cada archivo, explicame:

- Qué hace ese archivo.
- Para qué sirve.
- Qué partes importantes tiene.
- Cómo se relaciona con los demás archivos.
- Qué debería tocar yo si quiero modificar algo.

También necesito que expliques el código línea por línea o por bloques pequeños, especialmente en:

- JavaScript.
- Variables CSS.
- Estructura principal del HTML.
- Función que crea las cards.
- Función que arma el link de WhatsApp.
- Filtro por categorías.
- Estructura de cada producto en `productos.js`.

No asumas que ya entiendo conceptos avanzados.

---

# 17. Reglas para futuras sesiones

Como voy a trabajar este proyecto en distintas sesiones con Codex, es importante que siempre mantengas actualizados estos archivos:

```txt
README.md
docs/arquitectura.md
docs/proximos-pasos.md
docs/guia-explicacion-codigo.md
```

Antes de finalizar cada avance, revisar y actualizar esos documentos.

No quiero que queden desactualizados.

Tienen que servir para que, si abro otra sesión con Codex, pueda entender rápidamente:

- qué se hizo,
- cómo está armado el proyecto,
- qué falta hacer,
- cómo continuar,
- qué decisiones se tomaron,
- cómo explicarme el código de forma simple.

Cuando terminemos una sesión de trabajo, indicame qué debería revisar en `docs/proximos-pasos.md` para poder continuar después sin perder el contexto.

---

# 18. Cosas que NO quiero por ahora

No quiero agregar por ahora:

- Carrito de compras complejo.
- Login de usuarios.
- Panel de administración.
- Base de datos.
- Pasarela de pago.
- Frameworks como React, Vue o Angular.
- Backend.
- Código demasiado avanzado.
- Una card distinta por cada imagen.

La web tiene que ser simple, estática y funcional.

La compra se termina por WhatsApp.

---

# 19. Resultado esperado

Al finalizar, quiero tener un proyecto web inicial de Lumen Paper con:

- Diseño responsive.
- Estilo visual alineado a Instagram.
- Catálogo de productos.
- Una card por producto.
- Varias imágenes asociadas a cada producto.
- Cards generadas desde JavaScript.
- Filtro por categorías.
- Botón de consulta por WhatsApp.
- Estructura de carpetas ordenada.
- Archivos separados.
- Documentación clara.
- Guía para continuar el proyecto en futuras sesiones.
- Explicación simple del código.

Recordá que estoy aprendiendo HTML, CSS y JavaScript, así que necesito explicaciones claras, ordenadas y fáciles de seguir.
