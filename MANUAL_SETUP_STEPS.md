# 🔧 Manual Setup Steps - Do This NOW

**Duration:** ~20 minutes

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### STEP 1: Get Infura RPC URL (5 minutes)

**1.1 Go to Infura Website**
- Open: https://infura.io
- Click "Sign Up" (top right)
- Create account with email

**1.2 Create Project**
- After login, click "Create new project"
- Name: "HumanWork"
- Select "Web3 API"
- Click "Create"

**1.3 Copy Your RPC URL**
- You'll see three networks
- Click "Sepolia" tab
- Copy the URL that looks like:
  ```
  https://sepolia.infura.io/v3/abc123def456...
  ```
- **SAVE THIS** - You need it for both backend and frontend

**What You Have Now:**
```
RPC_URL = https://sepolia.infura.io/v3/abc123def456...
```

---

### STEP 2: Get NFT.Storage API Key (3 minutes)

**2.1 Go to NFT.Storage**
- Open: https://nft.storage
- Click "Sign in" (top right)
- Use GitHub or email

**2.2 Create API Key**
- Click "API Keys" in sidebar
- Click "+ New Key"
- Name it "HumanWork"
- Click "Create"

**2.3 Copy Your Key**
- It shows one time only
- Copy the entire key
- **SAVE THIS** - You need it for both backend and frontend

**What You Have Now:**
```
NFT_STORAGE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### STEP 3: Get Private Key from MetaMask (2 minutes)

**3.1 Open MetaMask**
- Click MetaMask extension icon
- See "Account X"

**3.2 Export Private Key**
- Click Account icon (top right of MetaMask)
- Click "Settings"
- Click "Security & Privacy" (left sidebar)
- Scroll down to "Reveal seed phrase"
- Click "Reveal Secret Recovery Phrase"
- Enter password
- Copy the 12-word phrase
- **SAVE SAFELY** - This controls your funds!

**Alternative (Safer):**
- Create NEW MetaMask account (just for testing)
- Go to Settings → Create Account
- Use that account's private key instead

**3.3 Get Private Key**
- From Account menu
- Click the account
- Click three dots menu
- Click "Export Private Key"
- Enter password
- Copy the key starting with 0x

**What You Have Now:**
```
PRIVATE_KEY = 0x1234567890abcdef... (64 hex characters after 0x)
```

---

### STEP 4: Get Testnet ETH (5 minutes)

**4.1 Switch MetaMask to Sepolia**
- Click "Ethereum Mainnet" (top of MetaMask)
- Click "Show/hide test networks"
- Toggle ON
- Select "Sepolia"
- See "Sepolia Test Network" selected

**4.2 Get Testnet ETH**
- Go: https://sepoliafaucet.com
- Paste your wallet address (from MetaMask copy button)
- Click "Request 0.5 SEP"
- Wait 30 seconds

**Alternative Faucets (if above doesn't work):**
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://faucets.chain.link/sepolia

**4.3 Verify in MetaMask**
- Should see balance increased
- If not, refresh MetaMask

**What You Have Now:**
```
Wallet has testnet ETH ready for transactions
```

---

### STEP 5: Create Backend .env File (3 minutes)

**5.1 Open Terminal**
```bash
cd "/home/ani/Desktop/New Folder/Clone/backend"
```

**5.2 Create .env File**
```bash
cp .env.example .env
nano .env
```

**5.3 Edit File**
Replace these values:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_PATH=./humanwork.db

# JWT - Generate random
JWT_SECRET=REPLACE_ME
JWT_EXPIRY=7d

# Blockchain - USE YOUR VALUES
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=0xYOUR_PRIVATE_KEY

# Smart Contracts - Leave as is for now
PROJECT_ESCROW_ADDRESS=0x0000000000000000000000000000000000000000
USER_REGISTRY_ADDRESS=0x0000000000000000000000000000000000000000
DISPUTE_JURY_ADDRESS=0x0000000000000000000000000000000000000000
AI_ORACLE_ADDRESS=0x0000000000000000000000000000000000000000
SKILL_TRIAL_ADDRESS=0x0000000000000000000000000000000000000000

# Storage - USE YOUR KEY
NFT_STORAGE_KEY=YOUR_NFT_STORAGE_API_KEY
IPFS_GATEWAY=https://gateway.pinata.cloud

# Frontend
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=info
```

**5.4 Generate JWT Secret**
In new terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste into `.env` as `JWT_SECRET` value

