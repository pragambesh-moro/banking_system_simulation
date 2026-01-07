import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-700">404</h1>
        <h2 className="text-3xl font-semibold text-gray-200 mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/')} variant="primary">
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
