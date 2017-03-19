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

var removeChoices = function() {
	p1Ref.child("choice").remove();
	p2Ref.child("choice").remove();
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
				losses: 0,
				madeChoice: false
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

			displayHiMsg();

			// hide form once p2 has been created by user
			$("#player-form").hide();

			ref.update({
				turn: turn
			});
		}
	});
});

//		event listener for p1 clicking on choice
$(document).on("click", ".p1-choice", function() {
	var choice = $(this).attr("data-choice");
	p1Ref.update({
		choice: choice,
		madeChoice: true
	});
	$("#p1-choices").empty();
	$("#p1-choices").text(choice);
});

//		event listener for p2 clicking on choice
$(document).on("click", ".p2-choice", function() {
	var choice = $(this).attr("data-choice");
	p2Ref.update({
		choice: choice
	});
	$("#p2-choices").empty();
	$("#p2-choices").text(choice);
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
	var p1MadeChoice;
	p1Ref.once("value", function(snap) {
		p1MadeChoice = snap.val().madeChoice;
	});

	//		what to do when both players are detected
	if(snap.child(1).exists() === true && snap.child(2).exists() === true) {
		//		hide name input when game has both p1 and p2
		$("#player-form").hide();

		//		display turn messages
		displayTurnMsg();

		//		make sure p1 hasn't made choice yet before display choices
		if(snap.child(1).child("choice").exists() === false) {
			//		render p1's choices
			displayChoices(1);
			console.log("display first player choices");
		}

		//		after p1 makes choice, render p2's choices
		if(snap.child(1).child("choice").exists() === true) {
			displayChoices(2);
		}
	}
});

//		trigger outcome logic after p2 makes choice
playersRef.on("value", function(snap) {
	var p2Choice = null;

	if(snap.val()[2].choice !== null) {
		var p2Choice = snap.val()[2].choice;
	}
	
	if(p2Choice !== null) {
		//		outcome logic
		playersRef.once("value", function(snap) {
			var p1Choice = snap.val()[1].choice;
			var p2Choice = snap.val()[2].choice;
			var p1Wins = snap.val()[1].wins;
			var p2Wins = snap.val()[2].wins;
			var p1Losses = snap.val()[1].losses;
			var p2Losses = snap.val()[2].losses;
			var p1Name = snap.val()[1].name;
			var p2Name = snap.val()[2].name;

			if(p1Choice === "Rock" && p2Choice === "Rock") {
				turn++;
				ref.update({
					turn: turn
				});
				$("#outcome").text("Tie Game!");
			} else if(p1Choice === "Rock" && p2Choice === "Paper") {
				p1Losses++;
				p1Ref.update({
					losses: p1Losses
				});

				p2Wins++;
				p2Ref.update({
					wins: p2Wins
				});

				turn++;
				ref.update({
					turn: turn
				});
				$("#outcome").text(p2Name + " Wins!");
			} else if(p1Choice === "Rock" && p2Choice === "Scissors") {
				p1Wins++;
				p1Ref.update({
					wins: p1Wins
				});

				p2Losses++;
				p2Ref.update({
					losses: p2Losses
				});

				turn++;
				ref.update({
					turn: turn
				});
				$("#outcome").text(p1Name + " Wins!");
			} else if(p1Choice === "Paper" && p2Choice === "Rock") {
				p1Wins++;
				p1Ref.update({
					wins: p1Wins
				});

				p2Losses++;
				p2Ref.update({
					losses: p2Losses
				});

				turn++;
				ref.update({
					turn: turn
				});
				$("#outcome").text(p1Name + " Wins!");
			} else if(p1Choice === "Paper" && p2Choice === "Paper") {
				turn++;
				ref.update({
					turn: turn
				});
				$("#outcome").text("Tie Game!");
			} else if(p1Choice === "Paper" && p2Choice === "Scissors") {
				p1Losses++;
				p1Ref.update({
					losses: p1Losses
				});

				p2Wins++;
				p2Ref.update({
					wins: p2Wins
				});

				turn++;
				ref.update({
					turn: turn
				});
				$("#outcome").text(p2Name + " Wins!");
			} else if(p1Choice === "Scissors" && p2Choice === "Rock") {
				p1Losses++;
				p1Ref.update({
					losses: p1Losses
				});

				p2Wins++;
				p2Ref.update({
					wins: p2Wins
				});

				turn++;
				ref.update({
					turn: turn
				});
				$("#outcome").text(p2Name + " Wins!");
			} else if(p1Choice === "Scissors" && p2Choice === "Paper") {
				p1Wins++;
				p1Ref.update({
					wins: p1Wins
				});

				p2Losses++;
				p2Ref.update({
					losses: p2Losses
				});

				turn++;
				ref.update({
					turn: turn
				});
				$("#outcome").text(p1Name + " Wins!");
			} else if(p1Choice === "Scissors" && p2Choice === "Scissors") {
				turn++;
				ref.update({
					turn: turn
				});
				$("#outcome").text("Tie Game!");
			}

			//		the end of turn reveal of player choices
			$("#p1-choices").text(p1Choice);
			$("#p2-choices").text(p2Choice);

			//		update wins & losses
			$("#p1-wins").text(p1Wins);
			$("#p1-losses").text(p1Losses);
			$("#p2-wins").text(p2Wins);
			$("#p2-losses").text(p2Losses);

			//		set timer to clear view to render new game
			setTimeout(function() {
				$("#outcome").empty();
				$("#p1-choices").empty();
				$("#p2-choices").empty();
				displayChoices(1);
				console.log("display first player choices");

				//		remove choice children for both p1 and p2
				p1Ref.child("choice").remove();
				p2Ref.child("choice").remove();
			}, 5000);
		});
	}
});