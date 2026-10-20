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
const app = read("assets/js/app.js");
const expectedIds = ["workflow", "workflow-track", "issue-memory", "continuous-improvement", "harness-artifacts", "didactic-model", "model-routing", "architecture", "library", "references"];
const missingIds = expectedIds.filter((id) => !index.includes(`id="${id}"`));
if (missingIds.length) throw new Error(`Âncoras ausentes: ${missingIds.join(", ")}`);

const slideCount = (presentation.match(/class="slide(?:\s|\")/g) || []).length;
if (slideCount !== 7) throw new Error(`Esperados 7 slides, encontrados ${slideCount}`);
if (content.concepts.length !== 111) throw new Error(`Esperados 111 conceitos, encontrados ${content.concepts.length}`);
if (content.concepts.some((concept) => !concept.term || !concept.gloss || !concept.refs?.length)) throw new Error("Conceito sem termo, glosa ou bibliografia");
if (content.workflowStages.length < 13) throw new Error("Fluxo incompleto: falta o caminho de melhoria contínua");
if (!["issue", "model", "production"].every((id) => content.workflowStages.some((stage) => stage.id === id))) throw new Error("Âncoras profundas do fluxo incompletas");
if (!content.workflowBranches?.some((stage) => stage.id === "qa-rejected" && stage.returnTo === "technical-spec")) throw new Error("Fallback do QA não retorna para a especificação técnica");
if (!content.issueCommentTemplate?.length) throw new Error("Ledger de comentários da issue ausente");
if (!content.issueCommentTemplate.some((comment) => comment.stage === "spec-rework")) throw new Error("Ledger sem comentário de reespecificação");
if (content.improvementAgents?.length !== 4) throw new Error("Esperados quatro agentes de melhoria contínua");
const didacticFields = ["purpose", "problem", "solution", "structure", "example", "applicability", "how", "implementation", "benefits", "code", "tradeoffs", "antiRefactoring", "related"];
if (content.concepts.some((concept) => !concept.application?.steps?.length || didacticFields.some((field) => !concept.application?.didactic?.[field]))) throw new Error("Conceito sem aplicação guiada completa");
if (!content.harnessArtifacts?.length || !content.didacticTemplate?.length) throw new Error("Artefatos do harness ou estrutura didática ausentes");
if (!app.includes("data-copy-concept") || !app.includes("data-copy-artifact")) throw new Error("Controles de cópia ausentes");
if (!presentation.includes("#continuous-improvement")) throw new Error("Slide de melhoria contínua sem link profundo");
if (content.concepts[0].term !== "rate limit" || content.concepts[0].gloss !== "limite de requisições") throw new Error("Termo rate limit não está no formato solicitado");

console.log(`OK: ${requiredFiles.length} arquivos, ${content.concepts.length} conceitos, ${content.references.length} referências e ${slideCount} slides`);
