function searchSubmit() { 
  var taxonomy = document.getElementById("taxonomy").value; 
  var keys = escape(document.getElementById("keyword").value); 
  if (taxonomy == "dep10") { 
    window.location="http://www.overstock.com/search?keywords=" + keys + "&taxonomy="  + taxonomy  + "&SearchType=HP_Header" + "&searchMode=music"; 
  } 
  else if (taxonomy == "dep11") { 
    window.location="http://www.overstock.com/search?keywords=" + keys + "&taxonomy="  + taxonomy  + "&SearchType=HP_Header" + "&searchMode=movies"; 
  } 
  else if (taxonomy == "dep9") { 
    window.location="http://www.overstock.com/search?keywords=" + keys  + "&taxonomy="  + taxonomy  + "&SearchType=HP_Header" + "&searchMode=books"; 
  } 
  else if (taxonomy == "dep12") { 
    window.location="http://www.overstock.com/search?keywords=" + keys  + "&taxonomy="  + taxonomy  + "&SearchType=HP_Header" + "&searchMode=games"; 
  } 
   else { 
    window.location="http://www.overstock.com/search?keywords=" + keys  + "&taxonomy="  + taxonomy  + "&SearchType=HP_Header"; 
  } 
}; 

function whichButton(event){if (event.keyCode=="13") { searchSubmit();}}