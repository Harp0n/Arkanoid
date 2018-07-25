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
	var PADDLE_SPEED = 5;
	var PADDLE_COLOR = "#e67e22";
	var BALL_RADIUS = 5;
	var BALL_DEFAULT_SPEED = 3;
	var BALL_MAX_SPEED = 6;
	var BALL_COLOR = "#f1f2f6";
	var BRICK_WIDTH = 40;
	var BRICK_HEIGHT = 15;
	var BRICK_SCORE = 100;
	var TICKS = 20;
	BALL_DEFAULT_SPEED/=TICKS;
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
		test : ["0000000000",
				"0000000000",
				"0000000000",
				"0000000000",
				"0000000000",
				"0000000000",
				"0000000000",
				"0000000000",
				"0000000000",
				"0000000000",
				"0000010000"],
	};

	this.level = 1;
	this.lives = 3;
	this.score = 0;
	this.paddle = new Paddle(width / 2 - PADDLE_WIDTH / 2, height - 20, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);
	
	this.ball = new Ball(width /2, height -200, 0, -1, BALL_RADIUS, BALL_DEFAULT_SPEED, BALL_COLOR);
	this.gameOver = false;
	this.gameWin = false;
	this.gamePaused = false;
	this.bricks;

    //dodaj bloki, ustaw im zycia
	this.initLevel = function(level) {
		var lvl;
		switch (level) {
			case 0: lvl = this.Levels.test;break;
			case 1: lvl = this.Levels.first;break;
			default: lvl = this.Levels.kutas;break;
		}
		this.bricks = new Bricks(10, lvl.length, BRICK_WIDTH, BRICK_HEIGHT, lvl);
		this.ball.x = width /2;
		this.ball.y = height -200;
		this.ball.dx = 2*(random()-0.5)*0.1;
		this.ball.dy = -1;

		this.paddle.x = width / 2 - PADDLE_WIDTH / 2;
		this.gameOver = false;
		this.gameWin = false;
		this.gamePaused = false;
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
		this.drawBricks();
		this.drawBall();
	}

	this.update = function() {
		for(var k = 0; k<TICKS;k++){
		if (this.gamePaused || this.gameWin || this.gameOver) return;

		
		//kulka nie powinna leciec idealnie pionowo ani poziomo
		if(abs(this.ball.dx)<0.001){
			this.ball.dx = 2*(random()-0.5) * 0.001
		}
		if(abs(this.ball.dy)<0.001){
			this.ball.dy = 2*(random()-0.5) * 0.001
		}

		// normalizacja predkosci

		var temp = sqrt(sq(this.ball.dx)+sq(this.ball.dy));
		this.ball.dx = this.ball.dx * this.ball.speed/temp;
		this.ball.dy = this.ball.dy * this.ball.speed/temp;
		// update ball pos (velocity)	
		this.ball.x += this.ball.dx * this.timescale;
		this.ball.y += this.ball.dy * this.timescale;


		// ball bounce from paddle
		if(this.ball.y >= this.paddle.y && this.ball.y <= this.paddle.y + this.paddle.height 
		&& this.ball.x >= this.paddle.x && this.ball.x <= this.paddle.x +  this.paddle.width){
			this.ball.dy = -this.ball.dy;
			var deltax = this.paddle.x + this.paddle.width/2 - this.ball.x;
			this.ball.y = this.paddle.y;
			this.ball.dx -= deltax * 0.02 * BALL_DEFAULT_SPEED;
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
		var bounced = false;
		for (var i = 0; i < this.bricks.length; i++) {
			if(bounced) break;
			for (var j = 0; j < this.bricks[i].length; j++) {
				if(bounced) break;
				if (this.bricks[i][j].lives > 0){
					if(this.bricks[i][j].isPointInRect(this.ball.x, this.ball.y)){
						var delta = createVector(this.ball.x,this.ball.y).sub(
							this.bricks[i][j].x+this.bricks[i][j].width/2,
							this.bricks[i][j].y+this.bricks[i][j].height/2);
						delta.x *= BRICK_HEIGHT/BRICK_WIDTH;
						print(delta);
						if(abs(delta.x) > abs(delta.y))
						{
							if((-this.ball.dx > 0 &&  delta.x > 0)||(-this.ball.dx < 0 &&  delta.x < 0))
							{
								this.ball.dx = -this.ball.dx;
								this.bricks[i][j].lives-=1;
								this.bricks[i][j].UpdateColor();
								bounced = true;
							}
						}
						else
						{
							if((-this.ball.dy > 0 &&  delta.y > 0)||(-this.ball.dy < 0 &&  delta.y < 0))
							{
								this.ball.dy = -this.ball.dy;
								this.bricks[i][j].lives-=1;
								this.bricks[i][j].UpdateColor();
								bounced = true;
							}
						}
					}
				}
			}
		}
		//sprawdz czy koniec lvla, jesli takl to zacznij nowy lvl albo skoncz gre
		this.checkGameState();
		}
	}

	this.checkGameState = function(){
		if(this.isBallOnScreen()==false) {
			this.lives--;
			if(this.lives>0){
				this.initLevel(this.level);
			}
			else{
			this.gameOver = true;
			this.startGame();
			}
		}
		if(this.areAnyBricksLeft() == false) {
			this.level++;
			this.initLevel(this.level);
		}
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
		game.setPaddlePos(this.paddle.x - PADDLE_SPEED);
	}

    //wiadomo
	this.movePaddleRight = function() {
		game.setPaddlePos(this.paddle.x + PADDLE_SPEED);
	}

    //walidacja zeby nie wychodzilo za ekran
	this.setPaddlePos = function(x) {
		if (this.gamePaused || this.gameWin || this.gameOver) return;
		this.paddle.x =  constrain(x, 0, width - this.paddle.width);
	}

    
    //setup predkosci pileczki
	this.startGame = function() {
		this.level = 0;
		this.lives = 3;
		this.score = 0;
		this.initLevel(this.level);
	}

	function drawButton() {
		background(237, 34, 93);
		fill(0);
	  
		if (mouseIsPressed) {
		  if (mouseButton === LEFT) {
			ellipse(50, 50, 50, 50);
		  }
		  if (mouseButton === RIGHT) {
			rect(25, 25, 50, 50);
		  }
		  if (mouseButton === CENTER) {
			triangle(23, 75, 50, 20, 78, 75);
		  }
		}
	  
		print(mouseButton);
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

function keyPressed() {
	if(keyCode === 32){
		game.togglePause();
		
	}
}

function draw() {
	game.update();
	game.draw();
	game.drawButton();
	if (keyIsDown(RIGHT_ARROW)) {
		game.movePaddleRight();
	}
	if (keyIsDown(LEFT_ARROW)) {
		game.movePaddleLeft();
	}
	if(game.gamePaused){
		textAlign(CENTER);
		textStyle(BOLD);
		fill(0);
		textSize(40);
		
        text("Pause", 200, 400);
    }
}
