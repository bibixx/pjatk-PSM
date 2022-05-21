/* ================= UI ================= */
let SIZE_X = 50;
let SIZE_Y = 40;
let ANIMATION_FRAME_LENGTH = 100;

let currentState = getStateArray();
const getInitialRules = (): Record<"alive" | "dead", Record<number, boolean>> => ({
  alive: {
    0: false,
    1: false,
    2: true,
    3: true,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
  },
  dead: {
    0: false,
    1: false,
    2: false,
    3: true,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
  },
});
let currentRules = getInitialRules();

const updateState = (oldState: boolean[][]) => {
  const newState = getStateArray();

  for (let y = 0; y < oldState.length; y++) {
    for (let x = 0; x < oldState[y].length; x++) {
      const point: Point = [x, y];
      const neighboursStates = [
        getPointState(getTopNeighbourPosition(point), oldState),
        getPointState(getBottomNeighbourPosition(point), oldState),
        getPointState(getLeftNeighbourPosition(point), oldState),
        getPointState(getRightNeighbourPosition(point), oldState),
        getPointState(getTopLeftNeighbourPosition(point), oldState),
        getPointState(getTopRightNeighbourPosition(point), oldState),
        getPointState(getBottomLeftNeighbourPosition(point), oldState),
        getPointState(getBottomRightNeighbourPosition(point), oldState),
      ] as const;

      const aliveNeighbours = countNeighbours(neighboursStates);
      const currentCellState = oldState[y][x] ? "alive" : "dead";
      const newCellState = currentRules[currentCellState][aliveNeighbours];

      newState[y][x] = newCellState;
    }
  }

  return newState;
};

/* ================= UI ================= */
const $gameBoard = document.querySelector<HTMLDivElement>("#game-board")!;
let cellCheckboxes: HTMLInputElement[][] = [];

function drawBoard() {
  $gameBoard.style.gridTemplateColumns = `repeat(${SIZE_X}, 13px)`;
  $gameBoard.style.gridTemplateRows = `repeat(${SIZE_Y}, 13px)`;

  cellCheckboxes.forEach((row) => row.forEach(($cell) => $cell.remove()));
  cellCheckboxes = Array.from({ length: SIZE_Y }, (_, y) =>
    Array.from({ length: SIZE_X }, (__, x) => {
      const $input = document.createElement("input");
      $input.type = "checkbox";

      $gameBoard.appendChild($input);

      $input.addEventListener("click", (e) => {
        currentState[y][x] = (e.target as HTMLInputElement).checked;
      });

      return $input;
    })
  );
}
drawBoard();

function drawState(state: boolean[][]) {
  for (let y = 0; y < state.length; y++) {
    for (let x = 0; x < state[y].length; x++) {
      const element = state[y][x];

      cellCheckboxes[y][x].checked = element;
    }
  }
}

document.querySelector("#clearBoard")!.addEventListener("click", () => {
  currentState = getStateArray();
  drawState(currentState);
  pause();
});

const iterate = () => {
  currentState = updateState(currentState);
  drawState(currentState);
};

const $toggleAnimationButton = document.querySelector("#toggleAnimation")!;
let playInterval: number | undefined;
const play = () => {
  const runTimeout = () => {
    iterate();

    playInterval = window.setTimeout(runTimeout, ANIMATION_FRAME_LENGTH);
  };

  runTimeout();
  $toggleAnimationButton.textContent = "Pause";
};
const pause = () => {
  window.clearTimeout(playInterval);
  $toggleAnimationButton.textContent = "Play";
  playInterval = undefined;
};

$toggleAnimationButton.addEventListener("click", () => {
  if (playInterval === undefined) {
    play();
    return;
  }

  pause();
});

document.querySelector("#iterateOnce")!.addEventListener("click", () => {
  pause();
  iterate();
});

