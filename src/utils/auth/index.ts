import { Persistent, BasicKeys } from '/@/utils/cache/persistent';
import { CacheTypeEnum } from '/@/enums/cacheEnum';
import projectSetting from '/@/settings/projectSetting';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '/@/enums/cacheEnum';
import { useAppStoreWithOut } from '/@/store/modules/app';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

export function getAccessToken() {
  return getAuthCache(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return getAuthCache(REFRESH_TOKEN_KEY);
}

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setAuthCache(key: BasicKeys, value) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}

export function clearAuthCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
  return fn(immediate);
}

export function goSsoLogin() {
  const appStore = useAppStoreWithOut();
  const authPath = appStore.getLoginUris;
  const clientId = appStore.getClientId;
  const callbackPath = appStore.getRedirectUris;

  if (!authPath || !clientId || !callbackPath) {
    return;
  }

  const authSearchParams = new URLSearchParams();
  authSearchParams.append('response_type', 'code');
  authSearchParams.append('client_id', clientId);
  authSearchParams.append('redirect_uri', callbackPath);
  authSearchParams.append('scope', 'read');
  const authHref = authPath + authSearchParams.toString();
  window.location.href = authHref;
}
