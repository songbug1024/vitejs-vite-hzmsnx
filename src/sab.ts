import PrimeGenerator from './utils/PrimeGenerator';

// 初始化
const genInt32Array = (abOrLength: SharedArrayBuffer | number) => {
  // 建立 32 位整数视图
  const ia = new Int32Array(abOrLength);
  // 新建一个质数生成器
  const primes = PrimeGenerator();
  // 将 10 万个质数，写入这段内存空间
  for (let i = 0; i < ia.length; i++) {
    ia[i] = primes.next().value;
  }
  return ia;
};

const WORKER_COUNT = 1;
const PRIME_COUNT = 5000000;

// 分配 500 万个 32 位整数占据的内存空间
const sab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * PRIME_COUNT);
const sia = genInt32Array(sab);
const iaList = Array(WORKER_COUNT)
  .fill(0)
  .map(() => genInt32Array(PRIME_COUNT));

// wokers with arraybuffer Copy
for (let i = 0; i < WORKER_COUNT; i++) {
  const ia = iaList[i];

  // 向 Worker 线程传送内存
  const w = new Worker('myworker.js');
  console.log('ArrayBuffer Copy in main BEFORE transfer to worker:', ia.length);
  w.postMessage({
    from: 'ArrayBuffer Copy',
    buffer: ia.buffer,
  });
  console.log('ArrayBuffer Copy in main AFTER transfer to worker:', ia.length);
}

// wokers with sharedarraybuffer
for (let i = 0; i < WORKER_COUNT; i++) {
  // 向 Worker 线程发送这段共享内存
  console.log(
    'SharedArrayBuffer in main BEFORE transfer to worker:',
    sia.length
  );
  const w = new Worker('myworker.js');

  w.postMessage(sia);
  console.log(
    'SharedArrayBuffer in main AFTER transfer to worker:',
    sia.length
  );
}

// wokers with arraybuffer Transferable
for (let i = 0; i < WORKER_COUNT; i++) {
  const ia = iaList[i];

  // 向 Worker 线程传送内存
  console.log(
    'ArrayBuffer With Transferable in main BEFORE transfer to worker:',
    ia.length
  );
  const w = new Worker('myworker.js');

  w.postMessage(
    {
      from: 'ArrayBuffer With Transferable',
      buffer: ia.buffer,
    },
    [ia.buffer]
  );
  console.log(
    'ArrayBuffer With Transferable in main AFTER transfer to worker:',
    ia.length
  );
}
