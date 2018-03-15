var canvas, stage, exportRoot, game, resizeCanvas, genCount, genMax, itemNum, score, score2;
var lib; //函數庫
var log = console.log; //shortcut

//初始化
var init = () =>{
	canvas = document.getElementById("canvas");

	canvas.style.display = 'block';

	lib = AdobeAn.compositions['D18139A9B75D6F44954D54D084BBFDA1'].getLibrary();

	exportRoot = new lib.useless_elements();
	stage = new createjs.Stage("canvas");

	//Code to support hidpi screens and responsive scaling.
	resizeCanvas = function(){

		//var tmpDOM = [canvas], 					//畫布與讀檔元素
		h = window.innerHeight,
		w = window.innerWidth,
		r = window.devicePixelRatio;

		//tmpDOM.push.apply( tmpDOM , Object.values(videos) ); 	//影片元素 ES5
		//tmpDOM.push( ...Object.values(videos) ); 				//影片元素 ES6
		
		//畫布
		/*for(let i=0;i<tmpDOM.length;i++){
			if(tmpDOM[i].style.display != 'none'){
				//畫布寬高
				tmpDOM[i].style.width = w + "px";
				tmpDOM[i].style.height = h + "px";
				//畫布像素(?)
				tmpDOM[i].width = w;
				tmpDOM[i].height = h;
			}
		}*/
		canvas.style.width = w + "px";
		canvas.style.height = h + "px";

		exportRoot.scaleY = 720/h;
		exportRoot.scaleX = 1280/w;
		//主要場景重繪
		/*if(exportRoot){
			if(exportRoot.scaleX){
				exportRoot.x = exportRoot.y = 0;
				if( w*9 > h*16 ){
					exportRoot.scaleY = h/720;
					exportRoot.scaleX = exportRoot.scaleY;
					exportRoot.x = (w - exportRoot.scaleX*1280)/2;

				}else{
					exportRoot.scaleX = w/1280;
					exportRoot.scaleY = exportRoot.scaleX;
					exportRoot.y = (h - exportRoot.scaleY*720)/2;
				}
			}
		}*/
		//重繪主要畫布
		if(null!=stage && null!=canvas){
			var ctx = canvas.getContext("2d");
			stage.clear();
			stage.draw(ctx, false);
		}
	}
	window.addEventListener('resize', resizeCanvas);
	resizeCanvas();

	document.getElementById("menuBtn").addEventListener('click', menuClick);

	canvas.addEventListener('mousemove', follow);
	canvas.addEventListener('touchmove', follow2);

	exportRoot.CG1.addEventListener("click", function(e){exportRoot.CG1.visible = false;});
	exportRoot.eqBtn.addEventListener("click", equiToggle);
	exportRoot.eqMenu.tomimi.addEventListener("click", tomimiToggle);
	exportRoot.eqMenu.swan.addEventListener("click", swanToggle);
	exportRoot.eqMenu.hat1.addEventListener("click", hat1Toggle);

	stage.addChild(exportRoot);
	createjs.Ticker.framerate = lib.properties.fps;
	createjs.Ticker.addEventListener("tick", stage);
	createjs.Ticker.addEventListener("tick", ticking);

	exportRoot.ramen.speed = 20;
	exportRoot.ramen.targetX = exportRoot.ramen.x;
	exportRoot.ramen.targetY = exportRoot.ramen.y;

	exportRoot.Useless_guy.speed = 10;
	exportRoot.Useless_guy.targetX = exportRoot.Useless_guy.x;
	exportRoot.Useless_guy.targetY = exportRoot.Useless_guy.y;

	exportRoot.QB.speed = 2;
	exportRoot.QB.targetX = exportRoot.Useless_guy.x;
	exportRoot.QB.targetY = exportRoot.Useless_guy.y;

	exportRoot.bar.shape.mask.x = -175;
	exportRoot.bar2.shape.mask.x = -175;

	score = 0;
	score2 = 0;
	itemNum = 0;
	genCount = 0;
	genMax = 50;
	exportRoot.items = [];
	exportRoot.sleepings = [];
	exportRoot.Ramens = [];

	stage.update();
}

var equiToggle = e=>{
	exportRoot.eqMenu.visible ? exportRoot.eqMenu.visible = false : exportRoot.eqMenu.visible = true;
}

var tomimiToggle = e=>{
	exportRoot.ramen.tomimi.visible ? exportRoot.ramen.tomimi.visible = false : exportRoot.ramen.tomimi.visible = true;
}

var swanToggle = e=>{
	exportRoot.Useless_guy.swan.visible ? exportRoot.Useless_guy.swan.visible = false : exportRoot.Useless_guy.swan.visible = true;
}

var hat1Toggle = e=>{
	exportRoot.ramen.hat1.visible ? exportRoot.ramen.hat1.visible = false : exportRoot.ramen.hat1.visible = true;
}

var menuClick = e=>{
	let menu = document.getElementById("menu");
	if(menu.style.display == 'none')menu.style.display = 'block';
	else menu.style.display = 'none';
}

var follow = e=>{
	exportRoot.Useless_guy.targetX = e.clientX;
	exportRoot.Useless_guy.targetY = e.clientY;
}

var follow2 = e=>{
	//log(e);
	e.preventDefault();
	exportRoot.Useless_guy.targetX = e.changedTouches["0"].clientX;
	exportRoot.Useless_guy.targetY = e.changedTouches["0"].clientY;
}

