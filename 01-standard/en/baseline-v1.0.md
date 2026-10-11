# Enterprise Agent Identity and Authorization Security Baseline

Author: Max · 2026-10-07

This baseline is licensed under [CC BY 4.0](../../LICENSE-DOCS).

## Preface

This baseline specifies the security requirements that agents in enterprise environments shall satisfy with respect to identity and authorization. The requirements are organized into ten chapters, first by the order in which an agent action occurs and then by the cross-session objects concerned. Each requirement can be verified independently, and the requirements are grouped into three levels, L1 to L3.

The overarching principle throughout is least agency, which grants an agent only the minimum scope of action and degree of autonomy required to complete its business tasks. Least privilege governs what an agent can access. Least agency also governs what the agent can decide on its own and how long it can operate unattended.

This baseline can be used in three ways.

- Platform development: select a target level and implement each requirement. The requirements serve both as design inputs and as test cases.
- Vendor assessment: use the requirements as a questionnaire, asking vendors to explain how each requirement is implemented and to provide evidence.
- Security review: select the requirements that apply to the scope under review, verify each one, and record the conclusions in the accompanying assessment workbook.

The current version is v1.0. Its structure follows OWASP ASVS 5.0. Requirement identifiers use the format "V chapter.section.item", for example V4.2.1. When citing this baseline, state the version number.

## 1. Scope

This baseline applies to agent platforms and harnesses deployed or procured within the enterprise. It addresses only the identity under which an agent acts, the authorization under which it acts, the path through which it accesses resources, and the outputs it produces. Execution isolation, egress control, and output control are the enforcement means for implementing authorization, and they are included in this baseline.

Applicable objects include:

- Self-built agent platforms and agent applications
- Procured SaaS agent platforms, and agents embedded in SaaS products
- Agents running on employee endpoints, such as coding agents, desktop assistants, and browser extensions
- Both private deployment and SaaS delivery models

Out of scope:

- Data governance for model training and fine-tuning, model robustness, and adversarial examples. Refer to OWASP AISVS and CSA AICM.
- Content safety and output accuracy, such as hallucination, bias, and harmful content
- The access control design of downstream business systems themselves. This baseline only requires that these systems can receive and verify the user identity conveyed when accessing on behalf of a user.
- General infrastructure security, such as host hardening, network perimeter, and vulnerability management, which is governed by the enterprise's existing baselines

The requirements are written with the platform as the subject. In procurement scenarios, the using enterprise verifies the vendor against the requirements. In the requirements, "enterprise" refers to the using organization, "platform" refers to the system that provides agent capabilities, and "provider" refers to the party that develops or operates the platform.

## 2. Normative References and Reference Documents

A document named directly in a requirement, without "such as" or "or equivalent," is a normative reference and shall be implemented as specified. All other documents are used only for mapping and background reference.

