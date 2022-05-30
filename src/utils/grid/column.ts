import { VxeGridPropTypes } from 'vxe-table';
import { GridColumnType } from '/@/components/Grid/src/types';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export type GenerateColumnParamsType = Partial<{
  isShowSeq: boolean;
  isShowPk: boolean;
  pk: string;
  pkName: string;
  base: boolean;
  baseColumns: string[] &
    { field: string; index: 'front' | 'behind' }[] & {
      front?: VxeGridPropTypes.Columns & GridColumnType[];
      behind?: VxeGridPropTypes.Columns & GridColumnType[];
    };
}> & { columns: VxeGridPropTypes.Columns & GridColumnType[] };

export function generateBaseColumns({
  isShowSeq = true,
  isShowPk = false,
  pk = 'id',
  pkName,
  base = true,
  baseColumns,
  columns,
}: GenerateColumnParamsType): VxeGridPropTypes.Columns & GridColumnType[] {
  const cols: VxeGridPropTypes.Columns & GridColumnType[] = [];
  const pkCol = {
    field: pk,
    title: pkName || t('component.grid.pkName'),
  };
  const modificationCols = [
    {
      field: 'createdBy',
      title: t('component.grid.createdBy'),
    },
    {
      field: 'createdAt',
      title: t('component.grid.createdAt'),
      formatType: 'date',
    },
    {
      field: 'updatedBy',
      title: t('component.grid.updatedBy'),
    },
    {
      field: 'updatedAt',
      title: t('component.grid.updatedAt'),
      formatType: 'date',
    },
  ];
  if (baseColumns) {
    const { front, behind } = baseColumns;
    if (isShowSeq) {
      cols.push({ type: 'seq', width: 50 });
    }
    if (front) {
      cols.push(...front);
    }
    if (base) {
      if (isShowPk) {
        cols.push(pkCol);
      }
    }
    cols.push(...columns);
    if (behind) {
      cols.push(...behind);
    }
    if (base) {
      cols.push(...modificationCols);
    }
  } else if (base) {
    if (isShowSeq) {
      cols.push({ type: 'seq', width: 50 });
    }
    if (isShowPk) {
      cols.push(pkCol);
    }
    cols.push(...columns);
    cols.push(...modificationCols);
  } else {
    return columns;
  }
  return cols;
}
