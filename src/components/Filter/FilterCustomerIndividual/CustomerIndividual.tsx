import { Form, Select, DatePicker, Button, Space } from 'antd';
import './CustomerIndividual.scss';
interface Props {
  onFilter: (values: any) => void;
  onClear: () => void;
  initialValues?: any;
}

const { RangePicker } = DatePicker;

const CustomerIndividual: React.FC<Props> = ({ onFilter, onClear, initialValues }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onFilter(values);
  };

  const handleReset = () => {
    form.resetFields();
    onClear();
  };

  return (
    <div className="Filter-menu">
      <Form layout="vertical" form={form} onFinish={handleFinish} initialValues={initialValues}>
        <div className="Filter-menu-Individual">
          <Form.Item name="status" label="Người tạo">
            <Select placeholder="Chọn nhân viên" allowClear></Select>
          </Form.Item>
          <Form.Item name="status" label="Trạng thái hoạt động">
            <Select placeholder="Chọn trạng thái" allowClear>
              <Select.Option value="Đã kích hoạt">Đã kích hoạt</Select.Option>
              <Select.Option value="Vô hiệu hóa">Vô hiệu hóa</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="leadStatus" label="Trạng thái KHTN">
            <Select placeholder="Chọn trạng thái KHTN" allowClear>
              <Select.Option value="Mới">Mới</Select.Option>
              <Select.Option value="Đang giao dịch">Đang giao dịch</Select.Option>
              <Select.Option value="KHCT">KHCT</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Thời gian tạo">
            <Space>
              <Form.Item name="from" noStyle>
                <DatePicker placeholder="Từ ngày" />
              </Form.Item>
              <Form.Item name="to" noStyle>
                <DatePicker placeholder="Đến ngày" />
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item>
            <Space style={{ justifyContent: 'end', width: '100%' }}>
              <Button onClick={handleReset}>Xoá bộ lọc</Button>
              <Button type="primary" htmlType="submit">
                Tìm kiếm
              </Button>
            </Space>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default CustomerIndividual;
