import { Avatar, Dropdown, Menu } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './loginOut.scss';
import Cookies from 'js-cookie';

const LoginOut: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    navigate('/login');
  };

  const menuItems = (
    <Menu className="dropdown-menu-wrapper">
      <Menu.Item key="1">ABC12222</Menu.Item>
      <div className="dropdown-menu-wrapper-id">
        <Menu.Item key="2">quản trị crm</Menu.Item>
        <Menu.Item key="3">14500035 - Nhân viên Kinh doanh_1450</Menu.Item>
      </div>
      <Menu.Divider />
      <Menu.Item key="4">Tài khoản</Menu.Item>
      <Menu.Item key="5" onClick={handleLogout}>
        <div className="login-out">Đăng xuất</div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menuItems} trigger={['click']} placement="bottomRight">
      <Avatar shape="square" className="avatar" style={{ cursor: 'pointer' }}>
        A
      </Avatar>
    </Dropdown>
  );
};

export default LoginOut;
