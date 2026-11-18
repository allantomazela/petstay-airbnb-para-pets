#!/usr/bin/env node
/**
 * Gera docs/PETSTAY-Apresentacao.html a partir de docs/PETSTAY-Documentacao.md
 * Fonte única de verdade: o Markdown. Rode: pnpm docs:build
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { marked } from 'marked'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const docsDir = join(root, 'docs')
const mdPath = join(docsDir, 'PETSTAY-Documentacao.md')
const outHtml = join(docsDir, 'PETSTAY-Apresentacao.html')
const outPdf = join(docsDir, 'PETSTAY-Apresentacao.pdf')
const shellPath = join(docsDir, 'templates', 'apresentacao-shell.html')
const cssPath = join(docsDir, 'templates', 'apresentacao.css')

const args = new Set(process.argv.slice(2))
const wantPdf = args.has('--pdf') || args.has('--all')

function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function preprocessMarkdown(md) {
  // Remove o bloco Sumário do MD (o shell já injeta TOC navegável)
  let text = md.replace(
    /\n## Sumário\n[\s\S]*?(?=\n---\n\n## )/m,
    '\n',
  )

  // Diagramas mermaid → bloco de texto legível no HTML/PDF
  text = text.replace(/```mermaid\n([\s\S]*?)```/g, (_, body) => {
    const cleaned = body.trim().replace(/^flowchart.*\n/m, '').trim()
    return `\n\`\`\`\n${cleaned}\n\`\`\`\n`
  })

  return text
}

function configureMarked() {
  const renderer = new marked.Renderer()

  renderer.heading = function heading({ text, depth }) {
    const plain = text.replace(/<[^>]+>/g, '')
    const id = slugify(plain)
    return `<h${depth} id="${id}">${text}</h${depth}>\n`
  }

  renderer.image = function image({ href, title, text }) {
    const src = href || ''
    const alt = text || ''
    const titleAttr = title ? ` title="${title}"` : ''
    return `<img src="${src}" alt="${alt}"${titleAttr} loading="lazy" />`
  }

  marked.setOptions({
    renderer,
    gfm: true,
    breaks: false,
  })
}

function buildToc(md) {
  const items = []
  for (const line of md.split('\n')) {
    const match = /^(#{2})\s+(.+)$/.exec(line)
    if (!match) continue
    const text = match[2].replace(/[*_`]/g, '').trim()
    if (/^sumário$/i.test(text)) continue
    items.push(`<li><a href="#${slugify(text)}">${text}</a></li>`)
  }
  return `<ol>\n${items.join('\n')}\n</ol>`
}

function formatGeneratedAt(date = new Date()) {
  return date.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

function buildHtml() {
  if (!existsSync(mdPath)) {
    throw new Error(`Markdown não encontrado: ${mdPath}`)
  }

  configureMarked()

  const rawMd = readFileSync(mdPath, 'utf8')
  const md = preprocessMarkdown(rawMd)
  const content = marked.parse(md)
  const toc = buildToc(rawMd)
  const styles = readFileSync(cssPath, 'utf8')
  const shell = readFileSync(shellPath, 'utf8')

  const titleMatch = rawMd.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1].trim() : 'PETSTAY / Petbnb — Documentação'

  const html = shell
    .replaceAll('{{TITLE}}', title)
    .replaceAll('{{STYLES}}', styles)
    .replaceAll('{{TOC}}', toc)
    .replaceAll('{{CONTENT}}', content)
    .replaceAll('{{GENERATED_AT}}', formatGeneratedAt())

  writeFileSync(outHtml, html, 'utf8')
  console.log(`✓ HTML gerado: ${outHtml}`)
  return outHtml
}

function findChrome() {
  const candidates = [
    join(process.env['PROGRAMFILES'] || '', 'Google/Chrome/Application/chrome.exe'),
    join(process.env['PROGRAMFILES(X86)'] || '', 'Google/Chrome/Application/chrome.exe'),
    join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
    join(process.env['PROGRAMFILES(X86)'] || '', 'Microsoft/Edge/Application/msedge.exe'),
    join(process.env['PROGRAMFILES'] || '', 'Microsoft/Edge/Application/msedge.exe'),
  ]
  return candidates.find((p) => p && existsSync(p)) || null
}

function buildPdf(htmlFile) {
  const chrome = findChrome()
  if (!chrome) {
    console.warn('⚠ Chrome/Edge não encontrado. Abra o HTML e use o botão Exportar PDF.')
    return false
  }

  const fileUrl = `file:///${htmlFile.replace(/\\/g, '/')}`
  const result = spawnSync(
    chrome,
    [
      '--headless',
      '--disable-gpu',
      '--no-pdf-header-footer',
      `--print-to-pdf=${outPdf}`,
      fileUrl,
    ],
    { encoding: 'utf8' },
  )

  if (result.status !== 0 || !existsSync(outPdf)) {
    console.warn('⚠ Falha ao gerar PDF via headless. Use o botão Exportar PDF no HTML.')
    if (result.stderr) console.warn(result.stderr)
    return false
  }

  console.log(`✓ PDF gerado: ${outPdf}`)
  return true
}

try {
  const htmlFile = buildHtml()
  if (wantPdf) buildPdf(htmlFile)
} catch (error) {
  console.error('Erro ao gerar documentação:', error.message)
  process.exit(1)
}
