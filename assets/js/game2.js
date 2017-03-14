// Initialize Firebase
var config = {
	apiKey: "AIzaSyB9J5mCkaiODl6iFiusJSj7IrWJVPfla68",
	authDomain: "rps-multiplayer-b0940.firebaseapp.com",
	databaseURL: "https://rps-multiplayer-b0940.firebaseio.com",
	storageBucket: "rps-multiplayer-b0940.appspot.com",
	messagingSenderId: "867997640650"
};
firebase.initializeApp(config);

var playerName;

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

$("#name-submit-button").on("click", function(e) {
	e.preventDefault();
	if($("#player-name").val() !== "") {
		var playerName = $("#player-name").val().trim();
		if(players[1].name === "") {
			players[1].name = playerName;
			$("#p-name").text(players[1].name);
			$("#p-num").text(1);
			$("#you-are-message").show();
		} else {
			players[2].name = playerName;
			$("#game-message").text("It's Your Turn!");
			$("#game-message").show();
		}
		console.log(players[1].name + players[2].name);
		$("#player-name").val("");
		$("#p1-name").text(players[1].name);
		$("#p2-name").text(players[2].name);
	
		if(players[1].name !== "" && players[2].name !== "") {
			$("#player-form").hide();

			//render choices for player1
			var rock = $("<div class='p1-choice' data-choice='Rock'>Rock</div>");
			var paper = $("<div class='p1-choice' data-choice='Paper'>Paper</div>");
			var scissors = $("<div class='p1-choice' data-choice='Scissors'>Scissors</div>");
			var rps = $("<div>").append(rock, paper, scissors);
			$("#p1-choices").append(rps);
		}
	}
});

$(document).on("click", ".p1-choice", function() {
	players[1].choice = $(this).attr("data-choice");
	$("#p1-choices").empty();
	$("#p1-choices").text(players[1].choice);
	$("#game-message").text("Waiting for " + players[2].name + " to choose.");

	//render choices for player2
	var rock = $("<div class='p2-choice' data-choice='Rock'>Rock</div>");
	var paper = $("<div class='p2-choice' data-choice='Paper'>Paper</div>");
	var scissors = $("<div class='p2-choice' data-choice='Scissors'>Scissors</div>");
	var rps = $("<div>").append(rock, paper, scissors);
	$("#p2-choices").append(rps);
});

$(document).on("click", ".p2-choice", function() {
	players[2].choice = $(this).attr("data-choice");

	$("#p2-choices").empty();
	$("#p2-choices").text(players[2].choice);

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
});