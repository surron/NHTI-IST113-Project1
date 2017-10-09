var attempts = 0;
	
function guessing(){

	var instruct = document.getElementById("instruct");
	var current = document.getElementById("current");
	
	var guess = document.getElementById("guessed");
	var set = document.getElementById("gnum");

	var guessed = parseInt(guess.value);
	var setNum = parseInt(set.value);
	
	
	if (guessed == setNum){
		attempts++;
		instruct.innerHTML = "You have guessed correctly!";
		
	}
	if (guessed < setNum) {
		attempts++;
		instruct.innerHTML = "You have guessed too low.";
		current.innerHTML = attempts;
	}
	if (guessed > setNum){
		attempts++;
		instruct.innerHTML = "You have guessed too High.";
		current.innerHTML = attempts;
	}
}

function resetGame(){
	guess = null;
	set = null;
	attempts = 0;
	current.innerHTML = attempts;
}