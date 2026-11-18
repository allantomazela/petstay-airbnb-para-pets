# PETSTAY / Petbnb

Marketplace de hospedagem e daycare para pets — tutores encontram anfitriões verificados, reservam com Instant Book, acompanham a estadia por chat e diário de bordo, e avaliam em modelo *double-blind*.

## Stack

- React 19 · Vite 8 · TypeScript
- Tailwind CSS · Shadcn UI / Radix
- React Router 7 · Zod · Recharts

## Pré-requisitos

- Node.js 18+
- pnpm (recomendado)

## Instalação e desenvolvimento

```bash
pnpm install
pnpm start
```

Aplicação em [http://localhost:8080](http://localhost:8080).

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm start` / `pnpm dev` | Servidor de desenvolvimento |
| `pnpm run build` | Build de produção (`dist/`) |
| `pnpm run preview` | Preview da build |
| `pnpm run lint` | Oxlint |
| `pnpm run format` | Oxfmt |

## Documentação

**Fonte única:** [`docs/PETSTAY-Documentacao.md`](docs/PETSTAY-Documentacao.md)

| Artefato | Arquivo |
|----------|---------|
| Apresentação HTML | [`docs/PETSTAY-Apresentacao.html`](docs/PETSTAY-Apresentacao.html) |
| PDF (opcional) | `docs/PETSTAY-Apresentacao.pdf` |
| Screenshots | `docs/screenshots/` |

```bash
pnpm docs:build   # MD → HTML (com botão Exportar PDF)
pnpm docs:pdf     # MD → HTML + PDF via Chrome/Edge
```

Fluxo: edite o Markdown → `pnpm docs:build` → abra o HTML → **Exportar PDF** (ou use `pnpm docs:pdf`).

## Status

**Fase 0 — Protótipo navegável:** SPA com dados mock em memória. Sem backend, auth real ou gateway de pagamento. Ver roadmap nas fases 1–4 na documentação.
