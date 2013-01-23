centauri2d.Text = function(x, y, text, color){
	this.x = x;
	this.y = y;
	this.text = text;
	this.color = color;
	this.width = 0;
	this.height = 0;
};

centauri2d.Text.prototype.update = function(game, scene, delta){
	this.height = this.fontSize;
};

centauri2d.Text.prototype.render = function(game, scene, delta){
	var text = typeof(this.text) == "function" ? this.text(game, scene, delta) : this.text;
	game.context.fillText(text, this.x, this.y);
	this.width = game.context.measureText(text).width;
};
