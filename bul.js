// CONSTANTS
var arrPos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var arrRollDice=['Corn_Normal.png', 'Corn_Black.png'];
var arrRollAngles=['deg45', 'deg90', 'deg135', 'deg180', 'deg225', 'deg270', 'deg315']
var playerColor = ["", "Blue", "Red"];

// VARIABLES
var rolls = [];
var total = 0;
var currPlay = 1;
var diceRolled = false;
var gameOver = false;
var playPos = [
	{id: "p1-1", pos: 0, dir: 1, captured: false, capturedby: null, killed: false},
	{id: "p1-2", pos: 0, dir: 1, captured: false, capturedby: null, killed: false},
	{id: "p1-3", pos: 0, dir: 1, captured: false, capturedby: null, killed: false},
	{id: "p1-4", pos: 0, dir: 1, captured: false, capturedby: null, killed: false},
	{id: "p1-5", pos: 0, dir: 1, captured: false, capturedby: null, killed: false},
	{id: "p2-1", pos: 12, dir: -1, captured: false, capturedby: null, killed: false},
	{id: "p2-2", pos: 12, dir: -1, captured: false, capturedby: null, killed: false},
	{id: "p2-3", pos: 12, dir: -1, captured: false, capturedby: null, killed: false},
	{id: "p2-4", pos: 12, dir: -1, captured: false, capturedby: null, killed: false},
	{id: "p2-5", pos: 12, dir: -1, captured: false, capturedby: null, killed: false}
];

function initBul(){
	rolls = [];
	total = 0;
	currPlay = 1;
	diceRolled = false;
	gameOver = false;
	playPos = [
		{id: "p1-1", pos: 0, dir: 1, captured: false, capturedby: null, killed: false},
		{id: "p1-2", pos: 0, dir: 1, captured: false, capturedby: null, killed: false},
		{id: "p1-3", pos: 0, dir: 1, captured: false, capturedby: null, killed: false},
		{id: "p1-4", pos: 0, dir: 1, captured: false, capturedby: null, killed: false},
		{id: "p1-5", pos: 0, dir: 1, captured: false, capturedby: null, killed: false},
		{id: "p2-1", pos: 12, dir: -1, captured: false, capturedby: null, killed: false},
		{id: "p2-2", pos: 12, dir: -1, captured: false, capturedby: null, killed: false},
		{id: "p2-3", pos: 12, dir: -1, captured: false, capturedby: null, killed: false},
		{id: "p2-4", pos: 12, dir: -1, captured: false, capturedby: null, killed: false},
		{id: "p2-5", pos: 12, dir: -1, captured: false, capturedby: null, killed: false}
	];

	initTokens();
	setOpacity();
	clearDice();
	$("#btnRoll").removeClass("hide");
	$("#btnSkip").addClass("hide");
}

