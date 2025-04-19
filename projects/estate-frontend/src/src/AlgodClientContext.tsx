// src/AlgodClientContext.tsx
import React, { createContext, ReactNode, useContext } from 'react';
import { Algodv2 } from 'algosdk';

const algodClient = new Algodv2(
  '',
  'https://testnet-api.algonode.cloud',
  ''
);

const AlgodClientContext = createContext<Algodv2 | null>(null);

export const useAlgodClient = () => {
  const context = useContext(AlgodClientContext);
  if (!context) throw new Error('useAlgodClient must be used within AlgodClientProvider');
  return context;
};

export const AlgodClientProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AlgodClientContext.Provider value={algodClient}>
      {children}
    </AlgodClientContext.Provider>
  );
};
