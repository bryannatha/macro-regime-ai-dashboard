import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, relative, resolve } from "node:path";

const tracePath = resolve(process.cwd(), ".next/server/app/api/market-data/route.js.nft.json");
const trace = JSON.parse(readFileSync(tracePath, "utf8")) as { files: string[] };
const files = new Set(trace.files.map((file) => resolve(dirname(tracePath), file)));
const runtimeRequire = createRequire(resolve(process.cwd(), "package.json"));
const pdfPath = runtimeRequire.resolve("pdfjs-dist/legacy/build/pdf.mjs");
const requiredAssets = [
  pdfPath,
  resolve(dirname(pdfPath), "pdf.worker.mjs"),
  runtimeRequire.resolve("@napi-rs/canvas"),
];

for (const asset of requiredAssets) {
  assert(files.has(asset), `The market-data route trace must include ${relative(process.cwd(), asset)}.`);
}

// Load canvas so the check requires this platform's working binding, not an arbitrary .node file.
runtimeRequire("@napi-rs/canvas");
const nativeBindings = Object.keys(runtimeRequire.cache).filter((file) =>
  file.replaceAll("\\", "/").includes("/node_modules/@napi-rs/canvas") && file.endsWith(".node"),
);
assert(nativeBindings.length > 0, "Canvas must load a native binding for the build platform.");
for (const binding of nativeBindings) {
  assert(files.has(binding), `The market-data route trace must include ${relative(process.cwd(), binding)}.`);
}

console.log("DOL runtime assets verified:");
for (const asset of [...requiredAssets, ...nativeBindings]) {
  console.log(relative(process.cwd(), asset));
}
