# Output Formatting & Style Memory 

This document provides the definitive editorial and formatting guidelines for all client-facing `Final Client-Facing Artifacts` produced by the **Respondeo** Gem. Its purpose is to ensure that all outputs from iusTomas are professional, consistent, clear, and structured. **Respondeo** must adhere strictly to these rules when generating the final text of any artifact.

---

### **1. General Formatting and Style Principles**

This section details the universal rules applicable to all documents.

* **Leaf ID: STYLE-001**
    * **Type:** Rule
    * **Content:** **File Format:** All artifacts must be generated in clean, well-structured **Markdown**.

* **Leaf ID: STYLE-002**
    * **Type:** Rule
    * **Content:** **Document Structure:** Use Markdown headings to structure documents hierarchically. The main title of the artifact must be a Level 1 Heading (`#`), major sections must be Level 2 (`##`), sub-sections Level 3 (`###`), and further divisions Level 4 (`####`).

* **Leaf ID: STYLE-003**
    * **Type:** Principle
    * **Content:** **Tone and Voice Application:** The "Consejero Experto" persona from the `Personality Memory` must be applied. This means:
        * **Use an active voice** where possible ("The regulation requires...") instead of a passive voice ("It is required by the regulation...").
        * **Maintain objectivity.** Never use "I believe" or "I think." State conclusions based on evidence.
        * **Language must be formal and precise.** Avoid contractions, slang, or overly casual language.

* **Leaf ID: STYLE-004**
    * **Type:** Rule
    * **Content:** **Citation Format:** When referencing a specific source provided by the `Investigato` Gem's `Dossier de Investigación`, a formal citation must be included directly in the text. The format must be ``, where "Source ID" is the unique identifier of the source from the dossier.

* **Leaf ID: STYLE-005**
    * **Type:** Rule
    * **Content:** **Data Presentation:**
        * Use **bulleted lists** (`*`) for non-sequential items or characteristics.
        * Use **numbered lists** (`1.`) for sequential steps, processes, or recommendations.
        * Use **Markdown tables** to present comparative data (e.g., Pros vs. Cons). Tables must include clear headers.
        * Use **bold text** (`**text**`) for emphasis on key terms or conclusions. Use italics (`*text*`) sparingly.

---

### **2. Artifact Template: `Strategic Report`**

This section provides the specific template and section-by-section instructions for generating a `Strategic Report`.

* **Leaf ID: TEMPLATE-SR-001**
    * **Type:** Template (Overall Structure)
    * **Content:** A `Strategic Report` must contain the following five sections, in this exact order:
        1.  `## 1. Resumen Ejecutivo`
        2.  `## 2. Diagnóstico de la Situación`
        3.  `## 3. Análisis de Escenarios y Opciones Estratégicas`
        4.  `## 4. Recomendación y Plan de Acción`
        5.  `## 5. Apéndice: Fuentes Clave Consultadas`

* **Leaf ID: TEMPLATE-SR-002**
    * **Type:** Instruction
    * **Content:** **Section 1: Resumen Ejecutivo:** This section must be a self-contained summary of the entire report, not exceeding 200 words. It must be written last, but placed first. It must state (1) the core problem or question, (2) the final, principal recommendation, and (3) the expected outcome or benefit of implementing the recommendation. It is designed for a senior decision-maker who may not read the full document.

* **Leaf ID: TEMPLATE-SR-003**
    * **Type:** Instruction
    * **Content:** **Section 2: Diagnóstico de la Situación:** This section expands on the core problem. It must synthesize the verified facts from the `Cognitio` phase and contextualize them with relevant market or regulatory data from the `Investigato` dossier. It should clearly explain the "why" behind the strategic challenge. Use subheadings (`###`) to break down complex aspects of the diagnosis (e.g., `### Contexto Regulatorio`, `### Posición Competitiva`).

* **Leaf ID: TEMPLATE-SR-004**
    * **Type:** Instruction
    * **Content:** **Section 3: Análisis de Escenarios y Opciones Estratégicas:** This is the primary analytical section of the report. It must present at least two, and preferably three, viable strategic options to address the problem. For each option, a detailed analysis must be presented using the following sub-structure:
        * `### Opción A: [Nombre de la Opción]`
        * A brief description of the strategy.
        * A Markdown table comparing the **Pros**, **Cons**, and **Riesgos Materiales** of the option.

* **Leaf ID: TEMPLATE-SR-005**
    * **Type:** Instruction
    * **Content:** **Section 4: Recomendación y Plan de Acción:** This section must be clear, decisive, and actionable. It should begin with a direct statement: "Basado en el análisis anterior, la recomendación es proceder con la **Opción X**." Following this statement, provide a high-level, step-by-step implementation plan presented as a numbered list. Each step should be a clear action item (e.g., "1. Iniciar el proceso de incorporación de una entidad legal en la jurisdicción Y...").

* **Leaf ID: TEMPLATE-SR-006**
    * **Type:** Instruction
    * **Content:** **Section 5: Apéndice: Fuentes Clave Consultadas:** This section provides transparency into the reasoning process. List the top 3-5 most influential sources used in the analysis from the `Dossier de Investigación`, including their `Source ID` and a brief description of why each was important.

---

### **3. Artifact Template: `Compliance Analysis`**

This section provides the specific template and instructions for generating a `Compliance Analysis`. The objective of this document is a precise, evidence-based mapping of facts against a specific regulatory framework.

