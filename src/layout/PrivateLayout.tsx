import { useQuery } from '@tanstack/react-query';
import { Layout } from 'antd';
import Cookies from 'js-cookie';
import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePage } from '../context/PageContext';
import { getInfoAccount } from '../service/clients/auth.service';
import './PrivateLayout.scss';

const { Content } = Layout;

interface Props {
  children: React.JSX.Element | React.JSX.Element[];
}

const PrivateLayout: React.FC<Props> = ({ children }) => {
  const { setOpenSideBar } = usePage();
  const navigate = useNavigate();
  const token: string = Cookies.get('access_token') || '';
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const { data } = useQuery<any>({
    queryKey: ['info-account'],
    queryFn: getInfoAccount,
  });

  const dataAccount = data?.data?.data;

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setOpenSideBar(false);
      }
    },
    [setOpenSideBar],
  );
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
    if (dataAccount) {
      sessionStorage.setItem('dataAccount', JSON.stringify(dataAccount));
    }
  }, [dataAccount, navigate, token]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);
  return (
    <Layout hasSider style={{ minHeight: '100vh', minWidth: '100vw', position: 'relative', overflow: 'hidden' }}>
      <Content className="content">
        <>{children}</>
      </Content>
    </Layout>
  );
};

export default PrivateLayout;
