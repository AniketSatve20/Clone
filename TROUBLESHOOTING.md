# 🐛 Troubleshooting & Common Errors

**Solutions for issues you might encounter**

---

## 1. Backend Won't Start

### Error: "Port 3000 already in use"

**Solution:**
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

---

### Error: "Cannot find module 'better-sqlite3'"

**Solution:**
```bash
cd backend
npm install
npm run build
npm run dev
```

---

### Error: "JWT_SECRET not set"

**Solution:**
```bash
# Generate secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to backend/.env
JWT_SECRET=<paste_generated_secret>

# Restart backend
npm run dev
```

---

### Error: ".env file not found"

**Solution:**
```bash
cd backend
cp .env.example .env
nano .env  # Add your values
npm run dev
```

---

## 2. Frontend Won't Start

### Error: "Port 5173 already in use"

**Solution:**
```bash
# Kill process on port 5173
lsof -i :5173
kill -9 <PID>

# Or use different port
VITE_PORT=5174 npm run dev
```

---

### Error: "Module not found '@components/...'"

**Solution:**
```bash
cd frontend
npm install
npm run dev
```

---

### Error: "Cannot find VITE_BACKEND_URL"

**Solution:**
```bash
cd frontend
cp .env.example .env
nano .env  # Add backend URL
npm run dev
```

---

### Error: "React is not defined"

**Solution:**
```bash
# Add import to top of file
import React from 'react';

# Or use JSX pragma comment
/** @jsx React.createElement */
```

---

## 3. Database Issues

### Error: "Database locked"

**Solution:**
```bash
# Close all connections
# Kill backend process and restart
lsof -i :3000
kill -9 <PID>

npm run dev
```

---

### Error: "SQLITE_CANTOPEN: unable to open database file"

**Solution:**
```bash
# Create database directory
mkdir -p database

# Check DATABASE_PATH in .env
# Should be: ./humanwork.db or ./database/humanwork.db
```

---

### Error: "SQL syntax error"

**Solution:**
```bash
# Delete database and rebuild
rm humanwork.db
npm run dev  # Recreates database

# Or manually initialize
sqlite3 humanwork.db < schema.sql
```

---

## 4. Wallet Connection Issues

### Error: "MetaMask not detected"

**Solution:**
1. Install MetaMask extension
2. Set VITE_ENABLE_WALLET=true in frontend/.env
3. Refresh page (F5)
4. Open browser console (F12) for details

---

### Error: "Wrong network"

**Solution:**
```
MetaMask Extension → Click Network Selector → Sepolia
(or scroll down to see Sepolia option)
```

---

### Error: "Insufficient balance"

**Solution:**
```bash
# Get testnet ETH
1. Open MetaMask
2. Copy wallet address
3. Go to https://sepoliafaucet.com
4. Paste address
5. Request 0.5 ETH
6. Wait ~30 seconds
7. Refresh MetaMask
```

---

### Error: "User rejected transaction"

**Solution:**
- MetaMask popup appeared but you clicked "Reject"
- Try again: Click button in app → Approve in MetaMask popup → Click "Confirm"

---

## 5. API Call Errors

### Error: "Cannot GET /api/stats"

**Solution:**
```bash
# Check backend running
curl http://localhost:3000/health

# If no response, backend not running
cd backend && npm run dev

# Wait for: 🚀 Backend server running on http://localhost:3000
```

---

### Error: "CORS error"

**Solution:**
Check backend/.env:
```
FRONTEND_URL=http://localhost:5173
```

Restart backend:
```bash
npm run dev
```

---

### Error: "401 Unauthorized"

**Solution:**
```bash
# You need to be logged in first
# Frontend: Click "Sign In"
# Complete email OTP login
# Then try API call again
```

---

### Error: "500 Internal Server Error"

**Solution:**
```bash
# Check backend console for detailed error
# Look in Terminal 1 where you ran: npm run dev
# Common causes:
# - Database issue
# - Missing environment variable
# - API key invalid
```

---

## 6. Storage & Filecoin Issues

### Error: "NFT_STORAGE_KEY is invalid"

**Solution:**
1. Go to https://nft.storage
2. Login
3. Go to "API Keys" tab
4. Create new key if needed
5. Copy token (shown only once!)
6. Update both .env files:
   - backend/.env: NFT_STORAGE_KEY=your_key
   - frontend/.env: VITE_NFT_STORAGE_KEY=your_key
7. Restart backend: npm run dev

---

### Error: "Upload failed"

**Solution:**
```bash
# Check file exists
ls ~/test_upload.txt

# Check API key
grep NFT_STORAGE_KEY backend/.env

# Try smaller file
echo "test" > small_test.txt
curl -F "file=@small_test.txt" http://localhost:3000/api/storage/upload
```

---

### Error: "Storage endpoint not available"

**Solution:**
```bash
# Wait 30 seconds
# NFT.Storage API might be slow
# Then retry upload

# Or check internet connection
ping google.com
```

---

## 7. RPC & Blockchain Issues

### Error: "RPC URL is invalid"

**Solution:**
```bash
# Check backend/.env
grep RPC_URL backend/.env

# Should be: https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Verify with curl
curl https://sepolia.infura.io/v3/YOUR_PROJECT_ID \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}'

# Should return block number, not error
```

