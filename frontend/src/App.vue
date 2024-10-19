<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  setTimeout(() => {
    const worker = new Worker(
      new URL("./utils/test.worker.ts", import.meta.url),
      {
        type: "module",
      }
    );
    worker.postMessage(4000000000);
    worker.onmessage = (e) => {
      console.log("收到worker的消息", e.data);
    };
  }, 3000);
});
</script>

<template>
  <div class="ball"></div>
</template>

<style scoped>
.ball {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: red;
  position: absolute;
  animation: jump infinite 1s;
}
@keyframes jump {
  0% {
    top: 200px;
  }
  50% {
    top: 100px;
  }
  100% {
    top: 200px;
  }
}
</style>
