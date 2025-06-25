import React from 'react';
import { Layout, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import './layoutWrapper.scss';

const { Header: AntHeader } = Layout;

interface Props {
  onToggleSidebar: () => void;
}

const LayoutWrapper: React.FC<Props> = ({ onToggleSidebar }) => {
  return (
    <AntHeader className="header">
      <Button type="text" icon={<MenuOutlined className="menuButton" />} onClick={onToggleSidebar} />
      <div className="title">Quản lý quan hệ khách hàng</div>
    </AntHeader>
  );
};

export default LayoutWrapper;
