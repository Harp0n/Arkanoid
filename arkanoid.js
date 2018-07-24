function Paddle(x, y, width, height) {
    this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};


function Ball(x, y, dx, dy, radius, speed) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
	this.radius = radius;
	this.speed = speed;
}

var BricksTypes = {
	DEFAULT : 1,
	ICE : 1,
	WOOD : 2,
	STONE : 3,
	IRON : 4,
	STEEL : 5
};

function Brick(x, y, width, height, type) {
    this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.lifes = type;
    
    //czy punkt x y jest w danym bloku
    this.isPointInRect = function(x, y) {
	}
}

//zapelnij tablice blokami
function Bricks(hor_num, vert_num, brick_width, brick_height) {
	this.bricks = new Array();
	for (var i = 0; i < vert_num; i++) {
		this.bricks[i] = new Array();
		for (var j = 0; j < hor_num; j++) {
			this.bricks[i][j] = new Brick(j * brick_width, i * brick_height, brick_width, brick_height, BricksTypes.DEFAULT);
		}
	}
}

//-----------------------------------------------------------------------------------------------------------
// Arkanoid Game class
//-----------------------------------------------------------------------------------------------------------
function ArkanoidGame() {


	var PADDLE_WIDTH = 60;
	var PADDLE_HEIGHT = 10;
	var PADDLE_SPEED = 1;
	var BALL_RADIUS = 20;
	var BALL_DEFAULT_SPEED = 3;
	var BALL_MAX_SPEED = 6;
	var BRICK_WIDTH = 80;
	var BRICK_HEIGHT = 35;
	var BRICK_SCORE = 100;
	var width = 400, height = 720;

	this.level = 1;
	this.lifes = 3;
	this.score = 0;
	this.paddle = new Paddle(width / 2 - PADDLE_WIDTH / 2, height - 20, PADDLE_WIDTH, PADDLE_HEIGHT);
	this.ball = new Ball(width / 2, height / 2, 0, 1, BALL_RADIUS, BALL_DEFAULT_SPEED);
	this.gameOver = false;
	this.gameWin = false;
	this.gamePaused = false;
	this.bricks = new Bricks(8, 2, BRICK_WIDTH, BRICK_HEIGHT); 

	this.init = function() {
/* 		this.level = 0;
		this.lifes = 3;
		this.score = 0;
		this.gameOver = false;
		this.gameWin = false;
		this.gamePaused = false;
		this.initLevel(this.level); */
	}

    //dodaj bloki, ustaw im zycia
	this.initLevel = function(level) {
		switch (level) {
		}
	}

    //rysuj kulke
	this.drawBall = function() {
		ellipse(this.ball.x, this.ball.y,this.ball.radius, this.ball.radius);
	}

    //rysuj bloki
	this.drawBricks = function() {
		for (var i = 0; i < this.bricks.vert_num; i++) {
			for (var j = 0; j < this.bricks.hor_num; j++) {
				print(bricks[i][j]);
				rect(this.bricks[i][j].x, this.bricks[i][j].y, this.bricks[i][j].width,this.bricks[i][j].height);
			}
		}
	}

    //rysuj wszystko
	this.draw = function() {
		this.drawBall();
		this.drawBricks();
	}

	this.update = function() {
		if (this.gamePaused || this.gameWin || this.gameOver) return;

		// update ball pos (velocity)

		// ball bounce from paddle

		// ball bounce from walls (with losing health from bottom)

		// ball bounce from bricks

        //sprawdz czy koniec lvla, jesli takl to zacznij nowy lvl albo skoncz gre
	}




    // czy w bloku this.bricks[i,j] jest kulka 
	this.isBallIntersectBrick = function(i, j) {
	}

	this.togglePause = function() {
		this.gamePaused = !this.gamePaused;
	}

    //wiadomo
	this.movePaddleLeft = function() {
	}

    //wiadomo
	this.movePaddleRight = function() {
	}

    //walidacja zeby nie wychodzilo za ekran
	this.setPaddlePos = function(x) {
	}

    
    //setup predkosci pileczki
	this.startGame = function() {
	}
};

//STEROWANIE

var game;

function setup() {
	createCanvas(400, 720);
	fill(255);
	frameRate(30);
	game = new ArkanoidGame();
	print(game.ball);
	print(game.bricks);
}

function draw() {
	background(200);
	game.draw();
}