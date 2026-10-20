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
  $("#architecture-grid").innerHTML = content.architectureTracks.map((track) => `
    <article class="architecture-card">
      <div class="section-kicker">${escapeHtml(track.eyebrow)}</div>
      <h3>${escapeHtml(track.title)}</h3>
      <p>${escapeHtml(track.body)}</p>
      <div class="card-refs">${track.refs.map((refId) => {
        const ref = referenceById.get(refId);
        return `<a href="#ref-${escapeHtml(ref.id)}">${escapeHtml(ref.id)}</a>`;
      }).join("")}</div>
    </article>
  `).join("");
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
  window.setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
}

renderBlocks();
renderWorkflow();
renderRouting();
renderArchitecture();
renderImprovement();
renderHarnessArtifacts();
renderDidacticModel();
renderConcepts();
renderReferences();
bindCopyButtons();

$("#concept-search").addEventListener("input", renderConcepts);
$("#block-filter").addEventListener("change", renderConcepts);
$("#level-filter").addEventListener("change", renderConcepts);
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
    event.preventDefault();
    $("#concept-search").focus();
  }
});
window.addEventListener("hashchange", focusHashTarget);
focusHashTarget();
