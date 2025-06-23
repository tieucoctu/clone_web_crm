export const configs = {
  API_DOMAIN: import.meta.env.VITE_API_BASE_URL,
  API_DOMAIN_SSO: import.meta.env.VITE_API_SSO,
};
export const typeQueryVersionApi = {
  query: 'api/query/v1',
  domain: 'api/domain/v1',
  query_v2: 'api/query/v2',
  api_v2: 'api/v2',
  api_v1: 'api/v1',
};

export const urlDomainApi = {
  url_sts: 'sts',
  url_msx_sts: 'msx-sts',
  msx_customer: 'msx-customer',
  msx_orgChart: 'msx-orgchart',
  msx_employee: 'msx-employee',
  msx_property: 'msx-property',
  msx_uploader: 'msx-uploader',
  url_masterData: 'msx-masterdata-api',
  msx_demand: 'msx-demand',
  msx_lead: 'msx-lead',
  msx_masterdata_producer: 'msx-masterdata-producer',
  msx_commission: 'msx-commission',
  msx_primary_contract: 'msx-primary-contract',
  msx_partner_gateway: 'msx-partner-gateway',
  msx_transaction: 'msx-transaction',
  msx_e_voucher: 'msx-e-voucher',
  msx_training: 'msx-training',
  msx_payment: 'msx-payment',
};
