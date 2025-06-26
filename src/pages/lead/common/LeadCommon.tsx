import React from 'react';
import { Table, Card } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { LeadTable } from '../../../service/LeadComponents/Table';
import { Lead } from '../../../service/LeadComponents/index';

const LeadCommon: React.FC = () => {
  const {
    pagination,
    leadsData,
    isLeadsLoading,
    leadsError,
    handleTableChange,
  } = LeadTable();

  const columns: ColumnsType<Lead> = [
    { title: 'Mã Lead', dataIndex: 'code', key: 'code', width: 200 },
    { title: 'Nguồn Lead', dataIndex: 'source', key: 'source', width: 200 },
    { title: 'Kho cấu hình', dataIndex: 'repo', key: 'repo', width: 200 },
    { title: 'Cấu hình phân bổ', dataIndex: 'config', key: 'config', width: 220 },
    { title: 'Họ và tên', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', width: 150 },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 230 },
    { title: 'Link profile', dataIndex: 'profileUrl', key: 'profileUrl', width: 200 },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (text: string) => (text ? new Date(text).toLocaleDateString() : ''),
      width: 200,
    },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note', width: 200 },
    { title: 'Đơn vị tiếp nhận', dataIndex: 'pos', key: 'pos', width: 200 },
  ];

  if (leadsError) {
    return (
      <Card>
        <h2>Lỗi: {leadsError.message || 'Không thể tải dữ liệu'}</h2>
      </Card>
    );
  }

  return (
    <div style={{ padding: 36 }}>
      <Card>
        <Table
          columns={columns}
          dataSource={leadsData?.leads || []}
          rowKey="id"
          pagination={pagination}
          loading={isLeadsLoading}
          onChange={handleTableChange}
          bordered
          style={{ borderRadius: 8, overflow: 'hidden' }}
          scroll={{ x: 2000, y: 55 * 8 }}
        />
      </Card>
    </div>
  );
};

export default LeadCommon;