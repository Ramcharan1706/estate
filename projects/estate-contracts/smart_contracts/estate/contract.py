import os
import logging
import requests
import time
from requests.models import Response
from typing import Optional, Dict
from algosdk import transaction
from algosdk.v2client import algod
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configuration from environment variables
buyer_address = os.getenv("BUYER_ADDRESS")
buyer_private_key = os.getenv("BUYER_PRIVATE_KEY")
seller_address = os.getenv("SELLER_ADDRESS")
seller_private_key = os.getenv("SELLER_PRIVATE_KEY")
land_token_id = int(os.getenv("LAND_TOKEN_ID"))  # Assuming the land token ID is an integer
api_url = os.getenv("API_URL")
token_url = os.getenv("TOKEN_URL")
algod_token = os.getenv("ALGOD_TOKEN")
algod_address = os.getenv("ALGOD_ADDRESS")

# Setup Algorand client
algod_client = algod.AlgodClient(algod_token, algod_address)

# Setup logging
logging.basicConfig(level=logging.INFO)

def get_access_token() -> Optional[str]:
    """Get the access token from the authentication API."""
    try:
        data = {"grant_type": "client_credentials"}
        response: Response = requests.post(token_url, data=data)
        response.raise_for_status()  # Raises an error for bad HTTP status codes
        access_token = response.json().get('access_token')
        if access_token:
            logging.info(f"Access Token: {access_token}")
            return access_token
        else:
            logging.error("No access token received.")
    except requests.RequestException as e:
        logging.error(f"Error during API request: {e}")
    return None

def get_user_documents(access_token: str) -> Optional[Dict[str, str]]:
    """Get user documents from the API."""
    try:
        headers = {"Authorization": f"Bearer {access_token}"}
        response: Response = requests.get(api_url, headers=headers)
        response.raise_for_status()  # Raises an error for bad HTTP status codes
        documents = response.json()
        logging.info(f"Documents: {documents}")
        return documents
    except requests.RequestException as e:
        logging.error(f"Error fetching documents: {e}")
    return None

def wait_for_confirmation(txn_id, max_retries=10, delay=2):
    """Wait for transaction confirmation with retries."""
    retries = 0
    while retries < max_retries:
        try:
            confirmed_txn = algod_client.pending_transaction_info(txn_id)
            if 'confirmed-round' in confirmed_txn:
                return confirmed_txn
        except Exception as e:
            logging.error(f"Error while waiting for confirmation: {e}")
        time.sleep(delay)
        retries += 1
    logging.error(f"Transaction {txn_id} not confirmed after {max_retries} retries.")
    return None

def transfer_ownership(seller_private_key: str, seller_address: str, buyer_address: str, land_token_id: int):
    """Transfer ownership of the land token."""
    txn = transaction.AssetTransferTxn(
        sender=seller_address,
        receiver=buyer_address,
        amt=1,  # Number of tokens to transfer
        index=land_token_id,
        fee=1000,  # Set the transaction fee (1000 microAlgos)
        first_valid=algod_client.status().get('last-round'),
        last_valid=algod_client.status().get('last-round') + 1000  # Valid for 1000 rounds
    )
    
    # Sign the transaction
    signed_txn = txn.sign(seller_private_key)
    
    # Send the transaction to the network
    txn_id = algod_client.send_transaction(signed_txn)
    
    # Wait for confirmation
    confirmed_txn = wait_for_confirmation(txn_id)
    if confirmed_txn:
        logging.info(f"Transaction confirmed in round {confirmed_txn['confirmed-round']}")
    return confirmed_txn

def create_land_verification_asset(document_hash: str, buyer_address: str, buyer_private_key: str):
    """Create a land verification asset."""
    asset_url = f"https://your.document.storage/{document_hash}"  # Assuming document_hash is the URL

    txn = transaction.AssetConfigTxn(
        sender=buyer_address,
        asset_name="Land Verification",
        total=1,
        unit_name="LAND",
        fee=1000,  # Set the transaction fee (1000 microAlgos)
        first_valid=algod_client.status().get('last-round'),
        last_valid=algod_client.status().get('last-round') + 1000,
        asset_url=asset_url
    )
    
    signed_txn = txn.sign(buyer_private_key)
    
    # Send the transaction to the network
    txn_id = algod_client.send_transaction(signed_txn)
    
    # Confirm the transaction
    confirmed_txn = wait_for_confirmation(txn_id)
    if confirmed_txn:
        logging.info(f"Transaction confirmed in round {confirmed_txn['confirmed-round']}")
    return confirmed_txn

def main():
    """Main function to orchestrate the contract process."""
    # Step 1: Get access token for the document API
    access_token = get_access_token()
    
    if access_token:
        # Step 2: Fetch the documents from the API
        documents = get_user_documents(access_token)
        if documents:
            for document in documents:
                document_hash = document.get("hash")
                if document_hash:
                    # Step 3: Create the land verification asset on Algorand
                    logging.info(f"Creating land verification asset for document hash: {document_hash}")
                    confirmed_txn = create_land_verification_asset(document_hash, buyer_address, buyer_private_key)
                    
                    if confirmed_txn:
                        logging.info(f"Land verification asset created successfully: {confirmed_txn}")
                        
                        # Step 4: Transfer land ownership after verification
                        logging.info(f"Transferring ownership of land token {land_token_id} from {seller_address} to {buyer_address}")
                        confirmed_txn = transfer_ownership(seller_private_key, seller_address, buyer_address, land_token_id)
                        
                        if confirmed_txn:
                            logging.info(f"Ownership transfer complete: {confirmed_txn}")
                        else:
                            logging.error(f"Failed to transfer ownership for land token {land_token_id}")
                    else:
                        logging.error(f"Failed to create land verification asset for {document_hash}")
                else:
                    logging.error("Document hash not found.")
        else:
            logging.error("No documents found.")
    else:
        logging.error("Failed to get access token.")

if __name__ == "__main__":
    main()
