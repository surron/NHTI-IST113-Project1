
// using a function contructor form to create an object
function MyApp()
{
	var version = "v1.0";
	

	// creating a private function
	function setStatus(message)
	{
		$("#app>footer").text(message);
	}

	// creating a public function
	this.start = function()
	{
		$("#app>header").append(version);
		setStatus("ready");
		var attempts = 0;
		
	
			$('#guessing').on('click',function(){

			var instruct = document.getElementById("instruct");
			var current = document.getElementById("current");
			
			var guess = document.getElementById("guessed");
			var set = document.getElementById("gnum");

			var guessed = parseInt(guess.value);
			var setNum = parseInt(set.value);
			
			
			if (guessed === setNum){
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
		});
		$('#resetGame').on('click', function(){
			guess = null;
			set = null;
			attempts = 0;
			current.innerHTML = attempts;
		});

			
	};
	
} // end MyApp

/* 	JQuery's shorthand for the document ready event handler
		could be written: $(document).ready(handler);

		When this page loads, we'll create a global variable
		named "app" by attaching it to the "window" object
		(part of the BOM - Browser Object Model)
*/
$(function() {
	window.app = new MyApp();
	window.app.start();
});