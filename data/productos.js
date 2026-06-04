const detalleAgendaDiaria = {
  descripcionLarga:
    "La agenda diaria personalizada de Lumen Paper está pensada para acompañarte todos los días. Es ideal para organizar tus tiempos, planificar objetivos, anotar fechas importantes, registrar gastos y tener un espacio especial para escribir todo lo que necesitás recordar. Cada diseño se realiza con amor y dedicación, cuidando los detalles para que sea una agenda práctica, linda y única.",
  incluye: [
    "Datos personales",
    "Calendario 2026/2027",
    "Feriados",
    "Objetivos",
    "Fechas importantes",
    "Planificador mensual",
    "Planificador semanal",
    "Día a día",
    "Control de gastos",
    "Notas"
  ],
  medidas: [
    "Tamaño A5: 15 x 21 cm aprox.",
    "Encuadernación con espiral/anillado",
    "Tapa personalizada",
    "Interior impreso en blanco y negro o color, según diseño"
  ],
  idealPara: "Organizar la rutina, planificar metas, estudiar, trabajar o regalar.",
  aclaracion: ""
};

const detalleAgendaDocente = {
  descripcionLarga:
    "La agenda docente personalizada de Lumen Paper está diseñada para organizar el año escolar de una manera práctica, clara y delicada. Es ideal para planificar clases, registrar información importante, ordenar horarios y acompañar cada día dentro del aula. Un producto pensado especialmente para docentes que buscan tener todo en un solo lugar, con un diseño personalizado y hecho con dedicación.",
  incluye: [
    "Datos personales",
    "Calendario 2026/2027",
    "Feriados",
    "Horarios",
    "Planificación mensual",
    "Planificación semanal",
    "Registro de alumnos",
    "Fechas importantes",
    "Reuniones",
    "Notas",
    "Espacios para organizar clases y actividades"
  ],
  medidas: [
    "Tamaño A5: 15 x 21 cm aprox.",
    "Encuadernación con espiral/anillado",
    "Tapa personalizada",
    "Interior pensado para organización docente"
  ],
  idealPara: "Docentes, seños, profesoras, maestras jardineras o estudiantes de formación docente.",
  aclaracion: ""
};

const detalleCuadernoEstudiantil = {
  descripcionLarga:
    "El cuaderno estudiantil personalizado de Lumen Paper está pensado para acompañarte durante el estudio. Es práctico, cómodo y cuenta con espacios útiles para organizar materias, horarios, exámenes y apuntes. Su diseño personalizado lo convierte en un cuaderno único, ideal para usar todos los días en la escuela, facultad, cursos o talleres.",
  incluye: [
    "Datos personales",
    "Anotaciones",
    "Mis apuntes",
    "Horarios",
    "Exámenes",
    "Trabajos prácticos",
    "Hojas rayadas para escribir"
  ],
  medidas: [
    "Tamaño A5: 15 x 21 cm aprox.",
    "Encuadernación con espiral/anillado",
    "Tapa personalizada",
    "Interior estudiantil"
  ],
  idealPara: "Estudiantes, cursos, facultad, colegio, talleres o para regalar.",
  aclaracion: ""
};

const detalleDevocional = {
  descripcionLarga:
    "El devocional personalizado de Lumen Paper es un espacio especial para registrar tu tiempo con Dios. Está pensado para escribir oraciones, guardar versículos favoritos, anotar reflexiones y llevar un registro de gratitud diaria. Su diseño delicado y personalizado lo convierte en un compañero ideal para momentos de lectura, oración y crecimiento espiritual.",
  incluye: [
    "Datos personales",
    "Versículos favoritos",
    "Devocionales",
    "Gratitud diaria",
    "Oraciones"
  ],
  medidas: [
    "Tamaño A5: 15 x 21 cm aprox.",
    "Encuadernación con espiral/anillado",
    "Tapa personalizada",
    "Interior devocional"
  ],
  idealPara: "Tiempo con Dios, oración, lectura bíblica, grupos cristianos, regalos especiales o uso personal.",
  aclaracion: ""
};

