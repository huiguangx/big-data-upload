/**
 * @author        guang <531311582@qq.com>
 * @date          2024-10-19 17:11:28
 * Copyright © YourCompanyName All rights reserved
 */
import { WorkerPoolForMd5s } from "./workerpoolformd5s";
export class WorkerService {
  readonly MAX_WORKERS = 8;
  md5SingleWorkerPool: WorkerPoolForMd5s | undefined;

  // 计算所有分片的 MD5
  async getMD5ForFiles(chunks: ArrayBuffer[]): Promise<String[]> {
    if (this.md5SingleWorkerPool === undefined) {
      this.md5SingleWorkerPool = new WorkerPoolForMd5s(this.MAX_WORKERS);
    }
    console.log(66666);
    return await this.md5SingleWorkerPool.exec<string>(chunks);
  }
}
