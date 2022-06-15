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

type HomePath = {
  applicationId: string;
  path: string;
};
export type User = {
  id: string;
  uuid: string;
  loginId: string;
  password: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  gender: number;
  homePath: HomePath;
  lang: string;
  status: boolean;
} & ModificationFields;

export type BaseFields = {
  id: string;
  status: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
};
