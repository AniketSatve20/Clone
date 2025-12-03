# 📁 Project Structure Guide

Complete overview of HumanWork Protocol project organization.

---

## Root Directory Structure

```
humanwork-protocol/
├── 📄 README.md                          # Project overview
├── 📄 INTEGRATION_GUIDE.md               # ✨ NEW: Complete integration guide
├── 📄 STARTUP_CHECKLIST.md              # ✨ NEW: Launch checklist
├── 📄 DEVELOPMENT_ROADMAP.md            # ✨ NEW: 12-month roadmap
├── 📄 ARCHITECTURE.md                    # System architecture
├── 📄 DEPLOYMENT.md                      # Deployment instructions
├── 📄 QUICK_START.md                    # 5-minute quickstart
├── 📄 SETUP.md                          # Setup guide
├── 📄 TESTING.md                        # Testing guide
├── 📄 PROJECT_COMPLETION_SUMMARY.md     # Status report
├── 📄 FINAL_STATUS.md                   # Final status
├── 📄 humanwork_business_doc.md          # Business documentation
│
├── 🔧 Configuration Files
├── .env                                 # Environment template (commit)
├── .env.local                           # Local secrets (DO NOT commit)
├── .env.local.example                   # ✨ NEW: Complete env template
├── .gitignore
├── foundry.toml                         # Foundry configuration
├── remappings.txt                       # Contract remappings
├── makefile                             # Build commands
│
├── 📜 Smart Contracts
├── src/
│   ├── MockUSDC.sol                    # ERC-20 stablecoin
│   ├── UserRegistry.sol                # User management
│   ├── ProjectEscrow.sol               # Project & escrow management
│   ├── AIOracle.sol                    # AI dispute resolution
│   ├── DisputeJury.sol                 # Jury system
│   ├── SkillTrial.sol                  # Skill verification
│   ├── GasSponsor.sol                  # Gas sponsorship
│   ├── InsurancePool.sol               # Insurance
│   ├── EnterpriseAccess.sol            # Enterprise features
│   ├── AgencyRegistry.sol              # Agency management
│   ├── interfaces/
│   │   └── IZKVerifier.sol             # ZK verification interface
│   └── mocks/
│       ├── MockUSDC.sol                # Mock stablecoin
│       └── MockVerifier.sol            # Mock verifier
│
├── test/
│   ├── AgencyRegistry.t.sol
│   ├── AIOracle.t.sol
│   ├── DisputeJury.t.sol
│   ├── EnterpriseAccess.t.sol
│   ├── GasSponsor.t.sol
│   ├── InsurancePool.t.sol
│   ├── Integration.t.sol
│   ├── ProjectEscrow.t.sol
│   ├── SkillTrial.t.sol
│   └── UserRegistry.t.sol
│
├── script/
│   └── Deploy.s.sol                    # Deployment script
│
├── 🔌 Backend
├── backend/
│   ├── package.json                    # ✨ UPDATED: All dependencies
│   ├── tsconfig.json
│   ├── .env                            # Backend config
│   │
│   ├── src/
│   │   ├── listener.ts                 # Main event listener
│   │   ├── logger.ts                   # Logging system
│   │   ├── database.ts                 # Database layer
│   │   ├── reputation.ts               # Reputation system
│   │   ├── ai-engine.ts                # AI engine
│   │   ├── api.ts                      # Original API
│   │   ├── api-v2.ts                   # ✨ NEW: Enhanced API v2
│   │   ├── auth.ts                     # Auth logic
│   │   │
│   │   ├── 📦 modules/                 # ✨ NEW: Modular architecture
│   │   │   ├── auth/                   # Authentication
│   │   │   │   ├── jwt.ts              # JWT token management
│   │   │   │   ├── email.ts            # Email verification
│   │   │   │   └── wallet.ts           # Wallet authentication
│   │   │   │
│   │   │   ├── storage/                # Decentralized storage
│   │   │   │   └── filecoin.ts         # Filecoin/IPFS integration
│   │   │   │
│   │   │   ├── ai/                     # AI & ML services
│   │   │   │   └── huggingface.ts      # Hugging Face integration
│   │   │   │
│   │   │   ├── messaging/              # Real-time messaging
│   │   │   │   └── websocket.ts        # WebSocket server
│   │   │   │
│   │   │   ├── verification/           # User verification
│   │   │   │   └── kyc.ts              # KYC & verification
│   │   │   │
│   │   │   ├── disputes/               # Dispute resolution
│   │   │   │   └── resolver.ts         # AI-powered resolver
│   │   │   │
│   │   │   └── utils/                  # Utilities
│   │   │       ├── validators.ts
│   │   │       ├── helpers.ts
│   │   │       └── constants.ts
│   │   │
│   │   ├── middleware/                 # ✨ TODO: Express middleware
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── logging.ts
│   │   │
│   │   ├── models/                     # ✨ TODO: Database models
│   │   │   ├── User.ts
│   │   │   ├── Project.ts
│   │   │   ├── Dispute.ts
│   │   │   └── Message.ts
│   │   │
│   │   └── job_db.json                 # Job queue storage
│   │
│   └── logs/                           # ✨ NEW: Logging directory
│
├── 🎨 Frontend
├── frontend/
│   ├── package.json                    # ✨ UPDATED: Dependencies
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── index.html
│   │
│   ├── src/
│   │   ├── main.tsx                    # Entry point
│   │   ├── App.tsx                     # Root component
│   │   ├── index.css
│   │   ├── App.css
│   │   │
│   │   ├── 📄 pages/                   # ✨ NEW: Page components
│   │   │   ├── Home.tsx                # Landing page
│   │   │   ├── Dashboard.tsx           # Main dashboard
│   │   │   ├── Projects.tsx            # Project listing
│   │   │   ├── ProjectDetail.tsx       # Project view
│   │   │   ├── Disputes.tsx            # Dispute listing
│   │   │   ├── Chat.tsx                # Dispute chat
│   │   │   ├── Profile.tsx             # User profile
│   │   │   └── Verification.tsx        # KYC verification
│   │   │
│   │   ├── 🎛️ components/              # Reusable components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DisputeHistory.tsx
│   │   │   ├── UserProfile.tsx
│   │   │   ├── Header.tsx              # ✨ TODO
│   │   │   ├── Footer.tsx              # ✨ TODO
│   │   │   ├── ProjectCard.tsx         # ✨ TODO
│   │   │   ├── DisputeCard.tsx         # ✨ TODO
│   │   │   ├── ChatBox.tsx             # ✨ TODO
│   │   │   ├── FileUpload.tsx          # ✨ TODO
│   │   │   └── FormComponents.tsx      # ✨ TODO
│   │   │
│   │   ├── 🧭 context/                 # ✨ NEW: Context API
│   │   │   ├── AuthContext.tsx         # Auth state
│   │   │   └── AppContext.tsx          # Global state
│   │   │
│   │   ├── 🪝 hooks/                   # ✨ NEW: Custom hooks
│   │   │   ├── useAuth.ts              # Auth hook
│   │   │   ├── useContract.ts          # Contract interaction
│   │   │   └── useApi.ts               # API calls
│   │   │
│   │   ├── 🌐 services/                # ✨ NEW: Services
│   │   │   ├── api.ts                  # API client
│   │   │   ├── wallet.ts               # Wallet service
│   │   │   ├── contract.ts             # Contract interaction
│   │   │   └── socket.ts               # WebSocket client
│   │   │
│   │   ├── 🎨 styles/                  # Component styles
│   │   │   ├── Dashboard.css
│   │   │   ├── DisputeHistory.css
│   │   │   ├── UserProfile.css
│   │   │   ├── variables.css           # ✨ TODO: Design tokens
│   │   │   └── global.css              # ✨ TODO: Global styles
│   │   │
│   │   ├── 🛠️ utils/                   # ✨ NEW: Utilities
│   │   │   ├── validation.ts
│   │   │   ├── formatting.ts
│   │   │   ├── constants.ts
│   │   │   └── helpers.ts
│   │   │
│   │   └── vite-env.d.ts
│   │
│   └── public/                         # ✨ TODO: Static assets
│
├── 📚 lib/
├── forge-std/                          # Foundry standard library
├── openzeppelin-contracts/             # OpenZeppelin contracts
│
├── 📦 Deployment & Cache
├── out/                                # Compiled contracts
├── cache/
│   └── solidity-files-cache.json
├── frontend_handover/
│   └── addresses.json                  # Deployed addresses
│
├── 🧪 Testing
├── test_system.sh                      # System integration test
├── test_system_v2.sh                   # ✨ NEW: Enhanced test script
│
└── 📋 Additional Files
    ├── DEPLOYMENT_LOG.md
    ├── DEPLOYMENT_RECOVERY.md
    ├── GETTING_STARTED.md
    ├── QUICK_START.md
```

