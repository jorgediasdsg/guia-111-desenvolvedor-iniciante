import fs from "node:fs";
import path from "node:path";
import { parsePdfConcepts } from "./parse_pdf.mjs";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const outputPath = path.join(root, "assets/js/content.js");

const references = [
  ["ddia", "KLEPPMANN, Martin. Designing Data-Intensive Applications. O'Reilly, 2017.", "https://www.oreilly.com/library/view/designing-data-intensive/9781491903063/"],
  ["release-it", "NYGARD, Michael T. Release It! 2. ed. Pragmatic Bookshelf, 2018.", "https://pragprog.com/titles/mnee2/release-it-second-edition/"],
  ["sre", "BEYER, Betsy et al. Site Reliability Engineering. O'Reilly, 2016.", "https://sre.google/sre-book/table-of-contents/"],
  ["sre-workbook", "BEYER, Betsy et al. The Site Reliability Workbook. O'Reilly, 2018.", "https://sre.google/workbook/table-of-contents/"],
  ["accelerate", "FORSGREN, Nicole; HUMBLE, Jez; KIM, Gene. Accelerate. IT Revolution, 2018.", "https://itrevolution.com/product/accelerate/"],
  ["continuous-delivery", "HUMBLE, Jez; FARLEY, David. Continuous Delivery. Addison-Wesley, 2010.", "https://martinfowler.com/books/continuousDelivery.html"],
  ["devops-handbook", "KIM, Gene et al. The DevOps Handbook. 2. ed. IT Revolution, 2021.", "https://itrevolution.com/product/the-devops-handbook/"],
  ["clean-code", "MARTIN, Robert C. Clean Code. Prentice Hall, 2008.", "https://www.pearson.com/en-us/subject-catalog/p/clean-code/P200000009528"],
  ["clean-architecture", "MARTIN, Robert C. Clean Architecture. Prentice Hall, 2017.", "https://www.pearson.com/en-us/subject-catalog/p/clean-architecture-a-craftsmans-guide-to-software-structure-and-design/P200000003347"],
  ["gof", "GAMMA, Erich et al. Design Patterns: Elements of Reusable Object-Oriented Software. Addison-Wesley, 1994.", "https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-software-9780201633610"],
  ["refactoring", "FOWLER, Martin. Refactoring. 2. ed. Addison-Wesley, 2018.", "https://martinfowler.com/books/refactoring.html"],
  ["refactoring-guru", "Refactoring.Guru. Refactoring, Design Patterns and code examples.", "https://refactoring.guru/pt-br"],
  ["refactoring-patterns", "Refactoring.Guru. Design Patterns catalog and pattern guides.", "https://refactoring.guru/pt-br/design-patterns/catalog"],
  ["refactoring-pattern-structure", "Refactoring.Guru. What is a design pattern?", "https://refactoring.guru/pt-br/design-patterns/what-is-pattern"],
  ["refactoring-solid", "Refactoring.Guru. SOLID principles in Dive Into Design Patterns.", "https://refactoring.guru/pt-br/design-patterns/book"],
  ["refactoring-smells", "Refactoring.Guru. Code smells catalog.", "https://refactoring.guru/pt-br/refactoring/smells"],
  ["refactoring-techniques", "Refactoring.Guru. Refactoring techniques catalog.", "https://refactoring.guru/pt-br/refactoring/techniques"],
  ["ddd", "EVANS, Eric. Domain-Driven Design. Addison-Wesley, 2003.", "https://www.domainlanguage.com/ddd/"],
  ["agile-manifesto", "BECK, Kent et al. Manifesto for Agile Software Development. 2001.", "https://agilemanifesto.org/"],
  ["scrum-guide", "SCHWABER, Ken; SUTHERLAND, Jeff. The Scrum Guide. 2020.", "https://scrumguides.org/scrum-guide.html"],
  ["user-stories", "COHN, Mike. User Stories Applied. Addison-Wesley, 2004.", "https://www.informit.com/store/user-stories-applied-for-agile-software-development-0321205685"],
  ["working-legacy", "FEATHERS, Michael. Working Effectively with Legacy Code. Prentice Hall, 2004.", "https://www.informit.com/store/working-effectively-with-legacy-code-0131177052"],
  ["team-topologies", "SKELTON, Matthew; PAIS, Manuel. Team Topologies. IT Revolution, 2019.", "https://teamtopologies.com/book"],
  ["microservices", "NEWMAN, Sam. Building Microservices. 2. ed. O'Reilly, 2021.", "https://samnewman.io/books/building_microservices_2nd_edition/"],
  ["kubernetes", "Kubernetes Documentation. Kubernetes Authors.", "https://kubernetes.io/docs/"],
  ["terraform", "Terraform Documentation. HashiCorp.", "https://developer.hashicorp.com/terraform/docs"],
  ["helm", "Helm Documentation. CNCF.", "https://helm.sh/docs/"],
  ["github-actions", "GitHub Actions Documentation. GitHub.", "https://docs.github.com/en/actions"],
  ["gitlab-ci", "CI/CD Documentation. GitLab.", "https://docs.gitlab.com/ee/ci/"],
  ["github-issues", "About issues. GitHub Documentation.", "https://docs.github.com/en/issues/tracking-your-work-with-issues/about-issues"],
  ["gitlab-issues", "Issues. GitLab Documentation.", "https://docs.gitlab.com/ee/user/project/issues/"],
  ["owasp-top10", "OWASP Top 10:2021. OWASP Foundation.", "https://owasp.org/Top10/"],
  ["owasp-asvs", "OWASP Application Security Verification Standard 4.0.3.", "https://owasp.org/www-project-application-security-verification-standard/"],
  ["owasp-cheatsheets", "OWASP Cheat Sheet Series.", "https://cheatsheetseries.owasp.org/"],
  ["rfc-rate-limit", "RFC 6585. Additional HTTP Status Codes.", "https://www.rfc-editor.org/rfc/rfc6585"],
  ["rfc-http", "RFC 9110. HTTP Semantics.", "https://www.rfc-editor.org/rfc/rfc9110"],
  ["rfc-websockets", "RFC 6455. The WebSocket Protocol.", "https://www.rfc-editor.org/rfc/rfc6455"],
  ["rfc-oauth", "RFC 6749. The OAuth 2.0 Authorization Framework.", "https://www.rfc-editor.org/rfc/rfc6749"],
  ["rfc-jwt", "RFC 7519. JSON Web Token.", "https://www.rfc-editor.org/rfc/rfc7519"],
  ["rfc-tls", "RFC 8446. The Transport Layer Security Protocol Version 1.3.", "https://www.rfc-editor.org/rfc/rfc8446"],
  ["rfc-quic", "RFC 9000. QUIC: A UDP-Based Multiplexed and Secure Transport.", "https://www.rfc-editor.org/rfc/rfc9000"],
  ["mdn-web", "MDN Web Docs. HTTP, CORS, Web APIs and browser networking.", "https://developer.mozilla.org/en-US/docs/Web/HTTP"],
  ["opentelemetry", "OpenTelemetry Documentation.", "https://opentelemetry.io/docs/"],
  ["twelve-factor", "WIGGINS, Adam. The Twelve-Factor App.", "https://12factor.net/"],
  ["semver", "PRESTON-WERNER, Tom. Semantic Versioning 2.0.0.", "https://semver.org/"],
  ["api-design", "RICHARDSON, Leonard; AMUNDSEN, Mike. RESTful Web APIs. O'Reilly, 2013.", "https://www.oreilly.com/library/view/restful-web-apis/9781449359713/"],
  ["enterprise-patterns", "FOWLER, Martin. Patterns of Enterprise Application Architecture. Addison-Wesley, 2002.", "https://martinfowler.com/books/eaa.html"],
  ["concurrency", "GOETZ, Brian et al. Java Concurrency in Practice. Addison-Wesley, 2006.", "https://jcip.net/"],
  ["gc-handbook", "JONES, Richard; HOSKING, Antony; MOSS, Eliot. The Garbage Collection Handbook. CRC Press, 2011.", "https://gchandbook.org/"],
  ["hpbn", "GRIGORIK, Ilya. High Performance Browser Networking. O'Reilly, 2013.", "https://hpbn.co/"],
  ["chaos", "ROSENTHAL, Casey; JONES, Nora. Chaos Engineering. O'Reilly, 2020.", "https://www.oreilly.com/library/view/chaos-engineering/9781492043867/"],
  ["well-architected", "AWS Well-Architected Framework. Amazon Web Services.", "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html"],
  ["serverless", "AWS Lambda Documentation. Amazon Web Services.", "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html"],
  ["grpc", "gRPC Documentation.", "https://grpc.io/docs/"],
  ["dns-bind", "HUNT, Craig. TCP/IP Network Administration. O'Reilly, 2002.", "https://www.oreilly.com/library/view/tcpip-network-administration/0596002971/"],
  ["networking", "KUROSE, James; ROSS, Keith. Computer Networking: A Top-Down Approach. Pearson.", "https://gaia.cs.umass.edu/kurose_ross/"],
  ["docker", "Docker Documentation. Docker.", "https://docs.docker.com/get-started/"],
  ["otel-tracing", "OpenTelemetry Tracing Documentation.", "https://opentelemetry.io/docs/concepts/signals/traces/"],
];

