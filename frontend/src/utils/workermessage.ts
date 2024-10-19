/**
 * @author        guang <531311582@qq.com>
 * @date          2024-10-19 09:54:46
 * Copyright © YourCompanyName All rights reserved
 */
// WorkerMessage.ts
import { WorkerLabelsEnum } from "./types/workerlableenum";

export class WorkerMessage<T = any> {
  label: WorkerLabelsEnum;
  content?: T;

  constructor(label: WorkerLabelsEnum, content?: T) {
    this.label = label;
    this.content = content;
  }
}