const detalleCuadernoPersonalizado = {
  descripcionLarga:
    "Los cuadernos personalizados de Lumen Paper están pensados para quienes buscan un producto práctico, lindo y especial. Son ideales para tomar apuntes, escribir ideas, organizar proyectos o regalar algo personalizado. Cada cuaderno se realiza con un diseño único, cuidando los detalles para que sea funcional y delicado.",
  incluye: [
    "Tapa personalizada",
    "Datos personales",
    "Hojas rayadas",
    "Hojas lisas o especiales, según pedido",
    "Separadores o detalles personalizados, según modelo"
  ],
  medidas: [
    "Tamaño A5: 15 x 21 cm aprox.",
    "Encuadernación con espiral/anillado",
    "Tapa personalizada"
  ],
  idealPara: "Estudio, trabajo, escritura personal, regalos, cursos o emprendimientos.",
  aclaracion:
    "Las medidas pueden adaptarse según el modelo. La medida base utilizada es A5, aproximadamente 15 x 21 cm. Los diseños, interiores y cantidad de hojas pueden variar según el pedido personalizado."
};

const productos = [
  {
    id: "agenda-colectivero",
    nombre: "Agenda Colectivero",
    categoria: "Agendas",
    descripcion: "Agenda artesanal con diseño personalizado para organizar actividades, fechas importantes e ideas.",
    precio: "Desde $20.000",
    preciosPorTamano: {
      A5: 20000,
      B5: 25000
    },
    imagenPrincipal: "assets/img/agendas/agenda-club-1.png",
    imagenes: [
      "assets/img/agendas/agenda-club-1.png",
      "assets/img/agendas/agenda-club-1a.png",
      "assets/img/agendas/agenda-club-1b.png",
      "assets/img/agendas/agenda-club-1c.png",
      "assets/img/agendas/agenda-club-1d.png",
      "assets/img/agendas/agenda-club-1e.png"
    ],
    destacado: true,
    ...detalleAgendaDiaria
  },
  {
    id: "agenda-diaria",
    nombre: "Agenda Diaria",
    categoria: "Agendas",
    descripcion: "Agenda pensada para planificar cada día con claridad, calidez y espacio para tus prioridades.",
    precio: "Desde $20.000",
    preciosPorTamano: {
      A5: 20000,
      B5: 25000
    },
    imagenPrincipal: "assets/img/agendas/agenda-diaria-1.png",
    imagenes: [
      "assets/img/agendas/agenda-diaria-1.png",
      "assets/img/agendas/agenda-diaria-1a.png",
      "assets/img/agendas/agenda-diaria-1b.png",
      "assets/img/agendas/agenda-diaria-1c.png",
      "assets/img/agendas/agenda-diaria-1d.png",
      "assets/img/agendas/agenda-diaria-1e.png",
      "assets/img/agendas/agenda-diaria-1f.png",
      "assets/img/agendas/agenda-diaria-1g.png",
      "assets/img/agendas/agenda-diaria-1h.png"
    ],
    destacado: true,
    ...detalleAgendaDiaria
  },
  {
    id: "agenda-docente",
    nombre: "Agenda Docente",
    categoria: "Agendas",
    descripcion: "Agenda artesanal para docentes, ideal para organizar clases, planificaciones y seguimiento diario.",
    precio: "Desde $20.000",
    preciosPorTamano: {
      A5: 20000,
      B5: 25000
    },
    imagenPrincipal: "assets/img/agendas/agenda-docente-1.png",
    imagenes: [
      "assets/img/agendas/agenda-docente-1.png",
      "assets/img/agendas/agenda-docente-1a.png",
      "assets/img/agendas/agenda-docente-1b.png",
      "assets/img/agendas/agenda-docente-1c.png",
      "assets/img/agendas/agenda-docente-1d.png",
      "assets/img/agendas/agenda-docente-1e.png",
      "assets/img/agendas/agenda-docente-1f.png",
      "assets/img/agendas/agenda-docente-1g.png",
      "assets/img/agendas/agenda-docente-1h.png",
      "assets/img/agendas/agenda-docente-1i.png",
      "assets/img/agendas/agenda-docente-1j.png"
    ],
    destacado: true,
    ...detalleAgendaDocente
  },
  {
    id: "cuaderno",
    nombre: "Cuaderno Personalizado",
    categoria: "Cuadernos",
    descripcion: "Cuaderno artesanal en tamaño A5, práctico para apuntes, ideas, estudios y proyectos.",
    precio: "Desde $17.000",
    preciosPorTamano: {
      A5: 17000,
      B5: 22000
    },
    imagenPrincipal: "assets/img/cuadernos/cuaderno-A5-1.png",
    imagenes: [
      "assets/img/cuadernos/cuaderno-A5-1.png",
      "assets/img/cuadernos/cuaderno-A5-1a.png",
      "assets/img/cuadernos/cuaderno-A5-1b.png",
      "assets/img/cuadernos/cuaderno-A5-1c.png",
      "assets/img/cuadernos/cuaderno-A5-1d.png",
      "assets/img/cuadernos/cuaderno-A5-1e.png"
    ],
    destacado: false,
    ...detalleCuadernoEstudiantil
  },
  {
    id: "devocional",
    nombre: "Devocional",
    categoria: "Devocionales",
    descripcion: "Devocional artesanal para acompañar momentos de reflexión, oración y crecimiento personal.",
    precio: "Desde $20.000",
    preciosPorTamano: {
      A5: 20000,
      B5: 25000
    },
    imagenPrincipal: "assets/img/devocionales/devocional-mujer-1.png",
    imagenes: [
      "assets/img/devocionales/devocional-mujer-1.png",
      "assets/img/devocionales/devocional-mujer-1a.png",
      "assets/img/devocionales/devocional-mujer-1b.png",
      "assets/img/devocionales/devocional-mujer-1c.png",
      "assets/img/devocionales/devocional-mujer-1d.png",
      "assets/img/devocionales/devocional-mujer-1e.png",
      "assets/img/devocionales/devocional-mujer-1f.png"
    ],
    destacado: false,
    ...detalleDevocional
  },
  {
    id: "devocional-nino",
    nombre: "Devocional Niño",
    categoria: "Devocionales",
    descripcion: "Devocional infantil con diseño cuidado, pensado para acompañar la fe y los hábitos de los más chicos.",
    precio: "Desde $17.000",
    preciosPorTamano: {
      A5: 17000,
      B5: 22000
    },
    imagenPrincipal: "assets/img/devocionales/devocional-nino-1.png",
    imagenes: [
      "assets/img/devocionales/devocional-nino-1.png",
      "assets/img/devocionales/devocional-nino-1a.jpeg",
      "assets/img/devocionales/devocional-nino-1b.jpeg",
      "assets/img/devocionales/devocional-nino-1c.jpeg",
      "assets/img/devocionales/devocional-nino-1d.jpeg",
      "assets/img/devocionales/devocional-nino-1e.jpeg"
    ],
    destacado: false,
    ...detalleDevocional
  },
  {
    id: "disenos-unicos",
    nombre: "Diseños Personalizados",
    categoria: "Diseños únicos",
    descripcion: "Productos artesanales personalizados, creados con detalles únicos para regalar," +
                 "organizar o acompañar momentos especiales.",
    precio: "A coordinar",
    precioAcoordinar: true,
    imagenPrincipal: "assets/img/disenos-unicos/cancionero-1.png",
    imagenes: [
      "assets/img/disenos-unicos/cancionero-1.png",
      "assets/img/disenos-unicos/cancionero-1a.png",
      "assets/img/disenos-unicos/cancionero-2.png",
      "assets/img/disenos-unicos/cancionero-3.png"
    ],
    destacado: false,
    ...detalleCuadernoPersonalizado
  }
];
