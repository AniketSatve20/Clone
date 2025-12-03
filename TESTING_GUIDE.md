# 🧪 Complete Testing Guide

**After Setup:** Test everything works before deployment

---

## Test 1: Backend Health Check

### Command
```bash
curl http://localhost:3000/health
```

### Expected Output
```json
{
  "status": "ok",
  "timestamp": "2025-12-03T22:30:00.000Z",
  "uptime": 12.345,
  "version": "1.0.0"
}
```

### What This Tells You
✅ Backend is running  
✅ Server listening on port 3000  
✅ No configuration errors

---

## Test 2: API Endpoints

### Test Stats Endpoint
```bash
curl http://localhost:3000/api/stats
```

Expected:
```json
{
  "totalProjects": 0,
  "activeProjects": 0,
  "totalDisputes": 0,
  "activeDisputes": 0
}
```

✅ API module working

### Test Disputes Endpoint
```bash
curl http://localhost:3000/api/disputes
```

Expected:
```json
{
  "disputes": []
}
```

✅ Database connected

### Test Storage Stats
```bash
curl http://localhost:3000/api/storage/stats
```

Expected:
```json
{
  "totalSize": 0,
  "fileCount": 0,
  "backendStatus": {
    "filecoin": "available",
    "ipfs": "available"
  }
}
```

✅ Storage service working

---

## Test 3: Frontend Rendering

### Open Browser
```
http://localhost:5173
```

### What to See
1. ✅ HumanWork logo and title visible
2. ✅ "Sign In" button in top right
3. ✅ Landing page with features list
4. ✅ Crypto-themed dark UI
5. ✅ No console errors (F12 → Console)

### Check Console (F12)
- ✅ No red errors
- ✅ No orange warnings about bundle
- ✅ Maybe info messages (OK)

---

## Test 4: Authentication Flow

### Step 1: Click Sign In
- Click "Sign In" button
- Should navigate to `/auth` page

### Step 2: Choose Email OTP
- Select "Send Verification Code"
- Enter: `test@example.com`
- Click "Send"

### Step 3: Check Backend Console
- Look in Terminal 1 (backend)
- Should see message like:
  ```
  📧 Email: test@example.com
  🔐 OTP Code: 123456
  ```

### Step 4: Enter OTP
- Copy the 6-digit code from terminal
- Paste into app
- Click "Verify"

### Expected Result
✅ Successfully logged in  
✅ Redirected to `/dashboard`  
✅ Dashboard shows stats cards

---

## Test 5: Wallet Connection (Optional)

### Prerequisites
- MetaMask installed
- Switched to Sepolia network
- Have testnet ETH

### Steps
1. Go to http://localhost:5173
2. Click "Connect Wallet" button
3. MetaMask popup appears
4. Click "Connect"
5. Sign message when prompted

### Expected Result
✅ Wallet address shows  
✅ Connected status displayed

---

## Test 6: Storage Upload

### Create Test File
```bash
echo "This is a test file for HumanWork storage" > ~/test_upload.txt
```

### Upload via API
```bash
curl -X POST -F "file=@~/test_upload.txt" \
  http://localhost:3000/api/storage/upload
```

### Expected Response
```json
{
  "success": true,
  "cid": "QmXxxx...",
  "size": 45,
  "uploadedAt": "2025-12-03T22:30:00.000Z"
}
```

### Verify Upload
```bash
# List files
curl http://localhost:3000/api/storage/list

# Should include your uploaded file
```

✅ Storage and Filecoin integration working

---

## Test 7: WebSocket Real-time Messaging

### Test Connection
```bash
# Install websocat if needed (optional)
# Or test through frontend

# In frontend, open DevTools → Network
# Filter by WS
# Should see connection to ws://localhost:3000
```

### Expected
- ✅ WebSocket connection established
- ✅ No connection errors
- ✅ Can send/receive messages

---

## Test 8: Smart Contracts

