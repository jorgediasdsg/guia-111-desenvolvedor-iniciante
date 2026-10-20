import fs from "node:fs";
import path from "node:path";

const sourcePath = process.env.GUIA_PDF_TEXT || "/tmp/guia-111.txt";

function readSource() {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Arquivo de texto do PDF não encontrado: ${sourcePath}`);
  }
  return fs.readFileSync(sourcePath, "utf8");
}

function clean(value) {
  return value
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
}

function parseBlocks(text) {
  const lines = text.split(/\r?\n/);
  const starts = [];
  lines.forEach((line, index) => {
    const match = line.match(/^\s{2}(\d{1,3})\.\s+(.+)$/);
    if (match && Number(match[1]) >= 1 && Number(match[1]) <= 111) {
      starts.push({ index, number: Number(match[1]), title: clean(match[2]) });
    }
  });

  const sequenceStart = starts.findIndex((entry, index) => {
    if (entry.number !== 1) return false;
    return Array.from({ length: 111 }, (_, offset) => starts[index + offset]?.number).every(
      (number, offset) => number === offset + 1,
    );
  });
  if (sequenceStart < 0) throw new Error("Não encontrei a sequência principal de 1 a 111");
  const mainStarts = starts.slice(sequenceStart, sequenceStart + 111);

  return mainStarts.map((entry, index) => {
    const next = mainStarts[index + 1];
    const block = lines.slice(entry.index, next ? next.index : lines.length).join("\n");
    const levelMatch = block.match(/\n\s{2}(BASE|CRESCIMENTO|AVANÇADO)\s*\n/);
    const level = levelMatch?.[1] || "BASE";
    const extract = (label, nextLabels) => {
      const boundary = nextLabels.join("|");
      const expression = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n\\s{0,4}(?:${boundary}):|$)`);
      const match = block.match(expression);
      return match ? clean(match[1]) : "";
    };
    return {
      number: entry.number,
      sourceTitle: entry.title,
      level,
      what: extract("O que é", ["Problema", "Exemplo", "Prática recomendada"]),
      problem: extract("Problema", ["Exemplo", "Prática recomendada"]),
      example: extract("Exemplo", ["Prática recomendada"]),
      practice: extract("Prática recomendada", []),
    };
  });
}

export function parsePdfConcepts(text = readSource()) {
  const concepts = parseBlocks(text);
  if (concepts.length !== 111) {
    throw new Error(`Esperados 111 conceitos, encontrados ${concepts.length}`);
  }
  const numbers = concepts.map((concept) => concept.number);
  if (new Set(numbers).size !== 111 || numbers.some((number, index) => number !== index + 1)) {
    throw new Error("A numeração dos conceitos não é única e sequencial");
  }
  const missing = concepts.filter((concept) => Object.values(concept).some((value) => value === ""));
  if (missing.length) {
    throw new Error(`Campos ausentes nos conceitos: ${missing.map((concept) => concept.number).join(", ")}`);
  }
  return concepts;
}

if (process.argv.includes("--check")) {
  const concepts = parsePdfConcepts();
  console.log(`OK: ${concepts.length} conceitos estruturados a partir de ${path.basename(sourcePath)}`);
  console.log(JSON.stringify(concepts.slice(0, 2), null, 2));
}
