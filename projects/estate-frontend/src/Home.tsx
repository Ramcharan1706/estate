// src/components/Home.tsx
import React, { useState } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';

import Account from './components/Account';
import ConnectWallet from './components/ConnectWallet';
import Transact from './components/Transact';
import AppCalls from './components/AppCalls';

const Home: React.FC = () => {
  const { activeAddress } = useWallet();

  const [transactModalOpen, setTransactModalOpen] = useState(false);
  const [appCallModalOpen, setAppCallModalOpen] = useState(false);

  const handleConnect = (address: string) => {
    console.log('🔌 Connected address:', address);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <h1 className="text-4xl font-bold mb-6">🪪 Land Verification on Algorand</h1>

        {/* Wallet connection state */}
        {activeAddress ? <Account /> : <ConnectWallet onConnect={handleConnect} />}

        {/* Interaction buttons */}
        {activeAddress && (
          <div className="mt-6 flex flex-col gap-4">
            <button
              className="btn btn-primary"
              onClick={() => setTransactModalOpen(true)}
            >
              Send ALGO
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setAppCallModalOpen(true)}
            >
              Interact with Smart Contract
            </button>
          </div>
        )}

        {/* Modals */}
        <Transact
          openModal={transactModalOpen}
          setModalState={setTransactModalOpen}
        />

        <AppCalls
          openModal={appCallModalOpen}
          setModalState={setAppCallModalOpen}
        />
      </div>
    </div>
  );
};

export default Home;
