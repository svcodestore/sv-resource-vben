<template>
  <Space>
    <Button shape="circle" :title="t('common.redo')" @click="refresh">
      <ReloadOutlined />
    </Button>
    <Button shape="circle" :title="t('common.undo')" @click="revert">
      <UndoOutlined />
    </Button>
    <Button type="primary" shape="circle" :title="t('common.insert')" @click="insert">
      <PlusOutlined />
    </Button>
    <Button
      type="primary"
      danger
      shape="circle"
      :title="t('common.delText')"
      @click="remove"
      :disabled="!Object.keys(gridCurrentRow).length"
    >
      <DeleteOutlined />
    </Button>
    <Popconfirm
      :title="t('component.grid.modCfmText')"
      :ok-text="t('common.confirm')"
      :cancel-text="t('common.cancelText')"
      placement="rightTop"
      :ok-button-props="{
        loading: saveBtnLoading,
      }"
      :disabled="popconfirmDisabled"
      :visible="!popconfirmDisabled"
      @cancel="popconfirmDisabled = true"
      @confirm="submit"
    >
      <Button
        shape="circle"
        :title="t('common.saveText')"
        :loading="saveBtnLoading"
        :disabled="!saveApi"
        @click="validateModificationWrap"
      >
        <SaveOutlined />
      </Button>
    </Popconfirm>
  </Space>
</template>

<script lang="ts" setup>
  import { ref, h } from 'vue';
  import {
    ReloadOutlined,
    UndoOutlined,
    PlusOutlined,
    DeleteOutlined,
    SaveOutlined,
    SmileOutlined,
  } from '@ant-design/icons-vue';
  import { Button, Popconfirm, Space, notification } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ToolBarProps } from '../../props';
  import { ToolBarType } from '../../types';
  import {
    useGetGridMod,
    useInsert,
    useRefresh,
    useRemove,
    useRevert,
    useValidateModification,
  } from '../../helper';

  const { t } = useI18n();

  const _props = defineProps(ToolBarProps);
  const props = _props as unknown as ToolBarType;

  const emit = defineEmits(['remove', 'revert']);

  const saveBtnLoading = ref(false);
  const popconfirmDisabled = ref(true);

  const insert = useInsert(props);

  const remove = useRemove(emit, props);

  const validateModificationWrap = async () => {
    popconfirmDisabled.value = true;
    const isValid = await validateModification();
    isValid && (popconfirmDisabled.value = false);
  };

  const validateModification = useValidateModification(props);

  const getGridMod = useGetGridMod(props);

  const refresh = useRefresh(props);

  const revert = useRevert(emit, props);

  const submit = async () => {
    if (props.saveApi) {
      await props
        .saveApi(getGridMod())
        .then(() => {
          notification.success({
            message: t('common.saveSucc'),
            icon: h(SmileOutlined, { style: 'color: #108ee9' }),
          });
          refresh();
        })
        .finally(() => {
          saveBtnLoading.value = false;
          popconfirmDisabled.value = true;
        });
    }
  };

  defineExpose({ getGridMod });
</script>
