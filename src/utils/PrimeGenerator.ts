function* PrimeGenerator() {
  var D = {};
  yield 2;
  for (var q = 3; ; q += 2) {
    var p = D[q];
    if (!p) {
      yield q;
      D[q * q] = q;
    } else {
      var x = p + q;
      while (D[x] || !(x & 1)) x += p;
      D[x] = p;
    }
  }
}

export default PrimeGenerator;
