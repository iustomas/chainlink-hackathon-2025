# Work Artifacts Memory v2.0

## 1. Core Purpose & Architectural Framework

This document defines the conceptual nature of the intellectual products, or "Work Artifacts," that the iusTomas agent is designed to produce. Its purpose is to serve as a foundational guide for all agentic processes, particularly for Praefatio during the diagnostic and scoping phase.

The catalogue is organized along two primary axes, reflecting the reality of professional work:

- **Artifact Nature:** The fundamental purpose of the document.
  - **Intellectual Advancement:** To analyze, explain, and provide clarity for strategic decision-making.
  - **Legal Action:** To create, modify, or formalize legal relationships and obligations.

- **Recipient Audience:** The intended reader of the final document.
  - **Internal:** For the client and their direct team.
  - **Third Party:** For external entities like investors, partners, clients, or providers.
  - **Authority:** For formal bodies like regulators, courts, or government agencies.

Furthermore, each artifact is defined with a critical metadata field: **Required Human Intervention Level**. This helps the agent understand the practical utility and limitations of its output and forms the basis for the "Trust Continuum" it must communicate to the user.

---

## Category 1: Intellectual Advancement Documents

**Definition:** Artifacts whose primary purpose is to analyze, explain, synthesize, and provide clarity to support strategic decision-making. They do not, by themselves, create direct legal obligations.

### 1.1 (For Internal Use)

**Artifact:** Strategic Viability Report  
**Core Objective:** To empower a leadership team with a clear, high-level analysis of a new product, market expansion, or business opportunity, enabling them to make a well-informed strategic decision. The report answers the question: "Given the context, what should we do, why should we do it, and what are the critical risks?"

**Required Human Intervention Level:** Low. This is a high-autonomy artifact. It is designed to be a self-contained strategic tool that a founder or executive can use directly to guide planning and discussion.

**Key Relevance Factors:**

- **Implications over Descriptions:** The report must prioritize the consequences of facts, not just the facts themselves. It should focus on "what this means" rather than just "what this is."
- **Second-Order Thinking:** The analysis should attempt to model the potential reactions of competitors, regulators, or the market to the proposed strategies.
- **Actionable Recommendations:** The conclusion must contain a clear, prioritized set of recommendations. Each recommendation must be explicitly justified by the analysis presented in the body of the report.

**Base Structure:**

- Executive Summary (The entire case and recommendation on a single page).
- Analysis of the Core Problem or Opportunity.
- Market & Competitive Landscape Analysis.
- Regulatory & Key Risk Assessment (Legal, Operational, Financial).
- Proposed Strategic Model & Courses of Action.
- Conclusion and Prioritized Recommendations.

**Length Options:**

- Concise: A 1-2 page executive memo focusing on risks and recommendations.
- Standard: A 5-10 page report with developed analysis in each section.
- Exhaustive: A 15+ page deep-dive report with detailed data and multiple annexes.

**Praefatio's Key Identifiers:**

- **Keywords:** "viability," "business model," "strategy," "risk analysis," "go-to-market," "expansion," "should I/we...?"
- **User Input:** Open-ended questions about a future course of action; descriptions of a business goal rather than a specific legal question.

**Investigato's Core Directives:**

- To research market precedents, regulatory attitudes, competitive strategies, and established best practices for the venture in question.

---

**Artifact:** Regulatory Risk Analysis (Gap Analysis)  
**Core Objective:** To systematically determine whether a specific product, process, or action conforms to a given set of rules, laws, or standards (e.g., MiCA, GDPR, a specific Fintech Law). The report's primary function is to identify and explain any deviations ("gaps"). It answers the question: "Does X comply with framework Y, and if not, exactly where and why?"

**Required Human Intervention Level:** Low to Medium. The analysis itself is a robust and valuable tool. However, for making critical investment or architectural decisions based on the findings, a final review by qualified legal counsel is recommended.

**Key Relevance Factors:**

- **Rule-to-Fact Mapping:** The core of the analysis is a direct, explicit, and granular mapping of each specific rule or clause from the legal framework to the specific facts of the user's situation.
- **Clear Gap Identification:** The primary output must be a clear, unambiguous list of any and all points where the user's situation deviates from the required standard. Each gap must be explained.
- **Evidence-Based:** Every conclusion of compliance or non-compliance must be directly supported by a citation to a specific rule and a corresponding fact from the case.

