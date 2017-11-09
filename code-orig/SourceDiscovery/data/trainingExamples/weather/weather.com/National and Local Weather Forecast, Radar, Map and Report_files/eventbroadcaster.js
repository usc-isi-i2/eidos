EventBroadcaster = new Object();

EventBroadcaster.initialize = function(obj){
	obj._listeners = new Array();
	obj.broadcastMessage = this._broadcastMessage;
	obj.addListener = this._addListener;
	obj.removeListener = this._removeListener;
}

EventBroadcaster._broadcastMessage = function(){
	var args = [];
	for(var i=0;i<arguments.length;i++) args[i]=arguments[i];
	var eventName = args.shift();
	var list = this._listeners;
	var max = list.length;
	for(var i=0;i<max;++i){
		list[i][eventName].apply(list[i],args)
	}
}

EventBroadcaster._addListener = function(obj){
	this.removeListener(obj);
	this._listeners.push(obj);
	return true;
}

EventBroadcaster._removeListener = function(obj){
	var list = this._listeners;
	var i = list.length;
	while(i--){
		if(list[i]==obj){
			list.splice(i,1);
			return true;
		}
	}
	return false;
}