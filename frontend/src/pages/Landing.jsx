import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Lock, Zap, TrendingUp } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Lock className="w-12 h-12 text-primary" />,
      title: 'Secure Banking',
      description: 'Bank-grade encryption and security protocols protect your money'
    },
    {
      icon: <Zap className="w-12 h-12 text-primary" />,
      title: 'Fast Transfers',
      description: 'Instant transfers between accounts with zero fees'
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-primary" />,
      title: 'Track Spending',
      description: 'Real-time transaction history and balance updates'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">🏦 SecureBank</span>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-primary font-medium"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Banking Made Simple & Secure
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Manage your finances with confidence. Fast transfers, real-time updates, and bank-grade security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/login')}
              className="text-lg px-8 py-4"
            >
              Sign In
            </Button>
            <Button 
              variant="secondary"
              onClick={() => navigate('/signup')}
              className="text-lg px-8 py-4"
            >
              Create Account
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-500">
            © 2026 Pragambesh Moro. Built with FastAPI & React
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;