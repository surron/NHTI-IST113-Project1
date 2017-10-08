
function switchMove(){
	var sw = document.getElementById("switch");
	var light = document.getElementById("light");
	var status = document.getElementById("status");
	var pageBody = document.getElementById("body");

	if(sw.style.cssFloat == "") { sw.style.cssFloat = "left"; }

	if(sw.style.cssFloat == "left"){
		sw.setAttribute("style","float: right");
		pageBody.style.backgroundColor = "white";
		status.innerHTML = "ON";
	}	
	else {
		sw.setAttribute("style","float: left");
		pageBody.style.backgroundColor = "black";
		status.innerHTML = "OFF";
	}
	
		
}