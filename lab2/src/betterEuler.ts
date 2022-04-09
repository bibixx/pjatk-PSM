import { Vector } from "./utils";

const getS = (dt: number, s: number, V: number) => s + V * dt;
const getV = (dt: number, V: number, A: number) => V + A * dt;
const getFg = (m: number, g: number) => m * g;
const getFo = (q: number, V: number) => -q * V;
const getF = (m: number, g: number, q: number, V: number) => getFg(m, g) + getFo(q, V);
const getA = (m: number, g: number, q: number, V: number) => getF(m, g, q, V) / m;

export const getDataPoints = (
  dt: number,
  range: number,
  s_0: Vector,
  V_0: Vector,
  g: Vector,
  m: number,
  q: number
) => {
  const a_0 = new Vector(getA(m, g.x, q, V_0.x), getA(m, g.y, q, V_0.y));
  const dataPoints = [{ s: s_0, V: V_0, a: a_0 }];

  for (let i = 0; i < range; i++) {
    const lastPoint = dataPoints.at(-1)!;

    const a_x = getA(m, g.x, q, lastPoint.V.x);
    const a_y = getA(m, g.y, q, lastPoint.V.y);

    const V_x_2 = getV(dt / 2, lastPoint.V.x, a_x);
    const V_y_2 = getV(dt / 2, lastPoint.V.y, a_y);

    const a_x_2 = getA(m, g.x, q, lastPoint.V.x);
    const a_y_2 = getA(m, g.y, q, lastPoint.V.x);

    const V_x = getV(dt, lastPoint.V.x, a_x_2);
    const V_y = getV(dt, lastPoint.V.y, a_y_2);

    const s_x = getS(dt, lastPoint.s.x, V_x_2);
    const s_y = getS(dt, lastPoint.s.y, V_y_2);

    dataPoints.push({
      s: new Vector(s_x, s_y),
      V: new Vector(V_x, V_y),
      a: new Vector(a_x, a_y),
    });
  }

  return dataPoints;
};
