import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WalletProvider } from '@txnlab/use-wallet-react';
import { PeraWallet } from '@txnlab/use-wallet'; // Correct Pera Wallet import
import { algodClient } from './src/algodClient'; // Ensure this is correct or use the client directly here

// Components
import { ErrorBoundary } from './components/ErrorBoundary';
import PropertyList from './components/propertylist';
import PropertyDetail from './components/propertydetail';
import Account from './components/Account';
import AppCalls from './components/AppCalls';

const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [algodReady, setAlgodReady] = useState(false);

  // Define wallet connectors
  const wallets = [
    new PeraWallet({
      id: 'pera-wallet',
      metadata: { name: 'Pera Wallet' },
    }),
  ];

  // Check if algodClient is ready
  useEffect(() => {
    if (algodClient) {
      console.log('✅ Algod Client is ready:', algodClient);
      setAlgodReady(true);
    } else {
      console.error('❌ algodClient is undefined');
    }
  }, [algodClient]);

  // Show loading message while algodClient is initializing
  if (!algodReady) {
    return <div className="p-10 text-center">🔄 Initializing Algod Client...</div>;
  }

  return (
    <ErrorBoundary>
      {/* Wrap the app in WalletProvider and pass algodClient to it */}
      <WalletProvider wallets={wallets} algodClient={algodClient}>
        <BrowserRouter>
          <div className="min-h-screen bg-base-200 p-10">
            <section className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl font-bold">🪪 Land Verification on Algorand</h1>

              {/* Wallet & Account Info */}
              <Account />

              {/* Fetch Account Info Button */}
              <div className="mt-4">
                <button
                  className="btn btn-outline btn-info"
                  onClick={async () => {
                    try {
                      const info = await algodClient.accountInformation('your-account-address').do();
                      console.log('📄 Account Info:', info);
                    } catch (error) {
                      console.error('❌ Error fetching account info:', error);
                    }
                  }}
                >
                  Fetch Account Info
                </button>
              </div>

              {/* Interact with Smart Contract */}
              <div className="pt-6">
                <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                  Interact with Smart Contract
                </button>
              </div>
            </section>

            {/* Route Views */}
            <Routes>
              <Route path="/" element={<PropertyList />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>

            {/* Smart Contract Modal */}
            <AppCalls openModal={modalOpen} setModalState={setModalOpen} />
          </div>
        </BrowserRouter>
      </WalletProvider>
    </ErrorBoundary>
  );
};

export default App;
