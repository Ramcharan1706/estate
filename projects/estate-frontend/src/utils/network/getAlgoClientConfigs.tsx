import { AlgoViteClientConfig, AlgoViteKMDConfig } from '../../interfaces/network';

/**
 * Fetch the Algod configuration from Vite environment variables.
 * Token is optional for public endpoints like Algonode.
 */
export const getAlgodConfigFromViteEnvironment = (): AlgoViteClientConfig => {
  // Destructure and set default values for environment variables
  const token = import.meta.env.VITE_ALGOD_API_TOKEN || ''; // Optional for public nodes
  const server = import.meta.env.VITE_ALGOD_API_SERVER || 'https://testnet-api.algonode.cloud';
  const port = import.meta.env.VITE_ALGOD_API_PORT || '';
  const network = import.meta.env.VITE_ALGOD_NETWORK || 'testnet';

  if (!server) {
    throw new Error('Missing required environment variable: VITE_ALGOD_API_SERVER');
  }

  return {
    token,
    server,
    port,
    network,
  };
};

/**
 * Fetch the Indexer configuration from Vite environment variables.
 * Token is optional for public endpoints.
 */
export const getIndexerConfigFromViteEnvironment = (): AlgoViteClientConfig => {
  const token = import.meta.env.VITE_INDEXER_API_TOKEN || '';
  const server = import.meta.env.VITE_INDEXER_API_SERVER || 'https://testnet-idx.algonode.cloud';
  const port = import.meta.env.VITE_INDEXER_API_PORT || '';
  const network = import.meta.env.VITE_ALGOD_NETWORK || 'testnet';

  if (!server) {
    throw new Error('Missing required environment variable: VITE_INDEXER_API_SERVER');
  }

  return {
    token,
    server,
    port,
    network,
  };
};

/**
 * Fetch the KMD configuration from Vite environment variables.
 * All KMD values are required.
 */
export const getKmdConfigFromViteEnvironment = (): AlgoViteKMDConfig => {
  const token = import.meta.env.VITE_KMD_API_TOKEN;
  const server = import.meta.env.VITE_KMD_API_SERVER;
  const port = import.meta.env.VITE_KMD_API_PORT || 4002;
  const wallet = import.meta.env.VITE_KMD_WALLET;
  const password = import.meta.env.VITE_KMD_PASSWORD;

  // Check that all required KMD environment variables are available
  if (!token || !server || !wallet || password === undefined) {
    throw new Error('Missing required environment variables for KMD. Please check your .env file.');
  }

  return {
    token,
    server,
    port,
    wallet,
    password,
  };
};
