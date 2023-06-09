
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { ReactElement, ReactNode } from 'react';

interface PublicRouteProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
}

const PublicRoute = ({ component: Component, path, exact }: PublicRouteProps): ReactElement => {
  const { user } = useAuthContext();

  if (user) {
    return <Navigate to="/login" />;
  }

  return <Component />;
};

export default PublicRoute;