const termMap = {
  1: ["rate limit", "limite de requisições"], 2: ["cache", "cache"], 3: ["load balancing", "balanceamento de carga"], 4: ["reverse proxy", "proxy reverso"], 5: ["API gateway", "gateway de API"], 6: ["CI/CD", "integração e entrega contínuas"], 7: ["Docker", "empacotamento de aplicações em containers"], 8: ["Kubernetes", "orquestração de containers"], 9: ["service discovery", "descoberta de serviços"], 10: ["circuit breaker", "disjuntor de falhas"], 11: ["timeout", "tempo máximo de espera"], 12: ["retry", "repetição controlada"], 13: ["exponential backoff", "recuo exponencial"], 14: ["idempotency", "idempotência"], 15: ["message queue", "fila de mensagens"], 16: ["publish/subscribe", "publicação e assinatura"], 17: ["event-driven architecture", "arquitetura orientada a eventos"], 18: ["distributed transaction", "transação distribuída"], 19: ["Saga pattern", "padrão Saga"], 20: ["dead letter queue", "fila de mensagens sem processamento"], 21: ["cron job", "tarefa agendada"], 22: ["WebSocket", "canal bidirecional persistente"], 23: ["long polling", "consulta prolongada"], 24: ["Server-Sent Events", "eventos enviados pelo servidor"], 25: ["database index", "índice de banco de dados"], 26: ["query optimization", "otimização de consultas"], 27: ["N+1 query", "consultas N+1"], 28: ["connection pool", "pool de conexões"], 29: ["read replica", "réplica de leitura"], 30: ["sharding", "particionamento por shards"], 31: ["partitioning", "particionamento"], 32: ["replication", "replicação"], 33: ["leader election", "eleição de líder"], 34: ["CAP theorem", "teorema CAP"], 35: ["eventual consistency", "consistência eventual"], 36: ["optimistic locking", "lock otimista"], 37: ["pessimistic locking", "lock pessimista"], 38: ["distributed lock", "lock distribuído"], 39: ["race condition", "condição de corrida"], 40: ["deadlock", "impasse entre locks"], 41: ["memory leak", "vazamento de memória"], 42: ["garbage collection", "coleta de lixo"], 43: ["thread safety", "segurança em concorrência"], 44: ["backpressure", "pressão de retorno"], 45: ["autoscaling", "escala automática"], 46: ["horizontal scaling", "escala horizontal"], 47: ["vertical scaling", "escala vertical"], 48: ["CDN", "rede de distribuição de conteúdo"], 49: ["edge cache", "cache na borda"], 50: ["cache invalidation", "invalidação de cache"], 51: ["feature flag", "chave de funcionalidade"], 52: ["blue-green deployment", "deploy blue-green"], 53: ["canary release", "release canário"], 54: ["rolling deployment", "deploy gradual"], 55: ["rollback", "retorno a uma versão anterior"], 56: ["health check", "verificação de saúde"], 57: ["liveness and readiness probes", "probes de vitalidade e prontidão"], 58: ["monitoring", "monitoramento"], 59: ["logging", "registro de logs"], 60: ["distributed tracing", "rastreamento distribuído"], 61: ["metrics", "métricas"], 62: ["alerting", "alertas"], 63: ["SLO", "objetivo de nível de serviço"], 64: ["SLI", "indicador de nível de serviço"], 65: ["error budget", "orçamento de erros"], 66: ["observability", "observabilidade"], 67: ["secrets management", "gestão de segredos"], 68: ["IAM", "gestão de identidade e acesso"], 69: ["OAuth", "delegação de autorização"], 70: ["JWT rotation", "rotação de JWT"], 71: ["TLS", "segurança da camada de transporte"], 72: ["encryption at rest", "criptografia em repouso"], 73: ["encryption in transit", "criptografia em trânsito"], 74: ["WAF", "firewall de aplicações web"], 75: ["DDoS protection", "proteção contra DDoS"], 76: ["CORS", "compartilhamento de recursos entre origens"], 77: ["CSRF protection", "proteção contra falsificação de requisições"], 78: ["SQL injection", "injeção de SQL"], 79: ["XSS", "cross-site scripting"], 80: ["SSRF", "server-side request forgery"], 81: ["database migration", "migration de banco"], 82: ["schema versioning", "versionamento de schema"], 83: ["disaster recovery", "recuperação de desastres"], 84: ["backup", "cópia de segurança"], 85: ["failover", "troca para o recurso de reserva"], 86: ["multi-region deployment", "deploy multirregião"], 87: ["chaos engineering", "engenharia do caos"], 88: ["cost optimization", "otimização de custos"], 89: ["cold start", "inicialização a frio"], 90: ["serverless limits", "limites de serverless"], 91: ["latency", "latência"], 92: ["throughput", "vazão"], 93: ["p99 latency", "latência no percentil 99"], 94: ["tail latency", "latência de cauda"], 95: ["network partition", "partição de rede"], 96: ["clock skew", "desvio de relógio"], 97: ["DNS", "sistema de nomes de domínio"], 98: ["TCP vs UDP", "TCP versus UDP"], 99: ["HTTP/2 and HTTP/3", "HTTP/2 e HTTP/3"], 100: ["gRPC", "RPC sobre HTTP/2"], 101: ["webhook", "notificação HTTP de evento"], 102: ["API versioning", "versionamento de API"], 103: ["semantic versioning", "versionamento semântico"], 104: ["infrastructure as code", "infraestrutura como código"], 105: ["Terraform", "provisionamento declarativo"], 106: ["Helm chart", "pacote de deploy para Kubernetes"], 107: ["build cache", "cache de build"], 108: ["dependency hell", "conflito de dependências"], 109: ["production incident", "incidente em produção"], 110: ["on-call", "plantão operacional"], 111: ["postmortem", "análise pós-incidente"],
};

