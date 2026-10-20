import fs from "node:fs";
import path from "node:path";
import { content } from "../assets/js/content.js";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const requiredFiles = ["index.html", "apresentacao.html", "assets/css/styles.css", "assets/js/app.js", "assets/js/content.js", "assets/js/presentation.js", "assets/Guia_111_Conceitos_Desenvolvedor_Iniciante.pdf", ".github/workflows/pages.yml"];
const missingFiles = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missingFiles.length) throw new Error(`Arquivos ausentes: ${missingFiles.join(", ")}`);

const index = read("index.html");
const presentation = read("apresentacao.html");
const expectedIds = ["workflow", "workflow-track", "model-routing", "architecture", "library", "references"];
const missingIds = expectedIds.filter((id) => !index.includes(`id="${id}"`));
if (missingIds.length) throw new Error(`Âncoras ausentes: ${missingIds.join(", ")}`);

const slideCount = (presentation.match(/class="slide(?:\s|\")/g) || []).length;
if (slideCount !== 6) throw new Error(`Esperados 6 slides, encontrados ${slideCount}`);
if (content.concepts.length !== 111) throw new Error(`Esperados 111 conceitos, encontrados ${content.concepts.length}`);
if (content.concepts.some((concept) => !concept.term || !concept.gloss || !concept.refs?.length)) throw new Error("Conceito sem termo, glosa ou bibliografia");
if (content.workflowStages.length !== 12) throw new Error("Fluxo incompleto");
if (!["issue", "model", "production"].every((id) => content.workflowStages.some((stage) => stage.id === id))) throw new Error("Âncoras profundas do fluxo incompletas");
if (content.concepts[0].term !== "rate limit" || content.concepts[0].gloss !== "limite de requisições") throw new Error("Termo rate limit não está no formato solicitado");

console.log(`OK: ${requiredFiles.length} arquivos, ${content.concepts.length} conceitos, ${content.references.length} referências e ${slideCount} slides`);
