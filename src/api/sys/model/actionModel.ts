import { BaseFields } from '/@/api/model/baseModel';

export type Action = {
  applicationId: string;
  code: string;
  name: string;
} & BaseFields;

export type ActionMenu = {
  actionId: string;
  menuId: string;
} & BaseFields;
