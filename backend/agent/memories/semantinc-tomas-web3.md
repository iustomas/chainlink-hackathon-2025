# Layer 0: Sources of Law (`0_SourcesOfLaw`)

[cite_start]This document constitutes the foundational layer of the Tomas semantic memory. [cite_start]It is designed as the root of the hierarchical legal tree and categorizes the most fundamental types of legal sources. [cite_start]The purpose of this layer is to embody the "Universality first" design principle by establishing juridical constants that are broadly applicable across different domains and jurisdictions. [cite_start]This structure ensures that any analysis begins from first principles, allowing the agent to reuse these core legal notions before addressing more specific or local regulations. [cite_start]Each piece of information is structured as a "leaf," capturing a single, discrete concept such as a definition, obligation, or legal test.

---

### **0.1_Constitutional**

This sub-shard contains the principles derived from a jurisdiction's constitution, which is recognized as the supreme source of law. It establishes the structure of the state, the powers of its branches, and the fundamental rights and duties of its citizens. All other sources of law are subordinate to it and must be consistent with its provisions.

**Example Leaves:**

- **Leaf ID: CONST-001**

  - **Type:** Principle (Supremacy)
  - **Content:** A constitution is the supreme law of a jurisdiction. Any statute, regulation, or judicial decision that conflicts with its provisions is void or unenforceable.

- **Leaf ID: CONST-002**

  - **Type:** Principle (Right to Property)
  - **Content:** Every natural or legal person is entitled to the peaceful enjoyment of their possessions. [cite_start]No one shall be deprived of their possessions except in the public interest and subject to the conditions provided for by law and by the general principles of international law.

- **Leaf ID: CONST-003**

  - **Type:** Principle (Due Process)
  - **Content:** All persons are equal before the law and are entitled without any discrimination to the equal protection of the law. Every person has the right to a fair and public hearing by an independent and impartial tribunal in the determination of their rights and obligations and of any criminal charge against them.

- **Leaf ID: CONST-004**
  - **Type:** Principle (Legality in Taxation)
  - **Content:** No tax may be levied except under the authority of a law. The creation, modification, or removal of taxes is the exclusive power of the primary legislative body.

---

### **0.2_Statutory Primary**

This sub-shard contains principles related to primary statutes, which are laws formally enacted by a principal legislative body (e.g., a Parliament, Congress). These laws govern broad areas of public and private life and provide the primary framework for a society's legal order, subordinate only to the constitution.

**Example Leaves:**

- **Leaf ID: STAT-001**

  - **Type:** Principle (Contractual Good Faith)
  - **Content:** Parties to a contract must act in accordance with good faith and fair dealing. This obligation is mandatory and cannot be excluded or limited by the contract.

- **Leaf ID: STAT-002**

  - **Type:** Definition (Contract Formation)
  - **Content:** A contract is formed by the acceptance of an offer. [cite_start]A contract is concluded, modified, or terminated by the mere agreement of the parties, without any further requirement.

- **Leaf ID: STAT-003**

  - **Type:** Definition (Legal Personhood)
  - **Content:** A legal person is an entity, such as a corporation or association, that is recognized under law as having rights and obligations distinct from those of its members.

- **Leaf ID: STAT-004**
  - **Type:** Rule (Liability for Breach)
  - **Content:** A party that fails to perform an obligation under a contract is liable for the harm caused by such failure. The aggrieved party is entitled to remedies, which may include specific performance, damages, or termination of the contract.

---

### **0.3_Secondary Regulation**

This sub-shard contains principles regarding secondary regulations. These are detailed rules, directives, and orders issued by executive bodies, government agencies, or specific regulators. They are created under the authority expressly delegated by a primary statute and serve to implement, clarify, or enforce that statute's provisions.

**Example Leaves:**

- **Leaf ID: SECREG-001**

  - **Type:** Principle (Delegated Authority)
  - **Content:** Secondary regulations are valid only if they are created within the scope of the authority granted by the enabling primary statute. A regulation that exceeds this authority can be challenged and invalidated.

- **Leaf ID: SECREG-002**

  - **Type:** Definition (Financial Instrument)
  - **Content:** For regulatory purposes, a "financial instrument" is defined as any contract that gives rise to a financial asset of one entity and a financial liability or equity instrument of another entity. This includes, but is not limited to, shares, bonds, and derivatives.

- **Leaf ID: SECREG-003**

  - **Type:** Threshold (Reporting Requirement)
  - **Content:** A financial entity must report any transaction or series of related transactions exceeding a value of $10,000 USD to the designated financial intelligence unit within 15 business days.

- **Leaf ID: SECREG-004**
  - **Type:** Rule (Licensing Requirement)
  - **Content:** Any entity providing asset custody services for third parties must obtain a specific license from the competent financial authority before commencing operations.

---

### **0.4_Soft Law Standards**

This sub-shard contains principles from "soft law," which comprises non-binding but highly influential standards, guidelines, and recommendations issued by international organizations and standard-setting bodies. While not legally enforceable on their own, they are often adopted into national law or used by courts and regulators as benchmarks for best practices.

**Example Leaves:**

- **Leaf ID: SOFT-001**

  - **Type:** Principle (AML/CFT - Risk-Based Approach)
  - **Content:** Financial institutions should apply a risk-based approach to anti-money laundering and countering the financing of terrorism (AML/CFT), meaning they should identify, assess, and understand the risks they are exposed to and take appropriate mitigation measures. [cite_start]This principle is a cornerstone of the Financial Action Task Force (FATF) recommendations.

- **Leaf ID: SOFT-002**

  - **Type:** Principle (Market Integrity)
  - **Content:** Regulation should promote market integrity by ensuring that markets are fair, efficient, and transparent. This includes prohibitions on market manipulation and insider trading. This principle is central to the objectives of the International Organization of Securities Commissions (IOSCO).

- **Leaf ID: SOFT-003**

  - **Type:** Principle (Systemic Risk Management)
  - **Content:** Financial authorities should have a framework to monitor and manage systemic risk in the financial system. This includes identifying and overseeing systemically important financial institutions. [cite_start]This is a key standard from the Financial Stability Board (FSB) and the Bank for International Settlements (BIS).

- **Leaf ID: SOFT-004**
  - **Type:** Principle (Disclosure for Digital Assets)
  - **Content:** Issuers of crypto-assets should provide clear, accurate, and not misleading information to potential purchasers, including details about the project, the rights and obligations attached to the asset, and the technology used.

---

### **0.5_Case Law Precedent**

This sub-shard contains principles derived from the decisions of courts and tribunals in prior cases. In common law jurisdictions, precedent (stare decisis) is a primary source of law, where lower courts are bound by the decisions of higher courts. In civil law jurisdictions, while not strictly binding, jurisprudence is highly influential in interpreting statutes and regulations.

**Example Leaves:**

- **Leaf ID: CASELAW-001**

  - **Type:** Test (Investment Contract Test - "Howey Test")
  - **Content:** An arrangement constitutes an investment contract (and thus a security) if it involves: (1) an investment of money, (2) in a common enterprise, (3) with a reasonable expectation of profits, (4) to be derived from the entrepreneurial or managerial efforts of others.

- **Leaf ID: CASELAW-002**

  - **Type:** Rule (Negligence Standard of Care)
  - **Content:** To establish liability for negligence, a plaintiff must prove that the defendant owed them a duty of care, that the defendant breached that duty by failing to act as a reasonably prudent person would have under the circumstances, and that this breach was the direct cause of the plaintiff's harm.

- **Leaf ID: CASELAW-003**

  - **Type:** Principle (Contract Interpretation - "Plain Meaning Rule")
  - **Content:** When the language of a contract is unambiguous and clear on its face, the court must determine the intent of the parties from the literal, or "plain," meaning of the language used, without considering extrinsic evidence.

- **Leaf ID: CASELAW-004**
  - **Type:** Definition (Corporate Veil Piercing)
  - **Content:** A court may disregard the separate legal personality of a corporation ("pierce the corporate veil") and hold its shareholders personally liable for the corporation's debts if it is found that the corporate form was used to perpetrate fraud, circumvent the law, or accomplish an illegitimate objective.

# Layer 1: Core Legal Functions (`1_CoreLegalFunctions`)

[cite_start]This document contains the second layer of the semantic memory, positioned directly beneath `0_SourcesOfLaw` in the hierarchical legal tree. [cite_start]It is designed to house the "most basic elements of law," also referred to as "juridical constants," which serve as a universal foundation for the agent's legal knowledge. [cite_start]This layer is a crucial implementation of the "Universality first" design principle, ensuring the system is built upon fundamental concepts before delving into specifics. [cite_start]Each entry is a "leaf" capturing a single definition, principle, or rule, primarily drawn from internationally recognized model codes to ensure broad applicability.

---

### [cite_start]**1.1_LegalPersonhood (entities, capacity)**

This sub-shard defines the subjects of law. It establishes which entities are recognized by the legal system as capable of holding rights and incurring obligations, and the extent of their ability to act within that system.

**Example Leaves:**

- **Leaf ID: PERS-001**

  - **Type:** Definition
  - **Content:** A **Natural Person** is a human being from the moment of birth until death. Every natural person has the capacity to hold legal rights and obligations.

- **Leaf ID: PERS-002**

  - **Type:** Definition
  - [cite_start]**Content:** A **Legal Person** is a non-human entity, such as a corporation, association, or foundation, that is granted legal personality by statute. This grants the entity a legal existence separate from that of its members, directors, or founders.

- **Leaf ID: PERS-003**

  - **Type:** Principle
  - **Content:** The principle of **Separate Legal Personality** dictates that a corporation's rights, assets, and liabilities are distinct from those of its shareholders. Shareholders are generally not personally liable for the debts of the corporation.

- **Leaf ID: PERS-004**

  - **Type:** Definition
  - **Content:** **Legal Capacity** (also known as capacity of enjoyment) is the fitness of a person, whether natural or legal, to be the subject of legal rights and obligations. [cite_start]This capacity is a fundamental attribute of personhood.

- **Leaf ID: PERS-005**

  - **Type:** Definition
  - **Content:** **Capacity to Act** is the power of a person to perform valid legal acts, exercise their rights, and assume binding obligations without the assistance or authorization of another. This capacity may be limited by law, for reasons such as age (minors) or mental incompetence.

- **Leaf ID: PERS-006**

  - **Type:** Rule
  - **Content:** Legal acts performed by a person lacking the capacity to act are typically voidable or null. Such acts may be ratified by a legal representative (e.g., a guardian) or by the person themselves upon attaining full capacity.

- **Leaf ID: PERS-007**

  - **Type:** Definition
  - **Content:** A **Legal Representative** is a person authorized by law or by appointment to act on behalf of another who lacks the capacity to act. The representative's actions are legally binding upon the represented person.

- **Leaf ID: PERS-008**
  - **Type:** Definition
  - **Content:** The **Domicile** of a natural person is their principal place of residence, while the domicile of a legal person is typically the place of its incorporation or its main administrative center as specified in its statutes. Domicile is used to determine the applicable law and jurisdiction.

---

### [cite_start]**1.2_PropertyAndTitle (ownership, possession)**

This sub-shard defines the legal relationships between legal persons and assets, both tangible and intangible. It covers the fundamental concepts of what can be owned and the nature of the rights associated with ownership, possession, and other interests in property.

**Example Leaves:**

- **Leaf ID: PROP-001**

  - **Type:** Definition
  - **Content:** **Property** refers to the set of legally protected rights and interests a person has in an asset. It encompasses both tangible things (land, goods) and intangible assets (intellectual property, contractual rights, digital assets).

- **Leaf ID: PROP-002**

  - **Type:** Definition
  - **Content:** **Ownership (Title)** is the most comprehensive right a person can have over property. It generally includes the right to possess, use, enjoy, manage, and dispose of the property, as well as the right to its fruits (e.g., income, offspring). [cite_start]The right to own property is a fundamental human right.

- **Leaf ID: PROP-003**

  - **Type:** Definition
  - [cite_start]**Content:** **Possession** is the factual state of exercising physical control over a property with the intention of holding it as one's own. Possession may be held by the owner or by a non-owner (e.g., a lessee or a thief). The law often grants certain protections to the possessor, regardless of title.

