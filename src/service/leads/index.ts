import { getRequest, postRequest } from '..';
import { typeQueryVersionApi, urlDomainApi } from '../../configs/domainApi';
import { IFilterRole } from '../../types/roles';

export const getListOfLeads = async (params: IFilterRole) => {
  return await getRequest(`${urlDomainApi.msx_lead}/${typeQueryVersionApi.query}/lead/common`, params);
};

export const getListOfLeadsSource = async (params: IFilterRole) => {
  return await getRequest(`${urlDomainApi.msx_lead}/${typeQueryVersionApi.query}/source/list`, params);
};

export const getListOfLeadsRepo = async (params: IFilterRole) => {
  return await getRequest(`${urlDomainApi.msx_lead}/${typeQueryVersionApi.query}/lead-repo`, params);
};

export const getLeadRepoConfigs = async (repoId: string) => {
  return await getRequest(`${urlDomainApi.msx_lead}/${typeQueryVersionApi.query}/lead-repo/${repoId}`);
};

export const createLead = async (params: any) => {
  return await postRequest(`${urlDomainApi.msx_lead}/${typeQueryVersionApi.domain}/lead/common`, params);
};
