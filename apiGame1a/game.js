"use strict";
function BlackJackGame(){
	this.start = function()
	{
		PrepareTheMinions();
	};
	
	function PrepareTheMinions(){
		$('#initiate-game').on('click', function(){
			$('#initiate-game').hide();
			$('#reset-game').toggleClass('hidden');
			StartGame();
			});
	}
	
	function StartGame(){
		$.ajax({
			url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6",
			dataType: "json"
		})
		.done(function(data)
		{
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
		var DeckData = data;
		
		$.ajax({
			url: "https://deckofcardsapi.com/api/deck/"+ DeckData.deck_id +"/draw/?count=4",
			dataType: "json"
		})
		.done(function(data)
		{
			$('#player-hand').html('<img src="'+data.cards[0].image+'"/>');
			$('#player-hand').append('<img src="'+data.cards[1].image+'"/>');
			
			$('#dealer-hand').html('<img src="'+data.cards[2].image+'"/>');
			$('#dealer-hand').append('<img src="'+data.cards[3].image+'"/>');
			
			//add a global var to track cards drawn, so there is no need to manually increment cards[#]
		})
		.fail(function(jqXHR, textStatus, errorThrown) 
		{
			startError(errorThrown);
		});
		
		
	}
}

$(function() {
	window.game = new BlackJackGame();
	window.game.start();
});