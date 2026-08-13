import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Gabrovo study interface", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Габрово Улици и Маршрути<\/title>/i);
  assert.match(html, /Такси изпит Габрово/);
  assert.match(html, /Учи улици, обекти и маршрути/);
  assert.match(html, /Mapbox карта/);
  assert.match(html, /Интерактивна Mapbox карта/);
  assert.match(html, /Маркер адрес/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("uses the live Mapbox map instead of embedded static map images", async () => {
  const [page, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /from "mapbox-gl"/);
  assert.match(page, /new mapboxgl\.Map/);
  assert.match(page, /new mapboxgl\.Marker/);
  assert.match(css, /mapbox-gl\/dist\/mapbox-gl\.css/);
  assert.match(packageJson, /"mapbox-gl"/);
  assert.doesNotMatch(page, /openstreetmap\.org\/export|\/static\/\$\{markerOverlay\}/);
  assert.doesNotMatch(page, /<iframe|<img/);
});
