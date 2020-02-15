// set up and initialise global variables
var c;
var ctx;
// size of candle animation
var dimX = 40;
var dimY = 110;
	
window.onload=function(){
	c = document.getElementById('tafel');
	ctx = c.getContext('2d');
	
	// Properties for drawing the wick
	ctx.globalCompositeOperation="destination-over";
	ctx.strokeStyle="rgba(155,0,0,1)";
	ctx.lineWidth=3;
}

// main animation function
function candleFlame(){
	var z;

	ctx.clearRect(0,0,200,200);
	// --------------- add second layer -------------------
	var params = {r: [200, 160, 70]};
	var data = candleAnimation(params);
	var params = {r: [150, 120, 70]};
	var data2 = candleAnimation(params, data);

	var layer = dataToImageDataLayer(data);
	var layer2 = dataToImageDataLayer(data2);
	
	// put this line back in, if you want to see the original candle animation without two layers as well
	// ctx.putImageData(layer, 50, 50);
	// draw candle on canvas
	ctx.putImageData(layer2, 100, 50);

	// adding a red wick
	ctx.beginPath();
	ctx.moveTo(120,160);
	ctx.bezierCurveTo(120,130,125,140,120,140);
	ctx.stroke();

	// update only every 100ms to achieve candle 'break' effect
	window.setTimeout(function (){candleFlame()},100);
}

function candleAnimation(params, oldData) {
	var r,g,b,a;  // color values
	
	var data = [];
	for(var i=0;i<dimY;i++) {
		data[i] = [];
		for(var j=0;j<dimX;j++) {
			data[i][j] = {
				r: 0,
				g: 0,
				b: 0,
				a: 0
			};
		}
	}
	
	var state = [];
	for(var n=0;n<dimX;n++) state[n]=0;

	for(m=dimY-1;m>0;m--){
		var y = 4*dimX*(m+1);
		for(n=0;n<dimX;n++){
			if(m >= dimY-1) {
				// initialize lower boundary
				if(n>10 && n < 30) r = 255; else r=0;
				g=r;
				b=r;
				a=255;
			} else {
				if(n > 0 && n < dimX-1){
					r = Math.round(1/3*(data[m+1][n].r+data[m+1][n-1].r+data[m+1][n+1].r))+state[n];
					g = oldData ? 0 : r;
					b = oldData ? Math.min(255,r*2) : Math.floor(r/2);
					a = Math.min(255,10*(110-m));
					if(r<params.r[0]) state[n] -= Math.floor(2*Math.random());
					if(r<params.r[1] && r>params.r[2]) state[n] += Math.floor(2*Math.random()); 
				} else {
					r=0;
					g=0;
					b=0;
					a=255;
				}
			}
			
			data[m][n].r = oldData ? Math.max(r,oldData[m][n].r) : (r >= 0 ? r : 0);
			data[m][n].g = oldData ? Math.max(g,oldData[m][n].g) : (g >= 0 ? g : 0);
			data[m][n].b = oldData ? Math.min(200,Math.max(b,oldData[m][n].b)) : (b >= 0 ? b : 0);
			data[m][n].a = oldData ? Math.max(a,oldData[m][n].a) : (a >= 0 ? a : 0);
		}
	}
	return data;
}

function dataToImageDataLayer(data) {
	var layer = ctx.createImageData(dimX, dimY);
	for(var m=0;m<dimY;m++) {
		for(var n=0;n<dimX;n++) {
			layer.data[4*dimX*m+4*n+0] = data[m][n].r;
			layer.data[4*dimX*m+4*n+1] = data[m][n].g;
			layer.data[4*dimX*m+4*n+2] = data[m][n].b;
			layer.data[4*dimX*m+4*n+3] = data[m][n].a;
		}
	}
	return layer;
}