| Document | Publisher | Status | Type | Use in this baseline |
| --- | --- | --- | --- | --- |
| [RFC 6749 OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749) | IETF | Formal RFC | Normative | User authorization and access tokens (V4.3) |
| [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) | OpenID Foundation | Final specification | Normative | Enterprise IdP login (V1.1.1) |
| SAML 2.0 | OASIS | Formal standard | Normative | Enterprise IdP login (V1.1.1) |
| [RFC 8693 OAuth 2.0 Token Exchange](https://www.rfc-editor.org/rfc/rfc8693) | IETF | Formal RFC | Normative | Access on behalf of a user, delegation chain, and the act claim |
| [RFC 9449 OAuth 2.0 Demonstrating Proof of Possession (DPoP)](https://www.rfc-editor.org/rfc/rfc9449) | IETF | Formal RFC | Normative | Sender-constraining of tokens (V4.6.2) |
| [RFC 8705 OAuth 2.0 Mutual-TLS Client Authentication and Certificate-Bound Access Tokens](https://www.rfc-editor.org/rfc/rfc8705) | IETF | Formal RFC | Normative | Sender-constraining of tokens (V4.6.2) |
| [RFC 7489 DMARC](https://www.rfc-editor.org/rfc/rfc7489) | IETF | Informational RFC | Normative | Sender verification for the email channel (V1.2.6) |
| [Model Context Protocol Specification 2026-07-28](https://modelcontextprotocol.io/specification/versioning) | MCP project | Current version | Normative | MCP invocation and authorization (V4.5) |
| [RFC 9470 OAuth 2.0 Step Up Authentication Challenge Protocol](https://www.rfc-editor.org/rfc/rfc9470) | IETF | Formal RFC | Informative | Authentication time and strength for step-up authentication (V1.1.3, V3.5) |
| [RFC 8707 Resource Indicators for OAuth 2.0](https://www.rfc-editor.org/rfc/rfc8707) | IETF | Formal RFC | Informative | Token audience restriction (V4.5.5, V4.6.3) |
| [RFC 9700 OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700) | IETF | BCP | Informative | Security requirements for OAuth implementations |
| RFC 7643, RFC 7644 SCIM | IETF | Formal RFC | Informative | Synchronization and disabling of users and groups (V1.1.2) |
| [OpenID Shared Signals Framework 1.0](https://openid.net/wg/sharedsignals/) | OpenID Foundation | Final specification (September 2025) | Informative | Transmission of security events |
| [OpenID Continuous Access Evaluation Profile (CAEP) 1.0](https://openid.net/specs/openid-caep-1_0-final.html) | OpenID Foundation | Final specification (September 2025) | Informative | Session revocation and risk signals (V3.5.2, V10.4.4) |
| [RFC 9396 OAuth 2.0 Rich Authorization Requests](https://www.rfc-editor.org/rfc/rfc9396) | IETF | Formal RFC | Informative | Fine-grained authorization description (V2.2.6) |
| [Identity Assertion JWT Authorization Grant (ID-JAG) draft-04](https://www.ietf.org/archive/id/draft-ietf-oauth-identity-assertion-authz-grant-04.html) | IETF OAuth WG | Working group draft | Informative | Exchange of enterprise IdP assertions for downstream tokens, i.e., Cross-App Access (XAA) (V4.3.3, V4.5.4) |
| [RFC 7523 JWT Profile for OAuth 2.0 Client Authentication and Authorization Grants](https://www.rfc-editor.org/rfc/rfc7523) | IETF | Formal RFC | Informative | Authorization grant used by ID-JAG |
| [Identity Continuation Assertion draft-02](https://datatracker.ietf.org/doc/draft-mcguinness-oauth-id-continuation-assertion/) | IETF individual draft | Individual draft (September 2026) | Informative | Continuation of the delegation chain after the user goes offline |
| [Transaction Tokens draft-11](https://datatracker.ietf.org/doc/draft-ietf-oauth-transaction-tokens/) | IETF OAuth WG | Working group draft | Informative | Propagation of authorization context along call chains within a single trust domain (V2.4.7) |
| [OpenID AuthZEN Authorization API 1.0](https://openid.net/specs/authorization-api-1_0.html) | OpenID Foundation | Final specification (January 2026) | Informative | Standard interface for policy decision points (V3.2.5) |
| [SPIFFE](https://spiffe.io/) | CNCF | Specification of a graduated project | Informative | Workload identity and attestation for execution instances (V1.4.5) |
| [WIMSE Architecture draft-08](https://datatracker.ietf.org/doc/draft-ietf-wimse-arch/) | IETF WIMSE WG | Working group draft | Informative | Workload identity across systems (V1.4) |
| [MCP Enterprise-Managed Authorization extension](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization) | MCP project | Official extension | Informative | Access to MCP servers authorized through the enterprise IdP (V4.5.4) |
| [NIST SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) | NIST | Formal publication | Informative | Continuous verification and least privilege |
| [NIST SP 800-63-4 Digital Identity Guidelines](https://csrc.nist.gov/pubs/sp/800/63/4/final) | NIST | Formal publication (July 2025) | Informative | Authentication assurance and reauthentication |
| [NIST IR 8587 Protection of Tokens and Assertions Against Forgery, Theft, and Misuse](https://csrc.nist.gov/pubs/ir/8587/final) | NIST | Formal publication (September 2026) | Informative | Token management |
| [NIST NCCoE Concept Paper on Software and AI Agent Identity and Authorization](https://www.nccoe.nist.gov/sites/default/files/2026-02/accelerating-the-adoption-of-software-and-ai-agent-identity-and-authorization-concept-paper.pdf) | NIST | Draft for comment (February 2026) | Informative | Problem framework: identification, authentication, authorization, delegation, auditing, and prompt injection |
| [Back to the Future: Why Agentic AI Needs a Strong Identity Foundation](https://www.nist.gov/blogs/cybersecurity-insights/back-future-why-agentic-ai-needs-strong-identity-foundation) | NIST | Blog post (August 27, 2026) | Informative | Foundational identity principles and public feedback on the concept paper |
| [OWASP Top 10 for Agentic Applications for 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) | OWASP | Released December 2025 | Informative | Risk mapping, see Appendix A; source of least agency |
| [OWASP Top 10 for LLM Applications 2025](https://genai.owasp.org/llm-top-10/) | OWASP | Released November 2024 | Informative | Risk mapping, see Appendix A |
| [OWASP AISVS 1.0](https://owasp.org/www-project-artificial-intelligence-security-verification-standard-aisvs-docs/) | OWASP | Released June 2026 | Informative | Control mapping, see Appendix B |
| [OWASP ASVS 5.0](https://owasp.org/www-project-application-security-verification-standard/) | OWASP | Formally released | Informative | Structure of this baseline |
| [CSA AI Controls Matrix v1.1](https://cloudsecurityalliance.org/blog/2026/07/14/ai-controls-matrix-v1-1-strengthening-the-foundation-for-trustworthy-ai) | CSA | Released July 2026 | Informative | Control mapping, see Appendix C |
| [Agent Frameworks, Runtimes, and Harnesses](https://www.langchain.com/blog/agent-frameworks-runtimes-and-harnesses-oh-my) | LangChain | Blog post (October 2025) | Informative | Classification of frameworks, runtimes, and harnesses (4.1) |
| [The lethal trifecta for AI agents](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) | Simon Willison | Article (June 2025) | Informative | Combined risk of non-public data, untrusted content, and outbound transfer (V6.2, V7.5) |
| [The Dual LLM pattern](https://simonwillison.net/2023/Apr/25/dual-llm-pattern/) | Simon Willison | Article (April 2023) | Informative | Processing untrusted content with an isolated model (V6.2.4) |
| [CaMeL: Defeating Prompt Injections by Design](https://arxiv.org/abs/2503.18813) | Google DeepMind et al. | Paper (2025) | Informative | Separation of control flow and data flow (V6.2.4) |

Draft documents may change or be withdrawn. When adopting a draft, refer to its latest version at the time of implementation.

## 3. Terms and Definitions

The following terms have specific meanings in this baseline. Wherever they appear in the requirements, they shall be interpreted accordingly.

| No. | Term | Definition |
| --- | --- | --- |
| 3.1 | Agent | An AI system that can understand a goal, invoke tools, and autonomously complete multi-step tasks. This baseline uses the short form "agent" in its body text. |
| 3.2 | Harness | A software layer that wraps the model and enables the agent to perceive and act. It consists of several subsystems: the agent loop, context management (including compaction), the tool layer, security controls (permissions, approvals, hooks), orchestration (planning, sub-agents), and extension interfaces (skills, plugins, MCP). Claude Code, Claude Agent SDK, and DeepAgents belong to this category. This baseline retains the English term. |
| 3.3 | Framework | A library that provides development abstractions such as model invocation and tool definition, for example LangChain, OpenAI Agents SDK, and Vercel AI SDK |
| 3.4 | Runtime | Infrastructure that provides durable execution, state persistence, and crash recovery for agents, for example LangGraph and Temporal. A harness can be built on top of a runtime. |
| 3.5 | Execution environment | The environment in which a harness executes code, commands, file operations, and browser operations, for example a container sandbox, a virtual machine, or an employee endpoint |
| 3.6 | Platform | The overall system that provides capabilities for creating, running, and managing agents. It includes the harness, the runtime, the execution environment, the policy decision point, the egress gateway, and the management plane. |
| 3.7 | Provider | The party that develops or operates the platform |
| 3.8 | User | A natural person who has an identity in the enterprise IdP and uses an agent |
| 3.9 | Autonomous agent | An agent that performs operations under its own identity and does not act on behalf of any particular user. It typically accesses downstream systems with an application identity, as opposed to accessing on behalf of a user. "Autonomous" here refers to running under the agent's own identity (corresponding to the autonomous agent concept in Microsoft Entra Agent ID). It is unrelated to the degree of autonomy described in 3.29. |
| 3.10 | Delegation | The act of one principal handing part of its own permissions to another principal to exercise on its behalf |
| 3.11 | Access on behalf of a user (on-behalf-of, OBO) | An agent accesses downstream systems under the authorization of the initiating user, and the downstream system makes its authorization decision according to that user's permissions. When delegation semantics are used, the token identifies both the user (subject) and the agent (the actor in the act claim). |
| 3.12 | Delegation chain | An ordered record of successive delegation relationships from the initiating user or trigger source to the current executor. It corresponds to the nested act claims in RFC 8693. |
| 3.13 | Agent authorization scope | The upper limit of tools, connections, and data available to an agent, as configured by an administrator |
| 3.14 | Effective permissions | The permissions actually available for a single invocation. For access on behalf of a user, the effective permissions are the intersection of the initiating user's current permissions, the agent authorization scope, and the task-declared scope (if any). For an autonomous agent, they are the intersection of its own authorization and the agent authorization scope. Sub-agents and downstream agents are additionally intersected with the delegation scope of their upstream. |
| 3.15 | Offline delegated task | A scheduled or long-running task that a user creates and that runs in the user's absence, as well as event-triggered rules executed under that user's identity |
| 3.16 | Policy decision point (PDP) | A component that makes authorization decisions based on identity, delegation chain, operation, and context |
| 3.17 | Egress gateway | The sole exit through which an agent accesses any system outside the execution environment, including internal enterprise systems and external services. It enforces authorization decisions, injects credentials, applies rate limiting, and serves as the primary policy enforcement point. |
| 3.18 | Workload identity | A verifiable identity that the platform issues to an execution instance, consisting of a workload identifier (such as a SPIFFE ID) and identity credentials (such as X.509-SVID or JWT-SVID). This baseline requires that it be issued per session and bound to the execution instance. The user and agent corresponding to the session are registered by the platform at issuance, and the gateway looks them up based on this identity. |
| 3.19 | Credential custody | Tokens and keys required to access downstream systems are held by the platform and injected into requests only at the egress gateway. Neither the agent nor the model ever has access to the plaintext. |
| 3.20 | Placeholder credential | An invalid value in the execution environment and context that stands in for a real credential. The gateway verifies the destination at egress and replaces the placeholder with the real credential. This process is called credential injection. |
| 3.21 | Untrusted content | Content that is neither platform policy nor direct input from the user. It includes web pages, emails, files, tool return values, and outputs from other agents. |
| 3.22 | Channel (interaction channel) | An entry point through which users interact with agents, such as Web, IM, email, IDE, and API |
| 3.23 | Output artifact | A report, document, code, or other item that an agent generates and saves or shares |
| 3.24 | Memory | Content retained across sessions that can be retrieved later, including personal memory and shared knowledge |
| 3.25 | Persistent operation | An operation that enables an agent to continue acting after the current session ends, such as creating a scheduled task, a trigger rule, a forwarding rule, or a skill |
| 3.26 | High-risk operation | An operation determined under V3.1 to require approval or step-up authentication |
| 3.27 | Workspace | A management unit within the platform that isolates data, knowledge, credentials, and agents, such as a tenant, department, or project. It differs from a workspace opened in an IDE, which this baseline calls a project directory. |
| 3.28 | Owner | A named natural person responsible for an agent's configuration, permissions, and behavior |
| 3.29 | Least agency | Granting an agent only the minimum scope of action and degree of autonomy required to complete its business tasks. The term originates from the OWASP Top 10 for Agentic Applications for 2026. |
| 3.30 | Non-public data | Data classified as non-public under the enterprise data classification and grading standard. The specific level is determined by the enterprise standard. It corresponds to "private data" in the lethal trifecta. |
| 3.31 | Outbound transfer | Sending data outside the enterprise's controlled scope, that is, to a recipient not registered as an enterprise downstream system (see V4.2.5). Examples include external mailboxes, external websites, and external storage. |
| 3.32 | Task | A single unit of work that a user or trigger source assigns to an agent, from start until completion or termination. A task may include multiple model invocations and tool invocations. |
| 3.33 | Policy enforcement point (PEP) | A component that allows or denies requests according to the decisions of the policy decision point. In this baseline, it is implemented by the harness's pre-execution checks and the egress gateway. |
| 3.34 | Step-up authentication | After a user has logged in, re-authentication before performing a high-risk operation, at a higher authentication strength or with a more recent authentication time. See RFC 9470. |
| 3.35 | External principal | A customer or partner identity that accesses the platform through identity federation and is not in the enterprise IdP |
| 3.36 | Shadow AI agent | An agent that has not been registered or brought under management and that employees have connected to enterprise resources on their own initiative |
| 3.37 | Break-glass account | A pre-provisioned account used to log in to the management plane when the enterprise IdP is unavailable |

## 4. Reference Architecture and Trust Boundaries

An agent consists of a model and a harness. In addition to the harness, the platform includes an identity layer, a policy decision point, an egress gateway, a data layer, a management plane, and auditing. Each requirement in this baseline is implemented in one of these components.

### 4.1 Technology Stack Layers

&#91;embedded content: agent technology stack layers · model, harness, framework, runtime, execution environment\]

A harness can be developed with the help of a framework, or it can run directly on a runtime. Following the LangChain classification (see Chapter 2), Claude Code and Claude Agent SDK are harnesses, LangGraph is a runtime, and LangChain is a framework. The security control subsystem of the harness is the enforcement component for most requirements in V3 and V5.

### 4.2 Platform Reference Architecture

&#91;embedded content: platform reference architecture · trusted components and untrusted parts\]

Model output is only a request. The execution environment may be compromised, and content returned by downstream systems is treated as untrusted. All external access shall pass only through the egress gateway, and real credentials are injected only at the gateway.

| Component | Responsibility | Trust assumption | Primary chapters |
| --- | --- | --- | --- |
| Identity layer | Enterprise IdP, directory, and SCIM; issues user, agent, and workload identities | Trusted | V1 |
| Interaction channel | Web, IM, email, IDE, API, and other entry points; responsible for identity mapping and the visibility scope of output | Trusted; content entering through the channel is untrusted | V1.2, V7 |
| Harness | Agent loop, context management, tool layer, security controls, orchestration, extension interfaces | Trusted when hosted by the platform; untrusted when running on employee endpoints, per V5.4 | V3, V5, V6 |
| Model | Generates text and tool invocation requests | Untrusted; output is only a request | V3, V6 |
| Policy decision point | Computes effective permissions, determines risk levels, and decides whether approval is required | Trusted | V2, V3 |
| Egress gateway | Unified exit; injects credentials, verifies destinations, applies rate limiting, and performs revocation | Trusted | V4 |
| Downstream system | SaaS, internal APIs, MCP servers, and databases accessed by the agent | Makes its own authorization decisions; returned content is untrusted | V4 |
| Data layer | Knowledge bases, RAG, memory, output artifacts | Trusted; stored content may be contaminated and is treated as untrusted content | V8 |
| Execution environment | Executes code, commands, file operations, and browser operations | Untrusted; may be compromised | V5 |
| Management plane | Agent registration, connectors, managed policies, lifecycle | Trusted | V9 |
| Auditing | Recording, retrieval, export, and retention, plus detection and response | Trusted | V10 |

Components in the table are listed in the order shown in the diagram. The identity layer provides identity to the other components and is therefore listed first. The remaining components follow the order in which a request passes through them, ending with the downstream systems. Next are the data layer and execution environment that the harness invokes. Finally, the management plane and auditing, which span the entire process.

### 4.3 Checkpoints for a Single Tool Invocation

| Step | Checkpoint | What happens | Responsible component | Related requirements |
| --- | --- | --- | --- | --- |
| 1 | Entry authentication | The channel account is mapped to an enterprise identity | Interaction channel, identity layer | V1.1, V1.2 |
| 2 | Session establishment | A workload identity is issued, and the user and agent are determined | Harness, identity layer | V1.4 |
| 3 | Context assembly | The tool list, memory, and retrieval results are filtered by effective permissions | Harness, data layer | V3.3, V8.1, V8.3 |
| 4 | Pre-execution validation | Policy checks and risk classification are performed before execution | Harness, policy decision point | V2.2, V3.1, V3.2 |
| 5 | Manual confirmation | An approval is generated from the actual parameters, with step-up authentication where necessary | Harness, identity layer | V3.4, V3.5 |
| 6 | Egress execution | Credentials are injected by the gateway, the destination is verified, and rate limiting is applied | Egress gateway | V4.1, V4.2, V3.8 |
| 7 | Downstream authorization decision | The downstream system makes its authorization decision based on the user identity conveyed when accessing on behalf of the user | Downstream system | V2.1, V4.3, V4.4 |
| 8 | Response handling | Returned content is treated as untrusted and its source is marked | Harness | V6.1, V6.2 |
| 9 | Output inspection | The recipient, sensitive data, and rendering risks are inspected | Interaction channel, egress gateway | V7.1, V7.4, V7.5 |
| 10 | End-to-end logging | Each step is written to audit and can be traced to a person, an agent, and the input source | Auditing | V10.1 |

## 5. Threat Model

This baseline assumes that model output is untrusted, that agents may be induced or compromised, and that the enterprise IdP and the egress gateway are trusted. All requirements exist to defend against 16 categories of threats under these assumptions.

### 5.1 Premises

- A1: The enterprise IdP, the directory, and the identity assertions they issue are trusted.
- A2: The policy decision point, the egress gateway, and audit storage are trusted. Their own operation is governed by V9 and V10.
- A3: Model output is untrusted. The identities, risk judgments, summaries, and tool parameters provided by the model are requests to be checked.
- A4: Untrusted content entering the context may contain malicious instructions.
- A5: Downstream systems correctly make authorization decisions based on the identity they receive. Downstream systems that cannot do so are handled under V4.4.
- A6: Employee endpoints are not necessarily controlled. Agents running on endpoints are handled under V5.4.

### 5.2 Threat Actors

| ID | Actor | Capabilities | Typical objectives |
| --- | --- | --- | --- |
| TA1 | External attacker | Can place content in web pages, emails, documents, tickets, and tool return values, without direct access to the platform | Use the agent's permissions to exfiltrate data or perform operations |
| TA2 | Internal user attempting to exceed their authorization | Holds a legitimate account with limited permissions | Use agents, shared sessions, group chats, or memory to obtain data beyond their own permissions |
| TA3 | Rogue or compromised agent | Its objective has been rewritten by injection, or its execution environment has been compromised | Impersonate identities, expand permissions, establish persistence, and invoke other agents laterally |
| TA4 | Malicious supply chain component | Enters the platform as a third-party skill, plugin, MCP server, or project configuration (such as MCP definitions and hooks in a code repository) | Gain execution rights, steal credentials, implant long-term instructions |
| TA5 | Internal platform personnel and provider | Administrators, operations staff, and provider support personnel | Read the credential store, conversations, and audit records; access customer data through operations channels |
| TA6 | Channel impersonator | External visitors, or stolen IM or email accounts | Invoke agents by impersonating employees |

### 5.3 Threat List

| ID | Threat | Primary actors | Corresponding chapters | OWASP |
| --- | --- | --- | --- | --- |
| T1 | Confused deputy: the agent uses the platform's high-privilege credentials to act for a low-privilege user | TA1, TA2 | V2, V4 | ASI03, LLM06 |
| T2 | Identity spoofing: forging a user, agent, or workload identity to invoke the gateway or downstream systems | TA3, TA6 | V1, V4 | ASI03 |
| T3 | Delegation amplification: permissions expand or lose their time limit through multi-level delegation, sub-agents, or offline tasks | TA3 | V2 | ASI03, ASI07 |
| T4 | Goal hijacking: untrusted content rewrites the agent's objective so that it performs operations the user is authorized to perform but did not intend | TA1 | V3, V6 | ASI01, LLM01 |
| T5 | Credential exfiltration: tokens enter the context or sandbox and leak, or are induced to be sent to an attacker's address | TA1, TA3 | V4, V5 | ASI03, LLM02 |
| T6 | Egress bypass: bypassing the gateway to connect directly to internal networks, databases, or the internet | TA3, TA4 | V4, V5 | ASI02 |
| T7 | Execution escape: code, commands, browser, or endpoint execution exceeds its intended boundary | TA3, TA4 | V5 | ASI05 |
| T8 | Output leakage: results are seen by unauthorized persons, or leak through rendering or outbound transfer | TA1, TA2 | V7 | LLM02, LLM05 |
| T9 | Data and memory contamination: cross-user retrieval, memory poisoning, output artifacts losing their data classification | TA1, TA2 | V8 | ASI06, LLM04, LLM08 |
| T10 | Persistence and loss of control: agents build automations that leave backdoors, or keep running after being disabled | TA3 | V3, V10 | ASI10 |
| T11 | Approval deception and fatigue: approval content is altered, or excessive approval requests lead to hasty approvals | TA1, TA3 | V3 | ASI09 |
| T12 | Supply chain poisoning: skills, plugins, MCP, and project configurations introduce malicious behavior | TA4 | V5, V9 | ASI04, LLM03 |
| T13 | Cascading failure: errors or malicious output from one agent are amplified along the chain | TA3 | V6 | ASI08 |
| T14 | Privilege abuse: platform administrators or the provider read credentials, conversations, or customer data | TA5 | V9, V10 | None directly |
| T15 | Resource abuse: bulk export, looped invocation, cost exhaustion | TA2, TA3 | V3 | LLM10 |
| T16 | Untraceability: after an incident, it cannot be determined who had which agent act, on what basis, and what it did | All | V10 | None directly |

## 6. Levels and Usage

Requirements are first organized by the order in which an agent action occurs and then by the cross-session objects they concern. They are divided into three levels, L1 to L3. Higher levels include all requirements of lower levels.

### 6.1 Main Axis

Chapters 7 through 16, that is, V1 through V10, are organized as follows. The first seven chapters follow the order in which an action occurs. The last three are organized by the persistent objects that exist across sessions (data, agents, and auditing) and span the full lifecycle. Each requirement belongs to exactly one chapter. Requirements addressing a single action are placed in the chapter corresponding to the stage in which they take effect, and requirements addressing these three types of objects themselves are placed in the last three chapters.

| Phase | Chapter | Question answered |
| --- | --- | --- |
| Before the action | V1 Identity and Authentication | Who is initiating, and which agent is executing |
| Before the action | V2 Delegation and Effective Permissions | On whose behalf, and what is the upper limit of permissions |
| Before the action | V3 Authorization Decisions | Can this operation be performed, and does it require human confirmation |
| During the action | V4 Credentials and Egress Enforcement | How requests leave, and how credentials are injected |
| During the action | V5 Execution Isolation | Within what boundaries code, commands, browsers, and extensions run |
| During the action | V6 Context and Untrusted Input | Can content that was read in influence decisions |
| After the action | V7 Output and Visibility | To whom are results shown, and could they be leaked |
| Full lifecycle | V8 Data, Memory, and Output Artifacts | How data is retrieved, accumulated, and retained |
| Full lifecycle | V9 Lifecycle and Governance | Who manages agents, from registration to decommissioning |
| Full lifecycle | V10 Audit, Detection, and Response | How activity is recorded, discovered, and contained |

### 6.2 Levels

| Level | Positioning | Suitable platforms |
| --- | --- | --- |
| L1 | Baseline. Absence directly causes unauthorized access, credential leakage, or an inability to assign accountability | Any agent platform used within the enterprise |
| L2 | Standard. Capabilities that mainstream enterprise security reviews require | Platforms that process internal data or connect to multiple business systems |
| L3 | Enhanced. Defense in depth and fine-grained governance | Platforms in highly regulated industries such as finance, healthcare, and critical infrastructure, or platforms that process highly sensitive data |

Classification rule: a requirement is assigned to L1 if it meets any of the following conditions. First, if it is absent, external attackers, internal users attempting to exceed their authorization, or channel impersonators (TA1, TA2, TA6) can gain unauthorized access or obtain credentials without any other condition. Second, if it is absent, rogue agents, malicious supply chain components, or internal platform personnel (TA3, TA4, TA5) can directly obtain plaintext credentials or cross-user or cross-tenant data. Third, if it is absent, any of the initiating user, executing agent, delegation chain or approver of an operation cannot be determined. Requirements that can be exploited only in combination with other conditions, or that primarily limit the scope of impact, are assigned to L2. Requirements aimed at specific high-risk scenarios or requiring substantial investment are assigned to L3. L1 requirements do not presuppose implementation of L2 or L3 requirements.

This version contains 240 requirements distributed across 62 sections: 90 at L1, 137 added at L2 on top of L1, and 13 more added at L3. L1 retains only controls whose absence can be directly exploited or leads to an inability to assign accountability. Implementation details, alerting, defense in depth, and management processes that overlap with other L1 requirements are assigned to L2.

### 6.3 Applicability Conditions

Some sections apply only when the platform has a particular capability. The beginning of such a section states this, for example, "This section applies to platforms that support offline delegated tasks." When the platform does not have that capability, the entire section is recorded as "Not applicable" and is excluded from the conformance rate.

### 6.4 Normative Language and Numbering

- Requirements are uniformly worded with "shall." Whether a requirement must be satisfied is determined by its level and applicability conditions. The word "should" in explanatory text does not constitute a requirement.
- Identifiers use the format "V chapter.section.item", for example V4.1.3. After an item is deleted, its identifier is not reused. New items are appended at the end of the section.
- Each requirement describes a verifiable outcome. When a requirement contains multiple clauses, it is judged satisfied only if all clauses are satisfied.
- Requirements written with "shall be able to" or "shall support" are judged to require that the platform has the capability and that the enterprise can enable it. All other requirements are judged on whether they are enabled and in effect in the deployment being assessed. Vendor assessments judge only the former; security reviews judge both.
- When a requirement constrains systems outside the platform, such as downstream systems, internal network services, or employee endpoints, the using enterprise is responsible for implementation, and the responsible party is recorded separately during assessment.
- For time limits, periods, and thresholds that a requirement does not specify numerically (such as "short validity period," "periodic," or "agreed duration"), the requirement is judged satisfied only if the enterprise or platform has specified a concrete value in writing and it is in effect in configuration. The table below gives recommended defaults, which enterprises may adjust according to risk.

| Item | Related requirements | Recommended default |
| --- | --- | --- |
| Validity period of downstream access tokens | V1.3.4, V4.6.1 | No more than 1 hour |
| Time limit for rejecting related calls after a user is disabled or downgraded | V10.4.1 | No more than 5 minutes |
| Review cycle for agent connections and permissions | V9.4.2 | Once per quarter |
| Period after which an agent is considered long unused | V9.4.3 | 90 consecutive days without invocation |

## 7. V1 Identity and Authentication

Each request shall determine two identities: the person initiating it and the agent executing it. The platform derives both from trusted sources and does not accept identities self-reported by the request or the model.

### V1.1 User Authentication

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V1.1.1 | The platform and all its channels shall allow login only through the enterprise IdP (OIDC or SAML) and shall not provide independent local accounts, except for the break-glass accounts specified in V10.5 | ✓ | ✓ | ✓ |
| V1.1.2 | Users and groups shall be synchronized through SCIM or an equivalent mechanism, and users disabled in the IdP shall be disabled in the platform in sync | | ✓ | ✓ |
| V1.1.3 | The authentication time and authentication strength issued by the IdP shall be retained in the user session for use in the step-up authentication decisions of V3.5 | | ✓ | ✓ |
| V1.1.4 | Credentials used to invoke agents through an API (such as API keys and personal access tokens) shall be bound to a specific user or non-human identity in the enterprise IdP, shall have an expiration time and a permission scope set, and shall be revoked automatically when the identity is disabled | ✓ | ✓ | ✓ |

### V1.2 Channel Identity Mapping

This section applies to platforms that support third-party channels such as IM, email, and browser extensions.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V1.2.1 | A channel account shall be bound to an enterprise identity through a one-time SSO login before it can invoke an agent | ✓ | ✓ | ✓ |
| V1.2.2 | The SSO binding result shall be the sole basis for identifying a channel account. Matching by nickname, display name, or email string is not permitted. The email channel follows V1.2.6. | ✓ | ✓ | ✓ |
| V1.2.3 | When a user is disabled in the IdP, all of that user's channel bindings shall be invalidated in sync | | ✓ | ✓ |
| V1.2.4 | Accounts from external visitors and from cross-organization shared channels shall be identified, and the agents and capabilities available to them shall be restricted separately | | ✓ | ✓ |
| V1.2.5 | When a high-risk operation is triggered within a channel, the user shall be required to complete step-up authentication through the enterprise IdP | | ✓ | ✓ |
| V1.2.6 | The email channel shall accept only email that passes DMARC verification (SPF or DKIM passing and aligned with the From domain). Senders from external domains shall not be able to trigger operations on behalf of a user. | ✓ | ✓ | ✓ |

### V1.3 Agent Identity

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V1.3.1 | Each agent shall have a unique identifier issued by the platform. The platform shall not accept identities self-reported by the agent. | ✓ | ✓ | ✓ |
| V1.3.2 | An independent non-human identity shall be established in the enterprise directory for each autonomous agent. No employee's personal account shall be used. | ✓ | ✓ | ✓ |
| V1.3.3 | When an autonomous agent accesses downstream systems, it shall use the identity established under V1.3.2, and the principal recorded in downstream logs shall be that agent | | ✓ | ✓ |
| V1.3.4 | When an autonomous agent accesses downstream systems, it shall use short-lived tokens and shall not use long-term static keys | | ✓ | ✓ |
| V1.3.5 | The keys and certificates of an autonomous agent shall have processes for issuance, rotation, and revocation, and the rotation period shall have an upper limit | | ✓ | ✓ |

### V1.4 Workload Identity

This section applies to platforms that allocate a separate execution instance (such as a container, sandbox, or virtual machine) to each session.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V1.4.1 | The platform shall issue a short-lived workload identity to the execution instance of each session and bind it to that instance | ✓ | ✓ | ✓ |
| V1.4.2 | The credentials of the workload identity shall be invisible to the model and shall not enter the context or tool return values | ✓ | ✓ | ✓ |
| V1.4.3 | The egress gateway shall determine the user and agent solely from the workload identity and shall ignore user or agent identifiers self-reported in the request | ✓ | ✓ | ✓ |
| V1.4.4 | When a session ends or an execution instance is destroyed, the corresponding workload identity shall be revoked immediately | | ✓ | ✓ |
| V1.4.5 | Before issuing a workload identity, the platform shall perform workload attestation on the execution instance (such as node attestation and workload attestation in SPIFFE/SPIRE). The identity shall not be issued if attestation fails. | | | ✓ |

### V1.5 External Principals

This section applies to platforms that open agent capabilities to customers or partners.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V1.5.1 | External principals shall be accessed through identity federation, and no shared account shall be created for them | | ✓ | ✓ |
| V1.5.2 | External principals shall have access only to the workspaces and interfaces made available to them | ✓ | ✓ | ✓ |
| V1.5.3 | Invocations by external principals shall be recorded separately in the audit log and shall be filterable by external organization | | ✓ | ✓ |

## 8. V2 Delegation and Effective Permissions

An agent's upper limit of permissions derives from the person it represents, not from credentials held by the platform itself. Effective permissions are the intersection defined in 3.14 and can only be narrowed along the delegation chain.

### V2.1 Access on Behalf of a User

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V2.1.1 | When the user is present, an agent accessing downstream systems shall carry the identity of the initiating user, and the downstream system shall make its authorization decision based on that user. Downstream systems that do not support user-level authorization decisions are handled under V4.4. | ✓ | ✓ | ✓ |
| V2.1.2 | Shared credentials with higher permissions than the initiating user shall not be used to access downstream systems on the user's behalf. Downstream systems that support only shared static credentials are handled by compensating controls under V4.4. | ✓ | ✓ | ✓ |
| V2.1.3 | Downstream tokens shall identify both the initiating user and the executing agent (such as the act claim in RFC 8693) | | ✓ | ✓ |

### V2.2 Effective Permissions

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V2.2.1 | The effective permissions of each invocation shall be the intersection of the user's permissions and the agent authorization scope | ✓ | ✓ | ✓ |
| V2.2.2 | Effective permissions shall be computed by the policy decision point and shall not depend on the system prompt or on the model's judgment | ✓ | ✓ | ✓ |
| V2.2.3 | At the start of a task, the required tool and data scope shall be declared. During execution, only permissions within the declared scope shall be granted. The declaration is provided by the user or by agent configuration, and any scope proposed by the model shall take effect only after user confirmation. | | ✓ | ✓ |
| V2.2.4 | Invocations beyond the task's declared scope shall be rejected or require approval | | ✓ | ✓ |
| V2.2.5 | Effective permissions shall be recomputed on each tool invocation and shall not reuse the authorization result from the start of the session | | ✓ | ✓ |
| V2.2.6 | Authorization for high-risk operations shall be refined to specific resources and parameters (for example, using RFC 9396 Rich Authorization Requests to describe the authorization details) and shall not grant only coarse-grained roles | | | ✓ |

### V2.3 Offline Delegated Tasks

This section applies to platforms that support scheduled tasks or long-running tasks.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V2.3.1 | An offline delegated task shall be rooted in its creating user. The permission upper limit shall be fixed at creation and can only be narrowed thereafter. | ✓ | ✓ | ✓ |
| V2.3.2 | The account status and current permissions of the creating user shall be rechecked before each run | ✓ | ✓ | ✓ |
| V2.3.3 | The scheduler shall store only task identifiers and shall not store user credentials or directly usable tokens | ✓ | ✓ | ✓ |
| V2.3.4 | When the creating user is disabled, their offline delegated tasks shall stop automatically, and the owner of the agent shall be notified | | ✓ | ✓ |
| V2.3.5 | For tasks that must continue running after the creating user leaves or changes roles, the tasks shall be converted to autonomous agents and reauthorized through approval before the user's account is disabled | | ✓ | ✓ |
| V2.3.6 | The authorization for an offline delegated task shall have an expiration time, after which the creating user must reconfirm it | | ✓ | ✓ |

### V2.4 Inter-Agent Delegation

This section applies to platforms that support multi-agent collaboration or sub-agents.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V2.4.1 | The effective permissions of a downstream agent shall not exceed the permissions of the initiating user or the delegation scope granted by the upstream agent. The initiating user shall not obtain, through a downstream agent, permissions that the user does not hold. | ✓ | ✓ | ✓ |
| V2.4.2 | For sub-agents derived by the harness, the available tools and permissions shall be a subset of those of the parent agent | | ✓ | ✓ |
| V2.4.3 | The delegation chain shall be constructed and recorded by the platform. Identity assertions not signed by the platform or by a trusted authorization server shall not be accepted. | ✓ | ✓ | ✓ |
| V2.4.4 | Which agents may invoke which other agents shall be explicitly configured. Invocations that are not configured shall be rejected. | | ✓ | ✓ |
| V2.4.5 | The depth of the delegation chain shall be limited, and circular invocations shall be detected and blocked | | ✓ | ✓ |
| V2.4.6 | In multi-hop delegation, downstream tokens shall carry the complete executor chain (such as nested act claims in RFC 8693) so that downstream systems can make authorization decisions accordingly | | ✓ | ✓ |
| V2.4.7 | For cross-service invocations within the same trust domain, tokens carrying user, agent, and task context shall be propagated along the call chain (such as the Transaction Tokens draft), so that downstream systems can make authorization decisions accordingly | | | ✓ |

### V2.5 Inter-User Delegation and Temporary Privilege Elevation

This section applies to platforms that support users having others operate their agents on their behalf, or that support temporary privilege elevation for agents.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V2.5.1 | When a user permits others to operate the user's agent on their behalf (for example, an assistant acting for a manager), the delegation relationship shall be explicitly registered, with a defined scope and period | | ✓ | ✓ |
| V2.5.2 | When operating on behalf of another person, audit shall record both the principal and the person who actually performed the operation | | ✓ | ✓ |
| V2.5.3 | When an agent requires permissions beyond its authorization scope, they shall be granted for a limited time through request and approval, and they shall be withdrawn automatically upon expiry | | | ✓ |

### V2.6 Event-Triggered Authorization

This section applies to platforms where events such as webhooks, alerts, and tickets trigger agents.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V2.6.1 | Inbound events shall have their signatures and sources verified, and events that fail verification shall be rejected | ✓ | ✓ | ✓ |
| V2.6.2 | Each trigger rule shall be bound to an execution identity, namely the identity of an autonomous agent or the identity of the person who configured the rule | ✓ | ✓ | ✓ |
| V2.6.3 | The creation and modification of trigger rules shall be recorded in the audit log and shall identify the person who configured them | | ✓ | ✓ |

## 9. V3 Authorization Decisions

Each tool invocation shall pass the platform's policy checks before execution. Whether an operation may be performed, and whether human confirmation is required, is determined by the platform based on the tool and its parameters. The model's assertions do not count.

### V3.1 Operation Risk Classification

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.1.1 | Each tool shall be labeled with an operation category (distinguishing at least read, write, delete, outbound transfer, fund operation, and production change) and a risk level | ✓ | ✓ | ✓ |
| V3.1.2 | The risk level shall be determined by the platform based on the tool and its parameters, and shall not be based on the risk assessment given by the model | ✓ | ✓ | ✓ |
| V3.1.3 | Each risk level shall correspond to a defined disposition, such as automatic execution, after-the-fact notification, prior approval, step-up authentication, or rejection | ✓ | ✓ | ✓ |
| V3.1.4 | The same tool, under parameters with different scopes of impact (such as deleting one record versus bulk deletion), shall be able to fall into different levels | | ✓ | ✓ |

### V3.2 Pre-Invocation Validation for Tool Calls

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.2.1 | Every tool invocation shall pass a policy check before execution. The check shall run in a component that the agent cannot modify (a platform-hosted harness, the policy decision point, or the egress gateway). Authorization decisions shall not be based on the output of the model used by the agent being checked. | ✓ | ✓ | ✓ |
| V3.2.2 | Security constraints shall be enforced by the policy enforcement point (the harness or the egress gateway) according to the decisions of the policy decision point, and they shall not exist only in the system prompt | | ✓ | ✓ |
| V3.2.3 | The policies and hooks for pre-execution checks shall be distributed by the platform, and the agent itself shall not be able to modify or bypass them | | ✓ | ✓ |
| V3.2.4 | When a policy check errors or times out, the default shall be to deny | ✓ | ✓ | ✓ |
| V3.2.5 | The policy decision point shall interact with the policy enforcement point through a standardized authorization interface (such as OpenID AuthZEN) to facilitate replacement of the policy engine | | | ✓ |

### V3.3 Tool Exposure

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.3.1 | The tool list provided to the model shall be filtered by current effective permissions, so that the model cannot see tools it is not authorized to use | | ✓ | ✓ |
| V3.3.2 | Beyond trimming the tool list, V3.2 validation shall still be applied before execution | | ✓ | ✓ |

### V3.4 Human Approval

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.4.1 | High-risk operations shall be approved, before execution, by a person authorized to approve them. Operations not subject to dual control may be approved by the initiating user. | ✓ | ✓ | ✓ |
| V3.4.2 | Approval content shall be generated by the platform from the actual invocation parameters and shall not use a summary written by the model | ✓ | ✓ | ✓ |
| V3.4.3 | At execution, the actual parameters shall be verified to match those at approval, and execution shall be rejected if they do not match. For invocations executed under a pre-approved plan per V3.4.6, the invocation shall be verified to be within the plan's scope. | ✓ | ✓ | ✓ |
| V3.4.4 | Approvals shall have a validity period, and an approval request that expires without a decision shall be treated as rejected | | ✓ | ✓ |
| V3.4.5 | The frequency of approval requests shall be limited and similar requests shall be merged to prevent approval fatigue | | ✓ | ✓ |
| V3.4.6 | The platform shall support pre-approved execution plans that specify tools, resource scope, and limits. Operations within the plan's scope are not approved individually each time. Operations exceeding the scope shall be aborted and reapproved. | | ✓ | ✓ |

### V3.5 Step-Up Authentication and Continuous Access Evaluation

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.5.1 | Operations such as fund transfers, production changes, and bulk deletion shall require the user to complete step-up authentication (such as re-completing MFA) | | ✓ | ✓ |
| V3.5.2 | The platform shall receive session risk signals from the IdP (such as CAEP). When risk rises, it shall lower the level of operations the agent may perform or suspend the agent. | | | ✓ |

### V3.6 Separation of Duties

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.6.1 | Mutually exclusive duties (such as submission and approval, or development and release) shall not be assigned to the same agent | | ✓ | ✓ |
| V3.6.2 | For operations that require dual control under separation of duties (such as payments, production changes, and permission grants), the approver shall not be the initiator, nor an agent acting on the initiator's behalf | | ✓ | ✓ |

### V3.7 Persistent Operations

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.7.1 | When an agent creates or modifies scheduled tasks, trigger rules, webhooks, forwarding rules, or skills, such changes shall take effect only after user approval | ✓ | ✓ | ✓ |
| V3.7.2 | The management plane shall be able to centrally list all persistent objects created by an agent and indicate the source of their creation | | ✓ | ✓ |

### V3.8 Quantity, Rate, and Quota

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.8.1 | Rate, bulk, and export limits shall be set by user, agent, and operation type | | ✓ | ✓ |
| V3.8.2 | Requests exceeding limits shall be blocked and alerted | | ✓ | ✓ |
| V3.8.3 | Model invocation budgets shall be set by department, user, or agent. When a budget is exceeded, the invocations shall be paused or require approval. | | ✓ | ✓ |
| V3.8.4 | Each agent run shall have a maximum number of tool invocations, a maximum run duration, and a maximum model invocation cost, enforced by the platform. When a limit is reached, the run shall be aborted and the initiator or owner notified. | | ✓ | ✓ |

## 10. V4 Credentials and Egress Enforcement

The egress gateway is the only channel through which an agent accesses downstream systems and the internet, and real credentials are injected only there. The guarantee that credentials do not leak holds only if no path bypasses the gateway and credentials are sent only to the destinations it authorizes.

### V4.1 Credential Custody and Injection

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.1.1 | Tokens and keys required to access downstream systems shall be held by the platform. Only placeholder credentials shall appear in platform-hosted execution environments, in the context, and in the model, except for the cases specified in V5.2.2. | ✓ | ✓ | ✓ |
| V4.1.2 | Each managed credential shall be bound to permitted target domain names and paths, and the gateway shall inject the real credential only when the target matches | ✓ | ✓ | ✓ |
| V4.1.3 | The gateway shall not inject credentials into URLs or query parameters. Authentication for non-HTTP protocols shall be completed by the gateway or a platform-side proxy, and credentials shall not enter the execution environment. | | ✓ | ✓ |
| V4.1.4 | Substitution requests whose target does not match shall be rejected and alerted | | ✓ | ✓ |
| V4.1.5 | Credentials echoed in downstream responses shall be stripped before the response is returned to the execution environment | | ✓ | ✓ |
| V4.1.6 | The platform shall provide a managed authorization flow (such as OAuth), so that users do not need to hand personal credentials or API keys directly to the agent | | ✓ | ✓ |
| V4.1.7 | Credentials appearing in conversations and uploaded files shall be identified, and their writing into memory, output artifacts, or agent configuration shall be blocked | | ✓ | ✓ |

### V4.2 Unified Egress

V4.2.2 and V4.2.3 apply to platform-hosted execution environments. Agents running on employee endpoints are governed by V5.4.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.2.1 | All of an agent's access outside the execution environment shall pass only through the egress gateway | ✓ | ✓ | ✓ |
| V4.2.2 | Network egress from the execution environment shall be denied by default, and only traffic to the egress gateway shall be allowed | ✓ | ✓ | ✓ |
| V4.2.3 | Internal network services and databases shall reject direct connections from the execution environment's network segment that bypass the gateway | ✓ | ✓ | ✓ |
| V4.2.4 | Hard-coded credentials in the execution environment, agent configurations, and images shall be scanned periodically | | ✓ | ✓ |
| V4.2.5 | The platform shall maintain an inventory of registered downstream systems (addresses, owning systems, and data classification), against which the egress gateway distinguishes intra-enterprise access from outbound transfer | ✓ | ✓ | ✓ |

### V4.3 Downstream Identity Propagation

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.3.1 | When accessing third-party SaaS, user-level authorization shall be obtained, either by the user completing OAuth authorization personally or by obtaining a user-level token from the enterprise IdP via token exchange. Application credentials shared across users shall not be used. | ✓ | ✓ | ✓ |
| V4.3.2 | When a user revokes authorization, the platform shall immediately stop using the corresponding credential | | ✓ | ✓ |
| V4.3.3 | When a downstream system supports token exchange, a user-level short-lived token shall be obtained through the enterprise IdP per RFC 8693, or through ID-JAG based on RFC 8693 and RFC 7523 | | ✓ | ✓ |

### V4.4 Legacy Systems with Static Credentials

This section applies to platforms where downstream systems exist that support only shared static credentials.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.4.1 | Shared secrets of legacy systems shall be held by the platform and shall not be distributed to the execution environment | ✓ | ✓ | ✓ |
| V4.4.2 | The gateway shall make user-level authorization decisions at the interface and operation levels to compensate for the lack of user-level authorization in the downstream system | ✓ | ✓ | ✓ |
| V4.4.3 | The gateway shall attach a signed user identity to downstream requests so that downstream systems can verify it and progressively adopt user-level authorization | | ✓ | ✓ |
| V4.4.4 | Downstream systems for which the gateway makes user-level authorization decisions on their behalf shall be registered and included in periodic review | | ✓ | ✓ |

### V4.5 MCP Invocation

This section applies to platforms that support MCP.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.5.1 | Requests to remote MCP servers shall pass through the egress gateway and carry the user identity | | ✓ | ✓ |
| V4.5.2 | MCP servers built or hosted by the platform shall not hold long-term credentials shared by all users | | ✓ | ✓ |
| V4.5.3 | Locally running MCP processes shall likewise obtain only placeholder credentials, and their outbound network access shall be constrained by the execution environment's network policy | | ✓ | ✓ |
| V4.5.4 | MCP servers that support the Enterprise-Managed Authorization extension shall be connected with authorization through the enterprise IdP | | | ✓ |
| V4.5.5 | MCP servers built or hosted by the platform shall accept only tokens issued for them (audience-restricted to the server), verifying the issuer and audience (for example using the RFC 8707 resource indicator), and shall not pass received tokens through to downstream APIs | ✓ | ✓ | ✓ |
| V4.5.6 | The platform shall retain a snapshot of the tool definitions of reviewed MCP servers. After any change in tool name, description, or parameter structure, the changed tools shall not be exposed to the model until they are reviewed again. | | ✓ | ✓ |

### V4.6 Token Lifecycle

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.6.1 | Downstream tokens injected or exchanged by the gateway shall have a short validity period | | ✓ | ✓ |
| V4.6.2 | For supported downstream systems, tokens shall be sender-constrained (DPoP or mTLS) to prevent replay after theft | | ✓ | ✓ |
| V4.6.3 | Tokens shall be restricted to an audience and shall be usable only with the downstream system specified at issuance | ✓ | ✓ | ✓ |

### V4.7 Credential Store Protection

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.7.1 | Managed credentials shall be stored encrypted, and no plaintext shall appear in databases or backups | ✓ | ✓ | ✓ |
| V4.7.2 | Platform administrators and operations personnel shall not be able to read or export plaintext credentials | ✓ | ✓ | ✓ |
| V4.7.3 | Credentials shall be retrievable at invocation time only by the egress gateway, and each retrieval shall be recorded in the audit log | ✓ | ✓ | ✓ |
| V4.7.4 | The master key shall be managed by a KMS or HSM controlled by the enterprise | | ✓ | ✓ |
| V4.7.5 | The platform shall support bulk rotation and revocation of credentials per user, per connection, or for all credentials | | ✓ | ✓ |

## 11. V5 Execution Isolation

When an agent executes code, commands, browser operations, and endpoint operations, it shall be confined within controllable boundaries. The harness's own configuration shall also be centrally controlled by the enterprise and shall not be rewritten arbitrarily by employees or code repositories.

### V5.1 Execution Environment Isolation

This section applies to platform-hosted execution environments. Agents running on employee endpoints are governed by V5.4.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V5.1.1 | Each session shall use an independent execution environment. Files and processes shall not be shared between different users, or between different sessions of the same user. | ✓ | ✓ | ✓ |
| V5.1.2 | The execution environment shall run under an unprivileged identity and shall not be able to access the host or other instances | ✓ | ✓ | ✓ |
| V5.1.3 | After a session ends, the execution environment and its files and temporary credentials shall be destroyed | | ✓ | ✓ |
| V5.1.4 | Where multiple users or tenants share a host's execution environment, independent kernel or user-space kernel isolation shall be used, such as gVisor, Kata Containers, or Firecracker microVMs | | ✓ | ✓ |

### V5.2 Code and Command Execution

This section applies to platforms that support code or command execution.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V5.2.1 | Code and commands shall run only in an isolated execution environment, and not directly on the harness or on the platform host | ✓ | ✓ | ✓ |
| V5.2.2 | Credentials that cannot be injected by the egress gateway (such as cloud API credentials used for client-side request signing) shall be issued as short-lived credentials (such as AWS STS) scoped to specific permissions and target resources per user and task. Long-lived keys shall not be placed in the execution environment. | ✓ | ✓ | ✓ |
| V5.2.3 | On employee endpoints or in execution environments that mount persistent data, commands that delete persistent data, escalate privileges, or modify network configuration shall require approval before execution | | ✓ | ✓ |
| V5.2.4 | Dependency packages shall be installed only from enterprise-approved mirror sources | | ✓ | ✓ |

### V5.3 Browser and Desktop Operations

This section applies to platforms that support browser or desktop operations.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V5.3.1 | When the platform provides a browser environment, the agent shall use an independent browser profile and shall not reuse the user's personal logged-in session | ✓ | ✓ | ✓ |
| V5.3.2 | Before a form that produces an external effect (such as placing an order, making a payment, sending a message, publishing content, or changing account settings) is submitted, the action shall require approval | ✓ | ✓ | ✓ |
| V5.3.3 | Websites that the agent may access shall be authorized site by site, and unauthorized sites shall be blocked | | ✓ | ✓ |
| V5.3.4 | Desktop operations shall be limited to the scope of applications authorized by the user | | ✓ | ✓ |
| V5.3.5 | An agent running in a browser where the user is logged in (such as a browser extension) shall operate on a site allowlist, shall deny by default any site not on the list, and shall by default be prohibited from operating on identity authentication, payment, and administrative console sites | ✓ | ✓ | ✓ |

### V5.4 Endpoint Harness

This section applies to agents running on employee endpoints, such as coding agents and desktop assistants.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V5.4.1 | Endpoint execution shall by default be placed in a system-level sandbox, such as macOS Seatbelt or Linux bubblewrap | ✓ | ✓ | ✓ |
| V5.4.2 | File access shall be authorized by directory. By default, reading directories containing keys or secrets (such as `~/.ssh` and `~/.aws`) and browser credential stores shall be denied. | ✓ | ✓ | ✓ |
| V5.4.3 | On managed endpoints, the enterprise shall be able to distribute endpoint policies uniformly through managed policy, and employees shall not be able to disable them locally. Endpoint agents on unmanaged endpoints shall not obtain credentials for accessing enterprise resources. | ✓ | ✓ | ✓ |
| V5.4.4 | Endpoint agents accessing enterprise resources shall pass through the egress gateway and shall not directly use enterprise credentials stored locally | ✓ | ✓ | ✓ |

### V5.5 Harness Configuration and Permission Modes

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V5.5.1 | The enterprise shall be able to distribute managed policies that cannot be overridden by local configuration | ✓ | ✓ | ✓ |
| V5.5.2 | Managed policies shall be able to prohibit or restrict modes such as automatic approval and skipping confirmation | ✓ | ✓ | ✓ |
| V5.5.3 | The lists of permitted and prohibited tools shall be configured centrally by the enterprise | | ✓ | ✓ |
| V5.5.4 | Rule files, MCP definitions, and hooks in the project directory (a code repository or a workspace opened in an IDE) shall be loaded only after the user confirms trust | ✓ | ✓ | ✓ |
| V5.5.5 | After the above configuration in the project directory changes, trust shall be reconfirmed before it is loaded | ✓ | ✓ | ✓ |
| V5.5.6 | The enterprise shall be able to prohibit loading of project-directory-level MCP servers and hooks | | ✓ | ✓ |

### V5.6 Skill, Plugin, and MCP Supply Chain

This section applies to platforms that support installing skills, plugins, or third-party MCP servers.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V5.6.1 | Skills, plugins, and MCP servers shall be reviewed before they can be installed | ✓ | ✓ | ✓ |
| V5.6.2 | Administrators shall be able to maintain an allowlist of permitted installations and to withdraw items immediately | | ✓ | ✓ |
| V5.6.3 | Source and signatures shall be verified and versions shall be pinned. Updates shall require re-review. | | ✓ | ✓ |
| V5.6.4 | Each skill or plugin shall declare the permissions it requires, and invocations exceeding the declaration shall be rejected at execution | | ✓ | ✓ |

## 12. V6 Context and Untrusted Input

Untrusted content that enters the context may be treated only as data, not as instructions. After a session has read untrusted content, the actions the agent can take shall be tightened accordingly.

### V6.1 Untrusted Content Marking

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V6.1.1 | The platform shall classify tool return values, retrieval results, web pages, emails, files, and the outputs of other agents as untrusted content, and use this classification as the basis for the tightening rules of V6.2 | ✓ | ✓ | ✓ |
| V6.1.2 | Content entering the context shall be marked with its source so that policy checks can distinguish user instructions from untrusted content | | ✓ | ✓ |
| V6.1.3 | Platform policy and the system prompt shall be separated from untrusted content by message roles or delimiting structures, and shall not be concatenated within the same block of text | | ✓ | ✓ |

### V6.2 Downgrading After Exposure to Untrusted Content

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V6.2.1 | After a session is exposed to untrusted content, all outbound transfers shall be denied by default and permitted only after approval | ✓ | ✓ | ✓ |
| V6.2.2 | After a session is exposed to untrusted content, writes and deletes to systems outside the execution environment shall require approval, or be limited to the plan pre-approved under V3.4.6 | | ✓ | ✓ |
| V6.2.3 | Red team tests shall be run periodically against agents, using web pages, emails, documents, and tool return values that embed injected instructions | | ✓ | ✓ |
| V6.2.4 | In high-risk scenarios, untrusted content shall first be processed by an isolated model without tool permissions, and only structured results shall be passed to the agent that has permissions. Examples include the Dual LLM pattern, or CaMeL, which adds separation of control flow and data flow on top of it. | | | ✓ |

### V6.3 System Prompt and Configuration

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V6.3.1 | System prompts, agent configurations, and skill files shall not contain credentials or keys | ✓ | ✓ | ✓ |
| V6.3.2 | The system prompt shall be assumed to be possibly leaked. It shall contain no personal information and no data that is not visible to every user of the agent. | ✓ | ✓ | ✓ |
| V6.3.3 | Agent configurations and skill files shall undergo credential scanning before release | | ✓ | ✓ |

### V6.4 Multi-Agent Cascading

This section applies to platforms that support multi-agent orchestration.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V6.4.1 | Messages between agents shall be forwarded by the platform with the sender's identity attached. Agents shall not communicate directly with each other. | | ✓ | ✓ |
| V6.4.2 | Critical nodes shall validate the format and value range of upstream output, and results that do not conform shall not be passed further downstream | | ✓ | ✓ |
| V6.4.3 | When anomalous output or the error rate in a chain exceeds a threshold, the entire chain shall be circuit-broken and an alert raised | | ✓ | ✓ |

## 13. V7 Output and Visibility

Permission checks shall extend to the moment of output. Who may see a result, and whether it may be leaked, shall be judged again for each recipient.

### V7.1 Multi-Party Channels

This section applies to platforms that support multi-party channels such as group chats, channels, and comments on shared documents.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V7.1.1 | In a multi-party channel, replies may use only data that all present members are authorized to access. Otherwise, V7.1.2 applies. | ✓ | ✓ | ✓ |
| V7.1.2 | Results that exceed the permissions of some present members shall be sent only by direct message to the user who triggered the request, and only a notice shall be displayed in the channel | ✓ | ✓ | ✓ |
| V7.1.3 | When external members are present in a channel, the classification level of content that may be displayed shall be further tightened | | ✓ | ✓ |
| V7.1.4 | When determining displayable content, it shall be considered that members who join later may view historical replies | | ✓ | ✓ |

### V7.2 Isolation of Shared Agent Sessions

This section applies to platforms where multiple people share the same agent.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V7.2.1 | Sessions of a shared agent shall be isolated by user | ✓ | ✓ | ✓ |
| V7.2.2 | Personal context and team-shared knowledge shall be stored separately, and retrieval shall make authorization decisions based on the current user | | ✓ | ✓ |

### V7.3 Session Handover

This section applies to platforms that support session handover or human takeover.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V7.3.1 | Before a session is handed over, its existing context shall be checked against the recipient's permissions | | ✓ | ✓ |
| V7.3.2 | Content that exceeds the recipient's permissions shall be redacted or removed before the handover | | ✓ | ✓ |

### V7.4 Output Rendering

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V7.4.1 | In replies the platform sends to any channel, images and resources that point to domains outside the allowlist shall be removed before sending, or converted to links that do not load automatically | ✓ | ✓ | ✓ |
| V7.4.2 | HTML and Markdown in replies shall be sanitized before rendering, removing scripts and event attributes | ✓ | ✓ | ✓ |
| V7.4.3 | Links in replies shall display the real destination address | | ✓ | ✓ |

### V7.5 Output Data Leakage Prevention

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V7.5.1 | When credentials or keys appear in replies or outbound content, they shall be blocked | | ✓ | ✓ |
| V7.5.2 | Replies, file downloads, and outbound content shall undergo sensitive data detection | | ✓ | ✓ |
| V7.5.3 | When sensitive data such as personal information is detected, it shall be redacted according to policy, or the output shall require approval | | ✓ | ✓ |
| V7.5.4 | After a session has read non-public data, all outbound transfers shall be denied by default and permitted only after approval | ✓ | ✓ | ✓ |

### V7.6 Messages Sent on Behalf of a User

This section applies to platforms that support sending email, IM messages, or announcements in a user's name.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V7.6.1 | Messages sent to recipients outside the enterprise shall be approved | | ✓ | ✓ |
| V7.6.2 | The default mode for sending on behalf of a user shall be to generate a draft, which is sent after the user confirms | | ✓ | ✓ |
| V7.6.3 | Messages sent by an agent on behalf of a user shall carry a recognizable sent-on-behalf-of identifier | | ✓ | ✓ |

## 14. V8 Data, Memory, and Output Artifacts

What an agent leaves behind may later be retrieved by others. Retrieval, memory, and output artifacts shall carry source and permission labels, and authorization shall be decided again for the current user at read time.

### V8.1 Retrieval Authorization

This section applies to platforms that support RAG or knowledge base retrieval.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.1.1 | Retrieval results shall be filtered by the access controls of the source system. Access control lists may be synchronized to each text chunk, or verified back against the source at retrieval time. | ✓ | ✓ | ✓ |
| V8.1.2 | Results shall be filtered by the current user at the retrieval stage, rather than deleted after the answer has been generated | ✓ | ✓ | ✓ |
| V8.1.3 | After permissions are revoked in the source system, the change shall be reflected in retrieval results within an agreed period, and synchronization latency shall be monitored | | ✓ | ✓ |

### V8.2 Database Queries

This section applies to platforms where agents directly query business databases.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.2.1 | When an agent queries a database, it shall connect under the user's identity, or the platform shall inject that user's row-level and column-level policies | ✓ | ✓ | ✓ |
| V8.2.2 | Database connections used by agents shall be read-only by default | ✓ | ✓ | ✓ |
| V8.2.3 | The number of rows returned by a single query shall be capped | | ✓ | ✓ |

### V8.3 Memory Isolation

This section applies to platforms that support long-term memory or knowledge accumulation.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.3.1 | Memory shall record the source user and permission labels | | ✓ | ✓ |
| V8.3.2 | When memory is retrieved, results shall be filtered by the current user, and one user's personal memory shall not appear in another user's session | ✓ | ✓ | ✓ |
| V8.3.3 | Personal content shall be reviewed before it is accumulated into team-shared knowledge | | ✓ | ✓ |

### V8.4 Memory and Knowledge Poisoning

This section applies to platforms that support long-term memory or knowledge accumulation.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.4.1 | Content written into memory and knowledge bases shall be marked with its source and credibility | | ✓ | ✓ |
| V8.4.2 | Accumulations originating from untrusted content shall be reviewed manually before they can be retrieved | | ✓ | ✓ |
| V8.4.3 | Retrieved memory shall be provided to the model as data, not as system instructions | | ✓ | ✓ |
| V8.4.4 | The platform shall support tracing memory and knowledge entries back to their source and removing them in bulk | | ✓ | ✓ |

### V8.5 Output Artifacts

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.5.1 | Output artifacts shall inherit the highest data classification level among their sources and shall record their sources | | ✓ | ✓ |
| V8.5.2 | When an output artifact is shared, the recipient's permissions on the source data shall be checked | | ✓ | ✓ |
| V8.5.3 | Aggregation and statistics requests on sensitive dimensions shall require approval | | | ✓ |

### V8.6 Caching and Retention

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.6.1 | Cached retrieval results and answers shall carry permission labels and shall be invalidated when permissions change | | ✓ | ✓ |
| V8.6.2 | Historical sessions shall be displayed according to current permissions, and content whose permissions have been revoked shall no longer be displayed | | ✓ | ✓ |
| V8.6.3 | Retention periods shall be set separately for sessions, memory, and audit records | | ✓ | ✓ |
| V8.6.4 | After a user leaves, their managed credentials shall be deleted within an agreed time, and personal memory shall be deleted or transferred according to policy | | ✓ | ✓ |

### V8.7 Model Routing

This section applies to platforms that connect to multiple models. Using conversation data for evaluation and fine-tuning is data governance for model training. See C1 and C3 of OWASP AISVS.

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.7.1 | The models to which each category of data may be sent shall be configured according to data classification. Sensitive data shall be sent only to local or designated models. | | ✓ | ✓ |
| V8.7.2 | Sensitive data destined for unauthorized models shall be blocked | | ✓ | ✓ |

## 15. V9 Lifecycle and Governance

Each agent shall be registered, have an owner, and be reviewed, and shall be manageable throughout its lifecycle from creation to decommissioning. Access by the platform provider itself is also within the scope of governance.

### V9.1 Agent Registration and Publication

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.1.1 | Creating, publishing, and decommissioning agents shall each be separately authorized | | ✓ | ✓ |
| V9.1.2 | Agents shall be reviewed before publication, and agents without a designated owner shall not be published | ✓ | ✓ | ✓ |
| V9.1.3 | The platform shall be able to list all published agents, along with their authorization scopes, connections, and owners | ✓ | ✓ | ✓ |
| V9.1.4 | Agent registration information shall include the models and versions used, the harness version, and the connected tools, and shall be updated synchronously when any of them change | | ✓ | ✓ |

### V9.2 Connector and Credential Binding

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.2.1 | Binding connectors to an agent shall require the corresponding permission, and shall not exceed the authorization scope registered for that agent | ✓ | ✓ | ✓ |
| V9.2.2 | After credentials are bound, the binder shall no longer be able to view or export their plaintext | | ✓ | ✓ |
| V9.2.3 | Binding and changes of connectors shall be recorded in the audit log | | ✓ | ✓ |

### V9.3 Configuration Changes

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.3.1 | Changes to an agent's system prompt, tools, authorization scope, and policies shall be approved | | ✓ | ✓ |
| V9.3.2 | Configuration changes that have not been approved shall not take effect | | ✓ | ✓ |
| V9.3.3 | Configurations shall retain version records and be rollbackable to any historical version | | ✓ | ✓ |
| V9.3.4 | Replacing the model or model version used by an agent shall be approved as a configuration change, and its behavior shall be reassessed | | ✓ | ✓ |
| V9.3.5 | Changes to global policies, such as risk classification, credential target binding, egress allowlists, and managed policies, shall be restricted to dedicated roles, and the platform shall record the operator, the time, and the content before and after each change | ✓ | ✓ | ✓ |
| V9.3.6 | Changes to the above global policies shall take effect only after approval by a second person | | ✓ | ✓ |

### V9.4 Lifecycle and Permission Review

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.4.1 | When an owner leaves or changes roles, the agents under their name shall enter a pending-handover state. If they are not handed over within the deadline, they shall be disabled automatically. | | ✓ | ✓ |
| V9.4.2 | Agent connections and permissions shall be reviewed periodically, and permissions not confirmed by their due date shall be withdrawn automatically | | ✓ | ✓ |
| V9.4.3 | Agents that have been unused for a long period shall be identified and decommissioned | | ✓ | ✓ |

### V9.5 Shadow Agent Discovery

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.5.1 | Agents that employees have connected on their own initiative without registration shall be discovered through the OAuth authorization records of the IdP | | ✓ | ✓ |
| V9.5.2 | Discovered unregistered agents shall be registered and brought under management, or blocked, within an agreed time | | ✓ | ✓ |
| V9.5.3 | Unregistered agents on endpoints and in browsers shall be discovered through combined endpoint and network detection | | | ✓ |

### V9.6 Workspace Isolation

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.6.1 | Data, knowledge bases, credentials, and agents shall be isolated by workspace | ✓ | ✓ | ✓ |
| V9.6.2 | Cross-workspace access shall require explicit authorization | ✓ | ✓ | ✓ |
| V9.6.3 | When delivered as SaaS, the data, credentials, and execution environments of different tenants shall be fully isolated | ✓ | ✓ | ✓ |

### V9.7 Provider Personnel Access

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.7.1 | The provider's access to customer environments and data shall be disabled by default. Enabling it shall require customer approval and be limited in duration. | ✓ | ✓ | ✓ |
| V9.7.2 | Each provider access shall be fully audited end to end, and the audit records shall be visible to the customer | ✓ | ✓ | ✓ |
| V9.7.3 | Telemetry data shall include only fields on a published inventory, and customers may disable it | | ✓ | ✓ |
| V9.7.4 | Login and authorization decisions for private deployments shall not depend on the provider's online services | | ✓ | ✓ |

## 16. V10 Audit, Detection, and Response

When an incident occurs, it shall be possible to reconstruct who had which agent act, on what content, and what the agent did, and to contain the impact within minutes. This chapter covers recording, detection, revocation, emergency deactivation, and post-incident recovery.

### V10.1 Audit Records

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V10.1.1 | For each tool invocation, the platform shall record the initiating user, the executing agent, the delegation chain, the trigger source, the tool parameters, and the result status | ✓ | ✓ | ✓ |
| V10.1.2 | For approved operations, the platform shall record the approver, the approval content, and the approval time | ✓ | ✓ | ✓ |
| V10.1.3 | Audit shall record the source of untrusted content entering the context, so that it can later be determined whether an operation was caused by injection | | ✓ | ✓ |
| V10.1.4 | The platform shall be able to export audit records to the enterprise SIEM | | ✓ | ✓ |
| V10.1.5 | Audit logs shall be written to append-only storage isolated from platform operations, or tampering shall be detectable through means such as hash chains | | ✓ | ✓ |
| V10.1.6 | Audit records shall be cryptographically bound to the identity of the agent that executed them and to the user or approval that authorized them, to ensure non-repudiation | | | ✓ |

### V10.2 Audit Data Protection and Retrieval

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V10.2.1 | When administrators retrieve audit records or conversations, the act of retrieval itself shall be recorded in the audit log | ✓ | ✓ | ✓ |
| V10.2.2 | Sensitive fields in audit logs shall be stored redacted, or their visibility shall be controlled by role | | ✓ | ✓ |
| V10.2.3 | When administrators retrieve conversations between users and agents, the retrieval shall be approved | | ✓ | ✓ |
| V10.2.4 | Audit records shall not be deletable during the retention period | | ✓ | ✓ |

### V10.3 Behavioral Detection

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V10.3.1 | Events such as policy denials, approval rejections, and credential target mismatches shall generate real-time alerts | | ✓ | ✓ |
| V10.3.2 | The platform shall be able to retrieve and correlate alerts by agent, user, and delegation chain | | ✓ | ✓ |
| V10.3.3 | A behavioral baseline (invocation frequency, tool distribution, data volume) shall be established for each agent, and deviations shall trigger alerts | | | ✓ |

### V10.4 Permission Revocation and Emergency Deactivation

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V10.4.1 | After the IdP disables a user or downgrades their permissions, related invocations shall all be rejected within an agreed period (such as 5 minutes) | ✓ | ✓ | ✓ |
| V10.4.2 | Permission caches shall have an upper limit on their duration | | ✓ | ✓ |
| V10.4.3 | The platform shall be able to deactivate an individual agent in a single operation. Deactivation shall stop the gateway from injecting credentials for the agent, revoke its refresh tokens, abort its running tasks, and end its sessions | ✓ | ✓ | ✓ |
| V10.4.4 | The platform shall receive session revocation events from the IdP (such as CAEP) and shall take effect immediately upon receipt | | ✓ | ✓ |
| V10.4.5 | The platform shall be able to deactivate agents in bulk by owner, workspace, or connector | | ✓ | ✓ |

### V10.5 Emergency Access

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V10.5.1 | Break-glass accounts that can log in to the management plane even when the IdP is unavailable shall be pre-provisioned | | ✓ | ✓ |
| V10.5.2 | Credentials for break-glass accounts shall be split-custodied and under dual control, with an alert on each use and full audit | | ✓ | ✓ |

### V10.6 Incident Response and Recovery

| ID | Requirement | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V10.6.1 | A response procedure shall be established for when an agent is injected or compromised, covering deactivation, credential rotation, and investigation of the impact scope | | ✓ | ✓ |
| V10.6.2 | The platform shall be able to reconstruct all of an agent's operations within a specified period, by session or by delegation chain, to determine the scope of impact | | ✓ | ✓ |
| V10.6.3 | Write operations shall be reversible, or a rollback snapshot shall be retained before execution | | | ✓ |

## Appendix A OWASP Risk Coverage

All ten risks in the OWASP Top 10 for Agentic Applications 2026 have corresponding requirements. Of the OWASP Top 10 for LLM Applications 2025, only LLM09 Misinformation concerns content accuracy and falls outside the scope of this baseline.

| ID | Risk | Corresponding sections |
| --- | --- | --- |
| ASI01 | Agent Goal Hijack | V3.4, V6.1, V6.2, V10.3 |
| ASI02 | Tool Misuse & Exploitation | V3.1, V3.2, V3.3, V4.2, V5.6 |
| ASI03 | Identity & Privilege Abuse | All of V1, all of V2, V4.1, V4.3, V4.6, V4.7 |
| ASI04 | Agentic Supply Chain Vulnerabilities | V5.5, V5.6, V9.7 |
| ASI05 | Unexpected Code Execution (RCE) | V5.1, V5.2, V5.3, V5.4 |
| ASI06 | Memory & Context Poisoning | V6.1, V8.3, V8.4 |
| ASI07 | Insecure Inter-Agent Communication | V2.4, V6.4 |
| ASI08 | Cascading Failures | V6.4, V10.4 |
| ASI09 | Human-Agent Trust Exploitation | V3.4, V7.6 |
| ASI10 | Rogue Agents | V3.7, V9.4, V9.5, V10.3, V10.4 |
| LLM01 | Prompt Injection | V6.1, V6.2 |
| LLM02 | Sensitive Information Disclosure | All of V7, all of V8 |
| LLM03 | Supply Chain | V5.6, V9.7 |
| LLM04 | Data and Model Poisoning | V8.4 |
| LLM05 | Improper Output Handling | V7.4, V8.2 |
| LLM06 | Excessive Agency | V2.2, V3.1, V3.3 |
| LLM07 | System Prompt Leakage | V6.3 |
| LLM08 | Vector and Embedding Weaknesses | V8.1 |
| LLM09 | Misinformation | Out of scope |
| LLM10 | Unbounded Consumption | V2.4, V3.8 |

## Appendix B OWASP AISVS 1.0 Mapping

Of the 62 sections in this baseline, 22 correspond directly to AISVS 1.0, 27 partially correspond, and 13 are new to this baseline. The new items are concentrated in channels, multi-party output, legacy systems, endpoint operation, and provider access. AISVS numbering was checked against the 1.0/en directory of the [OWASP/AISVS repository](https://github.com/OWASP/AISVS) as of 2026-10-07.

"Corresponds" means that the objectives and control approaches are essentially consistent. "Partially corresponds" means that AISVS has related items, but this baseline's requirements are more detailed or differ in coverage. "New" means that AISVS has no corresponding item.

| Section of this baseline | AISVS item | Relationship |
| --- | --- | --- |
| V1.1 User Authentication | 5.1.1 | Partially corresponds |
| V1.2 Channel Identity Mapping | None | New |
| V1.3 Agent Identity | 5.1.2, 9.4.1, 9.4.3 | Corresponds |
| V1.4 Workload Identity | 4.1.3, 9.4.1 | Partially corresponds |
| V1.5 External Principals | 5.1.2 | Partially corresponds |
| V2.1 Access on Behalf of a User | 9.5.2 | Corresponds |
| V2.2 Effective Permissions | 5.2.5, 9.5.1, 9.5.3, 9.5.6 | Corresponds |
| V2.3 Offline Delegated Tasks | 9.5.6 | Partially corresponds |
| V2.4 Inter-Agent Delegation | 9.1.2, 9.4.2, 9.5.5 | Corresponds |
| V2.5 Inter-User Delegation and Temporary Privilege Elevation | 5.2.6 | Partially corresponds |
| V2.6 Event-Triggered Authorization | None | New |
| V3.1 Operation Risk Classification | 9.2.3, 9.2.4 | Corresponds |
| V3.2 Pre-Invocation Validation for Tool Calls | 9.2.5, 9.5.1, 9.5.3 | Corresponds |
| V3.3 Tool Exposure | 10.2.4 | Partially corresponds |
| V3.4 Human Approval | 9.2.1, 9.2.2, 9.2.8, 9.6.2 | Corresponds |
| V3.5 Step-Up Authentication and Continuous Access Evaluation | 5.1.1, 9.5.6 | Partially corresponds |
| V3.6 Separation of Duties | None | New |
| V3.7 Persistent Operations | 9.2.5 | Partially corresponds |
| V3.8 Quantity, Rate, and Quota | 9.1.1, 9.1.2, 12.2.5 | Corresponds |
| V4.1 Credential Custody and Injection | 9.5.4 | Partially corresponds |
| V4.2 Unified Egress | 7.3.3, 9.3.1 | Partially corresponds |
| V4.3 Downstream Identity Propagation | 9.5.2 | Partially corresponds |
| V4.4 Legacy Systems with Static Credentials | None | New |
| V4.5 MCP Invocation | 10.1.2, 10.1.3, 10.2.1 to 10.2.7, 10.4.8 | Corresponds |
| V4.6 Token Lifecycle | 5.1.2, 10.2.2, 10.3.5 | Corresponds |
| V4.7 Credential Store Protection | None | New |
| V5.1 Execution Environment Isolation | 4.1.1, 9.3.1 | Corresponds |
| V5.2 Code and Command Execution | 9.1.1, 9.3.1 | Partially corresponds |
| V5.3 Browser and Desktop Operations | None | New |
| V5.4 Endpoint Harness | None | New |
| V5.5 Harness Configuration and Permission Modes | 10.4.7, 10.4.8 | Partially corresponds |
| V5.6 Skill, Plugin, and MCP Supply Chain | 9.3.3, 9.3.4, 9.3.7, 10.1.1, 10.1.2 | Corresponds |
| V6.1 Untrusted Content Marking | 2.1.3, 2.1.6 | Corresponds |
| V6.2 Downgrading After Exposure to Untrusted Content | 9.3.5, 9.3.6, 10.4.2 | Corresponds |
| V6.3 System Prompt and Configuration | 7.3.2 | Partially corresponds |
| V6.4 Multi-Agent Cascading | 9.2.10, 9.3.2 | Partially corresponds |
| V7.1 Multi-Party Channels | None | New |
| V7.2 Isolation of Shared Agent Sessions | 5.3.1, 8.1.3 | Partially corresponds |
| V7.3 Session Handover | None | New |
| V7.4 Output Rendering | 7.3.3, 7.3.4 | Corresponds |
| V7.5 Output Data Leakage Prevention | 5.2.4, 7.3.2 | Partially corresponds |
| V7.6 Messages Sent on Behalf of a User | 9.2.1 | Partially corresponds |
| V8.1 Retrieval Authorization | 5.2.2, 8.1.3 | Corresponds |
| V8.2 Database Queries | 5.2.1 | Partially corresponds |
| V8.3 Memory Isolation | 5.2.2, 8.1.1, 8.1.3 | Corresponds |
| V8.4 Memory and Knowledge Poisoning | 8.2.3, 8.2.4, 8.3.3, 12.5.4 | Corresponds |
| V8.5 Output Artifacts | 5.2.7 | Partially corresponds |
| V8.6 Caching and Retention | 5.2.7, 8.3.1, 8.3.2 | Partially corresponds |
| V8.7 Model Routing | 8.2.1 | Partially corresponds |
| V9.1 Agent Registration and Publication | 3.1.1 | Partially corresponds |
| V9.2 Connector and Credential Binding | None | New |
| V9.3 Configuration Changes | 3.3.1, 3.3.2, 9.2.5 | Partially corresponds |
| V9.4 Lifecycle and Permission Review | 9.4.3 | Partially corresponds |
| V9.5 Shadow Agent Discovery | None | New |
| V9.6 Workspace Isolation | 5.3.1, 5.3.2, 8.1.1 | Corresponds |
| V9.7 Provider Personnel Access | None | New |
| V10.1 Audit Records | 9.4.2, 12.1.1, 12.1.2, 12.4.2 | Corresponds |
| V10.2 Audit Data Protection and Retrieval | 12.5.3 | Partially corresponds |
| V10.3 Behavioral Detection | 12.2.1, 12.2.2, 12.4.1 | Corresponds |
| V10.4 Permission Revocation and Emergency Deactivation | 9.1.3, 9.6.1, 9.6.3, 12.4.3 | Corresponds |
| V10.5 Emergency Access | None | New |
| V10.6 Incident Response and Recovery | 3.3.2, 9.2.3 | Partially corresponds |

AISVS items for training data (C1), model lifecycle (the model training and evaluation parts of C3; the version registration and change control items of C3 are mapped to V9.1, V9.3, and V10.6), hardware and edge deployment (C4.2, C4.3), model supply chain (C6), hallucination and content safety (C7.2, C7.3.1), adversarial robustness (C11), and model drift (C12.3) belong to the model side and are outside the scope of this baseline.

## Appendix C CSA AICM Mapping

This appendix maps by control domain. AICM applies to all AI systems and is coarser in granularity than this baseline. A chapter of this baseline typically falls into one to four domains. Control item identifiers are to be supplemented against the official CSA AICM v1.1 workbook; they are not listed item by item in this version.

| This baseline | AICM control domain | Notes |
| --- | --- | --- |
| V1 Identity and Authentication | IAM Identity & Access Management | Entire chapter |
| V2 Delegation and Effective Permissions | IAM Identity & Access Management | Entire chapter; V2.5 temporary privilege elevation corresponds to privileged access management |
| V3 Authorization Decisions | IAM Identity & Access Management; AIS Application & Interface Security | V3.6 separation of duties belongs to IAM; V3.2 and V3.3 belong to AIS |
| V4 Credentials and Egress Enforcement | IAM Identity & Access Management; CEK Cryptography, Encryption & Key Management; I&S Infrastructure & Virtualization Security | V4.7 credential store protection belongs to CEK; V4.2 unified egress belongs to I&S |
| V5 Execution Isolation | I&S Infrastructure & Virtualization Security; UEM Universal Endpoint Management; CCC Change Control & Configuration Management; STA Supply Chain Management, Transparency and Accountability | V5.4 endpoint belongs to UEM; V5.5 managed policy belongs to CCC; V5.6 supply chain belongs to STA |
| V6 Context and Untrusted Input | MDS Model Security; AIS Application & Interface Security | Entire chapter |
| V7 Output and Visibility | DSP Data Security & Privacy Lifecycle Management; AIS Application & Interface Security | V7.5 data leakage prevention belongs to DSP |
| V8 Data, Memory, and Output Artifacts | DSP Data Security & Privacy Lifecycle Management; MDS Model Security | V8.7 model routing involves both DSP and MDS |
| V9 Lifecycle and Governance | GRC Governance, Risk and Compliance; CCC Change Control & Configuration Management; STA Supply Chain Management, Transparency and Accountability; IAM Identity & Access Management | V9.3 configuration changes belong to CCC; V9.7 provider personnel access belongs to STA; V9.4 permission review belongs to IAM |
| V10 Audit, Detection, and Response | LOG Logging and Monitoring; SEF Security Incident Management, E-Discovery & Cloud Forensics; IAM Identity & Access Management; BCR Business Continuity Management & Operational Resilience | V10.1 to V10.3 belong to LOG; V10.4 and V10.6 belong to SEF; V10.5 emergency access belongs to IAM and BCR |
