import { Breadcrumb } from 'antd';

const BreadcrumbNavv: React.FC = () => {
  return (
    <Breadcrumb style={{ marginBottom: 16 }}>
      <Breadcrumb.Item>
        <a href="">Dự án và sản phẩm</a>
      </Breadcrumb.Item>
      <Breadcrumb.Item>Danh sách dự án</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default BreadcrumbNavv;
