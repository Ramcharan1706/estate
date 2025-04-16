import algosdk from 'algosdk';

// 🧠 Config - Pull from Vite or define here
const algodToken = import.meta.env.VITE_ALGOD_TOKEN;
const algodServer = import.meta.env.VITE_ALGOD_SERVER;
const algodPort = import.meta.env.VITE_ALGOD_PORT;

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Example utility function to call a smart contract
export const callSmartContract = async ({
  senderMnemonic,
  appId,
  appArgs,
}: {
  senderMnemonic: string;
  appId: number;
  appArgs: string[];
}) => {
  const sender = algosdk.mnemonicToSecretKey(senderMnemonic);
  const params = await algodClient.getTransactionParams().do();

  const txn = algosdk.makeApplicationCallTxnFromObject({
    from: sender.addr,
    appIndex: appId,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    appArgs: appArgs.map((arg) => new TextEncoder().encode(arg)),
    suggestedParams: { ...params },
  });

  const signedTxn = txn.signTxn(sender.sk);
  const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
  await algosdk.waitForConfirmation(algodClient, txId, 4);

  return txId;
};
