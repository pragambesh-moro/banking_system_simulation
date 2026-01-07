import { formatCurrency, formatAccountNumber } from '../../utils/formatters';
import Button from '../ui/Button';

const BalanceCard = ({ account, onDeposit, onWithdraw, onTransfer }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
      {/* Account Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-blue-400">💳</span>
          <h2 className="text-gray-200 font-medium">My Account</h2>
        </div>
        <span className="text-gray-400 text-sm">
          {account?.account_number || 'N/A'}
        </span>
      </div>

      {/* Balance */}
      <div className="mb-6">
        <p className="text-gray-400 text-sm mb-1">Available Balance</p>
        <p className="text-3xl font-bold text-white">
          {formatCurrency(account?.balance || 0)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="success"
          onClick={onDeposit}
          className="flex items-center gap-2"
        >
          <span>💰</span>
          Deposit
        </Button>
        <Button
          variant="danger"
          onClick={onWithdraw}
          className="flex items-center gap-2"
        >
          <span>📤</span>
          Withdraw
        </Button>
        <Button
          variant="primary"
          onClick={onTransfer}
          className="flex items-center gap-2"
        >
          <span>💸</span>
          Transfer
        </Button>
      </div>
    </div>
  );
};

export default BalanceCard;
