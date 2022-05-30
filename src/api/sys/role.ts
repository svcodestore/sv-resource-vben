import { Role, RoleMenu, RoleUser } from './model/roleModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  getRoleList = '/roles',
  saveRoleOperations = '/roles/batch',
  getRoleMenuList = '/role-menus',
  saveRoleMenuOperations = '/role-menus/batch',
  getRoleUserList = '/role-users',
  saveRoleUserOperations = '/role-users/batch',
}

export const getRoleList = (applicationId: string) => {
  return defHttp.get<Role[]>({ url: Api.getRoleList, params: { applicationId } });
};

export const saveRoleOperations = (data) => {
  return defHttp.post({
    url: Api.saveRoleOperations,
    data,
  });
};

export const getRoleMenuList = (applicationId: string) => {
  return defHttp.get<RoleMenu[]>({ url: Api.getRoleMenuList, params: { applicationId } });
};

export const saveRoleMenuOperations = (data) => {
  return defHttp.post({
    url: Api.saveRoleMenuOperations,
    data,
  });
};

export const getRoleUserList = (applicationId: string) => {
  return defHttp.get<RoleUser[]>({ url: Api.getRoleUserList, params: { applicationId } });
};

export const saveRoleUserOperations = (data) => {
  return defHttp.post({
    url: Api.saveRoleUserOperations,
    data,
  });
};
