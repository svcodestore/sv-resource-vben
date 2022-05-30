import type { AppRouteModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';

export const authenticationRoutes: AppRouteModule = {
  path: '/callback',
  name: 'Callback',
  component: () => import('/@/views/auth/Authentication.vue'),
  meta: {
    title: t('auth.authentication'),
  },
};
