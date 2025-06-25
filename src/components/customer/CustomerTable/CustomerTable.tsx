import React, { useMemo, useState } from 'react';
import { Table, Input, Space, Button, Spin, Alert, Tag, Popconfirm, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AiOutlineFilter } from 'react-icons/ai';
import './CustomerTable.scss';
import Downloadd from '../../downloadd/downloadd';
import { BusinessLead, deleteBusinessLead } from '../../api/leadsApi';
import { Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

const { Search } = Input;

interface CustomerTableProps {
  onAddCustomerClick: () => void;
  onEditCustomer: (customer: BusinessLead) => void;
  onViewCustomer: (customer: BusinessLead) => void;
}

const fetchBusinessLead = async (): Promise<BusinessLead[]> => {
  const res = await axios.get('/api/business-leads');
  return res.data;
};

const CustomerTable: React.FC<CustomerTableProps> = ({ onAddCustomerClick, onEditCustomer, onViewCustomer }) => {
  const [searchText, setSearchText] = useState('');

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['business-leads'],
    queryFn: fetchBusinessLead,
  });

  const filteredData = useMemo(() => {
    return data.filter(customer => (customer.name || '').toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText, data]);

  const handleDelete = async (id: string) => {
    try {
      await deleteBusinessLead(id);
      message.success('Xoá thành công');
      refetch();
    } catch (err) {
      message.error('Xoá thất bại');
    }
  };
  const columns = [
    { title: 'Tên công ty', dataIndex: 'name', key: 'name' },
    { title: 'Mã số thuế', dataIndex: 'taxCode', key: 'taxCode' },
    { title: 'Mã khách hàng', dataIndex: 'customerCode', key: 'customerCode' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Đã kích hoạt' ? 'green' : 'volcano';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: 'Nguồn', dataIndex: 'leadStatus', key: 'leadStatus' },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: BusinessLead) => {
        const menu = (
          <Menu>
            <Menu.Item key="view" onClick={() => onViewCustomer(record)}>
              Xem
            </Menu.Item>
            <Menu.Item key="edit" onClick={() => onEditCustomer(record)}>
              Sửa
            </Menu.Item>
            <Menu.Item key="delete">
              <Popconfirm
                title="Xoá khách hàng?"
                onConfirm={() => handleDelete(record.id!)}
                okText="Xoá"
                cancelText="Huỷ"
              >
                <span style={{ color: 'red' }}>Xoá</span>
              </Popconfirm>
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div
        className="wrapper"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="wrapper" style={{ padding: '20px' }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={`Không thể tải dữ liệu khách hàng. Chi tiết lỗi: ${error?.message}`}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="toolbar">
        <Space className="searchBox">
          <Search
            placeholder="Tìm kiếm"
            allowClear
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
            suffix={<AiOutlineFilter />}
          />
        </Space>
        <div className="action_add">
          <div className="actions">
            <Downloadd />
            <Button type="primary" onClick={onAddCustomerClick} className="add.new">
              Thêm mới
            </Button>
          </div>
        </div>
      </div>
      <Table dataSource={filteredData} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default CustomerTable;
