"use strict";
function BlackJackGame(){
	var dealerScore = 0;
	var playerScore = 0;
	var playerBank = 50000;
	var drawn = 0;
	var betPool = 0;
	var playerFaceVal = 0;
	var dealerFaceVal = 0;
	var dealerHandSize = 0;
	var playerHandSize = 0;
	var DeckData;
	
	
	this.start = function()
	{
		PrepareTheMinions();
	};
	
	function PrepareTheMinions(){
		$('#initiate-game').on('click', function(){
			$('#initiate-game').hide();
			$('#fold').show();
			
			StartGame();
			});
	}
	
	function StartGame(){
		$('#currentBank').text(playerBank);
		$('#betPool').text(betPool);
		DeckData = null;
			
		$.ajax({
			url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6",
			dataType: "json"
		})
		.done(function(data)
		{
			dealerScore = 0;
			playerScore = 0;
			drawn = 0;
			betPool = 0;
			playerFaceVal = 0;
			dealerFaceVal = 0;
			dealerHandSize = 0;
			playerHandSize = 0;
		
			InitialHand(data);
		})
		.fail(function(jqXHR, textStatus, errorThrown) 
		{
			startError(errorThrown);
		});
	}
	
	function startError(error){
		$('.error>span').text(error);
	}
	
	function InitialHand(data){
		DeckData = data;
			
		$.ajax({
			url: "https://deckofcardsapi.com/api/deck/"+ DeckData.deck_id +"/draw/?count=4",
			dataType: "json"
		})
		.done(function(data)
		{
			playerBank-= 500;
			betPool+= 500;
			$('#currentBank').text(playerBank);
			$('#betPool').text(betPool);
			
			$('#player-hand').html('<img src="'+data.cards[drawn].image+'"/>');
			CalculatePlayerHandValue(data);
			
			$('#player-hand').append('<img src="'+data.cards[drawn].image+'"/>');
			CalculatePlayerHandValue(data);
			
			$('#dealer-hand').html('<img src="'+data.cards[drawn].image+'"/>');
			CalculateDealerHandValue(data);
			
			$('#dealer-hand').append('<img src="'+data.cards[drawn].image+'"/>');
			CalculateDealerHandValue(data);
			
			TheZone();
		})
		.fail(function(jqXHR, textStatus, errorThrown) 
		{
			startError(errorThrown);
		});
		
	}
	function ooze(){
		alert("You've Won the Hand");
		StartGame();
	}
	function booze(){
		alert("You've Lost the Hand");
			StartGame();
	}
	
	function CalculatePlayerHandValue(data){
		if(data.cards[drawn].value === "KING"){playerScore+= 10;playerFaceVal+= 3;}
		else if(data.cards[drawn].value === "QUEEN"){playerScore+= 10;playerFaceVal+= 2;}
		else if(data.cards[drawn].value === "JACK"){playerScore+= 10;playerFaceVal+= 1;}
		else if(data.cards[drawn].value === "ACE")
		{
			playerScore+= 11;
			if(playerScore > 21){playerScore-= 10;}
		}
		else{playerScore+= Number(data.cards[drawn].value);}
		$('#playerScore').text(playerScore);
		drawn++;
		playerHandSize++;
		Bust();
	}
	
	function CalculateDealerHandValue(data){
		if(data.cards[drawn].value === "KING"){dealerScore+= 10;dealerFaceVal+= 3;}
		else if(data.cards[drawn].value === "QUEEN"){dealerScore+= 10;dealerFaceVal+= 2;}
		else if(data.cards[drawn].value === "JACK"){dealerScore+= 10;dealerFaceVal+= 1;}
		else if(data.cards[drawn].value === "ACE")
		{
			dealerScore+= 11;
			if(dealerScore > 21){dealerScore-= 10;}
		}
		else{dealerScore+= Number(data.cards[drawn].value);}
		$('#dealerScore').text(dealerScore);
		drawn++;
		dealerHandSize++;
		Bust();
	}
	
	function TheZone(){ 
		$('#bet100').show();
		$('#bet500').show();
		$('#bet1000').show();
		$('#bet5000').show();
		$('#drawCard').show();
		$('#EndRound').show();
	}
	$('#fold').on('click', function(){
			$('.error>span').text("You've Folded the Hand");
			GameOver();
			StartGame();
			});
	function Bust(){
		if(playerScore > 21){
			$('.error>span').text("You've gone over 21, you bust with a "+playerScore+"!\nStarting next hand...");
			GameOver();
			booze();
		}
		else if(dealerScore > 21){
			playerBank+= (betPool*2);
			$('.error>span').text("Dealer has busted with a "+dealerScore+"! You've won $" +(betPool*2)+" this Hand!");
			ooze();
		}
	}
	function EndRound(){
		if((playerScore > dealerScore)&&(playerScore < 22)){
			$('.error>span').text("You've won $" +(betPool*2)+" this Hand! "+playerScore+" vs "+dealerScore);
			playerBank+= (betPool*2);
			alert("You've Won the Hand");
		}
		else if((playerScore < dealerScore)&&(dealerScore < 22)){
			$('.error>span').text("You've lost this Hand! "+playerScore+" vs "+dealerScore);
			alert("You've Lost the Hand");
			GameOver();
		}
		else if(playerScore == dealerScore){
			if(playerScore == 21){BlackJackCheck();}
			else if (playerFaceVal > dealerFaceVal){
				$('.error>span').text("You've won the Tie for $" +(betPool*2)+" this Hand!  ");
				playerBank+= (betPool*2);
				alert("You've Won the Hand");
			}
			else if (playerFaceVal < dealerFaceVal){
				$('.error>span').text("You've lost the Tie this Hand! ");
				alert("You've Lost the Hand");
				GameOver();
			}
			//suit val for none facecard ties
		}
		GameOver();
		StartGame();
	}
	function BlackJackCheck(){
		if((playerHandSize == 2)&&(playerFaceVal > dealerFaceVal)){
			$('.error>span').text("You've won the Tie with BlackJack for $" +(betPool*2.5)+" this Hand!  ");
				playerBank+= (betPool*2.5);
				alert("You've Won the Hand with BlackJack");
		}
		else if((dealerHandSize == 2)&&(dealerFaceVal > playerFaceVal)){
			$('.error>span').text("You've lost the Tie with BlackJack this Hand! ");
				alert("You've Lost the Hand to a dealer BlackJack");
				GameOver();
		}
	}
	
	function GameOver(){
		if(playerBank == 0){
			
			if (window.confirm("You've run out of money to play with chum, come back when you have more cash.\nPress 'Ok' to fast forward to next week when you have more money.\nPress 'Cancel' to seek help."))
				{
					location.reload();
				
				}
			else
				{
					window.location.href = "https://www.helpguide.org/articles/addictions/gambling-addiction-and-problem-gambling.htm";
				}
		}
	}
	function DealerDraw(){
		
		$.ajax({
			url: "https://deckofcardsapi.com/api/deck/"+ DeckData.deck_id +"/draw/?count=10",
			dataType: "json"
			})
			.done(function(data){
				$('#dealer-hand').append('<img src="'+data.cards[drawn].image+'"/>');
				setTimeout(CalculateDealerHandValue(data),1500);
				
				if(dealerScore < 17){
					DealerDraw();
					}
				else if (dealerScore > 16){
					EndRound();
				}
				})
				.fail(function(jqXHR, textStatus, errorThrown){
					startError(errorThrown);
				});
				
	}
	
	$('#bet100').on('click', function(){
		if(playerBank >= 100){
			playerBank-= 100;
			betPool+= 100;
			$('#currentBank').text(playerBank);
			$('#betPool').text(betPool);
		}
		else{
			alert("You don't have enough funds to bet that amount");
		}
	});
	$('#bet500').on('click', function(){
		if(playerBank >= 500){
			playerBank-= 500;
			betPool+= 500;
			$('#currentBank').text(playerBank);
			$('#betPool').text(betPool);
		}
		else{
			alert("You don't have enough funds to bet that amount");
		}
	});
	$('#bet1000').on('click', function(){
		if(playerBank >= 1000){
			playerBank-= 1000;
			betPool+= 1000;
			$('#currentBank').text(playerBank);
			$('#betPool').text(betPool);
		}
		else{
			alert("You don't have enough funds to bet that amount");
		}
	});
	$('#bet5000').on('click', function(){
		if(playerBank >= 5000){
			playerBank-= 5000;
			betPool+= 5000;
			$('#currentBank').text(playerBank);
			$('#betPool').text(betPool);
		}
		else{
			alert("You don't have enough funds to bet that amount");
		}
	});
	$('#EndRound').on('click',function(){
		if (dealerScore > playerScore){EndRound();}
		else if(dealerScore < 17){
			DealerDraw();
			}
		else if(dealerScore == playerScore){EndRound();}
	});
	$('#drawCard').on('click',function(){
		$.ajax({
			url: "https://deckofcardsapi.com/api/deck/"+ DeckData.deck_id +"/draw/?count=10",
			dataType: "json"
		})
		.done(function(data)
		{
			$('#player-hand').append('<img src="'+data.cards[drawn].image+'"/>');
			setTimeout(CalculatePlayerHandValue(data),1500);
		
			$('#bet100').hide();
			$('#bet500').hide();
			$('#bet1000').hide();
			$('#bet5000').hide();
		})
		.fail(function(jqXHR, textStatus, errorThrown) 
		{
			startError(errorThrown);
		});
		
	});
}

$(function() {
	window.game = new BlackJackGame();
	window.game.start();
});