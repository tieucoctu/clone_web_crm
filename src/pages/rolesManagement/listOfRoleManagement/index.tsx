import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { DEFAULT_PARAMS, FORMAT_DATE, OPTIONS_STATUS } from '../../../contanst';
import { getListOfRoles } from '../../../service/roles';
import { Button, Dropdown, Flex, Input, Menu, Select, Space, Table, Tag, Typography } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { debounce } from 'lodash';

const ListOfRoleManagement = () => {
  const [filterParams, setFilterParams] = useState(DEFAULT_PARAMS);

  const { data, isLoading } = useQuery({
    queryFn: () => getListOfRoles(filterParams),
    queryKey: ['list-of-roles', filterParams],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const dataSource = data?.data?.data?.rows || [];
  const columns = [
    {
      title: 'Mã vai trò',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên vai trò',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      render: (value: boolean) => {
        const status = OPTIONS_STATUS.find(option => option.value === value);
        return (
          <Typography.Text style={{ color: status?.color }} key={status?.label}>
            {status?.label}
          </Typography.Text>
        );
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'modifiedDate',
      key: 'modifiedDate',
      render: (value: string) => (value ? dayjs(value).format(FORMAT_DATE) : ''),
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'updater',
      key: 'updater',
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (value: string) => (value ? dayjs(value).format(FORMAT_DATE) : ''),
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: () => (
        <Dropdown
          menu={{
            items: [
              { key: '1', label: 'Xem chi tiết' },
              { key: '2', label: 'Vô hiệu hoá' },
              { key: '3', label: 'Tạo bản sao' },
              { key: '4', label: 'Xóa', danger: true },
            ],
          }}
          trigger={['click']}
        >
          <Button icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handleSearchChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterParams(prev => ({ ...prev, search: e.target.value }));
  }, 500);

  const handleSelectStatus = (value: boolean) => {
    setFilterParams(prev => ({ ...prev, isActive: value }));
  };

  return (
    <div style={{ padding: 24 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Space>
          <Input.Search placeholder="Tìm kiếm" onChange={handleSearchChange} />
          <Select
            options={OPTIONS_STATUS}
            placeholder="Chọn quyền"
            onSelect={handleSelectStatus}
            style={{ width: 200 }}
          />
        </Space>
        <Button type="primary">Thêm mới</Button>
      </Flex>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: filterParams.page,
          pageSize: filterParams.pageSize,
          total: data?.data?.data?.total || 0,
          onChange: (page, pageSize) => {
            setFilterParams(prev => ({ ...prev, page, pageSize }));
          },
          showSizeChanger: true,
        }}
      />
    </div>
  );
};

export default ListOfRoleManagement;
