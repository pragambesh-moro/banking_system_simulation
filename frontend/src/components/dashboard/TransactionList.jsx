import { formatCurrency, formatDate } from '../../utils/formatters';

const TransactionList = ({ transactions = [], onViewAll }) => {
  const getTransactionIcon = (type) => {
    if (type === 'DEPOSIT' || type === 'CREDIT') {
      return '💰';
    } else if (type === 'WITHDRAWAL' || type === 'DEBIT') {
      return '📤';
    } else if (type === 'TRANSFER') {
      return '💸';
    }
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

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-200 font-medium">Recent Transactions</h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            [View All →]
          </button>
        )}
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No transactions yet</p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="border border-gray-700 rounded p-4 hover:border-gray-600 transition-colors"
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
                    {transaction.related_account && (
                      <p className="text-gray-400 text-sm">
                        {transaction.transaction_type === 'CREDIT' ? 'From:' : 'To:'}{' '}
                        {transaction.related_account}
                      </p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      Balance after: {formatCurrency(transaction.balance_after)}
                    </p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p
                    className={`font-bold ${getAmountColor(transaction.transaction_type)}`}
                  >
                    {formatAmount(transaction)}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {formatDate(transaction.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;
