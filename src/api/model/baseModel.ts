export interface BasicPageParams {
  page: number;
  pageSize: number;
}

export interface BasicFetchResult<T> {
  data: T[];
  code: number;
  message: string;
}

export type ModificationFields = {
  createdAt: string;
  updatedAt: string;
};

export type User = {
  uuid: string;
  loginId: string;
  password: string;
  name: string;
  phone: string;
  email: string;
  lang: string;
} & BaseFields;

export type BaseFields = {
  id: string;
  status: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
};