function getRandom(min, max){
	return Math.floor(Math.random()*(max-min+1)+min);
}
function shuffle(array) {
	var i = array.length, j = 0, temp;
	while (i--){
		j = Math.floor(Math.random() * (i+1));
		temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

function getRoll(){
	var roll;
	rolls = [];
	total = 0;
	for(var i=0;i<4;i++){
		roll = getRandom(0, 1);
		total+=roll;
		rolls.push(roll);
	}
	if(total==0)
		total = 5;
	
	showRoll();
}

function showRoll(){
	var arrShuffle = shuffle(arrPos);
	var dice;
	clearDice();

	$("#total").html(total);
	for(var i=0;i<4;i++){
		dice = $("<div class='dice'></div>");
		var angle=arrRollAngles[getRandom(0, 6)];
		dice.addClass(angle);
		if(rolls[i] == 1)
			dice.addClass("black");
		else
			dice.addClass("yellow");
		$("#roll-"+arrShuffle[i]).append(dice);
	}
	diceRolled = true;
	showLog("Dice rolled - " + rolls + " - " + total);
	$("#btnRoll").addClass("hide");
	$("#btnSkip").removeClass("hide");
}

function clearDice(){
	$(".dice").remove();
	$("#total").html("");
}

function initTokens(){
	var token;
	for(var i=0;i<5;i++){
		token = $("<div class='token blue' id='p1-" + (i+1) + "' title='p1-" + (i+1) + "'></div>");
		$("#p1-castle td:nth-child(" + (i+1) + ")").html(token);

		token = $("<div class='token red' id='p2-" + (i+1) + "' title='p2-" + (i+1) + "'></div>");
		$("#p2-castle td:nth-child(" + (i+1) + ")").html(token);
	}
	$("div[id|='p1']").click(function(){checkMove(this)});
	$("div[id|='p2']").click(function(){checkMove(this)});
	
	for(var i=1;i<=11;i++){
		$("#track-"+i).html("");
	}
}

function checkMove(that){
	var currPlayer, currPlayerIndex;
	var attemptMove, dir, canMove = true;
	if(!diceRolled){
		showAlert("Roll the dice first");
		return;
	}
	
	for(var i=0;i<playPos.length;i++){
		if(playPos[i].id == that.id){
			currPlayer = playPos[i];
			currPlayerIndex = i;
			break;
		}
	}
	if(currPlayer.captured){
		showAlert("Captured peices cannot be moved");
		return;
	}
	if(currPlayer.killed){
		showAlert("Killed peices cannot be moved");
		return;
	}
	if(currPlayer.id[1] != currPlay){
		showAlert("Current player is " + playerColor[currPlay]);
		return;
	}
	
	attemptMove = currPlayer.pos + (currPlayer.dir * total);
	if(attemptMove >= 12 || attemptMove <= 0){
		if(playPos[currPlayerIndex].id[1] == 1 && attemptMove >= 12){
			showAlert("Can't move" + playPos[currPlayerIndex].id + " there");
			showLog("Can't move" + playPos[currPlayerIndex].id + " there");
			return;
		}
		if(playPos[currPlayerIndex].id[1] == 2 && attemptMove <= 0){
			showAlert("Can't move" + playPos[currPlayerIndex].id + " there");
			showLog("Can't move" + playPos[currPlayerIndex].id + " there");
			return;
		}
	
		playPos[currPlayerIndex].pos = (playPos[currPlayerIndex].id[1] == 1) ? 0 : 12;
		playPos[currPlayerIndex].dir = (playPos[currPlayerIndex].id[1] == 1) ? 1 : -1;
		playPos[currPlayerIndex].captured = false;
		playPos[currPlayerIndex].capturedby = null;
		$("#" + playPos[currPlayerIndex].id).appendTo($("#p" + playPos[currPlayerIndex].id[1] + "-castle td:nth-child(" + playPos[currPlayerIndex].id[3] + ")"));
		showLog(playPos[currPlayerIndex].id + " reached home");
		
		for(var i=0; i<playPos.length;i++){
			if(playPos[i].capturedby == currPlayer.id){
				showLog(playPos[i].id + " was killed");
				$("#" + playPos[i].id).addClass("killed").appendTo($("#p" + currPlayer.id[1] + "-prison"))
				playPos[i].capturedby = null;
				playPos[i].pos = -1;
				playPos[i].captured = false;
				playPos[i].killed = true;
			}
		}
		canMove = false;
		switchMove();
		return;
	}

	if(canMove){
		for(var i=0;i<playPos.length;i++){
			if(playPos[i].id != currPlayer.id && playPos[i].pos == attemptMove){
				if(playPos[i].id[1] == currPlay){
					if(!playPos[i].captured){
						showAlert("Can't move there, your colleague is already there");
						canMove = false;
					}
				}else{
					if(!playPos[i].captured){
						playPos[i].captured = true;
						playPos[i].capturedby = currPlayer.id;
						$("#" + playPos[i].id).addClass("captured");
						if((playPos[currPlayerIndex].id[1] == 1 && playPos[currPlayerIndex].dir == 1) || (playPos[currPlayerIndex].id[1] == 2 && playPos[currPlayerIndex].dir == -1))
							playPos[currPlayerIndex].dir = playPos[currPlayerIndex].dir * -1;
						showAlert("You (" + playPos[currPlayerIndex].id + ") captured " + playPos[i].id);
						
						
						for(var j=0;j<playPos.length;j++){
							if(playPos[j].capturedby == playPos[i].id){
								playPos[j].pos = (playPos[j].id[1] == 1) ? 0 : 12;
								playPos[j].dir = (playPos[j].id[1] == 1) ? 1 : -1;
								playPos[j].captured = false;
								playPos[j].capturedby = null;
								showLog(playPos[j].id + " was relased");
								$("#" + playPos[j].id).removeClass("captured").appendTo($("#p" + playPos[j].id[1] + "-castle td:nth-child(" + playPos[j].id[3] + ")"));
							}
						}
					}
				}
			}
		}
	}
	
	if(canMove){
		$(that).appendTo($("#track-" + attemptMove));
		playPos[currPlayerIndex].pos = attemptMove;
		showLog(playPos[currPlayerIndex].id + " moved to " + attemptMove);
		
		for(var i=0;i<playPos.length;i++){
			if(playPos[i].capturedby == currPlayer.id){
				$("#" + playPos[i].id).appendTo($("#track-" + attemptMove));
				playPos[i].pos = attemptMove;
				showLog(playPos[i].id  + " moved with " + playPos[currPlayerIndex].id + " to " + attemptMove);
			}
		}
		switchMove();
	}
}

function switchMove(){
	currPlay = currPlay == 1 ? 2 : 1;
	showLog("Current Player - " + currPlay);
	diceRolled = false;
	$("#btnRoll").removeClass("hide");
	$("#btnSkip").addClass("hide");
	setOpacity();
	clearDice();
	checkWinner();
}

function checkWinner(){
	var allKilled = true;
	
	for(var i=0;i<5;i++){
		allKilled = allKilled & (playPos[i].killed || playPos[i].captured);
	}
	if(allKilled){
		showAlert("Red Team Won")
		gameOver = true;
	}

	allKilled = true;
	for(var i=5;i<10;i++){
		allKilled = allKilled & (playPos[i].killed || playPos[i].captured);
	}
	if(allKilled){
		showAlert("Blue Team Won")
		gameOver = true;
	}
		
	if(gameOver)
		showGameOver();
}

function showGameOver(){
	$("btnRoll").addClass("hide");
	$("btnSkip").addClass("hide");
}

function setOpacity(){
	$("div[id|='p1']").removeClass("player-play player-wait").addClass("player-wait");
	$("div[id|='p2']").removeClass("player-play player-wait").addClass("player-wait");
	
	$("div[id|='p" + currPlay + "']").removeClass("player-wait").addClass("player-play");
}

function showAlert(message){
	$("#alert").html(message).show().delay(2000).hide(1);
	showLog(message);
}

function showLog(message){
	console.log("LOG: " + message);
}

$(function(){
	$("#btnRoll").click(getRoll);
	$("#btnSkip").click(switchMove);
	$("#btnNewGame").click(initBul);
	
	initBul();
	$("#tblBul").addClass("rotate-bul");
})
