import logging
import algokit_utils
from algorand import AlgorandClient
from algokit_utils import PaymentParams, AlgoAmount, OperationPerformed, OnUpdate, OnSchemaBreak

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define deployment behavior based on supplied app spec
def deploy() -> None:
    try:
        from ..artifacts.land_verification.land_verification_client import (
            LandVerificationArgs,
            LandVerificationContract
        )

        # Initialize the Algorand client from environment variables
        algorand = algokit_utils.AlgorandClient.from_environment()

        # Deployer's account, will be used to deploy the contract and fund transactions
        deployer_ = algorand.account.from_environment("DEPLOYER")

        # Check if deployer account is valid
        if not deployer_:
            logger.error("Deployer account not found in environment variables.")
            return

        # Get the application factory for your contract
        factory = algorand.client.get_typed_app_factory(
            LandVerificationContract, default_sender=deployer_.address
        )

        # Deploy the app (contract) and get the app client and result
        app_client, result = factory.deploy(
            on_update=OnUpdate.AppendApp,
            on_schema_break=OnSchemaBreak.AppendApp,
        )

        # If the app is created or replaced, send 1 Algo to the app (for initialization or funding)
        if result.operation_performed in [OperationPerformed.Create, OperationPerformed.Replace]:
            logger.info(f"Deploying contract. Sending 1 Algo to {app_client.app_address} for initialization.")
            payment_response = send_initial_payment(algorand, deployer_, app_client)
            if payment_response:
                logger.info(f"Payment of 1 Algo sent successfully to {app_client.app_address}.")

        # Now, let's interact with the deployed LandVerificationContract app:
        document_hash = "dummy_document_hash_example"
        buyer_address = "buyer_address_here"
        seller_address = "seller_address_here"
        
        # Sample contract interaction: Submit document hash for verification
        submit_verification(app_client, document_hash)
        
        # Example: Call the `get_verified_hash` method of your contract to retrieve the verified document hash
        get_verified_hash(app_client)
        
        # Example: Transfer land ownership from the seller to the buyer if document is verified
        land_token_id = 123456  # Replace with actual asset ID
        transfer_land_token(app_client, land_token_id, seller_address, buyer_address)

    except Exception as e:
        logger.error(f"Error during contract deployment or interaction: {e}")

def send_initial_payment(algorand, deployer_, app_client):
    """Send 1 Algo to the deployed contract for initialization or funding."""
    try:
        payment_response = algorand.send.payment(
            PaymentParams(
                amount=AlgoAmount(algo=1),
                sender=deployer_.address,
                receiver=app_client.app_address,
            )
        )
        return payment_response
    except Exception as e:
        logger.error(f"Failed to send payment to contract: {e}")
        return None

def submit_verification(app_client, document_hash: str):
    """Submit document hash for verification via the contract."""
    try:
        response = app_client.send.submit_verification(args=LandVerificationArgs(document_hash=document_hash))
        logger.info(
            f"Called submit_verification on {app_client.app_name} ({app_client.app_id}) "
            f"with document_hash={document_hash}, received: {response.abi_return}"
        )
    except Exception as e:
        logger.error(f"Failed to submit verification: {e}")

def get_verified_hash(app_client):
    """Get the verified document hash from the contract."""
    try:
        response = app_client.send.get_verified_hash()
        logger.info(
            f"Called get_verified_hash on {app_client.app_name} ({app_client.app_id}), received: {response.abi_return}"
        )
    except Exception as e:
        logger.error(f"Failed to get verified hash: {e}")

def transfer_land_token(app_client, land_token_id: int, seller_address: str, buyer_address: str):
    """Transfer land ownership from the seller to the buyer if the document is verified."""
    try:
        response = app_client.send.transfer_land_token(
            args=LandVerificationArgs(land_token_id=land_token_id, seller=seller_address, buyer=buyer_address)
        )
        logger.info(
            f"Called transfer_land_token on {app_client.app_name} ({app_client.app_id}) "
            f"with land_token_id={land_token_id}, seller={seller_address}, buyer={buyer_address}, "
            f"received: {response.abi_return}"
        )
    except Exception as e:
        logger.error(f"Failed to transfer land token: {e}")

if __name__ == "__main__":
    deploy()
