// JavaScript Document
function AddBookmark() {
		if (navigator.appName=="Netscape") {
			MyWindow = window.open ('','','menubar=no, location=no, toolbar=no, width=500, height=100');
			MyWindow.document.write (
   				'To bookmark this site, click '
 				 +'<b>Bookmarks | Add bookmark</b> '
 				 +'or press <b>Ctrl+D</b>.'
				 +'<br>'
				 +'<input type="button" value="Close Window" onclick="window.close();" />'
 				);
			MyWindow.focus();
			}	 			
		else {
			window.external.AddFavorite(location.href, "Overstock.com");
 			
			}
		}