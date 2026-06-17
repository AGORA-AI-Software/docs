// Initialises Swagger UI on pages that include a #swagger-ui element.
// Filters the loaded spec to only show the production server on the public docs site.
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
    // Strip dev/localhost servers — public docs always target production.
    responseInterceptor: function (response) {
      if (response.url && /openapi\.json/.test(response.url)) {
        try {
          var spec = JSON.parse(response.text);
          spec.servers = [
            { url: "https://core.agoraai.tech/api/v1", description: "Production" },
          ];
          response.text = JSON.stringify(spec);
          response.body = spec;
        } catch (e) {}
      }
      return response;
    },
  });
});
