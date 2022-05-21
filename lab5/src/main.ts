/* ================= UI ================= */
let SIZE_X = 60;
let SIZE_Y = 40;
let ANIMATION_FRAME_LENGTH = 100;
let LOOP_EDGES = true;

let isStaringDrawing = false;
let isDrawing = false;
let drawingColor = false;

let currentState = getStateArray();
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

/* ================= UTILS ================= */
function getTopNeighbourPosition([x, y]: Point): Point {
  if (!LOOP_EDGES) {
    return [x, y - 1];
  }

  const adjustedY = y === 0 ? SIZE_Y - 1 : y - 1;
  return [x, adjustedY];
}
function getBottomNeighbourPosition([x, y]: Point): Point {
  if (!LOOP_EDGES) {
    return [x, y + 1];
  }

  const adjustedY = y === SIZE_Y - 1 ? 0 : y + 1;
  return [x, adjustedY];
}
function getLeftNeighbourPosition([x, y]: Point): Point {
  if (!LOOP_EDGES) {
    return [x - 1, y];
  }

  const adjustedX = x === 0 ? SIZE_X - 1 : x - 1;
  return [adjustedX, y];
}
function getRightNeighbourPosition([x, y]: Point): Point {
  if (!LOOP_EDGES) {
    return [x + 1, y];
  }

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
function getPointState([x, y]: Point, state: boolean[][]): boolean {
  if (x < 0 || y < 0 || x >= SIZE_X || y >= SIZE_Y) {
    return false;
  }

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

function getInitialRules(): Record<"alive" | "dead", Record<number, boolean>> {
  return {
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
  };
}

/* ================= PRESETS ================= */
const PRESETS = {
  // prettier-ignore
  Oscillators: [[2,2],[2,3],[2,4],[6,16],[6,17],[6,18],[7,16],[7,18],[8,16],[8,17],[8,18],[9,3],[9,4],[9,5],[9,16],[9,17],[9,18],[10,2],[10,3],[10,4],[10,16],[10,17],[10,18],[11,16],[11,17],[11,18],[12,16],[12,18],[13,16],[13,17],[13,18],[15,3],[15,4],[16,3],[16,4],[17,5],[17,6],[18,5],[18,6],[22,21],[22,22],[22,23],[22,27],[22,28],[22,29],[24,19],[24,24],[24,26],[24,31],[25,19],[25,24],[25,26],[25,31],[26,19],[26,24],[26,26],[26,31],[27,21],[27,22],[27,23],[27,27],[27,28],[27,29],[29,21],[29,22],[29,23],[29,27],[29,28],[29,29],[30,19],[30,24],[30,26],[30,31],[31,19],[31,24],[31,26],[31,31],[32,19],[32,24],[32,26],[32,31],[34,21],[34,22],[34,23],[34,27],[34,28],[34,29]],
  // prettier-ignore
  Spaceships: [[1,4],[1,10],[1,16],[1,22],[1,28],[1,34],[2,5],[2,11],[2,17],[2,23],[2,29],[2,35],[3,3],[3,4],[3,5],[3,9],[3,10],[3,11],[3,15],[3,16],[3,17],[3,21],[3,22],[3,23],[3,27],[3,28],[3,29],[3,33],[3,34],[3,35]],
  // prettier-ignore
  ['Gosper Glider Gun']: [[3,27],[4,25],[4,27],[5,15],[5,16],[5,23],[5,24],[5,37],[5,38],[6,14],[6,18],[6,23],[6,24],[6,37],[6,38],[7,3],[7,4],[7,13],[7,19],[7,23],[7,24],[8,3],[8,4],[8,13],[8,17],[8,19],[8,20],[8,25],[8,27],[9,13],[9,19],[9,27],[10,14],[10,18],[11,15],[11,16]],
  // prettier-ignore
  ['Bi Gun']: [[6,14],[7,13],[7,14],[8,12],[8,13],[9,13],[9,14],[9,17],[9,18],[10,41],[11,41],[11,42],[11,51],[11,52],[12,42],[12,43],[12,51],[12,52],[13,13],[13,14],[13,17],[13,18],[13,37],[13,38],[13,41],[13,42],[14,3],[14,4],[14,12],[14,13],[15,3],[15,4],[15,13],[15,14],[16,14],[17,37],[17,38],[17,41],[17,42],[18,42],[18,43],[19,41],[19,42],[20,41]],
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

  resizeBoard(Math.max(60, SIZE_X), Math.max(40, SIZE_Y));
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

      $input.addEventListener("click", () => {
        currentState[y][x] = $input.checked;
      });

      $input.addEventListener("pointerdown", (e) => {
        isStaringDrawing = true;
      });
      $input.addEventListener("pointerup", (e) => {
        isStaringDrawing = false;
        isDrawing = false;
      });
      $input.addEventListener("mouseleave", (e) => {
        if (isStaringDrawing) {
          isDrawing = true;
          isStaringDrawing = false;
          drawingColor = !$input.checked;

          currentState[y][x] = drawingColor;
          $input.checked = drawingColor;
        }
      });
      $input.addEventListener("mouseenter", (e) => {
        if (isDrawing) {
          currentState[y][x] = drawingColor;
          $input.checked = drawingColor;
        }
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
  if (sizeX === SIZE_X && sizeY === SIZE_Y) {
    return;
  }

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

const $loopEdgesCheckbox = document.querySelector<HTMLInputElement>("#loop-edges")!;
$loopEdgesCheckbox.checked = LOOP_EDGES;
$loopEdgesCheckbox.addEventListener("change", () => {
  LOOP_EDGES = $loopEdgesCheckbox.checked;
});

let oldSizeX = SIZE_X;
let oldSizeY = SIZE_Y;
const $gameContainer = document.querySelector<HTMLInputElement>(".container")!;
const $fullScreenCheckbox = document.querySelector<HTMLInputElement>("#full-screen")!;

function setFullScreen(isOn: boolean) {
  $fullScreenCheckbox.checked = isOn;

  if (isOn) {
    oldSizeX = SIZE_X;
    oldSizeY = SIZE_Y;

    $gameContainer.classList.add("container--full-screen");
    resizeBoard(Math.floor(window.innerWidth / 15), Math.floor(window.innerHeight / 15));

    $sizeXInput.disabled = true;
    $sizeXRange.disabled = true;
    $sizeYInput.disabled = true;
    $sizeYRange.disabled = true;

    return;
  }

  $sizeXInput.disabled = false;
  $sizeXRange.disabled = false;
  $sizeYInput.disabled = false;
  $sizeYRange.disabled = false;

  $gameContainer.classList.remove("container--full-screen");
  resizeBoard(oldSizeX, oldSizeY);
}

$fullScreenCheckbox.addEventListener("change", () => {
  setFullScreen($fullScreenCheckbox.checked);
});

setFullScreen(true);

/* ================= DEBUG ================= */
(window as any).translatePlaintextToPreset = (plaintext: string, [xOffset, yOffset]: Point = [0, 0]) => {
  const preset = plaintext
    .trim()
    .split("\n")
    .map((row, y) =>
      row.split("").reduce<Point[]>((acc, character, x) => {
        if (character === "O") {
          acc.push([y + yOffset, x + xOffset]);
        }

        return acc;
      }, [])
    )
    .flat();

  return JSON.stringify(preset);
};
