<template>
  <div class="fixed h-full w-full flex flex-col justify-center items-center text-4xl">
    <div class="">{{ t('auth.authenticating') }}</div>
    <a-button v-if="resultCode" @click="$router.push('/')" class="mt-10" type="primary">{{
      t('auth.redo')
    }}</a-button>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useOauthStore } from '/@/store/modules/oauth';
  import { useGo } from '/@/hooks/web/usePage';
  import { useAppStore } from '/@/store/modules/app';
  import { PageEnum } from '/@/enums/pageEnum';
  const oauthStore = useOauthStore();
  const appStore = useAppStore();

  const { t } = useI18n();
  const go = useGo();

  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get('code') || '';
  const clientId = queryParams.get('client_id') || appStore.getClientId;
  const redirectUri = appStore.getRedirectUris;

  const resultCode = ref(0);
  oauthStore.getToken(clientId, code, redirectUri).then(({ code, message: msg }) => {
    resultCode.value = code;
    if (code > 0) {
      message.error(t(`auth.${msg}`));
    } else {
      go(PageEnum.BASE_HOME);
    }
  });
</script>
