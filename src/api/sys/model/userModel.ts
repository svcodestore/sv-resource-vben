import { BaseFields } from '/@/api/model/baseModel';

export interface LoginParams {
  username: string;
  password: string;
}

export type RoleUserAction = {
  roleUserId: string;
  actionId: string;
} & BaseFields;
