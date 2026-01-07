import { useState, useEffect } from 'react';
import { getAccount } from '../services/account.service';

export const useAccount = (accountId) => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accountId) {
      setLoading(false);
      return;
    }

    const fetchAccount = async () => {
      try {
        setLoading(true);
        const data = await getAccount(accountId);
        setAccount(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch account');
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [accountId]);

  return { account, loading, error, refetch: () => fetchAccount() };
};
