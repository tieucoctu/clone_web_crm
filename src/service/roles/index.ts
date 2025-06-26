import { getRequest } from '..';
import { typeQueryVersionApi, urlDomainApi } from '../../configs/domainApi';
import { IFilterRole } from '../../types/roles';

export const getListOfRoles = async (params: IFilterRole) => {
  return await getRequest(`${urlDomainApi.url_msx_sts}/${typeQueryVersionApi.query}/role`, params);
};
