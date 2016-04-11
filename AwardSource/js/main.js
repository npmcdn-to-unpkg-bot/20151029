(function(){
	var initTime = function(){
		var date = new Date().pattern("Week, M d, yyyy at HH:mm:ss");
		$('#date').html(date);
		
		setTimeout(initTime,1000);
	};
	
	initTime();	
})();