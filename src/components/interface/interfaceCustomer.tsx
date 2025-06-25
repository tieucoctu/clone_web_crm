import React, { useState } from 'react';
import { Input, Space } from 'antd';
import './interfaceCustomer.scss';
import Breadcrumbbb from '../Breadcrumb/Breadcrumbbb';
import Download from '../download/Download';

const { Search } = Input;

interface GiaodienProps {}

const Interface: React.FC<GiaodienProps> = () => {
  const [searchText, setSearchText] = useState('');

  return (
    <div className="wrapper">
      <div className="breadcrumb">
        <Breadcrumbbb />
      </div>
      <div className="toolbar">
        <Space className="searchBox">
          <Search
            placeholder="Tìm kiếm"
            allowClear
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Download />
        </Space>
      </div>
      <div className="img">
        <ul>
          <li>
            <img src="" />
            ảnh 1
          </li>
          <li>ảnh 1</li>
          <li>ảnh 1</li>
          <li>ảnh 1</li>
          <li>ảnh 1</li>
        </ul>
        <ul>
          <li>ảnh 1</li>
          <li>ảnh 1</li>
          <li>ảnh 1</li>
          <li>ảnh 1</li>
          <li>ảnh 1</li>
        </ul>
        <ul>
          <li>ảnh 1</li>
          <li>ảnh 1</li>
          <li>ảnh 1</li>
          <li>ảnh 1</li>
          <li>ảnh 1</li>
        </ul>
      </div>
    </div>
  );
};

export default Interface;