### Run All Tests
```bash
cd "/home/ani/Desktop/New Folder/Clone"
forge test -v
```

### Expected Output
```
Test result: ok. 36 passed; 0 failed; 0 skipped; X skipped
```

### Individual Test Results
```
[PASS] ProjectEscrow: create, update, complete
[PASS] UserRegistry: profile, attestation, reputation
[PASS] DisputeJury: voting, jury management
[PASS] AIOracle: verdict generation
[PASS] SkillTrial: assessment, grading
[PASS] EnterpriseAccess: subscriptions
[PASS] AgencyRegistry: management
[PASS] GasSponsor: sponsorship
[PASS] InsurancePool: claims
[PASS] Integration: end-to-end
```

✅ All smart contracts working

---

## Test 9: Database Integrity

### Check Backend Console
```
Should see: Database initialized successfully
```

### Verify Tables Created
```bash
# In backend directory
sqlite3 humanwork.db ".tables"

# Should see:
# users projects disputes ai_analysis
```

✅ Database ready

---

## Test 10: Build Quality

### Frontend Build
```bash
cd "/home/ani/Desktop/New Folder/Clone/frontend"
npm run build
```

### Expected
```
✓ 1905 modules transformed.
dist/index.html              0.75 kB │ gzip:  0.39 kB
dist/assets/index-*.css     37.03 kB │ gzip:  6.84 kB
dist/assets/index-*.js      12.80 kB │ gzip:  4.83 kB
dist/assets/vendor-*.js    476.56 kB │ gzip:169.15 kB
✓ built in 5.25s
```

✅ No warnings  
✅ Bundle optimized

### Backend Build
```bash
cd "/home/ani/Desktop/New Folder/Clone/backend"
npm run build
```

### Expected
```
> tsc

(no errors = success)
```

✅ TypeScript compiles

---

## Quick Test Summary

| Test | Command | Expected |
|------|---------|----------|
| Backend | `curl localhost:3000/health` | JSON response |
| Stats | `curl localhost:3000/api/stats` | JSON stats |
| Frontend | Open browser to :5173 | Landing page |
| Login | Email + OTP flow | Dashboard |
| Storage | POST file to `/storage/upload` | CID returned |
| Contracts | `forge test` | 36 passed |
| Build | `npm run build` | 0 warnings |

---

## Troubleshooting Tests

### "Cannot connect to localhost:3000"
```bash
# Check if backend is running
lsof -i :3000

# If not, start it:
cd backend && npm run dev
```

### "Frontend shows blank page"
```bash
# Clear browser cache (Ctrl+Shift+Delete)
# Refresh (F5)
# Check console for errors (F12)
```

### "API returns 404"
```bash
# Make sure backend running
# Check URL spelling
# Check backend .env loaded
```

### "Tests fail"
```bash
# Rebuild contracts:
forge build

# Run with verbose output:
forge test -vv
```

### "Storage upload fails"
```bash
# Check NFT_STORAGE_KEY in .env
# Verify API key valid
# Check file permissions
```

---

## Production Checklist Before Deployment

- [ ] All tests passing (36/36 for contracts)
- [ ] No console errors in browser
- [ ] No TypeScript errors
- [ ] No build warnings
- [ ] Health check responds
- [ ] API endpoints respond
- [ ] Storage upload works
- [ ] Login flow works
- [ ] MetaMask connection works
- [ ] Database has data
- [ ] Backend builds successfully
- [ ] Frontend builds successfully
- [ ] All .env variables set correctly
- [ ] Private key secure (never committed)
- [ ] API keys valid and active

---

## Performance Benchmarks

| Component | Target | Actual |
|-----------|--------|--------|
| Health check | <50ms | ? |
| API response | <100ms | ? |
| Frontend load | <2s | ? |
| Bundle size | <15KB | 12.8KB ✅ |
| Build time | <10s | 5.25s ✅ |

---

**After all tests pass, you're ready for production deployment!** 🚀

Created: December 3, 2025
