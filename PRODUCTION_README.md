# 🏗️ HumanWork Protocol - Production Ready Platform

**Decentralized Freelancing Platform with AI-Powered Dispute Resolution**

Built on **Hedera Hashgraph**, **Filecoin**, and **Hugging Face**. Zero platform fees. Trustless verification. Smart contracts for escrow and reputation.

## ⚡ Quick Start (5 minutes)

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask or compatible wallet (for Hedera testnet)

### 1. Clone and Install

```bash
git clone <repo>
cd Clone

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Setup

**Backend (.env):**
```bash
cd backend
cp .env.example .env
# Edit .env with your keys (see .env.example for details)
```

**Frontend (.env.local):**
```bash
cd ../frontend
cp .env.local.example .env.local
# Update VITE_BACKEND_URL=http://localhost:3000
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### 4. Access the Application
- **Frontend:** http://localhost:5173
- **Backend Health:** http://localhost:3000/health
- **API Docs:** See API Reference below

---

## 📋 Architecture Overview

### Frontend Stack
- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS v4 with 1inch-inspired color scheme
- **Routing:** React Router v6
- **Real-time:** Socket.io for WebSocket messaging
- **UI Components:** Lucide React icons
- **Build Tool:** Vite 5

### Backend Stack
- **Server:** Express.js + TypeScript
- **Real-time:** Socket.io server
- **Authentication:** JWT + Email OTP + Wallet signing
- **Database:** MongoDB (Atlas free tier) / SQLite (local dev)
- **Storage:** Filecoin via NFT.storage
- **AI:** Hugging Face API for analysis

### Smart Contracts (Hedera Testnet)
1. **UserRegistry.sol** - User profiles and KYC verification
2. **AgencyRegistry.sol** - Agency management and ratings
3. **ProjectEscrow.sol** - Project funds escrow and milestone tracking
4. **DisputeJury.sol** - Jury voting and dispute resolution
5. **AIOracle.sol** - AI analysis results posting
6. **SkillTrial.sol** - Skill verification testing
7. **InsurancePool.sol** - Dispute insurance pool
8. **GasSponsor.sol** - Sponsor gas fees for users
9. **EnterpriseAccess.sol** - Enterprise tier features

---

## 🎨 Design System

### Color Palette (1inch Inspired)
- **Primary:** `#6fa3ff` (Vivid Blue)
- **Accent:** `#00d4ff` (Cyan)
- **Dark BG:** `#0f1419` (Navy Black)
- **Secondary:** `#1a2332` (Slate)

### Pages & Features

#### Public Pages
- **Home (/)** - Landing page with features and CTA
- **Browse Projects** - Discover available projects

#### Authenticated Pages
- **Dashboard (/dashboard)** - Overview, recent projects, open disputes
- **Projects (/projects)** - Project management and browsing
- **Disputes (/disputes)** - View and manage disputes
- **Profile (/profile)** - User profile and verification

---

## 🔌 API Reference

### Authentication Endpoints

#### GET `/api/auth/message`
Get message to sign for wallet authentication
```bash
curl http://localhost:3000/api/auth/message
```

#### POST `/api/auth/send-email`
Send OTP to email for verification
```bash
curl -X POST http://localhost:3000/api/auth/send-email \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

#### POST `/api/auth/verify-email`
Verify email with OTP code
```bash
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","code":"123456"}'
```

#### POST `/api/auth/login`
Login with wallet signature
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "address":"0x...",
    "signature":"0x...",
    "message":"Sign this..."
  }'
```

### Project Endpoints

#### GET `/api/projects`
List all projects
```bash
curl http://localhost:3000/api/projects
```

#### GET `/api/projects/:id`
Get single project details
```bash
curl http://localhost:3000/api/projects/1
```

#### POST `/api/projects`
Create new project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Project Name",
    "description":"Description",
    "budget":5000,
    "skillsRequired":["React","Node.js"]
  }'
```

### Dispute Endpoints

#### GET `/api/disputes`
List all disputes
```bash
curl http://localhost:3000/api/disputes
```

#### GET `/api/disputes/:id`
Get dispute details
```bash
curl http://localhost:3000/api/disputes/1
```

#### POST `/api/disputes`
Create new dispute
```bash
curl -X POST http://localhost:3000/api/disputes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId":1,
    "description":"Issue description"
  }'
```

#### GET `/api/disputes/:id/resolution`
Get AI-powered dispute resolution
```bash
curl http://localhost:3000/api/disputes/1/resolution
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

```bash
cd frontend

# Build
npm run build

# Deploy to Vercel
npx vercel --prod
```

Update environment variables in Vercel dashboard:
```
VITE_BACKEND_URL=https://api.humanwork.io
VITE_HEDERA_NETWORK=testnet
```

### Backend Deployment (Railway/Render)

```bash
cd backend

# Build
npm run build

# Deploy via CLI
# Railway: railway up
# Render: connect GitHub and auto-deploy
```

