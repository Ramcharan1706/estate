import React, { useState } from 'react';

// Extend the Window interface to include AlgoSigner
declare global {
    interface Window {
        AlgoSigner?: {
            connect: () => Promise<string[]>;
        };
    }
}

interface WalletConnectProps {
    onConnect: (address: string) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
    const [address, setAddress] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleConnect = async () => {
        if (window.AlgoSigner) {
            setLoading(true);
            setError(null); // Reset previous errors

            try {
                const accounts: string[] = await window.AlgoSigner.connect();
                const userAddress = accounts[0];
                setAddress(userAddress);
                onConnect(userAddress);
            } catch (err: any) {
                console.error("AlgoSigner connection error:", err);
                setError("Failed to connect. Please try again.");
            } finally {
                setLoading(false);
            }
        } else {
            alert("Please install AlgoSigner.");
        }
    };

    const handleDisconnect = () => {
        setAddress('');
        onConnect(''); // You can customize this to reset the parent state
    };

    return (
        <div>
            {/* Button for connecting */}
            {!address ? (
                <button onClick={handleConnect} disabled={loading}>
                    {loading ? 'Connecting...' : 'Connect Wallet (AlgoSigner)'}
                </button>
            ) : (
                <div>
                    <p>Connected Address: {address}</p>
                    <button onClick={handleDisconnect}>Disconnect</button>
                </div>
            )}

            {/* Show error message if connection fails */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default WalletConnect;
