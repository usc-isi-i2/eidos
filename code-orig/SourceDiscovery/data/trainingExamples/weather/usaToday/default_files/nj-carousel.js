function njCarousel(){
  this.load = function(){
    var str="njCarouselFrame";
    var ary=document.getElementByClass('njCarouselFrame','div');
    var uid=tmp='';
    var new_dot_ssts=new_icn_path=new_sbx_html=new_url_link='';
    var carousel_dot=carousel_icn=carousel_sbx=carousel_url='';

    if(ary.length==5){
      for(var i=1; i<ary.length; i++){
        uid=ary[i].replace(str,'');
        new_dot_ssts=document.getElementById("njCarouselDot"+uid);   // <span> section </span>
        new_icn_path=document.getElementById("njCarouselIcn"+uid);   // <span> path    </span>
        // new_sbx_html=document.getElementById("njCarouselSbx"+uid);// <span> html    </span>
        new_url_link=document.getElementById("njCarouselUrl"+uid);   // <span> url     </span>
        carousel_dot=document.getElementById("njCarouselDot"+i);     // <div> <img src="clear.gif"> </div>
        carousel_icn=document.getElementById("njCarouselIcn"+i);     // <img src="clear.gif">
        carousel_sbx=document.getElementById("njCarouselSbx"+i);     // <div id="njCarouselSbx#"></div>
        carousel_url=document.getElementById("njCarouselUrl"+i);     // <a href>

        // SET THE CARUSEL ICON'S SSTS
        carousel_icn.alt=new_dot_ssts.innerHTML;

        // SET THE CAROUSEL ICON'S PATH 
        tmp=((new_icn_path.innerHTML.substring(0,1)=="/")?("http://images.usatoday.com"):(''));
        carousel_icn.src=tmp+new_icn_path.innerHTML;

        // SET THE CAROUSEL ICONS HYPERLINK
        tmp=new_url_link.innerHTML;
        carousel_url.href=new_url_link.innerHTML;

        // SET THE CAROUSEL DOT'S SSTS AND HYPERLINK
        tmp='<div id="njCarouselDot'+new_dot_ssts.innerHTML+'" class="dot">'+
            '<img onmouseover="document.njCarousel.swap('+i+')" '+
            ' onclick=document.njCarousel.redirect("'+new_url_link.innerHTML+'")'+
            ' src="http://images.usatoday.com/_common/_images/clear.gif" width="10" height="10" border="0"/></div>';
        carousel_dot.innerHTML=tmp;

        // SET THE CAROUSEL SBOX'S CONTENT AND DELETE THE HIDDEN ONE
        // carousel_sbx.innerHTML=new_sbx_html.innerHTML;
        // new_sbx_html.innerHTML='';
      };
      this.swap(1);
    };
  };

  this.redirect = function (){ if(arguments[0]){ window.location=arguments[0]; }; };

  this.swap = function (){
    for(var z=y=x=1; x<=4; x++){
      document.getElementById('njCarouselBdr'+x+'').className='white';
      document.getElementById('njCarouselIcn'+x+'').className='gray';
      document.getElementById('njCarouselSbx'+x+'').style.display="none";
    };
    x='njCarouselIcn'+arguments[0]+'';
    y='njCarouselSbx'+arguments[0]+'';
    z='njCarouselBdr'+arguments[0]+'';
    document.getElementById(z).className=document.getElementById(x).alt;
    document.getElementById(x).className='white';
    document.getElementById(y).style.display="block";
    if(typeof(uoTrack)=='function') uoTrack('carousel photo'+arguments[0]);
  };


  this.caption = function (){
    var d=document.getElementById('photo-cutline-div-'+arguments[0]);
    var l=document.getElementById('photo-cutline-lnk-'+arguments[0]);

    if(l.className.indexOf('off')>0){
       l.className='photo-cutline-on';
       d.style.visibility='visible';
       //document.getElementById('docbody').style.backgroundColor='#aaaaaa';
       //if(navigator.userAgent.indexOf('Safari')>-1) l.style.backgroundImage="url(http://images.usatoday.com/test/carousel/images/caption1.jpg)";
    }
    else{
       l.className='photo-cutline-off';
       d.style.visibility='hidden';
       //document.getElementById('docbody').style.backgroundColor='#444444';
       //if(navigator.userAgent.indexOf('Safari')>-1) l.style.backgroundImage="url(http://images.usatoday.com/test/carousel/images/caption0.jpg)";
    };
  };
};

document.getElementByClass = function(){
  var c=arguments[0];
  var a=this.getElementsByTagName(arguments[1]);
  var o=['Data Array'];
  for(i=0; i<a.length; i++) 
    if(a[i].className==c && a[i].id)
      o[o.length]=a[i].id;
  return(o);
};

document.njCarousel=new njCarousel();
