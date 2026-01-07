import { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';

const WithdrawModal = ({ isOpen, onClose, onSubmit, balance, isLoading }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const numAmount = parseFloat(amount);
    if (!amount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (numAmount > balance) {
      setError('Insufficient funds');
      return;
    }

    onSubmit(numAmount, description);
  };

  const handleClose = () => {
    setAmount('');
    setDescription('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Withdraw Funds">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gray-700 px-4 py-3 rounded">
          <p className="text-sm text-gray-400">Available Balance</p>
          <p className="text-lg font-semibold text-white">{formatCurrency(balance)}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount
          </label>
          <Input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description (Optional)
          </label>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., ATM withdrawal"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Processing...' : 'Withdraw'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default WithdrawModal;
