import React, { useState } from 'react';
import { Layout, Button, Drawer, Input, Badge } from 'antd';
import { MenuOutlined, BellOutlined } from '@ant-design/icons';
import Sidebar from '../Sidebar/Sidebar';
import './header.scss';
import LoginOut from '../loginOut/loginOut';

const { Header: AntHeader } = Layout;
const { Search } = Input;

const AppHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  return (
    <>
      <AntHeader className="header">
        <Button
          type="text"
          icon={<MenuOutlined className="menuIcon" />}
          onClick={() => setMenuOpen(true)}
          className="menuButton"
        />

        <div className="title">CRM</div>

        <div className="headerRight">
          <Badge dot size="small" offset={[-2, 2]}>
            <div className="notificationIcon">
              <BellOutlined />
            </div>
          </Badge>
          <LoginOut />
        </div>
      </AntHeader>
      <Drawer
        title="Quản lý quan hệ khách hàng"
        placement="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        width={220}
      >
        <Search
          placeholder="Tìm menu..."
          allowClear
          onChange={e => setSearchText(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Sidebar searchText={searchText} />
      </Drawer>
    </>
  );
};

export default AppHeader;
