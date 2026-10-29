// Convertit une facture PDF en Factur-X via le serveur MCP de Factusur, avec le client MCP officiel.
// Usage : FACTUSUR_API_KEY=fsk_live_… node scripts/convert-with-sdk.mjs facture.pdf
// Prérequis : npm install @modelcontextprotocol/client
import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { randomUUID } from "node:crypto";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";

const [file] = process.argv.slice(2);
const key = process.env.FACTUSUR_API_KEY;
if (!file || !key) {
  console.error("Usage : FACTUSUR_API_KEY=fsk_live_… node scripts/convert-with-sdk.mjs facture.pdf");
  process.exit(1);
}

const client = new Client({ name: "factusur-example", version: "1.0.0" });
await client.connect(
  new StreamableHTTPClientTransport(new URL("https://factusur.com/mcp"), {
    requestInit: { headers: { Authorization: `Bearer ${key}` } },
  }),
);

const result = await client.callTool({
  name: "convert_to_facturx",
  arguments: {
    source: { type: "file", file_name: basename(file), content_base64: (await readFile(file)).toString("base64") },
    accept_terms: true, // acceptation des CGU de Factusur (https://factusur.com/cgu)
    idempotency_key: randomUUID().replace(/-/g, ""),
  },
});

const data = result.structuredContent ?? {};
if (result.isError) {
  console.error(data.error?.message ?? "Erreur");
  process.exit(2);
}
console.log(data.message);
for (const c of data.conversions ?? []) console.log(c.status, c.downloads?.facturx ?? "");
await client.close();
