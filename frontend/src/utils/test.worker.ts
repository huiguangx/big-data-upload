self.onmessage = function (e) {
  const data = e.data;
  console.log("长任务开始");
  console.time("calculate");
  let count = 0;
  for (let i = 0; i < data; i++) {
    count++;
  }
  console.log("长任务结束");
  console.timeEnd("calculate");
  self.postMessage("处理完成");
};
