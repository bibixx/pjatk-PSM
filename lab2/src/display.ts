import { getDataPoints as getEulerPoints } from "./euler";
import { getDataPoints as getBetterEulerPoints } from "./betterEuler";
import { getDataPoints as getRealPoints } from "./real";
import { CHART_COLORS, Vector } from "./utils";
import { updateTable } from "./table";
declare var Chart: any;

const chart = new Chart(document.getElementById("myChart"), {
  type: "line",
});

const drawChart = (
  eulerDataPoints: ReturnType<typeof getEulerPoints>,
  betterEulerDataPoints: ReturnType<typeof getBetterEulerPoints>,
  realDataPoints: ReturnType<typeof getRealPoints>,
  dt: number
) => {
  const data = {
    labels: eulerDataPoints.map(({ s }) => s.x),
    datasets: [
      {
        label: "Metoda Eulera",
        borderColor: CHART_COLORS.red,
        backgroundColor: CHART_COLORS.red,
        data: eulerDataPoints.map(({ s }) => s.y),
        labels: eulerDataPoints.map(({ s }) => s.x),
      },
      {
        label: "Ulepszona Metoda Eulera",
        borderColor: CHART_COLORS.blue,
        backgroundColor: CHART_COLORS.blue,
        data: betterEulerDataPoints.map(({ s }) => s.y),
        labels: betterEulerDataPoints.map(({ s }) => s.x),
      },
      {
        label: "s = s_0 + V_0 * t + a * t^2/2",
        borderColor: CHART_COLORS.yellow,
        backgroundColor: CHART_COLORS.yellow,
        data: realDataPoints.map(({ s }) => s.y),
        labels: realDataPoints.map(({ s }) => s.x),
      },
      {
        label: "Zero",
        borderColor: CHART_COLORS.purple,
        backgroundColor: CHART_COLORS.purple,
        data: betterEulerDataPoints.map(() => 0),
        labels: betterEulerDataPoints.map((_, i) => i),
      },
    ],
  };

  chart.data.labels = data.labels;
  data.datasets.forEach((_: any, i: number) => {
    chart.data.datasets[i] = chart.data.datasets[i] ?? data.datasets[i];
    chart.data.datasets[i].data = data.datasets[i].data;
    chart.data.datasets[i].labels = data.datasets[i].labels;
  });

  chart.options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear",
        min: 0,
        max: Math.max(
          20,
          ...eulerDataPoints.map(({ s }) => s.x),
          ...betterEulerDataPoints.map(({ s }) => s.x)
        ),
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: window.matchMedia("(prefers-color-scheme: dark)").matches ? "#333" : undefined,
        },
      },
      y: {
        grid: {
          color: window.matchMedia("(prefers-color-scheme: dark)").matches ? "#333" : undefined,
        },
      },
    },
  };
  chart.update();

  updateTable(
    document.querySelector("table#euler")!,
    "Metoda Eulera",
    { label: "t", data: eulerDataPoints.map((_, i) => i * dt) },
    { label: "s<sub>y</sub>", data: eulerDataPoints.map(({ s }) => s.y) },
    { label: "s<sub>x</sub>", data: eulerDataPoints.map(({ s }) => s.x) },
    { label: "V<sub>y</sub>", data: eulerDataPoints.map(({ V }) => V.y) },
    { label: "V<sub>x</sub>", data: eulerDataPoints.map(({ V }) => V.x) },
    { label: "a<sub>y</sub>", data: eulerDataPoints.map(({ a }) => a.y) },
    { label: "a<sub>x</sub>", data: eulerDataPoints.map(({ a }) => a.x) }
  );

  updateTable(
    document.querySelector("table#betterEuler")!,
    "Ulepszona Metoda Eulera",
    { label: "t", data: betterEulerDataPoints.map((_, i) => i * dt) },
    { label: "s<sub>y</sub>", data: betterEulerDataPoints.map(({ s }) => s.y) },
    { label: "s<sub>x</sub>", data: betterEulerDataPoints.map(({ s }) => s.x) },
    { label: "V<sub>y</sub>", data: betterEulerDataPoints.map(({ V }) => V.y) },
    { label: "V<sub>x</sub>", data: betterEulerDataPoints.map(({ V }) => V.x) },
    { label: "a<sub>y</sub>", data: betterEulerDataPoints.map(({ a }) => a.y) },
    { label: "a<sub>x</sub>", data: betterEulerDataPoints.map(({ a }) => a.x) }
  );
};

