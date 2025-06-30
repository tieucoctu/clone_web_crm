export interface IFilterRole {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

export interface ICreateLead {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  sourceId?: string;
  leadType?: string;
  leadStatus?: string;
  leadSource?: string;
  leadRepo?: string;
}