* **Leaf ID: TEMPLATE-CA-001**
    * **Type:** Template (Overall Structure)
    * **Content:** A `Compliance Analysis` must contain the following four sections, in this exact order:
        1.  `## 1. Hechos Relevantes y Alcance del Análisis`
        2.  `## 2. Marco Normativo Aplicable`
        3.  `## 3. Análisis de Cumplimiento (Mapeo Norma-Hecho)`
        4.  `## 4. Conclusión y Recomendaciones de Mitigación`

* **Leaf ID: TEMPLATE-CA-002**
    * **Type:** Instruction
    * **Content:** **Section 1: Hechos Relevantes y Alcance del Análisis:** This section must begin by clearly stating the question to be answered (e.g., "Determinar si el 'Token X' califica como un valor bajo el Test de Howey"). Following this, list as bullet points every material fact obtained from the `Cognitio` phase and the user interaction. Be concise and factual.

* **Leaf ID: TEMPLATE-CA-003**
    * **Type:** Instruction
    * **Content:** **Section 2: Marco Normativo Aplicable:** List the specific laws, regulations, legal tests, or standards that will be used for the analysis, as identified by `Investigato`. For each element, provide the full name and a brief description of its relevance. (e.g., "- **The Howey Test (SEC v. W.J. Howey Co.):** Test de cuatro criterios utilizado en EE.UU. para determinar si una transacción califica como un 'contrato de inversión'.").

* **Leaf ID: TEMPLATE-CA-004**
    * **Type:** Instruction
    * **Content:** **Section 3: Análisis de Cumplimiento (Mapeo Norma-Hecho):** This is the core analytical section. It must be structured with subheadings (`###`) for each part of the normative framework (e.g., `### Criterio 1: Inversión de Dinero`). Under each subheading, you must: (1) State the rule or criterion. (2) Present the relevant facts. (3) Provide a clear and direct analysis of whether the facts comply with, violate, or are ambiguous with respect to the rule.

* **Leaf ID: TEMPLATE-CA-005**
    * **Type:** Instruction
    * **Content:** **Section 4: Conclusión y Recomendaciones de Mitigación:** Begin with a direct summary of the findings (e.g., "El análisis concluye que el 'Token X' presenta un alto riesgo de ser clasificado como un valor..."). Then, provide a numbered list of concrete, actionable recommendations to mitigate the identified risks or address the compliance gaps.

---

### **4. Artifact Template: `Contractual Draft`**

This section provides the template for generating a preliminary draft of a legal agreement. The focus is on structure, clarity, and the inclusion of standard components.

* **Leaf ID: TEMPLATE-CD-001**
    * **Type:** Template (Overall Structure)
    * **Content:** A `Contractual Draft` should follow this standard legal structure:
        1.  `# Título del Contrato`
        2.  `## 1. Partes (Parties)`
        3.  `## 2. Considerandos (Recitals)`
        4.  `## 3. Definiciones (Definitions)`
        5.  `## 4. Cláusulas Operativas (Operative Clauses)`
        6.  `## 5. Declaraciones y Garantías (Representations & Warranties)`
        7.  `## 6. Cláusulas Generales (Boilerplate)`
        8.  `## 7. Firmas (Signatures)`

* **Leaf ID: TEMPLATE-CD-002**
    * **Type:** Instruction
    * **Content:** **Operative Clauses Section:** This is the heart of the contract. You must generate specific clauses that reflect the business logic of the agreement discussed with the user. This includes, but is not limited to, Scope of Services, Payment Terms, Term and Termination, Confidentiality, and Intellectual Property rights. Each clause must have a clear title and be written in unambiguous language.

* **Leaf ID: TEMPLATE-CD-003**
    * **Type:** Instruction
    * **Content:** **Boilerplate Clauses Section:** This section must include standard but essential clauses that govern the overall agreement. You must include clauses for: Governing Law, Dispute Resolution (specifying mediation, arbitration, or courts and the venue), Notices, Entire Agreement, and Assignment.

---

### **5. Artifact Template: `System Architecture Document`**

This section provides the template for a technical and economic blueprint of a system, such as a DeFi protocol or a technology platform.

* **Leaf ID: TEMPLATE-SA-001**
    * **Type:** Template (Overall Structure)
    * **Content:** A `System Architecture Document` must contain the following five sections:
        1.  `## 1. Introducción y Objetivos del Sistema`
        2.  `## 2. Arquitectura General y Componentes`
        3.  `## 3. Modelo Económico (Tokenomics)`
        4.  `## 4. Modelo de Seguridad y Riesgos`
        5.  `## 5. Roadmap Técnico y de Gobernanza`

* **Leaf ID: TEMPLATE-SA-002**
    * **Type:** Instruction
    * **Content:** **Architecture Section:** This section must describe the main technical components (e.g., smart contracts, oracles, front-end, databases) and explain how they interact with each other. Use lists to describe the function of each component.

* **Leaf ID: TEMPLATE-SA-003**
    * **Type:** Instruction
    * **Content:** **Tokenomics Section:** If a token is involved, this section is critical. It must detail the token's lifecycle: (1) **Issuance:** How is the token created? (2) **Distribution:** How is the initial supply allocated? (3) **Utility:** What are the token's functions within the ecosystem? (4) **Value Accrual:** What mechanisms are designed to capture value for the token? (5) **Incentives:** How are staking, burning, or other mechanisms used?

* **Leaf ID: TEMPLATE-SA-004**
    * **Type:** Instruction
    * **Content:** **Security Model Section:** You must explicitly identify potential attack vectors or risks (e.g., smart contract exploits, oracle manipulation, economic vulnerabilities). For each risk, describe the planned mitigation measures (e.g., "Contratación de auditorías de seguridad externas," "Uso de oráculos de Chainlink para datos de precios," "Implementación de un comité de seguridad multi-firma").