- **Leaf ID: PROP-004**

  - **Type:** Principle
  - **Content:** The principle of **"Nemo dat quod non habet"** dictates that a person cannot transfer a better title to property than the one they possess. A seller cannot convey valid ownership of an asset they do not lawfully own.

- **Leaf ID: PROP-005**

  - **Type:** Definition
  - **Content:** An **Intangible Asset** is a non-physical asset whose value derives from legal rights, such as patents, copyrights, trademarks, goodwill, and digital assets like cryptocurrencies or non-fungible tokens (NFTs). [cite_start]The ownership of digital assets is a key concept for analysis.

- **Leaf ID: PROP-006**

  - **Type:** Definition
  - **Content:** An **Encumbrance** is a right or interest in a property held by a person who is not the owner. Examples include liens (a right to keep possession of property belonging to another person until a debt owed by that person is discharged), mortgages, and easements.

- **Leaf ID: PROP-007**
  - **Type:** Rule
  - **Content:** The transfer of ownership for certain types of property, particularly real estate, often requires registration in a public registry to be enforceable against third parties. This public record provides notice of ownership and encumbrances.

---

### **1.3_ObligationAndContract (formation, validity, breach)**

This sub-shard defines the creation and enforcement of legally binding promises. [cite_start]It covers the entire lifecycle of a contract, from its initial formation and the requirements for its validity, to the consequences of its breach. These principles are the foundation of all commercial and transactional activity.

**Example Leaves:**

- **Leaf ID: OBLI-001**

  - **Type:** Definition
  - **Content:** An **Obligation** is a legal bond by which one or more parties (the debtors) are bound to perform a certain act or forbearance for the benefit of one or more other parties (the creditors).

- **Leaf ID: OBLI-002**

  - **Type:** Definition
  - **Content:** A **Contract** is an agreement between two or more parties intended to create a legally enforceable obligation. It is the primary vehicle for voluntary legal commitments.

- **Leaf ID: OBLI-003**

  - **Type:** Principle
  - **Content:** The principle of **Freedom of Contract** establishes that parties are free to enter into contracts and to determine their content, subject to mandatory rules, public policy, and good faith.

- **Leaf ID: OBLI-004**

  - **Type:** Rule (Formation - Offer)
  - **Content:** An **Offer** is a proposal to enter into a contract that is sufficiently definite and indicates the intention of the offeror to be bound in case of acceptance. A proposal addressed to the public is generally considered an invitation to make offers, not an offer itself.

- **Leaf ID: OBLI-005**

  - **Type:** Rule (Formation - Acceptance)
  - **Content:** **Acceptance** is a statement or conduct by the offeree indicating assent to an offer. To be effective, the acceptance must be unequivocal and must typically mirror the terms of the offer without material modification. Silence or inactivity does not in itself amount to acceptance.

- **Leaf ID: OBLI-006**

  - **Type:** Rule (Formation - Consideration/Causa)
  - **Content:** For a contract to be enforceable, it must be supported by **Consideration** (in common law systems), which is a bargained-for exchange of legal value, or have a valid **Causa** (in civil law systems), which is the reason or purpose for the obligation.

- **Leaf ID: OBLI-007**

  - **Type:** Rule (Validity - Consent)
  - **Content:** A contract is valid only if the consent of the parties is freely given. Consent is vitiated by error, fraud, duress, or undue influence, which may render the contract voidable.

- **Leaf ID: OBLI-008**

  - **Type:** Rule (Validity - Lawful Object)
  - **Content:** The object and purpose of a contract must be lawful. A contract whose object or purpose is contrary to mandatory law or public policy is void.

- **Leaf ID: OBLI-009**

  - **Type:** Definition
  - **Content:** A **Breach of Contract** occurs when a party, without lawful excuse, fails or refuses to perform its contractual obligation, performs it defectively, or incapacitates itself from performing it.

- **Leaf ID: OBLI-010**

  - **Type:** Definition
  - **Content:** A **Material Breach** (or fundamental non-performance) is a breach of contract that is so significant it substantially deprives the injured party of what it was entitled to expect under the contract. A material breach typically gives the aggrieved party the right to terminate the contract and claim damages.

- **Leaf ID: OBLI-011**

  - **Type:** Principle
  - **Content:** The principle of **"Pacta Sunt Servanda"** (agreements must be kept) is a foundational concept in contract law. It posits that a contract that is validly formed is binding on the parties and can only be modified or terminated according to its terms or by agreement.

- **Leaf ID: OBLI-012**
  - **Type:** Definition
  - **Content:** **Express Terms** are the terms of an agreement that have been specifically stated and agreed upon by the parties, whether orally or in writing. **Implied Terms** are terms that are not expressly stated but are read into the contract by law or by custom and practice to give it business efficacy.

---

### **1.4_LiabilityAndRemedies (civil, penal, administrative)**

This sub-shard covers the legal consequences that arise from a wrongful act or a breach of a legal duty. [cite_start]It defines the different spheres of liability and the legal means (remedies) available to an aggrieved party to enforce a right or obtain compensation for harm.

**Example Leaves:**

- **Leaf ID: LIAB-001**

  - **Type:** Definition
  - **Content:** **Liability** is the state of being legally responsible for an act, omission, or state of affairs, and for the harm or damages that result from it.

- **Leaf ID: LIAB-002**

  - **Type:** Definition
  - **Content:** **Civil Liability** arises from a breach of a duty owed to a private party (a natural or legal person). Its primary purpose is to compensate the aggrieved party for the harm suffered. [cite_start]It includes contractual liability (from breach of contract) and extra-contractual liability or tort (from a civil wrong, such as negligence or defamation).

- **Leaf ID: LIAB-003**

  - **Type:** Definition
  - **Content:** **Penal (Criminal) Liability** arises from an act or omission that is defined as a crime by statute because it is considered an offense against society as a whole. Its primary purpose is punishment (e.g., fines, imprisonment) and deterrence, and it is prosecuted by the state.

- **Leaf ID: LIAB-004**

  - **Type:** Definition
  - **Content:** **Administrative Liability** arises from the violation of rules and regulations promulgated by a government agency or public body. [cite_start]Its purpose is to ensure compliance with a specific regulatory regime, and its consequences are typically sanctions such as fines, license revocation, or cease-and-desist orders.

- **Leaf ID: LIAB-005**

  - **Type:** Definition
  - **Content:** A **Remedy** is the legal means by which a right is enforced or the violation of a right is prevented, redressed, or compensated. The choice of remedy depends on the nature of the right and the type of liability.

- **Leaf ID: LIAB-006**

  - **Type:** Definition
  - **Content:** **Compensatory Damages** are a monetary remedy intended to place the aggrieved party in the same financial position they would have been in if the breach of duty or contract had not occurred. They must be proven with reasonable certainty.

- **Leaf ID: LIAB-007**

  - **Type:** Definition
  - **Content:** **Specific Performance** is a non-monetary remedy where a court orders a party to perform the specific act they promised in a contract. It is typically granted only when monetary damages are an inadequate remedy, such as in contracts involving unique assets (e.g., real estate, rare art).

- **Leaf ID: LIAB-008**
  - **Type:** Definition
  - **Content:** An **Injunction** is a court order that compels a party to perform a specific act (a mandatory injunction) or restrains a party from performing a specific act (a prohibitory injunction). It is used to prevent ongoing or future harm.

---

### **1.5_PublicLawPowers (licensing, sanctions, oversight)**

[cite_start]This sub-shard defines the legal authority of the state and its designated public bodies (e.g., financial regulators, administrative agencies) to govern the activities of private persons to protect a defined public interest. [cite_start]It covers the three core powers through which a state controls and directs private conduct in regulated sectors: the power to permit (licensing), the power to punish (sanctions), and the power to supervise (oversight).

**Example Leaves:**

- **Leaf ID: PUBLAW-001**

  - **Type:** Principle
  - **Content:** The **Principle of Legality in Administration** dictates that public bodies and administrative agencies may only act within the powers expressly or implicitly granted to them by law. Any action taken outside this scope (ultra vires) is invalid.

- **Leaf ID: PUBLAW-002**

  - **Type:** Definition
  - **Content:** **Licensing (or Permitting) Power** is the authority of the state to require a private person (natural or legal) to obtain a prior authorization or license before engaging in a specific, regulated activity. This power is used to ensure that participants in sensitive industries meet minimum standards of competence, integrity, and financial soundness.

- **Leaf ID: PUBLAW-003**

  - **Type:** Rule
  - **Content:** A public body's decision to grant, deny, suspend, or revoke a license must be based on objective, pre-established criteria set forth in the law. The decision must be reasoned, non-discriminatory, and subject to judicial review.

- **Leaf ID: PUBLAW-004**

  - **Type:** Definition
  - **Content:** **Oversight (or Supervisory) Power** is the ongoing authority of a regulator to monitor the activities of licensed entities to ensure continuous compliance with the applicable legal and regulatory framework. It is a proactive power designed to prevent harm and maintain market stability.

- **Leaf ID: PUBLAW-005**

  - **Type:** Rule
  - **Content:** Supervisory power typically includes the authority to conduct on-site inspections, carry out investigations, and compel the production of information, documents, and testimony from the supervised entity and its personnel.

- **Leaf ID: PUBLAW-006**

  - **Type:** Definition
  - **Content:** **Sanctioning Power** is the authority of a public body to impose a penalty or coercive measure on a person found to have violated a law or regulation. The purpose of sanctions can be punitive, corrective, or deterrent.

- **Leaf ID: PUBLAW-007**

  - **Type:** Definition
  - **Content:** A **Monetary Penalty (Fine)** is a sanction consisting of a specific sum of money that the infringing party must pay to the state. The amount of the fine is often determined based on the gravity of the offense, the harm caused, and the financial capacity of the offender.

- **Leaf ID: PUBLAW-008**
  - \*_Type:_
- Definition

  - **Content:** A **Cease and Desist Order** is a sanction that commands a party to immediately halt an illegal or non-compliant activity. Violation of such an order typically leads to more severe penalties.

- **Leaf ID: PUBLAW-009**

  - **Type:** Definition
  - **Content:** **License Revocation** is one of the most severe administrative sanctions, whereby a regulator permanently withdraws the authorization for an entity to operate in a regulated market. It is typically reserved for the most serious violations.

- **Leaf ID: PUBLAW-010**

  - **Type:** Principle
  - **Content:** The **Principle of Proportionality** requires that any administrative action, particularly a sanction, must be proportionate to the objective it seeks to achieve. A sanction should not be excessive in relation to the gravity of the infringement.

- **Leaf ID: PUBLAW-011**

  - **Type:** Principle
  - **Content:** The **Right to Administrative Review** ensures that a person adversely affected by an administrative decision (e.g., the denial of a license or the imposition of a fine) has the right to have that decision reviewed by an independent and impartial body, typically a specialized tribunal or a court of law. This is a key component of administrative due process.

- **Leaf ID: PUBLAW-012**
  - **Type:** Definition
  - **Content:** **Rulemaking Power** is the authority delegated to an administrative agency to create, modify, or repeal detailed regulations (secondary legislation) that have the force of law. These rules serve to implement the broader mandates of a primary statute.

# Layer 2: Domain-Specific Regulation

---

### **2.1_FinancialMarkets**

[cite_start]This sub-shard is a critical component of Layer 2, designed to organize and store information related to the regulation of financial markets. [cite_start]It serves as the primary entry point for financial law within the memory's structure, allowing the agent to access specialized knowledge after processing the universal legal concepts from Layers 0 and 1. [cite_start]Its purpose is to contain a granular breakdown of financial instruments, services, and market structures to support detailed, context-aware analysis.

---

#### **2.1.a_InstrumentsTaxonomy**

[cite_start]This sub-shard contains a comprehensive inventory of financial instruments, acting as a "technical dictionary" for the agent. [cite_start]It is designed to house approximately 300 distinct "leaves," ranging from classical securities to the full spectrum of crypto-assets, enabling precise classification of any asset under analysis.

**_Classical Financial Instruments_**

- **Leaf ID: INST-001**

  - **Type:** Definition
  - **Content:** An **Equity Instrument** represents a residual interest in the assets of an entity after deducting all its liabilities. It typically conveys ownership rights, such as the right to vote and receive dividends. Example: Common Stock.

