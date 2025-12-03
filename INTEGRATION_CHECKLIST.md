# ✅ Integration Checklist

**Complete these steps in order to get HumanWork fully integrated and running**

---

## Phase 1: Get Credentials (20 minutes)

### [ ] 1.1 Infura RPC URL
- [ ] Go to https://infura.io
- [ ] Sign up (free)
- [ ] Create new project → Web3 API
- [ ] Select Sepolia network
- [ ] Copy Sepolia RPC URL: `https://sepolia.infura.io/v3/PROJECT_ID`
- [ ] Save for later

**Time: 5 min** | **Difficulty: Easy**

---

### [ ] 1.2 NFT.Storage API Key
- [ ] Go to https://nft.storage
- [ ] Sign up with GitHub or email
- [ ] Click on your account
- [ ] Go to "API Keys" tab
- [ ] Click "New Key"
- [ ] Give it a name like "HumanWork"
- [ ] Copy token (shown only once!)
- [ ] ⚠️ Save immediately, won't show again
- [ ] Save for later

**Time: 3 min** | **Difficulty: Easy**

---

### [ ] 1.3 MetaMask Private Key
- [ ] Install MetaMask extension (if not already)
- [ ] Create wallet or import existing
- [ ] Make sure you're on **Sepolia network**
- [ ] Click account menu (top right)
- [ ] Click "Settings"
- [ ] Click "Security & Privacy"
- [ ] Scroll down to "Export Private Key"
- [ ] Click it
- [ ] Enter MetaMask password
- [ ] Copy key starting with `0x`
- [ ] ⚠️ **NEVER share this key or commit to git!**
- [ ] Save for later

**Time: 2 min** | **Difficulty: Easy**

---

### [ ] 1.4 Testnet ETH (for gas fees)
- [ ] In MetaMask, copy your wallet address (top area)
- [ ] Go to https://sepoliafaucet.com
- [ ] Paste wallet address
- [ ] Click "Request 0.5 ETH"
- [ ] Wait 30 seconds to 1 minute
- [ ] Check MetaMask balance increased
- [ ] Should show 0.5 ETH in Sepolia

**Time: 5 min** | **Difficulty: Easy**

---

### [ ] 1.5 JWT Secret (for backend auth)
- [ ] Open terminal
- [ ] Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Copy the long string (hex characters)
- [ ] Save for later

**Time: 1 min** | **Difficulty: Very Easy**

---

## Phase 2: Create .env Files (10 minutes)

### [ ] 2.1 Backend .env
```bash
# Terminal
cd "/home/ani/Desktop/New Folder/Clone/backend"
cp .env.example .env
nano .env
```

**Fill in:**
```
PORT=3000
NODE_ENV=development
DATABASE_PATH=./humanwork.db
JWT_SECRET=<paste_generated_secret_from_1.5>
RPC_URL=<paste_infura_url_from_1.1>
PRIVATE_KEY=<paste_metamask_key_from_1.3>
NFT_STORAGE_KEY=<paste_nft_storage_key_from_1.2>
FRONTEND_URL=http://localhost:5173
LOG_LEVEL=info
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

**Verify:**
```bash
cat .env | head -10
```

**Time: 5 min** | **Difficulty: Easy**

---

### [ ] 2.2 Frontend .env
```bash
# Terminal
cd "/home/ani/Desktop/New Folder/Clone/frontend"
cp .env.example .env
nano .env
```

**Fill in:**
```
VITE_BACKEND_URL=http://localhost:3000
VITE_CHAIN_ID=11155111
VITE_CHAIN_NAME=Sepolia
VITE_RPC_URL=<paste_infura_url_from_1.1>
VITE_NFT_STORAGE_KEY=<paste_nft_storage_key_from_1.2>
VITE_ENABLE_WALLET=true
VITE_ENABLE_STORAGE=true
VITE_ENABLE_AI_DISPUTES=true
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

**Verify:**
```bash
cat .env | head -10
```

**Time: 5 min** | **Difficulty: Easy**

---

## Phase 3: Build Verification (5 minutes)

### [ ] 3.1 Backend Build
```bash
cd "/home/ani/Desktop/New Folder/Clone/backend"
npm run build
```

