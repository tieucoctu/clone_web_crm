import { Layout } from 'antd';
import AppHeader from '../../components/Header/Header';
import BusinessLeads from '../BusinessLeads/BusinessLeads';
import { Content } from 'antd/es/layout/layout';

const Dashboard: React.FC = () => {
  return (
    <div>
      {' '}
      <Layout style={{ minHeight: '100vh' }}>
        <AppHeader />
        <Layout>
          <Layout style={{ padding: '0 24px' }}>
            <Content>
              <BusinessLeads />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};

export default Dashboard;
