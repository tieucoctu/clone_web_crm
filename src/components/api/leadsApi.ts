import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

export interface BusinessLead {
  id?: string;
  name: string;
  shortname?: string;
  representative: string;
  phone: string;
  email?: string;
  taxCode?: string;
  customerCode?: string;
  address?: string;
  status?: 'Đã kích hoạt' | 'Chưa kích hoạt';
  leadStatus?: 'Mới' | 'Đang xử lý' | 'Đã xử lý';
  createdAt?: string;
  updatedAt?: string;
  sex?: 'male' | 'female';
}
export const fetchBusinessLead = async (): Promise<BusinessLead[]> => {
  const res = await axios.get('/api/business-leads');
  return res.data;
};

export const updateBusinessLead = async (id: string, data: BusinessLead) => {
  const res = await axios.put(`/api/business-leads/${id}`, data);
  return res.data;
};

export const deleteBusinessLead = async (id: string) => {
  const res = await axios.delete(`/api/business-leads/${id}`);
  return res.data;
};

export const createBusinessLead = async (data: BusinessLead) => {
  const response = await axios.post('/api/business-leads/batch', [data]);
  return response.data;
};
