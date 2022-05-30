import type { PropType } from 'vue';
import type { VxeGridInstance, VxeTablePropTypes } from 'vxe-table';
import {
  GridColumnType,
  GridModeEnum,
  GridModeType,
  InsertOptionsType,
  SaveApiType,
} from './types';

const keyboardConfig = { isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true };
const mouseConfig = { selected: true };
const editConfig = {
  trigger: 'dblclick',
  mode: 'cell',
  showStatus: true,
  showUpdateStatus: true,
  showInsertStatus: true,
  showAsterisk: true,
};

export const gridBasicProps = {
  id: { type: String as PropType<string>, default: () => 'svGrid' },
  columns: { type: Array as PropType<GridColumnType[]>, default: () => [] },
  data: { type: Array as PropType<unknown[]> },
  height: { type: Number as PropType<number>, default: () => 500 },
  autoResize: { type: Boolean as PropType<boolean>, default: () => true },
  syncResize: { type: Boolean as PropType<boolean>, default: () => true },
  resizable: { type: Boolean as PropType<boolean>, default: () => true },
  stripe: { type: Boolean as PropType<boolean>, default: () => true },
  border: {
    type: Boolean as PropType<boolean>,
    default: () => true,
    validator: function (this: void, value: string | boolean) {
      return ['inner', 'outer', 'none', 'full', true].includes(value);
    },
  },
  round: { type: Boolean as PropType<boolean>, default: () => true },
  showHeader: { type: Boolean as PropType<boolean>, default: () => true },
  highlightCurrentRow: { type: Boolean as PropType<boolean>, default: () => true },
  highlightHoverRow: { type: Boolean as PropType<boolean>, default: () => true },
  showOverflow: { type: Boolean as PropType<boolean>, default: () => false },
  showHeaderOverflow: { type: Boolean as PropType<boolean>, default: () => false },
  rowId: { type: String as PropType<string>, default: () => 'id' },
  keepSource: { type: Boolean as PropType<boolean>, default: () => true },
  mouseConfig: {
    type: Object as PropType<Partial<typeof mouseConfig>>,
    default: () => mouseConfig,
  },
  keyboardConfig: {
    type: Object as PropType<Partial<typeof keyboardConfig>>,
    default: () => keyboardConfig,
  },
  editConfig: {
    type: Object as PropType<Partial<typeof editConfig>>,
    default: () => editConfig,
  },
  maxHeight: [Number, String],
  size: String,
  loading: Boolean,
  align: { type: String as PropType<string>, default: () => 'left' },
  headerAlign: String,
  footerAlign: String,
  highlightCurrentColumn: Boolean,
  highlightHoverColumn: Boolean,
  highlightCell: Boolean,
  rowClassName: [String, Function],
  cellClassName: [String, Function],
  headerRowClassName: [String, Function],
  headerCellClassName: [String, Function],
  footerRowClassName: [String, Function],
  footerCellClassName: [String, Function],
  showFooter: Boolean,
  footerMethod: Function,
  mergeCells: Array,
  mergeFooterItems: Array,
  showFooterOverflow: [Boolean, String],
  columnKey: { type: Boolean, default: () => true },
  rowKey: { type: Boolean, default: () => true },
  columnConfig: Object,
  seqConfig: Object,
  sortConfig: Object,
  filterConfig: Object,
  exportConfig: { type: Object as PropType<VxeTablePropTypes.ExportConfig>, default: () => ({}) },
  importConfig: Object,
  printConfig: { type: Object as PropType<VxeTablePropTypes.PrintConfig>, default: () => ({}) },
  radioConfig: Object,
  checkConfig: Object,
  tooltipConfig: Object,
  expandConfig: Object,
  treeConfig: Object,
  menuConfig: Object,
  validConfig: Object,
  editRules: Object,
  emptyText: String,
  emptyRender: Object,
  customConfig: Object,
  scrollX: Object,
  scrollY: Object,
  params: Object,
  formConfig: Object,
  toolbarConfig: Object,
  pagerConfig: Object,
  proxyConfig: Object,
  zoomConfig: Object,
  spanMethod: Function,
};

const gridCustomProps = {
  gridTitle: {
    type: String as PropType<string>,
  },
  desc: {
    type: String as PropType<string>,
  },
  mode: {
    type: String as PropType<GridModeType>,
    default: () => GridModeEnum.TOOLBAR,
  },
  editable: {
    type: Boolean as PropType<boolean>,
    default: () => false,
  },
  readable: {
    type: Boolean as PropType<boolean>,
    default: () => true,
  },
  writable: {
    type: Boolean as PropType<boolean>,
    default: () => false,
  },
  removable: {
    type: Boolean as PropType<boolean>,
    default: () => false,
  },
  importable: {
    type: Boolean as PropType<boolean>,
    default: () => false,
  },
  exportable: {
    type: Boolean as PropType<boolean>,
    default: () => false,
  },
  printable: {
    type: Boolean as PropType<boolean>,
    default: () => false,
  },
  searchable: {
    type: Boolean as PropType<boolean>,
    default: () => false,
  },
  draggable: {
    type: Boolean as PropType<boolean>,
    default: () => false,
  },
  reactable: {
    type: Boolean as PropType<boolean>,
    default: () => false,
  },
  simplicityColumns: {
    type: Object as PropType<{
      include?: string[];
      exclude: string[];
    }>,
    default: () => ({
      exclude: ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'],
    }),
  },
  fullHieight: {
    type: Boolean as PropType<boolean>,
    default: () => true,
  },
};

export const toolbarCustomProps = {
  saveApi: { type: Function as PropType<SaveApiType> },
  insertOptions: {
    type: Object as PropType<InsertOptionsType>,
    default: () => undefined,
  },
  simplicityColumns: {
    type: Object as PropType<{
      include?: string[];
      exclude?: string[];
    }>,
    default: () => ({
      exclude: ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'],
    }),
  },
};

const toolbarProps = {
  gridTitle: {
    type: String as PropType<string>,
    default: () => undefined,
  },
  desc: {
    type: String as PropType<string>,
    default: () => undefined,
  },
  grid: {
    type: Object as PropType<VxeGridInstance>,
    default: () => undefined,
  },
  gridEmit: {
    type: Function as PropType<EmitType>,
    default: () => undefined,
  },
  gridCurrentRow: {
    type: Object as PropType<any>,
    default: () => undefined,
  },
  gridOriginalData: {
    type: Array as PropType<any>,
    default: () => [],
  },
  gridWrappedColumns: {
    type: Array as PropType<GridColumnType[]>,
    default: () => [],
  },
};

export const ToolBarProps = Object.assign(toolbarCustomProps, toolbarProps);

const props = Object.assign(gridBasicProps, gridCustomProps, toolbarCustomProps);

export default props;
