# Compatibilidad del frontend con el backend actualizado

## Resultado e implementación

El frontend reconoce PAYMENT_REVIEW en validadores, resumen de home y las tres páginas de retorno.
Muestra pago en revisión sin confirmar compra, limpiar el carrito o habilitar checkout. El pedido conserva
su referencia y el contacto por WhatsApp. La actualización manual del estado sigue disponible.
No se permite comenzar otra compra desde un pedido en revisión, incluso invocando su handler directamente.

Se agrega Recuperar enlace de pago en la home para pedidos pendientes. Usa exclusivamente GET
`/api/v1/public/orders/{publicId}/checkout`. No crea una preferencia ni hace fallback a POST.
Una recuperación exitosa vuelve a consultar el pedido y exige PENDING_PAYMENT del mismo UUID antes de navegar.
La creación mantiene POST sin body, importes ni query y también verifica el estado antes de navegar.
Creación y recuperación comparten un bloqueo de solicitudes en curso por UUID, sin distinguir mayúsculas.

Se valida HTTPS, host exacto www.mercadopago.com.ar o sandbox.mercadopago.com.ar, ruta /checkout/,
sin credenciales, puerto alternativo, fragmento ni caracteres de control. Un enlace inválido conserva el bloqueo.
No se almacenan tokens ni URLs de checkout. Se usa fetch sin credenciales y con cache no-store.

Las respuestas tardías al abandonar la página no redirigen. Un éxito ilegible, fallo de red o timeout no
autoriza otra creación. Si el almacenamiento falla, el bloqueo se mantiene en memoria durante esa carga;
la protección durable entre sesiones/dispositivos corresponde al backend actualizado.

## Matriz de contrato

| Estado/código | Comportamiento |
| --- | --- |
| PENDING_PAYMENT | Consulta de estado y recuperación GET; primer POST sólo cuando no hay bloqueo y el ambiente lo permite. |
| PAID | Sin checkout. Sólo limpia el carrito si coincide con la asociación guardada para ese pedido. |
| CANCELLED | Sin checkout; carrito conservado. |
| PAYMENT_REVIEW | Mensaje de revisión; carrito conservado; pago y nueva compra ocultos/bloqueados. |
| GET 409 CHECKOUT_NOT_STARTED | Libera el bloqueo local y consulta el pedido; ofrece primer POST manual si sigue pendiente. No crea automáticamente. |
| POST CHECKOUT_NOT_STARTED | No libera el bloqueo; sólo una respuesta autoritativa de recuperación GET puede hacerlo. |
| CHECKOUT_UNCERTAIN | Conserva bloqueo; permite nueva consulta GET manual, nunca otro POST automático. |
| CHECKOUT_REVIEW_REQUIRED | No abre enlace ni crea otra preferencia. Explica revisión y coordinación. |
| CHECKOUT_EXPIRED | No redirige ni reemplaza preferencia. Informa vencimiento y coordinación. |
| ORDER_NOT_PENDING_PAYMENT | Conserva bloqueo y vuelve a consultar el estado del pedido. |
| Otro 409 | Conserva bloqueo; no interpreta el conflicto como permiso de creación. |
| HTTP 408/5xx, red, JSON inválido, éxito inesperado | Conserva bloqueo y carrito. Recuperación manual sin fallback a creación. |
| POST 400 previo a creación | Permite corrección manual, sin reintento automático. |

El backend determina vigencia, compatibilidad, cuenta e importe. La respuesta actual no expone fecha de
vencimiento al frontend: éste confía en el GET validado y nunca reutiliza un enlace almacenado en el navegador.
Puede haber un cambio de estado entre la última consulta y la navegación; la verificación financiera del
proveedor y el webhook siguen siendo responsabilidad del backend. No se promete un único cobro por enlace.

## Home y retornos

pago-exitoso.html, pago-fallido.html y pago-pendiente.html comparten el mismo controlador.
Ni el nombre de la página ni status=approved/payment_id de query confirman una compra.
PAYMENT_REVIEW detiene el polling automático; Actualizar estado permite consultar de nuevo.
Un cambio de PAID a revisión no limpia un carrito nuevo ni recrea uno que ya se limpió cuando estuvo pagado.

El enlace Ver mi carrito y pedido conserva external_reference hacia la home. La home valida un único UUID
de query y consulta su resumen incluso sin sessionStorage. Una query inválida o duplicada no se usa como referencia nueva.
La referencia es un enlace privado; no se agregan datos personales a la URL ni al almacenamiento.
La política de envío se conserva: correo se cotiza y paga por separado, fuera del total de productos.

## Producción y restricciones

js/config.js conserva mercadoPagoEnabled=false en www.lumenpaper.com.ar y lumenpaper.com.ar.
La bandera se aplica a botones, handlers y API, tanto para POST como para recuperación GET.
Catálogo y consulta de pedidos siguen disponibles. No se modificó el backend ni credenciales.
No se hicieron pedidos o pagos reales, solicitudes a producción, commits, push ni despliegues en Amplify.
Se preservaron los cambios locales anteriores del proyecto.

## Pruebas

Resultado final: **96 pruebas ejecutadas, 96 exitosas, 0 fallos y 0 omitidas**, frente a las 53 pruebas
originales verificadas al comenzar. Se agregaron 43 casos. Los cuatro scripts modificados también pasan
`node --check`, y `git diff --check` no encontró errores de espacios.

Ejecutar toda la suite con Node, sin dependencias externas:

```powershell
node --test tests/backend-contract.test.cjs tests/frontend-readiness.test.cjs tests/order-return.test.cjs tests/production-config.test.cjs
```

Las pruebas simulan fetch, DOM, almacenamiento y navegación. Cubren recuperación por GET, bloqueo de conflictos,
doble clic, concurrencia GET/POST, respuestas inciertas, URLs maliciosas, producción deshabilitada,
reembolsos/revisión, preservación del carrito, referencias compartidas y las tres páginas de retorno.
No certifican un pago real ni la configuración efectiva del hosting/proveedor.

## Archivos modificados en esta etapa

- `js/api.js`
- `js/orders.js`
- `js/order-return.js`
- `js/main.js`
- `index.html`
- `pago-exitoso.html`
- `pago-fallido.html`
- `pago-pendiente.html`
- `css/styles.css`
- `tests/backend-contract.test.cjs` (nuevo)
- `tests/frontend-readiness.test.cjs`
- `tests/order-return.test.cjs`
- `tests/production-config.test.cjs`
- `README.md`
- `docs/produccion.md`
- `docs/compatibilidad-backend.md` (nuevo)

## Riesgos y verificación pendiente

1. Coordinar la publicación con el backend que incorpora V8/V9, PAYMENT_REVIEW y recuperación GET.
   No se verificó que ese artefacto ya esté desplegado ni se modificó Lightsail.
2. Probar en staging autorizado el circuito completo con cuentas de prueba: preferencia, retorno, webhook,
   aprobación, pendiente, revisión, vencimiento y respuesta incierta. Mantener pagos reales deshabilitados.
3. Verificar que las reglas de Amplify preserven query y sirvan cada retorno real, además de CSP/TLS/caché;
   no se aplicó ninguna regla ni se realizó un despliegue en esta tarea.
4. La creación de pedidos sigue sin idempotencia por intención de compra entre dispositivos. Si no llega
   public_id tras un POST incierto, el frontend no puede recuperar ese pedido sin conciliación operativa.
5. La recuperación valida y reutiliza una preferencia; no resuelve automáticamente preferencias múltiples,
   históricos sin enlace recuperable, reembolsos ni contracargos. Requieren el procedimiento del backend.
