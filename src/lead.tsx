import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, notification, Select, Layout, Breadcrumb, theme, Menu, Input, DatePicker } from 'antd';
import { ColumnsType } from 'antd/es/table';
import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useNavigate } from 'react-router-dom';
import { NavigateFunction } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';

const { Header, Footer, Content } = Layout;
const { Search } = Input;
const { RangePicker } = DatePicker;

const items = Array.from({ length: 15 }).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

interface Lead {
  id: string;
  code: string;
  source: string;
  repo: string;
  config: string;
  name: string;
  phone: string;
  email: string;
  profileUrl: string;
  createdDate: string;
  updatedDate: string;
  note: string;
  pos: string;
}

interface Source {
  id: string;
  name: string;
}

interface JwtPayload {
  exp: number;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

const showNotification = (message: string, description: string, type: 'success' | 'error' = 'error') => {
  notification[type]({ message, description });
};

const handleError = (error: AxiosError, navigate: NavigateFunction): Promise<AxiosError> => {
  if (!error.response) {
    console.error('No response from server:', error);
    if (error.code === 'ERR_NETWORK') {
      showNotification('CORS Error', 'error');
    } else {
      showNotification('Lỗi kết nối', 'error');
    }
    return Promise.reject(error);
  }

  const { status, data } = error.response;
  console.error(`API Error: Status ${status}, Data:`, data);

  switch (status) {
    case 400:
      showNotification('Bad Request', 'Yêu cầu không hợp lệ.', 'error');
      break;
    case 401:
      showNotification('Unauthorized', 'Yêu cầu xác thực không hợp lệ.', 'error');
      break;
    case 403: {
      const token = Cookies.get('access_token');
      if (token) {
        const jwt = jwtDecode<JwtPayload>(token);
        if (Date.now() / 1000 < jwt.exp) {
          showNotification('Không có quyền truy cập.', 'Xin liên hệ với admin để được cấp quyền.', 'error');
          navigate('/403');
        } else {
          showNotification('Forbidden', 'Vui lòng đăng nhập lại.', 'error');
          window.location.replace(import.meta.env.VITE_APP_REDIRECT_URI);
          Cookies.remove('access_token', { domain: import.meta.env.VITE_APP_COOKIES });
          Cookies.remove('refresh_token', { domain: import.meta.env.VITE_APP_COOKIES });
        }
      }
      break;
    }
    case 404:
      showNotification('404 Not Found', 'Sai URL hoặc tài nguyên không tồn tại.', 'error');
      break;
    case 500:
      showNotification('500', 'Internal Server Error', 'error');
      break;
    case 503:
      showNotification('503', 'Service Unavailable', 'error');
      break;
    default:
      showNotification('Lỗi!', `Unexpected error: ${status}`, 'error');
      break;
  }

  return Promise.reject(error.response);
};

const LeadTable: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSource, setSelectedSource] = useState<string | undefined>(undefined);
  const [selectedLeadType, setSelectedLeadType] = useState<string | undefined>(undefined);
  const [dateRange] = useState<[moment.Moment | null, moment.Moment | null] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const showCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateOk = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
  };

  const showFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const handleFilterOk = () => {
    fetchLeads(pagination.current, pagination.pageSize);
    setIsFilterModalOpen(false);
  };

  const handleFilterCancel = () => {
    setIsFilterModalOpen(false);
  };

  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const API_URL = '/msx-lead/api/query/v1/lead/common';
  const SOURCE_API_URL = '/msx-lead/api/query/v1/source/list';

  useEffect(() => {
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => handleError(error, navigate),
    );
    return () => axiosInstance.interceptors.response.eject(responseInterceptor);
  }, [navigate]);

  const fetchSources = async () => {
    try {
      const response: AxiosResponse = await axiosInstance.get(SOURCE_API_URL);
      const sourceData = response.data?.data || [];
      setSources(sourceData.map((item: any) => ({
        id: item.id,
        name: item.name,
      })));
    } catch (error: any) {
      console.error('Error fetching sources:', error);
      showNotification('Error', 'Không thể tải danh sách nguồn lead.', 'error');
    }
  };

  const fetchLeads = async (page: number, pageSize: number, query: string = searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      const params: any = { page, pageSize };
      if (query) params.query = query; // Add search query to API params
      if (selectedSource) params.source = selectedSource;
      if (selectedLeadType) params.leadType = selectedLeadType;
      if (dateRange && dateRange[0] && dateRange[1]) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }

      const response: AxiosResponse = await axiosInstance.get(API_URL, { params });

      const rows = response.data?.data?.rows;
      if (!Array.isArray(rows)) {
        console.error('Unexpected response format:', response.data);
        throw new Error('Dữ liệu không đúng định dạng');
      }

      const leadsData: Lead[] = rows.map((item: any) => ({
        id: item.id,
        code: item.code,
        source: item.source,
        repo: item.repo?.name || '',
        config: item.config?.name || '',
        name: item.name,
        phone: item.phone,
        email: item.email,
        profileUrl: item.profileUrl,
        createdDate: item.createdDate,
        updatedDate: item.updatedDate,
        note: item.note,
        pos: item.pos?.name || '',
      }));

      setLeads(leadsData);
      setPagination({
        current: page,
        pageSize,
        total: response.data?.data?.total || rows.length,
      });
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      const errorMessage = error.message || 'Không thể tải dữ liệu';
      setError(errorMessage);
      showNotification('Error', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination: any) => {
    fetchLeads(pagination.current, pagination.pageSize);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    fetchLeads(1, pagination.pageSize, value);
    showNotification('Info', value ? `Tìm kiếm với từ khóa: ${value}` : 'Đã xóa từ khóa tìm kiếm', 'success');
  };

  const columns: ColumnsType<Lead> = [
    {
      title: 'Mã Lead',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Nguồn Lead',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: 'Kho cấu hình',
      dataIndex: 'repo',
      key: 'repo',
    },
    {
      title: 'Cấu hình phân bổ',
      dataIndex: 'config',
      key: 'config',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Link profile',
      dataIndex: 'profileUrl',
      key: 'profileUrl',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (text: string) => (text ? new Date(text).toLocaleDateString() : ''),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Đơn vị tiếp nhận',
      dataIndex: 'pos',
      key: 'pos',
    },
  ];

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      fetchLeads(pagination.current, pagination.pageSize);
      fetchSources();
    } else {
      showNotification('Error', 'Vui lòng đăng nhập.', 'error');
      navigate('/login');
    }
  }, [navigate]);

  if (error) {
    return (
      <div className="lead-table-container p-6 bg-gray-100 min-h-screen">
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-red-500">Lỗi: {error}</h2>
          <p>Vui lòng kiểm tra kết nối mạng.</p>
        </div>
      </div>
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
          <div className="lead-table-container p-6 bg-gray-100 min-h-screen">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', width: '100%' }}>
              <Search
                placeholder="Tìm kiếm (mã, tên, điện thoại, email...)"
                onSearch={handleSearch}
                allowClear
                style={{ width: 300 }}
                enterButton
              />
              <div>
                <Button
                  type="default"
                  onClick={showFilterModal}
                  style={{ marginRight: 8 }}
                >
                  Bộ lọc
                </Button>
                <Button type="primary" onClick={showCreateModal}>
                  Tạo mới Lead
                </Button>
              </div>
            </div>
            <Modal
              title="Tạo mới lead"
              open={isCreateModalOpen}
              onOk={handleCreateOk}
              onCancel={handleCreateCancel}
            >
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
            <Modal
              title="Bộ lọc"
              open={isFilterModalOpen}
              onOk={handleFilterOk}
              onCancel={handleFilterCancel}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label>Nguồn Lead</label>
                  <Select
                    showSearch
                    placeholder="Chọn nguồn lead"
                    optionFilterProp="label"
                    style={{ width: '100%' }}
                    value={selectedSource}
                    onChange={(value) => setSelectedSource(value)}
                    options={sources.map((source) => ({
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
                  />
                </div>
              </div>
            </Modal>
            <Table
              columns={columns}
              dataSource={leads}
              rowKey="id"
              pagination={pagination}
              loading={loading}
              onChange={handleTableChange}
              bordered
              className="bg-white shadow-md rounded"
              scroll={{ x: 'fit-content', y: 55 * 8 }}
            />
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default LeadTable;