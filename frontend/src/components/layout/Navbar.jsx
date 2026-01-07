import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import { APP_NAME } from '../../config/constants';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const signOut = useAuthStore(state => state.signOut);

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/transfer') return 'Transfer Funds';
    if (path === '/transactions') return 'Transactions';
    return '';
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo and Page Title */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🏦</span>
              <span className="text-xl font-bold text-gray-100">{APP_NAME}</span>
            </Link>
            
            {isAuthenticated && getPageTitle() && (
              <>
                <div className="h-6 w-px bg-gray-600"></div>
                <h1 className="text-lg text-gray-300">{getPageTitle()}</h1>
              </>
            )}
          </div>

          {/* Right: User Menu or Auth Links */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <span className="text-gray-300">
                    {user.name || user.email || 'John Doe'}
                  </span>
                  <span className="text-gray-400">▼</span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    {/* Backdrop to close menu */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    
                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
                      <div className="py-2">
                        <button
                          onClick={() => {
                            navigate('/dashboard');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={() => {
                            navigate('/transfer');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                          Transfer
                        </button>
                        <div className="border-t border-gray-700 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
