const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "public", "images");
fs.mkdirSync(outDir, { recursive: true });

const files = [
  { name: "logo.png", url: "https://www.bancoagricola.com/web/templates/Principalnew2/assets/img/logo.png" },
  { name: "logo-responsive.svg", url: "https://www.bancoagricola.com/web/templates/Principalnew2/assets/img/logo-responsive.svg" },
  { name: "favicon.png", url: "https://www.bancoagricola.com/web/templates/Principalnew2/assets/img/favicon-grupo.png" },
  { name: "buscador.png", url: "https://www.bancoagricola.com/web/templates/Principalnew2/assets/img/buscador.png" },
  { name: "padlock.png", url: "https://www.bancoagricola.com/multimedia/render/3198" },
  { name: "hero-mclaren.jpg", url: "https://www.bancoagricola.com/multimedia/render/12283" },
  { name: "hero-mclaren-mobile.jpg", url: "https://www.bancoagricola.com/multimedia/render/12285" },
  { name: "hero-cuenta.jpg", url: "https://www.bancoagricola.com/multimedia/render/12464" },
  { name: "hero-cuenta-mobile.jpg", url: "https://www.bancoagricola.com/multimedia/render/12463" },
  { name: "ico-banca-movil.png", url: "https://www.bancoagricola.com/multimedia/render/banca-movil-bancoagricola.png" },
  { name: "ico-gestiones.png", url: "https://www.bancoagricola.com/multimedia/render/1productos-digitales-bancoagricola.png" },
  { name: "ico-mi-casa.png", url: "https://www.bancoagricola.com/multimedia/render/1mi-casa-bancoagricola.png" },
  { name: "ico-educacion.png", url: "https://www.bancoagricola.com/multimedia/render/1educacion-financiera-bancoagricola.png" },
  { name: "ico-mapa.png", url: "https://www.bancoagricola.com/multimedia/render/1ubicaciones-bancoagricola.png" },
  { name: "ico-productos.png", url: "https://www.bancoagricola.com/multimedia/render/9058" },
  { name: "card-cuentas.jpg", url: "https://www.bancoagricola.com/multimedia/render/11029" },
  { name: "card-casa-plata.png", url: "https://www.bancoagricola.com/multimedia/render/lcp-card.png" },
  { name: "card-biblioteca.jpg", url: "https://www.bancoagricola.com/multimedia/render/9699" },
  { name: "negocios.png", url: "https://www.bancoagricola.com/multimedia/render/8541" },
  { name: "internacional.jpg", url: "https://www.bancoagricola.com/multimedia/render/10712" },
  { name: "ebanca.jpg", url: "https://www.bancoagricola.com/multimedia/render/4445" },
  { name: "promo-banner.png", url: "https://www.bancoagricola.com/multimedia/render/banner-html.png" },
  { name: "ico-chat.png", url: "https://www.bancoagricola.com/multimedia/render/4447" },
  { name: "ico-phone.png", url: "https://www.bancoagricola.com/multimedia/render/4448" },
  { name: "ico-mail.png", url: "https://www.bancoagricola.com/multimedia/render/4450" },
  { name: "ico-whatsapp.png", url: "https://www.bancoagricola.com/multimedia/render/whatsapp-icono.png" },
  { name: "ico-puntos.png", url: "https://www.bancoagricola.com/multimedia/render/puntos-de-servicios-icono.png" },
  { name: "arrow-right.png", url: "https://www.bancoagricola.com/multimedia/render/6135" },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(dest);
    const req = mod.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "image/*,*/*",
          Referer: "https://www.bancoagricola.com/personas",
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          try {
            fs.unlinkSync(dest);
          } catch {}
          const next = res.headers.location.startsWith("http")
            ? res.headers.location
            : new URL(res.headers.location, url).href;
          return download(next, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          reject(new Error(`${url} -> ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve(undefined)));
      },
    );
    req.on("error", reject);
  });
}

(async () => {
  for (const f of files) {
    const dest = path.join(outDir, f.name);
    process.stdout.write(`↓ ${f.name} ... `);
    try {
      await download(f.url, dest);
      const size = fs.statSync(dest).size;
      console.log(`${size} bytes`);
    } catch (err) {
      console.log(`FAIL ${err.message}`);
    }
  }
  console.log("done");
})();
