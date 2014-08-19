var board = {}

board.createBoard = function() {
  board.createMap();
  board.createTeleport();
  board.createApples();
  board.createCherry();
  board.createSpeedUp();
  board.addMusic();
  board.addScoreText();
  board.addLivesText();
}

board.addLivesText = function() {
  livesText = game.add.text(CANVAS_WIDTH - (CANVAS_OFFSET * 2), CANVAS_HEIGHT - CANVAS_OFFSET, 'lives:' + lives, { font: "20px Arial", fill: "indigo", align: "left" });
}
board.addScoreText = function() {
  scoreText = game.add.text(CANVAS_OFFSET, CANVAS_HEIGHT - CANVAS_OFFSET, 'score:' + score, { font: "20px Arial", fill: "indigo", align: "left" });
}

board.addMusic = function() {
  music = game.add.audio('music');
  music.play();
}

board.createMap = function() {
  map = game.add.tilemap('map');
  map.addTilesetImage('Desert');
  layer = map.createLayer('Ground');
  map.setCollision(38);
  layer.resizeWorld();
}

board.createTeleport = function() {
  starOne = game.add.sprite(10, game.world.height/2, 'star');
  starOne.anchor.setTo(0.5, 0.5);
  starOne.scale.setTo(1,1);

  starTwo = game.add.sprite(825, game.world.height/2, 'star');
  starTwo.anchor.setTo(0.5, 0.5);
  starTwo.scale.setTo(1,1);
}

board.createApple = function(x, y) {
  apple = game.add.sprite(x, y, 'apple');
  apple.anchor.setTo(0.5, 0.5);
  apple.scale.setTo(0.5,0.5);
  apples.push(apple);
}

board.createApples = function() {
  board.createApple(290, 67); //top left
  board.createApple(65, 250); //upper left
  board.createApple(90, 445); //mid left
  board.createApple(260, 580); //center left
  board.createApple(65, 670); //bot left
  board.createApple(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50) //center mid
  board.createApple(CANVAS_WIDTH - 290, 67); //top right
  board.createApple(CANVAS_WIDTH - 90, 445); //mid right
  board.createApple(CANVAS_WIDTH - 260, 580); //mid left
  board.createApple(CANVAS_WIDTH - 65, 670); //bot right
}

board.createCherry = function() {
  cherry = game.add.sprite(CANVAS_WIDTH - 65, 250, 'star');
  cherry.anchor.setTo(0.5, 0.5);
}

board.createSpeedUp = function() {
  speed = game.add.sprite(CANVAS_WIDTH - 200, CANVAS_HEIGHT - 200, 'star');
  speed.anchor.setTo(0.5, 0.5);
}
