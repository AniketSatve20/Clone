# Filecoin & Decentralized Storage Implementation

## Overview

HumanWork now has enterprise-grade decentralized storage using **Filecoin** and **IPFS** via NFT.storage, with support for multi-backend redundancy and permanent archival.

---

## 🗄️ Storage Architecture

### Three-Tier Storage System

```
┌─────────────────────────────────────────────────┐
│     Unified Storage Service (storage.ts)        │
│  - Multi-backend abstraction layer              │
│  - Redundancy management                        │
│  - Pricing & health monitoring                  │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┼─────────┐
        │         │         │
        ▼         ▼         ▼
    ┌────────┐ ┌──────────┐ ┌─────────┐
    │  IPFS  │ │ Filecoin │ │ Arweave │
    │ Pinning│ │ (Deals)  │ │(Coming) │
    └────────┘ └──────────┘ └─────────┘
        │         │         │
        └─────────┼─────────┘
                  │
        ┌─────────▼──────────┐
        │ Local Cache Layer  │
        │ (Fast Retrieval)   │
        └────────────────────┘
```

---

## 📦 Components

### 1. **Filecoin Service** (`modules/storage/filecoin.ts`)

Enterprise-grade file storage using NFT.storage (which handles both IPFS pinning and Filecoin deals).

**Key Features:**
- Upload files with automatic IPFS pinning and Filecoin storage
- Retrieve files from cache or network
- Check file availability across providers
- Monitor Filecoin deal status
- List and manage stored files
- Calculate storage statistics
- Local caching for performance

**Methods:**

```typescript
// Upload operations
uploadFile(fileBuffer, filename, mimeType)
uploadFileFromPath(filePath, customName)
uploadStream(stream, filename, mimeType)

// Retrieval operations
retrieveFile(ipfsCid)
getFromCache(ipfsCid)

// Status operations
checkFilecoinAvailability(ipfsCid)
getStorageMetadata(ipfsCid, filename, fileBuffer, mimeType)

// Management operations
listStoredFiles()
deleteFile(ipfsCid)
getStorageStats()
```

### 2. **Unified Storage Service** (`storage.ts`)

Abstraction layer supporting multiple backends with automatic failover and redundancy.

**Key Features:**
- Multi-backend upload (IPFS, Filecoin, Arweave)
- Intelligent backend selection and failover
- Redundancy tracking across providers
- Pricing estimates for each backend
- Storage health monitoring
- Centralized metadata management

**Methods:**

```typescript
uploadFile(fileBuffer, options)      // Multi-backend upload
retrieveFile(cid, preferredBackend)  // Smart retrieval
getRedundancyInfo(cid)               // Check replication
getPricingEstimates(sizeInBytes)     // Cost analysis
getStorageHealth()                   // System health
```

### 3. **Storage API** (`api-storage.ts`)

RESTful endpoints for file operations.

**Endpoints:**

```
POST   /api/storage/upload              - Upload single file
POST   /api/storage/upload/multi        - Upload multiple files
GET    /api/storage/:cid                - Download file
GET    /api/storage/:cid/metadata       - Get file metadata
GET    /api/storage/:cid/status         - Check availability
GET    /api/storage/list                - List stored files
GET    /api/storage/stats               - Get storage statistics
DELETE /api/storage/:cid                - Delete file
```

---

## 🚀 Getting Started

### 1. Set Environment Variables

Create `.env` file:

```env
# NFT.storage API Key (get from https://nft.storage)
NFT_STORAGE_KEY=your_api_key_here

# Storage configuration
STORAGE_LOCAL_CACHE_PATH=./.cache/storage
STORAGE_MAX_FILE_SIZE=104857600  # 100MB
STORAGE_BACKENDS=ipfs,filecoin   # Comma-separated list

# Filecoin configuration
FILECOIN_REDUNDANCY=3  # Number of storage providers
FILECOIN_DEAL_DURATION=540  # Epochs (~90 days)
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

This installs:
- `form-data` - Multipart form handling for NFT.storage
- `multer` - Express file upload middleware

### 3. Build and Start Backend

```bash
npm run build
npm run dev
```

Server will start on `http://localhost:3000` with storage endpoints available at `/api/storage/*`

