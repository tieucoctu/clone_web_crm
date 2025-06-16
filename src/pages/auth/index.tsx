/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query';
import { Flex, Spin } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getTokensByAccessCode, IGetAccessCodeSSO } from '../../service/clients/auth.service';
import './style.scss';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { DASH_BOARD } from '../../configs/path';

interface Props {}

const LoginPage: React.FC<Props> = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const accessToken = Cookies.get('access_token');

  // const [isLoged, setLogin] = useState<boolean>(false);

  const handleLoginAccount = useMutation({
    mutationFn: (data: IGetAccessCodeSSO) => getTokensByAccessCode(data),
    onSuccess: (accountData: any) => {
      const {
        data: { data },
      } = accountData;
      if (accountData.status === 200) {
        if (!data.accessToken) return;
        Cookies.set('access_token', data.accessToken, { domain: `${import.meta.env.VITE_APP_COOKIES}` });
        Cookies.set('refresh_token', data.refreshToken, { domain: `${import.meta.env.VITE_APP_COOKIES}` });
        navigate(DASH_BOARD);
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError: (_error: any) => {
      window.location.replace(`${import.meta.env.VITE_APP_REDIRECT_URI}`);
    },
  });

  // Xu ly call detail user - check roles.
  // const { data } = useFetch({
  //   queryKeyArr: ['get-account-data', isLoged],
  //   api: isLoged ? getUserProfile : () => null,
  //   // moreParams: { search: search, ...pageCurrent },
  // });
  // console.log('data user', isLoged, isLoged);

  useEffect(() => {
    if (accessToken) {
      navigate(DASH_BOARD);
    } else {
      if (!code) {
        window.location.replace(`${import.meta.env.VITE_APP_REDIRECT_URI}`);
      } else {
        handleLoginAccount.mutate({
          accessCode: code ? code : '',
          redirectUri: `${import.meta.env.VITE_APP_URI_LOCAL}`,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="login-page">
      <div className="login-container__content">
        <Flex align="center" gap="middle" justify={'center'} className={'box-login-sso'} vertical>
          <Flex gap="small">
            <Spin size="large"></Spin>
          </Flex>
        </Flex>
      </div>
    </div>
  );
};

export default LoginPage;