Environment variables needed on production server:
- `JWT_SECRET` - Strong secret key
- `MONGODB_URI` - Atlas connection string
- `NFT_STORAGE_KEY` - NFT.storage API key
- `HUGGINGFACE_API_KEY` - Hugging Face API token
- `HEDERA_*` - Hedera testnet credentials
- `EMAIL_*` - SMTP credentials for email OTP

### Smart Contracts Deployment

```bash
cd Clone  # Root directory

# Deploy to Hedera testnet
npx hardhat run scripts/Deploy.s.sol --network hedera-testnet

# Verify contracts
npx hardhat verify --network hedera-testnet <contract-address>
```

---

## 📊 Features

### Authentication
- ✅ Wallet-based login (MetaMask, WalletConnect)
- ✅ Email OTP verification
- ✅ JWT tokens with refresh capability
- ✅ Session persistence in localStorage

### Projects
- ✅ Create and manage projects
- ✅ Budget and skill requirements
- ✅ Project status tracking (Open, In Progress, Completed)
- ✅ Milestone-based payments via smart contract

### Disputes
- ✅ AI-powered dispute analysis using Hugging Face
- ✅ Jury voting system on-chain
- ✅ Automated resolution verdicts
- ✅ Fund distribution based on verdict
- ✅ Real-time chat for dispute discussion

### Storage
- ✅ Decentralized file storage via Filecoin
- ✅ IPFS pinning for permanent access
- ✅ Cryptographic proof of work
- ✅ Zero platform storage fees

### Verification
- ✅ KYC identity verification
- ✅ GST/PAN verification for businesses
- ✅ Skill assessment tests
- ✅ Reputation scoring system

---

## 📁 Project Structure

```
Clone/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API client
│   │   ├── context/         # React Context (Auth)
│   │   ├── styles/          # CSS modules
│   │   └── utils/           # Helper functions
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                 # Express + TypeScript backend
│   ├── src/
│   │   ├── server.ts        # Express app
│   │   ├── api-auth.ts      # Auth routes
│   │   ├── api-projects.ts  # Project routes
│   │   ├── api-disputes.ts  # Dispute routes
│   │   ├── ai-engine.ts     # Hugging Face integration
│   │   ├── database.ts      # DB connection
│   │   ├── logger.ts        # Logging
│   │   └── modules/         # Feature modules
│   ├── tsconfig.json
│   └── package.json
│
├── src/                     # Smart contracts
│   ├── UserRegistry.sol
│   ├── ProjectEscrow.sol
│   ├── DisputeJury.sol
│   ├── AIOracle.sol
│   └── ...
│
├── test/                    # Contract tests
├── script/                  # Deployment scripts
└── README.md
```

---

## 🔐 Security Best Practices

1. **Private Keys:** Never commit .env files with real keys
2. **JWT Secret:** Use strong, random secret in production
3. **CORS:** Restrict to specific domains
4. **Rate Limiting:** Implement on production servers
5. **Input Validation:** Sanitize all user inputs
6. **Contract Audits:** Get smart contracts professionally audited

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is in use
lsof -i :3000
kill -9 <PID>

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Frontend build errors
```bash
# Clear Vite cache
rm -rf frontend/.vite

# Rebuild
npm run build
```

### API calls failing
1. Check backend is running: `curl http://localhost:3000/health`
2. Verify CORS settings in backend
3. Check network tab in browser DevTools
4. Ensure `VITE_BACKEND_URL` is set correctly

---

## 📈 Next Steps

### Production Checklist
- [ ] Deploy smart contracts to Hedera mainnet
- [ ] Setup MongoDB Atlas database
- [ ] Configure email service (SendGrid/AWS SES)
- [ ] Setup Hugging Face API account
- [ ] Configure NFT.storage for file uploads
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway/Render
- [ ] Setup SSL certificates
- [ ] Configure domain names
- [ ] Setup monitoring and logging
- [ ] Conduct security audit
- [ ] Launch beta testing

### Feature Roadmap
- Escrow payment system
- Skill marketplace
- Rating and review system
- Advanced search filters
- Mobile app (React Native)
- Team collaboration features
- Invoice generation
- Tax reporting
- Multi-currency support

---

## 📞 Support

- **Documentation:** See `INTEGRATION_GUIDE.md`
- **Issues:** GitHub Issues
- **Discord:** [Join Community](https://discord.gg/humanwork)
- **Email:** support@humanwork.io

---

## 📄 License

MIT License - See LICENSE file

---

## 🙏 Credits

Built with ❤️ using:
- Hedera Hashgraph
- Filecoin / IPFS
- Hugging Face
- React & Vite
- Tailwind CSS

**Made for the one-night startup challenge** 🚀

---

## Version
- **Current:** 1.0.0
- **Status:** Production Ready
- **Last Updated:** December 3, 2025
