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
    else
      assets[
        "/" +
          path.relative(path.join(root, "dist"), filename).replaceAll("\\", "/")
      ] = await readFile(filename, "utf8");
  }
}
await collect(path.join(root, "dist"));
const source = `import handler from ${JSON.stringify(path.join(root, "src/worker/storefront.ts"))};
const assets=${JSON.stringify(assets)};
function asset(request){const path=new URL(request.url).pathname;const name=Object.hasOwn(assets,path)?path:path.startsWith('/assets/')?null:'/index.html';if(!name)return new Response('Not found',{status:404});const type=name.endsWith('.js')?'application/javascript':name.endsWith('.css')?'text/css':name.endsWith('.svg')?'image/svg+xml':name.endsWith('.json')?'application/json':'text/html';return new Response(request.method==='HEAD'?null:assets[name],{headers:{'Content-Type':type+'; charset=utf-8','Cache-Control':name.startsWith('/assets/')?'public, max-age=31536000, immutable':'no-cache','X-Content-Type-Options':'nosniff'}});}
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
