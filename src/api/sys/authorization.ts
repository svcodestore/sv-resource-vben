import { Menu } from './model/menuModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  getAuthMenuList = '/authorization/user-menus',
}

export const getAuthMenuList = (applicationId: string, userId: string) => {
  return defHttp.get<Menu[]>({ url: Api.getAuthMenuList, params: { applicationId, userId } });
};
