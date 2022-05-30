import type { App } from 'vue';
import { Button } from './Button';
import { Input, Layout } from 'ant-design-vue';

import 'xe-utils';
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';

import { BasicGrid } from './Grid';

import { i18n } from '/@/locales/setupI18n';

VXETable.setup({
  i18n: (key, args) => i18n.global.t(key, args),
});
VXETable.interceptor.add('event.clearActived', ({ $event }) => {
  // 比如点击了某个组件的弹出层面板之后，此时被激活单元格不应该被自动关闭，通过返回 false 可以阻止默认的行为。
  for (const el of $event.path) {
    if (el.className && el.className.indexOf) {
      if (
        ['ant-select-dropdown', 'ant-popover'].some(
          (className) => el.className.indexOf(className) > -1,
        )
      ) {
        return false;
      }
    }
  }
});

export function registerGlobComp(app: App) {
  app.use(Input).use(Button).use(Layout).use(VXETable).use(BasicGrid);
}
