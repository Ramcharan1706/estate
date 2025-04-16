import { useWallet } from '@txnlab/use-wallet-react'
import { useState, useMemo } from 'react'
import { ellipseAddress } from '../utils/ellipseAddress'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import algosdk from 'algosdk'

// DebugWallet Component
const DebugWallet = () => {
  const { activeAddress, isConnected, connect } = useWallet()

  return (
    <div className="mt-4">
      <p><strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}</p>
      <p><strong>Address:</strong> {activeAddress || 'None'}</p>
      {!isConnected && (
        <button className="btn btn-sm" onClick={() => connect()}>Connect Wallet</button>
      )}
    </div>
  )
}

// Main Account Component
const Account = () => {
  const { activeAddress, activeAccount } = useWallet()
  const [verifiedHash, setVerifiedHash] = useState('')
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null)
  const [documentHash, setDocumentHash] = useState('')
  const [landTokenId, setLandTokenId] = useState('')
  const [buyerAddress, setBuyerAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const algoConfig = getAlgodConfigFromViteEnvironment()
  const algodClient = useMemo(() => {
    return new algosdk.Algodv2(algoConfig.token as string, algoConfig.server, algoConfig.port)
  }, [algoConfig])

  const networkName = useMemo(() => {
    return algoConfig.network === '' ? 'localnet' : algoConfig.network.toLowerCase()
  }, [algoConfig.network])

  // Helper function to handle transaction
  const handleTransaction = async (txnBuilder: () => Promise<any>, successMessage: string) => {
    if (!activeAddress || !activeAccount) return
    setIsLoading(true)
    setTransactionStatus('Processing transaction...')
    try {
      const tx = await txnBuilder()
      setTransactionStatus(`${successMessage}: ${JSON.stringify(tx)}`)
    } catch (err: any) {
      console.error(err)
      setTransactionStatus(`Error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Submit document hash for verification
  const handleSubmitVerification = () => {
    handleTransaction(async () => {
      // Replace with actual logic to submit document hash
      const tx = await algodClient.sendRawTransaction([]).do() // Placeholder
      return tx
    }, 'Verification submitted')
  }

  // Get verified hash from the smart contract
  const handleGetVerifiedHash = () => {
    handleTransaction(async () => {
      // Replace with actual logic to call smart contract
      const result = 'abc123...' // Placeholder for actual verified hash
      setVerifiedHash(result)
      return result
    }, 'Verified hash fetched')
  }

  // Transfer land ownership
  const handleTransferOwnership = () => {
    handleTransaction(async () => {
      // Replace with actual logic for transferring ownership
      const tx = await algodClient.sendRawTransaction([]).do() // Placeholder
      return tx
    }, 'Ownership transferred')
  }

  return (
    <div className="space-y-6">
      <a
        className="text-xl font-semibold"
        target="_blank"
        rel="noopener noreferrer"
        href={`https://lora.algokit.io/${networkName}/account/${activeAddress}/`}
      >
        Address: {ellipseAddress(activeAddress)}
      </a>

      <div className="text-lg">Network: {networkName}</div>

      {/* Verified Hash Display */}
      <div>
        <p className="font-medium">Verified Document Hash: {verifiedHash || 'None'}</p>
        <button className="btn btn-primary" onClick={handleGetVerifiedHash} disabled={isLoading}>
          Get Verified Hash
        </button>
      </div>

      {/* Submit Document Hash */}
      <div className="space-y-2">
        <input
          type="text"
          value={documentHash}
          onChange={(e) => setDocumentHash(e.target.value)}
          placeholder="Enter Document Hash"
          className="input input-bordered w-full"
        />
        <button className="btn btn-success" onClick={handleSubmitVerification} disabled={isLoading}>
          Submit Verification
        </button>
      </div>

      {/* Transfer Ownership */}
      <div className="space-y-2">
        <input
          type="text"
          value={landTokenId}
          onChange={(e) => setLandTokenId(e.target.value)}
          placeholder="Enter Land Token ID"
          className="input input-bordered w-full"
        />
        <input
          type="text"
          value={buyerAddress}
          onChange={(e) => setBuyerAddress(e.target.value)}
          placeholder="Enter Buyer Address"
          className="input input-bordered w-full"
        />
        <button className="btn btn-warning" onClick={handleTransferOwnership} disabled={isLoading}>
          Transfer Ownership
        </button>
      </div>

      {/* Transaction Feedback */}
      {transactionStatus && <div className="text-sm text-gray-700 mt-4">{transactionStatus}</div>}

      {/* Debug Wallet Info */}
      <DebugWallet />
    </div>
  )
}

export default Account
