import { getRequest, getRequestSSO, postRequest } from '..';
import { typeQueryVersionApi, urlDomainApi } from '../../configs/domainApi';

export interface ILoginFormData {
  email: string;
  password: string;
}

export interface IGetAccessCodeSSO {
  accessCode: string;
  redirectUri: string;
}

export interface IVerifyAccessToken {
  clientId: string;
  redirectUrl: string;
}

export const sendLogoutRequest = async () => {
  const response = await getRequestSSO(`v1/auth/logoutAllSessions`);
  if (response.status === 200) {
    window.location.replace(`${import.meta.env.VITE_APP_LOGOUT_SSO_URI}`);
  } else {
    throw new Error('Failed to logout!');
  }
};

export const getTokensByAccessCode = async (payload: IGetAccessCodeSSO) => {
  return await postRequest(`${urlDomainApi.url_msx_sts}/${typeQueryVersionApi.domain}/sso/get-tokens-by-access-code`, {
    ...payload,
  });
};

export const verifyAccessToken = async (payload: IVerifyAccessToken) => {
  return await postRequest(`${urlDomainApi.url_msx_sts}/${typeQueryVersionApi.domain}/sso/verify-token`, {
    ...payload,
  });
};

export const getInfoAccount = async () => {
  return await getRequest(`${urlDomainApi.url_msx_sts}/${typeQueryVersionApi.query}/account`);
};
