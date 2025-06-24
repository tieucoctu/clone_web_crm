import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Select, Layout, Breadcrumb, theme, Menu, Input, DatePicker, Space, Card } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { fetchLeads, Lead, Source, fetchSources, showNotification } from '../../service/index';
import setupInterceptors from '../../service/index';

const { Header, Footer, Content } = Layout;
const { Search } = Input;
const { RangePicker } = DatePicker;

const items = Array.from({ length: 3 }).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

const LeadTable: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | undefined>(undefined);
  const [selectedLeadType, setSelectedLeadType] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[moment.Moment | null, moment.Moment | null] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sourcePagination, setSourcePagination] = useState({
    current: 1,
    pageSize: 100,
    total: 0,
  });

  // Setup interceptors
  useEffect(() => {
    setupInterceptors(navigate);
  }, [navigate]);

  const token = Cookies.get('access_token');
  if (!token) {
    showNotification('Error', 'Vui lòng đăng nhập.');
    navigate('/login');
  }

  // Fetch sources
  const { data: sourcesData = { sources: [], total: 0 }, isLoading: isSourcesLoading, error: sourcesError } = useQuery<
    { sources: Source[]; total: number },
    Error
  >({
    queryKey: ['sources', sourcePagination.current, sourcePagination.pageSize],
    queryFn: () => fetchSources(sourcePagination.current, sourcePagination.pageSize),
    enabled: !!token,
  });

  useEffect(() => {
    if (sourcesData?.total) {
      setSourcePagination((prev) => ({ ...prev, total: sourcesData.total }));
    }
  }, [sourcesData]);

  // Fetch leads
  const { data: leadsData, isLoading: isLeadsLoading, error: leadsError } = useQuery<
    { leads: Lead[]; total: number },
    Error
  >({
    queryKey: ['leads', pagination.current, pagination.pageSize, searchQuery, selectedSource, selectedLeadType, dateRange],
    queryFn: () =>
      fetchLeads(pagination.current, pagination.pageSize, searchQuery, selectedSource, selectedLeadType, dateRange),
    enabled: !!token,
  });

  useEffect(() => {
    if (leadsData?.total) {
      setPagination((prev) => ({ ...prev, total: leadsData.total }));
    }
  }, [leadsData]);

  const showCreateModal = () => setIsCreateModalOpen(true);
  const handleCreateOk = () => setIsCreateModalOpen(false);
  const handleCreateCancel = () => setIsCreateModalOpen(false);
  const showFilterModal = () => setIsFilterModalOpen(true);
  const handleFilterOk = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    setIsFilterModalOpen(false);
  };
  const handleFilterCancel = () => setIsFilterModalOpen(false);

  const handleTableChange = (pagination: any) => {
    setPagination({ current: pagination.current, pageSize: pagination.pageSize, total: pagination.total });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
    showNotification('Info', value ? `Tìm kiếm với từ khóa: ${value}` : 'Đã xóa từ khóa tìm kiếm');
  };

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

  if (sourcesError || leadsError) {
    return (
      <Layout>
        <Content style={{ padding: '0 48px', background: colorBgContainer, minHeight: '100vh' }}>
          <Card style={{ margin: '16px 0', borderRadius: borderRadiusLG }}>
            <h2 style={{ color: 'red' }}>
              Lỗi: {(sourcesError || leadsError)?.message || 'Không thể tải dữ liệu'}
            </h2>
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <Breadcrumb
          style={{ margin: '16px 0' }}
          items={[{ title: 'Lead&Customer' }, { title: 'Khai thác Lead' }, { title: 'Danh sách Lead' }]}
        />
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Card
            style={{
              borderRadius: borderRadiusLG,
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              minHeight: 'calc(100vh - 200px)',
            }}
          >
            <Space
              direction="horizontal"
              size="middle"
              style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}
            >
              <Search
                placeholder="Tìm kiếm (mã, tên, điện thoại, email...)"
                onSearch={handleSearch}
                allowClear
                style={{ width: 300 }}
                enterButton
              />
              <Space>
                <Button type="default" onClick={showFilterModal}>
                  Bộ lọc
                </Button>
                <Button type="primary" onClick={showCreateModal}>
                  Tạo mới Lead
                </Button>
              </Space>
            </Space>
            <Modal title="Tạo mới lead" open={isCreateModalOpen} onOk={handleCreateOk} onCancel={handleCreateCancel}>
              <p>Some contents...</p>
              <Select
                showSearch
                placeholder="Select a person"
                optionFilterProp="label"
                onChange={(value) => console.log(`selected ${value}`)}
                onSearch={(value) => console.log('search:', value)}
                options={[
                  { value: 'jack', label: 'Jack' },
                  { value: 'lucy', label: 'Lucy' },
                  { value: 'tom', label: 'Tom' },
                ]}
              />
            </Modal>
            <Modal title="Bộ lọc" open={isFilterModalOpen} onOk={handleFilterOk} onCancel={handleFilterCancel}>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <div>
                  <label>Nguồn Lead</label>
                  <Select
                    showSearch
                    placeholder="Chọn nguồn lead"
                    optionFilterProp="label"
                    style={{ width: '100%' }}
                    value={selectedSource}
                    onChange={(value) => setSelectedSource(value)}
                    options={sourcesData.sources.map((source) => ({
                      value: source.name,
                      label: source.name,
                    }))}
                    allowClear
                  />
                </div>
                <div>
                  <label>Loại Lead</label>
                  <Select
                    placeholder="Chọn loại lead"
                    style={{ width: '100%' }}
                    value={selectedLeadType}
                    onChange={(value) => setSelectedLeadType(value)}
                    options={[
                      { value: 'normal', label: 'Lead Thường' },
                      { value: 'hot', label: 'Lead Hot' },
                    ]}
                    allowClear
                  />
                </div>
                <div>
                  <label>Từ ngày - Đến ngày</label>
                  <RangePicker
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    onChange={(dates) => setDateRange(dates as [moment.Moment | null, moment.Moment | null])}
                  />
                </div>
              </Space>
            </Modal>
            <Table
              columns={columns}
              dataSource={leadsData?.leads || []}
              rowKey="id"
              pagination={pagination}
              loading={isLeadsLoading || isSourcesLoading}
              onChange={handleTableChange}
              bordered
              style={{ borderRadius: borderRadiusLG, overflow: 'hidden' }}
              scroll={{ x: 2000, y: 55 * 8 }}
            />
          </Card>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default LeadTable;