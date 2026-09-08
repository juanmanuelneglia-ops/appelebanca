const fs = require("fs");
const p =
  "C:/Users/Camil/.cursor/projects/c-Users-Camil-Documents-agricola/agent-tools/2afac354-011d-4e27-8e9c-f351bcd3680e.txt";
const css = fs.readFileSync(p, "utf8");
console.log("len", css.length);
console.log("has imagen-fondo-login", css.includes("imagen-fondo-login"));

function dump(needle, n = 3) {
  let idx = 0;
  let c = 0;
  while ((idx = css.indexOf(needle, idx)) !== -1 && c < n) {
    console.log("\n===", needle, "at", idx, "===");
    console.log(css.slice(Math.max(0, idx - 180), idx + 420));
    idx += needle.length;
    c++;
  }
}

dump("imagen-fondo-login");
dump("login-wrapper");
dump("external-wrapper .content");
dump("background-login");
dump("login-background");
dump("img-login");
