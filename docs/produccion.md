# Preparación para publicar Lumen Paper

Esta etapa prepara archivos y pruebas. No configura AWS, no publica ni habilita pagos. Mercado Pago permanece deshabilitado en ambos dominios públicos.

## AWS Amplify: pendientes antes de publicar

1. Verificar la rama y la raíz de artefactos configuradas. Es un sitio estático multipágina: publicar todos los HTML de raíz, js, css, data y assets. Revisar que se incluyan los módulos y retornos que aún no estaban publicados. Este repositorio tiene cambios anteriores y archivos sin seguimiento: revisar el conjunto antes de un futuro commit autorizado.
2. Mantener customHttp.yml en la raíz de la aplicación y verificar su CSP efectiva: connect-src 'self' https://api.lumenpaper.com.ar. No necesita scripts, iframe ni fetch directos a Mercado Pago: el checkout es una navegación HTTPS de la pestaña. payment=() restringe Payment Request API, no esta navegación.
3. Mantener DNS y certificados válidos para www.lumenpaper.com.ar y lumenpaper.com.ar. Proponer redirección 301 del segundo al primero, preservando rutas y query. Revisar las reglas existentes para evitar bucles. No cambiar DNS ni reglas desde esta etapa.
4. Revisar docs/amplify-redirects.json en la consola de Rewrites and redirects. La regla de dominio no incluye una ruta: Amplify agrega las rutas al destino. Las reglas explícitas de /disenos y /pago-* (con/sin barra) reescriben a su HTML real. No usar una regla SPA 200 global a index.html: ocultaría recursos faltantes y páginas de resultado equivocadas. Si existe un fallback, ordenar las reglas específicas antes y revisar su alcance.
5. Validar directamente .html, ruta limpia y barra final. Todas deben servir el documento previsto; los recursos relativos usan base href=/ para no buscar js/css/assets dentro de /pago-exitoso/. Verificar que external_reference y las demás query sobrevivan al cambio de dominio y a las rutas. No agregar condiciones de query a estas reglas.
6. Evitar caché prolongada del HTML de configuración. Comprobar que una publicación autorizada sirve el conjunto de scripts actual y que una sesión antigua no mezcla versiones.

El dominio canónico ya está declarado en index.html y disenos.html. No se agregó una redirección JavaScript: el cambio debe ocurrir en hosting antes de cargar el carrito. El almacenamiento del dominio sin www no se puede migrar automáticamente al de www; anunciar esta limitación si ya hay compradores con carritos/pedidos allí. Los retornos futuros deben usar siempre www y conservar external_reference, ya que sessionStorage depende del mismo origen y pestaña.

Referencia AWS: https://docs.aws.amazon.com/amplify/latest/userguide/redirect-rewrite-examples.html (dominios, rutas y query). Las reglas guardadas son una propuesta, no han sido aplicadas ni validadas en el hosting.

## Lightsail y contrato de API: pendientes

- Verificar HTTPS, salud y catálogo. CORS debe permitir el origen canónico y los orígenes locales necesarios, incluidos preflight POST con Content-Type application/json. No asumir que CORS autoriza el acceso: los endpoints públicos necesitan protección del servidor frente a abuso.
- Validar creación y consulta de pedidos en un entorno de prueba autorizado: HTTP 201, UUID, estados e importes del contrato. No ejecutar POST reales en producción durante esta etapa.
- Confirmar que el catálogo excluye variantes no comprables. El JSON observado ofrece id, sku, name y price, sin stock. Definir cambios de contrato/stock en backend requeriría otra tarea.
- Verificar límites, validación de datos, importes autoritativos y tratamiento de duplicados. El frontend no envía una clave de idempotencia porque no se confirmó soporte. Hace falta definir recuperación cuando el servidor creó el pedido pero el UUID no llegó.
- Si el almacenamiento del navegador está bloqueado, los marcadores solo protegen durante la carga actual. Las protecciones no abarcan varios dispositivos ni pestañas independientes.

