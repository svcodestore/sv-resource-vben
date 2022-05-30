import { Action, ActionMenu } from './model/actionModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  getActionList = '/actions',
  saveActionOperations = '/actions/batch',
  getActionMenuList = '/action-menus',
  saveActionMenuOperations = '/action-menus/batch',
}

export const getActionList = (applicationId: string) => {
  return defHttp.get<Action[]>({ url: Api.getActionList, params: { applicationId } });
};

export const saveActionOperations = (data) => {
  return defHttp.post({
    url: Api.saveActionOperations,
    data,
  });
};

export const getActionMenuList = (applicationId: string) => {
  return defHttp.get<ActionMenu[]>({ url: Api.getActionMenuList, params: { applicationId } });
};

export const saveActionMenuOperations = (data) => {
  return defHttp.post({
    url: Api.saveActionMenuOperations,
    data,
  });
};
