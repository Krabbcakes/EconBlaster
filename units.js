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

		this.hp = 100;
		this.hunger = 0;
		this.hungry = false;
		this.fatigue = 0;
		this.tired = false;


		this.targetObject = null;

		this.currentNodeCheck = null;

		this.stockpileNodeType = false;
		this.foodNodeType = false;
		this.cozySpotNodeType = false;

	}
	stopMoving () {
		this.speed = 0;
	}
	moveAgain () {
		this.speed = 5;
	}

	checkNodeCollision () {
		if (this.currentNodeCheck == null) {
			for (var i=0;i<foodNodeList.length;i++) {
				var tempFoodNode = foodNodeList[i];
					if (checkIfWithinRadius (this,tempFoodNode,this.radius) == true) {
						this.currentNodeCheck = tempFoodNode;
						this.foodNodeType = true;
						this.stopMovementUnit();
						break;
					}
			}		
			for (var i=0;i<stockpileList.length;i++) {
				var tempStockpile = stockpileList[i];
					if (checkIfWithinRadius (this,tempStockpile,this.radius) == true) {
						this.currentNodeCheck = tempStockpile;
						this.stockpileNodeType = true;
						this.stopMovementUnit();
						break;
					}
			}	
			for (var i=0;i<cozySpotList.length;i++) {
				var tempCozySpot = cozySpotList[i];
					if (checkIfWithinRadius (this,tempCozySpot,this.radius) == true && this.fatigue >= 100) {
						this.currentNodeCheck = tempCozySpot;
						this.cozySpotNodeType = true;
						this.stopMovementUnit();
						break;
					}
			}			
		}
		else if (checkIfWithinRadius (this,this.currentNodeCheck,this.radius) == false) {
			this.currentNodeCheck = null;
		}
	}


///////////////////////////////////  STOCKPILE
	stockpileContact () {
		if (this.currentNodeCheck != null && this.stockpileNodeType == true && this.foodInventory > 100) {
			this.stopMoving();
			this.foodInventory -= 10;
			foodSupply += 10;
		}
	}

	stockpileFinishedDropOff () {
		if (this.currentNodeCheck != null && this.stockpileNodeType == true && this.foodInventory <= 100) {
			this.stockpileNodeType = false;
			this.moveAgain();
			this.checkFatigue();
			if (this.tired == false) {
			this.setTargetFoodNode();
			}
		}
	}


/////////////////////////////////////  FOOD NODE
	harvestingFoodNode () {
		if (this.currentNodeCheck != null && this.foodNodeType == true) {
			this.foodInventory += 10;
			this.currentNodeCheck.foodSupply -= 10;
//			this.currentNodeCheck.foodInventory -= 10;
			this.stopMoving();
		}
	}
	harvestingDepletedFoodNode () {
		if (this.currentNodeCheck != null && this.currentNodeCheck.foodSupply <= 0) {
			this.foodNodeType = false;
			this.moveAgain();
			this.setTargetStockpile();
		}
	}

	harvestingFoodNodeStop () {
		if (this.currentNodeCheck != null && this.foodNodeType == true && this.foodInventory >= 500) {
			this.foodNodeType = false;
			this.moveAgain();
			this.checkFatigue();
			if (this.tired == false) {
				this.setTargetStockpile();
			}
		}
		else {
			this.checkNodeCollision();

		}
	}


///////////////////////////////////////  SLEEPING
	sleepingInCozySpot () {
		if (this.currentNodeCheck != null && this.cozySpotNodeType == true) {
			this.fatigue -= .5;
			this.stopMoving();
		}
	}

	wakeupInCozySpot () {
		if (this.currentNodeCheck !=null && this.cozySpotNodeType == true && this.fatigue <= 0) {
			this.cozySpotNodeType = false;
			this.checkFatigue();
			this.moveAgain();
			this.determineTask();
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

/* 	getTarget (target) {
// 		this.targetObject = target;
 		for (var i=0;i<foodNodeList.length;i++) {
				var tempFoodNode = foodNodeList[i];
						this.targetObject = tempFoodNode;
						break;
			}			
 	}
*/

	setTargetFoodNode () {
		for (var i=0;i<foodNodeList.length;i++) {
			var tempFoodNode = foodNodeList[i];
			this.targetObject = tempFoodNode;
			break;
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
		for (var i=0;i<cozySpotList.length;i++) {
			var tempCozySpot = cozySpotList[i];
			this.targetObject = tempCozySpot;
			break;
		}		
	}


 	increaseHunger () {
	this.hunger += .5;
	}

	increaseFatigue () {
	this.fatigue += .1;
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
//			this.vel_x = 0;
//			this.vel_y = 0;
			this.foodInventory -= 100;
			this.hunger -= 100;
			return;
		}
	}
	checkFatigue () {
		if (this.fatigue >= 100) {
			this.setTargetCozySpot();
			this.tired = true;
			return;
		}
		if (this.fatigue < 100) {
			this.tired = false;
		}
	}
	checkHP (index) {
		if (this.hp <= 0) {
			this.killMe(index);
		}
	}
	killMe (index) {
		unitList.splice(index, 1);
	}

    showStats (altPressed) {
	colorText('Hunger: ' + Math.round(this.hunger),this.x + 12, this.y-5, 'white', '10px Arial');
	colorText('Food: ' + this.foodInventory,this.x+12,this.y+5, 'white');
	colorText('Fatigue: ' + Math.round(this.fatigue),this.x+12,this.y+15, 'white');
}

	determineTask () {
		if (this.foodInventory > 150 && this.tired == false) {
			this.setTargetStockpile();
		}
		if (this.foodInventory <= 150 && this.tired == false) {
			this.setTargetFoodNode();
		}
		if (this.tired == true) {
			this.setTargetCozySpot();
		}
	}



	update (index, gameRunning) {
		if (gameRunning == true) {
		super.update(this.x,this.y,this.radius,this.color);
		this.moveUnit();
		this.increaseHunger();
		this.increaseFatigue();
		this.checkHealthConditions();
		this.checkHP(index);

		this.checkNodeCollision();
//		this.determineTask();

		this.harvestingFoodNode();
		this.harvestingDepletedFoodNode();
		this.harvestingFoodNodeStop();

		this.stockpileContact();
		this.stockpileFinishedDropOff();

		this.sleepingInCozySpot();
		this.wakeupInCozySpot();

//		this.showStats();
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
