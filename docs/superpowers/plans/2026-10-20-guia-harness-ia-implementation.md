# Guia 111 + Harness de Desenvolvimento com IA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar uma landing page estática e uma apresentação HTML interligadas, com os 111 conceitos do PDF, bibliografia por item e um fluxo completo de desenvolvimento com IA.

**Architecture:** Dados editoriais ficam separados da camada de renderização em JavaScript puro. `index.html` funciona como consulta longa com busca e filtros; `apresentacao.html` funciona como narrativa curta e links para hashes da landing page. GitHub Pages publica os arquivos estáticos por GitHub Actions.

**Tech Stack:** HTML semântico, CSS responsivo, JavaScript ES modules, Node.js apenas para scripts de preparação/verificação, GitHub Pages via Actions.

**Spec:** `docs/superpowers/specs/2026-10-20-guia-harness-ia-design.md`

## Global Constraints

- Os termos técnicos devem aparecer em inglês, com a glosa em português quando útil.
- O PDF anexado é a fonte dos 111 itens e da estrutura de cada explicação.
- Cada conceito precisa apresentar bibliografia relacionada.
- A landing page e a apresentação devem ser estáticas e funcionar em GitHub Pages.
- A apresentação precisa apontar para seções aprofundadas da landing page.
- O fluxo deve mostrar issue, especificações, esforço cognitivo, seleção de IA, pipeline, homologação, QA, PO e produção.

## Review Focus

- Busca por termo em inglês e em português: deve localizar o mesmo conceito.
- Hash profundo para um item: deve rolar até a entrada e destacá-la.
- Entrada com travessão, sigla ou termo composto: deve manter título e resumo legíveis.
- Layout estreito: os diagramas e a grade de conceitos devem continuar utilizáveis no celular.
- GitHub Pages em subpath: recursos relativos não podem quebrar ao publicar no repositório.

---

### Task 1: Estrutura editorial e dados

**Files:**
- Create: `assets/js/content.js`
- Create: `scripts/parse_pdf.mjs`

**Interfaces:**
- Produces: `concepts`, `references`, `workflowStages`, `presentationSlides`.

- [ ] **Step 1: Parse the PDF text into 111 structured concept records**

  Preserve `number`, `sourceTitle`, `level`, `what`, `problem`, `example`, and `practice` from the PDF.

- [ ] **Step 2: Add English literature terms and bibliography metadata**

  Every record receives `term`, `gloss`, `keywords`, and one or more reference ids.

- [ ] **Step 3: Verify the data shape**

  Run `node scripts/parse_pdf.mjs --check` and expect exactly 111 concepts, unique numbers from 1 through 111, and at least one reference per concept.

### Task 2: Landing page

**Files:**
- Create: `index.html`
- Create: `assets/css/styles.css`
- Create: `assets/js/app.js`
- Create: `404.html`

**Interfaces:**
- Consumes: `assets/js/content.js`.
- Produces: searchable, filterable, deep-linkable landing page.

- [ ] **Step 1: Build semantic page sections**

  Add hero, method statement, cycle workflow, architecture/quality context, concept library, bibliography and presentation CTA.

- [ ] **Step 2: Implement rendering and search**

  Render all concepts from data, filter by block/level, search title/gloss/body/keywords, and honor hash navigation.

- [ ] **Step 3: Add responsive visual system**

  Apply the JorgeResolve-inspired palette and typography, with accessible focus styles and no dependency on external assets.

### Task 3: Presentation

**Files:**
- Create: `apresentacao.html`

**Interfaces:**
- Consumes: `assets/js/content.js` and `assets/css/styles.css`.
- Produces: six-slide HTML presentation with keyboard and button navigation.

- [ ] **Step 1: Create the six-slide narrative**

  Cover the 111 concepts, architecture and quality, issue enrichment, model routing, delivery pipeline, and the single-cycle promise.

- [ ] **Step 2: Link slides to the landing page**

  Each slide gets at least one deep link such as `index.html#workflow` or `index.html#concept-1`.

- [ ] **Step 3: Validate presentation navigation**

  Run `node --check` on its inline module or use browser smoke checks for previous/next controls and hash links.

### Task 4: GitHub Pages delivery

**Files:**
- Create: `.github/workflows/pages.yml`
- Create: `README.md`
- Create: `.nojekyll`

**Interfaces:**
- Consumes: static site files.
- Produces: public GitHub repository and Pages URL.

- [ ] **Step 1: Add the Pages workflow**

  Upload the repository root as the Pages artifact and deploy it through the official Pages actions.

- [ ] **Step 2: Verify locally**

  Run `node --check assets/js/app.js`, `node --check assets/js/content.js`, and a static HTML smoke test.

- [ ] **Step 3: Push and enable Pages**

  Create the public GitHub repository, push `main`, enable workflow-based Pages, wait for the deployment, and verify the public URL.
