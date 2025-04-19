import algosdk from 'algosdk';

// Replace these with actual values from your environment
const ALGOD_SERVER = 'https://testnet-api.algonode.cloud';
const ALGOD_PORT = '443';
const ALGOD_TOKEN = 'algonode';

// Initialize algod client
export const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);

export default algodClient;