- **Leaf ID: INST-002**

  - **Type:** Definition
  - **Content:** A **Debt Instrument** represents a contractual obligation for one party (the issuer) to repay a sum of money to another party (the holder) over a specified period, typically with interest. Example: Bonds, Notes, Debentures.

- **Leaf ID: INST-003**
  - **Type:** Definition
  - **Content:** A **Derivative Instrument** is a financial contract whose value is derived from an underlying asset, index, or rate. It allows parties to speculate on or hedge against the future price movements of the underlying. Examples: Options, Futures, Swaps.

**_Crypto-Asset Instruments_**

- **Leaf ID: INST-004**

  - **Type:** Definition
  - **Content:** A **Crypto-Asset** is a digital representation of value or rights which may be transferred and stored electronically, using distributed ledger technology (DLT) or similar technology. This is a broad, technologically neutral category.

- **Leaf ID: INST-005**

  - **Type:** Definition
  - **Content:** A **Utility Token** is a type of crypto-asset intended to provide digital access to an application or service, exclusively through a DLT platform. Its primary purpose is to be consumed or used for a specific function within the issuing ecosystem, not as a financial investment.

- **Leaf ID: INST-006**

  - **Type:** Definition
  - **Content:** A **Security Token** (or Asset-Token) is a type of crypto-asset that qualifies as a financial instrument or security under existing financial regulation. It represents traditional asset rights, such as ownership in an entity (equity), a debt owed by an issuer (debt), or a share in future profits. Its classification often depends on passing a legal test like the Howey Test.

- **Leaf ID: INST-007**

  - **Type:** Definition
  - **Content:** A **Payment Token** (or Cryptocurrency) is a type of crypto-asset whose primary purpose is to act as a medium of exchange, a unit of account, or a store of value. It is not issued or guaranteed by a central bank or public authority. Example: Bitcoin (BTC), Ether (ETH).

- **Leaf ID: INST-008**

  - **Type:** Definition
  - **Content:** An **Asset-Referenced Token (ART)** is a type of crypto-asset that purports to maintain a stable value by referencing the value of several fiat currencies, one or several commodities, one or several other crypto-assets, or a basket of such assets. This category is specifically defined under the EU's MiCA regulation.

- **Leaf ID: INST-009**

  - **Type:** Definition
  - **Content:** An **E-Money Token (EMT)** is a type of crypto-asset that purports to maintain a stable value by referencing the value of only one official fiat currency. This category is specifically defined under the EU's MiCA regulation and is distinct from ARTs.

- **Leaf ID: INST-010**

  - **Type:** Definition
  - **Content:** A **Non-Fungible Token (NFT)** is a type of crypto-asset on a distributed ledger that represents a unique item or asset, whether digital or physical. Each NFT has distinct identification codes and metadata that distinguish it from any other token, making it non-interchangeable.

- **Leaf ID: INST-011**

  - **Type:** Definition
  - **Content:** A **Governance Token** is a type of utility token that grants holders the right to participate in the governance of a decentralized protocol or application. These rights typically include proposing and/or voting on changes to the system's rules, parameters, or treasury management.

- **Leaf ID: INST-012**

  - **Type:** Definition
  - **Content:** A **Liquid Staking Token (LST)**, also known as a Liquid Staking Derivative (LSD), is a token that represents a user's staked assets in a Proof-of-Stake (PoS) network. The LST is a tradable, liquid asset that can be used in other DeFi applications while the underlying assets remain staked and continue to earn rewards.

- **Leaf ID: INST-013**
  - **Type:** Definition
  - **Content:** An **Algorithmic Stablecoin** is a type of crypto-asset that aims to maintain a stable value through algorithmic mechanisms rather than direct collateralization. It typically uses a system of smart contracts to automatically expand or contract the token supply in response to price changes, often in conjunction with a separate, volatile crypto-asset.

---

#### **2.1.b_ServicesTaxonomy**

[cite_start]This sub-shard covers regulated or registrable services related to the issuance, custody, exchange, or advisory of financial instruments, including crypto-assets. [cite_start]It is designed to contain approximately 250 leaves detailing the full spectrum of financial services, from core functions like Custody to emerging models like Compliance-as-a-Service.

##### **_Custody Services_**

- **Leaf ID: SERV-001**

  - **Type:** Definition
  - **Content:** **Custody of Financial Instruments** is the service of safekeeping and administering financial instruments for the account of clients. This includes holding assets, settling transactions, and managing associated rights (e.g., dividends, voting).

- **Leaf ID: SERV-002**

  - **Type:** Definition
  - **Content:** **Digital Asset Custody** is a specialized form of custody that involves the safekeeping of crypto-assets. The core function is the secure management of cryptographic private keys, which are necessary to authorize transactions and prove ownership of the assets on the distributed ledger.

- **Leaf ID: SERV-003**

  - **Type:** Definition
  - **Content:** **Segregated Custody** is a model where a client's assets are held in a unique, separate account (or wallet address, in the case of crypto-assets) that is exclusively for that client. The assets are not commingled with the assets of other clients or the custodian itself.

- **Leaf ID: SERV-004**
  - **Type:** Definition
  - **Content:** **Omnibus Custody** is a model where a custodian holds the assets of multiple clients together in a single, commingled account. [cite_start]The custodian maintains internal records to track the ownership entitlements of each individual client within the omnibus account.

---

##### **_Trading Execution Services_**

- **Leaf ID: SERV-005**

  - **Type:** Definition
  - **Content:** **Trading Execution** refers to the service of accepting and transmitting orders for financial instruments on behalf of clients, or executing such orders directly. [cite_start]This includes services provided by alternative trading systems (ATS), matching engines, and order routers.

- **Leaf ID: SERV-006**
  - **Type:** Definition
  - **Content:** An **Alternative Trading System (ATS)** is a non-exchange trading venue that matches the buy and sell orders of its participants. [cite_start]They are typically regulated as broker-dealers rather than as national securities exchanges.

---

##### **_Platform Financing & Brokerage_**

- **Leaf ID: SERV-007**

  - **Type:** Definition
  - [cite_start]**Content:** **Platform Financing** encompasses services where a platform facilitates capital raising for projects, including crowdfunding models. This service connects issuers with investors through a centralized digital venue.

- **Leaf ID: SERV-008**
  - **Type:** Definition
  - **Content:** **Brokerage Intermediation** is the service of acting as an intermediary between a buyer and a seller in a financial transaction in return for a commission or fee. [cite_start]A broker for crypto-assets connects buyers and sellers of those assets.

---

##### **_Advisory and Support Services_**

- **Leaf ID: SERV-009**

  - **Type:** Definition
  - [cite_start]**Content:** **Investment Advisory** is the service of providing personalized recommendations or advice to clients regarding investment in financial instruments, including crypto-assets. This service typically requires registration and adherence to fiduciary duties.

- **Leaf ID: SERV-010**

  - **Type:** Definition
  - **Content:** **Market Making / Liquidity Provision** is the service of actively quoting both a bid and an ask price for a financial instrument, seeking to profit from the bid-ask spread. [cite_start]This activity provides liquidity to the market, making it easier for other participants to trade.

- **Leaf ID: SERV-011**

  - **Type:** Definition
  - **Content:** **Token Issuance / Origination** is the service of assisting an entity in creating and launching a new financial instrument, particularly a crypto-asset. [cite_start]This can include technical, legal, and marketing support for security, utility, or stablecoin offerings.

- **Leaf ID: SERV-012**

  - **Type:** Definition
  - [cite_start]**Content:** **Compliance as a Service (CaaS)** refers to services where a third-party provider offers technology and operational support to help financial entities meet their regulatory obligations, such as AML/KYC checks, Travel Rule compliance, and regulatory reporting.

- **Leaf ID: SERV-013**
  - **Type:** Definition
  - **Content:** **Data Services / Market Intel** is the service of providing curated financial data, market analysis, and intelligence to traders and investors. [cite_start]This can include on-chain data analytics, sentiment analysis, and research reports.

---

##### **_Post-Trade Services_**

- **Leaf ID: SERV-014**
  - **Type:** Definition
  - **Content:** **Settlement and Clearing** are post-trade services. **Clearing** involves calculating the mutual obligations of counterparties for the exchange of funds and instruments. [cite_start]**Settlement** is the final step where the instruments and funds are officially transferred, and the transaction is considered complete.

---

#### **2.1.c_MarketInfrastructure**

[cite_start]This sub-shard encompasses regulations and principles related to the underlying systems, processes, and entities that form the backbone of modern financial markets.

- **Leaf ID: INFRA-001**

  - **Type:** Definition
  - **Content:** **Financial Market Infrastructure (FMI)** is a multilateral system among participating institutions, including the operator of the system, used for the purposes of clearing, settling, or recording payments, securities, derivatives, or other financial transactions.

- **Leaf ID: INFRA-002**

  - **Type:** Definition
  - **Content:** A **Central Counterparty (CCP)** is an entity that interposes itself between the counterparties to contracts traded in one or more financial markets, becoming the buyer to every seller and the seller to every buyer. Its main purpose is to manage counterparty credit risk.

- **Leaf ID: INFRA-003**
  - **Type:** Definition
  - **Content:** A **Central Securities Depository (CSD)** is an entity that provides a central point for holding and settling securities. It enables securities transactions to be processed by book entry, increasing the efficiency and safety of the market.

---

#### **2.1.d_ContinuumOfOffer**

This sub-shard defines the regulatory gradient for offers of financial instruments. [cite_start]It is crucial for applying the principle of regulatory proportionality, where the level of required disclosure and compliance increases with the public nature of the offer. [cite_start]It covers the full spectrum from registered public offers to private placements and safe harbors like reverse solicitation.

- **Leaf ID: OFFER-001**

  - **Type:** Principle
  - **Content:** The **Principle of Regulatory Proportionality** in offerings dictates that regulatory requirements (e.g., disclosure, registration) should be proportional to the risks posed to the public. The more public and widespread an offer, the more stringent the requirements.

- **Leaf ID: OFFER-002**

  - **Type:** Definition
  - **Content:** A **Public Offer** is a communication to the public in any form and by any means, presenting sufficient information on the terms of the offer and the securities to be offered, so as to enable an investor to decide to purchase or subscribe to these securities. [cite_start]This is a key concept in regulations like the Chilean LMV.

- **Leaf ID: OFFER-003**

  - **Type:** Definition
  - **Content:** A **Private Offer** (or Private Placement) is an offer of securities made to a limited number of pre-selected investors and not to the general public. Private offers are typically subject to fewer disclosure requirements than public offers.

- **Leaf ID: OFFER-004**

  - **Type:** Definition
  - **Content:** **Reverse Solicitation** is a safe harbor principle where a transaction is initiated at the exclusive request of the client. Under this principle, a service provider may not be subject to local licensing requirements if they did not actively market their services in the client's jurisdiction.

- **Leaf ID: OFFER-005**
  - **Type:** Rule (Jurisdictional Example)
  - [cite_start]**Content:** In Chile, an exemption for public offer registration exists for certain crowdfunding platforms under the Fintech Law (Law 21.521), provided the total amount raised does not exceed 100,000 UF per year per project.

---

### **2.2_PaymentsAndMoney**

[cite_start]This sub-shard serves as a critical repository for the foundational and technical aspects of payment systems, the definition of money, and the intersection of these concepts with digital innovations. [cite_start]It is designed to define the "money rails" and their technical regulation, ensuring the agent understands the mechanisms underlying financial transactions beyond just traditional securities markets. [cite_start]This memory bridges the knowledge gap between traditional fintech and crypto assets, preventing a "siloed" understanding of how value is transferred.

---

#### **_Traditional Payment Infrastructure_**

[cite_start]This section covers the core processes and technical standards of conventional payment systems.

- **Leaf ID: PAY-001**

  - **Type:** Definition
  - **Content:** **Clearing** is the process of transmitting, reconciling, and, in some cases, confirming payment orders prior to settlement. It includes the netting of transactions and the establishment of final positions for settlement.

- **Leaf ID: PAY-002**

  - **Type:** Definition
  - **Content:** **Settlement** is the act of discharging obligations by transferring funds and/or financial instruments between two or more parties. [cite_start]**Settlement Timing** refers to the interval between a trade and its settlement, commonly denoted as T+0 (same day), T+1 (next business day), or T+2.

