// Worker 线程
console.log('worker loaded');
let ia;
onmessage = function (ev) {
  if (ev.data.from) {
    ia = new Int32Array(ev.data.buffer);
    console.log('onmessage: ' + ev.data.from, ia.length, ia[ia.length - 1]);
  } else {
    ia = ev.data;
    console.log('onmessage: SharedArrayBuffer', ia.length, ia[ia.length - 1]);
  }
};
