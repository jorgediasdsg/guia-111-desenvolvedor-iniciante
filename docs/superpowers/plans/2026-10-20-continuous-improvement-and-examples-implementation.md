# Continuous Improvement and Examples Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Atualizar o manifesto com fallback de reprovação do QA, memória de issue, relatório de melhoria contínua e aplicações guiadas para os 111 conceitos.

**Architecture:** O conteúdo permanece data-driven em `assets/js/content.js`, gerado por `scripts/build_content.mjs`. A landing page recebe blocos novos renderizados por `assets/js/app.js`, enquanto os slides recebem um resumo do novo loop. CSS cria o ramo de fallback, o ledger da issue, os relatórios e os exemplos copiáveis sem dependências externas.

**Tech Stack:** HTML, CSS, JavaScript ES modules, clipboard API com fallback, Node.js para geração e checagem.

**Spec:** `docs/superpowers/specs/2026-10-20-continuous-improvement-and-examples-design.md`

## Global Constraints

- A reprovação do QA retorna para a especificação e exige nova passagem pelo harness.
- Toda etapa deixa um comentário na issue.
- O arquivamento só acontece depois do relatório de melhoria contínua.
- Cada conceito deve ter uma aplicação guiada; snippets devem ser copiáveis quando aplicável.
- O espaço de testes deve ser finito e coerente, com rigor proporcional ao risco.
- A referência ao Refactoring.Guru deve ser editorial, não uma cópia de conteúdo protegido.

## Review Focus

- QA reprovado: o caminho visual e textual deve retornar para a spec.
- Segunda tentativa: o ledger deve registrar tentativa, evidência e próxima ação.
- Testes multi-tenant: o exemplo deve mostrar separação de rigor sem sugerir infinitos inputs.
- Clipboard indisponível: o botão deve continuar entregando o texto ao usuário.
- Conceito sem snippet específico: a aplicação guiada deve continuar útil via passo a passo.

---

### Task 1: Dados do ciclo e aplicações dos conceitos

**Files:**
- Modify: `scripts/build_content.mjs`
- Modify: `assets/js/content.js`

**Interfaces:**
- Produces: `workflowStages`, `issueCommentTemplate`, `improvementAgents`, `harnessArtifacts`, `didacticTemplate`, `concept.application`.

- [x] **Step 1: Add the fallback and improvement data**

  Add explicit `qa-rejected`, `spec-rework`, `continuous-improvement` data plus issue comments and four specialized improvement agents.

- [x] **Step 2: Add applications to all 111 concepts**

  Provide `purpose`, `problem`, `solution`, `example`, `steps`, `tradeoffs`, `related`, and a code snippet for selected concepts; all concepts must have at least three steps.

- [x] **Step 3: Verify data coverage**

  Run `node scripts/build_content.mjs` and `node scripts/check_site.mjs`; expect 111 concepts, 12+ workflow nodes, four agents and no missing applications.

### Task 2: Landing page loop and issue memory

**Files:**
- Modify: `index.html`
- Modify: `assets/js/app.js`
- Modify: `assets/css/styles.css`

**Interfaces:**
- Consumes: data produced by Task 1.
- Produces: visible fallback branch, issue comment ledger, improvement report, harness artifacts and concept application panels.

- [x] **Step 1: Add semantic sections and anchors**

  Add `#issue-memory`, `#continuous-improvement`, `#harness-artifacts` and `#didactic-model` around the main workflow and concept library.

- [x] **Step 2: Render the fallback and improvement sections**

  Show the QA rejection path, stage comments, agent report cards, priority/owner fields and commit-ready follow-up actions.

- [x] **Step 3: Render concept applications and copy controls**

  Add a disclosure panel per concept with the didactic headings, steps, trade-offs and a copy button for code/Markdown.

- [x] **Step 4: Add clipboard behavior**

  Use `navigator.clipboard.writeText` when available and a textarea fallback otherwise; provide visible copied/error feedback.

### Task 3: Presentation and manifesto copy

**Files:**
- Modify: `apresentacao.html`
- Modify: `assets/js/presentation.js`
- Modify: `README.md`

**Interfaces:**
- Consumes: new page anchors and workflow language.
- Produces: slide for fallback/learning loop and documentation for the manifesto lifecycle.

- [x] **Step 1: Add the fallback slide**

  Explain QA rejection, re-specification, comments in the issue and continuous improvement without obscuring delivery.

- [x] **Step 2: Link the slide to the landing page**

  Add a deep link to `#continuous-improvement` and update deck count/progress.

- [x] **Step 3: Update README**

  Document the issue ledger, report and bounded testing principles.

### Task 4: Verification and publication

**Files:**
- Modify: `scripts/check_site.mjs`

- [x] **Step 1: Extend static checks**

  Assert the new anchors, the fallback stage, four agents, 111 applications, copy buttons and seven presentation slides.

- [x] **Step 2: Run JavaScript and repository checks**

  Run `node --check` on all modules and `git diff --check`.

- [x] **Step 3: Commit, push and verify GitHub Pages**

  Push `main`, wait for Pages deployment, fetch the public URL with HTTP 200 and open it in the Codex panel.
