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

var playerName;
var playerNum;

var players = {
	"1": {
		"name": "",
		"wins": 0,
		"losses": 0,
		"choice": ""
	},
	"2": {
		"name": "",
		"wins": 0,
		"losses": 0,
		"choice": ""
	}
};

var turn = 1;

$("#name-submit-button").on("click", function(e) {
	e.preventDefault();
	if($("#player-name").val() !== "") {
		playerName = $("#player-name").val().trim();
		ref.once("value", function(snap) {
			if(snap.child("players").child(1).exists() === false) {
				players[1].name = playerName;
				playerNum = 1;
				ref.child("players").child(1).child("name").set(playerName);
			} else {
				players[2].name = playerName;
				playerNum = 2;
				ref.child("players").child(2).child("name").set(playerName);
				// $("#game-message").text("It's Your Turn!");
				// $("#game-message").show();
			}
		}, function(errorObject) {
			console.log("The read failed: " + errorObject.code);
		});
		$("#p-name").text(playerName);
		$("#p-num").text(playerNum);
		$("#you-are-message").show();

		console.log(players[1].name + players[2].name);
		$("#player-name").val("");
	}
});

$(document).on("click", ".p1-choice", function() {
	players[1].choice = $(this).attr("data-choice");
	ref.child("players").child(1).child("choice").set(players[1].choice);
	$("#p1-choices").empty();
	$("#p1-choices").text(players[1].choice);
	$("#game-message").text("Waiting for " + players[2].name + " to choose.");
});

$(document).on("click", ".p2-choice", function() {
	players[2].choice = $(this).attr("data-choice");
	ref.child("players").child(2).child("choice").set(players[2].choice);
	$("#p2-choices").empty();
	$("#p2-choices").text(players[2].choice);
});

ref.on("value", function(snap) {
	$("#p1-name").text(snap.val().players[1].name);
	$("#p2-name").text(snap.val().players[2].name);

	if(snap.child("players").child(1).exists() === true && snap.child("players").child(2).exists() === true) {
		$("#player-form").hide();

		if(playerNum === 1) {
			//render choices for player1
			var rock = $("<div class='p1-choice' data-choice='Rock'>Rock</div>");
			var paper = $("<div class='p1-choice' data-choice='Paper'>Paper</div>");
			var scissors = $("<div class='p1-choice' data-choice='Scissors'>Scissors</div>");
			var rps = $("<div>").append(rock, paper, scissors);
			$("#p1-choices").append(rps);
		}
	}

	if(snap.child("players").child(1).child("choice").exists() === true) {
		if(playerNum === 2) {
			//render choices for player2
			var rock = $("<div class='p2-choice' data-choice='Rock'>Rock</div>");
			var paper = $("<div class='p2-choice' data-choice='Paper'>Paper</div>");
			var scissors = $("<div class='p2-choice' data-choice='Scissors'>Scissors</div>");
			var rps = $("<div>").append(rock, paper, scissors);
			$("#p2-choices").append(rps);
		}

		// if both choices are made, will proceed to outcome logic
		if(snap.child("players").child(2).child("choice").exists() === true) {
			//outcome logic
			if(players[1].choice === "Rock" && players[2].choice === "Rock") {
				$("#outcome").text("Tie Game");
				turn++;
			} else if(players[1].choice === "Rock" && players[2].choice === "Paper") {
				players[1].losses++;
				players[2].wins++;
				$("#outcome").text(players[2].name + " Wins!");
				turn++;
			} else if(players[1].choice === "Rock" && players[2].choice === "Scissors") {
				players[1].wins++;
				players[2].losses++;
				$("#outcome").text(players[1].name + " Wins!");
				turn++;
			} else if(players[1].choice === "Paper" && players[2].choice === "Rock") {
				players[1].wins++;
				players[2].losses++;
				$("#outcome").text(players[1].name + " Wins!");
				turn++;
			} else if(players[1].choice === "Paper" && players[2].choice === "Paper") {
				$("#outcome").text("Tie Game");
				turn++;
			} else if(players[1].choice === "Paper" && players[2].choice === "Scissors") {
				players[1].losses++;
				players[2].wins++;
				$("#outcome").text(players[2].name + " Wins!");
				turn++;
			} else if(players[1].choice === "Scissors" && players[2].choice === "Rock") {
				players[1].losses++;
				players[2].wins++;
				$("#outcome").text(players[2].name + " Wins!");
				turn++;
			} else if(players[1].choice === "Scissors" && players[2].choice === "Paper") {
				players[1].wins++;
				players[2].losses++;
				$("#outcome").text(players[1].name + " Wins!");
				turn++;
			} else if(players[1].choice === "Scissors" && players[2].choice === "Scissors") {
				$("#outcome").text("Tie Game");
				turn++;
			}

			$("#p1-wins").text(players[1].wins);
			$("#p2-wins").text(players[2].wins);
			$("#p1-losses").text(players[1].losses);
			$("#p2-losses").text(players[2].losses);

			//timer for clearing and then loading p1's choices again
			setTimeout(function() {
				$("#p1-choices").empty();
				$("#p2-choices").empty();
				$("#outcome").empty();
				$("#game-message").text("It's Your Turn!");

				//render choices for player1
				var rock = $("<div class='p1-choice' data-choice='Rock'>Rock</div>");
				var paper = $("<div class='p1-choice' data-choice='Paper'>Paper</div>");
				var scissors = $("<div class='p1-choice' data-choice='Scissors'>Scissors</div>");
				var rps = $("<div>").append(rock, paper, scissors);
				$("#p1-choices").append(rps);
			}, 5000);

			//remove choice so that it does not loop
			ref.child("players").child(1).child("choice").remove();
			ref.child("players").child(2).child("choice").remove();
		}
	}
}, function(errorObject) {
	console.log("The read failed: " + errorObject.code);
});