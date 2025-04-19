// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WalletProvider } from '@txnlab/use-wallet';
import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { PeraWalletConnect } from '@perawallet/connect';
import algosdk from 'algosdk';

// Define the wallet providers
const walletProviders = [
  new DeflyWalletConnect(),
  new PeraWalletConnect(),
];

// Create the algodClient
const algodClient = new algosdk.Algodv2(
  '', // API Token (empty for testnet in this case)
  'https://testnet-api.algonode.cloud', // API Server (Testnet URL)
  '' // Port (empty for default)
);

// Prepare the wallet config
const walletConfig = {
  algodClient, // Pass the client here
  network: 'testnet', // Network configuration
  providers: walletProviders, // Wallet providers
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WalletProvider value={walletConfig}> {/* Pass the walletConfig through `value` prop */}
      <App />
    </WalletProvider>
  </React.StrictMode>
);
