# Refactoring.Guru Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar na landing page um catálogo navegável de patterns, SOLID, Clean Code, code smells e técnicas de refactoring com fonte explícita.

**Architecture:** O conteúdo editorial ficará em `scripts/build_content.mjs` e será gerado para `assets/js/content.js`. A landing page continuará estática e data-driven: `assets/js/app.js` renderizará cards expansíveis, busca e filtros; `index.html` fornecerá as âncoras; `styles.css` dará forma visual ao catálogo sem imagens externas.

**Tech Stack:** HTML, CSS, JavaScript ES modules, Node.js para geração e checks estáticos.

**Spec:** `docs/superpowers/specs/2026-10-20-refactoring-guru-catalog-design.md`

## Global Constraints

- Manter os termos técnicos em inglês e a glosa em português quando houver.
- Usar resumos e exemplos próprios; apontar para a fonte oficial em cada item.
- Não incluir cópia integral de texto, pseudocódigo ou ilustrações protegidas.
- Preservar a navegação, busca, filtros e deploy estático já existentes.
- Todo pattern, principle, smell e technique deve ter origem e referência bibliográfica.

## Review Focus

- Cobertura: exatamente 22 patterns, cinco princípios SOLID e todos os grupos de smells/techniques previstos.
- Links: cada item deve apontar para Refactoring.Guru ou para a página de catálogo correspondente.
- UX: cards expansíveis não podem deixar o catálogo ilegível em mobile.
- Busca: termos de pattern, família e aplicação devem ser encontrados sem recarregar a página.
- Licenciamento: nenhuma imagem ou bloco textual do site de referência deve ser copiado integralmente.

---

### Task 1: Contrato editorial e teste RED

**Files:**
- Modify: `scripts/check_site.mjs`

**Interfaces:**
- Consumes: HTML e `content.js` existentes.
- Produces: checks para os novos anchors, catálogos e links de origem.

- [x] **Step 1: Estender o check com os critérios novos**

  Assertar `refactoring-catalog`, `solid-principles`, `clean-code-principles` e `refactoring-smells`; exigir 22 patterns, 5 princípios SOLID, itens de Clean Code, smells, techniques, código de Factory/Singleton e URLs `refactoring.guru`.

- [x] **Step 2: Rodar o check e observar RED**

  Run: `node scripts/check_site.mjs`

  Expected: falha porque os anchors e catálogos ainda não existem.

### Task 2: Dados completos do catálogo

**Files:**
- Modify: `scripts/build_content.mjs`
- Modify: `assets/js/content.js` (gerado)

**Interfaces:**
- Produces: `patternCatalog`, `solidPrinciples`, `cleanCodePrinciples`, `refactoringSmells`, `refactoringTechniques`, `refactoringSources`.

- [x] **Step 1: Adicionar fontes e o catálogo de 22 patterns**

  Incluir as três famílias e campos editoriais próprios. Factory Method e Singleton terão snippets copiáveis; os demais terão checklist ou exemplo curto.

- [x] **Step 2: Adicionar SOLID, Clean Code, smells e techniques**

  Usar categorias do catálogo oficial, sem copiar texto. Cada registro terá link da fonte e referência bibliográfica.

- [x] **Step 3: Gerar os dados e validar cobertura**

  Run: `node scripts/build_content.mjs`

  Expected: `content.js` exporta os novos arrays sem perder os 111 conceitos.

### Task 3: Landing page e interação

**Files:**
- Modify: `index.html`
- Modify: `assets/js/app.js`
- Modify: `assets/css/styles.css`

**Interfaces:**
- Consumes: os catálogos de Task 2.
- Produces: cards expansíveis, filtros, busca e links profundos.

- [x] **Step 1: Adicionar anchors e seções na landing page**

  Colocar o catálogo após arquitetura e antes da melhoria contínua, com links para `#refactoring-catalog`, `#solid-principles`, `#clean-code-principles` e `#refactoring-smells`.

- [x] **Step 2: Tornar os cards de arquitetura clicáveis**

  Renderizar `details` com resumo e link para a seção correspondente; SOLID e Clean Code devem abrir seus princípios no próprio fluxo.

- [x] **Step 3: Renderizar o catálogo navegável**

  Implementar busca por texto e filtro por família, mais cartões expansíveis com fonte, bibliografia e copy button.

- [x] **Step 4: Ajustar responsividade**

  Garantir duas colunas em tablet, uma coluna em mobile e blocos de código com rolagem horizontal segura.

### Task 4: Verificação e publicação

**Files:**
- Modify: `README.md`

- [x] **Step 1: Executar checks de geração, sintaxe e diff**

  Run: `node scripts/check_site.mjs`, `node --check assets/js/app.js`, `node --check assets/js/content.js`, `node --check assets/js/presentation.js`, `git diff --check`.

- [x] **Step 2: Verificar servido localmente**

  Servir a raiz e confirmar HTTP 200, anchors, quantidade de patterns e links profundos no HTML entregue.

- [x] **Step 3: Commit, push e confirmar GitHub Pages**

  Publicar em `main`, esperar o workflow e confirmar HTTP 200 no endereço público.
