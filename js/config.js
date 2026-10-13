// Solo los orígenes conocidos pueden conectarse a la API.
const LUMEN_CONFIG = (() => {
  const { protocol, hostname } = window.location;
  const isHttp = ["http:", "https:"].includes(protocol);
  const isLocal = isHttp && ["localhost", "127.0.0.1"].includes(hostname);
  const isProduction = isHttp && ["www.lumenpaper.com.ar", "lumenpaper.com.ar"].includes(hostname);
  return Object.freeze({
    apiBaseUrl: isLocal ? "http://localhost:8080"
      : isProduction ? "https://api.lumenpaper.com.ar" : null,
    // Conserva el flujo local. Producción requiere autorización explícita para habilitar pagos.
    mercadoPagoEnabled: isLocal
  });
})();
