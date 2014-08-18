window.foo = function(data){
	console.log('foo data ' + data);
	var element = document.getElementById(data);
	element.contentWindow.postMessage(data, '*');
}

window.onmessage = function(evt){
	console.log('in outer, from inner :' + evt.data);
}