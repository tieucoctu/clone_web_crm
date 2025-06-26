import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import setupInterceptors, { showNotification } from '../index';
import { fetchLeads, Lead } from './index';

export function LeadTable() {
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 10,
      total: 0,
    });
  
    useEffect(() => {
      setupInterceptors(navigate);
    }, [navigate]);
  
    const token = Cookies.get('access_token');
    if (!token) {
      showNotification('Error', 'Vui lòng đăng nhập.');
      navigate('/login');
    }
  
    const { data: leadsData, isLoading: isLeadsLoading, error: leadsError } = useQuery<
      { leads: Lead[]; total: number },
      Error
    >({
      queryKey: ['leads', pagination.current, pagination.pageSize],
      queryFn: () => fetchLeads(pagination.current, pagination.pageSize),
      enabled: !!token,
      staleTime: 1000 * 60 * 5,
      refetchInterval: 1000 * 60 * 5,
    });
  
    useEffect(() => {
      if (leadsData?.total) {
        setPagination((prev) => ({ ...prev, total: leadsData.total }));
      }
    }, [leadsData]);
  
    const handleTableChange = (pagination: any) => {
      setPagination({ current: pagination.current, pageSize: pagination.pageSize, total: pagination.total });
    };
  
    return {
      pagination,
      setPagination,
      leadsData,
      isLeadsLoading,
      leadsError,
      handleTableChange,
    };
  }