## Antes de habilitar Mercado Pago

Se requiere autorización explícita independiente de la publicación del catálogo/pedidos.

1. Verificar en backend que el entorno de pruebas y las cuentas/credenciales seleccionadas no cobran dinero real. No hay secretos en frontend; un init_point con dominio productivo por sí solo no prueba que las cuentas sean de prueba.
2. Confirmar que el checkout devuelve preference_id y checkout_url del pedido esperado, con importe/moneda correctos y que repetir la operación no crea preferencias incompatibles. El frontend acepta únicamente www.mercadopago.com.ar y sandbox.mercadopago.com.ar bajo /checkout/; cualquier destino adicional exige una revisión explícita.
3. Verificar los valores efectivos, sin exponer secretos, de MERCADOPAGO_BACK_URL_SUCCESS, MERCADOPAGO_BACK_URL_PENDING y MERCADOPAGO_BACK_URL_FAILURE: respectivamente https://www.lumenpaper.com.ar/pago-exitoso.html, https://www.lumenpaper.com.ar/pago-pendiente.html y https://www.lumenpaper.com.ar/pago-fallido.html. Los nombres vienen de la documentación previa del proyecto y deben confirmarse en el backend desplegado. Confirmar también external_reference=public_id. Las preferencias existentes pueden conservar URLs anteriores.
4. Verificar la URL de notificaciones y la validación/autenticidad del webhook, su procesamiento repetido seguro y la correspondencia de importe, moneda y pedido. Solo el backend puede establecer PAID; el retorno no reemplaza al webhook.
5. Probar con cuentas de prueba aprobación, pendiente, rechazo, cancelación, notificaciones tardías/duplicadas, timeout y retorno en otra pestaña/origen. Verificar que pagos ajenos o URLs adulteradas no confirman ni limpian carritos.
6. Verificar GET /api/v1/public/orders/{publicId}/checkout y los conflictos CHECKOUT_NOT_STARTED, CHECKOUT_UNCERTAIN, CHECKOUT_REVIEW_REQUIRED y CHECKOUT_EXPIRED. El frontend recupera sin fallback a POST; sólo GET 409 CHECKOUT_NOT_STARTED permite ofrecer el primer pago manual. Verificar PAYMENT_REVIEW en home y los tres retornos, sin limpiar carrito ni abrir otro checkout. El backend persistente protege los reintentos por UUID incluso entre dispositivos; crear pedidos distintos sigue requiriendo idempotencia de intención de compra.
7. Solo después de las verificaciones y de la autorización modificar la bandera productiva. El envío sigue cotizándose y pagándose por separado; no agregarlo silenciosamente al checkout.

Referencias Mercado Pago: https://www.mercadopago.com.ar/developers/es/reference/online-payments/checkout-pro-preferences/overview y https://www.mercadopago.com.ar/developers/es/news/2023/11/16/Questions-on-how-to-test-your-integration-- . Consultarlas nuevamente al realizar la habilitación.

## Orden de validación final

1. Ejecutar todas las pruebas simuladas y revisar cambios/archivos a publicar.
2. En local, comprobar visualmente catálogo, modal, diseños, carrito y formulario para retiro/envío; usar datos ficticios y backend local. No abrir checkout real.
3. Aprobar por separado las reglas/DNS de Amplify y validar rutas con query, CSP, TLS y recursos en un entorno autorizado. Los dominios de preview no tienen API habilitada por defecto: cualquier habilitación requiere configuración explícita.
4. Verificar contratos de pedidos en un entorno de prueba, sin tocar producción.
5. Autorizar la publicación cuando esos controles estén completos; mantener mercadoPagoEnabled deshabilitado.
6. Realizar las pruebas de pago autorizadas y habilitarlo en otra etapa.

Estado: código preparado para revisión y publicación con pagos bloqueados. La publicación definitiva requiere verificar rutas/reglas reales, configuración de artefactos y contrato de pedidos en el entorno autorizado. No se ha demostrado una compra productiva de extremo a extremo.
