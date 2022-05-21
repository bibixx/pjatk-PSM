import * as math from "mathjs";
import p5 from "p5";

/* ================= PARAMETERS ================= */
const BOTTOM = 150;
const LEFT = 100;
const TOP = 50;
const RIGHT = 200;
const SIZE = 10;

/* ================= PROGRAM ================= */
// Nie używamy "sparse" (które nie trzyma '0' w pamięci) gdyż z jakiegoś powodu odwracanie macierzy jest wtedy 2 razy wolniejsze
const A = math.matrix(math.zeros(SIZE ** 2, SIZE ** 2));
const B = math.matrix(math.zeros(SIZE ** 2));

for (let y = 1; y <= SIZE; y++) {
  for (let x = 1; x <= SIZE; x++) {
    const point: Point = [x, y];
    const topPoint = getPointOnTop(point);
    const bottomPoint = getPointOnBottom(point);
    const leftPoint = getPointOnLeft(point);
    const rightPoint = getPointOnRight(point);
    const topTemp = getTemperature(topPoint);
    const bottomTemp = getTemperature(bottomPoint);
    const leftTemp = getTemperature(leftPoint);
    const rightTemp = getTemperature(rightPoint);

    A.set([linearizePointWithoutEdges(point), linearizePointWithoutEdges(point)], -4);
    if (topTemp === undefined) {
      A.set([linearizePointWithoutEdges(topPoint), linearizePointWithoutEdges(point)], 1);
    }
    if (bottomTemp === undefined) {
      A.set([linearizePointWithoutEdges(bottomPoint), linearizePointWithoutEdges(point)], 1);
    }
    if (leftTemp === undefined) {
      A.set([linearizePointWithoutEdges(leftPoint), linearizePointWithoutEdges(point)], 1);
    }
    if (rightTemp === undefined) {
      A.set([linearizePointWithoutEdges(rightPoint), linearizePointWithoutEdges(point)], 1);
    }

    const sum = sumDefined([topTemp, bottomTemp, leftTemp, rightTemp]);
    B.set([linearizePointWithoutEdges(point)], -sum);
  }
}

const S = solveEquation(A, B);

/* ================= UTILS ================= */
function solveEquation(A: math.Matrix, B: math.Matrix) {
  const A1 = math.inv(A);
  const S = math.multiply(A1, B);

  return S;
}

function stringifyMatrix(m: math.Matrix) {
  return m
    .toArray()
    .map((a) => {
      const paddedA = Array.isArray(a) ? a.map((innerA) => innerA.toString().padStart(2, " ")) : a;

      return `| ${paddedA} |`;
    })
    .join("\n");
}

type Point = [x: number, y: number];

function getPointOnBottom([x, y]: Point): Point {
  return [x, y - 1];
}
function getPointOnTop([x, y]: Point): Point {
  return [x, y + 1];
}
function getPointOnLeft([x, y]: Point): Point {
  return [x - 1, y];
}
function getPointOnRight([x, y]: Point): Point {
  return [x + 1, y];
}

function sumDefined(numbers: (number | undefined)[]) {
  return numbers.filter((n): n is number => n !== undefined).reduce((acc, n) => acc + n, 0);
}

function linearizePointWithoutEdges([x, y]: Point) {
  return x - 1 + (y - 1) * SIZE;
}
function linearizePoint([x, y]: Point) {
  return x + y * (SIZE + 2);
}

function getTemperature([x, y]: Point): number | undefined {
  if (x !== 0 && x !== SIZE + 1 && y !== 0 && y !== SIZE + 1) {
    return undefined;
  }

  if (x === 0) {
    return LEFT;
  }

  if (x === SIZE + 1) {
    return RIGHT;
  }

  if (y === 0) {
    return BOTTOM;
  }

  if (y === SIZE + 1) {
    return TOP;
  }
}

/* ================= DRAW ================= */
const sketch = (p: p5) => {
  p.setup = function () {
    p.createCanvas(SIZE + 2, SIZE + 2);
    p.noLoop();
  };

  p.draw = function () {
    p.background(0);
    p.pixelDensity(1);

    const minValue = Math.min(BOTTOM, LEFT, TOP, RIGHT);
    const maxValue = Math.max(BOTTOM, LEFT, TOP, RIGHT);

    p.loadPixels();

    for (let y = 0; y <= SIZE + 1; y++) {
      for (let x = 0; x <= SIZE + 1; x++) {
        if ((x === 0 || x === SIZE + 1) && (x === y || x === SIZE + 1 - y)) {
          continue;
        }

        const point: Point = [x, y];
        const canvasPoint: Point = [x, SIZE + 1 - y];
        const temp = getTemperature(point) ?? S.get([linearizePointWithoutEdges(point)]);
        const linearPosition = linearizePoint(canvasPoint) * 4;
        const red = p.map(temp, minValue, maxValue, 200, 30);
        const green = p.map(temp, minValue, maxValue, 30, 255);
        const blue = 0;

        p.pixels[linearPosition] = red;
        p.pixels[linearPosition + 1] = green;
        p.pixels[linearPosition + 2] = blue;
        p.pixels[linearPosition + 3] = 255;
      }
    }
    p.updatePixels();
  };
};

new p5(sketch);
