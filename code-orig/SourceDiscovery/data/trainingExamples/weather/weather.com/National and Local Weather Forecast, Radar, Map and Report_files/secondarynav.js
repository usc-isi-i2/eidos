/* ~~~ following code makes either div apper slowing top down or bottom up ~~~ */
/* ~~~ right now we are using it for bottom up ~~~ */
function startShow(){
	clipDiv(this.id,0,this.width,this.currHeight,0);
	document.getElementById(this.id).style.visibility = 'visible';
	if(0 == this.timer){
			for (var a=0;a<8;a++) {
				if (this.id == "hbBMI" + (a+1) + "S") this.timer = setInterval("MenuArray["+a+"].openMe()", 50);
				else MenuArray[a].hideMe();
			}	
	}	
	hbBMIOver(this.sub_id);
}

function startShowReverse(){			
		var newTop = 0;				
		this.height = parseInt(document.getElementById(this.id).offsetHeight);
		this.width =  parseInt(document.getElementById(this.id).offsetWidth);
		
	clipDiv(this.id,this.height-this.currHeight,this.width,this.height,0);
	document.getElementById(this.id).style.visibility = 'visible';
	if(0 == this.timer){
			for (var a=0;a<8;a++) {
				if (this.id == "hbBMI" + (a+1) + "S") this.timer = setInterval("MenuArray["+a+"].openMe()", 50);
				else MenuArray[a].hideMe();
			}	
	}
	mainYposition = 145;//findPosY(document.getElementById("hbBannerMenuContainer"));  	
	newTop = (mainYposition - this.height)+10;
	document.getElementById(this.id).style.top = newTop + 'px';			
	hbBMIOver(this.sub_id);
}

function showSubmenu(){
	if(this.currHeight < this.height){
		clipDiv(this.id,0,this.width,this.currHeight,0);
		this.currHeight = this.currHeight +20;
	}else{
	document.getElementById(this.id).style.clip='rect(auto)';
		this.stopMe;
	}
}
function showSubmenuReverse(){
	if (!isMinIE4) {
		if(this.currHeight-20 < this.height){
			clipDiv(this.id,this.height-this.currHeight,this.width,this.height,0);
			this.currHeight = this.currHeight +20;
			this.width = this.width +20;
		}else{
		document.getElementById(this.id).style.clip='rect(auto auto auto auto)';
			this.stopMe;
		}
	}else{
		if(this.currHeight < this.height){
			clipDiv(this.id,this.height-this.currHeight,this.width,this.height,0);
			this.currHeight = this.currHeight +20;
			this.width = this.width +20;
		}else{
		document.getElementById(this.id).style.clip='rect(auto auto auto auto)';
			this.stopMe; 
		}
	}
}
function stopMoving(){
	if(0!= this.timer){	
		clearInterval(this.timer);
		this.timer = 0;
		this.currHeight = 10;		
	}	
}
function startHide(){
	if(0!= this.timer){	
			clearInterval(this.timer);
			this.timer = 0;
			this.currHeight = 10;
			document.getElementById(this.id).style.visibility = 'hidden';				
			hbBMIOut(this.sub_id);					
		}
}
function showDivObj(id, height, width){	
if (!isMinIE4) {
	this.height = height+20;
	this.width =  width+20;
}else{	
	this.height = height;
	this.width = width +20;
}
	this.id = id;
	this.sub_id = this.id.substr(0,6);
	this.width = width;
	this.showMe = startShowReverse;
	this.hideMe = startHide;
	this.timer = 0;
	this.stopMe = stopMoving;
	this.openMe = showSubmenuReverse;
	this.currHeight = 10;
}
second_tabheight0 = document.getElementById("hbBMI1S").offsetHeight;
second_tabwidth0 = document.getElementById("hbBMI1S").offsetWidth;
second_tabheight1 = document.getElementById("hbBMI2S").offsetHeight;
second_tabwidth1 = document.getElementById("hbBMI2S").offsetWidth;
second_tabheight2 = document.getElementById("hbBMI3S").offsetHeight;
second_tabwidth2 = document.getElementById("hbBMI3S").offsetWidth;
second_tabheight3 = document.getElementById("hbBMI4S").offsetHeight;
second_tabwidth3 = document.getElementById("hbBMI4S").offsetWidth;
second_tabheight4 = document.getElementById("hbBMI5S").offsetHeight;
second_tabwidth4 = document.getElementById("hbBMI5S").offsetWidth;
second_tabheight5 = document.getElementById("hbBMI6S").offsetHeight;
second_tabwidth5 = document.getElementById("hbBMI6S").offsetWidth;
second_tabheight6 = document.getElementById("hbBMI7S").offsetHeight;
second_tabwidth6 = document.getElementById("hbBMI7S").offsetWidth;
second_tabheight7 = document.getElementById("hbBMI8S").offsetHeight;
second_tabwidth7 = document.getElementById("hbBMI8S").offsetWidth;

var MenuArray = new Array();
MenuArray[0] = new showDivObj('hbBMI1S', second_tabheight0,second_tabwidth0);
MenuArray[1] = new showDivObj('hbBMI2S', second_tabheight1,second_tabwidth1);
MenuArray[2] = new showDivObj('hbBMI3S', second_tabheight2,second_tabwidth2);
MenuArray[3] = new showDivObj('hbBMI4S', second_tabheight3,second_tabwidth3);
MenuArray[4] = new showDivObj('hbBMI5S', second_tabheight4,second_tabwidth4);
MenuArray[5] = new showDivObj('hbBMI6S', second_tabheight5,second_tabwidth5);
MenuArray[6] = new showDivObj('hbBMI7S', second_tabheight6,second_tabwidth6);
MenuArray[7] = new showDivObj('hbBMI8S', second_tabheight7,second_tabwidth7);
