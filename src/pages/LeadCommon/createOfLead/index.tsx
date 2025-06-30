import React from 'react';
import { Modal, Form, Select, Input, Button, Space, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getListOfLeadsSource, getListOfLeadsRepo, getLeadRepoConfigs, createLead } from '../../../service/leads';
import { DEFAULT_PARAMS } from '../../../contanst';

const { Option } = Select;
const { TextArea } = Input;

const CreateLeadModal: React.FC = () => {
    const [form] = Form.useForm();
    const [selectedRepoId, setSelectedRepoId] = React.useState<string | null>(null);
    const [isVisible, setIsVisible] = React.useState(false);
    const queryClient = useQueryClient();

    const { data: leadSources } = useQuery({
        queryFn: () => getListOfLeadsSource(DEFAULT_PARAMS),
        queryKey: ['list-of-leads-source'],
        staleTime: 1000 * 60 * 5,
    });

    const { data: leadRepos } = useQuery({
        queryFn: () => getListOfLeadsRepo(DEFAULT_PARAMS),
        queryKey: ['list-of-leads-repo'],
        staleTime: 1000 * 60 * 5,
    });

    const { data: repoConfigs } = useQuery({
        queryFn: () => getLeadRepoConfigs(selectedRepoId!),
        queryKey: ['lead-repo-configs', selectedRepoId],
        enabled: !!selectedRepoId,
        staleTime: 1000 * 60 * 5,
    });

    const sourcesList = leadSources?.data?.data?.rows || [];
    const reposList = leadRepos?.data?.data?.rows || [];
    const configsList = repoConfigs?.data?.data?.configs || [];

    const showModal = () => setIsVisible(true);
    const handleCancel = () => {
        setIsVisible(false);
        form.resetFields();
        setSelectedRepoId(null);
    };

    const createLeadMutation = useMutation({
        mutationFn: createLead,
        onSuccess: () => {
            message.success('Tạo lead thành công!');
            setIsVisible(false);
            form.resetFields();
            setSelectedRepoId(null);
            queryClient.invalidateQueries({ queryKey: ['list-of-leads'] });
        },
        onError: () => {
            message.error('Có lỗi khi tạo lead!');
        },
    });

    const handleSubmit = async (values: any) => {
        createLeadMutation.mutate(values);
    };

    const handleRepoChange = (value: string) => {       //bỏ Cấu hình phân bổ khi chọn Kho phân bổ khác
        setSelectedRepoId(value);
        form.setFieldsValue({ configId: undefined });
    };

    return (
        <>
            <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
                Tạo mới Lead
            </Button>
            <Modal title="Tạo mới Lead" open={isVisible} onCancel={handleCancel} footer={null} width={600}>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="sourceId" label="Nguồn Lead" rules={[{ required: true, message: 'Vui lòng chọn nguồn lead!' }]}> 
                        <Select placeholder="Chọn nguồn lead">
                            {sourcesList.map((source: any) => (
                                <Option key={source.id} value={source.id}>
                                    {source.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="repoId" label="Kho cấu hình" rules={[{ required: true, message: 'Vui lòng chọn kho cấu hình!' }]}> 
                        <Select placeholder="Chọn kho cấu hình" onChange={handleRepoChange}>
                            {reposList.map((repo: any) => (
                                <Option key={repo.id} value={repo.id}>
                                    {repo.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="configId" label="Cấu hình phân bổ" rules={[{ required: true, message: 'Vui lòng chọn cấu hình phân bổ!' }]}> 
                        <Select placeholder="Chọn cấu hình phân bổ" disabled={!selectedRepoId}>
                            {configsList.map((config: any) => (
                                <Option key={config.code} value={config.code}>
                                    {config.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="name" label="Tên Lead" rules={[{ required: true, message: 'Vui lòng nhập tên lead!' }]}> 
                        <Input placeholder="Nhập tên lead" />
                    </Form.Item>

                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }, { pattern: /^[0-9+\-\s()]+$/, message: 'Số điện thoại không hợp lệ!' }]}> 
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item name="email" label="Email" rules={[{ message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}> 
                        <Input placeholder="Nhập email" />
                    </Form.Item>

                    <Form.Item name="profileUrl" label="Link Profile" rules={[{ type: 'url', message: 'Link profile không hợp lệ!' }]}> 
                        <Input placeholder="Nhập link profile" />
                    </Form.Item>

                    <Form.Item name="note" label="Ghi chú"> 
                        <TextArea placeholder="Nhập ghi chú" rows={4} />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={createLeadMutation.isPending}>
                                Tạo Lead
                            </Button>
                            <Button onClick={handleCancel}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CreateLeadModal;
