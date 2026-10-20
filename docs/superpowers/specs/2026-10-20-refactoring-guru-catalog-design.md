# Catálogo Refactoring.Guru na fonte de verdade

## Intenção

Transformar a área de arquitetura da landing page em uma biblioteca navegável de decisão: quando surgir um problema de design, a pessoa encontra o conceito, lê uma explicação curta, vê um exemplo ou checklist, consulta a literatura e abre a fonte original.

## Escopo

- Catálogo dos 22 Design Patterns clássicos, agrupados em criacionais, estruturais e comportamentais.
- SOLID com os cinco princípios em cartões expansíveis.
- Clean Code com princípios práticos, relacionados a `Clean Code`, `Refactoring` e `Clean Architecture`.
- Code smells agrupados por família.
- Catálogo das técnicas de refactoring agrupadas por intenção.
- Estrutura didática por item: propósito, problema, solução, estrutura, exemplo, aplicabilidade, implementação, benefícios, trade-offs, relações e fonte.
- Links profundos para as páginas oficiais do Refactoring.Guru e referências bibliográficas já usadas no guia.
- Busca e filtro client-side para patterns, princípios, smells e técnicas.

## Regra de autoria e fonte

O site usará explicações editoriais próprias e exemplos originais. A página do Refactoring.Guru será apresentada como fonte de consulta, com link por item e referência bibliográfica global. Não serão reproduzidos integralmente textos, pseudocódigos ou ilustrações proprietárias.

## Experiência

1. A área `Arquitetura e qualidade` mostra cards expansíveis para Gangue dos Quatro, SOLID, Clean Code, Clean Architecture e qualidade.
2. O card de Design Patterns aponta para um catálogo dedicado com 22 padrões.
3. O catálogo possui seletor de família e busca por nome, problema ou aplicação.
4. Cada pattern abre um painel com o mesmo roteiro editorial do Refactoring.Guru e um link de origem.
5. As seções de SOLID, Clean Code e refactoring podem ser consultadas sem sair da landing page.
6. Uma faixa de fontes deixa claro o que é resumo editorial, o que vem da literatura e onde avançar na fonte primária.

## Modelo de conteúdo

### Pattern

`id`, `name`, `category`, `summary`, `purpose`, `problem`, `solution`, `structure`, `example`, `applicability`, `implementation`, `benefits`, `tradeoffs`, `relations`, `code`, `sourceUrl`, `refs`.

### Principle

`id`, `name`, `summary`, `problem`, `rule`, `example`, `tradeoffs`, `sourceUrl`, `refs`.

### Smell e technique

`id`, `name`, `group`, `symptom`, `response`, `sourceUrl`, `refs`.

## Não objetivos

- Não transformar pattern em receita obrigatória.
- Não substituir testes, revisão, contexto de negócio ou design review.
- Não importar imagens externas que possam quebrar licenciamento ou disponibilidade.
- Não prometer que o catálogo cobre toda a literatura de engenharia de software.

## Critérios de aceite

- O catálogo contém exatamente 22 patterns e três categorias.
- Factory Method e Singleton têm exemplo de código copiável; os demais têm exemplo/checklist de aplicação.
- SOLID contém cinco princípios e Clean Code pode ser expandido sem navegar para outra página.
- Code smells e técnicas de refactoring estão agrupados e pesquisáveis.
- Todo item possui link de origem e pelo menos uma referência bibliográfica.
- A landing page continua estática, navegável por hash e funcional no GitHub Pages.
