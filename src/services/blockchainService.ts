import { ethers } from 'ethers';

// Identity Verification Contract ABI (simplified version)
const IDENTITY_CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "userId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "documentHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "verificationLevel",
        "type": "string"
      }
    ],
    "name": "registerIdentity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "userId",
        "type": "string"
      }
    ],
    "name": "getIdentity",
    "outputs": [
      {
        "internalType": "string",
        "name": "documentHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "verificationLevel",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "userId",
        "type": "string"
      }
    ],
    "name": "verifyIdentity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "userId",
        "type": "string"
      }
    ],
    "name": "revokeIdentity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "userId",
        "type": "string"
      }
    ],
    "name": "isIdentityVerified",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export interface IdentityRecord {
  documentHash: string;
  verificationLevel: string;
  timestamp: number;
  isVerified: boolean;
}

export interface BlockchainConfig {
  rpcUrl: string;
  contractAddress: string;
  chainId: number;
}

class BlockchainService {
  private provider: ethers.Provider | null = null;
  private contract: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;

  constructor(private config: BlockchainConfig) {}

  async initialize(provider?: ethers.Provider, signer?: ethers.Signer) {
    try {
      if (provider && signer) {
        this.provider = provider;
        this.signer = signer;
      } else if (typeof window !== 'undefined' && (window as any).ethereum) {
        // Use MetaMask or other Web3 provider
        this.provider = new ethers.BrowserProvider((window as any).ethereum);
        this.signer = await this.provider.getSigner();
      } else {
        // Fallback to default provider (read-only)
        this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl);
      }

      if (this.signer) {
        this.contract = new ethers.Contract(
          this.config.contractAddress,
          IDENTITY_CONTRACT_ABI,
          this.signer
        );
      } else if (this.provider) {
        this.contract = new ethers.Contract(
          this.config.contractAddress,
          IDENTITY_CONTRACT_ABI,
          this.provider
        );
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      return false;
    }
  }

  async registerIdentity(
    userId: string,
    documentHash: string,
    verificationLevel: string
  ): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error('Blockchain service not initialized or no signer available');
    }

    try {
      const tx = await this.contract.registerIdentity(
        userId,
        documentHash,
        verificationLevel
      );
      
      console.log('Transaction submitted:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.transactionHash);
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Failed to register identity:', error);
      throw new Error('Failed to register identity on blockchain');
    }
  }

  async getIdentity(userId: string): Promise<IdentityRecord | null> {
    if (!this.contract) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      const result = await this.contract.getIdentity(userId);
      
      return {
        documentHash: result.documentHash,
        verificationLevel: result.verificationLevel,
        timestamp: Number(result.timestamp),
        isVerified: result.isVerified
      };
    } catch (error) {
      console.error('Failed to get identity:', error);
      return null;
    }
  }

  async verifyIdentity(userId: string): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error('Blockchain service not initialized or no signer available');
    }

    try {
      const tx = await this.contract.verifyIdentity(userId);
      
      console.log('Verification transaction submitted:', tx.hash);
      const receipt = await tx.wait();
      console.log('Verification transaction confirmed:', receipt.transactionHash);
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Failed to verify identity:', error);
      throw new Error('Failed to verify identity on blockchain');
    }
  }

  async revokeIdentity(userId: string): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error('Blockchain service not initialized or no signer available');
    }

    try {
      const tx = await this.contract.revokeIdentity(userId);
      
      console.log('Revocation transaction submitted:', tx.hash);
      const receipt = await tx.wait();
      console.log('Revocation transaction confirmed:', receipt.transactionHash);
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Failed to revoke identity:', error);
      throw new Error('Failed to revoke identity on blockchain');
    }
  }

  async isIdentityVerified(userId: string): Promise<boolean> {
    if (!this.contract) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      return await this.contract.isIdentityVerified(userId);
    } catch (error) {
      console.error('Failed to check identity verification status:', error);
      return false;
    }
  }

  generateDocumentHash(documentData: string): string {
    return ethers.keccak256(ethers.toUtf8Bytes(documentData));
  }

  generateFileHash(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const hash = ethers.keccak256(new Uint8Array(event.target.result as ArrayBuffer));
          resolve(hash);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  async getTransactionStatus(transactionHash: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      const receipt = await this.provider.getTransactionReceipt(transactionHash);
      
      if (!receipt) {
        return 'pending';
      }
      
      return receipt.status === 1 ? 'confirmed' : 'failed';
    } catch (error) {
      console.error('Failed to get transaction status:', error);
      return 'unknown';
    }
  }

  async getGasPrice(): Promise<bigint> {
    if (!this.provider) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      return await this.provider.getFeeData().then(data => data.gasPrice || 0n);
    } catch (error) {
      console.error('Failed to get gas price:', error);
      return 0n;
    }
  }

  formatEther(value: bigint): string {
    return ethers.formatEther(value);
  }

  parseEther(value: string): bigint {
    return ethers.parseEther(value);
  }
}

// Default configurations for different networks
export const BLOCKCHAIN_CONFIGS = {
  ethereum: {
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
    contractAddress: '0x1234567890123456789012345678901234567890',
    chainId: 1
  },
  polygon: {
    rpcUrl: 'https://polygon-rpc.com',
    contractAddress: '0x0987654321098765432109876543210987654321',
    chainId: 137
  },
  mumbai: {
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    contractAddress: '0x1111111111111111111111111111111111111111',
    chainId: 80001
  }
};

// Create default service instance
export const blockchainService = new BlockchainService(BLOCKCHAIN_CONFIGS.polygon);

export default BlockchainService;