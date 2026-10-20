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
      <div class="concept-refs"><b>Bibliografia</b><ol>${referenceLinks(concept.refs)}</ol></div>
    </article>
  `).join("");
  $("#result-count").textContent = `${visible.length} ${visible.length === 1 ? "conceito" : "conceitos"}`;
  $("#empty-state").hidden = visible.length > 0;
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
renderConcepts();
renderReferences();

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
