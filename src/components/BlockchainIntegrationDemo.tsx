import { useState } from 'react';
import { blockchainService } from '../services/blockchainService';

const BlockchainIntegrationDemo: React.FC = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState('');
  const [identityHash, setIdentityHash] = useState('');

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletConnected(true);
        setTransactionStatus('Wallet connected successfully!');
      } else {
        setTransactionStatus('MetaMask not detected. Please install MetaMask.');
      }
    } catch (error) {
      setTransactionStatus('Failed to connect wallet: ' + (error as Error).message);
    }
  };

  const testRegisterIdentity = async () => {
    if (!walletConnected) {
      setTransactionStatus('Please connect your wallet first.');
      return;
    }

    try {
      setTransactionStatus('Registering identity on blockchain...');
      
      // Generate a sample identity hash
      const sampleIdentityData = {
        fullName: 'John Doe',
        dateOfBirth: '1990-01-01',
        nationalId: '1234567890',
        email: 'john.doe@example.com'
      };
      
      const documentHash = blockchainService.generateDocumentHash(JSON.stringify(sampleIdentityData));
      const txHash = await blockchainService.registerIdentity('demo-user-id', documentHash, 'basic');
      setIdentityHash(txHash);
      setTransactionStatus('Identity registered successfully! Tx: ' + txHash);
    } catch (error) {
      setTransactionStatus('Failed to register identity: ' + (error as Error).message);
    }
  };

  const testVerifyIdentity = async () => {
    if (!identityHash) {
      setTransactionStatus('Please register an identity first.');
      return;
    }

    try {
      setTransactionStatus('Verifying identity on blockchain...');
      
      const status = await blockchainService.getTransactionStatus(identityHash);
      setTransactionStatus(status === 'confirmed' ? 'Identity verification successful!' : `Transaction status: ${status}`);
    } catch (error) {
      setTransactionStatus('Failed to verify identity: ' + (error as Error).message);
    }
  };

  const testRevokeIdentity = async () => {
    if (!identityHash) {
      setTransactionStatus('Please register an identity first.');
      return;
    }

    try {
      setTransactionStatus('Revoking identity on blockchain...');
      
      await blockchainService.revokeIdentity('demo-user-id');
      setTransactionStatus('Identity revoked successfully!');
      setIdentityHash('');
    } catch (error) {
      setTransactionStatus('Failed to revoke identity: ' + (error as Error).message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Blockchain Integration Demo</h2>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Step 1: Connect Wallet</h3>
          <button
            onClick={connectWallet}
            className={`px-4 py-2 rounded-lg font-medium ${
              walletConnected
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {walletConnected ? 'Wallet Connected ✓' : 'Connect MetaMask Wallet'}
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Step 2: Register Identity</h3>
          <button
            onClick={testRegisterIdentity}
            disabled={!walletConnected}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Register Identity on Blockchain
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Step 3: Verify Identity</h3>
          <button
            onClick={testVerifyIdentity}
            disabled={!walletConnected || !identityHash}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify Identity
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Step 4: Revoke Identity</h3>
          <button
            onClick={testRevokeIdentity}
            disabled={!walletConnected || !identityHash}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Revoke Identity
          </button>
        </div>

        {transactionStatus && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Status</h3>
            <p className="text-blue-800">{transactionStatus}</p>
          </div>
        )}

        {identityHash && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Identity Hash</h3>
            <p className="text-green-800 font-mono text-sm break-all">{identityHash}</p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">Requirements</h3>
        <ul className="text-yellow-800 text-sm space-y-1">
          <li>• MetaMask browser extension installed</li>
          <li>• Ethereum wallet with some test ETH (for testnets)</li>
          <li>• Connected to appropriate network (Ethereum/Polygon)</li>
        </ul>
      </div>
    </div>
  );
};

export default BlockchainIntegrationDemo;
