import { WorkerLabelsEnum } from "./types/workerlableenum";
import { WorkerRep } from "./types/workerrep";
/**
 * @author        guang <531311582@qq.com>
 * @date          2024-10-19 10:08:58
 * Copyright © YourCompanyName All rights reserved
 */
export enum StatusEnum {
  RUNNING = "running",
  WAITING = "waiting",
}
// 基于Promise封装Worker 追踪Worker的运行状态
export class WorkerWrapper {
  worker: Worker;
  status: StatusEnum;
  constructor(worker: Worker) {
    this.worker = worker;
    this.status = StatusEnum.WAITING;
  }
  run<T>(param: ArrayBuffer, params: ArrayBuffer[], index: number) {
    console.log("run");
    this.status = StatusEnum.RUNNING;
    return new Promise<T>((resolve, reject) => {
      this.worker.onmessage = ({
        data,
      }: WorkerRep<{ result: string; chunk: ArrayBuffer }>) => {
        const { label, content } = data;
        if (label === WorkerLabelsEnum.DONE && content) {
          params[index] = content.chunk;
          this.status = StatusEnum.WAITING;
          resolve(content.result as T);
        }
      };
      this.worker.onerror = (e) => {
        this.status = StatusEnum.WAITING;
        reject(e);
      };
      this.worker.postMessage(param, [param]);
    });
  }
}
