<img src="./webapp/public/assets/oleo-1.png" alt="new-york-tomas" style="border-radius: 10px">

<br/>

# 🧑‍⚖️ Tomas - Web3 Legal Agent (MVP)

<p>
    <img src="https://img.shields.io/badge/tomas-v0.1.0-CBA135">
    <img src="https://img.shields.io/badge/network-BASE-0052FF">
    <img src="https://img.shields.io/badge/oracle-chainlink-375BD2">
    <img src="https://img.shields.io/badge/status-mvp-green">
</p>

**Tomas** is an AI-powered legal agent specialized in Web3 law, currently focused on USA and Chile jurisdictions.

This MVP focuses on the **initial intake module**, allowing founders to open a case and start providing key project information to Tomas. This serves as the foundation for future legal services and document generation.

---

## 🎯 Current MVP Scope

- ✅ Connect wallet
- ✅ Paid intake system to initiate a legal case.
- ✅ Payment in ETH, priced in USDC.
- ✅ On-chain price conversion using Chainlink Oracle.
- Complete intake conversation to collect project information.

---

## 💡 How it works

1. User visits [iustomas.ai](iustomas.ai)
2. User starts a new legal case.
3. Tomas requests a one-time intake fee (e.g. $5-$10 USDT equivalent).
4. User pays in ETH, amount calculated using Chainlink ETH/USDT price feed.
5. Once payment is confirmed, Tomas starts the intake conversation:
   - Project name
   - Jurisdiction
   - Entity status
   - Type of business (DAO, Exchange, NFT, Token, DeFi, Crypto Agent, etc)
   - Token plan
   - Funding stage
   - Legal needs

All collected information will serve as the base context for future legal services provided by Tomas.

---

## 🛠 Tech Stack

- Frontend: Next.js + React
- Backend: Node.js (Express)
- Blockchain: Base
- Oracle: Chainlink ETH/USDT Price Feed
- Smart Contract: `IntakePayment.sol`
- Wallet Integration: [Reown](https://reown.com/)

---

## 🔐 Smart Contract Logic

- Accept ETH payments.
- Use Chainlink price feed to calculate ETH equivalent of the USDT fee.
- Verify full payment before granting access to intake module.

---

## 🔮 Next Steps (Future Milestones)

- ✅ Terms & Conditions Generator Module
- ✅ Token Classification Assistant Module
- ✅ Admin dashboard for legal operators
- ✅ Multi-jurisdiction risk assessment

---

## ⚠ Disclaimer

> Tomas AI is an AI-powered legal assistant developed and supervised by legal and technical professionals. The system is designed to assist Web3 founders with initial legal workflows, offering document generation and regulatory analysis.
>
> All outputs are generated with AI assistance but are reviewed, validated, or can be further consulted with our legal experts, including Eugenio Voticky (attorney specialized in tokenization and fintech law) and Cristian Valdivia (engineer specialized in Web3 and AI technologies).
