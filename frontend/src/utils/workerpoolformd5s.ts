/**
 * @author        guang <531311582@qq.com>
 * @date          2024-10-19 17:09:20
 * Copyright © YourCompanyName All rights reserved
 */
import { WorkerWrapper } from "./workerWrapper";
import { SimpleWorkerPool } from "./workerpool";

export class WorkerPoolForMd5s extends SimpleWorkerPool {
  constructor(maxWorkers: number) {
    super(maxWorkers);
    this.pool = Array.from({ length: maxWorkers }).map(
      () =>
        new WorkerWrapper(
          new Worker(new URL("./md5.worker.ts", import.meta.url), {
            type: "module", // 这里指定 Web Worker 的类型为 module
          })
        )
    );
    console.log(this.pool, "this.pool");
  }
}
