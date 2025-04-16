// src/components/DigiLockerAuth.tsx
import React from 'react';

interface DigiLockerAuthProps {
  // Optional: Define callback for successful login or other events
  onAuthSuccess?: (hash: string) => void;
}

const DigiLockerAuth: React.FC<DigiLockerAuthProps> = ({ onAuthSuccess }) => {
  const handleLogin = () => {
    // Send user to DigiLocker login page
    window.location.href = "http://localhost:5000/digilocker/login";

    // Optional: Trigger the success callback with a mock hash if needed.
    // For demonstration purposes, let's assume this is a hash returned after login.
    const mockHash = "some-verification-hash";  // This would come from the backend in real use case.

    if (onAuthSuccess) {
      onAuthSuccess(mockHash); // Trigger callback with mock hash
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with DigiLocker</button>
    </div>
  );
};

export default DigiLockerAuth;