- **Leaf ID: PAY-003**

  - **Type:** Definition
  - **Content:** A **Real-Time Gross Settlement (RTGS)** system is a funds transfer system where the transfer of money or securities takes place from one bank to another on a "real-time" and on a "gross" basis. Settlement in "real-time" means the payment transaction is not subjected to any waiting period. "Gross settlement" means the transaction is settled on a one-to-one basis without bundling or netting with any other transaction.

- **Leaf ID: PAY-004**

  - **Type:** Standard
  - **Content:** **ISO 20022** is an international standard for exchanging electronic messages between financial institutions. [cite_start]It provides a common language and model for payment data across the globe, designed to be richer and more structured than legacy formats.

- **Leaf ID: PAY-005**

  - **Type:** Standard
  - **Content:** **SWIFT (Society for Worldwide Interbank Financial Telecommunication)** is a global member-owned cooperative that provides secure financial messaging services. It is the primary infrastructure for corresponding banks to communicate instructions for international wire transfers.

- **Leaf ID: PAY-006**
  - **Type:** Standard
  - [cite_start]**Content:** **PCI DSS (Payment Card Industry Data Security Standard)** is a set of security standards designed to ensure that all companies that accept, process, store, or transmit credit card information maintain a secure environment[cite: 7].

---

#### **_Digital & Crypto Payment Innovations_**

[cite_start]This section defines the connection between traditional fintech rails and innovations in crypto-assets, particularly stablecoins and the tokenization of payment instruments.

- **Leaf ID: PAY-007**

  - **Type:** Principle
  - **Content:** **Stablecoins as a Payment Means:** Crypto-assets that purport to maintain a stable value, such as E-Money Tokens (EMTs) and Asset-Referenced Tokens (ARTs) under MiCA, can function as a means of payment. Their regulation often involves a dual analysis under both crypto-asset frameworks and payment services directives.

- **Leaf ID: PAY-008**

  - **Type:** Definition
  - **Content:** **Tokenization of Payment Instruments** refers to the process of creating a digital representation (a token) of a traditional payment instrument, such as e-money, on a distributed ledger. This allows the instrument to be transferred, cleared, and settled on a blockchain infrastructure.

- **Leaf ID: PAY-009**

  - **Type:** Definition
  - **Content:** A **Central Bank Digital Currency (CBDC)** is a digital form of a country's fiat currency that is a direct liability of the central bank. It can be designed for retail use (by the general public) or wholesale use (by financial institutions).

- **Leaf ID: PAY-010**

  - **Type:** Definition
  - **Content:** A **Payment Initiation Service Provider (PISP)** is an entity, defined under regulations like the EU's PSD2, that initiates a payment order at the request of the user from a payment account held at another payment service provider. This enables "open banking" payment flows.

- **Leaf ID: PAY-011**
  - **Type:** Definition
  - **Content:** An **Account Information Service Provider (AISP)** is an entity that provides users with a consolidated online view of their payment accounts held with one or more other payment service providers. It is a "read-only" service foundational to open banking.

---

#### **_Key Payment Service Regulations (Cross-Border)_**

This section contains principles from major international payment regulations to provide a necessary cross-border comparative perspective beyond any single jurisdiction.

- **Leaf ID: PAY-012**

  - **Type:** Framework
  - **Content:** **EU - PSD2/PSR (Payment Services Directive 2 / Payment Services Regulation):** This European Union regulatory framework governs payment services and payment service providers. Its key objectives are to increase competition, improve security through Strong Customer Authentication (SCA), and foster innovation through "open banking" by standardizing the roles of PISPs and AISPs.

- **Leaf ID: PAY-013**

  - **Type:** Framework
  - **Content:** **US - Regulation E (Reg E):** This U.S. federal regulation, issued by the Consumer Financial Protection Bureau (CFPB), establishes the rights, liabilities, and responsibilities of parties in electronic fund transfers (EFTs). It focuses heavily on consumer protection, requiring disclosures, error resolution procedures, and limiting consumer liability for unauthorized transfers.

- **Leaf ID: PAY-014**
  - **Type:** Framework
  - **Content:** **UK - Faster Payments Service:** This is a United Kingdom banking initiative that has created a near real-time payment infrastructure. It enables telephone, internet, and mobile payments to move between customer accounts at different financial institutions within seconds, 24/7. It serves as a key international example of a successful real-time retail payment system.

---

#### **_Definitions of Money and Value Transfer_**

- **Leaf ID: PAY-015**

  - **Type:** Definition
  - **Content:** **Money** is an economic unit that functions as a generally recognized medium of exchange for transactional purposes in an economy. To be considered money, an asset should fulfill three functions: (1) a medium of exchange, (2) a unit of account, and (3) a store of value.

- **Leaf ID: PAY-016**

  - **Type:** Definition
  - **Content:** **Fiat Currency** is a government-issued currency that is not backed by a physical commodity, such as gold or silver, but rather by the government that issued it. Its value is derived from the trust in and stability of the issuing government.

- **Leaf ID: PAY-P017**
  - **Type:** Definition
  - **Content:** **Electronic Money (E-Money)** is a digital equivalent of cash stored on an electronic device or remotely at a server. It is electronically stored monetary value as represented by a claim on the issuer which is issued on receipt of funds for the purpose of making payment transactions.

---

### **2.3_DataProtection_Privacy**

[cite_start]This sub-shard is a designated category within the `2_DomainSpecific_Regulation` layer, intended to house all legal information pertaining to data protection and privacy. [cite_start]Its placement in the hierarchical tree allows the agent to access this specialized knowledge after establishing the universal legal foundations from Layers 0 and 1. [cite_start]While the sources confirm its structural position, they do not elaborate on its specific content, defining it as a skeletal placeholder in the current architecture. This initial version, therefore, populates the shard with foundational, globally-recognized principles of data privacy.

---

#### **_Core Principles of Data Protection_**

- **Leaf ID: DPROT-001**

  - **Type:** Definition
  - **Content:** **Personal Data** is any information that relates to an identified or identifiable natural person (the "data subject"). An identifiable person is one who can be identified, directly or indirectly, in particular by reference to an identifier such as a name, an identification number, location data, an online identifier (e.g., IP address), or to one or more factors specific to their physical, physiological, genetic, mental, economic, cultural, or social identity.

- **Leaf ID: DPROT-002**

  - **Type:** Definition
  - **Content:** **Data Processing** refers to any operation or set of operations performed on personal data, whether or not by automated means. This includes collection, recording, organization, structuring, storage, adaptation, retrieval, consultation, use, disclosure by transmission, dissemination, or otherwise making available, alignment, combination, restriction, erasure, or destruction of data.

- **Leaf ID: DPROT-003**

  - **Type:** Principle
  - **Content:** **Lawfulness, Fairness, and Transparency:** Personal data must be processed lawfully, fairly, and in a transparent manner in relation to the data subject. Data subjects should be clearly informed about the processing of their data.

- **Leaf ID: DPROT-004**

  - **Type:** Principle
  - **Content:** **Purpose Limitation:** Personal data must be collected for specified, explicit, and legitimate purposes and not further processed in a manner that is incompatible with those purposes.

- **Leaf ID: DPROT-005**

  - **Type:** Principle
  - **Content:** **Data Minimization:** The processing of personal data must be adequate, relevant, and limited to what is necessary in relation to the purposes for which it is processed. An organization should only collect the data it absolutely needs.

- **Leaf ID: DPROT-006**

  - **Type:** Principle
  - **Content:** **Accuracy:** Personal data must be accurate and, where necessary, kept up to date. Every reasonable step must be taken to ensure that personal data that are inaccurate, having regard to the purposes for which they are processed, are erased or rectified without delay.

- **Leaf ID: DPROT-007**

  - **Type:** Principle
  - **Content:** **Storage Limitation:** Personal data must be kept in a form which permits identification of data subjects for no longer than is necessary for the purposes for which the personal data are processed.

- **Leaf ID: DPROT-008**

  - **Type:** Principle
  - **Content:** **Integrity and Confidentiality:** Personal data must be processed in a manner that ensures appropriate security, including protection against unauthorized or unlawful processing and against accidental loss, destruction, or damage, using appropriate technical or organizational measures.

- **Leaf ID: DPROT-009**
  - **Type:** Definition
  - **Content:** A **Data Controller** is the natural or legal person, public authority, agency, or other body which, alone or jointly with others, determines the purposes and means of the processing of personal data. A **Data Processor** is a natural or legal person which processes personal data on behalf of the controller.

---

### **2.4_Taxation**

[cite_start]This sub-shard is a key component of `2_DomainSpecific_Regulation`, designed to house specific tax and accounting rules relevant to the financial and crypto domains. [cite_start]Its position within the third layer of the memory structure allows the agent to provide advice on the fiscal and accounting implications of financial activities, building upon the universal legal principles from Layers 0 and 1. [cite_start]The content is organized to reflect both general principles and specific, country-level applications, as suggested by the source documents.

---

#### **_Core Principles of Taxation_**

- **Leaf ID: TAX-001**

  - **Type:** Definition
  - **Content:** A **Taxable Event** is an action or transaction that triggers a tax liability. The law specifies which events are taxable. Common examples include earning income, selling an asset for a profit, or purchasing goods and services.

- **Leaf ID: TAX-002**

  - **Type:** Definition
  - **Content:** **Income** is a flow of economic value received by a person, typically from labor (wages), business activities (profits), or investments (interest, dividends). **Capital Gain** is the profit realized from the sale of a capital asset, calculated as the difference between the selling price and the original purchase price (cost basis). These two types of gains are often taxed at different rates.

- **Leaf ID: TAX-003**

  - **Type:** Principle
  - **Content:** **Tax Jurisdiction** is the authority of a government to impose and collect taxes. This authority is typically based on the tax residency of the person or entity, the source of the income, or the location where the economic activity occurs.

- **Leaf ID: TAX-004**
  - **Type:** Principle
  - **Content:** The principle of **Substance Over Form** dictates that tax authorities may assess the tax liability of a transaction based on its economic reality and underlying purpose, rather than its formal legal structure. This is used to prevent tax avoidance through artificial arrangements.

---

#### **_Core Principles of Financial Accounting_**

- **Leaf ID: TAX-005**

  - **Type:** Definition
  - **Content:** **Accounting Standards** are a common set of principles, standards, and procedures that define the basis of financial accounting policies and practices. Their purpose is to ensure that financial statements are consistent, comparable, transparent, and accurate.

- **Leaf ID: TAX-006**

  - **Type:** Framework
  - [cite_start]**Content:** The **International Financial Reporting Standards (IFRS)** are a set of accounting standards developed by the International Accounting Standards Board (IASB) that is becoming the global standard for the preparation of public company financial statements[cite: 4].

- **Leaf ID: TAX-007**

  - **Type:** Framework
  - **Content:** The **Generally Accepted Accounting Principles (GAAP)** refer to a common set of accounting standards used for financial reporting, particularly in the United States (US GAAP). A comparative analysis between IFRS and US GAAP is often necessary for multinational entities.

- **Leaf ID: TAX-008**
  - **Type:** Rule
  - **Content:** **Accounting for Intangible Assets:** Under many accounting standards, an intangible asset is an identifiable non-monetary asset without physical substance. The accounting treatment (e.g., capitalization, amortization) depends on its specific nature and whether it was acquired or internally generated. [cite_start]Local norms, such as Chile's NIC 38, provide specific guidance.

---

#### **_Taxation & Accounting of Digital Assets_**

- **Leaf ID: TAX-009**

  - **Type:** Principle
  - **Content:** For tax purposes, most jurisdictions treat crypto-assets as a form of **property or intangible asset**, not as currency. Consequently, principles of capital gains taxation apply upon their disposal.

- **Leaf ID: TAX-010**

  - **Type:** Rule (Taxable Event)
  - **Content:** The exchange of a crypto-asset for fiat currency is a taxable event. The capital gain or loss is calculated as the difference between the fair market value of the fiat currency received and the cost basis of the crypto-asset sold.

