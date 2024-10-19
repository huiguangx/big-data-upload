/**
 * @author        guang <531311582@qq.com>
 * @date          2024-10-19 10:06:19
 * Copyright © YourCompanyName All rights reserved
 */
import { WorkerMessage } from "../workermessage";
export interface WorkerRep<T> {
  data: WorkerMessage<T>;
}
