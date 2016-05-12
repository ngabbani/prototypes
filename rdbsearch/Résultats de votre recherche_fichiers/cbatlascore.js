/// <reference name="MicrosoftAjax.debug.js" />

//CBAtlasCore.js
//The base class that should be used in all CB-generated JS classes

Type.registerNamespace('CB2.Framework.CBAtlasCore');

CB2.Framework.CBAtlasCore = function()
{
}

var $cblog = CB2.Framework.CBAtlasCore.Log = function CB2$Framework$CBAtlasCore$Log(message)
{    //only trace when we are using the debug version of scripts.
    if (Sys.Debug.isDebug) Sys.Debug.trace(message);
}

function CB2$Framework$CBAtlasCore$initialize()
{

}

function CB2$Framework$CBAtlasCore$CreateCallback(instance, method, args)
{
    /// <param name="instance" mayBeNull="false"></param>
    /// <param name="method" type="Function"></param>
    /// <param name="args" parameterArray="true" mayBeNull="true" optional="true"></param>
    /// <returns type="Function"></returns>

    var e = Function._validateParams(arguments, [
        {name: "instance", mayBeNull: false},
        {name: "method", type: Function},
        {name: "args", parameterArray: true, mayBeNull: true, optional: true}
        ]);
        
    if (e) throw e;

    var handlerArgs = [];
    for (var i = 0, length = arguments.length; i < length; i++)
        handlerArgs.push(arguments[i]);
        
    return function() {            
        var locArgs = [];
        for (var i = 0, length = arguments.length; i < length; i++)
            locArgs.push(arguments[i]);
            
        //add the element that the event was attached to to the end of the args
        locArgs.push(this);
        
        //call the handler method, passing in the evt, the elm on which the event was attached, and the arbitrary args to the method
        return method.apply(instance, locArgs.concat(handlerArgs.slice(2)));
    }
}

function CB2$Framework$CBAtlasCore$CreateAJAXRequest(url, data, handler, usr_contxt)
{
    return this.CreateAJAXRequestAdv(url, "POST", data, handler, usr_contxt, false);
}

function CB2$Framework$CBAtlasCore$CreateAJAXRequestAdv(url, verb, data, handler, usr_cntxt, is_secure)
{
    /// <param name="url" type="String"></param>
    /// <param name="verb" type="String"></param>
    /// <param name="data" type="String"></param>
    /// <param name="handler" type="Function" mayBeNull="true"></param>
    /// <param name="usr_cntxt" type="Object" mayBeNull="true"></param>
    /// <param name="is_secure" type="Boolean" optional="true" mayBeNull="true"></param>

    var e = Function._validateParams(arguments, [
        {name: "url", type: String},
        {name: "verb", type: String},
        {name: "data", type: String},
        {name: "handler", type: Function, mayBeNull: true},
        {name: "usr_cntxt", type: Object, mayBeNull: true},
        {name: "is_secure", type: Boolean, mayBeNull: true, optional: true}
       ]);
       
    if (e) throw e;

    // Instantiate a WebRequest.
    var wRequest = new Sys.Net.WebRequest();

    // Set the request Url.
    if(!url.startsWith('http')){
        wRequest.set_url(this._BuildWebRequestURL(url, is_secure));
    }  else {
        wRequest.set_url(url);  
    }

    // Set the request verb.
    wRequest.set_httpVerb(verb);

    // Set the body for the POST
    if (data) wRequest.set_body(data);

    // Set the request callback function.
    if (handler) wRequest.add_completed(handler);
    
    // Add this object to the user context so we can reuse it when we get back from the ajax call
    if (usr_cntxt) wRequest.set_userContext(usr_cntxt);   

    return wRequest;

}

function CB2$Framework$CBAtlasCore$InvokeAJAXRequest(wRequest)
{
    /// <param name="wRequest" type="Object"></param>

    var e = Function._validateParams(arguments, [
        {name: "wRequest", type: Object}
       ]);
       
    if (e) throw e;

    try
    {
        wRequest.invoke();
    }
    catch(e)
    {
        $cberror.ReportError(this, "Caught exception invoking AJAX request.", e);
    }
}

