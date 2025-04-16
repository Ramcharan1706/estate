// src/utils/network/getAlgoClientConfigs.ts

import { AlgoViteClientConfig, AlgoViteKMDConfig } from '../../interfaces/network';

/**
 * Fetch the Algod configuration from Vite environment variables.
 * @throws Error if required environment variables are not set.
 */
export function getAlgodConfigFromViteEnvironment(): AlgoViteClientConfig {
  const server = import.meta.env.VITE_ALGOD_SERVER;
  const port = import.meta.env.VITE_ALGOD_PORT || '';
  const token = import.meta.env.VITE_ALGOD_TOKEN;
  const network = import.meta.env.VITE_ALGOD_NETWORK || 'testnet';

  if (!server || !token) {
    throw new Error('Missing required environment variables for Algod configuration: VITE_ALGOD_SERVER or VITE_ALGOD_TOKEN');
  }

  return { server, port, token, network };
}

/**
 * Fetch the Indexer configuration from Vite environment variables.
 * @throws Error if required environment variables are not set.
 */
export function getIndexerConfigFromViteEnvironment(): AlgoViteClientConfig {
  const server = import.meta.env.VITE_INDEXER_SERVER;
  const port = import.meta.env.VITE_INDEXER_PORT || '';
  const token = import.meta.env.VITE_INDEXER_TOKEN;
  const network = import.meta.env.VITE_ALGOD_NETWORK || 'testnet';

  if (!server || !token) {
    throw new Error('Missing required environment variables for Indexer configuration: VITE_INDEXER_SERVER or VITE_INDEXER_TOKEN');
  }

  return { server, port, token, network };
}

/**
 * Fetch the KMD configuration from Vite environment variables.
 * @throws Error if required environment variables are not set.
 */
export function getKmdConfigFromViteEnvironment(): AlgoViteKMDConfig {
  const server = import.meta.env.VITE_KMD_SERVER;
  const port = import.meta.env.VITE_KMD_PORT || '';
  const token = import.meta.env.VITE_KMD_TOKEN;
  const wallet = import.meta.env.VITE_KMD_WALLET;
  const password = import.meta.env.VITE_KMD_PASSWORD;

  if (!server || !token || !wallet || !password) {
    throw new Error('Missing required environment variables for KMD configuration: VITE_KMD_SERVER, VITE_KMD_TOKEN, VITE_KMD_WALLET, or VITE_KMD_PASSWORD');
  }

  return { server, port, token, wallet, password };
}
