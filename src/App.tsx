import { useState } from 'react';
import { ConfigProvider, App as ConfigApp } from 'antd';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import viVN from 'antd/locale/vi_VN';
import './App.css';
import { PageProvider } from './context/PageContext';
import InjectAxiosInterceptors from './service/InjectAxiosInterceptors';
import { BrowserRouter } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { optionsTheme } from './configs/optionTheme';
import AppRouter from './AppRouter';

function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 2,
            staleTime: Infinity,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={viVN} theme={{ token: optionsTheme }}>
        <BrowserRouter>
          <AuthProvider>
            <PageProvider>
              <ConfigApp>
                <InjectAxiosInterceptors />
                <AppRouter />
                <ReactQueryDevtools initialIsOpen={false} />
              </ConfigApp>
            </PageProvider>
          </AuthProvider>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
