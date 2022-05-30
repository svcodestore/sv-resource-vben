import { computed, Ref, ComputedRef, nextTick, unref } from 'vue';
import * as XLSX from 'xlsx';
import type { VxeGridPropTypes, VxeTableDefines, VxeTablePropTypes } from 'vxe-table';
import { toArrayTree } from 'xe-utils';
import {
  GridColumnType,
  GridModificationApiType,
  GridModificationFmtType,
  GridModificationType,
  GridPropsType,
  modItemType,
  ToolBarType,
} from './types';
import { formatToDateTime } from '/@/utils/dateUtil';
import { isObject } from '/@/utils/is';

export function getColumnsField(columns: VxeGridPropTypes.Columns) {
  return columns.map(({ children, field }) => (children ? getColumnsField(children) : field));
}

const setColumnSlots = (columns: VxeGridPropTypes.Columns, slots: any[]) => {
  columns.forEach((col) => {
    if (col.children) {
      setColumnSlots(col.children, slots);
    } else {
      if (col.slots) {
        const { header, footer, content, filter, edit } = col.slots;
        col.slots.default && slots.push(col.slots.default);
        header && slots.push(header);
        footer && slots.push(footer);
        content && slots.push(content);
        filter && slots.push(filter);
        edit && slots.push(edit);
      }
    }
  });
};

export const getFilteredData = (str: Ref<string>, props: GridPropsType) =>
  computed(() => {
    if (!str.value) return props.data || [];

    return (
      props.data?.filter((item) =>
        getColumnsField(props.columns || [])
          .flat(Infinity)
          // @ts-ignore
          .filter((field) => !!item[field])
          .some(
            // @ts-ignore
            (field) => item[field]?.toString().toUpperCase().indexOf(str.value.toUpperCase()) > -1,
          ),
      ) || []
    );
  });

export const wrapColumns = (columns: GridColumnType[], props: GridPropsType) => {
  columns.forEach((col) => {
    if (Array.isArray(col.children)) {
      wrapColumns(col.children, props);
    } else {
      if (props.editable === true) {
        if (col.editRender) {
          if (!col.editRender.name && Array.isArray(col.editRender.options)) {
            col.editRender.name = '$select';
          }
        } else if (col.editable === void 0) {
          col.editRender = {
            name: 'input',
          };
        }
        if (col.writable === false) {
          col.editRender = void 0;
        }
      }

      if (col.formatType === 'number') {
        col.align = 'right';
        col.formatter = function ({ cellValue }) {
          if (!cellValue) return cellValue;
          return String(cellValue).replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, '$&,');
        };
      } else if (col.formatType === 'date') {
        col.formatter = function ({ cellValue }) {
          if (!cellValue) return cellValue;
          return formatToDateTime(cellValue, 'YYYY-MM-DD');
        };
      }

      if (col.editRender?.name === '$select' && !col.editRender?.props?.multiple) {
        col.filters = col.editRender.options;
      }

      if (col.editRender && col.editRender.autoselect === void 0) {
        col.editRender.autoselect = true;
      }

      if (col.field === 'status') {
        if (!col.align) col.align = 'center';
        if (!col.width) col.width = 84;
      }
    }
  });
};

export const setColTreeKeys = (columns: GridColumnType[], parentKey?: string) => {
  for (let index = 0; index < columns.length; index++) {
    const element = columns[index];
    element.key = parentKey === void 0 ? element.title : parentKey + '-' + element.title;
    if (element.children) {
      setColTreeKeys(element.children, element.title);
    }
  }
};

export const getWrappedColumns = (props: GridPropsType) =>
  computed(() => {
    wrapColumns(props.columns || [], props);
    setColTreeKeys(props.columns || []);
    return props.columns;
  });

export const getGridData = (props: GridPropsType, data: ComputedRef<unknown[]>) =>
  computed(() => {
    return props.treeConfig
      ? toArrayTree(data.value, { key: 'id', parentKey: 'pid', children: 'children' })
      : data.value;
  });

