// Reproducible API upload bundle for environments without a local Wrangler token.
// Normal CLI deployments use wrangler.storefront.toml and the native ASSETS binding.
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";
const root = process.cwd();
const output = process.argv[2];
if (!output) throw new Error("Pass an output file path.");
const assets = {};
async function collect(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, item.name);
    if (item.isDirectory()) await collect(filename);
    else {
      const binary = /\.(?:png|jpe?g|webp|gif|ico|woff2?)$/i.test(filename);
      assets[
        "/" +
          path.relative(path.join(root, "dist"), filename).replaceAll("\\", "/")
      ] = {
        binary,
        content: (await readFile(filename)).toString(
          binary ? "base64" : "utf8",
        ),
      };
    }
  }
}
await collect(path.join(root, "dist"));
const source = `import handler from ${JSON.stringify(path.join(root, "src/worker/storefront.ts"))};
const assets=${JSON.stringify(assets)};
function asset(request){const path=new URL(request.url).pathname;const name=Object.hasOwn(assets,path)?path:path.startsWith('/assets/')?null:'/index.html';if(!name)return new Response('Not found',{status:404});const record=assets[name];const types={js:'application/javascript',css:'text/css',svg:'image/svg+xml',json:'application/json',html:'text/html',webp:'image/webp',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',gif:'image/gif',ico:'image/x-icon',woff:'font/woff',woff2:'font/woff2'};const type=types[name.split('.').pop()]||'application/octet-stream';const body=request.method==='HEAD'?null:record.binary?Uint8Array.from(atob(record.content),c=>c.charCodeAt(0)):record.content;return new Response(body,{headers:{'Content-Type':type+(record.binary?'':'; charset=utf-8'),'Cache-Control':name.startsWith('/assets/')?'public, max-age=31536000, immutable':'no-cache','X-Content-Type-Options':'nosniff'}});}
export default { fetch(request,env) {return handler.fetch(request,{...env,ASSETS:{fetch:asset}});} };`;
const result = await build({
  stdin: { contents: source, resolveDir: root },
  bundle: true,
  format: "esm",
  minify: true,
  write: false,
  platform: "browser",
  target: "es2022",
});
await writeFile(output, result.outputFiles[0].text);
console.log(
  "Built storefront upload bundle:",
  result.outputFiles[0].text.length,
  "bytes",
);
