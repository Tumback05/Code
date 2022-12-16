const canvas = document.querySelector("#playground");
const player = document.querySelector("#player");
const scoretxt = document.querySelector("#score");
const gameoverContainer = document.querySelector("#gameover-container");
const gameoverSubtitle = document.querySelector("#gameover-sub");
const spawnProtection = document.querySelector("#spawnprotection");
const backgroundMusic = new Audio("sounds/background.mp3");
const deathSound = new Audio("sounds/death.wav");
const destroySound = new Audio("sounds/destroy.wav");
const winx = window.innerWidth / 2; // X Koordinaten von der Mitte des Bildschirms
const winy = window.innerHeight / 2; // Y Koordinaten von der Mitte des Bildschirms
let timer = new Timer(120);
let speed = 80;
let score = 0;
let isRunning = true;

player.style.left = winx + "px";
player.style.top = winy + "px";
backgroundMusic.play();
backgroundMusic.volume = 0.3;
deathSound.volume = 0.4;
destroySound.volume = 0.4;

function spawnEnemy() {
  let enemy = document.createElement("img");
  enemy.setAttribute("src", "img/" + rand(3) + ".png");
  enemy.classList.add("enemy" + rand(3));
  canvas.appendChild(enemy);

  enemy.style.left = rand(winx * 2) - 10 + "px";
  enemy.style.top = rand(winy * 2) - 10 + "px";
  checkSpawnpos(enemy);

  enemy.addEventListener("click", function destroyEnemy() {
    score++;
    scoretxt.innerHTML = "Your Score: " + score;
    canvas.removeChild(enemy);
    handleExplosion(enemy);
  });
}

function checkSpawnpos(enemy) {
  // Erstellt eine Boundingbox um das Objekt. Koordinaten können mit top, bottom, left und right abgerufen werden
  const protectionRect = spawnProtection.getBoundingClientRect();
  const enemyRect = enemy.getBoundingClientRect();
  if (
    // Überprüft, ob der Gegner in der Protectionzone gespawn wird
    enemyRect.top > protectionRect.top &&
    enemyRect.bottom < protectionRect.bottom &&
    enemyRect.left > protectionRect.left &&
    enemyRect.right < protectionRect.right
  ) {
    // Wenn ja zerstören und direkt einen neuen Gegner spawnen
    enemy.parentNode.removeChild(enemy);
    spawnEnemy();
  }
}

function handleExplosion(enemy) {
  const explosionAnim = document.createElement("img");
  destroySound.play();
  explosionAnim.setAttribute("src", "img/explosion.gif");
  explosionAnim.classList.add("explosion-animation");
  explosionAnim.style.left = enemy.style.left;
  explosionAnim.style.top = enemy.style.top;
  explosionAnim.style.height = "80px";
  canvas.appendChild(explosionAnim);
  setTimeout(function () {
    // Sobald die Animation fertig ist (600ms) wird sie wieder zerstört
    canvas.removeChild(explosionAnim);
  }, 600);
}

function moveEnemy() {
  // Erstellt eine Liste mit allen Objekten die das Wort: enemy in der Class haben
  const enemies = document.querySelectorAll('[class^="enemy"]');
  for (let enemy of enemies) {
    const deg = angleDeg(
      parseInt(winx),
      parseInt(winy),
      parseInt(enemy.style.left),
      parseInt(enemy.style.top)
    );
    let distance = getDistance(enemy);
    let gegenkathete = (Math.sin(deg) * distance) / speed;
    let ankathete = (Math.cos(deg) * distance) / speed;
    enemy.style.left = parseInt(enemy.style.left) + ankathete + "px";
    enemy.style.top = parseInt(enemy.style.top) - gegenkathete + "px";
  }
}

function getDistance(enemy) {
  let enemyx = parseInt(enemy.style.left);
  let enemyy = parseInt(enemy.style.top);
  // Die Distanz zwischen Gegner und Spieler berechnen
  // √[(x₂ - x₁)² + (y₂ - y₁)²]
  return Math.sqrt((enemyx - winx) ** 2 + (enemyy - winy) ** 2);
}

function checkCollision() {
  // Erstellt eine Liste mit allen Objekten die das Wort: enemy in der Class haben
  const enemies = document.querySelectorAll('[class^="enemy"]');
  if (anyCollision(player, enemies)) {
    deathSound.play();
    canvas.innerHTML = " ";
    isRunning = false;
    scoretxt.style.display = "none";
    gameoverContainer.style.display = "flex";
    gameoverSubtitle.innerHTML = "Your score was: " + score;
  }
}

function rand(amount) {
  // Generiert eine Zufallszahl
  return Math.floor(Math.random() * amount);
}

function loop() {
  if (timer.ready() && isRunning) {
    spawnEnemy();
  }
  moveEnemy();
  checkCollision();
  if (score >= 10) {
    speed = 60;
  } else if (score >= 20) {
    timer = 90;
  }
  window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);
