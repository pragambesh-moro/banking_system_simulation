import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, account, isAuthenticated, signOut } = useAuthStore();

  const logout = () => {
    signOut();
    navigate('/login');
  };

  return {
    user,
    account,
    isAuthenticated,
    logout
  };
};