---

## Backend Module Architecture

```
backend/src/modules/
│
├── auth/                        # Authentication
│   ├── jwt.ts                  # JWT token handling
│   ├── email.ts                # Email verification
│   ├── wallet.ts               # Wallet signature verification
│   └── __tests__/              # Unit tests (TODO)
│
├── storage/                     # Decentralized Storage
│   ├── filecoin.ts             # Filecoin/IPFS via NFT.storage
│   ├── S3.ts                   # AWS S3 (optional)
│   └── __tests__/
│
├── ai/                          # AI & Machine Learning
│   ├── huggingface.ts          # Text analysis, skill verification
│   ├── models.ts               # Model management (TODO)
│   └── __tests__/
│
├── messaging/                   # Real-Time Messaging
│   ├── websocket.ts            # WebSocket server
│   ├── events.ts               # Event definitions (TODO)
│   └── __tests__/
│
├── verification/               # Identity Verification
│   ├── kyc.ts                  # KYC verification
│   ├── zk.ts                   # Zero-knowledge proofs (TODO)
│   └── __tests__/
│
└── disputes/                    # Dispute Resolution
    ├── resolver.ts             # AI-powered resolver
    ├── jury.ts                 # Jury voting (TODO)
    └── __tests__/
```

---

## Frontend Component Hierarchy

