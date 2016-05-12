/*
 * jQuery cblibrary plugin
 * Copyright 2010, CareerBuilder.com
 */
var cbj=jQuery;(function(a){a.ajaxSetup({timeout:10000});a.cb=function(){this._Tallies={};this._sPage=ScriptVariables.Get("sPageNamePath");var b=function(f,e){e.type=f;e.page=this._sPage;e.key=e.type+"_"+e.object+"_"+e.method+"_"+e.task;if(this._Tallies[e.key]){switch(f){case"tally":this._Tallies[e.key].numthings+=e.numthings;break;case"timing":this._Tallies[e.key].duration=e.duration;break;case"exception":this._Tallies[e.key]=e;break}}else{this._Tallies[e.key]=e}};var d=function(e){e=e.replace(",","");return e};var c=function(e){if(!e){e="unload"}var g="&srcevent="+e;var i=0;var h=null;for(var f in this._Tallies){if(f!=undefined&&this._Tallies[f]!=undefined){h=this._Tallies[f];i+=1;g+="&";g+=h.type+i+"=";g+=h.page;g+=","+d(h.object);g+=","+d(h.method);g+=","+d(h.task);switch(h.type){case"tally":g+=","+d(h.numthings.toString());break;case"timing":g+=","+d(h.duration.toString());break;case"exception":g+=","+d(h.exceptionName);g+=","+d(h.exceptionMessage);g+=","+d(h.navigatorUserAgent);break}}}if(i>0){if(e=="unload"||e=="beforeunload"){a.ajax(ScriptVariables.Get("sAtlasTallyUrl"),{type:"POST",data:g,async:false,success:function(){_Tallies={}}})}else{a.post(ScriptVariables.Get("sAtlasTallyUrl"),g,function(){_Tallies={}})}}};a(window).one("load",a.proxy(function(){setTimeout(function(){c("load")},500)},this));a(window).one("beforeunload",a.proxy(function(){return c("beforeunload")},this));a(window).one("unload",a.proxy(function(){return c("unload")},this));return{Tally:function(j,g,i,h){try{var f={object:j,method:g,task:i};h?f.numthings=h:f.numthings=1;b("tally",f)}catch(k){a.cb.Exception("cb","addTally","Error creating and storing tally.",k)}},Timing:function(j,f,i,g){try{var h={object:j,method:f,task:i};if(g){h.duration=g}else{h.duration=0}b("timing",h)}catch(k){a.cb.Exception("cb","addTiming","Error creating and storing timing.",k)}},Exception:function(i,f,g,h){try{var k={};k.object=i;k.method=f;k.task=g;k.exceptionName=h.name;k.exceptionMessage=h.message;k.navigatorUserAgent=window.navigator.userAgent.toString();b("exception",k)}catch(j){}},namespace:function(){var e=arguments,l=this,k=0,h=0,f=null,g=null;for(k=0;k<e.length;k=k+1){f=e[k].split(".");for(h=0;h<f.length;h=h+1){g=f[h];l[g]=l[g]||{};l=l[g]}}return l}}}()})(jQuery);