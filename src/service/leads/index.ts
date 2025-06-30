import { getRequest, postRequest } from '..';
import { typeQueryVersionApi, urlDomainApi } from '../../configs/domainApi';
import { ICreateLead } from '../../types/roles';

export const getListOfLeads = async (params: ICreateLead) => {
  return await getRequest(`${urlDomainApi.msx_lead}/${typeQueryVersionApi.query}/lead/common`, params);
};

export const getListOfLeadsSource = async (params: ICreateLead) => {
  return await getRequest(`${urlDomainApi.msx_lead}/${typeQueryVersionApi.query}/source/list`, params);
};

export const getListOfLeadsRepo = async (params: ICreateLead) => {
  return await getRequest(`${urlDomainApi.msx_lead}/${typeQueryVersionApi.query}/lead-repo`, params);
};

export const getLeadRepoConfigs = async (repoId: string) => {
  return await getRequest(`${urlDomainApi.msx_lead}/${typeQueryVersionApi.query}/lead-repo/${repoId}`);
};

export const createLead = async (params: ICreateLead) => {
  return await postRequest(`${urlDomainApi.msx_lead}/${typeQueryVersionApi.domain}/lead/common`, params);
};
