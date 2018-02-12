function checkIfWithinRadius (obj1,obj2,radius) {
	
if (Math.sqrt ( ((obj1.x - obj2.x)*(obj1.x - obj2.x)) + ((obj1.y - obj2.y)*(obj1.y - obj2.y)) ) < radius) {
	return true;
}
	return false;
}



function getMagnitude (x,y) {
	return Math.sqrt(x*x + y*y);
}

function getMagnitudeSq (x,y) {
	return (x*x + y*y);
}