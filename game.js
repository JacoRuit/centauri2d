centauri2d.UPDATES_PER_MINUTE = 50;
centauri2d.Event = {
	MouseMove: 1,
	MouseClick: 2,
	KeyDown: 3,
	KeyPress: 4,
	KeyUp: 5
};

centauri2d.Game = function(canvasId){
	this.canvasId = canvasId;
	this.canvas = document.getElementById(canvasId);
	this.context = this.canvas.getContext("2d");
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.scene = null;
	this.topScene = new centauri2d.Scene();
	this.topScene.addRenderable(new centauri2d.Text(3, this.height - 3, function(game, scene, delta){
		return "Average FPS: " + Math.round(game.allFps / game.rendersDone) +  "\tFPS: " + game.fps + "\tMouse:\tX:" + game.mouse.x + "\tY:" + game.mouse.y;
	}));
	this.topScene.renderables[0].object.color = "black";
	this.topScene.renderables[0].object.fontSize = 10;
	this.topScene.renderables[0].object.opacity = 0.75;
	this.scenes = {};
	this.run = false;
	this.targetFps = 20;
	this.fps = 0;
	this.allFps = 0;
	this.rendersDone = 0;
	this.lastRender = 0;
	this.lastUpdate = 0;
	this.mouse = {x: 0, y: 0};
};

centauri2d.Game.prototype.addScene = function(name, scene){
	this.scenes[name] = scene;
};

centauri2d.Game.prototype.setScene = function(name){
	if(this.scenes[name] == undefined)
		throw "Scene \"" + name + "\" doesn't exist";
	this.scene = this.scenes[name];
}

centauri2d.Game.prototype.start = function(){
	this.run = true;
	var rloopFunc = function(game){
		return function(){
			if(!game.run) return;
			var renderDelta = new Date().getTime() - game.lastRender;
			if(renderDelta == 0){
				game.fps = 1000;
			}else game.fps = Math.floor(1000 / renderDelta);
			game.allFps += game.fps;
			try{
				game.render();
			}catch(err){
				console.error(err);
			}
			game.rendersDone++;
			game.lastRender = (new Date()).getTime();
			setTimeout(rloopFunc(game), 1000 / game.targetFps - renderDelta);
		};
	};
	var uloopFunc = function(game){
		return function(){
			if(!game.run) return;
			try{
				var deltaUpdate = (new Date()).getTime() - game.lastUpdate;
				game.update(deltaUpdate);
				game.lastUpdate = (new Date()).getTime();
			}catch(err){
				console.error(err);
			}
			setTimeout(uloopFunc(game), 1000 / centauri2d.UPDATES_PER_MINUTE);
		};
	};
	this.registerListeners();
	this.lastRender = (new Date()).getTime();
	this.lastUpdate = (new Date()).getTime();
	uloopFunc(this)();
	rloopFunc(this)();
};

centauri2d.Game.prototype.registerListeners = function(){
	var game = this;
	this.canvas.onmousemove = function(event){
		game.mouse.x = event.clientX - game.canvas.offsetLeft;
		game.mouse.y = event.clientY - game.canvas.offsetTop;
		game.input(centauri2d.Event.MouseMove, event);
	};
	this.canvas.onclick = function(event){
		game.input(centauri2d.Event.MouseClick, event);
	};
	document.body.onkeydown = function(event){
		game.input(centauri2d.Event.KeyDown, event);
	};
	document.body.onkeypress = function(event){
		game.input(centauri2d.Event.KeyPress, event);
	};
	document.body.onkeyup = function(event){
		game.input(centauri2d.Event.KeyUp, event);
	};
};

centauri2d.Game.prototype.deleteListeners = function(){
	this.canvas.onmousemove = undefined;
	this.canvas.onclick = undefined;
	document.body.onkeydown = undefined;
	document.body.onkeypress = undefined;
	document.body.onkeyup = undefined;
};

centauri2d.Game.prototype.stop = function(){
	this.run = false;
	this.deleteListeners();
};

centauri2d.Game.prototype.input = function(eventType, event){
	if(this.scene == null)
		throw "No scene set";
	if(this.scene.input != undefined){
		if(!this.scene.input(this, eventType, event))
			return;
	}
	if(!this.scene.__input(this, eventType, event))
		return;
	if(this.topScene.input != undefined)
		this.topScene.input(this, eventType, event);
	if(!this.topScene.__input(this, eventType, event))
		return;
};

centauri2d.Game.prototype.render = function(){
	if(this.scene == null)
		throw "No scene set";
	this.canvas.width = this.canvas.width;
	this.scene.__render(this);
	if(this.scene.render != undefined)
		this.scene.render(this);
	this.topScene.__render(this);
	if(this.topScene.render != undefined)
		this.topScene.render(this);
};

centauri2d.Game.prototype.update = function(updateDelta){
	if(this.scene == null)
		throw "No scene set";
	this.scene.__update(this, updateDelta);
	this.topScene.__update(this, updateDelta);
	if(this.scene.update != undefined)
		this.scene.update(this, updateDelta);
	if(this.topScene.update != undefined)
		this.topScene.update(this, updateDelta);
};


