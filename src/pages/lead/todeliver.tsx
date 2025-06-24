import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Select, Layout, Breadcrumb, theme, Menu, Input, DatePicker, Space, Tag, Card } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import moment from 'moment';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchToDeliver, Lead, Source, fetchSources, fetchStaffs, assignLead, unassignLead, showNotification } from '../../service/index';
import setupInterceptors from '../../service/index';

const { Header, Footer, Content } = Layout;
const { Search } = Input;
const { RangePicker } = DatePicker;

const items = Array.from({ length: 3 }).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

interface ToDeliverLead extends Lead {
  assignedStaff?: string;
  receivedDate?: string;
}

interface Staff {
  id: string;
  name: string;
}

const ToDeliverTable: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | undefined>(undefined);
  const [selectedLeadType, setSelectedLeadType] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[moment.Moment | null, moment.Moment | null] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string | undefined>(undefined);
  const [leadToUnassign, setLeadToUnassign] = useState<string | undefined>(undefined);
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

  // Fetch staffs
  const { data: staffsData = { staffs: [], total: 0 }, isLoading: isStaffsLoading, error: staffsError } = useQuery<
    { staffs: Staff[]; total: number },
    Error
  >({
    queryKey: ['staffs'],
    queryFn: () => fetchStaffs(),
    enabled: !!token,
  });

  // Fetch to-deliver leads
  const { data: leadsData, isLoading: isLeadsLoading, error: leadsError, refetch } = useQuery<
    { leads: ToDeliverLead[]; total: number },
    Error
  >({
    queryKey: ['toDeliver', pagination.current, pagination.pageSize, searchQuery, selectedSource, selectedLeadType, dateRange],
    queryFn: () =>
      fetchToDeliver(pagination.current, pagination.pageSize, searchQuery, selectedSource, selectedLeadType, dateRange),
    enabled: !!token,
  });

  // Assign lead mutation
  const assignLeadMutation = useMutation({
    mutationFn: (data: { leadIds: string[]; staffId: string }) => assignLead(data.leadIds, data.staffId),
    onSuccess: () => {
      showNotification('Success', 'Phân bổ lead thành công.');
      setIsAssignModalOpen(false);
      setSelectedRowKeys([]);
      setSelectedStaff(undefined);
      refetch();
    },
    onError: (error: Error) => {
      showNotification('Error', error.message || 'Không thể phân bổ lead.');
    },
  });

  // Unassign lead mutation
  const unassignLeadMutation = useMutation({
    mutationFn: (leadId: string) => unassignLead(leadId),
    onSuccess: () => {
      showNotification('Success', 'Gỡ phân bổ lead thành công.');
      setIsUnassignModalOpen(false);
      setLeadToUnassign(undefined);
      refetch();
    },
    onError: (error: Error) => {
      showNotification('Error', error.message || 'Không thể gỡ phân bổ lead.');
    },
  });

  useEffect(() => {
    if (leadsData?.total) {
      setPagination((prev) => ({ ...prev, total: leadsData.total }));
    }
  }, [leadsData]);

  const showFilterModal = () => setIsFilterModalOpen(true);
  const handleFilterOk = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    setIsFilterModalOpen(false);
  };
  const handleFilterCancel = () => setIsFilterModalOpen(false);

  const showAssignModal = () => {
    if (selectedRowKeys.length === 0) {
      showNotification('Error', 'Vui lòng chọn ít nhất một lead để phân bổ.');
      return;
    }
    setIsAssignModalOpen(true);
  };
  const handleAssignOk = () => {
    if (!selectedStaff) {
      showNotification('Error', 'Vui lòng chọn nhân viên để phân bổ.');
      return;
    }
    assignLeadMutation.mutate({ leadIds: selectedRowKeys.map(String), staffId: selectedStaff });
  };
  const handleAssignCancel = () => {
    setIsAssignModalOpen(false);
    setSelectedStaff(undefined);
  };

  const showUnassignModal = (leadId: string) => {
    setLeadToUnassign(leadId);
    setIsUnassignModalOpen(true);
  };
  const handleUnassignOk = () => {
    if (leadToUnassign) {
      unassignLeadMutation.mutate(leadToUnassign);
    }
  };
  const handleUnassignCancel = () => {
    setIsUnassignModalOpen(false);
    setLeadToUnassign(undefined);
  };

  const handleTableChange = (pagination: any) => {
    setPagination({ current: pagination.current, pageSize: pagination.pageSize, total: pagination.total });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
    showNotification('Info', value ? `Tìm kiếm với từ khóa: ${value}` : 'Đã xóa từ khóa tìm kiếm');
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const columns: ColumnsType<ToDeliverLead> = [
    {
      title: 'Mã Lead',
      dataIndex: 'code',
      key: 'code',
      fixed: 'left',
      width: 200,
    },
    { title: 'Nguồn Lead', dataIndex: 'source', key: 'source', width: 200 },
    { title: 'Kho cấu hình', dataIndex: 'repo', key: 'repo', width: 200 },
    { title: 'Cấu hình phân bổ', dataIndex: 'config', key: 'config', width: 220 },
    { title: 'Họ và tên', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', width: 150 },
    {
      title: 'Nhân viên chăm sóc',
      dataIndex: 'assignedStaff',
      key: 'assignedStaff',
      width: 200,
      render: (text: string, record: ToDeliverLead) =>
        text && text !== '-' ? (
          <Tag
            color="blue"
            closable
            onClose={(e) => {
              e.preventDefault();
              showUnassignModal(record.id);
            }}
          >
            {text}
          </Tag>
        ) : (
          '-'
        ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (text: string) => (text ? new Date(text).toLocaleDateString() : ''),
      width: 200,
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedDate',
      key: 'updatedDate',
      render: (text: string) => (text ? new Date(text).toLocaleDateString() : ''),
      width: 200,
    },
    {
      title: 'Ngày nhận',
      dataIndex: 'assignedDate',
      key: 'assignedDate',
      render: (text: string) => (text ? new Date(text).toLocaleDateString() : ''),
      width: 200,
    },
  ];

  if (sourcesError || leadsError || staffsError) {
    return (
      <Layout>
        <Content style={{ padding: '0 48px', background: colorBgContainer, minHeight: '100vh' }}>
          <Card style={{ margin: '16px 0', borderRadius: borderRadiusLG }}>
            <h2 style={{ color: 'red' }}>
              Lỗi: {(sourcesError || leadsError || staffsError)?.message || 'Không thể tải dữ liệu'}
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
          items={[{ title: 'Lead&Customer' }, { title: 'Khai thác Lead' }, { title: 'Danh sách Lead chờ phân bổ' }]}
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
                placeholder="Tìm kiếm (mã, tên, điện thoại...)"
                onSearch={handleSearch}
                allowClear
                style={{ width: 300 }}
                enterButton
              />
              <Space>
                <Button type="default" onClick={showFilterModal}>
                  Bộ lọc
                </Button>
                <Button type="primary" onClick={showAssignModal}>
                  Phân bổ
                </Button>
              </Space>
            </Space>
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
            <Modal
              title="Phân bổ Lead"
              open={isAssignModalOpen}
              onOk={handleAssignOk}
              onCancel={handleAssignCancel}
              confirmLoading={assignLeadMutation.isPending}
            >
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <div>
                  <label>Chọn nhân viên</label>
                  <Select
                    showSearch
                    placeholder="Chọn nhân viên"
                    optionFilterProp="label"
                    style={{ width: '100%' }}
                    value={selectedStaff}
                    onChange={(value) => setSelectedStaff(value)}
                    options={staffsData.staffs.map((staff) => ({
                      value: staff.id,
                      label: staff.name,
                    }))}
                    allowClear
                  />
                </div>
              </Space>
            </Modal>
            <Modal
              title="Gỡ phân bổ Lead"
              open={isUnassignModalOpen}
              onOk={handleUnassignOk}
              onCancel={handleUnassignCancel}
              confirmLoading={unassignLeadMutation.isPending}
            >
              <p>Bạn có chắc chắn muốn gỡ phân bổ lead này?</p>
            </Modal>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={leadsData?.leads || []}
              rowKey="id"
              pagination={pagination}
              loading={isLeadsLoading || isSourcesLoading || isStaffsLoading}
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

export default ToDeliverTable;