---

### Error: "Private key is invalid"

**Solution:**
```bash
# Private key should start with 0x
# Example: 0xabcd1234...

# Check length: should be 66 characters (0x + 64 hex chars)

# Get new key from MetaMask:
# 1. Settings → Security & Privacy
# 2. "Export Private Key"
# 3. Enter password
# 4. Copy key (starts with 0x)

# Update backend/.env
PRIVATE_KEY=0xyour_key_here

# Restart backend
npm run dev
```

---

### Error: "Transaction failed"

**Solution:**
```bash
# Check testnet ETH balance
# In MetaMask, should show balance > 0

# Check private key has funds
# MetaMask might have different private key

# Get more testnet ETH:
# https://sepoliafaucet.com
```

---

## 8. TypeScript & Build Errors

### Error: "Cannot find module '@types/...'"

**Solution:**
```bash
npm install --save-dev @types/node @types/express
npm run build
```

---

### Error: "Property does not exist on type"

**Solution:**
```bash
# Check tsconfig.json is correct
# Rebuild:
npm run build

# If still failing:
rm -rf node_modules dist
npm install
npm run build
```

---

### Error: "JSX element implicitly has type 'any'"

**Solution:**
Add return type to component:
```typescript
// Before
const MyComponent = () => {
  return <div>Hello</div>
}

// After
const MyComponent = (): JSX.Element => {
  return <div>Hello</div>
}
```

---

## 9. Contract/Foundry Issues

### Error: "Forge not installed"

**Solution:**
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verify
forge --version
```

---

### Error: "Test failed"

**Solution:**
```bash
# Run with verbose output
forge test -vv

# Run specific test
forge test --match "TestName"

# Check test file for issues
nano test/ProjectEscrow.t.sol
```

---

### Error: "Cannot compile contracts"

**Solution:**
```bash
# Clear cache and rebuild
rm -rf cache
forge build

# Check for syntax errors
forge build --force
```

---

## 10. Common Beginner Mistakes

### Mistake: "Committed private key to git"

**Solution:**
```bash
# Remove from git history
git rm --cached backend/.env
echo ".env" >> .gitignore
git commit -m "Remove .env from tracking"
```

---

### Mistake: ".env file in wrong location"

**Solution:**
```bash
# Should be:
backend/.env       # NOT in src/ or node_modules/
frontend/.env      # NOT in src/ or node_modules/

# Check:
ls backend/.env
ls frontend/.env
```

---

### Mistake: "npm install not run"

**Solution:**
```bash
# After cloning or pulling new code
cd backend && npm install
cd ../frontend && npm install
```

---

### Mistake: "Forgot to copy .env.example"

**Solution:**
```bash
# Check if .env exists
ls backend/.env

# If not, copy from example
cp backend/.env.example backend/.env
nano backend/.env  # Fill in values
```

---

### Mistake: "Running old node version"

**Solution:**
```bash
# Check version
node --version

# Should be 18.x or higher
# If older, upgrade:
# https://nodejs.org/en/download/

# Then reinstall:
cd backend && npm install
cd ../frontend && npm install
```

---

## 11. Performance Issues

### Issue: "App is slow"

**Solution:**
```bash
# Check build is production build
npm run build  # Not: npm run dev

# Check bundle size:
# Should be: 12.8KB main, 160KB vendor

# Clear browser cache (Ctrl+Shift+Delete)

# Check network tab (F12):
# Should see requests < 100ms
```

---

### Issue: "API calls slow"

**Solution:**
```bash
# Check if database query needs indexing
# Add to database.ts if querying frequently:
db.exec('CREATE INDEX IF NOT EXISTS idx_status ON projects(status)');

# Restart backend
npm run dev
```

---

## 12. If All Else Fails

### Full Reset
```bash
# Remove all built artifacts
rm -rf backend/dist
rm -rf frontend/dist
rm -rf cache

# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install

# Rebuild
npm run build

# Start fresh
npm run dev
```

---

### Debug Mode
```bash
# Start backend with debug logging
DEBUG=* npm run dev

# Check for detailed error messages
# Look for ERROR, WARN, or stack traces in console
```

---

### Check Logs
```bash
# Backend logs are in Terminal 1 where you ran npm run dev
# Look for:
# ✅ = Success message
# ❌ = Error message
# 🚀 = Server started
# 📧 = Email sent
```

---

## Quick Reference

| Issue | Command | Expected |
|-------|---------|----------|
| Port busy | `lsof -i :PORT` | Shows process ID |
| Missing module | `npm install` | Installs all packages |
| Database error | `rm humanwork.db` | Recreates database |
| Clear cache | `rm -rf node_modules dist` | Removes built files |
| Rebuild all | `npm install && npm run build` | Compiles everything |
| Check running | `curl localhost:3000/health` | JSON response |
| View logs | Terminal where running | Look for errors |

---

**Most issues are solved by:**
1. Checking .env file is correct
2. Restarting the process
3. Reinstalling packages
4. Clearing cache and rebuilding

**If stuck, check:**
- Terminal output for error messages
- Browser console (F12) for errors
- .env files for correct values
- Process is actually running (`curl localhost:PORT/health`)

---

Created: December 3, 2025
Last Updated: December 3, 2025
