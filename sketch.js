var CSX =400, CSY=720;	//rozmiar canvas
class Tile {
	constructor(x, y, h, w){
		this.x = x;	//wspolrzedna x
		this.y = y;	//wspolrzedna y
		this.h = h;	//wysokosc
		this.w = w;	//szeroskosc
	}
	//narysuj obiekt
	dObj(){
		rect(this.x, this.y, this.w, this.h);
	}
}
var Player = new Tile(CSX/2, CSY/2, 10, 30);
var tiles = [];	

function setup() {
  createCanvas(CSX, CSY);  
  stroke(0);
  var tempX = 50, tempY = 100;
  for(var i=1; i<16; i++){
	tiles[i]=new Tile(tempX, tempY, 10, 30);
	tempX+=50;
	if(i%5==0){
		tempX=50;
		tempY+=50;
	}
  }  

  frameRate(30);
}


function draw() { 
	clear();
	background(200); 

	for(var i=1; i<tiles.length; i++){
		tiles[i].dObj();
	}   
	Player.dObj();  
} 


