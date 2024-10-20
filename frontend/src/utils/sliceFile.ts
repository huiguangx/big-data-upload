/**
 * 分割文件 IO频繁
 * @param file
 * @param baseSize 默认分块大小 1MB
 * @private
 */

export function sliceFile(file: File, baseSize: number = 1): Blob[] {
  const chunkSize = baseSize * 1024 * 1024; // KB 每一块1MB
  const chunks: Blob[] = [];
  let startPos = 0;
  while (startPos < file.size) {
    chunks.push(file.slice(startPos, startPos + chunkSize));
    startPos += chunkSize;
  }
  return chunks;
}

/**
 * 将File转成ArrayBuffer
 * @param chunks
 * @private
 */
export async function getArrayBufFromBlobs(
  chunks: Blob[]
): Promise<ArrayBuffer[]> {
  async function readAsArrayBuffer(file: Blob) {
    // fileReader包装成Promise
    return new Promise<ArrayBuffer>((resolve, reject) => {
      console.log(666);
      const fileReader = new FileReader();
      fileReader.onload = (e) => resolve(e.target!.result as ArrayBuffer);
      fileReader.onerror = (e) => {
        reject(e);
      };
      fileReader.readAsArrayBuffer(file);
    });
  }
  return await Promise.all(chunks.map((chunk) => readAsArrayBuffer(chunk)));
}

/**
 * 计算文件分片Hash值 判断分片是否上传过
 */
