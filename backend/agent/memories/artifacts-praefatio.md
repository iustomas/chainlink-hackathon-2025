# Work Artifacts Memory

## 1. Core Purpose of this Memory

This document defines the conceptual nature of the intellectual products, or "Work Artifacts," that the iusTomas agent is designed to produce. Its purpose is to serve as a foundational guide for all Gems, enabling them to understand the *objective*, *scope*, and *key relevance factors* for each type of deliverable.

This memory is NOT a style guide for formatting. Instead, it is a map of the agent's capabilities, delineating what constitutes a valuable output in different professional contexts. It is a primary resource for the **Praefatio** Gem to understand the services it can offer, and for the **Cognitio** Gem to structure its diagnostic and investigation plan.

## 2. The Dual Artifact Framework

The agent's work product is categorized into two distinct types, reflecting the deliberative process:

* **Internal Cognitive Artifacts:** These are structured data objects (typically JSON) produced by Gems like **Cognitio** and **Investigato**. Their audience is the agent itself. Their purpose is to ensure a rigorous, auditable, and logical flow of information between a deliberative phase and the next. They are not meant for client delivery. Examples include the `Investigation Plan` or the `Synthesized Research Report`.

* **Final Client-Facing Artifacts:** These are the polished, professional documents produced by the **Respondeo** Gem for the end-user. They represent the culmination of the deliberative process and are the agent's primary deliverables. This memory defines the conceptual blueprint for these artifacts.

## 3. Catalogue of Final Client-Facing Artifacts

The following is a catalogue of the primary work products iusTomas can deliver. Each entry details the artifact's core objective and the critical information required for its successful creation.

---

### **Artifact Type 1: Strategic Report**

* **Core Objective:** To provide a high-level analysis of a situation, problem, or opportunity, enabling a professional to make a strategic decision. The focus is less on technical minutiae and more on implications, risks, and recommended courses of action. It answers the question: "Given the context, what should we do and why?"

* **Key Relevance Factors:**
    * **Implications over Descriptions:** The report must prioritize the consequences of facts, not just the facts themselves. For example, instead of merely stating "Regulation X requires a license," the report should analyze "The licensing requirement of Regulation X implies a 6-month operational delay and an estimated cost of Y."
    * **Risk/Opportunity Matrix:** The analysis should be framed in terms of potential risks (financial, legal, operational) and opportunities (market entry, competitive advantage, innovation).
    * **Actionable Recommendations:** The conclusion must contain a clear, prioritized set of recommendations. Each recommendation should be justified by the analysis presented.
    * **Second-Order Thinking:** The report should attempt to analyze the potential reactions of competitors, regulators, or the market to the proposed strategies.

* **Relevant Client Input to Identify:** During the `scoping` phase, the agent must look for signals indicating the need for a Strategic Report, such as:
    * Keywords: "viability," "business model," "strategy," "risk analysis," "go-to-market," "should I/we...?".
    * Open-ended questions about the future or a course of action.
    * Inputs that describe a business goal or a problem rather than a specific legal or technical question.
    * Documents provided: Business plans, market analyses, investor presentations.

* **Key Knowledge Gaps to Investigate:** When this artifact is chosen, the **Investigato** Gem's mission will be to resolve uncertainties related to:
    * **Market Precedents:** "Have other companies attempted a similar strategy? What were the outcomes?"
    * **Regulatory Posture:** "What is the general attitude of the relevant regulatory bodies towards this type of innovation? Are there public statements or guidance documents?"
    * **Best Practices:** "What are the established best practices for this type of project or venture?"
    * **Competitive Landscape:** "Who are the main actors in this space and what are their current strategies?"

---

### **Artifact Type 2: Compliance Analysis**

* **Core Objective:** To determine whether a specific product, process, or action conforms to a given set of rules, laws, or standards. The analysis is highly technical, fact-based, and objective. It answers the question: "Does X comply with framework Y?"

* **Key Relevance Factors:**
    * **Rule-to-Fact Mapping:** The core of the analysis is a direct and explicit mapping of each specific rule or clause from the legal/technical framework to the specific facts of the user's situation.
    * **Identification of Deviations (Gaps):** The primary output is a clear identification of any and all points where the user's situation deviates from the required standard.
    * **Literal Interpretation:** The analysis must be based on a strict, literal interpretation of the provided rules. Ambiguities in the rules themselves should be noted as a specific type of risk.
    * **Evidence-Based:** Every conclusion of compliance or non-compliance must be directly supported by a citation to a specific rule and a corresponding fact.

* **Relevant Client Input to Identify:**
    * Keywords: "compliance," "regulation," "audit," "is this legal," "does this meet the standard," "MiCA," "GDPR," "Howey Test."
    * Specific, closed-ended questions about the legality or conformity of a defined action.
    * Documents provided: Terms of Service, internal policy documents, product descriptions, whitepapers.

* **Key Knowledge Gaps to Investigate:**
    * **Exact Definitions:** "What is the precise, official definition of key terms within the regulation (e.g., 'utility token,' 'personal data')?"
    * **Specific Thresholds and Requirements:** "Does the framework specify quantitative thresholds (e.g., number of users, transaction volume) or mandatory procedures (e.g., specific disclosures, reporting requirements)?"
    * **Official Guidance and Rulings:** "Are there any official explanatory notes, court rulings, or regulatory decisions that clarify the interpretation of ambiguous clauses?"
    * **Safe Harbors and Exemptions:** "Does the legal framework provide any 'safe harbors' or exemptions that might apply to the user's situation?"
