"use strict";
var isGaming = false;

function getPosition(e) {
    var position = {
        x: null,
        y: null
    };

    if (Modernizr.touch) { //глобальная переменная, обнаруживающая 
        //поддержку сенсорного экрана
        if (e.touches && e.touches.length > 0) {
            position.x = e.touches[0].pageX - canvasPosition.x;
            position.y = e.touches[0].pageY - canvasPosition.y;
        }
    } else {
        position.x = e.pageX - canvasPosition.x;
        position.y = e.pageY - canvasPosition.y;
    }

    return position;
}


var RAF =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };

var spaceShip = {
    x: 30,
    y: 30,
    speedX: 2,
    speedY: 1,
    width:100,
    height:100,


    update: function () {
        var shuttleElem = document.getElementById('shuttle');
        shuttleElem.style.left = this.x + "px";
        shuttleElem.style.top = this.y + "px";
    }
}



function start() {
    // плавное движение - от 25 кадр/сек
    RAF(tick);

}

function tick() {
    if (isGaming) {
        return;
    }
    spaceShip.x += spaceShip.speedX;
    // вылетел  правее 
    if (spaceShip.x + spaceShip.width >= window.innerWidth) {
        spaceShip.speedX = -spaceShip.speedX;
        spaceShip.x = window.innerWidth - spaceShip.width;
    }
    // вылетел  левее 
    if (spaceShip.x < 0) {
        spaceShip.speedX = -spaceShip.speedX;
        spaceShip.x = 0;
    }

    spaceShip.y += spaceShip.speedY;
    // вылетел ниже 
    if (spaceShip.y + spaceShip.height >= window.innerHeight) {
        spaceShip.speedY = -spaceShip.speedY;
        spaceShip.y = window.innerHeight - spaceShip.height;
    }
    // вылетел выше 
    if (spaceShip.y < 0) {
        spaceShip.speedY = -spaceShip.speedY;
        spaceShip.y = 0;
    }

    spaceShip.update();
    RAF(tick);
}

spaceShip.update();
start();

var localValue = localStorage.getItem('yourRecord');

function gameup() {
    isGaming = true;
    var up = document.getElementById('wrapper');
    up.style.display = "block";
    

    var back = document.getElementById('menu');
    console.warn(back);
    back.style.display = "block";
}

function victory() {
    var rec = document.getElementById('Record');
    rec.style.display = "block";
    document.getElementById('Count').value = localValue;

}