const referenceMap = {
  1: ["rfc-rate-limit", "sre", "release-it"], 2: ["ddia", "release-it"], 3: ["ddia", "microservices"], 4: ["microservices", "rfc-http"], 5: ["microservices", "api-design"], 6: ["continuous-delivery", "accelerate", "github-actions"], 7: ["docker", "twelve-factor"], 8: ["kubernetes", "microservices"], 9: ["microservices", "ddia"], 10: ["release-it", "microservices"], 11: ["release-it", "sre"], 12: ["release-it", "sre"], 13: ["release-it", "rfc-rate-limit"], 14: ["ddia", "release-it"], 15: ["ddia", "enterprise-patterns"], 16: ["ddia"], 17: ["ddia", "microservices"], 18: ["ddia", "ddd"], 19: ["ddia", "microservices"], 20: ["enterprise-patterns", "sre"], 21: ["twelve-factor", "sre"], 22: ["rfc-websockets", "mdn-web"], 23: ["rfc-http", "api-design"], 24: ["mdn-web", "rfc-http"], 25: ["ddia", "enterprise-patterns"], 26: ["ddia", "enterprise-patterns"], 27: ["enterprise-patterns", "ddia"], 28: ["ddia", "release-it"], 29: ["ddia"], 30: ["ddia"], 31: ["ddia"], 32: ["ddia"], 33: ["ddia", "sre"], 34: ["ddia"], 35: ["ddia"], 36: ["enterprise-patterns", "ddd"], 37: ["ddia", "enterprise-patterns"], 38: ["ddia", "release-it"], 39: ["concurrency"], 40: ["concurrency", "ddia"], 41: ["gc-handbook", "clean-code"], 42: ["gc-handbook"], 43: ["concurrency"], 44: ["ddia", "sre"], 45: ["sre", "kubernetes"], 46: ["ddia"], 47: ["ddia"], 48: ["hpbn"], 49: ["hpbn", "ddia"], 50: ["ddia", "release-it"], 51: ["accelerate", "continuous-delivery"], 52: ["continuous-delivery", "accelerate"], 53: ["continuous-delivery", "accelerate"], 54: ["kubernetes", "continuous-delivery"], 55: ["release-it", "continuous-delivery"], 56: ["sre", "release-it"], 57: ["kubernetes", "sre"], 58: ["sre"], 59: ["sre", "devops-handbook"], 60: ["sre", "otel-tracing"], 61: ["sre"], 62: ["sre"], 63: ["sre", "sre-workbook"], 64: ["sre"], 65: ["sre", "sre-workbook"], 66: ["sre", "otel-tracing"], 67: ["owasp-asvs", "twelve-factor"], 68: ["owasp-asvs", "sre"], 69: ["rfc-oauth", "owasp-asvs"], 70: ["rfc-jwt", "owasp-cheatsheets"], 71: ["rfc-tls", "owasp-asvs"], 72: ["owasp-asvs"], 73: ["rfc-tls", "owasp-asvs"], 74: ["owasp-top10", "owasp-asvs"], 75: ["owasp-top10", "sre"], 76: ["mdn-web", "owasp-asvs"], 77: ["owasp-cheatsheets", "owasp-asvs"], 78: ["owasp-top10", "owasp-cheatsheets"], 79: ["owasp-top10", "owasp-cheatsheets"], 80: ["owasp-top10", "owasp-cheatsheets"], 81: ["enterprise-patterns", "ddia"], 82: ["ddia", "continuous-delivery"], 83: ["sre", "sre-workbook"], 84: ["sre-workbook", "release-it"], 85: ["sre", "ddia"], 86: ["sre", "ddia"], 87: ["chaos", "sre"], 88: ["well-architected", "devops-handbook"], 89: ["serverless", "well-architected"], 90: ["serverless", "twelve-factor"], 91: ["sre", "hpbn"], 92: ["ddia"], 93: ["sre"], 94: ["ddia", "sre"], 95: ["ddia"], 96: ["ddia"], 97: ["dns-bind", "networking"], 98: ["networking", "hpbn"], 99: ["rfc-http", "hpbn", "rfc-quic"], 100: ["grpc", "microservices"], 101: ["api-design", "rfc-http"], 102: ["api-design", "semver"], 103: ["semver"], 104: ["terraform", "devops-handbook"], 105: ["terraform"], 106: ["helm", "kubernetes"], 107: ["accelerate", "continuous-delivery"], 108: ["semver", "devops-handbook"], 109: ["sre", "sre-workbook"], 110: ["sre", "team-topologies"], 111: ["sre", "sre-workbook"],
};

const blockFor = (number) => number <= 19 ? ["01", "Requisições, entrega e comunicação"] : number <= 41 ? ["02", "Tarefas, dados e concorrência"] : number <= 59 ? ["03", "Recursos, escala e publicação"] : number <= 82 ? ["04", "Observabilidade, segurança e evolução"] : number <= 101 ? ["05", "Continuidade, desempenho e rede"] : ["06", "Contratos, infraestrutura e operação"];

const workflowStages = [
  { id: "demand", index: "01", label: "Demanda", actor: "Produto", summary: "O PO descreve o resultado que o usuário precisa e o contexto de negócio.", artifact: "intenção + critério de sucesso", branch: "backlog" },
  { id: "issue", index: "02", label: "Issue", actor: "Produto + time", summary: "A demanda vira uma issue rastreável no GitHub ou GitLab, com escopo e links.", artifact: "issue #123", branch: "backlog" },
  { id: "business-spec", index: "03", label: "Especificação de negócio", actor: "PO", summary: "A issue registra regras, cenários, critérios de aceite e o que fica fora do escopo.", artifact: "business specification", branch: "backlog" },
  { id: "technical-spec", index: "04", label: "Especificação técnica", actor: "Engenharia", summary: "O time descreve contratos, dados, riscos, testes, observabilidade e estratégia de release.", artifact: "technical specification", branch: "feature/issue-123" },
  { id: "effort", index: "05", label: "Esforço cognitivo", actor: "Time", summary: "A issue recebe uma tag pequena, média ou grande conforme incerteza, dependências e risco.", artifact: "cognitive-effort: small | medium | large", branch: "feature/issue-123" },
  { id: "model", index: "06", label: "Roteamento de IA", actor: "Orquestração", summary: "O esforço e o risco orientam a escolha do modelo e do ambiente de execução.", artifact: "modelo + contexto + limites", branch: "feature/issue-123" },
  { id: "build", index: "07", label: "Implementação", actor: "IA + engenharia", summary: "A implementação fecha a especificação técnica, registra decisões e mantém a issue atualizada.", artifact: "commit + testes", branch: "feature/issue-123" },
  { id: "pipeline", index: "08", label: "Pipeline", actor: "CI/CD", summary: "A pipeline roda lint, testes, segurança, build, artefato e verificações de qualidade.", artifact: "pipeline verde", branch: "feature/issue-123" },
  { id: "homolog", index: "09", label: "Homologação", actor: "Entrega", summary: "O artefato promovido chega à branch e ao ambiente de homologação para validação realista.", artifact: "deploy em homolog", branch: "homolog" },
  { id: "qa", index: "10", label: "QA", actor: "Tester / QA", summary: "O QA valida a história do PO, a especificação de negócio e a especificação técnica em homologação.", artifact: "evidência de aceite", branch: "homolog" },
  { id: "mr", index: "11", label: "Merge request", actor: "Engenharia + PO", summary: "O QA registra a evidência, a engenharia abre o merge request e o PO revisa o resultado.", artifact: "MR aprovado", branch: "homolog" },
  { id: "production", index: "12", label: "Produção", actor: "PO + entrega", summary: "Com aceite, a mudança segue de homolog para produção com monitoramento e rollback disponível.", artifact: "release em produção", branch: "production" },
  { id: "continuous-improvement", index: "13", label: "Melhoria contínua", actor: "Agentes especializados", summary: "Antes do arquivamento, o histórico vira um relatório acionável para PO, QA, harness e arquitetura.", artifact: "issue improvement report", branch: "post-release" },
];

const workflowBranches = [
  { id: "qa-rejected", label: "QA reprova", actor: "Tester / QA", summary: "A evidência da falha fica registrada na issue e bloqueia a promoção para main.", artifact: "comentário de reprovação + evidência", returnTo: "technical-spec", branch: "homolog" },
  { id: "spec-rework", label: "Reespecificar", actor: "PO + engenharia", summary: "A equipe corrige a business specification ou technical specification e inicia nova tentativa.", artifact: "spec v2 + tentativa 2", returnTo: "technical-spec", branch: "feature/issue-123" },
];

const issueCommentTemplate = [
  { stage: "demand", role: "PO", template: "[DEMANDA] Objetivo, contexto e resultado esperado registrados." },
  { stage: "issue", role: "PO + time", template: "[ISSUE] Escopo, links e critério de sucesso vinculados à issue #123." },
  { stage: "business-spec", role: "PO", template: "[BUSINESS SPEC v1] Regras, cenários de aceite e limites do que não será feito." },
  { stage: "technical-spec", role: "Engenharia", template: "[TECHNICAL SPEC v1] Contratos, dados, riscos, testes e estratégia de release." },
  { stage: "effort", role: "Time", template: "[EFFORT] cognitive-effort: medium. Motivo: integração, risco e dependências listados." },
  { stage: "model", role: "Orquestração", template: "[AI ROUTING] Modelo selecionado, contexto enviado, limites e revisão humana definidos." },
  { stage: "build", role: "IA + engenharia", template: "[IMPLEMENTATION] Commit, decisões e testes associados à tentativa atual." },
  { stage: "pipeline", role: "CI/CD", template: "[PIPELINE] Lint, testes, segurança, build e artefato: resultado + link da execução." },
  { stage: "homolog", role: "Entrega", template: "[HOMOLOG] Artefato publicado em homologação. QA avisado com versão e dados de teste." },
  { stage: "qa", role: "Tester / QA", template: "[QA] Resultado, evidências e relação com a business specification e a technical specification." },
  { stage: "qa-rejected", role: "Tester / QA", template: "[QA REPROVADO] Promoção bloqueada. Falha, impacto, evidência e retorno para a spec: tentativa N." },
  { stage: "spec-rework", role: "PO + engenharia", template: "[SPEC REWORK] Business specification ou technical specification revisada. Nova tentativa N autorizada para percorrer o harness." },
  { stage: "mr", role: "Engenharia + PO", template: "[MR] Merge request criado. QA aprovou a evidência e PO iniciou validação final." },
  { stage: "production", role: "PO + entrega", template: "[PRODUÇÃO] Release promovido de homolog para production. Monitoramento e rollback confirmados." },
  { stage: "continuous-improvement", role: "Agentes especializados", template: "[IMPROVEMENT REPORT] Relatório gerado antes do arquivamento, com owners e próximas ações." },
];

