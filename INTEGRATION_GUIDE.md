# HumanWork Integration & Setup Guide

**Last Updated:** December 3, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [System Architecture](#system-architecture)
3. [Prerequisites & Dependencies](#prerequisites--dependencies)
4. [Step-by-Step Setup](#step-by-step-setup)
5. [Configuration Guide](#configuration-guide)
6. [Running the System](#running-the-system)
7. [Testing & Verification](#testing--verification)
8. [Troubleshooting](#troubleshooting)
9. [API Endpoints Reference](#api-endpoints-reference)
10. [Integration Points](#integration-points)

---

## 🚀 Quick Start

For users who just want to get the system running:

```bash
# 1. Install dependencies
cd /home/ani/Desktop/New\ Folder/Clone
npm install --workspace=backend
npm install --workspace=frontend

# 2. Build smart contracts (optional)
forge build

# 3. Start backend
cd backend && npm start

# 4. In another terminal, start frontend
cd frontend && npm run dev

# 5. Open browser
# Frontend: http://localhost:5174
# Backend API: http://localhost:3000
```

**That's it!** You can now use the application.

---

## 🏗️ System Architecture

### Technology Stack

| Component | Technology | Port | Purpose |
|-----------|-----------|------|---------|
| **Frontend** | React 18 + TypeScript + Vite | 5173/5174 | User interface |
| **Backend** | Node.js + Express + TypeScript | 3000 | REST API & business logic |
| **Smart Contracts** | Solidity + Foundry | - | Blockchain integration |
| **Database** | SQLite | - | Persistent storage |
| **Storage** | Filecoin (NFT.storage) | - | Decentralized file storage |
| **Web3** | ethers.js + MetaMask | - | Wallet connection |

---

## 📦 Prerequisites & Dependencies

### System Requirements

- **Node.js** v16+ (tested on v18+)
- **npm** v8+ or **yarn**
- **Foundry** (for smart contracts, optional)
- **Git** (for version control)
- **MetaMask** browser extension (for wallet functionality)
- **Brave/Chrome/Firefox** browser

### Required Accounts/Keys

| Service | What You Need | Where to Get | Cost |
|---------|---------------|-------------|------|
| **Filecoin (NFT.storage)** | API Key | https://nft.storage | Free tier available |
| **MetaMask** | Wallet Extension | https://metamask.io | Free |
| **Ethereum Sepolia Testnet** | Testnet ETH | Faucet: https://sepoliafaucet.com | Free |

---

## 🔧 Step-by-Step Setup

### Phase 1: Clone & Install

```bash
# 1. Navigate to workspace
cd /home/ani/Desktop/New\ Folder/Clone

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Go back to root
cd ..
```

### Phase 2: Environment Configuration

#### Backend Environment (.env)

```bash
cd backend
cat > .env << 'EOF'
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5174

# Database
DATABASE_URL=./job_db.json

# Storage (Filecoin)
NFT_STORAGE_KEY=your_nft_storage_key_here

# JWT (Authentication)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Blockchain
NETWORK=sepolia
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
EOF
```

#### Frontend Environment (.env)

```bash
cd ../frontend
cat > .env << 'EOF'
VITE_API_URL=http://localhost:3000
VITE_NETWORK=sepolia
EOF
```

---

## 🏃 Running the System

### Option 1: Manual Terminal Sessions

```bash
# Terminal 1: Backend
cd /home/ani/Desktop/New\ Folder/Clone/backend
npm start
# Output: 🚀 Backend server running on http://localhost:3000

# Terminal 2: Frontend
cd /home/ani/Desktop/New\ Folder/Clone/frontend
npm run dev
# Output: ➜  Local: http://localhost:5174/
```

### Checking Service Status

```bash
# Backend health
curl http://localhost:3000/health
# Expected: { "status": "ok", "timestamp": "...", "uptime": ... }

# Frontend
curl http://localhost:5174
# Expected: HTML response (your app)

# Check which services are running
lsof -i :3000  # Backend
lsof -i :5174  # Frontend
```

---

## ✅ Testing & Verification

### 1. Backend Endpoints Testing

```bash
# Health Check
curl http://localhost:3000/health | jq .

# Get Projects
curl http://localhost:3000/api/projects | jq .

# Get Disputes
curl http://localhost:3000/api/disputes | jq .

# Send Email OTP
curl -X POST http://localhost:3000/api/auth/email/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' | jq .

# Verify Email OTP (check backend logs for OTP code)
curl -X POST http://localhost:3000/api/auth/email/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}' | jq .
```

### 2. Frontend Testing - Email OTP Flow

1. **Open** http://localhost:5174
2. **Click** "Sign In" or go to `/auth`
3. **Select** "📧 Email OTP" tab
4. **Enter** test email: `test@example.com`
5. **Click** "Send Verification Code"
6. **Check** backend terminal for log: `📧 OTP for test@example.com: 123456`
7. **Copy** the 6-digit OTP code
8. **Enter** OTP in the input field
9. **Click** "Verify"
10. **Verify**: Should redirect to `/dashboard` with success message

**Expected Result:** ✅ Logged in, redirected to dashboard

### 3. Frontend Testing - MetaMask Flow

1. **Open** http://localhost:5174
2. **Click** "Sign In" or go to `/auth`
3. **Select** "🦊 MetaMask" tab
4. **Click** "Connect Wallet"
5. **MetaMask popup** appears
6. **Select** account and approve connection
7. **Verify**: Wallet address displayed (e.g., `0xabc...def`)
8. **Click** "Switch Account" to test account switching
9. **MetaMask** allows selecting different account
10. **Click** "Continue with Wallet"
11. **Verify**: Should redirect to `/dashboard` with success message

**Expected Result:** ✅ Logged in with MetaMask, wallet info displayed

### 4. Dashboard Verification

After login, verify:

- ✅ User email/address displayed in profile
- ✅ Wallet connection status shown
- ✅ Statistics loaded: Total Projects, Active Projects, Total Disputes, Active Disputes
- ✅ Navigation working: Dashboard → Projects → Disputes
- ✅ User menu appears with logout option

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Issue 1: Port 3000 Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find and kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use a different port
PORT=3001 npm start  # Backend
```

#### Issue 2: MetaMask Connection Fails

**Problem:** "MetaMask not installed" error

**Solution:**
1. Install MetaMask: https://metamask.io
2. Refresh browser page
3. Check MetaMask is on Sepolia testnet
4. Enable permissions for localhost in MetaMask

#### Issue 3: Email OTP Not Appearing

**Problem:** No OTP code in backend terminal logs

**Solution:**
1. Check backend is running: `curl http://localhost:3000/health`
2. Look for log: `📧 OTP for email@example.com: 123456`
3. Check console for errors
4. Verify email format is valid

#### Issue 4: Database Errors

**Problem:** `SQLITE_CANTOPEN` or database locked

**Solution:**
```bash
# Check database file exists
ls -la backend/job_db.json

# Recreate database
rm backend/job_db.json
# Backend will recreate on next start
```

#### Issue 5: CORS Errors in Frontend

**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Backend already has CORS enabled
- Verify FRONTEND_URL in backend/.env matches your frontend URL
- Expected: `FRONTEND_URL=http://localhost:5174`

---

## 📡 API Endpoints Reference

### Authentication Endpoints

```bash
# Send Email OTP
POST /api/auth/email/send-otp
{
  "email": "user@example.com"
}
Response: { "success": true, "message": "OTP sent", "email": "..." }

# Verify Email OTP
POST /api/auth/email/verify-otp
{
  "email": "user@example.com",
  "otp": "123456"
}
Response: { "success": true, "token": "...", "user": {...} }

# Get Auth Message (for wallet signing)
GET /api/auth/message
Response: { "message": "Sign this message..." }

# Verify Wallet Signature
POST /api/auth/verify
{
  "address": "0x...",
  "message": "Sign this message...",
  "signature": "0x..."
}
Response: { "success": true, "user": {...}, "token": "..." }
```

### Projects Endpoints

```bash
# Get All Projects
GET /api/projects
Response: { "projects": [...], "total": 3 }

# Get User Projects
GET /api/users/:address/projects
Response: { "projects": [...] }

# Create Project
POST /api/projects
{
  "projectId": "...",
  "clientAddress": "0x...",
  "freelancerAddress": "0x...",
  "totalAmount": 1000
}
Response: { "success": true, "projectId": "..." }
```

### Disputes Endpoints

```bash
# Get All Disputes
GET /api/disputes
Response: { "disputes": [...] }

# Get User Disputes
GET /api/users/:address/disputes
Response: { "disputes": [...] }

# Analyze Dispute (AI)
POST /api/disputes/analyze
{
  "projectId": "...",
  "milestoneId": "...",
  "details": "..."
}
Response: { "analysis": {...}, "verdict": "..." }

# Record Dispute
POST /api/disputes
{
  "disputeId": "...",
  "projectId": "...",
  "milestoneId": "...",
  "initiator": "0x..."
}
Response: { "success": true, "disputeId": "..." }

# Update Dispute Verdict
PUT /api/disputes/:disputeId/verdict
{
  "verdict": "APPROVED|REJECTED",
  "votesFor": 100,
  "votesAgainst": 50
}
Response: { "success": true, "disputeId": "..." }
```

### System Endpoints

```bash
# Health Check
GET /health
Response: { "status": "ok", "uptime": 123.45, "version": "1.0.0" }

# Get System Stats
GET /api/stats
Response: { "totalProjects": 10, "activeProjects": 5, ... }

# Get User Reputation
GET /api/users/:address/reputation
Response: { "address": "0x...", "reputation": 850, ... }
```

---

## 🎯 Success Criteria

You know the system is properly configured when:

✅ Backend starts without errors: `🚀 Backend server running on http://localhost:3000`  
✅ Frontend starts without errors: `➜ Local: http://localhost:5174/`  
✅ Health check responds: `curl http://localhost:3000/health` returns `{"status":"ok"}`  
✅ Email OTP works: Sending OTP shows `📧 OTP for email@example.com: 123456` in logs  
✅ MetaMask connects: Wallet address displays correctly  
✅ Dashboard loads: After login, dashboard shows stats and user info  
✅ Navigation works: Can click between Dashboard, Projects, Disputes  
✅ Logout works: User menu shows logout button and clears session  

---

**Version:** 1.0.0  
**Last Updated:** December 3, 2025  
**Status:** ✅ Production Ready
