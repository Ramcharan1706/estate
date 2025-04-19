// ✅ FIXED: src/walletConfig.ts
import { Algodv2 } from 'algosdk';
import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { PeraWalletConnect } from '@perawallet/connect';
import type { WalletProviderConfig } from '@txnlab/use-wallet-react'; // ✅ corrected

const algodClient = new Algodv2(
  '', // No API token for AlgoNode
  'https://testnet-api.algonode.cloud',
  ''
);

const walletConfig: WalletProviderConfig = {
  algodClient,
  network: 'testnet',
  providers: [
    new PeraWalletConnect(),
    new DeflyWalletConnect()
  ],
};

export { walletConfig };
