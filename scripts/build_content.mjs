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
  { eyebrow: "Gangue dos Quatro", title: "Design Patterns", body: "Um vocabulário para reconhecer soluções recorrentes e discutir trade-offs sem transformar o padrão em receita. Use Adapter, Strategy, Factory, Observer e outros quando o contexto pedir.", refs: ["gof"] },
  { eyebrow: "Uncle Bob", title: "Clean Code", body: "Nomes claros, funções pequenas, dependências explícitas, testes legíveis e refatoração contínua reduzem o custo de mudar o sistema.", refs: ["clean-code", "refactoring"] },
  { eyebrow: "Arquitetura", title: "Clean Architecture + DDD", body: "Separe regras de negócio de detalhes de entrega, mantenha fronteiras explícitas e modele o domínio antes de espalhar complexidade entre frameworks.", refs: ["clean-architecture", "ddd"] },
  { eyebrow: "Qualidade", title: "Design que aguenta mudança", body: "A arquitetura serve ao fluxo de entrega: contratos verificáveis, observabilidade, testes e uma estratégia de release que permita recuperar o sistema.", refs: ["release-it", "sre"] },
];

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
  };
});

if (concepts.length !== 111 || concepts.some((concept) => !concept.refs?.length)) {
  throw new Error("Dados editoriais incompletos: cada conceito precisa de termo e bibliografia");
}

const content = { references, concepts, workflowStages, effortLevels, modelOptions, architectureTracks };
const output = `// Generated from the attached Guia_111_Conceitos_Desenvolvedor_Iniciante.pdf\nexport const content = ${JSON.stringify(content, null, 2)};\n`;
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output);
console.log(`OK: ${concepts.length} conceitos e ${references.length} referências gravados em ${outputPath}`);
