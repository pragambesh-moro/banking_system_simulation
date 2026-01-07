import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import BalanceCard from '../components/dashboard/BalanceCard';
import TransactionList from '../components/dashboard/TransactionList';
import StatsCard from '../components/dashboard/StatsCard';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { getAccount, getTransactionHistory, deposit, withdraw, getDashboardStats } from '../services/account.service';
import { formatCurrency, formatAccountNumber } from '../utils/formatters';

const Dashboard = () => {
  const navigate = useNavigate();
  const account = useAuthStore(state => state.account);
  const updateAccount = useAuthStore(state => state.updateAccount);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Form states
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDescription, setDepositDescription] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDescription, setWithdrawDescription] = useState('');
  const [processingTransaction, setProcessingTransaction] = useState(false);

  const accountId = account?.id;

  useEffect(() => {
    if (accountId) {
      loadDashboardData();
    } else {
      setLoading(false);
      setError('No account found. Please log in again.');
    }
  }, [accountId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [accountData, transactionData, statsData] = await Promise.all([
        getAccount(accountId),
        getTransactionHistory(accountId, 10, 0),
        getDashboardStats(accountId, 30)
      ]);

      updateAccount(accountData); // Update store with fresh data
      setTransactions(transactionData.transactions || []);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.response?.data?.detail || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setProcessingTransaction(true);
      await deposit(accountId, depositAmount, depositDescription);
      
      // Reload data
      await loadDashboardData();
      
      // Reset form and close modal
      setDepositAmount('');
      setDepositDescription('');
      setShowDepositModal(false);
      
      alert('Deposit successful!');
    } catch (err) {
      console.error('Deposit error:', err);
      alert(err.response?.data?.detail || 'Deposit failed');
    } finally {
      setProcessingTransaction(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setProcessingTransaction(true);
      await withdraw(accountId, withdrawAmount, withdrawDescription);
      
      // Reload data
      await loadDashboardData();
      
      // Reset form and close modal
      setWithdrawAmount('');
      setWithdrawDescription('');
      setShowWithdrawModal(false);
      
      alert('Withdrawal successful!');
    } catch (err) {
      console.error('Withdrawal error:', err);
      alert(err.response?.data?.detail || 'Withdrawal failed');
    } finally {
      setProcessingTransaction(false);
    }
  };

  const handleTransfer = () => {
    navigate('/transfer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-300 text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Balance Card */}
        <BalanceCard
          account={account}
          onDeposit={() => setShowDepositModal(true)}
          onWithdraw={() => setShowWithdrawModal(true)}
          onTransfer={handleTransfer}
        />

        {/* Transaction List */}
        <TransactionList
          transactions={transactions}
          onViewAll={() => navigate('/transactions')}
        />

        {/* Stats Card */}
        <StatsCard stats={stats} />

        {/* Deposit Modal */}
        <Modal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          title="Deposit Funds"
        >
          <form onSubmit={handleDeposit}>
            <div className="mb-4">
              <p className="text-gray-400 text-sm">
                Account: {account?.account_number || 'N/A'}
              </p>
              <p className="text-gray-400 text-sm">
                Current Balance: {formatCurrency(account?.balance || 0)}
              </p>
            </div>

            <Input
              label="Amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              required
            />

            <Input
              label="Description (Optional)"
              type="text"
              placeholder="e.g., Salary, Gift"
              value={depositDescription}
              onChange={(e) => setDepositDescription(e.target.value)}
            />

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowDepositModal(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="success"
                disabled={processingTransaction}
                fullWidth
              >
                {processingTransaction ? 'Processing...' : 'Deposit'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Withdraw Modal */}
        <Modal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          title="Withdraw Funds"
        >
          <form onSubmit={handleWithdraw}>
            <div className="mb-4">
              <p className="text-gray-400 text-sm">
                Account: {account?.account_number || 'N/A'}
              </p>
              <p className="text-gray-400 text-sm">
                Current Balance: {formatCurrency(account?.balance || 0)}
              </p>
            </div>

            <Input
              label="Amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              required
            />

            <Input
              label="Description (Optional)"
              type="text"
              placeholder="e.g., ATM Withdrawal, Payment"
              value={withdrawDescription}
              onChange={(e) => setWithdrawDescription(e.target.value)}
            />

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowWithdrawModal(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                disabled={processingTransaction}
                fullWidth
              >
                {processingTransaction ? 'Processing...' : 'Withdraw'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
