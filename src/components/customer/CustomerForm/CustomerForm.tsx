import { useEffect } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import type { BusinessLead } from '../../api/leadsApi';
import './CustomerForm.scss';
interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: BusinessLead) => void;
  initialValues?: BusinessLead;
}

const CustomerForm: React.FC<Props> = ({ visible, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) form.setFieldsValue(initialValues);
    else form.resetFields();
  }, [visible, initialValues, form]);

  const handleFinish = (values: BusinessLead) => {
    const finalData = initialValues?.id ? { ...values, id: initialValues.id } : values;
    onSubmit(finalData);
    form.resetFields();
  };

  return (
    <Modal
      title={initialValues ? 'Cập nhật khách hàng' : 'Tạo nguồn doanh thu khách hàng mới'}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <div className="add" />
      <div className="add-form">
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <div className="add-form-page">
            <div>
              <Form.Item name="name" label="Tên công ty">
                <Input placeholder="Nhập tên công ty" />
              </Form.Item>
              <Form.Item name="phone" label="Số điện thoại">
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </div>
            <div>
              <Form.Item name="shortname" label="Tên ngắn">
                <Input placeholder="Nhập tên ngắn" />
              </Form.Item>
              <Form.Item name="representative" label="Người đại diện">
                <Input placeholder="Nhập người đại diện" />
              </Form.Item>
            </div>
          </div>
          <div className="add-new">
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {initialValues ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default CustomerForm;
