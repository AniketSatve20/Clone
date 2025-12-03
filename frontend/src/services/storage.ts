/**
 * Decentralized Storage Integration
 * Supports IPFS (via NFT.storage), Filecoin, and Arweave
 */

import axios from 'axios';

export interface StorageProvider {
  name: 'ipfs' | 'filecoin' | 'arweave' | 'bundlr';
  ipfsHash?: string;
  arweaveHash?: string;
  contentHash: string;
  provider: string;
  timestamp: number;
  size: number;
  mimeType: string;
}

class DecentralizedStorage {
  private nftStorageKey = process.env.VITE_NFT_STORAGE_KEY || '';
  private filecoinKey = process.env.VITE_FILECOIN_KEY || '';
  private arweaveKey = process.env.VITE_ARWEAVE_KEY || '';

  /**
   * Upload to IPFS via NFT.storage (free tier: 1GB total)
   */
  async uploadToIPFS(file: File): Promise<StorageProvider> {
    if (!this.nftStorageKey) {
      throw new Error('NFT.storage key not configured');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        'https://api.nft.storage/upload',
        formData,
        {
          headers: {
            Authorization: `Bearer ${this.nftStorageKey}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const { value } = response.data;

      return {
        name: 'ipfs',
        ipfsHash: value.cid,
        contentHash: value.cid,
        provider: `ipfs://${value.cid}`,
        timestamp: Date.now(),
        size: file.size,
        mimeType: file.type,
      };
    } catch (error) {
      throw new Error(`IPFS upload failed: ${error}`);
    }
  }

  /**
   * Upload to Filecoin via NFT.storage (automatic with IPFS)
   * Filecoin integration happens automatically when using NFT.storage
   */
  async uploadToFilecoin(file: File): Promise<StorageProvider> {
    // NFT.storage automatically backs up IPFS data to Filecoin
    // So uploading to IPFS also stores on Filecoin
    const ipfsResult = await this.uploadToIPFS(file);

    return {
      ...ipfsResult,
      name: 'filecoin',
      provider: `filecoin://${ipfsResult.ipfsHash}`,
    };
  }

  /**
   * Upload to Arweave (1MB+ data can be permanently stored)
   */
  async uploadToArweave(file: File): Promise<StorageProvider> {
    if (!this.arweaveKey) {
      throw new Error('Arweave key not configured');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        'https://api.arweave.net/tx',
        formData,
        {
          headers: {
            'X-API-Key': this.arweaveKey,
          },
        }
      );

      return {
        name: 'arweave',
        arweaveHash: response.data.id,
        contentHash: response.data.id,
        provider: `ar://${response.data.id}`,
        timestamp: Date.now(),
        size: file.size,
        mimeType: file.type,
      };
    } catch (error) {
      throw new Error(`Arweave upload failed: ${error}`);
    }
  }

  /**
   * Get IPFS content URL
   */
  getIPFSUrl(ipfsHash: string): string {
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  }

  /**
   * Get Arweave content URL
   */
  getArweaveUrl(txId: string): string {
    return `https://arweave.net/${txId}`;
  }

  /**
   * Verify content exists on IPFS
   */
  async verifyIPFSContent(ipfsHash: string): Promise<boolean> {
    try {
      const response = await axios.head(this.getIPFSUrl(ipfsHash), {
        timeout: 5000,
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  /**
   * Verify content on Arweave
   */
  async verifyArweaveContent(txId: string): Promise<boolean> {
    try {
      const response = await axios.head(this.getArweaveUrl(txId), {
        timeout: 5000,
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  /**
   * Calculate file hash for verification
   */
  async calculateHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}

export const storageService = new DecentralizedStorage();
