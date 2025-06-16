import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import { DASH_BOARD } from './configs/path';
import PublicLayout from './layout/PublicLayout';
import PrivateLayout from './layout/PrivateLayout';
import AuthPage from './pages/auth';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route
        path={DASH_BOARD}
        element={
          <PrivateLayout>
            <Dashboard />
          </PrivateLayout>
        }
      />
      <Route
        path="/"
        element={
          <PublicLayout>
            <AuthPage />
          </PublicLayout>
        }
      />

      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
};

export default AppRouter;
