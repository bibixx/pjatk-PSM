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
  const dataPoints = [];

  for (let i = 0; i <= range; i++) {
    const t = i * dt;

    const s_x = s_0.x + V_0.x * t + (g.x * t * t) / 2;
    const s_y = s_0.y + V_0.y * t + (g.y * t * t) / 2;

    dataPoints.push({
      s: new Vector(s_x, s_y),
      V: new Vector(0, 0),
      a: new Vector(0, 0),
    });
  }

  return dataPoints;
};
