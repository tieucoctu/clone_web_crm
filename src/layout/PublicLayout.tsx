import { Layout } from 'antd';
import React from 'react';
interface Props {
  children: React.JSX.Element | React.JSX.Element[];
}
const PublicLayout: React.FC<Props> = ({ children }) => {
  return <Layout style={{ minHeight: '100vh' }}>{children}</Layout>;
};

export default PublicLayout;
