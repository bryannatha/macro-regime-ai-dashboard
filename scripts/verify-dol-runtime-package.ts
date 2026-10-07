import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const tracePath = resolve(process.cwd(), ".next/server/app/api/market-data/route.js.nft.json");
const trace = JSON.parse(readFileSync(tracePath, "utf8")) as { files: string[] };
const files = trace.files.map((file) => file.replaceAll("\\", "/"));

assert(
  files.some((file) => file.endsWith("node_modules/pdfjs-dist/legacy/build/pdf.mjs")),
  "The market-data route trace must include the externalized PDF.js runtime.",
);
assert(
  files.some((file) => file.includes("node_modules/@napi-rs/canvas/")),
  "The market-data route trace must include @napi-rs/canvas.",
);
assert(
  files.some((file) => /node_modules\/@napi-rs\/canvas-[^/]+\/.+\.node$/.test(file)),
  "The market-data route trace must include a platform-specific @napi-rs/canvas native binding.",
);

console.log("DOL runtime package trace includes PDF.js, @napi-rs/canvas, and a native binding.");
