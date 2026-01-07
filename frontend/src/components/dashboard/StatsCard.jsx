import { formatCurrency } from '../../utils/formatters';

const StatsCard = ({ stats }) => {
  const income = stats?.total_income || 0;
  const expenses = stats?.total_expenses || 0;
  const transactionCount = stats?.total_transactions || 0;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mt-6">
      <h3 className="text-gray-400 text-sm mb-4">Quick Stats</h3>
      
      <div className="grid grid-cols-3 gap-4">
        {/* Income */}
        <div className="border border-gray-700 rounded p-4">
          <p className="text-gray-400 text-sm mb-1">Income (30d)</p>
          <p className="text-green-400 font-bold text-lg">
            +{formatCurrency(income)}
          </p>
        </div>

        {/* Expenses */}
        <div className="border border-gray-700 rounded p-4">
          <p className="text-gray-400 text-sm mb-1">Expenses (30d)</p>
          <p className="text-red-400 font-bold text-lg">
            -{formatCurrency(expenses)}
          </p>
        </div>

        {/* Transactions */}
        <div className="border border-gray-700 rounded p-4">
          <p className="text-gray-400 text-sm mb-1">Transactions</p>
          <p className="text-gray-200 font-bold text-lg">{transactionCount}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
