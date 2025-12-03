# HumanWork Protocol V5

**B2B Trust-as-a-Service Platform on Hedera Hashgraph**

## Overview

HumanWork Protocol is a decentralized freelancing platform that solves the trust problem for international clients hiring in emerging markets (starting with India).

### Core Features

**4 Pillars:**
1. **AI + ZK Dual-Verification** - Verify individuals (ZK-KYC) and companies (GST)
2. **Multi-Tenant B2B Escrow** - Dynamic milestones, scope creep handling, smart cancellations
3. **Dual-Sided SaaS** - Subscriptions for both Clients ($500/mo) and Agencies ($100/mo)
4. **AI-Powered Legitimacy** - AI grading, dispute resolution, compliance automation

### Architecture

```
Layer 0: Infrastructure
├── GasSponsor (gas-less transactions)
└── InsurancePool (optional coverage)

Layer 1: Identity & Vetting
├── UserRegistry (ZK-KYC, attestations)
├── AgencyRegistry (GST verification, team linking)
├── AIOracle (AI verification brain)
└── SkillTrial (AI-graded skill tests)

Layer 2: Commerce & Dispute
├── ProjectEscrow (multi-tenant B2B escrow)
├── EnterpriseAccess (dual-sided SaaS)
└── DisputeJury (decentralized court of appeals)
```

## Quick Start

### Prerequisites
- Foundry
- Node.js v18+
- Git

### Installation

```bash
# Clone
git clone https://github.com/your-org/humanwork-protocol
cd humanwork-protocol

# Install dependencies
make install

# Configure
cp .env.example .env
# Edit .env with your values

# Build
make build

# Test
make test

# Deploy
make deploy-testnet
```

### Environment Variables

```bash
PRIVATE_KEY=your_private_key
ZK_VERIFIER_ADDRESS=0x...
STABLECOIN_ADDRESS=0x...
BACKEND_SERVER_ADDRESS=0x...
HEDERA_TESTNET_RPC=https://testnet.hashio.io/api
```

## Contract Addresses (Testnet)

After deployment, addresses are saved to `deployments/hedera_testnet_v5.json`

## Key Workflows

### 1. Agency Registration
1. Company stakes 500 USDC
2. Provides GST hash
3. AI Oracle verifies GST
4. Company adds verified human employees

### 2. Enterprise Subscription
1. Client pays $500/mo (or $5000/yr)
2. Receives NFT subscription
3. Adds managers to team
4. Posts projects with 0% fees

### 3. Project Lifecycle
1. Client creates project (3+ milestones)
2. Freelancer completes milestones
3. Client approves or disputes
4. AI assists in disputes
5. Final milestone → attestation added

## Testing

```bash
# All tests
make test

# Specific test
forge test --match-contract UserRegistryTest

# Gas report
make test-gas

# Coverage
forge coverage
```

## Security

- ReentrancyGuard on all state-changing functions
- Access control (Ownable, custom modifiers)
- Proof replay protection
- Audit: [Coming Soon]

## Economics

**Revenue Streams:**
- Insurance premiums: 5% of project value
- Client subscriptions: $500/mo or $5,000/yr
- Agency subscriptions: $100/mo or $1,000/yr

**Projected Year 2 Revenue:** $2.65M - $2.7M

## Contributing

Contributions welcome! Please read CONTRIBUTING.md

## License

MIT

## Links

- Website: https://humanwork.io
- Docs: https://docs.humanwork.io
- Discord: https://discord.gg/humanwork