"use strict";
function BlackJackGame(){
	var dealerScore = 0;
	var playerScore = 0;
	var playerBank = 50000;
	var drawn = 0;
	var betPool = 0;
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
		//$('.error>span').text('None');
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
			drawn++;
			
			$('#player-hand').append('<img src="'+data.cards[drawn].image+'"/>');
			CalculatePlayerHandValue(data);
			drawn++;
			
			$('#dealer-hand').html('<img src="'+data.cards[drawn].image+'"/>');
			CalculateDealerHandValue(data);
			drawn++;
			
			$('#dealer-hand').append('<img src="'+data.cards[drawn].image+'"/>');
			CalculateDealerHandValue(data);
			drawn++;
			
			TheZone();
		})
		.fail(function(jqXHR, textStatus, errorThrown) 
		{
			startError(errorThrown);
		});
		
	}
	
	function CalculatePlayerHandValue(data){
		if(data.cards[drawn].value === "KING"){playerScore+= 10;}
		else if(data.cards[drawn].value === "QUEEN"){playerScore+= 10;}
		else if(data.cards[drawn].value === "JACK"){playerScore+= 10;}
		else if(data.cards[drawn].value === "ACE")
		{
			playerScore+= 11;
			if(playerScore > 21){playerScore-= 10;}
		}
		else{playerScore+= Number(data.cards[drawn].value);}
		$('#playerScore').text(playerScore);
		Bust();
	}
	
	function CalculateDealerHandValue(data){
		if(data.cards[drawn].value === "KING"){dealerScore+= 10;}
		else if(data.cards[drawn].value === "QUEEN"){dealerScore+= 10;}
		else if(data.cards[drawn].value === "JACK"){dealerScore+= 10;}
		else if(data.cards[drawn].value === "ACE")
		{
			dealerScore+= 11;
			if(dealerScore > 21){dealerScore-= 10;}
		}
		else{dealerScore+= Number(data.cards[drawn].value);}
		$('#dealerScore').text(dealerScore);
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
			alert("You've Lost the Hand");
			StartGame();
		}
		else if(dealerScore > 21){
			$('.error>span').text("Dealer has busted with a "+dealerScore+"! You've won $" +(betPool*2)+" this Hand!");
			playerBank+= (betPool*2);
			StartGame();
		}
	}
	function EndRound(){
		if(playerScore > dealerScore){
			$('.error>span').text("You've won $" +(betPool*2)+" this Hand! "+playerScore+" vs "+dealerScore);
			playerBank+= (betPool*2);
		}
		else if(playerScore < dealerScore){
			$('.error>span').text("You've lost this Hand! "+playerScore+" vs "+dealerScore);
			alert("You've Lost the Hand");
			GameOver();
		}
		/*else if(playerScore === dealerScore){
			determine facecards for winner
		}*/
		GameOver();
		StartGame();
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
				CalculateDealerHandValue(data);
				drawn++;
				
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
		if(dealerScore < 17){
			DealerDraw();
			if(dealerScore < 17){
				DealerDraw();
				if(dealerScore < 17){
					DealerDraw();
					}
				}
			}
		
		EndRound();
	});
	$('#drawCard').on('click',function(){
		$.ajax({
			url: "https://deckofcardsapi.com/api/deck/"+ DeckData.deck_id +"/draw/?count=10",
			dataType: "json"
		})
		.done(function(data)
		{
			$('#player-hand').append('<img src="'+data.cards[drawn].image+'"/>');
			CalculatePlayerHandValue(data);
			drawn++;
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