import { WorkerWrapper } from "./workerWrapper";
import { StatusEnum } from "./workerWrapper";

// 发布订阅
class Subject<T> {
  private listeners: Array<(value: T) => void> = [];
  private currentValue: T;

  constructor(initialValue: T) {
    this.currentValue = initialValue;
  }

  // 订阅变化的值
  subscribe(listener: (value: T) => void) {
    this.listeners.push(listener);
    listener(this.currentValue); // 初始化时发送当前值
  }

  // 发布新值，并通知所有订阅者
  next(value: T) {
    this.currentValue = value;
    this.listeners.forEach((listener) => listener(value));
  }

  get value() {
    return this.currentValue;
  }
}

// 管理WebWorker
export abstract class SimpleWorkerPool {
  pool: WorkerWrapper[] = []; // Worker池
  maxWorkerCount: number; // 最大并发数
  curRunningCount = new Subject(0); // 使用自定义的 Subject 跟踪当前运行Worker
  results: any[] = [];

  protected constructor(
    maxWorkers = navigator.hardwareConcurrency || 4,
    url: string
  ) {
    this.maxWorkerCount = maxWorkers;
    this.pool = Array.from({ length: maxWorkers }).map(
      () =>
        new WorkerWrapper(
          new Worker(new URL(url, import.meta.url), {
            type: "module", // 这里指定 Web Worker 的类型为 module
          })
        )
    );
  }

  exec<T>(params: ArrayBuffer[]) {
    this.results.length = 0;
    console.log(this.pool.length, "this.pool");
    const workerParams = params.map((param, index) => ({ data: param, index }));

    return new Promise<T[]>((rs) => {
      this.curRunningCount.subscribe((count) => {
        if (count < this.maxWorkerCount && workerParams.length !== 0) {
          // 当前能跑的任务数量
          let curTaskCount = this.maxWorkerCount - count;
          if (curTaskCount > params.length) {
            curTaskCount = params.length;
          }

          // 此时可以用来执行任务的 Worker
          const canUseWorker: WorkerWrapper[] = [];
          for (const worker of this.pool) {
            if (worker.status === StatusEnum.WAITING) {
              canUseWorker.push(worker);
              if (canUseWorker.length === curTaskCount) {
                break;
              }
            }
          }

          const paramsToRun = workerParams.splice(0, curTaskCount);
          // 更新当前正在跑起来的 worker 数量

          this.curRunningCount.next(this.curRunningCount.value + curTaskCount);
          canUseWorker.forEach((workerApp, index) => {
            const param = paramsToRun[index];
            workerApp
              .run(param.data, params, param.index)
              .then((res) => {
                this.results[param.index] = res;
              })
              .catch((e) => {
                this.results[param.index] = e;
              })
              .finally(() => {
                this.curRunningCount.next(this.curRunningCount.value - 1);
              });
          });
        }

        if (this.curRunningCount.value === 0 && workerParams.length === 0) {
          rs(this.results as T[]);
        }
      });
    });
  }
}
