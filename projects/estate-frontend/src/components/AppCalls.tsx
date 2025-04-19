import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

import {
  getAlgodConfigFromViteEnvironment,
  getIndexerConfigFromViteEnvironment,
} from '../utils/network/getAlgoClientConfigs'

interface AppCallsInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const AppCalls = ({ openModal, setModalState }: AppCallsInterface) => {
  const [loading, setLoading] = useState(false)
  const [landTokenId, setLandTokenId] = useState<number>(0)
  const [buyerAddress, setBuyerAddress] = useState('')
  const [documentHash, setDocumentHash] = useState('')

  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const indexerConfig = getIndexerConfigFromViteEnvironment()

  const algorand = AlgorandClient.fromConfig({
    algodConfig,
    indexerConfig,
  })
  algorand.setDefaultSigner(transactionSigner)

  const appId = 123456 // <-- Replace with your actual app ID

  const sendAppCall = async () => {
    if (!activeAddress) {
      enqueueSnackbar('Wallet not connected', { variant: 'error' })
      return
    }

    const isDocumentHashValid = !!documentHash.trim()
    const isTransferValid = !!landTokenId && !!buyerAddress.trim()

    if (!isDocumentHashValid && !isTransferValid) {
      enqueueSnackbar(
        'Please enter a document hash OR both Land Token ID and Buyer Address.',
        { variant: 'warning' }
      )
      return
    }

    // Validate buyer address
    if (buyerAddress && !algosdk.isValidAddress(buyerAddress)) {
      enqueueSnackbar('Invalid Algorand address.', { variant: 'error' })
      return
    }

    setLoading(true)

    try {
      const suggestedParams = await algorand.getAlgodClient().getTransactionParams().do()

      const appArgs = isDocumentHashValid
        ? [
            new TextEncoder().encode('submit_verification'),
            new TextEncoder().encode(documentHash),
          ]
        : [
            new TextEncoder().encode('transfer_land_token'),
            algosdk.encodeUint64(landTokenId),
            algosdk.decodeAddress(activeAddress).publicKey,
            algosdk.decodeAddress(buyerAddress).publicKey,
          ]

      const txn = algosdk.makeApplicationNoOpTxnFromObject({
        sender: activeAddress,
        appIndex: appId,
        suggestedParams,
        appArgs,
      })

      // Sign the transaction using the transaction signer
      const signedTxn = await transactionSigner([txn], [0])

      const { txId } = await algorand.getAlgodClient().sendRawTransaction(signedTxn).do()
      await algosdk.waitForConfirmation(algorand.getAlgodClient(), txId, 4)
      enqueueSnackbar('Transaction successful!', { variant: 'success' })
      console.log('Transaction ID:', txId)

      // Clear fields
      if (isDocumentHashValid) setDocumentHash('')
      if (isTransferValid) {
        setLandTokenId(0)
        setBuyerAddress('')
      }
    } catch (error) {
      console.error(error)
      enqueueSnackbar(`Error: ${(error as Error).message}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog
      id="appcalls_modal"
      className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}
    >
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Land Verification Smart Contract</h3>
        <br />

        <label className="label font-semibold">Document Verification</label>
        <input
          type="text"
          placeholder="Enter Document Hash"
          className="input input-bordered w-full mb-4"
          value={documentHash}
          onChange={(e) => setDocumentHash(e.target.value)}
          disabled={loading}
        />

        <label className="label font-semibold">Land Token Transfer</label>
        <input
          type="number"
          placeholder="Land Token ID"
          className="input input-bordered w-full mb-2"
          value={landTokenId}
          onChange={(e) => setLandTokenId(Number(e.target.value))}
          disabled={loading}
        />

        <input
          type="text"
          placeholder="Buyer Address"
          className="input input-bordered w-full mb-4"
          value={buyerAddress}
          onChange={(e) => setBuyerAddress(e.target.value)}
          disabled={loading}
        />

        {loading && (
          <div className="text-center text-sm text-gray-500 mb-2">
            Processing transaction...
          </div>
        )}

        <div className="modal-action">
          <button
            className="btn"
            onClick={() => setModalState(false)} // Close modal when clicked
            disabled={loading}
          >
            Close
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={sendAppCall}
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner" /> : 'Send'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default AppCalls
