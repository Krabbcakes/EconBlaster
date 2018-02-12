/////world

function worldUpdates (gameRunning) {
	stockpilesUpdateAll(gameRunning);
	foodNodesUpdateAll(gameRunning);
	ironNodeUpdate(gameRunning);
	cozySpotUpdate(gameRunning);
	addStartingNodes(gameRunning);

}

var foodNodeCount = 10;
var ironNodeCount = 4;

var stockpileCount = 1;
var cozySpotCount = 1;

function addStartingNodes (gameRunning) {
	if (foodNodeCount >=1) {
		addFoodNode(gameRunning);
		foodNodeCount -= 1;
	}
	if (ironNodeCount >=1) {
		addIronNode(gameRunning);
		ironNodeCount -= 1;
	}
	if (stockpileCount >= 1) {
		addStockpile(gameRunning);
		stockpileCount -= 1;
	}
	if (cozySpotCount >= 1) {
		addCozySpot (gameRunning);
		cozySpotCount -= 1;
	}
}

////

var stockpileList = [];

class Stockpile extends Circle {
	constructor (x,y,radius,color) {
		super (x,y,radius,color);
		this.x = 600;
		this.y = 400;
		this.radius = 25;
		this.color = 'brown';


//		this.foodSupply = 0;
//		this.toolSupply = 0;
//		this.ironSupply = 0;

	}
	showStats () {
		colorText('Food Supply Total: ' + foodSupply,this.x+45,this.y-35, 'white', '30px Arial');
	}

	update (gameRunning) {
		if (gameRunning == true) {
			super.update(this.x,this.y,this.radius,this.color);
//			this.showStats ();
		}
	}
}
//////////////////////////////////////

function addStockpile (x,y) {
	var tempStockpile = new Stockpile (x,y);
	stockpileList.push(tempStockpile);
}

function stockpileUpdate (gameRunning){
	for (var i=0;i<stockpileList.length;i++) {
		stockpileList[i].update(gameRunning);
	}
}

function stockpilesUpdateAll (gameRunning) {
	stockpileUpdate (gameRunning);
} 

////////////////////////////////////////


var cozySpotList = [];

class CozySpot extends Circle {
	constructor (x,y,radius,color) {
		super (x,y,radius,color);
		this.x = Math.floor(Math.random() * canvas.width);
		this.y = Math.floor(Math.random() * canvas.height);
		this.radius = 50;
		this.color = 'grey';
	}

	update (gameRunning) {
		if (gameRunning == true) {
			super.update(this.x,this.y,this.radius,this.color);
		}
	}
}

function addCozySpot (x,y) {
	var tempCozySpot = new CozySpot (x,y);
	cozySpotList.push(tempCozySpot);
}
function cozySpotUpdate (gameRunning) {
	for (var i=0;i<cozySpotList.length;i++) {
		cozySpotList[i].update(gameRunning);
	}
}





//////////////////////////////////////


var foodNodeList = [];

class FoodNode extends Circle {
	constructor (x,y,radius,color) {
		super (x,y,radius,color);
		this.x = Math.floor(Math.random() * canvas.width);
		this.y = Math.floor(Math.random() * canvas.height);
		this.radius = 15;
		this.color = 'GreenYellow';
		this.foodSupply = 1000;

	}
	showStats () {
		colorText ('fudz: '+this.foodSupply, this.x+15, this.y-5, 'white', '11px Arial');
	}

	depletion (i) {
		if (this.foodSupply <= 0) {
			this.killMe(i);
		}
	}
	killMe (i) {
		foodNodeList.splice(i, 1);
	}

	update (i, gameRunning) {
		super.update (this.x,this.y,this.radius,this.color);
		this.showStats();
		this.depletion(i);
	}
}

function addFoodNode (x,y) {
	var tempFoodNode = new FoodNode (x,y);
	foodNodeList.push(tempFoodNode);
}

function foodNodeUpdate (gameRunning) {
	for (var i=0;i<foodNodeList.length;i++) {
		foodNodeList[i].update(i,gameRunning);
	}
}

function foodNodesUpdateAll (gameRunning){
	foodNodeUpdate (gameRunning);
}


var ironNodeList = [];

class IronNode extends Circle {
	constructor (x,y,radius,color) {
		super (x,y,radius,color);
		this.x = Math.floor(Math.random() * canvas.width);
		this.y = Math.floor(Math.random() * canvas.height);
		this.radius = 18;
		this.color = 'DarkSlateGrey';

		this.ironSupply = 1000;
	}
	depletion (index) {
		if (this.ironSupply <= 0) {
			this.killMe(index);
		}
	}
	killMe (index) {
		ironNodeList.splice(index,1);
	}
	showStats () {
		colorText ('iron: '+this.ironSupply, this.x+15, this.y-5, 'white', '11px Arial');
	}
	update (index, gameRunning) {
		super.update (this.x,this.y,this.radius,this.color);
		this.depletion(index);
		this.showStats();
	}
}

function addIronNode (x,y) {
	var tempIronNode = new IronNode (x,y);
	ironNodeList.push(tempIronNode);
}
function ironNodeUpdate (gameRunning) {
	for (var i=0;i<ironNodeList.length;i++) {
		ironNodeList[i].update(i,gameRunning);
	}
}
