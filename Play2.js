'use strict';
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');


window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

}
resizeCanvas();


document.getElementById('Repeat').addEventListener('click', function () {
	var gameO = document.getElementById('gameOver');
	gameO.style.display = "none";
	point = 0;
});


var aster = [];
//переменная, отвечающая за координаты астероида; скорость изменения координат
var fire = []; // массив для выстрелов
var shell = []; //
var expl = []; //массив взрывов
var ex = [];
var timer = 0;
var ship = {
	x: canvas.width / 2,
	y: canvas.height / 2
};
var enemy = []; //массив для противников
var score = 0;
var keyMouse = [];
var point = 0;

var asterimg = new Image();
asterimg.src = "img2/astero.png";

var fireimg = new Image();
fireimg.src = "img2/fire.png";

var shellimg = new Image();
shellimg.src = "img2/shell2.png"

var shipimg = new Image();
shipimg.src = "img2/ship01.png";

var explimg = new Image();
explimg.src = "img2/expl222.png";

var bumimg = new Image();
bumimg.src = "img2/bum.png";

var enemimg = new Image();
enemimg.src = "img2/enemy1.png";

var fonimg = new Image();
fonimg.src = "img2/fon2.png";

var soundFire = new Audio();
soundFire.src = "sounds/sound_fire2.mp3";

var expSound = new Audio();
expSound.src = "sounds/sound_exp2.mp3";

var bumSound = new Audio();
bumSound.src = "sounds/sound_bum.mp3";

explimg.onload = function () {
	game();
}
//основной игровой цикл

function game() {
	
	update();
	render();
	requestAnimationFrame(game);
}

function over() {
	var gameO = document.getElementById('gameOver');
	gameO.style.display = "block";
	document.getElementById('Score').value = point;

	localStorage.setItem('yourRecord', document.getElementById('Score').value);
}

function shoot() {
	fire.push({
		x: ship.x + 10,
		y: ship.y,
		dx: 0,
		dy: -5
	});
	soundFire.play();
	//fire.push({x:ship.x+10, y:ship.y, dx:0.5, dy:-5});
	//fire.push({x:ship.x+10, y:ship.y, dx:-0.5, dy:-5});
}
//выстрел

function onMove(event) {
	if (event.touches) {
		var touch = event.touches[0];
		ship.x = touch.clientX - 25;
		ship.y = touch.clientY - 10;
	} else {
		ship.x = event.offsetX - 25; // меняются относительные координаты
		ship.y = event.offsetY - 10;
	}
}
canvas.addEventListener('mousemove', onMove);
canvas.addEventListener('touchmove', onMove);

canvas.addEventListener('click', function (event) {
	shoot();
});

canvas.addEventListener('keydown', function (event) {
	keyMouse[event.keyCode] = true;
});

canvas.addEventListener('keyup', function (event) {
	keyMouse[event.keyCode] = false;
});

