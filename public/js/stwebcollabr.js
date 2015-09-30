/**
 * Sametime 9 ST Web collaboration
 * @version 1.05
 * @author  Koushik Manna, Abhisekh Mohapatro & Adarsh
 * @email   abhisekh.m@in.ibm.com
 * @created 22nd April 2014
 * @modified  19th January 2015 8:00PM IST
 * @Fix 	Sametime 9 Migration
 */
/* Copyright (c) 2015
 * IBM Corporation
 * All Rights Reserved.
 *
 * This document contains proprietary and confidential information,
 * and shall not be reproduced, transferred, or disclosed to others,
 * without the prior written consent of IBM Corporation.
 *
 * Any change or modification to the content of this document should
 * be immediately notified to the Administrator.
 */
function isInt(n) {
        return n % 1 === 0;
    }
    /*array function for ie7/ie8 */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/ ) {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}

function nextElementSibling(el) {
        do {
            el = el.nextSibling;
        } while (el && el.nodeType !== 1);
        return el;
    }
    /** Sametime STWeb collaboration **/
dojo.require("dojo.NodeList-traverse");
dojo.require("dojo.io.script");
dojo.require("dojo.cookie");
dojo.declare("sametimeCallout", null, {
    displayinQue: false,
    resizeHandler: null,
    scrollHandler: null,
    rendered: false,
    repositionHandler: null,
    targetNode: null,
    popupNode: null,
    ofspace: 20,
    displayed: false,
    hided: true,
    infocus: false,
    hovered: false,
    content: "",
    debug: false,
    initiated: false,
    _property: {
        l: 0,
        t: 0,
        w: 0,
        h: 0
    },
    _template: '<div class="arrow_holder"></div><div class="border_shadow"><div class="content_box">{$content}</div></div>',
    constructor: function (args) {
        dojo.mixin(this, args);
        this.createPopup();

    },
    setTarget: function (tnode) {
        this.targetNode = tnode;
    },
    createPopup: function () {
        var holder = null;
        var chk = dojo.query(".hidden_contents");
        if (chk.length > 0)
            holder = chk[0];
        else holder = dojo.create("div", {
            "class": "hidden_contents",
            style: "visibility:hidden"
        });

        // search for other overlays
        var no = dojo.query(".popupdiv").length;
        var cstring = this._template.replace("{$content}", this.content);
        var pop = dojo.create("div", {
            "id": "prolay_" + no,
            innerHTML: cstring,
            "class": "popupdiv"
        });

        dojo.place(holder, dojo.body());
        dojo.place(pop, holder);
        this.popupNode = pop;
        var n = this;

/*        this.resizeHandler = function () {
            n.repositionPopup();
        };
        this.scrollHandler = function () {
            n.repositionPopup();
        };*/
        setTimeout(function () {
            var cords = dojo.coords(n.popupNode);

            n._property.w = cords.w;
            n._property.h = cords.h;
            dojo.style(n.popupNode, {
                "display": "none"
            });
            n.initiated = true;

            if (n.debug)
                console.log("Popup cords", cords);
            if (n.targetNode !== null || typeof (n.targetNode) != "undefined")
                n.positionPopup();
            if (n.displayinQue)
                n.displayPopup();

        }, 2000);

    },
    displayPopup: function () {
        var n = this;

        if (!this.initiated) {
            console.log("not Initialized");
            this.displayinQue = true;
            return;
        }
        this.positionPopup();

        //initlizing the arrow buttons
        dojo.style(this.popupNode, {
            "visibility": "visible",
            "position": "absolute",
            "top": this._property.t + "px",
            "left": this._property.l + "px",
            "display": "block"
        });

        this._property.w = dojo.style(this.popupNode, "width");
        if (this.debug)
            console.log("Popup came in view", this._property);

        this.displayed = true;
        this.hided = false;
        this.repositionPopup();



    },
    hidePopup: function () {
        dojo.style(this.popupNode, "visibility", "hidden");
        this.hided = true;

        if (this.debug)
            console.log("Popup hided", this._property);
        clearTimeout(this.repositionHandler);
/*        window.removeEventListener("resize", this.resizeHandler);
        window.removeEventListener("scroll", this.scrollHandler);*/
    },
    positionPopup: function () {
        var me = this;

        var bodyoffset = dojo.coords(dojo.body());

        //toffset =  Target Offset
        var toffset = dojo.coords(this.targetNode);
        var scrollWidth = dojo.body().scrollWidth;
        toffset.y = toffset.y;
        toffset.t = toffset.t;

        toffset.rw = dojo.style(this.targetNode, "width");
        toffset.rh = dojo.style(this.targetNode, "height");
        toffset.pl = dojo.style(this.targetNode, "padding-left");
        toffset.pr = dojo.style(this.targetNode, "padding-right");
        var popoffset = dojo.coords(this.popupNode);
        if (dojo.isIE) {
            if (dojo.isIE == 7) {
                toffset.l = toffset.x;
                toffset.t = toffset.y + 20;
                if (this.debug)
                    console.log("ie7", toffset.l, toffset.t);
            }
        }

        var mid = toffset.l + (toffset.pl + toffset.pr + toffset.rw) / 2; // left for the pointer
        var top = toffset.t + toffset.h;


        if (this._property.w)
            popoffset.w = this._property.w;
        // check the total middle point + dialog width not crossing the scroll width
        var exptotal = mid + popoffset.w / 2;
        var popuptl = mid - popoffset.w / 2;
        //console.log(toffset, popoffset, exptotal, scrollWidth);
        if (exptotal > scrollWidth)
            popuptl = scrollWidth - popoffset.w;

        var t = toffset.t + toffset.h;
        this._property.t = t;
        this._property.l = popuptl;
        // set arrow position 
        dojo.query(this.popupNode, ".arrow_holder")[0].style.left = Math.ceil(mid - popuptl) + "px";
        //  dojo.style(this.popupNode,"width",popoffset.w+"px");
        dojo.style(this.popupNode, {

            "position": "absolute",
            "top": this._property.t + "px",
            "left": this._property.l + "px"
        });
    },
    repositionPopup: function () {

        var me = this;
        /*if (dojo.getComputedStyle(this.popupNode).width == "auto") {
            setTimeout(function () {

                console.log(dojo.style(me.popupNode, "width"));
                me.positionPopup();
            }, 800);



            return;
        }*/
        if (!this.rendered) {
            me.rendered = true;
            dojo.style(me.popupNode, "width", dojo.getComputedStyle(me.popupNode).width);

        }
        this.positionPopup();
        if (dojo.style(this.targetNode, "display") == "none") {
            this.hidePopup();
            this.hided = true;
            if (this.debug)
                console.log("Target node is not in view, hiding the popup");
        } else {
            dojo.style(this.popupNode, {
                "display": "block"
            });
        }
        dojo.style(this.popupNode, {

            "position": "absolute",
            "top": this._property.t + "px",
            "left": this._property.l + "px"
        });

         if (this.displayed && !this.hided) {
                    var n = this;
                     n.repositionHandler =   setTimeout(function () {
                                  
                                    dojo.style(n.popupNode, {

                                        "position": "absolute",
                                        "top": n._property.t + "px",
                                        "left": n._property.l + "px"
                                    });
                                    n.repositionPopup();
                                }, 1000);
                }
    },
});




