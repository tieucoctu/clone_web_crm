import React from 'react';
import { Menu, Button } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Sidebar.scss';

interface Props {
  searchText?: string;
}

const Sidebar: React.FC<Props> = ({ searchText = '' }) => {
  const navigate = useNavigate();

  const menuItems = [
    { key: 'personal', icon: <UserOutlined />, label: 'KH Cá nhân', path: '/personal' },
    { key: 'business', icon: <TeamOutlined />, label: 'KH Doanh nghiệp', path: '/business' },
  ];

  const filteredItems = menuItems.filter(item => item.label.toLowerCase().includes(searchText.toLowerCase()));

  const handleClick = (e: any) => {
    const clickedItem = menuItems.find(item => item.key === e.key);
    if (clickedItem) navigate(clickedItem.path);
  };

  return (
    <div className="sidebarWrapper">
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={['business']}
        items={filteredItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
        }))}
        onClick={handleClick}
        className="sidebarMenu"
      />

      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <Button type="link" onClick={() => navigate('/dashboard')} className="backHomeBtn">
          ← Quay lại trang chủ
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