**Expected:**
```
(Should show: tsc with no errors)
```

**Verify:** No red error text

**Time: 2 min** | **Difficulty: Very Easy**

---

### [ ] 3.2 Frontend Build
```bash
cd "/home/ani/Desktop/New Folder/Clone/frontend"
npm run build
```

**Expected:**
```
✓ 1905 modules transformed.
✓ built in X seconds
```

**Verify:** 
- [ ] No warnings
- [ ] No errors
- [ ] Shows "built in X seconds"

**Time: 2 min** | **Difficulty: Very Easy**

---

### [ ] 3.3 Smart Contracts Tests
```bash
cd "/home/ani/Desktop/New Folder/Clone"
forge test
```

**Expected:**
```
Test result: ok. 36 passed; 0 failed
```

**Verify:**
- [ ] Says "ok"
- [ ] Shows "36 passed"
- [ ] Shows "0 failed"

**Time: 1 min** | **Difficulty: Very Easy**

---

## Phase 4: Launch Full Stack (5 minutes)

### [ ] 4.1 Start Backend
**Terminal 1:**
```bash
cd "/home/ani/Desktop/New Folder/Clone/backend"
npm run dev
```

**Expected:**
```
🚀 Backend server running on http://localhost:3000
```

**Wait for:** The emoji 🚀 appears

