function Paddle(x, y, width, height, color) {
    this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
};


function Ball(x, y, dx, dy, radius, speed, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
	this.radius = radius;
	this.speed = speed;
	this.color = color;
}

var BricksTypes = {
	DEFAULT : 1,
	ICE : 1,
	WOOD : 2,
	STONE : 3,
	IRON : 4,
	STEEL : 5
};

var BrickColors = {
	DEFAULT : "#70a1ff",
	ICE : "#70a1ff",
	WOOD : "#F79F1F",
	STONE : "#dcdde1",
	IRON : "#95afc0",
	STEEL : "#535c68"
};


function Brick(x, y, width, height, type) {
    this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.lifes = type;
	this.color; 
	switch(this.lifes)
	{
		case 1: this.color=BrickColors.ICE;
			break;
		case 2: this.color=BrickColors.WOOD;
			break;
		case 3: this.color=BrickColors.STONE;
			break;
		case 4: this.color=BrickColors.IRON;
			break;
		case 5: this.color=BrickColors.STEEL;
			break;
		default: this.color=BrickColors.ICE;
			break;
	};
    
    //czy punkt x y jest w danym bloku
    this.isPointInRect = function(x, y) {
		var xMin = this.x;
		var xMax = this.x + this.width;

		var yMin = this.y;
		var yMax = this.y + this.height;

		if(x<=xMax && x>=xMin)
		{
			if(y<=yMax && y>=yMin)
			{
				return true;
			}
		}
		return false;
	}
}

//zapelnij tablice blokami
function Bricks(hor_num, vert_num, brick_width, brick_height) {
	var bricks = new Array();
	for (var i = 0; i < vert_num; i++) {
		bricks[i] = new Array();
		for (var j = 0; j < hor_num; j++) {
			var bcolor;
			bricks[i][j] = new Brick(j * brick_width, i * brick_height, brick_width, brick_height, BricksTypes.DEFAULT);
		}
	}
	return bricks;
}

//-----------------------------------------------------------------------------------------------------------
// Arkanoid Game class
//-----------------------------------------------------------------------------------------------------------
function ArkanoidGame() {


	this.timescale = 1.8;
	var PADDLE_WIDTH = 60;
	var PADDLE_HEIGHT = 10;
	var PADDLE_SPEED = 3;
	var BALL_RADIUS = 5;
	var BALL_DEFAULT_SPEED = 3;
	var BALL_MAX_SPEED = 6;
	var BALL_COLOR = "#f1f2f6";
	var BRICK_WIDTH = 80;
	var BRICK_HEIGHT = 35;
	var BRICK_SCORE = 100;
	var width = 400, height = 720;

	this.level = 1;
	this.lifes = 3;
	this.score = 0;
	this.paddle = new Paddle(width / 2 - PADDLE_WIDTH / 2, height - 20, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);
	this.ball = new Ball(width / 2, height / 2, 0, -5, BALL_RADIUS, BALL_DEFAULT_SPEED, BALL_COLOR);
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

	this.drawPaddle = function(){
		fill(this.paddle.color);
		rect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height, 10);
	}

    //rysuj kulke
	this.drawBall = function() {
		fill(this.ball.color);
		ellipse(this.ball.x, this.ball.y,this.ball.radius, this.ball.radius);
	}

    //rysuj bloki
	this.drawBricks = function() {
		for (var i = 0; i < this.bricks.length; i++) {
			for (var j = 0; j < this.bricks[i].length; j++) {
				fill(this.bricks[i][j].color);
				if (this.bricks[i][j].lifes > 0)
					rect(this.bricks[i][j].x, this.bricks[i][j].y, this.bricks[i][j].width,this.bricks[i][j].height, 5);
			}
		}
	}

    //rysuj wszystko
	this.draw = function() {
		clear();
		fill("#a4b0be");
		background(200);
		this.drawPaddle();
		this.drawBall();
		this.drawBricks();
	}

	this.update = function() {
		// if (this.gamePaused || this.gameWin || this.gameOver) return;

		// update ball pos (velocity)
		this.ball.x += this.ball.dx * this.timescale;
		this.ball.y += this.ball.dy * this.timescale;
		// ball bounce from paddle
		if(this.ball.y >= this.paddle.y && this.ball.x >= this.paddle.x && this.ball.x <= this.paddle.x+this.paddle.width){
			this.ball.dy = -this.ball.dy;
		}

		// ball bounce from walls (with losing health from bottom)

		// ball bounce from bricks
		for (var i = 0; i < this.bricks.length; i++) {
			for (var j = 0; j < this.bricks[i].length; j++) {
				if (this.bricks[i][j].lifes > 0){
					//czy uderza w dolna scianke
					if(this.bricks[i][j].isPointInRect(this.ball.x, this.ball.y + this.ball.dy * this.timescale)){
						this.ball.dy = -this.ball.dy;
						this.bricks[i][j].lifes-=1;
					}
				}
				// rect(this.bricks[i][j].x, this.bricks[i][j].y, this.bricks[i][j].width,this.bricks[i][j].height);
			}
		}
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
		this.paddle.x -= PADDLE_SPEED;
	}

    //wiadomo
	this.movePaddleRight = function() {
		this.paddle.x += PADDLE_SPEED;
	}

    //walidacja zeby nie wychodzilo za ekran
	this.setPaddlePos = function(x) {
		if (this.gamePaused || this.gameWin || this.gameOver) return;
		this.paddle.x =  constrain(x, 0, width - this.paddle.width);
	}

    
    //setup predkosci pileczki
	this.startGame = function() {
	}
};

//STEROWANIE

var game;

function setup() {
	createCanvas(400, 720);
	frameRate(30);
	game = new ArkanoidGame();
}

function draw() {
	game.update();
	game.draw();
	if (keyIsDown(RIGHT_ARROW)) {
		game.movePaddleRight();
	}
	if (keyIsDown(LEFT_ARROW)) {
		game.movePaddleLeft();
	}
	game.setPaddlePos(game.paddle.x);
}
