var zipsearch = false;//this is for checking if local rearch was already clicked 
function MyLocation(){
 document.getElementById("whatwherezip").className = 'whatwhereZipClass';
	if(!zipsearch){
	 document.whatwhere.where.value = '';
	 zipsearch = true;
  	} 
}

function MyLocationClose(dn){
	document.getElementById(dn+"zip").className = 'whatwhereZipClassHidden';
}


//Recent Search Example
//USGA0028:1:Atlanta, GA^12345:4:Schenectady,NY(12345)

//MyPrefs Example
//12345^4^Schenectady,+NY+(12345)^|*|*|*
var getMyPrefs = GetCookie("MyPrefs");
var getRecentLocations = getUserPreferences("27");

//Remove invalid elements, if you have an invalid zip, you will have element like 12000:*:*
var splitUpSearches = getRecentLocations.split("^");
for (var i=0;i<splitUpSearches.length;i++){
	var search = splitUpSearches[i].split(":");
	if (search[1]=="*" && search[2]=="*")
	{
		//remove that element so we can update the userpreferences cookie finally
		splitUpSearches.splice(i,1);			
	}
				
}
if (splitUpSearches.length>0){
	splitUpSearches=splitUpSearches.join("^");
	setUserPreferences('27',splitUpSearches);
}else{
	setUserPreferences('27','');
}
getRecentLocations = getUserPreferences("27");

var getMyCityFromPrefs = "";
var getMyWatchListFromPrefs = "";
var watchListName = "";
var myWatchlist ="";
var myCity="";
var hasMyCity = false;
var hasMyWatchlist = false;
var hasRecentSearches = false;


if(getRecentLocations.length > 1){
hasRecentSearches = true;
var splitUpRecent = getRecentLocations.split("^");
}

if(getMyPrefs.length > 1){
hasMyCity =  true;
getMyCityFromPrefs = getMyPrefs.split("|").splice(0,1);
myCity = unEscJava(getMyCityFromPrefs[0]);
getMyWatchListFromPrefs = getMyPrefs.split("|").splice(3,4);
myWatchlist = unEscJava(getMyWatchListFromPrefs[0]);
}



//Watchlist Example
//12345:USFL0481:*:*:*:testing+this+thing:busch+gardens:*:*:*:Schenectady,+NY(12345):Tampa,+FL:*:*:*
if(myWatchlist != '' && myWatchlist != '*'){
	watchListCk = myWatchlist.split(":");
	hasMyWatchlist = true;		
}


function remove_recent_items(rsv,mcv,mwv){
//rsv = Recent Search Value; mcv = My City Value; mwv = My Watchlist Value
counter = 10;
	if(hasMyCity){
	//Begin mycity information	
	var myCityItem = mcv.split("^");
	var myCityId = myCityItem[0];	
	var myCityPresName = myCityItem[2];	
	 if (myCityPresName.indexOf(":")!=-1){
	 	hasMyCity=false;
	 	hasMyWatchlist=false;
	 	
	 }
	}


	if(hasRecentSearches && hasMyCity && !hasMyWatchlist){ 
		//This is the recent search check
		
		for (var i=0;i<rsv.length;i++){
				 var rsItem = rsv[i].split(":");
				 var rsId = rsItem[0];
				 if(rsId == myCityId){
				 rsv.splice(i,1);
				 }
			}
			if(rsv.length >= 5){
			//remove the last one
			rsv.splice(5,1);
			}
	}
	
	if(hasRecentSearches && hasMyWatchlist){
	var mwItem = mwv.split(":");
	wListCounter = 0;
	tempValue = "";
	//This is the watchlist check
	 for (var m=0;m<5;m++){
	  if(mwItem[m] != '*'){
		 watchListPresName = mwItem[m+counter];
		  if(typeof(watchListPresName)!='undefined' && watchListPresName != '*'){wListCounter++;}
		 }
	}//end watchlist loop
	
	//This is the recent search check
	
	for (var j=0;j<rsv.length;j++){
	var rsItem = rsv[j].split(":");
	//compare rsv with mycity
	 var rsId = rsItem[0];
	  	 if(rsId == myCityId){
		    rsv.splice(j,1);
		 }
	 }
	 
	//compare watchlist  with rsv
	for (var j=0;j<rsv.length;j++){
	var rsItem = rsv[j].split(":");	
	var rsPresName = rsItem[2];
		for (var k=0;k<5;k++){
			if(mwItem[k] != '*'){
				watchListPresName = mwItem[k+counter];
				
				if((typeof(watchListPresName)!='undefined' && watchListPresName.replace("--",",") == rsPresName) || 
				(typeof(mwItem[k])!='undefined' && mwItem[k] == rsItem[0])){ //city check is for international
					rsv.splice(j,1); 
				}				
			}
		tempValue = watchListPresName;
		}//end watchlist loop
	}//end recent search loop
	
	
	
		//Let's check the sizes on both objects to ensure it will display correctly
	//	if(rsv.length >= 5 && wListCounter == 1){
	//	rsv.splice(4,2);
	//	}else if(rsv.length >= 5 && wListCounter == 2){
	//	rsv.splice(3,3);
		//}else if(rsv.length >= 5 && wListCounter == 3){
		//rsv.splice(2,4);
		//}else if(rsv.length >= 5 && wListCounter == 4){
		//rsv.splice(1,5);
		//}else if(rsv.length >= 5 && wListCounter == 5){
		//rsv.splice(0,6);
		//}
	
	}//ending the if
}//ends remove_items function

