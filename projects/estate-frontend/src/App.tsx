import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WalletProvider } from '@txnlab/use-wallet-react';
import { PeraWallet } from '@txnlab/use-wallet';
import algosdk from 'algosdk';

import { getAlgodConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs';

import PropertyList from './components/propertylist';
import PropertyDetail from './components/propertydetail';
import Account from './components/Account';
import AppCalls from './components/AppCalls';
import ErrorBoundary from './components/ErrorBoundary'; // Assuming you have an error boundary component

const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [algodClient, setAlgodClient] = useState<algosdk.Algodv2 | null>(null); // State for algodClient
  const [loading, setLoading] = useState(true); // State to track if the app is still loading
  const [error, setError] = useState<string | null>(null); // Error state to handle any issues

  useEffect(() => {
    const algodConfig = getAlgodConfigFromViteEnvironment();

    // Log algodConfig to debug
    console.log('Algod Config:', algodConfig);

    // Initialize algodClient only if all fields are provided
    if (algodConfig.token && algodConfig.server && algodConfig.port) {
      try {
        const client = new algosdk.Algodv2(
          algodConfig.token,
          algodConfig.server,
          algodConfig.port
        );
        setAlgodClient(client); // Set the client in state
        setError(null); // Reset error if successful
      } catch (err) {
        console.error('Error initializing Algorand client:', err);
        setError('Failed to initialize Algorand client');
      }
    } else {
      setError('Missing Algod configuration');
    }

    // After algodClient is initialized, set loading to false
    setLoading(false);
  }, []);

  const wallets = [
    new PeraWallet({
      id: 'pera-wallet',
      metadata: {
        name: 'Pera Wallet',
      },
    }),
  ];

  if (loading) {
    return <div>Loading Algorand Client...</div>; // Show a loading state while waiting for algodClient
  }

  // If there's an error initializing algodClient, show the error message
  if (error) {
    return <div>{error}</div>;
  }

  // If algodClient is not available, show an error message
  if (!algodClient) {
    return <div>Error: Failed to initialize Algorand Client</div>;
  }

  return (
    <ErrorBoundary>
      <WalletProvider wallets={wallets} algodClient={algodClient}>
        <BrowserRouter>
          <div className="min-h-screen bg-base-200 p-10">
            <section className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl font-bold">🪪 Land Verification on Algorand</h1>

              {/* Wallet & Account Section */}
              <Account />

              {/* Smart Contract Interaction Button */}
              <div className="pt-6">
                <button
                  className="btn btn-primary"
                  onClick={() => setModalOpen(true)}
                >
                  Interact with Smart Contract
                </button>
              </div>
            </section>

            {/* Routing to Components */}
            <Routes>
              <Route path="/" element={<PropertyList />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
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
