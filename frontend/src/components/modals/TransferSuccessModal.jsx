import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';

const TransferSuccessModal = ({ isOpen, onClose, onViewTransaction, transferResult }) => {
  if (!transferResult) return null;

  const { to_account, from_account, transaction_id } = transferResult;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
          <span className="text-4xl">✓</span>
        </div>

        <h3 className="text-xl font-semibold text-white">Transfer Successful</h3>

        <div className="bg-gray-700 rounded-lg p-4 text-left space-y-2">
          <p className="text-white text-lg font-semibold">
            {formatCurrency(from_account?.transaction?.amount)} transferred successfully!
          </p>
          {to_account && (
            <p className="text-gray-300 text-sm">
              To: {to_account.transaction?.description || 'Unknown recipient'}
            </p>
          )}
          {transaction_id && (
            <p className="text-gray-400 text-xs">Transaction ID: {transaction_id}</p>
          )}
          <div className="pt-2 border-t border-gray-600 mt-3">
            <p className="text-sm text-gray-400">Your new balance:</p>
            <p className="text-lg font-semibold text-white">
              {formatCurrency(from_account?.new_balance)}
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          {onViewTransaction && (
            <Button
              onClick={onViewTransaction}
              variant="secondary"
              className="flex-1"
            >
              View Transaction
            </Button>
          )}
          <Button
            onClick={onClose}
            variant="primary"
            className="flex-1"
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TransferSuccessModal;