---

## 📤 Upload Examples

### Single File Upload

```bash
curl -X POST http://localhost:3000/api/storage/upload \
  -F "file=@/path/to/file.pdf" \
  -F "fileName=document.pdf" \
  -F "projectId=1"
```

**Response:**
```json
{
  "success": true,
  "uploadId": "1701593804821_a1b2c3d4e5f6",
  "ipfsCid": "QmXxxx...",
  "storageUrl": "https://QmXxxx....ipfs.nft.storage",
  "size": 245789,
  "metadata": {
    "filename": "document.pdf",
    "size": 245789,
    "mimeType": "application/pdf",
    "uploadedAt": 1701593804821,
    "ipfsCid": "QmXxxx...",
    "contentHash": "abc123def456...",
    "retrieval": {
      "ipfs": true,
      "filecoin": true,
      "pinned": true
    }
  },
  "filecoinDeals": [
    {
      "dealId": "12345",
      "provider": "f0123456",
      "status": "active",
      "expirationEpoch": 3000000,
      "pricePerEpoch": "1000000000"
    }
  ]
}
```

### Multiple Files Upload

```bash
curl -X POST http://localhost:3000/api/storage/upload/multi \
  -F "files=@/path/to/file1.pdf" \
  -F "files=@/path/to/file2.docx" \
  -F "files=@/path/to/file3.jpg"
```

**Response:**
```json
{
  "success": true,
  "uploadedCount": 3,
  "failedCount": 0,
  "results": [
    {
      "filename": "file1.pdf",
      "ipfsCid": "QmXxxx...",
      "storageUrl": "https://...",
      "size": 123456,
      "success": true
    }
    // ... more files
  ]
}
```

---

## 📥 Retrieval Examples

### Download File

```bash
curl http://localhost:3000/api/storage/QmXxxx... \
  -o downloaded_file.pdf
```

### Get File Metadata

```bash
curl http://localhost:3000/api/storage/QmXxxx.../metadata | jq .
```

**Response:**
```json
{
  "cid": "QmXxxx...",
  "availability": {
    "available": true,
    "deals": 3,
    "providers": ["f0123456", "f0789012", "f0345678"]
  },
  "filecoinDeals": [
    {
      "dealId": "12345",
      "provider": "f0123456",
      "status": "active",
      "expirationEpoch": 3000000,
      "pricePerEpoch": "1000000000"
    }
    // ... more deals
  ],
  "providers": ["f0123456", "f0789012", "f0345678"],
  "retrieval": {
    "ipfs": true,
    "filecoin": true
  }
}
```

### Check File Status

```bash
curl http://localhost:3000/api/storage/QmXxxx.../status | jq .
```

**Response:**
```json
{
  "cid": "QmXxxx...",
  "status": {
    "ipfs": "available",
    "filecoin": "available",
    "pinned": true
  },
  "deals": [...],
  "providers": ["f0123456", "f0789012"],
  "lastChecked": "2024-12-03T12:34:56.000Z"
}
```

---

## 📊 Monitoring Examples

### Get Storage Statistics

```bash
curl http://localhost:3000/api/storage/stats | jq .
```

**Response:**
```json
{
  "storage": {
    "totalFiles": 42,
    "totalSize": 5368709120,
    "providers": 8,
    "cacheSize": 1073741824
  },
  "network": {
    "ipfs": "pinned",
    "filecoin": "active"
  },
  "timestamp": "2024-12-03T12:34:56.000Z"
}
```

### List All Stored Files

```bash
curl http://localhost:3000/api/storage/list | jq .
```

### Delete File

```bash
curl -X DELETE http://localhost:3000/api/storage/QmXxxx...
```

---

## 💰 Pricing Model

### NFT.storage (IPFS + Filecoin)
- **Cost:** Free for up to 1GB
- **Included:** IPFS pinning + Filecoin storage
- **Duration:** 1 year minimum
- **Providers:** 3+ geographically diverse providers

### Storage Tier Breakdown

