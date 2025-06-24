import { notification } from 'antd';
import axios, { AxiosHeaders, AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { type NavigateFunction } from 'react-router-dom';
import { configs } from '../configs/domainApi';
import Cookies from 'js-cookie';
interface JwtPayload {
  exp: number; // Thời gian hết hạn của JWT
}

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
  updatedDate: string;
  note: string;
  pos: string;
}

export interface Source {
  id: string;
  name: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface Staff {
  id: string;
  name: string;
}

// API Endpoints
export const API_LEAD = {
  LEADS: '/msx-lead/api/query/v1/lead/common',
  SOURCES: '/msx-lead/api/query/v1/source/list',
  TODELIVER: 'msx-lead/api/query/v1/lead/toDeliver',
  STAFFS: '/msx-lead/api/query/v1/employee/staffs',
};

// Instance CRM
export const axiosInstance = axios.create({
  baseURL: configs.API_DOMAIN,
});

// Instance SSO
export const axiosInstanceSSO = axios.create({
  baseURL: configs.API_DOMAIN_SSO,
});

// Hiển thị lỗi
export const showNotification = (message: string, description: string) => {
  notification.error({ message, description });
};

// xử lý lỗi chung cho các request
const handleError = (error: AxiosError, navigate: NavigateFunction): Promise<AxiosError> => {
  if (!error.response) return Promise.reject(error);

  const { status } = error.response;

  switch (status) {
    case 400:
      showNotification('Bad Request', 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
      break;
    case 401:
      showNotification('Unauthorized', 'Yêu cầu xác thực không hợp lệ.');
      // window.location.replace(import.meta.env.VITE_APP_REDIRECT_URI);
      // khi nào golive mở chỗ này ra để redirect về SSO
      break;
    case 403: {
      const token = Cookies.get('access_token');
      if (token) {
        const jwt = jwtDecode<JwtPayload>(token);
        if (Date.now() / 1000 < jwt.exp) {
          showNotification('Không có quyền truy cập.', 'Xin liên hệ với admin để được cấp quyền vào chức năng này.');
          navigate('/403');
        } else {
          showNotification('Forbidden', 'Vui lòng đăng nhập lại.');
          window.location.replace(import.meta.env.VITE_APP_REDIRECT_URI);

          Cookies.remove('access_token', { domain: import.meta.env.VITE_APP_COOKIES });
          Cookies.remove('refresh_token', { domain: import.meta.env.VITE_APP_COOKIES });
        }
      }
      break;
    }
    case 404:
      showNotification('404 Not Found', 'Sai URL hoặc tài nguyên không tồn tại.');
      break;
    case 500:
      showNotification('500', 'Internal Server Error');
      break;
    case 503:
      showNotification('503', 'Service Unavailable');
      break;
    default:
      showNotification('Lỗi!', `Unexpected error: ${status}`);
      break;
  }

  return Promise.reject(error.response);
};

// Setup Interceptors
const setupInterceptors = (navigate: NavigateFunction): void => {
  // Interceptor request cho SSO
  axiosInstanceSSO.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = Cookies.get('access_token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        } as unknown as AxiosHeaders;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  // Interceptor response cho SSO
  axiosInstanceSSO.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => handleError(error, navigate),
  );

  // Interceptor request cho CRM
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = Cookies.get('access_token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        } as unknown as AxiosHeaders;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  // Interceptor response cho CRM
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => handleError(error, navigate),
  );
};

// Fetch source
export const fetchSources = async (
  page: number,
  pageSize: number,
): Promise<{ sources: Source[]; total: number }> => {
  try {
    const token = Cookies.get('access_token');
    if (!token) {
      throw new Error('No access token found. Please log in.');
    }

    const params = { page, pageSize };
    const response = await axiosInstance.get(API_LEAD.SOURCES, { params });

    const rows = response.data?.data?.rows || response.data?.data || [];
    if (!Array.isArray(rows)) {
      console.error('Unexpected sourceData format:', response.data);
      showNotification('Error', 'Dữ liệu nguồn lead không đúng định dạng.');
      return { sources: [], total: 0 };
    }

    const sources: Source[] = rows.map((item: any) => ({
      id: item.id || item._id || String(Math.random()),
      name: item.name || 'Unknown',
      createdDate: item.createdDate || item.created_at,
      updatedDate: item.updatedDate || item.updated_at,
    }));

    return {
      sources,
      total: response.data?.data?.total || rows.length,
    };
  } catch (error: any) {
    console.error('Error fetching sources:', error);
    showNotification('Error', 'Không thể tải danh sách nguồn lead.');
    return { sources: [], total: 0 };
  }
};

// Fetch leads
export const fetchLeads = async (
  page: number,
  pageSize: number,
  query: string = '',
  selectedSource?: string,
  selectedLeadType?: string,
  dateRange?: [moment.Moment | null, moment.Moment | null] | null,
): Promise<{ leads: Lead[]; total: number }> => {
  try {
    const token = Cookies.get('access_token');
    if (!token) {
      throw new Error('No access token found. Please log in.');
    }

    const params: any = { page, pageSize };
    if (query) params.query = query;
    if (selectedSource) params.source = selectedSource;
    if (selectedLeadType) params.leadType = selectedLeadType;
    if (dateRange && dateRange[0] && dateRange[1]) {
      params.startDate = dateRange[0].format('DD-MM-YYYY');
      params.endDate = dateRange[1].format('DD-MM-YYYY');
    }

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
      updatedDate: item.updatedDate,
      note: item.note || '-',
      pos: item.pos?.name || '-',
    }));

