#!/bin/bash

# HumanWork Protocol - Quick Setup Checklist
# Copy and paste commands into terminal

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║        HumanWork Protocol - Integration Setup                 ║"
echo "║        Follow each step carefully                             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Create Backend .env
echo "STEP 1: Create Backend .env File"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Run this command:"
echo "  cd \"/home/ani/Desktop/New Folder/Clone/backend\" && cp .env.example .env"
echo ""
echo "Then edit .env with your values:"
echo "  nano .env"
echo ""
echo "REQUIRED KEYS TO ADD:"
echo "  1. RPC_URL = https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"
echo "  2. PRIVATE_KEY = 0xyourprivatekeyhere"
echo "  3. NFT_STORAGE_KEY = your_api_key_from_nft.storage"
echo "  4. JWT_SECRET = (run: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\")"
echo ""
echo "Press Enter when done..."
read

# Step 2: Create Frontend .env
echo ""
echo "STEP 2: Create Frontend .env File"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Run this command:"
echo "  cd \"/home/ani/Desktop/New Folder/Clone/frontend\" && cp .env.example .env"
echo ""
echo "Then edit .env with your values:"
echo "  nano .env"
echo ""
echo "REQUIRED KEYS TO ADD:"
echo "  1. VITE_BACKEND_URL = http://localhost:3000"
echo "  2. VITE_RPC_URL = https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"
echo "  3. VITE_NFT_STORAGE_KEY = your_api_key_from_nft.storage"
echo ""
echo "Press Enter when done..."
read

# Step 3: Verify Backend
echo ""
echo "STEP 3: Verify Backend Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Run these commands:"
echo "  cd \"/home/ani/Desktop/New Folder/Clone/backend\""
echo "  npm run build"
echo ""
echo "Expected: No errors, TypeScript compiled successfully"
echo ""
echo "Press Enter when done..."
read

# Step 4: Verify Frontend
echo ""
echo "STEP 4: Verify Frontend Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Run these commands:"
echo "  cd \"/home/ani/Desktop/New Folder/Clone/frontend\""
echo "  npm run build"
echo ""
echo "Expected: ✓ built in X seconds, no warnings"
echo ""
echo "Press Enter when done..."
read

# Step 5: Verify Contracts
echo ""
echo "STEP 5: Verify Smart Contracts"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Run these commands:"
echo "  cd \"/home/ani/Desktop/New Folder/Clone\""
echo "  forge build"
echo "  forge test"
echo ""
echo "Expected: Compiler run successful, Test result: ok. 36 passed"
echo ""
echo "Press Enter when done..."
read

# Final Instructions
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              🚀 READY TO LAUNCH 🚀                            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Now open 3 terminals and run:"
echo ""
echo "TERMINAL 1 - Backend:"
echo "  cd \"/home/ani/Desktop/New Folder/Clone/backend\" && npm run dev"
echo ""
echo "TERMINAL 2 - Frontend:"
echo "  cd \"/home/ani/Desktop/New Folder/Clone/frontend\" && npm run dev"
echo ""
echo "TERMINAL 3 - Smart Contracts (optional):"
echo "  cd \"/home/ani/Desktop/New Folder/Clone\" && forge test"
echo ""
echo "Then open browser: http://localhost:5173"
echo ""
echo "✅ Setup complete!"
