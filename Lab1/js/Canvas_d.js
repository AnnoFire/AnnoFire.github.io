function Color(){
	var c=document.getElementById("Canvas_d");
	var ctx=c.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(100, 0);
	ctx.lineTo(0, 100);
	ctx.lineTo(100, 100);
	ctx.fillStyle = "#FFFF00";
	ctx.fill();
	ctx.fillStyle="#0000ff";
	ctx.fillRect(0,100,100,100);
}