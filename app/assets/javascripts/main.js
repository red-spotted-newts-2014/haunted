//= require vendor/phaser.min.js
//= require firebase.js
//= require game/board.js
//= require game/game_characters.js
//= require game/controls.js
//= require game/images.js
//= require game/features.js

$(document).ready(function() {
  console.log("This happend first");
  var roomSession = $("#room-session").val();
  if (typeof roomSession !== "undefined") {
    fb = new firebase.firebaseSetup(roomSession);
  }

  // Recieve a message
  fb.chat.on("child_added", firebase.recieveMessage);

  // Send a message
  $("#chat-form").submit(function(event) {
    event.preventDefault();
    var name = $("#user-name").val()
    var content = $("#msg-input").val()
    $("#msg-input").val("");
    firebase.sendMessage(fb, name, content);
  });
});

// Constants
CANVAS_WIDTH = 833;
CANVAS_HEIGHT = 715;
CANVAS_OFFSET = 100;

SCORE = 0;
MAX_SCORE = 20;
LIVES = 100;
GHOST_LIVES = 3;
DOT_COUNT = 10;
POWERUP_COUNT = 1;


var game = new Phaser.Game( CANVAS_WIDTH, CANVAS_HEIGHT, Phaser.AUTO, 'pac', { preload: preload, create: create, update: update } );

function preload() {
  loadImages();
  game.load.tilemap('map', '/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('Desert', '/images/deserttile.png');
  //game.load.audio('music', '/music.mp3');
};

// Declare Variables
var score = SCORE;
var maxScore = MAX_SCORE;
var lives = LIVES;
var ghostLives = GHOST_LIVES;
var dotCount = DOT_COUNT;
var powerUpCount = POWERUP_COUNT;

var characters = [], dots = [], ghosts = [], powerUp = [];
var key1, key2, key3, key4;
var person, ghost1, ghost2, ghost3, ghost4;
var platforms;
var scoreText, livesText, starOne, starTwo;

var map;
var layer;
var cursors;
var music;
var fb;

features.changeMusicVolume();

//create sprites (game icons) to be used during game play
function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  music = game.add.audio('music');
  music.play();

  map = game.add.tilemap('map');
  map.addTilesetImage('Desert');

  layer = map.createLayer('Ground');
  layer.resizeWorld();

  board.createBoard();
  controls.createHotkeys();
  gameCharacters.createPerson();
  gameCharacters.createGhosts();
  board.createTeleport();
  board.createPowerUp();
  board.createMultipleDots(dotCount);

  var gamePhysicsArray = [characters, dots, powerUp, starOne, starTwo];

  for (var i = 0; i < gamePhysicsArray.length; i++) {
    game.physics.arcade.enable(gamePhysicsArray[i]);
  }

  for (var i = 0; i < characters.length; i++) {
    characters[i].body.collideWorldBounds = true;
  }

  key1.onDown.add( function() { controls.setUserControl(1) } );
  key2.onDown.add( function() { controls.setUserControl(2) } );
  key3.onDown.add( function() { controls.setUserControl(3) } );
  key4.onDown.add( function() { controls.setUserControl(4) } );

  livesText = game.add.text(CANVAS_WIDTH - CANVAS_OFFSET, CANVAS_HEIGHT - CANVAS_OFFSET, 'lives:' + lives, { font: "20px Arial", fill: "#ffffff", align: "left" });
  scoreText = game.add.text(CANVAS_OFFSET, CANVAS_HEIGHT - CANVAS_OFFSET, 'score:' + score, { font: "20px Arial", fill: "#ffffff", align: "left" });

  cursors = game.input.keyboard.createCursorKeys();

}

function update() {

  game.physics.arcade.collide(person, walls);
  // game.physics.arcade.collide(person, layer);
  // game.physics.arcade.collide(person, collisionLayer);

  // setTimeout(sendCoordinates(), 1000);
  // function sendCoordinates() {
  //   fb.game.set({
  //     player: {
  //       x : person.position.x,
  //       y : person.position.y
  //     },
  //     ghost1 : {
  //       x : ghost1.position.x,
  //       y : ghost1.position.y
  //     }
  //   });
  // }
  if ((person.x !== person.lastx) || (person.y !== person.lasty )) {
    fb.player.set({
      x : person.position.x,
      y : person.position.y
    });
  }

  if ((ghost1.x !== ghost1.lastx) || (ghost1.y !== ghost1.lasty )) {
    fb.ghost1.set({
      x : ghost1.position.x,
      y : ghost1.position.y
    });
  }

  fb.game.on("child_changed", function(snapshot) {
    var x = snapshot.val().x
    var y = snapshot.val().y
    //updatePerson(x, y)
    //console.log(snapshot.val());
  });

  function updatePerson(x, y) {
    person.x = x;
    person.y = y;
  }

  for (var i = 0; i < ghosts.length; i++) {
    game.physics.arcade.collide(ghosts[i], walls);
  }
  game.physics.arcade.overlap(person, dots, features.eatDot, null, this);
  game.physics.arcade.overlap(person, powerUp, features.powerUp, null, this);
  game.physics.arcade.overlap(person, starOne, features.teleportOne, null, this);
  game.physics.arcade.overlap(person, starTwo, features.teleportTwo, null, this);
  game.physics.arcade.overlap(person, ghosts, features.pacMeetsGhost, null, this);

  characters.forEach(function(character) {
    if (character.userControl === true) {
      if (cursors.left.isDown){
        character.body.velocity.x = -200;
        character.body.velocity.y = 0;
        character.animations.play('left');
      } else if (cursors.right.isDown){
        character.body.velocity.x = 200;
        character.body.velocity.y = 0;
        character.animations.play('right');
      } else if (cursors.up.isDown){
        character.body.velocity.y = -200;
        character.body.velocity.x = 0;
        character.animations.play('up');
      } else if (cursors.down.isDown) {
        character.body.velocity.y = 200;
        character.body.velocity.x = 0;
        character.animations.play('bottom');
      }
    } else {
      game.physics.arcade.moveToObject(character, person, 60);
    }

    livesText.text = 'lives: ' + lives;
    scoreText.text = 'score: ' + score;

  });

}
