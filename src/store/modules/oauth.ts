import { defineStore } from 'pinia';
import { store } from '/@/store';
import { getAccessToken } from '/@/api/sys/oauth';
import { useUserStore } from '/@/store/modules/user';
import { goSsoLogin } from '/@/utils/auth';

type OauthState = {};
const userStore = useUserStore();

export const useOauthStore = defineStore({
  id: 'app-oauth',
  state: (): OauthState => ({}),
  actions: {
    async getToken(clientId: string, code: string, redirectUri: string) {
      const res = await getAccessToken({
        grant_type: 'authorization_code',
        client_id: clientId,
        code,
        redirect_uri: redirectUri,
      });

      if (res.code === 0) {
        userStore.setAccessToken(res.data?.accessToken || void 0);
        userStore.setRefreshToken(res.data?.refreshToken || void 0);
        userStore.setUserInfo(res.data?.user || null);
      }

      return { code: res.code, message: res.message };
    },
    login() {
      goSsoLogin();
    },
  },
});

export function useOauthStoreWithOut() {
  return useOauthStore(store);
}
