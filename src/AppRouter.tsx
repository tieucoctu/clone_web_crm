import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import { DASH_BOARD } from './configs/path';
import PublicLayout from './layout/PublicLayout';
import PrivateLayout from './layout/PrivateLayout';
import AuthPage from './pages/auth';
import PersonalCustomer from './components/customer/PersonalCustomer/PersonalCustomer';
import BusinessCustomer from './components/customer/BusinessCustomer/BusinessCustomer';
import Cookies from 'js-cookie';

const AppRouter: React.FC = () => {
  const token = Cookies.get('access_token');

  return (
    <Routes>
      <Route
        path="/"
        element={
          !token ? (
            <PublicLayout>
              <AuthPage />
            </PublicLayout>
          ) : (
            <Navigate to={DASH_BOARD} replace />
          )
        }
      />

      <Route
        path={DASH_BOARD}
        element={
          token ? (
            <PrivateLayout>
              <Dashboard />
            </PrivateLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/personal"
        element={
          token ? (
            <PrivateLayout>
              <PersonalCustomer />
            </PrivateLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/business"
        element={
          token ? (
            <PrivateLayout>
              <BusinessCustomer />
            </PrivateLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
