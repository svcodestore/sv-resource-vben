import { BaseFields } from '/@/api/model/baseModel';

import type { RouteMeta } from 'vue-router';
export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}

/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = RouteItem[];

export type Menu = {
  pid: string;
  applicationId: string;
  code: string;
  name: string;
  sortNo: number;
  path: string;
  redirect: string;
  component: string;
  icon: string;
  hide: boolean;
} & BaseFields;
