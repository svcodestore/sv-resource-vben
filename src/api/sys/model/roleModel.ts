import { BaseFields } from '/@/api/model/baseModel';

export type Role = {
  pid: string;
  applicationId: string;
  code: string;
  name: string;
  isGroup: boolean;
} & BaseFields;

export type RoleMenu = {
  roleId: string;
  menuId: string;
} & BaseFields;

export type RoleUser = {
  roleId: string;
  userId: string;
} & BaseFields;
