import { notification } from 'antd';
import axios, { AxiosHeaders, AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { type NavigateFunction } from 'react-router-dom';
import { configs } from '../configs/domainApi';
import Cookies from 'js-cookie';
interface JwtPayload {
  exp: number; // Thời gian hết hạn của JWT
}

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
