// Initialize Firebase
var config = {
	apiKey: "AIzaSyB9J5mCkaiODl6iFiusJSj7IrWJVPfla68",
	authDomain: "rps-multiplayer-b0940.firebaseapp.com",
	databaseURL: "https://rps-multiplayer-b0940.firebaseio.com",
	storageBucket: "rps-multiplayer-b0940.appspot.com",
	messagingSenderId: "867997640650"
};
firebase.initializeApp(config);
var ref = firebase.database().ref();
var playersRef = firebase.database().ref("players");
var p1Ref = firebase.database().ref("players/1");
var p2Ref = firebase.database().ref("players/2");

var playerName;
var playerNum;

var players = {
	1: {
		"name": "",
		"wins": 0,
		"losses": 0,
		"choice": ""
	},
	2: {
		"name": "",
		"wins": 0,
		"losses": 0,
		"choice": ""
	}
};

var turn = 1;
var messageCounter = 1;

var checkOutcome = function() {
	//game logic/outcomes after both choices have been made
	playersRef.once("value", function(snap){
		var p1 = snap.val()[1].name;
		var p2 = snap.val()[2].name;
		if(snap.child(1).child("choice").exists() === true && snap.child(2).child("choice").exists() === true) {
			//outcome logic
			if(snap.val()[1].choice === "Rock" && snap.val()[2].choice === "Rock") {
				$("#outcome").text("Tie Game");
				turn++;
				ref.update({
					turn: turn
				});
			} else if(snap.val()[1].choice === "Rock" && snap.val()[2].choice === "Paper") {
				players[1].losses++;
				players[2].wins++;
				$("#outcome").text(p2 + " Wins!");
				turn++;
				ref.update({
					turn: turn
				});
				p1Ref.update({
					losses: players[1].losses
				});
				p2Ref.update({
					wins: players[2].wins
				});
			} else if(snap.val()[1].choice === "Rock" && snap.val()[2].choice === "Scissors") {
				players[1].wins++;
				players[2].losses++;
				$("#outcome").text(p1.name + " Wins!");
				turn++;
				ref.update({
					turn: turn
				});
				p1Ref.update({
					wins: players[1].wins
				});
				p2Ref.update({
					losses: players[2].losses
				});
			} else if(snap.val()[1].choice === "Paper" && snap.val()[2].choice === "Rock") {
				players[1].wins++;
				players[2].losses++;
				$("#outcome").text(p1 + " Wins!");
				turn++;
				ref.update({
					turn: turn
				});
				p1Ref.update({
					wins: players[1].wins
				});
				p2Ref.update({
					losses: players[2].losses
				});
			} else if(snap.val()[1].choice === "Paper" && snap.val()[2].choice === "Paper") {
				$("#outcome").text("Tie Game");
				turn++;
				ref.update({
					turn: turn
				});
			} else if(snap.val()[1].choice === "Paper" && snap.val()[2].choice === "Scissors") {
				players[1].losses++;
				players[2].wins++;
				$("#outcome").text(p2 + " Wins!");
				turn++;
				ref.update({
					turn: turn
				});
				p1Ref.update({
					losses: players[1].losses
				});
				p2Ref.update({
					wins: players[2].wins
				});
			} else if(snap.val()[1].choice === "Scissors" && snap.val()[2].choice === "Rock") {
				players[1].losses++;
				players[2].wins++;
				$("#outcome").text(p2 + " Wins!");
				turn++;
				ref.update({
					turn: turn
				});
				p1Ref.update({
					losses: players[1].losses
				});
				p2Ref.update({
					wins: players[2].wins
				});
			} else if(snap.val()[1].choice === "Scissors" && snap.val()[2].choice === "Paper") {
				players[1].wins++;
				players[2].losses++;
				$("#outcome").text(p1 + " Wins!");
				turn++;
				ref.update({
					turn: turn
				});
				p1Ref.update({
					wins: players[1].wins
				});
				p2Ref.update({
					losses: players[2].losses
				});
			} else if(snap.val()[1].choice === "Scissors" && snap.val()[2].choice === "Scissors") {
				$("#outcome").text("Tie Game");
				turn++;
				ref.update({
					turn: turn
				});
			}
			$("#p1-choices").text(snap.val()[1].choice);
			$("#p2-choices").text(snap.val()[2].choice);

			playersRef.child(1).child("choice").remove();
			playersRef.child(2).child("choice").remove();

			$("#p1-wins").text(players[1].wins);
			$("#p2-wins").text(players[2].wins);
			$("#p1-losses").text(players[1].losses);
			$("#p2-losses").text(players[2].losses);

			startTimer();
		}
	});
}

