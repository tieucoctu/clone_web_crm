import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'antd';
import './Download.scss';

const handleMenuClick: MenuProps['onClick'] = e => {
  if (e.key === 'download-template') {
    console.log('Tải file mẫu được chọn');
  } else if (e.key === 'import-data') {
    console.log('Nhập dữ liệu được chọn');
  }
};

const items: MenuProps['items'] = [
  {
    label: 'Cũ nhất',
    key: 'download-template',
  },
  {
    label: 'Mới nhất',
    key: 'import-data',
  },
];

const Download: React.FC = () => (
  <Dropdown menu={{ items, onClick: handleMenuClick }} placement="bottomLeft">
    <Button className="downloadButton">
      <Space>
        <div className="sxt">Sắp xếp theo: </div>
        <div className="mn">Mới nhất</div>
        <DownOutlined />
      </Space>
    </Button>
  </Dropdown>
);

export default Download;