- **Leaf ID: TAX-011**

  - **Type:** Rule (Taxable Event)
  - **Content:** The exchange of one crypto-asset for another crypto-asset is generally considered a disposal of the first asset and a taxable event. The capital gain is calculated based on the fair market value of the new asset received at the time of the trade.

- **Leaf ID: TAX-012**

  - **Type:** Rule (Taxable Event)
  - **Content:** Receiving crypto-assets from activities such as airdrops, staking rewards, or liquidity mining rewards is often treated as ordinary income. The value of the income is the fair market value of the crypto-assets at the time they are received.

- **Leaf ID: TAX-013**

  - **Type:** Rule (Jurisdictional Example)
  - [cite_start]**Content:** In **Chile**, tax authorities have established that the price difference or "mayor valor" generated from the sale of digital assets is subject to taxation as per the general income tax rules.

- **Leaf ID: TAX-014**

  - **Type:** Rule
  - **Content:** **Accounting for Crypto-Assets:** Under IFRS, an entity's holdings of crypto-assets may be accounted for as intangible assets (in line with IAS 38) or as inventory, depending on the entity's business model and the purpose for holding the assets.

- **Leaf ID: TAX-015**
  - **Type:** Principle (Structural)
  - **Content:** To provide clear and organized guidance, tax information within this memory should be structured using a **"country-tax-event" mapping table**. [cite_start]This allows for the precise retrieval of the tax consequences for a specific event (e.g., "staking reward") within a specific country (e.g., "USA").

---

### **2.5_AML_CFT (Anti-Money Laundering & Combating the Financing of Terrorism)**

This sub-shard is a foundational repository for regulations concerning Anti-Money Laundering and Combating the Financing of Terrorism. [cite_start]Its principles are categorized as "cross-cutting obligations," reflecting their horizontal and pervasive nature across nearly all financial activities and client scenarios. [cite_start]Due to its critical importance for operational legality, this shard has been prioritized for deep research across multiple key jurisdictions. [cite_start]Its content is essential for providing detailed, cross-jurisdictional advice on the compliance obligations that apply to the spectrum of financial and crypto-asset services.

---

#### **_Core Principles of AML/CFT_**

- **Leaf ID: AML-001**

  - **Type:** Definition
  - **Content:** **Money Laundering** is the process of illegally concealing the origin of money obtained from criminal activity. It typically involves three stages: (1) **Placement**, where illicit funds are introduced into the financial system; (2) **Layering**, where the funds are moved through complex transactions to obscure their source; and (3) **Integration**, where the "cleaned" funds are reintegrated into the legitimate economy.

- **Leaf ID: AML-002**

  - **Type:** Definition
  - **Content:** **Terrorism Financing** is the provision or collection of funds, by any means, directly or indirectly, with the intention that they should be used or in the knowledge that they are to be used, in whole or in part, in order to carry out any of a wide range of terrorist acts.

- **Leaf ID: AML-003**

  - **Type:** Principle
  - **Content:** The **Risk-Based Approach (RBA)** is the cornerstone of modern AML/CFT frameworks. It requires that entities identify, assess, and understand their specific money laundering and terrorism financing risks, and then apply mitigation measures that are commensurate with those risks. This allows for the efficient allocation of compliance resources.

- **Leaf ID: AML-004**
  - **Type:** Definition
  - **Content:** A **Virtual Asset Service Provider (VASP)**, as defined by the FATF, is any natural or legal person who conducts one or more of the following activities or operations for or on behalf of another person: (i) exchange between virtual assets and fiat currencies; (ii) exchange between one or more forms of virtual assets; (iii) transfer of virtual assets; (iv) safekeeping and/or administration of virtual assets or instruments enabling control over virtual assets; and (v) participation in and provision of financial services related to an issuer’s offer and/or sale of a virtual asset.

---

#### **_The FATF Standards & Recommendations_**

- **Leaf ID: AML-005**

  - **Type:** Definition
  - [cite_start]**Content:** The **Financial Action Task Force (FATF)**, or GAFI, is an inter-governmental body that sets international standards to prevent global money laundering and terrorist financing[cite: 4, 5]. Its recommendations are recognized as the global AML/CFT standard, and jurisdictions are regularly assessed for their level of compliance.

- **Leaf ID: AML-006**

  - **Type:** Rule
  - **Content:** **FATF Recommendation 15 (New Technologies):** This recommendation requires countries and financial institutions to identify and assess the money laundering or terrorist financing risks that may arise in relation to the development of new products and new business practices, including new delivery mechanisms, and the use of new or developing technologies. It is the basis for regulating VASPs.

- **Leaf ID: AML-007**
  - **Type:** Rule
  - [cite_start]**Content:** **FATF Recommendation 16 (The "Travel Rule"):** This rule requires that VASPs and other financial institutions obtain, hold, and transmit required originator and beneficiary information associated with virtual asset transfers. The purpose is to ensure that competent authorities can trace illicit funds and conduct investigations. [cite_start]This obligation applies to transfers at or above a specific threshold (e.g., 1,000 USD/EUR).

---

#### **_Key Operational Obligations for VASPs_**

- **Leaf ID: AML-008**

  - **Type:** Definition
  - **Content:** **Customer Due Diligence (CDD)** is the set of processes that a VASP must conduct to identify and verify the identity of its customers. It is the foundation of any AML/CFT program and is a prerequisite for providing services.

- **Leaf ID: AML-009**

  - **Type:** Definition
  - **Content:** **Know Your Customer (KYC)** are the operational procedures used to implement CDD. This includes collecting identification documents, verifying information against reliable sources, and understanding the nature of the customer's intended activities. [cite_start]A "KYC/AML matrix" is often used to structure these requirements.

- **Leaf ID: AML-010**

  - **Type:** Definition
  - **Content:** **Enhanced Due Diligence (EDD)** is a set of more stringent verification and monitoring measures that must be applied to customers and transactions that are identified as high-risk. This includes, for example, Politically Exposed Persons (PEPs).

- **Leaf ID: AML-011**

  - **Type:** Definition
  - **Content:** **Transaction Monitoring** is the ongoing process of scrutinizing customer transactions in real-time or retrospectively to detect activity that is unusual, inconsistent with the customer's known profile, or potentially suspicious.

- **Leaf ID: AML-012**

  - **Type:** Definition
  - **Content:** A **Suspicious Activity Report (SAR)** or Suspicious Transaction Report (STR) is a mandatory report that a VASP must file with the relevant national Financial Intelligence Unit (FIU) when it knows, suspects, or has reason to suspect that a transaction involves funds derived from illegal activity or is intended to finance terrorism.

- **Leaf ID: AML-013**
  - **Type:** Definition
  - **Content:** **Record-Keeping:** VASPs are required to maintain all necessary records on transactions and customer identification for a prescribed period (typically at least five years), so that they are available to assist competent authorities in their investigations.

---

#### **_Integration with Financial Services_**

- **Leaf ID: AML-014**

  - **Type:** Rule
  - **Content:** **AML in Custody Services:** Providers of custody services for financial instruments, including crypto-assets, must perform CDD on their clients. [cite_start]They must also have systems in place to ensure compliance with obligations like the Travel Rule for crypto withdrawals and to monitor for suspicious deposit and withdrawal patterns.

- **Leaf ID: AML-015**

  - **Type:** Rule
  - **Content:** **AML in Trading Services:** Exchanges and other trading platforms must implement transaction monitoring systems to detect and report suspicious trading activity, such as attempts to manipulate markets or launder funds through rapid, complex trades.

- **Leaf ID: AML-016**
  - **Type:** Definition
  - **Content:** **Compliance-as-a-Service (CaaS):** This is a specialized service where a third-party provider offers technology solutions to help other VASPs meet their regulatory obligations. [cite_start]This explicitly includes services for third-party AML/KYC, Travel Rule compliance, and regulatory reporting technology.

# Layer 3: Cross-Cutting Obligations

[cite_start]This layer of the semantic memory groups horizontal obligations that are applicable across the various specific domains defined in Layer 2. [cite_start]These principles represent the "rules of the operational game," ensuring that entities adhere to fundamental standards of transparency, financial soundness, good governance, client protection, and operational resilience, regardless of their specific market activity.

---

### **3.1_Disclosure_Transparency**

[cite_start]This sub-shard covers the fundamental obligation for entities to provide clear, accurate, timely, and not misleading information to clients, potential investors, and regulators. Transparency is a cornerstone of market fairness and investor protection.

**Example Leaves:**

- **Leaf ID: DISC-001**

  - **Type:** Principle
  - **Content:** The **Principle of Full and Fair Disclosure** requires that an entity provides all necessary information that a reasonable person would need to make an informed decision regarding an investment, product, or service. Omissions of critical information are considered a breach of this principle.

- **Leaf ID: DISC-002**

  - **Type:** Definition
  - **Content:** **Material Information** is any information for which there is a substantial likelihood that a reasonable investor would consider it important in making an investment decision. This includes information that could significantly alter the total mix of information available.

- **Leaf ID: DISC-003**

  - **Type:** Rule
  - **Content:** **Disclosure of Risk Factors:** An entity offering a financial product or service must clearly, concisely, and prominently disclose all material risks associated with it. Risks should be specific to the product or service, not generic, and should be explained in plain language.

- **Leaf ID: DISC-004**

  - **Type:** Rule
  - **Content:** **Whitepaper Disclosure for Crypto-Assets:** A whitepaper for a crypto-asset offering must contain, at a minimum, detailed information about the project, the rights and obligations attached to the asset, the underlying technology, the project's governance model, and the principal risk factors.

- **Leaf ID: DISC-005**

  - **Type:** Rule
  - **Content:** **Transparency of Fees and Costs:** All fees, charges, and costs associated with a financial service must be disclosed to the client before the service is provided. This includes direct fees as well as any indirect costs or spreads that may apply. There should be no hidden fees.

- **Leaf ID: DISC-006**

  - **Type:** Rule
  - **Content:** **Transparency of Conflicts of Interest:** An entity must establish procedures to identify and manage potential conflicts of interest. Any material conflict of interest that cannot be effectively managed must be disclosed to the client.

- **Leaf ID: DISC-007**
  - **Type:** Rule
  - **Content:** **Public Disclosure of Material Events:** A publicly-listed entity or an issuer of widely-held instruments has an ongoing obligation to disclose any material event or information that could affect the value of its securities as soon as possible.

---

### **3.2_Prudential_Capital_Reserves**

[cite_start]This sub-shard defines the obligations related to an entity's financial soundness and stability. Prudential regulation aims to ensure that firms maintain sufficient financial resources to absorb unexpected losses, thereby protecting their clients, counterparties, and the stability of the financial system.

**Example Leaves:**

- **Leaf ID: PRUD-001**

  - **Type:** Definition
  - **Content:** **Prudential Regulation** is a style of financial regulation that requires financial firms to control risks and hold adequate capital and liquidity to maintain their solvency and financial health.

- **Leaf ID: PRUD-002**

  - **Type:** Definition
  - **Content:** **Regulatory Capital** is the specific amount of capital that a financial institution is required to hold by its financial regulator. It is typically calculated as a ratio of the institution's capital to its risk-weighted assets.

- **Leaf ID: PRUD-003**

  - **Type:** Definition
  - **Content:** A **Capital Adequacy Ratio (CAR)** is a key metric of a bank's or financial institution's health, representing the ratio of its capital to its risk. The formula is typically (Tier 1 Capital + Tier 2 Capital) / Risk-Weighted Assets.

- **Leaf ID: PRUD-004**

  - **Type:** Definition
  - **Content:** **Liquid Reserves** are an amount of high-quality liquid assets (HQLA), such as cash or government bonds, that an institution must hold to meet its short-term obligations and withstand a stress scenario.

- **Leaf ID: PRUD-005**

  - **Type:** Definition
  - **Content:** **Proof of Reserves (PoR)** is a specific application of prudential principles to the crypto-asset industry. It is an independent audit designed to verify that a custodian or exchange holds sufficient assets in its reserves to back all customer balances on its platform. The audit typically involves cryptographic proof of ownership of on-chain assets compared against a cryptographically-secured list of client liabilities.

- **Leaf ID: PRUD-006**

  - **Type:** Principle
  - **Content:** The **Segregation of Client Funds** is the obligation for a financial firm to hold client funds and assets in accounts that are separate from the firm's own operational funds and assets. This is a critical measure to protect client property in the event of the firm's insolvency.

