if( IsLogged ){ 
	if( IsLogged != -1 ){
		SayHello();
		document.write('! <a href="http://www.overstock.com/cgi-bin/d2.cgi?page=LOGOFF">Sign Out</a>');
	}
} else { 
        document.write('For best offers, <a href="https://www.overstock.com/cgi-bin/d2.cgi?PAGE=MYACCOUNT">sign in</a> or <a href="https://www.overstock.com/cgi-bin/d2.cgi?PAGE=MYACCOUNT">register now</a>!');

} 