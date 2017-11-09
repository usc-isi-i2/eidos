

function WxException(itemName, ExceptionName) {
  this.itemName = itemName;
  this.ExceptionName = ExceptionName;
}
function WxComponentsMenu(instanceName) {
  
  this.instanceName = instanceName;
  this.menuDelay = 250;
  this.menuitems = new Object();
  this.timerID = 0;
  this.overTimerID = 0;
  this.overTimerRunning = false;
  this.timerRunning = false;
  this.timerOnName = '';
  this.activeMenuItem = '';
  
  this.showSubmenu = function(name) {
	if(name == "hbBMI1"){
		MenuArray[0].showMe();
	}
	if(name == "hbBMI2"){
		MenuArray[1].showMe();
	}
	if(name == "hbBMI3"){
		MenuArray[2].showMe();
	}
	if (name == "hbBMI4"){
		MenuArray[3].showMe();
	}
	if(name == "hbBMI5"){
		MenuArray[4].showMe();
	}
	if (name == "hbBMI6"){
		MenuArray[5].showMe();
	}
	if(name == "hbBMI7"){
		MenuArray[6].showMe();
	}
	if (name == "hbBMI8"){
		MenuArray[7].showMe();
	}
	
  }
  
  this.hideSubmenu = function(name) {
    if (this.activeMenuItem != '') this.menuitems[name].submenu.style.visibility = "hidden";
  }
  
  this.startClock = function() {
    this.stopClock();
    this.timerID = setTimeout(this.instanceName + ".finishDeactivateMenuItem()", this.menuDelay);
    this.timerRunning = true;
	 if (this.overTimerRunning) {
      clearTimeout(this.overTimerID);
      this.overTimerRunning = false;
    }
  }
  
  
  var baseCase = 0;
  var whoIsDefault = 0;
  
  this.findDefault = function() {
  	// Find visibility for all pipes at startup
	
	var pipe2 = document.getElementById("headerPipe2").style.visibility;
	var pipe3 = document.getElementById("headerPipe3").style.visibility;
	var pipe4 = document.getElementById("headerPipe4").style.visibility;
	var pipe5 = document.getElementById("headerPipe5").style.visibility;
	var pipe6 = document.getElementById("headerPipe6").style.visibility;
	var pipe7 = document.getElementById("headerPipe7").style.visibility;
	var pipe8 = document.getElementById("headerPipe8").style.visibility;
	
	
	if(pipe2=="hidden") 				   {whoIsDefault = 1;}
	if(pipe2=="hidden" && pipe3=="hidden") {whoIsDefault = 2;}
	if(pipe3=="hidden" && pipe4=="hidden") {whoIsDefault = 3;}
	if(pipe4=="hidden" && pipe5=="hidden") {whoIsDefault = 4;}
	if(pipe5=="hidden" && pipe6=="hidden") {whoIsDefault = 5;}
	if(pipe6=="hidden" && pipe7=="hidden") {whoIsDefault = 6;}
	if(pipe7=="hidden" && pipe8=="hidden") {whoIsDefault = 7;}
	if(pipe8=="hidden") 				   {whoIsDefault = 8;}
	
	try {
		var whichPipe = document.getElementById("headerPipeDefaultDiv").innerHTML;
		if(whichPipe==1) {
			whoIsDefault = 1;
		} else if(whichPipe==2) {
			whoIsDefault = 2;
		} else if(whichPipe==3) {
			whoIsDefault = 3;
		} else if(whichPipe==4) {
			whoIsDefault = 4;
		} else if(whichPipe==5) {
			whoIsDefault = 5;
		} else if(whichPipe==6) {
			whoIsDefault = 6;
		} else if(whichPipe==7) {
			whoIsDefault = 7;
		} else if(whichPipe==8) {
			whoIsDefault = 8;
		} else {
	
		}
	}
	catch(err) {
	}
	
	
  }
  
  
  this.stopClock = function() {
    if (this.timerRunning) {
      clearTimeout(this.timerID);
      this.timerRunning = false;
    }
  }
  
  this.activateMenuItem = function(name) {
	if(baseCase == 0)
	{
		this.findDefault();
		baseCase = 1;
	}

    this.stopClock();
    this.hideSubmenu(this.activeMenuItem);
    this.activeMenuItem = name;
    this.showSubmenu(this.activeMenuItem);
    this.broadcastMessage("menuActivate", this.activeMenuItem);
	if(name == 'hbBMI1') {
		document.getElementById('headerPipe2').style.visibility="hidden";
	}
	if(name == 'hbBMI2') {
		document.getElementById('headerPipe2').style.visibility="hidden";
		document.getElementById('headerPipe3').style.visibility="hidden";
	}
	else if(name == 'hbBMI3') {
		document.getElementById('headerPipe3').style.visibility="hidden";
		document.getElementById('headerPipe4').style.visibility="hidden";
	}
	else if(name == 'hbBMI4') {
		document.getElementById('headerPipe4').style.visibility="hidden";
		document.getElementById('headerPipe5').style.visibility="hidden";
	}
	else if(name == 'hbBMI5') {
		document.getElementById('headerPipe5').style.visibility="hidden";
		document.getElementById('headerPipe6').style.visibility="hidden";
	}
	else if(name == 'hbBMI6') {
		document.getElementById('headerPipe6').style.visibility="hidden";
		document.getElementById('headerPipe7').style.visibility="hidden";
	}
	else if(name == 'hbBMI7') {
		document.getElementById('headerPipe7').style.visibility="hidden";
		document.getElementById('headerPipe8').style.visibility="hidden";
	}
	else if(name == 'hbBMI8') {
		document.getElementById('headerPipe8').style.visibility="hidden";
	}
  }
  
  
  
 
  
  
  this.deactivateMenuItem = function() { this.startClock();}
  
  this.finishDeactivateMenuItem = function() {
	hbBSMICloseAll();
	if(whoIsDefault == 0) {
		document.getElementById('headerPipe2').style.visibility="visible";
		document.getElementById('headerPipe3').style.visibility="visible";
		document.getElementById('headerPipe4').style.visibility="visible";
		document.getElementById('headerPipe5').style.visibility="visible";
		document.getElementById('headerPipe6').style.visibility="visible";
		document.getElementById('headerPipe7').style.visibility="visible";
		document.getElementById('headerPipe8').style.visibility="visible";
	}else if(whoIsDefault == 1) {
		document.getElementById('headerPipe2').style.visibility="hidden";
		document.getElementById('headerPipe3').style.visibility="visible";
		document.getElementById('headerPipe4').style.visibility="visible";
		document.getElementById('headerPipe5').style.visibility="visible";
		document.getElementById('headerPipe6').style.visibility="visible";
		document.getElementById('headerPipe7').style.visibility="visible";
		document.getElementById('headerPipe8').style.visibility="visible";
	}else if(whoIsDefault == 2) {
		document.getElementById('headerPipe2').style.visibility="hidden";
		document.getElementById('headerPipe3').style.visibility="hidden";
		document.getElementById('headerPipe4').style.visibility="visible";
		document.getElementById('headerPipe5').style.visibility="visible";
		document.getElementById('headerPipe6').style.visibility="visible";
		document.getElementById('headerPipe7').style.visibility="visible";
		document.getElementById('headerPipe8').style.visibility="visible";
	}else if(whoIsDefault == 3) {
		document.getElementById('headerPipe2').style.visibility="visible";
		document.getElementById('headerPipe3').style.visibility="hidden";
		document.getElementById('headerPipe4').style.visibility="hidden";
		document.getElementById('headerPipe5').style.visibility="visible";
		document.getElementById('headerPipe6').style.visibility="visible";
		document.getElementById('headerPipe7').style.visibility="visible";
		document.getElementById('headerPipe8').style.visibility="visible";
	}else if(whoIsDefault == 4) {
		document.getElementById('headerPipe2').style.visibility="visible";
		document.getElementById('headerPipe3').style.visibility="visible";
		document.getElementById('headerPipe4').style.visibility="hidden";
		document.getElementById('headerPipe5').style.visibility="hidden";
		document.getElementById('headerPipe6').style.visibility="visible";
		document.getElementById('headerPipe7').style.visibility="visible";
		document.getElementById('headerPipe8').style.visibility="visible";
	}else if(whoIsDefault == 5) {
		document.getElementById('headerPipe2').style.visibility="visible";
		document.getElementById('headerPipe3').style.visibility="visible";
		document.getElementById('headerPipe4').style.visibility="visible";
		document.getElementById('headerPipe5').style.visibility="hidden";
		document.getElementById('headerPipe6').style.visibility="hidden";
		document.getElementById('headerPipe7').style.visibility="visible";
		document.getElementById('headerPipe8').style.visibility="visible";
	}else if(whoIsDefault == 6) {
		document.getElementById('headerPipe2').style.visibility="visible";
		document.getElementById('headerPipe3').style.visibility="visible";
		document.getElementById('headerPipe4').style.visibility="visible";
		document.getElementById('headerPipe5').style.visibility="visible";
		document.getElementById('headerPipe6').style.visibility="hidden";
		document.getElementById('headerPipe7').style.visibility="hidden";
		document.getElementById('headerPipe8').style.visibility="visible";
	}else if(whoIsDefault == 7) {
		document.getElementById('headerPipe2').style.visibility="visible";
		document.getElementById('headerPipe3').style.visibility="visible";
		document.getElementById('headerPipe4').style.visibility="visible";
		document.getElementById('headerPipe5').style.visibility="visible";
		document.getElementById('headerPipe6').style.visibility="visible";
		document.getElementById('headerPipe7').style.visibility="hidden";
		document.getElementById('headerPipe8').style.visibility="hidden";
	}else if(whoIsDefault == 8) {
		document.getElementById('headerPipe2').style.visibility="visible";
		document.getElementById('headerPipe3').style.visibility="visible";
		document.getElementById('headerPipe4').style.visibility="visible";
		document.getElementById('headerPipe5').style.visibility="visible";
		document.getElementById('headerPipe6').style.visibility="visible";
		document.getElementById('headerPipe7').style.visibility="visible";
		document.getElementById('headerPipe8').style.visibility="hidden";
	}
	
  }
  
  
   if (!isNS6) {
  this.mouseOver = function(name) {this.overTimerID = setTimeout(this.instanceName + ".activateMenuItem('"+name+"')", 50);this.overTimerRunning = true;};
  }else{
  this.mouseOver = function(name) {this.overTimerID = setTimeout(this.instanceName + ".activateMenuItem('"+name+"')", 50);this.overTimerRunning = true;};
  }
  this.mouseOut = function(name) {  this.deactivateMenuItem(); }
  
  this.addMenuItem = function(name, theMenu, theSubmenu) {
  	if (theMenu != null && theSubmenu != null) {
	    this.menuitems[name] = { menu:theMenu, submenu:theSubmenu };
		
		EventBroadcaster.initialize(theMenu);
		eval("theMenu.onmouseover = function() { this.broadcastMessage('mouseOver', '" + name + "'); }");
		eval("theMenu.onmouseout = function() { this.broadcastMessage('mouseOut', '" + name + "'); }");
		theMenu.addListener(this);
		
		EventBroadcaster.initialize(theSubmenu);
		eval("theSubmenu.onmouseover = function() { this.broadcastMessage('mouseOver', '" + name + "'); }");
		eval("theSubmenu.onmouseout = function() { this.broadcastMessage('mouseOut', '" + name + "'); }");
		theSubmenu.addListener(this);
	}
	if (theMenu == null) {
		throw new WxException(name,"invalidMenuObjectException");
	}
	if (theSubmenu == null) {
		throw new WxException(name,"invalidSubmenuObjectException");
	}
  }
  
  EventBroadcaster.initialize(this);
}