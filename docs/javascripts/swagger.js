// Initialises Swagger UI on pages that include a #swagger-ui element.
document.addEventListener("DOMContentLoaded", function () {
  if (!document.getElementById("swagger-ui")) return;
  if (typeof SwaggerUIBundle === "undefined") return;

  SwaggerUIBundle({
    url: "https://core.agoraai.tech/openapi.json",
    dom_id: "#swagger-ui",
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
    plugins: [SwaggerUIBundle.plugins.DownloadUrl],
    layout: "BaseLayout",
    tryItOutEnabled: true,
  });
});
