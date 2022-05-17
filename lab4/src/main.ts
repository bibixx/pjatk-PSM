import * as math from "mathjs";

const solveEquation = (A: math.Matrix, B: math.Matrix) => {
  console.time("INVERT");
  const A1 = math.inv(A);
  console.timeEnd("INVERT");

  console.time("MULTIPLY");
  const S = math.multiply(A1, B);
  console.timeEnd("MULTIPLY");

  return S;
};

const format = (m: math.Matrix) => {
  return m
    .toArray()
    .map((a) => {
      const paddedA = Array.isArray(a) ? a.map((innerA) => innerA.toString().padStart(2, " ")) : a;

      return `| ${paddedA} |`;
    })
    .join("\n");
};

const x_max = 10;
const y_max = 10;

const BOTTOM = 150;
const LEFT = 100;
const TOP = 200;
const RIGHT = 50;

type Point = [x: number, y: number];

const getTemperature = ([x, y]: Point): number | undefined => {
  if (x !== 0 && x !== x_max && y !== 0 && y !== y_max) {
    return undefined;
  }

  if (x === 0) {
    return LEFT;
  }

  if (x === x_max) {
    return RIGHT;
  }

  if (y === 0) {
    return BOTTOM;
  }

  if (y === y_max) {
    return TOP;
  }
};

const getOnBottom = ([x, y]: Point): Point => {
  return [x, y - 1];
};
const getOnTop = ([x, y]: Point): Point => {
  return [x, y + 1];
};
const getOnLeft = ([x, y]: Point): Point => {
  return [x - 1, y];
};
const getOnRight = ([x, y]: Point): Point => {
  return [x + 1, y];
};

const sumDefined = (numbers: (number | undefined)[]) =>
  numbers.filter((n): n is number => n !== undefined).reduce((acc, n) => acc + n, 0);

const SIZE = x_max * y_max - x_max - y_max + 1;
const A = math.matrix(math.zeros(SIZE, SIZE));
const B = math.matrix(math.zeros(SIZE));

const linearalizePoint = ([x, y]: Point) => x - 1 + (y - 1) * (x_max - 1);

console.time("TOTAL");
console.time("FILL MATRIX");
for (let y = 1; y < y_max; y++) {
  for (let x = 1; x < x_max; x++) {
    const point: Point = [x, y];
    const topPoint = getOnTop(point);
    const bottomPoint = getOnBottom(point);
    const leftPoint = getOnLeft(point);
    const rightPoint = getOnRight(point);
    const topTemp = getTemperature(topPoint);
    const bottomTemp = getTemperature(bottomPoint);
    const leftTemp = getTemperature(leftPoint);
    const rightTemp = getTemperature(rightPoint);

    A.set([linearalizePoint(point), linearalizePoint(point)], -4);
    if (topTemp === undefined) {
      A.set([linearalizePoint(topPoint), linearalizePoint(point)], 1);
    }
    if (bottomTemp === undefined) {
      A.set([linearalizePoint(bottomPoint), linearalizePoint(point)], 1);
    }
    if (leftTemp === undefined) {
      A.set([linearalizePoint(leftPoint), linearalizePoint(point)], 1);
    }
    if (rightTemp === undefined) {
      A.set([linearalizePoint(rightPoint), linearalizePoint(point)], 1);
    }

    const sum = sumDefined([topTemp, bottomTemp, leftTemp, rightTemp]);
    B.set([linearalizePoint(point)], -sum);
  }
}
console.timeEnd("FILL MATRIX");

console.time("SOLVE");
const S = solveEquation(A, B);
console.timeEnd("SOLVE");
console.timeEnd("TOTAL");
// console.log(format(A));
// console.log(format(B));
// for (let y = 1; y < y_max; y++) {
//   for (let x = 1; x < x_max; x++) {
//     const point: Point = [x, y];
//     const linearPosition = linearalizePoint(point);

//     console.log([x, y], S.get([linearPosition, 0]));
//   }
// }

// console.log(S.toArray().length);