dojo.declare("sametime.Colaborate", null, {
    debug: false,
    servletUrl: "http://st-was.dst.ibm.com/sales/gss/download/PresenceDetectionService/STStatusServlet?",
    //servletUrl: "//test-was.dst.ibm.com/sales/gss/download/PresenceDetectionService/STStatusServlet?",
    popupHost: "http://st-ihs.dst.ibm.com",
    popupPath: "/V17/UAT/stwebchat/NewV17chatWindow.html?",
    popupURL: "",
    generatedURL: "",
    localeCode: "enus",
    lc: null,
    cc: null,
    locale: {
        "translation": {}
    },
    selfURI: null,
    defaultLinkInactiveClass: "ibm-chat-link-inactive",
    repIds: [],
    chatNodes: [],
    repnodeMap: [],
    contactModuleRepId: null,
    timer: null,
    availableDelayTime: 5000,
    /* Delay time to make a PD call when the user is in available Status */
    offlineDelayTime: 15000,
    /* Delay time to make a PD call when the user is in offline Status */
    delay: 10000,
    inFocus: true,
    lastUpdate: null, //pd call last received
    callInprogress: false, // pd call in progress
    responseData: [],
    browser: "non-ie",
    ismobile: false,
    homeNetwork: false,
    chatsInitiate: [],
    chatwindowClose: 0,
    chatWindow: null,
    singleContact: false,
    proactivedialog: null,
    connectId: new Date().getTime(),
    chatProcessQue: [], // requested chats
    chatwindowReady: false, // chat window ready to accept calls
    supportedLocale: ['ensg', 'engb', 'enus', 'bgbg', 'cscz', 'dadk', 'etee', 'elgr', 'eses', 'esar', 'esbo', 'escl', 'esco', 'esec', 'esmx', 'espy', 'espe', 'esuy', 'esve', 'fifi', 'frfr', 'frma', 'frch', 'frtn', 'frbe', 'frdz', 'frca', 'heil', 'hrhr', 'huhu', 'itit', 'jajp', 'kokr', 'ltlt', 'lvlv', 'nlnl', 'nlbe', 'nono', 'plpl', 'ptpt', 'roro', 'ruru', 'sksk', 'slsi', 'srrs', 'svse', 'trtr', 'ukua', 'zhcn', 'zhtw', 'dede', 'deat', 'dech', 'ptbr', 'esla'], // to check for supported local
    langExceptions: ["lvlv", "bgbg", "etee", "ltlt", "srrs"],
	allowedVideoLocals: ["enus"],
    videoEnabled: false,
    constructor: function (args) {
        this.initDebuging();
        this.mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
        var me = this;
        this.popupURL = this.popupHost + this.popupPath;
        if (window.location.hostname.indexOf("ibm.com") >= 0)
            this.homeNetwork = true;
        if (this.homeNetwork) {

            dojo.create("link", {
                // href: "//test-ihs.dst.ibm.com/V17/stwebchat/themes/inactive.css",
                href: "//st-ihs.dst.ibm.com/V17/UAT/stwebchat/themes/inactive.css",
                "rel": "text/css",
                type: 'text/css',
                rel: 'stylesheet'
            }, document.getElementsByTagName('head')[0]);

        }
        // load transation objects
        // load meta tag details
        this.getLocal();
        this.initTranslator();
        // detect env
        if (this.getIEversion() > -1) {
            this.browser = "ie";
        }
		if (!dojo.isChrome && this.allowedVideoLocals.indexOf(this.localeCode) >= 0) { //adarsh
            this.videoEnabled = true;
        }
        if (this.loadRep()) {
            if (this.contactModuleRepId != "")
                this.singleContact = true;
            this.RegisterSignalReciver();
            if (this.repIds.length == 0) return;
            if (this.repIds.length == 1 && this.singleContact)
                this.ST852LogEvent("ServiceActive", "ContactModule", this.contactModuleRepId, "ServiceActive");
            else this.ST852LogEvent("ServiceActive", "Team", this.contactModuleRepId, "ServiceActive");

            this.bindClick();
            this.relayCheck();
        }


        setTimeout(function () {
            me.availableDelayTime = me.availableDelayTime * 2;
            me.offlineDelayTime = me.offlineDelayTime * 2;

        }, 1800000);
        var lcl = this.locale.translation["enus"];
        if (typeof (this.locale.translation[this.localeCode]) != "undefined")
            lcl = this.locale.translation[this.localeCode];
        var message = eval("lcl.calloutmessage");
        var startchat = eval("lcl.startchat");
        var videochat = eval("lcl.videochat");
        var nothanks = eval("lcl.nothanks");
        var callOutContent = "";
        if (this.localeCode == "heil") { //rtl for callout
            callOutContent = "<div style='text-align:center' dir='rtl'><h2 style='font-size:17px'>" + message + '</h2>' + '</br><input class="ibm-btn-arrow-pri" name="proactive_continue" value="' + startchat + '" type="submit" id="proactive_continue" />&nbsp;&nbsp;' + '&nbsp;&nbsp;<input class="ibm-btn-arrow-pri" name="stvideo" value="' + videochat + '" type="submit" id="proactive_video" />&nbsp;&nbsp;' + '&nbsp;&nbsp;<input class="ibm-btn-cancel-sec" name="ibm-cancel" value="' + nothanks + '" type="submit" id="proactive_decline" /></div>';
        } else {
            callOutContent = "<div style='text-align:center'><h2 style='font-size:17px'>" + message + '</h2>' + '</br><input class="ibm-btn-arrow-pri" name="proactive_continue" value="' + startchat + '" type="submit" id="proactive_continue" />&nbsp;&nbsp;' + '&nbsp;&nbsp;<input class="ibm-btn-arrow-pri" name="stvideo" value="' + videochat + '" type="submit" id="proactive_video" />&nbsp;&nbsp;' + '&nbsp;&nbsp;<input class="ibm-btn-cancel-sec" name="ibm-cancel" value="' + nothanks + '" type="submit" id="proactive_decline" /></div>';
        }

        if (this.contactModuleRepId != "" && this.homeNetwork) {
            this.proactivedialog = new sametimeCallout({
                content: callOutContent,
                //targetNode: dojo.byId("ibm-saleschat"),
                targetNode: me.chatNodes[0],
                debug: me.debug

            });
            dojo.connect(dojo.byId("proactive_continue"), "onclick", function (e) {
                me.proactivedialog.hidePopup();
                me.proactiveDeclined = true;

                // me.ST852LogEvent('STCallOut', 'ContactModule', me.contactModuleRepId, "Open");
                me.initChat(me.repIds[0], "callout");
                e.preventDefault();
                return false;
            });

            dojo.connect(dojo.byId("proactive_video"), "onclick", function (e) {
                me.proactivedialog.hidePopup();
                me.proactiveDeclined = true;

                // me.ST852LogEvent('STCallOut', 'ContactModule', me.contactModuleRepId, "Open");
                me.initChat(me.repIds[0], "callout", true);
                e.preventDefault();
                return false;
            });

            dojo.connect(dojo.byId("proactive_decline"), "onclick", function (e) {
                me.proactivedialog.hidePopup();
                me.proactiveDeclined = true;
                me.ST852LogEvent('STCallOut', 'ContactModule', me.contactModuleRepId, "Decline");
                e.preventDefault();
                return false;
            });
            if (!this.videoEnabled) {
                dojo.style(dojo.byId("proactive_video"), "display", "none");
                dojo.query(".popupdiv").style("width", "360px");
            }

            if (!this.mobile)
                setTimeout(function () {
                    if (me.debug)
                        console.log("executing proactive");
                    me.proactiveOverlay();
                }, 10000);
        }
    },
    initDebuging: function () {
        if (window.location.href.indexOf("debugst") > -1)
            this.debug = true;
    },
    proactiveOverlay: function () {
        var initiate = false;
        var n = this;
        if (this.homeNetwork) {
            if (this.chatWindow == null) {
                initiate = true;
                if (n.contactModuleRepId != null && (parseInt(n.responseData[0].status) === 32 || parseInt(n.responseData[0].status) === 544)) {
                    initiate = true;
                } else initiate = false;
            } else initiate = false;
        }
        if (initiate) {


            if (dojo.cookie("proactiveOpened") != "true" || dojo.cookie("proactiveOpened") == "undefined" || dojo.cookie("proactiveOpened") === undefined) {
                n.ST852LogEvent("STCallOut", "ContactModule", n.contactModuleRepId, "Display");



                /* proactivedialog.setTarget(dojo.byId("ibm-saleschat"));*/
                n.proactivedialog.displayPopup();
                if (n.debug)
                    console.log("Overlay in The Page");
                dojo.cookie("proactiveOpened", true);
                setTimeout(function () {

                    n.proactivedialog.hidePopup();
                    if (!n.proactiveDeclined)
                        n.ST852LogEvent('STCallOut', 'ContactModule', n.contactModuleRepId, "Timeout");
                }, 30000);
            }
        } else {
            setTimeout(function () {
                n.proactiveOverlay();
            }, 2000);
        }

    },

    getLocal: function () {
        var cc = "us";
        var lc = "en";
        var langfromMeta = false;
        try {
            var metaTags = dojo.query("meta[name='DC.Language'],meta[name='IBM.Country']");
            dojo.forEach(metaTags, function (item, index) {
                if (item.name == "DC.Language") {
                    var lccc = item.content.split("-");
                    if (lccc.length == 2) {
                        cc = lccc[1].toLowerCase();
                        lc = lccc[0].toLowerCase();
                        langfromMeta = true;
                    }
                }
            });
            if (!langfromMeta) {
                var htmltag = dojo.query("html")[0];
                var lcccstr = htmltag.getAttribute("lang");
                var lccc = lcccstr.split("-");
                if (lccc.length == 2) {
                    cc = lccc[1].toLowerCase();
                    lc = lccc[0].toLowerCase();

                }
            }
        } catch (e) {
            console.log("Country & Language property Not defined for the page.");
        }
        this.lc = lc;
        if (lc == "no") {
            this.lc = "nb";
        }
        this.cc = cc;
        this.localeCode = lc + cc;
    },
    /** Find st property from  data-stprops attribute **/
    getProp: function (node, prop) {
        var props = (node.getAttribute("data-stprops") != null) ? dojo.fromJson("{" + node.getAttribute("data-stprops") + "}") : {};
        if (typeof (props[prop]) != 'undefined')
            return props[prop];
        else return "";
    },
    setProp: function (node, prop, value) {
        var props = (node.getAttribute("data-stprops") != null) ? dojo.fromJson("{" + node.getAttribute("data-stprops") + "}") : {};
        props[prop] = value;
        var pString = dojo.toJson(props);
        pString = pString.replace("}", "").replace("{", "").replace("undefined").replace(/\"/g, "'");
        node.setAttribute("data-stprops", pString);
    },
    getIEversion: function () {
        var rv = -1;
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        } else if (navigator.appName == 'Netscape') {
            var ua = navigator.userAgent;
            var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }
        return rv;
    },
    loadRep: function () {
        var me = this;
        var chatlinks = dojo.query(".ibm-chat-link#ibm-saleschat,.ibm-chat-link");

        var linkcount = chatlinks.length;
        if (linkcount > 0) {
            for (i = 0; i < linkcount; i++) {
                var item = chatlinks[i];
                if (!dojo.hasClass(item, "ibm-ismc-textchat") && !dojo.hasClass(item, "ibm-ismc-mtg")) {
                    var rid = (item.getAttribute("data-repid") != null) ? dojo.trim(item.getAttribute("data-repid")) : "";
                    //var name = (item.getAttribute("data-prefname") != null) ? dojo.trim(item.getAttribute("data-prefname")) : rid;
                    var nid = (item.getAttribute("id") != null) ? dojo.trim(item.getAttribute("id")) : "";
                    // for contact module
                    if (i == 0 && nid == "ibm-saleschat") {
                        if (rid == "") {
                            // get from meta
                            var metarepnode = dojo.query("meta[name='RepID']");
                            if (metarepnode.length > 0) {
                                rid = metarepnode[0].getAttribute("content");

                            }
                        }
                        if (rid != "")
                            this.contactModuleRepId = rid;


                    }
                    if (rid !== "") {

                        // get the offline node, default class, offlinetxt
                        var inclass = (me.getProp(item, "inactiveclass") == "") ? me.defaultLinkInactiveClass : me.getProp(item, "inactiveclass"); //inactive class
                        dojo.attr(item, "data-stchat-link", "true");
                        var offlineNode = dojo.query(".offline-text", item);
                        if (offlineNode.length > 0) {
                            offlineNode = offlineNode[0];
                            dojo.addClass(offlineNode, inclass);
                        } else {
                            offlineNode = dojo.create("span", {
                                innerHTML: item.innerHTML,
                                "class": inclass
                            });
                        }
                        // if the links parent is having any css property, remove it
                        if (item.parentNode.tagName == "LI") {
                            //
                            if (this.homeNetwork)
                                dojo.removeAttr(item.parentNode, "style");
                            else dojo.style(item.parentNode, "display", "none");

                        }
                        dojo.style(item, "display", "block");// eranone
                        if (this.homeNetwork)
                            dojo.place(offlineNode, item, "after");
                        me.chatNodes.push(item);
                        dojo.attr(item, "data-stchat-link", "true");
                        me.repIds.push({
                            "status": "0",
                            "nodeid": i,
                            "userid": rid
                        });
                    }
                }
                if (me.repIds == 26) {
                    break;

                }
            }

        }
        //me.chatNodes = dojo.query("a[data-stchatlink='true']");
        this.refineList();
        return true;
    },
    refineList: function () {

        var newList = [];
        var me = this;
        var l = 0;
        //console.log(this.repIds, this.chatNodes);
        dojo.forEach(this.repIds, function (item, index) {
            //console.log("rep map ", me.chatNodes[index], me.repIds[index]);
            var mcresult = findMatch(item.userid, index);

            if (mcresult === null) {
                newList[l] = item;
                me.repnodeMap[item.nodeid] = l;
                //console.log(item.nodeid, me.repnodeMap[item.nodeid]);
                l++;
            } else {
                // console.log("duplicate found", mcresult, item.nodeid);
                newList[mcresult].nodeid += "," + item.nodeid;
                me.repnodeMap[item.nodeid] = mcresult;
            }


        });
        this.repIds = newList;

        function findMatch(repid, idx) {
            var matchindex = null;
            dojo.forEach(newList, function (item, index) {
                if (item.userid == repid)
                    matchindex = index;
            });
            return matchindex;
        }
        return true;
    },
    bindClick: function () {
        var me = this;
        dojo.ready(function () {
            dojo.query("a#ibm-saleschat[data-stchat-link='true'],a[data-stchat-link='true']").connect("click", function () {
                // get the record from repid json
                /* get index from the map */
                try {
                    me.proactivedialog.hidePopup();
                } catch (e) {}
                var row = me.repIds[me.repnodeMap[me.chatNodes.indexOf(this)]];
                if (this.debug)
                    console.log(row);
                // console.log(me.chatNodes.indexOf(this), row);
                me.initChat(row, me.chatNodes.indexOf(this));
            });
        })

    },
    initChat: function (repd, nodeid, isVideo) {
        var repdetails = dojo.clone(repd);
        try {
            if (typeof (lpMTagConfig) != "undefined") {
                lpMTagConfig.vars.push(['page', 'OtherChat', 'true']);
            }
        } catch (e) {}

        if (!this.mobile) {
            /*            if (nodeid == 0 && this.contactModuleRepId != null) {
                            //this.ST852LogEvent("Open", 'ContactModule', repdetails.userid, "");
                        } else*/

            repdetails.clickedNode = nodeid;
            var me = this;
            // check chat window opened or not
            if (this.chatWindow === null) {
                this.startChatWindow();



            } else if (typeof (this.chatWindow) == 'undefined' || this.chatWindow.closed) {
                this.startChatWindow();

            }
            if (nodeid != 'callout') {
                var mod = "Team";
                if (this.singleContact && nodeid == 0)
                    mod = "ContactModule";
                this.ST852LogEvent("Initiate", mod, repdetails.userid, "Initiate");
                var userJson = {
                    "id": repdetails.userid,
                    "event": "STchat852",
                    "section": mod
                }; //rep details to json
                me.chatsInitiate.push(userJson);
                var stringArray = JSON.stringify(me.chatsInitiate);
                sessionStorage.setItem("userlog", stringArray);
            } else {
                if (isVideo) {
                    me.ST852LogEvent('STVideoCall', 'ContactModule', me.contactModuleRepId, "Video");
                    me.ST852LogEvent('STVideoCO', 'ContactModule', me.contactModuleRepId, "Initiate");
                    var userJson = {
                        "id": me.contactModuleRepId,
                        "event": "STVideoCO",
                        "section": "ContactModule",
                        "video": true
                    }; //rep details to json
                    me.chatsInitiate.push(userJson);
                    var stringArray = JSON.stringify(me.chatsInitiate);
                    sessionStorage.setItem("userlog", stringArray);
                } else {
                    me.ST852LogEvent('STCallOut', 'ContactModule', me.contactModuleRepId, "Initiate");
                    var userJson = {
                        "id": me.contactModuleRepId,
                        "event": "STCallOut",
                        "section": "ContactModule"
                    }; //rep details to json
                    me.chatsInitiate.push(userJson);
                    var stringArray = JSON.stringify(me.chatsInitiate);
                    sessionStorage.setItem("userlog", stringArray);
                }
            }






            switch (this.browser) {
            case 'ie':

                var targetURL = this.generatedURL;

                // get the mode
                targetURL += "&repid=" + repdetails['userid'];
                // targetURL += "&name=" + repdetails['Name'];
                targetURL += "&clickedNode=" + nodeid;
                if (isVideo) {
                    targetURL += "&isVideo=true";
                }
                this.chatWindow.location.href = targetURL;

                break;
            case 'non-ie':
                this.chatProcessQue = repdetails;

                if (isVideo)
                    repdetails.isVideo = true;
                if (this.chatwindowReady)
                    this.chatWindow.postMessage(dojo.toJson(repdetails), this.popupHost);

                break;
            }
        } else {

            // var urlparam = "&repid=" + repdetails['userid'] + "&name=" + repdetails['Name'] + "&module=" + nodeid;

            var urlparam = "&userid=" + repdetails['userid'] + "&clickedNode=" + nodeid;
            this.startChatWindow(urlparam);
        }
        this.chatWindow.focus();
    },
    /** Setup Delay Time **/
    setupDelay: function () {
        var me = this;
        var timediff = (new Date() - this.lastUpdate);
        if (this.debug)
            console.log(timediff, this.delay, "Time Diff and Delay");
        if (timediff < this.delay) {
            if (this.timer != null)
                clearTimeout(this.timer);

            this.timer = setTimeout(function () {
                me.relayCheck();
            }, timediff);
        } else this.relayCheck();
    },
    /* Get the rep status from the community server */
    relayCheck: function () {

        //if user is not the page
        if (!this.inFocus)
            return;
        // if user cameback in the page with in 10second

        if (this.debug)
            console.log("Making the PD call..", this.callInprogress, new Date());

        var me = this;
        if (this.callInprogress) {
            return;
        }
        this.callInprogress = true;
        this.callInstance = dojo.io.script.get({
            url: this.servletUrl,
            preventCache: true,
            callbackParamName: "callback",
            content: {
                useridJSON: dojo.toJson(me.repIds)
            },
            load: function (data, ioArgs) {
                me.responseData = data;
                me.chatLink(data);
                me.callInprogress = false;
                me.lastUpdate = new Date();
            },
            error: function (e) {
                console.error(e);
                me.callInprogress = false;
                me.lastUpdate = new Date();
            }
        });
    },
    chatLink: function (data) {
        // console.log(data);
        var items = data;
        var me = this;
        me.responseData = data;
        dojo.forEach(items, function (item, index) {
            var status = parseInt(item.status);
            var lastStatus = me.repIds[index].status;
            var id = item.userid;
            var nodeIds = [];
            if (!isInt(item.nodeid))
                nodeIds = item.nodeid.split(",");
            else nodeIds[0] = parseInt(item.nodeid);
            if (me.debug)
                console.log("Chatlink: ", item, status, lastStatus, me.lastUpdate, nodeIds);
            if (lastStatus != status || me.lastUpdate == null) {
                if (((lastStatus != 32 && lastStatus != 544) || me.lastUpdate == null) && (status == 32 || status == 544)) {
                    if (me.contactModuleRepId != null && index == 0) {
                        me.ST852LogEvent('LinkActive', 'ContactModule', id, "");
                    } else me.ST852LogEvent('LinkActive', 'Team', id, "");

                    dojo.forEach(nodeIds, function (nodeid, idx) {
                        if (idx == 0 && me.contactModuleRepId != null && index == 0)
                            me.applyStatus(me.chatNodes[nodeid], true, true, id);
                        else me.applyStatus(me.chatNodes[nodeid], true, false, id);
                    });
                    if (me.repIds.length == 1) {
                        me.delay = me.availableDelayTime;
                    }
                }
                if (((lastStatus == 32 || lastStatus == 544) || me.lastUpdate == null) && (status != 32 && status != 544)) {
                    if (me.debug)
                        console.log("user ", id, " is offline");
                    if (me.contactModuleRepId != null && index == 0) //contact module
                    {
                        me.ST852LogEvent('LinkInactive', 'ContactModule', id, "");
                    } else me.ST852LogEvent('LinkInactive', 'Team', id, "");

                    dojo.forEach(nodeIds, function (nodeid, idx) {
                        if (idx == 0 && me.contactModuleRepId != null && index == 0)
                            me.applyStatus(me.chatNodes[nodeid], false, true, id);
                        else me.applyStatus(me.chatNodes[nodeid], false, false, id);
                    });
                    if (me.repIds.length == 1) {
                        me.delay = me.offlineDelayTime;
                    }
                }

            }

        });

        this.repIds = data;

        this.timer = setTimeout(function () {
            me.relayCheck();
        }, me.delay);
    },
    /* Change the chat link according to the status of the Rep 
     * @param node		object - The link Refference
     * @param online	boolean - True/False
     * @param userid    string  - repid
     */
    applyStatus: function (node, online, contactModule, userid) {

        if (this.debug)
            console.log(node, online, contactModule, userid);
        // if it needed the other status like ,meeting,away, change the statement to swtich case and , accept the status code in 'online' argument.

        //if the rep is online
        if (online && dojo.style(node, "display") != "block") {
            if (this.homeNetwork)
                dojo.style((node.nextElementSibling || nextElementSibling(node)), "display", "none");
            dojo.style(node, "display", "block");
            if (node.parentNode.tagName == "LI" && !this.homeNetwork)
                dojo.removeAttr(node.parentNode, "style");

        }
        // if the rep is not online
        if (!online && dojo.style(node, "display") != "none") {
            if (this.homeNetwork)
                dojo.style((node.nextElementSibling || nextElementSibling(node)), "display", "block");
            dojo.style(node, "display", "block"); //eranone
            if (node.parentNode.tagName == "LI" && !this.homeNetwork)
                dojo.style(node.parentNode, "display", "block"); //eranone
        }

        try {
            if (node.id == "ibm-saleschat" && this.proactivedialog.displayed && !this.proactivedialog.hided && this.homeNetwork && dojo.style(node, "display") == "none") {
                this.proactivedialog.hidePopup();
                this.proactivedialog.hided = true;

            }
        } catch (e) {
            // nothing to do
        }

    },
    startChatWindow: function (urlparamsString) {
        if (this.debug)
            console.log(urlparamsString);
        var cc = this.cc;
        var lc = this.lc;
        var localeCode = lc + cc;
        if (this.langExceptions.indexOf(localeCode) >= 0) {
            cc = "us";
            lc = "en";
            localeCode = "enus";
        }
        if (this.ismobile) {
            var width = screen.width;
            var height = screen.height;
            var left = 0;
            var top = 0;
        } else {
            var width = 530;
            var height = 560;
            var left = 200;
            var top = 0;
        }
        var chaturl = this.popupURL + "&cc=" + cc + "&lc=" + lc + "&singleContact=" + this.singleContact;
        if (this.browser != "ie" && !this.mobile)
            //chaturl += "&opener=" + encodeURIComponent(window.location.protocol + "//" + window.location.host);
		chaturl += "&opener=" + encodeURIComponent(window.location.protocol + "//" + window.location.host);
		
        else chaturl += "&opener=" + encodeURIComponent(window.location.href);
		
		
		
        var chaturl = this.popupURL + "&cc=" + cc + "&lc=" + lc + "&singleContact=" + this.singleContact + "&opener="+encodeURIComponent("http://www.ibm.com");
		//http%3A%2F%2Flocalhost%3A3000
		
		
        if (typeof (urlparamsString) != "undefined")
            chaturl += urlparamsString;

        if (this.browser == "ie") {
            chaturl += "#";
        }

        /*  if (this.debug) {
              chaturl += "debug=true";
          }*/
        this.generatedURL = chaturl;
        var winArgs = {
            url: chaturl,
            title: "Sales Chat Window",
            "width": width,
            "height": height,
            position: "top"
        };
        this.chatWindow = this.popup(winArgs);
    },
    popup: function (options) {
        var screen_width = screen.width;
        var screen_height = screen.height;
        var default_args = {
            'url': "http://in.ibm.com",
            'title': 'IBM',
            'width': (screen_width - 50),
            'height': (screen_height - 50),
            'position': "center"
        };
        for (var index in default_args) {
            if (typeof options[index] == "undefined") options[index] = default_args[index];
        }
        if (this.debug)
            console.dir(options);
        if (options['position'] == 'center') { // center the window
            var left = parseInt((screen_width - options['width']) / 2);
            var top = parseInt((screen_height - options['height']) / 2);
        }
        if (options['position'] == 'left') {
            var left = 0;
            var top = parseInt((screen_height - options['height']) / 2);
        }
        if (options['position'] == 'right') {
            var left = parseInt(screen_width - options['width']);
            var top = parseInt((screen_height - options['height']) / 2);
        }
        if (options['position'] == 'bottom') {
            var left = parseInt((screen_width - options['width']) / 2);
            var top = parseInt(screen_height - options['height']);
        }
        if (options['position'] == 'bottom right') {
            var left = parseInt(screen_width - options['width']);
            var top = parseInt(screen_height - options['height']);
        }
        if (options['position'] == 'top left') {
            var left = 0;
            var top = 0;
        }
        if (options['position'] == 'top') {
            var left = parseInt((screen_width - options['width']) / 2);
            var top = 0;
        }

        if (parseInt(dojo.isIE))
            options['title'] = options['title'].replace(/\W*/g, '');

        //  ;
        if (this.debug)
            console.log(options['url'], options['title'], "location=1,status=1,scrollbars=0,width=" + options['width'] + ",height=" + options['height'] + ",top=" + top + ",left=" + left + ",resizable=yes");
        mywindow = window.open(options['url'], '_blank' /*options['title']*/, "location=1,status=1,scrollbars=0,width=" + options['width'] + ",height=" + options['height'] + ",top=" + top + ",left=" + left + ",resizable=yes");
        //mywindow.moveTo(left,top);
        return mywindow;
    },
    RegisterSignalReciver: function () {
        var me = this;
        dojo.ready(function () {

            if (window.addEventListener) {
                window.addEventListener('message', function (e) {

                    var msg = dojo.fromJson(e.data);
                    me.processMessage(msg);

                });
            } else { // IE8 or earlier
                window.attachEvent('onmessage', function (e) {
                    me.processMessage(msg);
                });
            }
        });
        if (window.addEventListener) { // on chat close hashchange for IE starts
            window.addEventListener('hashchange', function (e) {
                if (window.location.href.indexOf("|StChat") > -1) {
                    var counter = 0;
                    var timeToClose = setInterval(function () {
                        if (typeof (mywindow) == 'undefined' || mywindow.closed) {
                            ++me.chatwindowClose;
                            for (var i = 0; i <= me.chatsInitiate.length - 1; i++) {
                                if (me.chatsInitiate[i].video) {
                                    me.ST852LogEvent(me.chatsInitiate[i].event, me.chatsInitiate[i].section, me.chatsInitiate[i].id, "Completed");
                                } else {
                                    me.ST852LogEvent("Completed", me.chatsInitiate[i].section, me.chatsInitiate[i].id, me.chatsInitiate[i].event);
                                }
                            }
                            sessionStorage.clear();
                            me.chatsInitiate = [];
                            clearInterval(timeToClose);

                        } else {
                            counter++;
                            if (counter == 5) {
                                clearInterval(timeToClose);
                            }
                        }
                    }, 2000);
                } else if (window.location.href.indexOf("|NoStChat") > -1) {
                    var counter = 0;
                    var timeToClose = setInterval(function () {
                        if (typeof (mywindow) == 'undefined' || mywindow.closed) {
                            ++me.chatwindowClose;
                            for (var i = 0; i <= me.chatsInitiate.length - 1; i++) {
                                if (me.chatsInitiate[i].video) {
                                    me.ST852LogEvent(me.chatsInitiate[i].event, me.chatsInitiate[i].section, me.chatsInitiate[i].id, "Cancel");
                                } else {
                                    me.ST852LogEvent("Closed", me.chatsInitiate[i].section, me.chatsInitiate[i].id, me.chatsInitiate[i].event);
                                }
                            }
                            sessionStorage.clear();
                            me.chatsInitiate = [];
                            clearInterval(timeToClose);

                        } else {
                            counter++;
                            if (counter == 5) {
                                clearInterval(timeToClose);
                            }
                        }
                    }, 2000);
                } else if (window.location.href.indexOf("|DeleteStChat") > -1) {
                    var url = window.location.href;
                    var lastPart = url.split("|DeleteStChat").pop();
                    var userId = lastPart;
                    for (var i = 0; i < me.chatsInitiate.length; i++) {
                        if (me.chatsInitiate[i].id == userId) {
                            me.chatsInitiate.splice(i, 1);
                            break;
                        }
                    }
                    var stringArray = JSON.stringify(me.chatsInitiate);
                    sessionStorage.setItem("userlog", stringArray);
                    window.location.hash = "";
                } else if (window.location.href.indexOf("|AcknowledgementMsg") > -1) {
                    me.chatWindow = null;

                }
            });
        } else { // IE8 or earlier

            window.attachEvent('onhashchange', function (e) {
                if (window.location.href.indexOf("|StChat") > -1) {
                    var counter = 0;
                    var timeToClose = setInterval(function () {
                        if (typeof (mywindow) == 'undefined' || mywindow.closed) {
                            ++me.chatwindowClose;
                            console.log("closed" + me.chatwindowClose);
                            clearInterval(timeToClose);
                        } else {
                            counter++;
                            console.log(counter);
                            if (counter == 5) {
                                clearInterval(timeToClose);
                            }
                        }
                    }, 2000);
                }
            });
        }; // // on chat close hashchange for IE ends
    },
    processMessage: function (objArg) {
        if (this.debug)
            console.log(objArg);
        var me = this;
        try {
            var instruction = objArg[0];
            switch (instruction["case"]) {
            case 'state':
                if (instruction.input == "ready") {

                    me.chatwindowReady = true;
                    me.chatProcessQue.parentURL = encodeURIComponent(window.location.href);
                    me.chatWindow.postMessage(dojo.toJson(me.chatProcessQue), me.popupHost);
                } else if (instruction.input == "close") { // on chatwindow close unica call starts
                    var counter = 0;
                    var timeToClose = setInterval(function () {
                        if (mywindow.closed) {
                            ++me.chatwindowClose;
                            for (var i = 0; i <= me.chatsInitiate.length - 1; i++) {
                                if (instruction.type == "completed") {
                                    if (me.chatsInitiate[i].video) {
                                        me.ST852LogEvent(me.chatsInitiate[i].event, me.chatsInitiate[i].section, me.chatsInitiate[i].id, "Completed");
                                    } else {
                                        me.ST852LogEvent("Completed", me.chatsInitiate[i].section, me.chatsInitiate[i].id, me.chatsInitiate[i].event);
                                    }
                                } else {
                                    if (me.chatsInitiate[i].video) {
                                        me.ST852LogEvent(me.chatsInitiate[i].event, me.chatsInitiate[i].section, me.chatsInitiate[i].id, "Cancel");
                                    } else {
                                        me.ST852LogEvent("Closed", me.chatsInitiate[i].section, me.chatsInitiate[i].id, me.chatsInitiate[i].event);
                                    }
                                }
                            }
                            sessionStorage.clear();
                            me.chatsInitiate = [];
                            clearInterval(timeToClose);
                        } else {
                            counter++;
                            console.log(counter);
                            if (counter == 5) {
                                clearInterval(timeToClose);
                            }
                        }
                    }, 2000);

                }
                break;
            case 'logger':
                if (instruction.input == "delete") {
                    var userId = instruction.id;
                    for (var i = 0; i < me.chatsInitiate.length; i++) {
                        if (me.chatsInitiate[i].id == userId) {
                            me.chatsInitiate.splice(i, 1);
                            break;
                        }
                    }
                    var stringArray = JSON.stringify(me.chatsInitiate);
                    sessionStorage.setItem("userlog", stringArray);
                } // on chatwindow close unica call ends
                break;
            case 'AcknowledgementMsg':
                me.chatWindow = null;
                break;

            }
        } catch (e) {
            console.log("Invalid Message Format");
        }

    },
    /* Log events  */
    ST852LogEvent: function (evt, logEventSection, logEventTitle, action) {
        var n = this;
        var finalUrl = window.location.href.split("//")[1];
        if (this.debug)
            console.log(evt, logEventSection, logEventTitle, action);

        if (!this.homeNetwork) {
            if (this.debug)
                console.log("Outside IBM no TRACK");
            return;
        }

        if (typeof (ibmStats) == "undefined" || !ibmStats || typeof (ibmStats.event) == "undefined" || !ibmStats.event) {
            return setTimeout(function () {
                n.ST852LogEvent(evt, logEventSection, logEventTitle, "");
            }, 200);
        }
        try {
            switch (evt) {
            case 'ServiceActive':
                ibmStats.event({
                    'ibmEV': 'STchat852',
                    'ibmEvAction': 'ServiceActive',
                    'ibmEvGroup': 'Sametime9Chat',
                    'ibmEvName': 'SametimeChat',
                    'ibmEvModule': 'ChatNowST',
                    'ibmEvSection': logEventSection,
                    'ibmEvLinkTitle': logEventTitle
                });
                break;
            case 'LinkActive':
                ibmStats.event({
                    'ibmEV': 'STchat852',
                    'ibmEvAction': 'LinkActive',
                    'ibmEvGroup': 'Sametime9Chat',
                    'ibmEvName': 'SametimeChat',
                    'ibmEvModule': 'ChatNowST',
                    'ibmEvSection': logEventSection,
                    'ibmEvLinkTitle': logEventTitle
                });
                break;
            case 'LinkInactive':
                ibmStats.event({
                    'ibmEV': 'STchat852',
                    'ibmEvAction': 'LinkInactive',
                    'ibmEvGroup': 'Sametime9Chat',
                    'ibmEvName': 'SametimeChat',
                    'ibmEvModule': 'ChatNowST',
                    'ibmEvSection': logEventSection,
                    'ibmEvLinkTitle': logEventTitle
                });
                break;
            case 'Initiate':
                ibmStats.event({
                    'ibmEV': 'STchat852',
                    'ibmEvAction': 'Initiate',
                    'ibmEvGroup': 'Sametime9Chat',
                    'ibmEvName': 'SametimeChat',
                    'ibmEvModule': 'ChatNowST',
                    'ibmEvSection': logEventSection,
                    'ibmEvLinkTitle': logEventTitle
                });
                break;
            case 'Cancel':
                ibmStats.event({
                    'ibmEV': 'STchat852',
                    'ibmEvAction': 'Cancel',
                    'ibmEvGroup': 'Sametime9Chat',
                    'ibmEvName': 'SametimeChat',
                    'ibmEvModule': 'ChatNowST',
                    'ibmEvSection': logEventSection,
                    'ibmEvLinkTitle': logEventTitle
                });
                break;
            case 'Open':
                ibmStats.event({
                    'ibmEV': 'STchat852',
                    'ibmEvAction': 'Open',
                    'ibmEvGroup': 'Sametime9Chat',
                    'ibmEvName': 'SametimeChat',
                    'ibmEvModule': 'ChatNowST',
                    'ibmEvSection': logEventSection,
                    'ibmEvLinkTitle': logEventTitle
                });
                break;
            case 'STCallOut':
                ibmStats.event({
                    'ibmEV': 'STCallOut',
                    'ibmEvAction': action,
                    'ibmEvGroup': 'Sametime9Chat',
                    'ibmEvName': 'SametimeChat',
                    'ibmEvModule': 'ChatNowST',
                    'ibmEvSection': logEventSection,
                    'ibmEvLinkTitle': logEventTitle
                });
                break;
            case 'Closed': // chatwindow close	
                ibmStats.event({
                    'ibmEV': action,
                    'ibmEvAction': 'Cancel',
                    'ibmEvGroup': 'Sametime9Chat',
                    'ibmEvName': 'SametimeChat',
                    'ibmEvModule': 'ChatNowST',
                    'ibmEvTarget': finalUrl,
                    'ibmEvSection': logEventSection,
                    'ibmEvLinkTitle': logEventTitle
                });
                break;
            case 'Completed': // chatwindow close	
                ibmStats.event({
                    'ibmEV': action,
                    'ibmEvAction': 'Completed',
                    'ibmEvGroup': 'Sametime9Chat',
                    'ibmEvName': 'SametimeChat',
                    'ibmEvModule': 'ChatNowST',
                    'ibmEvTarget': finalUrl,
                    'ibmEvSection': logEventSection,
                    'ibmEvLinkTitle': logEventTitle
                });
                break;
            case 'STVideoCO':
                ibmStats.event({
                    'ibmEV': 'STVideoCO',
                    'ibmEvAction': action,
                    'ibmEvGroup': 'Sametime9Video',
                    'ibmEvName': 'SametimeVideo',
                    'ibmEvModule': 'VideoChatST',
                    'ibmEvTarget': finalUrl,
                    'ibmEvSection': logEventSection,
                    'ibmEvLinkTitle': logEventTitle
                });
                break;
            case 'STVideoCall':
                ibmStats.event({
                    'ibmEV': 'STCallOut',
                    'ibmEvAction': action,
                    'ibmEvGroup': 'Sametime9Video',
                    'ibmEvName': 'SametimeVideo',
                    'ibmEvModule': 'VideoChatST',
                    'ibmEvSection': logEventSection,
                    'ibmEvLinkTitle': logEventTitle
                });
                break;

            }
        } catch (e) {}
    },

    initTranslator: function () {
        this.locale.translation = {
            "nlbe": {
                "calloutmessage": "Wilt u met mij chatten?",
                "nothanks": "Nee, bedankt",
                "startchat": "Tekstchat",
                "videochat": "Videochat"
            },
            "enus": {
                "calloutmessage": "Would you like to chat with me?",
                "nothanks": "No, thanks",
                "startchat": "Text chat",
                "videochat": "Video chat"
            },
            "ptpt": {
                "calloutmessage": "Pretende conversar comigo?",
                "nothanks": "N\u00e3o, obrigado",
                "startchat": "Conversa\u00e7\u00e3o de texto",
                "videochat": "Conversa\u00e7\u00e3o de v\u00eddeo"
            },
            "frbe": {
                "calloutmessage": "Voulez-vous discuter avec moi?",
                "nothanks": "Non merci",
                "startchat": "Conversation \u00e9crite",
                "videochat": "Conversation vid\u00e9o"
            },
            "etee": {
                "calloutmessage": "Kas soovite minuga vestelda?",
                "nothanks": "Ei, t\u00e4nan",
                "startchat": "Tekstvestlus",
                "videochat": "Videovestlus"
            },
            "ltlt": {
                "calloutmessage": "Ar norite kalb\u0117ti su manimi?",
                "nothanks": "A\u010di\u016b, ne.",
                "startchat": "Pokalbis tekstiniais prane\u0161imais",
                "videochat": "Vaizdo pokalbis"
            },
            "hrhr": {
                "calloutmessage": "\u017delite li pokrenuti chat sa mnom?",
                "nothanks": "Ne hvala",
                "startchat": "Tekstualni razgovor",
                "videochat": "Video razgovor"
            },
            "lvlv": {
                "calloutmessage": "Vai v\u0113laties ar mani t\u0113rz\u0113t?",
                "nothanks": "N\u0113, paldies.",
                "startchat": "Sarakstes t\u0113rz\u0113\u0161ana",
                "videochat": "Videot\u0113rz\u0113\u0161ana"
            },
            "itit": {
                "calloutmessage": "Vuoi parlare in chat con me?",
                "nothanks": "No grazie",
                "startchat": "Chat testuale",
                "videochat": "Video chat"
            },
            "escl": {
                "calloutmessage": "\u00bfDesea conversar conmigo?",
                "nothanks": "No, gracias",
                "startchat": "Conversaci\u00f3n",
                "videochat": "V\u00eddeo conversaci\u00f3n"
            },
            "frfr": {
                "calloutmessage": "Voulez-vous discuter avec moi?",
                "nothanks": "Non merci",
                "startchat": "Conversation \u00e9crite",
                "videochat": "Conversation vid\u00e9o"
            },
            "zhcn": {
                "calloutmessage": "\u60a8\u5e0c\u671b\u4e0e\u6211\u4ea4\u8c08\u5417\uff1f",
                "nothanks": "\u4e0d\uff0c\u8c22\u8c22",
                "startchat": "\u6587\u672c\u4ea4\u8c08",
                "videochat": "\u89c6\u9891\u4ea4\u8c08"
            },
            "ukua": {
                "calloutmessage": "\u0411\u0430\u0436\u0430\u0454\u0442\u0435 \u0440\u043e\u0437\u043f\u043e\u0447\u0430\u0442\u0438 \u0447\u0430\u0442 \u0437\u0456 \u043c\u043d\u043e\u044e?",
                "nothanks": "\u041d\u0456, \u0434\u044f\u043a\u0443\u044e",
                "startchat": "\u0422\u0435\u043a\u0441\u0442\u043e\u0432\u0438\u0439 \u0447\u0430\u0442",
                "videochat": "\u0412\u0456\u0434\u0435\u043e\u0447\u0430\u0442"
            },
            "esla": {
                "calloutmessage": "\u00bfDesea conversar conmigo?",
                "nothanks": "No, gracias",
                "startchat": "Conversaci\u00f3n",
                "videochat": "V\u00eddeo conversaci\u00f3n"
            },
            "espe": {
                "calloutmessage": "\u00bfDesea conversar conmigo?",
                "nothanks": "No, gracias",
                "startchat": "Conversaci\u00f3n",
                "videochat": "V\u00eddeo conversaci\u00f3n"
            },
            "frca": {
                "calloutmessage": "Souhaitez-vous clavarder avec moi?",
                "nothanks": "Non, merci",
                "startchat": "Clavardage",
                "videochat": "Vid\u00e9obavardage"
            },
            "sksk": {
                "calloutmessage": "Chcete sa so mnou porozpr\u00e1va\u0165?",
                "nothanks": "Nie, \u010fakujem",
                "startchat": "Textov\u00e1 konverz\u00e1cia",
                "videochat": "Videokonverz\u00e1cia"
            },
            "frch": {
                "calloutmessage": "Voulez-vous discuter avec moi? ",
                "nothanks": "Non merci",
                "startchat": "Conversation \u00e9crite",
                "videochat": "Conversation vid\u00e9o"
            },
            "zhtw": {
                "calloutmessage": "\u60a8\u60f3\u8981\u8207\u6211\u9032\u884c\u6703\u8ac7\u55ce\uff1f",
                "nothanks": "\u4e0d\uff0c\u8b1d\u8b1d",
                "startchat": "\u6587\u5b57\u6703\u8ac7",
                "videochat": "\u8996\u8a0a\u6703\u8ac7"
            },
            "espy": {
                "calloutmessage": "\u00bfDesea conversar conmigo?",
                "nothanks": "No, gracias",
                "startchat": "Conversaci\u00f3n",
                "videochat": "V\u00eddeo conversaci\u00f3n"
            },
            "roro": {
                "calloutmessage": "Dori\u0163i s\u0103 discuta\u0163i cu mine?",
                "nothanks": "Nu, mul\u0163umesc",
                "startchat": "Chat text",
                "videochat": "Chat video"
            },
            "ensg": {
                "calloutmessage": "Would you like to chat with me?",
                "nothanks": "No, thanks",
                "startchat": "Text chat",
                "videochat": "Video chat"
            },
            "jajp": {
                "calloutmessage": "\u30c1\u30e3\u30c3\u30c8\u3092\u958b\u59cb\u3057\u307e\u3059\u304b?",
                "nothanks": "\u3044\u3044\u3048",
                "startchat": "\u30c6\u30ad\u30b9\u30c8\u30fb\u30c1\u30e3\u30c3\u30c8",
                "videochat": "\u30d3\u30c7\u30aa\u30fb\u30c1\u30e3\u30c3\u30c8"
            },
            "dede": {
                "calloutmessage": "W\u00fcrden Sie gerne mit mir chatten?",
                "nothanks": "Nein, danke",
                "startchat": "Text-Chat",
                "videochat": "Video-Chat"
            },
            "nono": {
                "calloutmessage": "Vil du ha en samtale med meg?",
                "nothanks": "Nei takk",
                "startchat": "Tekstsamtale",
                "videochat": "Videosamtale"
            },
            "engb": {
                "calloutmessage": "Would you like to chat with me?",
                "nothanks": "No, thanks ",
                "startchat": "Text chat",
                "videochat": "Video chat"
            },
            "dadk": {
                "calloutmessage": "Vil du chatte med mig?",
                "nothanks": "Nej tak",
                "startchat": "Tekstchat",
                "videochat": "Videochat"
            },
            "frtn": {
                "calloutmessage": "Voulez-vous discuter avec moi?",
                "nothanks": "Non merci",
                "startchat": "Conversation \u00e9crite",
                "videochat": "Conversation vid\u00e9o"
            },
            "fifi": {
                "calloutmessage": "Haluatko keskustella kanssani?",
                "nothanks": "Ei kiitos",
                "startchat": "Tekstikeskustelu",
                "videochat": "Videokeskustelu"
            },
            "ruru": {
                "calloutmessage": "\u0425\u043e\u0442\u0438\u0442\u0435 \u043f\u043e\u043e\u0431\u0449\u0430\u0442\u044c\u0441\u044f \u0441\u043e \u043c\u043d\u043e\u0439 \u0432 \u0447\u0430\u0442\u0435?",
                "nothanks": "\u041d\u0435\u0442, \u0441\u043f\u0430\u0441\u0438\u0431\u043e",
                "startchat": "\u0422\u0435\u043a\u0441\u0442\u043e\u0432\u044b\u0439 \u0447\u0430\u0442",
                "videochat": "\u0412\u0438\u0434\u0435\u043e\u0447\u0430\u0442"
            },
            "bgbg": {
                "calloutmessage": "\u0416\u0435\u043b\u0430\u0435\u0442\u0435 \u043b\u0438 \u0434\u0430 \u043e\u0441\u044a\u0449\u0435\u0441\u0442\u0432\u0438\u0442\u0435 \u0432\u0438\u0440\u0442\u0443\u0430\u043b\u0435\u043d \u0434\u0438\u0430\u043b\u043e\u0433 \u0441 \u043c\u0435\u043d?",
                "nothanks": "\u041d\u0435 \u0431\u043b\u0430\u0433\u043e\u0434\u0430\u0440\u044f",
                "startchat": "\u0422\u0435\u043a\u0441\u0442\u043e\u0432 \u0447\u0430\u0442",
                "videochat": "\u0412\u0438\u0434\u0435\u043e \u0447\u0430\u0442"
            },
            "kokr": {
                "calloutmessage": "\uc800\uc640 \ub300\ud654\ub97c \ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?",
                "nothanks": "\ub300\ud654 \uc548\ud568",
                "startchat": "\ubb38\uc790 \ucc44\ud305",
                "videochat": "\uc601\uc0c1 \ucc44\ud305"
            },
            "esec": {
                "calloutmessage": "\u00bfDesea conversar conmigo?",
                "nothanks": "No, gracias",
                "startchat": "Conversaci\u00f3n",
                "videochat": "V\u00eddeo conversaci\u00f3n"
            },
            "esuy": {
                "calloutmessage": "\u00bfDesea conversar conmigo?",
                "nothanks": "No, gracias",
                "startchat": "Conversaci\u00f3n",
                "videochat": "V\u00eddeo conversaci\u00f3n"
            },
            "elgr": {
                "calloutmessage": "\u0398\u03ad\u03bb\u03b5\u03c4\u03b5 \u03bd\u03b1 \u03c3\u03c5\u03bd\u03bf\u03bc\u03b9\u03bb\u03ae\u03c3\u03b5\u03c4\u03b5 \u03bc\u03b1\u03b6\u03af \u03bc\u03bf\u03c5;",
                "nothanks": "\u038c\u03c7\u03b9, \u03b5\u03c5\u03c7\u03b1\u03c1\u03b9\u03c3\u03c4\u03ce!",
                "startchat": "\u03a3\u03c5\u03bd\u03bf\u03bc\u03b9\u03bb\u03af\u03b1 \u03ba\u03b5\u03b9\u03bc\u03ad\u03bd\u03bf\u03c5",
                "videochat": "\u03a3\u03c5\u03bd\u03bf\u03bc\u03b9\u03bb\u03af\u03b1 \u03b2\u03af\u03bd\u03c4\u03b5\u03bf"
            },
            "ptbr": {
                "calloutmessage": "Gostaria de iniciar um bate-papo comigo?",
                "nothanks": "N\u00e3o, obrigado",
                "startchat": "Bate-papo com texto",
                "videochat": "Bate-papo com v\u00eddeo"
            },
            "esmx": {
                "calloutmessage": "\u00bfDesea conversar conmigo?",
                "nothanks": "No, gracias",
                "startchat": "Conversaci\u00f3n",
                "videochat": "V\u00eddeo conversaci\u00f3n"
            },
            "huhu": {
                "calloutmessage": "Csevegjen velem",
                "nothanks": "K\u00f6sz\u00f6n\u00f6m, nem",
                "startchat": "Sz\u00f6veges cseveg\u00e9s",
                "videochat": "Vide\u00f3cseveg\u00e9s"
            },
            "eses": {
                "calloutmessage": "\u00bfDesea conversar conmigo?",
                "nothanks": "No, gracias",
                "startchat": "Conversaci\u00f3n de texto",
                "videochat": "Conversaci\u00f3n de v\u00eddeo"
            },
            "esve": {
                "calloutmessage": "\u00bfDesea conversar conmigo?",
                "nothanks": "No, gracias",
                "startchat": "Conversaci\u00f3n",
                "videochat": "V\u00eddeo conversaci\u00f3n"
            },
            "esar": {
                "calloutmessage": "\u00bfDesea conversar conmigo?",
                "nothanks": "No, gracias",
                "startchat": "Conversaci\u00f3n",
                "videochat": "V\u00eddeo conversaci\u00f3n"
            },
            "heil": {
                "calloutmessage": "\u05d4\u05d0\u05dd \u05ea\u05e8\u05e6\u05d4 \u05dc\u05e9\u05d5\u05d7\u05d7 \u05d0\u05d9\u05ea\u05d9 \u05d1\u05e6'\u05d0\u05d8?",
                "nothanks": "\u05dc\u05d0 \u05ea\u05d5\u05d3\u05d4 ",
                "startchat": "\u05e9\u05d9\u05d7\u05ea \u05e6'\u05d0\u05d8 \u05d1\u05ea\u05de\u05dc\u05d9\u05dc",
                "videochat": "\u05e9\u05d9\u05d7\u05ea \u05e6'\u05d0\u05d8 \u05d1\u05d5\u05d5\u05d9\u05d3\u05d0\u05d5"
            },
            "srrs": {
                "calloutmessage": "Da li biste \u017eeleli da \u0107askate samnom?",
                "nothanks": "Ne hvala ",
                "startchat": "Tekstualno \u0107askanje",
                "videochat": "Video \u0107askanje"
            },
            "frdz": {
                "calloutmessage": "Voulez-vous discuter avec moi?",
                "nothanks": "Non merci",
                "startchat": "Conversation \u00e9crite",
                "videochat": "Conversation vid\u00e9o"
            },
            "cscz": {
                "calloutmessage": "Chcete se mnou konverzovat?",
                "nothanks": "Nem\u00e1m z\u00e1jem",
                "startchat": "Textov\u00e1 konverzace",
                "videochat": "Audiovizu\u00e1ln\u00ed konverzace"
            },
            "slsi": {
                "calloutmessage": "Kako \u017eelite klepetati z menoj?",
                "nothanks": "Ne, hvala",
                "startchat": "Besedilni klepet",
                "videochat": "Video klepet"
            },
            "svse": {
                "calloutmessage": "Vill du starta en chatt med mig?",
                "nothanks": "Nej tack",
                "startchat": "Textchatt",
                "videochat": "Videochatt"
            },
            "plpl": {
                "calloutmessage": "Czy chcesz ze mn\u0105 porozmawia\u0107?",
                "nothanks": "Nie, dzi\u0119kuj\u0119",
                "startchat": "Rozmowa tekstowa",
                "videochat": "Rozmowa wideo"
            },
            "esbo": {
                "calloutmessage": "\u00bfDesea conversar conmigo?",
                "nothanks": "No, gracias",
                "startchat": "Conversaci\u00f3n",
                "videochat": "V\u00eddeo conversaci\u00f3n"
            },
            "nlnl": {
                "calloutmessage": "Wilt u met mij chatten?",
                "nothanks": "Nee, bedankt",
                "startchat": "Tekstchat",
                "videochat": "Videochat"
            },
            "trtr": {
                "calloutmessage": "Benimle sohbet etmek istiyor musunuz?",
                "nothanks": "Hay\u0131r, te\u015fekk\u00fcrler",
                "startchat": "Yaz\u0131l\u0131 sohbet",
                "videochat": "G\u00f6r\u00fcnt\u00fcl\u00fc sohbet"
            },
            "esco": {
                "calloutmessage": "\u00bfDesea conversar conmigo?",
                "nothanks": "No, gracias",
                "startchat": "Conversaci\u00f3n",
                "videochat": "V\u00eddeo conversaci\u00f3n"
            },
            "frma": {
                "calloutmessage": "Voulez-vous discuter avec moi ?",
                "startchat": "Conversation \u00e9crite",
                "nothanks": "Non, merci ",
                "videochat": "Conversation vid\u00e9o"
            },
            "deat": {
                "calloutmessage": "W\u00fcrden Sie gerne mit mir chatten?",
                "startchat": "Text-Chat",
                "nothanks": "Nein, danke",
                "videochat": "Video-Chat"
            },
            "dech": {
                "calloutmessage": "W\u00fcrden Sie gerne mit mir chatten?",
                "startchat": "Text-Chat",
                "nothanks": "Nein, danke ",
                "videochat": "Video-Chat"
            }
        };
    }
});
var STCLB;
dojo.ready(function () {
    var hidden, state, visibilityChange;
    if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
        state = "visibilityState";
    } else if (typeof document.mozHidden !== "undefined") {
        hidden = "mozHidden";
        visibilityChange = "mozvisibilitychange";
        state = "mozVisibilityState";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
        state = "msVisibilityState";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
        state = "webkitVisibilityState";
    }

    STCLB = new sametime.Colaborate({

    });
    // Add a listener that constantly changes the title
    try {
        document.addEventListener(visibilityChange, function (e) {
            // Start or stop processing depending on state
            if (document[state] == "hidden") {
                STCLB.inFocus = false;

            } else {
                STCLB.inFocus = true;
                STCLB.setupDelay();

            }
            if (STCLB.debug)
                console.log(document[state]);

        }, false);
    } catch (e) {

    }

});