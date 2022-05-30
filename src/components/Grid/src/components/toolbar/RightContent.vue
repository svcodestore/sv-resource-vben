<template>
  <Space>
    <span>
      {{ visibleData.length }}
    </span>
    <Space>
      <ClickOutSide @click-outside="handleClickOutSide">
        <Input
          class="bg-transparent"
          style="width: 120px; box-shadow: none; border-left: 0; border-right: 0; border-top: 0"
          :placeholder="t('component.grid.search')"
          v-model:value="filterStr"
          v-if="isShowFilterInput"
          @change="emit('search', filterStr)"
        />
      </ClickOutSide>
      <Button
        shape="circle"
        :title="t('component.grid.search')"
        @click="isShowFilterInput = !isShowFilterInput"
      >
        <SearchOutlined />
      </Button>
    </Space>
    <Button
      shape="circle"
      :title="isFullscreen ? t('component.grid.fullscreenExit') : t('component.grid.fullscreen')"
      @click="
        isFullscreen = !isFullscreen;
        grid?.zoom();
      "
    >
      <ExpandOutlined v-if="!isFullscreen" />
      <CompressOutlined v-else />
    </Button>
    <vxe-pulldown ref="xDown">
      <template #default>
        <Button shape="circle" :title="t('component.grid.visbCol')" @click="xDown.showPanel()">
          <MenuOutlined />
        </Button>
      </template>
      <template #dropdown>
        <div class="overflow-auto min-w-110px w-150px absolute right-0 bg-white-500/50">
          <div class="flex justify-between">
            {{ t('component.grid.simpCol') }}
            <Switch v-model:checked="isSimplicityColumns" @change="onSimplicityColumnsChange" />
          </div>
          <hr />
          <Tree
            v-model:selectedKeys="selectedVisibleColKeys"
            v-model:checkedKeys="checkedVisibleColKeys"
            v-model:expandedKeys="expandedVisibleColTreeKeys"
            auto-expand-parent
            checkable
            :tree-data="treeColData"
            :height="233"
            @check="onVisibleColumnCheck"
          />
        </div>
      </template>
    </vxe-pulldown>
    <Dropdown :trigger="['click']" placement="bottomRight">
      <Button shape="circle" :title="t('component.grid.more')">
        <MoreOutlined />
      </Button>
      <template #overlay>
        <Menu>
          <MenuItem key="print" @click="openPrint({})">
            <PrinterOutlined /> {{ t('component.grid.printContent') }}
          </MenuItem>
          <SubMenu key="export">
            <template #title> <ExportOutlined /> {{ t('component.grid.exportData') }} </template>
            <MenuItem key="excel" @click="exportAsExcel">
              <FileExcelOutlined /> {{ t('component.grid.excelExt') }}
            </MenuItem>
            <MenuItem key="wps" @click="exportAsWps">
              <FileExcelOutlined /> {{ t('component.grid.wpsExt') }}
            </MenuItem>
            <MenuItem key="more" @click="openExport({})">
              <EllipsisOutlined /> {{ t('component.grid.moreExt') }}
            </MenuItem>
          </SubMenu>
        </Menu>
      </template>
    </Dropdown>
  </Space>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, UnwrapRef } from 'vue';
  import {
    ExpandOutlined,
    CompressOutlined,
    MenuOutlined,
    MoreOutlined,
    PrinterOutlined,
    ExportOutlined,
    FileExcelOutlined,
    EllipsisOutlined,
    SearchOutlined,
  } from '@ant-design/icons-vue';
  import {
    Button,
    Space,
    Dropdown,
    Menu,
    SubMenu,
    MenuItem,
    Input,
    Tree,
    TreeProps,
    Switch,
  } from 'ant-design-vue';
  import type { VxePulldownInstance } from 'vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ClickOutSide } from '/@/components/ClickOutSide';
  import { ToolBarProps } from '../../props';
  import { ToolBarType } from '../../types';
  import {
    getAllColKeys,
    getGridVisibleData,
    useExportAsExcel,
    useExportAsWps,
    useGetGridMod,
    useOpenExport,
    useOpenPrint,
    useSimplicityColumnsChange,
    useVisibleColumnCheck,
  } from '../../helper';

  const { t } = useI18n();

  const _props = defineProps(ToolBarProps);
  const props = _props as unknown as ToolBarType;

  const emit = defineEmits(['search']);

  const isFullscreen = ref(false);
  const isShowFilterInput = ref(false);
  const isSimpleCols = ref<undefined | boolean>(undefined);
  const isSimplicityColumns = computed({
    get: () => isSimpleCols.value,
    set: (val) => {
      isSimpleCols.value = val;
    },
  });

  const visibleData = getGridVisibleData(props);
  const filterStr = ref('');

  const xDown = ref({} as VxePulldownInstance);

  const selectedVisibleColKeys = ref<string[]>([]);
  const checkedVisibleColKeys = ref<string[]>(['root']);
  const expandedVisibleColTreeKeys = ref<string[]>([]);
  const treeColData = [
    {
      key: 'root',
      title: t('component.grid.allCols'),
      children: (
        props.gridWrappedColumns as unknown as UnwrapRef<typeof props.gridWrappedColumns>
      )?.filter((col) => (col.title && col.field) || col.children),
    },
  ] as TreeProps['treeData'];
  const onVisibleColumnCheck = useVisibleColumnCheck(props);

  const onSimplicityColumnsChange = async (checked: boolean) => {
    checkedVisibleColKeys.value = await useSimplicityColumnsChange(props)(checked);
  };

  const getGridMod = useGetGridMod(props);

  const openPrint = useOpenPrint(props);

  const openExport = useOpenExport(props);

  const exportAsExcel = useExportAsExcel(props);

  const exportAsWps = useExportAsWps(props);

  const handleClickOutSide = () => {
    isShowFilterInput.value = false;
  };

  defineExpose({ getGridMod });

  onMounted(() => {
    expandedVisibleColTreeKeys.value = getAllColKeys(props);
    if (props.simplicityColumns) {
      if (isSimpleCols.value === undefined) {
        isSimplicityColumns.value = true;
        onSimplicityColumnsChange(isSimplicityColumns.value);
      }
    }
  });
</script>
