import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { transferByAccountNumber, getAccount } from '../services/account.service';
import TransferConfirmModal from '../components/modals/TransferConfirmModal';
import TransferSuccessModal from '../components/modals/TransferSuccessModal';
import { formatCurrency, formatAccountNumber } from '../utils/formatters';

const Transfer = () => {
  const navigate = useNavigate();
  const account = useAuthStore(state => state.account);
  const updateAccount = useAuthStore(state => state.updateAccount);
  const [localAccount, setLocalAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transferResult, setTransferResult] = useState(null);
  const [transferData, setTransferData] = useState(null);
  const [processingTransfer, setProcessingTransfer] = useState(false);

  const accountId = account?.id;

  // Sync local account with store account and fetch fresh data on accountId change
  useEffect(() => {
    const fetchFreshAccount = async () => {
      if (!accountId) {
        setLocalAccount(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const freshAccount = await getAccount(accountId);
        setLocalAccount(freshAccount);
        updateAccount(freshAccount);
      } catch (err) {
        console.error('Error fetching account:', err);
        setLocalAccount(account); // Fallback to store account
      } finally {
        setLoading(false);
      }
    };

    fetchFreshAccount();
  }, [accountId]); // Re-fetch when accountId changes (login/logout)

  const displayAccount = localAccount || account;

  const validateForm = () => {
    const newErrors = {};

    if (!toAccountNumber) {
      newErrors.toAccountNumber = 'Account number is required';
    } else if (toAccountNumber === displayAccount?.account_number) {
      newErrors.toAccountNumber = 'Cannot transfer to your own account';
    }

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (parseFloat(amount) > displayAccount?.balance) {
      newErrors.amount = 'Insufficient balance';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTransferClick = (e) => {
    e.preventDefault();
    
    if (!accountId || !displayAccount) {
      alert('Account not loaded. Please refresh the page.');
      return;
    }
    
    if (validateForm()) {
      const numAmount = parseFloat(amount);
      const newBalance = displayAccount.balance - numAmount;
      
      setTransferData({
        fromAccount: displayAccount.account_number,
        toAccountNumber,
        amount: numAmount,
        description,
        newBalance
      });
      setShowConfirmModal(true);
    }
  };

  const handleConfirmTransfer = async () => {
    try {
      setProcessingTransfer(true);
      
      const result = await transferByAccountNumber(
        accountId,
        toAccountNumber,
        parseFloat(amount),
        description
      );
      
      setTransferResult(result);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      
      // Refresh account data
      const updatedAccount = await getAccount(accountId);
      setLocalAccount(updatedAccount);
      updateAccount(updatedAccount);
      
      // Reset form
      setToAccountNumber('');
      setAmount('');
      setDescription('');
      setErrors({});
    } catch (err) {
      console.error('Transfer error:', err);
      const errorMsg = err.response?.data?.detail || err.message || 'Transfer failed';
      alert(errorMsg);
      setShowConfirmModal(false);
    } finally {
      setProcessingTransfer(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Reset form
    setToAccountNumber('');
    setAmount('');
    setDescription('');
    setTransferResult(null);
  };

  const handleViewTransaction = () => {
    navigate('/dashboard');
  };

  const calculateNewBalance = () => {
    return displayAccount?.balance - parseFloat(amount || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-300 text-xl">Loading...</div>
      </div>
    );
  }

  if (!displayAccount) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-300 text-xl">Please log in to continue</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              [← Dashboard]
            </button>
            <h1 className="text-2xl font-bold text-gray-200">Transfer Funds</h1>
          </div>
        </div>

        {/* Transfer Form */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-6">Transfer Money</h2>

          <form onSubmit={handleTransferClick}>
            {/* From Account */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                From
              </label>
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">💳</span>
                  <span className="text-gray-200">
                    My Account ({displayAccount?.account_number || 'N/A'})
                  </span>
                </div>
                <span className="text-gray-300">
                  Balance: {formatCurrency(displayAccount?.balance || 0)}
                </span>
              </div>
            </div>

            {/* To Account */}
            <Input
              label="To Account Number"
              type="text"
              placeholder="ACC-"
              value={toAccountNumber}
              onChange={(e) => {
                setToAccountNumber(e.target.value.toUpperCase());
                if (errors.toAccountNumber) {
                  setErrors({ ...errors, toAccountNumber: null });
                }
              }}
              error={errors.toAccountNumber}
              required
            />
            <p className="text-gray-500 text-sm mt-1 mb-4">
              Enter recipient's account number
            </p>

            {/* Amount */}
            <Input
              label="Amount"
              type="number"
              step="0.01"
              placeholder="$ "
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) {
                  setErrors({ ...errors, amount: null });
                }
              }}
              error={errors.amount}
              required
            />

            {/* Description */}
            <Input
              label="Description (Optional)"
              type="text"
              placeholder="e.g., Rent payment, Dinner split"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={!amount || parseFloat(amount) <= 0}
              className="mt-6"
            >
              Transfer {amount ? formatCurrency(parseFloat(amount)) : '$0.00'}
            </Button>

            {/* Tip */}
            <div className="mt-4 flex items-start gap-2">
              <span className="text-yellow-500">💡</span>
              <p className="text-gray-400 text-sm">
                Tip: Double-check the account number before transferring
              </p>
            </div>
          </form>
        </div>

        {/* Confirmation Modal */}
        <TransferConfirmModal
          isOpen={showConfirmModal}
          onClose={() => !processingTransfer && setShowConfirmModal(false)}
          onConfirm={handleConfirmTransfer}
          transferData={transferData}
          isLoading={processingTransfer}
        />

        {/* Success Modal */}
        <TransferSuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessClose}
          onViewTransaction={handleViewTransaction}
          transferResult={transferResult}
        />
      </div>
    </div>
  );
};

export default Transfer;
