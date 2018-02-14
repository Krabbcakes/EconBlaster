function unitsUpdateAll (gameRunning){
	unitUpdate(gameRunning);	
}

var unitList = [];

class Unit extends Circle {
	constructor (x,y,vel_x,vel_y,radius, color, gold, tools, hunger, stamina) {
		super (x,y,radius,color);
		this.x = 600;
		this.y = 400; 

		this.speed = 5;
		this.vel_x = 0;
		this.vel_y = 0;
		this.radius = 8;
		this.color = 'white';

		this.gold = 0;
		this.tools = 0;
		this.foodInventory = 200;

		this.maxCarryWeight = 200;
		this.currentInventoryWeight = 0;

		this.hp = 100;
		this.hunger = 0;
		this.hungry = false;
		this.fatigue = 0;

		this.targetObject = null;

		this.currentNodeCheck = null;

		this.stockpileNodeType = false;
		this.foodNodeType = false;
		this.cozySpotNodeType = false;

		this.harvesting = false;

	}
	stopMoving () {
		this.speed = 0;
	}
	moveAgain () {
		this.speed = 5;
	}


	checkNodeCollision () {

		if (this.currentNodeCheck == null) {
			for (var i=0;i<resourceNodeList.length;i++) {
				var tempResourceNode = resourceNodeList[i];
					if (checkIfWithinRadius (this,tempResourceNode,tempResourceNode.radius) == true) {
						this.currentNodeCheck = tempResourceNode;
						this.harvesting = true;
						break;
					}
			}
		}
		if (this.currentStockpileCheck == null) {
			for (var i=0;i<stockpileList.length;i++) {
				var tempStockpile = stockpileList[i];
					if (checkIfWithinRadius (this,tempStockpile,tempStockpile.radius) == true) {
						tempStockpile.depositFood(this.foodInventory);
						this.foodInventory = 0;
						this.currentInventoryWeight = 0;
						break;
					}
			}
		}	
}

	stopMovementUnit () {
		this.vel_x = 0;
		this.vel_y = 0;
	}
 	moveUnit () {
 		if (this.targetObject == null) {
 			return;
 		}
 		var dx,dy,distance,dirx,diry;

 		dx = this.targetObject.x - this.x;
 		dy = this.targetObject.y - this.y;
 		distance = getMagnitude(dx,dy);

 		dirx = dx/distance;
 		diry = dy/distance;

 		this.x += this.speed * dirx;
 		this.y += this.speed * diry;
 	}



	setTargetFoodNode () {
		for (var i=0; i<resourceNodeList.length;i++) {
			var tempResourceNode = resourceNodeList [i];
			if (tempResourceNode.type == 'food') {
				this.targetObject = tempResourceNode;
			break;
			}
		}
	}


	setTargetStockpile () {
		for (var i=0;i<stockpileList.length;i++) {
			var tempStockpile = stockpileList[i];
			this.targetObject = tempStockpile;
			break;
		}		
	}
	setTargetCozySpot () {
		for (var i=0; i<resourceNodeList.length;i++) {
			var tempResourceNode = resourceNodeList [i];
			if (tempResourceNode.type == 'cozySpot') {
				this.targetObject = tempResourceNode;
			console.log ('tired');
			break;
			}
		}
	}

	checkInventoryWeight () {
		if (this.currentInventoryWeight < this.maxCarryWeight) {
			return true;
		}
		return false;
	}


 	increaseHunger () {
	this.hunger += .5;
	}

	increaseFatigue () {
	this.fatigue += 1;
	}
 	checkHealthConditions (index) {
		if (this.hunger > 100) {
			this.consumeFood ();
			this.hungry = true;
		}
		if (this.hunger > 1000) {
			this.killMe(index);
		}
	}
 	consumeFood () {
		if (this.foodInventory >= 100 && this.hunger > 20){
			this.foodInventory -= 100;
			this.hunger -= 100;
			return;
		}
	}

	checkFatigue () {
		if (this.fatigue >= 100) {
//			console.log ('fatigue > 100');
			return true;
		}
		return false;
	}

	rested () {
		if (this.fatigue <= 0) {
			return true;
		}
		return false;
	}

	restInPlace () {
		if (this.checkFatigue == true && this.rested() == false) {
			this.stopMoving();
			this.fatigue -= 10;
			console.log ('RIP');
		}
	}



	checkHP (index) {
		if (this.hp <= 0) {
			this.killMe(index);
		}
	}

	killMe (index) {
		unitDeaths += 1;
		unitList.splice(index, 1);
	}

    showStats (altPressed) {
	colorText('Hunger: ' + Math.round(this.hunger),this.x + 12, this.y-5, 'white', '10px Arial');
	colorText('Food: ' + this.foodInventory,this.x+12,this.y+5, 'white');
	colorText('Fatigue: ' + Math.round(this.fatigue),this.x+12,this.y+15, 'white');
}

	determineTask () {
//		if (this.checkFatigue() == true) {
//			this.setTargetCozySpot();
//			this.restInPlace();
//			return;
//		}
		if (this.checkInventoryWeight() == false) {
			this.setTargetStockpile();
		}
		if (this.checkInventoryWeight() == true) {
			this.setTargetFoodNode();
		}
	}



	checkHarvest () {
		if (this.harvesting == true) {
			this.stopMoving();	
			var resourceYield = this.currentNodeCheck.harvestNode();
			if (resourceYield.type == 'food' && this.checkInventoryWeight() == true) {	
				this.foodInventory += resourceYield.value;
				this.currentInventoryWeight += resourceYield.value*resourceYield.weight;
				return;
			}
			if (resourceYield.type == 'cozySpot' && this.rested() == false) {
				this.fatigue -= resourceYield.value;
				return;
			}
			
			this.currentNodeCheck.stopHarvestNode();
			this.currentNodeCheck = null;
			this.harvesting = false;
			this.setTargetStockpile();
			this.moveAgain();	
		}
	}


	update (index, gameRunning) {
		if (gameRunning == true) {
		super.update();
		this.moveUnit();
		this.determineTask();
		this.increaseHunger();

		this.increaseFatigue();
		this.checkFatigue();
		this.restInPlace();

		this.checkHealthConditions();
		this.checkHP(index);
		this.checkNodeCollision();
		this.checkHarvest();


		}
		if (gameRunning == false) {
			this.showStats();
		}
		if (altPressed == true) {
			this.showStats();
		}
	}
}



//////////////////////////

function addUnit (x,y) {
	var tempUnit = new Unit (x,y);
	unitList.push(tempUnit);
	foodSupply -= 1000;
}

function unitUpdate (gameRunning) {
	for (var i=0; i<unitList.length;i++) {
		unitList[i].update(i,gameRunning)
	}
}
