 

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);

	document.addEventListener("keydown", keyPressedSpaceBar);
	document.addEventListener("keydown", keyPressedLeftAlt);

}
var canvas, canvasContext;



//////////////////////////////////  UPDATE  ////////////////////////////////////////////

function updateAll () {
	drawAll (gameRunning);
	gameTimer(gameRunning);
	worldUpdates (gameRunning);
	unitsUpdateAll (gameRunning);	
	populationManagement(gameRunning);
	displayStats(gameRunning);
}

///////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////// 	PAUSE  ///////////////////////////////
gameRunning = new Boolean (true);

function keyPressedSpaceBar(evt) {
	if (evt.keyCode == 32) {
		if (gameRunning == false) {
			gameRunning = true;
		}
		else {
			gameRunning = false;
		}
	}
}

altPressed = false;
function keyPressedLeftAlt(evt) {
	if (evt.keyCode == 18 && altPressed == false) {
		altPressed = true;
		return;
	}
	if (evt.keyCode == 18 && altPressed == true) {
		altPressed = false;
		
	}
}

////////////////////////////////////  GLOBAL INVENTORY
var gameTimeFrames = 0;
var gameTimeSeconds = 0;
function gameTimer (gameRunning) {
	gameTimeFrames += 1;
	gameTimeSeconds = (gameTimeFrames / 30);
}

function displayStats (gameRunning) {
	colorText (Math.round(gameTimeSeconds), 600, 30, 'black', '12px Arial');
	colorText ("Food: "+ foodSupply, 10, 45, 'white', '12px Arial');
	colorText ("Units: " + unitList.length, 10, 30, 'white', '12px Arial');

	colorText ("foodNodeOnMap: " + Math.round(foodNodeOnMap), 10, 100, 'white', '12px Arial');
	colorText ("unitDeaths: " + unitDeaths, 10, 115, 'white', '12px Arial');
}


var foodSupply = 1000;

var unitDeaths = 0;




function populationManagement () {
	if (foodSupply >= 1000) {
		addUnit(600,400);
	}
}





/////////////////////////////////////

class Circle {
	constructor (x,y,radius,color) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
	}
	update (gameRunning) {
		colorCircle (this.x,this.y,this.radius,this.color);
	}
}







/////////////////////////// DRAW 

function drawAll (gameRunning) {
	drawBackground (gameRunning);
}


function drawBackground(gameRunning) {
	if (gameRunning) {
		colorRect(0,0, canvas.width, canvas.height, 'DarkGreen');
	}
}


function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX,topLeftY,boxWidth,boxHeight);
}

function colorCircle (centerX, centerY, radius, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true);
	canvasContext.fill();
}

function colorHollowCircle (centerX,centerY, radius,lineWidth,color) {
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY,radius,0,2*Math.PI);
	canvasContext.lineWidth = lineWidth;
	canvasContext.strokeStyle = color;
	canvasContext.stroke();
}
function colorText(showWords, textX, textY, fillColor, font) {
	canvasContext.font = font;
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords,textX, textY);
}

function drawLine (x1,y1,x2,y2) {
	canvasContext.beginPath();
	canvasContext.moveTo(x1, y1);
	canvasContext.lineTo(x2, y2);
	canvasContext.lineWidth = 0.5;
	canvasContext.strokeStyle = '#F0F8FF';
	canvasContext.stroke();
}