function CB2$Framework$CBAtlasCore$_BuildWebRequestURL(url, isSecure)
{
    var bIsDev = false;
    var devPath = "";
    if (window.location.host.startsWith("dev"))
    {
        //extract dev box path
        bIsDev = true;
        devPath = /.*\/cbweb/i.exec(window.location.pathname)[0];
    }

    var returnURL = "";

    var curIsSecure = (window.location.protocol === "https:");
    if (isSecure || (!bIsDev && curIsSecure))
    {
        //build secure url
        returnURL = "https://" + window.location.hostname + "/" + url; 
    }
    else
    {
        //build non-secure url
        var path = "";
        var hostname = window.location.hostname;
        
        if (bIsDev) {
            path = devPath;
        } else if (((url.indexOf('.js') > -1) || (url.indexOf('.css') > -1)) && (ScriptVariables.Contains('currentVer'))) {
            if (!window.location.host.startsWith("wwwtest")) {  
                hostname = 'img.icbdr.com';
            }                
                
            path = ScriptVariables.Get('currentVer');            
        } else {
            path = "";
        }
        
		if (path == "") {
			returnURL = "http://" + hostname + "/" + url;
		} else {
			returnURL = "http://" + hostname + '/' + path + "/" + url;
		}
    }
            
    return returnURL;   
}


CB2.Framework.CBAtlasCore.prototype =
{
    initialize: CB2$Framework$CBAtlasCore$initialize,
          
    //Bind method creates a handler that ensures this object will still have context when the handler runs
    CreateCallback: CB2$Framework$CBAtlasCore$CreateCallback,
    CreateAJAXRequest: CB2$Framework$CBAtlasCore$CreateAJAXRequest,
    CreateAJAXRequestAdv: CB2$Framework$CBAtlasCore$CreateAJAXRequestAdv,
           
    //Invokes the passed in AJAX request, and handles errors
    InvokeAJAXRequest: CB2$Framework$CBAtlasCore$InvokeAJAXRequest,

    _BuildWebRequestURL : CB2$Framework$CBAtlasCore$_BuildWebRequestURL
}

CB2.Framework.CBAtlasCore.registerClass('CB2.Framework.CBAtlasCore');

//Create CBStats and CBError Classes

CB2.Framework.CBAtlasCore._CBStats = function()
{
    CB2.Framework.CBAtlasCore._CBStats.initializeBase(this);
    
    // ._statsArray is a JSON object with object-method-task as the key,
    // and a JSON value of object, method, task, numthings
    // e.g., {mysearchesv3,deletesearch,delete: {object: mysearchesv3, method: deletesearch, task: delete, numthings: 1}}
    this._statsArray = {};
    
    //add an unload handler so we can send the collected tallies before the user navigates to a new page
    Sys.Application.add_unload(Function.createDelegate(this, this._SendTallies));
}

function CB2$Framework$CBAtlasCore$_CBStats$Tally(object, method, task, numthings)
{
    /// <param name="object" type="String"></param>
    /// <param name="method" type="String"></param>
    /// <param name="task" type="String"></param>
    /// <param name="numthings" type="Number" integer: true mayBeNull: true optional: true></param>

    var e = Function._validateParams(arguments, [
        {name: "object", type: String},
        {name: "method", type: String},
        {name: "task", type: String},
        {name: "numthings", type: Number, integer: true, mayBeNull: true, optional: true}
       ]);
       
    //Try
    if (e)
    {
        $cberror.ReportError(this, "Invalid Arguments to Tally", e);
    }
    else
    {    
        this._AddTally(object, method, task, numthings);
    }

}

function CB2$Framework$CBAtlasCore$_CBStats$_AddTally(obj, meth, tsk, numthngs)
{
    var valueJSON;
    
    // make the key
    var key = [obj.toLowerCase(), meth.toLowerCase(), tsk.toLowerCase()].toString();  //creates a CSV string
    
    // verify the _statsArray
    if (!this._statsArray) this._statsArray = {};
    
    // check whether the key exists
    if (!this._statsArray[key])
    {
        //new entry
        valueJSON = {object: obj, method: meth, task: tsk};
        
        //set numthings
        numthngs ? valueJSON.numThings = numthngs : valueJSON.numThings = 1;
        
        //set the parent (removing dev directories if necessary)
        valueJSON.parent = window.location.pathname.replace(/.*\/cbweb/i, "");
        
        this._statsArray[key] = valueJSON;
        
        this._statsArray.$hasData = true;
    }
    else
    {
        //item already exists, increment numThings or add in numthngs
        numthngs ? this._statsArray[key].numThings += numthngs : this._statsArray[key].numThings += 1;
    }
}

function CB2$Framework$CBAtlasCore$_CBStats$_SendTallies(evt)
{
    // Package up the tallies and send them off to be counted
    if (this._statsArray && this._statsArray.$hasData)
    {
        var out = "data=" + Sys.Serialization.JavaScriptSerializer.serialize(this._statsArray);
        
        var wRequest = this.CreateAJAXRequest("AtlasEvents/AtlasTally.aspx", out, null);
        
        this.InvokeAJAXRequest(wRequest);   
    }   
}

