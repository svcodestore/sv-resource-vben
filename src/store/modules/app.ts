import { APP_ID } from './../../enums/cacheEnum';
import type {
  ProjectConfig,
  HeaderSetting,
  MenuSetting,
  TransitionSetting,
  MultiTabsSetting,
} from '/#/config';
import type { BeforeMiniState } from '/#/store';

import { defineStore } from 'pinia';
import { store } from '/@/store';

import { ThemeEnum } from '/@/enums/appEnum';
import {
  APP_DARK_MODE_KEY_,
  CLIENT_ID,
  PROJ_CFG_KEY,
  REDIRECT_URIS,
  LOGIN_URIS,
} from '/@/enums/cacheEnum';
import { Persistent } from '/@/utils/cache/persistent';
import { darkMode } from '/@/settings/designSetting';
import { resetRouter } from '/@/router';
import { deepMerge } from '/@/utils';
import { getAuthCache, setAuthCache } from '/@/utils/auth';

import { getCurrentAppliction } from '/@/api/sys/app';

interface AppState {
  darkMode?: ThemeEnum;
  // Page loading status
  pageLoading: boolean;
  // project config
  projectConfig: ProjectConfig | null;
  // When the window shrinks, remember some states, and restore these states when the window is restored
  beforeMiniInfo: BeforeMiniState;
  id?: Nullable<string>;
  clientId?: Nullable<string>;
  redirectUris?: Nullable<string>;
  loginUris?: Nullable<string>;
}
let timeId: TimeoutHandle;
export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    darkMode: undefined,
    pageLoading: false,
    projectConfig: Persistent.getLocal(PROJ_CFG_KEY),
    beforeMiniInfo: {},
    id: undefined,
    clientId: undefined,
    redirectUris: undefined,
    loginUris: undefined,
  }),
  getters: {
    getPageLoading(): boolean {
      return this.pageLoading;
    },
    getDarkMode(): 'light' | 'dark' | string {
      return this.darkMode || localStorage.getItem(APP_DARK_MODE_KEY_) || darkMode;
    },

    getBeforeMiniInfo(): BeforeMiniState {
      return this.beforeMiniInfo;
    },

    getProjectConfig(): ProjectConfig {
      return this.projectConfig || ({} as ProjectConfig);
    },

    getHeaderSetting(): HeaderSetting {
      return this.getProjectConfig.headerSetting;
    },
    getMenuSetting(): MenuSetting {
      return this.getProjectConfig.menuSetting;
    },
    getTransitionSetting(): TransitionSetting {
      return this.getProjectConfig.transitionSetting;
    },
    getMultiTabsSetting(): MultiTabsSetting {
      return this.getProjectConfig.multiTabsSetting;
    },
    getId(): string {
      return this.id || getAuthCache(APP_ID);
    },
    getClientId(): string {
      return this.clientId || getAuthCache(CLIENT_ID);
    },
    getRedirectUris(): string {
      return this.redirectUris || getAuthCache(REDIRECT_URIS);
    },
    getLoginUris(): string {
      return this.loginUris || getAuthCache(LOGIN_URIS);
    },
  },
  actions: {
    setPageLoading(loading: boolean): void {
      this.pageLoading = loading;
    },

    setDarkMode(mode: ThemeEnum): void {
      this.darkMode = mode;
      localStorage.setItem(APP_DARK_MODE_KEY_, mode);
    },

    setBeforeMiniInfo(state: BeforeMiniState): void {
      this.beforeMiniInfo = state;
    },

    setProjectConfig(config: DeepPartial<ProjectConfig>): void {
      this.projectConfig = deepMerge(this.projectConfig || {}, config);
      Persistent.setLocal(PROJ_CFG_KEY, this.projectConfig);
    },

    async resetAllState() {
      resetRouter();
      Persistent.clearAll();
    },
    async setPageLoadingAction(loading: boolean): Promise<void> {
      if (loading) {
        clearTimeout(timeId);
        // Prevent flicker
        timeId = setTimeout(() => {
          this.setPageLoading(loading);
        }, 50);
      } else {
        this.setPageLoading(loading);
        clearTimeout(timeId);
      }
    },
    setId(id?: Nullable<string>) {
      this.id = id;
      setAuthCache(APP_ID, id);
    },
    setClientId(id?: Nullable<string>) {
      this.clientId = id;
      setAuthCache(CLIENT_ID, id);
    },
    setRedirectUris(uris?: Nullable<string>) {
      this.redirectUris = uris;
      setAuthCache(REDIRECT_URIS, uris);
    },
    setLoginUris(uris?: Nullable<string>) {
      this.loginUris = uris;
      setAuthCache(LOGIN_URIS, uris);
    },
    async initCurrentApplication() {
      const app = await getCurrentAppliction();

      this.setId(app.id);
      this.setClientId(app.clientId);
      this.setRedirectUris(app.redirectUris);
      this.setLoginUris(app.loginUris);
    },
  },
});

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store);
}
