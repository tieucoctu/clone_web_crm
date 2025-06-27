import React from 'react';
import { Table, Flex, Space, Input } from 'antd';
import { IFilterRole } from '../../../types/roles';
import { useQuery } from '@tanstack/react-query';
import { getListOfLeads } from '../../../service/leads';
import { DEFAULT_PARAMS } from '../../../contanst';
import { useState } from 'react';
import { debounce } from 'lodash';
import CreateLeadModal from '../createOfLead';
import FilterOfLead from '../filterOfLead/index';

const LeadCommon: React.FC = () => {
    const [filterParams, setFilterParams] = useState<IFilterRole>(DEFAULT_PARAMS);

    const { data, isLoading } = useQuery({
        queryFn: () => getListOfLeads(filterParams),
        queryKey: ['list-of-leads', filterParams],  
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const dataSource = data?.data?.data?.rows || [];

    const columns = [
        { title: 'Mã Lead', dataIndex: 'code', key: 'code' },
        { title: 'Nguồn Lead', dataIndex: 'source', key: 'source' },
        { title: 'Kho cấu hình', dataIndex: 'repo', key: 'repo', render: (repo: any) => repo?.name || ''},
        { title: 'Cấu hình phân bổ', dataIndex: 'repo', key: 'config', render: (repo: any) => repo?.config?.name || ''},
        { title: 'Họ và tên', dataIndex: 'name', key: 'name' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Link profile', dataIndex: 'profileUrl', key: 'profileUrl'},
        {
        title: 'Ngày tạo',
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: (text: string) => (text ? new Date(text).toLocaleDateString() : ''),
        },
        { title: 'Ghi chú', dataIndex: 'note', key: 'note'},
        { title: 'Đơn vị tiếp nhận', dataIndex: 'pos', key: 'pos',render: (pos: any) => pos?.name || ''},
    ];
    
    const handleSearchChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      setFilterParams(prev => ({ ...prev, search: e.target.value }));
    }, 500);

    return (
        <div style={{ padding: 36 }}>
          <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Space>
          <Input.Search placeholder="Tìm kiếm" onChange={handleSearchChange} />
          <FilterOfLead />
        </Space>
        <CreateLeadModal />
      </Flex>
            <Table
            columns={columns}
            dataSource={dataSource}
            rowKey="id"
            loading={isLoading}
            bordered
            style={{ borderRadius: 8, overflow: 'hidden' }}
            scroll={{ x: 2000, y: 55 * 8 }}
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

export default LeadCommon;