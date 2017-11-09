/* usatWidg -- manage dynamically loaded objects which html onto the page
 *             generally deferring actions until after dynamic loading is done
 *
 * initial versions by Raul Miller
 */

function UsatWidg(name) {
    this._name= name;
}
UsatWidg.prototype= {
    _configDefaults: {Generic: {}}, // default config data structure [is blank]
    
    overrideDefault: function(dflt, over) {
        /* dflt: general config object
         * over: more narrow config
         *    add more specific config info to a config object
         */
        if (!dflt) dflt= {};
        if (over) {
            for (var prop in over) {
                dflt[prop]= over[prop];
            }
        }
        return dflt;
    },
    ConfigDefaults: function(defaults) {
        /* defaults: named collection of config objects
         *    used to declare default configuration
         */
        var cfg= this._configDefaults;
        for (var prop in defaults) {
            cfg[prop]= this.overrideDefault(cfg[prop]||null, defaults[prop]);
        }
    },
    getDefaultConfig: function(tag) {
        /* tag: name of widget class we need configuration for
         *    used to fetch default configuration 
         */
        var def= this._configDefaults;
        var d= this.overrideDefault({}, def.Generic);
        return this.overrideDefault(d, def[tag]);
    },
    ConfigUrl: function(config, dirKey, fileName, fileKey) {
        /* config: config block, or string identifying a default config block
         * dirKey: string that says where files are kept, for non-absolute names
         * fileName: file to use
         * fileKey: if config has this key, that overrides fileName argument
         *    url to load file, based on config
         */
        if ('string' == typeof config) config= this.getDefaultConfig(config);
        var file= config[fileKey] || fileName || '';
        if (file.match(/^\/|^[a-z]+\:\/\//)) {
            return file;
        }
        var dir= config[dirKey] || config.DefaultDir || '';
        if (dir && !dir.match(/\/$/)) dir+= '/';
        return dir+file;
    },

    _loadedJs: {}, // list of js files which have already been loaded
    LoadJs: function(url) {
        /* url: url of js file
         *  dynamically load a named js file
         */
        if (!this._loadedJs[url]) { // only load once
            document.write('<'+'script'+' language="javascript" src="'+url+'"></'+'script'+'>\n');
            this._loadedJs[url]= true;
        }
    },
    _wClasses: {}, // per-widget-class objects
    loadWidgJs: function(tag) {
        /* tag: class name of widget to be loaded
         *    make sure widget javascript has been loaded, and initialized
         */
        if (!this._wClasses[tag]) {
            var c= this._wClasses[tag]= new usatAj.TodoList();
            var jsFile= c.urlBase= this.ConfigUrl(tag, 'jsDir', tag+'.js', 'jsFile');
            this.LoadJs(jsFile);
        }
    },

    _wObjects: {}, // per-widget-instance objects
    activate: function(wID) {
        /* wID: instance name of a widget object
         *     post-render initialize the widget 
         */
        if (this._wObjects[wID].widget.WidgetActivate) {
            /* use string eval rather than function so WidgetActivate
             * gets the right object for 'this'
             */
            setTimeout(this._name+'._wObjects.'+wID+'.widget.WidgetActivate()', 1);
        }
    },
    
    waitUntil: function(readyFn, waitingFn, debugMessage) {
        /* readyFn: returns true when it's ok to run waitingFn
         * waitingFn: what we're waiting to do
         * debugMessage: displayed in optional debug log when waiting
         *    waits for a while, if necessary, then runs waitingFn
         *    uses a fibonacci sequence for delays, to reduce overhead of long wait
         */
         var wait= [10, 20];
         var timeoutFn= function() {
            if (readyFn()) {
                waitingFn();
            } else {
                wait[2]= wait[0]+wait[1];
                if (debugMessage)
                    usatAj.showDebug(debugMessage,', waiting at least ',wait[0],' millisecond',((1==wait[0])?'':'s'));
                setTimeout(timeoutFn, wait.shift());
            }
        };
        timeoutFn();
    },        
            
    emitConstructor: function(cfg) {
        /* cfg: config object for widget instance
         *    emit constructor for the widget instance 
         */
        var wCl= cfg.tag;        // class of widget
        var config= this.overrideDefault(this.getDefaultConfig(wCl), cfg);
        var wID= config.wID;       // wID allocated to widget
        var clsObj= this._wClasses[wCl]; // get class reference
        var jsBase= this._name+'._wObjects.'+wID // js widget container variable name
        config.widgetName= jsBase+'.widget' // js widget object variable name
        var wdgObj= this._wObjects[wID]= { // make widget container object
            config: config,
            jsBase: jsBase,
            urlBase: clsObj.urlBase,
            onPage: false, // is widget ready to be activated?
            widget: null,  // will be the widget object itself
            toActivate: new usatAj.TodoList() // things to do after rendering widget
        };
        var This= this;
        var constructorCallback= function() {
            var w= wdgObj.widget= eval('new '+wCl+'('+jsBase+'.config);');
            if (w.WidgetSetup) {
                w.WidgetSetup();
            }
            if (wdgObj.onPage) {
            /* we're running the widget's constructor, but this.Render() has already
             * been called for this widget, so we need to manipulate the DOM to
             * render the widget.
             * Additional problem: In firefox, DOM elements prepared by
             * document.write can take longer to become available than ajax
             * calls!  But we are using document.write to place our container
             * node on the page.  Current solution:  Poll the document until
             * it's ready.
             */
                var container= 'usatWidg_'+wID;
                This.waitUntil(
                    function() {return $(container)},
                    function() {
                        This.showDebug('Widget render for ', container);
                        var node= $(container);
                        if (w.WidgetRender)
                            node.innerHTML= w.WidgetRender();
                        // we've rendered our widget, run post-render code:
                        wdgObj.toActivate.Finish();
                        usatAj.execJS(node);
                        This.activate(wID);
                    },
                    'Deferring widget render for '+container+' -- browser not ready'
                );
            } else {
                /* alternatively, maybe we're not dealing with a dynamic widget?
                 */
                if (!wdgObj.WidgetRender) wdgObj.onPage= true;
            }
        }
        if (window[wCl]) {
            constructorCallback();
        } else { // widget class is still loading: defer processing
            clsObj.Todo(constructorCallback);
        }
    },
   
   Setup: function() {
        /* Declare widget instances on page */
        for (var j= 0; j < arguments.length; j++) {
            var config= arguments[j];
            this.showDebug('Setting up ',config.wID);
            this.loadWidgJs(config.tag);
            this.emitConstructor(config);
        }
    },

    Render: function(what) {
        /* wID: instance name of a widget object
         *    place and populate widget instance container node on page 
         */ 
        var wID;
        if ('string' != typeof what) {
            wID= what.wID;
            if (!this._wObjects[wID])
                this.Setup(what);
        } else {
            wID= what;
        }
        this.showDebug('Render: ',wID);
        var wdgObj= this._wObjects[wID];
        document.write('<div id="usatWidg_'+wID+'">');
        if (wdgObj.widget) {
            var w= wdgObj.widget;
            document.write(w.WidgetRender.apply(w, arguments));
            this.activate(wID);
        } else {
            document.write(usatAj.transitionImage);
        }
        document.write('</div>');
        this._wObjects[wID].onPage= true;
    },

    ClassAvailable: function(tag) {
        /* tag: class name of a widget
         *    callback from widget class definition to work around IE's automatic and unwanted defer on non-rendering .js files
         */
        var cl= this._wClasses[tag];
        if (cl.Unfinished()) {
            cl.Finish();
        }
    },
    
    EnableDragDrop: function(nodeID, config) {
        /* nodeID: id of drag/drop container node 
         * config: drag drop config 
         *    cover fn (and autoloader) for [currently] scriptaculous drag/drop initialization
         */
        var This= this;
        var enable= function(){
            This.showDebug('... Sortable.create("',nodeID+'", ',config,');');
            Sortable.create(nodeID, config);
            $(nodeID).style.position= 'static'; // work around IE bug
        }
        this.waitUntil( /* wait for scriptaculous dynamic loading to complete */
            function(){return window.Sortable && Sortable.create},
            enable,
            '... Sortable not ready for '+nodeID
        );
    },
    
    Run: function(wID, method) {
        /* wID: instance name of widget object that has method to be run
         * method: name of method to run
         * etc.: any arguments for that method
         *    run indicated method within indicated widget
         *    NOTE: requires widget be ready to run that method
         */
        usatWidg.waitUntil(
            function(){return usatWidg._wObjects[wID] && usatWidg._wObjects[wID].widget},
            function(){
                var widget= usatWidg._wObjects[wID].widget;
                var args= '(';
                var delim= ''
                for (var j= 2; j < arguments.length; j++) {
                    args+= delim+'arguments['+j+']';
                    delim=', ';
                }
                args+=')';
                eval('widget.'+method+args);
            }
        );
    },
    
    
    PreviousAdLatency: 3000, // ads stay on page this long before they can be replaced
    
    busyAdPosition: {}, // "don't step on me" markers go here
    
    DeliverAds: function(wID) {
        /* wID: instance name of widget object for widget that wants ads
         *    request ads and thus (once widget and ads are ready) deliver them
         */
        var config= this._wObjects[wID].config;
        var positions='', delim= '';
        for (var pos in config.ads) {
            var adID= config.ads[pos];
            if (this.busyAdPosition[adID]) return;
            this.busyAdPosition[adID]= true;
            positions+=delim+pos;
            delim=',';
        }
        var url= 'http://ad.usatoday.com/RealMedia/ads/adstream_sx.ads/www.usatoday.com'+document.location.pathname.toLowerCase()+'/'+config.wID+'/1'+new Date().getTime()+'@'+positions;
        var This= this;
        if (usatAj.scriptNotBroken)
            this.Ajax(wID, url, function(txt) {This.adDeliveryHandler(wID, txt)});
    },
    
    adDeliveryHandler: function(wID, sx) {
        /* wID: instance name of widget object that will get the ads
         * sx: sx html content to be delivered
         *    split sx ads and stuff them onto page
         */
        this.showDebug('adDeliveryHandler for ',wID);
        var wdgObj= this._wObjects[wID];
        var adspos= wdgObj.config.ads;
        var w= wdgObj.widget;
        var keys= sx.match(/<!--OAS AD=\"\w+(?=\"-->)/g).join('\n').match(/\w+$/mg);
        var vals= sx.split(/<!--OAS AD=\"\w+\"-->/);
        if (vals.length > keys.length) vals.shift(); // maybe remove blank before first divider
        for (var j= 0; j < keys.length; j++) {
            this.showDebug('Got ad for ',wID,' -- ',keys[j]);
            this.showDebug(vals[j],'\n_______________');
            var pos= $(adspos[keys[j]]);
            if (pos) {
                this.showDebug('Setting ad for ',keys[j]);
                this.setAd(adspos[keys[j]], vals[j]);
                if (w.WidgetSetAd)
                    w.WidgetSetAd(keys[j], adspos[keys[j]], this.NonEmptyAd(vals[j]));
            } else {
                this.showDebug(keys[j],' not on page');
            }
        }
    },
    
    NonEmptyAd: function(html) {
        /* html: ad html
         *    NonEmptyHtml is true iff there's actually no ad
         */
        this.showDebug('NonEmptyAd');
        return -1 < html.indexOf('Advertisement');
    },
    
    setAd: function(nodeId, html) {
        /* nodeId: id of DOM element which will contain ad (should match configured ad position id)
         * html: html of ad to be delivered
         *    setAd delivers the ad (simulating document.write/document.writeln
         *    after document load
         */
        this.showDebug('setAd ',nodeId);
        // place ad on page
        var adParent= 'string' == typeof nodeId ?$(nodeId) :nodeId;
        this.showDebug('Putting ad in ', adParent.id);
        adParent.innerHTML= '<table><tr><td><div id="'+adParent.id+'_ad">'+html+'</div></td></tr></table>';
        var This= this;
        var adReady= function() {
            setTimeout(function(){This.busyAdPosition[adParent.id]= false}, This.PreviousAdLatency);
        };
        usatAj.execJS($(adParent.id+'_ad'), adReady);
     },
    
//// showDebug ///
    // just delegate to usatAj
    showDebug: function() {usatAj.showDebug.apply(usatAj, arguments)},

//// Ajax and Subst ////
    rH: function(wID, handler) {
        /* wID: instance name of a widget object
         * handler: ajax response handler function
         *    return response handler such that widget object will be "this" for the handler function
         *    somewhat like prototype's .bind() method for functions, except
         *    when the widget has a "WidgetRender" method, we defer the 
         *    response handler until after that method has been run.  This 
         *    allows for batched ajax initialization well before the page is
         *    ready for the ajax update.  [Note: as of Jan 2007, nothing cares.]
         */
        var This= this;
        return function() {
            if (!handler) return;
            var obj= This._wObjects[wID];
            if (obj.onPage) {
                handler.apply(obj.widget, arguments);
            } else {
                obj.toActivate.Todo(
                    function() {
                        handler.apply(obj.widget, arguments)
                    }
                );
            }
        }
    },
    Ajax: function(wID, url, handler, errH, lightWeight) {
        /* wID: instance name of a widget object
         * rH: ajax response handler function for success case
         * errH: ajax response handler function for error case
         *    delegate ajax to usatAj, 
         *    ensuring response handlers are evaluated as members of widget instance object, 
         *    and typically supporting REPLACME patterns to plug widget specific values into successful response text
         */
        var This= this;
        usatAj.ajax(url, this.rH(wID, handler), this.rH(wID, errH), lightWeight);
    },
    PAjax: function(wID, url, body, handler, errH, lightWeight) {
        /* wID: instance name of a widget object
         * rH: ajax response handler function for success case
         * errH: ajax response handler function for error case
         *    delegate ajax to usatAj, 
         *    ensuring response handlers are evaluated as members of widget instance object, 
         *    and typically supporting REPLACME patterns to plug widget specific values into successful response text
         */
        var This= this;
        usatAj.pajax(url, body, this.rH(wID, handler), this.rH(wID, errH), lightWeight);
    }
};

/* pending queue for drag/drop initializations which need to be deferred until
 * dynamic load of scriptaculous has completed */
var usatWidg= new UsatWidg('usatWidg');
