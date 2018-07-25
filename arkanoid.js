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
	EMPTY : 0,
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
	this.lives = type;
	this.color; 
	this.UpdateColor = function(){
		switch(this.lives)
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
function Bricks(hor_num, vert_num, brick_width, brick_height, level) {
	this.lvlInterpreter = function(x, y){
		var inp = "0";
		if(level[y][x]!=undefined)inp= level[y][x];
		//print(level[x][y]);

		var out;
		switch(inp){
			case "0":out=BricksTypes.EMPTY;break;
			case "1":out=BricksTypes.ICE;break;
			case "2":out=BricksTypes.WOOD;break;
			case "3":out=BricksTypes.STONE;break;
			case "4":out=BricksTypes.IRON;break;
			case "5":out=BricksTypes.STEEL;break;
			default: out=BricksTypes.DEFAULT;break;
		}
		return out;
	}
	var bricks = new Array();
	for (var i = 0; i < vert_num; i++) {
		bricks[i] = new Array();
		for (var j = 0; j < hor_num; j++) {
			bricks[i][j] = new Brick(j * brick_width, i * brick_height, brick_width, brick_height, this.lvlInterpreter(j,i));
			bricks[i][j].UpdateColor();
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
	var PADDLE_SPEED = 6;
	var PADDLE_COLOR = "#e67e22";
	var BALL_RADIUS = 5;
	var BALL_DEFAULT_SPEED = 3;
	var BALL_MAX_SPEED = 6;
	var BALL_COLOR = "#f1f2f6";
	var BRICK_WIDTH = 40;
	var BRICK_HEIGHT = 15;
	var BRICK_SCORE = 100;
	var width = 400, height = 500;

	//wymiary 10x30 maks (z aktualnymi ustawieniami :) )
	this.Levels =
	{
		first : ["5555555555",
				"5555555555",
				"4444444444",
				"4444444444",
				"3333333333",
				"3333333333",
				"2222222222",
				"2222222222",
				"1111111111",
				"1111111111",
				"0000000000"],
		kutas : ["3223333333",
				"2552333233",
				"2555222523",
				"5445555552",
				"5444444445",
				"5444444445",
				"5445555552",
				"2545222523",
				"3255233233",
				"1322333331",
				"1111111111"],
		test : ["1111111111",
				"1111111111",
				"1111111111",
				"1111111111",
				"1111111111",
				"1111111111",
				"1111111111",
				"1111111111",
				"1111111111",
				"1111111111",
				"0000000000"],
	};

	this.level = 0;
	this.lives = 3;
	this.score = 0;
	this.paddle = new Paddle(width / 2 - PADDLE_WIDTH / 2, height - 20, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);
	this.ball = new Ball(width /2, height -200, 0, -5, BALL_RADIUS, BALL_DEFAULT_SPEED, BALL_COLOR);
	this.gameOver = false;
	this.gameWin = false;
	this.gamePaused = false;
	this.bricks;
	this.init = function() {
/* 		this.level = 0;
		this.lives = 3;
		this.score = 0;
		this.gameOver = false;
		this.gameWin = false;
		this.gamePaused = false;
		this.initLevel(this.level); */
	}

    //dodaj bloki, ustaw im zycia
	this.initLevel = function(level) {
		var lvl;
		switch (level) {
			case 1: lvl = this.Levels.first;break;
			case 0: lvl = this.Levels.test;break;
			default: lvl = this.Levels.kutas;break;
		}
		this.bricks = new Bricks(10, lvl.length, BRICK_WIDTH, BRICK_HEIGHT, lvl);
		this.ball.x = width /2;
		this.ball.y = height -200;
		this.ball.dx = 0;
		this.ball.dy = -5;

		this.paddle.x = width / 2 - PADDLE_WIDTH / 2;
		this.gameOver = false;
		this.gameWin = false;
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
				if (this.bricks[i][j].lives > 0)
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
		if (this.gamePaused || this.gameWin || this.gameOver) return;
		print(this.ball.x, this.ball.y);
		// update ball pos (velocity)
			//clamp velocities
			if(abs(this.ball.dx)<0.002){
				this.ball.dx = (random()-0.5)*0.003
			}
			var temp = sqrt(sq(this.ball.dx)+sq(this.ball.dy));
			this.ball.dx = this.ball.dx * this.ball.speed/temp;
			this.ball.dy = this.ball.dy * this.ball.speed/temp;
		this.ball.x += this.ball.dx * this.timescale;
		this.ball.y += this.ball.dy * this.timescale;
		// ball bounce from paddle
		if(this.ball.y >= this.paddle.y && this.ball.x >= this.paddle.x && this.ball.x <= this.paddle.x+this.paddle.width){
			this.ball.dy = -this.ball.dy;
			var deltax = this.paddle.x + this.paddle.width/2 - this.ball.x;
			this.ball.dx -= deltax * 0.05;
		}

		// ball bounce from walls (with losing health from bottom)
		//odbicie od scian bocznych
		if(this.ball.x<0 || this.ball.x>width){
			this.ball.dx = -this.ball.dx;
		}

		if(this.ball.y<0 ){
			this.ball.dy = -this.ball.dy;
		}

		// ball bounce from bricks
		for (var i = 0; i < this.bricks.length; i++) {
			for (var j = 0; j < this.bricks[i].length; j++) {
				if (this.bricks[i][j].lives > 0){
					//czy uderza w dolna scianke
					if(this.bricks[i][j].isPointInRect(this.ball.x, this.ball.y + this.ball.dy * this.timescale)){
						this.ball.dy = -this.ball.dy;
						this.bricks[i][j].lives-=1;
						this.bricks[i][j].UpdateColor();
					}
				}
				// rect(this.bricks[i][j].x, this.bricks[i][j].y, this.bricks[i][j].width,this.bricks[i][j].height);
			}
		}
		//sprawdz czy koniec lvla, jesli takl to zacznij nowy lvl albo skoncz gre
		this.checkGameState();
	}

	this.checkGameState = function(){
		if(this.isBallOnScreen()==false) {
			this.gameOver = true;
			this.startGame();
		}
		if(this.areAnyBricksLeft() == false) this.gameWin = true;
	}
	//czy nie wyszla za dolna krawedz == przegrana
	this.isBallOnScreen = function()
	{
		if(this.ball.y >= height)return false;
		return true;
	}

	//jak nie ma klockow to poziom ukonczony
	this.areAnyBricksLeft = function()
	{
		for (var i = 0; i < this.bricks.length; i++) {
			for (var j = 0; j < this.bricks[i].length; j++) {
				if(this.bricks[i][j].lives>0)return true;
			}
		}
		return false;
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
		this.initLevel(this.level);
	}
};

//STEROWANIE

var game;

function setup() {
	createCanvas(400, 500);
	frameRate(60);
	game = new ArkanoidGame();
	game.startGame();
}

function draw() {
	game.update();
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