let dt = 0.1;
let totalT = 2;
const s_0 = new Vector(0, 0);
const V_0 = new Vector(10, 10);
const g = new Vector(0, -10);
const a_0 = g;
let m = 5;
let q = 0;

const getValue = (e: Event) => (e.target as HTMLInputElement).valueAsNumber;

// prettier-ignore
document.querySelector("#dt")!.addEventListener("input", (e) => { dt = getValue(e) });
(document.querySelector("#dt") as HTMLInputElement).valueAsNumber = dt;
// prettier-ignore
document.querySelector("#totalT")!.addEventListener("input", (e) => { totalT = getValue(e) });
(document.querySelector("#totalT") as HTMLInputElement).valueAsNumber = totalT;
// prettier-ignore
document.querySelector("#s_0_x")!.addEventListener("input", (e) => { s_0.x = getValue(e) });
(document.querySelector("#s_0_x") as HTMLInputElement).valueAsNumber = s_0.x;
// prettier-ignore
document.querySelector("#s_0_y")!.addEventListener("input", (e) => { s_0.y = getValue(e); });
(document.querySelector("#s_0_y") as HTMLInputElement).valueAsNumber = s_0.y;
// prettier-ignore
document.querySelector("#V_0_x")!.addEventListener("input", (e) => { V_0.x = getValue(e); });
(document.querySelector("#V_0_x") as HTMLInputElement).valueAsNumber = V_0.x;
// prettier-ignore
document.querySelector("#V_0_y")!.addEventListener("input", (e) => { V_0.y = getValue(e); });
(document.querySelector("#V_0_y") as HTMLInputElement).valueAsNumber = V_0.y;
// prettier-ignore
document.querySelector("#g_x")!.addEventListener("input", (e) => { g.x = getValue(e); });
(document.querySelector("#g_x") as HTMLInputElement).valueAsNumber = g.x;
// prettier-ignore
document.querySelector("#g_y")!.addEventListener("input", (e) => { g.y = getValue(e); });
(document.querySelector("#g_y") as HTMLInputElement).valueAsNumber = g.y;
// prettier-ignore
document.querySelector("#a_0_x")!.addEventListener("input", (e) => { a_0.x = getValue(e); });
(document.querySelector("#a_0_x") as HTMLInputElement).valueAsNumber = a_0.x;
// prettier-ignore
document.querySelector("#a_0_y")!.addEventListener("input", (e) => { a_0.y = getValue(e); });
(document.querySelector("#a_0_y") as HTMLInputElement).valueAsNumber = a_0.y;
// prettier-ignore
document.querySelector("#m")!.addEventListener("input", (e) => { m = getValue(e); });
(document.querySelector("#m") as HTMLInputElement).valueAsNumber = m;
// prettier-ignore
document.querySelector("#q")!.addEventListener("input", (e) => { q = getValue(e); });
(document.querySelector("#q") as HTMLInputElement).valueAsNumber = q;

const paint = () => {
  const range = Math.ceil(totalT / dt);

  const eulerDataPoints = getEulerPoints(dt, range, s_0, V_0, g, m, q);
  const betterEulerDataPoints = getBetterEulerPoints(dt, range, s_0, V_0, g, m, q);
  const realDataPoints = getRealPoints(dt, range, s_0, V_0, g, m, q);
  drawChart(eulerDataPoints, betterEulerDataPoints, realDataPoints, dt);
};

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", paint);
document.querySelectorAll("input").forEach(($el) => $el.addEventListener("input", paint));
paint();
