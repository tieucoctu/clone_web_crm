import { useEffect } from 'react';
import { Button, Form, Input, Modal, Radio } from 'antd';
import type { BusinessLead } from '../../api/leadsApi';
import './CustomerForm.scss';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: BusinessLead) => void;
  initialValues?: BusinessLead;
}

const CustomerFormIndividual: React.FC<Props> = ({ visible, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
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
      <div className="add-individual" />
      <div className="add-form-individual">
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <div className="form-individual">
            <div className="form-individual-personal-imformation">
              <Form.Item
                required={false}
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>

              <Form.Item
                required={false}
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </div>

            <Form.Item
              required={false}
              name="sex"
              label="Giới tính"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
            >
              <Radio.Group>
                <Radio value="male">Nam</Radio>
                <Radio value="female">Nữ</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <div className="add-new-individual">
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

export default CustomerFormIndividual;
