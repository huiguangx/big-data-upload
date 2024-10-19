// md5.worker.ts
/// <reference lib="webworker" />
import SparkMD5 from "spark-md5";

export enum WorkerLabelsEnum {
  INIT,
  CHUNK,
  DONE,
}

export class WorkerMessage<T = any> {
  label: WorkerLabelsEnum;
  content?: T;

  constructor(label: WorkerLabelsEnum, content?: T) {
    this.label = label;
    this.content = content;
  }
}

addEventListener("message", ({ data }: { data: ArrayBuffer }) => {
  const hash = SparkMD5.ArrayBuffer.hash(data);

  postMessage(
    new WorkerMessage(WorkerLabelsEnum.DONE, {
      result: hash,
      chunk: data,
    }),
    [data] // 用于 transfer 的数据, 以避免结构化克隆
  );
});
