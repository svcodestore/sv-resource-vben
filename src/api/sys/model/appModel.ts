import { BaseFields } from '/@/api/model/baseModel';

export type Application = {
  code: string;
  name: string;
  internalUrl: string;
  homepageUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUris: string;
  loginUris: string;
  tokenFormat: string;
} & BaseFields;