| Backend | Size Limit | Cost | Redundancy | Duration |
|---------|-----------|------|-----------|----------|
| IPFS | 1GB free | $0 | 3+ nodes | Indefinite |
| Filecoin | 1GB free | $0 | 3+ providers | 1 year |
| Arweave | Custom | ~$0.0015/MB | 1 | Permanent |

### Estimated Costs

```
File Size: 100MB
- IPFS: $0 (included)
- Filecoin: $0 (included with NFT.storage)
- Arweave: ~$0.15 (one-time, permanent)
```

---

## 🔒 Security Features

### File Integrity
- **SHA-256 hashing** for content verification
- **IPFS content addressing** ensures immutability
- **Multiple provider redundancy** prevents censorship

### Privacy
- Files stored on decentralized network
- No single point of failure
- Cannot be modified or deleted (unless explicitly requested)
- Cryptographic verification of data

### Access Control
- File download requires valid CID
- Optional authentication headers (future)
- Rate limiting (future)

---

## ⚡ Performance

### Caching Strategy
- Local memory cache for frequently accessed files
- Automatic cache invalidation (configurable)
- Concurrent upload/download support

### Benchmarks
- Small file (<10MB): ~1-2 seconds to Filecoin
- Medium file (10-100MB): ~5-15 seconds
- Large file (100MB+): ~30+ seconds
- Retrieval: ~100ms-1s (cached), ~2-5s (network)

---

## 🛠️ Advanced Usage

### Upload with Multi-Backend Redundancy

```typescript
import { createUnifiedStorageService, StorageBackend } from './storage';

const service = createUnifiedStorageService();

const metadata = await service.uploadFile(fileBuffer, {
  filename: 'important-document.pdf',
  backends: [StorageBackend.IPFS, StorageBackend.FILECOIN],
  redundancy: 5 // 5 Filecoin providers
});

console.log('File backed up to:', {
  ipfs: metadata.backends.ipfs?.cid,
  filecoin: metadata.backends.filecoin?.cid,
  providers: metadata.backends.filecoin?.deals
});
```

### Smart Retrieval with Fallback

```typescript
// Try to retrieve from Filecoin first, fallback to IPFS
const file = await service.retrieveFile(
  'QmXxxx...',
  StorageBackend.FILECOIN
);
```

### Monitor Redundancy

```typescript
const redundancy = await service.getRedundancyInfo('QmXxxx...');

console.log(`File stored on:
  - IPFS: ${redundancy.backends.ipfs}
  - Filecoin: ${redundancy.backends.filecoin}
  - Total providers: ${redundancy.providers.length}
  - Redundancy score: ${redundancy.totalRedundancy}
`);
```

---

## 📋 Roadmap

- [x] IPFS + Filecoin integration (NFT.storage)
- [x] Multi-backend support
- [x] Local caching layer
- [x] File metadata and tracking
- [x] Storage statistics and health
- [ ] Arweave integration
- [ ] Custom pricing models
- [ ] Advanced access control
- [ ] Database persistence for metadata
- [ ] Analytics and reporting

---

## 🆘 Troubleshooting

### Issue: Files not appearing on Filecoin

**Solution:** Filecoin deals take 1-2 hours to activate. Check status via:
```bash
curl http://localhost:3000/api/storage/:cid/status
```

### Issue: Large files timing out

**Solution:** Increase timeouts in `.env`:
```env
STORAGE_UPLOAD_TIMEOUT=300000  # 5 minutes
STORAGE_RETRIEVAL_TIMEOUT=60000  # 1 minute
```

### Issue: Local cache running out of space

**Solution:** Clear cache and configure limit:
```bash
rm -rf .cache/storage
# Set in .env:
STORAGE_CACHE_MAX_SIZE=5368709120  # 5GB
```

---

## 📚 References

- [NFT.storage Documentation](https://nft.storage/docs/)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [Filecoin Documentation](https://docs.filecoin.io/)
- [Content Addressing Spec](https://github.com/multiformats/cid)

---

**Version:** 1.0.0  
**Last Updated:** December 3, 2025