- **Leaf ID: PRUD-007**
  - **Type:** Rule
  - **Content:** For issuers of Asset-Referenced Tokens (ARTs) under MiCA, there is a mandatory requirement to maintain a reserve of assets backing the tokens at a 1:1 ratio at all times. This reserve must be segregated from the issuer's other assets and be subject to regular independent audits.

---

### **3.3_Governance_RiskManagement**

[cite_start]This sub-shard defines the systems and processes by which an organization is directed, controlled, and held to account. It includes the framework for identifying, assessing, mitigating, and monitoring the risks an entity faces.

**Example Leaves:**

- **Leaf ID: GOV-001**

  - **Type:** Definition
  - **Content:** **Corporate Governance** is the structure of rules, practices, and processes used to direct and manage a company. It involves balancing the interests of a company's many stakeholders, such as shareholders, management, customers, suppliers, financiers, government, and the community.

- **Leaf ID: GOV-002**

  - **Type:** Principle
  - **Content:** **Duty of Care:** Members of a governing body (e.g., a Board of Directors) have a duty to act on a fully informed basis, in good faith, with due diligence and care, as an ordinarily prudent person would exercise in a similar position.

- **Leaf ID: GOV-003**
  - **Type:** Principle
  - **Content:** **Duty of Loyalty:** Members of a governing body have a duty to act in the best interest of the corporation and its shareholders, not in their own personal interest. This prohibits self-dealing and the usurpation of corporate opportunities.

---

- **Leaf ID: GOV-004**

  - **Type:** Definition
  - **Content:** **Risk Management** is the comprehensive process of identifying, assessing, mitigating, monitoring, and reporting the risks that an organization faces in the pursuit of its objectives. This includes strategic, financial, operational, legal, and reputational risks.

- **Leaf ID: GOV-005**

  - **Type:** Definition
  - **Content:** A **Risk Appetite Framework (RAF)** is a high-level document, approved by the Board of Directors, that sets out the aggregate level and types of risk that an organization is willing to assume in order to achieve its strategic objectives.

- **Leaf ID: GOV-006**

  - **Type:** Principle
  - **Content:** The **Three Lines of Defense Model** is a standard risk governance model. The **First Line** is the business unit that owns and manages risk. The **Second Line** (e.g., Compliance, Risk Management functions) oversees and challenges the first line. The **Third Line** (Internal Audit) provides independent assurance to the Board that the overall governance and risk management framework is effective.

- **Leaf ID: GOV-007**
  - **Type:** Principle
  - **Content:** **Board Oversight of Risk:** The Board of Directors holds ultimate responsibility for the effective management of risk within the organization. While management is responsible for day-to-day risk control, the Board must ensure that a robust risk management framework is in place and is functioning effectively.

---

### **3.4_Consumer_Investor_Protection**

This sub-shard covers the specific obligations designed to protect less sophisticated parties, particularly retail consumers and individual investors, from unfair, deceptive, or abusive practices in the financial marketplace. These rules aim to correct information asymmetries and imbalances in bargaining power.

**Example Leaves:**

- **Leaf ID: CPRO-001**

  - **Type:** Principle
  - **Content:** The **Suitability/Appropriateness Obligation** requires that a financial firm, when making a recommendation or providing a service, must take reasonable steps to ensure that a given financial product or strategy is suitable for a client's specific financial situation, investment objectives, knowledge and experience, and risk tolerance.

- **Leaf ID: CPRO-002**

  - **Type:** Principle
  - **Content:** **Prohibition of Unfair, Deceptive, or Abusive Acts or Practices (UDAAP):** This is a broad principle prohibiting financial service providers from engaging in conduct that is likely to mislead consumers, that is unfair, or that takes unreasonable advantage of a consumer's lack of understanding.

- **Leaf ID: CPRO-003**

  - **Type:** Rule
  - **Content:** A **"Cooling-Off" Period** is a mandatory period of time during which a consumer has the unconditional right to cancel a contract for a financial product or service without penalty and without giving a reason.

- **Leaf ID: CPRO-004**

  - **Type:** Rule
  - **Content:** **Plain Language Requirement:** Contracts, terms of service, and key information documents provided to consumers must be written in clear, concise, and easily understandable language, avoiding complex legal or financial jargon.

- **Leaf ID: CPRO-005**

  - **Type:** Rule
  - **Content:** **Right to Redress:** Firms must establish and maintain an accessible, fair, and effective internal process for handling customer complaints and providing appropriate redress when a complaint is upheld.

- **Leaf ID: CPRO-006**
  - **Type:** Rule
  - **Content:** **Prohibition on Misleading Advertising:** All marketing communications and advertisements for financial products must be fair, clear, and not misleading. Claims about past performance must not be a prominent feature, and potential returns must be balanced with clear warnings about the risks involved.

---

### **3.5_Cybersecurity_OperationalResilience**

This sub-shard defines the obligations for entities to implement robust technical and organizational measures to protect their information and technology (IT) systems from cyber threats and to ensure they can prevent, respond to, recover from, and learn from operational disruptions.

**Example Leaves:**

- **Leaf ID: CSEC-001**

  - **Type:** Definition
  - **Content:** **Cybersecurity** is the practice of protecting critical systems, networks, and programs from digital attacks. These attacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users; or interrupting normal business processes.

- **Leaf ID: CSEC-002**

  - **Type:** Definition
  - **Content:** **Operational Resilience** is the ability of an organization to continue providing its critical business services during and after a severe but plausible disruption. It extends beyond cybersecurity to include failures from people, processes, and external events.

- **Leaf ID: CSEC-003**

  - **Type:** Rule
  - **Content:** **Adoption of a Cybersecurity Framework:** Regulated entities are often required to adopt and implement a recognized cybersecurity framework (e.g., the NIST Cybersecurity Framework, ISO/IEC 27001) to structure their security programs.

- **Leaf ID: CSEC-004**

  - **Type:** Rule
  - **Content:** **Incident Response Plan:** An entity must establish, maintain, and regularly test a formal, written incident response plan that details the procedures for detecting, responding to, mitigating, and recovering from cybersecurity incidents.

- **Leaf ID: CSEC-005**

  - **Type:** Rule
  - **Content:** **Incident Reporting Obligation:** An entity has a mandatory obligation to report material cybersecurity incidents to its primary regulator (and sometimes to affected customers) within a strict timeframe, often within 24 to 72 hours of detection.

- **Leaf ID: CSEC-006**

  - **Type:** Rule
  - **Content:** **Third-Party Risk Management (TPRM):** An entity must have a program to assess and manage the risks associated with its use of third-party vendors and service providers. This includes conducting due diligence on the vendor's own cybersecurity posture.

- **Leaf ID: CSEC-007**
  - **Type:** Definition
  - **Content:** **Penetration Testing** is an authorized, simulated cyberattack on a computer system, performed to evaluate the security of the system by actively exploiting vulnerabilities. Regulated entities are often required to conduct regular penetration tests.

# Layer 4: Jurisdictional Overlays

---

### **4.1_European_Union (EU)**

This sub-shard contains the specific regulatory details for the European Union. Its cornerstone is the Markets in Crypto-Assets (MiCA) Regulation, which establishes a comprehensive and harmonized legal framework for crypto-assets, their issuers, and service providers across the EU. The objective is to provide legal certainty, protect consumers and investors, ensure financial stability, and foster innovation. As a "Regulation," its rules are directly applicable in all EU member states.

---

#### **_MiCA: General Principles, Scope & Definitions_**

- **Leaf ID: EU-MICA-001**

  - **Type:** Principle
  - **Content:** MiCA is designed to regulate crypto-assets that are not currently covered by existing EU financial services legislation, such as MiFID II.

- **Leaf ID: EU-MICA-002**

  - **Type:** Rule (Exclusion)
  - **Content:** The MiCA regulation does not apply to crypto-assets that qualify as financial instruments, such as securities, under the existing Markets in Financial Instruments Directive (MiFID II).

- **Leaf ID: EU-MICA-003**

  - **Type:** Rule (Exclusion)
  - **Content:** Non-Fungible Tokens (NFTs) that are unique and not interchangeable with other assets are, in principle, excluded from the scope of MiCA. However, NFTs issued in a large series or fractionalized could be considered fungible and may fall within scope.

- **Leaf ID: EU-MICA-004**

  - **Type:** Rule (Exclusion)
  - **Content:** Crypto-asset services that are provided in a fully decentralized manner without any intermediary are excluded from the scope of MiCA.

- **Leaf ID: EU-MICA-005**

  - **Type:** Definition
  - **Content:** An **Issuer** under MiCA is a legal person who offers to the public any type of crypto-asset or seeks the admission of such crypto-assets to a trading platform.

- **Leaf ID: EU-MICA-006**
  - **Type:** Definition
  - **Content:** A **Crypto-Asset Service Provider (CASP)** is any legal person whose occupation or business is the provision of one or more crypto-asset services to third parties on a professional basis.

---

#### **_MiCA: Rules for Asset-Referenced Tokens (ARTs)_**

- **Leaf ID: EU-MICA-007**

  - **Type:** Definition
  - **Content:** An **Asset-Referenced Token (ART)** is a type of crypto-asset that is not an e-money token and that purports to maintain a stable value by referencing another value or right, or a combination thereof, including one or more official currencies, commodities, or other crypto-assets.

- **Leaf ID: EU-MICA-008**

  - **Type:** Rule
  - **Content:** Issuers of ARTs must be a legal entity established within the European Union. They are required to obtain an authorization from the competent authority of their home Member State before they can offer ARTs to the public or seek their admission to trading.

- **Leaf ID: EU-MICA-009**

  - **Type:** Rule
  - **Content:** The whitepaper for an ART must be submitted to and approved by the relevant national competent authority before it can be published and the token can be offered.

- **Leaf ID: EU-MICA-010**

  - **Type:** Rule (Prudential)
  - **Content:** Issuers of ARTs must, at all times, have own funds equal to an amount of at least the higher of the following: (a) EUR 350,000, or (b) 2% of the average amount of the reserve assets.

- **Leaf ID: EU-MICA-011**

  - **Type:** Rule (Prudential)
  - **Content:** Issuers of ARTs must constitute and maintain a reserve of assets backing the tokens. This reserve must be legally and operationally segregated from the issuer's own assets and must be managed to cover the claims from token holders at all times.

- **Leaf ID: EU-MICA-012**
  - **Type:** Rule
  - **Content:** ARTs classified as "significant" by the European Banking Authority (EBA) are subject to stricter requirements and direct supervision by the EBA.

---

#### **_MiCA: Rules for E-Money Tokens (EMTs)_**

- **Leaf ID: EU-MICA-013**

  - **Type:** Definition
  - **Content:** An **E-Money Token (EMT)** is a type of crypto-asset that purports to maintain a stable value by referencing the value of one official fiat currency.

- **Leaf ID: EU-MICA-014**

  - **Type:** Rule
  - **Content:** EMTs can only be issued either by an authorized credit institution or by an "electronic money institution" (EMI) authorized under the E-Money Directive (EMD2).

- **Leaf ID: EU-MICA-015**

  - **Type:** Rule
  - **Content:** Issuers of EMTs must publish a whitepaper and notify the competent authority at least 40 working days before the offering, but the whitepaper does not require prior approval.

- **Leaf ID: EU-MICA-016**

  - **Type:** Rule
  - **Content:** Holders of an E-Money Token have a claim against the issuer and have the right to redeem their tokens at any moment and at par value for the referenced fiat currency.

- **Leaf ID: EU-MICA-017**
  - **Type:** Rule (Prudential)
  - **Content:** Funds received by the issuer in exchange for EMTs must be safeguarded. At least 30% of the funds must be deposited in a separate account in a credit institution, and the remainder must be invested in secure, low-risk assets.

---

#### **_MiCA: Rules for Other Crypto-Assets (e.g., Utility Tokens)_**

This category covers crypto-assets that are not classified as ARTs or EMTs. The primary regulatory tool for this category is transparency through a detailed whitepaper.

- **Leaf ID: EU-MICA-018**

  - **Type:** Rule
  - **Content:** An issuer of a utility token or other crypto-asset not classified as an ART or EMT must publish a crypto-asset whitepaper and notify the relevant competent authority before offering it to the public. Unlike with ARTs, prior approval of the whitepaper is not required.

