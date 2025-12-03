# HumanWork Protocol (HWP)

> The Verifiable Commerce Layer for B2B Services

**Zero Fees. Maximum Trust. Powered by ZK + AI.**

## Table of Contents
- [Executive Summary](#executive-summary)
- [Competitive Moat](#competitive-moat)
- [Architecture](#architecture)
- [Technical Implementation](#technical-implementation)
- [Development](#development)
- [Deployment](#deployment)
- [Economics](#economics)

## Executive Summary

HumanWork Protocol eliminates the **40% total cost** of traditional B2B freelancing by replacing intermediary trust with cryptographic proof. Our protocol delivers:

- **0% Transaction Fees** (vs. 20% on Upwork)
- **99.9% Trust Verification** via ZK-KYC + AI
- **48-Hour Dispute Resolution** powered by AI
- **Enterprise-Grade Compliance** for Fortune 500 clients

## Competitive Moat

### 1. AI Vetting Engine
- **Contracts**: `SkillTrial.sol`, `AIOracle.sol`
- Replaces subjective resumes with quantifiable on-chain skill proofs
- AI-grades actual work output, not just claims
- Perfect for India GTM: Objectively verify 8.5M developers

### 2. B2B Identity & Compliance 
- **Contracts**: `AgencyRegistry.sol`, `UserRegistry.sol`
- ZK-proof verified humans (privacy-preserving KYC)
- GST-verified agencies (registered businesses)
- Cross-border compliance automation

### 3. Dual-Sided SaaS Model
- **Contract**: `EnterpriseAccess.sol`
- Clients: $500/month or $5,000/year 
- Agencies: $100/month or $1,000/year
- Zero escrow fees = massive competitive advantage

### 4. Dynamic Escrow & Protection
- **Contract**: `ProjectEscrow.sol`
- AI-powered scope creep detection
- Dynamic milestone adjustment
- Smart contract-enforced IP protection

## Architecture

| Contract | Core Function | V2 Upgrade Focus |
|----------|--------------|------------------|
| UserRegistry | Human ZK-KYC & Attestations | Attestation Hub |
| AgencyRegistry | Business Verification | Multi-Chain Support |
| ProjectEscrow | B2B Payment & Milestones | Dynamic Escrow |
| SkillTrial | AI Skill Verification | Skill NFTs |
| AIOracle | Verification Brain | Cross-Chain Oracle |
| DisputeJury | Decentralized Court | DAO Governance |
| EnterpriseAccess | SaaS Subscriptions | Enterprise Tools |
| GasSponsor | Gas-less UX | Meta Transactions |
| InsurancePool | Work Coverage | Risk Analytics |

## Technical Implementation

### Prerequisites
- Foundry
- Node.js v18+
- Git

### Quick Start
```bash
# Install
git clone https://github.com/humanwork/protocol
cd protocol
make install

# Configure
cp .env.example .env

# Test
make test  # 36 Integration Tests

# Deploy
make deploy-testnet
```

### Testing Coverage
- 36 Integration Tests
- 10 Contract Suites
- 100% Core Function Coverage
- Gas Optimization Verified

## Deployment

Automated deployment orchestration via `Deploy.s.sol`:
1. Core Contracts (9)
2. Cross-Contract Authorization
3. Oracle Configuration
4. Admin Permission Setup

### Contract Addresses (Testnet)
```
Addresses saved to: deployments/hedera_testnet.json
```

## Economics

**Revenue Streams (Y1 Targets)**
- Enterprise SaaS: $2.4M
- Agency SaaS: $600K
- Insurance: $350K

**Total Revenue**: $3.35M
**Margin**: 89%

## Links
- [Documentation](https://docs.humanwork.io)
- [Integration Guide](https://docs.humanwork.io/integration)
- [Security Audit](https://docs.humanwork.io/audit)

## License
MIT