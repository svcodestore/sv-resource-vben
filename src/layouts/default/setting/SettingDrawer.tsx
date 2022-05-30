import { defineComponent, unref } from 'vue';
import { BasicDrawer } from '/@/components/Drawer/index';
import { Divider } from 'ant-design-vue';

import { AppDarkModeToggle } from '/@/components/Application';

import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export default defineComponent({
  name: 'SettingDrawer',
  setup(_, { attrs }) {
    const { getShowDarkModeToggle } = useRootSetting();

    return () => (
      <BasicDrawer
        {...attrs}
        title={t('layout.setting.drawerTitle')}
        width={330}
        class="setting-drawer"
      >
        {unref(getShowDarkModeToggle) && <Divider>{() => t('layout.setting.darkMode')}</Divider>}
        {unref(getShowDarkModeToggle) && <AppDarkModeToggle class="mx-auto" />}
      </BasicDrawer>
    );
  },
});
