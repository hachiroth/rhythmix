<script setup lang="ts">
  import QRCode from "qrcode.vue";
  const { qrUrl, isScanning = false, scannedInfo = {} } = defineProps<{
    qrUrl: string;
    isScanning: boolean;
    scannedInfo: any;
  }>();
  const emit = defineEmits<{
    (e: 'switch', to: string): void;
    (e: 'back'): void;
  }>();

  const switchToPhone = () => emit("switch", "phone");
</script>

<template>
  <div id="qr-login-box"
    class="bg-base-200 h-96 w-xs p-4 rounded flex-col items-center gap-8 flex transition-name-login">
    <div class="mt-4 text-center space-y-2">
      <div class="indicator">
        <div class="indicator-item badge badge-primary badge-sm font-bold">推荐</div>
        <h1 class="text-lg font-bold">二维码登录</h1>
      </div>
      <div class="font-bold text-sm">
        <div>请使用<span class="mx-1 text-white">网易云音乐APP</span>扫码登录</div>
      </div>
    </div>
    <div class="bg-base-300 w-fit rounded p-4 empty:p-0">
      <div v-if="isScanning && scannedInfo" class="space-y-4">
        <img :src="scannedInfo.avatarUrl" :alt="scannedInfo.nickname" class="size-32 rounded"
          style="view-transition-name: avatar;">
        <div class="text-center text-sm font-bold">{{ scannedInfo.nickname }}</div>
      </div>
      <QRCode v-else-if="qrUrl" :value="qrUrl" render-as="canvas" :size="128" style="view-transition-name: qr-code;">
      </QRCode>
    </div>
    <div class="space-x-4 mt-auto">
      <button type="button" class="btn btn-text btn-sm" @click="switchToPhone">
        <span style="view-transition-name: login-text;">手机登录</span>
      </button>
    </div>
  </div>
</template>

<style scoped></style>