    return { leads: leadsData, total: response.data?.data?.total || rows.length };
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    throw new Error(error.message || 'Không thể tải dữ liệu');
  }
};

// Fetch to-deliver leads
export const fetchToDeliver = async (
  page: number,
  pageSize: number,
  query: string = '',
  selectedSource?: string,
  selectedLeadType?: string,
  dateRange?: [moment.Moment | null, moment.Moment | null] | null,
): Promise<{ leads: Lead[]; total: number }> => {
  try {
    const token = Cookies.get('access_token');
    if (!token) {
      throw new Error('No access token found. Please log in.');
    }

    const params: any = { page, pageSize };
    if (query) params.query = query;
    if (selectedSource) params.source = selectedSource;
    if (selectedLeadType) params.leadType = selectedLeadType;
    if (dateRange && dateRange[0] && dateRange[1]) {
      params.startDate = dateRange[0].format('DD-MM-YYYY');
      params.endDate = dateRange[1].format('DD-MM-YYYY');
    }

    const response = await axiosInstance.get(API_LEAD.TODELIVER, { params });

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
      updatedDate: item.updatedDate,
      note: item.note || '-',
      pos: item.pos?.name || '-',
      assignedStaff: item.takeCare?.name,
      assignedDate: item.assignedDate,
    }));

    return { leads: leadsData, total: response.data?.data?.total || rows.length };
  } catch (error: any) {
    console.error('Error fetching to-deliver leads:', error);
    throw new Error(error.message || 'Không thể tải dữ liệu');
  }
};

// Fetch staffs
export const fetchStaffs = async (): Promise<{ staffs: Staff[]; total: number }> => {
  try {
    const token = Cookies.get('access_token');
    if (!token) {
      throw new Error('No access token found. Please log in.');
    }

    const response = await axiosInstance.get(API_LEAD.STAFFS);

    const rows = response.data?.data?.rows || response.data?.data || [];
    if (!Array.isArray(rows)) {
      console.error('Unexpected staffData format:', response.data);
      showNotification('Error', 'Dữ liệu nhân viên không đúng định dạng.');
      return { staffs: [], total: 0 };
    }

    const staffs: Staff[] = rows.map((item: any) => ({
      id: item.id || item._id || String(Math.random()),
      name: item.name || 'Unknown',
    }));

    return {
      staffs,
      total: response.data?.data?.total || rows.length,
    };
  } catch (error: any) {
    console.error('Error fetching staffs:', error);
    showNotification('Error', 'Không thể tải danh sách nhân viên.');
    return { staffs: [], total: 0 };
  }
};

// Assign lead to staff
export const assignLead = async (leadIds: string[], staffId: string): Promise<void> => {
  try {
    const token = Cookies.get('access_token');
    if (!token) {
      throw new Error('No access token found. Please log in.');
    }

    await axiosInstance.post('/msx-lead/api/command/v1/lead/assign', {
      leadIds,
      staffId,
    });
  } catch (error: any) {
    console.error('Error assigning lead:', error);
    throw new Error(error.message || 'Không thể phân bổ lead.');
  }
};

// Unassign lead
export const unassignLead = async (leadId: string): Promise<void> => {
  try {
    const token = Cookies.get('access_token');
    if (!token) {
      throw new Error('No access token found. Please log in.');
    }

    await axiosInstance.post('/msx-lead/api/command/v1/lead/unassign', {
      leadId,
    });
  } catch (error: any) {
    console.error('Error unassigning lead:', error);
    throw new Error(error.message || 'Không thể gỡ phân bổ lead.');
  }
};

// Định nghĩa các hàm request
export const getRequest = async <T>(url: string, params?: T): Promise<AxiosResponse> => {
  return axiosInstance.get(url, { params });
};

export const patchRequest = async <T>(url: string, params?: T): Promise<AxiosResponse> => {
  return axiosInstance.patch(url, params);
};

export const putRequest = async <T>(url: string, params?: T): Promise<AxiosResponse> => {
  return axiosInstance.put(url, params);
};

export const deleteRequest = async <T>(url: string, params?: T): Promise<AxiosResponse> => {
  return axiosInstance.delete(url, { data: params } as AxiosRequestConfig);
};

export const postRequest = async <T>(url: string, params?: T, headers?: AxiosHeaders): Promise<AxiosResponse> => {
  return axiosInstance.post(url, params, { headers });
};

export const getRequestSSO = async <T>(url: string, params?: T): Promise<AxiosResponse> => {
  return axiosInstanceSSO.get(url, { params });
};

export default setupInterceptors;
