import type { UserInfo } from '/#/store';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { ROLES_KEY, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache, goSsoLogin } from '/@/utils/auth';
import { doLogout, getCurrentUser } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { h } from 'vue';

interface UserState {
  userInfo: Nullable<UserInfo>;
  accessToken?: string;
  refreshToken?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    accessToken: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getAccessToken(): string {
      return this.accessToken || getAuthCache<string>(ACCESS_TOKEN_KEY);
    },
    getRefreshToken(): string {
      return this.refreshToken || getAuthCache<string>(REFRESH_TOKEN_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
  },
  actions: {
    setAccessToken(info: string | undefined) {
      this.accessToken = info ? info : ''; // for null or undefined value
      setAuthCache(ACCESS_TOKEN_KEY, info);
    },
    setRefreshToken(info: string | undefined) {
      this.refreshToken = info ? info : ''; // for null or undefined value
      setAuthCache(REFRESH_TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.accessToken = '';
      this.refreshToken = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    async initCurrentUser() {
      const user = await getCurrentUser();
      this.setUserInfo(user);
    },
    async logout(goLogin = false) {
      if (this.getAccessToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setAccessToken(undefined);
      this.setRefreshToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      if (goLogin) {
        goSsoLogin();
      }
    },
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