var ticking = e=>{
	genCount++;
	if(genCount>genMax){
		genItem();
		exportRoot.ramen.targetX = Math.random()*window.innerWidth;
		exportRoot.ramen.targetY = Math.random()*window.innerHeight;
	}
	Walking(exportRoot.ramen);
	Walking(exportRoot.Useless_guy);
	Walking(exportRoot.QB, exportRoot.Useless_guy.x, exportRoot.Useless_guy.y);
	if(exportRoot.Ramens[0])RamensFollow(exportRoot.Ramens[0], exportRoot.Useless_guy);
	for(let i=1;i<exportRoot.Ramens.length;i++)RamensFollow(exportRoot.Ramens[i], exportRoot.Ramens[i-1]);
	for(let i=0;i<exportRoot.items.length;i++)if( checkTouch(exportRoot.items[i], exportRoot.Useless_guy) )getItem(exportRoot.items[i],i);
	if( checkTouch(exportRoot.ramen, exportRoot.Useless_guy, {y:80} ) )getRamen();
	if( checkTouch(exportRoot.QB, exportRoot.Useless_guy, {y:60}) )getQB();
}

var getQB = ()=>{
	get100(0);
	exportRoot.QB.x = window.innerWidth + 150;
	exportRoot.QB.y = window.innerHeight + 150;
} 
var checkTouch = (obj1, obj2, dis={x:50,y:100})=>{
	dis.x = dis.x || 50;
	dis.y = dis.y || 100;
	if( Math.abs(obj1.x - obj2.x)<dis.x && Math.abs(obj1.y - obj2.y)<dis.y )return true;
	else return false
}

//跟隨
var RamensFollow = (obj, f_obj)=>{
	let x = f_obj.x,
		y = f_obj.y,
		X = x - obj.x,
		Y = y - obj.y,
		R = Math.sqrt(X*X + Y*Y),
		S = obj.speed*3;
	if(R<S)Walking(obj, f_obj.x - X*S/R, f_obj.y - Y*S/R);
	else Walking(obj, x, y);
}

//朝目標走路
var Walking = (obj,targetX,targetY)=>{
	targetX = targetX || obj.targetX;
	targetY = targetY || obj.targetY;
	let X = targetX - obj.x,
		Y = targetY - obj.y,
		r = Math.sqrt(X*X + Y*Y);
	if(r<obj.speed){
		obj.x = targetX;
		obj.y = targetY;
	}else{
		r = obj.speed/r;
		obj.x += X*r;
		obj.y += Y*r;
	}
	if(X<0)obj.scaleX = -1;
	else obj.scaleX = 1;
}

//產生
var genItem = ()=>{
	if( exportRoot.items.length<150 ){
		exportRoot.items.push(new lib.item1());
		exportRoot.addChildAt( exportRoot.items[exportRoot.items.length - 1], 0 );
		exportRoot.items[exportRoot.items.length - 1].x = exportRoot.ramen.x;
		exportRoot.items[exportRoot.items.length - 1].y = exportRoot.ramen.y;
	}
	if(genMax>6)genMax--;
	genCount = 0;
}

var getItem = (x,y)=>{
	exportRoot.removeChild(x);
	exportRoot.items.splice(y,1);
	exportRoot.Useless_guy.gotoAndPlay(3);
	score++;
	exportRoot.bar.shape.mask.x = -175 + 3.5*score;
	if(score>100)get100();
}

var getRamen = ()=>{
	score2++;
	exportRoot.bar2.shape.mask.x = -175 + 3.5*score2;
	exportRoot.ramen.gotoAndPlay(3);
	if(score2>100)genRamen();
}

var genRamen = ()=>{
	if( exportRoot.Ramens.length<100 ){
		exportRoot.Ramens.push(new lib.ramen2());
		exportRoot.addChildAt( exportRoot.Ramens[exportRoot.Ramens.length - 1], 0 );
		exportRoot.Ramens[exportRoot.Ramens.length - 1].x = exportRoot.ramen.x;
		exportRoot.Ramens[exportRoot.Ramens.length - 1].y = exportRoot.ramen.y;
		exportRoot.Ramens[exportRoot.Ramens.length - 1].targetX = exportRoot.Useless_guy.x;
		exportRoot.Ramens[exportRoot.Ramens.length - 1].targetY = exportRoot.Useless_guy.y;
		exportRoot.Ramens[exportRoot.Ramens.length - 1].speed = 8;
	}
	score2 = 0;
	exportRoot.Useless_guy.ramen.visible = true;
	exportRoot.ramen.eyebrow.visible = true;
	if(exportRoot.Ramens.length<2)showCG(0);
	else if(exportRoot.Ramens.length==2){
		showCG(1);
		exportRoot.eqMenu.swan.visible = true;
	}else{
		showCG(2);
		exportRoot.eqMenu.hat1.visible = true;
	}
}

var showCG = f=>{
	exportRoot.CG1.visible = true;
	let h = window.innerHeight,
		w = window.innerWidth;
	if(h>w) exportRoot.CG1.scaleX = exportRoot.CG1.scaleY = w/500;
	else exportRoot.CG1.scaleX = exportRoot.CG1.scaleY = h/500;
	exportRoot.eqMenu.tomimi.visible = true;
	exportRoot.CG1.gotoAndStop(f);
}

var get100 = (spp=2)=>{
	exportRoot.bar.shape.mask.x = -175;
	score = 0;

	exportRoot.sleepings.push(new lib.sleeping_guy());
	exportRoot.empty.addChildAt( exportRoot.sleepings[exportRoot.sleepings.length - 1], 0 );
	exportRoot.sleepings[exportRoot.sleepings.length - 1].x = exportRoot.Useless_guy.x;
	exportRoot.sleepings[exportRoot.sleepings.length - 1].y = exportRoot.Useless_guy.y;
	exportRoot.sleepings[exportRoot.sleepings.length - 1].scaleX = exportRoot.Useless_guy.scaleX;

	exportRoot.Useless_guy.x = exportRoot.Useless_guy.y = -150;

	exportRoot.Useless_guy.speed += spp;
}