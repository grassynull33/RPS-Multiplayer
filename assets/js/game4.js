// Initialize Firebase
var config = {
	apiKey: "AIzaSyB9J5mCkaiODl6iFiusJSj7IrWJVPfla68",
	authDomain: "rps-multiplayer-b0940.firebaseapp.com",
	databaseURL: "https://rps-multiplayer-b0940.firebaseio.com",
	storageBucket: "rps-multiplayer-b0940.appspot.com",
	messagingSenderId: "867997640650"
};
firebase.initializeApp(config);

// Firebase refs
var ref = firebase.database().ref();
var playersRef = firebase.database().ref("players");
var p1Ref = firebase.database().ref("players/1");
var p2Ref = firebase.database().ref("players/2");

// Local variables
var playerName;
var playerNum;
var turn = 1;
var turnMsgCounter = 1;

// Functions
var displayHiMsg = function() {
	$("#p-name").text(playerName);
	$("#p-num").text(playerNum);
	$("#you-are-message").show();
}

var displayTurnMsg = function() {
	playersRef.once("value", function(snap) {
		if(playerNum === 1) {
			if(turnMsgCounter % 2 === 1) {
				$("#game-message").text("It's Your Turn!");
			} else if(turnMsgCounter % 2 === 0) {
				$("#game-message").text("Waiting for " + snap.val()[2].name + " to choose.");
			}
		} else if(playerNum === 2) {
			if(turnMsgCounter % 2 === 1) {
				$("#game-message").text("Waiting for " + snap.val()[1].name + " to choose.");
			} else if(turnMsgCounter % 2 === 0) {
				$("#game-message").text("It's Your Turn!");
			}
		}
	});

	$("#game-message").show();
	turnMsgCounter++;
}

var displayChoices = function(pNum) {
		//only display for player that is making choice (depends on turn)
		if(playerNum === pNum) {
			var rock = $("<div class='p" + pNum + "-choice' data-choice='Rock'>Rock</div>");
			var paper = $("<div class='p" + pNum + "-choice' data-choice='Paper'>Paper</div>");
			var scissors = $("<div class='p" + pNum + "-choice' data-choice='Scissors'>Scissors</div>");
			var rps = $("<div>").append(rock, paper, scissors);
			$("#p" + pNum + "-choices").append(rps);
		}
}

// Code to execute


// jQuery event listeners
//		Submit button listener --> generate players upon user input
$("#name-submit-button").on("click", function(e) {
	e.preventDefault();
	playerName = $("#player-name").val();
	playersRef.once("value", function(snap) {
		// if there are no player 1 in database, generate first player
		if(snap.child(1).exists() === false) {
			p1Ref.set({
				name: playerName,
				wins: 0,
				losses: 0
			});

			playerNum = 1;

			displayHiMsg();

			// hide form once p1 has been created by user
			$("#player-form").hide();
		} else { // generate p2 if p1 already exists
			p2Ref.set({
				name: playerName,
				wins: 0,
				losses: 0
			});

			playerNum = 2;

			// purpose: for triggering turn messages, only after playerNum has been assigned
			playersRef.update({
				player2Exist: true
			});

			displayHiMsg();

			// hide form once p2 has been created by user
			$("#player-form").hide();
		}
	});
});

//		event listener for p1 clicking on choice
$(document).on("click", ".p1-choice", function() {
	var choice = $(this).attr("data-choice");
	p1Ref.update({
		choice: choice
	});
	$("#p1-choices").empty();
});

//		event listener for p2 clicking on choice
$(document).on("click", ".p2-choice", function() {
	var choice = $(this).attr("data-choice");
	p2Ref.update({
		choice: choice
	});
	$("#p2-choices").empty();
});

// Firebase listeners
//		display player names
p1Ref.child("name").on("value", function(snap) {
	if(snap.exists() === true) {
		$("#p1-name").text(snap.val());
	}
});

p2Ref.child("name").on("value", function(snap) {
	if(snap.exists() === true) {
		$("#p2-name").text(snap.val());
	}
});

playersRef.on("value", function(snap) {
	//		what to do when both players are detected
	if(snap.child(1).exists() === true && snap.child(2).exists() === true) {
		//		hide name input when game has both p1 and p2
		$("#player-form").hide();	
		console.log("x");

		//		after p2 has entered game
		if(snap.child("player2Exist").exists() === true) {
			//		display turn messages
			displayTurnMsg();

			//		make sure p1 hasn't made choice yet before display choices
			if(snap.child(1).child("choice").exists() === false) {
				//		render p1's choices
				displayChoices(1);
			}

			//		after p1 makes choice, render p2's choices
			if(snap.child(1).child("choice").exists() === true) {
				displayChoices(2);
			}
		}
	}
});

p1Ref.child("choice").on("value", function(snap) {

});

p2Ref.child("choice").on("value", function(snap) {

});