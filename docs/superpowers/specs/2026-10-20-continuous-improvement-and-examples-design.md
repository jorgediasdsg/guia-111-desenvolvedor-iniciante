# Harness com fallback, memória de issue e exemplos aplicáveis

## Intenção

Evoluir o manifesto para mostrar que a esteira entrega produto e aprende com cada issue. O QA pode aprovar ou reprovar a promoção. Em caso de reprovação, a issue volta para a especificação correta e percorre novamente o harness. Cada transição deixa um comentário na issue. Antes do arquivamento, agentes especializados leem o histórico e criam um relatório de oportunidades de melhoria para PO, QA, harness e arquitetura.

## Fallback de QA

O caminho principal é `homologação → QA → merge request → PO → produção`. O caminho de exceção é `QA → reprovação → comentário com evidências → retorno à business specification ou technical specification → nova execução`. A reprovação não apaga tentativas anteriores e não permite promover uma solução sem novo aceite.

## Memória operacional da issue

Cada etapa gera um comentário com:

- agente ou papel responsável;
- decisão tomada;
- artefato produzido;
- evidência ou link;
- próxima ação;
- número da tentativa quando houver repetição.

O histórico da issue serve para explicar o que aconteceu, reduzir investigação repetida e alimentar o relatório de melhoria contínua.

## Relatório antes do arquivamento

Agentes especializados analisam o histórico em quatro frentes:

1. `PO specification`: ambiguidades, critérios de aceite incompletos e linguagem que gerou interpretações diferentes.
2. `QA specification`: testes redundantes, cobertura desproporcional ao risco, casos multi-tenant e limites de inputs.
3. `Harness`: prompts, routing de modelo, ordem de etapas, handoffs e pontos de retrabalho.
4. `Architecture`: acoplamento, contratos, dívida técnica, observabilidade e oportunidades que valem uma mudança transversal.

O relatório separa `evidência`, `impacto`, `sugestão`, `owner`, `prioridade` e `próxima ação`. PO ou principal engineer pode transformar a sugestão em issue ou commit de melhoria.

## Limites de teste

O exemplo didático deve defender um espaço de inputs coerente e finito. Não se testa toda palavra possível do usuário. Define-se o domínio válido, equivalence classes, limites e riscos. Multi-tenant recebe mais rigor quando há isolamento, autorização ou dados sensíveis; fluxos de baixo risco recebem uma suíte menor e representativa.

## Modelo de exemplos

Cada conceito ganha uma camada `Aplicação guiada` com a estrutura didática:

- `Purpose`: para que serve;
- `Problem`: qual sintoma aparece;
- `Solution`: qual decisão resolve o sintoma;
- `Example`: cenário concreto;
- `How to apply`: passos numerados;
- `Code`: snippet copiável quando o conceito comportar código;
- `Trade-offs`: custo, limite ou risco;
- `Related`: referências e conceitos relacionados.

Essa estrutura é uma adaptação editorial inspirada na organização pública do Refactoring.Guru, que apresenta propósito, problema, solução, exemplos de código, aplicação, implementação, prós e contras e relações entre conceitos. O texto e os snippets do manifesto são autorais e não reproduzem o conteúdo do site.

## Direção visual

O fallback aparece como um ramo coral que retorna à especificação. O caminho de entrega permanece azul/verde. O relatório de melhoria contínua aparece depois do caminho de produção como uma camada de aprendizado, para que melhoria não vire bloqueio permanente da entrega.
