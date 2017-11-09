// dtmtag.js
//
// Script to integrate Newegg.com for Dotomi campaigns.
// 07-07-24 

function _DTMTAG(cid,fid,com) {
    var pxl=arguments.callee;

    if(!pxl["dtm_cid"])
        pxl.dtm_cid=cid;

    pxl.dtm_com=com || 28;
    pxl.dtm_fid=fid || 101;

    return pxl;
}

_DTMTAG.write=function(tmOut) {
    tmOut=tmOut || 4000;
    var doc=document,baseUrl=window.location.protocol;
    if(baseUrl=="file:") baseUrl="http:";
    baseUrl += "//login.dotomi.com/ucm/UCMController?dtm_format=5&dtm_cmagic=296472";

    if( this["dtmc_transaction_id"] ) {
        this.dtm_com=29;
        if( this["dtm_fid"]==101 )
			this.dtm_fid=102;
		this.cli_promo_id="100";
    }

    // gather custom field attributes
    for(var attr in this){
        var to,itm=this[attr];
        to=typeof itm;
        if(to!="function" && to!="object")
            baseUrl += "&" + attr + "=" + escape(itm);
    }

    function crEl(el) {
        if (typeof doc.createElementNS != 'undefined') return doc.createElementNS('http://www.w3.org/1999/xhtml',el);
        if (typeof doc.createElement != 'undefined') return doc.createElement(el);
        return false;
    }

    // write the tag markup
    if(arguments.callee.testMode) {
        alert(baseUrl.split("&").join("\n"));
    } else {
        setTimeout('timeOutDotomi()',tmOut);
        var dv=crEl("div");
        if(dv){
            dv.setAttribute("id", "dtmdiv");
            dv.style.cssText = "display:none";  

            var ifrm=crEl("iframe");
            ifrm.setAttribute("src", baseUrl);
            dv.appendChild(ifrm);

            var dtjs=doc.getElementById("dtmjs");
            dtjs.parentNode.insertBefore(dv,dtjs);
        } else {
            doc.write('<div id="dtmdiv" style="display:none"><iframe src="'+baseUrl+'"></iframe></div>');
        }
    }
};

function timeOutDotomi(){ try{document.getElementById("dtmdiv").innerHTML = "";}catch(ex){}}
// end generic portion