**5.5 Save File**
- Press: Ctrl+X
- Press: Y (yes)
- Press: Enter

---

### STEP 6: Create Frontend .env File (3 minutes)

**6.1 Open Terminal**
```bash
cd "/home/ani/Desktop/New Folder/Clone/frontend"
```

**6.2 Create .env File**
```bash
cp .env.example .env
nano .env
```

**6.3 Edit File**
Replace these values:

```env
# Backend
VITE_BACKEND_URL=http://localhost:3000

# Blockchain - USE SAME VALUES AS BACKEND
VITE_CHAIN_ID=11155111
VITE_CHAIN_NAME=Sepolia
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Smart Contracts - Leave as is for now
VITE_PROJECT_ESCROW=0x0000000000000000000000000000000000000000
VITE_USER_REGISTRY=0x0000000000000000000000000000000000000000
VITE_DISPUTE_JURY=0x0000000000000000000000000000000000000000
VITE_AI_ORACLE=0x0000000000000000000000000000000000000000
VITE_SKILL_TRIAL=0x0000000000000000000000000000000000000000

# Storage - USE YOUR KEY
VITE_NFT_STORAGE_KEY=YOUR_NFT_STORAGE_API_KEY
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud

# Features
VITE_ENABLE_WALLET=true
VITE_ENABLE_STORAGE=true
VITE_ENABLE_AI_DISPUTES=true
```

**6.4 Save File**
- Press: Ctrl+X
- Press: Y (yes)
- Press: Enter

---

### STEP 7: Verify Everything Works (2 minutes)

**Terminal 1:**
```bash
cd "/home/ani/Desktop/New Folder/Clone/backend"
npm run build
```

**Expected:**
```
> tsc

# No errors shown = SUCCESS ✅
```

**Terminal 2:**
```bash
cd "/home/ani/Desktop/New Folder/Clone/frontend"
npm run build
```

**Expected:**
```
✓ 1905 modules transformed.
✓ built in 5.25s

# No warnings = SUCCESS ✅
```

**Terminal 3:**
```bash
cd "/home/ani/Desktop/New Folder/Clone"
forge test
```

**Expected:**
```
Test result: ok. 36 passed; 0 failed

# All passing = SUCCESS ✅
```

---

## 🚀 NOW YOU'RE READY TO LAUNCH!

### Open 3 Terminal Windows

**Terminal 1 - Backend:**
```bash
cd "/home/ani/Desktop/New Folder/Clone/backend"
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd "/home/ani/Desktop/New Folder/Clone/frontend"
npm run dev
```

**Terminal 3 - Optional Smart Contracts Monitor:**
```bash
cd "/home/ani/Desktop/New Folder/Clone"
forge test --watch
```

### Test in Browser

1. Open: http://localhost:5173
2. Should see HumanWork homepage
3. Click "Sign In"
4. Try login with test email

---

## 🔍 Manual Verification Commands

### Check Backend Running

```bash
# In new terminal
curl http://localhost:3000/health

# Should see:
# {"status":"ok","timestamp":"...","uptime":...,"version":"1.0.0"}
```

### Check Frontend Running

```bash
# Just open browser to:
# http://localhost:5173

# Should see HumanWork landing page
```

### Check API Endpoints

```bash
# Get stats
curl http://localhost:3000/api/stats

# Get disputes
curl http://localhost:3000/api/disputes

# Get storage stats
curl http://localhost:3000/api/storage/stats
```

### Check Storage Upload

```bash
# Create test file
echo "test" > /tmp/test.txt

# Upload
curl -X POST -F "file=@/tmp/test.txt" \
  http://localhost:3000/api/storage/upload

# Should return JSON with CID
```

---

## ✅ Verification Checklist

- [ ] Infura RPC URL created and saved
- [ ] NFT.Storage API key created and saved
- [ ] MetaMask private key exported and saved
- [ ] Testnet ETH received in wallet
- [ ] Backend .env file created with all keys
- [ ] Frontend .env file created with all keys
- [ ] Backend builds without errors
- [ ] Frontend builds without warnings
- [ ] Smart contracts compile successfully
- [ ] All 36 tests pass
- [ ] Backend starts on port 3000
- [ ] Frontend starts on port 5173
- [ ] Browser shows landing page at http://localhost:5173
- [ ] Health check returns 200 status
- [ ] API endpoints respond with JSON
- [ ] MetaMask connected to Sepolia network

---

**Everything should now be working! Test in terminal and let me know if you hit any issues.** 🚀

Created: December 3, 2025