export const getColumnSlots = (props: GridPropsType) =>
  computed(() => {
    const slots = [];
    if (props.columns) {
      setColumnSlots(props.columns, slots);
    }
    return slots;
  });

export const getGridVisibleData = (props: ToolBarType) =>
  computed(() => {
    if (!unref(props.grid)) return [];
    try {
      return unref(props.grid).getTableData().visibleData;
    } catch (e) {
      return [];
    }
  });

export const useInsert = (props: ToolBarType) => () => {
  unref(props.grid)
    ?.insert(props.insertOptions?.defaultRowValues || {})
    .then(({ row }) => {
      const focusField = props.insertOptions?.focusField;
      focusField && unref(props.grid).setActiveCell(row, focusField);
    });
};

export const useRemove = (emit: EmitType, props: ToolBarType) => async () => {
  await unref(props.grid)?.remove(props.gridCurrentRow);
  emit('remove');
};

export const useRefresh = (props: ToolBarType) => () => {
  props.gridEmit?.('refresh');
};

export const useRevert = (emit: EmitType, props: ToolBarType) => async () => {
  await unref(props.grid)?.revertData();
  emit('revert');
};

const getDiffData = ({
  originalData,
  columns,
  data: { insert, update, remove },
}: {
  originalData: any[];
  columns: VxeTableDefines.ColumnInfo[];
  data: GridModificationType;
}) => {
  const o: GridModificationFmtType = {
    insert: [],
    update: [],
    remove: [],
  };

  o.insert = insert.map((item) => {
    const obj: modItemType = {};
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const element = item[key];
        if (Array.isArray(element)) {
          obj[key] = element.join(',');
        } else if (isObject(element)) {
          obj[key] = Object.assign({}, element).value;
        } else {
          const cellType = columns.find((c) => c.field === key)?.editRender?.cellType;

          obj[key] = cellType === 'number' ? +element : element;
        }
      }
    }
    return obj;
  });

  o.remove = remove.map((e) => e.id);

  update.forEach((item) => {
    const updateFields = {};

    const originalItem = originalData.find((e) => e.id === item.id) || {};

    columns.forEach((col) => {
      const key = col.field || '';
      if (Array.isArray(item[key])) {
        if (item[key].toString() !== (originalItem[key] || []).toString()) {
          updateFields[key] = item[key].join(',');
        }
      } else {
        if (item[key] !== originalItem[key]) {
          const v = item[key];
          updateFields[key] = col.editRender?.cellType === 'number' ? +v : v;
        }
      }
    });

    if (Object.keys(updateFields).length) {
      o.update?.push({ ...updateFields, id: item.id });
    }
  });

  return o;
};

const fmtDiffData = ({
  insert,
  update,
  remove,
}: GridModificationFmtType): GridModificationApiType => {
  const o: GridModificationApiType = {};
  insert?.length && (o.A = insert);
  update?.length && (o.U = update);
  remove?.length && (o.D = remove);
  return o;
};

export const useGetGridMod = (props: ToolBarType) => () => {
  const originalData = unref(props.gridOriginalData) || [];
  const columns = Array.from(unref(props.grid)?.getTableColumn().collectColumn || []);
  const data: GridModificationType = {
    insert: unref(props.grid)?.getInsertRecords() || [],
    update: unref(props.grid)?.getUpdateRecords() || [],
    remove: unref(props.grid)?.getRemoveRecords() || [],
  };

  const dataModification = fmtDiffData(getDiffData({ originalData, columns, data }));

  return dataModification;
};

export const useValidateModification = (props: ToolBarType) => async (): Promise<boolean> => {
  const errMap = await unref(props.grid)
    ?.fullValidate()
    .catch((errMap) => errMap);
  if (errMap) return false;

  const { A, U, D } = useGetGridMod(props)();
  if (!A?.length && !U?.length && !D?.length) {
    return false;
  }

  return true;
};

export function getColKey(columns: GridColumnType[]): any[] {
  return columns.map((col) =>
    col.children ? getColKey(col.children) : { [col.key || '']: col.field },
  );
}

