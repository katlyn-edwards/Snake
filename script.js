// TODO:
//  Various sized grids
//  Various speeds (novice, average, expert)
//  JankyJQuery

var GRID_SIZE;// = Math.pow(40,2);
var ROW_SIZE;// = Math.sqrt(GRID_SIZE);
var SPEED; 
var snake_grid = [];
var last_move = "up";
var timer = null;
var food = {row: -1, col: -1};

$(document).ready(function () {
	listenToRadios();
	setUpGame();
	$(document).keyup(userKeyboard);
	$("#start").click(startGame);
});

function listenToRadios() {
	var radios = $("input[type='radio']");
	radios.change(function() {
		$("#board").html("");
		setUpGame();
	});
}

function setUpGame() {
	setGlobals();
	setUpGrid();
	startSnake();
	placeFood();
}

function setGlobals() {
	var gridRadios = $("input[name='grid']");
	for (var i = 0; i < gridRadios.length; i++) {
		if (gridRadios[i].checked) {
			GRID_SIZE = Math.pow(parseInt(gridRadios[i].value), 2);
		}
	}

	var speedRadios = $("input[name='speed']");
	for (var i = 0; i < speedRadios.length; i++) {
		if (speedRadios[i].checked) {
			SPEED = parseInt(speedRadios[i].value);
		}
	}
	ROW_SIZE = Math.sqrt(GRID_SIZE);
}

function setUpGrid() {
	for (var i = 0; i < ROW_SIZE; i++) {
	   for (var j = 0; j < ROW_SIZE; j++) {
	   	  var box = $("<div>");
	   	  box.addClass("square").addClass("empty");
	   	  $(box).attr("id", "box" + i + "_" + j);
	   	  $("#board").append(box);
	   }
   }
   $("#board").css({width: (15 * ROW_SIZE) + "px", height: (15 * ROW_SIZE) + "px"});
}

function placeFood() {
	var squares = $(".square.empty");
	if (squares.length == 0) {
		alert("YOU WIN! :D");
		pauseTimer();
		return;
	}
	var index = Math.floor(Math.random() * squares.size());
	var chosen = squares[index].id.split("_");
	// Save to "food" global variable.
	food.row = chosen[0].substring(3);
	food.col = chosen[1];
	$("#box" + food.row + "_" + food.col).removeClass("empty").addClass("food");
}

function startSnake() {
	$($(".square.empty")[(GRID_SIZE / 2) + (ROW_SIZE / 2)]).removeClass("empty").addClass("snake");
	snake_grid[0] ={row: (ROW_SIZE / 2), col: (ROW_SIZE / 2)};
}

function userKeyboard(e) {
	if (e.keyCode < 37 || e.keyCode > 40 && e.keyCode != 80) {
		return;
	}
	if (e.keyCode == 37) {
		last_move = "left";
	} else if (e.keyCode == 38) {
		last_move = "up";
	} else if (e.keyCode == 39) {
		last_move = "right";
	} else if (e.keyCode == 40) {
		last_move = "down";
	} else { //e.keyCode == 80
		// "p" for pause
		if (timer) {
			pauseTimer();
		} else {
			startGame();
		}
	}
}

function checkFood(location) {
	if (location.row == food.row && location.col == food.col) {
		// Update score
		$("#score").text(parseInt($("#score").text()) + 10);
		// Remove old food
		$("#board .food").removeClass("food").addClass('empty');
		// Place new food
		placeFood();
		return true;	
	} 
	return false;
}

function moveSnake() {
	// Find front of the snake
	var front = snake_grid[snake_grid.length - 1];
	if (!front) {
		front = last_box;
	}
	var newLocation = {row: front.row, col: front.col};
	if (last_move == "up") {
		newLocation.row--;
	} else if (last_move == "down") {
		newLocation.row++;
	} else if (last_move == "left") {
		newLocation.col--;
	} else  { // last_move == "right"
		newLocation.col++;
	}
	var ate = checkFood(newLocation);
	if (!ate) {
		// Cut off "oldest" snake bit
		var last_box = snake_grid[0];
		snake_grid.splice(0, 1);
		var name = "#box" + last_box.row + "_" + last_box.col;
		$(name).removeClass("snake").addClass("empty");
	} 
	checkEndGame(newLocation);
	// Add new front
	$("#box" + newLocation.row + "_" + newLocation.col).removeClass("empty").addClass("snake");
	snake_grid[snake_grid.length] = newLocation;

	// Update score
	$("#score").text(parseInt($("#score").text()) + 1);
}

function startGame() {
	$("#start").attr("disabled", true).text("Press 'P' to pause");
	timer = setInterval(moveSnake, SPEED);
}

function checkEndGame(location) {
	if (location.row < 0 || location.row >= ROW_SIZE ||
	    location.col < 0 || location.col >= ROW_SIZE ||
	    $("#box" + location.row + "_" + location.col).hasClass("snake")) {
		endGame();
	}
}

function endGame() {
	pauseTimer();
	alert("game over");
}

function pauseTimer() {
	clearInterval(timer);
	timer = null;
	$("#start").attr("disabled", false).text("Click to start (or press 'P')");
}