function _DTMDATA(cid, fid, com) {
    var pxl=_DTMTAG(cid, fid, com);

    try {
		////////////////////////////////////////////////////////////////////////////////////////////////
        // are we on a page of interest?
		//
        // confirmation 
		// https://???????
		//
        // cart 
		// http://secure.newegg.com/NewVersion/Shopping/shoppingcart.asp?submit=ChangeItem
		//
		// Tab Stores
		// http://www.newegg.com/Store/Computer.aspx?name=Computer-Hardware 
		// http://www.newegg.com/Store/Electronic.aspx?name=Electronics
		// http://www.newegg.com/Store/Notebook.aspx?name=PCs-Notebooks
		// http://www.newegg.com/Store/Camera.aspx?name=Digital-Cameras
		// http://www.newegg.com/Store/Network.aspx?name=Networking
		// http://www.newegg.com/Store/Games.aspx?name=Game-Sphere
		// http://www.newegg.com/Store/Software.aspx?name=Software
		// http://www.newegg.com/Store/DVD.aspx?name=DVDs
		//
		// Category
		// http://www.newegg.com/Store/Category.aspx?Category=2&name=Backup-Devices-Media
		//
		// Subcategory
		// http://www.newegg.com/Store/SubCategory.aspx?SubCategory=13&name=Floppy-Drives
		// 
		// BrandSubcategoryStores
		// http://www.newegg.com/ProductSort/BrandSubcategory.asp?Brand=1028&Subcategory=343&name=Processors-AMD
		//
		// Brand Stores
		// http://www.newegg.com/Store/Brand.aspx?Brand=1642&name=3ware
		//
		// Item
		// http://www.newegg.com/Product/Product.aspx?Item=N82E16812142005R
		//
		//Search
		// http://www.newegg.com/Product/ProductList.aspx?Submit=ENE&N=2+50001028+40000343+1389627502&name=Desktop

		// use a RegEx to obtain the page name
		//var res = (new RegExp("([a-z]*[1-3]?\.aspx?)$")).exec(window.location.pathname.toLowerCase());
		var res = (new RegExp("([a-z]*[1-3]?)\.aspx?$")).exec(window.location.pathname.toLowerCase());
		//var res = (new RegExp("([a-z]*[1-3]?)\.htm$")).exec(window.location.pathname.toLowerCase());

		function findFields(look,map){
			var q;
			if(res[1]!="shoppingcart") {
				q = window.location.search;
			} else {
				q = document.referrer;
				var ql=q.indexOf("?");
				q=q.substring(ql,q.length);
			}
			if(q.length > 1) {
				q = q.substring(1, q.length);

				var qs = q.split("&");  // split the query on ampersand
				for( var i=0,nv; i<qs.length; i++){
					// iterate through the query params
					nv=qs[i].split("=");
					var name=nv[0].toLowerCase();
					for( var j=0; j<look.length; j++){
						// if the param is one we're interested in...
						if( name==look[j]) {
							// add it to the data, possibly with the name remapped
							 
							var val=nv[1];
							switch(name) {
							case "savecompare":
							case "saveamount":
							case "brand":
							case "item":
								// filter out empty values for these
								if(val && val.length && val!="0")
									pxl['dtmc_'+ name ]=val;
								break;
							case "n":
								val = unescape(val).replace("+"," ");
								var splt=val.split(" ");
								try {
									for(var subParam,k=0; k<splt.length; k++) {
										subParam=splt[k];
										if( subParam.indexOf("5")==0 ) {
											val=subParam;
											pxl['dtmc_brand']= +(val.substring(1,val.length));
										} else if(subParam.indexOf("2")==0) {
											val=subParam; //2 00334 0554
											val = +(val.substr(val.length-4,4));
											if(val) {
												pxl['dtmc_category']= val;
											} else {
												val=subParam; //2 00334 0554
												val = +(val.substr(1,5));
												if(val) {
													pxl['dtmc_category']= val;
												}
											}
										}
									}
								} catch(e) {
								}
								break;
							default:
								var mv = map[name];
								if(mv) {
									// the name is remapped
									name=mv[0];
									if (mv.length==2 && typeof mv[1] =="function" ) {
										// if the map entry is a two-element array, then call the edit/filter function in the second element
										val = mv[1](val);
									}
								}
								pxl['dtmc_'+ name ]=val;
							}
						}
					}
				}
			}
			var ref = document["referrer"];
			if(ref && ref!="" && ref.toLowerCase().indexOf("newegg.com")==-1) {
				pxl.dtmc_referrer=ref;
			}
		}
		
		var promo=-1;
		switch(res[1]) {
			case "product":
				promo=98;
				break;
			case "subcategory":
				promo=2;
				break;
			case "category":
				promo=1;
				break;
			case "brand":
				promo=3;
				break;
			case "brandsubcategory":
				promo=4;
				break;
			case "productlist":
				promo=5
				break;
			case "productcompare":
				promo=200;
				break;
				
			/*
			For the ITEM CODES in the CHECKOUTSTEP3 & SHOPPINGCART page, 
			let's use NAME="CART_ITEM" in the LINK element   <a href="..." name="cart_item"> 
			 
			For the ORDER TOTAL in the CHECKOUTSTEP3.ASP page let's use ID="ORDER_TOTAL" in the TD element.
			<td id="order_total">$99.99</td>
			 
			For the CUSTOMER ID on the CHECKOUTSTEP3.ASP page, we will use ID="C_ID" in a hidden SPAN element.
			<span style="display:none" id="c_id">0123456789</span>

			*/				
			case "shoppingcart":
				promo=99;
				/*
				<td class="cartDescription">				
				<img src="http://images10.newegg.com/ProductImageCompressAll/22-148-246-01.jpg">

				<p>
				<a href="http://www.newegg.com/Product/Product.asp?item=N82E16822148246">
				Seagate Barracuda 7200.9 ST3400833AS 400GB 7200 RPM SATA 3.0Gb/s Hard Drive - OEM</a>
				<br>
				*/
				var fnd,tdList= document.getElementsByName("cart_item");
				if(tdList && tdList.length ) {
					// read the item number from the query string in the href of this A tag
					fnd=tdList[0];
				} else {
					tdList = document.getElementsByTagName("td");
					for( var i=0; i<tdList.length; i++) {
						if( tdList[i].className == "cartDescription" ) {
							fnd=tdList[i].getElementsByTagName("a");
							// we want the first <A> within this TD
							if(fnd && fnd.length) {
								fnd=fnd[0];
								break;
							} else {
								fnd=null;
							}
						}
					}
				}
				if(fnd) {
					// read the item number from the query string in the href of this A tag
					fnd=fnd.href;
					pxl["dtmc_item"]=fnd.substring(fnd.indexOf("=")+1, fnd.length );
				}
				break;
			case "shoppingitem":
				// pre-cart page
				promo=99;
				break;
			case "checkoutstep3":
				//
				// https://secure.newegg.com/NewVersion/shopping/checkoutstep3.asp?CartNo=50920694&loginname=davidae4%40hotmail%2Ecom&SONumbers=46762413&PreSONumbers=
				// 								<tr class="noTop"><td colspan="2">Order Total</td><td>$14.76</td></tr>
				
				/*
				For the ITEM CODES in the CHECKOUTSTEP3 & SHOPPINGCART page, 
				let's use NAME="CART_ITEM" in the LINK element   <a href="..." name="cart_item"> 
				 
				For the ORDER TOTAL in the CHECKOUTSTEP3.ASP page let's use ID="ORDER_TOTAL" in the TD element.
				<td id="order_total">$99.99</td>
				 
				For the CUSTOMER ID on the CHECKOUTSTEP3.ASP page, we will use ID="C_ID" in a hidden SPAN element.
				<span style="display:none" id="c_id">0123456789</span>

				*/				
				promo=100;
				// <tr class="noTop"><td colspan="2">Order Total</td><td>$14.76</td></tr>
				var fnd=document.getElementById("order_total");
				if(!fnd) {
					// fall back to DOM traversal
					var tdList = document.getElementsByTagName("tr");
					for( var cnt=0,i=0; i<tdList.length; i++) {
						if( tdList[i].className == "noTop" && ++cnt==3) {
							// we want the third tr with class=="noTop"
							fnd=tdList[i].getElementsByTagName("td");
							if(fnd && fnd.length) {
								fnd=fnd[1];
								break;
							} else {
								fnd=null;
							}
						}
					}
				}
				if(fnd) {
					// we want the second TD, which holds the Order Total
					pxl["dtm_conv_val"]=fnd.innerHTML.replace("$","");
				}
				
				// customer_id
				fnd=document.getElementById("c_id");
				if(fnd) {
					pxl["dtm_user_id"]=fnd.innerHTML;
				}
				break;
			/*	
			case "computer":  		// Tab Stores start here
				promo=-2;
				break;
			case "electronic": 
				promo=-3;
				break;
			case "camera": 
				promo=-4;
				break;
			case "network": 
				promo=-5;
				break;
			case "software": 
				promo=-6;
				break;
			case "games": 
				promo=-7;
				break;
			case "dvd":
				promo=-8;
				break;
			*/	
			case "rebate":
				promo=6;
				break;
			case "combo":
				promo=7;
				break;
			case "powersearch":
				promo=8;
				break;
		}
		
        if(promo==-1) {
			pxl=null; //  not a page of interest
		} else {
			function commaSplit(v) { return (unescape(v)).split(',')[0]};

			findFields(
				["item","itemlist","category","subcategory","brand","name","sonumbers","cartno","rebatetype","savecompare","saveamount","n","compareitemlist"], 
				{ "subcategory":["category"],
				  "itemlist":["item", commaSplit ],
				  "compareitemlist":["item", commaSplit ],
				  "sonumbers":["transaction_id"]
				} 
			);
	        pxl.cli_promo_id = promo;
		}
    } catch(ex){
    }
    return pxl;
}
_DTMTAG.write.testMode=false;

var _dtm_pxl=_DTMDATA(2070);
if(_dtm_pxl && _dtm_pxl["cli_promo_id"] && _dtm_pxl.cli_promo_id != -1)
	_dtm_pxl.write();

// END dtmtag.js