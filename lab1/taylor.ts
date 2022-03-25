/**
 * Usage: node taylor.js inputNumber unit
 */

const factorialMemo: Record<number, number> = {};

// =========================== Taylor ===========================
function sin(x: number, precision: number) {
  const normalizedX = normalizeX(x);
  let sum = normalizedX;

  for (let p = 2; p <= precision; p++) {
    const part = sinPart(normalizedX, p);

    sum += part;
  }

  return sum;
}

function sinPart(x: number, n: number) {
  const m = 2 * n - 1;

  const sign = n % 2 === 0 ? -1 : 1;

  const numerator = x ** m;
  const denominator = factorial(m);

  return sign * (numerator / denominator);
}

function normalizeX(x: number) {
  const moduloX = x % (2 * Math.PI);

  if (moduloX <= 0.5 * Math.PI) {
    return moduloX;
  }

  if (moduloX <= Math.PI) {
    return Math.PI - moduloX;
  }

  if (moduloX <= 1.5 * Math.PI) {
    return moduloX - 2 * Math.PI;
  }

  return 2 * Math.PI - moduloX;
}

// ===================== Displaying Results =====================
const x = parseInput();
if (x === null) {
  process.exit();
}

console.log("");
console.log(`                               x = ${x}`);
// prettier-ignore
console.log("+----+---------------------+---------------------+---------------------+");
// prettier-ignore
console.log('|  p |       Math.sin      |        Taylor       |        Delta        |');
// prettier-ignore
console.log("+----+---------------------+---------------------+---------------------+");
for (let precision = 1; precision <= 10; precision++) {
  const math = Math.sin(x);
  const taylor = sin(x, precision);
  const delta = Math.abs(math - taylor);

  // prettier-ignore
  console.log(`| ${String(precision).padStart(2, "0")} | ${formatNumber(math)} | ${formatNumber(taylor)} | ${formatNumber(delta)} |`);
}
// prettier-ignore
console.log("+----+---------------------+---------------------+---------------------+");

// =========================== Utils ============================
function factorial(n: number): number {
  if (factorialMemo[n] !== undefined) {
    return factorialMemo[n];
  }

  if (n === 0) {
    return 1;
  }

  const result = n * factorial(n - 1);
  factorialMemo[n] = result;

  return result;
}

function degToRad(deg: number) {
  return (deg / 180) * Math.PI;
}

// ======================== Display Utils =======================
function formatNumber(n: number) {
  return n.toFixed(16).padStart(18, "0").padStart(19, " ");
}

function parseInput() {
  const inputNumber = Number.parseFloat(String(eval(process.argv[2])));
  const unit = process.argv[3];

  if (Number.isNaN(inputNumber) || !(unit === "deg" || unit === "rad")) {
    console.log("Usage:");
    console.log(`node taylor.js inputNumber unit`);
    console.log("");
    // prettier-ignore
    console.log("inputNumber: number (can be a JavaScript expression eg. Math.PI/3)");
    console.log("unit: deg | rad");

    return null;
  }

  if (unit === "rad") {
    return inputNumber;
  }

  return degToRad(inputNumber);
}
