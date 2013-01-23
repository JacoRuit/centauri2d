var CTX_MANIPULATOR = -123;

centauri2d.Scene = function(){
	this.renderables = [];
	this.lastRender = null;
};

centauri2d.Scene.prototype.deleteRenderable = function(renderable){
	for(var i = 0; i < this.renderables.length; ++i){
		if(this.renderables[i].object == renderable)
			this.renderables.splice(i, 1);
	}
}

centauri2d.Scene.prototype.addRenderable = function(renderable, zIndex){
	if(zIndex == undefined) zIndex = 0;
	this.renderables.push({"object": renderable, "zIndex": zIndex});
	this.renderables.sort(function(a, b){
		if(a.zIndex == CTX_MANIPULATOR)
			return true;
		a.zIndex < b.zIndex;
	});
};

centauri2d.Scene.prototype.__input = function(game, eventType, event){
	for(var i = 0; i < this.renderables.length; ++i){
		if(this.renderables[i].object.input != undefined){
			if(!this.renderables[i].object.input(game, this, eventType, event)){
				return false;
			}
		}
	};
	return true;
};

centauri2d.Scene.prototype.__render = function(game){
	if(this.lastRender == null)
		this.lastRender = (new Date()).getTime();
	var delta = this.lastRender - (new Date()).getTime();
	for(var i = 0; i < this.renderables.length; ++i){
		game.context.save();
		centauri2d.prepareContext(game, this.renderables[i].object);
		this.renderables[i].object.render(game, this, delta);
		game.context.restore();
	};
	this.lastRender = (new Date()).getTime();
};

centauri2d.Scene.prototype.__update = function(game, delta){
	for(var i = 0; i < this.renderables.length; ++i){
		if(this.renderables[i].object.update != undefined)
			this.renderables[i].object.update(game, this, delta);
	};
};
