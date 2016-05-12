
var iSaveXCoord = null;
var iSaveYCoord = null;
jQuery(document).ready(function () {
    jQuery('span#save-container a').each(function () {
        jQuery(this).click(function (e) {
            iSaveXCoord = e.pageX + 20;
            iSaveYCoord = e.pageY - 80;
        });
    });
});

/*SHOW*/
var myRFDWindow;
var myRFDWindowAnchor;
var myanchor = "";
var fastflip = false;
var g_folderdlg_curHasBeenSaved = false;
var g_folderdlg_curSelFolderDid = "";
var g_folderdlg_curSavedAppDid = "";
var g_folderdlg_curSavedAppDate = "";
var g_folderdlg_curSelResumeDID = "";
var g_folderdlg_curTrackingDID = "";
var g_folderdlg_curAuditDID = "";
var g_folderdlg_SaveResponseArray;

var g_folderdlg_OnSaveExit;
var g_folderdlg_OnUnSaveExit;
var g_folderdlg_OnLoad;

function showResumeFolderDialog(resumedid, resumetitle, resumesavedappdid, resumesavedappdate, trackingdid, auditid, anch, anchOffsetX, anchOffsetY, userdid, accountdid, functionRunOnExitWithSaving, functionRunOnExitWithoutSaving, functionRunOnLoad) {

    if (anch != null) {
        myRFDWindowAnchor = anch;
        myanchor = anch;
    }
    else {
        alert('Unfortunately we are experiencing technical difficulties. Please try again.');
        return;
    }

    if (!myRFDWindow) {
        var div = document.getElementById('resumefolderdialog');
        //document.body.appendChild(div);
        myRFDWindow = CB.object(CB.AJAX.Popup);
        myRFDWindow.initialize(div, { documentClickCloses: false });
        myRFDWindow.onHide = onHideRFDPopup;
        myRFDWindow.halign = 'flush';
    }

    g_folderdlg_OnSaveExit = functionRunOnExitWithSaving;
    g_folderdlg_OnUnSaveExit = functionRunOnExitWithoutSaving;
    g_folderdlg_OnLoad = functionRunOnLoad;

    myRFDWindow.show(document.getElementById(myRFDWindowAnchor), null, anchOffsetX, anchOffsetY);
    //if(jQuery('#operations-container').get(0) !== null && jQuery('#operations-container').get(0) !== undefined) {
    //jQuery('div#shadowAJAX').css('left', iSaveXCoord).css('top', iSaveYCoord).css('position', 'absolute');
    //document.documentElement.scrollTop = 0;
    //}


    if (g_folderdlg_OnLoad != null)
        g_folderdlg_OnLoad();

    folderdlg_clearResults('folderpane');
    document.getElementById('resumefolderwrapper').style.display = 'block';
	
	folderdlg_showLoading(ScriptVariables.Get('sbLoadingMsg'));
    
	g_folderdlg_curHasBeenSaved = false;
    g_folderdlg_curSavedAppDid = resumesavedappdid;

    //making sure our date is in correct format
    if (resumesavedappdate.indexOf('/') >= 0)
        resumesavedappdate = resumesavedappdate.replace(/\//g, "-");

    g_folderdlg_curSavedAppDate = resumesavedappdate;
    g_folderdlg_curSelResumeDID = resumedid;
    g_folderdlg_SaveResponseArray = new Array();
    g_folderdlg_curTrackingDID = trackingdid;
    g_folderdlg_curAuditDID = auditid;

	document.getElementById('folderdlg_resumename').innerHTML = ScriptVariables.Get('Localization_SaveToBatchText');

    var params = "";
    params += "?calltype=getfolders";
    if (userdid != null && userdid != '' && accountdid != null && accountdid != '')
        params += "&userdid=" + userdid + "&accountdid=" + accountdid;

    params += "&getrandom=" + folderdlg_getRandom();

    folderdlg_GetFolders(params);

}

function GetUSerControlID(strPattern) {

    var pattern = eval("/" + strPattern + "/i");
    var inputs = document.getElementsByTagName('a');
    for (var i = 0; i < inputs.length; i++) {
        var str = inputs[i].id;
        if (pattern.test(str)) {
            return str;
        }
    }

}

function folderdlg_formatNum(num) {
    var mynum = num * 1;
    var retVal = mynum < 10 ? '0' : '';
    return (retVal + mynum)
}

function folderdlg_hideRFDWindow() {
    if (myRFDWindow) {
        myRFDWindow.hide();
    }
}

function onHideRFDPopup() {
    if (g_folderdlg_curHasBeenSaved) {
        if (g_folderdlg_OnSaveExit != null) {
            //we need to call that function on this successful exit
            g_folderdlg_OnSaveExit();
        }
    }
    else {
        if (g_folderdlg_OnUnSaveExit != null) {
            //we need to call that function on this UNsuccessful exit
            g_folderdlg_OnUnSaveExit();
        }
    }

    CB.e('resumefolderwrapper').style.display = 'none';
}

function folderdlg_showLoading(msgText) {
    document.getElementById('folderdlg_message').innerHTML = msgText;
    document.getElementById('folderdlg_loading').style.display = 'block';
    g_folderdlg_spinnerRunning = true;
}

function folderdlg_hideLoading() {
    document.getElementById('folderdlg_loading').style.display = 'none';
    g_folderdlg_spinnerRunning = false;
}


/* AJAX FUNCTIONS*/
var g_folderdlg_CBFeedManager = null;
var g_folderdlg_CBFeed = 'ResumeFoldersXML.aspx';
var g_folderdlg_CBXMLDoc = null;
var g_folderdlg_ErrorFlag = false;
var g_folderdlg_spinnerRunning = false;
var g_folderdlg_CBSortfield = "name"

//messages
var L_CANTCONNECT_TEXT = "Error retrieving data.<br/>Please check your connection";
var L_UNEXPECTEDERR_TEXT = "An unexpected Error has occured. Please try later";

folderdlg_SetupAjaxPath();

function folderdlg_SetupAjaxPath() {
    var sAjaxPrefix = '';
    if (ScriptVariables.Contains('sAjaxRelativePrefix')) {
        sAjaxPrefix = ScriptVariables.Get('sAjaxRelativePrefix');
    } else {
        sAjaxPrefix = ajaxRelativePrefix;
    }
    //setup correct path
    if (typeof sAjaxPrefix != 'undefined') {
        // prefix page with relative path prefix var that was inserted by MatrixPage - need to trim off AJAX part
        //var Prefix = ajaxRelativePrefix.replace('AJAX', 'rtq');
        //g_folderdlg_CBFeed = Prefix + g_folderdlg_CBFeed;
        g_folderdlg_CBFeed = sAjaxPrefix + g_folderdlg_CBFeed;
    }
    else {
        //try careerbuilder.com	    
        g_folderdlg_CBFeed = 'http://www.careerbuilder.com/ajax' + g_folderdlg_CBFeed;
    }

}

function folderdlg_InitializeFeedManager() {
    try {
        g_folderdlg_CBFeedManager = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch (e) {
        try {
            g_folderdlg_CBFeedManager = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch (oc) {
            g_folderdlg_CBFeedManager = null;
        }
    }

    if (!g_folderdlg_CBFeedManager && typeof XMLHttpRequest != "undefined") {
        g_folderdlg_CBFeedManager = new XMLHttpRequest();
    }
}


var batchAction = false;
function folderdlg_saveResToFolderWithAjax(resumedid, folderdid, appdid, savedate, trackingdid, auditdid) {

    if (myanchor != null && myanchor.indexOf("FastFlip") != -1) {
        fastflip = true;
    }
    if (myanchor != null && myanchor.indexOf("batchAction") != -1) {
        batchAction = true;
    }

    if (appdid != null && appdid.length > 0) {
        CB.AJAX.submitCallback('folderdid=' + folderdid + '&appldid=' + appdid + '&date=' + savedate + '&fastflip=' + fastflip, 'AppDetailsAjaxServer.aspx', folderdlgafterSaveToFolder);
    }
    else {
        var params = "", bulkFFSave = "";
        if (ScriptVariables.Get("bEnableViewTypeFFForSavePath")) {
            bulkFFSave = "&bulkresumes=true";
        }
               
        
            if (ScriptVariables.Get("bFixRecordActionsForDataStore") && typeof (g_auditID) != "undefined") {
                params = "batchAction=" + batchAction + "&fastflip=" + fastflip + "&Resume_DID=" + resumedid + "&hdnAddFolderDID=" + folderdid + "&NWDataStoreLabel_DID=" + ScriptVariables.Get("NWDataStoreLabel_DID") + "&MXAuditSearchCriteria_CriteriaDID=" + g_auditID + "&calltype=savetofolder" + bulkFFSave;
            }
            else {
                params = "batchAction=" + batchAction + "&fastflip=" + fastflip + "&Resume_DID=" + resumedid + "&hdnAddFolderDID=" + folderdid + "&NWDataStoreLabel_DID=" + trackingdid + "&MXAuditSearchCriteria_CriteriaDID=" + auditdid + "&calltype=savetofolder" + bulkFFSave;
            }     

        if (ScriptVariables.Contains('Matching_ResumeDID')) {
            params += '&Matching_ResumeDID=' + ScriptVariables.Get('Matching_ResumeDID');
        }
        if (ScriptVariables.Contains("semanticID") && ScriptVariables.Get("semanticID") != null)
            params += "&semanticID=" + ScriptVariables.Get("semanticID");
        else if (typeof g_semanticID != "undefined" && g_semanticID != null)
            params += "&semanticID=" + g_semanticID;
        if (ScriptVariables.Contains("QID") && ScriptVariables.Get("QID") != null)
            params += "&QID=" + ScriptVariables.Get("QID");
        else if (typeof g_QID != "undefined" && g_QID != null)
            params += "&QID=" + g_QID;
        
        if ((ScriptVariables.Contains('semanticsearchall') || (typeof(g_semanticSearchAll) != "undefined" && g_semanticSearchAll == 'semanticsearchall')) 
                && !ScriptVariables.Contains('Matching_ResumeDID')) {
            params += "&semanticsearchall=1";
        }
        if (typeof getRelativeResumePosition !== 'undefined' && getRelativeResumePosition(resumedid) >= 0) {
            var resumeLocInList = getRelativeResumePosition(resumedid);
            if (getFromStrcrit('RPP=') !== "")
                params += '&absoluteresumeloc=' + (resumeLocInList + 1 + ((g_curSetPage - 1) * getFromStrcrit('RPP=')));

            params += '&relativeresumeloc=' + 'pg:' + g_curSetPage + "|loc:" + (resumeLocInList + 1);
        }
        folderdlg_InitializeFeedManager();
        g_folderdlg_CBFeedManager.onreadystatechange = folderdlg_processCallBack_SaveResToFolder;
        g_folderdlg_CBFeedManager.open("GET", g_folderdlg_CBFeed + '?' + params, true);
        g_folderdlg_CBFeedManager.send(null);
    }
}

function folderdlgafterSaveToFolder(success, responseText) {
    if (success) {
        myarray = responseText.split("¿");
        switch (myarray[0]) {
            case '0':
                alert(CB.CandidateDetails.sErrorAdd);
                break;
            case '1':
                //we are in good shape... just go ahead and close the window..
                g_folderdlg_curHasBeenSaved = true;
                g_folderdlg_SaveResponseArray = myarray;
                break;
        }
    }
    else {
        alert('Unfortunately we could not save the resume at this time. Please try again later.');
    }
    folderdlg_hideLoading();
    folderdlg_hideRFDWindow();
}

function folderdlg_processCallBack_SaveResToFolder() {
    if (g_folderdlg_CBFeedManager.readyState == 4) {
        // only if "OK"
        if (g_folderdlg_CBFeedManager.status == 200) {
            myarray = g_folderdlg_CBFeedManager.responseText.split("¿");
            switch (myarray[0]) {
                case '0':
                    alert('Unfortunately we could not save the resume at this time. Please try again later.');
                    folderdlg_hideLoading();
                    folderdlg_hideRFDWindow();
                    break;
                case '1':
                    //we are in good shape... just go ahead and close the window..
                    g_folderdlg_curHasBeenSaved = true;
                    g_folderdlg_SaveResponseArray = myarray;

                    jQuery('#foldersthere').show();
                    jQuery('#foldersnotthere').hide();

                    jQuery("#folderContainer").append("<div id='fld_" + g_folderdlg_curSelFolderDid + "' style='clear:both;display:none;'><div style='float:left; padding-right:4px;'><img src='http://img.icbdr.com/images/JP/Icons/folder.jpg' width='15' height='14' border='0' /></div><div style='float:left;'>" + jQuery("#" + g_folderdlg_curSelFolderDid).children(".foldername").children("p").text() + "&nbsp;&nbsp;<i><span style='color:#737373'>" + jQuery("#" + g_folderdlg_curSelFolderDid).children(".typename").children("p").text() + "</span></i></div><div style='float:left; padding-left:8px;'><img id='rem_" + g_folderdlg_curSelFolderDid + "' class='removefromfolder' src='http://img.icbdr.com/images/JP/Icons/deletefolder.jpg' width='12' height='12' border='0' /></div></div>");
                    jQuery("#rem_" + g_folderdlg_curSelFolderDid).css("cursor", "pointer");
                    jQuery("#rem_" + g_folderdlg_curSelFolderDid).attr("title", "Remove this resume from folder");
                    jQuery("#rem_" + g_folderdlg_curSelFolderDid).bind("click", function () { var folderid = jQuery(this).attr("id").substr(jQuery(this).attr("id").indexOf("_") + 1); removeResumeFromFolder(folderid); });
                    jQuery("#fld_" + g_folderdlg_curSelFolderDid).fadeIn('slow');

                    folderdlg_hideLoading();
                    folderdlg_hideRFDWindow();
                    break;
            }

        }
        else {
            alert('Unfortunately we could not save the resume at this time. Please try again later.\nError: ' + g_folderdlg_CBFeedManager.status);
            folderdlg_hideLoading();
            folderdlg_hideRFDWindow();
        }
    }

}


function folderdlg_addNewFolderWithAjax(name, isshared) {
    var params = "MXNWFolder_Name=" + name + "&MXNWFolder_IsShared=" + isshared + "&calltype=addfolder";
    folderdlg_InitializeFeedManager();
    g_folderdlg_CBFeedManager.onreadystatechange = function () { folderdlg_processCallBack_AddFolder(name, isshared) };
    g_folderdlg_CBFeedManager.open("POST", g_folderdlg_CBFeed, true);
    g_folderdlg_CBFeedManager.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    g_folderdlg_CBFeedManager.setRequestHeader("Content-length", params.length);
    g_folderdlg_CBFeedManager.setRequestHeader("Connection", "close");
    g_folderdlg_CBFeedManager.send(params);
}

function folderdlg_processCallBack_AddFolder(name, type) {
    g_folderdlg_ErrorFlag = false;
    var errMsg = "";

    if (g_folderdlg_CBFeedManager.readyState == 4) {
        // only if "OK"

        if (g_folderdlg_CBFeedManager.status == 200) {
            //alert(g_CBFeedManager.responseText);

            if (g_folderdlg_CBFeedManager.responseText.substr(0, 5) == "ERROR") {
                errMsg = L_IDENTIFY_TEXT;
                g_folderdlg_ErrorFlag = true;
                folderdlg_afterXMLLoad(errMsg);
            }
            else {
                var newfolderdid = g_folderdlg_CBFeedManager.responseText;
                //alert(newfolderdid);
                folderdlg_afterAddNewFolder(newfolderdid, name, type);
                folderdlg_afterXMLLoad(errMsg);
            }
        }
        else {
            g_folderdlg_ErrorFlag = true;
            //errMsg = L_CANTCONNECT_TEXT;
            folderdlg_afterXMLLoad(errMsg);
        }
    }

}

function folderdlg_GetFolders(params) {
    folderdlg_InitializeFeedManager();
    g_folderdlg_CBFeedManager.onreadystatechange = folderdlg_processCallBack_GetFolders;
    g_folderdlg_CBFeedManager.open("GET", g_folderdlg_CBFeed + params, true);
    g_folderdlg_CBFeedManager.send(null);
}

function folderdlg_processCallBack_GetFolders() {
    g_folderdlg_ErrorFlag = false;
    var errMsg = "";

    if (g_folderdlg_CBFeedManager.readyState == 4) {
        // only if "OK"

        if (g_folderdlg_CBFeedManager.status == 200) {
            //alert(g_CBFeedManager.responseText);

            if (g_folderdlg_CBFeedManager.responseText.substr(0, 5) == "ERROR") {
                errMsg = L_IDENTIFY_TEXT;
                g_folderdlg_ErrorFlag = true;
                folderdlg_afterXMLLoad(errMsg);
            }
            else {
                if (document.implementation && document.implementation.createDocument) {
                    //Firefox And Mozilla
                    var oParser = new DOMParser;
                    g_folderdlg_CBXMLDoc = oParser.parseFromString(g_folderdlg_CBFeedManager.responseText, "text/xml");
                }
                else {
                    if (window.ActiveXObject !== "undefined") {
                        //Internet Explorer
                        g_folderdlg_CBXMLDoc = new ActiveXObject("Msxml2.DOMDocument");
                        g_folderdlg_CBXMLDoc.load(g_folderdlg_CBFeedManager.responseXML);
                    }
                }


                //at this point the XML document has been loaded!
                var metaNode;
                if (g_folderdlg_CBXMLDoc.getElementsByTagName("metadata")[0] != null)
                    metaNode = g_folderdlg_CBXMLDoc.getElementsByTagName("metadata")[0];

                //get the location that appears in the XML document - and save it!
                //var searchlocation = '';
                //if(metaNode.getElementsByTagName("searchlocation")[0].firstChild != null)
                //searchlocation = metaNode.getElementsByTagName("searchlocation")[0].firstChild.nodeValue;  

                var message = "";
                //before setting up data, lets make sure everything is ok, i.e. our XML doc isnt reporting any errors
                if (metaNode != null && metaNode.getElementsByTagName("message")[0].firstChild != null)
                    message = metaNode.getElementsByTagName("message")[0].firstChild.nodeValue;

                if (message != "") {
                    g_folderdlg_ErrorFlag = true;
                    folderdlg_afterXMLLoad(message);
                }
                else {
                    errMsg = folderdlg_setupData(); //there might have been an error here - if so, the g_ErrorFlag should have been set
                    folderdlg_afterXMLLoad(errMsg);
                }

            }
        }
        else {
            g_folderdlg_ErrorFlag = true;
            //errMsg = L_CANTCONNECT_TEXT;
            folderdlg_afterXMLLoad(errMsg);
        }
    }

}


function folderdlg_setupData() {
    var localXMLDom = null;
    var xmlElementName = "";
    var sortOrder = "ascending"; //default
    var datatype = "text"; //default

    if (g_folderdlg_CBSortfield == 'name') {
        xmlElementName = 'name';
        //sorting the data on the dialog
        localXMLDom = folderdlg_getXSLConverted(g_folderdlg_CBXMLDoc, xmlElementName, sortOrder, datatype);
    }
    else if (g_folderdlg_CBSortfield == 'type') {
        xmlElementName = 'type';
        //sorting the data on the dialog
        localXMLDom = folderdlg_getXSLConverted(g_folderdlg_CBXMLDoc, xmlElementName, sortOrder, datatype, 'name', sortOrder, datatype);
    }

    //now processing data

    var root;
    var items;
    var totalCount;

    if (localXMLDom.getElementsByTagName("resumefolders")[0] != null) {
        root = localXMLDom.getElementsByTagName("resumefolders")[0];
        items = root.getElementsByTagName("folder");
        totalCount = items.length;
    }
    else {
        totalCount = 0;
        return;
    }

    //var spanParent = document.getElementById('resultList');

    //get some metadata info
    var metaNode;
    var userdid = '';
    var accountdid = '';

    //if(localXMLDom.getElementsByTagName("metadata")[0] != null)
    //{
    //    metaNode = g_CBXMLDoc.getElementsByTagName("metadata")[0];
    //    userdid = metaNode.getElementsByTagName("userdid")[0].firstChild.nodeValue;
    //    accountdid = metaNode.getElementsByTagName("accountdid")[0].firstChild.nodeValue; 
    //}				        

    folderdlg_clearResults('folderpane');

    var scrolltoviewIndex = -1;
    var itemHeight;

    var tbody = document.createElement("tbody");

    for (var i = 0; i < totalCount; i++) {
        var item = items[i];
        var did = "";
        var name = "";
        var type = "";
        var count = "";

        if (item.getElementsByTagName("did")[0].hasChildNodes())
            did = item.getElementsByTagName("did")[0].firstChild.nodeValue;
			
		if (item.getElementsByTagName("count")[0] != null) {
			if (item.getElementsByTagName("count")[0].hasChildNodes()) {
				count = item.getElementsByTagName("count")[0].firstChild.nodeValue;
			}
		}

        if (did == g_folderdlg_curSelFolderDid)
            scrolltoviewIndex = i;

        if (item.getElementsByTagName("name")[0].hasChildNodes())
            name = item.getElementsByTagName("name")[0].firstChild.nodeValue;

        if (item.getElementsByTagName("type")[0].hasChildNodes()) {

            if (item.getElementsByTagName("type")[0].firstChild.nodeValue == "Shared") {
                str = GetUSerControlID('myResumeFolderDialogPopup_Shared')

                type = document.getElementById(str).firstChild.nodeValue;
            }
            else {
                str = GetUSerControlID('myResumeFolderDialogPopup_Private')
                type = document.getElementById(str).firstChild.nodeValue;
            }
        }
        newrow = folderdlg_addFolder2(did, name, type, count);
        tbody.appendChild(newrow);
    }

    document.getElementById('folderpane').appendChild(tbody);

    folderdlg_scrollItemToView(scrolltoviewIndex);

    return "";
}

function folderdlg_scrollItemToView(scrolltoviewIndex) {
    if (scrolltoviewIndex > -1) {
        var folderlist = document.getElementById('folderlist');
        var listboxheight = folderlist.clientHeight;
        var scrollextra = listboxheight / 2;

        var itemHeight = document.getElementById('folderpane').firstChild.childNodes[0].clientHeight;
        var yPos = (scrolltoviewIndex * (itemHeight));
        if (yPos > listboxheight)
            yPos -= scrollextra;

        folderlist.scrollTop = yPos;
    }
}


function folderdlg_addFolder2(did, name, type, count) {
    var newTR = document.createElement("tr");
    newTR.id = did;
    newTR.count = count;
    newTR.onclick = function () { folderdlg_setSelected(newTR); };

    var newTD = document.createElement("TD");
    var par = document.createElement("p");
    par.appendChild(document.createTextNode(name));
    newTD.className = "foldername";
    newTD.appendChild(par);
    newTR.appendChild(newTD);

    var newTD2 = document.createElement("TD");
    var par2 = document.createElement("p");
    par2.appendChild(document.createTextNode(type));

    newTD2.className = "typename";
    newTD2.appendChild(par2);
    newTR.appendChild(newTD2);

    if (did == g_folderdlg_curSelFolderDid) {
        newTR.className = "sel";
    }

    return newTR;
}

function folderdlg_afterXMLLoad(errMsg) {
    folderdlg_hideLoading();
}

//UI


function folderdlg_clearResults(parentDivId) {
    //Remove existing rows in results table
    var resultdiv = document.getElementById(parentDivId);
    var counter = resultdiv.childNodes.length;

    for (var i = counter - 1; i >= 0; i--) {
        resultdiv.removeChild(resultdiv.childNodes[i]);
    }
}

function folderdlg_setSelected(tr) {

    if (tr.count >= 5000) {
        if (ScriptVariables.Get('sbFolderOverTheLimit') != '') {
            alert(ScriptVariables.Get('sbFolderOverTheLimit'));
        }
    }
    else {
        folderdlg_unSelectAll();
        tr.className = "sel";
        g_folderdlg_curSelFolderDid = tr.id;
    }
}

function folderdlg_unSelectAll() {
    var foldertable = document.getElementById("folderpane");
    var trs = foldertable.getElementsByTagName("tr");
    for (var i = 0; i < trs.length; i++) {
        trs[i].className = "";
    }
}

function folderdlg_saveToFolder() {
    if (g_folderdlg_curSelFolderDid != "") {
        folderdlg_showLoading(ScriptVariables.Get('sbSavingResume'));
        folderdlg_saveResToFolderWithAjax(g_folderdlg_curSelResumeDID, g_folderdlg_curSelFolderDid, g_folderdlg_curSavedAppDid, g_folderdlg_curSavedAppDate, g_folderdlg_curTrackingDID, g_folderdlg_curAuditDID);
    }
    else {
        alert(ScriptVariables.Get('sbSelectFolder'));
    }
}

function folderdlg_cancelToFolder() {
    folderdlg_hideRFDWindow();
}

function folderdlg_createNewFolder() {
    str = GetUSerControlID('myResumeFolderDialogPopup_newfolderlink')
    document.getElementById(str).style.display = 'none';
    document.getElementById("newfolderinputdiv").style.display = 'block';
    document.getElementById("newfolderinput").focus();
}

function folderdlg_addNewFolder() {
    var foldernameobj = document.getElementById("newfolderinput");
    if (foldernameobj.value == "") {
        alert(ScriptVariables.Get('sbMissingName'));
        return;
    }

    var foldername = foldernameobj.value.trim();

    //lets first see if we are possibly making a duplicate which is not allowed
    var foldernameupper = foldername.toUpperCase();

    if (g_folderdlg_CBXMLDoc.getElementsByTagName("resumefolders")[0] != null) {
        foldersroot = g_folderdlg_CBXMLDoc.getElementsByTagName("resumefolders")[0];
        folders = g_folderdlg_CBXMLDoc.getElementsByTagName('folder');
        for (var i = 0; i < folders.length; i++) {
            namefromxml = folders[i].getElementsByTagName("name")[0].firstChild.nodeValue;
            if (namefromxml.toUpperCase() == foldernameupper) {
                alert(ScriptVariables.Get('sbFolderAlreadyExists'));
                foldernameobj.focus();
                return;
            }
        }
    }

    folderdlg_showLoading(ScriptVariables.Get('sbSavingFolder'));

    foldername = foldernameobj.value.substr(0, 1).toUpperCase() + foldernameobj.value.substring(1);

    var foldertype = document.getElementById("foldertype");
    var foldervalue = "";
    if (foldertype.checked == true)
        foldervalue = "off";
    else
        foldervalue = "on";

    //add folder to list
    //...ajax insert - get new folderdid!
    folderdlg_addNewFolderWithAjax(foldername, foldervalue);


}

function folderdlg_afterAddNewFolder(folderdid, name, type) {
    var foldernameobj = document.getElementById("newfolderinput");
    var foldertypeobj = document.getElementById("foldertype");
    //add new table row if success from ajax!
    //lets add this new row to the DOM folderlist object!

    if (type == "on")
        type = "Shared"
    else
        type = "Private"

    //alert(folderdid);
    //alert(name);
    //alert(type);   

    var foldersroot;
    if (g_folderdlg_CBXMLDoc.getElementsByTagName("resumefolders")[0] != null) {
        foldersroot = g_folderdlg_CBXMLDoc.getElementsByTagName("resumefolders")[0];
        rootelem = g_folderdlg_CBXMLDoc.createElement('folder');

        newel1 = g_folderdlg_CBXMLDoc.createElement('did');
        newtext1 = g_folderdlg_CBXMLDoc.createTextNode(folderdid);
        newel1.appendChild(newtext1);
        rootelem.appendChild(newel1);

        newel2 = g_folderdlg_CBXMLDoc.createElement('name');
        newtext2 = g_folderdlg_CBXMLDoc.createTextNode(name);
        newel2.appendChild(newtext2);
        rootelem.appendChild(newel2);

        newel3 = g_folderdlg_CBXMLDoc.createElement('type');
        newtext3 = g_folderdlg_CBXMLDoc.createTextNode(type);
        newel3.appendChild(newtext3);
        rootelem.appendChild(newel3);

        foldersroot.appendChild(rootelem);
    }

    g_folderdlg_curSelFolderDid = folderdid;
    folderdlg_setupData();
    foldernameobj.value = "";
    foldertypeobj.checked = false;
    str = GetUSerControlID('myResumeFolderDialogPopup_newfolderlink')
    document.getElementById(str).style.display = 'block';
    document.getElementById("newfolderinputdiv").style.display = 'none';
}

String.prototype.trim = function () {
    // skip leading and trailing whitespace
    // and return everything in between
    var x = this;
    x = x.replace(/^\s*(.*)/, "$1");
    x = x.replace(/(.*?)\s*$/, "$1");
    return x;
}

function folderdlg_getSafeString(somestring) {
    return somestring.replace(/'/g, "\\'");
}


function folderdlg_SortBy(col) {
    var errMsg = "";
    g_folderdlg_CBSortfield = col;
    if (g_folderdlg_CBXMLDoc != null) {
        folderdlg_setupData(); //this function has the correct sorting info

        switch (col) {
            case 'folder':
                document.getElementById('folderdlg_imgFolderArrow').style.visibility = 'visible';
                document.getElementById('folderdlg_imgTypeArrow').style.visibility = 'hidden';
                break;
            case 'type':
                document.getElementById('folderdlg_imgFolderArrow').style.visibility = 'hidden';
                document.getElementById('folderdlg_imgTypeArrow').style.visibility = 'visible';
                break;
            default:
                document.getElementById('folderdlg_imgFolderArrow').style.visibility = 'visible';
                document.getElementById('folderdlg_imgTypeArrow').style.visibility = 'hidden';
        }

    }
}

//XSL

function folderdlg_getXSLConverted(xmlDom, sortelement, sortorder, datatype, secondaryelement, secondarysort, secondarydata) {
    // TODO: get the XSL stylesheet as a string
    var myXslStylesheet;

    if (arguments.length == 4)
        myXslStylesheet = folderdlg_getXSLSorter(sortelement, sortorder, datatype);
    else if (arguments.length > 4)
        myXslStylesheet = folderdlg_getXSLSorter(sortelement, sortorder, datatype, secondaryelement, secondarysort, secondarydata);

    // TODO: get the XML DOM data document
    var myXmlData = xmlDom;

    // init a processor
    var myXslProc;

    // init the final HTML
    var finishedHTML = "";

    var retxmldom = null;

    // create a XSLT processor
    //if(document.implementation.createDocument) 
    if (typeof (XSLTProcessor) != "undefined") {
        // Mozilla has a very nice processor object
        myXslProc = new XSLTProcessor();

        // convert the XSL to a DOM object first
        var parser = new DOMParser();
        myXslStylesheet = parser.parseFromString(myXslStylesheet, "text/xml");

        // attach the stylesheet; the required format is a DOM object, and not a string
        myXslProc.importStylesheet(myXslStylesheet);

        // do the transform (domDocument is the current HTML page you're on)
        retxmldom = myXslProc.transformToDocument(myXmlData, document);

        // create a DOM container and insert offline
        //var tmpXML = document.createElement("div");
        //tmpBox.appendChild(fragment);

        // grab the innerHTML and write to output, and insert into HTML document
        //finishedHTML = fragment

        //var oParser = new DOMParser;
        //retxmldom = oParser.parseFromString(finishedHTML, "text/xml");

    }
    else if (window.ActiveXObject !== "undefined" || typeof (myXmlData.transformNode) != "undefined") {
        // IE requires a couple more hoops to jump through

        // first create a DOM document
        var xslDoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");

        // then create an XSLT template document
        var xslTemplate = new ActiveXObject("Msxml2.XSLTemplate");
        xslDoc.async = false;

        // load the stylesheet into the DOM document
        xslDoc.loadXML(myXslStylesheet);

        // attach that DOM document to the XSLT template
        xslTemplate.stylesheet = xslDoc;

        // get the rental-model XSLT processor object
        myXslProc = xslTemplate.createProcessor();

        // feed it the XML data
        myXslProc.input = myXmlData;

        // do the transform
        myXslProc.transform();

        // grab the output, and insert into HTML document
        var fragment = myXslProc.output;
        finishedHTML = fragment;

        retxmldom = new ActiveXObject("Msxml2.DOMDocument");
        retxmldom.loadXML(finishedHTML);

    }

    return retxmldom;

}

function folderdlg_getXSLSorter(sortelement, order, datatype, secondarysortelement, secondaryorder, secondarydatatype) {
    var xslstring = "";
    xslstring += '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">';
    xslstring += '<xsl:output method="xml" indent="yes" /> ';
    xslstring += '<xsl:template match="@* | node()">';
    xslstring += '<xsl:copy>';
    xslstring += '<xsl:apply-templates select="@* | node()"/>';
    xslstring += '</xsl:copy>';
    xslstring += '</xsl:template>';
    xslstring += '<xsl:template match="/">';
    xslstring += '<resumefolderbag>';
    xslstring += '<resumefolders>';
    xslstring += '<xsl:apply-templates select="resumefolderbag/resumefolders/folder">';
    xslstring += '<xsl:sort select="' + sortelement + '" data-type="' + datatype + '" order="' + order + '" />';
    if (arguments.length > 3) {
        xslstring += '<xsl:sort select="' + secondarysortelement + '" data-type="' + secondarydatatype + '" order="' + secondaryorder + '" />';
    }
    xslstring += '</xsl:apply-templates>';
    xslstring += '</resumefolders>';
    xslstring += '</resumefolderbag>';
    xslstring += '</xsl:template>';
    xslstring += '</xsl:stylesheet>';
    return xslstring;
}

function folderdlg_getRandom() {
    var thisdate = new Date();
    return thisdate.getTime();
} 

