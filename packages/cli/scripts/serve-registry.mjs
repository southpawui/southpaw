/* global console, process, URL */
/**
 * Serves apps/docs/public (the built registry) on a local port, for e2e tests
 * and manual testing. Prints the base URL as its first stdout line.
 *
 *   node scripts/serve-registry.mjs [port]   (port 0 or omitted = random)
 */
import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../apps/docs/public",
);

const server = createServer(async (req, res) => {
  let file;
  try {
    file = path.join(publicDir, decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname));
  } catch {
    // Malformed percent-encoding (e.g. /%E0): answer, don't crash the server.
    res.writeHead(400).end("bad request");
    return;
  }
  if (!file.startsWith(publicDir + path.sep) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404).end("not found");
    return;
  }
  res.writeHead(200, { "content-type": "application/json" }).end(await readFile(file));
});

server.listen(Number(process.argv[2] ?? 0), "127.0.0.1", () => {
  const { port } = /** @type {import("node:net").AddressInfo} */ (server.address());
  console.log(`http://127.0.0.1:${port}`);
});
