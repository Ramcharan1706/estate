import React, { useEffect, useState } from 'react';
import { useAlgodClient } from './AlgodClientProvider'; // Adjusted path to match the correct location

const YourComponent: React.FC = () => {
  const algodClient = useAlgodClient(); // Get the algodClient from context
  const [accountInfo, setAccountInfo] = useState<any>(null); // State to store account information
  const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching account info
  const [error, setError] = useState<string | null>(null); // State for error messages

  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (!algodClient) {
        setError('Algod client is not available');
        setLoading(false);
        return;
      }

      try {
        // Replace with the actual address you're querying. You can make it dynamic.
        const accountAddress = 'your-account-address-here';

        // Fetch the account information using the algodClient
        const account = await algodClient.accountInformation(accountAddress).do();
        setAccountInfo(account); // Store the account info in state
        setLoading(false); // Set loading to false once the data is fetched
      } catch (err: any) {
        console.error('Error fetching account information:', err);
        setError('Failed to fetch account information');
        setLoading(false); // Set loading to false on error
      }
    };

    fetchAccountInfo(); // Call the function to fetch the account info
  }, [algodClient]); // Run the effect when algodClient changes

  return (
    <div>
      <h1>Account Information</h1>
      {loading ? (
        <p>Loading...</p> // Show loading text while waiting for the account info
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p> // Display error message if fetching fails
      ) : accountInfo ? (
        <pre>{JSON.stringify(accountInfo, null, 2)}</pre> // Display the account info as a formatted JSON
      ) : (
        <p>No account info available.</p> // Display a message if no account info is available
      )}
    </div>
  );
};

export default YourComponent;
