import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, DollarSign } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import useAuthStore from '../stores/authStore';

const SignUp = () => {
  const navigate = useNavigate();
  const signUp = useAuthStore(state => state.signUp);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    initialDeposit: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (formData.password.length > 72) {
      newErrors.password = 'Password must be less than 72 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.initialDeposit) {
      newErrors.initialDeposit = 'Initial deposit is required';
    } else if (parseFloat(formData.initialDeposit) < 0) {
      newErrors.initialDeposit = 'Amount must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        initial_deposit: parseFloat(formData.initialDeposit),
      });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">🏦 SecureBank</span>
            </Link>
            <div className="flex space-x-4">
              <span className="text-gray-400">Already have an account?</span>
              <Link 
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Sign Up Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 p-4 rounded-full">
                <UserPlus className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Create Account
            </h1>
            <p className="text-gray-400">
              Join SecureBank and start managing your finances
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
            <form onSubmit={handleSubmit}>
              {errors.general && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
                  <p className="text-sm text-red-400">{errors.general}</p>
                </div>
              )}

              <Input
                label="Full Name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                disabled={isLoading}
              />

              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                disabled={isLoading}
              />

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                disabled={isLoading}
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
                disabled={isLoading}
              />

              <Input
                label="Initial Deposit"
                type="number"
                name="initialDeposit"
                placeholder="100.00"
                value={formData.initialDeposit}
                onChange={handleChange}
                error={errors.initialDeposit}
                required
                disabled={isLoading}
                step="0.01"
                min="0"
              />

              <Button
                type="submit"
                fullWidth
                disabled={isLoading}
                className="mt-6"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary-dark font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <DollarSign className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Start with Any Amount
                </p>
                <p className="text-sm text-gray-600">
                  Your initial deposit will be credited to your new account immediately
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-500">
            © 2026 Pragambesh Moro. Built with FastAPI & React
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SignUp;
