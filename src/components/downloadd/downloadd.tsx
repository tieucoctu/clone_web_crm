import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'antd';
import './Download.scss';

const handleMenuClick: MenuProps['onClick'] = e => {
  if (e.key === 'download-template') {
    console.log('Tải file mẫu được chọn');
    // Ví dụ: window.open('/path-to-template.xlsx');
  } else if (e.key === 'import-data') {
    console.log('Nhập dữ liệu được chọn');
    // Có thể mở modal import tại đây
  }
};

const items: MenuProps['items'] = [
  {
    label: 'Tải file mẫu',
    key: 'download-template',
  },
  {
    label: 'Nhập dữ liệu',
    key: 'import-data',
  },
];

const Downloadd: React.FC = () => (
  <Dropdown menu={{ items, onClick: handleMenuClick }} placement="bottomLeft">
    <Button className="downloadButton">
      <Space>
        Tải/nhập dữ liệu
        <DownOutlined />
      </Space>
    </Button>
  </Dropdown>
);

export default Downloadd;