const improvementAgents = [
  { id: "po-spec", label: "PO specification agent", owner: "Produto", focus: "Ambiguidades, critérios de aceite e exemplos que permitiriam uma leitura mais precisa.", output: "sugestão de business specification + issue de melhoria" },
  { id: "qa-spec", label: "QA specification agent", owner: "Qualidade", focus: "Tempo de validação, redundâncias, risco multi-tenant e limites coerentes de inputs.", output: "suíte de testes revisada + matriz de risco" },
  { id: "harness", label: "Harness improvement agent", owner: "Orquestração", focus: "Repetições, prompts, handoffs, escolha de modelo e pontos que geraram retrabalho.", output: "mudança sugerida no harness + prompt Markdown" },
  { id: "architecture", label: "Architecture agent", owner: "Principal engineer", focus: "Padrões recorrentes, acoplamento, contratos e oportunidades que valem mudança transversal.", output: "ADR ou commit arquitetural candidato" },
];

const didacticTemplate = [
  { id: "purpose", label: "Purpose", description: "Para que este conceito existe no sistema." },
  { id: "problem", label: "Problem", description: "Qual sintoma ou custo aparece sem ele." },
  { id: "solution", label: "Solution", description: "Qual decisão ou padrão responde ao problema." },
  { id: "structure", label: "Structure", description: "Quais partes participam da decisão e como elas se relacionam." },
  { id: "example", label: "Example", description: "Um cenário reconhecível antes de abstrair." },
  { id: "applicability", label: "Applicability", description: "Em quais contextos a decisão faz sentido e onde ela é excesso." },
  { id: "how", label: "How to apply", description: "Passos pequenos para testar a decisão no contexto." },
  { id: "implementation", label: "Implementation", description: "Como transformar a decisão em código, configuração ou prática operacional." },
  { id: "benefits", label: "Benefits", description: "Que ganho observável justifica a mudança." },
  { id: "code", label: "Code / checklist", description: "Um snippet copiável ou uma sequência operacional." },
  { id: "tradeoffs", label: "Trade-offs", description: "O que a decisão custa, limita ou pode quebrar." },
  { id: "anti-refactoring", label: "Anti-refactoring", description: "Quando não aplicar ou como evitar transformar a técnica em ritual." },
  { id: "related", label: "Related", description: "Conceitos e referências que ampliam a leitura." },
]; 

const harnessArtifacts = [
  {
    id: "business-prompt",
    label: "Prompt de negócio",
    format: "Markdown",
    description: "Entrada para o PO transformar intenção em regra, cenário e critério de aceite.",
    copyText: `# Business specification\n\n## Objetivo\nDescreva o resultado que o usuário precisa alcançar.\n\n## Regras\n- Diga o que é obrigatório.\n- Diga o que fica fora do escopo.\n\n## Cenários de aceite\n- Dado um contexto coerente, quando a ação acontece, então o resultado observável aparece.\n\n## Limites\nDefina o espaço de inputs válido. Não transforme palavras infinitas em testes infinitos.`,
  },
  {
    id: "technical-spec",
    label: "Especificação técnica",
    format: "Markdown",
    description: "Contrato mínimo para a IA e a engenharia executarem a issue com rastreabilidade.",
    copyText: `# Technical specification\n\n## Contrato\n- Entradas:\n- Saídas:\n- Erros:\n\n## Dados e tenant isolation\nDescreva a chave de tenant e como impedir vazamento entre contas.\n\n## Testes proporcionais ao risco\n- Baixo risco: happy path + limites principais.\n- Alto risco: isolamento, autorização, concorrência e recuperação.\n\n## Observabilidade\nDefina logs, métricas, traces e sinais de rollback.`,
  },
  {
    id: "code-delivery",
    label: "Possível entrega em código",
    format: "JavaScript",
    description: "Um exemplo curto de implementação que a IA pode produzir e a pipeline pode verificar.",
    copyText: `export function canReadTenant(resource, actor) {\n  if (!resource || !actor) return false;\n  return resource.tenantId === actor.tenantId &&\n    actor.permissions.includes("read:resource");\n}\n\n// O teste deve provar isolamento entre dois tenants.`,
  },
  {
    id: "improvement-report",
    label: "Relatório da issue",
    format: "Markdown",
    description: "Saída dos agentes antes do arquivamento, pronta para virar issue, ADR ou commit.",
    copyText: `# Issue improvement report\n\n## Evidência\n- Tentativas:\n- Tempo em QA:\n- Falhas repetidas:\n\n## Oportunidade\n- Frente: PO specification | QA specification | Harness | Architecture\n- Impacto:\n- Owner:\n- Prioridade:\n\n## Próxima ação\nCrie uma issue ou commit pequeno, com critério de aceite e prazo de revisão.`,
  },
];

const effortLevels = [
  { id: "small", label: "Small", title: "Esforço cognitivo pequeno", description: "Baixa incerteza, poucas dependências, teste local claro e rollback simples.", route: "modelo rápido + contexto enxuto" },
  { id: "medium", label: "Medium", title: "Esforço cognitivo médio", description: "Mais de um componente, contratos ou integração, com risco controlável.", route: "modelo equilibrado + revisão humana" },
  { id: "large", label: "Large", title: "Esforço cognitivo grande", description: "Alta incerteza, impacto de negócio, segurança, dados ou arquitetura distribuída.", route: "modelo de maior raciocínio + design review + execução fatiada" },
];

const modelOptions = [
  { name: "Codex", role: "implementação, leitura de repositório, testes e revisão técnica" },
  { name: "Claude Code", role: "exploração, refatoração e mudanças amplas com contexto local" },
  { name: "Cloud Code", role: "execução orientada por ambiente e integração com serviços de nuvem" },
  { name: "DeepSeek", role: "alternativa para exploração, síntese e implementação com custo controlado" },
  { name: "OpenRouter", role: "roteamento entre modelos conforme custo, latência e capacidade" },
  { name: "qualquer LLM", role: "desde que receba o contrato, os testes, os limites e o critério de aceite" },
];

const architectureTracks = [
  { id: "gof", eyebrow: "Gangue dos Quatro", title: "Design Patterns", body: "Um vocabulário para reconhecer soluções recorrentes e discutir trade-offs sem transformar o padrão em receita.", refs: ["gof", "refactoring-patterns"], deepLink: "#refactoring-catalog", details: [{ name: "22 patterns", body: "Criacionais, estruturais e comportamentais; cada um começa por um problema, não por uma classe pronta." }, { name: "Como ler", body: "Purpose → problem → solution → structure → example → applicability → implementation → trade-offs → relations." }] },
  { id: "solid", eyebrow: "Design principles", title: "SOLID", body: "Cinco princípios para diminuir acoplamento, tornar mudanças localizadas e deixar contratos mais fáceis de testar.", refs: ["clean-code", "refactoring-solid"], deepLink: "#solid-principles", details: [{ name: "SRP", body: "Uma unidade deve ter um motivo principal para mudar." }, { name: "OCP · LSP · ISP · DIP", body: "Extensões seguras, substituição correta, interfaces focadas e dependências apontando para abstrações." }] },
  { id: "clean-code", eyebrow: "Uncle Bob", title: "Clean Code", body: "Nomes claros, funções pequenas, dependências explícitas, testes legíveis e refatoração contínua reduzem o custo de mudar o sistema.", refs: ["clean-code", "refactoring"], deepLink: "#clean-code-principles", details: [{ name: "Legibilidade", body: "Código deve revelar intenção sem exigir uma explicação paralela." }, { name: "Mudança segura", body: "Pequenas funções, baixo acoplamento e testes transformam manutenção em uma sequência verificável." }] },
  { id: "clean-architecture", eyebrow: "Arquitetura", title: "Clean Architecture + DDD", body: "Separe regras de negócio de detalhes de entrega, mantenha fronteiras explícitas e modele o domínio antes de espalhar complexidade entre frameworks.", refs: ["clean-architecture", "ddd"], deepLink: "#architecture" },
  { id: "quality", eyebrow: "Qualidade", title: "Design que aguenta mudança", body: "A arquitetura serve ao fluxo de entrega: contratos verificáveis, observabilidade, testes e uma estratégia de release que permita recuperar o sistema.", refs: ["release-it", "sre"], deepLink: "#workflow" },
];