```
App
├── AuthProvider
│   ├── Header
│   ├── NavigationMenu
│   ├── Routes
│   │   ├── Home
│   │   ├── Dashboard
│   │   │   ├── ProjectCard (map)
│   │   │   ├── DisputeCard (map)
│   │   │   └── Stats
│   │   ├── Projects
│   │   │   ├── ProjectList
│   │   │   ├── ProjectFilter
│   │   │   └── ProjectCard (map)
│   │   ├── ProjectDetail
│   │   │   ├── ProjectHeader
│   │   │   ├── Milestones
│   │   │   └── Chat
│   │   ├── Disputes
│   │   │   ├── DisputeList
│   │   │   └── DisputeCard (map)
│   │   ├── Chat
│   │   │   ├── ChatBox
│   │   │   ├── FileUpload
│   │   │   └── ChatHistory
│   │   ├── Profile
│   │   │   ├── UserInfo
│   │   │   ├── Reputation
│   │   │   └── VerificationStatus
│   │   └── Verification
│   │       ├── KYCForm
│   │       ├── SkillTest
│   │       └── DocumentUpload
│   └── Footer
└── SocketProvider (for WebSocket)
```

---

## Data Models (MongoDB)

```javascript
// Users Collection
{
  _id: ObjectId,
  address: string (unique),
  email: string,
  name: string,
  role: enum['client', 'freelancer', 'arbiter'],
  profileImage: string (CID),
  bio: string,
  skills: string[],
  rating: number (0-5),
  totalProjects: number,
  completedProjects: number,
  kycStatus: enum['pending', 'verified', 'rejected'],
  kycData: {},
  reputation: number,
  createdAt: date,
  updatedAt: date
}

// Projects Collection
{
  _id: ObjectId,
  projectId: number (blockchain),
  title: string,
  description: string,
  clientAddress: string,
  freelancerAddress: string,
  totalAmount: number,
  milestones: [{
    id: number,
    title: string,
    amount: number,
    dueDate: date,
    status: enum['pending', 'submitted', 'approved', 'disputed']
  }],
  status: enum['active', 'completed', 'cancelled'],
  createdAt: date,
  completedAt: date
}

// Disputes Collection
{
  _id: ObjectId,
  disputeId: number (blockchain),
  projectId: number,
  clientAddress: string,
  freelancerAddress: string,
  reason: string,
  aiAnalysis: {
    verdict: string,
    confidence: number,
    reasoning: string
  },
  juryVotes: [{
    juror: string,
    vote: string,
    timestamp: date
  }],
  resolution: {},
  status: enum['open', 'resolved'],
  createdAt: date,
  resolvedAt: date
}

// Messages Collection
{
  _id: ObjectId,
  disputeId: number,
  senderAddress: string,
  message: string,
  attachments: [{
    type: string,
    cid: string,
    url: string
  }],
  timestamp: date
}
```

---

## API Endpoints Structure

