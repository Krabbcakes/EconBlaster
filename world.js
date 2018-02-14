/////world

function worldUpdates (gameRunning) {
	stockpilesUpdateAll(gameRunning);
	resourceNodeUpdate(gameRunning);
//	ironNodeUpdate(gameRunning);
//	cozySpotUpdate(gameRunning);
	addStartingNodes(gameRunning);

	populateNewResourceNodes(gameRunning);

}

var foodNodeOnMap = 0;
var foodNodeCount = 10;

var ironNodeCount = 0;

var stockpileCount = 1;
var cozySpotCount = 0;

function addStartingNodes (gameRunning) {
	if (foodNodeCount >=1) {
		addFoodNode(Math.floor(Math.random() * canvas.width),Math.floor(Math.random() * canvas.height));
		foodNodeCount -= 1;
		foodNodeOnMap += 1;
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
		addCozySpot (Math.floor(Math.random() * canvas.width),Math.floor(Math.random() * canvas.height));
		cozySpotCount -= 1;
	}
}

function populateNewResourceNodes (gameRunning) {
	if (gameRunning == true) {
	foodNodeCount += 0.01
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

	depositFood (depositFoodAmount) {
		foodSupply += depositFoodAmount;

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




///////////////////////////////////////    Resource Node
var resourceNodeList = [];

class ResourceNode extends Circle {
	constructor (x,y,radius,color,myResource,harvestingRate, weight, type) {
		super (x,y,radius,color);
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;

		this.weight = weight;
		this.type = type;

		this.myResource = myResource;
		this.harvestingRate = harvestingRate;

		this.alive = true;
	}
///////

	harvestNode () {
		this.myResource -= this.harvestingRate;
		return this.weight;
	}

	stopHarvestNode () {

	}

	checkDepletion () {
		if (this.myResource <= 0) {
			this.killMe();
		}
	}

	killMe () {
		this.alive = false;
	}

	update (gameRunning) {
		super.update(gameRunning);
		if (gameRunning == true) {
		this.checkDepletion();
		}
	}
}

function resourceNodeUpdate (gameRunning) {
	for (var i=0;i<resourceNodeList.length;i++) {
		if (resourceNodeList[i].alive == false) {
			resourceNodeList.splice (i,1);
			continue;
		}
		resourceNodeList[i].update(gameRunning);
	}
}

//////////////////////////////////////     COZY SPOT


var cozySpotList = [];

class CozySpot extends ResourceNode {
	constructor (x,y) {
		super (x,y,50,'grey',0,2,0,'cozySpot');
	}

	//rest
	harvestNode () {
		this.color = 'orange';
		var energy = {weight: this.weight, value: this.harvestingRate, type: this.type};
		console.log ('boomclap');
		return energy;
	}

	stopHarvestNode () {
		this.color = ' grey';

	}

	checkDepletion () {

	}

	update (gameRunning) {
		super.update(gameRunning);
	}
}

function addCozySpot (x,y) {
	var tempCozySpot = new CozySpot (x,y);
	resourceNodeList.push(tempCozySpot);
}

////////////////////////////////////////////////
var foodNodeList = [];

class FoodNode extends ResourceNode {
	constructor (x,y) {
		super (x,y,15,'GreenYellow',1000,10, 1, 'food');
	}
	showStats () {
		colorText ('fudz: '+this.myResource, this.x+15, this.y-5, 'white', '11px Arial');
	}

	harvestNode () {
		this.color = 'blue';
		var food = {weight: super.harvestNode(), value: this.harvestingRate, type: this.type};
		return food;
	} 

	stopHarvestNode () {
		this.color = 'GreenYellow';
	}

	killMe () {
		this.alive = false;
		foodNodeOnMap -= 1;
	}
	
	update (gameRunning) {
		super.update (gameRunning);
		this.showStats();
	}
}

function addFoodNode (x,y) {
	var tempFoodNode = new FoodNode (x,y);
	resourceNodeList.push(tempFoodNode);
}


////////////////////////////////////////////////////    IRON
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
	resourceNodeList.push(tempIronNode);
}
