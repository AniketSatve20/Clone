# HumanWork - Quick Reference

**Status:** ✅ Production Ready | **Date:** December 3, 2025 | **Version:** 1.0.0

---

## 🚀 Start the System (30 seconds)

```bash
# Terminal 1: Backend
cd /home/ani/Desktop/New\ Folder/Clone/backend && npm start

# Terminal 2: Frontend  
cd /home/ani/Desktop/New\ Folder/Clone/frontend && npm run dev

# Open Browser
open http://localhost:5174
```

---

## 🎯 Test the System

### Email OTP Flow
1. Click "Sign In" → Select "Email OTP" tab
2. Enter: `test@example.com`
3. Click "Send Verification Code"
4. **Check backend terminal for:** `📧 OTP for test@example.com: 123456`
5. Copy the 6-digit code into the app
6. Click "Verify"
7. **Result:** ✅ Redirected to dashboard

### MetaMask Flow
1. Click "Sign In" → Select "MetaMask" tab
2. Click "Connect Wallet"
3. Approve in MetaMask popup
4. Click "Switch Account" to test account switching
5. Click "Continue with Wallet"
6. **Result:** ✅ Redirected to dashboard with wallet info

---

## 🔗 API Endpoints

```bash
# Email OTP
curl -X POST http://localhost:3000/api/auth/email/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

curl -X POST http://localhost:3000/api/auth/email/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'

# Get Projects
curl http://localhost:3000/api/projects | jq .

# Get Disputes
curl http://localhost:3000/api/disputes | jq .

# Health Check
curl http://localhost:3000/health | jq .
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `frontend/src/pages/AuthPage.tsx` | **Email OTP + MetaMask auth** |
| `backend/src/api-auth.ts` | **OTP endpoints** |
| `frontend/src/App.tsx` | Clean routing |
| `frontend/src/App.css` | Modern styling |
| `INTEGRATION_GUIDE.md` | Full setup guide |

---

## 🛠️ Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 3000 in use | `lsof -i :3000 \| awk 'NR>1 {print $2}' \| xargs kill -9` |
| Port 5174 in use | `lsof -i :5174 \| awk 'NR>1 {print $2}' \| xargs kill -9` |
| Database locked | `rm backend/job_db.json` |
| MetaMask not connecting | Install extension, switch to Sepolia testnet |
| OTP not showing | Look in backend terminal for `📧 OTP for...` |

---

## ✅ Features

- ✅ Email OTP authentication
- ✅ MetaMask wallet connection
- ✅ Account switching
- ✅ Dashboard with stats
- ✅ Projects management
- ✅ Disputes tracking
- ✅ Clean, responsive UI
- ✅ Protected routes
- ✅ User logout

---

## 📞 Utilities

```bash
# Check system status
bash /tmp/system_check.sh

# View backend logs
tail -f /tmp/backend.log

# Build for production
cd frontend && npm run build

# Test smart contracts
forge test

# Reset everything
rm backend/job_db.json
npm install
```

---

## 📚 Documentation

- **Setup:** `INTEGRATION_GUIDE.md`
- **Status:** `SESSION_FINAL_STATUS.md`
- **Details:** `COMPLETION_SUMMARY.md`

---

**Frontend URL:** http://localhost:5174  
**Backend URL:** http://localhost:3000  
**Ready for:** Development | Testing | Production
