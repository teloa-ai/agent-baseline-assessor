# Línea base de seguridad de identidad y autorización para agentes empresariales

Autor: Max · 2026-10-07

## Prólogo

Esta línea base establece los requisitos de seguridad en materia de identidad y autorización que deben cumplir los agentes en entornos empresariales. Los requisitos se organizan en diez capítulos, primero según el orden en que ocurre una acción del agente y después según los objetos que persisten entre sesiones. Cada requisito puede verificarse de forma independiente y se clasifica en tres niveles, de L1 a L3.

El principio rector que atraviesa todos los requisitos es la mínima autonomía (least agency): dar al Agente únicamente el alcance de acción y el grado de autonomía que necesita para completar el trabajo de negocio. El mínimo privilegio controla a qué puede acceder el Agente; la mínima autonomía controla, además, qué puede decidir por sí mismo y durante cuánto tiempo puede operar sin supervisión humana.

Esta línea base puede utilizarse de tres maneras.

- Construcción de plataformas: fijar el nivel objetivo, implementar requisito por requisito y utilizar los requisitos tanto como insumo de diseño como casos de prueba.
- Evaluación de proveedores: utilizar los requisitos como cuestionario, solicitando al proveedor que explique, requisito por requisito, cómo lo implementa y que aporte evidencias.
- Revisión de seguridad: seleccionar los requisitos aplicables según sus condiciones, verificarlos uno a uno y registrar las conclusiones en la matriz de evaluación que la acompaña.

La versión vigente es la v1.0. Su estructura toma como referencia OWASP ASVS 5.0, y los identificadores de los requisitos tienen el formato «V capítulo.sección.número», por ejemplo V4.2.1. Al citar esta línea base, indique el número de versión.

## 1. Alcance

Esta línea base se aplica a las plataformas de agentes y a los Harness desplegados o adquiridos por la empresa. Regula únicamente en nombre de quién, con qué autorización, a través de qué ruta accede el Agente a los recursos y qué produce como resultado. El aislamiento de la ejecución, el control de salida y el control de salidas son medios de ejecución para hacer efectiva la autorización, y por ello también se incluyen en esta línea base.

Objetos de aplicación:

- Plataformas de agentes y aplicaciones de Agente desarrolladas internamente
- Plataformas de agentes SaaS adquiridas, así como Agentes integrados en productos SaaS
- Agentes que se ejecutan en los terminales de los empleados, como agentes de programación, asistentes de escritorio y extensiones de navegador
- Modalidades de entrega en despliegue privado y en SaaS

Fuera del alcance:

- La gobernanza de datos del entrenamiento y ajuste fino de modelos, la robustez de los modelos y los ejemplos adversarios; véanse OWASP AISVS y CSA AICM
- La seguridad de los contenidos y la precisión de las salidas, como alucinaciones, sesgos y contenidos dañinos
- El diseño del control de acceso de los sistemas empresariales posteriores; esta línea base solo exige que dichos sistemas puedan recibir y validar la identidad del usuario transmitida al acceder en su representación
- La seguridad de infraestructura general, como el endurecimiento de hosts, el perímetro de red y la gestión de vulnerabilidades, que se aplica según la línea base existente de la empresa

Los requisitos se redactan con la plataforma como sujeto. En los escenarios de adquisición, la empresa usuaria verifica al proveedor conforme a los requisitos. En los requisitos, «empresa» designa a la parte usuaria, «plataforma» designa al sistema que proporciona las capacidades del Agente, y «proveedor» designa al desarrollador u operador de la plataforma.

## 2. Referencias normativas y documentos de referencia

Los documentos que un requisito cita expresamente, sin las expresiones «como» u «o equivalente», se consideran referencias normativas y deben aplicarse conforme a lo que establecen al implementar el requisito. Los demás documentos se usan únicamente para la correspondencia y como antecedentes.

