<script setup lang="ts">
  import IconQr from '@renderer/components/icons/icon-qr.vue';


  const emit = defineEmits<{
    (e: 'switch', to: string): void;
    (e: 'back'): void;
  }>();

  const switchToQr = () => emit("switch", "qr");
</script>

<template>
  <div id="phone-login-box" class="bg-base-200 h-96 w-xs p-4 rounded flex flex-col items-center gap-8"
    style="view-transition-name: login;">
    <div class="absolute size-16 left-2 top-2 cursor-pointer overflow-clip"
      style="clip-path: polygon(100% 0, 0 0, 0 100%);" @click="switchToQr">
      <IconQr style="view-transition-name: qr-code;clip-path: polygon(100% 0, 0 0, 0 100%);" class="size-16" />
    </div>
    <div class="mt-4 text-center space-y-2">
      <div class="indicator">
        <h1 class="text-lg font-bold" style="view-transition-name: login-text;">
          手机登录
        </h1>
      </div>
    </div>
    <div class="p-4 space-y-4">
      <input type="text" class="input" placeholder="请输入手机号" />
      <input type="password" placeholder="请输入密码" class="input" />
      <div class="text-xs flex justify-between items-center">
        <div class="flex items-center gap-1">
          <input type="checkbox" class="checkbox checkbox-xs" id="auto-login" />
          <label class="label-text" for="auto-login">自动登录</label>
        </div>
        <span class="link link-hover">忘记密码</span>
      </div>
    </div>
    <div class="w-full px-4">
      <button type="button" class="btn btn-primary btn-block">登录</button>
    </div>
    <div class="text-xs text-error/50 font-bold italic">
      该登录模式未实现，请使用<span class="mx-1 underline underline-offset-3 cursor-pointer" @click="switchToQr">
        二维码登录
      </span>
    </div>
  </div>
</template>

<style scoped></style>