**Base Structure:**

- Executive Summary with a "Red Flag" synopsis.
- Overview of the Regulatory Framework (e.g., summary of MiCA's objectives).
- Detailed Rule-by-Rule Compliance Mapping.
- Consolidated List of Identified Gaps and Non-Compliance Risks.
- Risk Severity Assessment (High, Medium, Low) for each identified gap.
- Recommendations for Mitigation and Next Steps.

**Length Options:**

- Concise: A "Red Flag Report" focusing only on the highest-risk gaps.
- Standard: A full analysis covering all relevant clauses of the framework.
- Exhaustive: A standard analysis plus detailed mitigation strategies and procedural recommendations for each gap.

**Praefatio's Key Identifiers:**

- **Keywords:** "compliance," "regulation," "audit," "is this legal," "does this meet the standard," "MiCA," "GDPR," "Howey Test."
- **User Input:** Specific, closed-ended questions about the legality or conformity of a well-defined action or product.

**Investigato's Core Directives:**

- To research the precise, official definitions of key terms within the regulation, identify any quantitative thresholds or mandatory procedures, and find any official guidance, court rulings, or "safe harbors" that clarify the interpretation of the rules.
...

### 1.2 (For Third Parties)

**Artifact:** Investor Memorandum / Due Diligence Report  
**Core Objective:** To create a clear, comprehensive, and persuasive document that explains a complex business model, technical architecture, or regulatory strategy to a sophisticated third party, such as a potential investor, strategic partner, or acquirer. It answers the question: "Why is this project a credible, valuable, and well-thought-out opportunity?"

**Required Human Intervention Level:** Medium. This artifact serves as an excellent, professionally structured first draft. However, the founding team must review and personalize it to ensure the tone, narrative, and strategic vision align perfectly with their own voice before sharing it with external parties.

**Key Relevance Factors:**

- **Pedagogical Clarity:** The document must explain complex concepts (e.g., tokenomics, a novel DeFi mechanism) in a way that is understandable to a smart but non-specialist audience. Analogies and clear diagrams are key.
- **Robust Economic/Tokenomic Model:** If a token is involved, its entire lifecycle—issuance, utility, value accrual, and governance—must be logically and transparently detailed. The model must appear sustainable.
- **Transparent Risk Disclosure:** The document must proactively identify potential risks (technical, market, regulatory) and briefly describe the team's mitigation strategy, demonstrating foresight and credibility.

**Base Structure:**

- Executive Summary: The Opportunity & The Ask.
- The Problem: Detailed description of the market inefficiency or user pain point.
- The Solution: Overview of the product, service, or protocol.
- Technical & System Architecture: A clear explanation of "how it works."
- Tokenomics / Business Model: A detailed breakdown of "how it makes money" or "how value is created and distributed."
- Go-to-Market Strategy: The plan for acquiring users and achieving adoption.
- Team & Advisors.
- Risk Factors & Mitigation.

**Length Options:**

- Concise: A 3-5 page "alpha" version of a whitepaper or a detailed investment memo.
- Standard: A 10-20 page detailed whitepaper or technical paper suitable for public release.
- Exhaustive: A comprehensive report including detailed annexes, code audits (by reference), and financial models.

**Praefatio's Key Identifiers:**

- **Keywords:** "whitepaper," "tokenomics," "investor deck," "due diligence," "technical design," "DAO structure."
- **User Input:** A user describing a new platform or protocol they need to formalize for investors, partners, or their development team.

**Investigato's Core Directives:**

- To research established, battle-tested design patterns for the required functionality (e.g., AMM models, lending protocols), critical interoperability standards (e.g., ERC-20, ERC-4337), and common security vulnerabilities associated with the chosen technology stack.

---

### 1.3 (For Authorities)

**Artifact:** Draft Regulatory Inquiry (Request for Comment)  
**Core Objective:** To prepare a clear, formal, and well-reasoned draft of a written inquiry to be presented to a regulatory or administrative body (e.g., a financial regulator, a data protection authority). The goal is to seek official clarification on a "grey area" of the law as it applies to a specific, novel situation.

**Required Human Intervention Level:** High. This artifact is a first draft to be used by qualified legal counsel. A human lawyer must review, edit, and ultimately submit the document. The agent's role is to accelerate the research and drafting process for the human professional.

**Key Relevance Factors:**

- **Precise Formulation of the Question:** The value of the entire document hinges on formulating the central question to the regulator in a way that is precise, unambiguous, and not overly broad.
- **Clear Exposition of Facts:** The document must present the relevant facts of the user's project or situation in a neutral, objective, and orderly manner, providing the authority with all necessary context to understand the question.
- **Preliminary Legal Analysis:** The inquiry must demonstrate that the user has done their homework. It should include a brief analysis of the applicable regulations and explain why there is ambiguity or a need for clarification.

**Base Structure:**

- Introduction: Identification of the submitting party and a clear statement of the inquiry's purpose.
- Statement of Relevant Facts: A detailed, chronological description of the project, product, or situation in question.
- Applicable Regulatory Framework: A list of the specific laws, articles, and regulations that have been considered.
- The Question(s) for a Ruling: The precisely formulated question(s) for which a regulatory opinion is being sought.
- Applicant's Preliminary Analysis and Interpretation.
- Conclusion and Contact Information.

**Length Options:**

- Concise: A short letter format focusing on a single, direct question.
- Standard: A full memorandum format providing detailed background and analysis.

**Praefatio's Key Identifiers:**

- **Keywords:** "regulatory inquiry," "request for comment," "no-action letter," "opinion request to CMF/SEC," "submission to authority."
- **User Input:** A user expressing uncertainty about how a new, unproven business model will be treated by a specific government agency.

**Investigato's Core Directives:**

- To research the formal procedural requirements for submitting inquiries to the specific regulatory body, find any past rulings or similar inquiries that could serve as a precedent, and identify the exact department or contact person to whom the inquiry should be addressed.
...

## Category 2: Legal Action Documents

**Definition:** Artifacts specifically designed to create, modify, or formalize legal relationships and obligations. Their existence and execution have direct legal consequences.

### 2.1 (For Internal Use)

**Artifact:** Internal Compliance Manual (e.g., Crime Prevention, Data Privacy)  
**Core Objective:** To draft a formal, internal corporate policy or manual that establishes clear obligations and procedures for employees. The purpose is to ensure the company's operations comply with a specific external legal or regulatory framework. It answers the question: "How do we translate the requirements of Law X into concrete, day-to-day actions for our team?"

**Required Human Intervention Level:** Medium. The agent can produce a very strong and comprehensive draft based on the law's requirements. However, it must be reviewed and adapted by the company's management or legal team to ensure it aligns with the company's specific operational reality, culture, and risk tolerance.

**Key Relevance Factors:**

- **Operational Translation:** The document's primary value is in translating abstract legal requirements (e.g., "duty of supervision") into concrete, actionable procedures (e.g., "All new client contracts must be approved by the Compliance Officer via the compliance-approval channel on Slack").
- **Role and Responsibility Mapping:** The manual must clearly assign responsibility for specific compliance tasks to specific roles within the organization.
- **Clarity for Employees:** The language must be clear and direct, intended to be understood by non-lawyer employees who need to follow the procedures in their daily work.

**Base Structure:**

- Introduction: Purpose of the Manual and its scope of application.
- Definitions: A glossary of key terms.
- Roles and Responsibilities (e.g., role of the Compliance Officer).
- Specific Policies and Procedures (e.g., a chapter for each type of risk or obligation).
- Training and Communication protocols.
- Whistleblowing and Reporting mechanisms.
- Review and Update procedures for the manual itself.

**Length Options:**

- Concise: A high-level policy document outlining principles and key responsibilities.
- Standard: A full manual with detailed procedures for the company's primary risks.
- Exhaustive: A standard manual plus specific procedural annexes, checklists, and training materials.

**Praefatio's Key Identifiers:**

- **Keywords:** "crime prevention manual," "crime prevention model," "corporate policy," "privacy policy," "internal compliance."
- **User Input:** A user, typically a founder or manager, stating a need to implement an internal program to comply with a specific law like GDPR or a local corporate criminal liability law.

**Investigato's Core Directives:**

- To research the specific, mandatory requirements of the cited law (e.g., what elements Law 20.393 in Chile requires for a crime prevention model to be considered effective) and to find examples or established "best practices" for similar manuals within the client's industry.

---

### 2.2 (For Third Parties)

**Artifact:** Contract Draft  
**Core Objective:** To formalize a business or personal agreement between two or more parties in a legally coherent document. The goal is to accurately capture the parties' intent, fairly allocate risks, clearly define all obligations, and create a robust framework for a successful long-term relationship.

**Required Human Intervention Level:** Medium to High. The level depends heavily on the complexity and value of the agreement. The agent can produce an excellent draft for a standard Service Agreement or Terms of Service. However, for highly negotiated, high-value contracts (e.g., a corporate merger, a large investment round), the draft serves as a starting point for a human lawyer.

**Key Relevance Factors:**

- **Clarity of Obligations:** The draft must unambiguously state who is responsible for doing what, by when, and to what standard of quality. This includes deliverables, timelines, and payment terms.
- **Risk Allocation:** The draft must identify potential points of failure (e.g., non-payment, poor performance, data breach) and assign responsibility through specific clauses like representations, warranties, indemnification, and limitations of liability.
- **Incentive Alignment:** The structure (e.g., payment milestones, vesting schedules) should naturally encourage all parties to act in good faith towards the shared outcome.

**Base Structure (Typical Service Agreement):**

- Parties & Date.
- Background / Recitals.
- Object and Scope of Services.
- Obligations of Each Party.
- Price, Invoicing, and Payment Terms.
- Intellectual Property Ownership.
- Confidentiality.
- Term and Termination.
- Representations and Warranties.
- Indemnification and Limitation of Liability.
- Governing Law and Dispute Resolution.

**Length Options:**

- Concise: A "Term Sheet" or "Letter of Intent (LOI)" outlining the key commercial points.
- Standard: A complete, standard agreement for a common transaction.
- Exhaustive: A standard agreement plus multiple detailed annexes (e.g., a technical "Statement of Work").

**Praefatio's Key Identifiers:**

- **Keywords:** "contract," "agreement," "terms of service," "MOU," "LOI," "partnership," "SAFT," "service agreement."
- **User Input:** A description of a business deal or collaboration between two or more parties.

**Investigato's Core Directives:**

- To research market-standard clauses for the specific type of agreement and jurisdiction, any mandatory legal provisions or prohibitions under the governing law, and any unique risks associated with the subject matter (e.g., smart contract failure, AI-generated IP) that may require custom clauses.

---

### 2.3 (For Authorities)

**Artifact:** Draft Judicial / Administrative Filing  
**Core Objective:** To assist a qualified legal professional in preparing the initial draft of a formal document to be submitted to a court or an administrative agency (e.g., a complaint, a response to a lawsuit, a trademark application).

**Required Human Intervention Level:** Very High. This is the highest level of required human oversight. The agent's output is strictly an "accelerator" or a "first draft assistant" for a human lawyer. The human lawyer is solely responsible for the final legal strategy, argumentation, and accuracy of the filing.

**Key Relevance Factors:**

- **Logical Structuring of Facts:** The draft must organize the client's narrative into a clear, logical, and chronological statement of facts that is easy for a judge or official to follow.
- **Identification of Claims/Arguments:** The agent should identify the primary legal claims or arguments based on the facts and the specified legal framework.
- **Formal Structure:** The draft should follow the basic formal structure required for the specific type of filing (e.g., a section for parties, a section for facts, a section for legal arguments, a section for petitions).

**Base Structure (Example: a civil complaint):**

- Header with Court and Party identification.
- Introduction.
- Statement of Jurisdiction.
- Chronological Statement of Facts.
- Causes of Action / Legal Arguments (e.g., "First Cause of Action: Breach of Contract").
- Prayer for Relief (what is being requested from the court).

**Length Options:**

- Concise: A draft of a specific section of the filing, such as only the Statement of Facts.
- Standard: A complete first draft of a standard filing.

**Praefatio's Key Identifiers:**

- **Keywords:** "complaint," "claim," "response," "judicial filing," "appeal," "registration request."
- **User Input:** A user, often explicitly identified as a lawyer, describing a legal dispute or the need to initiate a formal legal or administrative process.

**Investigato's Core Directives:**

- To research the specific formal requirements (e.g., formatting, deadlines) of the target court or agency, and to find relevant statutes or case law (jurisprudence)