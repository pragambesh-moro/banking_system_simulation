import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { getTransactionHistory, getAccount } from '../services/account.service';
import { formatCurrency, formatDate } from '../utils/formatters';

const Transactions = () => {
  const navigate = useNavigate();
  const account = useAuthStore(state => state.account);
  const updateAccount = useAuthStore(state => state.updateAccount);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  const accountId = account?.id;

  // Fetch fresh account data and transactions when accountId changes
  useEffect(() => {
    if (accountId) {
      loadTransactions(true);
      refreshAccount();
    }
  }, [accountId]);

  const refreshAccount = async () => {
    try {
      const freshAccount = await getAccount(accountId);
      updateAccount(freshAccount);
    } catch (err) {
      console.error('Error refreshing account:', err);
    }
  };

  const loadTransactions = async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      const currentPage = reset ? 0 : page;
      const offset = currentPage * limit;

      const data = await getTransactionHistory(accountId, limit, offset);
      
      if (reset) {
        setTransactions(data.transactions || []);
        setPage(0);
      } else {
        setTransactions(prev => [...prev, ...(data.transactions || [])]);
      }
      
      setHasMore((data.transactions || []).length === limit);
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError(err.response?.data?.detail || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadTransactions(false);
  };

  const getTransactionIcon = (type) => {
    if (type === 'DEPOSIT' || type === 'CREDIT') return '💰';
    if (type === 'WITHDRAWAL' || type === 'DEBIT') return '📤';
    if (type === 'TRANSFER') return '💸';
    return '💳';
  };

  const getAmountColor = (type) => {
    return type === 'CREDIT' ? 'text-green-400' : 'text-red-400';
  };

  const formatAmount = (transaction) => {
    const amount = parseFloat(transaction.amount);
    const formatted = formatCurrency(amount);
    return transaction.transaction_type === 'CREDIT' ? `+${formatted}` : `-${formatted}`;
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-300 text-xl">Please log in to continue</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              [← Dashboard]
            </button>
            <h1 className="text-3xl font-bold text-gray-200">Transaction History</h1>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Account Number</p>
              <p className="text-gray-200 font-medium">{account?.account_number}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-1">Current Balance</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(account?.balance || 0)}</p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {/* Transactions List */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-6">All Transactions</h2>

          {loading && transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400">Loading transactions...</div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">No transactions yet</p>
              <p className="text-gray-600 text-sm mt-2">Your transaction history will appear here</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl">
                          {getTransactionIcon(transaction.transaction_type)}
                        </span>
                        <div className="flex-1">
                          <p className="text-gray-200 font-medium">
                            {transaction.description || transaction.transaction_type}
                          </p>
                          {/* Show counterparty info for transfers */}
                          {transaction.counterparty_name && (
                            <p className="text-gray-400 text-sm">
                              {transaction.transaction_type === 'CREDIT' ? 'From:' : 'To:'}{' '}
                              <span className="text-blue-400">{transaction.counterparty_name}</span>
                              {' '}({transaction.counterparty_account})
                            </p>
                          )}
                          {/* Show type for non-transfers */}
                          {!transaction.counterparty_name && transaction.description && (
                            <p className="text-gray-400 text-sm">
                              {transaction.transaction_type === 'CREDIT' ? 'Deposit' : 'Withdrawal'}
                            </p>
                          )}
                          <p className="text-gray-500 text-sm mt-1">
                            Balance after: {formatCurrency(transaction.balance_after)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className={`font-bold text-lg ${getAmountColor(transaction.transaction_type)}`}>
                          {formatAmount(transaction)}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          {formatDate(transaction.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="mt-6 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
