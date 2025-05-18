const sounds = {
  green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
  red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
  yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
  blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
};

const buttons = {
  green: document.getElementById('green'),
  red: document.getElementById('red'),
  yellow: document.getElementById('yellow'),
  blue: document.getElementById('blue')
};

const scoreboard = document.getElementById('scoreboard');
const message = document.getElementById('message');
const startBtn = document.getElementById('start-btn');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScore = document.getElementById('final-score');
const retryBtn = document.getElementById('retry-btn');

let sequence = [];
let playerSequence = [];
let score = 0;
let acceptingInput = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function flashButton(color) {
  buttons[color].classList.add('light-on');
  sounds[color].currentTime = 0;
  sounds[color].play();
  await sleep(600);
  buttons[color].classList.remove('light-on');
  await sleep(200);
}

async function playSequence() {
  acceptingInput = false;
  message.textContent = 'Observe a sequência...';
  for (let color of sequence) {
    await flashButton(color);
  }
  acceptingInput = true;
  playerSequence = [];
  message.textContent = 'Sua vez!';
}

function getRandomColor() {
  const colors = Object.keys(buttons);
  return colors[Math.floor(Math.random() * colors.length)];
}

function resetGame() {
  sequence = [];
  playerSequence = [];
  score = 0;
  scoreboard.textContent = `Pontuação: ${score}`;
  message.textContent = '';
  gameOverScreen.style.display = 'none';
}

async function nextRound() {
  sequence.push(getRandomColor());
  scoreboard.textContent = `Pontuação: ${score}`;
  await playSequence();
}

function handlePlayerClick(color) {
  if (!acceptingInput) return;
  playerSequence.push(color);
  buttons[color].classList.add('light-on');
  sounds[color].currentTime = 0;
  sounds[color].play();
  setTimeout(() => buttons[color].classList.remove('light-on'), 200);

  const currentIndex = playerSequence.length - 1;

  if (playerSequence[currentIndex] !== sequence[currentIndex]) {
    gameOver();
    return;
  }

  if (playerSequence.length === sequence.length) {
    score++;
    acceptingInput = false;
    message.textContent = 'Muito bem! Prepare-se para a próxima rodada...';
    setTimeout(() => nextRound(), 1000);
  }
}

function gameOver() {
  finalScore.textContent = `Sua pontuação: ${score}`;
  gameOverScreen.style.display = 'flex';
  acceptingInput = false;
}

startBtn.addEventListener('click', async () => {
  resetGame();
  await sleep(500);
  nextRound();
});

retryBtn.addEventListener('click', async () => {
  resetGame();
  await sleep(500);
  nextRound();
});

for (let color in buttons) {
  buttons[color].addEventListener('click', () => handlePlayerClick(color));
}
