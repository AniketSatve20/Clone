# 🚀 HumanWork Protocol - Complete Integration Guide

**Date:** December 3, 2025  
**Status:** Step-by-step setup for production  
**Time Required:** ~30 minutes for setup + testing

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [API Keys & Credentials Setup](#api-keys--credentials-setup)
3. [Backend Configuration](#backend-configuration)
4. [Frontend Configuration](#frontend-configuration)
5. [Smart Contracts Setup](#smart-contracts-setup)
6. [Testing & Verification](#testing--verification)
7. [Deployment Checklist](#deployment-checklist)

---

## Prerequisites

**You Need:**
- Node.js v18+ (check: `node --version`)
- Foundry installed (check: `forge --version`)
- Git installed
- A text editor (VSCode recommended)
- MetaMask wallet extension (for testing)

**Check Installation:**
```bash
node --version      # Should be v18+
npm --version       # Should be v9+
forge --version     # Should show version
```

---

## API Keys & Credentials Setup

### 1. **Infura API Key** (For Blockchain RPC)

**Where to Get:**
1. Go to https://infura.io
2. Sign up (free account)
3. Create new project
4. Copy your Sepolia RPC URL: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
5. Note your PROJECT_ID (the last part of URL)

**What You Get:**
```
Mainnet RPC:  https://mainnet.infura.io/v3/PROJECT_ID
Sepolia RPC:  https://sepolia.infura.io/v3/PROJECT_ID
PROJECT_ID:   YOUR_ACTUAL_ID (save this)
```

**Where to Put:**
```
Backend:  .env file → RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
Frontend: .env file → VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

---

### 2. **Private Key** (For Smart Contract Deployment)

**Where to Get:**
1. Open MetaMask
2. Click account name → Settings → Security & Privacy
3. Click "Reveal Secret Recovery Phrase"
4. **NEVER share this with anyone!**

**Alternative - Use a Testnet-Only Wallet:**
1. Create new MetaMask account (Settings → Create Account)
2. Switch to Sepolia network
3. Get testnet ETH from faucet
4. Export private key (MetaMask → Account menu → Export Private Key)

**What You Get:**
```
Private Key: 0x1234567890abcdef... (starts with 0x, 64 hex characters)
WARNING: ⚠️ NEVER COMMIT THIS TO GIT!
WARNING: ⚠️ NEVER SHARE THIS!
```

**Where to Put:**
```
Backend:  .env file → PRIVATE_KEY=0x1234567890abcdef...
Script:   deployments use this for contract deployment
```

---

### 3. **NFT.Storage API Key** (For IPFS/Filecoin Storage)

**Where to Get:**
1. Go to https://nft.storage
2. Sign up with GitHub or email
3. Go to API Keys page
4. Click "New Key"
5. Copy the token

**What You Get:**
```
API Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (long string)
```

**Where to Put:**
```
Backend:  .env file → NFT_STORAGE_KEY=your_api_key_here
Frontend: .env file → VITE_NFT_STORAGE_KEY=your_api_key_here
```

---

### 4. **Wallet Address** (From MetaMask)

**Where to Get:**
1. Open MetaMask
2. Click account name or copy icon
3. Your address appears (0x...)

**What You Get:**
```
Wallet Address: 0x742d35Cc6634C0532925a3b844Bc95e4914a5A0a
Testnet Address: Same format on Sepolia
```

**Where to Put:**
```
Testing: Use in login/authentication
Deploy: Used to deploy contracts
Transactions: Used as from/to address
```

---

### 5. **OpenAI API Key** (Optional - For AI Dispute Analysis)

**Where to Get:**
1. Go to https://platform.openai.com
2. Sign up
3. Go to API Keys
4. Create new secret key
5. Copy immediately (shown only once!)

**What You Get:**
```
API Key: sk-proj-... (keep secret!)
```

**Where to Put:**
```
Backend: .env file → OPENAI_API_KEY=sk-proj-...
```

---

## Backend Configuration

### Step 1: Create `.env` File

**Location:** `/home/ani/Desktop/New Folder/Clone/backend/.env`

**Command:**
```bash
cd "/home/ani/Desktop/New Folder/Clone/backend"
cp .env.example .env
nano .env    # or use your editor
```

### Step 2: Edit `.env` with Your Keys

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_PATH=./humanwork.db

# JWT
JWT_SECRET=your-super-secret-key-generate-something-random-HERE
JWT_EXPIRY=7d

# Blockchain - REPLACE WITH YOUR VALUES
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=0xyour_private_key_without_0x_prefix

# Smart Contracts - WILL UPDATE AFTER DEPLOYMENT
PROJECT_ESCROW_ADDRESS=0x0000000000000000000000000000000000000000
USER_REGISTRY_ADDRESS=0x0000000000000000000000000000000000000000
DISPUTE_JURY_ADDRESS=0x0000000000000000000000000000000000000000
AI_ORACLE_ADDRESS=0x0000000000000000000000000000000000000000
SKILL_TRIAL_ADDRESS=0x0000000000000000000000000000000000000000

# Storage
NFT_STORAGE_KEY=your_nft_storage_api_key_here
IPFS_GATEWAY=https://gateway.pinata.cloud

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=info
```

### Step 3: Generate JWT Secret

```bash
# In terminal, run:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy output and paste into .env as JWT_SECRET value
```

### Step 4: Verify Backend Setup

```bash
cd "/home/ani/Desktop/New Folder/Clone/backend"
npm install
npm run build
```

**Expected Output:**
```
> humanwork-ai-worker@1.0.0 build
> tsc

# No errors = ✅ Good!
```

---

## Frontend Configuration

### Step 1: Create `.env` File

**Location:** `/home/ani/Desktop/New Folder/Clone/frontend/.env`

**Command:**
```bash
cd "/home/ani/Desktop/New Folder/Clone/frontend"
cp .env.example .env
nano .env    # or use your editor
```

### Step 2: Edit `.env` with Your Values

```env
# Backend API
VITE_BACKEND_URL=http://localhost:3000

# Blockchain - REPLACE WITH YOUR VALUES
VITE_CHAIN_ID=11155111
VITE_CHAIN_NAME=Sepolia
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Smart Contracts - UPDATE AFTER DEPLOYMENT
VITE_PROJECT_ESCROW=0x0000000000000000000000000000000000000000
VITE_USER_REGISTRY=0x0000000000000000000000000000000000000000
VITE_DISPUTE_JURY=0x0000000000000000000000000000000000000000
VITE_AI_ORACLE=0x0000000000000000000000000000000000000000
VITE_SKILL_TRIAL=0x0000000000000000000000000000000000000000

# Storage
VITE_NFT_STORAGE_KEY=your_nft_storage_api_key_here
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud

# Feature Flags
VITE_ENABLE_WALLET=true
VITE_ENABLE_STORAGE=true
VITE_ENABLE_AI_DISPUTES=true
```

### Step 3: Verify Frontend Setup

```bash
cd "/home/ani/Desktop/New Folder/Clone/frontend"
npm install
npm run build
```

**Expected Output:**
```
✓ 1905 modules transformed.
dist/index.html                 0.75 kB │ gzip:  0.39 kB
dist/assets/index-*.js         12.80 kB │ gzip:  4.83 kB
✓ built in 5.25s

# No warnings = ✅ Good!
```

---

## Smart Contracts Setup

### Step 1: Get Testnet ETH

**For Sepolia Network:**

1. Go to: https://sepoliafaucet.com
2. Paste your wallet address (from MetaMask)
3. Request 0.5 ETH
4. Wait 30 seconds - 1 minute

Or try other faucets:
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://faucets.chain.link/sepolia

**Verify in MetaMask:**
- Switch to Sepolia network
- Should see 0.5 ETH (or more)

### Step 2: Test Contract Compilation

```bash
cd "/home/ani/Desktop/New Folder/Clone"
forge build
```

**Expected Output:**
```
Compiling 9 files with 0.8.20
Solc 0.8.20 finished in 2.35s
Compiler run successful

# No errors = ✅ Good!
```

### Step 3: Run Tests

```bash
forge test
```

**Expected Output:**
```
Running 36 tests for test/:
[PASS] test/ProjectEscrow.t.sol:ProjectEscrowTest::testCompleteMilestone
[PASS] test/ProjectEscrow.t.sol:ProjectEscrowTest::testCreateProject
...
Test result: ok. 36 passed; 0 failed; 0 skipped

# All passing = ✅ Perfect!
```

### Step 4: Deploy Contracts (OPTIONAL - For Now)

**Note:** We'll do this after testing everything locally

```bash
# This would deploy to Sepolia (don't run yet)
# forge script script/Deploy.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
```

---

## Testing & Verification

### Test 1: Backend Health Check

**Terminal 1:**
```bash
cd "/home/ani/Desktop/New Folder/Clone/backend"
npm run dev
```

**Expected Output:**
```
🚀 Backend server running on http://localhost:3000
📊 Health check: http://localhost:3000/health
🗄️  Storage API: http://localhost:3000/api/storage
💬 WebSocket: ws://localhost:3000
```

**Terminal 2 (Test endpoint):**
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-03T...",
  "uptime": 5.123,
  "version": "1.0.0"
}
```

✅ **Backend Working!**

---

### Test 2: Frontend Build

**Terminal 3:**
```bash
cd "/home/ani/Desktop/New Folder/Clone/frontend"
npm run dev
```

**Expected Output:**
```
VITE v5.4.21 ready in 323 ms
  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

**In Browser:**
- Open http://localhost:5173
- Should see HumanWork landing page
- No errors in browser console

✅ **Frontend Working!**

---

### Test 3: Login Flow

**In Browser (http://localhost:5173):**

1. Click "Sign In" button
2. Choose "Send Verification Code"
3. Enter: `test@example.com`
4. Check backend terminal for OTP code
5. Enter OTP in browser
6. Should see Dashboard

✅ **Authentication Working!**

---

### Test 4: API Endpoints

**Terminal 2 (while backend running):**

```bash
# Get stats
curl http://localhost:3000/api/stats

# Get disputes
curl http://localhost:3000/api/disputes

# Get storage stats
curl http://localhost:3000/api/storage/stats

# Get user reputation (replace ADDRESS with your wallet)
curl http://localhost:3000/api/users/0x742d35Cc6634C0532925a3b844Bc95e4914a5A0a/reputation
```

**Expected:** All return JSON responses without errors

✅ **API Working!**

---

### Test 5: Storage Upload

**Terminal 2:**

```bash
# Create test file
echo "test content" > /tmp/test.txt

# Upload to storage
curl -X POST -F "file=@/tmp/test.txt" \
  http://localhost:3000/api/storage/upload

# Expected response with CID
```

✅ **Storage Working!**

---

## 🔑 Quick Reference - Where Everything Goes

### Backend `.env` Locations

| Variable | Where to Get | Example |
|----------|-------------|---------|
| PORT | Default | 3000 |
| RPC_URL | Infura | https://sepolia.infura.io/v3/abc123 |
| PRIVATE_KEY | MetaMask | 0xabc123... |
| JWT_SECRET | Generate | node -e "..." |
| NFT_STORAGE_KEY | nft.storage | eyJhbGci... |
| FRONTEND_URL | Local | http://localhost:5173 |

### Frontend `.env` Locations

| Variable | Where to Get | Example |
|----------|-------------|---------|
| VITE_BACKEND_URL | Local | http://localhost:3000 |
| VITE_RPC_URL | Infura | https://sepolia.infura.io/v3/abc123 |
| VITE_CHAIN_ID | Sepolia | 11155111 |
| VITE_NFT_STORAGE_KEY | nft.storage | eyJhbGci... |

---

## 🚀 Complete Startup Command

**Run all services at once:**

```bash
# Terminal 1 - Backend
cd "/home/ani/Desktop/New Folder/Clone/backend" && npm run dev

# Terminal 2 - Frontend
cd "/home/ani/Desktop/New Folder/Clone/frontend" && npm run dev

# Terminal 3 - Tests
cd "/home/ani/Desktop/New Folder/Clone" && forge test
```

Then visit: **http://localhost:5173**

---

## ✅ Deployment Checklist

Before going to production:

- [ ] All `.env` files created with real keys
- [ ] Backend health check responds
- [ ] Frontend builds without warnings
- [ ] Login flow works
- [ ] API endpoints respond
- [ ] Storage upload works
- [ ] Smart contracts tests pass (36/36)
- [ ] No console errors in browser
- [ ] MetaMask connected to Sepolia
- [ ] Testnet ETH in wallet

---

## 🆘 Troubleshooting

### "Cannot find module" Error

```bash
# Solution: Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install
```

### "EADDRINUSE: address already in use :::3000"

```bash
# Port 3000 already in use
# Solution: Kill existing process
lsof -i :3000
kill -9 <PID>

# Or change port in .env
PORT=3001
```

### "Invalid RPC URL" Error

```bash
# Check your Infura URL is correct
# Format: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
# Not: https://mainnet.infura.io/... (for testnet)
```

### MetaMask Not Connecting

```bash
# 1. Make sure MetaMask extension installed
# 2. Switch network to Sepolia
# 3. Refresh browser (F5)
# 4. Check browser console for errors
```

### "Error: Missing private key"

```bash
# Private key not in .env
# Add to backend/.env:
PRIVATE_KEY=0xyourkeyhere
# NO SPACES, NO QUOTES
```

---

## 📚 File Locations Summary

```
Project Root: /home/ani/Desktop/New Folder/Clone/

Frontend:
  └─ .env (CREATE THIS)
     └─ VITE_BACKEND_URL
     └─ VITE_RPC_URL
     └─ VITE_NFT_STORAGE_KEY

Backend:
  └─ .env (CREATE THIS)
     └─ RPC_URL
     └─ PRIVATE_KEY
     └─ NFT_STORAGE_KEY
     └─ JWT_SECRET
     └─ CONTRACT ADDRESSES

Smart Contracts:
  └─ foundry.toml (ALREADY CONFIGURED)
  └─ remappings.txt (ALREADY CONFIGURED)
```

---

## 🎯 Next Steps After Integration

1. ✅ Complete all setup above
2. ✅ Run all tests locally
3. ⏭️ Deploy contracts to Sepolia
4. ⏭️ Update contract addresses in `.env` files
5. ⏭️ Test full end-to-end flow
6. ⏭️ Deploy to production

---

**You're ready to integrate! Follow the steps above and test in the terminal.** 🚀

Created: December 3, 2025