function update() {
	timer++;
	if (timer % 40 == 0) {
		aster.push({
			x: Math.random() * canvas.width, //600
			y: -50,
			dx: Math.random() * 2 - 1,
			dy: Math.random() * 2 + 2,
			del: Math.random() * 2 + 2,
			del: 0
		});

		enemy.push({
			x: Math.random() * canvas.width,
			y: -50,
			dx: Math.random() * 2 - 1,
			dy: Math.random() * 2 + 2,
			del: Math.random() * 2 + 2,
			destroy: 0
		});
	}

	//двигаем пули
	for (var j in fire) {
		fire[j].x = fire[j].x + fire[j].dx;
		fire[j].y = fire[j].y + fire[j].dy;

		if (fire[j].y < -30) fire.splice(j, 1); //если вылетит вверх, ха экран, удаляем из массива
	}

	//физика
	for (var i in aster) {
		aster[i].x = aster[i].x + aster[i].dx;
		aster[i].y = aster[i].y + aster[i].dy;
		//границы
		if (aster[i].x >= canvas.width || aster[i].x <= canvas.width /*|| aster[i].x<0*/ ) aster[i].dx = -aster[i].dx;
		if (aster[i].y >= canvas.height) aster.splice(i, 1);
		//цикл перебирает массив астероидов на столкновение с пулями
		for (var j in fire) {
			//произошло столкновение
			if (Math.abs(aster[i].x + 25 - fire[j].x - 15) < 50 && Math.abs(aster[i].y - fire[j].y) < 25) {
				//взрыв
				expl.push({
					x: aster[i].x - 25,
					y: aster[i].y - 25,
					animx: 0,
					animy: 0
				});
				expSound.play();

				//помечаем астероид на удаление
				aster[i].del = 1;
				fire.splice(j, 1);
				break;
			}
		}
		//удаляем астероиды, если попали в него
		if (aster[i].del == 1) aster.splice(i, 1) && point++;


	}

	for (var u in enemy) {
		enemy[u].x = enemy[u].x + enemy[u].dx;
		enemy[u].y = enemy[u].y + enemy[u].dy;
		//границы
		if (enemy[u].x >= canvas.width || enemy[u].x < -canvas.width /*enemy[u].x<0*/ ) enemy[u].dx = -enemy[u].dx;
		if (enemy[u].y >= canvas.height) enemy.splice(u, 1);
		//перебираем цикл на столкновение с противником
		for (var j in fire) {
			//столкновение с противником произошло
			if (Math.abs(enemy[u].x + 40 - fire[j].x - 15) < 80 && Math.abs(enemy[u].y - fire[j].y) < 40) {
				//взрыв
				expl.push({
					x: enemy[u].x - 25,
					y: enemy[u].y - 25,
					animx: 0,
					animy: 0
				});
				expSound.play();
				//помечаем противника на удаление
				enemy[u].destroy = 1;
				fire.splice(j, 1);
				break;
			}
		}
		// удаляем противника
		if (enemy[u].destroy == 1) enemy.splice(u, 1) && point++;
	}

	//анимация взрыва
	for (var l in expl) {
		expl[l].animx = expl[l].animx + 0.5; // идет по первому ряду идет дальше по всем рядам
		if (expl[l].animx > 7) {
			expl[l].animy++;
			expl[l].animx = 0
		}
		if (expl[l].animy > 7)
			expl.splice(l, 1);
		score++;
	}
	//столкновение с кораблем
	for (var i in aster) {
		if (Math.abs(aster[i].x + 25 - ship.x) < 50 && Math.abs(aster[i].y - ship.y) < 25) {
			//	взрыв корабля
			ex.push({
				x: ship.x,
				y: ship.y,
				animx: 0,
				animy: 0
			});
			bumSound.play();
			over();
		}

		for (var u in enemy) {
			if (Math.abs(enemy[u].x + 25 - ship.x) < 50 && Math.abs(enemy[u].y - ship.y) < 25) {
				//	взрыв корабля
				ex.push({
					x: ship.x,
					y: ship.y,
					animx: 0,
					animy: 0
				});
				bumSound.play();
				over();
			}
			// анимация взрыва корабля
			for (var i in ex) {
				ex[i].animx = ex[i].animx + 0.9; // идет по первому ряду идет дальше по всем рядам
				if (ex[i].animx > 7) {
					ex[i].animy++;
					ex[i].animx = 0
				}
				if (ex[i].animy > 7)
					ex.splice(i, 1);
			}

		}
	}
}
// отрисовка слоев
function render() {
	context.drawImage(fonimg, 0, 0, canvas.width, canvas.height); // второй набор параметров - смещение спрайта
	context.drawImage(shipimg, ship.x, ship.y);
	context.fillStyle = "#FF0000";
	context.font = "24px Verdana";
	context.fillText("Счет: " + point, 10, canvas.height - 600);


	for (var j in fire) context.drawImage(fireimg, fire[j].x, fire[j].y, 30, 30);
	for (var i in aster) context.drawImage(asterimg, aster[i].x, aster[i].y, 50, 50); // 50-размер астероида
	for (var u in enemy) context.drawImage(enemimg, enemy[u].x, enemy[u].y, 80, 80);
	//for(var i in shell) context.drawImage(shellimg, shell[i].x, shell[i].y, 30,30);

	//рисуем взрывы
	for (var l in expl) // 128 - размер спрайта
		context.drawImage(explimg, 128 * Math.floor(expl[l].animx), 128 * Math.floor(expl[l].animy), 128, 128, expl[l].x, expl[l].y, 100, 100);

	for (var i in ex) // 128 - размер спрайта
		context.drawImage(bumimg, 60 * Math.floor(ex[i].animx), 60 * Math.floor(ex[i].animy), 60, 60, ex[i].x, ex[i].y, 50, 50);

}
if isGaming==true {
var requestAnimationFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 20);
		};
})();}