const slugify = (value) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const refactoringSources = [
  { id: "patterns", label: "Design Patterns", url: "https://refactoring.guru/pt-br/design-patterns/catalog" },
  { id: "pattern-structure", label: "Estrutura de um pattern", url: "https://refactoring.guru/pt-br/design-patterns/what-is-pattern" },
  { id: "solid", label: "SOLID", url: "https://refactoring.guru/pt-br/design-patterns/book" },
  { id: "refactoring", label: "Refactoring", url: "https://refactoring.guru/pt-br/refactoring" },
  { id: "smells", label: "Code smells", url: "https://refactoring.guru/pt-br/refactoring/smells" },
  { id: "techniques", label: "Refactoring techniques", url: "https://refactoring.guru/pt-br/refactoring/techniques" },
];

const patternCatalog = [
  { id: "factory-method", name: "Factory Method", category: "creational", categoryLabel: "Criacionais", summary: "Define um ponto de criação que permite às subclasses decidir qual produto concreto devolver.", problem: "O cliente conhece classes concretas demais e cada novo produto espalha condicionais pelo código.", solution: "Concentre a criação em um método substituível e faça o restante do fluxo depender do contrato do produto.", example: "Um fluxo de entrega cria diferentes notificadores sem conhecer SMTP, webhook ou fila.", applicability: "Use quando a criação varia, quando subclasses representam produtos ou quando a dependência concreta dificulta testes.", tradeoffs: "Reduz acoplamento, mas pode aumentar o número de subclasses e a indireção.", relations: "Abstract Factory · Template Method", code: "class Dialog {\\n  render() {\\n    const button = this.createButton();\\n    button.render();\\n  }\\n\\n  createButton() { throw new Error(\"subclass must choose the product\"); }\\n}\\n\\nclass WebDialog extends Dialog {\\n  createButton() { return new HtmlButton(); }\\n}" },
  { id: "abstract-factory", name: "Abstract Factory", category: "creational", categoryLabel: "Criacionais", summary: "Cria famílias de objetos relacionados sem acoplar o cliente às classes concretas.", problem: "Uma combinação incompatível de produtos aparece quando o cliente instancia cada peça isoladamente.", solution: "Exponha uma fábrica por família e garanta que os produtos devolvidos compartilhem a mesma variante.", example: "Componentes de interface para tema claro/escuro ou integrações AWS/GCP com o mesmo contrato.", applicability: "Use quando há famílias de produtos que precisam permanecer consistentes entre si.", tradeoffs: "Protege compatibilidade, mas exige uma nova abstração para cada família e produto.", relations: "Factory Method · Builder · Singleton" },
  { id: "builder", name: "Builder", category: "creational", categoryLabel: "Criacionais", summary: "Separa a construção passo a passo de um objeto complexo da representação final.", problem: "Construtores longos e combinações opcionais tornam a criação ilegível e fácil de invalidar.", solution: "Orquestre etapas em um builder e valide o resultado antes de entregá-lo ao cliente.", example: "Montagem de uma ordem com tenant, itens, descontos, endereço e política de entrega opcionais.", applicability: "Use quando há muitas opções, etapas ou representações diferentes do mesmo produto.", tradeoffs: "Melhora legibilidade, mas adiciona classes e pode ser excesso para objetos simples.", relations: "Abstract Factory · Composite · Singleton" },
  { id: "prototype", name: "Prototype", category: "creational", categoryLabel: "Criacionais", summary: "Cria novos objetos clonando uma instância-protótipo já configurada.", problem: "Construir um objeto a partir do zero é caro ou requer conhecer detalhes internos.", solution: "Defina uma operação de clonagem e copie um protótipo seguro para o novo contexto.", example: "Duplicação de um template de relatório com configurações base antes de personalizar o tenant.", applicability: "Use quando os objetos têm configuração rica ou quando a construção direta é custosa.", tradeoffs: "Evita reconstrução, mas cópia profunda, referências compartilhadas e identidade exigem cuidado.", relations: "Factory Method · Abstract Factory · Memento" },
  { id: "singleton", name: "Singleton", category: "creational", categoryLabel: "Criacionais", summary: "Garante uma única instância controlada e um ponto de acesso conhecido.", problem: "Um recurso compartilhado precisa de uma única coordenação, mas o construtor permite estados concorrentes.", solution: "Controle a criação e exponha o acesso por uma fronteira explícita, preferindo injeção quando possível.", example: "Um registry de configuração imutável carregado uma vez por processo.", applicability: "Use com parcimônia para recursos realmente únicos e bem delimitados; evite como variável global disfarçada.", tradeoffs: "Pode simplificar coordenação, mas dificulta testes, esconde dependências e exige cuidado com concorrência.", relations: "Facade · Flyweight · Abstract Factory", code: "class Config {\\n  static #instance;\\n  static get instance() { return (this.#instance ??= new Config()); }\\n  constructor() { if (Config.#instance) return Config.#instance; this.values = Object.freeze({ region: \"sa-east-1\" }); }\\n}" },
  { id: "adapter", name: "Adapter", category: "structural", categoryLabel: "Estruturais", summary: "Converte a interface de um objeto para outra interface esperada pelo cliente.", problem: "Uma dependência útil tem contrato incompatível com o código que precisa consumi-la.", solution: "Coloque a conversão em um objeto adaptador e preserve o contrato usado pelo cliente.", example: "Adaptar um SDK externo de pagamentos para o port de cobrança da aplicação.", applicability: "Use na borda entre sistemas, bibliotecas legadas e contratos próprios.", tradeoffs: "Isola mudança externa, mas cria uma camada que precisa acompanhar os dois contratos.", relations: "Facade · Bridge · Proxy" },
  { id: "bridge", name: "Bridge", category: "structural", categoryLabel: "Estruturais", summary: "Separa uma abstração da implementação para que ambas evoluam independentemente.", problem: "Uma hierarquia combina dimensão de domínio e dimensão de infraestrutura, gerando muitas subclasses.", solution: "Divida as duas dimensões e faça a abstração delegar para uma implementação.", example: "Relatório e canal de entrega evoluem sem criar uma classe para cada combinação.", applicability: "Use quando duas dimensões variam em ritmos diferentes ou quando herança gera explosão combinatória.", tradeoffs: "Reduz combinações, mas exige interfaces e composição bem nomeadas.", relations: "Adapter · Strategy · State" },
  { id: "composite", name: "Composite", category: "structural", categoryLabel: "Estruturais", summary: "Compõe objetos em árvores e permite tratar folha e contêiner pelo mesmo contrato.", problem: "O cliente precisa distinguir grupos e itens individuais para executar a mesma operação.", solution: "Defina um componente comum e faça o contêiner delegar recursivamente para seus filhos.", example: "Permissões, pastas, menus ou componentes de uma tela organizados em árvore.", applicability: "Use quando a hierarquia parte-todo é central e operações devem atravessar a árvore.", tradeoffs: "Simplifica clientes, mas pode tornar o contrato amplo demais para folhas.", relations: "Iterator · Visitor · Builder" },
  { id: "decorator", name: "Decorator", category: "structural", categoryLabel: "Estruturais", summary: "Adiciona responsabilidades a um objeto por composição, sem criar uma subclasse para cada combinação.", problem: "Herança gera muitas variantes e mudanças de comportamento precisam ser combináveis em runtime.", solution: "Envolva o componente por objetos que respeitam o mesmo contrato e delegam com comportamento adicional.", example: "Adicionar métricas, retry e autorização a um client HTTP sem alterar o client base.", applicability: "Use quando responsabilidades opcionais precisam ser empilhadas ou removidas dinamicamente.", tradeoffs: "Flexível e aderente a SRP, mas a ordem das camadas pode ficar difícil de rastrear.", relations: "Chain of Responsibility · Proxy · Composite" },
  { id: "facade", name: "Facade", category: "structural", categoryLabel: "Estruturais", summary: "Oferece uma interface simples para um subsistema complexo.", problem: "Clientes conhecem detalhes demais e repetem a mesma sequência de chamadas de infraestrutura.", solution: "Crie uma fronteira orientada ao caso de uso que coordene o subsistema internamente.", example: "CheckoutFacade coordena estoque, pagamento, pedido e notificação.", applicability: "Use para reduzir acoplamento e preservar uma API de caso de uso estável.", tradeoffs: "Reduz complexidade externa, mas uma fachada pode virar um objeto grande se acumular regras.", relations: "Adapter · Mediator · Singleton" },
  { id: "flyweight", name: "Flyweight", category: "structural", categoryLabel: "Estruturais", summary: "Compartilha estado intrínseco entre muitos objetos para reduzir consumo de memória.", problem: "Milhões de objetos carregam a mesma parte imutável e a aplicação desperdiça recursos.", solution: "Separe estado compartilhável de estado contextual e reutilize instâncias por uma chave.", example: "Ícones, tokens ou metadados de catálogo compartilhados entre muitos tenants.", applicability: "Use depois de medir memória e confirmar repetição significativa de estado imutável.", tradeoffs: "Pode economizar memória, mas aumenta a complexidade e exige separar contexto com precisão.", relations: "Singleton · Proxy · Factory Method" },
  { id: "proxy", name: "Proxy", category: "structural", categoryLabel: "Estruturais", summary: "Fornece um substituto que controla o acesso ao objeto real.", problem: "Acesso direto precisa de lazy loading, autorização, cache, logging ou proteção de rede.", solution: "Implemente o mesmo contrato e intercepte a chamada antes ou depois de delegar.", example: "Um proxy de repositório valida tenant e registra latência antes de acessar o banco.", applicability: "Use em fronteiras de acesso, recursos remotos, caros ou sensíveis.", tradeoffs: "Centraliza controle, mas pode esconder custo de rede e criar efeitos inesperados.", relations: "Decorator · Adapter · Facade" },
  { id: "chain-of-responsibility", name: "Chain of Responsibility", category: "behavioral", categoryLabel: "Comportamentais", summary: "Passa uma solicitação por uma cadeia de handlers até que um deles processe ou encaminhe.", problem: "Um único objeto conhece todas as regras e cresce com cada nova condição de tratamento.", solution: "Separe handlers pequenos e permita que cada um processe ou delegue ao próximo.", example: "Pipeline de autenticação, autorização, rate limit e validação de payload.", applicability: "Use quando a ordem de tratamento pode variar e o remetente não deve conhecer o receptor.", tradeoffs: "Flexível e extensível, mas a resposta pode ser difícil de rastrear se a cadeia for longa.", relations: "Command · Decorator · Mediator" },
  { id: "command", name: "Command", category: "behavioral", categoryLabel: "Comportamentais", summary: "Transforma uma solicitação em um objeto que pode ser armazenado, enfileirado ou desfeito.", problem: "O invocador está acoplado ao método concreto e não consegue adiar ou registrar a ação.", solution: "Encapsule ação, parâmetros e contexto em um comando com execução explícita.", example: "Jobs de processamento, auditoria e retry de operações administrativas.", applicability: "Use quando precisa de fila, histórico, undo, auditoria ou execução desacoplada.", tradeoffs: "Facilita rastreabilidade, mas cria objetos e estados de execução adicionais.", relations: "Memento · Observer · Chain of Responsibility" },
  { id: "iterator", name: "Iterator", category: "behavioral", categoryLabel: "Comportamentais", summary: "Percorre uma coleção sem expor sua estrutura interna.", problem: "Cada cliente conhece a estrutura da coleção e repete lógica de travessia.", solution: "Exponha um cursor ou protocolo uniforme de iteração.", example: "Percorrer resultados paginados sem revelar se a origem é banco, cache ou API.", applicability: "Use quando coleções têm estruturas diferentes ou quando a travessia precisa de política própria.", tradeoffs: "Isola representação, mas pode gerar alocações e estados de cursor.", relations: "Composite · Memento · Visitor" },
  { id: "mediator", name: "Mediator", category: "behavioral", categoryLabel: "Comportamentais", summary: "Centraliza a coordenação entre objetos que poderiam criar dependências cruzadas.", problem: "Componentes conversam diretamente e formam uma rede difícil de alterar.", solution: "Faça os componentes notificarem um mediador com regras de coordenação explícitas.", example: "Orquestrador de checkout coordenando formulário, estoque e pagamento.", applicability: "Use quando muitos objetos dependem uns dos outros e há uma política central de interação.", tradeoffs: "Reduz acoplamento lateral, mas o mediador pode virar um novo objeto complexo.", relations: "Facade · Observer · Command" },
  { id: "memento", name: "Memento", category: "behavioral", categoryLabel: "Comportamentais", summary: "Salva e restaura o estado de um objeto sem expor seus detalhes internos.", problem: "Undo, rollback local ou snapshot exige acessar campos privados do objeto.", solution: "O próprio objeto cria um snapshot e um caretaker decide quando armazená-lo.", example: "Rascunho de configuração que pode ser revertido antes de publicar.", applicability: "Use quando o estado precisa de restauração e os invariantes devem continuar protegidos.", tradeoffs: "Preserva encapsulamento, mas snapshots podem consumir memória e ficar obsoletos.", relations: "Command · Prototype · Iterator" },
  { id: "observer", name: "Observer", category: "behavioral", categoryLabel: "Comportamentais", summary: "Notifica assinantes quando o estado ou evento de um objeto muda.", problem: "O produtor conhece consumidores específicos e cada novo consumidor exige alteração no produtor.", solution: "Defina uma assinatura explícita e publique eventos para observadores independentes.", example: "Mudança de pedido dispara atualização de projeção, e-mail e métricas.", applicability: "Use para eventos assíncronos ou reações múltiplas, com contrato de entrega bem definido.", tradeoffs: "Desacopla produtores, mas aumenta a dificuldade de ordenar, depurar e repetir eventos.", relations: "Mediator · State · Chain of Responsibility" },
  { id: "state", name: "State", category: "behavioral", categoryLabel: "Comportamentais", summary: "Permite alterar o comportamento de um objeto quando seu estado interno muda.", problem: "Condicionais de estado crescem e misturam transições com regras de cada estado.", solution: "Modele cada estado como um objeto e delegue comportamento e transições.", example: "Pedido com estados draft, approved, paid, cancelled e regras diferentes por fase.", applicability: "Use quando há estados relevantes, transições claras e comportamento dependente da fase.", tradeoffs: "Organiza máquinas de estado, mas pode ser excesso para poucas transições simples.", relations: "Strategy · Bridge · Memento" },
  { id: "strategy", name: "Strategy", category: "behavioral", categoryLabel: "Comportamentais", summary: "Define uma família de algoritmos intercambiáveis sob um contrato comum.", problem: "Uma classe acumula ifs para cada política ou algoritmo e fica difícil de testar.", solution: "Extraia cada algoritmo para uma estratégia e injete a escolha no contexto.", example: "Cálculo de frete, roteamento ou política de cobrança por tenant.", applicability: "Use quando variantes de uma decisão mudam independentemente do fluxo principal.", tradeoffs: "Facilita extensão e testes, mas adiciona objetos e uma decisão de composição.", relations: "State · Bridge · Factory Method" },
  { id: "template-method", name: "Template Method", category: "behavioral", categoryLabel: "Comportamentais", summary: "Define o esqueleto de um algoritmo e deixa etapas variáveis para subclasses ou hooks.", problem: "Fluxos parecidos duplicam a sequência geral e divergem nos detalhes.", solution: "Fixe a ordem do algoritmo e ofereça pontos de extensão controlados.", example: "Pipeline de importação que mantém validação e observabilidade, mas muda a leitura por formato.", applicability: "Use quando a sequência é estável e poucas etapas variam.", tradeoffs: "Reutiliza o fluxo, mas herança pode limitar composição e acoplar subclasses à base.", relations: "Factory Method · Strategy · Command" },
  { id: "visitor", name: "Visitor", category: "behavioral", categoryLabel: "Comportamentais", summary: "Separa operações de uma estrutura de objetos para adicionar comportamentos sem alterar suas classes.", problem: "Uma hierarquia está estável, mas novas operações fariam todas as classes crescerem.", solution: "Defina um visitante com uma operação por tipo e aceite-o nos elementos.", example: "Exportar diferentes nós de uma árvore de domínio para relatório ou auditoria.", applicability: "Use quando a estrutura varia pouco e as operações sobre ela variam muito.", tradeoffs: "Facilita novas operações, mas torna novos tipos de elemento mais custosos.", relations: "Composite · Iterator · Memento" },
].map((pattern) => ({
  ...pattern,
  purpose: pattern.summary,
  structure: `Contrato estável para o cliente + parte variável isolada em composição, herança ou delegação. Em ${pattern.name}, a estrutura deve tornar explícito o que muda e o que permanece.`,
  implementation: "Comece pelo caso concreto que já existe, extraia apenas a variação observada, cubra o contrato com testes e registre o trade-off na issue.",
  benefits: "Torna a decisão nomeável, facilita revisão e diminui o custo de mudar a parte variável sem espalhar conhecimento pelo sistema.",
  code: pattern.code ?? `# ${pattern.name}\n\n1. Identifique a variação em ${pattern.example}\n2. Extraia o contrato comum e uma implementação pequena.\n3. Cubra o comportamento e registre a decisão na issue.`,
  language: pattern.code ? "javascript" : "markdown",
  title: pattern.code ? `${pattern.id}.js` : `${pattern.id}.md`,
  sourceUrl: `https://refactoring.guru/pt-br/design-patterns/${pattern.id}`,
  refs: ["refactoring-patterns", "refactoring-pattern-structure", "gof"],
}));

