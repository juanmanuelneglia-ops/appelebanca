const https = require("https");
const fs = require("fs");
const path = require("path");

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Accept: "*/*",
            Referer: "https://www.ebanca.com/",
          },
        },
        (res) => {
          if (
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            const next = res.headers.location.startsWith("http")
              ? res.headers.location
              : new URL(res.headers.location, url).href;
            return get(next).then(resolve).catch(reject);
          }
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () =>
            resolve({
              status: res.statusCode,
              headers: res.headers,
              body: Buffer.concat(chunks),
            }),
          );
        },
      )
      .on("error", reject);
  });
}

(async () => {
  const cssUrl = "https://www.ebanca.com/css/index.DuXujU-P.css";
  const css = (await get(cssUrl)).body.toString("utf8");
  const urls = [
    ...css.matchAll(/url\(([^)]+)\)/g),
  ]
    .map((m) => m[1].replace(/["']/g, "").trim())
    .filter((u) => /\.(png|jpe?g|webp|gif|svg)/i.test(u));

  const unique = [...new Set(urls)];
  const interesting = unique.filter((u) =>
    /login|welcome|banner|hero|external|persona|bg|slider|right|woman|mujer/i.test(
      u,
    ),
  );
  console.log("total assets", unique.length);
  console.log("interesting", interesting.length);
  interesting.slice(0, 50).forEach((u) => console.log(u));
  console.log("--- sample ---");
  unique
    .filter((u) => /\.(jpe?g|webp|png)/i.test(u))
    .slice(0, 60)
    .forEach((u) => console.log(u));

  // also scan JS bundle for image paths
  const jsUrl = "https://www.ebanca.com/static/js/index.BY6mRyXo.js";
  const js = (await get(jsUrl)).body.toString("utf8");
  const jsImgs = [
    ...js.matchAll(/["']([^"']+\.(?:png|jpe?g|webp))["']/gi),
  ].map((m) => m[1]);
  const jsUnique = [...new Set(jsImgs)].filter((u) =>
    /login|welcome|banner|hero|external|persona|bg|slider|woman|mujer|right/i.test(
      u,
    ),
  );
  console.log("--- js interesting ---");
  jsUnique.slice(0, 40).forEach((u) => console.log(u));

  // broader jpg search in js
  const allJpg = [...new Set(jsImgs)].filter((u) =>
    /\.(jpe?g|webp)$/i.test(u),
  );
  console.log("--- js jpg/webp count", allJpg.length);
  allJpg.slice(0, 80).forEach((u) => console.log(u));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
