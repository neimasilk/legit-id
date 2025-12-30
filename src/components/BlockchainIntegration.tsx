import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, ExternalLink, Wallet } from 'lucide-react';
import { blockchainService } from '../services/blockchainService';

interface BlockchainIntegrationProps {
  userId: string;
  documentHash: string;
  verificationLevel: string;
  onBlockchainComplete: (transactionHash: string) => void;
  onError: (error: string) => void;
}

export default function BlockchainIntegration({
  userId,
  documentHash,
  verificationLevel,
  onBlockchainComplete,
  onError
}: BlockchainIntegrationProps) {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'registering' | 'completed' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_accounts'
        });
        setWalletConnected(accounts.length > 0);
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      setError('MetaMask or Web3 wallet not detected. Please install MetaMask.');
      return;
    }

    try {
      setStatus('connecting');
      
      // Request account access
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts available');
      }

      // Initialize blockchain service with MetaMask
      const success = await blockchainService.initialize();
      
      if (success) {
        setWalletConnected(true);
        setStatus('idle');
      } else {
        throw new Error('Failed to initialize blockchain service');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet');
      setStatus('error');
      onError(error.message || 'Failed to connect wallet');
    }
  };

  const registerIdentityOnBlockchain = async () => {
    if (!walletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setStatus('registering');
      setError('');

      const txHash = await blockchainService.registerIdentity(
        userId,
        documentHash,
        verificationLevel
      );

      setTransactionHash(txHash);
      setStatus('completed');
      onBlockchainComplete(txHash);
    } catch (error: any) {
      setError(error.message || 'Failed to register identity on blockchain');
      setStatus('error');
      onError(error.message || 'Failed to register identity on blockchain');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connecting':
      case 'registering':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Wallet className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connecting':
        return 'Connecting wallet...';
      case 'registering':
        return 'Registering identity on blockchain...';
      case 'completed':
        return 'Identity registered successfully!';
      case 'error':
        return error;
      default:
        return 'Ready to register on blockchain';
    }
  };

  const getEtherscanUrl = (hash: string) => {
    return `https://polygonscan.com/tx/${hash}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Blockchain Verification</h3>
        {getStatusIcon()}
      </div>

      <div className="space-y-4">
        {!walletConnected ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Connect your MetaMask wallet to register your identity on the blockchain.
            </p>
            <button
              onClick={connectWallet}
              disabled={status === 'connecting'}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'connecting' ? 'Connecting...' : 'Connect MetaMask'}
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>User ID:</strong> {userId}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Document Hash:</strong> {documentHash.slice(0, 10)}...{documentHash.slice(-10)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Verification Level:</strong> {verificationLevel}
              </p>
            </div>

            {status === 'completed' && transactionHash && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-800 font-medium">Transaction Successful!</p>
                    <p className="text-green-600 text-sm">
                      Your identity has been registered on the blockchain.
                    </p>
                  </div>
                  <a
                    href={getEtherscanUrl(transactionHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
                <p className="text-green-600 text-xs mt-2 font-mono">
                  {transactionHash}
                </p>
              </div>
            )}

            {status !== 'completed' && (
              <button
                onClick={registerIdentityOnBlockchain}
                disabled={status === 'registering'}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {status === 'registering' ? 'Registering...' : 'Register on Blockchain'}
              </button>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-blue-800 font-medium mb-2">Why Blockchain?</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Immutable record of your identity verification</li>
            <li>• Decentralized verification system</li>
            <li>• Enhanced security and transparency</li>
            <li>• Cross-platform identity portability</li>
          </ul>
        </div>
      </div>
    </div>
  );
}