const solidPrinciples = [
  { id: "single-responsibility", name: "Single Responsibility Principle", acronym: "S", summary: "Uma unidade de código deve ter um motivo principal para mudar.", problem: "Uma classe reúne regras de negócio, persistência, apresentação e integração, fazendo mudanças diferentes colidirem.", rule: "Separe responsabilidades que mudam por razões diferentes e mantenha cada fronteira com um contrato claro.", example: "OrderService calcula o pedido; OrderRepository persiste; NotificationPublisher comunica a mudança.", tradeoffs: "Pode criar mais arquivos, mas torna testes, ownership e mudança mais localizados." },
  { id: "open-closed", name: "Open/Closed Principle", acronym: "O", summary: "Módulos devem aceitar extensão sem exigir alterações frequentes no código estável.", problem: "Cada novo tipo exige editar um switch central e reabrir uma área que já funcionava.", rule: "Encontre o eixo de variação, defina uma abstração e adicione novos comportamentos atrás dela.", example: "Adicionar uma estratégia de cálculo de frete sem editar o checkout principal.", tradeoffs: "Reduz regressões, mas abstrações prematuras podem esconder um domínio que ainda não amadureceu." },
  { id: "liskov-substitution", name: "Liskov Substitution Principle", acronym: "L", summary: "Implementações de um contrato devem poder substituir a abstração sem quebrar expectativas válidas.", problem: "Subclasses lançam exceções inesperadas, ignoram pré-condições ou devolvem semântica diferente.", rule: "Modele contratos que todas as implementações realmente conseguem cumprir e teste invariantes.", example: "Um repositório de leitura não promete escrita só porque outra implementação promete.", tradeoffs: "Contratos mais honestos podem resultar em interfaces menores e menos hierarquia." },
  { id: "interface-segregation", name: "Interface Segregation Principle", acronym: "I", summary: "Clientes não devem depender de métodos que não usam.", problem: "Uma interface grande força adaptadores e implementações a carregarem capacidades irrelevantes.", rule: "Separe interfaces por papel do cliente e faça cada dependência pedir apenas o que precisa.", example: "ReadOnlyCatalog e CatalogWriter em vez de uma interface única de catálogo.", tradeoffs: "Diminui acoplamento, mas exige cuidar do número e do vocabulário das interfaces." },
  { id: "dependency-inversion", name: "Dependency Inversion Principle", acronym: "D", summary: "Regras de alto nível e detalhes devem depender de abstrações estáveis, não uns dos outros.", problem: "A regra de negócio importa SDK, banco ou framework e fica difícil testar sem infraestrutura.", rule: "Defina ports próximos ao caso de uso e injete adapters nos limites.", example: "Checkout depende de PaymentGateway; StripeAdapter implementa esse contrato fora do domínio.", tradeoffs: "Aumenta testabilidade e substituição, mas requer disciplina para não criar abstrações vazias." },
].map((principle) => ({ ...principle, sourceUrl: "https://refactoring.guru/pt-br/design-patterns/book", refs: ["refactoring-solid", "clean-code", "clean-architecture"] }));

