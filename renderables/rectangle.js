centauri2d.Rectangle = function(x, y, width, height, type){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.type = type == undefined ? Square.Type.Stroke : type;
};

centauri2d.Rectangle.Type = {
	Fill: 1,
	Stroke: 2
};

centauri2d.Rectangle.prototype.render = function(game, scene, delta){
	switch(this.type){
		case 1:
			game.context.fillRect(this.x, this.y, this.width, this.height);
			break;
		case 2:
			game.context.strokeRect(this.x, this.y, this.width, this.height);
			break;
		default:
			throw "Unknown Square type";
	};
};
