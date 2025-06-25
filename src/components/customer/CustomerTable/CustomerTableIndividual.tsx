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
import CustomerIndividual from '../../Filter/FilterCustomerIndividual/CustomerIndividual';
import type { ColumnsType } from 'antd/es/table';

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

const CustomerTableIndividual: React.FC<CustomerTableProps> = ({
  onAddCustomerClick,
  onEditCustomer,
  onViewCustomer,
}) => {
  const [searchText, setSearchText] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

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
  const columns: ColumnsType<BusinessLead> = [
    { title: 'Tên công ty', dataIndex: 'name', key: 'name', fixed: 'left', width: 120 },
    { title: 'CCCD', dataIndex: 'taxCode', key: 'taxCode' },
    { title: 'Mã khách hàng', dataIndex: 'customerCode', key: 'customerCode' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Đã kích hoạt' ? 'green' : 'volcano';
        return (
          <Tag color={color} className="no-border-tag" style={{ backgroundColor: 'transparent' }}>
            {status}
          </Tag>
        );
      },
    },
    { title: 'Nguồn', dataIndex: 'leadStatus', key: 'leadStatus' },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      render: (text: string) => (text ? new Date(text).toLocaleString('vi-VN') : '—'),
    },
    {
      title: 'Hành động',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_: any, record: BusinessLead) => {
        const menu = (
          <Menu>
            <Menu.Item key="view" onClick={() => onViewCustomer(record)}>
              Xem chi tiết
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Dropdown overlay={menu} trigger={['click']}>
              <Button icon={<MoreOutlined />} type="text" size="small" />
            </Dropdown>
          </div>
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
            style={{ width: 350 }}
            suffix={
              <Dropdown
                open={filterVisible}
                onOpenChange={setFilterVisible}
                overlay={
                  <CustomerIndividual
                    onFilter={data => {
                      console.log('Dữ liệu lọc:', data);
                      setFilterVisible(false);
                    }}
                    onClear={() => {
                      console.log('Xoá bộ lọc');
                      setFilterVisible(false);
                    }}
                  />
                }
                trigger={['click']}
                placement="bottomRight"
              >
                <span>
                  <AiOutlineFilter />
                </span>
              </Dropdown>
            }
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
      <Table<BusinessLead>
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1500 }}
      />
    </div>
  );
};

export default CustomerTableIndividual;