const cleanCodePrinciples = [
  { id: "meaningful-names", name: "Meaningful names", summary: "Nomes devem revelar intenção, contexto e unidade.", example: "expiresAt comunica mais que value2; tenantId comunica escopo que id não comunica." },
  { id: "small-functions", name: "Small functions", summary: "Funções pequenas, com uma responsabilidade e baixo nível de abstração por vez.", example: "Separar validarPedido, calcularTotal e persistirPedido em vez de um método com 80 linhas." },
  { id: "single-level-of-abstraction", name: "Single level of abstraction", summary: "Um método deve contar uma história em um nível de detalhe coerente.", example: "O caso de uso coordena; o parser e o repositório escondem detalhes próprios." },
  { id: "error-handling", name: "Error handling", summary: "Erros devem ser tratados com contexto, contratos claros e sem esconder falhas.", example: "Mapear timeout de pagamento para erro de domínio observável e preservado no log." },
  { id: "comments", name: "Comments with a job", summary: "Comentários explicam intenção, restrição ou contexto que o código não consegue expressar.", example: "Registrar por que uma janela de rate limit existe, não narrar o que a linha já diz." },
  { id: "duplication", name: "One source of truth", summary: "Duplicação cria pontos de mudança que podem divergir silenciosamente.", example: "Centralizar regra de tenant isolation em uma policy testada, não repetir if em handlers." },
  { id: "boundaries", name: "Clean boundaries", summary: "Dependências e integrações devem ter fronteiras nomeadas e substituíveis.", example: "SDK externo atrás de um adapter, com contrato próprio e testes de contrato." },
  { id: "tests-as-documentation", name: "Tests as documentation", summary: "Testes legíveis registram comportamento, limites e intenção do sistema.", example: "Um teste nomeado mostra que um tenant nunca lê dados de outro tenant." },
  { id: "formatting", name: "Consistent formatting", summary: "Formato consistente reduz ruído visual e deixa a revisão focar na decisão.", example: "Lint e formatter automatizados na pipeline, sem debate manual sobre estilo." },
  { id: "boy-scout-rule", name: "Leave the code better", summary: "Ao tocar uma área, faça uma melhoria pequena e verificável sem ampliar o escopo sem controle.", example: "Extrair um nome ruim enquanto implementa a issue, registrando a mudança no comentário." },
].map((principle) => ({ ...principle, problem: "Código difícil de ler aumenta tempo de validação, risco de regressão e custo de onboarding.", tradeoffs: "Clareza é uma decisão contínua; não justifica abstração ornamental nem refactoring sem evidência.", sourceUrl: "https://refactoring.guru/pt-br/refactoring", refs: ["clean-code", "refactoring", "refactoring-guru"] }));

const smellGroups = [
  { group: "Bloaters", names: ["Long Method", "Large Class", "Primitive Obsession", "Long Parameter List", "Data Clumps"] },
  { group: "Object-Orientation Abusers", names: ["Switch Statements", "Temporary Field", "Refused Bequest", "Alternative Classes with Different Interfaces"] },
  { group: "Change Preventers", names: ["Divergent Change", "Shotgun Surgery", "Parallel Inheritance Hierarchies"] },
  { group: "Dispensables", names: ["Comments", "Duplicate Code", "Lazy Class", "Data Class", "Dead Code", "Speculative Generality"] },
  { group: "Couplers", names: ["Feature Envy", "Inappropriate Intimacy", "Message Chains", "Middle Man"] },
  { group: "Other Smells", names: ["Incomplete Library Class"] },
];
const refactoringSmells = smellGroups.flatMap(({ group, names }) => names.map((name) => ({
  id: `smell-${slugify(name)}`,
  name,
  group,
  symptom: `O código apresenta o sintoma ${name} e fica mais difícil de entender, testar ou mudar com segurança.`,
  response: "Confirme o comportamento com testes, escolha uma refactoring pequena e observe se o acoplamento ou a duplicação realmente diminuem.",
  sourceUrl: "https://refactoring.guru/pt-br/refactoring/smells",
  refs: ["refactoring-smells", "refactoring", "clean-code"],
})));

