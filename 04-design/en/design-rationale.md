# From Teloa Development to an Agent Security Baseline: Design Rationale

Author: Max · Initiated and maintained by [Teloa](https://github.com/teloa-ai) · 2026-10-11

[简体中文](../zh-CN/design-rationale.md) · **English** · [Project home](../../README.en.md)

This document is licensed under [CC BY 4.0](../../LICENSE-DOCS).

The baseline grew from recurring questions during Teloa development. Whose identity does an AI employee use when it calls a tool? Can a user's authorization expand when work is delegated to another agent? Can a group task expose personal data to other members? Does encrypting stored credentials also prevent exposure during execution?

Model instructions alone cannot resolve these questions. Trusted platform components must check identity, permissions, actual parameters, and recipients, and enforce denial, revocation, and auditing. This project combines those design questions with public specifications to produce verifiable requirements that other enterprise agent platforms can use and review.

The scenarios below explain design reasoning and verification methods. They are not incident reports or a compliance assessment of Teloa. The [baseline](../../01-standard/en/baseline-v1.0.md) defines the requirements; product claims require evidence for a specific version and deployment configuration.

## 1. From Least Privilege to Least Agency

Access control answers what an agent may access. An agent platform must also determine what it may decide independently, whom it represents, and how long it may keep acting. A user who can delete files has not necessarily approved bulk deletion when asking an agent to organize a directory. Permission to read an account does not authorize sharing its contents with a group.

Least agency therefore guides this baseline. Resource permissions, task scope, operation risk, approval, delegation, and output visibility have separate controls. The baseline identifies the external source of the term and its mappings; this project contributes concrete controls focused on enterprise identity and authorization.

## 2. Five Representative Design Questions

### 2.1 Configuring a Tool Does Not Authorize Every Invocation

**Problem.** A connector assigned to an AI employee defines a capability ceiling. The initiating user may have narrower resource permissions, and the task may need only part of that access. Giving a sub-agent the connector's full permissions can expand the original delegation.

**Design choice.** Trusted components calculate effective permissions for every invocation. On-behalf-of access intersects the user's current permissions, the agent's authorized scope, and the declared task scope. Downstream agents are also constrained by upstream delegation. Filtering the tool list reduces mistakes; execution-time checks enforce the boundary.

**Related requirements.** V2.2.1, V2.2.3, V2.2.5, V2.4.1, V3.2.1.

**Verification.** Start a task as a read-only user and attempt a write. Delegate to a sub-agent and attempt to widen resource scope. Revoke the user's permissions during execution and repeat a call. The enforcing component must reject each unauthorized request, with attribution to the user, agent, and task.

**Practice material.** Teloa's [security model](https://github.com/teloa-ai/teloa/blob/main/SECURITY.md#安全模型概述) identifies where role-based tool authorization is applied. Assessment still requires checking whether every actual invocation path passes through those controls.

### 2.2 Approval Must Bind to the Actual Operation Parameters

**Problem.** A model-generated summary such as “send the summary email” may omit recipients, attachments, or batch scope. If execution parameters change after approval, the user approved a different operation.

**Design choice.** The platform generates approval content from actual parameters and verifies the same parameters at execution. Approvals expire, and repeated requests are constrained. Pre-approved plans specify tools, resource scope, and limits.

**Related requirements.** V3.4.1 through V3.4.6.

**Verification.** Change a recipient or attachment after approval, widen an approved deletion scope, replay an expired approval, and generate repeated confirmation requests. Verify that modified or expired operations are rejected and that approval cannot be reused for a different purpose.

**Practice material.** Teloa's [security model](https://github.com/teloa-ai/teloa/blob/main/SECURITY.md#安全模型概述) describes approval for operations with external side effects. Naming a workflow does not establish parameter binding, expiration, or replay protection; those need corresponding test evidence.

### 2.3 Credential Protection Must Cover Use as Well as Storage

**Problem.** Disk encryption addresses one exposure path. If real secrets reach context, environment variables, execution files, or tool responses, an agent may still read or transmit them. Even with host-mediated requests, an authorized service may echo a secret.

**Design choice.** The platform manages credentials and injects them at controlled egress for an approved destination. Destination checks, prevention of bypass paths, and response and log handling are separate controls. Encryption, value-based redaction, and command guards cannot individually replace control of the full access path.

**Related requirements.** V4.1.1, V4.1.2, V4.1.5, V4.2.1 through V4.2.3, V4.7.1.

**Verification.** Attempt to read secrets from context, execution environments, and logs. Change the destination host or path, use another network tool, and simulate an echoed credential. Confirm that denial or removal occurs before the execution environment receives the secret. Record uncovered encodings, channels, and third-party behavior.

**Practice material.** Teloa's [credential storage and recovery notes](https://github.com/teloa-ai/teloa/blob/main/SECURITY.md#凭据存储与恢复) distinguish storage protection, controlled use, and residual risks. Capabilities marked as under development or unreleased are not evidence of delivered functionality.

### 2.4 Read Authorization and Output Visibility Need Separate Checks

**Problem.** An AI employee can read a personal account and later receives a related task in a group. The query may be authorized, but not every member may view the result. A read-only request can still cause disclosure.

**Design choice.** Authorize retrieval for the initiating user and task, then check recipient permissions again when replying, sharing, or handing off. Group channels expose only data all present members may access. Results beyond that scope follow the baseline's private-channel requirements. Memory, context, and artifacts retain permissions and provenance.

**Related requirements.** V7.1.1, V7.1.2, V7.1.4, V7.2.2, V7.3.1, V8.3.1, V8.5.2.

**Verification.** Run a group task with members who have different permissions. Check that personal data does not appear in shared replies, history, or shared artifacts. Also test new members, conversation handoff, memory retrieval, and artifact sharing.

**Practice material.** Teloa's [credential notes](https://github.com/teloa-ai/teloa/blob/main/SECURITY.md#凭据存储与恢复) record risks at the intersection of group tasks and personal account authorization. A disclosed limitation can motivate a requirement; it does not prove that requirement is met.

### 2.5 Application Guards and Execution Isolation Have Different Jobs

**Problem.** Blocking known commands and paths cannot cover every interpreter, symbolic link, encoding, or combined operation. If an execution environment can alter policy or read host credentials, one missed guard rule can undermine the boundary.

**Design choice.** Establish trusted and untrusted components for the deployment first. Use operating-system isolation, default-deny egress, and enforcement points the agent cannot alter. Guards and redaction provide defense in depth. Isolation strength and bypass paths require separate verification.

**Related requirements.** V3.2.2, V3.2.3, V4.2.2, V5.1.2, V5.1.4, V5.4.1 through V5.4.4.

**Verification.** Attempt to access host credentials, other sessions, and internal services from the execution environment. Attempt to alter policy or broaden permission modes. Identify which settings an agent can change and which require a user or administrator, and record how those changes affect assessment scope.

**Practice material.** Teloa's [security model](https://github.com/teloa-ai/teloa/blob/main/SECURITY.md#安全模型概述) documents boundaries between deployment defaults and session-level permissions. Pinning defaults alone does not demonstrate operating-system isolation.

## 3. General Requirements and Deployment Assumptions

The baseline focuses on enterprise identity and authorization. Its [reference architecture](../../01-standard/en/baseline-v1.0.md) assigns distinct responsibilities to identity, policy, egress, and audit components. A single-user local tool, a shared enterprise service, and an endpoint agent have different trust assumptions.

Before assessment, record the version, deployment model, enabled capabilities, external systems, and responsible parties. Apply the baseline's section-level applicability conditions. An absent security control that the platform needs cannot simply be marked not applicable. Challenges to architectural constraints or equivalent implementations should be submitted as verifiable proposals. This rationale does not replace the baseline or grant exceptions.

## 4. Turning Goals into Reviewable Evidence

| Record | Purpose |
| --- | --- |
| Requirement ID and baseline version | Identify the assessment criteria and avoid mixed versions |
| Product version, deployment scope, configuration | Distinguish an available capability from one active in the deployment |
| Implementation location and test records | Identify the enforcing component and verify denial paths |
| Status, gaps, owners, and plans | Support review and follow-up improvements |
| Uncovered paths and residual risks | Define the practical limits of a conclusion |

A source location, feature demonstration, or single test is only part of the evidence. The self-assessment tool records and summarizes findings; it does not automatically verify implementation or issue independent certification. See the [assessment example](../../02-usage/en/usage.md#assessment-example) for a report, coverage matrix, and importable simulated data.

## 5. Improving the Baseline Through Open Review

Feedback from other products, deployments, and assessment practices is welcome. Propose requirement changes with the associated threat, the gap in the current requirements, and a method that yields a definite pass or fail. Follow the [contribution guide](../../CONTRIBUTING.md).

The Teloa links in this document point to evolving materials. When using them as assessment evidence, record a specific version or commit and the inspection date. Keep development experience, publication of the baseline, and evidence-based compliance conclusions distinct.