var startTimer = function() {
	//timer for clearing and then loading p1's choices again
	setTimeout(function() {
		$("#p1-choices").empty();
		$("#p2-choices").empty();
		$("#outcome").empty();
		if(playerNum === 1) {
			displayMessage();
			//render choices for player1
			var rock = $("<div class='p1-choice' data-choice='Rock'>Rock</div>");
			var paper = $("<div class='p1-choice' data-choice='Paper'>Paper</div>");
			var scissors = $("<div class='p1-choice' data-choice='Scissors'>Scissors</div>");
			var rps = $("<div>").append(rock, paper, scissors);
			$("#p1-choices").append(rps);
		}
	}, 5000);
}

var displayMessage = function() {
	console.log(messageCounter);
	playersRef.once("value", function(snap) {
		if(playerNum == 1) {
			if(messageCounter % 2 === 1) {
				$("#game-message").text("It's Your Turn!");
			} else if(messageCounter % 2 === 0) {
				$("#game-message").text("Waiting for " + snap.val()[2].name + " to choose.");
			}
		} else if(playerNum === 2) {
			if(messageCounter % 2 === 1) {
				$("#game-message").text("Waiting for " + snap.val()[1].name + " to choose.");
			} else if(messageCounter % 2 === 0) {
				$("#game-message").text("It's Your Turn!");
			}
		}
		$("#game-message").show();
		messageCounter++;
	});
}

$("#name-submit-button").on("click", function(e) {
	e.preventDefault();
	if($("#player-name").val() !== "") {
		var playerName = $("#player-name").val().trim();
		ref.once("value", function(snap) {
			if(snap.child("players").child(1).exists() === false) {
				players[1].name = playerName;
				playerNum = 1;
				p1Ref.set({
					name: playerName,
					wins: 0,
					losses: 0
				});
				$("#p-name").text(players[1].name);
				$("#p-num").text(1);
				$("#you-are-message").show();
				displayMessage();
				$("#player-form").hide();
			} else {
				players[2].name = playerName;
				playerNum = 2;
				p2Ref.set({
					name: playerName,
					wins: 0,
					losses: 0
				});
				$("#p-name").text(players[2].name);
				$("#p-num").text(2);
				$("#you-are-message").show();
				displayMessage();
				$("#player-form").hide();
				ref.update({
					turn: turn
				});
			}
		});
	}
});

$(document).on("click", ".p1-choice", function() {
	players[1].choice = $(this).attr("data-choice");
	p1Ref.update({
		choice: players[1].choice
	});
	$("#p1-choices").empty();
	$("#p1-choices").text(players[1].choice);
	displayMessage();
});

$(document).on("click", ".p2-choice", function() {
	players[2].choice = $(this).attr("data-choice");
	p2Ref.update({
		choice: players[2].choice
	});
	$("#p2-choices").empty();
	$("#p2-choices").text(players[2].choice);
});

p1Ref.on("value", function(snap) {
	if(snap.child("name").exists()) {
		$("#p1-name").text(snap.val().name);
	}
});

p2Ref.on("value", function(snap) {
	if(snap.child("name").exists()) {
		$("#p2-name").text(snap.val().name);
	}
});

//event listener if 2 players have entered game
playersRef.on("value", function(snap) {
	if(snap.child(1).exists() === true && snap.child(2).exists() === true) {
		$("#player-form").hide();
		if(playerNum === 1) {
			//only render for first turn, subsequent turns will have rendered by timer
			if(turn < 2) {
				//render choices for player1
				var rock = $("<div class='p1-choice' data-choice='Rock'>Rock</div>");
				var paper = $("<div class='p1-choice' data-choice='Paper'>Paper</div>");
				var scissors = $("<div class='p1-choice' data-choice='Scissors'>Scissors</div>");
				var rps = $("<div>").append(rock, paper, scissors);
				$("#p1-choices").append(rps);
			}
		}
	}
});

//event listener for p1 having made a choice, transition to second player's choices
p1Ref.on("value", function(snap){
	if(snap.child("choice").exists() === true) {
		if(playerNum === 2) {
			displayMessage();
			//render choices for player2
			var rock = $("<div class='p2-choice' data-choice='Rock'>Rock</div>");
			var paper = $("<div class='p2-choice' data-choice='Paper'>Paper</div>");
			var scissors = $("<div class='p2-choice' data-choice='Scissors'>Scissors</div>");
			var rps = $("<div>").append(rock, paper, scissors);
			$("#p2-choices").append(rps);
		}
	}
});

p2Ref.on("child_added", function(snap) {
	if(snap.val() === "Rock" || snap.val() === "Paper" || snap.val() === "Scissors") {
		checkOutcome();
	}
});