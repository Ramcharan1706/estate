import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';
import algosdk, { Algodv2 } from 'algosdk';
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs';

// Define the context type
interface AlgodClientContextType {
  algodClient: Algodv2 | null;
  loading: boolean;
  error: string | null;
}

// Create the context
const AlgodClientContext = createContext<AlgodClientContextType | undefined>(undefined);

// Define provider props
interface AlgodClientProviderProps {
  children: ReactNode;
}

export const AlgodClientProvider: React.FC<AlgodClientProviderProps> = ({ children }) => {
  const [algodClient, setAlgodClient] = useState<Algodv2 | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeClient = () => {
      try {
        const config = getAlgodConfigFromViteEnvironment();

        if (!config.server || config.token === undefined || config.port === undefined) {
          throw new Error('Missing Algod configuration. Please check your .env file.');
        }

        const client = new Algodv2(config.token, config.server, config.port);
        setAlgodClient(client);
      } catch (err: any) {
        console.error('Failed to initialize Algod client:', err);
        setError(err?.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    initializeClient();
  }, []);

  return (
    <AlgodClientContext.Provider value={{ algodClient, loading, error }}>
      {children}
    </AlgodClientContext.Provider>
  );
};

// Custom hook to access Algod client context
export const useAlgodClient = (): AlgodClientContextType => {
  const context = useContext(AlgodClientContext);
  if (!context) {
    throw new Error('useAlgodClient must be used within an AlgodClientProvider');
  }
  return context;
};
