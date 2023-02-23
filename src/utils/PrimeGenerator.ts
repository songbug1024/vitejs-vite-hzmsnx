export default function* primes() {
  yield 2;
  yield 3;
  yield 5;
  yield 7;

  const sieve = new Map();
  const ps = primes();
  ps.next();
  ps.next();

  for (let p = 3, i = 9; true; i += 2) {
    let s = sieve.get(i);

    if (s !== undefined) {
      sieve.delete(i);
    } else if (i < p * p) {
      yield i;
      continue;
    } else {
      s = 2 * p;
      p = ps.next().value;
    }

    let k = i + s;
    while (sieve.has(k)) k += s;
    sieve.set(k, s);
  }
}
