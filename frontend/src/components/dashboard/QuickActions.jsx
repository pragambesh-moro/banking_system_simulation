import Card from '../ui/Card';

const QuickActions = () => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Income (30d)</span>
          <span className="text-green-400 font-semibold">+$12,450</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Expenses (30d)</span>
          <span className="text-red-400 font-semibold">-$3,890</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Transactions</span>
          <span className="text-blue-400 font-semibold">47</span>
        </div>
      </div>
    </Card>
  );
};

export default QuickActions;
