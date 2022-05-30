import { ComputedRef, Ref } from 'vue';
import type { VxeGridProps, VxeGridInstance, VxeTableDefines, VxeGridPropTypes } from 'vxe-table';

interface InsertOptionsType {
  defaultRowValues: { [key: string]: any };
  focusField: string;
}

type SaveApiType = <T>(modifications: GridModificationApiType) => Promise<T>;

type ToolBarCustomType = Partial<{
  saveApi: SaveApiType;
  insertOptions: Partial<InsertOptionsType>;
  gridTitle: string;
  desc: string;
}>;

type ToolBarType<T = any> = ToolBarCustomType & {
  gridTitle?: string;
  desc?: string;
  grid: Ref<VxeGridInstance>;
  gridEmit: EmitType;
  gridCurrentRow: any;
  gridOriginalData: Ref<T[] | undefined>;
  gridWrappedColumns: ComputedRef<GridColumnType[] | VxeGridPropTypes.Columns | undefined>;
  simplicityColumns?: SimplicityColumnsType;
};

type SimplicityColumnsType = {
  include?: string[];
  excludeAppend?: string[];
  exclude?: string[];
};

type GridCustomType = Partial<{
  mode: GridModeType;
  editable: boolean;
  readable: boolean;
  writable: boolean;
  removable: boolean;
  importable: boolean;
  exportable: boolean;
  printable: boolean;
  seachable: boolean;
  draggable: boolean;
  reactable: boolean;
  fullHeight: boolean;
  simplicityColumns: SimplicityColumnsType;
}>;

type GridPropsType<T = any> = ToolBarCustomType &
  VxeGridProps<T> &
  GridCustomType &
  Partial<{ columns: GridColumnType[] }>;

type modItemType = { [key: string]: any };

type GridModificationType = {
  insert: modItemType[];
  update: modItemType[];
  remove: modItemType[];
};

type GridModificationFmtType = Partial<{
  insert: modItemType[];
  update: modItemType[];
  remove: string[];
}>;

type GridModificationApiType = Partial<{
  A: modItemType[];
  U: modItemType[];
  D: string[];
}>;

enum GridModeEnum {
  TOOLBAR = 'TOOLBAR',
  INLINE = 'INLINE',
  KEYBOARD = 'KEYBOARD',
  CONTEXTMENU = 'CONTEXTMENU',
}

type GridModeType = keyof typeof GridModeEnum;

type GridColumnType = VxeTableDefines.ColumnOptions &
  Partial<{
    key: string;
    editable: boolean;
    readable: boolean;
    writable: boolean;
    removable: boolean;
    formatType: 'number' | 'date';
  }>;

export {
  SaveApiType,
  ToolBarType,
  modItemType,
  InsertOptionsType,
  GridPropsType,
  GridModificationType,
  GridModificationFmtType,
  GridModificationApiType,
  GridModeEnum,
  GridModeType,
  GridColumnType,
  SimplicityColumnsType,
};