- **Leaf ID: EU-MICA-019**

  - **Type:** Rule (Liability)
  - **Content:** The issuer is held liable for the information provided in the whitepaper. If the whitepaper contains information that is not complete, fair, clear, or is misleading, an investor who purchased the crypto-asset may claim damages from the issuer.

- **Leaf ID: EU-MICA-020**
  - **Type:** Rule (Exemption)
  - **Content:** An offer of a crypto-asset (other than an ART or EMT) to the public is exempt from the whitepaper requirement if: (a) it is offered to fewer than 150 persons per Member State; (b) the total consideration for the offer in the EU does not exceed EUR 1,000,000 over a 12-month period; or (c) the offer is free of charge.

---

#### **_MiCA: Requirements for Crypto-Asset Service Providers (CASPs)_**

This section details the comprehensive licensing and operational requirements for entities providing professional crypto-asset services within the EU.

- **Leaf ID: EU-MICA-021**

  - **Type:** Rule (Authorization)
  - **Content:** To provide crypto-asset services in the EU, an entity must be a legal person with a registered office in a Member State and must obtain authorization as a CASP from the national competent authority of that state.

- **Leaf ID: EU-MICA-022**

  - **Type:** Principle (Passporting)
  - **Content:** Once a CASP is authorized in one EU Member State, it benefits from a "European passport," which allows it to provide its licensed services across the entire European Union without needing separate authorizations in each country.

- **Leaf ID: EU-MICA-023**

  - **Type:** Rule (Organizational)
  - **Content:** CASPs must have robust governance arrangements, including a clear organizational structure, and ensure that members of the management body are fit and proper, possessing sufficient knowledge, skills, and experience. At least one director must be resident in the EU.

- **Leaf ID: EU-MICA-024**

  - **Type:** Rule (Prudential)
  - **Content:** CASPs must have prudential safeguards in place. This can take the form of either holding own funds (capital reserves) permanently at their disposal or having a professional indemnity insurance policy in place that is appropriate for the types of services they provide.

- **Leaf ID: EU-MICA-025**

  - **Type:** Rule (Conduct of Business)
  - **Content:** CASPs must act honestly, fairly, and professionally in accordance with the best interests of their clients. They must provide clients with clear, fair, and not misleading information and warn them about the risks associated with crypto-assets.

- **Leaf ID: EU-MICA-026**

  - **Type:** Rule (Safeguarding of Assets)
  - **Content:** CASPs that hold crypto-assets belonging to clients must make adequate arrangements to safeguard ownership rights. This includes keeping client assets segregated from their own assets and maintaining a register of positions. They are liable to their clients for any losses resulting from an IT malfunction or cyber-attack.

- **Leaf ID: EU-MICA-027**

  - **Type:** Rule (Complaint Handling)
  - **Content:** CASPs must establish and maintain effective and transparent procedures for the prompt, fair, and consistent handling of complaints received from clients.

- **Leaf ID: EU-MICA-028**
  - **Type:** Rule (AML/CFT)
  - **Content:** All authorized CASPs are considered "obliged entities" under the EU's Anti-Money Laundering Directive (AMLD). They must comply fully with AML/CFT requirements, including performing customer due diligence (KYC) and reporting suspicious transactions.

---

#### **_MiCA: Market Abuse Rules_**

Title VI of MiCA establishes a framework to ensure market integrity, prohibiting specific abusive behaviors in the context of crypto-assets.

- **Leaf ID: EU-MICA-029**

  - **Type:** Definition
  - **Content:** **Inside Information** under MiCA is information of a precise nature which has not been made public, relating, directly or indirectly, to one or more issuers or crypto-assets, and which, if it were made public, would be likely to have a significant effect on the prices of those crypto-assets.

- **Leaf ID: EU-MICA-030**

  - **Type:** Rule (Prohibition)
  - **Content:** **Insider Dealing:** It is prohibited for any person who possesses inside information to use that information by acquiring or disposing of, for its own account or for the account of a third party, directly or indirectly, the crypto-assets to which that information relates.

- **Leaf ID: EU-MICA-031**

  - **Type:** Rule (Prohibition)
  - **Content:** **Unlawful Disclosure of Inside Information:** It is prohibited for a person who possesses inside information to unlawfully disclose that information to any other person, except where the disclosure is made in the normal exercise of an employment, a profession, or duties.

- **Leaf ID: EU-MICA-032**

  - **Type:** Rule (Prohibition)
  - **Content:** **Market Manipulation:** It is prohibited to engage in market manipulation. This includes entering into a transaction or placing an order to trade which gives, or is likely to give, false or misleading signals as to the supply of, demand for, or price of, a crypto-asset, or which secures the price at an artificial level.

- **Leaf ID: EU-MICA-033**
  - **Type:** Rule
  - **Content:** Any person professionally arranging or executing transactions in crypto-assets must establish and maintain effective arrangements, systems, and procedures to prevent, detect, and report market abuse.

---

#### **_Broader EU Digital Finance Framework_**

- **Leaf ID: EU-DORA-001**
  - **Type:** Framework
  - **Content:** The **Digital Operational Resilience Act (DORA)** is a complementary EU regulation that applies to financial entities, including CASPs authorized under MiCA. It sets uniform requirements for the security of network and information systems, including ICT risk management, incident reporting, resilience testing, and third-party risk management.

### **4.2_United_States (US)**

This sub-shard details the regulatory framework for crypto-assets in the United States. Unlike the EU's unified approach, the US regulation is a fragmented mosaic of rules applied by various federal and state agencies. This creates significant legal uncertainty and requires a careful analysis of which agency's rules apply to a given asset or service. The primary federal agencies involved are the Securities and Exchange Commission (SEC), the Commodity Futures Trading Commission (CFTC), and the Financial Crimes Enforcement Network (FinCEN).

---

#### **_The SEC (Securities and Exchange Commission)_**

The SEC is the primary regulator for any crypto-asset that qualifies as a "security". Its approach is heavily based on applying existing securities laws through a combination of guidance and significant enforcement actions.

- **Leaf ID: US-SEC-001**

  - **Type:** Test
  - **Content:** **The Howey Test:** The cornerstone of the SEC's analysis is the Howey Test, established by the Supreme Court in 1946. A transaction is classified as an "investment contract," and therefore a security, if it meets four criteria: (1) an investment of money, (2) in a common enterprise, (3) with a reasonable expectation of profits, (4) derived from the managerial or entrepreneurial efforts of others.

- **Leaf ID: US-SEC-002**

  - **Type:** Rule (Howey Prong 1 & 2)
  - **Content:** **Application to Crypto (Investment & Common Enterprise):** The first two prongs of the Howey Test are generally considered straightforward to meet in crypto-asset offerings. An "investment of money" includes payments in both fiat and other crypto-assets. A "common enterprise" is easily established in projects where investors' fortunes are tied together and linked to the success of the project.

- **Leaf ID: US-SEC-003**

  - **Type:** Rule (Howey Prong 3)
  - **Content:** **Application to Crypto (Expectation of Profits):** The SEC interprets this prong broadly. An expectation of profits is inferred when a digital asset is offered to the public with an emphasis on its potential for price appreciation, the creation of a secondary trading market, or the promise of future functionality that will increase its value.

- **Leaf ID: US-SEC-004**

  - **Type:** Rule (Howey Prong 4)
  - **Content:** **Application to Crypto (Efforts of Others):** This is the most critical and contentious prong. The SEC finds that this prong is met if investors expect the value of the crypto-asset to increase due to the continued work of a specific person or group, such as the core development team, a foundation, or a sponsoring entity that is responsible for marketing, technological improvements, and building the ecosystem. If a network is sufficiently decentralized that its value no longer depends on a central group, it may cease to be a security.

- **Leaf ID: US-SEC-005**

  - **Type:** Principle
  - **Content:** **Regulation by Enforcement:** The SEC has been criticized for its "regulation by enforcement" approach, where it establishes regulatory positions by bringing legal actions against market participants rather than through formal rulemaking.

- **Leaf ID: US-SEC-006**

  - **Type:** Rule
  - **Content:** **Primary Allegations in Enforcement:** The most frequent allegations in SEC enforcement actions against crypto firms are (1) fraud, and (2) the offer and sale of crypto-assets as unregistered securities.

- **Leaf ID: US-SEC-007**

  - **Type:** Precedent
  - **Content:** **Key Enforcement Cases:** The SEC's regulatory stance has been shaped by high-profile legal battles. Cases such as _SEC v. Ripple_, _SEC v. Coinbase_, and _SEC v. Terraform Labs_ are landmark actions that are actively defining the boundaries of the SEC's jurisdiction over crypto-assets.

- **Leaf ID: US-SEC-008**
  - **Type:** Precedent
  - **Content:** **Monetary Penalties:** The SEC has secured significant monetary penalties from its enforcement actions. In 2024, fines reached a record high, largely due to a multi-billion dollar settlement in the Terraform Labs case, signaling a continued focus on strict enforcement.

---

#### **_The CFTC (Commodity Futures Trading Commission)_**

The CFTC regulates crypto-assets that are properly classified as "commodities" and the derivative markets based on them.

- **Leaf ID: US-CFTC-001**

  - **Type:** Principle
  - **Content:** **Jurisdiction over Commodities:** The CFTC has regulatory jurisdiction over crypto-assets that are not securities, classifying them as commodities. This position was affirmed by a federal court in 2018, giving the CFTC clear authority in its domain.

- **Leaf ID: US-CFTC-002**

  - **Type:** Rule
  - **Content:** **Specific Commodity Designations:** The CFTC explicitly considers Bitcoin (BTC) and Ether (ETH) to be commodities, placing them under its regulatory oversight.

- **Leaf ID: US-CFTC-003**
  - **Type:** Rule
  - **Content:** **Regulatory Focus:** The CFTC's primary role is the regulation of derivative markets, such as futures, swaps, and options based on digital commodities. It also possesses anti-fraud and anti-manipulation authority over the spot (cash) markets for these commodities.

---

#### **_FinCEN (Financial Crimes Enforcement Network)_**

FinCEN is a bureau of the U.S. Treasury Department responsible for combating money laundering, terrorist financing, and other financial crimes. It applies the rules of the Bank Secrecy Act (BSA) to the crypto-asset ecosystem.

- **Leaf ID: US-FINCEN-001**

  - **Type:** Rule
  - **Content:** **Application of the Bank Secrecy Act (BSA):** FinCEN applies the BSA to crypto-asset businesses, classifying many of them as Money Services Businesses (MSBs).

- **Leaf ID: US-FINCEN-002**

  - **Type:** Definition
  - **Content:** **Money Services Business (MSB):** Under FinCEN guidance, entities such as cryptocurrency exchanges and hosted wallet providers are typically considered MSBs. As such, they must register with FinCEN, develop and implement an effective anti-money laundering (AML) program, and comply with reporting and record-keeping requirements.

- **Leaf ID: US-FINCEN-003**

  - **Type:** Rule
  - **Content:** **The "Travel Rule":** FinCEN requires financial institutions, including crypto MSBs, to comply with the Travel Rule. This rule mandates that they must collect, retain, and transmit information about the parties involved in fund transfers at or above a certain threshold, currently set at $3,000.

- **Leaf ID: US-FINCEN-004**
  - **Type:** Rule (Proposed)
  - **Content:** **Self-Custodied Wallets:** FinCEN has proposed rules aimed at increasing transparency for transactions involving self-custodied or "unhosted" wallets. These proposals would require MSBs to report and verify the identity of customers for transactions with self-custodied wallets above certain thresholds, aiming to align crypto regulation with that of traditional finance.

---

#### **_OFAC (Office of Foreign Assets Control)_**

OFAC, another bureau of the Treasury Department, administers and enforces economic and trade sanctions in support of U.S. national security and foreign policy objectives.

- **Leaf ID: US-OFAC-001**

  - **Type:** Rule
  - **Content:** **Sanctions Authority:** OFAC has the authority to add individuals, entities, and cryptocurrency addresses to the Specially Designated Nationals and Blocked Persons (SDN) List. U.S. persons are strictly prohibited from transacting with any address or entity on the SDN list.

