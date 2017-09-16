var canvas = document.getElementById('myCanvas');
var ctx = myCanvas.getContext('2d');

//Allar breytur fyrir leikinn
var radius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var moveX = 2;
var moveY = -2;
var sH = 10; //Hæð af spaðanum sem notandinn stjórnar
var sW = 75; //Breidd af spaðanum sem notandinn stjírnar
var sX = (canvas.width-sW)/2; //Staðsetnigns spaðans á x ás
//Ræður áttunum sem notandinn hreyfir spaðan
var sHaegri = false; 
var sVinstri = false;
//Breyturnar fyrir kassana
var kFjoldiLina = 5;
var kFjoldiKassa = 10;
var kW = 75;
var kH = 20;
var kBil = 15;
var kBilFraTopp = 30;
var kBilFraVinstri = 30;
//Stig
var stig = 0;
var buid = false;
var lif = 3;

var kassar = [];
for(c=0; c<kFjoldiKassa; c++) {
    kassar[c] = [];
    for(r=0; r<kFjoldiLina; r++) {
        kassar[c][r] = { x: 0, y: 0, stada: 1 };
    }
}


document.addEventListener("keydown", nidur, false);
document.addEventListener("keyup", upp, false);

function nidur(e) {
    if(e.keyCode == 68 || e.keyCode == 39) {
        sHaegri = true;
    }
    else if(e.keyCode == 65 || e.keyCode == 37) {
        sVinstri = true;
    }
}
function upp(e) {
    if(e.keyCode == 68 || e.keyCode == 39) {
        sHaegri = false;
    }
    else if(e.keyCode == 65 || e.keyCode == 37) {
        sVinstri = false;
    }
}

function eydaKassa() {
    for(c=0; c<kFjoldiKassa; c++) {
        for(r=0; r<kFjoldiLina; r++) {
            var k = kassar[c][r];
            if (k.stada == 1) {
	            	if(x > k.x && x < k.x+kW && y > k.y && y < k.y+kH) {
	                moveY = -moveY;
	                k.stada = 0;
	                stig++;
	                if (stig == kFjoldiKassa*kFjoldiLina) {
	                	buid = true;
	                }
            	}
            }
        }
    }
}

function birtaStig() {
	ctx.font = "16px Times New Roman";
	ctx.fillStyle = "#34495e";
	ctx.fillText("Stig: " + stig, 8, 20);
}

function birtaLif() {
	ctx.font = "16px Times New Roman";
	ctx.fillStyle = "#34495e";
	ctx.fillText("Lif: " + lif, canvas.width-65, 20);
}


function teiknaBolta() {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI*2);
	ctx.fillStyle = "#e74c3c";
	ctx.fill();
	ctx.closePath();
}

function teiknaSpada() {
	ctx.beginPath();
	ctx.rect(sX, canvas.height-sH, sW, sH)
	ctx.fillStyle = "#e74c3c";
	ctx.fill();
	ctx.closePath();
}

function teiknaKassa() {
    for(c=0; c<kFjoldiKassa; c++) {
        for(r=0; r<kFjoldiLina; r++) {
        	if (kassar[c][r].stada == 1) {
	        	var kX = (c*(kW+kBil))+kBilFraVinstri;
	            var kY = (r*(kH+kBil))+kBilFraTopp;
	            kassar[c][r].x = kX;
	            kassar[c][r].y = kY;
	            ctx.beginPath();
	            ctx.rect(kX, kY, kW, kH);
	            ctx.fillStyle = "#e74c3c";
	            ctx.fill();
	            ctx.closePath();
        	}
        }
    }
}

function teikna() {
	if (buid == false) {
		ctx.clearRect(0, 0, canvas.width, canvas.height); //Hreinsar út canvas-ið-*+++*,
		teiknaKassa();
		teiknaBolta();
		teiknaSpada();
		birtaStig();
		birtaLif();
		eydaKassa();
		if(x + moveX > canvas.width-radius || x + moveX < radius) { //Ef boltinn klessir á vinstri eða hægri vegginn er breytt moveX í -moveX, gert í -  radius þannig það er skoðað frá radius hring en ekki miðju hringsins
	        moveX = -moveX;
	    }
	    
	    if(y + moveY < radius) { //Ef boltinn ver á efri eða neðri veggin er breytt moveY í -moveY þannig að hann fer í aðra átt
	        moveY = -moveY;
	    }
	    else if (y + moveY > canvas.height-radius) { //Ef þetta hittir botnin
	    	if (x > sX && x < sX + sW) { //Ef miðjan á boltanum er einhverstaðar á breiddini af spaðanum
	    		moveY = -moveY
	    	}
	    	else {
	    		lif--;
	    		if (lif == 0) {
	    			alert("Thu Tapadir! Stig = " + stig);
	    			document.location.reload(); //Refreshað síðunni
	    		}
	    		else {
	    			x = canvas.width/2;
	    			y = canvas.height - 30;
	    			moveX = 2;
	    			moveY = -2;
	    			sX = (canvas.width-sW)/2;
	    		}
	    	}
	    	
	    }

	    if(sHaegri && sX < canvas.width-sW) {
	        sX += 7;
	    }
	    else if(sVinstri && sX > 0) {
	        sX -= 7;
	    }

		x += moveX; //Hækkað x á boltanum um 2
	    y += moveY; //Lækkar y á boltanum um 2
	}
	else {
		ctx.font = "50px Times New Roman";
		ctx.fillStyle = "#34495e";
		ctx.fillText("Thu vannst! Til hamingju. Stig: " + stig, 150, 380);
	}
}

if (buid == false) { //Ef leikurinn er búinn er hætt að keyra teikna hverjar 10 millisekúndur
	setInterval(teikna, 10) //Keyrir function-ið teikna hverja 10 millisekúndur
}