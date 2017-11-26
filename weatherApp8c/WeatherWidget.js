function WeatherWidget($widget){
	
	this.update = function(){
		$('.error', $widget).hide();
		$('.results', $widget).hide();
		$('.loading', $widget).show();
		$.when(getLocation()).then(getCurrentWeather());
		
	};
	
	function getWeatherReport(lat,lon){
		lat = $('#latitude').val().toString();
		lon = $('#longitude').val().toString();
		var coordinates = lat + "," + lon;
		
		$.ajax({url:"https://api.weather.gov/points/"+coordinates+"/forecast",
		dataType : "json" })
		.done(function(data){populateWeather(data);})
		.fail(function(jqXHR, textStatus, errorThrown){showError(errorThrown);});
	}
	
	function populateWeather(data){
		
		var observation = data.properties.periods[0];
		
		$('.results header img', $widget).attr('src', observation.icon);
		
		$('.conditions>span').each(function(i,e){
			var $span = $(this);
			var field = $span.data('field');
		$(this).text(observation[field]);
		});
		
		$('.loading', $widget).fadeOut(function(){ $('.results', $widget).fadeIn();});
		
	}
	
	function getLocation(){
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(function(position){
				$('#latitude').val(position.coords.latitude);
				$('#longitude').val(position.coords.longitude);
	
			},
			function(error){
				$('#controls .error').
				text('Error: ' + error.message).
				slideDown();
			});
		}
		
	}
	
	function getCurrentWeather(){
		var lat = $('#latitude').val().toString();
		var lon = $('#longitude').val().toString();
	
		if( lat && lon){
			$('#weather-widget').fadeIn();
			getWeatherReport(lat,lon);
		}
		else{ 
			$('.loading', $widget).hide();
			$('.error', $widget).show();
			$('.error>span', $widget).text('Click the "Get Weather" button again once you see your location data appear.');
		}
	}
}