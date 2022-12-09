var canvas = document.querySelector("#playground");
var player = document.querySelector("#player");
var scoretxt = document.querySelector("#score");
var gameoverContainer = document.querySelector("#gameover-container");
var gameoverSub = document.querySelector("#gameover-sub");
var spawnProtection = document.querySelector("#spawnprotection");
var winx = window.innerWidth / 2;
var winy = window.innerHeight / 2;
var timer = new Timer(120);
var score = 0;
var speed = 80;
var isRunning = true;

player.style.left = winx + "px";
player.style.top = winy + "px";

function spawnEnemy() {
  var enemy = document.createElement("img");
  enemy.setAttribute("src", "img/" + rand(3) + ".jpg");
  enemy.setAttribute("class", "enemy" + rand(3));
  canvas.appendChild(enemy);

  enemy.style.left = rand(winx * 2) - 10 + "px";
  enemy.style.top = rand(winy * 2) - 10 + "px";
  checkSpawnpos(enemy);

  enemy.addEventListener("click", function destroyEnemy() {
    score++;
    scoretxt.innerHTML = "Your Score: " + score;
    enemy.parentNode.removeChild(enemy);
  });
}

function checkSpawnpos(enemy) {
  const protectionRect = spawnProtection.getBoundingClientRect();
  const enemyRect = enemy.getBoundingClientRect();
  if (
    enemyRect.top > protectionRect.top &&
    enemyRect.bottom < protectionRect.bottom &&
    enemyRect.left > protectionRect.left &&
    enemyRect.right < protectionRect.right
  ) {
    enemy.parentNode.removeChild(enemy);
    spawnEnemy();
  }
}

function moveEnemy() {
  const enemies = document.querySelectorAll('[class^="enemy"]');
  for (let enemy of enemies) {
    const rad = angleDeg(
      parseInt(winx),
      parseInt(winy),
      parseInt(enemy.style.left),
      parseInt(enemy.style.top)
    );
    var distance = getDistance(enemy);
    var gegenkathete = (Math.sin(rad) * distance) / speed;
    var ankathete = (Math.cos(rad) * distance) / speed;
    enemy.style.left = parseInt(enemy.style.left) + ankathete + "px";
    enemy.style.top = parseInt(enemy.style.top) - gegenkathete + "px";
  }
}

function getDistance(enemy) {
  var enemyx = parseInt(enemy.style.left);
  var enemyy = parseInt(enemy.style.top);
  return Math.sqrt((enemyx - winx) ** 2 + (enemyy - winy) ** 2);
  //√[(x₂ - x₁)² + (y₂ - y₁)²]
}

function checkCollision() {
  const enemies = document.querySelectorAll('[class^="enemy"]');
  if (anyCollision(player, enemies)) {
    canvas.innerHTML = " ";
    isRunning = false;
    scoretxt.style.display = "none";
    gameoverContainer.style.display = "flex";
    gameoverSub.innerHTML = "Your score was: " + score;
  }
}

function rand(amount) {
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
  console.log(timer);
  window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);