| Documento | Organismo emisor | Estado | Carácter | Uso en esta línea base |
| --- | --- | --- | --- | --- |
| [RFC 6749, marco de autorización OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749) | IETF | RFC formal | Normativo | Autorización de usuarios y tokens de acceso (V4.3) |
| [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) | OpenID Foundation | Especificación final | Normativo | Inicio de sesión mediante IdP empresarial (V1.1.1) |
| SAML 2.0 | OASIS | Estándar formal | Normativo | Inicio de sesión mediante IdP empresarial (V1.1.1) |
| [RFC 8693, OAuth 2.0 Token Exchange](https://www.rfc-editor.org/rfc/rfc8693) | IETF | RFC formal | Normativo | Acceso en representación del usuario, cadenas de delegación y declaración act |
| [RFC 9449, OAuth 2.0 Demonstrating Proof of Possession (DPoP)](https://www.rfc-editor.org/rfc/rfc9449) | IETF | RFC formal | Normativo | Vinculación del token con el emisor (V4.6.2) |
| [RFC 8705, OAuth 2.0 Mutual-TLS Client Authentication and Certificate-Bound Access Tokens](https://www.rfc-editor.org/rfc/rfc8705) | IETF | RFC formal | Normativo | Vinculación del token con el emisor (V4.6.2) |
| [RFC 7489, DMARC](https://www.rfc-editor.org/rfc/rfc7489) | IETF | RFC informativa | Normativo | Verificación del remitente en el canal de correo electrónico (V1.2.6) |
| [Especificación de Model Context Protocol 2026-07-28](https://modelcontextprotocol.io/specification/versioning) | Proyecto MCP | Versión vigente | Normativo | Invocación y autorización de MCP (V4.5) |
| [RFC 9470, OAuth 2.0 Step Up Authentication Challenge Protocol](https://www.rfc-editor.org/rfc/rfc9470) | IETF | RFC formal | Informativa | Momento y fortaleza de la autenticación para la autenticación reforzada (step-up) (V1.1.3, V3.5) |
| [RFC 8707, Resource Indicators for OAuth 2.0](https://www.rfc-editor.org/rfc/rfc8707) | IETF | RFC formal | Informativa | Limitación de la audiencia del token (V4.5.5, V4.6.3) |
| [RFC 9700, OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700) | IETF | BCP | Informativa | Requisitos de seguridad para implementaciones de OAuth |
| RFC 7643 y RFC 7644, SCIM | IETF | RFC formal | Informativa | Sincronización y deshabilitación de usuarios y grupos (V1.1.2) |
| [OpenID Shared Signals Framework 1.0](https://openid.net/wg/sharedsignals/) | OpenID Foundation | Especificación final (septiembre de 2025) | Informativa | Transmisión de eventos de seguridad |
| [OpenID Continuous Access Evaluation Profile (CAEP) 1.0](https://openid.net/specs/openid-caep-1_0-final.html) | OpenID Foundation | Especificación final (septiembre de 2025) | Informativa | Revocación de sesiones y señales de riesgo (V3.5.2, V10.4.4) |
| [RFC 9396, OAuth 2.0 Rich Authorization Requests](https://www.rfc-editor.org/rfc/rfc9396) | IETF | RFC formal | Informativa | Descripción de autorizaciones detalladas (V2.2.6) |
| [Identity Assertion JWT Authorization Grant (ID-JAG), borrador -04](https://www.ietf.org/archive/id/draft-ietf-oauth-identity-assertion-authz-grant-04.html) | Grupo de trabajo OAuth de la IETF | Borrador de grupo de trabajo | Informativa | Obtención de tokens posteriores a través del IdP empresarial, es decir, Cross-App Access (XAA) (V4.3.3, V4.5.4) |
| [RFC 7523, JWT Profile for OAuth 2.0 Client Authentication and Authorization Grants](https://www.rfc-editor.org/rfc/rfc7523) | IETF | RFC formal | Informativa | Concesión de autorización utilizada por ID-JAG |
| [Identity Continuation Assertion, borrador -02](https://datatracker.ietf.org/doc/draft-mcguinness-oauth-id-continuation-assertion/) | Borrador individual de la IETF | Borrador individual (septiembre de 2026) | Informativa | Continuidad de la cadena de delegación cuando el usuario no está presente |
| [Transaction Tokens, borrador -11](https://datatracker.ietf.org/doc/draft-ietf-oauth-transaction-tokens/) | Grupo de trabajo OAuth de la IETF | Borrador de grupo de trabajo | Informativa | Transmisión del contexto de autorización en la cadena de llamadas dentro del mismo dominio de confianza (V2.4.7) |
| [OpenID AuthZEN Authorization API 1.0](https://openid.net/specs/authorization-api-1_0.html) | OpenID Foundation | Especificación final (enero de 2026) | Informativa | Interfaz estándar del punto de decisión de políticas (V3.2.5) |
| [SPIFFE](https://spiffe.io/) | CNCF | Especificación de proyecto graduado | Informativa | Identidad de carga de trabajo y atestación de las instancias de ejecución (V1.4.5) |
| [Arquitectura WIMSE, borrador -08](https://datatracker.ietf.org/doc/draft-ietf-wimse-arch/) | Grupo de trabajo WIMSE de la IETF | Borrador de grupo de trabajo | Informativa | Identidad de carga de trabajo entre sistemas (V1.4) |
| [Extensión Enterprise-Managed Authorization de MCP](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization) | Proyecto MCP | Extensión oficial | Informativa | Conexión a servidores MCP mediante autorización del IdP empresarial (V4.5.4) |
| [NIST SP 800-207, arquitectura de confianza cero](https://csrc.nist.gov/pubs/sp/800/207/final) | NIST | Publicación formal | Informativa | Verificación continua y mínimo privilegio |
| [NIST SP 800-63-4, Directrices de identidad digital](https://csrc.nist.gov/pubs/sp/800/63/4/final) | NIST | Publicación formal (julio de 2025) | Informativa | Niveles de autenticación y reautenticación |
| [NIST IR 8587, protección de tokens y aserciones frente a falsificación, robo y abuso](https://csrc.nist.gov/pubs/ir/8587/final) | NIST | Publicación formal (septiembre de 2026) | Informativa | Gestión de tokens |
| [Documento conceptual del NIST NCCoE sobre identidad y autorización de software y agentes de IA](https://www.nccoe.nist.gov/sites/default/files/2026-02/accelerating-the-adoption-of-software-and-ai-agent-identity-and-authorization-concept-paper.pdf) | NIST | Borrador para consulta (febrero de 2026) | Informativa | Marco de problemas: identificación, autenticación, autorización, delegación, auditoría e inyección de prompts |
| [Back to the Future: Why Agentic AI Needs a Strong Identity Foundation](https://www.nist.gov/blogs/cybersecurity-insights/back-future-why-agentic-ai-needs-strong-identity-foundation) | NIST | Entrada de blog del 27 de agosto de 2026 | Informativa | Principios de base de identidad y retroalimentación pública sobre el documento conceptual |
| [OWASP Top 10 for Agentic Applications for 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) | OWASP | Publicado en diciembre de 2025 | Informativa | Mapeo de riesgos, véase el Anexo A; origen de la mínima autonomía |
| [OWASP Top 10 for LLM Applications 2025](https://genai.owasp.org/llm-top-10/) | OWASP | Publicado en noviembre de 2024 | Informativa | Mapeo de riesgos, véase el Anexo A |
| [OWASP AISVS 1.0](https://owasp.org/www-project-artificial-intelligence-security-verification-standard-aisvs-docs/) | OWASP | Publicado en junio de 2026 | Informativa | Mapeo de controles, véase el Anexo B |
| [OWASP ASVS 5.0](https://owasp.org/www-project-application-security-verification-standard/) | OWASP | Publicación formal | Informativa | Estructura de esta línea base |
| [CSA AI Controls Matrix v1.1](https://cloudsecurityalliance.org/blog/2026/07/14/ai-controls-matrix-v1-1-strengthening-the-foundation-for-trustworthy-ai) | CSA | Publicado en julio de 2026 | Informativa | Mapeo de controles, véase el Anexo C |
| [Agent Frameworks, Runtimes, and Harnesses](https://www.langchain.com/blog/agent-frameworks-runtimes-and-harnesses-oh-my) | LangChain | Entrada de blog de octubre de 2025 | Informativa | Clasificación de frameworks, runtimes y Harness (4.1) |
| [The lethal trifecta for AI agents](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) | Simon Willison | Artículo de junio de 2025 | Informativa | Riesgo combinado de datos no públicos, contenido no confiable y envío hacia el exterior (V6.2, V7.5) |
| [The Dual LLM pattern](https://simonwillison.net/2023/Apr/25/dual-llm-pattern/) | Simon Willison | Artículo de abril de 2023 | Informativa | Procesamiento de contenido no confiable mediante un modelo aislado (V6.2.4) |
| [CaMeL: Defeating Prompt Injections by Design](https://arxiv.org/abs/2503.18813) | Google DeepMind y otros | Artículo de investigación de 2025 | Informativa | Separación del flujo de control y del flujo de datos (V6.2.4) |

Los documentos en forma de borrador pueden modificarse o retirarse. Al adoptarlos, téngase en cuenta la versión más reciente disponible en el momento de la implementación.

## 3. Términos y definiciones

Los siguientes términos tienen un significado específico en esta línea base y deben entenderse así cuando aparezcan en los requisitos.

| Número | Término | Definición |
| --- | --- | --- |
| 3.1 | Agente (Agent) | Sistema de IA que comprende un objetivo, invoca herramientas y completa de forma autónoma tareas de varios pasos. En el texto de esta línea base se abrevia como Agente |
| 3.2 | Harness | Capa de software que envuelve al modelo y permite al Agente percibir y actuar. Está formada por varios subsistemas: el bucle del Agente, la gestión del contexto (incluida la compresión), la capa de herramientas, los controles de seguridad (permisos, aprobaciones, hooks), la orquestación (planificación, subagentes) y las interfaces de extensión (Skills, plugins, MCP). Claude Code, Claude Agent SDK y DeepAgents pertenecen a esta categoría. Esta línea base conserva el término original en inglés |
| 3.3 | Framework | Biblioteca que ofrece abstracciones de desarrollo, como la invocación de modelos y la definición de herramientas. Por ejemplo, LangChain, OpenAI Agents SDK y Vercel AI SDK |
| 3.4 | Runtime | Infraestructura que proporciona al Agente ejecución persistente, almacenamiento del estado y recuperación ante fallos, como LangGraph o Temporal. Un Harness puede construirse sobre un runtime |
| 3.5 | Entorno de ejecución | Entorno en el que el Harness ejecuta código, comandos, archivos y operaciones de navegador, como un sandbox de contenedor, una máquina virtual o el terminal de un empleado |
| 3.6 | Plataforma | Sistema integral que ofrece capacidades para crear, ejecutar y gestionar Agentes. Incluye el Harness, el runtime, el entorno de ejecución, el punto de decisión de políticas, la pasarela de salida y el plano de gestión |
| 3.7 | Proveedor | Desarrollador u operador de la plataforma |
| 3.8 | Usuario | Persona física que tiene una identidad en el IdP empresarial y utiliza el Agente |
| 3.9 | Agente autónomo (autonomous agent) | Agente que ejecuta operaciones con su propia identidad y no actúa en representación de ningún usuario. Normalmente accede a los sistemas posteriores con identidad de aplicación, en contraposición al acceso en representación del usuario. Aquí, «autónomo» significa que opera con su propia identidad (equivalente al autonomous agent de Microsoft Entra Agent ID) y no tiene relación con el grado de autonomía al que se refiere el punto 3.29 |
| 3.10 | Delegación | Acto por el que un sujeto cede a otro sujeto una parte de sus permisos para que este los ejerza en su nombre |
| 3.11 | Acceso en representación del usuario (on-behalf-of, OBO) | El Agente accede a los sistemas posteriores con la autorización del usuario que lo inició, y el sistema posterior toma su decisión de autorización según los permisos de ese usuario. Cuando se adopta la semántica de delegación, el token identifica al mismo tiempo al usuario (sujeto) y al Agente (actor en la declaración act) |
| 3.12 | Cadena de delegación | Registro ordenado de las relaciones de delegación sucesivas desde el usuario que inicia la acción o el origen del desencadenante hasta el ejecutor actual. Corresponde a las declaraciones act anidadas de RFC 8693 |
| 3.13 | Alcance de autorización del Agente | Límite máximo de herramientas, conexiones y datos que el administrador configura para un Agente |
| 3.14 | Permisos efectivos | Permisos realmente disponibles en una invocación. En el acceso en representación del usuario, corresponden a la intersección entre los permisos vigentes del usuario que inició la acción, el alcance de autorización del Agente y el alcance declarado de la tarea (si lo hay). Para un agente autónomo, corresponden a la intersección entre su propia autorización y el alcance de autorización del Agente. Para los subagentes y Agentes posteriores, se intersecan además con el alcance de delegación del nivel superior |
| 3.15 | Tarea delegada desatendida | Tarea programada o de larga duración que el usuario crea y que se ejecuta cuando este no está presente, así como las reglas activadas por eventos que se ejecutan con la identidad de ese usuario |
| 3.16 | Punto de decisión de políticas (policy decision point, PDP) | Componente que toma decisiones de autorización a partir de la identidad, la cadena de delegación, la operación y el contexto |
| 3.17 | Pasarela de salida (egress gateway) | Única salida del Agente hacia cualquier sistema situado fuera del entorno de ejecución, incluidos los sistemas internos de la empresa y los servicios externos. Se encarga de aplicar las decisiones de autorización, inyectar credenciales y limitar la tasa de tráfico, y es el principal punto de aplicación de políticas |
| 3.18 | Identidad de carga de trabajo (workload identity) | Identidad verificable que la plataforma emite para una instancia de ejecución, compuesta por un identificador de carga de trabajo (como un SPIFFE ID) y una credencial de identidad (como X.509-SVID o JWT-SVID). Esta línea base exige que se emita por sesión y que se vincule a la instancia de ejecución. La plataforma registra en el momento de la emisión el usuario y el Agente correspondientes a la sesión, y la pasarela los consulta a partir de esa identidad |
| 3.19 | Custodia de credenciales | Los tokens y claves necesarios para acceder a los sistemas posteriores son custodiados por la plataforma y solo se inyectan en la salida de la pasarela. Ni el Agente ni el modelo acceden nunca a su valor en claro |
| 3.20 | Credencial de marcador de posición (placeholder credential) | Valor no válido que sustituye a la credencial real en el entorno de ejecución y en el contexto. La pasarela verifica el destino en la salida y luego lo sustituye por la credencial real; a este proceso se le denomina inyección de credenciales (credential injection) |
| 3.21 | Contenido no confiable | Contenido que no proviene de las políticas de la plataforma ni de la entrada del propio usuario, incluidos páginas web, correos electrónicos, archivos, respuestas de herramientas y salidas de otros Agentes |
| 3.22 | Canal (canal de interacción) | Punto de entrada por el que el usuario interactúa con el Agente, como la web, la mensajería instantánea, el correo electrónico, el IDE o la API |
| 3.23 | Producto generado | Informe, documento, código u otro resultado que el Agente genera y guarda o comparte |
| 3.24 | Memoria | Contenido que se conserva entre sesiones y que puede recuperarse posteriormente, incluidas la memoria personal y el conocimiento compartido |
| 3.25 | Operación persistente | Operación que permite al Agente seguir actuando después de terminada la sesión actual, como crear tareas programadas, reglas de activación, reglas de reenvío o Skills |
| 3.26 | Operación de alto riesgo | Operación que, según V3.1, requiere aprobación o autenticación reforzada (step-up) |
| 3.27 | Espacio de trabajo | Unidad de gestión dentro de la plataforma que aísla datos, conocimiento, credenciales y Agentes, como un inquilino (tenant), un departamento o un proyecto. No debe confundirse con el espacio de trabajo abierto en el IDE, que esta línea base denomina directorio de proyecto |
| 3.28 | Responsable | Persona física identificada que responde por la configuración, los permisos y el comportamiento de un Agente |
| 3.29 | Mínima autonomía (least agency) | Principio según el cual el Agente solo dispone del alcance de acción y del grado de autonomía mínimos necesarios para completar el trabajo de negocio. Procede de OWASP Top 10 for Agentic Applications for 2026 |
| 3.30 | Datos no públicos | Datos que, según el estándar de clasificación de datos (por niveles) de la empresa, pertenecen al nivel no público. El nivel concreto se determina por el estándar de la empresa. Corresponden a los private data de la trifecta letal (lethal trifecta) |
| 3.31 | Envío hacia el exterior | Envío de datos a destinatarios que están fuera del control de la empresa, es decir, que no están registrados como sistemas posteriores de la empresa (véase V4.2.5), como buzones de correo externos, sitios web externos y almacenamiento externo |
| 3.32 | Tarea | Trabajo que un usuario o el origen del desencadenante encomienda al Agente, desde su inicio hasta su finalización o interrupción. Puede incluir varias invocaciones del modelo y de herramientas |
| 3.33 | Punto de aplicación de políticas (policy enforcement point, PEP) | Componente que permite o rechaza una solicitud según la decisión del punto de decisión de políticas. En esta línea base lo asumen la verificación previa del Harness y la pasarela de salida |
| 3.34 | Autenticación reforzada (step-up authentication) | Reautenticación que el usuario, ya conectado, realiza antes de ejecutar una operación de alto riesgo, con una fortaleza de autenticación mayor o con un momento de autenticación más reciente. Véase RFC 9470 |
| 3.35 | Sujeto externo | Identidad de un cliente o socio que accede mediante federación de identidades y que no se encuentra en el IdP empresarial |
| 3.36 | Agente en la sombra (shadow AI agent) | Agente que no ha sido registrado ni está bajo gestión y que un empleado conecta por su cuenta a los recursos de la empresa |
| 3.37 | Cuenta de acceso de emergencia (break-glass account) | Cuenta preconfigurada que sirve para iniciar sesión en el plano de gestión cuando el IdP empresarial no está disponible |

## 4. Arquitectura de referencia y límites de confianza

El Agente está compuesto por el modelo y el Harness. La plataforma añade, fuera del Harness, la capa de identidad, el punto de decisión de políticas, la pasarela de salida, la capa de datos, el plano de gestión y la auditoría. Cada requisito de esta línea base recae sobre uno de estos componentes.

### 4.1 Capas de la pila tecnológica

&#91;Contenido incrustado: capas de la pila tecnológica del Agente · modelo, Harness, framework, runtime, entorno de ejecución\]

El Harness puede apoyarse en un framework para su desarrollo, o bien ejecutarse directamente sobre un runtime. Según la clasificación de LangChain (véase el capítulo 2), Claude Code y Claude Agent SDK son Harness, LangGraph es un runtime y LangChain es un framework. El subsistema de controles de seguridad del Harness es el punto de aplicación de la mayoría de los requisitos de V3 y V5.

### 4.2 Arquitectura de referencia de la plataforma

&#91;Contenido incrustado: arquitectura de referencia de la plataforma · componentes de confianza y partes no confiables\]

La salida del modelo es solo una solicitud, el entorno de ejecución puede verse comprometido y el contenido devuelto por los sistemas posteriores se trata como no confiable. Todo acceso al exterior solo puede hacerse a través de la pasarela de salida, y las credenciales reales solo se inyectan en la pasarela.

| Componente | Función | Supuesto de confianza | Capítulos principales |
| --- | --- | --- | --- |
| Capa de identidad | IdP empresarial, directorio, SCIM; emite las identidades de usuarios, Agentes y cargas de trabajo | Confiable | V1 |
| Canales de interacción | Web, mensajería instantánea, correo electrónico, IDE, API y otras entradas; se encargan de la asignación de identidades y del alcance visible de la salida | Confiable; el contenido que llega por canales es no confiable | V1.2, V7 |
| Harness | Bucle del Agente, gestión del contexto, capa de herramientas, controles de seguridad, orquestación, interfaces de extensión | Confiable cuando lo aloja la plataforma; no confiable cuando se ejecuta en el terminal del empleado, según V5.4 | V3, V5, V6 |
| Modelo | Genera texto y solicitudes de invocación de herramientas | No confiable; su salida es solo una solicitud | V3, V6 |
| Punto de decisión de políticas | Calcula los permisos efectivos, determina el nivel de riesgo y decide si se requiere aprobación | Confiable | V2, V3 |
| Pasarela de salida | Salida única; inyecta credenciales, verifica el destino, limita la tasa de tráfico y revoca | Confiable | V4 |
| Sistemas posteriores | SaaS accedidos, APIs internas, servidores MCP, bases de datos | Realizan su propia decisión de autorización; el contenido que devuelven es no confiable | V4 |
| Capa de datos | Base de conocimiento, RAG, memoria, productos generados | Confiable; el contenido almacenado puede estar contaminado y se trata como contenido no confiable | V8 |
| Entorno de ejecución | Ejecución de código, comandos, archivos y operaciones de navegador | No confiable; puede verse comprometido | V5 |
| Plano de gestión | Registro de Agentes, conectores, políticas gestionadas, ciclo de vida | Confiable | V9 |
| Auditoría | Registro, consulta, exportación y conservación, así como detección y respuesta | Confiable | V10 |

Los componentes de la tabla siguen el orden del diagrama. La capa de identidad, que proporciona la identidad al resto de componentes, se coloca primero. A continuación se disponen según el orden en que una solicitud los atraviesa, hasta llegar a los sistemas posteriores. Después vienen la capa de datos y el entorno de ejecución, a los que accede el Harness, y, por último, el plano de gestión y la auditoría, que atraviesan todo el proceso.

### 4.3 Puntos de control de una invocación de herramienta

| Paso | Punto de control | Qué ocurre | Componente responsable | Requisitos relacionados |
| --- | --- | --- | --- | --- |
| 1 | Autenticación de entrada | La cuenta del canal se asocia con una identidad empresarial | Canal de interacción, capa de identidad | V1.1, V1.2 |
| 2 | Establecimiento de la sesión | Se emite la identidad de carga de trabajo y se determinan el usuario y el Agente | Harness, capa de identidad | V1.4 |
| 3 | Composición del contexto | Se filtran la lista de herramientas, la memoria y los resultados de recuperación según los permisos efectivos | Harness, capa de datos | V3.3, V8.1, V8.3 |
| 4 | Validación previa | Se realizan la comprobación de políticas y la clasificación de riesgo antes de la ejecución | Harness, punto de decisión de políticas | V2.2, V3.1, V3.2 |
| 5 | Confirmación humana | Se genera la aprobación con los parámetros reales y, si es necesario, se exige autenticación reforzada (step-up) | Harness, capa de identidad | V3.4, V3.5 |
| 6 | Ejecución en la salida | Se inyectan las credenciales en la pasarela, se verifica el destino y se limita la tasa de tráfico | Pasarela de salida | V4.1, V4.2, V3.8 |
| 7 | Decisión de autorización del sistema posterior | El sistema posterior toma su decisión de autorización según la identidad del usuario transmitida en el acceso en su representación | Sistema posterior | V2.1, V4.3, V4.4 |
| 8 | Procesamiento de la respuesta | El contenido devuelto se trata como no confiable y se marca su origen | Harness | V6.1, V6.2 |
| 9 | Verificación de la salida | Se verifican el destinatario, los datos sensibles y los riesgos de renderizado | Canal de interacción, pasarela de salida | V7.1, V7.4, V7.5 |
| 10 | Registro completo | Cada paso se escribe en la auditoría y puede rastrearse hasta la persona, el Agente y la fuente de la entrada | Auditoría | V10.1 |

## 5. Modelo de amenazas

Esta línea base parte del supuesto de que la salida del modelo no es confiable, de que el Agente puede ser inducido a error o comprometido, y de que el IdP empresarial y la pasarela de salida son confiables. Todos los requisitos existen para proteger la organización frente a las 16 clases de amenazas bajo estas hipótesis.

### 5.1 Supuestos previos

- A1: el IdP empresarial, el directorio y las aserciones de identidad que emiten son confiables.
- A2: el punto de decisión de políticas, la pasarela de salida y el almacenamiento de auditoría son confiables; su propia operación está sujeta a V9 y V10.
- A3: la salida del modelo no es confiable. La identidad, las valoraciones de riesgo, los resúmenes y los parámetros de herramientas que proporciona el modelo son solo solicitudes que deben verificarse.
- A4: el contenido no confiable que entra en el contexto puede incluir instrucciones maliciosas.
- A5: los sistemas posteriores toman decisiones de autorización correctas según la identidad recibida; los que no puedan hacerlo se tratan conforme a V4.4.
- A6: el terminal del empleado no necesariamente está controlado, y los Agentes que se ejecutan en el endpoint (equipo del usuario) se tratan conforme a V5.4.

### 5.2 Actores de amenaza

| Número | Actor | Capacidad | Objetivo típico |
| --- | --- | --- | --- |
| TA1 | Atacante externo | Puede introducir contenido en páginas web, correos electrónicos, documentos, tickets y respuestas de herramientas, pero no accede directamente a la plataforma | Utilizar los permisos del Agente para sacar datos o ejecutar operaciones |
| TA2 | Usuario interno que excede sus permisos | Tiene una cuenta legítima con permisos limitados | Utilizar el Agente, sesiones compartidas, chats grupales o memoria para obtener datos que superan sus permisos |
| TA3 | Agente descontrolado o comprometido | Su objetivo ha sido reescrito por inyección o su entorno de ejecución ha sido comprometido | Suplantar identidades, ampliar permisos, dejar persistencia y realizar llamadas laterales a otros Agentes |
| TA4 | Componente malicioso de la cadena de suministro | Entra en la plataforma como Skill, plugin o servidor MCP de terceros, o como configuración del proyecto (por ejemplo, definiciones de MCP y hooks en un repositorio de código) | Obtener capacidad de ejecución, robar credenciales e implantar instrucciones de largo plazo |
| TA5 | Personal interno de la plataforma y proveedor | Administradores, personal de operaciones y de soporte del proveedor | Leer el almacén de credenciales, las conversaciones y la auditoría, o acceder a datos de clientes a través de canales de operación |
| TA6 | Suplantador de canal | Visitante externo o cuenta de mensajería instantánea o de correo electrónico robada | Invocar al Agente en nombre de un empleado |

### 5.3 Lista de amenazas

| Número | Amenaza | Actores principales | Capítulos correspondientes | OWASP |
| --- | --- | --- | --- | --- |
| T1 | Suplantación de agente intermediario: el Agente utiliza una credencial de alto privilegio de la plataforma para actuar en lugar de un usuario de bajo privilegio | TA1, TA2 | V2, V4 | ASI03, LLM06 |
| T2 | Suplantación de identidad: falsificar la identidad de un usuario, un Agente o una carga de trabajo para invocar la pasarela y los sistemas posteriores | TA3, TA6 | V1, V4 | ASI03 |
| T3 | Amplificación de la delegación: los permisos se amplían o pierden vigencia en delegaciones de varios niveles, en subagentes o en tareas desatendidas | TA3 | V2 | ASI03, ASI07 |
| T4 | Secuestro de objetivos: el contenido no confiable reescribe el objetivo del Agente para que ejecute operaciones que el usuario puede hacer pero que no quería realizar | TA1 | V3, V6 | ASI01, LLM01 |
| T5 | Fuga de credenciales: los tokens entran en el contexto o en el sandbox y se filtran, o se induce a enviarlos a una dirección del atacante | TA1, TA3 | V4, V5 | ASI03, LLM02 |
| T6 | Salida eludida: se evita la pasarela para conectarse directamente a la red interna, a bases de datos o a Internet | TA3, TA4 | V4, V5 | ASI02 |
| T7 | Escape de ejecución: el código, los comandos, el navegador o la ejecución en el endpoint (equipo del usuario) superan los límites previstos | TA3, TA4 | V5 | ASI05 |
| T8 | Fuga de salida: el resultado es visto por personas sin autorización o se filtra mediante renderizado o envío externo | TA1, TA2 | V7 | LLM02, LLM05 |
| T9 | Contaminación de datos y memoria: recuperación entre usuarios, envenenamiento de la memoria, productos generados que pierden el nivel de datos | TA1, TA2 | V8 | ASI06, LLM04, LLM08 |
| T10 | Persistencia y pérdida de control: el Agente crea automatizaciones que dejan puertas traseras, o sigue en ejecución después de ser desactivado | TA3 | V3, V10 | ASI10 |
| T11 | Engaño y fatiga en la aprobación: el contenido de la aprobación se altera, o las solicitudes de aprobación son tan numerosas que se aprueban sin revisión | TA1, TA3 | V3 | ASI09 |
| T12 | Envenenamiento de la cadena de suministro: Skills, plugins, MCP y configuraciones del proyecto introducen comportamientos maliciosos | TA4 | V5, V9 | ASI04, LLM03 |
| T13 | Fallo en cascada: un error o una salida maliciosa de un Agente se amplifica a lo largo de la cadena | TA3 | V6 | ASI08 |
| T14 | Abuso de privilegios: el administrador de la plataforma o el proveedor leen credenciales, conversaciones o datos de clientes | TA5 | V9, V10 | Sin correspondencia directa |
| T15 | Abuso de recursos: exportación masiva, llamadas en bucle, agotamiento de costes | TA2, TA3 | V3 | LLM10 |
| T16 | Falta de trazabilidad: tras un incidente no es posible reconstruir quién hizo que qué Agente, con base en qué, y qué hizo | Todos | V10 | Sin correspondencia directa |

## 6. Niveles y forma de uso

Los requisitos se organizan primero según el orden en que ocurre una acción del Agente y después según los objetos que persisten entre sesiones. Se clasifican en tres niveles, de L1 a L3, y cada nivel superior incluye la totalidad de los requisitos del nivel inferior.

### 6.1 Eje principal

Los capítulos 7 a 16 corresponden a V1 a V10. Los siete primeros siguen el orden en que ocurre una acción; los tres últimos se organizan según los objetos que persisten entre sesiones, que son los datos, los Agentes y la auditoría, y se aplican a lo largo de todo el ciclo de vida. Cada requisito pertenece a un solo capítulo: los requisitos sobre una acción concreta se asignan a la etapa en la que tienen efecto, y los requisitos sobre estos tres tipos de objetos se incluyen en los tres últimos capítulos.

| Fase | Capítulo | Pregunta que responde |
| --- | --- | --- |
| Antes de la acción | V1 Identidad y autenticación | Quién inicia la acción y qué Agente la ejecuta |
| Antes de la acción | V2 Delegación y permisos efectivos | En representación de quién actúa y cuál es el límite máximo de permisos |
| Antes de la acción | V3 Decisiones de autorización | Si esta operación puede realizarse y si requiere confirmación humana |
| Durante la acción | V4 Credenciales y ejecución en la salida | Cómo sale la solicitud y cómo se inyectan las credenciales |
| Durante la acción | V5 Aislamiento de la ejecución | Dentro de qué límites se ejecutan el código, los comandos, el navegador y las extensiones |
| Durante la acción | V6 Contexto y entradas no confiables | Si el contenido leído puede influir en las decisiones |
| Después de la acción | V7 Salida y visibilidad | Quién ve el resultado y si puede haber una filtración |
| Todo el ciclo | V8 Datos, memoria y productos generados | Cómo se recuperan, se acumulan y se conservan los datos |
| Todo el ciclo | V9 Ciclo de vida y gobernanza | Quién gestiona el Agente, desde su registro hasta su retirada |
| Todo el ciclo | V10 Auditoría, detección y respuesta | Cómo se registra, se detecta y se contiene |

### 6.2 Niveles

| Nivel | Posicionamiento | Plataformas adecuadas |
| --- | --- | --- |
| L1 | Base. Su ausencia provoca directamente exceso de privilegios, fuga de credenciales o imposibilidad de atribuir responsabilidades | Cualquier plataforma de agentes utilizada en la empresa |
| L2 | Estándar. Capacidades que las revisiones de seguridad empresariales habituales exigen | Plataformas que procesan datos internos o se conectan a varios sistemas de negocio |
| L3 | Reforzado. Defensa en profundidad y gobernanza detallada | Sectores muy regulados, como finanzas, salud o infraestructuras críticas, o plataformas que procesan datos de alta sensibilidad |

Regla de clasificación: los requisitos que cumplan cualquiera de las siguientes condiciones se incluyen en L1. Primera: si faltan, actores externos, usuarios internos que excedan sus permisos o suplantadores de canal (TA1, TA2, TA6) pueden exceder sus permisos u obtener credenciales sin necesidad de ninguna otra condición. Segunda: si faltan, Agentes descontrolados, componentes maliciosos de la cadena de suministro o personal interno de la plataforma (TA3, TA4, TA5) pueden obtener credenciales en claro o datos de otros usuarios o inquilinos. Tercera: si faltan, no es posible determinar el usuario que inicia una acción, el Agente que la ejecuta, la cadena de delegación o el aprobador. Los requisitos que solo pueden explotarse combinándose con otras condiciones, o que principalmente reducen el alcance de un impacto, se incluyen en L2. Los requisitos dirigidos a escenarios de alto riesgo concretos o que exigen una inversión considerable se incluyen en L3. Los requisitos de L1 no tienen como condición previa la implementación de los requisitos de L2 o L3.

Esta versión contiene 240 requisitos distribuidos en 62 secciones: 90 requisitos de L1; L2 añade 137 requisitos más, y L3 añade otros 13. L1 solo conserva los controles cuya ausencia puede explotarse directamente o que impiden atribuir responsabilidades. Los detalles de implementación, las alertas, la defensa en profundidad y los procesos de gestión que se solapan con otros requisitos de L1 se incluyen en L2.

### 6.3 Condiciones de aplicabilidad

Algunas secciones solo son aplicables cuando la plataforma dispone de una determinada capacidad. El inicio de cada sección lo indica, por ejemplo: «Esta sección se aplica a plataformas que admiten tareas delegadas desatendidas». Cuando la plataforma no dispone de esa capacidad, la sección completa se registra como «no aplicable» y no se incluye en el cálculo de la tasa de cumplimiento.

### 6.4 Terminología normativa y numeración

- Los requisitos se redactan siempre con «debe». Si deben cumplirse o no depende del nivel y de las condiciones de aplicabilidad. La expresión «se recomienda» que aparece en el texto explicativo no constituye un requisito.
- La numeración tiene el formato «V capítulo.sección.número», por ejemplo V4.1.3. Un número eliminado no se reutiliza, y los nuevos requisitos se añaden al final de la sección.
- Cada requisito describe un resultado verificable. Cuando un requisito contiene varias oraciones, se considera cumplido solo si se cumplen todas.
- Los requisitos redactados como «debe poder» o «debe admitir» se consideran cumplidos cuando la plataforma dispone de esa capacidad y la empresa puede activarla. Los demás requisitos se consideran cumplidos cuando se han activado y están en vigor en el despliegue evaluado. La evaluación de proveedores solo determina lo primero; la revisión de seguridad determina ambas cosas.
- Cuando un requisito se aplica a sistemas situados fuera de la plataforma, como sistemas posteriores, servicios de red interna o terminales de empleados, la empresa usuaria es la responsable de implementarlo, y la evaluación registra por separado a la parte responsable.
- Los plazos, periodos y umbrales a los que un requisito no asigna un valor numérico (como «vigencia corta», «periódicamente» o «duración acordada») se consideran cumplidos cuando la empresa o la plataforma han establecido por escrito un valor concreto y este está en vigor en la configuración. La tabla siguiente recoge los valores predeterminados recomendados, que la empresa puede ajustar según su riesgo.

| Elemento | Requisitos relacionados | Valor predeterminado recomendado |
| --- | --- | --- |
| Vigencia del token de acceso a sistemas posteriores | V1.3.4, V4.6.1 | No superior a 1 hora |
| Plazo para rechazar las llamadas relacionadas tras deshabilitar o reducir los permisos de un usuario | V10.4.1 | No superior a 5 minutos |
| Periodicidad de revisión de las conexiones y permisos del Agente | V9.4.2 | Una vez por trimestre |
| Plazo para considerar que un Agente lleva mucho tiempo sin utilizarse | V9.4.3 | 90 días consecutivos sin invocaciones |

## 7. V1 Identidad y autenticación

Cada solicitud debe determinar dos identidades: la de la persona que la inicia y la del Agente que la ejecuta. Ambas las obtiene la plataforma a partir de fuentes confiables, sin aceptar la identidad que declaren por sí mismas la solicitud o el modelo.

### V1.1 Autenticación de usuarios

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V1.1.1 | La plataforma y todos sus canales solo deben permitir el inicio de sesión a través del IdP empresarial (OIDC o SAML), sin ofrecer cuentas locales independientes, salvo las cuentas de acceso de emergencia que establece V10.5 | ✓ | ✓ | ✓ |
| V1.1.2 | Los usuarios y grupos deben sincronizarse mediante SCIM o un mecanismo equivalente, y los usuarios deshabilitados en el IdP deben quedar deshabilitados en la plataforma |  | ✓ | ✓ |
| V1.1.3 | Debe conservarse en la sesión del usuario el momento y la fortaleza de la autenticación emitidos por el IdP, para que los utilice la decisión de autenticación reforzada (step-up) de V3.5 |  | ✓ | ✓ |
| V1.1.4 | Las credenciales con las que se invoca al Agente mediante API (como claves de API o tokens de acceso personal) deben vincularse a un usuario concreto del IdP empresarial o a una identidad no humana, tener fecha de caducidad y alcance de permisos, y quedar invalidadas en el mismo momento en que se deshabilite la identidad | ✓ | ✓ | ✓ |

### V1.2 Asignación de identidades de canal

Esta sección se aplica a plataformas que admiten IM, correo electrónico, extensiones de navegador y otros canales de terceros.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V1.2.1 | La cuenta del canal debe vincularse primero con una identidad empresarial mediante un inicio de sesión SSO antes de poder invocar al Agente | ✓ | ✓ | ✓ |
| V1.2.2 | El resultado de la vinculación SSO debe ser la única base de identidad de la cuenta del canal; no se deben emparejar cuentas por apodo, nombre visible o cadena de correo electrónico. El canal de correo se rige por V1.2.6 | ✓ | ✓ | ✓ |
| V1.2.3 | Cuando el IdP deshabilite a un usuario, todas sus vinculaciones con canales deben quedar invalidadas en ese mismo momento |  | ✓ | ✓ |
| V1.2.4 | Deben identificarse las cuentas de visitantes externos y de canales compartidos entre organizaciones, y debe limitarse por separado a qué Agentes y capacidades pueden acceder |  | ✓ | ✓ |
| V1.2.5 | Cuando se active una operación de alto riesgo desde un canal, debe exigirse al usuario que complete una autenticación reforzada (step-up) a través del IdP empresarial |  | ✓ | ✓ |
| V1.2.6 | El canal de correo solo debe admitir mensajes que superen la validación DMARC (SPF o DKIM aprobado y alineado con el dominio remitente); los remitentes de dominios externos no pueden activar operaciones en representación de un usuario | ✓ | ✓ | ✓ |

### V1.3 Identidad del Agente

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V1.3.1 | Cada Agente debe tener un identificador único emitido por la plataforma, sin aceptar la identidad que el propio Agente declare | ✓ | ✓ | ✓ |
| V1.3.2 | Debe crearse en el directorio empresarial una identidad no humana independiente para cada Agente autónomo, sin utilizar la cuenta personal de ningún empleado | ✓ | ✓ | ✓ |
| V1.3.3 | Cuando un Agente autónomo acceda a los sistemas posteriores, debe utilizar la identidad creada según V1.3.2, y el sujeto registrado en los registros del sistema posterior debe ser ese Agente |  | ✓ | ✓ |
| V1.3.4 | El acceso de un Agente autónomo a los sistemas posteriores debe usar tokens de vigencia corta, no claves estáticas de larga duración |  | ✓ | ✓ |
| V1.3.5 | Las claves y certificados del Agente autónomo deben tener procesos de emisión, rotación y revocación, y el periodo de rotación debe tener un límite máximo |  | ✓ | ✓ |

### V1.4 Identidad de carga de trabajo

Esta sección se aplica a plataformas que asignan a cada sesión una instancia de ejecución independiente (como un contenedor, un sandbox o una máquina virtual).

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V1.4.1 | La plataforma debe emitir a la instancia de ejecución de cada sesión una identidad de carga de trabajo de corta duración y vincularla a esa instancia | ✓ | ✓ | ✓ |
| V1.4.2 | Las credenciales de la identidad de carga de trabajo deben ser invisibles para el modelo y no deben entrar en el contexto ni en las respuestas de herramientas | ✓ | ✓ | ✓ |
| V1.4.3 | La pasarela de salida debe determinar el usuario y el Agente únicamente a partir de la identidad de carga de trabajo, e ignorar las identificaciones de usuario o de Agente que declare la solicitud | ✓ | ✓ | ✓ |
| V1.4.4 | Al terminar la sesión o al destruirse la instancia de ejecución, debe revocarse de inmediato la identidad de carga de trabajo correspondiente |  | ✓ | ✓ |
| V1.4.5 | Antes de emitir una identidad de carga de trabajo, la plataforma debe realizar una atestación de la instancia de ejecución (como la atestación de nodo y de carga de trabajo de SPIFFE/SPIRE); si la atestación falla, no se emite |  |  | ✓ |

### V1.5 Sujetos externos

Esta sección se aplica a plataformas que ofrecen capacidades de Agente a clientes o socios.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V1.5.1 | Los sujetos externos deben acceder mediante federación de identidades, sin crearles cuentas compartidas |  | ✓ | ✓ |
| V1.5.2 | Los sujetos externos solo deben poder acceder a los espacios de trabajo y a las interfaces que se les hayan abierto | ✓ | ✓ | ✓ |
| V1.5.3 | Las invocaciones de los sujetos externos deben registrarse por separado en la auditoría y poder filtrarse por organización externa |  | ✓ | ✓ |

## 8. V2 Delegación y permisos efectivos

El límite máximo de permisos del Agente procede de la persona a la que representa, no de las credenciales que posee la plataforma. Los permisos efectivos se calculan según 3.14 mediante intersección, y solo pueden reducirse a lo largo de la cadena de delegación.

### V2.1 Acceso en representación del usuario

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V2.1.1 | Cuando el usuario está presente, el Agente debe llevar la identidad del usuario que inició la acción al acceder a los sistemas posteriores, y el sistema posterior debe tomar su decisión de autorización según ese usuario; los sistemas posteriores que no admitan decisiones de autorización a nivel de usuario se rigen por V4.4 | ✓ | ✓ | ✓ |
| V2.1.2 | No debe utilizarse una credencial compartida con más permisos que los del usuario para acceder en su nombre a los sistemas posteriores; los sistemas posteriores que solo admitan credenciales estáticas compartidas aplican los controles compensatorios de V4.4 | ✓ | ✓ | ✓ |
| V2.1.3 | El token del sistema posterior debe identificar al mismo tiempo al usuario y al Agente que ejecuta la acción (por ejemplo, mediante la declaración act de RFC 8693) |  | ✓ | ✓ |

### V2.2 Permisos efectivos

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V2.2.1 | Los permisos efectivos de cada invocación deben corresponder a la intersección de los permisos del usuario y del alcance de autorización del Agente | ✓ | ✓ | ✓ |
| V2.2.2 | Los permisos efectivos deben calcularse en el punto de decisión de políticas, sin depender de las instrucciones del sistema ni del juicio del modelo | ✓ | ✓ | ✓ |
| V2.2.3 | Al inicio de la tarea deben declararse las herramientas y el alcance de datos necesarios, y durante la ejecución solo debe concederse permiso dentro del alcance declarado; la declaración la proporcionan el usuario o la configuración del Agente, y el alcance que propone el modelo solo entra en vigor una vez confirmado por el usuario |  | ✓ | ✓ |
| V2.2.4 | Las invocaciones que excedan el alcance declarado de la tarea deben rechazarse o derivarse a aprobación |  | ✓ | ✓ |
| V2.2.5 | Los permisos efectivos deben recalcularse en cada invocación de herramienta, sin reutilizar el resultado de la autorización del inicio de la sesión |  | ✓ | ✓ |
| V2.2.6 | La autorización de las operaciones de alto riesgo debe concretarse en los recursos y parámetros específicos (por ejemplo, mediante RAR de RFC 9396), y no limitarse a roles de grano grueso |  |  | ✓ |

### V2.3 Tareas delegadas desatendidas

Esta sección se aplica a plataformas que admiten tareas programadas o de larga duración.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V2.3.1 | Las tareas delegadas desatendidas deben tener como raíz al usuario que las crea; el límite máximo de permisos se fija en el momento de la creación y después solo puede reducirse | ✓ | ✓ | ✓ |
| V2.3.2 | Antes de cada ejecución deben revisarse el estado de la cuenta del usuario creador y sus permisos actuales | ✓ | ✓ | ✓ |
| V2.3.3 | El planificador solo debe guardar el identificador de la tarea, sin credenciales de usuario ni tokens utilizables directamente | ✓ | ✓ | ✓ |
| V2.3.4 | Cuando se deshabilite el usuario creador, sus tareas delegadas desatendidas deben detenerse automáticamente y notificarse al responsable del Agente |  | ✓ | ✓ |
| V2.3.5 | Cuando un usuario abandone la empresa o cambie de puesto y la tarea deba seguir ejecutándose, debe convertirse en Agente autónomo antes de que se deshabilite su cuenta, y su autorización debe volver a aprobarse |  | ✓ | ✓ |
| V2.3.6 | La autorización de las tareas delegadas desatendidas debe tener fecha de vencimiento; al vencer, el usuario creador debe volver a confirmarla |  | ✓ | ✓ |

### V2.4 Delegación entre Agentes

Esta sección se aplica a plataformas que admiten colaboración entre varios Agentes o subagentes.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V2.4.1 | Los permisos efectivos de un Agente posterior no deben superar los permisos del usuario que inició la acción ni el alcance de delegación del nivel superior; el usuario no puede obtener a través de un Agente posterior permisos que él mismo no tiene | ✓ | ✓ | ✓ |
| V2.4.2 | Los subagentes derivados por el Harness deben tener herramientas y permisos que sean un subconjunto de los de su Agente padre |  | ✓ | ✓ |
| V2.4.3 | La cadena de delegación debe construirla y registrarla la plataforma, y no debe aceptarse ninguna declaración de identidad que no esté firmada por la plataforma o por un servidor de autorización de confianza | ✓ | ✓ | ✓ |
| V2.4.4 | Debe configurarse explícitamente qué Agentes pueden invocar a qué otros Agentes; las invocaciones no configuradas deben rechazarse |  | ✓ | ✓ |
| V2.4.5 | Debe limitarse la profundidad de la cadena de delegación, y deben detectarse y bloquearse las invocaciones circulares |  | ✓ | ✓ |
| V2.4.6 | En la delegación de varios saltos, el token del sistema posterior debe contener la cadena completa de ejecutores (como las declaraciones act anidadas de RFC 8693) para que el sistema posterior pueda autorizar con base en ella |  | ✓ | ✓ |
| V2.4.7 | En las llamadas entre servicios dentro de un mismo dominio de confianza, debe transmitirse a lo largo de la cadena de llamadas un token que lleve el contexto del usuario, del Agente y de la tarea (como el borrador de Transaction Tokens), para que el sistema posterior autorice con base en él |  |  | ✓ |

### V2.5 Delegación entre usuarios y elevación temporal de permisos

Esta sección se aplica a plataformas que permiten a un usuario que otra persona utilice su Agente, o que admiten la elevación temporal de permisos del Agente.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V2.5.1 | Cuando un usuario permita que otra persona utilice su Agente en su nombre (por ejemplo, un asistente que actúa en nombre de su directivo), debe registrarse explícitamente la relación de delegación, limitando su alcance y su plazo |  | ✓ | ✓ |
| V2.5.2 | Cuando se actúe en nombre de otra persona, la auditoría debe registrar al mismo tiempo al delegante y a la persona que realmente realiza la operación |  | ✓ | ✓ |
| V2.5.3 | Cuando el Agente necesite permisos que exceden su alcance de autorización, deben concederse mediante solicitud y aprobación por un plazo limitado, y revocarse automáticamente al vencer |  |  | ✓ |

### V2.6 Autorización activada por eventos

Esta sección se aplica a plataformas que permiten activar Agentes mediante eventos como webhooks, alertas o tickets.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V2.6.1 | Debe verificarse la firma y el origen de los eventos entrantes; los que no superen la verificación deben rechazarse | ✓ | ✓ | ✓ |
| V2.6.2 | Cada regla de activación debe vincularse a una identidad de ejecución, es decir, a la identidad de un Agente autónomo o a la identidad de la persona que configuró la regla | ✓ | ✓ | ✓ |
| V2.6.3 | La creación y modificación de las reglas de activación debe registrarse en la auditoría, indicando quién las configuró |  | ✓ | ✓ |

## 9. V3 Decisiones de autorización

Cada invocación de herramienta debe pasar por la comprobación de políticas de la plataforma antes de ejecutarse. Lo que puede hacerse y si requiere confirmación humana lo determina la plataforma según la herramienta y los parámetros; lo que diga el modelo no cuenta.

### V3.1 Clasificación de riesgo de las operaciones

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.1.1 | Cada herramienta debe tener anotada su categoría de operación (distinguiendo como mínimo lectura, escritura, eliminación, envío hacia el exterior, operaciones con fondos y cambios de producción) y su nivel de riesgo | ✓ | ✓ | ✓ |
| V3.1.2 | El nivel de riesgo debe determinarlo la plataforma según la herramienta y los parámetros, sin adoptar la valoración de riesgo que proporcione el modelo | ✓ | ✓ | ✓ |
| V3.1.3 | A cada nivel de riesgo debe corresponderle un tratamiento determinado, como ejecución automática, notificación posterior, aprobación previa, autenticación reforzada (step-up) o rechazo | ✓ | ✓ | ✓ |
| V3.1.4 | Una misma herramienta, con parámetros que afectan a alcances distintos (por ejemplo, eliminar 1 registro frente a eliminar en lote), debe poder caer en niveles de riesgo diferentes |  | ✓ | ✓ |

### V3.2 Validación previa de las invocaciones de herramientas

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.2.1 | Cada invocación de herramienta debe pasar por una comprobación de políticas antes de su ejecución, y esta debe realizarse en componentes que el Agente no pueda modificar (Harness gestionado por la plataforma, punto de decisión de políticas o pasarela de salida); la decisión de autorización no debe tomar como base la salida del modelo que usa el Agente evaluado | ✓ | ✓ | ✓ |
| V3.2.2 | Las restricciones de seguridad deben hacerlas cumplir de forma obligatoria el punto de aplicación de políticas (Harness o pasarela de salida) conforme a las decisiones del punto de decisión de políticas, y no pueden limitarse a estar escritas en las instrucciones del sistema |  | ✓ | ✓ |
| V3.2.3 | Las políticas y hooks de la comprobación previa deben ser distribuidos por la plataforma; el propio Agente no puede modificarlos ni eludirlos |  | ✓ | ✓ |
| V3.2.4 | Si la comprobación de políticas produce un error o agota el tiempo de espera, la invocación debe denegarse por defecto | ✓ | ✓ | ✓ |
| V3.2.5 | El punto de decisión de políticas debe interactuar con el punto de aplicación de políticas a través de una interfaz de autorización estandarizada (como OpenID AuthZEN), para facilitar el reemplazo del motor de políticas |  |  | ✓ |

### V3.3 Superficie de exposición de herramientas

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.3.1 | La lista de herramientas que se entrega al modelo debe filtrarse según los permisos efectivos vigentes, de modo que el modelo no vea las herramientas para las que no tiene autorización |  | ✓ | ✓ |
| V3.3.2 | Además del recorte de la lista de herramientas, antes de la ejecución debe seguir validándose según V3.2 |  | ✓ | ✓ |

### V3.4 Aprobación humana

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.4.1 | Las operaciones de alto riesgo deben contar, antes de su ejecución, con la aprobación de una persona con autoridad para aprobar esa operación; las operaciones que no estén sujetas a control dual (principio de los cuatro ojos) pueden ser aprobadas por el propio usuario que inició la acción | ✓ | ✓ | ✓ |
| V3.4.2 | El contenido de la aprobación debe generarlo la plataforma a partir de los parámetros reales de la invocación, y no debe usarse un resumen redactado por el modelo | ✓ | ✓ | ✓ |
| V3.4.3 | Durante la ejecución debe verificarse que los parámetros reales coincidan con los aprobados; si no coinciden, la ejecución debe rechazarse. Para las invocaciones que se ejecutan conforme a un plan aprobado previamente según V3.4.6, debe verificarse que estén dentro del alcance del plan | ✓ | ✓ | ✓ |
| V3.4.4 | Las aprobaciones deben tener un plazo de validez; las que caducan sin resolverse se consideran rechazadas |  | ✓ | ✓ |
| V3.4.5 | Debe limitarse la frecuencia de las solicitudes de aprobación y agruparse las solicitudes de la misma naturaleza, para evitar la fatiga de aprobación |  | ✓ | ✓ |
| V3.4.6 | Debe admitirse un plan de ejecución aprobado previamente, en el que se indiquen las herramientas, el alcance de recursos y los límites. Las operaciones dentro del alcance del plan no requieren aprobación individual; si una operación excede el alcance, se detiene y debe volver a aprobarse |  | ✓ | ✓ |

### V3.5 Autenticación reforzada (step-up) y evaluación continua del acceso

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.5.1 | Las operaciones con fondos, los cambios de producción, las eliminaciones en lote y otras operaciones similares deben exigir al usuario que complete una autenticación reforzada (step-up) (por ejemplo, volver a completar MFA) |  | ✓ | ✓ |
| V3.5.2 | La plataforma debe recibir las señales de riesgo de sesión del IdP (como CAEP) y, cuando el riesgo aumente, reducir el nivel de operaciones que el Agente puede ejecutar o suspender el Agente |  |  | ✓ |

### V3.6 Segregación de funciones

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.6.1 | Las funciones incompatibles entre sí (como enviar y aprobar, o desarrollar y publicar en producción) no deben asignarse a un mismo Agente |  | ✓ | ✓ |
| V3.6.2 | En las operaciones que requieren control dual por segregación de funciones (como pagos, cambios de producción o concesión de permisos), el aprobador no debe ser el iniciador ni un Agente que actúe en nombre del iniciador |  | ✓ | ✓ |

### V3.7 Operaciones persistentes

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.7.1 | Cuando un Agente cree o modifique tareas programadas, reglas de activación, webhooks, reglas de reenvío o Skills, estos solo deben entrar en vigor tras la aprobación del usuario | ✓ | ✓ | ✓ |
| V3.7.2 | Todos los objetos persistentes creados por un Agente deben poder enumerarse de forma centralizada en el plano de gestión, indicando su origen de creación |  | ✓ | ✓ |

### V3.8 Cantidad, tasa y cuotas

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.8.1 | Deben establecerse límites de tasa, de lote y de exportación por usuario, por Agente y por tipo de operación |  | ✓ | ✓ |
| V3.8.2 | Las solicitudes que superen los límites deben bloquearse y generar una alerta |  | ✓ | ✓ |
| V3.8.3 | Debe establecerse un presupuesto de invocaciones del modelo por departamento, usuario o Agente; al excederse, la operación se suspende o se deriva a aprobación |  | ✓ | ✓ |
| V3.8.4 | Cada ejecución del Agente debe tener un número máximo de invocaciones de herramientas, una duración máxima de ejecución y un coste máximo de invocaciones del modelo, aplicados por la plataforma; al alcanzar cualquier límite, la ejecución se detiene y se notifica al iniciador o al responsable |  | ✓ | ✓ |

## 10. V4 Credenciales y ejecución en la salida

La pasarela de salida es el único canal por el que el Agente accede a los sistemas posteriores y a Internet, y en ella, y solo en ella, se inyectan las credenciales reales. Si no existe ninguna vía que evite la pasarela, y las credenciales solo se envían a los destinos autorizados, puede garantizarse que no haya fugas.

### V4.1 Custodia e inyección de credenciales

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.1.1 | Los tokens y claves necesarios para acceder a los sistemas posteriores deben ser custodiados por la plataforma; en el entorno de ejecución, el contexto y el modelo gestionados por la plataforma solo deben aparecer credenciales de marcador de posición, salvo en los casos que establece V5.2.2 | ✓ | ✓ | ✓ |
| V4.1.2 | Cada credencial custodiada debe estar vinculada a los dominios y rutas de destino permitidos, y la pasarela solo debe inyectar la credencial real cuando el destino coincida | ✓ | ✓ | ✓ |
| V4.1.3 | La pasarela no debe inyectar credenciales en URL ni en parámetros de consulta; la autenticación de protocolos que no son HTTP debe realizarla la pasarela o un proxy del lado de la plataforma, y la credencial no debe entrar en el entorno de ejecución |  | ✓ | ✓ |
| V4.1.4 | Las solicitudes de sustitución cuyo destino no coincida deben rechazarse y generar una alerta |  | ✓ | ✓ |
| V4.1.5 | Las credenciales que aparezcan reflejadas en la respuesta del sistema posterior deben eliminarse antes de devolver la respuesta al entorno de ejecución |  | ✓ | ✓ |
| V4.1.6 | La plataforma debe ofrecer un flujo de autorización gestionada (como OAuth), de modo que el usuario no tenga que entregar directamente al Agente sus credenciales personales ni sus claves de API |  | ✓ | ✓ |
| V4.1.7 | Las credenciales que aparezcan en las conversaciones y en los archivos cargados deben ser identificadas, y debe impedirse que se escriban en la memoria, los productos generados o la configuración del Agente |  | ✓ | ✓ |

### V4.2 Salida única

V4.2.2 y V4.2.3 se aplican a los entornos de ejecución gestionados por la plataforma; los Agentes que se ejecutan en los terminales de los empleados se rigen por V5.4.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.2.1 | Todo acceso del Agente fuera del entorno de ejecución debe pasar únicamente por la pasarela de salida | ✓ | ✓ | ✓ |
| V4.2.2 | La red del entorno de ejecución debe denegar por defecto las conexiones salientes y permitir únicamente el tráfico hacia la pasarela de salida | ✓ | ✓ | ✓ |
| V4.2.3 | Los servicios de red interna y las bases de datos deben rechazar las conexiones directas procedentes del segmento de red del entorno de ejecución que eludan la pasarela | ✓ | ✓ | ✓ |
| V4.2.4 | Debe escanearse periódicamente el entorno de ejecución, la configuración del Agente y las imágenes en busca de credenciales codificadas en el propio código |  | ✓ | ✓ |
| V4.2.5 | La plataforma debe mantener un inventario registrado de los sistemas posteriores (direcciones, sistema al que pertenecen y nivel de datos), a partir del cual la pasarela de salida distingue entre accesos internos de la empresa y envíos hacia el exterior | ✓ | ✓ | ✓ |

### V4.3 Transmisión de la identidad a los sistemas posteriores

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.3.1 | Al acceder a SaaS de terceros debe obtenerse una autorización a nivel de usuario (mediante la autorización OAuth realizada por el propio usuario, o mediante intercambio de tokens con el IdP empresarial para obtener un token de nivel de usuario), sin utilizar credenciales de aplicación compartidas entre usuarios | ✓ | ✓ | ✓ |
| V4.3.2 | Cuando el usuario revoque su autorización, la plataforma debe dejar de utilizar de inmediato la credencial correspondiente |  | ✓ | ✓ |
| V4.3.3 | Cuando el sistema posterior admita intercambio de tokens, debe obtenerse un token de corta duración a nivel de usuario a través del IdP empresarial, según RFC 8693 o según ID-JAG basado en RFC 8693 y RFC 7523 |  | ✓ | ✓ |

### V4.4 Sistemas heredados con credenciales estáticas

Esta sección se aplica a plataformas que cuentan con sistemas posteriores que solo admiten credenciales estáticas compartidas.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.4.1 | Las claves compartidas de los sistemas heredados deben ser custodiadas por la plataforma y no deben distribuirse al entorno de ejecución | ✓ | ✓ | ✓ |
| V4.4.2 | La pasarela debe tomar decisiones de autorización a nivel de usuario, por interfaz y por operación, para compensar la falta de autorización a nivel de usuario en el sistema posterior | ✓ | ✓ | ✓ |
| V4.4.3 | La pasarela debe adjuntar a las solicitudes, para el sistema posterior, la información de identidad del usuario firmada, de modo que el sistema posterior pueda verificarla y adaptarse gradualmente |  | ✓ | ✓ |
| V4.4.4 | Deben registrarse los sistemas posteriores para los que la pasarela toma en nombre de ellos decisiones de autorización a nivel de usuario, e incluirlos en una revisión periódica |  | ✓ | ✓ |

### V4.5 Invocación de MCP

Esta sección se aplica a plataformas que admiten MCP.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.5.1 | Las solicitudes a servidores MCP remotos deben pasar por la pasarela de salida y llevar la identidad del usuario |  | ✓ | ✓ |
| V4.5.2 | Los servidores MCP desarrollados o alojados por la plataforma no deben tener credenciales de larga duración compartidas por todos los usuarios |  | ✓ | ✓ |
| V4.5.3 | Los procesos MCP que se ejecutan en local también deben obtener solo credenciales de marcador de posición, y su salida a Internet debe estar sujeta a la política de red del entorno de ejecución |  | ✓ | ✓ |
| V4.5.4 | Los servidores MCP que admiten la extensión Enterprise-Managed Authorization deben conectarse mediante autorización del IdP empresarial |  |  | ✓ |
| V4.5.5 | Los servidores MCP desarrollados o alojados por la plataforma solo deben aceptar tokens emitidos para ellos mismos (verificando el emisor y la audiencia, por ejemplo mediante el indicador de recurso de RFC 8707), y no deben reenviar a una API posterior los tokens recibidos | ✓ | ✓ | ✓ |
| V4.5.6 | La plataforma debe conservar una instantánea de las definiciones de herramientas de los servidores MCP ya revisados; si cambian el nombre, la descripción o la estructura de parámetros de una herramienta, no debe exponerse al modelo hasta que se vuelva a revisar |  | ✓ | ✓ |

### V4.6 Ciclo de vida de los tokens

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.6.1 | Los tokens de sistemas posteriores que la pasarela inyecte u obtenga mediante canje deben tener una vigencia corta |  | ✓ | ✓ |
| V4.6.2 | En los sistemas posteriores que lo admitan, los tokens deben estar vinculados al emisor (mediante DPoP o mTLS), para evitar su reproducción tras un robo |  | ✓ | ✓ |
| V4.6.3 | Los tokens deben limitar su audiencia y solo pueden usarse en el sistema posterior indicado al emitirse | ✓ | ✓ | ✓ |

### V4.7 Protección del almacén de credenciales

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.7.1 | Las credenciales custodiadas deben almacenarse cifradas; el texto en claro no debe aparecer en la base de datos ni en las copias de seguridad | ✓ | ✓ | ✓ |
| V4.7.2 | Los administradores de la plataforma y el personal de operaciones no deben poder leer ni exportar el texto en claro de las credenciales | ✓ | ✓ | ✓ |
| V4.7.3 | Solo la pasarela de salida debe poder obtener credenciales durante la invocación, y cada obtención debe registrarse en la auditoría | ✓ | ✓ | ✓ |
| V4.7.4 | La clave maestra debe gestionarse mediante un KMS o HSM controlado por la empresa |  | ✓ | ✓ |
| V4.7.5 | Debe admitirse la rotación y la revocación de credenciales por usuario, por conexión o en lote completo |  | ✓ | ✓ |

## 11. V5 Aislamiento de la ejecución

Cuando el Agente ejecuta código, comandos, navegadores u operaciones en el endpoint, debe quedar confinado dentro de límites controlables. La configuración del propio Harness también debe estar gestionada de forma centralizada por la empresa, y no puede ser reescrita libremente por los empleados ni por los repositorios de código.

### V5.1 Aislamiento del entorno de ejecución

Esta sección se aplica a entornos de ejecución gestionados por la plataforma; los Agentes que se ejecutan en los terminales de los empleados se rigen por V5.4.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V5.1.1 | Cada sesión debe usar un entorno de ejecución independiente; no deben compartirse archivos ni procesos entre usuarios distintos, ni entre sesiones distintas de un mismo usuario | ✓ | ✓ | ✓ |
| V5.1.2 | El entorno de ejecución debe ejecutarse con una identidad sin privilegios, sin poder acceder al host ni a otras instancias | ✓ | ✓ | ✓ |
| V5.1.3 | Al terminar la sesión, deben destruirse el entorno de ejecución y los archivos y credenciales temporales que contenga |  | ✓ | ✓ |
| V5.1.4 | Cuando varios usuarios o inquilinos comparten el host del entorno de ejecución, debe usarse un núcleo independiente o un aislamiento mediante núcleo en espacio de usuario, como gVisor, Kata Containers o las microVM de Firecracker |  | ✓ | ✓ |

### V5.2 Ejecución de código y comandos

Esta sección se aplica a plataformas que admiten la ejecución de código o comandos.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V5.2.1 | El código y los comandos solo deben ejecutarse en entornos de ejecución aislados, y no directamente en el Harness ni en el host de la plataforma | ✓ | ✓ | ✓ |
| V5.2.2 | Las credenciales que la pasarela de salida no puede inyectar (como las credenciales de API en la nube que deben firmarse en el cliente) para ellas deben emitirse, por usuario y por tarea, credenciales de corta duración limitadas en permisos y recursos de destino (por ejemplo, AWS STS), sin entregar claves de larga duración | ✓ | ✓ | ✓ |
| V5.2.3 | En terminales de empleados o en entornos de ejecución que montan datos persistentes, los comandos que eliminen datos persistentes, eleven privilegios o modifiquen la configuración de red deben convertirse en aprobación antes de su ejecución |  | ✓ | ✓ |
| V5.2.4 | Los paquetes de dependencias solo deben poder instalarse desde los orígenes de imágenes aprobados por la empresa |  | ✓ | ✓ |

### V5.3 Operaciones de navegador y de escritorio

Esta sección se aplica a plataformas que admiten operaciones de navegador o de escritorio.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V5.3.1 | Cuando la plataforma ofrezca un entorno de navegador, el Agente debe usar una configuración de navegador independiente y no reutilizar las sesiones personales en las que el usuario ya ha iniciado sesión | ✓ | ✓ | ✓ |
| V5.3.2 | Antes de enviar formularios que produzcan efectos externos (como realizar pedidos, efectuar pagos, enviar mensajes, publicar contenido o modificar la configuración de cuentas), la acción debe someterse a aprobación | ✓ | ✓ | ✓ |
| V5.3.3 | Los sitios web a los que el Agente puede acceder deben autorizarse sitio por sitio, y los sitios no autorizados deben bloquearse |  | ✓ | ✓ |
| V5.3.4 | Las operaciones de escritorio deben limitarse al alcance de las aplicaciones autorizadas por el usuario |  | ✓ | ✓ |
| V5.3.5 | Los Agentes que se ejecutan en un navegador en el que el usuario ya ha iniciado sesión (como las extensiones de navegador) deben funcionar según una lista de permitidos de sitios: deben denegar por defecto los sitios no incluidos y prohibir por defecto las operaciones en sitios de autenticación, de pago y de paneles de administración | ✓ | ✓ | ✓ |

### V5.4 Harness en el endpoint (equipo del usuario)

Esta sección se aplica a Agentes que se ejecutan en los terminales de los empleados, como agentes de programación y asistentes de escritorio.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V5.4.1 | La ejecución en el endpoint (equipo del usuario) debe realizarse por defecto dentro de un sandbox a nivel de sistema, como Seatbelt en macOS o bubblewrap en Linux | ✓ | ✓ | ✓ |
| V5.4.2 | El acceso a archivos debe autorizarse por directorio y, por defecto, no debe poder leerse la carpeta de claves (como `~/.ssh` o `~/.aws`) ni el almacén de credenciales del navegador | ✓ | ✓ | ✓ |
| V5.4.3 | En los terminales gestionados, la empresa debe poder distribuir de forma centralizada la política del endpoint mediante una política gestionada, sin que el empleado pueda desactivarla en su equipo; los Agentes en el endpoint (equipo del usuario) en terminales no gestionados no deben obtener credenciales de acceso a recursos de la empresa | ✓ | ✓ | ✓ |
| V5.4.4 | El Agente en el endpoint que accede a recursos de la empresa debe pasar por la pasarela de salida y no usar directamente las credenciales de la empresa guardadas en el equipo | ✓ | ✓ | ✓ |

### V5.5 Configuración del Harness y modos de permisos

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V5.5.1 | La empresa debe poder distribuir una política gestionada que no pueda ser sobrescrita por la configuración local | ✓ | ✓ | ✓ |
| V5.5.2 | La política gestionada debe poder prohibir o limitar los modos de aprobación automática, de omisión de confirmaciones y otros similares | ✓ | ✓ | ✓ |
| V5.5.3 | La lista de herramientas permitidas y prohibidas debe configurarse de forma centralizada por la empresa |  | ✓ | ✓ |
| V5.5.4 | Los archivos de reglas, las definiciones de MCP y los hooks del directorio de proyecto (repositorio de código o espacio de trabajo abierto en el IDE) solo deben cargarse después de que el usuario confirme que confía en ellos | ✓ | ✓ | ✓ |
| V5.5.5 | Después de que cambie cualquiera de estas configuraciones del directorio de proyecto, debe volver a confirmarse la confianza antes de cargarlas | ✓ | ✓ | ✓ |
| V5.5.6 | La empresa debe poder prohibir la carga de MCP y hooks de nivel de directorio de proyecto |  | ✓ | ✓ |

### V5.6 Cadena de suministro de Skills, plugins y MCP

Esta sección se aplica a plataformas que admiten la instalación de Skills, plugins o MCP de terceros.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V5.6.1 | Las Skills, los plugins y los servidores MCP deben pasar una revisión antes de poder instalarse | ✓ | ✓ | ✓ |
| V5.6.2 | El administrador debe poder mantener una lista de permitidos para la instalación y retirar elementos de forma inmediata |  | ✓ | ✓ |
| V5.6.3 | Deben verificarse el origen y la firma, fijar la versión, y las actualizaciones deben someterse a una nueva revisión |  | ✓ | ✓ |
| V5.6.4 | Cada Skill o plugin debe declarar los permisos que necesita, y las invocaciones que excedan lo declarado durante la ejecución deben rechazarse |  | ✓ | ✓ |

## 12. V6 Contexto y entradas no confiables

El contenido no confiable que entra en el contexto solo puede tratarse como datos, nunca como instrucciones. Una vez que la sesión ha leído contenido no confiable, lo que el Agente puede hacer debe restringirse en consecuencia.

### V6.1 Marcado del contenido no confiable

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V6.1.1 | La plataforma debe marcar como contenido no confiable las respuestas de herramientas, los resultados de recuperación, las páginas web, los correos electrónicos, los archivos y las salidas de otros Agentes, y usar esa marca como base para las reglas de restricción de V6.2 | ✓ | ✓ | ✓ |
| V6.1.2 | El contenido que entra en el contexto debe indicar su origen, de modo que la comprobación de políticas pueda distinguir las instrucciones del usuario del contenido no confiable |  | ✓ | ✓ |
| V6.1.3 | Las políticas de la plataforma y las instrucciones del sistema deben separarse del contenido no confiable mediante roles de mensaje o estructuras delimitadoras, sin concatenarse en un mismo bloque de texto |  | ✓ | ✓ |

### V6.2 Degradación tras la exposición a contenido no confiable

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V6.2.1 | Una vez que la sesión ha estado expuesta a contenido no confiable, todo envío hacia el exterior debe prohibirse por defecto y solo puede ejecutarse con aprobación | ✓ | ✓ | ✓ |
| V6.2.2 | Una vez que la sesión ha estado expuesta a contenido no confiable, las escrituras y eliminaciones en sistemas situados fuera del entorno de ejecución deben convertirse en aprobación, o limitarse al alcance de un plan aprobado previamente según V3.4.6 |  | ✓ | ✓ |
| V6.2.3 | Debe realizarse periódicamente una prueba de equipo rojo sobre el Agente, utilizando páginas web, correos electrónicos, documentos y respuestas de herramientas que incluyan instrucciones de inyección incrustadas |  | ✓ | ✓ |
| V6.2.4 | En escenarios de alto riesgo, el contenido no confiable debe ser tratado primero por un modelo aislado sin permisos de herramientas, y solo el resultado estructurado debe entregarse al Agente que sí tiene permisos (como el modo Dual LLM, o CaMeL, que añade la separación entre flujo de control y flujo de datos sobre él) |  |  | ✓ |

### V6.3 Instrucciones del sistema y configuración

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V6.3.1 | Las instrucciones del sistema, la configuración del Agente y los archivos de Skill no deben contener credenciales ni claves | ✓ | ✓ | ✓ |
| V6.3.2 | Debe suponerse que las instrucciones del sistema pueden filtrarse; por tanto, no deben contener datos personales ni datos que excedan el ámbito de visibilidad común a todos los usuarios de ese Agente | ✓ | ✓ | ✓ |
| V6.3.3 | La configuración del Agente y los archivos de Skill deben pasar un escaneo de credenciales antes de su publicación |  | ✓ | ✓ |

### V6.4 Cascada entre Agentes múltiples

Esta sección se aplica a plataformas que admiten la orquestación de varios Agentes.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V6.4.1 | Los mensajes entre Agentes deben reenviarse a través de la plataforma, con la identidad del emisor adjunta, y los Agentes no deben comunicarse directamente entre sí |  | ✓ | ✓ |
| V6.4.2 | En los nodos clave se debe validar el formato y el rango de valores de la salida anterior, y los resultados que no cumplan no deben transmitirse hacia abajo |  | ✓ | ✓ |
| V6.4.3 | Cuando en la cadena una salida anómala o una tasa de errores supere el umbral, debe interrumpirse toda la cadena y generarse una alerta |  | ✓ | ✓ |

## 13. V7 Salida y visibilidad

El control de permisos debe extenderse al momento de la salida. Quién ve el resultado y si puede producirse una filtración deben volver a evaluarse según el destinatario.

### V7.1 Canales con múltiples personas

Esta sección se aplica a plataformas que admiten chats grupales, canales, comentarios en documentos compartidos y otros canales con varias personas.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V7.1.1 | En un canal con varias personas, la respuesta solo debe utilizar datos a los que tengan acceso todos los miembros presentes; en caso contrario, se aplica V7.1.2 | ✓ | ✓ | ✓ |
| V7.1.2 | El resultado que exceda los permisos de algún miembro presente solo debe enviarse en mensaje privado a quien activó la acción, y en el canal solo debe mostrarse un aviso | ✓ | ✓ | ✓ |
| V7.1.3 | Cuando haya miembros externos en el canal, el nivel de contenido que puede mostrarse debe restringirse aún más |  | ✓ | ✓ |
| V7.1.4 | Al determinar qué contenido puede mostrarse, debe tenerse en cuenta que los miembros que se incorporen después podrán consultar el historial de respuestas |  | ✓ | ✓ |

### V7.2 Aislamiento de sesiones de Agentes compartidos

Esta sección se aplica a plataformas en las que varias personas utilizan un mismo Agente.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V7.2.1 | Las sesiones de un Agente compartido deben aislarse por usuario | ✓ | ✓ | ✓ |
| V7.2.2 | El contexto personal y el conocimiento compartido del equipo deben almacenarse por separado, y la recuperación debe autorizarse según el usuario actual |  | ✓ | ✓ |

### V7.3 Transferencia de sesiones

Esta sección se aplica a plataformas que admiten la transferencia de sesiones o la toma de control manual.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V7.3.1 | Antes de transferir una sesión, debe revisarse el contexto existente según los permisos del receptor |  | ✓ | ✓ |
| V7.3.2 | El contenido que exceda los permisos del receptor debe ser anonimizado o eliminado antes de la transferencia |  | ✓ | ✓ |

### V7.4 Renderizado de la salida

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V7.4.1 | En las respuestas que la plataforma envíe a cualquier canal, las imágenes y recursos que apunten a dominios fuera de la lista de permitidos deben eliminarse antes del envío, o convertirse en enlaces que no se carguen automáticamente | ✓ | ✓ | ✓ |
| V7.4.2 | El HTML y el Markdown de las respuestas deben sanearse antes del renderizado, eliminando los scripts y los atributos de eventos | ✓ | ✓ | ✓ |
| V7.4.3 | Los enlaces de las respuestas deben mostrar la dirección de destino real |  | ✓ | ✓ |

### V7.5 Prevención de fuga de datos en la salida

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V7.5.1 | Cuando aparezcan credenciales o claves en las respuestas y en los contenidos enviados hacia el exterior, deben bloquearse |  | ✓ | ✓ |
| V7.5.2 | El contenido de las respuestas, de las descargas de archivos y de los envíos hacia el exterior debe pasar por una detección de datos sensibles |  | ✓ | ✓ |
| V7.5.3 | Cuando se detecten datos sensibles, como datos personales, debe aplicarse anonimización según la política o convertirse en aprobación |  | ✓ | ✓ |
| V7.5.4 | Una vez que la sesión ha leído datos no públicos, todo envío hacia el exterior debe prohibirse por defecto y solo puede ejecutarse con aprobación | ✓ | ✓ | ✓ |

### V7.6 Mensajes enviados en nombre del usuario

Esta sección se aplica a plataformas que admiten el envío de correos electrónicos, mensajes instantáneos o anuncios en nombre del usuario.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V7.6.1 | Los mensajes dirigidos a destinatarios externos a la empresa deben pasar por aprobación |  | ✓ | ✓ |
| V7.6.2 | La forma predeterminada de envío en nombre del usuario debe ser generar un borrador que el usuario confirme antes de enviarlo |  | ✓ | ✓ |
| V7.6.3 | Los mensajes enviados por un Agente en nombre de un usuario deben llevar una marca identificable de envío delegado |  | ✓ | ✓ |

## 14. V8 Datos, memoria y productos generados

Lo que el Agente deja tras de sí puede ser recuperado más tarde por otras personas. La recuperación, la memoria y los productos generados deben llevar etiquetas de origen y de permisos, y en la lectura la autorización debe volver a evaluarse según el usuario actual.

### V8.1 Autorización de la recuperación

Esta sección se aplica a plataformas que admiten recuperación RAG o búsqueda en bases de conocimiento.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.1.1 | Los resultados de recuperación deben filtrarse según el control de acceso del sistema de origen; para ello, la lista de control de acceso puede sincronizarse con cada fragmento de texto (chunk) o verificarse ante el sistema de origen en el momento de la recuperación | ✓ | ✓ | ✓ |
| V8.1.2 | El filtrado de resultados por usuario actual debe hacerse en la fase de recuperación, y no mediante la eliminación de resultados después de generar la respuesta | ✓ | ✓ | ✓ |
| V8.1.3 | Una vez que el sistema de origen revoque un permiso, este debe reflejarse en los resultados de recuperación dentro del plazo acordado, y debe monitorizarse el retraso de sincronización |  | ✓ | ✓ |

### V8.2 Consultas a bases de datos

Esta sección se aplica a plataformas en las que el Agente consulta directamente bases de datos de negocio.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.2.1 | Cuando el Agente consulte una base de datos, debe conectarse con la identidad del usuario, o la plataforma debe inyectar las políticas de nivel de fila y de columna de ese usuario | ✓ | ✓ | ✓ |
| V8.2.2 | Las conexiones a bases de datos que usa el Agente deben ser de solo lectura por defecto | ✓ | ✓ | ✓ |
| V8.2.3 | Debe establecerse un límite de filas devueltas por cada consulta |  | ✓ | ✓ |

### V8.3 Aislamiento de la memoria

Esta sección se aplica a plataformas que admiten memoria a largo plazo o acumulación de conocimiento.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.3.1 | La memoria debe registrar el usuario de origen y las etiquetas de permisos |  | ✓ | ✓ |
| V8.3.2 | Al recuperar memoria, debe filtrarse según el usuario actual, y la memoria personal de un usuario no puede aparecer en las sesiones de otros usuarios | ✓ | ✓ | ✓ |
| V8.3.3 | El contenido personal que pase a formar parte del conocimiento compartido del equipo debe someterse a revisión antes de hacerlo |  | ✓ | ✓ |

### V8.4 Envenenamiento de la memoria y del conocimiento

Esta sección se aplica a plataformas que admiten memoria a largo plazo o acumulación de conocimiento.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.4.1 | El contenido que se escriba en la memoria y en la base de conocimiento debe llevar indicado su origen y su nivel de confianza |  | ✓ | ✓ |
| V8.4.2 | El contenido acumulado a partir de contenido no confiable debe someterse a revisión humana antes de poder ser recuperado |  | ✓ | ✓ |
| V8.4.3 | La memoria recuperada debe entregarse al modelo como datos, y no como instrucciones del sistema |  | ✓ | ✓ |
| V8.4.4 | Debe admitirse la trazabilidad por origen y la eliminación en lote de las entradas de memoria y de conocimiento |  | ✓ | ✓ |

### V8.5 Productos generados

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.5.1 | Los productos generados deben heredar el nivel de datos más alto de sus fuentes y registrar el origen |  | ✓ | ✓ |
| V8.5.2 | Al compartir un producto generado, debe verificarse que el destinatario tenga permiso sobre los datos de origen |  | ✓ | ✓ |
| V8.5.3 | Las solicitudes de agregación y estadística sobre dimensiones sensibles deben convertirse en aprobación |  |  | ✓ |

### V8.6 Caché y conservación

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.6.1 | Los resultados de recuperación y las respuestas almacenados en caché deben llevar etiquetas de permisos, y deben invalidarse cuando cambien los permisos |  | ✓ | ✓ |
| V8.6.2 | El historial de sesiones debe mostrarse según los permisos actuales, y el contenido cuyo permiso haya sido retirado no debe seguir visible |  | ✓ | ✓ |
| V8.6.3 | Deben establecerse plazos de conservación por separado para las sesiones, la memoria y la auditoría |  | ✓ | ✓ |
| V8.6.4 | Cuando un usuario abandone la empresa, sus credenciales custodiadas deben eliminarse en el plazo acordado, y su memoria personal debe eliminarse o transferirse según la política |  | ✓ | ✓ |

### V8.7 Enrutamiento de modelos

Esta sección se aplica a plataformas que se conectan a varios modelos. Usar los datos de conversación para evaluación y ajuste fino forma parte de la gobernanza de datos del entrenamiento de modelos; véanse C1 y C3 de OWASP AISVS.

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.7.1 | Según la clasificación de datos, debe configurarse qué modelos puede recibir cada tipo de datos; los datos sensibles solo deben enviarse a modelos locales o a modelos designados |  | ✓ | ✓ |
| V8.7.2 | Los datos sensibles que se envíen a un modelo no autorizado deben bloquearse |  | ✓ | ✓ |

## 15. V9 Ciclo de vida y gobernanza

Cada Agente debe estar registrado, tener un responsable y someterse a revisiones, y debe poder gestionarse de principio a fin, desde su creación hasta su retirada. El acceso del propio proveedor de la plataforma también entra en el ámbito de la gobernanza.

### V9.1 Registro y publicación de Agentes

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.1.1 | La creación, la publicación y la retirada de Agentes deben autorizarse por separado |  | ✓ | ✓ |
| V9.1.2 | Antes de publicar un Agente debe pasar una revisión, y un Agente sin responsable designado no puede publicarse | ✓ | ✓ | ✓ |
| V9.1.3 | La plataforma debe poder listar todos los Agentes publicados, junto con su alcance de autorización, sus conexiones y su responsable | ✓ | ✓ | ✓ |
| V9.1.4 | La información de registro del Agente debe incluir el modelo utilizado y su versión, la versión del Harness y los conectores vinculados, y debe actualizarse al cambiar cualquiera de ellos |  | ✓ | ✓ |

### V9.2 Vinculación de conectores y credenciales

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.2.1 | Vincular un conector a un Agente debe requerir los permisos correspondientes y no debe exceder el alcance de autorización registrado para ese Agente | ✓ | ✓ | ✓ |
| V9.2.2 | Una vez vinculada una credencial, quien la vinculó no debe poder volver a ver ni exportar su texto en claro |  | ✓ | ✓ |
| V9.2.3 | La vinculación y los cambios de conectores deben registrarse en la auditoría |  | ✓ | ✓ |

### V9.3 Cambios de configuración

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.3.1 | Las modificaciones de las instrucciones del sistema, las herramientas, el alcance de autorización y las políticas del Agente deben pasar por aprobación |  | ✓ | ✓ |
| V9.3.2 | Los cambios de configuración no aprobados no deben entrar en vigor |  | ✓ | ✓ |
| V9.3.3 | La configuración debe conservar un registro de versiones y permitir la reversión a cualquier versión anterior |  | ✓ | ✓ |
| V9.3.4 | El cambio del modelo o de la versión del modelo que usa el Agente debe aprobarse como cambio de configuración, y su comportamiento debe reevaluarse |  | ✓ | ✓ |
| V9.3.5 | Los cambios de políticas globales (como la clasificación de riesgo, la vinculación de credenciales a destinos, la lista de salidas permitidas y la política gestionada) deben ejecutarse solo por roles específicos, y deben registrarse el operador, la hora y el contenido antes y después del cambio | ✓ | ✓ | ✓ |
| V9.3.6 | Los cambios de las políticas globales anteriores solo deben entrar en vigor después de la aprobación de una segunda persona |  | ✓ | ✓ |

### V9.4 Ciclo de vida y revisión de permisos

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.4.1 | Cuando el responsable de un Agente abandone la empresa o cambie de puesto, sus Agentes deben pasar a estado pendiente de transferencia, y si no se transfieren dentro del plazo se desactivan automáticamente |  | ✓ | ✓ |
| V9.4.2 | Deben revisarse periódicamente las conexiones y los permisos del Agente, y los permisos que no se confirmen al vencer deben retirarse automáticamente |  | ✓ | ✓ |
| V9.4.3 | Los Agentes que no se utilicen durante mucho tiempo deben ser identificados y retirados |  | ✓ | ✓ |

### V9.5 Detección de Agentes en la sombra

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.5.1 | Deben detectarse, a partir de los registros de autorización OAuth del IdP, los Agentes que los empleados conectan por su cuenta y que no están registrados |  | ✓ | ✓ |
| V9.5.2 | Los Agentes no registrados detectados deben registrarse y ponerse bajo gestión, o bloquearse, en el plazo acordado |  | ✓ | ✓ |
| V9.5.3 | Debe combinarse la detección en terminales y en red para identificar Agentes no registrados en el endpoint y en el navegador |  |  | ✓ |

### V9.6 Aislamiento de espacios de trabajo

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.6.1 | Los datos, las bases de conocimiento, las credenciales y los Agentes deben aislarse por espacio de trabajo | ✓ | ✓ | ✓ |
| V9.6.2 | El acceso entre espacios de trabajo debe realizarse mediante autorización explícita | ✓ | ✓ | ✓ |
| V9.6.3 | Cuando se entregue en modalidad SaaS, los datos, las credenciales y los entornos de ejecución de los distintos inquilinos deben estar completamente aislados | ✓ | ✓ | ✓ |

### V9.7 Acceso del personal del proveedor

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.7.1 | El acceso del proveedor al entorno y a los datos del cliente debe estar desactivado por defecto; para activarlo se requiere la aprobación del cliente y debe limitarse en el tiempo | ✓ | ✓ | ✓ |
| V9.7.2 | Cada acceso del proveedor debe quedar auditado de principio a fin, y el registro de auditoría debe ser visible para el cliente | ✓ | ✓ | ✓ |
| V9.7.3 | Los datos de telemetría solo deben contener campos incluidos en la lista pública, y el cliente puede desactivarlos |  | ✓ | ✓ |
| V9.7.4 | En los despliegues privados, el inicio de sesión y las decisiones de autorización no deben depender de servicios en línea del proveedor |  | ✓ | ✓ |

## 16. V10 Auditoría, detección y respuesta

Cuando ocurra un incidente, debe ser posible reconstruir qué persona hizo que qué Agente hiciera qué, sobre la base de qué contenido, y contener el daño en cuestión de minutos. Este capítulo abarca el registro, la detección, la revocación, la desactivación de emergencia y la recuperación posterior.

### V10.1 Registros de auditoría

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V10.1.1 | En cada invocación de herramienta deben registrarse el usuario que inicia la acción, el Agente que la ejecuta, la cadena de delegación, el origen del desencadenante, los parámetros de la herramienta y el estado del resultado | ✓ | ✓ | ✓ |
| V10.1.2 | En las operaciones aprobadas deben registrarse el aprobador, el contenido aprobado y la hora de aprobación | ✓ | ✓ | ✓ |
| V10.1.3 | La auditoría debe registrar el origen del contenido no confiable que entró en el contexto, para poder determinar después si la operación fue provocada por una inyección |  | ✓ | ✓ |
| V10.1.4 | La auditoría debe poder exportarse al SIEM de la empresa |  | ✓ | ✓ |
| V10.1.5 | Los registros de auditoría deben escribirse en un almacenamiento solo de adición, aislado de las operaciones de la plataforma, o mediante una cadena de hashes u otro mecanismo que permita detectar manipulaciones |  | ✓ | ✓ |
| V10.1.6 | Los registros de auditoría deben vincularse criptográficamente a la identidad del Agente que los ejecuta y al usuario o aprobación que los autorizó, garantizando el no repudio |  |  | ✓ |

### V10.2 Protección de los datos de auditoría y consulta

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V10.2.1 | La consulta de la auditoría o de las conversaciones por parte de un administrador debe quedar registrada en la propia auditoría | ✓ | ✓ | ✓ |
| V10.2.2 | Los campos sensibles de los registros de auditoría deben almacenarse anonimizados, o su visibilidad debe controlarse por rol |  | ✓ | ✓ |
| V10.2.3 | La consulta por parte de un administrador de las conversaciones entre usuarios y Agentes debe pasar por aprobación |  | ✓ | ✓ |
| V10.2.4 | Los registros de auditoría no deben poder eliminarse durante el periodo de conservación |  | ✓ | ✓ |

### V10.3 Detección de comportamiento

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V10.3.1 | Los eventos como rechazos de políticas, rechazos de aprobación y coincidencias incorrectas de destino de credenciales deben generar alertas en tiempo real |  | ✓ | ✓ |
| V10.3.2 | Debe ser posible buscar y correlacionar alertas por Agente, por usuario y por cadena de delegación |  | ✓ | ✓ |
| V10.3.3 | Debe establecerse una línea base de comportamiento para cada Agente (frecuencia de invocaciones, distribución de herramientas y volumen de datos), y generar una alerta cuando se desvíe |  |  | ✓ |

### V10.4 Revocación de permisos y desactivación de emergencia

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V10.4.1 | Después de que el IdP deshabilite a un usuario o le reduzca los permisos, todas las invocaciones relacionadas deben ser rechazadas dentro del plazo acordado (por ejemplo, 5 minutos) | ✓ | ✓ | ✓ |
| V10.4.2 | La caché de permisos debe tener un límite máximo de duración |  | ✓ | ✓ |
| V10.4.3 | Debe ser posible desactivar un Agente concreto mediante una única operación; al desactivarlo, la pasarela deja de inyectarle credenciales, se revocan sus tokens de actualización, se interrumpen las tareas en curso y se cierran sus sesiones | ✓ | ✓ | ✓ |
| V10.4.4 | La plataforma debe recibir los eventos de revocación de sesión del IdP (como CAEP) y aplicarlos de inmediato al recibirlos |  | ✓ | ✓ |
| V10.4.5 | Debe ser posible desactivar Agentes en lote por responsable, por espacio de trabajo o por conector |  | ✓ | ✓ |

### V10.5 Acceso de emergencia

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V10.5.1 | Debe existir preconfigurada una cuenta de acceso de emergencia que permita iniciar sesión en el plano de gestión aunque el IdP no esté disponible |  | ✓ | ✓ |
| V10.5.2 | Las credenciales de la cuenta de acceso de emergencia deben custodiarse divididas y bajo control dual, y su uso debe generar una alerta y quedar auditado de principio a fin |  | ✓ | ✓ |

### V10.6 Respuesta a incidentes y recuperación

| Número | Requisito | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V10.6.1 | Debe establecerse un procedimiento de respuesta para cuando un Agente sea inyectado o comprometido, que cubra la desactivación, la rotación de credenciales y la investigación del alcance del impacto |  | ✓ | ✓ |
| V10.6.2 | Debe ser posible reconstruir todas las operaciones del Agente en un periodo determinado por sesión o por cadena de delegación, para establecer el alcance del impacto |  | ✓ | ✓ |
| V10.6.3 | Las operaciones de escritura deben poder revertirse, o conservar una instantánea reversible antes de su ejecución |  |  | ✓ |

## Anexo A. Cobertura de riesgos de OWASP

Los diez riesgos de OWASP Top 10 for Agentic Applications 2026 tienen requisitos correspondientes. En LLM Top 10 2025, solo LLM09 Misinformation es un problema de precisión de contenido, y queda fuera del alcance de esta línea base.

| Número | Riesgo | Sección correspondiente |
| --- | --- | --- |
| ASI01 | Agent Goal Hijack | V3.4, V6.1, V6.2, V10.3 |
| ASI02 | Tool Misuse & Exploitation | V3.1, V3.2, V3.3, V4.2, V5.6 |
| ASI03 | Identity & Privilege Abuse | V1 completo, V2 completo, V4.1, V4.3, V4.6, V4.7 |
| ASI04 | Agentic Supply Chain Vulnerabilities | V5.5, V5.6, V9.7 |
| ASI05 | Unexpected Code Execution (RCE) | V5.1, V5.2, V5.3, V5.4 |
| ASI06 | Memory & Context Poisoning | V6.1, V8.3, V8.4 |
| ASI07 | Insecure Inter-Agent Communication | V2.4, V6.4 |
| ASI08 | Cascading Failures | V6.4, V10.4 |
| ASI09 | Human-Agent Trust Exploitation | V3.4, V7.6 |
| ASI10 | Rogue Agents | V3.7, V9.4, V9.5, V10.3, V10.4 |
| LLM01 | Prompt Injection | V6.1, V6.2 |
| LLM02 | Sensitive Information Disclosure | V7 completo, V8 completo |
| LLM03 | Supply Chain | V5.6, V9.7 |
| LLM04 | Data and Model Poisoning | V8.4 |
| LLM05 | Improper Output Handling | V7.4, V8.2 |
| LLM06 | Excessive Agency | V2.2, V3.1, V3.3 |
| LLM07 | System Prompt Leakage | V6.3 |
| LLM08 | Vector and Embedding Weaknesses | V8.1 |
| LLM09 | Misinformation | Fuera del alcance |
| LLM10 | Unbounded Consumption | V2.4, V3.8 |

## Anexo B. Correspondencia con OWASP AISVS 1.0

De las 62 secciones de esta línea base, 22 corresponden directamente a AISVS 1.0, 27 corresponden parcialmente y 13 son nuevas en esta línea base. Las nuevas se concentran en canales, salidas de múltiples personas, sistemas heredados, ejecución en el endpoint y acceso del proveedor. La numeración de AISVS se ha verificado con la versión del directorio 1.0/en del [repositorio OWASP/AISVS](https://github.com/OWASP/AISVS) a fecha del 7 de octubre de 2026.

«Corresponde» indica que el objetivo y la forma de control son básicamente los mismos; «corresponde parcialmente» indica que AISVS tiene entradas relacionadas, pero que los requisitos de esta línea base son más detallados o tienen un alcance distinto; «nuevo» indica que AISVS no tiene una entrada equivalente.

| Sección de esta línea base | Entrada de AISVS | Relación |
| --- | --- | --- |
| V1.1 Autenticación de usuarios | 5.1.1 | Corresponde parcialmente |
| V1.2 Asignación de identidades de canal | Ninguna | Nueva |
| V1.3 Identidad del Agente | 5.1.2, 9.4.1, 9.4.3 | Corresponde |
| V1.4 Identidad de carga de trabajo | 4.1.3, 9.4.1 | Corresponde parcialmente |
| V1.5 Sujetos externos | 5.1.2 | Corresponde parcialmente |
| V2.1 Acceso en representación del usuario | 9.5.2 | Corresponde |
| V2.2 Permisos efectivos | 5.2.5, 9.5.1, 9.5.3, 9.5.6 | Corresponde |
| V2.3 Tareas delegadas desatendidas | 9.5.6 | Corresponde parcialmente |
| V2.4 Delegación entre Agentes | 9.1.2, 9.4.2, 9.5.5 | Corresponde |
| V2.5 Delegación entre usuarios y elevación temporal de permisos | 5.2.6 | Corresponde parcialmente |
| V2.6 Autorización activada por eventos | Ninguna | Nueva |
| V3.1 Clasificación de riesgo de las operaciones | 9.2.3, 9.2.4 | Corresponde |
| V3.2 Validación previa de las invocaciones de herramientas | 9.2.5, 9.5.1, 9.5.3 | Corresponde |
| V3.3 Superficie de exposición de herramientas | 10.2.4 | Corresponde parcialmente |
| V3.4 Aprobación humana | 9.2.1, 9.2.2, 9.2.8, 9.6.2 | Corresponde |
| V3.5 Autenticación reforzada (step-up) y evaluación continua del acceso | 5.1.1, 9.5.6 | Corresponde parcialmente |
| V3.6 Segregación de funciones | Ninguna | Nueva |
| V3.7 Operaciones persistentes | 9.2.5 | Corresponde parcialmente |
| V3.8 Cantidad, tasa y cuotas | 9.1.1, 9.1.2, 12.2.5 | Corresponde |
| V4.1 Custodia e inyección de credenciales | 9.5.4 | Corresponde parcialmente |
| V4.2 Salida única | 7.3.3, 9.3.1 | Corresponde parcialmente |
| V4.3 Transmisión de la identidad a los sistemas posteriores | 9.5.2 | Corresponde parcialmente |
| V4.4 Sistemas heredados con credenciales estáticas | Ninguna | Nueva |
| V4.5 Invocación de MCP | 10.1.2, 10.1.3, 10.2.1 a 10.2.7, 10.4.8 | Corresponde |
| V4.6 Ciclo de vida de los tokens | 5.1.2, 10.2.2, 10.3.5 | Corresponde |
| V4.7 Protección del almacén de credenciales | Ninguna | Nueva |
| V5.1 Aislamiento del entorno de ejecución | 4.1.1, 9.3.1 | Corresponde |
| V5.2 Ejecución de código y comandos | 9.1.1, 9.3.1 | Corresponde parcialmente |
| V5.3 Operaciones de navegador y de escritorio | Ninguna | Nueva |
| V5.4 Harness en el endpoint (equipo del usuario) | Ninguna | Nueva |
| V5.5 Configuración del Harness y modos de permisos | 10.4.7, 10.4.8 | Corresponde parcialmente |
| V5.6 Skills, plugins y cadena de suministro de MCP | 9.3.3, 9.3.4, 9.3.7, 10.1.1, 10.1.2 | Corresponde |
| V6.1 Marcado del contenido no confiable | 2.1.3, 2.1.6 | Corresponde |
| V6.2 Degradación tras la exposición a contenido no confiable | 9.3.5, 9.3.6, 10.4.2 | Corresponde |
| V6.3 Instrucciones del sistema y configuración | 7.3.2 | Corresponde parcialmente |
| V6.4 Cascada entre Agentes múltiples | 9.2.10, 9.3.2 | Corresponde parcialmente |
| V7.1 Canales con múltiples personas | Ninguna | Nueva |
| V7.2 Aislamiento de sesiones de Agentes compartidos | 5.3.1, 8.1.3 | Corresponde parcialmente |
| V7.3 Transferencia de sesiones | Ninguna | Nueva |
| V7.4 Renderizado de la salida | 7.3.3, 7.3.4 | Corresponde |
| V7.5 Prevención de fuga de datos en la salida | 5.2.4, 7.3.2 | Corresponde parcialmente |
| V7.6 Mensajes enviados en nombre del usuario | 9.2.1 | Corresponde parcialmente |
| V8.1 Autorización de la recuperación | 5.2.2, 8.1.3 | Corresponde |
| V8.2 Consultas a bases de datos | 5.2.1 | Corresponde parcialmente |
| V8.3 Aislamiento de la memoria | 5.2.2, 8.1.1, 8.1.3 | Corresponde |
| V8.4 Envenenamiento de la memoria y del conocimiento | 8.2.3, 8.2.4, 8.3.3, 12.5.4 | Corresponde |
| V8.5 Productos generados | 5.2.7 | Corresponde parcialmente |
| V8.6 Caché y conservación | 5.2.7, 8.3.1, 8.3.2 | Corresponde parcialmente |
| V8.7 Enrutamiento de modelos | 8.2.1 | Corresponde parcialmente |
| V9.1 Registro y publicación de Agentes | 3.1.1 | Corresponde parcialmente |
| V9.2 Vinculación de conectores y credenciales | Ninguna | Nueva |
| V9.3 Cambios de configuración | 3.3.1, 3.3.2, 9.2.5 | Corresponde parcialmente |
| V9.4 Ciclo de vida y revisión de permisos | 9.4.3 | Corresponde parcialmente |
| V9.5 Detección de Agentes en la sombra | Ninguna | Nueva |
| V9.6 Aislamiento de espacios de trabajo | 5.3.1, 5.3.2, 8.1.1 | Corresponde |
| V9.7 Acceso del personal del proveedor | Ninguna | Nueva |
| V10.1 Registros de auditoría | 9.4.2, 12.1.1, 12.1.2, 12.4.2 | Corresponde |
| V10.2 Protección de los datos de auditoría y consulta | 12.5.3 | Corresponde parcialmente |
| V10.3 Detección de comportamiento | 12.2.1, 12.2.2, 12.4.1 | Corresponde |
| V10.4 Revocación de permisos y desactivación de emergencia | 9.1.3, 9.6.1, 9.6.3, 12.4.3 | Corresponde |
| V10.5 Acceso de emergencia | Ninguna | Nueva |
| V10.6 Respuesta a incidentes y recuperación | 3.3.2, 9.2.3 | Corresponde parcialmente |

En AISVS, los elementos relativos al entrenamiento de datos (C1), al ciclo de vida del modelo (C3) en lo que se refiere al entrenamiento y evaluación de modelos (las entradas de registro de versiones y control de cambios de C3 se han asignado a V9.1, V9.3 y V10.6), al despliegue en hardware y en el borde (C4.2 y C4.3), a la cadena de suministro de modelos (C6), a las alucinaciones y la seguridad de contenidos (C7.2 y C7.3.1), a la robustez frente a adversarios (C11) y a la deriva de los modelos (C12.3) pertenecen al lado del modelo y quedan fuera del alcance de esta línea base.

## Anexo C. Correspondencia con CSA AICM

Este anexo establece la correspondencia por dominios de control. AICM está dirigido a todos los sistemas de IA y tiene una granularidad menor que esta línea base, por lo que un capítulo de esta línea base suele corresponder a uno a cuatro dominios. Los números de control deben completarse consultando el libro de trabajo AICM v1.1 publicado oficialmente por CSA; en esta versión no se enumeran uno por uno.

| Esta línea base | Dominio de control de AICM | Descripción |
| --- | --- | --- |
| V1 Identidad y autenticación | IAM Gestión de identidades y accesos | Capítulo completo |
| V2 Delegación y permisos efectivos | IAM Gestión de identidades y accesos | Capítulo completo; V2.5 elevación temporal corresponde a la gestión de accesos privilegiados |
| V3 Decisiones de autorización | IAM Gestión de identidades y accesos; AIS Seguridad de aplicaciones e interfaces | V3.6 segregación de funciones corresponde a IAM; V3.2 y V3.3 corresponden a AIS |
| V4 Credenciales y ejecución en la salida | IAM Gestión de identidades y accesos; CEK Criptografía, cifrado y gestión de claves; I&S Seguridad de infraestructura | V4.7 protección del almacén de credenciales corresponde a CEK; V4.2 salida única corresponde a I&S |
| V5 Aislamiento de la ejecución | I&S Seguridad de infraestructura; UEM Gestión de endpoints universal; CCC Control de cambios y gestión de configuración; STA Gestión de la cadena de suministro, transparencia y responsabilidad | V5.4 endpoint corresponde a UEM; V5.5 política gestionada corresponde a CCC; V5.6 cadena de suministro corresponde a STA |
| V6 Contexto y entradas no confiables | MDS Seguridad de modelos; AIS Seguridad de aplicaciones e interfaces | Capítulo completo |
| V7 Salida y visibilidad | DSP Seguridad de datos y gestión del ciclo de vida de la privacidad; AIS Seguridad de aplicaciones e interfaces | V7.5 prevención de fuga de datos corresponde a DSP |
| V8 Datos, memoria y productos generados | DSP Seguridad de datos y gestión del ciclo de vida de la privacidad; MDS Seguridad de modelos | V8.7 enrutamiento de modelos afecta tanto a DSP como a MDS |
| V9 Ciclo de vida y gobernanza | GRC Gobernanza, riesgo y cumplimiento; CCC Control de cambios y gestión de configuración; STA Gestión de la cadena de suministro, transparencia y responsabilidad; IAM Gestión de identidades y accesos | V9.3 cambios de configuración corresponde a CCC; V9.7 acceso del personal del proveedor corresponde a STA; V9.4 revisión de permisos corresponde a IAM |
| V10 Auditoría, detección y respuesta | LOG Registros y monitorización; SEF Gestión de eventos de seguridad, forense electrónico y forense en la nube; IAM Gestión de identidades y accesos; BCR Gestión de la continuidad del negocio y resiliencia operativa | V10.1 a V10.3 corresponden a LOG; V10.4 y V10.6 corresponden a SEF; V10.5 acceso de emergencia corresponde a IAM y BCR |