**Keep this terminal open** (don't close it)

**Time: 1 min** | **Difficulty: Very Easy**

---

### [ ] 4.2 Start Frontend
**Terminal 2:**
```bash
cd "/home/ani/Desktop/New Folder/Clone/frontend"
npm run dev
```

**Expected:**
```
VITE v5.4.21 ready in 323 ms
Local: http://localhost:5173/
```

**Wait for:** Both lines appear

**Keep this terminal open** (don't close it)

**Time: 1 min** | **Difficulty: Very Easy**

---

### [ ] 4.3 Verify Health Check
**Terminal 3 (new terminal):**
```bash
curl http://localhost:3000/health
```

**Expected:**
```json
{"status":"ok","timestamp":"...","uptime":...,"version":"1.0.0"}
```

**Verify:** JSON response with status "ok"

**Time: 1 min** | **Difficulty: Very Easy**

---

### [ ] 4.4 Open in Browser
- [ ] Open browser
- [ ] Go to: http://localhost:5173
- [ ] Wait for page to load (5-10 seconds)
- [ ] Should see HumanWork logo and sign-in button

**Do NOT see:**
- ❌ Blank white page
- ❌ Connection refused
- ❌ Red error text in console

**Time: 2 min** | **Difficulty: Very Easy**

---

## Phase 5: Test Functionality (10 minutes)

### [ ] 5.1 Test Email Login
1. [ ] Click "Sign In" button
2. [ ] Click "Email OTP"
3. [ ] Enter email: `test@example.com`
4. [ ] Click "Send Code"
5. [ ] Check **Terminal 1** (backend) for OTP code
6. [ ] Copy OTP code from terminal
7. [ ] Paste into app input
8. [ ] Click "Verify"
9. [ ] Should redirect to dashboard

**Expected:** Dashboard shows stats cards

**Time: 2 min** | **Difficulty: Easy**

---

### [ ] 5.2 Test Wallet Connection (Optional)
1. [ ] Go back to home page
2. [ ] Click "Connect Wallet"
3. [ ] MetaMask popup appears
4. [ ] Click "Connect"
5. [ ] Sign message when prompted
6. [ ] Wallet address should show in app

**Expected:** Address displays, status shows "Connected"

**Time: 2 min** | **Difficulty: Medium**

---

### [ ] 5.3 Test API Endpoints
```bash
# Terminal 3
curl http://localhost:3000/api/stats
curl http://localhost:3000/api/disputes
curl http://localhost:3000/api/storage/stats
```

**Expected:** JSON responses, no errors

**Time: 1 min** | **Difficulty: Very Easy**

---

### [ ] 5.4 Test Storage Upload
```bash
# Create test file
echo "This is a test file" > ~/test_upload.txt

# Upload
```bash
curl -X POST -F "file=@~/test_upload.txt" \
    http://localhost:3000/api/storage/upload
```
```

**Expected:**
```json
{"success":true,"cid":"Qm...","size":...}
```

**Verify:** Returns CID starting with "Qm"

**Time: 2 min** | **Difficulty: Easy**

---

### [ ] 5.5 Check Browser Console for Errors
1. [ ] In browser at http://localhost:5173
2. [ ] Press `F12` (open DevTools)
3. [ ] Click "Console" tab
4. [ ] Check for red error messages

**Expected:** 
- [ ] No red errors
- [ ] Maybe blue info messages (OK)

**Time: 1 min** | **Difficulty: Very Easy**

---

## Phase 6: Verify Everything Works

### [ ] 6.1 All Systems Running
- [ ] Terminal 1: Backend running (🚀 symbol visible)
- [ ] Terminal 2: Frontend running (http://localhost:5173 visible)
- [ ] Browser: Page loads without errors
- [ ] Network tab: API calls responding (<100ms)

**Status:** ✅ Running

---

### [ ] 6.2 All Tests Pass
- [ ] Backend build: ✅ No errors
- [ ] Frontend build: ✅ No warnings
- [ ] Contracts: ✅ 36/36 tests pass
- [ ] API health: ✅ Responds with status "ok"
- [ ] Database: ✅ Connected and initialized
- [ ] Storage: ✅ Upload returns CID

**Status:** ✅ All Passing

---

### [ ] 6.3 User Can Log In
- [ ] Email OTP login works
- [ ] Dashboard displays after login
- [ ] Stats cards show
- [ ] No error messages

**Status:** ✅ Working

---

### [ ] 6.4 Integration Complete
- [ ] All credentials configured
- [ ] All .env files set
- [ ] All systems communicating
- [ ] No critical errors

**Status:** ✅ Ready for Testing

---

## Success Checklist

When all phases complete, you should have:

✅ **Credentials**
- [ ] Infura RPC URL
- [ ] NFT.Storage API Key
- [ ] MetaMask Private Key
- [ ] Testnet ETH (0.5+)
- [ ] JWT Secret

✅ **Configuration**
- [ ] backend/.env fully filled
- [ ] frontend/.env fully filled
- [ ] No .env in git

✅ **Built Successfully**
- [ ] Backend: TypeScript compiled
- [ ] Frontend: Zero build warnings
- [ ] Contracts: 36/36 tests pass

✅ **Running Smoothly**
- [ ] Backend listening on 3000
- [ ] Frontend loaded on 5173
- [ ] Browser shows landing page
- [ ] No console errors

✅ **Functionality Works**
- [ ] Health check responds
- [ ] Email login works
- [ ] Wallet connects
- [ ] Storage uploads
- [ ] API endpoints respond

✅ **Ready for Testing**
- [ ] Full stack running
- [ ] All components integrated
- [ ] Ready for terminal tests
- [ ] Ready for feature testing

---

## Time Estimates

| Phase | Task | Time |
|-------|------|------|
| 1 | Get Credentials | 20 min |
| 2 | Create .env Files | 10 min |
| 3 | Build Verification | 5 min |
| 4 | Launch Full Stack | 5 min |
| 5 | Test Functionality | 10 min |
| 6 | Verify Everything | 5 min |
| **Total** | **Complete Integration** | **~55 min** |

---

## If Something Fails

1. **Check `MANUAL_SETUP_STEPS.md`** - Has detailed step-by-step instructions
2. **Check `TROUBLESHOOTING.md`** - Has solutions for common errors
3. **Check browser console (F12)** - Look for error messages
4. **Check terminal output** - Look for error messages or stack traces
5. **Check .env files** - Make sure all values are filled in

---

## Next Steps After Integration

Once this checklist is complete:

1. **Test more features** - Try creating projects, disputes, etc.
2. **Load testing** - Test with multiple users simultaneously
3. **Performance testing** - Check response times and bundle sizes
4. **Security testing** - Verify authentication and authorization
5. **Deployment** - Deploy to testnet, staging, then production

---

**Status:** Not Started
**Created:** December 3, 2025
**Last Updated:** December 3, 2025

---

**START HERE NEXT: Follow this checklist step-by-step!** 🚀
