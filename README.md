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
- Fluxo de trabalho: demanda, issue, especificação de negócio, especificação técnica, esforço cognitivo, escolha de IA, implementação, pipeline, homologação, QA, merge request, PO e produção.
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

## Publicação

O workflow `.github/workflows/pages.yml` publica a raiz do repositório no GitHub Pages a cada push na branch `main`.