```
Authentication
  POST   /api/auth/message              # Get auth message
  POST   /api/auth/send-email           # Send verification email
  POST   /api/auth/verify-email         # Verify email OTP
  POST   /api/auth/login                # Wallet login
  POST   /api/auth/refresh              # Refresh token

Storage
  POST   /api/storage/upload            # Upload file to Filecoin
  GET    /api/storage/:cid              # Download file from IPFS

AI & Analysis
  POST   /api/ai/analyze-text           # Text sentiment analysis
  POST   /api/ai/verify-skills          # Skill verification
  POST   /api/ai/analyze-dispute        # Dispute analysis

Verification
  POST   /api/verification/kyc          # KYC initiation
  POST   /api/verification/gst          # GST verification
  POST   /api/verification/pan          # PAN verification

Disputes
  POST   /api/disputes/:id/resolve      # Create resolution
  GET    /api/disputes/:id/resolution   # Get resolution
  POST   /api/disputes/:id/vote         # Record jury vote

Projects (TODO)
  GET    /api/projects                  # List projects
  POST   /api/projects                  # Create project
  GET    /api/projects/:id              # Get project
  PUT    /api/projects/:id              # Update project

Users (TODO)
  GET    /api/users/:address            # Get user
  PUT    /api/users/:address            # Update profile
  GET    /api/users/:address/reputation # User reputation
```

---

## Environment Configuration

```env
# Blockchain
PRIVATE_KEY=                    # Your private key
ORACLE_ADDRESS=                 # AI worker address
HEDERA_TESTNET_RPC=            # RPC endpoint

# Contracts
STABLECOIN_ADDRESS=
USER_REGISTRY_ADDRESS=
PROJECT_ESCROW_ADDRESS=
AI_ORACLE_CONTRACT_ADDRESS=
DISPUTE_JURY_CONTRACT_ADDRESS=

# Backend API
API_PORT=3000
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Authentication
JWT_SECRET=
JWT_EXPIRY=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@humanwork.io

# Database
MONGODB_URI=mongodb://localhost:27017/humanwork

# Storage
NFT_STORAGE_TOKEN=

# AI
HUGGING_FACE_API_KEY=

# Verification
ZK_KYC_API_KEY=
GST_API_KEY=
PAN_API_KEY=
```

---

## Development Workflow

### 1. Local Development
```bash
# Start MongoDB
mongod

# Terminal 1: Backend
cd backend
npm install
npm start

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Terminal 3: Watch contracts
forge build --watch
```

### 2. Testing
```bash
# Unit tests (TODO)
npm test

# Integration tests
./test_system_v2.sh

# Smart contract tests
make test
```

### 3. Deployment
```bash
# Build
make build

# Deploy to testnet
make deploy-testnet

# Deploy to production
# Follow DEPLOYMENT.md guide
```

---

## Key Technologies

```
Blockchain:     Solidity, Foundry, Hedera
Backend:        Node.js, Express, TypeScript
Frontend:       React, Vite, TypeScript
Database:       MongoDB
Storage:        Filecoin/IPFS (NFT.storage)
AI:             Hugging Face
Real-time:      Socket.io
Authentication: JWT, Email, Wallet signing
```

---

## Common Tasks

```bash
# Install all dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Start development
npm run dev  # Starts all services

# Build for production
npm run build

# Run tests
npm test

# Format code
npm run fmt

# Lint code
npm run lint

# Deploy
npm run deploy
```

---

## File Naming Conventions

- **Services/APIs:** `service.ts` (e.g., `api.ts`)
- **Modules:** `module-name/` (e.g., `auth/`)
- **Components:** `ComponentName.tsx` (e.g., `Dashboard.tsx`)
- **Hooks:** `useHookName.ts` (e.g., `useAuth.ts`)
- **Types:** `types.ts` or `types/` folder
- **Constants:** `constants.ts`
- **Utils:** `utils.ts` or `utils/` folder
- **Tests:** `*.test.ts` or `__tests__/` folder

---

## Status Dashboard

| Component | Status | Last Updated |
|-----------|--------|--------------|
| Smart Contracts | ✅ Complete | Dec 3, 2024 |
| Backend Auth | ✅ Complete | Dec 3, 2024 |
| Backend Storage | ✅ Complete | Dec 3, 2024 |
| Backend AI | ✅ Complete | Dec 3, 2024 |
| Backend Messaging | ✅ Complete | Dec 3, 2024 |
| Backend Verification | ✅ Complete | Dec 3, 2024 |
| Backend Disputes | ✅ Complete | Dec 3, 2024 |
| API Endpoints v2 | ✅ Complete | Dec 3, 2024 |
| Frontend Pages | 🔄 In Progress | - |
| Frontend Components | 🔄 In Progress | - |
| Database Models | 📋 Todo | - |
| Middleware | 📋 Todo | - |
| Tests | 📋 Todo | - |
| Documentation | ✅ Complete | Dec 3, 2024 |

---

**This is your complete project blueprint. Everything is organized and ready for development!** 🚀
