import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import { DASH_BOARD, URL_USER_ROLE, URL_LEAD_COMMON } from './configs/path';
import PublicLayout from './layout/PublicLayout';
import PrivateLayout from './layout/PrivateLayout';
import AuthPage from './pages/auth';
import { lazy } from 'react';
import LeadCommon from './pages/LeadCommon/listOfLead';
import ListOfRoleManagement from './pages/rolesManagement/listOfRoleManagement';

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
        path={URL_USER_ROLE}
        element={
          <PrivateLayout>
            <ListOfRoleManagement />
          </PrivateLayout>
        }
      />
      <Route
        path={URL_LEAD_COMMON}
        element={
          <PrivateLayout>
            <LeadCommon />
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
