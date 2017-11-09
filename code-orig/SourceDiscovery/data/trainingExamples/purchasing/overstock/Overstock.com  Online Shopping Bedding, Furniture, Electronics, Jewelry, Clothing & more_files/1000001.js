// COPYRIGHT 2000-2007 KEFTA, INC. ALL RIGHTS RESERVED.
function qzS(qzb,qzC){if(qzb){if(!qzC)qzC=document;
if(typeof(qzb)=='object')return qzb;else if(qzC.getElementById&&qzC.getElementById(qzb)){var qzz=qzC.getElementById(qzb),qztd=[];
if(qzz.id!=qzb){while(qzz&&qzz.id!=qzb){qztd.push([qzz,qzz.id]);
qzz.id='';
qzz=qzC.getElementById(qzb);}
for(var qzT=0;qzT<qztd.length;qzT++)qztd[qzT][0].id=qztd[qzT][1];}
return qzz;}else if(qzC.all)return qzC.all(qzb);else if(qzC.getElementsByName&&qzC.getElementsByName(qzb)&&qzC.getElementsByName(qzb).length)return qzC.getElementsByName(qzb)[0];}
return false;}
function qzCT(qzH,qzu){qzH=qzS(qzH);
if(qzH){qzu =(qzu==100)?99.999:qzu;
qzH.style.filter = "alpha(opacity:"+qzu+")";
qzH.style.KHTMLOpacity=qzu/100;
qzH.style.MozOpacity=qzu/100;
qzH.style.opacity=qzu/100;}}
function qzET(qzH,qzu,qzi,qzr){if(!qzi)qzi=8;
qzH=qzS(qzH);
if(qzH){if(qzu<=100){qzCT(qzH,qzu);
qzu+=qzi;
window.setTimeout(function(){qzET(qzH,qzu,qzi,qzr);},50);}else if(qzr){qzr();}}}
function qzZT(qzH,qzu,qzi,qzr){if(!qzi)qzi=5;
qzH=qzS(qzH);
if(qzH){if(qzu>=0){qzCT(qzH,qzu);
qzu-=qzi;
window.setTimeout(function(){qzZT(qzH,qzu,qzi,qzr);},50);}else if(qzr){qzr();}}}
function qzvd(qzH){var qzmT=0;
if(qzH.offsetParent){while(qzH.offsetParent){qzmT+=qzH.offsetTop;
qzH=qzH.offsetParent;}}
return qzmT;}
document.write('<div id="qzc"></div>');
var qzc=qzS('qzc');
var qz4={qzvT:'//kefta.overstock.com',qzeT:navigator.userAgent,qzPT:31536000000,qzk:'.overstock.com',qz5T:false,qzx:'OSTK.1.1000.client',qzld:'100',qzq:[],qz8T:'20070822',qzVd:'1911',qzb4:20000,qz4d:'2d1d2a698071dfe2278268381058f2d2',qzcd:!document.cookie.match(/KS=OSTK.1.1000.client/)&&1||0,qztT:0};
var qzY='//kefta.overstock.com';
function qzm(qzwd){;
qz4.qzq[qz4.qzq.push(new Image())-1].src=(qzY+'/ext_invoke/log?proc='+qz4.qzx+'&node='+qz4.qzld+'&hash='+qz4.qz4d+'&msg='+escape(qzwd));}
kx_sl=qzm;
function qzoT(qzdT){var qzO=document.createElement('style');
qzO.setAttribute("type", "text/css");
if(qzO.styleSheet)qzO.styleSheet.cssText=qzdT;else qzO.appendChild(document.createTextNode(qzdT));
qzc.appendChild(qzO);}
function qzg(qzH,qzZd){qzH=qzS(qzH);
if(qzH)for(qzsd in qzZd)qzH.style[qzsd]=qzZd[qzsd];return qzZd;}
function qzod(qzTT,qzH){if(!qzH)qzH=document;
if(qzH.getElementsByTagName)return qzH.getElementsByTagName(qzTT);else if(qzH.all&&qzH.all.tags)return qzH.all.tags(qzTT);}
function qzwT(qzH,qz3,qz0){if(typeof qz3!='object')qz3=Array(qz3);
for(qzv in qz3){if(document.addEventListener){qzH.addEventListener(qz3[qzv],qz0, false);}else if(document.attachEvent){qzH.attachEvent('on'+qz3[qzv],qz0);}else{return false;}}
return true;}
function qzS4(qzH,qz3,qz0){if(typeof qz3!='object')qz3=Array(qz3);
for(qzv in qz3){if(document.addEventListener){qzH.removeEventListener(qz3[qzv],qz0, false);}else if(document.attachEvent){qzH.detachEvent('on'+qz3[qzv],qz0);}}}
function qzbd(qzH){var qziT=0;
if(qzH.offsetParent){while(qzH.offsetParent){qziT+=qzH.offsetLeft;
qzH=qzH.offsetParent;}}
return qziT;}
function kx_bb(qzwd){var qzJ=document.createElement('div'),qzF=document.createElement('div'),qz0d=14;
qzJ.id='qzJ';
qzF.id='qzF';
qzg(qzF,qzg(qzJ,{visibility:'hidden'}));
qzc.appendChild(qzJ);
qzc.appendChild(qzF);
if(qz4T()){qzoT('#qzJ a{text-decoration:none}#qzJ a:hover{text-decoration:underline}');
qzJ.innerHTML=qzwd.replace(/XX/,qz0d);
while(((qzJ.offsetHeight+1>parseInt(qzF.style.height))||(qzJ.offsetWidth>parseInt(qzF.style.width)))&&qz0d>10){qz0d-=1;
qzJ.innerHTML=qzwd.replace(/XX/,qz0d);}
qzg(qzJ,{whiteSpace:''});
qzwT(window,'resize',qz4T);
qzg(qzF,{visibility:'visible'});
qzET(qzF,0,10,function(){qzg(qzJ.qzPd,{visibility:'hidden'});
qzg(qzJ,{visibility:'visible'});
qzZT(qzF,100,10,function(){qzg(qzF,{display:'none'});})});}else{qzm("kx_bb: Can't find required resources.");}}
function qz4T(){var qzJ=qzS('qzJ'),qzF=qzS('qzF'),qzHT=qzS('bar1Logo'),qzXT=qzHT&&qzod('div',qzHT),qzKd,qz7,qzj,qzO,qzPd;
if(qzXT) for(qzDT=0;(qzQ=qzXT[qzDT]);qzDT++){if(qzQ.className=='tools')qzKd=qzQ;else if(qzQ.className=='logo')qz7=qzQ;else if(qzQ.className=='middle')qzPd=qzQ;}
if(qzJ&&qzF&&qzKd&&qz7&&qzPd){qzJ.qzPd=qzPd;
qzj=qzbd(qz7)+qz7.offsetWidth;
qzO={background:'#fff',position:'absolute',top:qzvd(qz7),left:qzj,width:qzbd(qzKd)-qzj,fontWeight:'bold',textAlign:'center'};
qzg(qzJ,qzg(qzF,qzO));
qzF.style.height=qz7.offsetHeight+(qz4.qzeT.match(/Gecko/)&&1||0);}else{return false;}
return true;}
function qzBT(){var qz3d=0;
if(document.body){if(document.body.clientWidth){qz3d = document.body.clientWidth;}else if(document.body.offsetWidth){qz3d = document.body.offsetWidth;}}else{qz3d = screen.width;}
return(qz3d);}
function qzKT(qzA,qz0){var qzTd=qz4.qzq.push(new Image());
if(qz0)qzTd.onload=qzTd.onerror=qzTd.onabort=qz0;
qzTd.src=qzA;return(qzTd);}
function qzlT(qzH,qzHd,qzi,qzr,qzmd){if(!qzHd)qzHd=qzH.offsetHeight;
if(!qzi)qzi=10;
if(!qzmd)qzmd=120;
qzH=qzS(qzH);
if(qzH){qzH.style.overflow='hidden';
if(qzH.offsetHeight+qzi>=qzHd){qzH.style.height=qzHd;
if(qzr)qzr();}else{qzH.style.height=qzH.offsetHeight+qzi+'px';
window.setTimeout(function(){qzlT(qzH,qzHd,qzi,qzr,qzmd);},qzmd);}}}
function qz84(qz8){if(qz8.qz2d&&!qz8.kyt_did_omniture_call){qzKT("//overstock.com.112.2o7.net/b/ss/overstock.com/1/H.7-pdv-2/s32421478925548?pageName=Kefta%20cart%20layer&v25="+qz8.qz2d);
qz8.qzg4=1;}}
function qzuT(){var qz8=qzS('qzxd');
qzg(qz8.qzt,qzg(qz8,{display:'none'}));}
function qzGT(){var qz8=qzS('qzxd'),qzs=false,qzO;
if(qz8.qzo&&qz8){qzO={top:qzvd(qz8.qzo)+qz8.qzo.offsetHeight,right:qzBT()-
(qzbd(qz8.qz2)+qz8.qz2.offsetWidth)};
qzg(qz8.qzt,qzg(qz8,qzO));
qzs=true;}else if(!qz8){}
return qzs;}
function qzud(){var qz8=qzS('qzxd'),qz9d,qzqT;
if(qz8&&qz8.qz2T&&qz8.style.display!='block'&&qzGT()){qz84(qz8);
qzwT(window,'resize',qzGT);
qzg(qz8,{display:'block'});
qz9d=qz8.offsetHeight;
qzg(qz8,{overflow:'hidden',height:'1px'});
qzlT(qz8,qz9d,10,function(){qz8.qzt.style.display='block';},5);
if(qz8.qz_T)qz8.qz_T.style.display='';}}
function kx_oc(qzw){var qzA=qzw.url||'/cgi-bin/d2.cgi?SEC_IID=22701&PAGE=CART',qzed='//www.overstock.com/img/mxc/',qzMT='<table cellpadding="2" cellspacing="0"><tr style="background-color:#96171a;"><td style="font-weight:bold;color:#fff">You left these <br>great items in your cart:</td><td align="right"><a href="javascript:qzuT();"><img width="21" height="21" border="0" alt="Close" src="'+qzed+'20070319_x6RP.gif"></a></td>',qz8=document.createElement('div'),qzt=document.createElement('iframe'),qzCd=qzS('checkOutCartIcon'),qz2=qzS('checkoutButton'),qzOd=qzS('checkoutLink'),qzL=qzS('verisignBottom'),qzo=qzS('bar4Search'),qz0T=qzod('td'),qzp=document.createElement('span'),qzM=[''];
qz8.id='qzxd';
qzg(qzt,qzg(qz8,{border:'2px solid #96171a',width:'255px',zIndex:10,position:'absolute',display:'none',background:'#fbfaf6'}));
qzc.appendChild(qz8);
qzt.src=qzY+'/hosted/common/images/spacer.gif';
qz8.qzt=qz8.appendChild(qzt);
qz8.qzt.style.zIndex=9;
for(qzT in qzw.items)qzM.push('<td>'+qzw.items[qzT][0]+'</td><td align="right">$'+qzw.items[qzT][1]+' </td>');
if(qzw.moreitems)qzM.push('<td colspan="2" style="font-size:10px;text-align:center;height:19px">(You have additional items in your cart)</td>');
if(qzw.subtotal)qzM.push('<td style="background-image:url('+qzed+'20070319_disc2RP.gif);background-repeat:repeat-x;background-position:center center;height:14px;" colspan="2"></td></tr><tr><td colspan="2" style="text-align:right;padding-bottom:5px">Subtotal = &nbsp;$'+qzw.subtotal+'</td>');
if(qzw.msg)qzM.push('<td colspan="2" style="font-size:10px;color:#000;background-color:#E3E0DB;padding:5px;text-align:center">'+qzw.msg+'</td>');
qzM.push('<td align="center" style="padding-left: 5px;" colspan="2"><a href="'+qzA+'"><img height="29" width="167" border="0" src="'+qzed+'20070319_checkoutRP.gif" /></a></td></tr><tr><td align="center" style="padding-left: 5px;" colspan="2"><a href="#" onclick="qzuT();">Close</a></td>');
qz8.innerHTML=qzMT+qzM.join('</tr><tr>')+'</table>';
qz8.qz2d=qzw.omniture_code;
qz8.qzo=qzo;
if(qzOd&&qz8.qzo){if(qzCd){qzCd.style.cursor='hand';
qzCd.onclick=qzud;}else{qzm('kx_oc: Could not find checkOutCartIcon');}
if(qz2){qz2.onmouseover=qzud;
qz8.qz2=qz2;}else{qzm('kx_oc: Could not find checkoutButton');}
if(qzOd)qzOd.onmouseover=qzud;
if(qzw.disclaimer){qzp.innerHTML=qzw.disclaimer;
qz8.qz_T=qzp;
qzg(qzp,{display:'none',width:700,paddingTop:10});
if(qz4.qzld!=920){if(qzL){qzL.parentNode.insertBefore(qzp,qzL.nextSibling);}else{qzm('kx_oc: Could not find verisignBottom.');}}else{for(var qzT=0,qzrd,qz0T=qzod('td');
(qzrd=qz0T[qzT]);qzT++){if(qzrd.innerHTML.match(/All shipping to the lower/i)){qzL=qzrd;}}
if(qzL){qzL.appendChild(qzp);}else{qzm('kx_oc: Could not find disclaimer area.');}}}
qz8.qz2T=true;
if(qz4.qzcd)qzud();}else{if(!qz8.qz_4)qzm('kx_oc: Could not find checkout link');
if(!qz8.qzo)qzm('kx_oc: Could not find bar4Search');}}
function qzVT(){var qzId=0;
if(window.innerHeight){qzId = window.innerHeight;}else if(document.documentElement&&document.documentElement.clientHeight){qzId = document.documentElement.clientHeight;}else if(document.body.offsetHeight){qzId = document.body.offsetHeight;}else{qzId = screen.height;}
return(qzId);}
function qzsT(qzP,qz9T){var qzpd=document.createElement('input'),qzfd=document.createElement('input');
qzpd.type=qzfd.type='HIDDEN';
qzpd.name=qz9T+'.x';
qzfd.name=qz9T+'.y';
qzpd.value=qzfd.value=0;
qzP.appendChild(qzpd);
qzP.appendChild(qzfd);}
function qzyT(qzR){var qzjT = /[\n\t\r%\$#!~`^&*\(\)=\{\}\[\],;:\'\"?\<\>\/\\\|]/;
if(!qzR||qzR.indexOf("@")==-1||qzR.indexOf("@")!=qzR.lastIndexOf("@")||qzR.match(qzjT)||qzR.indexOf(".",qzR.indexOf("@"))==-1||qzR.indexOf("..")!=-1||qzR.match(/\.$/))return false;return true;}
function qzkd(qzH,qzG,qzh,qzT,qzOT){qzH=qzS(qzH);
if(qzG&&qzh&&qzH){qzB=qzH.style;
if(qzB){if(!qzT)qzT = 1;
var qz9 = parseInt(qzH.style.top)||qzvd(qzH),qzd = parseInt(qzH.style.left)||qzbd(qzH),qz44=qz9,qzd4=qzd;
if(qz9!=qzG||qzd!=qzh){if(qzT < 1)qzT = 100;
if(qzOT=='ease'){if(qzG>qz9&&qz9+qzT<=qzG)qz9+=(qzG-qz9)/qzT;else if(qzG<qz9&&qz9-qzT>=qzG)qz9-=(qz9-qzG)/qzT;else qz9=qzG;
if(qzh>qzd&&qzd+qzT<=qzh)qzd+=(qzh-qzd)/qzT;else if(qzh<qzd&&qzd-qzT>=qzh)qzd-=(qzd-qzh)/qzT;else qzd=qzh;}else{if(qzG>qz9&&qz9+qzT<=qzG)qz9+=qzT;else if(qzG<qz9&&qz9-qzT>=qzG)qz9-=qzT;else qz9=qzG;
if(qzh>qzd&&qzd+qzT<=qzh)qzd+=qzT;else if(qzh<qzd&&qzd-qzT>=qzh)qzd-=qzT;else qzd=qzh;}
qzd = Math.round(qzd),qz9 = Math.round(qz9);
if(qz9!=qz44||qzd!=qzd4){qzB.top=parseInt(qz9)+'px';
qzB.left=parseInt(qzd)+'px';
window.setTimeout('qzkd("'+qzH.id+'",'+qzG+','+qzh+','+qzT+',"'+qzOT+'");', 0);}}}}}
if(document.zq2){qz4.qzUT=true;
qz4.qzq.push(new Image()).src=qzY+'/multierr/'+qz4.qzx+'/1000001/'+document.zq2.toString()+'.gif';}
function qzFd(){return!qz4.qzUT;}
document.zq2 = '1000001';
function qz1d(qzgd){var qzN=new Array();qzgd=qzgd||this;
for(var qzNd in qzgd)if(typeof qzgd[qzNd]!='function')qzN[qzN.length]=qzNd+'='+escape(qzgd[qzNd]).replace('+','%2B');
qzN.sort();return qzN.join('&');}
function qz3T(){this.toString=qz1d;
this.indexOf=String.prototype.indexOf;}
function qzpT(qzST){var qzy=new qz3T();
if(qzST){var qzp=qzST.toString().split('&');
for(var qzT=0,qzn;qzp[qzT]&&(qzn=qzp[qzT].indexOf('='));qzT++)if(qzn!=-1)qzy[unescape(qzp[qzT].substring(0,qzn))] = unescape(qzp[qzT].substring(qzn+1));}
return qzy;}
var qz5=new Object();
var qzkT=new RegExp('[\\w-]+\\.\\w{3}$'),qznT=new RegExp('[\\w-]+\\.\\w+\\.\\w{2}$');
function qzH4 (){var qzWd='',qzJT = document.location.hostname,qzdd=qzJT.match(qzkT);
if(qzdd){qzWd=qzdd[0];}else{qzdd=qzJT.match(qznT);
if(qzdd){qzWd=qzdd[0];}}
return qzWd;}
function qzhd(qzD,qz6,qzU,qzUd){if(document.cookie.indexOf('KOPT_OUT=true')==-1){if(qzU&&typeof qzU!='object')qzU=new Date(Date.parse(Date())+qzU);
var qza='';
if(qz4.qzk=='[ZONE]')qza = '; domain='+qzH4();else if(qz4.qzk!='-')qza = '; domain='+qz4.qzk;
var qzaT=qzD+'='+escape(qz6)+((qzU) ? '; expires='+qzU.toGMTString() :'')+((qzUd) ? '; path='+qzUd :'')+qza;
document.cookie=qzaT;
if(typeof(qz6)=='number')qz6=new String(qz6);
if(qz6.indexOf('=')!=-1)qz5[qzD]=qzpT(qz6);else qz5[qzD]=qz6;}}
var kx_sc=qzhd;
var qzzd=false;
function qz1T(){for(var qzN in qz5)qz5[qzN]='';var qzy = unescape(document.cookie).split('; ').reverse();
for(var qzT=0,qzp,qzn;(qzp=qzy[qzT])&&(qzn=qzp.indexOf('='));qzT++){if(qzn!=-1){var qzD=qzp.substring(0,qzn),qz6=qzp.substring(qzn+1);
if(qz6.indexOf('=')!=-1){qz5[qzD]=qzpT(qz6.replace('%2B','+'));}else{qz5[qzD]=qz6;}}}
return qz5;}
var qzI=new Object();
function qz7T(){qzI.qzW=qzI.qzy['KWSID-'+qz4.qzx].toString();
var qz7d=qzI.qzW.split('-');
qzI.qzqd=qz7d[0];
qzI.qzAd=qz7d[1];
qzI.qz4d=qz7d[2];}
var qz_=new Array();
qzd=new Object();
qzd.qz1 = document.location.search.substring(1);
while(qzd.qz1.length > 0){qzd.qzJd=qzd.qz1.indexOf('=');
if(qzd.qzJd==-1){break;}
qzd.qzD=qzd.qz1.substring(0,qzd.qzJd);
qzd.qzSd=qzd.qz1.indexOf('&',qzd.qzJd);
if(qzd.qzSd==-1){qzd.qzSd=qzd.qz1.length;}
qzd.qzad=qzd.qz1.substring(qzd.qzJd+1,qzd.qzSd);
qzd.qz1=qzd.qz1.substring(qzd.qzSd+1);
qzd.qzD = unescape(qzd.qzD);
qzd.qzad = unescape(qzd.qzad);
qz_[qzd.qzD]=qzd.qzad;}
function qzBd(){qzI.qzW = null;
qz1T();
qzI.qzy=qz5;
var qzB='KWSID-'+qz4.qzx;
if(qz_[qzB]){qzI.qzy[qzB]=qz_[qzB];
if(true){qzhd(qzB,qz_[qzB],qz4.qzPT,'/');}}
qzB = 'KWOPT-no_popup';
if(qz_[qzB]){qzI.qzy[qzB]=qz_[qzB];}
if(qz4.qzcd){qzhd('KS',qz4.qzx,0,'/');}
if(qzI.qzy['KWSID-'+qz4.qzx]){qz7T();return true;}else{qzI.qzW = null;
qzI.qzy = null;return false;}}
function qznd(){return true;}
var qzl={qzE:[]}, keftacookie;
function qzfT(qz0,qzGd,qzid){if(typeof qzGd!='number'){qzl.qzE[qzl.qzE.length]=qz0;
if(typeof(qzid)!='undefined')qzl.qzE[qzl.qzE.length-1]=[qz0,qzid];return qzl.qzE.length-1;}else{qzl.qzE[qzGd]=qz0;
if(typeof(qzid)!='undefined')qzl.qzE[qzGd]=[qz0,qzid];return qzGd;}}
function qzcT(){if(qzFd()){if(keftacookie){qzhd('KWSID-'+qz4.qzx,keftacookie,qz4.qzPT,'/');}
if(qzzd){qzBd();
qzzd=false;}}}
function qzbT(qzI4){if(qzFd()){qzcT();
qz4.qzu4=1;
qz4.qztT=1;
window.qzFT(qzI4);
for(var qzT=0;qzT<qzl.qzE.length;qzT++){if(typeof(qzl.qzE[qzT])=='function')qzl.qzE[qzT]();else if(typeof(qzl.qzE[qzT])=='object'&&typeof(qzl.qzE[qzT].length)!='undefined'&&qzl.qzE[qzT].length==2&&typeof(qzl.qzE[qzT][0])=='function'&&typeof(qzl.qzE[qzT][1])=='object'&&typeof(qzl.qzE[qzT][1].length)!='undefined')qzl.qzE[qzT][0].apply(null,qzl.qzE[qzT][1]);else qzm('qzl.qzE[qzT] contains an illegal object:'+qzT+' = |'+qzl.qzE[qzT]+'|');}}}
window.qzFT=qznd;
if(qzFd()){if(window.onload){window.qzFT = window.onload;
window.onload=qzbT;}else{if(qz4.qzeT.indexOf('Netscape6/6.0')>=0){}else{window.onload=qzbT;}}}
function qzxT(qzd){var qzN="4UyWTAJG5K8B7dhifwlPnMRz6QtFmx1VDasr32gkqHbvLTcuZN09EpOoXSeIC",qzIT='';
for(var qzT=0,qzMd;qzT<qzd&&(qzMd=Math.floor(Math.random()*qzN.length));qzT++)qzIT+=qzN.substring(qzMd,qzMd+1);return qzIT;}
function qzT4(qzZ){return(qzY+'/event/'+qz4.qz8T+qzxT(8)+qz4.qzVd+'/'+qzI.qzqd+'/'+qz4.qzx+'/'+qzI.qzAd+':'+qzI.qz4d+'/'+qzZ+'.gif');}
function qzhT(qzZ,qzP4){return qzY+'/form/'+qzI.qzqd+'/'+qz4.qzx+'/'+qzI.qzAd+':'+qzI.qz4d+'/'+qzZ;}
function qze(qzA,qzX){if(!qzX)qzX='';return qzA+=(qzA.indexOf('?')!=-1&&'&'||qzX.indexOf('?')!=0&&'?'||'')+qzX;}
function qz5d(qzZ,qzw,qz0){if(qzI.qzW&&qzI.qzAd){var qzA=qze(qzT4(qzZ),qzw);
qzA=qze(qzA,'r='+escape(document.referrer));
if(typeof qz0!='function')qz0=qznd;
var qzK=qz4.qzq.length;
qz4.qzq[qzK]=new Image();
qz4.qzq[qzK].onload=(qz4.qzq[qzK].onerror=(qz4.qzq[qzK].onabort=qz0));
qz4.qzq[qzK].src=qzA;return(qz4.qzq[qzK]);}}
function qzzT(qzP){qzP.qz6T=qzP.onsubmit||qznd;
qzP.onsubmit=function(qzv){var qzs=qzP.qz6T(qzv);
if(qzs){var qz_d,qzX=[];
if(qzP.cst_email&&qzP.newCustomer&&qzP.newCustomer[0]&&qzP.newCustomer[0].checked&&qzP.cst_subscribe&&qzP.cst_subscribe.checked){qz_d=qzP.cst_email.value;
qzX.push('owna=1');}else if(qzP.cst_email&&!qzP.newCustomer&&qzP.cst_subscribe&&qzP.cst_subscribe.checked){qz_d=qzP.cst_email.value;
qzX.push('owna=1');}else if(qzP.EMAIL){qz_d=qzP.EMAIL.value;}
if(qzyT(qz_d)){qzX.push('e='+qz_d.replace('+','%2B'));
qz5d(1002100,qzX.join('&'),function(){if(document.getElementsByName('GO')){qzsT(qzP,'GO');}
qzP.submit();});return false;}      }
return qzs;}}
function qzQT(){if(document.URL.match(/PAGE=MYACCTMENU/)&&document.URL.match(/SUBSCRIBE=T/)){qz5d(1002100,'owna=1');}else{for(qzT=0;qzT<document.forms.length;qzT++){if(document.forms[qzT].EMAIL||document.forms[qzT].cst_email){qzzT(document.forms[qzT]);}}}}
qzfT(qzQT);
function kx_owl(qzqT,qzjd,qz9d){var qz8=document.createElement('img'),qz6d=(qzVT()-qz9d)/2,qzj=(qzBT()-qzjd)/2,qzt=document.createElement('iframe'),qzO={width:qzjd+'px',height:qz9d+'px',left:'-'+qzjd+'px',top:qz6d,position:'absolute',zIndex:99,cursor:'pointer'};
qz8.id='qzLT';
qzg(qzt,qzg(qz8,qzO));
qzt.src=qzY+'/hosted/common/images/spacer.gif';
qzt.style.zIndex=98;
qzt.id='qzrT';
qz8.src=qzY+'/hosted/ostk/ow/'+qzqT;
qz8.onclick=function(){qzg('qzrT',qzg(this,{display:"none"}))};
qzc.appendChild(qz8);
qzc.appendChild(qzt);
qzkd('qzLT',qz6d,qzj,20,'slide');
qzkd('qzrT',qz6d,qzj,20,'slide');}
function qzRd(qzA,qzEd,qzb){if(document.createElement&&qzA){var qz8d=document.createElement('script');
qz8d.type = 'text/javascript';
if(qzEd)qz8d.onload=qzEd;
if(qzb)qz8d.id=qzb;
qz8d.src=qzA;
qzc.appendChild(qz8d);}}
function qzAT(qzA){document.writeln('<script type="text/javascript" src="'+qzA+'"><\/script>');}
function qz94(qzA,qzEd,qzb){if(qzA){if(qz4.qztT){qzRd(qzA,qzEd,qzb);}else{qzAT(qzA);}}}
kx_load_js=qzRd;
function qzRT(qzZ,qzLd,qzEd){if(qzI.qzW&&qzI.qzAd){var qzA=qzY+'/dynamic_js/'+qzI.qzqd+'/'+qz4.qzx+'/'+qzI.qzAd+':'+qzI.qz4d+'/'+qzZ;
if(typeof(qzLd)!='undefined')qzA+='?'+qz1d(qzLd);
qzA=qze(qzA, 'PC='+qz4.qzld);
qzA=qze(qzA,'r='+escape(document.referrer));
qzRd(qzA);}else qzm('dynamic_js: no cookie and/or usercase: |'+qzZ+'|, |'+qzLd+'|');}
function qzyd(qzf,qzV,qzXd){return(100000000+10000*qzf+100*qzV+(qzXd||1));}
function qzE4(qzf,qzV,qzXd){return(qzhT(qzyd(qzf,qzV,qzXd)));}
function qzWT(qzH,qzf,qzV,qzXd,qzX,qzA4){if(qzI.qzW){var qzZ=qzyd(qzf,qzV,qzXd),qzA='';
if(qzX)qzA=qze(qzA,qzX);
qzA=qze(qzA,'u='+escape(qzH.href||qzH.action||''));
if(qzH.href&&!qzA4)qzH.href=qze(qze(qzhT(qzZ),qzA), 'PC='+qzf);else qz5d(qzZ,qzA);}}
window.clearTimeout(qzl.qzX4);
var qzYT=[],kx_opl=qzWT,kx_cp=qz5d,kx_mpn=qzyd;
function qzl4(qzD){return(qzS(qzD)||qzYT.push('Could not find:'+qzD)&&false);}
function qzgT(){var qzX={M:'djs'},qzf='OSTK';
if(typeof(kx_ostk2kefta)!='undefined'){qzX['ev']=kx_ostk2kefta;}else{qzm('kx_ostk2kefta is undefined!');}
if(qz4.qzcd)qzX['NS']=1;
if(qz_['PAGE'])qzX['PG']=qz_['PAGE'];else if(qz_['page'])qzX['PG']=qz_['page'];
if(qz_['PAGE']&&qz_['PAGE']=='ENDECA'&&qz_['N']){qzf='E'+qz_['N'];}else if(qz_['PRO_SUB_CAT']){qzf='C'+qz_['PRO_SUB_CAT'];
if(qz_['PRO_SSUB_CAT']&&qz_['PRO_SSUB_CAT']!='999')qzf='SC'+qz_['PRO_SSUB_CAT'];}else if(qz_['STLID']){qzf='D'+qz_['STLID'];}else if(qz_['STO_ID']){qzf='S'+qz_['STO_ID'];}else if(qz4.qzld>=900){qzf='K'+qz4.qzld;}
if(qz5['mxcproclicks'])qzX['v']=qz5['mxcproclicks'];
qzX['ST']=qz5['mxcsurftype']||'0';
if(qz5['mxccamid'])qzX['CID']=qz5['mxccamid'];
if(qzf)qzX['P']=qzf;return(qzX);}
if(qzBd()){if(typeof(kx_ostk2kefta)!='undefined')qzfT(function(){qzRT(1001069,qzgT());});else qzm('kx_ostk2kefta is undefined!');}
var qzYd=new qz3T();
qzd=new Object();
var qzDd=false;
qzd.qzQd = Math.random().toString().substring(2);
qzd.qza = ((qz4.qzk!='-'&&qz4.qzk!='[ZONE]'&&'; domain='+qz4.qzk)||'');
document.cookie = "XU="+qzd.qzQd+qzd.qza;
qzDd = (document.cookie.indexOf(qzd.qzQd)!=-1);
document.cookie = "XU=0; expires=Tue, 1-Jan-1980 02:02:02 GMT"+qzd.qza;
if(!qzDd&&qzd.qza&&location.hostname&&location.hostname.indexOf(qz4.qzk.replace(/^./,''))==-1&&document.URL.indexOf('http')!=-1&&!(qz4.qz5T&&location.hostname.match(qz4.qz5T)))qzm('Wrong probe domain: "'+location.hostname+'", Expecting: "'+qz4.qzk+'" in URL: "'+escape(document.URL)+'"');
var qzJ4 = null;
if(document.cookie.indexOf('KOPT_OUT=true')==-1){if(qzFd()){qzd=new Object();
qzBd();
qzd.qzNT = !!qzI.qzW;
if(qzDd&&(!qzd.qzNT)&&true){qzd.qzA=qz4.qzvT+'/js_cookie_create2/'+qz4.qz8T+qzxT(8)+qz4.qzVd+'/'+qz4.qzx+'/1.js';
if(typeof(qzYd)!='undefined'&&typeof(qzYd.CT)!='undefined')qzd.qzA=qze(qzd.qzA,'SET_CT='+qzYd.CT);
qzd.qzA=qze(qzd.qzA,qz1d(qzgT()));
qzd.qzA=qze(qzd.qzA, 'PC=100&djs=1');;
if(typeof document.referrer!='undefined'&&document.referrer.length > 1)qzd.qzA=qze(qzd.qzA,'r='+escape(document.referrer));
qzAT(qzd.qzA);
qzzd=true;}}}
