var centauri2d = {};

centauri2d.clone = function(object){
	var retval = {};
	for(var field in object){
		retval[field] = object[field];
	}
	return retval;
};

centauri2d.prepareContext = function(game, object){
	var fontSize = "10pt ";
	var fontFamily = "sans-serif";
	
	if(object.color != undefined)
		game.context.fillStyle = object.color;
	if(object.gradient != undefined){
		if(object.x == undefined || object.y == undefined || object.width == undefined || object.height == undefined)
			throw "Can only create a gradient when object has x, y, width and height fields set";
		var grad = game.context.createLinearGradient(object.x, object.y, object.width, object.height);
		for(var key in object.gradient){
			grad.addColorStop(key, object.gradient[key]);
		}
		game.context.fillStyle = grad;
	}
	if(object.opacity != undefined)
		game.context.globalAlpha = object.opacity;
	if(object.fontSize != undefined)
		fontSize = object.fontSize + "pt ";
	if(object.fontFamily != undefined)
		fontFamily = object.fontFamily;
	if(object.lineWidth != undefined)
		game.context.lineWidth = object.lineWidth; 
		
	game.context.font = fontSize + fontFamily;
};

centauri2d.animate = function(object, fields, ms, callback, aborter){
	var animation = {run: true};
	var changeFields = {};
	for(var field in fields){
		if(object[field] == undefined)
			object[field] = 1;
		changeFields[field] = (fields[field] - object[field]) / ms;
	}
	
	var last = (new Date()).getTime();
	var msPassed = 0;
	var changer = function(){
		if(!animation.run) return;
		var delta = new Date().getTime() - last;
		msPassed += delta;
		for(var field in changeFields){
			if(msPassed >= ms)
				object[field] = fields[field];
			else {
				var newField = object[field] + changeFields[field] * delta;
				if(aborter != undefined && aborter(newField)){
					if(callback != undefined)
						callback();
					animation.run = false;
					return;
				}
				object[field] = newField;
			}
		}
		last = (new Date()).getTime();
		
		if(msPassed >= ms){
			if(callback != undefined) 
				callback(object);
			animation.run = false;
		}else{
			if(animation.run){	
				setTimeout(changer, 10);
			}
		}
	};
	changer();
	return animation;
};

centauri2d.animateLoop = function(object, fields, ms, aborter){
	var first = false;
	var origin = {};
	for(var field in fields){
		origin[field] = object[field];
	}
	var looper = function(){
		var animateFields = first ? origin : fields;
		centauri2d.animate(object, animateFields, ms, function(){
			first = !first;
			looper();
		}, aborter);
	};
	looper();
};