const $aliveRulesContainer = document.querySelector("#alive")!;
const $deadRulesContainer = document.querySelector("#dead")!;
const ruleStates = ["alive", "dead"] as const;
const rulesCheckboxes = ruleStates.map((state) =>
  Array.from({ length: 9 }, (_, i) => {
    const $rulesContainer = state === "alive" ? $aliveRulesContainer : $deadRulesContainer;
    const $input = document.createElement("input");
    $input.type = "checkbox";

    $input.checked = currentRules[state][i];
    $rulesContainer.appendChild($input);

    $input.addEventListener("click", (e) => {
      currentRules[state][i] = (e.target as HTMLInputElement).checked;
    });

    return $input;
  })
);

document.querySelector("#resetRules")!.addEventListener("click", () => {
  currentRules = getInitialRules();

  rulesCheckboxes[0].forEach(($checkbox, i) => {
    $checkbox.checked = currentRules.alive[i];
  });
  rulesCheckboxes[1].forEach(($checkbox, i) => {
    $checkbox.checked = currentRules.dead[i];
  });
});

const resizeBoard = (sizeX: number, sizeY: number) => {
  $sizeXInput.valueAsNumber = sizeX;
  $sizeXRange.valueAsNumber = sizeX;
  $sizeYInput.valueAsNumber = sizeY;
  $sizeYRange.valueAsNumber = sizeY;

  SIZE_X = sizeX;
  SIZE_Y = sizeY;

  const newState = getStateArray();
  const mergedStates = newState.map((row, y) => row.map((cell, x) => currentState?.[y]?.[x] || cell));
  currentState = mergedStates;

  drawBoard();
  drawState(currentState);
};

const $sizeXRange = document.querySelector<HTMLInputElement>("#size_x_range")!;
const $sizeXInput = document.querySelector<HTMLInputElement>("#size_x")!;
$sizeXRange.valueAsNumber = SIZE_X;
$sizeXInput.valueAsNumber = SIZE_X;
$sizeXRange.addEventListener("input", () => {
  resizeBoard($sizeXRange.valueAsNumber, SIZE_Y);
});
$sizeXInput.addEventListener("input", () => {
  resizeBoard($sizeXInput.valueAsNumber, SIZE_Y);
});

const $sizeYRange = document.querySelector<HTMLInputElement>("#size_y_range")!;
const $sizeYInput = document.querySelector<HTMLInputElement>("#size_y")!;
$sizeYRange.valueAsNumber = SIZE_Y;
$sizeYInput.valueAsNumber = SIZE_Y;
$sizeYRange.addEventListener("input", (e) => {
  resizeBoard(SIZE_X, $sizeYRange.valueAsNumber);
});
$sizeYInput.addEventListener("input", (e) => {
  resizeBoard(SIZE_X, $sizeYInput.valueAsNumber);
});

const $animationSpeedRange = document.querySelector<HTMLInputElement>("#animation_speed")!;
const $animationSpeedInput = document.querySelector<HTMLInputElement>("#animation_speed_range")!;
$animationSpeedRange.valueAsNumber = ANIMATION_FRAME_LENGTH;
$animationSpeedInput.valueAsNumber = ANIMATION_FRAME_LENGTH;
$animationSpeedRange.addEventListener("input", () => {
  ANIMATION_FRAME_LENGTH = $animationSpeedRange.valueAsNumber;
  $animationSpeedInput.valueAsNumber = $animationSpeedRange.valueAsNumber;
});
$animationSpeedInput.addEventListener("input", () => {
  ANIMATION_FRAME_LENGTH = $animationSpeedInput.valueAsNumber;
  $animationSpeedRange.valueAsNumber = $animationSpeedInput.valueAsNumber;
});

/* ================= UTILS ================= */
function getTopNeighbourPosition([x, y]: Point): Point {
  const adjustedY = y === 0 ? SIZE_Y - 1 : y - 1;

  return [x, adjustedY];
}
function getBottomNeighbourPosition([x, y]: Point): Point {
  const adjustedY = y === SIZE_Y - 1 ? 0 : y + 1;

  return [x, adjustedY];
}
function getLeftNeighbourPosition([x, y]: Point): Point {
  const adjustedX = x === 0 ? SIZE_X - 1 : x - 1;

  return [adjustedX, y];
}
function getRightNeighbourPosition([x, y]: Point): Point {
  const adjustedX = x === SIZE_X - 1 ? 0 : x + 1;

  return [adjustedX, y];
}

