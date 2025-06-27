import React from 'react';
import { Modal, Select, DatePicker, Button, Space, Form, message } from 'antd';
import { getListOfLeadsSource } from '../../../service/leads';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_PARAMS } from '../../../contanst';

const { Option } = Select;

const FilterOfLead: React.FC = () => {
    const [form] = Form.useForm();
    const [isVisible, setIsVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const showModal = () => setIsVisible(true);
    const handleCancel = () => {
        setIsVisible(false);
        form.resetFields();
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Đang nghiên cứu
        } catch (error) {
            message.error('Có lỗi xảy ra khi lọc!');
        } finally {
            setLoading(false);
        }
    };

    const { data: leadSources } = useQuery({
        queryFn: () => getListOfLeadsSource(DEFAULT_PARAMS),
        queryKey: ['list-of-leads-source'],
        staleTime: 1000 * 60 * 5,
    });
    const sourcesList = leadSources?.data?.data?.rows || [];

    return (
        <div>
            <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
                Bộ lọc
            </Button>
        <Modal title="Bộ lọc" open={isVisible} onCancel={handleCancel} footer={null}>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="sourceId" label="Nguồn Lead" rules={[{ message: 'Vui lòng chọn nguồn lead!' }]}> 
                        <Select placeholder="Chọn nguồn lead">
                            {sourcesList.map((source: any) => (
                                <Option key={source.id} value={source.id}>
                                    {source.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                <Form.Item label="Loại Lead" name="leadType">
                    <Select placeholder="Chọn loại lead">
                        <Option value="1">Lead thường</Option>
                        <Option value="2">Lead hot</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="dateRange" label="Ngày tạo">
                    <DatePicker.RangePicker />
                </Form.Item>
                <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Lọc
                            </Button>
                            <Button onClick={handleCancel}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
            </Form>
        </Modal>
        </div>
    );
};

export default FilterOfLead;