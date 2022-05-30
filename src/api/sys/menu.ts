import { Menu } from './model/menuModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  getMenuList = '/menus',
  saveMenuOperations = '/menus/batch',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = (applicationId: string) => {
  return defHttp.get<Menu[]>({ url: Api.getMenuList, params: { applicationId } });
};

export const saveMenuOperations = (data) => {
  return defHttp.post({
    url: Api.saveMenuOperations,
    data,
  });
};
