// md5.worker.ts
/// <reference lib="webworker" />
import SparkMD5 from "spark-md5";
import { WorkerMessage } from "./workermessage";
import { WorkerLabelsEnum } from "./types/workerlableenum";

addEventListener("message", ({ data }: { data: ArrayBuffer }) => {
  const hash = SparkMD5.ArrayBuffer.hash(data);
  console.log(hash, "hash");
  postMessage(
    new WorkerMessage(WorkerLabelsEnum.DONE, {
      result: hash,
      chunk: data,
    }),
    [data] // 用于 transfer 的数据, 以避免结构化克隆
  );
});