CB2.Framework.CBAtlasCore._CBStats.prototype =
{
    Tally: CB2$Framework$CBAtlasCore$_CBStats$Tally,
    _AddTally: CB2$Framework$CBAtlasCore$_CBStats$_AddTally,
    _SendTallies: CB2$Framework$CBAtlasCore$_CBStats$_SendTallies
}

CB2.Framework.CBAtlasCore._CBStats.registerClass('CB2.Framework.CBAtlasCore._CBStats', CB2.Framework.CBAtlasCore);

// Instantiate default instance of CBStats
var $cbstats = CB2.Framework.CBAtlasCore.CBStats = new CB2.Framework.CBAtlasCore._CBStats();



CB2.Framework.CBAtlasCore._CBError = function()
{
    CB2.Framework.CBAtlasCore._CBError.initializeBase(this);
    
    // ._errorsArray is an array of JSON objects
    // each JSON object defines a particular error
    this._errorArray = [];
    
    //add an unload handler so we can send the collected tallies before the user navigates to a new page
    Sys.Application.add_unload(Function.createDelegate(this, this._SendErrors));
}

    
function CB2$Framework$CBAtlasCore$_CBError$ReportError(instance, msg, exception)
{
    /// <param name="object" type="String"></param>
    /// <param name="msg" type="String"></param>
    /// <param name="exception" type="Object" mayBeNull: true optional: true></param>

    var e = Function._validateParams(arguments, [
        {name: "instance", type: Object},
        {name: "msg", type: String},
        {name: "exception", type: Object, mayBeNull: true, optional: true}
       ]);
       
    if (e) throw e;
    
    //arguments.callee.caller is the function that called this one
    this._AddError(instance, arguments.callee.caller, msg, exception);

}


function CB2$Framework$CBAtlasCore$_CBError$_AddError(instance, func, msg, exception)
{
    // verify the error array
    if (!this._errorArray) this._errorArray = [];
    
    var getFuncName = function(aFunc) {
        var s = aFunc.toString().match(/function (.*)\(/)[1];
        if ((s == null) || (s.length == 0)) return "(anonymous function)";
        return s.trimEnd() + "()";
    };
    
    // get the function's name
    var sFuncName = getFuncName(func);
    
    // create the error object
    var jsonError = {"object": Object.getType(instance).getName(), "method": sFuncName, "msg": msg};
    
    // add the exception object if applicable
    if (exception) jsonError.exception = exception;
    
    //set the page where the error occurred (removing dev directories if necessary)
    jsonError.page = window.location.pathname.replace(/.*\/cbweb/i, "");
    
    // add browser info
    jsonError.browser = {};
    jsonError.browser.name = Sys.Browser.name;
    jsonError.browser.version = window.navigator.userAgent;
    jsonError.browser.hasCookies = window.navigator.cookieEnabled;
    
    // add the body of the function
    jsonError.functionBody = func.toString();
    
    // add the arguments passed to the function
    var args = []
    for (var i = 0, l = func.arguments.length; i < l; i++) args.push(func.arguments[i]);
    jsonError.functionArgs = args.toString();
    
    // add the name of the function's caller
    jsonError.functionCallerName = func.caller ? getFuncName(func.caller) : "unknown";
    
    // add it to the error array
    this._errorArray.push(jsonError);
}

function CB2$Framework$CBAtlasCore$_CBError$_SendErrors()
{
    // Package up the errors and send them off to be reported
    if (this._errorArray && this._errorArray.length > 0)
    {
        var out = "data=" + Sys.Serialization.JavaScriptSerializer.serialize(this._errorArray);
        
        var wRequest = this.CreateAJAXRequest("AtlasEvents/AtlasError.aspx", out, null);
        
        this.InvokeAJAXRequest(wRequest); 
    }   

}

CB2.Framework.CBAtlasCore._CBError.prototype =
{
    ReportError: CB2$Framework$CBAtlasCore$_CBError$ReportError,
    _AddError: CB2$Framework$CBAtlasCore$_CBError$_AddError,
    _SendErrors: CB2$Framework$CBAtlasCore$_CBError$_SendErrors
}


CB2.Framework.CBAtlasCore._CBError.registerClass('CB2.Framework.CBAtlasCore._CBError', CB2.Framework.CBAtlasCore);

// Instantiate default instance of CBError
var $cberror = CB2.Framework.CBAtlasCore.CBError = new CB2.Framework.CBAtlasCore._CBError();


if (typeof(Sys) !== 'undefined') Sys.Application.notifyScriptLoaded();
