/* classes:
 * MYUS -- support class for myusatoday.com
 * MYUSWell -- associated widget class
 */
 
/* Javascript functions for the NewsGator RSS Reader */
function FeedWell2(config) {
    if (!this.Debug)
        this.Debug= usatAj.Debug;
    this._configCols= config.configCols || 3;
    this._currentSection= config.section;
    this._myName= config.widgetName;
    this._prefix= config.wID;
    this._wellFeeds= this.emptyWell();
    this._widgetConfig= config;
    this.showDebug(1, 'constructor');
}

FeedWell2.prototype= {
    /*  state variables initialized elsewhere:
        _debugConfig    debugging
        _lastError      debugging
        _myName         constructor     // name of variable equivalent to this
        _prefix         constructor     // disambiguating prefix for html
        _verticalBannerKey  wellHtml    // VB goes after 1st post or next to 2nd?
        _wellFeeds                      // users's feeds go here
        _widgetConfig   constructor     // for interactions with usatWidg
    */
    _chicletUrl: '',            // arbitrary (but valid for this section) url to subscribe to
    _configFeeds: {length: 0},  // support subscribing to these feeds from this page
    _currentSection: 'news',    // which well are we working with?
    _deleteHack: [],            // work around because part of state free protocol is not implemented
    _lastNag: 'all',            // last place we stuck a nag
    _loginStatus: ['ATWstarting'], // current state for UAS event machine
    _needConfig: true,          // true until we get config structure from server
    _needFeeds: true,           // true when we need a new center well
    _needRequest: true,         // true when we must talk to server, but can't yet
    _oasAdHtml: {               // html for ads
        Poster3: '',
        VerticalBanner: ''
    },
    _pendingRequest: false,     // true any time we are waiting for the server
    _registering: false,        // special rules for new registration
    _rendered: false,           // is widget container html on page yet?
    _subscriptions: [],         // urls for desired feeds
    _userID: null,              // which user are we working for? (null: logged out)
    
    // showDebug: try to report something, somehow, which might help isolate some problem
    showDebug: function(n) {
        for (var p in Object.prototype) {
           delete Object.prototype[p];
        }
        if (n <= this.Debug) {
            // can't rely on prototype
            var t=this._prefix+'FeedWell2 L'+n+' ';
            for (var j= 1; j < arguments.length; j++) {
                t+=arguments[j];
            }
            usatAj.showDebug.apply(usatAj, [t]);
        }
    },
    
    imgUrl: function(imgName) {
        this.showDebug(1, 'imgUrl for ',imgName);
        return usatWidg.ConfigUrl(this._widgetConfig, 'imgDir', imgName);
    },
    
    busyImgHtml: function() {
        return usatAj.transitionImage;
    },
    
    buttonImgUrl: function(which) {
        return this.imgUrl('button'+which+'.gif');
    },
    
    setButtonImg: function(what, which) {
        what.src= this.buttonImgUrl(which);
    },

    ////////////////////////////////////////////////////////////////////////////

    ajax: function(url, rH, errH) {
        this.showDebug(1, 'ajax for ',url);
        if (!rH) rH= function(){};
        usatWidg.Ajax(this._widgetConfig.wID, url, rH, errH);
    },
    pajax: function(url, body, rH, errH) {
        this.showDebug(1, 'pajax for ',url);
        if (!rH) rH= function(){};
        usatWidg.PAjax(this._widgetConfig.wID, url, body, rH, errH);
    },
    
    emptyWell: function() { // no feeds
        return {
            feedID: [],
            expanded: [],
            posts: [],
            xmlUrl: [],
            length: 0
        };
    },
    
    workerBody: function() {
        this.showDebug(1, 'workerBody');
        // snapshot and serialize current state (and needs) for server
        var well= this._wellFeeds;
        this.showDebug(1, 'want subs: ',this._subscriptions);
        this.showDebug(1, 'have subs: ',well.xmlUrl);
        var subs= this._subscriptions.withoutList(well.xmlUrl);
        var n= subs.length;
        this.showDebug(1, n, ' new sub(s): ', subs);
        var urls= subs.concatenate(well.xmlUrl);
        var params= {
        // part 0: who and where are we?
            section: this._currentSection,
            target: this._myName,
            userid: this._userID ?this._userID :'00000000-0000-0000-0000-000000000000',
        // part 1: what do we want to have the server remember for us?
            setwell: 0 < well.length, //                      replace saved config?
            expanded: well.expanded,
            feedid: this._registering ?[] :well.feedID,
            xmlurl: urls.map(function(u){return escape(u)}),
            maxposts: well.posts ?well.posts.pluck('maxPosts') :[],
        // part 2: what do we want to find out?     
            loadconfig: this._needConfig, //                  initialize subscribe pane
            loadfeeds: this._needFeeds //                     get new well content
        };
        this.showDebug(2, 'workerBody requested expansions: ',params.expanded);
        this.showDebug(2, 'workerBody requested feedids: ',params.feedid);
        this.showDebug(2, 'workerBody requested subscriptions: ',params.xmlurl);
        this.showDebug(2, 'workerBody requested maxposts: ',params.maxposts);
        // HACK -- old API does not actually save config when we ask it to
        // as a workaround, try to ennumerate each unsubscribe
        params.del= this._deleteHack;
        this._deleteHack= [];
        this.showDebug(1, 'workerBody hack del: ',params.del);
        // end of HACK
        return usatAj.ToQueryString(params);
    },
    
    waitingForServer: function(yes) {
        this.showDebug(1, 'waitingForServer: ',yes);
        this._pendingRequest= yes;
        if (yes)
            self.status= 'Updating "Across the Web" ...'
        else
            self.status= ''
    },
    
    delegateRequest: function(now) {
        this.showDebug(1, 'delegateRequest');
        if (!this._pendingRequest) {
            this.showDebug(3, 'delegateRequest -- no previous pending request');
            this._needRequest= false; // we are about to send our request to the server
            this.waitingForServer(true);
            var This= this;
            setTimeout(function() {
                This.showDebug(3, 'delegateRequest -- delegating to web server');
                This._needFeeds= 0 == This._wellFeeds.length || This._subscriptions.withoutList(This._wellFeeds.xmlUrl).length > 0;
                This.pajax(usatWidg.ConfigUrl(This._widgetConfig, '', 'feedwellhandler.ashx', 'handler'), This.workerBody(), This.delegateResponse, This.failedResponse);
            }.bind(this), 1);
        } else {
            this.showDebug(3, 'delegateRequest -- need to wait for previous pending request to complete');
            this._needRequest= true; // busy, try again later
        }
    },
    
    delegateResponse: function(msg) { /*ajax CALLBACK*/
        this.showDebug(1, 'delegateResponse ',msg);
        try {
            eval(msg);
            var This= this;
            setTimeout(function(){
                This.concludeServerAction();
            }, 1000);
        } catch (uhoh) {
            usatAj.showError(uhoh);
            this.nagAtwDown();
        }
   },
    
    concludeServerAction: function() {
        this.showDebug(1, 'concludeServerAction');
        this.waitingForServer(false);
        if (this._needRequest) {
            this.showDebug(2, 'delegating postponed requests');
            this.delegateRequest();
        } else {
            /* when user subscribed to something, then unsubscribed, such that we
             * never really needed to update everything, we left the busy indicator
             * active (which is ok, because the saved copy of their account was in
             * an inconsistent state), but when there's clearly nothing more to do
             * we should shut it off */
            var busyIndicator= $(this._prefix+'subscriptionWaiting');
            if (busyIndicator) busyIndicator.innerHTML= '';
        }
    },
    
    failedResponse: function() { /*ajax error CALLBACK*/
        this.showDebug(1, 'failedResponse ');
        this.waitingForServer(false);
        this.nagAtwDown();
    },

    Subscribe: function(xmlUrl) {
        this.showDebug(1, 'Subscribe: ',xmlUrl);
        if (1 != this._loginStatus.length) return;
        this._subscriptions.unshift(xmlUrl);
        var busyIndicator= $(this._prefix+'subscriptionWaiting');
        if (busyIndicator) busyIndicator.innerHTML= this.busyImgHtml();
        this.showDebug(1, 'Subscribe subscriptions: ',this._subscriptions);
        this.delegateRequest();
        var cfg= this.feedConfigId4Url(xmlUrl);
        if (cfg) $(cfg).checked= true;
        this.nagSignIn();
    },
    
    ////////////////////////////////////////////////////////////////////////////
    removeFeed: function(feeds, field, remove) {
        this.showDebug(1, 'removeFeed ',feeds.feedID,' - ',field,': ',remove);
        var j= feeds[field].indexOf(remove);
        if (-1 < j) {
            var sel= [remove].indicesOf(feeds[field]).equal(-1);
            for (var p in feeds)
                if (typeof [] == typeof feeds[p])
                    feeds[p]= feeds[p].copiesList(sel);
            feeds.length= feeds[field].length;
            return true;
        }
        return false;
    },
    
    Unsubscribe: function(xmlUrl, feedID) { /*onclick event*/
        this.showDebug(1, 'Unsubscribe ',xmlUrl,' / ',feedID);
        var really= 1 < this._wellFeeds.length; // don't unsubscribe from last feed
        if (1 != this._loginStatus.length) return;
        var matters;
        if (xmlUrl && really) {
            /*hack*/feedID= this._wellFeeds.feedID[this._wellFeeds.xmlUrl.indexOf(xmlUrl)];
            this._subscriptions= this._subscriptions.without(xmlUrl);
            if (this._wellFeeds.length > 1)
                matters= this.removeFeed(this._wellFeeds, 'xmlUrl', xmlUrl);
        }
        if (feedID /*hack needs this:*/&&!xmlUrl) {
            var j= this._wellFeeds.feedID.indexOf(feedID);
            if (-1 < j) {
                xmlUrl= this._wellFeeds.xmlUrl[j];
                if (really) {
                    this._subscriptions= this._subscriptions.without(xmlUrl);
                    matters= this.removeFeed(this._wellFeeds, 'feedID', feedID);
                }
            }
        }
        if (really) {
            this.showDebug(1, 'Unsubscribe subscriptions: ',this._subscriptions);
            this.showDebug(1, 'Unsubscribe well feeds: ',this._wellFeeds.xmlUrl);
            if (matters) {
                var feed= $(this.feedNodeId(feedID)); if (feed) feed.parentNode.removeChild(feed); // this.setWellHtml();
                this.nagSignIn();
            }
            /*hack*/if (feedID) this._deleteHack.push(feedID);
            this.delegateRequest();
        }
        var cfg= this.feedConfigId4Url(xmlUrl);
        if (cfg) $(cfg).checked= !really;
    },
    
    SetSubscribe: function(xmlUrl, subscribe) { /* checkbox onclick event */
        this.showDebug(1, 'SetSubscribe ',xmlUrl, ' ', subscribe);
        if (subscribe) {
            // HACK START
            var ndx= this._configFeeds.xmlUrl.indexOf(xmlUrl);
            if (0>ndx) return;
            this._deleteHack= this._deleteHack.without(this._configFeeds.feedID[ndx]);
            // HACK END
            this.Subscribe(xmlUrl);
        } else
            this.Unsubscribe(xmlUrl);
    },
    
    changeClass: function(node, before, after) {
        this.showDebug(1, 'changeClass ',node.id,' ',before,' ',after);
        node.className= node.className.replace(before, after);
    },
    
    feedConfigId: function(ndx) {
        if (ndx > -1)
            return this._prefix+'ATWconfigItem'+ndx;
        return '';
    },
    
    feedConfigNdx4Url: function(xmlUrl) {
        var ndx= -1;
        if (this._configFeeds.xmlUrl)
            ndx= this._configFeeds.xmlUrl.indexOf(xmlUrl);
        return ndx;
    },
    
    feedConfigId4Url: function(xmlUrl) {
        return this.feedConfigId(this.feedConfigNdx4Url(xmlUrl));
    },
    
    feedNodeId: function(feedID) {
        this.showDebug(3, 'feedNodeId ',feedID);
        return this._prefix+'li_'+feedID;
    },
    
    feedIDFromNodeId: function(nodeID) {
        this.showDebug(1, 'feedIDFromNodeId ',nodeID);
        if ('string' != typeof nodeID) nodeID= nodeID.id;
        return parseInt(nodeID.replace(/.*_/, ''));
    },
    
    feedIDFromUrl: function(url) {
        var ndx= this.feedConfigNdx4Url(url);
        if (-1 < ndx) return this._configFeeds.feedID[ndx];
        ndx= this._wellFeeds.xmlUrl.indexOf(xmlUrl);
        if (-1 < ndx) return this._wellFeeds.feedID[ndx];
        return null;
    },
    
    feedNodes: function() {
        this.showDebug(1, 'feedNodes');
        var containerName= this._prefix+'ATWfeedDnDContainer';
        var className= 'ATW_'+this._currentSection+'_feed';
        return Element.childrenWithClassName(containerName, className);
    },
    
    setWellOrder: function(feeds, newFeedIDs) {
        this.showDebug(1, 'setWellOrder ',feeds.feedID,' <-- ',newFeedIDs);
        var order= feeds.feedID.indicesOf(newFeedIDs).without(-1); // .without(-1) ignores non-feeds in the well
        this.showDebug(2, 'setWellOrder indices ',order);
        // re-order feeds so its feedID field matches feedIDs 
        // (if anything is out of sync between the two, unknown feeds move to front)
        this.showDebug(3, 'setWellOrder feedID before: ',feeds.feedID);
        for (var p in feeds)
            if (typeof [] == typeof feeds[p])
                feeds[p]= feeds[p].index(order);
        this.showDebug(3, 'setWellOrder feedID after: ',feeds.feedID);
        feeds.length= feeds.feedID.length;
        return feeds;
    },
    
    /* Save sort order after reordering */
    saveSort: function() { // callback for scriptaculous DnD
        this.showDebug(1, 'saveSort');
        var nodes= this.feedNodes();
        var newFeedIDs= nodes.map(this.feedIDFromNodeId.bind(this));
        this._wellFeeds= this.setWellOrder(this._wellFeeds, newFeedIDs);
        this.showDebug(1, 'saveSort well feeds: ',this._wellFeeds.xmlUrl);
        this.setWellHtml();
        if (this._userID)
            this.delegateRequest()
        else
            this.nagSignIn(this._draggedFeed);
    },
    
    feedExpandClass: function(vis, re) {
        if (re)
            return vis ?/ATWfeedExpand/ :/ATWfeedCollapse/;
        else
            return vis ?'ATWfeedExpand' :'ATWfeedCollapse';
    },
    
    expandCollapseImageID: function(feedID) {
        return this._prefix+'arrow'+feedID;
    },
    
    expandCollapseImageSrc: function(expand) {
        if (expand) // image indicates future state, not current state
            return this.imgUrl('minusHdr.gif');
        else
            return this.imgUrl('plusHdr.gif');
    },
    
    SetExpand: function(feedID, expand) { /*onclick event*/
        this.showDebug(1, 'SetExpand ',feedID,': ',expand);
        if (1 != this._loginStatus.length) return;
        var trivial= true, feedNodes, J;
        if ('all' == feedID) {
            feedNodes= this.feedNodes();
            J= feedNodes.length.count()
        } else {
            feedNodes= [$(this.feedNodeId(feedID))];
            J= [this._wellFeeds.feedID.indexOf(feedID)];
        }
        for (var j= 0; j < J.length; j++) {
            if (this._wellFeeds.expanded[J[j]] == expand) continue;
            trivial= false;
            this._wellFeeds.expanded[J[j]]= expand;
            el= feedNodes[j];
            if (expand)
                this.changeClass(el, this.feedExpandClass(0, 1), this.feedExpandClass(1));
            else
                this.changeClass(el, this.feedExpandClass(1, 1), this.feedExpandClass(0));
            var img= $(this.expandCollapseImageID(this._wellFeeds.feedID[J[j]]))
            if (img) img.src= this.expandCollapseImageSrc(expand);
            
        }
        if (!trivial)
            if (this._userID)
                this.delegateRequest()
            else
                this.nagSignIn(feedID);
    },
    
    ToggleFeed: function (feedID) { /*onclick event*/
        this.showDebug(1, 'toggleFeed ',feedID);
        var feeds= this._wellFeeds;
        var j= feeds.feedID.indexOf(feedID);
        this.SetExpand(feedID, !feeds.expanded[j]);
    },
    
    feedPostId: function(feedID, n) {
        this.showDebug(3, 'feedPostId ',feedID,' ',n);
        return this._prefix+'Row'+feedID+'_'+n;
    },
    
    feedPostCountId: function(feedID) {
        this.showDebug(3, 'feedPostCountId ',feedID);
        return this._prefix+'NumberOfPosts'+feedID;
    },
    
    getPost: function(feedID, k) {
        this.showDebug(1, 'getPost ',feedID,' ',k);
        return $(this.feedPostId(feedID, k));
    },

    postVisClass: function(vis, re) {
        if (re)
            return vis ?/ATWpostVis/ :/ATWpostInvis/;
        else
            return vis ?'ATWpostVis' :'ATWpostInvis';
    },

    AdjustPosts: function(feedID, delta) { /* onclick event */
        this.showDebug(1, 'AdjustPosts ',feedID,' ',delta);
        if (1 != this._loginStatus.length) return;
        var j= this._wellFeeds.feedID.indexOf(feedID);
        var posts= this._wellFeeds.posts[j];
        var n= Math.min(posts.length, Math.max(1, posts.maxPosts+delta));
        if (n != posts.maxPosts) {
            if (n < posts.maxPosts) /* decrease max posts */
                for (var k= n; k < posts.maxPosts; k++)
                    this.changeClass(this.getPost(feedID, k), this.postVisClass(1, 1), this.postVisClass(0));
             else
                for (var k= posts.maxPosts; k < n; k++)
                    this.changeClass(this.getPost(feedID, k), this.postVisClass(0, 1), this.postVisClass(1));
            $(this.feedPostCountId(feedID)).innerHTML= posts.maxPosts= n;
            if (this._userID)
                this.delegateRequest()
            else
                this.nagSignIn(feedID);
        }
    },

    usatinfo: function() {
        this.showDebug(1, 'usatinfo');
        return usatAj.GetCookieObject('USATINFO');
    },

    /* respect UAS state */
    updateAuthState: function(newState) {
        this.showDebug(1, 'updateAuthState preparing for ',newState);
        return function() {
            this.showDebug(1, 'updateAuthState ',newState,' CallBack from: ',this._loginStatus);
            var states= this._loginStatus;
            var status= states[states.length-1];
            if (status != newState || states.length > 1) {
                if (this._pending) { // hold off on processing new state if we have pending server requests
                    if (states.length==1)
                        states.push(newState);
                } else {
                    var userID= ('Signed Out' == newState) ?null :this.usatinfo().UserID;
                    var reload= states[0] != newState || userID != this._userID;
                    if (reload) {
                        this._userID= userID; // do all this for the new user
                        this._deleteHack= []; // pure paranoia -- should be a no-op
                        if ('Registering' == newState) {
                            this._subscriptions= this._wellFeeds.xmlUrl;
                        } else {
                        // we have no pending requests, and we essentially have a new user
                            this._feedNodes= null; // clear well dom cache
                            this._needConfig= true; // request config block
                            if (this._loginStatus[0] != 'ATWstarting') this._subscriptions= []; // forget about subscription requests (except for chiclet case)
                            this._configFeeds= {length:0}; // meanwhile, forget about old uers's config
                            this._wellFeeds= this.emptyWell(); // and about old user's well
                            this.setConfigHtml(); // display new state
                            this.setWellHtml();
                        }
                        if (this._chicletUrl)
                            this.Subscribe(this._chicletUrl);
                        else
                            this.delegateRequest();
                        if (userID)
                            this._chicletUrl= ''; // don't try subscribing if user eventually signs out
                        this.clearNag();
                    }
                    this._loginStatus= [newState];
                }
            }
        }.bind(this);
    },
    
    
    /* Make the feeds sortable */
    enableDragDrop: function() {
        this.showDebug(1, 'enableDragDrop');
        var dndID= this._prefix+'ATWfeedDnDContainer';
        var container= $(dndID);
        if (container) {/* don't throw error when feeds are down */
            var This= this;
            var handle= Element.childrenWithClassName(container, 'ATWfeedDnDHandle');
            handle.each(function(e) {
                Event.observe(e, 'mousedown', This.rememberDraggedFeed.bind(This))
            });
            usatWidg.EnableDragDrop(dndID, {
                handle: 'ATWfeedDnDHandle',
                onUpdate: this.saveSort.bind(this),
                scroll: window
            });
        }
            
    },
    
    rememberDraggedFeed: function(e) {
        if (e.target && e.target.id) {
            var id= e.target.id;
            this.showDebug(2, 'rememberDraggedFeed', id);
            this._draggedFeed= this.feedIDFromNodeId(id);
        }
    },

    handleFaviconError: function( img ) { /*EVENT*/
        this.showDebug(1, 'handleFaviconError ',img);
        img.src= this.imgUrl('favicon_default.gif');
    },
    
/* ===========================================================================*/
/*  Nag support                                                               */
/* ===========================================================================*/

    setNag: function(where, text, permanent) {
        this.showDebug(2, 'setNag ',where,': ',text);
        var nag= $(this._prefix+where);
        if (!nag) return;
        nag.innerHTML= text;
        if (text) {
            this.showDebug(3, 'setNag +');
            if (!permanent) this._lastNag= where;
            nag.className= text ?'ATWnag' :'';
        } else {
            this.showDebug(3, 'setNag -');
            nag.className= '';
        }
    },
    
    clearNag: function() {
        this.showDebug(2, 'clearNag');
        this.setNag(this._lastNag, '');
    },
    
    nagSignIn: function(where) {
        this.showDebug(2, 'nagSignIn ',where,' -- ',this._userID);
        if (this._userID) return;
        if (!where) where= 'all';
        this.clearNag();
        var t= '';
        var emit= function(txt){t+=txt};
        emit('<br />');
        emit('You must register or be logged in to keep changes. ');
        emit('<a href="javascript:void(\'Login\')" onclick="'+this._myName+'.DelegateSignIn()">');
        emit(' Login</a> | ');
        emit('<a href="javascript:void(\'Register\')" onclick="'+this._myName+'.DelegateRegister()">');
        emit(' Register</a>');
        emit('<br />&nbsp;');
        this.setNag(where+'Nag', t);
    },
    
    DelegateSignIn: function() {
        this.showDebug(1, 'DelegateSignIn');
        usatAuth.em.showLoginForm();
    },
    
    DelegateRegister: function() {
        this.showDebug(1, 'DelegateRegister');
        usatAuth.em.showRegisterForm();
    },

    nagConfigDown: function() {
        this.showDebug(1, 'nagConfigDown');
        var t= '';
        var emit= function(txt){t+=txt};
        emit('<br /><br />');
        emit('Customization for "Across the Web" is temporarily unavailable<br />');
        emit('Please try later. We apologize for the inconvenience.');
        emit('<br /><br />&nbsp;');
        this.setNag('folder_ul', t, true);
    },
    
    nagAtwDown: function() {
        this.showDebug(1, 'nagConfigDown');
        this._needRequest= false; // we're in an error state
        this._needResponse= false;
        var t= '';
        var emit= function(txt){t+=txt};
        emit('<br /><br />');
        emit('"Across the Web" is temporarily unavailable.  Please try later.<br />');
        emit('Please try later. We apologize for the inconvenience.');
        emit('<br /><br />&nbsp;');
        this.setNag('down', t, true);
    },

/* ===========================================================================*/
/*  Widget support                                                            */
/* ===========================================================================*/
    TabSetup: function() { /* first widget life cycle event */
	if (this._tabNotSetup) {
		this._tabNotSetup= false;
       	}


        // make sure relevant content is available for this page
        this.showDebug(1, 'WidgetSetup -- might wait for UAS');
        usatWidg.waitUntil(function(){return self.usatAuth && usatAuth.em},
            function() {
                this.showDebug(1, 'WidgetSetup -- have usatAuth');
                usatAuth.em.addLoginHandler(this.updateAuthState('Signed In'));
                usatAuth.em.addLogoutHandler(this.updateAuthState('Signed Out'));
                usatAuth.em.addRegistrationHandler(this.updateAuthState('Registering'));
                this._chicletUrl= usatAj.GetQueryObject().atwSubscribe;
                this.showDebug(1, 'WidgetSetup -- _chicletUrl: ',this._chicletUrl);
                // ugly inspection of UAS internal state
                if ('initializing' != usatAuth.appStatus) {
                    this.showDebug(1, 'UAS has already initialized');
                    this.updateAuthState(this.usatinfo().Status)();
                }
            }.bind(this));
    },
    
    GetConfig: function(js) { /* callback from server */
        // retrieve initial config state from server
        this.showDebug(1, 'GetFolders ',js);
        this._debugConfig= js;
        try {
            this._configFeeds= eval(js);
            this._needConfig= false;
            if (this._rendered) 
                this.setConfigHtml();
        } catch (uhoh) {
            this.GetConfigError();
        }
    },
    
    GetConfigError: function() { /* error callback */
        this._needConfig= false;
        this.nagConfigDown();
    },
    
    GetFeeds: function(js) { /* callback from server */
        // process rss feeds from server
        this.showDebug(1, 'GetFeeds ',js);
        var feeds= eval(js);
        for (var j= 0; j<feeds.length; j++) // HACK -- override bogus values
            if (!feeds.posts[j].maxPosts)
                feeds.posts[j].maxPosts= Math.min(3, feeds.posts[j].length);
        var subscriptionHack= false;
        if (this._wellFeeds.length) {
            // prepend desired feeds to feeds we already have
            var J= feeds.xmlUrl.indicesOf(this._subscriptions.withoutList(this._wellFeeds.xmlUrl)).without(-1);
            if (J.length) {
                var r= {};
                for (var p in feeds)
                    if (typeof feeds[p] == typeof [])
                        r[p]= feeds[p].index(J).concatenate(this._wellFeeds[p]);
                r.length= r.xmlUrl.length;
                this._wellFeeds= r;
                this.showDebug(1, 'GetFeeds updated well feeds: ',this._wellFeeds.xmlUrl);
            }
        } else {
            // initialize our state based on server's saved copy of our state
            subscriptionHack= true;
            this._wellFeeds= feeds;
            this.showDebug(1, 'GetFeeds new well feeds: ',this._wellFeeds.xmlUrl);
            this._subscriptions= feeds.xmlUrl.clone();
            this.showDebug(1, 'GetFeeds subscriptions: ',this._subscriptions);
        }
        if (this._rendered) {
            this.activateFeeds();
        }
        if (subscriptionHack) // another hack -- we're not always treating our initial subscriptions as subscribed
            for (var j= 0; j < feeds.length; j++) {
                var cfg= this.feedConfigId4Url(feeds.xmlUrl[j]);
                if (cfg)
                    $(cfg).checked= true;
            }
    },
    
    WidgetRender: function() { /* widget lifecycle event */
        // place widget containers on page
        this.showDebug(1, 'WidgetRender');
        var t='';
        var emit= function(txt) {t+= txt+'\n';}
        emit('<div class="ATWwidgetContainer">');
        emit(' <div class="ATWlongName">Our picks from across the web</div>');
        emit(' <div class="ATWdescription">');
        emit('  Read the editor\'s selection of feeds or make your own');
        emit('  selections below.');
        emit(' </div>');
        emit(' <div id="'+this._prefix+'down">');
        emit('  <br />');
        emit('  <div id="'+this._prefix+'folder_ul" class="ATWcontrols">');
        emit(this.busyImgHtml());
        emit('  </div>');
        emit('  <div class="ATWcontrols ATWcontrolsExpandCollapse">');
        emit('   <a class="ATWcontrolsExpandCollapseImg"');
        emit('   onclick="'+this._myName+'.SetExpand(\'all\', true);"');
        emit('   href="javascript:void(\'Expand all\')">');
        emit('    <img src="'+this.expandCollapseImageSrc(0)+'" />');
        emit('   </a>');
        emit('   <a onclick="'+this._myName+'.SetExpand(\'all\', true);"');
        emit('   href="javascript:void(\'Expand all\')">');
        emit('    Expand all');
        emit('   </a>');
        emit('   <a class="ATWcontrolsExpandCollapseImg"');
        emit('   onclick="'+this._myName+'.SetExpand(\'all\', false);"');
		emit('   href="javascript:void(\'Collapse all\')">');
		emit('    <img src="'+this.expandCollapseImageSrc(1)+'" />');
		emit('   </a>');
        emit('   <a onclick="'+this._myName+'.SetExpand(\'all\', false);"');
		emit('   href="javascript:void(\'Collapse all\')">');
		emit('    Collapse all');
        emit('   </a>');
        emit('  </div>');
        emit('  <div id="'+this._prefix+'allNag"></div>');
        emit('  <div class="ATWfeedsContainer">');
        emit('   <div id="'+this._prefix+'wellContents">');
        emit('    <ul id="'+this._prefix+'ATWfeedDnDContainer">');
        emit(this.busyImgHtml());
        emit('    </ul>');
        emit('   </div>');
        emit('  </div>');
        emit(' </div>');
        emit('<div id="'+this._prefix+'shelf"></div>');
        emit('</div>');
        this._rendered= true;
        this.showDebug(1, 'html rendered');
        return t;
    },

    WidgetActivate: function() { /* final widget life cycle event */
        // make sure everything is ready
        this.showDebug(1, 'WidgetActivate');
        //this.activateFeeds();
        //this.setConfigHtml();
        // setTimeout(this.DeliverAds.bind(this), 10000); // simulate tab opening after 10 seconds
    },
      
    DeliverAds: function() {
        if (usatAj.scriptNotBroken)
            this.ajax('http://ad.usatoday.com/RealMedia/ads/adstream_sx.ads/www.usatoday.com'+document.location.pathname.toLowerCase()+'@VerticalBanner,Poster3?'+new Date().getTime(), this.adDeliveryHandler);
    },
    
    activateFeeds: function() {
        /* populates ATWfeedDnDContainer and feed_ul0 */
        this.showDebug(1, 'activateFeeds')
        if (this._wellFeeds.length) { // received feeds from server?
            this.showDebug(1, 'activateFeeds...have this._wellFeeds')
            var ATWfeedDnDContainer= $(this._prefix+'ATWfeedDnDContainer');
            if (ATWfeedDnDContainer) { // page ready for feeds?
                this.showDebug(1, 'activateFeeds...have this._wellFeeds, and ATWfeedDnDContainer')
                this.setWellHtml();
            }
        }
    },
    
    setConfigHtml: function() {
        // make sure that config area is on page
        this.showDebug(1, 'setConfigHtml');
        if (this._configFeeds) {
            this.showDebug(1, 'setConfigHtml...have this._configFeeds');
            var folder_ul= $(this._prefix+'folder_ul');
            if (folder_ul) {
                this.showDebug(1, 'setConfigHtml...have this._configFeeds and folder_ul');
                var folderText= this.configHtml(this._configFeeds);
                folder_ul.innerHTML= folderText;
            }
        }
    },
    
    wellHtml: function(feeds) {
        // the meat of the center well
        this.showDebug(1, 'wellHtml ',feeds.feedID);
        if (!feeds || !feeds.length) return this.busyImgHtml();
        var t= [];
        var emit= function(txt) {t.push(txt);}
        emit('<li id="'+this._prefix+'subscriptionWaiting">');
        if (this._subscriptions.withoutList(feeds.xmlUrl).length)
            emit(this.busyImgHtml());
        emit('</li>');
        this._verticalBannerKey= Math.min(1, feeds.length-1);
        this.showDebug(1, 'Vertical Banner Key: ',this._verticalBannerKey);
        for (var j= 0; j < feeds.length; j++) {
            var posts=feeds.posts[j];
            if (!posts) { // something is broken -- try to ignore it.
                feeds.posts[j]= {};
                continue
            };
            // posts.maxPosts= Math.min(posts.maxPosts, posts.length);
            emit('<li id="'+this.feedNodeId(feeds.feedID[j])+'"');
            emit('class="ATW_'+this._currentSection+'_feed '+this.feedExpandClass(feeds.expanded[j])+'">');
            emit(' <div class="ATWcomment">');
            emit('  '+feeds.buildDate[j]+'</div>');
            emit(' <div class="ATWfeedDnDHandle">');
            emit('  <div class="ATWfeedTitle">');
            emit('   <img src="'+this.expandCollapseImageSrc(feeds.expanded[j])+'"');
            emit('     class="ATWfeedArrow" id="'+this.expandCollapseImageID(feeds.feedID[j])+'"');
            emit('     onClick="'+this._myName+'.ToggleFeed('+feeds.feedID[j]+');"');
            emit('     title="Collapse this source" />');
            emit('   <div class="ATWfaviconContainer">');
            emit('    <img src="'+feeds.faviconUrl[j]+'" class="ATWfavicon"');
            emit('    onerror="'+this._myName+'.handleFaviconError(this)" />');
            emit('   </div>');
            emit('   <div class="ATWfeedTitleText" id="titleFor'+this.feedNodeId(feeds.feedID[j])+'">'+feeds.title[j]+'</div>');
            emit('   <div class="ATWfeedDecreasePosts ATWfeedValue">');
            emit('    <a class="decreasePostsA" href="javascript:void(0)"');
            emit('    onClick="'+this._myName+'.AdjustPosts('+feeds.feedID[j]+', -1)">');
            emit('     <img src="'+this.buttonImgUrl('Down')+'" onmousedown="'+this._myName+'.setButtonImg(this, \'DownPushed\')"');
            emit('     onmouseup="'+this._myName+'.setButtonImg(this, \'Down\')"');
            emit('     class="ATWfeedButton" id="'+this._prefix+'buttonDown'+feeds.feedID[j]+'" />');
            emit('    </a>');
            emit('   </div>');
            emit('   <div id="'+this.feedPostCountId(feeds.feedID[j])+'" class="ATWfeedNumber ATWfeedValue">'+posts.maxPosts+'</div>');
            emit('   <div class="ATWfeedIncreasePosts ATWfeedValue">');
            emit('    <a class="ATWincreasePostsA" href="javascript:void(0)"');
            emit('    onClick="'+this._myName+'.AdjustPosts('+feeds.feedID[j]+', 1)">');
            emit('     <img src="'+this.buttonImgUrl('Up')+'" onmousedown="'+this._myName+'.setButtonImg(this, \'UpPushed\')"');
            emit('     onmouseup="'+this._myName+'.setButtonImg(this, \'Up\')"');
            emit('     class="ATWfeedButton" id="'+this._prefix+'buttonUp'+feeds.feedID[j]+'" />');
            emit('    </a>');
            emit('   </div>');
            emit('  </div>');
            emit('  <div class="ATWfeedTitleRight">');
            emit('   <div class="ATWfeedClose"');
            emit('   onClick="'+this._myName+'.Unsubscribe(null, '+feeds.feedID[j]+');"');
            emit('   title="Remove"></div>');
            emit('  </div>');
            emit(' </div>');
            emit(' <div id="'+this._prefix+feeds.feedID[j]+'Nag"></div>');
            var vbClass= '';
            if (this._verticalBannerKey == j && usatWidg.NonEmptyAd(this._oasAdHtml.VerticalBanner)) {
                vbClass= ' ATWfeedWithVerticalBanner';
            }
            emit(' <div class="ATWfeedView'+vbClass+'" id="'+this._prefix+'feed'+feeds.feedID[j]+'">');
            emit('  <div id="'+this._prefix+'xmlUrl'+feeds.feedID[j]+'" class="ATWcomment">');
            emit('  '+feeds.xmlUrl[j]+'</div>');
            emit('  <div class="ATWfeedBox" id="'+this._prefix+'feedsBox'+feeds.feedID[j]+'">');
            for (var k= 0; k < posts.length; k++) {
                emit('   <div id="'+this.feedPostId(feeds.feedID[j], k)+'" ');
                var disp= this.postVisClass(k < posts.maxPosts);
                emit('   class="ATWpost '+disp+'">');
                emit('    <div class="ATWpostLinkContainer">');
                emit('     <a href="'+posts.url[k]+'"');
                emit('     class="ATWpostLink" target="_blank">'+posts.title[k]+'</a>');
                emit('    </div>');
                emit('    <div class="ATWpostText">'+posts.body[k]+'</div>');
                emit('    <div class="ATWpostDate">'+posts.date[k]);
                emit('    </div>');
                emit('   </div>');
            }
            emit('  </div>'); 
            emit(' </div>');
            if (this._verticalBannerKey == j) {
                emit(' <div id="'+this._prefix+'VerticalBannerParent"');
                emit(' class="ATWVerticalBannerAd">');
                emit('  <div id="'+this._prefix+'VerticalBanner">')
                emit('  </div>');
                emit(' </div>');
            }
            emit('</li>');
            if (0 == j) {
                emit('   <li id="'+this._prefix+'Poster3Parent">');
                emit('    <div id="'+this._prefix+'Poster3" class="ATWPosterAd"></div>');
                emit('   </li>');
            }
            this.showDebug(1, 'Vertical Banner key: ', Math.min(1, feeds.length-1));
            var vb= Math.min(1, feeds.length-1) == j;
        }
        emit('');
        // this.showDebug(t);
        return t.join('\n');
    },
    
    makeRoomForVb: function() {
        this.showDebug(1, 'makeRoomForVb');
        if (usatWidg.NonEmptyAd(this._oasAdHtml.VerticalBanner)) {
            this.showDebug(1, 'Trying to fix up VerticalBanner companion style');
            var vbFeed= $(this._prefix+'feed'+this._wellFeeds.feedID[this._verticalBannerKey]);
            if (vbFeed) {
                this.showDebug(1, 'Setting class for VerticalBanner companion');
                vbFeed.className+= ' ATWfeedWithVerticalBanner';
            }
        }
    },
    

    
    setWellHtml: function() {
        this.showDebug(1, 'setWellHtml');
        this._feedNodes= null;
        var wellNodes= $(this._prefix+'ATWfeedDnDContainer');
        var This= this;
        if (!wellNodes) {// DOM is being sluggish, so wait it out...
            usatWidg.waitUntil(function() {
                return $(This._prefix+'ATWfeedDnDContainer')
            }, This.setWellHtml.bind(This));
            return;
        }
        var html= this.wellHtml(this._wellFeeds);
        // wellNodes.innerHTML= html -- except preserve ads if they already exist, 
        // or include them for the first time if possible
        // Also: if we've got a vertical banner, tell the feed that it's
        //       next to that it needs to be polite to the banner
        var vb= $(this._prefix+'VerticalBanner');
        var p3= $(this._prefix+'Poster3');
        var shelf= $(this._prefix+'shelf');
        usatAj.moveTo(shelf, vb);
        usatAj.moveTo(shelf, p3);
        wellNodes.innerHTML= html;
        this.resetAd('VerticalBanner', vb);
        this.makeRoomForVb();
        this.resetAd('Poster3', p3);
        this.enableDragDrop();
    },
    
    trimTo: function(txt, maxLen) {
        if (txt.length <= maxLen) return txt;
        var t= txt.substring(0, maxLen+1);
        var n= t.lastIndexOf(' ');
        var t= (n > maxLen/2) ?t.substring(0,n) :t.substring(0, maxLen);
        return t.replace(/[ \-:&|]+$/, '');
    },
    
    configHtml: function(configFeeds) {
        var nCol=this._configCols; /* number of columns */
        this.showDebug(1, 'configHtml (',nCol,' columns)');
        if (!configFeeds || !configFeeds.length) return this.busyImgHtml();
        // the meat of the config area
        var t= [];
        var emit= function(txt) {t.push(txt);}
        emit('<div class="ATWcontrolContainer">');
        emit(' <table border="0" cellspacing="0" cellpadding="0" width="474px"><tr>');
        var len= configFeeds.length;
        // var pct= parseInt(100/nCol); // css width of a single element
   	    var nRow= 1+parseInt((configFeeds.length-1)/nCol);
	    var sum= -1; var J= [nRow,nCol].count(
	        ).transpose().flatten().map(function(y){return sum+=len>y ?1 :0}).reshape(nCol,nRow
	        ).transpose().flatten();
        this.showDebug(1, 'Columnized order: ',J);
        for (var k= 0; k < len; k++) {
            if (k && 0 == k%nCol) emit('  </tr><tr>');
            var j= J[k];
            var onclick= 'onClick="'+(configFeeds.isValid[j] ?'setTimeout(function(){'+this._myName+'.SetSubscribe(\''+configFeeds.xmlUrl[j]+'\',!$(\''+this.feedConfigId(j)+'\').checked)},1);' :'')+'return false"';
            emit('   <td class="ATWcontrolContainer ATWcontrolCell'+(configFeeds.isValid[j] ?(configFeeds.editorsChoice[j] ?' ATWeditorsChoice' :'') :' ATWinvalidChoice')+'"');
            emit('   title="'+(configFeeds.isValid[j] ?(configFeeds.editorsChoice[j] ?'Editor\'s Choice: ' :'')+configFeeds.title[j] :'This feed seems to be having temporary problems')+'"');
            emit('   valign="top" '+onclick+' width="158px">');
            emit('    <table border="0" cellspacing="0" cellpadding="0"><tr><td valign="top" width="16px" height="18px" align="left">');
            emit('       <input type="checkbox" id="'+this.feedConfigId(j)+'" value="'+configFeeds.feedID[j]+'"');
            emit('       '+(configFeeds.isValid[j] ?(configFeeds.subscribed[j] ?'checked' :'') :'disabled')+' height="11px" width="11px"');
            emit('        style="height: 11px; width: 11px; padding: 0px; vertical-align: top" />');
            emit('      </td><td valign="top" width="16px">');
            emit('       <img class="ATWfavicon" src="'+configFeeds.faviconUrl[j]+'" onerror="'+this._myName+'.handleFaviconError(this)" />');
            emit('      </td><td valign="top" width="120px">');
            emit('       '+this.trimTo(configFeeds.title[j], 20));
            emit('   </td></tr></table></td>');
        }
        emit(' </tr></table>');
        emit('</div>');
        emit('<div class="ATWcontrolContainer">');
        emit(' <br />');
        emit(' <img src="'+this.imgUrl('powered_by_newsgator.gif')+'" />');
        emit('</div>');
        emit('');
        return t.join('\n');
    },
    
    setAd: function(id, html) {
        this.showDebug(1, 'setAd ',id);
        // place ad on page
        var parent= 'string' == typeof id ?$(this._prefix+id) :id;
        this.showDebug(1, 'Putting ad in ', parent.id);
        parent.innerHTML= html;
        parent.className= parent.className.replace(/ ATWemptyAd/, '');
        if (!usatWidg.NonEmptyAd(html))
            parent.className+= ' ATWemptyAd';
        usatAj.execJS(parent);
    },
    
    resetAd: function(id, ad) {
        this.showDebug(1, 'resetAd ',id,' ',ad);
        if (ad && this.Debug > 2) this.showDebug(3, ad.innerHTML);
        // preserve existing ad (so we don't deliver too many)
        // or deliver new ad (because it's time)
        // or don't do anything (because there's no point)
        var parent= $(this._prefix+id+'Parent');
        if (parent) {
            this.showDebug(1, 'Have ', this._prefix,id, 'Parent');
            if (ad) {
                this.showDebug(1, 'Appending ad...');
                usatAj.moveTo(parent, ad);
            } else if (this._oasAdHtml[id]) {
                this.showDebug(1, 'Deferred ad delivery');
                this.setAd(id, this._oasAdHtml[id]);
            } else {
                this.showDebug(1, 'setting well, ', id, ' not available, yet');
            }
        } else {
            this.showDebug((ad ?'LOST ' :'MISSING '),id);
        }
    },
    
     adDeliveryHandler: function(sx) {
        this.showDebug(1, 'adDeliveryHandler');
        var keys= sx.match(/<!--OAS AD=\"\w+(?=\"-->)/g).join('\n').match(/\w+$/mg);
        var vals= sx.split(/<!--OAS AD=\"\w+\"-->/);
        if (vals.length > keys.length) vals.shift(); // maybe remove blank before first divider
        for (var j= 0; j < keys.length; j++) {
            this.showDebug(1, 'Got ad for ',keys[j]);
            this.showDebug(vals[j],'\n_______________');
            this._oasAdHtml[keys[j]]= vals[j];
            var pos= $(this._prefix+keys[j]);
            if (pos) {
                this.showDebug(1, 'Setting ad for ',keys[j]);
                if ('VerticalBanner' == keys[j]) this.makeRoomForVb();
                this.setAd(keys[j], vals[j]);
            } else {
                this.showDebug(this._prefix,keys[j],' not on page');
            }
        }
    },

    placeholder: 'everything above has a comma'
};

 // code below this point is released under the same
 // copyright as prototype.js.

 Object.extend(Number.prototype, {
    count: function() {
        // array of this many counting numbers
        var r= [];
        for (var j= 0; j < this; j++) {
            r.push(j);
        }
        return r;
    }
});
 
 Object.extend(Array.prototype, {
    add: function(y) {
        var r= new Array(this.length);
        for (var j= 0; j < this.length; j++) r[j]= this[j]+y;
        return r;
    },
    
    clone: function() {
        var r= new Array(this.length);
        for (var j=0; j < this.length; j++) r[j]= this[j];
        return r;
    },
    
    concatenate: function(y) {
        //if (!y) return this.clone();
        var r= new Array(this.length+y.length);
        for (var j= 0; j < this.length; j++) r[j]= this[j];
        for (var j= 0; j < y.length; j++) r[this.length+j]= y[j];
        return r;
    },
    
    copies: function(y) {
        var r= [];
        for (var j= 0; j < this.length; j++)
            for (var k= 0; k < y; k++)
                r.push(this[j]);
        return r;
    },
    
    copiesList: function(y) {
        var r= [];
        for (var j= 0; j < y.length; j++)
            for (var k= 0; k < y[j]; k++)
                r.push(this[j]);
        return r;
    },
    
    count: function() {
        return [].reshape.apply(this.product().count(), this)
    },
    
    equal: function(y) {
        var r= new Array(this.length);
        for (var j= 0; j < this.length; j++) {
            r[j]= y == this[j] ?1 :0;
        }
        return r;
    },
    
    equalList: function(y) {
        var r= new Array(this.length);
        for (var j= 0; j < this.length; j++) {
            r[j]= y[j] == this[j] ?1 :0;
        }
        return r;
    },  
    
    index: function(y) {
        // index this array by argument array
        var r= [];
        for (var j= 0; j < y.length; j++) {
            r.push(this[y[j]]);
        }
        return r;
    },
 
    gradeUp: function() {
        // indices which would sort this array
        var y= this;
        return (y.length+0).count().sort(function(left, right) {
            var L= y[left];
            var R= y[right];
            return L<R ?-1 : L>R ?1 :0;
        });
    },
    
    indicesOf: function(y) {
        // array of indices of y in this
        if (!this.length) return [-1].reshape(y.length);
        var J= this.gradeUp();
        if (!y.gradeUp || !y.gradeUp.bind) {
            var uhoh= 'bad, bad, bad';
        }
        var K= y.gradeUp();
        var r= new Array(y.length);
        var j= 0;
        for (var k= 0; k < y.length; k++) {
            var L= this[J[j]];
            var R= y[K[k]];
            while (L < R) {
                if (this.length <= ++j) {
                    while (k < y.length) r[K[k++]]= -1;
                    return r;
                }
                L= this[J[j]];
            }
            r[K[k]]= L==R ?J[j] :-1;
        }
        return r;
    },
    
    product: function() {
        return this.inject(1, function(x,y){return x*y});
    },
    
    reshape: function(y, z) {
        // build an array of length y from this array
        // or build an array of length y of arrays of length z from this array
        var r= new Array(y);
        if (this.length)
            for (var j= 0; j < y; j++)
                if (z) {
                    var s= new Array(z);
                    for (var k= 0; k < z; k++)
                        s[k]= this[((j*z)+k)%this.length];
                    r[j]= s;
                } else 
                    r[j]= this[j%this.length];
        return r;
    },
    
    sum: function() {
        return this.inject(0, function(x, y) {return x+y});
    },
    
    transpose: function() {
        var t= this.clone();
        var first= t.shift();
        return [].zip.apply(first, t)
    },
    
    without: function() {
        // like prototype's Array.prototype.without()
        // but O(N*log(N)) instead of O(N*M) (M not greater than N)
        return this.withoutList($A(arguments));
    },

    withoutList: function(y) {
        // new array without the elements contained y
        // if (!y) return this;
        if (0==y.length) return this;
        if (1 == y.length) {
            var r= [];
            var x= y[0];
            for (var j= 0; j < this.length; j++)
                if (this[j] != x)
                    r.push(this[j]);
            return r;
        }
        var J= y.indicesOf(this);
        var r= [];
        for (var j= 0; j < this.length; j++)
            if (-1 == J[j])
                r.push(this[j]);
        return r;
        /* Or (probably better):
        var have= {};
        for (var j= 0; j < y.length; j++)
            have[y[j]]= 1;
        var r= [];
        for (var j= 0; j < this.length; j++)
            if (!have[this[j]])
                r.push(this[j]);
        return r;
        */
    }

 });
 
  /////////////////////////////////
 // end of prototype extensions //
/////////////////////////////////

usatWidg.ClassAvailable('FeedWell2');