---

### **Artifact Type 3: Contractual Draft**

* **Core Objective:** To translate a business or personal agreement into a formal, legally coherent document. The goal is not merely to write clauses, but to accurately capture the parties' intent, allocate risk, define obligations, and create a framework for a successful long-term relationship. It answers the question: "How do we formalize our agreement to make it clear, fair, and enforceable?"

* **Key Relevance Factors:**
    * **Clarity of Obligations:** The document must unambiguously state who is responsible for doing what, by when, and to what standard of quality. This includes deliverables, timelines, and payment terms.
    * **Risk Allocation and Mitigation:** The draft must identify potential points of failure in the relationship and assign responsibility. This is achieved through clauses covering representations, warranties, indemnification, and limitations of liability.
    * **Incentive Alignment:** The contractual structure (e.g., payment milestones, performance bonuses, vesting schedules, penalties) should naturally encourage all parties to act in good faith and work towards the shared, desired outcome.
    * **Dispute Resolution:** A clear, practical, and cost-effective mechanism for resolving disagreements must be included. This specifies governing law, jurisdiction, and the method (e.g., mediation, arbitration, or litigation).
    * **Boilerplate Integrity:** Standard, non-negotiated clauses ("boilerplate") must be robust, current, and appropriate for the specific type of agreement and jurisdiction.

* **Relevant Client Input to Identify:**
    * Keywords: "contract," "agreement," "terms of service," "MOU" (Memorandum of Understanding), "LOI" (Letter of Intent), "partnership," "SAFT," "service agreement."
    * A description of a business deal, a collaboration between two or more parties, or the rules governing a service.
    * Documents provided: Existing drafts, term sheets, email chains outlining agreed-upon points, business proposals.

* **Key Knowledge Gaps to Investigate:**
    * **Jurisdictional Requirements:** "What are the mandatory provisions or prohibitions for this type of contract under the specified governing law? Are there any consumer protection laws that apply?"
    * **Market Standard Clauses:** "What are the current, market-accepted standard clauses for this type of agreement (e.g., a SaaS agreement, a token sale agreement)? What are typical liability caps or warranty periods?"
    * **Domain-Specific Risks:** "What are the unique risks associated with the subject matter (e.g., smart contract failure, intellectual property in AI-generated code, data privacy in a dApp) that require custom clauses?"
    * **Enforceability of Digital Agreements:** "What are the latest precedents or statutes regarding the enforceability of electronic signatures, 'click-wrap' agreements, or agreements executed via smart contracts?"

---

### **Artifact Type 4: System Architecture Document**

* **Core Objective:** To provide a comprehensive technical and economic blueprint for a complex system, typically in the Web3, AI, or Fintech space. This document serves as a source of truth for developers, investors, and technical auditors. It answers the questions: "How does this system work?" and "Why is it designed this way?"

* **Key Relevance Factors:**
    * **Component Interaction Model:** The document must clearly describe each major component of the system (e.g., smart contracts, off-chain oracles, front-end interfaces, databases) and illustrate how they interact. Data flow diagrams and sequence diagrams are conceptually critical.
    * **Economic/Tokenomic Model:** If a token is central to the system, its entire lifecycle must be detailed: issuance, distribution, utility (what it's used for), and value accrual mechanisms. This includes incentive structures like staking, burning, or governance rights.
    * **Security and Trust Model:** The architecture must explicitly state its security assumptions. It must identify potential attack vectors (e.g., smart contract exploits, oracle manipulation, economic attacks) and detail the specific mechanisms in place to mitigate them (e.g., required audits, use of decentralized oracles like Chainlink, multi-signature controls, bug bounties).
    * **Data Dependencies:** The document must list all external data points required for the system to function and specify the source and mechanism for retrieving that data (e.g., "The system requires real-time ETH/USD price data, which will be sourced from Chainlink Data Feeds to ensure integrity and availability").

* **Relevant Client Input to Identify:**
    * Keywords: "architecture," "tokenomics," "whitepaper," "technical design," "staking model," "DeFi protocol," "system design," "DAO structure."
    * A description of a new application, platform, or protocol to be built.
    * A request to formalize or validate a technical idea for an investor presentation or development team.
    * Documents provided: Draft whitepapers, technical notes, competitor system analyses, user flow diagrams.

* **Key Knowledge Gaps to Investigate:**
    * **Established Design Patterns:** "What are the industry-standard, battle-tested design patterns for the required functionality (e.g., AMM models like Uniswap V2 vs. V3, Compound/Aave-style lending protocols, Gnosis Safe for multi-sig governance)?"
    * **Interoperability Standards:** "Which technical standards are critical for ecosystem compatibility (e.g., ERC-20 for fungible tokens, ERC-721/1155 for NFTs, ERC-4337 for Account Abstraction, Chainlink CCIP for cross-chain communication)?"
    * **Known Security Vulnerabilities:** "What are the most common security pitfalls for the chosen technology stack (e.g., re-entrancy attacks in Solidity, front-running vulnerabilities, risks of centralized sequencers in L2s)?"
    * **Scalability Trade-offs:** "What are the performance and cost trade-offs of building on the proposed chain or technology (e.g., Ethereum Mainnet vs. a Layer 2 solution like Arbitrum or Optimism)?"

