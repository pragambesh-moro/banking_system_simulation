import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { formatCurrency, formatAccountNumber } from '../../utils/formatters';

const TransferConfirmModal = ({ isOpen, onClose, onConfirm, transferData, isLoading }) => {
  if (!transferData) return null;

  const { fromAccount, toAccountNumber, amount, description, newBalance } = transferData;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Transfer">
      <div className="space-y-4">
        <p className="text-gray-300">Review your transfer details:</p>

        <div className="bg-gray-700 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">From:</span>
            <span className="text-white font-medium">
              {formatAccountNumber(fromAccount)} (My Account)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">To:</span>
            <span className="text-white font-medium">{toAccountNumber}</span>
          </div>
          <div className="h-px bg-gray-600"></div>
          <div className="flex justify-between">
            <span className="text-gray-400">Amount:</span>
            <span className="text-white font-bold text-lg">{formatCurrency(amount)}</span>
          </div>
          {description && (
            <div className="flex justify-between">
              <span className="text-gray-400">Description:</span>
              <span className="text-white">{description}</span>
            </div>
          )}
          <div className="h-px bg-gray-600"></div>
          <div className="flex justify-between">
            <span className="text-gray-400">New Balance:</span>
            <span className="text-white font-medium">{formatCurrency(newBalance)}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={onClose}
            variant="secondary"
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="primary"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Processing...' : 'Confirm Transfer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TransferConfirmModal;
