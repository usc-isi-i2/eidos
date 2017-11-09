//HBX update
//add by mylo 2006-04-25

 if(typeof hbx!= "undefined" && hbx.mlc=="/All+Products" && hbx.pn=="index.asp"){
    hbx.lvm = 300;
}

function _hbOnPrePVR(){
    if(typeof hbx!="undefined" && hbx.mlc=="/All+Products" && hbx.pn=="index.asp"){
        for(var a=0;a<_IL(document.links);a++){
            var linkObj = document.links[a];
            if(linkObj.href.indexOf("ItemList")>-1){
                var _lid = _LVP(linkObj.search, "ItemList");
                _lvid += _lid + ',';
                _lvpos += ',';
            }
        }
    }
}

function _hbOnLink(linkObj){
    if(typeof hbx!="undefined" && hbx.mlc=="/All+Products" && hbx.pn=="index.asp"){
        if(linkObj.href.indexOf("Item=")>-1){
            var _lid = _LVP(linkObj.search, "Item");
            if(_lid.length>0){
                _hbSet('lid', _lid);
                _hbSet('lpos', "detail");
            }
        } else if(linkObj.href.indexOf("ItemList=")>-1){
            var _lid = _LVP(linkObj.search, "ItemList");
            if(_lid.length>0){
                _hbSet('lid', _lid);
                _hbSet('lpos', "add to cart");
            }
        }
    }
}



if(typeof errmsg!="undefined"&&errmsg.length>0){var _idx=errmsg.indexOf(".");if(_idx>-1)errmsg=errmsg.substring(0,_idx)
	if(typeof hbx!="undefined")hbx.pec=errmsg;else _pec=errmsg;
}

if(location.protocol&&location.protocol=="https:"){if(typeof hbx!="undefined")hbx.fv="1";else _fv="1"}
else{if(typeof hbx!="undefined")hbx.fv="none";else _fv="none"}
