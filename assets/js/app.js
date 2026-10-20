import { content } from "./content.js";

const $ = (selector) => document.querySelector(selector);
const referenceById = new Map(content.references.map(([id, label, url]) => [id, { id, label, url }]));

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function normalize(value = "") {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function renderWorkflow() {
  $("#workflow-track").innerHTML = content.workflowStages.map((stage) => `
    <article class="workflow-step" id="workflow-${escapeHtml(stage.id)}">
      <div class="workflow-step-head"><span class="step-index">${escapeHtml(stage.index)}</span></div>
      <h3>${escapeHtml(stage.label)}</h3>
      <p>${escapeHtml(stage.summary)}</p>
      <div class="step-meta"><span>${escapeHtml(stage.actor)}</span><span>${escapeHtml(stage.artifact)}</span><span>${escapeHtml(stage.branch)}</span></div>
    </article>
  `).join("");
  $("#issue-ledger").innerHTML = content.issueCommentTemplate.map((comment, index) => `
    <div class="ledger-row">
      <span class="ledger-index">${String(index + 1).padStart(2, "0")}</span>
      <div><b>${escapeHtml(comment.role)}</b><p>${escapeHtml(comment.template)}</p></div>
    </div>
  `).join("");
}

function renderRouting() {
  $("#effort-grid").innerHTML = content.effortLevels.map((effort) => `
    <article class="effort-card">
      <small>${escapeHtml(effort.label)}</small>
      <h3>${escapeHtml(effort.title)}</h3>
      <p>${escapeHtml(effort.description)}</p>
      <span class="effort-route">${escapeHtml(effort.route)}</span>
    </article>
  `).join("");
  $("#model-strip").innerHTML = content.modelOptions.map((model) => `<span class="model-chip" title="${escapeHtml(model.role)}">${escapeHtml(model.name)}</span>`).join("");
}

function renderArchitecture() {
  $("#architecture-grid").innerHTML = content.architectureTracks.map((track) => {
    const refs = track.refs.map((refId) => {
      const ref = referenceById.get(refId);
      return `<a href="#ref-${escapeHtml(ref.id)}">${escapeHtml(ref.id)}</a>`;
    }).join("");
    const details = track.details?.length ? `<details class="architecture-details"><summary>abrir orientação <span>＋</span></summary><div>${track.details.map((detail) => `<div class="architecture-detail"><b>${escapeHtml(detail.name)}</b><p>${escapeHtml(detail.body)}</p></div>`).join("")}</div></details>` : "";
    const deepLink = track.deepLink ? `<a class="text-link" href="${escapeHtml(track.deepLink)}">abrir catálogo ↗</a>` : "";
    return `<article class="architecture-card"><div class="section-kicker">${escapeHtml(track.eyebrow)}</div><h3>${escapeHtml(track.title)}</h3><p>${escapeHtml(track.body)}</p>${details}<div class="card-refs">${refs}</div>${deepLink}</article>`;
  }).join("");
}

function renderRefactoringSources() {
  $("#refactoring-sources").innerHTML = content.refactoringSources.map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer"><span>${escapeHtml(source.label)}</span><b>fonte ↗</b></a>`).join("");
}

function themeSlug(value = "") {
  return normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function renderThemeAccordion({ id, label, count, description, contentHtml, className = "" }) {
  return `<details class="theme-accordion ${escapeHtml(className)}" id="${escapeHtml(id)}">
    <summary>
      <span class="theme-accordion-mark" aria-hidden="true">＋</span>
      <span class="theme-accordion-copy"><b>${escapeHtml(label)}</b><small>${escapeHtml(count)} · ${escapeHtml(description)}</small></span>
      <span class="theme-accordion-action">abrir tema</span>
    </summary>
    <div class="theme-accordion-content">${contentHtml}</div>
  </details>`;
}

function bindThemeAccordions() {
  document.querySelectorAll("[data-accordion-group]").forEach((container) => {
    [...container.children].filter((child) => child.classList.contains("theme-accordion")).forEach((accordion) => {
      if (accordion.dataset.accordionBound) return;
      accordion.dataset.accordionBound = "true";
      accordion.addEventListener("toggle", () => {
        if (!accordion.open) return;
        [...container.children]
          .filter((child) => child !== accordion && child.classList.contains("theme-accordion") && child.open)
          .forEach((other) => { other.open = false; });
      });
    });
  });
}

const patternThemes = [
  { id: "creational", label: "Criacionais", description: "criar objetos sem espalhar dependências" },
  { id: "structural", label: "Estruturais", description: "compor estruturas flexíveis" },
  { id: "behavioral", label: "Comportamentais", description: "distribuir algoritmos e responsabilidades" },
];

const smellThemeDescriptions = {
  "Bloaters": "estruturas que cresceram além do necessário",
  "Object-Orientation Abusers": "herança e encapsulamento usados fora do contexto",
  "Change Preventers": "mudanças que espalham impacto pelo sistema",
  "Dispensables": "elementos que já não pagam seu custo",
  "Couplers": "acoplamentos que dificultam a evolução",
  "Other Smells": "sinais que pedem investigação contextual",
};

const techniqueThemeDescriptions = {
  "Composing Methods": "tornar a intenção local e legível",
  "Moving Features between Objects": "reposicionar responsabilidades",
  "Organizing Data": "dar uma forma melhor aos dados",
  "Simplifying Conditional Expressions": "reduzir ramificações e duplicação",
  "Simplifying Method Calls": "melhorar a conversa entre objetos",
  "Dealing with Generalization": "ajustar hierarquia e abstração",
};

function renderPatterns() {
  const query = $("#pattern-search").value.trim();
  const family = $("#pattern-filter").value;
  const filter = $("#pattern-filter");
  if (!filter.dataset.ready) {
    const options = [...new Map(content.patternCatalog.map((pattern) => [pattern.category, pattern.categoryLabel]))];
    filter.insertAdjacentHTML("beforeend", options.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join(""));
    filter.dataset.ready = "true";
  }
  const visible = content.patternCatalog.filter((pattern) => {
    const matchesQuery = !query || normalize([pattern.name, pattern.categoryLabel, pattern.summary, pattern.problem, pattern.solution, pattern.example, pattern.applicability].join(" ")).includes(normalize(query));
    return matchesQuery && (family === "all" || pattern.category === family);
  });
  const patternCard = (pattern) => `
    <article class="pattern-card" id="pattern-${escapeHtml(pattern.id)}" data-pattern-id="${escapeHtml(pattern.id)}">
      <div class="pattern-card-head"><span class="pattern-category">${escapeHtml(pattern.categoryLabel)}</span><a href="${escapeHtml(pattern.sourceUrl)}" target="_blank" rel="noreferrer">Refactoring.Guru ↗</a></div>
      <h3>${escapeHtml(pattern.name)}</h3>
      <p class="pattern-summary">${escapeHtml(pattern.summary)}</p>
      <details class="pattern-details"><summary>abrir orientação <small>${pattern.code.includes("# ") ? "checklist copiável" : "código copiável"}</small></summary>
        <div class="pattern-detail-grid">
          <div class="pattern-copy"><div class="copy-block"><b>Purpose</b><p>${escapeHtml(pattern.purpose)}</p></div><div class="copy-block"><b>Problem</b><p>${escapeHtml(pattern.problem)}</p></div><div class="copy-block"><b>Solution</b><p>${escapeHtml(pattern.solution)}</p></div><div class="copy-block"><b>Structure</b><p>${escapeHtml(pattern.structure)}</p></div><div class="copy-block"><b>Example</b><p>${escapeHtml(pattern.example)}</p></div><div class="copy-block"><b>Applicability</b><p>${escapeHtml(pattern.applicability)}</p></div><div class="copy-block"><b>Implementation</b><p>${escapeHtml(pattern.implementation)}</p></div><div class="copy-block"><b>Benefits</b><p>${escapeHtml(pattern.benefits)}</p></div><div class="copy-block"><b>Trade-offs</b><p>${escapeHtml(pattern.tradeoffs)}</p></div><div class="copy-block"><b>Relations</b><p>${escapeHtml(pattern.relations)}</p></div></div>
          <div class="pattern-code"><div class="code-toolbar"><span>${escapeHtml(pattern.title)}</span><button class="copy-button" type="button" data-copy-pattern="${escapeHtml(pattern.id)}">copiar</button></div><pre><code>${escapeHtml(pattern.code)}</code></pre><div class="pattern-source"><a href="${escapeHtml(pattern.sourceUrl)}" target="_blank" rel="noreferrer">ler a orientação original ↗</a><span>refs: ${referenceInlineLinks(pattern.refs)}</span></div></div>
        </div>
      </details>
    </article>
  `;
  const themeAccordions = patternThemes.map((theme) => {
    const items = visible.filter((pattern) => pattern.category === theme.id);
    if (!items.length) return "";
    return renderThemeAccordion({
      id: `pattern-theme-${theme.id}`,
      label: theme.label,
      count: `${items.length} ${items.length === 1 ? "pattern" : "patterns"}`,
      description: theme.description,
      contentHtml: `<div class="pattern-theme-grid">${items.map(patternCard).join("")}</div>`,
      className: "pattern-theme",
    });
  }).join("");
  $("#pattern-list").innerHTML = themeAccordions || `<p class="catalog-empty">Nenhum pattern encontrado.</p>`;
  $("#pattern-count").textContent = `${visible.length} ${visible.length === 1 ? "pattern" : "patterns"}`;
  bindThemeAccordions();
  bindCopyButtons();
}

function renderPrinciples() {
  const solidCards = content.solidPrinciples.map((principle) => `
    <article class="principle-card solid-card"><div class="principle-mark">${escapeHtml(principle.acronym)}</div><div class="pattern-card-head"><span class="pattern-category">SOLID</span><a href="${escapeHtml(principle.sourceUrl)}" target="_blank" rel="noreferrer">fonte ↗</a></div><h3>${escapeHtml(principle.name)}</h3><p>${escapeHtml(principle.summary)}</p><details class="pattern-details"><summary>abrir princípio <small>problema · regra · exemplo</small></summary><div class="principle-detail"><div class="copy-block"><b>Problem</b><p>${escapeHtml(principle.problem)}</p></div><div class="copy-block"><b>Rule</b><p>${escapeHtml(principle.rule)}</p></div><div class="copy-block"><b>Example</b><p>${escapeHtml(principle.example)}</p></div><div class="copy-block"><b>Trade-offs</b><p>${escapeHtml(principle.tradeoffs)}</p></div><div class="pattern-source"><span>refs: ${referenceInlineLinks(principle.refs)}</span></div></div></details></article>
  `).join("");
  const cleanCodeCards = content.cleanCodePrinciples.map((principle) => `
    <article class="principle-card clean-card"><div class="pattern-card-head"><span class="pattern-category">CLEAN CODE</span><a href="${escapeHtml(principle.sourceUrl)}" target="_blank" rel="noreferrer">fonte ↗</a></div><h3>${escapeHtml(principle.name)}</h3><p>${escapeHtml(principle.summary)}</p><details class="pattern-details"><summary>abrir princípio <small>exemplo · limite</small></summary><div class="principle-detail"><div class="copy-block"><b>Example</b><p>${escapeHtml(principle.example)}</p></div><div class="copy-block"><b>Trade-offs</b><p>${escapeHtml(principle.tradeoffs)}</p></div><div class="pattern-source"><span>refs: ${referenceInlineLinks(principle.refs)}</span></div></div></details></article>
  `).join("");
  $("#solid-grid").innerHTML = renderThemeAccordion({
    id: "principles-solid-theme",
    label: "SOLID",
    count: `${content.solidPrinciples.length} principles`,
    description: "um contrato para orientar fronteiras e substituição",
    contentHtml: `<div class="principle-grid">${solidCards}</div>`,
    className: "principle-theme solid-theme",
  });
  $("#clean-code-grid").innerHTML = renderThemeAccordion({
    id: "principles-clean-code-theme",
    label: "Clean Code",
    count: `${content.cleanCodePrinciples.length} principles`,
    description: "clareza, intenção e mudança proporcional ao risco",
    contentHtml: `<div class="principle-grid">${cleanCodeCards}</div>`,
    className: "principle-theme clean-code-theme",
  });
  bindThemeAccordions();
}

function renderRefactoringCatalog() {
  const query = $("#refactoring-search").value.trim();
  const group = $("#refactoring-filter").value;
  const filter = $("#refactoring-filter");
  if (!filter.dataset.ready) {
    const groups = [...new Set([...content.refactoringSmells, ...content.refactoringTechniques].map((item) => item.group))];
    filter.insertAdjacentHTML("beforeend", groups.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join(""));
    filter.dataset.ready = "true";
  }
  const matches = (item) => (!query || normalize([item.name, item.group, item.symptom, item.response].join(" ")).includes(normalize(query))) && (group === "all" || item.group === group);
  const smells = content.refactoringSmells.filter(matches);
  const techniques = content.refactoringTechniques.filter(matches);
  const smellGroups = [...new Set(smells.map((smell) => smell.group))];
  const techniqueGroups = [...new Set(techniques.map((technique) => technique.group))];
  const smellAccordions = smellGroups.map((theme) => {
    const items = smells.filter((smell) => smell.group === theme);
    const itemsHtml = items.map((smell) => `<article class="catalog-item smell-item"><span class="branch-label">${escapeHtml(smell.group)}</span><h3>${escapeHtml(smell.name)}</h3><p>${escapeHtml(smell.symptom)}</p><details><summary>resposta sugerida <small>abrir</small></summary><p>${escapeHtml(smell.response)}</p><a href="${escapeHtml(smell.sourceUrl)}" target="_blank" rel="noreferrer">fonte e catálogo ↗</a></details></article>`).join("");
    return renderThemeAccordion({
      id: `smell-theme-${themeSlug(theme)}`,
      label: theme,
      count: `${items.length} ${items.length === 1 ? "smell" : "smells"}`,
      description: smellThemeDescriptions[theme] || "sinais para investigar",
      contentHtml: `<div class="smell-theme-grid">${itemsHtml}</div>`,
      className: "refactoring-theme smell-theme",
    });
  }).join("");
  const techniqueAccordions = techniqueGroups.map((theme) => {
    const items = techniques.filter((technique) => technique.group === theme);
    const itemsHtml = items.map((technique) => `<details class="technique-item"><summary><span>${escapeHtml(technique.name)}</span><small>${escapeHtml(technique.group)}</small></summary><p>${escapeHtml(technique.symptom)}</p><p>${escapeHtml(technique.response)}</p><a href="${escapeHtml(technique.sourceUrl)}" target="_blank" rel="noreferrer">fonte e catálogo ↗</a></details>`).join("");
    return renderThemeAccordion({
      id: `technique-theme-${themeSlug(theme)}`,
      label: theme,
      count: `${items.length} ${items.length === 1 ? "technique" : "techniques"}`,
      description: techniqueThemeDescriptions[theme] || "uma mudança pequena e verificável",
      contentHtml: `<div class="technique-theme-list">${itemsHtml}</div>`,
      className: "refactoring-theme technique-theme",
    });
  }).join("");
  $("#smell-list").innerHTML = smellAccordions || `<p class="catalog-empty">Nenhum code smell encontrado.</p>`;
  $("#technique-list").innerHTML = techniqueAccordions || `<p class="catalog-empty">Nenhuma technique encontrada.</p>`;
  $("#refactoring-count").textContent = `${smells.length} smells · ${techniques.length} techniques`;
  bindThemeAccordions();
}

function renderImprovement() {
  $("#improvement-grid").innerHTML = content.improvementAgents.map((agent, index) => `
    <article class="improvement-card">
      <div class="agent-number">0${index + 1}</div>
      <div class="branch-label">${escapeHtml(agent.owner)}</div>
      <h3>${escapeHtml(agent.label)}</h3>
      <p>${escapeHtml(agent.focus)}</p>
      <span class="improvement-output">→ ${escapeHtml(agent.output)}</span>
    </article>
  `).join("");
  $("#report-preview").innerHTML = `
    <div><span class="branch-label">ISSUE IMPROVEMENT REPORT</span><h3>Pronto para virar ação.</h3><p>O relatório não é uma ata. Ele termina com uma sugestão de mudança pequena, um owner e uma evidência de que o fluxo ficará melhor na próxima issue.</p></div>
    <div class="report-fields"><span><b>evidência</b> tentativas, tempo, falhas</span><span><b>impacto</b> produto, QA, harness ou arquitetura</span><span><b>próxima ação</b> issue, ADR ou commit</span></div>
  `;
}

function renderHarnessArtifacts() {
  $("#artifact-grid").innerHTML = content.harnessArtifacts.map((artifact) => `
    <article class="artifact-card">
      <div class="artifact-head"><span class="branch-label">${escapeHtml(artifact.format)}</span><button class="copy-button" type="button" data-copy-artifact="${escapeHtml(artifact.id)}">copiar</button></div>
      <h3>${escapeHtml(artifact.label)}</h3>
      <p>${escapeHtml(artifact.description)}</p>
      <pre><code>${escapeHtml(artifact.copyText)}</code></pre>
    </article>
  `).join("");
}

function renderDidacticModel() {
  $("#didactic-steps").innerHTML = content.didacticTemplate.map((item, index) => `
    <div class="didactic-step"><span>${String(index + 1).padStart(2, "0")}</span><div><b>${escapeHtml(item.label)}</b><p>${escapeHtml(item.description)}</p></div></div>
  `).join("");
}

function conceptMatches(concept, query, block, level) {
  const matchesQuery = !query || normalize([
    concept.term, concept.gloss, concept.sourceTitle, concept.what, concept.problem, concept.example, concept.practice, concept.keywords,
  ].join(" ")).includes(normalize(query));
  return matchesQuery && (block === "all" || concept.block === block) && (level === "all" || concept.level === level);
}

function referenceLinks(refIds) {
  return refIds.map((refId) => {
    const ref = referenceById.get(refId);
    return `<li><a href="${escapeHtml(ref.url)}" target="_blank" rel="noreferrer">${escapeHtml(ref.label)}</a></li>`;
  }).join("");
}

function referenceInlineLinks(refIds) {
  return refIds.map((refId) => {
    const ref = referenceById.get(refId);
    return `<a href="#ref-${escapeHtml(ref.id)}">${escapeHtml(ref.id)}</a>`;
  }).join(" · ");
}

function renderConcepts() {
  const query = $("#concept-search").value.trim();
  const block = $("#block-filter").value;
  const level = $("#level-filter").value;
  const visible = content.concepts.filter((concept) => conceptMatches(concept, query, block, level));
  $("#concept-list").innerHTML = visible.map((concept) => `
    <article class="concept-card" id="concept-${concept.number}" data-number="${concept.number}">
      <div class="concept-number">${String(concept.number).padStart(3, "0")}</div>
      <div class="concept-title">
        <h3>${escapeHtml(concept.term)}</h3>
        <p class="concept-gloss">${escapeHtml(concept.gloss)}</p>
        <span class="level-pill" data-level="${escapeHtml(concept.level)}">${escapeHtml(concept.level)}</span>
        <p class="concept-source">PDF: ${escapeHtml(concept.sourceTitle)} · ${escapeHtml(concept.block)} / ${escapeHtml(concept.blockTitle)}</p>
      </div>
      <div class="concept-copy">
        <div class="copy-block"><b>O que é</b><p>${escapeHtml(concept.what)}</p></div>
        <div class="copy-block"><b>Problema</b><p>${escapeHtml(concept.problem)}</p></div>
        <div class="copy-block"><b>Exemplo</b><p>${escapeHtml(concept.example)}</p></div>
        <div class="copy-block"><b>Prática recomendada</b><p>${escapeHtml(concept.practice)}</p></div>
      </div>
      <details class="concept-application">
        <summary><span>Aplicação guiada</span><small>${concept.application.hasSpecificCode ? "snippet copiável" : "checklist copiável"} · abrir</small></summary>
        <div class="application-grid">
          <div class="application-copy">
            <div class="copy-block"><b>Purpose</b><p>${escapeHtml(concept.application.didactic.purpose)}</p></div>
            <div class="copy-block"><b>Problem</b><p>${escapeHtml(concept.application.didactic.problem)}</p></div>
            <div class="copy-block"><b>Solution</b><p>${escapeHtml(concept.application.didactic.solution)}</p></div>
            <div class="copy-block"><b>Structure</b><p>${escapeHtml(concept.application.didactic.structure)}</p></div>
            <div class="copy-block"><b>Example</b><p>${escapeHtml(concept.application.didactic.example)}</p></div>
            <div class="copy-block"><b>Applicability</b><p>${escapeHtml(concept.application.didactic.applicability)}</p></div>
            <div class="copy-block"><b>Implementation</b><p>${escapeHtml(concept.application.didactic.implementation)}</p></div>
            <div class="copy-block"><b>Benefits</b><p>${escapeHtml(concept.application.didactic.benefits)}</p></div>
            <div class="copy-block"><b>Trade-offs</b><p>${escapeHtml(concept.application.didactic.tradeoffs)}</p></div>
            <div class="copy-block"><b>Anti-refactoring</b><p>${escapeHtml(concept.application.didactic.antiRefactoring)}</p></div>
          </div>
          <div class="application-code">
            <div class="code-toolbar"><span>${escapeHtml(concept.application.title)}</span><button class="copy-button" type="button" data-copy-concept="${concept.number}">copiar</button></div>
            <pre><code>${escapeHtml(concept.application.code)}</code></pre>
          </div>
          <div class="application-steps"><b>How to apply</b><ol>${concept.application.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol></div>
          <div class="application-related"><b>Related</b><p>${concept.application.related.map((related) => `<a href="#concept-${related.number}">${escapeHtml(related.term)}</a>`).join(" · ")}</p></div>
        </div>
      </details>
      <div class="concept-refs"><b>Bibliografia</b><ol>${referenceLinks(concept.refs)}</ol></div>
    </article>
  `).join("");
  $("#result-count").textContent = `${visible.length} ${visible.length === 1 ? "conceito" : "conceitos"}`;
  $("#empty-state").hidden = visible.length > 0;
  bindCopyButtons();
}

function renderBlocks() {
  const blocks = [...new Map(content.concepts.map((concept) => [concept.block, concept.blockTitle])).entries()];
  $("#block-filter").insertAdjacentHTML("beforeend", blocks.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(value)} · ${escapeHtml(label)}</option>`).join(""));
}

function renderReferences() {
  $("#reference-list").innerHTML = content.references.map(([id, label, url], index) => `
    <article class="reference-item" id="ref-${escapeHtml(id)}">
      <div class="reference-id">${String(index + 1).padStart(2, "0")} · ${escapeHtml(id)}</div>
      <a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)} ↗</a>
    </article>
  `).join("");
}

async function copyText(text, button) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    const original = button.textContent;
    button.textContent = "copiado";
    button.classList.add("is-copied");
    window.setTimeout(() => { button.textContent = original; button.classList.remove("is-copied"); }, 1600);
  } catch {
    button.textContent = "selecione o bloco";
    window.setTimeout(() => { button.textContent = "copiar"; }, 1800);
  }
}

function bindCopyButtons() {
  document.querySelectorAll("[data-copy-concept]").forEach((button) => {
    if (button.dataset.copyBound) return;
    button.dataset.copyBound = "true";
    button.addEventListener("click", () => {
      const concept = content.concepts.find((item) => item.number === Number(button.dataset.copyConcept));
      if (concept) copyText(concept.application.code, button);
    });
  });
  document.querySelectorAll("[data-copy-artifact]").forEach((button) => {
    if (button.dataset.copyBound) return;
    button.dataset.copyBound = "true";
    button.addEventListener("click", () => {
      const artifact = content.harnessArtifacts.find((item) => item.id === button.dataset.copyArtifact);
      if (artifact) copyText(artifact.copyText, button);
    });
  });
  document.querySelectorAll("[data-copy-pattern]").forEach((button) => {
    if (button.dataset.copyBound) return;
    button.dataset.copyBound = "true";
    button.addEventListener("click", () => {
      const pattern = content.patternCatalog.find((item) => item.id === button.dataset.copyPattern);
      if (pattern) copyText(pattern.code, button);
    });
  });
}

async function renderMermaid() {
  const nodes = [...document.querySelectorAll(".mermaid")];
  if (!nodes.length) return;
  try {
    const module = await import("https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs");
    const mermaid = module.default;
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      securityLevel: "strict",
      themeVariables: {
        primaryColor: "#eef6ff",
        primaryTextColor: "#07152e",
        primaryBorderColor: "#0b5cff",
        lineColor: "#0b5cff",
        secondaryColor: "#fff4db",
        tertiaryColor: "#f9edff",
        fontFamily: "Inter, sans-serif",
      },
    });
    await mermaid.run({ nodes });
  } catch (error) {
    nodes.forEach((node) => node.classList.add("mermaid-fallback"));
  }
}

function focusHashTarget() {
  const id = window.location.hash.slice(1);
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  if (target.classList.contains("concept-card")) {
    document.querySelectorAll(".concept-card.is-target").forEach((card) => card.classList.remove("is-target"));
    target.classList.add("is-target");
  }
  const parentAccordion = target.closest(".theme-accordion");
  if (parentAccordion) parentAccordion.open = true;
  window.setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
}

renderBlocks();
renderWorkflow();
renderRouting();
renderArchitecture();
renderRefactoringSources();
renderPatterns();
renderPrinciples();
renderRefactoringCatalog();
renderImprovement();
renderHarnessArtifacts();
renderDidacticModel();
renderConcepts();
renderReferences();
bindCopyButtons();
void renderMermaid();

$("#concept-search").addEventListener("input", renderConcepts);
$("#block-filter").addEventListener("change", renderConcepts);
$("#level-filter").addEventListener("change", renderConcepts);
$("#pattern-search").addEventListener("input", renderPatterns);
$("#pattern-filter").addEventListener("change", renderPatterns);
$("#refactoring-search").addEventListener("input", renderRefactoringCatalog);
$("#refactoring-filter").addEventListener("change", renderRefactoringCatalog);
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
    event.preventDefault();
    $("#concept-search").focus();
  }
});
window.addEventListener("hashchange", focusHashTarget);
focusHashTarget();
