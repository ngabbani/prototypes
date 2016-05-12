// Use this file for any general functions shared between SearchResume and ResumeResults
// Include anything dependent upon document ready in RDBCore_onReady instead

function sessionTimeout() {
    //IF we are getting the login page, it means that we run out of session time on ajax server
    //lets detect this and have the whole page refresh and it will be kicked to login page.
    location.href = ScriptVariables.Get('LoginURL');
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
}

function htmlEncode(value) {
    return jQuery('<div/>').text(value).html();
}

function getHTMLSeparatedArray(array, divider, startIndex, endIndex) {
    if (array === null || array.length == 0)
        return "";

    var arrayCopy = array.slice();
    var itemCount = 0;
    if (startIndex != null) {
        if (endIndex != null)
            itemCount = endIndex - startIndex;
        else
            itemCount = arrayCopy.length - startIndex;

        arrayCopy = arrayCopy.splice(startIndex, itemCount);
    }

    var list;
    if (jQuery.isArray(arrayCopy)) {
        list = jQuery.map(arrayCopy, function (item) {
            return item;
        }).join(divider);
    }
    else {
        list = jQuery.map(arrayCopy, function (item) { return item; });
    }

    return list;
}

function escapeChar(value) {
    value = value.replace(/\%22/g, '"');
    value = value.replace(/[\"]/g, '\\\"');
    return value;
}

function removeBadChar(oldValue) {
    var newValue = decodeURIComponent(oldValue).replace(/\\\"/g, '"');

    return newValue;
}

function unescapeEncodedDoubleQuotes(oldValue) {
    var newValue = oldValue.replace(/%5c%22/g, '%22');
    return newValue;
}

function convertToLowerCase(value) {
    return value.toString().toLowerCase();
}

function getEducationDegreeDropdownValues() {
    var dropdown = document.getElementById("education");
    var retval = "";

    var i;
    for (i = 1; i < dropdown.length; i++) {
        retval += dropdown.options[i].value;
        retval += ",";
    }

    retval = retval.slice(0, -1);

    return retval;
}

function resetInitialization() {
    if (g_init == true) {
        g_init = false;
    }
}

function getValidSelection(value) {
    var selection = value;
    if (value == undefined) {
        selection = "";
    }
    return selection;
}

function updateStrCrit(newStrCrit) {
    g_strcrit = unescapeEncodedDoubleQuotes(newStrCrit);

    if (g_strcrit.indexOf(";EDU") != -1) {
        if (g_strcrit.indexOf(";EDUDEGREES") < 0) {		//only add to strcrit once
            g_strcrit = g_strcrit.replace(";EDU", ";EDUDEGREES=" + getEducationDegreeDropdownValues() + ";EDU");
        }
    }
    else if (g_strcrit.indexOf(";MAXEDU") != -1) {
        if (g_strcrit.indexOf(";EDUDEGREES") < 0) {	//only add to strcrit once
            g_strcrit = g_strcrit.replace(";MAXEDU", ";EDUDEGREES=" + getEducationDegreeDropdownValues() + ";MAXEDU");
        }
    }

    if (newStrCrit == null || g_init == true) {
        return;
    }

    g_reload = 'false';
}

///////////////////////////////////////////////////////////////////////////////
//
//	Not sure where the following code should go...
//	Helper functions for functions [that should be] in RDBCore_DisplayFeatures
//
///////////////////////////////////////////////////////////////////////////////

function addLocation() {

    var locid;
    if (g_availableLocIDs.length != 0) {
        locid = g_availableLocIDs.shift();
    }

    jQuery("#loc" + locid).val("");
    jQuery("#loc" + locid).watermark(ScriptVariables.Get("locationWatermark"), { className: 'inputWatermark', useNative: false });
    jQuery.watermark.hide('#' + jQuery("#loc" + locid).attr('id'));
    jQuery("#loc" + locid + "set").show();
    jQuery("#loc" + locid).focus();
    if (g_availableLocIDs.length == 0) {
        jQuery("#addlocation").hide();
    }
}

function autocompleteLocation() {
    var inputText = jQuery(this);
    var sUrl = ScriptVariables.Get('LocationValidateURL');
    if (typeof createSemanticSlider != 'undefined') {
        //do nothing
    } else {
        inputText.autocomplete1_1(sUrl, {
            scroll: false,
            formatItem: function (data, i, n, value) {
                return value;
            },
            formatResult: function (data, value) {
                return value.split("#")[0];
            },
            highlight: false,
            cacheLength: 10,
            matchSubset: false,
            selectFirst: false,
            delay: 200
        });
    }
}

function removeLocation(parentid, fieldid) {
    jQuery("#" + fieldid).val("");
    jQuery("#" + parentid).hide();
    jQuery("#addlocation").show();

    var locIDToAdd = fieldid.replace("loc", "");
    g_availableLocIDs.unshift(locIDToAdd);
    g_availableLocIDs.sort();

}

function addJobCategory() {
    g_jobcatid += 1;
    jQuery("#jobcat" + g_jobcatid + "set").show();
    jQuery("#jobcat" + g_jobcatid).focus();

    previousLevel = g_jobcatid - 1;

    jQuery("#jobcat" + previousLevel + "set").find("img").hide();

    if (g_jobcatid == 5) {
        jQuery("#addjobcategory").hide();
    }
}

$(document).ready(function () {

    var MaxInputs = 4; //maximum input boxes allowed
    var InputsWrapper = $("#InputsWrapper"); //Input boxes wrapper ID
    var AddButton = $("#AddMoreFileBox"); //Add button ID
    var x = InputsWrapper.length; //initlal text box count
    var FieldCount = 1; //to keep track of text box added
    $(AddButton).click(function (e)  //on add input button click
    {
        var totalComboBox = $("#InputsWrapper").find("div").length; //Checking for number of combobox
        x = totalComboBox;
        x++;
        if (x <= MaxInputs) //max input box allowed
        {
            FieldCount++; //text box added increment
            $(InputsWrapper).append('<div id="jobcat' + FieldCount + 'set"><select id="jobcat' + FieldCount + '" class="jobcat' + FieldCount + '" name="CAT">' + $('#jobcat').html() + '</select>&nbsp;<img class="removeclass" width="12" height="12" border="0" src="http://clib.icbdr.com/images/images/jpimages/remminus.gif" title="Remove this field" style="cursor: pointer;"></div>')
            x++; //text box increment
        }
        if (x > MaxInputs) {
            $("#AddMoreFileBox").hide();
        }

        return false;
    });
    $("body").on("click", ".removeclass", function (e) { //user click on remove text

        if (x > 1) {
            $(this).parent('div').remove(); //remove text box
            x--; //decrement textbox
            jQuery("#AddMoreFileBox").show();
        }
        return false;
    })
});

function RemoveTopDropBox(parentid, fieldid) {

    if (parentid == fieldid) {
        jQuery("#facets_jct").show();
        jQuery("#jobcat").prop('selectedIndex', 0);
        jQuery("#facets_jct").focus();
    }
}

function ResetTopLanguage(parentid, fieldid) {
    if (parentid == fieldid) {
        jQuery("#facets_lan").show();
        jQuery("#language").prop('selectedIndex', 0);
        jQuery("#facets_lan").focus();
    }
}
function removeJobCategory(parentid, fieldid) {

    jQuery("#" + fieldid).val("");
    jQuery("#" + parentid).hide();
    jQuery("#addjobcategory").show();
    g_jobcatid -= 1;
    if (g_jobcatid > 1)
        jQuery("#jobcat" + g_jobcatid + "set").find("img").show();


}

function addClearanceLevel() {
    var clearanceID;
    if (g_availableClearanceLevels.length != 0) {
        clearanceID = g_availableClearanceLevels.shift();
    }

    jQuery("#clearancelevel" + clearanceID + "set").show();
    jQuery("#clearancelevel" + clearanceID).focus();

    if (g_availableClearanceLevels.length == 0) {
        jQuery("#addclearancelevel").hide();
    }
}

function removeClearanceLevel(parentid, fieldid) {
    jQuery("#" + fieldid).val("");
    jQuery("#" + parentid).hide();
    jQuery("#addclearancelevel").show();

    var clearanceIDToAdd = fieldid.replace("clearancelevel", "");
    g_availableClearanceLevels.unshift(clearanceIDToAdd);
    g_availableClearanceLevels.sort();
}

function autocompleteSchoolName() {
    var sRelativeRootPrefix = ScriptVariables.Get("urlroot");
    if (sRelativeRootPrefix == "") {
        sRelativeRootPrefix = "/";
    }

    jQuery("input.school").autocomplete1_1(sRelativeRootPrefix + "ajax/schools.aspx", {
        scroll: false,
        formatItem: function (data, i, n, value) {
            var arrTokens = value.split('#');
            var formattedItem = "<div class='schoolitem'>" + arrTokens[0] + "</div>";
            formattedItem += "<div class='locationitem'>" + arrTokens[1];
            if (arrTokens[2].length > 0) {
                formattedItem += ", " + arrTokens[2];
            } else if (arrTokens[3].length > 0) {
                formattedItem += ", " + arrTokens[3];
            }
            formattedItem += "</div>";
            return formattedItem;
        },
        formatResult: function (data, value) {
            var curString = jQuery("input.school").val().split(/ or /i);
            curString[curString.length - 1] = value.split("#")[0]
            return curString.join(" OR ");
        },
        highlight: false,
        cacheLength: 10,
        matchSubset: false,
        minChars: 3,
        delay: 200
    });
}

function hideBasicLocation() {
    jQuery('#searchoptions_loc').hide();
    jQuery('#addlocation').hide();
}


function replaceCommasWithOrs(keywordFieldID) {
    var keywordField = jQuery(keywordFieldID);
    keywordField.keyup(function (e) {
        if ((e.which && e.which == 188) || (e.keyCode && e.keyCode == 188)) {
            var newKeywordValue = keywordField.val().replace(',', ' OR ');
            keywordField.val(newKeywordValue);
        }
    });
}

var alreadyTNInvited = "";
var selectedTNDID = "";

function sendTNInvitation(obj, resumeDID) {
    if (alreadyTNInvited.indexOf(resumeDID) == -1) {
        if (ScriptVariables.Get("bMultipleTNs") == true) {
            selectTNDID(ajax_SingleTNInvite, resumeDID);
        }
        else {
            ajax_SingleTNInvite(resumeDID, "");
        }
        jQuery(obj).find('a>span').text('Invitation Sent!');
        alreadyTNInvited += (resumeDID + ",");
    }
}

function sendBulkTNInvitations(resumeDIDs) {
    if (ScriptVariables.Get("bMultipleTNs") == true)
        selectTNDID(ajax_MultipleTNInvites, resumeDIDs);
    else {
        ajax_MultipleTNInvites(resumeDIDs, "");
    }
    alreadyTNInvited += (resumeDIDs + ",");
}

function ajax_SingleTNInvite(resumeDID, selectedTNDID) {
    var sURL = (ScriptVariables.Get("urlroot") || "/") + "JobPoster/Ajax/SendTNInvite.aspx";

    var semanticID = '';
    var QID = '';

    if (typeof g_semanticID != 'undefined' && g_semanticID != null)
        semanticID = 1;

    if (typeof g_QID != 'undefined' && g_QID != null)
        QID += g_QID;
    
    if (QID != '')
        sURL += '?QID=' + QID;
    else
        if (ScriptVariables.Contains("QID")) {
            sURL += '?QID=' + ScriptVariables.Get("QID");
        }

    if (semanticID == 1)
        sURL += '&semanticID=' + g_semanticID;
    else
        if (ScriptVariables.Contains("semanticID")) {
            sURL += '&semanticID=' + ScriptVariables.Get("semanticID");
        }

    if (typeof getRelativeResumePosition != 'undefined' && getRelativeResumePosition != null) {
        var resumeLocInList = getRelativeResumePosition(resumeDID);
        if (getFromStrcrit('RPP=') !== "")
            sURL += '&absoluteresumeloc=' + (resumeLocInList + 1 + ((g_curSetPage - 1) * getFromStrcrit('RPP=')));
        sURL += '&relativeresumeloc=' + 'pg:' + g_curSetPage + "|loc:" + (resumeLocInList + 1);
    }

    jQuery.ajax({
        async: true,
        type: "GET",
        url: sURL,
        data: {
            "ResumeDID": resumeDID,
            "SelectedTNDID": selectedTNDID
        },
        success: function (msg) {
            jQuery.CBMessageBox('show', { 'message': "Your TN invite has been sent", 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
        },
        error: function (xhr, status, error) {
            returnVal = error;
        }
    });
}

function ajax_MultipleTNInvites(resumeDIDs, selectedTNDID) {
    var sURL = (ScriptVariables.Get("urlroot") || "/") + "JobPoster/Ajax/SendTNInvite.aspx";
    jQuery.ajax({
        async: true,
        type: "GET",
        url: sURL,
        data: {
            "MultipleResumeDIDs": resumeDIDs,
            "SelectedTNDID": selectedTNDID
        },
        success: function (msg) {
            jQuery.CBMessageBox('show', { 'message': "Your TN invites have been sent", 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
        },
        error: function (xhr, status, error) {
            returnVal = error;
        }
    });
}

function selectTNDID(callback, resumeDIDs) {
    var sTNDIDsToNames = ScriptVariables.Get('TNDIDsToNames');
    var sSplit = sTNDIDsToNames.split("*,*");
    var sDropdownHTML = '<select name="tndropdown">';
    for (var idx = 0; idx < sSplit.length; idx++) {
        var sTNDID = sSplit[idx].split("*:*")[0];
        var sTNName = sSplit[idx].split("*:*")[1];
        if (sTNDID.length > 0 && sTNName.length > 0) sDropdownHTML += '<option value="' + sTNDID + '">' + sTNName + '</option>';
    }
    sDropdownHTML += '</select>';

    $('body').append('<div id="dialog-tnselect" title="Select a Talent Network"><p><span style="float: left; margin: 0 7px 20px 0;"></span>Which of your Talent Networks would you like to invite this candidate to?</p><form action="">' + sDropdownHTML + '</form></div>');
    $("#dialog-tnselect").dialog({
        resizable: true,
        height: 250,
        width: 400,
        modal: true,
        buttons: {
            "OK": function () {
                selectedTNDID = $('select[name="tndropdown"]').find(':selected').val();
                callback(resumeDIDs, selectedTNDID);
                if (ScriptVariables.Get('ResumeFlip') == "ResumeFlip") {
                    jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('TNInvitationsSent'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
                }
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });
}

function bindSearchButton(buttonID) {
    jQuery("form input").keypress(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            jQuery(buttonID).click();
            return false;
        } else {
            return true;
        }
    });
}

/*
************ language search option
*/

function addLanguage() {
    g_langid += 1;
    jQuery("#language" + g_langid + "set").show();
    jQuery("#language" + g_langid).focus();


    if (g_langid == 3) {
        jQuery("#addlanguage").hide();
    }
}


function removeLanguage(parentid, fieldid) {

    if (ScriptVariables.Get(fieldid == 'language2') && (jQuery("#language3set").css('display') == 'block')) {
        jQuery('#language2').val(jQuery('#language3').val());
        jQuery('#language3').val("");
        jQuery('#language3set').hide();
    } else {
        jQuery("#" + fieldid).val("");
        jQuery("#" + parentid).hide();
    }
    jQuery("#addlanguage").show();
    g_langid -= 1;
}

///////////////////////////////////////////////////////////////////////////////
//
//	Slice specific utilities
//
///////////////////////////////////////////////////////////////////////////////

function SetSFArea(parameter) {
    var i = $('#ddlarea').val().indexOf(parameter);
    var searchLocations = $('#ddlarea').val().substring(i);

    searchLocations = searchLocations.split(';')[0];

    i = searchLocations.indexOf(parameter + "=");
    searchLocations = searchLocations.substring(i + 4);
    return searchLocations;
}

//this function checks if the ddlArea of SF site contains values like : 'CID', 'CTY' or 'CID'
function containsSFLocationParameter(parameter) {
    return ($('#ddlarea').val().indexOf(parameter) != -1);
}

function SetSFLocationsFields() {
    if ($('#ddlarea').val().length > 1) {

        $('#ddlSFCountries').attr('disabled', 'disabled');
        $('#ddlSFCountries').val('');

        $('#ddlSFCounty').attr('disabled', 'disabled');
        $('#ddlSFCounty').val('');

        $('#txtSFPostalCode').attr('disabled', 'disabled');
        $('#txtSFPostalCode').val('');
    }
    else {
        $('#ddlSFCountries').removeAttr('disabled');
        $('#ddlSFCountries').val('UK');

        $('#ddlSFCounty').removeAttr('disabled');

        $('#txtSFPostalCode').removeAttr('disabled');
    }
}

function callbackKW(success, responseText, kw) {
    if (success) {
        $('#' + kw).val(responseText);
    } else {

    }
}

function getFromStrcrit(id, strcrit) {

    if (typeof strcrit == 'undefined' || strcrit == null)
        strcrit = g_strcrit;
    if (strcrit.indexOf(id) != -1) {
        strcrit = strcrit.split(id);
        if (strcrit.length > 1) {
            var term = strcrit[1].split(";");
            return term[0].trim();
        }
    }
    return "";
}

function removeFromStrcrit(id) {

    var strcrit = g_strcrit;
    if (strcrit.indexOf(id) != -1) {
        strcrit = strcrit.split(id);
        if (strcrit.length > 1) {
            strcrit[1] = strcrit[1].substring(strcrit[1].indexOf(";") + 1);
            strcrit = strcrit.join('');
            return strcrit;
        }
    }

    return g_strcrit;
}

/*
************ career rookie specific
* Specifically for education major search option
*/
function autocompleteMajorName() {
    var sRelativeRootPrefix = ScriptVariables.Get("urlroot");

    if (sRelativeRootPrefix == "") {
        sRelativeRootPrefix = "/";
    }

    jQuery("input.educationmajor").autocomplete1_1(sRelativeRootPrefix + "ajax/majors.aspx", {
        scroll: false,
        formatItem: function (data, i, n, value) {
            var formattedItem = "<div class='majoritem'>" + value + "</div>";
            return formattedItem;
        },
        formatResult: function (data, value) {
            var curString = jQuery("input.educationmajor").val().split(/ or /i);
            curString[curString.length - 1] = value;
            return curString.join(" OR ");
        },
        highlight: false,
        cacheLength: 10,
        matchSubset: false,
        minChars: 3,
        delay: 200
    });
}