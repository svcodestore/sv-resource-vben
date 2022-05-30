<template>
  <vxe-grid ref="xGrid" v-bind="attrs" v-on="events" class="mb-1">
    <template #toolbar>
      <slot name="toolbar">
        <Toolbar ref="toolbar" class="mb-2px">
          <template #left>
            <slot name="toolbarLeft">
              <ToolbarLeft
                v-bind="toolbarAttrs"
                @remove="unsetCurrentRow"
                @revert="unsetCurrentRow"
              />
            </slot>
          </template>
          <template #center>
            <slot name="toolbarCenter">
              <ToolbarCenter v-bind="toolbarAttrs" />
            </slot>
          </template>
          <template #right>
            <slot name="toolbarRight">
              <ToolbarRight v-bind="toolbarAttrs" @search="handleFilterData" />
            </slot>
          </template>
        </Toolbar>
      </slot>
    </template>
    <template
      v-for="slotname in columnSlots"
      #[slotname]="{
        row,
        rowIndex,
        $rowIndex,
        column,
        columnIndex,
        $columnIndex,
        _columnIndex,
        $panel,
      }"
    >
      <slot
        :name="slotname"
        v-bind="{
          row,
          rowIndex,
          $rowIndex,
          column,
          columnIndex,
          $columnIndex,
          _columnIndex,
          $panel,
        }"
      ></slot>
    </template>
  </vxe-grid>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, reactive } from 'vue';
  import type { VxeGridInstance } from 'vxe-table';

  import { Toolbar, ToolbarLeft, ToolbarRight, ToolbarCenter } from './components/toolbar';
  import { getFilteredData, getWrappedColumns, getGridData, getColumnSlots } from './helper';

  import gridProps from './props';
  import { GridPropsType } from './types';
  import { cloneDeep } from 'lodash-es';

  const emit = defineEmits(['refresh', 'current-change']);
  const xGrid = ref({} as VxeGridInstance);
  const toolbar = ref({});

  const props = defineProps(gridProps);
  const originalData = ref(cloneDeep(props.data));
  watch(
    () => props.data,
    (v) => {
      originalData.value = cloneDeep(v);
    },
  );

  const currentRow = ref({});

  const filterStr = ref('');

  const attrs = computed(() => {
    let wrap = Object.assign({}, props, {
      columns: wrappedColumns.value,
    });
    // if (props.fullHieight) {
    //   // @ts-ignore
    //   wrap = { ...wrap, height: document.querySelector('.vxe-grid')?.parentNode?.clientHeight };
    // }
    if (!props.proxyConfig) {
      return Object.assign(wrap, {
        data: gridData.value,
      });
    }

    return wrap;
  });

  const events = computed(() => {
    return {
      'current-change': currentChangeEvent,
    };
  });

  const columnSlots = getColumnSlots(props as GridPropsType);

  const handleFilterData = (str: string) => {
    filterStr.value = str;
  };

  const filteredData = getFilteredData(filterStr, props as GridPropsType);

  const gridData = getGridData(props as GridPropsType, filteredData);

  const wrappedColumns = getWrappedColumns(props as GridPropsType);

  const toolbarAttrs = reactive({
    gridTitle: props.gridTitle,
    desc: props.desc,
    grid: xGrid,
    gridEmit: emit,
    gridCurrentRow: currentRow,
    gridOriginalData: originalData,
    gridWrappedColumns: wrappedColumns || [],
    saveApi: props.saveApi,
    insertOptions: props.insertOptions,
    simplicityColumns: props.simplicityColumns,
  });

  const currentChangeEvent = ({
    newValue,
    oldValue,
    row,
    rowIndex,
    $rowIndex,
    column,
    columnIndex,
    $columnIndex,
    $event,
  }) => {
    currentRow.value = row;

    emit('current-change', {
      newValue,
      oldValue,
      row,
      rowIndex,
      $rowIndex,
      column,
      columnIndex,
      $columnIndex,
      $event,
    });
  };

  const unsetCurrentRow = () => {
    currentRow.value = {};
  };

  defineExpose({ xGrid, toolbar });
</script>

<script lang="ts">
  // @ts-ignore
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'SvGrid',
  });
</script>