- **Leaf ID: US-OFAC-002**

  - **Type:** Precedent
  - **Content:** **Tornado Cash Sanctions:** In August 2022, OFAC sanctioned Tornado Cash, a decentralized crypto mixer, alleging it was used to launder billions of dollars worth of crypto-assets, including significant funds stolen by the North Korean state-sponsored Lazarus Group.

- **Leaf ID: US-OFAC-003**
  - **Type:** Precedent
  - **Content:** **Legal Challenge to Sanctions:** The sanctions against Tornado Cash were legally challenged. In March 2025, a court ruled to lift the sanctions, determining that OFAC had exceeded its authority under the International Emergency Economic Powers Act (IEEPA) by sanctioning immutable and autonomous smart contracts, which the court found did not qualify as "property" or an "entity" under the statute. This case highlights the legal challenges of applying traditional sanctions regimes to decentralized technology.

---

#### **_Legislative Efforts_**

Congress has been actively working on legislation to create a more comprehensive and clear federal framework for crypto-assets.

- **Leaf ID: US-LEG-001**

  - **Type:** Framework
  - **Content:** **FIT21 Act (Financial Innovation and Technology for the 21st Century Act):** This major legislative proposal aims to resolve the jurisdictional ambiguity between the SEC and CFTC. It establishes a process to certify if a blockchain network is "functional and decentralized".

- **Leaf ID: US-LEG-002**

  - **Type:** Rule
  - **Content:** **FIT21 - Jurisdictional Split:** Under the FIT21 Act, if a digital asset's network is certified as decentralized, the asset is treated as a "digital commodity" and falls under the primary jurisdiction of the CFTC. If the network is not yet decentralized, the asset is treated as a "restricted digital asset" (a form of security) and remains under the SEC's jurisdiction until it achieves decentralization. The bill has passed the House of Representatives.

- **Leaf ID: US-LEG-003**

  - **Type:** Framework
  - **Content:** **Clarity for Payment Stablecoins Act:** This bill seeks to create a federal regulatory framework specifically for payment stablecoins. Its main goal is to protect consumers and ensure the stability of the financial system by setting clear rules for stablecoin issuers.

- **Leaf ID: US-LEG-004**
  - **Type:** Rule
  - **Content:** **Stablecoin Issuer Requirements:** The Clarity for Payment Stablecoins Act proposes that only authorized issuers may issue stablecoins. This includes entities like insured depository institutions (banks) or qualified non-bank entities that would be subject to federal or state supervision, including requirements for capital, liquidity, and asset reserves.

### **4.3_Chile (CL)**

This sub-shard details the regulatory framework for financial technology in Chile. The country is considered a key case study in Latin America due to the recent enactment of its "Fintech Law" (Law 21,521), which created a comprehensive, modern, and risk-based regulatory perimeter for new financial business models. The primary regulator is the Commission for the Financial Market (Comisión para el Mercado Financiero - CMF).

---

#### **_The Fintech Law (Law 21,521)_**

This law, enacted in 2023, establishes a formal regulatory framework for a range of fintech services that previously operated in a grey area. Its main objectives are to promote innovation and competition, protect consumers, and maintain financial stability.

- **Leaf ID: CL-FINTECH-001**

  - **Type:** Principle
  - **Content:** **Regulatory Perimeter:** The Fintech Law's primary function is to establish a clear regulatory perimeter. Any entity providing one of the specifically listed fintech services must register with the CMF and comply with its regulations.

- **Leaf ID: CL-FINTECH-002**

  - **Type:** Rule
  - **Content:** **Mandatory CMF Registration:** All entities providing services regulated by the Fintech Law must enroll in a "Registry of Financial Service Providers" managed by the CMF. Operating without registration constitutes a serious offense.

- **Leaf ID: CL-FINTECH-003**
  - **Type:** Rule
  - **Content:** **General Obligations for Registered Entities:** All registered entities must comply with a set of cross-cutting obligations, including: (1) having robust corporate governance and risk management policies; (2) meeting information security and cybersecurity standards; and (3) providing clear, timely, and not misleading information to their users.

##### **_Regulated Services under the Fintech Law_**

- **Leaf ID: CL-FINTECH-004**

  - **Type:** Definition
  - **Content:** **Crowdfunding Platforms (Plataformas de Financiamiento Colectivo - PFC):** These are platforms that connect project developers or companies seeking funding with a multitude of investors. The law regulates both lending-based and equity-based crowdfunding.

- **Leaf ID: CL-FINTECH-005**

  - **Type:** Definition
  - **Content:** **Alternative Transaction Systems (Sistemas Alternativos de Transacción - SAT):** These are platforms that provide a venue for the trading of financial instruments and are not organized as traditional stock exchanges. This category can encompass certain types of crypto-asset exchanges.

- **Leaf ID: CL-FINTECH-006**

  - **Type:** Definition
  - **Content:** **Investment Advisory Services:** The provision of personalized recommendations regarding specific financial instruments. Under the law, this service becomes regulated when provided through technological platforms.

- **Leaf ID: CL-FINTECH-007**

  - **Type:** Definition
  - **Content:** **Credit Advisory Services:** The provision of personalized advisory services to individuals or companies seeking credit or financing.

- **Leaf ID: CL-FINTECH-008**

  - **Type:** Definition
  - **Content:** **Custody of Financial Instruments:** The service of safekeeping and administering financial instruments, including crypto-assets if they are classified as securities. This service carries significant obligations regarding the segregation and protection of client assets.

- **Leaf ID: CL-FINTECH-009**
  - **Type:** Definition
  - **Content:** **Order Routing and Intermediation:** The service of receiving orders from clients and directing them to other intermediaries or execution venues for financial instruments.

---

#### **_The Open Finance System (Sistema de Finanzas Abiertas - SFA)_**

A core component of the Fintech Law is the creation of a regulated Open Finance system.

- **Leaf ID: CL-SFA-001**

  - **Type:** Definition
  - **Content:** The **Open Finance System (SFA)** is a framework designed to promote competition and innovation by enabling the secure exchange of customer financial data between different service providers, subject to the customer's explicit consent.

- **Leaf ID: CL-SFA-002**

  - **Type:** Principle
  - **Content:** **Customer Consent is Paramount:** No data can be shared within the SFA without the express, informed, and unequivocal consent of the data's owner (the client). The consent must specify which data is being shared, with whom, and for what purpose.

- **Leaf ID: CL-SFA-003**
  - **Type:** Definition
  - **Content:** **Payment Initiation Service Providers (Proveedores de Servicios de Iniciación de Pagos - ISP):** This is a new role created under the SFA. An ISP is an entity that, with the client's consent, can initiate a payment order on their behalf from an account held at another institution (e.g., a bank).

---

#### **_Securities Market Law (LMV) and CMF Norms_**

This section covers the application of traditional securities law to crypto-assets.

- **Leaf ID: CL-LMV-001**

  - **Type:** Definition
  - **Content:** **Public Offer (Oferta Pública de Valores):** Under the Chilean Securities Market Law (LMV), a public offer is one that is addressed to the general public or to a certain sector or specific group of the public. Making a public offer of a "valor" (security) triggers mandatory registration and disclosure requirements with the CMF.

- **Leaf ID: CL-LMV-002**

  - **Type:** Rule
  - **Content:** **Application to Crypto-Assets:** The CMF has established that if a crypto-asset has the characteristics of a "valor" (e.g., it functions like a share, bond, or collective investment scheme), its offering will be considered a public offer of securities and will be subject to the full scope of the LMV.

- **Leaf ID: CL-LMV-003**
  - **Type:** Rule
  - **Content:** **CMF General Norms (Normas de Carácter General - NCG):** The CMF issues detailed regulations (NCGs) that implement the provisions of the LMV. Relevant norms include those governing public offers (NCG 30), the registration of securities, and ongoing information disclosure requirements for issuers.

### **4.4_Global_Standards_APAC**

This sub-shard provides the essential international context that shapes national regulations and summarizes the regulatory approaches of key financial hubs in the Asia-Pacific (APAC) region. It contains principles from global standard-setting bodies, which, while often non-binding "soft law," are highly influential and frequently adopted by individual jurisdictions.

---

#### **_Global Standards (Soft Law)_**

- **Leaf ID: GBL-FATF-001**

  - **Type:** Definition
  - **Content:** The **Financial Action Task Force (FATF)** is an inter-governmental body that sets global standards to combat money laundering and terrorist financing (AML/CFT). Its recommendations are the basis for AML/CFT regulation in over 200 jurisdictions.

- **Leaf ID: GBL-FATF-002**

  - **Type:** Rule
  - **Content:** **FATF Recommendation 16 (The "Travel Rule"):** This is a key FATF standard applied to Virtual Asset Service Providers (VASPs). It requires VASPs to obtain, hold, and transmit required originator and beneficiary information alongside virtual asset transfers above a certain threshold. The goal is to make crypto transactions more transparent and traceable for law enforcement purposes.

- **Leaf ID: GBL-IOSCO-001**

  - **Type:** Definition
  - **Content:** The **International Organization of Securities Commissions (IOSCO)** is the international body that brings together the world's securities regulators. It develops, implements, and promotes adherence to internationally recognized standards for securities regulation to protect investors, maintain fair markets, and address systemic risks.

- **Leaf ID: GBL-IOSCO-002**

  - **Type:** Principle
  - **Content:** **IOSCO's Crypto-Asset Principles:** IOSCO has established principles and policy recommendations for crypto-assets that focus on two main objectives: (1) ensuring investor protection and (2) maintaining market integrity. Its work guides national securities regulators on how to apply existing rules or create new ones for crypto markets.

- **Leaf ID: GBL-FSB-001**

  - **Type:** Definition
  - **Content:** The **Financial Stability Board (FSB)** is an international body that monitors and makes recommendations about the global financial system to promote international financial stability. It coordinates the work of national financial authorities and international standard-setting bodies.

- **Leaf ID: GBL-FSB-002**

  - **Type:** Principle
  - **Content:** **FSB's Stance on Crypto-Assets:** The FSB focuses on the risks that crypto-assets, particularly global stablecoins, could pose to global financial stability. Its recommendations often revolve around the principle of "same activity, same risk, same regulation," advocating that crypto-asset activities with equivalent economic functions to traditional finance should be regulated in an equivalent way.

- **Leaf ID: GBL-OECD-001**
  - **Type:** Framework
  - **Content:** The **OECD's Crypto-Asset Reporting Framework (CARF):** This is a global tax transparency framework developed by the Organisation for Economic Co-operation and Development. It provides for the automatic exchange of information on crypto-asset transactions between tax authorities to combat tax evasion.

---

#### **_Summary of Key APAC Jurisdictions_**

- **Leaf ID: APAC-SG-001**

  - **Type:** Framework
  - **Content:** **Singapore (SG):** Singapore employs a dual regulatory approach managed by the Monetary Authority of Singapore (MAS). Crypto-assets that function primarily as a medium of exchange are regulated as "Digital Payment Tokens" (DPTs) under the **Payment Services Act (PSA)**. Entities providing DPT services must obtain a license from the MAS. If a crypto-asset has the characteristics of a security (e.g., a share or a debenture), it is regulated as such under the **Securities and Futures Act (SFA)**.

- **Leaf ID: APAC-HK-001**
  - **Type:** Framework
  - **Content:** **Hong Kong (HK):** Hong Kong has established a comprehensive licensing regime for crypto-asset businesses, managed by the Securities and Futures Commission (SFC). Any entity providing virtual asset services, particularly operating a virtual asset trading platform (VATP), must be licensed by the SFC. This regime includes robust requirements for investor protection, asset custody, cybersecurity, and AML/CFT, and has recently expanded to allow licensed platforms to offer services to retail investors under specific safeguards.

---

#### **_Other Relevant Regulations_**

- **Leaf ID: CL-AML-001**
  - **Type:** Rule
  - **Content:** **UAF (Financial Analysis Unit):** Entities involved in the transfer of money or assets, including many crypto-asset businesses, are considered "obliged entities" and must report suspicious transactions to Chile's Financial Analysis Unit (Unidad de Análisis Financiero - UAF). They must also implement AML/CFT prevention programs, including customer due diligence (KYC) policies.
