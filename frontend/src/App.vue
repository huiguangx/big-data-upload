<script setup lang="ts">
import { onMounted, ref } from "vue";
import { WorkerService } from "./utils/workerservice";
import { getArrayBufFromBlobs, sliceFile } from "./utils/sliceFile";

const md5Results = ref<String[]>([]);
const onFileChage = async (event: Event) => {
  const target = event.target as HTMLInputElement;

  // 检查 target.files 是否为 null
  if (!target.files) return;

  const files = target.files[0]; // 确保 files 不为 null 后再转换为数组

  // 使用 getArrayBufFromBlobs 将文件转换为 ArrayBuffer
  const chunks = sliceFile(files, 5);
  const fileArrayBuffers = await getArrayBufFromBlobs(chunks);
  console.log(fileArrayBuffers);
  // 调用 WorkerService 来计算 MD5
  md5Results.value = await new WorkerService().getMD5ForFiles(fileArrayBuffers);
  console.log(md5Results, "成功计算!!!");
};

// onMounted(() => {
//   setTimeout(() => {
//     const worker = new Worker(
//       new URL("./utils/test.worker.ts", import.meta.url),
//       {
//         type: "module",
//       }
//     );
//     worker.postMessage(4000000000);
//     worker.onmessage = (e) => {
//       console.log("收到worker的消息", e.data);
//     };
//   }, 3000);
// });
</script>

<template>
  <!-- <div class="ball"></div> -->
  <input type="file" @change="onFileChage" />
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
