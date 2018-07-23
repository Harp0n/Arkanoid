var y = 100;
var bloki = [];
var blok_szerokosc = 20;
var blok_dlugosc = 50;
var ilosc_x = 13;
var ilosc_y = 5;
var odstep = 0;

var odbijaczX;
var odbijaczY;
var odbijacz_dlugosc = 100;
var odbijacz_szerokosc= 20;


function blok(x,y){
  this.turned = true;
  this.position = createVector(x,y);
  this.display = function() {
    rect(this.position.x, this.position.y,  blok_dlugosc, blok_szerokosc);
  };
  this.isPointIn = function(x, y) {
    if(x >= this.position.x && x <= this.position.x+blok_dlugosc && y >= this.position.y && y <= this.position.y+blok_szerokosc)
      return true;
    else return false;
  }
}



// The statements in the setup() function 
// execute once when the program begins
function setup() {
	// createCanvas must be the first statement
  createCanvas(ilosc_x*blok_dlugosc, 600);  
  odbijaczX = width/2;
  odbijaczY = height - odbijacz_szerokosc;
  stroke(255);     // Set line drawing color to white
  frameRate(30);
  for (var x = 0; x < ilosc_x; x++) {
    var row = [];
    for (var y = 0; y < ilosc_y; y++) {
      bloki.push(new blok(x*blok_dlugosc,y*blok_szerokosc));
    }
  }
  bloki[3].turned=false;
}
// The statements in draw() are executed until the 
// program is stopped. Each statement is executed in 
// sequence and after the last line is read, the first 
// line is executed again.
function draw() { 
     // Set the background to black
  background(50);
  y = y - 1; 
  if (y < 0) { 
    y = height; 
  } 
  line(0, y, width, y); 
  // fill("white");

  if (keyIsDown(LEFT_ARROW)) {
    odbijaczX-=10;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    odbijaczX+=10;
  }
  odbijaczX = constrain(odbijaczX, 0+odbijacz_dlugosc/2, width-odbijacz_dlugosc/2);
  rect(odbijaczX-odbijacz_dlugosc/2, odbijaczY, odbijacz_dlugosc, odbijacz_szerokosc);
  fill("red");
  for (var i = 0; i < bloki.length; i++) {
    if(bloki[i].turned)
      bloki[i].display();
  }
} 

function mouseDragged() {
  kasuj();
}
function mouseClicked(){
  kasuj();
}

function kasuj(){
  for (var i = 0; i < bloki.length; i++) {
    if(bloki[i].isPointIn(mouseX, mouseY))
      bloki[i].turned = false;
  }
}