function getTopLeftNeighbourPosition(point: Point): Point {
  return getLeftNeighbourPosition(getTopNeighbourPosition(point));
}
function getTopRightNeighbourPosition(point: Point): Point {
  return getRightNeighbourPosition(getTopNeighbourPosition(point));
}
function getBottomLeftNeighbourPosition(point: Point): Point {
  return getLeftNeighbourPosition(getBottomNeighbourPosition(point));
}
function getBottomRightNeighbourPosition(point: Point): Point {
  return getRightNeighbourPosition(getBottomNeighbourPosition(point));
}
function getPointState([x, y]: Point, state: boolean[][]) {
  return state[y][x];
}

function countNeighbours(
  array: readonly [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean]
) {
  return array.reduce((acc, value) => acc + (value ? 1 : 0), 0);
}

type Point = [number, number];

function getStateArray() {
  return Array.from({ length: SIZE_Y }, () => Array.from({ length: SIZE_X }, () => false));
}

/* ================= PRESETS ================= */

const PRESETS = {
  // prettier-ignore
  Oscillators: [[2,2],[2,3],[2,4],[6,16],[6,17],[6,18],[7,16],[7,18],[8,16],[8,17],[8,18],[9,3],[9,4],[9,5],[9,16],[9,17],[9,18],[10,2],[10,3],[10,4],[10,16],[10,17],[10,18],[11,16],[11,17],[11,18],[12,16],[12,18],[13,16],[13,17],[13,18],[15,3],[15,4],[16,3],[16,4],[17,5],[17,6],[18,5],[18,6],[22,21],[22,22],[22,23],[22,27],[22,28],[22,29],[24,19],[24,24],[24,26],[24,31],[25,19],[25,24],[25,26],[25,31],[26,19],[26,24],[26,26],[26,31],[27,21],[27,22],[27,23],[27,27],[27,28],[27,29],[29,21],[29,22],[29,23],[29,27],[29,28],[29,29],[30,19],[30,24],[30,26],[30,31],[31,19],[31,24],[31,26],[31,31],[32,19],[32,24],[32,26],[32,31],[34,21],[34,22],[34,23],[34,27],[34,28],[34,29]],
  // prettier-ignore
  Spaceships: [[1,4],[1,10],[1,16],[1,22],[1,28],[1,34],[2,5],[2,11],[2,17],[2,23],[2,29],[2,35],[3,3],[3,4],[3,5],[3,9],[3,10],[3,11],[3,15],[3,16],[3,17],[3,21],[3,22],[3,23],[3,27],[3,28],[3,29],[3,33],[3,34],[3,35]],
};

const $presetsContainer = document.querySelector("#presets")!;
(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).forEach((preset) => {
  const $button = document.createElement("button");
  $button.textContent = preset;

  $button.addEventListener("click", () => {
    applyPreset(preset);
  });

  $presetsContainer.appendChild($button);
});

function applyPreset(presetName: keyof typeof PRESETS) {
  const preset = PRESETS[presetName];
  pause();

  resizeBoard(Math.max(40, SIZE_X), Math.max(40, SIZE_Y));
  currentState = getStateArray();

  preset.forEach(([y, x]) => (currentState[y][x] = true));

  drawState(currentState);
}

(window as any).getCurrentState = () => {
  const alive: number[][] = [];

  for (let y = 0; y < currentState.length; y++) {
    for (let x = 0; x < currentState[y].length; x++) {
      const isAlive = currentState[y][x];

      if (!isAlive) {
        continue;
      }

      alive.push([y, x]);
    }
  }

  return JSON.stringify(alive);
};