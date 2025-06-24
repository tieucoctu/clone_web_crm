import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import LeadTable from './pages/lead/lead';
import { DASH_BOARD, LEAD_COMMON, LEAD_LIST, TO_DELIVER_LIST } from './configs/path';
import PublicLayout from './layout/PublicLayout';
import PrivateLayout from './layout/PrivateLayout';
import AuthPage from './pages/auth';
import LeadList from './pages/lead/leadlist';
import ToDeliverList from './pages/lead/todeliver';

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
        path={LEAD_COMMON}
        element={
          <PrivateLayout>
            <LeadTable />
          </PrivateLayout>
        }
      />
      <Route
        path={LEAD_LIST}
        element={
          <PrivateLayout>
            <LeadList />
          </PrivateLayout>
        }
      />
      <Route
        path={TO_DELIVER_LIST}
        element={
          <PrivateLayout>
            <ToDeliverList />
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