export const useVisibleColumnCheck = (props: ToolBarType) => (keys: string[]) => {
  // if (!unref(props.grid).getTableColumn) return [];

  nextTick().then(() => {
    const columns = unref(props.grid).getTableColumn().fullColumn;
    if (keys.length === 0) {
      for (const col of columns) {
        col.visible = false;
      }
    } else {
      const _cols = getColKey(
        (unref(props.gridWrappedColumns) || []).filter(
          (col) => (col.title && col.field) || col.children,
        ),
      ).flat(Infinity) as { [key: string]: string }[];
      const all = new Set(_cols.map((e) => Object.keys(e)[0]));
      const _keys = new Set(keys.filter((k) => k !== 'root'));
      const diffKey = [...new Set([...all].filter((x) => !_keys.has(x)))];
      const sameKey = [...new Set([..._keys].filter((x) => all.has(x)))];
      diffKey.forEach((k) => {
        const item = columns.find(
          (col) => col.field === Object.values(_cols.find((_col) => _col[k]) || {})[0],
        );
        if (item) {
          item.visible = false;
        }
      });
      sameKey.forEach((k) => {
        const item = columns.find(
          (col) => col.field === Object.values(_cols.find((_col) => _col[k]) || {})[0],
        );
        if (item) {
          item.visible = true;
        }
      });
    }
    unref(props.grid).refreshColumn();
  });

  // unref(props.grid).refreshColumn();
};

export const useSimplicityColumnsChange = (props: ToolBarType) => async (checked: boolean) => {
  await nextTick();

  const onVisibleColumnCheck = useVisibleColumnCheck(props);

  const defaultExclude = ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
  const exclude = [] as string[];
  if (!props.simplicityColumns?.exclude) {
    exclude.push(...defaultExclude);
  } else {
    exclude.push(...props.simplicityColumns.exclude);
  }
  if (props.simplicityColumns?.excludeAppend) {
    exclude.push(...props.simplicityColumns.excludeAppend);
  }

  const includeCols = unref(props.gridWrappedColumns)?.filter((col) =>
    exclude.every((field) => field !== col.field),
  );
  let colKeys: string[] = [];
  if (checked) {
    colKeys = includeCols?.map((c) => c.title).filter((c) => c) as string[];
  } else {
    colKeys = unref(props.gridWrappedColumns)?.map((c) => c.title) as string[];
  }
  onVisibleColumnCheck(colKeys.filter((key) => key));

  return colKeys.filter((key) => key);
};

export const getAllColKeys = (props: ToolBarType) =>
  getColKey((unref(props.gridWrappedColumns) || []).filter((col) => col.children))
    .flat(Infinity)
    .map((e) => Object.keys(e)[0])
    .concat('root');

export const useOpenPrint = (props: ToolBarType) => (options?: VxeTablePropTypes.PrintConfig) => {
  unref(props.grid).openPrint(options);
};

export const useExportAsWps = (props: ToolBarType) => () => {
  const filename = formatToDateTime();
  unref(props.grid)
    .exportData({
      type: 'html',
      mode: 'all',
      download: false,
    })
    .then((res) => {
      const dom = new DOMParser().parseFromString(res.content, 'text/html');
      dom.querySelector('table')?.setAttribute('border', '1');
      unref(props.grid).saveFile({
        filename,
        type: 'xlsx',
        content: dom.documentElement.innerHTML,
      });
    });
};

export const useExportAsExcel = (props: ToolBarType) => () => {
  const filename = formatToDateTime();
  unref(props.grid)
    .exportData({
      type: 'html',
      mode: 'all',
      download: false,
    })
    .then((res) => {
      const d = new DOMParser().parseFromString(res.content, 'text/html');
      const workBook = XLSX.utils.table_to_book(d.querySelector('table'), {
        raw: true,
        cellStyles: true,
      });
      XLSX.writeFile(workBook, `${filename}.xlsx`, { cellStyles: true });
    });
};

export const useOpenExport = (props: ToolBarType) => (options?: VxeTablePropTypes.ExportConfig) => {
  unref(props.grid).openExport(options);
};
