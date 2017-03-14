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

	  $("#name-submit-button").on("click", function(e) {
	  	e.preventDefault();
	  	playerName = $("#player-name").val().trim();

		ref.once("value", function(snapshot) {
	  		if(snapshot.exists() === false) {
	  			ref.child("players").child(1).child("name").set(playerName);
	  			ref.child("players").child(1).child("wins").set(0);
	  			ref.child("players").child(1).child("losses").set(0);
	  			playerNum = 1;
	  		} else {
	  			ref.child("players").child(2).child("name").set(playerName);
	  			ref.child("players").child(2).child("wins").set(0);
	  			ref.child("players").child(2).child("losses").set(0);
	  			playerNum = 2;
	  		}
	  	});

	  	$("#p-name").text(playerName);
	  	$("#p-num").text(playerNum);
	  	$("#you-are-message").show();
	  	$("#player-form").hide();
	  });

	  ref.on("value", function(snapshot) {
	  	$("#p1-name").text(snapshot.val().players[1].name);
	  	$("#p2-name").text(snapshot.val().players[2].name);
	  	if(snapshot.child("players").child("1").exists() === true && snapshot.child("players").child("2").exists() === true) {
	  		// //create & incrememnt turn var in db
	  		// ref.child("turn").set(1);

	  		if(playerNum === 1) {
	  			//create list of choices if choices are empty
	  			var rockDiv = "<div class='p1-choice' id='Rock'>Rock</div>";
	  			var paperDiv = "<div class='p1-choice' id='Paper'>Paper</div>";
	  			var scissorsDiv = "<div class='p1-choice' id='Scissors'>Scissors</div>";
	  			$("#p1-choices").html(rockDiv + paperDiv + scissorsDiv);

	  			if(snapshot.child("players").child(1).child("choice").exists() === true) {
	  				$("#p1-choices").empty();
	  				var choice = snapshot.val().players[1].choice;
	  				$("#p1-choices").append($("<span>" + choice + "</span>"));
	  				// ref.child("turn").set(2);
	  			}
	  		} else {
	  			//create list of choices if choices are empty
	  			var rockDiv = "<div class='p2-choice' id='Rock'>Rock</div>";
	  			var paperDiv = "<div class='p2-choice' id='Paper'>Paper</div>";
	  			var scissorsDiv = "<div class='p2-choice' id='Scissors'>Scissors</div>";
	  			$("#p2-choices").html(rockDiv + paperDiv + scissorsDiv);

	  			if(snapshot.child("players").child(2).child("choice").exists() === true) {
	  				$("#p2-choices").empty();
	  				var choice = snapshot.val().players[2].choice;
	  				$("#p2-choices").append($("<span>" + choice + "</span>"));
	  				// ref.child("turn").set(2);
	  			}
	  		}

	  		//OUTCOME SCENARIOS
	  		if(snapshot.child("players").child(1).child("choice").exists() === true && snapshot.child("players").child(2).child("choice").exists() === true) {
	  			var playerOneChoice = snapshot.val().players[1].choice;
	  			var playerTwoChoice = snapshot.val().players[2].choice;
	  			var playerOneWins = snapshot.val().players[1].wins;
	  			var playerTwoWins = snapshot.val().players[2].wins;
	  			var playerOneLosses = snapshot.val().players[1].losses;
	  			var playerTwoLosses = snapshot.val().players[2].losses;
	  			if(playerOneChoice === "Rock") {
	  				if(playerTwoChoice === "Rock") {

	  				} else if (playerTwoChoice === "Paper") {
	  					playerTwoWins++;
	  					ref.child("players").child(2).child("wins").set(playerTwoWins);
	  					playerOneLosses++;
	  					ref.child("players").child(1).child("losses").set(playerOneLosses);
	  				} else {
	  					playerTwoLosses++;
	  					ref.child("players").child(2).child("losses").set(playerTwoLosses);
	  					playerOneWins++;
	  					ref.child("players").child(1).child("losses").set(playerOneWins);
	  				}
	  			} else if(playerOneChoice === "Paper") {
	  				if(playerTwoChoice === "Rock") {
	  					playerTwoLosses++;
	  					ref.child("players").child(2).child("losses").set(playerTwoLosses);
	  					playerOneWins++;
	  					ref.child("players").child(1).child("losses").set(playerOneWins);
	  				} else if (playerTwoChoice === "Paper") {

	  				} else {
	  					playerTwoWins++;
	  					ref.child("players").child(2).child("wins").set(playerTwoWins);
	  					playerOneLosses++;
	  					ref.child("players").child(1).child("losses").set(playerOneLosses);
	  				}
	  			} else {
	  				if(playerTwoChoice === "Rock") {
	  					playerTwoWins++;
	  					ref.child("players").child(2).child("wins").set(playerTwoWins);
	  					playerOneLosses++;
	  					ref.child("players").child(1).child("losses").set(playerOneLosses);
	  				} else if (playerTwoChoice === "Paper") {
	  					playerTwoLosses++;
	  					ref.child("players").child(2).child("losses").set(playerTwoLosses);
	  					playerOneWins++;
	  					ref.child("players").child(1).child("losses").set(playerOneWins);
	  				} else {
	  					
	  				}
	  			}
	  		}
	  	}
	  });

	  $(document).on("click", ".p1-choice", function() {
	  	var choice = $(this).attr("id");
	  	ref.child("players").child(1).child("choice").set(choice);
	  });

	  $(document).on("click", ".p2-choice", function() {
	  	var choice = $(this).attr("id");
	  	ref.child("players").child(2).child("choice").set(choice);
	  });
