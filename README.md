# Factusur MCP — exemples de configuration

Configurations prêtes à copier pour utiliser le **serveur MCP distant de [Factusur](https://factusur.com/mcp)**
depuis Claude Code, Claude Desktop / claude.ai, Cursor, VS Code (Copilot), Codex et d'autres clients
compatibles. Le serveur convertit des factures (PDF, image, données structurées) en **Factur-X EN 16931**
et vérifie des fichiers Factur-X.

> Ce dépôt ne contient **aucun code serveur** : le serveur est hébergé par Factusur
> (`https://factusur.com/mcp`, transport Streamable HTTP). Rien à installer.
> Factusur n'est pas une plateforme agréée et ne transmet pas vos factures. Ce projet n'est affilié
> ni à Anthropic, ni à OpenAI, ni à Cursor, ni à Microsoft.

## Démarrage rapide

| Client | Commande ou fichier |
| --- | --- |
| Claude Code | `claude mcp add --transport http --scope user factusur https://factusur.com/mcp`, puis `/mcp` |
| Claude Desktop / claude.ai | Personnaliser › Connecteurs › « Ajouter un connecteur personnalisé » → `https://factusur.com/mcp` |
| Cursor | [`clients/cursor.mcp.json`](clients/cursor.mcp.json) dans `~/.cursor/mcp.json` |
| VS Code | [`clients/vscode.mcp.json`](clients/vscode.mcp.json) dans `.vscode/mcp.json`, ou `code --add-mcp` |
| Codex | `codex mcp add factusur --url https://factusur.com/mcp` puis `codex mcp login factusur` |
| Windsurf (Devin Desktop) | [`clients/devin-desktop.mcp_config.json`](clients/devin-desktop.mcp_config.json) |
| Gemini CLI | `gemini mcp add --transport http factusur https://factusur.com/mcp` |
| Zed | [`clients/zed.settings.json`](clients/zed.settings.json) dans `settings.json` |

Syntaxes relevées sur la documentation officielle de chaque client le 26/10/2026 ; guides détaillés :
https://factusur.com/mcp.

## Connexion

- **OAuth 2.1 (recommandé)** : votre client ouvre une page Factusur ; vous vous connectez (lien e-mail)
  et autorisez l'accès. Aucun secret à copier.
- **Clé d'accès** (scripts, CI, clients sans OAuth) : créez-la dans *Compte › Connexions MCP* ;
  envoyez-la dans l'en-tête `Authorization: Bearer fsk_live_…`. Les exemples `*.key.*` la lisent
  dans la variable d'environnement `FACTUSUR_API_KEY` — **ne commitez jamais une clé**.

## Outils

| Outil | Rôle | Décompte |
| --- | --- | --- |
| `convert_to_facturx` | facture (PDF, image, JSON) → Factur-X + rapport + lien 15 min | 1 conversion |
| `batch_convert` | jusqu'à 20 factures, tout ou rien, archive ZIP | 1 par facture |
| `update_conversion` | corriger un champ manquant | — |
| `validate_facturx` | vérifier un Factur-X reçu | — |
| `create_upload_url` | dépôt d'un fichier de plus de 3 Mo (10 Mo max) | — |
| `get_conversion`, `list_conversions`, `get_usage`, `get_invoice_template` | suivi, historique, quota, schéma | — |

Quota : celui de votre formule Factusur (3 conversions gratuites par mois). Un agent ne peut jamais
payer ni changer de formule : quand le quota est atteint, il vous montre un lien à ouvrir vous-même.

## Exemples d'invites

Voir [`prompts/exemples.md`](prompts/exemples.md).

## Script : conversion depuis la ligne de commande

[`scripts/convert-with-sdk.mjs`](scripts/convert-with-sdk.mjs) appelle `convert_to_facturx` avec le
client MCP officiel (`@modelcontextprotocol/client`) et une clé d'accès.

## Liens

- Site : https://factusur.com
- Documentation MCP : https://factusur.com/mcp
- Sécurité : https://factusur.com/securite
- Conditions d'utilisation : https://factusur.com/cgu
- Mentions légales : https://factusur.com/mentions-legales
- Contact : https://factusur.com/contact

## Licence

[MIT](LICENSE) pour les exemples de ce dépôt. Le service Factusur est soumis à ses
[conditions d'utilisation](https://factusur.com/cgu).

---

## English summary

Ready-to-copy configs for **Factusur's remote MCP server** (`https://factusur.com/mcp`, Streamable HTTP).
It converts French invoices (PDF, image, Excel/CSV data) into **Factur-X EN 16931** e-invoices
(PDF/A-3 with embedded CII XML) and validates Factur-X files. No server code here, nothing to install.

- **Auth**: OAuth 2.1 per the MCP spec (protected resource metadata, PKCE S256), or an API key sent as
  `Authorization: Bearer …` (read from `FACTUSUR_API_KEY`, never commit it).
- **Tools**: `convert_to_facturx`, `batch_convert`, `update_conversion`, `validate_facturx`,
  `create_upload_url`, `get_conversion`, `list_conversions`, `get_usage`, `get_invoice_template`.
- **Clients**: see the table above (Claude Code, Claude Desktop, Cursor, VS Code, Codex, Windsurf, Gemini CLI, Zed).
- 3 free conversions per month. An agent can never pay or change plans. Factusur is not an approved
  e-invoicing platform (PA) and does not transmit invoices. The web app is in French.
