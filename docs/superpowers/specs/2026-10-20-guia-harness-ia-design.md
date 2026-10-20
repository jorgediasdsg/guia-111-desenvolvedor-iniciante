# Guia 111 + Harness de Desenvolvimento com IA

## Intenção

Transformar o PDF `Guia_111_Conceitos_Desenvolvedor_Iniciante.pdf` em uma landing page navegável, pesquisável e apresentável. A página deve preservar os 111 conceitos, explicá-los em linguagem direta, manter os termos técnicos em inglês e mostrar a tradução apenas como apoio em português. Cada conceito precisa exibir bibliografia relacionada.

O material também deve vender uma proposta operacional: executar solicitações em um único ciclo de trabalho, com issue enriquecida, esforço cognitivo explícito, escolha deliberada do modelo de IA, pipeline automatizada, homologação, QA, validação do PO e promoção controlada para produção.

## Público e momento de uso

Desenvolvedores iniciantes, pessoas de produto e liderança técnica que precisam explicar como fundamentos de software se conectam ao fluxo diário de entrega. A landing page é o material de consulta; a apresentação é a versão curta para uma reunião.

## Objetivos

- Tornar os 111 conceitos consultáveis por busca, bloco, nível e termo técnico.
- Exibir o termo principal em inglês e a explicação equivalente em português.
- Associar uma ou mais referências bibliográficas a cada item.
- Incluir uma trilha de arquitetura e qualidade com Gangue dos Quatro, Clean Code e princípios de design.
- Incluir um fluxo de desenvolvimento ágil com issue de negócio, especificação técnica, tag de esforço cognitivo, escolha de IA, CI/CD, homologação, QA, PO e produção.
- Permitir que a apresentação navegue para explicações aprofundadas da landing page.
- Publicar como site estático no GitHub Pages.

## Fora de escopo

- Criar ou modificar issues reais no GitHub/GitLab.
- Executar pipelines de projeto do usuário.
- Prometer que uma IA substitui as decisões de produto, revisão ou qualidade.
- Traduzir a terminologia técnica para substituir o termo consolidado na literatura.

## Decisões editoriais

- O título de cada conceito usa o termo de literatura em inglês, quando houver um termo claro.
- Logo abaixo, a página mostra uma glosa curta em português, por exemplo: `rate limit — limite de requisições`.
- A explicação do PDF continua em português, mas nomes de padrões, ferramentas e protocolos permanecem em inglês.
- As referências aparecem como bibliografia por item, com autor, obra, ano e link de consulta.
- Quando uma recomendação depende de contexto, a página sinaliza o trade-off em vez de apresentá-la como regra universal.

## Direção visual

Uma identidade técnica editorial inspirada na marca JorgeResolve: azul profundo como base de confiança, magenta como destaque de ação, fundos claros, tipografia sans-serif forte e uma linguagem visual de trilha, checkpoints e linhas de conexão. A interface deve parecer uma página de método, não um painel administrativo.

## Estrutura da experiência

1. `index.html`: hero, manifesto, fluxo de execução em ciclo único, destaques de arquitetura e metodologia, busca, filtros e os 111 conceitos, referências gerais e chamada para a apresentação.
2. `apresentacao.html`: seis slides curtos, com navegação por teclado, botões anterior/próximo e links profundos para a landing page.
3. `assets/js/content.js`: dados estruturados dos conceitos, referências e fluxos.
4. `assets/js/app.js`: busca, filtros, renderização, navegação por hash e compartilhamento de foco.
5. `assets/css/styles.css`: sistema visual responsivo e diagramas em CSS.

## Critérios de sucesso

- O navegador encontra os 111 itens e renderiza cada um sem depender de servidor.
- Buscar `rate limit` encontra o item 1 e mostra `limite de requisições` como apoio.
- Cada item tem uma seção visível de bibliografia.
- O fluxo deixa claro o caminho issue → especificações → esforço → IA → pipeline → homologação → QA → MR → PO → produção.
- Pelo menos um slide leva o leitor ao trecho correspondente da landing page via hash.
- O projeto publica por GitHub Pages e fornece uma URL pública verificável.
