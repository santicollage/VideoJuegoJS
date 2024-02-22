const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');

let canvasSize;
let elementsSize;

const playerPosition = {
  x: undefined,
  y: undefined
}
const giftPosition = {
  x: undefined,
  y: undefined
}

window.addEventListener('load', setCanvasSize)
window.addEventListener('resize', setCanvasSize)

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.6;
  } else {
    canvasSize = window.innerHeight * 0.6;
  }

  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);

  elementsSize = canvasSize / 10;

  startGame();
}

function startGame() {
  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';

  const map = maps[1]
  const mapRows = map.trim().split('\n')
  const mapRowCols = mapRows.map(row => row.trim().split(''));

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
    console.log('Subiste de nivel')
  }
  
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y) 
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