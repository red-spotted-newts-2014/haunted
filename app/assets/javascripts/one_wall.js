//= require ./phaser.min.js
//= require jquery
//= require jquery_ujs

$(document).ready(function() {
    // Setup
    //var roomSession = $("#room-session").val();
    var roomSession = "one_wall";

    if (typeof roomSession !== "undefined") {
      var firebase = new firebaseSetup(roomSession);
    }

    // Recieve a message
    firebase.game.on("child_changed", updateCoordinates);

    function sendCoordinates(sprite) {
      firebase.game.push({
        message : {
          sprite: sprite,
          x_coordinates: sprite.x,
          y_coordinates: sprite.y,
          timestamp: Firebase.ServerValue.TIMESTAMP
        }
      });
    }

    function updateCoordinates() {}

  function firebaseSetup(roomSession) {
    this.ref = new Firebase("https://haunted.firebaseio.com/");
    this.room = this.ref.child(roomSession);
    this.chat = this.room.child("chat");
    this.game = this.room.child("game");
  }

  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

  function preload() {
    game.load.image('phaser', '/person.png');
    game.load.spritesheet('veggies', '/star.png', 32, 32);
  }

  var sprite;
  var group;
  var cursors;

  function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#2d2d2d';

    //  This example will check Sprite vs. Group collision

    sprite = game.add.sprite(32, 200, 'phaser');
    sprite.name = 'phaser-dude';

    game.physics.enable(sprite, Phaser.Physics.ARCADE);

    group = game.add.group();
    group.enableBody = true;
    group.physicsBodyType = Phaser.Physics.ARCADE;

    var c = group.create(game.rnd.integerInRange(100, 770), game.rnd.integerInRange(0, 570), 'veggies', game.rnd.integerInRange(0, 35));
    c.name = 'veg';
    c.body.immovable = true;



    cursors = game.input.keyboard.createCursorKeys();

  }

  function update() {

    game.physics.arcade.collide(sprite, group, collisionHandler, null, this);
    game.physics.arcade.collide(group, group);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
      sprite.body.velocity.x = -200;
    }
    else if (cursors.right.isDown)
    {
      sprite.body.velocity.x = 200;
    }

    if (cursors.up.isDown)
    {
      sprite.body.velocity.y = -200;
    }
    else if (cursors.down.isDown)
    {
      sprite.body.velocity.y = 200;
    }

  }

  function collisionHandler (player, veg) { 
    //console.log(player.position.x);
    firebase.game.set({
      player_x : player.position.x,
      player_y : player.position.y
    });
  }
});