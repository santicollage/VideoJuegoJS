const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
  x: undefined,
  y: undefined
};
const giftPosition = {
  x: undefined,
  y: undefined
};
let enemyPositions = [];

window.addEventListener('load', setCanvasSize)
window.addEventListener('resize', setCanvasSize)

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.6;
  } else {
    canvasSize = window.innerHeight * 0.62;
  }

  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);

  elementsSize = canvasSize / 10;

  startGame();
}

function startGame() {
  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';

  const map = maps[level];

  if (!map) {
    gameWin();
    return;
  }

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }

  showLives();

  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));

  enemyPositions = [];
  game.clearRect(0, 0, canvasSize, canvasSize);

  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      let posX = (elementsSize * (colI+1)) + 7;
      let posY = (elementsSize * (rowI+1)) - 7;

      if (col == 'O' && !playerPosition.x && !playerPosition.y) {
        playerPosition.x = posX;
        playerPosition.y = posY;
      } else if (col == 'I') {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col == 'X') {
        enemyPositions.push({
          x: posX,
          y: posY
        });
      }

      game.fillText(emojis[col], posX, posY)
    });  
  });

  movePlayer();
}

function movePlayer() {
  let giftCollisionX = playerPosition.x.toFixed(2) == giftPosition.x.toFixed(2);
  let giftCollisionY = playerPosition.y.toFixed(2) == giftPosition.y.toFixed(2);

  if (giftCollisionX && giftCollisionY) {
    levelWin();
  }

  const enemyCollision = enemyPositions.find(enemy => {
     const enemyCollisionX = enemy.x.toFixed(2) == playerPosition.x.toFixed(2);
     const enemyCollisionY = enemy.y.toFixed(2) == playerPosition.y.toFixed(2);
     return enemyCollisionX && enemyCollisionY;
  });

  if (enemyCollision) {
    levelFail();
  }
  
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y) 
}

function levelWin() {
  level++;
  startGame();
}
function levelFail() {
  lives--;

  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function gameWin() {
  console.log('Terminasteeee')
  clearInterval(timeInterval);

  const recordTime = localStorage.getItem('record_time')
  const playerTime = Date.now() - timeStart;

  if (recordTime) {
    if (recordTime >= playerTime) {
      localStorage.setItem('record_time', playerTime);
      pResult.innerHTML = 'Superaste el record'
    } else {
      pResult.innerHTML = 'Lo siento, no superaste el record'
    }
  } else {
    localStorage.setItem('record_time', playerTime)
  }
  console.log({recordTime, playerTime})
}

function showLives() {
  const heartsArray = Array(lives).fill(emojis['HEART'])

  spanLives.innerHTML = "";
  heartsArray.forEach(heart => spanLives.append(heart));
}

function showTime() {
  spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
  spanRecord.innerHTML = localStorage.getItem('record_time')
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
  if (event.code == 'ArrowUp') moveUp();
  else if (event.code == 'ArrowLeft') moveLeft();
  else if (event.code == 'ArrowRight') moveRight();
  else if (event.code == 'ArrowDown') moveDown();
}
function moveUp() {
  if ((playerPosition.y - elementsSize) > 0) {
    playerPosition.y -= elementsSize;
    startGame();
  }
}
function moveLeft() {
  if ((playerPosition.x - elementsSize) > elementsSize) {
    playerPosition.x -= elementsSize;
    startGame();
  }
}
function moveRight() {
  if ((playerPosition.x + elementsSize) < (canvasSize + elementsSize)) {
    playerPosition.x += elementsSize;
    startGame();
  }
}
function moveDown() {
  if ((playerPosition.y + elementsSize) < canvasSize) {
    playerPosition.y += elementsSize;
    startGame();
  }
}