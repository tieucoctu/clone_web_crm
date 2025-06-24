import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Layout, Breadcrumb, theme, Menu, notification, Empty, Card, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Source, fetchSources, axiosInstance } from '../../service/index';
import setupInterceptors from '../../service/index';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Header, Footer, Content } = Layout;
const { confirm } = Modal;

const items = Array.from({ length: 3 }).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

const LeadSourceList: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [newSourceName, setNewSourceName] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    setupInterceptors(navigate);
  }, [navigate]);

  const token = Cookies.get('access_token');
  if (!token) {
    notification.error({ message: 'Error', description: 'Vui lòng đăng nhập.' });
    navigate('/login');
  }

  const { data: sourcesData, isLoading, error, refetch } = useQuery<
    { sources: Source[]; total: number },
    Error
  >({
    queryKey: ['sources', pagination.current, pagination.pageSize],
    queryFn: () => fetchSources(pagination.current, pagination.pageSize),
    enabled: !!token,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (sourcesData?.total) {
      setPagination((prev) => ({ ...prev, total: sourcesData.total }));
    } else {
      setPagination((prev) => ({ ...prev, total: 0 }));
    }
  }, [sourcesData]);

  const createSourceMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await axiosInstance.post('/msx-lead/api/query/v1/source', { name });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
      notification.success({ message: 'Success', description: 'Tạo nguồn mới thành công.' });
      setIsCreateModalOpen(false);
      setNewSourceName('');
      refetch();
    },
    onError: () => {
      notification.error({ message: 'Error', description: 'Không thể tạo nguồn mới.' });
    },
  });

  const updateSourceMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const response = await axiosInstance.put(`/msx-lead/api/query/v1/source/${id}`, { name });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
      notification.success({ message: 'Success', description: 'Cập nhật tên nguồn thành công.' });
      setIsEditModalOpen(false);
      setSelectedSource(null);
      setNewSourceName('');
      refetch();
    },
    onError: () => {
      notification.error({ message: 'Error', description: 'Không thể cập nhật tên nguồn.' });
    },
  });

  const deleteSourceMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/msx-lead/api/query/v1/source/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
      notification.success({ message: 'Success', description: 'Xóa nguồn thành công.' });
      refetch();
    },
    onError: () => {
      notification.error({ message: 'Error', description: 'Không thể xóa nguồn.' });
    },
  });

  const showCreateModal = () => {
    setNewSourceName('');
    setIsCreateModalOpen(true);
  };

  const handleCreateOk = () => {
    if (newSourceName.trim()) {
      createSourceMutation.mutate(newSourceName.trim());
    } else {
      notification.error({ message: 'Error', description: 'Tên nguồn không được để trống.' });
    }
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
    setNewSourceName('');
  };

  const showEditModal = (source: Source) => {
    setSelectedSource(source);
    setNewSourceName(source.name);
    setIsEditModalOpen(true);
  };

  const handleEditOk = () => {
    if (selectedSource && newSourceName.trim()) {
      updateSourceMutation.mutate({ id: selectedSource.id, name: newSourceName.trim() });
    } else {
      notification.error({ message: 'Error', description: 'Tên nguồn không được để trống.' });
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setSelectedSource(null);
    setNewSourceName('');
  };

  const showDeleteConfirm = (id: string) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa nguồn này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        deleteSourceMutation.mutate(id);
      },
    });
  };

  const handleTableChange = (pagination: any) => {
    setPagination({ current: pagination.current, pageSize: pagination.pageSize, total: pagination.total });
  };

  const columns: ColumnsType<Source> = [
    {
      title: 'Tên nguồn',
      dataIndex: 'name',
      key: 'name',
      width: 300,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (text: string) => (text ? new Date(text).toLocaleDateString() : '-'),
      width: 150,
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedDate',
      key: 'updatedDate',
      render: (text: string) => (text ? new Date(text).toLocaleDateString() : '-'),
      width: 150,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 200,
      render: (_, record: Source) => (
        <Space size="middle">
          <Button type="link" onClick={() => showEditModal(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => showDeleteConfirm(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <Layout>
        <Content style={{ padding: '0 48px', background: colorBgContainer, minHeight: '100vh' }}>
          <Card style={{ margin: '16px 0', borderRadius: borderRadiusLG }}>
            <h2 style={{ color: 'red' }}>
              Lỗi: {error.message || 'Không thể tải dữ liệu'}
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
          items={[{ title: 'Lead&Customer' }, { title: 'Khai thác Lead' }, { title: 'Danh sách Nguồn Lead' }]}
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
              style={{ width: '100%', justifyContent: 'flex-end', marginBottom: 16 }}
            >
              <Button type="primary" onClick={showCreateModal}>
                Tạo mới
              </Button>
            </Space>
            <Table
              columns={columns}
              dataSource={sourcesData?.sources || []}
              rowKey="id"
              pagination={pagination}
              loading={isLoading}
              onChange={handleTableChange}
              bordered
              style={{ borderRadius: borderRadiusLG, overflow: 'hidden' }}
              scroll={{ x: 800, y: 55 * 8 }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Không có dữ liệu nguồn lead. Vui lòng tạo mới nguồn hoặc kiểm tra API."
                  />
                ),
              }}
            />
              <Modal
              title="Tạo mới nguồn Lead"
              open={isCreateModalOpen}
              onOk={handleCreateOk}
              onCancel={handleCreateCancel}
              okText="Tạo"
              cancelText="Hủy"
            >
              <Input
                placeholder="Nhập tên nguồn Lead"
                value={newSourceName}
                onChange={(e) => setNewSourceName(e.target.value)}
              />
            </Modal>
            <Modal
              title="Sửa tên nguồn"
              open={isEditModalOpen}
              onOk={handleEditOk}
              onCancel={handleEditCancel}
              okText="Lưu"
              cancelText="Hủy"
            >
              <Input
                placeholder="Nhập tên nguồn"
                value={newSourceName}
                onChange={(e) => setNewSourceName(e.target.value)}
              />
            </Modal>
          </Card>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default LeadSourceList;