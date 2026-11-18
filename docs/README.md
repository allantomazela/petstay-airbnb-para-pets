# Documentação PETSTAY

## Fonte única

Edite apenas:

- [`PETSTAY-Documentacao.md`](./PETSTAY-Documentacao.md)

Depois regenere os artefatos:

```bash
pnpm docs:build   # gera PETSTAY-Apresentacao.html
pnpm docs:pdf     # gera HTML + PETSTAY-Apresentacao.pdf
```

## Arquivos

| Arquivo | Papel |
|---------|--------|
| `PETSTAY-Documentacao.md` | Fonte de verdade (editar) |
| `PETSTAY-Apresentacao.html` | Gerado — abrir no browser / compartilhar |
| `PETSTAY-Apresentacao.pdf` | Gerado (opcional) |
| `screenshots/` | Capturas das telas referenciadas no MD |
| `templates/` | Shell + CSS da apresentação |
| `../scripts/generate-docs.mjs` | Gerador MD → HTML/PDF |

## Compartilhar com a equipe

1. Rode `pnpm docs:build`.
2. Envie a pasta `docs/` **ou** abra o HTML → botão **Exportar PDF**.
3. Na impressão, ative **Gráficos de segundo plano**.

Não edite o HTML à mão — ele será sobrescrito no próximo `docs:build`.
