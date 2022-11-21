const state = {
  numCells: (600 / 40) * (600 / 40),
  cells: [],
  shipPosition: 217,
  alienPosition: [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 18, 19, 20, 21, 22, 23, 24, 25, 26, 33, 34, 35,
    36, 37, 38, 39, 40, 41, 48, 49, 50, 51, 52, 53, 54, 55, 56,
  ],
  score: 0,
};

// helper functions
const setupGame = (element) => {
  state.elements = element;
  // draw grid
  drawGrid();
  // draw the space ships
  drawShip();
  // draw the aliens
  drawAliens();
  // add instructions and scores
  drawScoreBoard();
};

const drawGrid = () => {
  // create the elements
  const grid = document.createElement("div");
  grid.classList.add("grids");
  // create cells 15*15=225
  for (i = 0; i < state.numCells; i++) {
    // create cells
    const cell = document.createElement("div");
    // append cells in grid
    grid.append(cell);
    // store cell in the state
    state.cells.push(cell);
  }

  // append the grid into the app
  state.elements.append(grid);
};

const drawShip = () => {
  // append ship in middle cell
  state.cells[state.shipPosition].classList.add("spaceship");
};

const controllShip = (e) => {
  // if the keypress is left
  console.log(e);
  if (e.key === "ArrowLeft") {
    moveShip("left");
    // if keypress is right
  } else if (e.key === "ArrowRight") {
    moveShip("right");
    // if keypress is space
  } else if (e.code === "Space") {
    fire();
  }
};

const moveShip = (direction) => {
  state.cells[state.shipPosition].classList.remove("spaceship");
  if (direction === "left" && state.shipPosition > 210) {
    state.shipPosition--;
  } else if (direction === "right" && state.shipPosition < 224) {
    state.shipPosition++;
  }
  // add image to new position
  state.cells[state.shipPosition].classList.add("spaceship");
};

const play = () => {
  // start aliens moving
  let interval;
  // set aliens starting position
  let direction = "right";
  // set interval to repeating the movements of the aliens
  interval = setInterval(() => {
    let movement;
    // if aliens are at right
    if (direction === "right") {
      // if aliens are at edge increase by 1
      if (atEdge("right")) {
        movement = 15 - 1;
        direction = "left";
      } else {
        movement = 1;
      }
      // if aliens are at left
    } else if (direction === "left") {
      // if aliens are at edge decrease by 1
      if (atEdge("left")) {
        movement = 15 + 1;
        direction = "right";
      } else {
        movement = -1;
      }
    }
    // update the position of the aliens
    state.alienPosition = state.alienPosition.map(
      (position) => position + movement
    );
    // redraw the aliens
    drawAliens();
    // check game over
    checkGame(interval);
  }, 400);
  window.addEventListener("keydown", controllShip);
};

const atEdge = (side) => {
  if (side === "left") {
    return state.alienPosition.some((position) => position % 15 === 0);
  } else if (side === "right") {
    return state.alienPosition.some((position) => position % 15 === 14);
  }
};

const checkGame = (interval) => {
  // if no aliens are left
  if (state.alienPosition.length === 0) {
    // clear interval
    clearInterval(interval);
    // set game position
    state.gameOver = true;
    // write message
    displayMessage("Humans win!!!");
  } else if (
    state.alienPosition.some((position) => position >= state.shipPosition)
  ) {
    clearInterval(interval);
    state.gameOver = true;
    // make ship go boom
    state.cells[state.shipPosition].classList.remove("spaceship");
    state.cells[state.shipPosition].classList.add("hit");
    displayMessage("GAME OVER!!!");
  }
};

const displayMessage = (message) => {
  const messageEl = document.createElement("div");
  messageEl.classList.add("message");

  // creating h1 element to append message
  const h1 = document.createElement("h1");
  h1.innerText = message;
  messageEl.append(h1);
  // appending h1 to the app element
  state.elements.append(messageEl);
};

const fire = () => {
  // use an interval
  let interval;
  // laser start positon
  let laserPosition = state.shipPosition;
  interval = setInterval(() => {
    // remove laser image
    state.cells[laserPosition].classList.remove("laser");
    // decrease the position of the laser, move row above
    laserPosition -= 15;
    // stay within the grids
    if (laserPosition < 0) {
      clearInterval(interval);
      return;
    }

    // hit the aliens, remove the aliens, add explosion image, clear the interval, clear the laser
    if (state.alienPosition.includes(laserPosition)) {
      clearInterval(interval);
      state.alienPosition.splice(state.alienPosition.indexOf(laserPosition), 1);
      state.cells[laserPosition].classList.remove("aliens", "laser");
      state.cells[laserPosition].classList.add("hit");
      state.score++;
      state.scoreElement.innerText = state.score;
      setTimeout(() => {
        state.cells[laserPosition].classList.remove("hit");
      }, 200);
      return;
    }
    // add laser image
    state.cells[laserPosition].classList.add("laser");
  }, 100);
};

const drawAliens = () => {
  // add aliens image to the grids
  // loop through cells, remove, and add class name to corresponding cell.
  state.cells.forEach((cell, index) => {
    // reset: if cell index is currently an alien position remove it
    if (cell.classList.contains("aliens")) {
      cell.classList.remove("aliens");
    }
    // update: if cell index is an alien position, add alien class
    if (state.alienPosition.includes(index)) {
      cell.classList.add("aliens");
    }
  });
};

const drawScoreBoard = () => {
  const heading = document.createElement("h1");
  heading.innerText = "Space Invaders";
  const paragraph = document.createElement("p");
  paragraph.innerText = "Press Space To Shoot";
  const paragraph2 = document.createElement("p");
  paragraph2.innerText = "Press < and > to move";
  const scoreBoard = document.createElement("div");
  scoreBoard.classList.add("scoreboard");
  const scoreEl = document.createElement("span");
  scoreEl.innerText = state.score;
  const heading2 = document.createElement("h2");
  heading2.innerText = "Score:";
  heading2.append(scoreEl);
  scoreBoard.append(heading, paragraph, paragraph2, heading2);

  state.scoreElement = scoreEl;
  state.elements.append(scoreBoard);
};

// query selectors
const appElement = document.querySelector(".app");

setupGame(appElement);

play();
