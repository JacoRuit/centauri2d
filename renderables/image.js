centauri2d.Image = function(x, y, src){
	this.x = x;
	this.y = y;
	this.img = new Image();
	this.img.src = src;
	this.width = this.img.width;
	this.height = this.img.height;
};

centauri2d.Image.prototype.update = function(game, scene, delta){
	this.img.width = this.width;
	this.img.height = this.height;
}

centauri2d.Image.prototype.render = function(game, scene, delta){
	game.context.drawImage(this.img,this.x, this.y);
};

centauri2d.Image.prototype.isInside = function(x, y){
	return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
}

centauri2d.Sprite = function(x, y, src, width, height){
	this.x = x;
	this.y = y;
	this.img = new Image();
	this.img.src = src;
	this.width = width;
	this.height = height;
	this.imgNumber = 0;
	this.doAnimate = false;
	this.imgsPerRow = Math.floor(this.img.width / this.width);
};

centauri2d.Sprite.prototype.animate = function(number1, number2, interval){
	var sprite = this;
	var animation = {run: true};
	this.doAnimate = true;
	this.imgNumber = number1;
	var changer = function(){
		if(!animation.run)
			return;
		if(sprite.imgNumber == number2)
			sprite.imgNumber = number1;
		else
			sprite.imgNumber++;
		setTimeout(changer, interval);
	};
	changer();
	return animation;
};


centauri2d.Sprite.prototype.render = function(game, scene, delta){
	var row = Math.floor(this.imgNumber / this.imgsPerRow);	
	game.context.drawImage(
		this.img, 
		(this.imgNumber % this.imgsPerRow) * this.width, 
		row * this.height, 
		this.width, 
		this.height, 
		this.x, 
		this.y, 
		this.width,
		this.height
	);
};
