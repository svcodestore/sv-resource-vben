import { RoleUserAction } from './model/userModel';
import { User } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Logout = '/logout',
  CurrentUser = '/user/current-user',
  Users = '/users',
  getUserActionList = '/user-actions',
  saveUserActionOperations = '/user-actions/batch',
}

export function doLogout() {
  return defHttp.post({ url: Api.Logout });
}

export function getCurrentUser() {
  return defHttp.get<User>({ url: Api.CurrentUser });
}

export function getUserList(applicationId: string) {
  return defHttp.get<User[]>({ url: Api.Users, params: { applicationId } });
}

export function getUserActionList(applicationId: string) {
  return defHttp.get<RoleUserAction[]>({ url: Api.getUserActionList, params: { applicationId } });
}

export const saveUserActionOperations = (data) => {
  return defHttp.post({
    url: Api.saveUserActionOperations,
    data,
  });
};
