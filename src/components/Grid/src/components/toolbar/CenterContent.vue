<template>
  <div class="w-full text-center leading-8 text-base whitespace-nowrap tracking-2px">
    <Tooltip placement="top" :title="desc" v-if="desc">
      <span v-if="gridTitle">{{ gridTitle }}</span>
    </Tooltip>
    <span v-if="gridTitle">{{ gridTitle }}</span>
  </div>
</template>

<script lang="ts" setup>
  import { Tooltip } from 'ant-design-vue';
  import { ToolBarProps } from '../../props';

  defineProps(ToolBarProps);
</script>
