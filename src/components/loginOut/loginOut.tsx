import { Avatar, Dropdown, Menu } from 'antd';
import React from 'react';
import './loginOut.scss';

const LoginOut: React.FC = () => {
  const menuItems = (
    <Menu className="dropdown-menu-wrapper">
      <Menu.Item key="1">Option 1</Menu.Item>
      <Menu.Item key="2">Option 2</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">Tài khoản</Menu.Item>
      <Menu.Item key="4">Đăng xuất</Menu.Item>
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
