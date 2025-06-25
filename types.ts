export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  taxCode?: string;
  customerCode?: string;
  status?: 'Đã kích hoạt' | 'Chưa kích hoạt';
  leadStatus?: 'Mới' | 'Đang xử lý' | 'Đã xử lý';
  createdAt?: string;
  shortname?: string;
  representative?: string;
  address?: string;
  updatedAt?: string;
  sex?: 'male' | 'female';
}
