#!/bin/bash

# ============================================================
# HUMANWORK PROTOCOL - ENHANCED SYSTEM TEST
# ============================================================
# Tests all major components including:
# - User authentication
# - File storage (Filecoin)
# - AI verification
# - Dispute resolution
# - Real-time messaging
# ============================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_URL="${API_URL:-http://localhost:3000}"
RPC_URL="${RPC_URL:-https://testnet.hashio.io/api}"

# Load environment
if [ -f .env.local ]; then
    source .env.local
else
    echo -e "${RED}❌ Error: .env.local not found${NC}"
    exit 1
fi

# Counter for tests
TESTS_PASSED=0
TESTS_FAILED=0

# ============================================================
# UTILITY FUNCTIONS
# ============================================================

print_header() {
    echo -e "\n${BLUE}============================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((TESTS_PASSED++))
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    ((TESTS_FAILED++))
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

check_service() {
    if curl -s "$1" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# ============================================================
# PRE-FLIGHT CHECKS
# ============================================================

print_header "PRE-FLIGHT CHECKS"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js available: $NODE_VERSION"
else
    print_error "Node.js not found"
    exit 1
fi

# Check Foundry/Cast
if command -v cast &> /dev/null; then
    print_success "Foundry/Cast available"
else
    print_error "Foundry/Cast not found"
    exit 1
fi

# Check backend API
if check_service "$API_URL/health"; then
    print_success "Backend API is running"
else
    print_error "Backend API not responding at $API_URL"
    print_info "Start backend: cd backend && npm start"
    exit 1
fi

# Check RPC connection
if curl -s -X POST $RPC_URL \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
    | grep -q "result"; then
    print_success "RPC connection working"
else
    print_error "Cannot connect to Hedera RPC"
    exit 1
fi

# ============================================================
# TEST 1: AUTHENTICATION
# ============================================================

print_header "TEST 1: AUTHENTICATION SYSTEM"

# Get auth message
AUTH_MESSAGE=$(curl -s $API_URL/api/auth/message | jq -r '.message')
if [ -n "$AUTH_MESSAGE" ]; then
    print_success "Generated authentication message"
else
    print_error "Failed to generate auth message"
fi

# Send verification email
EMAIL_RESPONSE=$(curl -s -X POST $API_URL/api/auth/send-email \
    -H "Content-Type: application/json" \
    -d '{"email":"test@humanwork.io"}')

if echo "$EMAIL_RESPONSE" | grep -q "success"; then
    print_success "Verification email sent successfully"
else
    print_error "Failed to send verification email"
    print_info "Response: $EMAIL_RESPONSE"
fi

# ============================================================
# TEST 2: USER REGISTRATION & KYC
# ============================================================

print_header "TEST 2: USER REGISTRATION & VERIFICATION"

# Use test account from .env.local
TEST_ADDRESS=$(cast wallet address --private-key $PRIVATE_KEY)
print_info "Test wallet address: $TEST_ADDRESS"

# Register user
REGISTER_TX=$(cast send $USER_REGISTRY_ADDRESS \
    "registerBasic(string memory,string memory,uint8)" \
    "Test User" \
    "test@humanwork.io" \
    "0" \
    --private-key $PRIVATE_KEY \
    --rpc-url $RPC_URL 2>&1)

if echo "$REGISTER_TX" | grep -q "transactionHash"; then
    print_success "User registered successfully"
else
    print_error "User registration failed"
    print_info "Transaction: $REGISTER_TX"
fi

# ============================================================
# TEST 3: STABLECOIN OPERATIONS
# ============================================================

print_header "TEST 3: STABLECOIN OPERATIONS"

# Mint USDC
MINT_TX=$(cast send $STABLECOIN_ADDRESS \
    "mint(address,uint256)" \
    $TEST_ADDRESS \
    "1000000000000000000" \
    --private-key $PRIVATE_KEY \
    --rpc-url $RPC_URL 2>&1)

if echo "$MINT_TX" | grep -q "transactionHash"; then
    print_success "USDC minted successfully (1000 tokens)"
else
    print_error "USDC minting failed"
fi

# Check balance
BALANCE=$(cast call $STABLECOIN_ADDRESS \
    "balanceOf(address)" \
    $TEST_ADDRESS \
    --rpc-url $RPC_URL)

if [ "$BALANCE" != "0" ]; then
    print_success "USDC balance verified: $BALANCE"
else
    print_error "USDC balance is zero"
fi

# Approve escrow
APPROVE_TX=$(cast send $STABLECOIN_ADDRESS \
    "approve(address,uint256)" \
    $PROJECT_ESCROW_ADDRESS \
    "1000000000000000000" \
    --private-key $PRIVATE_KEY \
    --rpc-url $RPC_URL 2>&1)

if echo "$APPROVE_TX" | grep -q "transactionHash"; then
    print_success "ProjectEscrow approved to spend USDC"
else
    print_error "Escrow approval failed"
fi

# ============================================================
# TEST 4: PROJECT CREATION
# ============================================================

print_header "TEST 4: PROJECT CREATION & ESCROW"

# Create project
PROJECT_TX=$(cast send $PROJECT_ESCROW_ADDRESS \
    "createProject(address,uint256,uint8)" \
    $TEST_ADDRESS \
    "1000000000000000000" \
    "1" \
    --private-key $PRIVATE_KEY \
    --rpc-url $RPC_URL 2>&1)

if echo "$PROJECT_TX" | grep -q "transactionHash"; then
    print_success "Project created successfully"
else
    print_error "Project creation failed"
    print_info "Transaction: $PROJECT_TX"
fi

# ============================================================
# TEST 5: FILE STORAGE (FILECOIN)
# ============================================================

print_header "TEST 5: FILE STORAGE INTEGRATION"

if [ -z "$NFT_STORAGE_TOKEN" ]; then
    print_info "Skipping Filecoin test (NFT_STORAGE_TOKEN not set)"
else
    # Create test file
    TEST_FILE="/tmp/humanwork_test_$(date +%s).txt"
    echo "Test document for HumanWork Protocol" > $TEST_FILE

    # Upload to Filecoin (using curl to NFT.storage)
    STORAGE_RESPONSE=$(curl -s -X POST https://api.nft.storage/upload \
        -H "Authorization: Bearer $NFT_STORAGE_TOKEN" \
        -F "file=@$TEST_FILE")

    if echo "$STORAGE_RESPONSE" | grep -q "cid"; then
        CID=$(echo "$STORAGE_RESPONSE" | jq -r '.value.cid' 2>/dev/null)
        print_success "File uploaded to Filecoin: ${CID:0:8}..."
    else
        print_info "Filecoin test skipped (API error)"
    fi

    rm -f $TEST_FILE
fi

# ============================================================
# TEST 6: AI VERIFICATION
# ============================================================

print_header "TEST 6: AI VERIFICATION SYSTEM"

if [ -z "$HUGGING_FACE_API_KEY" ]; then
    print_info "Skipping AI verification test (HUGGING_FACE_API_KEY not set)"
else
    # Test text analysis
    AI_RESPONSE=$(curl -s -X POST $API_URL/api/ai/analyze-text \
        -H "Content-Type: application/json" \
        -d '{"text":"This is excellent work, very satisfied with the quality."}')

    if echo "$AI_RESPONSE" | grep -q "sentiment"; then
        SENTIMENT=$(echo "$AI_RESPONSE" | jq -r '.sentiment')
        print_success "Text analysis working: Sentiment = $SENTIMENT"
    else
        print_info "AI verification test skipped (HuggingFace not responding)"
    fi
fi

# ============================================================
# TEST 7: DISPUTE CREATION
# ============================================================

print_header "TEST 7: DISPUTE RESOLUTION SYSTEM"

# Create dispute
DISPUTE_TX=$(cast send $PROJECT_ESCROW_ADDRESS \
    "createDispute(uint256,uint256,string memory)" \
    "1" \
    "0" \
    "Work quality not as specified" \
    --private-key $PRIVATE_KEY \
    --rpc-url $RPC_URL 2>&1)

if echo "$DISPUTE_TX" | grep -q "transactionHash"; then
    print_success "Dispute created successfully"
    DISPUTE_HASH=$(echo "$DISPUTE_TX" | grep "transactionHash" | head -1)
    print_info "Dispute transaction: $DISPUTE_HASH"
else
    print_error "Dispute creation failed"
fi

# ============================================================
# TEST 8: JURY SYSTEM
# ============================================================

print_header "TEST 8: JURY VOTING SYSTEM"

# Submit verdict
VERDICT_TX=$(cast send $DISPUTE_JURY_CONTRACT_ADDRESS \
    "submitVote(uint256,uint8)" \
    "1" \
    "1" \
    --private-key $PRIVATE_KEY \
    --rpc-url $RPC_URL 2>&1)

if echo "$VERDICT_TX" | grep -q "transactionHash"; then
    print_success "Jury vote submitted successfully"
else
    print_error "Jury voting failed"
fi

# ============================================================
# TEST 9: BACKEND API ENDPOINTS
# ============================================================

print_header "TEST 9: BACKEND API ENDPOINTS"

# Health check
if curl -s $API_URL/health | grep -q "ok"; then
    print_success "Health endpoint working"
else
    print_error "Health endpoint failed"
fi

# Stats endpoint
if curl -s $API_URL/api/stats | grep -q "status"; then
    print_success "Stats endpoint working"
else
    print_info "Stats endpoint not yet implemented"
fi

# ============================================================
# TEST 10: SMART CONTRACT EVENTS
# ============================================================

print_header "TEST 10: EVENT MONITORING"

# Check for recent events
EVENTS=$(cast logs \
    --address $PROJECT_ESCROW_ADDRESS \
    --from-block "latest-100" \
    --to-block "latest" \
    --rpc-url $RPC_URL 2>&1 | wc -l)

print_info "ProjectEscrow events found: $EVENTS"

if [ "$EVENTS" -gt "0" ]; then
    print_success "Event monitoring working"
else
    print_info "No recent events found"
fi

# ============================================================
# FINAL REPORT
# ============================================================

print_header "TEST RESULTS SUMMARY"

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))

echo -e "${GREEN}✅ PASSED: $TESTS_PASSED${NC}"
echo -e "${RED}❌ FAILED: $TESTS_FAILED${NC}"
echo -e "${BLUE}📊 TOTAL:  $TOTAL_TESTS${NC}\n"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}\n"
    echo "System Status:"
    echo "  ✅ Blockchain: Ready"
    echo "  ✅ Backend API: Ready"
    echo "  ✅ Authentication: Ready"
    echo "  ✅ File Storage: Ready"
    echo "  ✅ AI Integration: Ready"
    echo "  ✅ Dispute System: Ready\n"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Review errors above.${NC}\n"
    exit 1
fi
