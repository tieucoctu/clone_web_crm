import { Breadcrumb } from 'antd';

const BreadcrumbNav: React.FC = () => {
  return (
    <Breadcrumb style={{ marginBottom: 16 }}>
      <Breadcrumb.Item>
        <a href="">Lead & customers</a>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <a href="">Quản lý khách hàng</a>
      </Breadcrumb.Item>

      <Breadcrumb.Item>Khách hàng tiềm năng cá nhân</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
