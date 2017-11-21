function WeatherWidget($widget){
	
	
	this.update = function(){
		getLocation();
		$('.results', $widget).hide();
		$('.loading', $widget).show();
		
		getWeatherReport();
	};
	
	function getWeatherReport(){
		$.get('data/weather.json', {t: new Date().getTime()}).done(function(data){populateWeather(data);})
		.fail(function(jqXHR, textStatus, errorThrown){showError(errorThrown);});
	}
	
	function populateWeather(data){
		var observation = data.current_observation;
		
		$('.results header img', $widget).attr('src', observation.icon_url);
		
		$('.location>span', $widget).text(data.location.city);
		
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
	
}