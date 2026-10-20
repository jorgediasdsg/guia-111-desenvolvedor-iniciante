# Guia 111 + Harness de desenvolvimento com IA

Landing page navegável e apresentação curta baseadas no `Guia_111_Conceitos_Desenvolvedor_Iniciante.pdf`.

## Abrir

- Landing page: `index.html`
- Apresentação: `apresentacao.html`
- Fonte usada para os 111 conceitos: `assets/Guia_111_Conceitos_Desenvolvedor_Iniciante.pdf`

## O que está no projeto

- 111 conceitos em inglês com glosa em português, busca client-side e filtros por bloco e nível.
- Bibliografia contextual por conceito, com livros, RFCs e documentação primária.
- Trilha de arquitetura com Gangue dos Quatro, Clean Code, Clean Architecture e DDD.
- Catálogo navegável do Refactoring.Guru com 22 Design Patterns, SOLID, princípios operacionais de Clean Code, code smells e 66 refactoring techniques.
- Catálogos organizados em sanfona por tema: Criacionais, Estruturais, Comportamentais, SOLID, Clean Code, smells e grupos de refactoring techniques.
- Cada pattern segue Purpose, Problem, Solution, Structure, Example, Applicability, Implementation, Benefits, Trade-offs e Relations, com link para a fonte original.
- Fluxo de trabalho: demanda, issue, especificação de negócio, especificação técnica, esforço cognitivo, escolha de IA, implementação, pipeline, homologação, QA, merge request, PO, produção e melhoria contínua.
- Fluxo Mermaid navegável mostrando o caminho feliz, o fallback do QA para a specification e o loop de aprendizado após o `improvement report`.
- Fallback explícito: se o QA reprovar, a promoção para `main` é bloqueada, a evidência é comentada na issue, a especificação volta para revisão e a tentativa percorre o harness novamente.
- Ledger de comentários da issue: cada transição registra ator, decisão, artefato, evidência, tentativa e próxima ação.
- Antes do arquivamento, quatro agentes especializados geram um `issue improvement report` para PO, QA, harness e arquitetura, sem transformar aprendizado em bloqueio de entrega.
- Testes proporcionais ao risco: inputs bounded e coerentes, rigor ampliado para isolamento multi-tenant e mudanças sensíveis, e suíte enxuta para mudanças de baixo risco.
- Artefatos copiáveis de harness: prompt de negócio, technical specification, possível entrega em código e relatório de melhoria.
- Cada conceito abre uma aplicação guiada inspirada na didática do Refactoring.Guru: Purpose, Problem, Solution, Structure, Example, Applicability, How to apply, Implementation, Benefits, Code / checklist, Trade-offs, Anti-refactoring e Related.
- Apresentação em HTML com navegação por teclado e links profundos para a landing page.

## Rodar localmente

```bash
python3 -m http.server 4173
```

Abra `http://localhost:4173`.

## Atualizar os dados do PDF

O parser em `scripts/parse_pdf.mjs` valida a sequência 1–111. O gerador em `scripts/build_content.mjs` cria `assets/js/content.js` com a camada editorial e a bibliografia.

```bash
node scripts/parse_pdf.mjs --check
node scripts/build_content.mjs
```

## Princípio do harness

O modelo pode mudar no meio do caminho — Codex, Claude Code, Cloud Code, DeepSeek, OpenRouter ou qualquer outra LLM — desde que a issue carregue o mesmo contrato: intenção, business specification, technical specification, esforço cognitivo, testes, limites, evidências e critério de aceite. A troca de modelo não deve apagar a memória da execução.

O objetivo é um ciclo único de entrega com rastreabilidade e melhoria contínua: entregar o produto primeiro, registrar o que custou caro e transformar esse custo em uma ação pequena para a próxima issue.

## Publicação

O workflow `.github/workflows/pages.yml` publica a raiz do repositório no GitHub Pages a cada push na branch `main`.
