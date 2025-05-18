const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const frequencies = {
      green: 329.63,
      red: 261.63,
      yellow: 220,
      blue: 164.81
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
    let record = localStorage.getItem('record') || 0;
    let acceptingInput = false;

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function playSound(color) {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.frequency.value = frequencies[color];
      oscillator.type = 'sine';
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.3);
    }

    async function flashButton(color) {
      buttons[color].classList.add('light-on');
      playSound(color);
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
      updateScoreboard();
      message.textContent = '';
      gameOverScreen.style.display = 'none';
    }

    function updateScoreboard() {
      scoreboard.textContent = `Pontuação: ${score} | Recorde: ${record}`;
    }

    async function nextRound() {
      sequence.push(getRandomColor());
      updateScoreboard();
      await playSequence();
    }

    function handlePlayerClick(color) {
      if (!acceptingInput) return;
      playerSequence.push(color);
      buttons[color].classList.add('light-on');
      playSound(color);
      setTimeout(() => buttons[color].classList.remove('light-on'), 200);

      const index = playerSequence.length - 1;

      if (playerSequence[index] !== sequence[index]) {
        gameOver();
        return;
      }

      if (playerSequence.length === sequence.length) {
        score++;
        if (score > record) {
          record = score;
          localStorage.setItem('record', record);
        }
        acceptingInput = false;
        message.textContent = 'Muito bem! Próxima rodada...';
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

    updateScoreboard();