remove_recent_items(splitUpRecent,myCity,myWatchlist);
//alert(hasRecentSearches + "," + hasMyCity + ","  + hasMyWatchlist);
if(hasRecentSearches && !hasMyCity && !hasMyWatchlist){

//This user only has Recent Searches....
document.write('<DIV class="recentSearches" id="recentSearches">Recent Searches<SPAN style="padding: 0px 0px 0px 20px;"><IMG src="http://image.weather.com/web/common/icons/sm_close_box.gif" border="0" onMouseDown="MyLocationClose(\'whatwhere\')"></SPAN></DIV>');
document.write('<TABLE border="0" cellpadding="0" cellspacing="0"><TR><TD>');
	for (var i=0;i<splitUpRecent.length;i++){
	var splitEachSearch = splitUpRecent[i].split(":");
	document.write('<a href ="http://www.weather.com/weather/local/'+splitEachSearch[0]+'?from=recentsearch" class="linkVerdanaText10">');
	var presentationName = splitEachSearch[2];
	if(presentationName.length > 23) {
	        presentationName = presentationName.substring(0,20);
	        presentationName += "...";
	    }

	document.write(presentationName);
	document.write('</a>');
	//THIS <BR> only needs to be done on the last item
	document.write('<BR>');
	}
	document.write('</TD></TR></TABLE>');
}else if (hasRecentSearches && hasMyCity && !hasMyWatchlist){
//This user has Recent Searches and My City....
if (splitUpRecent.length > 0){
document.write('<DIV class="recentSearches" id="recentSearches">Recent Searches<SPAN style="padding: 0px 0px 0px 20px;"><IMG src="http://image.weather.com/web/common/icons/sm_close_box.gif" border="0" onMouseDown="MyLocationClose(\'whatwhere\')"></SPAN></DIV>');
document.write('<TABLE border="0" cellpadding="0" cellspacing="0"><TR><TD>');
	for (var i=0;i<splitUpRecent.length ;i++){
	var splitEachSearch = splitUpRecent[i].split(":");
	var presentationName = splitEachSearch[2];
	
	document.write('<a href ="http://www.weather.com/weather/local/'+splitEachSearch[0]+'?from=recentsearch" class="linkVerdanaText10">');
	if(presentationName.length > 23) {
	        presentationName = presentationName.substring(0,20);
	        presentationName += "...";
	}

	document.write(presentationName);
	document.write('</a>');
	//THIS <BR> only needs to be done on the last item
	document.write('<BR>');
	
	}
	document.write('</TD></TR></TABLE>');
	}
	//Begin mycity information
	var splitCityInfo = myCity.split("^");
	document.write('<DIV class="myFavorites">My Favorites</DIV>');
	document.write('<TABLE border="0" cellpadding="0" cellspacing="0"><TR><TD>');
	document.write('<a href ="http://www.weather.com/weather/local/'+splitCityInfo[0]+'?from=recentsearch" class="linkVerdanaText10">');
	var presentationName = splitCityInfo[2].replace("--",",");
	if(presentationName.length > 23) {
	        presentationName = presentationName.substring(0,20);
	        presentationName += "...";
	    }
	document.write(presentationName);
	document.write('</a>');
	document.write('</TD></TR></TABLE>');
	
}else if (!hasRecentSearches && hasMyCity && hasMyWatchlist){
//This user has My City and My Watchlist....
	var splitCityInfo = myCity.split("^");
		
	//Begin mycity information
	document.write('<DIV class="myFavorites">My Favorites<SPAN style="padding: 0px 0px 0px 43px;"><IMG src="http://image.weather.com/web/common/icons/sm_close_box.gif" border="0" onMouseDown="MyLocationClose(\'whatwhere\')"></SPAN></DIV>');
	document.write('<TABLE border="0" cellpadding="0" cellspacing="0"><TR><TD>');
	document.write('<a href ="http://www.weather.com/weather/local/'+splitCityInfo[0]+'?from=recentsearch" class="linkVerdanaText10">');
	var presentationName = splitCityInfo[2].replace("--",",");

	if(presentationName.length > 23) {
	        presentationName = presentationName.substring(0,20);
	        presentationName += "...";
	    }
	document.write(presentationName);
	document.write('</a>');
	
	//Begin the watchlist information
	var splitWatchlistInfo = myWatchlist.split(":");
	counter = 10;
	for (var i=0;i<5;i++){
		if(splitWatchlistInfo[i] != splitCityInfo[0] && splitWatchlistInfo[i] != '*' && typeof(splitWatchlistInfo[i])!='undefined' &&  typeof(splitWatchlistInfo[i+counter])!='undefined'){
		document.write('<BR><a href ="http://www.weather.com/weather/local/'+splitWatchlistInfo[i]+'?from=recentsearch" class="linkVerdanaText10">');
		watchListName = splitWatchlistInfo[i+counter].replace("--",",");
		if(watchListName != '' && watchListName.length > 23) {
	        watchListName = watchListName.substring(0,20);
	        watchListName += "...";
	    }
	document.write(watchListName);
	document.write('</a>');
		}
	}
	
	document.write('</TD></TR></TABLE>');
	
	
}else if(hasRecentSearches && hasMyCity && hasMyWatchlist){
//This user has Recent Searches, My City and My Watchlist...
var splitCityInfo = myCity.split("^");
	var watchList=myWatchlist.split(":");
		var myCounter=0;
		for (var i=0;i<5;i++){
			if(watchList[i] != '*' && watchList[i]!='' && typeof(watchList[i])!='undefined' && watchList[i]!=splitCityInfo[0]){
			 myCounter ++;	
			}
		}
		//add 1 to myCounter for mycity
		myCounter ++;
	
	
	if(splitUpRecent.length > 0 && myCounter < 6){
	document.write('<DIV class="recentSearches" id="recentSearches">Recent Searches<SPAN style="padding: 0px 0px 0px 20px;"><IMG src="http://image.weather.com/web/common/icons/sm_close_box.gif" border="0" onMouseDown="MyLocationClose(\'whatwhere\')"></SPAN></DIV>');
	document.write('<TABLE border="0" cellpadding="0" cellspacing="0"><TR><TD>');
		var cntr = 6 - myCounter;
		
		for (var i=0;i< cntr && typeof(splitUpRecent[i])!='undefined';i++){
		var splitEachSearch = splitUpRecent[i].split(":");
		var presentationName = splitEachSearch[2].replace("--",",");
		document.write('<a href ="http://www.weather.com/weather/local/'+splitEachSearch[0]+'?from=recentsearch" class="linkVerdanaText10">');
		if(presentationName.length > 23) {
		        presentationName = presentationName.substring(0,20);
		        presentationName += "...";
		    }
	
		document.write(presentationName);
		document.write('</a>');
		//THIS <BR> only needs to be done on the last item
		document.write('<BR>');
		
		}
		
		document.write('</TD></TR></TABLE>');
	}
	//Begin mycity information
	if(splitUpRecent.length == 0){
	document.write('<DIV class="myFavorites">My Favorites<SPAN style="padding: 0px 0px 0px 43px;"><IMG src="http://image.weather.com/web/common/icons/sm_close_box.gif" border="0" onMouseDown="MyLocationClose(\'whatwhere\')"></SPAN></DIV>');
	}else{
	document.write('<DIV class="myFavorites">My Favorites</DIV>');
	}
	document.write('<TABLE border="0" cellpadding="0" cellspacing="0"><TR><TD>');
	document.write('<a href ="http://www.weather.com/weather/local/'+splitCityInfo[0]+'?from=recentsearch" class="linkVerdanaText10">');
	var presentationName = splitCityInfo[2].replace("--",",");
		
	if(presentationName.length > 23) {
	        presentationName = presentationName.substring(0,20);
	        presentationName += "...";
	    }
	document.write(presentationName);
	document.write('</a>');
	
	//Begin the watchlist information
	var splitWatchlistInfo = myWatchlist.split(":");
	counter = 10;
	for (var i=0;i<5;i++){
		if(splitWatchlistInfo[i] != splitCityInfo[0] && splitWatchlistInfo[i] != '*' && splitWatchlistInfo[i] !='' && typeof(splitWatchlistInfo[i])!='undefined' && typeof(splitWatchlistInfo[i+counter])!='undefined'){
		document.write('<BR><a href ="http://www.weather.com/weather/local/'+splitWatchlistInfo[i]+'?from=recentsearch" class="linkVerdanaText10">');
	watchListName = splitWatchlistInfo[i+counter].replace("--",",");
	if(typeof(watchListName)!='undefined' && watchListName != '' && watchListName.length > 23) {
	        watchListName = watchListName.substring(0,20);
	        watchListName += "...";
	    }
	document.write(watchListName);
	document.write('</a>');
		}
	}
	
	document.write('</TD></TR></TABLE>');
	
}else if(!hasRecentSearches && hasMyCity && !hasMyWatchlist){

//This user has only has My City.....
	var splitCityInfo = myCity.split("^");
	document.write('<DIV class="myFavorites">My Favorites<SPAN style="padding: 0px 0px 0px 43px;"><IMG src="http://image.weather.com/web/common/icons/sm_close_box.gif" border="0" onMouseDown="MyLocationClose(\'whatwhere\')"></SPAN></DIV>');
	document.write('<TABLE border="0" cellpadding="0" cellspacing="0"><TR><TD>');
	document.write('<a href ="http://www.weather.com/weather/local/'+splitCityInfo[0]+'?from=recentsearch" class="linkVerdanaText10">');
	var presentationName = splitCityInfo[2].replace("--",",");
	if(presentationName.length > 23) {
	        presentationName = presentationName.substring(0,20);
	        presentationName += "...";
	    }
	document.write(presentationName);
	document.write('</a>');
	document.write('</TD></TR></TABLE>');
}




