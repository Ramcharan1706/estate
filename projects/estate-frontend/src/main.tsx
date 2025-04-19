import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ✅ Error boundary wrapper
import { ErrorBoundary } from './components/ErrorBoundary';

// ✅ WalletProvider import
import { WalletProvider } from '@txnlab/use-wallet-react';

// ✅ Wallet connectors
import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { PeraWalletConnect } from '@perawallet/connect';

// ✅ Algorand SDK
import algosdk from 'algosdk';

// ✅ Create Algod client (Testnet - Algonode)
const algodClient = new algosdk.Algodv2(
  '', // No token required for Algonode
  'https://testnet-api.algonode.cloud',
  ''
);

// ✅ Wallet providers
const walletProviders = [
  new PeraWalletConnect(),
  new DeflyWalletConnect(),
];

// ✅ Render the app with WalletProvider + ErrorBoundary
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <WalletProvider
        algodClient={algodClient}
        network="testnet"
        providers={walletProviders}
      >
        <App />
      </WalletProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
