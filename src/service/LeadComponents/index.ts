import Cookies from 'js-cookie';
import { axiosInstance } from '../index';

// Interface definitions
export interface Lead {
    id: string;
    code: string;
    source: string;
    repo: string;
    config: string;
    name: string;
    phone: string;
    email: string;
    profileUrl: string;
    createdDate: string;
    note: string;
    pos: string;
  }

export const API_LEAD = {
    LEADS: '/msx-lead/api/query/v1/lead/common',};

// Fetch leads
export const fetchLeads = async (
    page: number,
    pageSize: number,
    query: string = '',
  ): Promise<{ leads: Lead[]; total: number }> => {
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }
  
      const params: any = { page, pageSize };
      if (query) params.query = query;
  
      const response = await axiosInstance.get(API_LEAD.LEADS, { params });
  
      const rows = response.data?.data?.rows;
      if (!Array.isArray(rows)) {
        console.error('Unexpected response format:', response.data);
        throw new Error('Dữ liệu không đúng định dạng');
      }
  
      const leadsData: Lead[] = rows.map((item: any) => ({
        id: item.id,
        code: item.code,
        source: item.source,
        repo: item.repo?.name,
        config: item.repo.config?.name,
        name: item.name,
        phone: item.phone,
        email: item.email || '-',
        profileUrl: item.profileUrl,
        createdDate: item.createdDate,
        note: item.note || '-',
        pos: item.pos?.name || '-',
      }));
  
      return { leads: leadsData, total: response.data?.data?.total || rows.length };
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      throw new Error(error.message || 'Không thể tải dữ liệu');
    }
  };