const techniqueGroups = [
  { group: "Composing Methods", names: ["Extract Method", "Inline Method", "Extract Variable", "Inline Temp", "Replace Temp with Query", "Split Temporary Variable", "Remove Assignments to Parameters", "Replace Method with Method Object", "Substitute Algorithm"] },
  { group: "Moving Features between Objects", names: ["Move Method", "Move Field", "Extract Class", "Inline Class", "Hide Delegate", "Remove Middle Man", "Introduce Foreign Method", "Introduce Local Extension"] },
  { group: "Organizing Data", names: ["Change Value to Reference", "Change Reference to Value", "Duplicate Observed Data", "Self Encapsulate Field", "Replace Data Value with Object", "Replace Array with Object", "Change Unidirectional Association to Bidirectional", "Change Bidirectional Association to Unidirectional", "Encapsulate Field", "Encapsulate Collection", "Replace Magic Number with Symbolic Constant", "Replace Type Code with Class", "Replace Type Code with Subclasses", "Replace Type Code with State/Strategy", "Replace Subclass with Fields"] },
  { group: "Simplifying Conditional Expressions", names: ["Consolidate Conditional Expression", "Consolidate Duplicate Conditional Fragments", "Decompose Conditional", "Replace Conditional with Polymorphism", "Remove Control Flag", "Replace Nested Conditional with Guard Clauses", "Introduce Null Object", "Introduce Assertion"] },
  { group: "Simplifying Method Calls", names: ["Add Parameter", "Remove Parameter", "Rename Method", "Separate Query from Modifier", "Parameterize Method", "Introduce Parameter Object", "Preserve Whole Object", "Remove Setting Method", "Replace Parameter with Explicit Methods", "Replace Parameter with Method Call", "Hide Method", "Replace Constructor with Factory Method", "Replace Error Code with Exception", "Replace Exception with Test"] },
  { group: "Dealing with Generalization", names: ["Pull Up Field", "Pull Up Method", "Pull Up Constructor Body", "Push Down Field", "Push Down Method", "Extract Subclass", "Extract Superclass", "Extract Interface", "Collapse Hierarchy", "Form Template Method", "Replace Inheritance with Delegation", "Replace Delegation with Inheritance"] },
];
const refactoringTechniques = techniqueGroups.flatMap(({ group, names }) => names.map((name) => ({
  id: `technique-${slugify(name)}`,
  name,
  group,
  symptom: `A técnica ${name} responde a uma forma recorrente de acoplamento, duplicação ou complexidade estrutural.`,
  response: "Faça uma mudança pequena, mantenha o comportamento coberto por testes e pare quando a evidência mostrar que o custo caiu.",
  sourceUrl: "https://refactoring.guru/pt-br/refactoring/techniques",
  refs: ["refactoring-techniques", "refactoring", "clean-code"],
})));

const codeExamples = {
  1: { language: "javascript", title: "rate-limit.js", code: String.raw`const windows = new Map();

export function allowRequest(actorId, now = Date.now()) {
  const windowStart = Math.floor(now / 60_000) * 60_000;
  const key = actorId + ":" + windowStart;
  const count = (windows.get(key) ?? 0) + 1;
  windows.set(key, count);
  return count <= 60;
}` },
  2: { language: "javascript", title: "cache.js", code: String.raw`const cache = new Map();

export async function getCatalog(load, now = Date.now()) {
  const hit = cache.get("catalog");
  if (hit && hit.expiresAt > now) return hit.value;
  const value = await load();
  cache.set("catalog", { value, expiresAt: now + 60_000 });
  return value;
}` },
  14: { language: "javascript", title: "idempotency.js", code: String.raw`export async function createOnce(key, store, create) {
  const previous = await store.get(key);
  if (previous) return previous;
  const result = await create();
  await store.put(key, result);
  return result;
}` },
  25: { language: "sql", title: "database-index.sql", code: String.raw`CREATE INDEX idx_orders_tenant_created
  ON orders (tenant_id, created_at DESC);

SELECT *
FROM orders
WHERE tenant_id = :tenant_id
ORDER BY created_at DESC;` },
  36: { language: "sql", title: "optimistic-lock.sql", code: String.raw`UPDATE invoices
SET status = :next_status,
    version = version + 1
WHERE id = :id
  AND tenant_id = :tenant_id
  AND version = :expected_version;

-- zero rows means: someone changed it first` },
  51: { language: "javascript", title: "feature-flag.js", code: String.raw`export function isEnabled(flags, tenantId, name) {
  return flags[name]?.tenants?.includes(tenantId) === true;
}

if (isEnabled(flags, actor.tenantId, "new-checkout")) {
  return renderNewCheckout();
}
return renderLegacyCheckout();` },
  63: { language: "yaml", title: "slo.yaml", code: String.raw`service: checkout
window: 30d
indicator:
  type: availability
  target: 99.9%
error_budget:
  action: pause-risky-releases` },
  78: { language: "javascript", title: "parameterized-query.js", code: String.raw`const result = await db.query(
  "SELECT * FROM users WHERE email = $1",
  [input.email]
);

// Never concatenate input into SQL.` },
  84: { language: "bash", title: "backup-check.sh", code: String.raw`#!/usr/bin/env bash
set -euo pipefail

backup="backups/latest.sql"
test -s "$backup"
pg_restore --list "$backup" >/dev/null
echo "backup is readable"` },
  103: { language: "text", title: "semver.txt", code: String.raw`MAJOR.MINOR.PATCH

MAJOR: contrato incompatível
MINOR: capacidade compatível nova
PATCH: correção compatível` },
  109: { language: "markdown", title: "incident-comment.md", code: String.raw`[INCIDENT]
- Impacto:
- Início / detecção:
- Hipótese atual:
- Mitigação segura:
- Próxima atualização:
- Owner:` },
};

function buildApplication(concept) {
  const specific = codeExamples[concept.number];
  const code = specific ?? {
    language: "markdown",
    title: `${concept.term}.md`,
    code: `# ${concept.term}\n\n1. Contexto: ${concept.example}\n2. Verificação: observe o sintoma descrito em "${concept.problem}".\n3. Ação: aplique a prática recomendada e registre a evidência.`,
  };
  const relatedNumbers = [concept.number > 1 ? concept.number - 1 : 2, concept.number < 111 ? concept.number + 1 : 110];
  const related = relatedNumbers.map((number) => {
    const [term] = termMap[number];
    return { number, term };
  });
  const tradeoffs = concept.level === "BASE"
    ? "Comece pequeno: meça o efeito e mantenha um rollback claro antes de ampliar a solução."
    : concept.level === "CRESCIMENTO"
      ? "Introduza quando carga, integração ou equipe justificarem o custo operacional."
      : "Trate como decisão de arquitetura: documente falhas aceitas, operação, custo e recuperação.";
  const steps = [
    `Defina o contexto: ${concept.example}`,
    `Observe o problema: ${concept.problem}`,
    `Implemente a prática: ${concept.practice.split(".")[0]}.`,
    "Rode a menor evidência que prova o comportamento e registre o resultado na issue.",
  ];
  return {
    didactic: {
      purpose: concept.what,
      problem: concept.problem,
      solution: concept.practice,
      structure: `Contexto: ${concept.example} → decisão: ${concept.practice.split(".")[0]}. → evidência: ${concept.level === "AVANÇADO" ? "teste de integração, risco e recuperação" : "teste do comportamento e limites principais"}.`,
      example: concept.example,
      applicability: concept.level === "BASE"
        ? "Use quando o sintoma já aparece no fluxo atual e a mudança puder ser validada com uma evidência pequena."
        : "Use quando carga, integração, risco ou operação justificarem o custo; não introduza só por preferência arquitetural.",
      how: steps.join(" "),
      implementation: `Comece com ${code.title}, rode a evidência mínima e anexe o resultado à issue antes de ampliar a solução.`,
      benefits: `Torna ${concept.term} uma decisão observável, com um critério de aceite claro e uma próxima ação que cabe na issue.`,
      code: code.code,
      tradeoffs,
      antiRefactoring: `Não aplique ${concept.term} como ritual. Se o contexto não apresenta o problema descrito, mantenha a solução menor e registre a decisão.`,
      related: related.map(({ number, term }) => `${String(number).padStart(3, "0")} ${term}`).join(" · "),
      source: "refactoring-guru",
    },
    steps,
    code: code.code,
    language: code.language,
    title: code.title,
    hasSpecificCode: Boolean(specific),
    related,
  };
}

const concepts = parsePdfConcepts().map((concept) => {
  const [term, gloss] = termMap[concept.number];
  const [block, blockTitle] = blockFor(concept.number);
  return {
    ...concept,
    term,
    gloss,
    block,
    blockTitle,
    keywords: [concept.sourceTitle, term, gloss, blockTitle].join(" "),
    refs: referenceMap[concept.number],
    application: buildApplication({ ...concept, term, gloss, blockTitle }),
  };
});

if (concepts.length !== 111 || concepts.some((concept) => !concept.refs?.length || !concept.application?.steps?.length)) {
  throw new Error("Dados editoriais incompletos: cada conceito precisa de termo, bibliografia e aplicação");
}
if (patternCatalog.length !== 22 || solidPrinciples.length !== 5 || !cleanCodePrinciples.length || !refactoringSmells.length || !refactoringTechniques.length) {
  throw new Error("Catálogo Refactoring.Guru incompleto");
}

const content = { references, concepts, workflowStages, workflowBranches, issueCommentTemplate, improvementAgents, didacticTemplate, harnessArtifacts, effortLevels, modelOptions, architectureTracks, refactoringSources, patternCatalog, solidPrinciples, cleanCodePrinciples, refactoringSmells, refactoringTechniques };
const output = `// Generated from the attached Guia_111_Conceitos_Desenvolvedor_Iniciante.pdf\nexport const content = ${JSON.stringify(content, null, 2)};\n`;
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output);
console.log(`OK: ${concepts.length} conceitos e ${references.length} referências gravados em ${outputPath}`);
