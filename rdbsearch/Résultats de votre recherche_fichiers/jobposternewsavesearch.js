var formIsValid = false;
var nameIsValid = false;
var creatorIsValid = false;
var recipientIsValid = false;

jQuery(document).ready(function () {
    
       //greys out and disables the bottom half of save search layover
    function disableEmail() {
        jQuery("#emailField").attr('disabled', 'disabled');
        jQuery("#freqField").attr('disabled', 'disabled');
        jQuery("#emailVisibility").css('color', '#999999');
        jQuery("#emails textarea").css('color', '#999999');
        jQuery("#instruction").css('color', '#999999');
        jQuery("#emailPrompt").css('color', '#999999');
        jQuery("#emailField").css('color', '#999999');
        jQuery("#freqField").css('color', '#999999');
        jQuery("#NewSavedSearch input:checkbox").attr('checked', false);
        jQuery('#noEmail').hide();
        jQuery('#invalidEmail').hide();
        jQuery('#invalidEmails').hide();
        jQuery("#emailField").val("");
        jQuery('#weeklyEmailMessage').hide();
    }

    //enables bottom half of save serach layover and makes more visible
    function enableEmail() {
        jQuery("#emailVisibility").css('color', '#000');
        jQuery("#emailPrompt").css('color', '#000');
        jQuery("#instruction").css('color', '#666');
        jQuery("#emailField").removeAttr('disabled');
        jQuery("#freqField").removeAttr('disabled');
        jQuery("#freqField").css('color', '#000');
        jQuery("#emails textarea").css('color', '#000');
        jQuery("#emailField").val(ScriptVariables.Get("UserEmail"));
        jQuery("#emailField").select();
        displayWeeklyHelp();
    }

    function displayWeeklyHelp() {
        var fieldVal = jQuery('#freqField').val();
        if (fieldVal != "DAILY") {
            var today = new Date();
            var today_day = today.getDay();
            jQuery('#spnWeekday').html(arrWeekdays[today_day] + '.');
            jQuery('#weeklyEmailMessage').show();
        }
        else {
            jQuery('#weeklyEmailMessage').hide();
        }
    }

    //set's a default search name for save search layover
    function setDefaultSearchName() {
        if (jQuery("#resumesearch").val().length > 0) {
            jQuery("#searchNameField").val(jQuery("#resumesearch").val() + ' search');
        }
        if (jQuery("#searchNameField").val().length > 40) {
            var aux = jQuery("#searchNameField").val();
            aux = aux.substring(0, 40);
            jQuery("#searchNameField").val(aux);
        }
    }


    function populateFrequencyDDL() {

        if (ScriptVariables.Get("RDBMVCFrequency") == 'true') {
            g_emailFrequencyLUCache = jQuery.parseJSON(ScriptVariables.Get('emailFrequencyLUCache'));

            if (g_emailFrequencyLUCache != null && g_emailFrequencyLUCache != '') {
                jQuery.each(g_emailFrequencyLUCache, function (i, item) {
                    jQuery('#freqField').append(jQuery('<option></option>').val(item.Key).html(item.Value));
                });

                    jQuery("#freqField [value='NONE']").remove();
                    jQuery("#freqField").append("<option value=NONE>Pas d'envoi test</option>");
                
            }
        }
        else {
            jQuery("#freqField").append("<option value='DAILY' >" + ScriptVariables.Get("DailyOption") + "</option>");
            var days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
            var today = new Date();
            var today_day = today.getDay();
            jQuery("#freqField").append("<option value='" + days[today_day] + "' >" + ScriptVariables.Get("WeeklyOption") + "</option>");
        }
    }

    if (ScriptVariables.Get("bfixSavedSearch")) {
        disableEmail();
        populateFrequencyDDL();
        hideErrorMessages();
        jQuery('#weeklyEmailMessage').hide();
    }
    else {
        jQuery(document).ready(function () {
            disableEmail();
            populateFrequencyDDL();
            hideErrorMessages();
            jQuery('#weeklyEmailMessage').hide();
        });
    }
    function clearDisplay() {
        jQuery("#indent :not(:first-child)").show();
        jQuery("#saveCircle").hide();
        jQuery("#closeWindow").hide();
        jQuery("#saveSuccessMessage").hide();
        jQuery("#saving").hide();
        jQuery("#saveFailMessage").hide();
        jQuery("#searchNameField").val('');
        jQuery("#emailField").val('');
        jQuery('#weeklyEmailMessage').hide();
        hideErrorMessages();
    }

    function hideErrorMessages() {
        jQuery('#noEmail').hide();
        jQuery('#invalidEmail').hide();
        jQuery('#searchNameFail').hide();
        jQuery('#invalidEmails').hide();
    }

    //When save search is clicked, the layover pops up
    if (ScriptVariables.Get("NewSavedSearch") == true) {
        jQuery("#_savedSearch").on('click', function (e) {
            e.preventDefault();
            jQuery("#NewSavedSearch").show();
            CB.Tally('newSaveSearch', 'saveSearch', 'open');
            setDefaultSearchName();
            jQuery("#searchNameField").select();
        });
    }

    //enables and disables email feature
    jQuery("#NewSavedSearch input:checkbox").on('change', function () {
if (ScriptVariables.Get("NewSavedSearch") == true) {
        if (jQuery(this).prop("checked"))
            enableEmail();
        else
            disableEmail();
}
else {
        if (jQuery(this).attr("checked"))
            enableEmail();
        else
            disableEmail();
}
    });

    //closeWindow
    jQuery("#closeWindow").on('click', function () {
        jQuery('#NewSavedSearch').hide();
        clearDisplay();
        disableEmail();
    });

    //grey text underneath frequency
    jQuery("#freqField").change(function () {
        displayWeeklyHelp();
    });

    function findSemiColon() {
        var semicolon = false;
        var emailVal = jQuery("#emailField").val();
        for (var i = 0; i < emailVal.length; i++) {
            if (emailVal.substring(i, i + 1) == ";")
                semicolon = true;
        }

        return semicolon;

    }

    //when save button is clicked
    jQuery("#btnSaveSearch").on('click', function () {
        var searchName = jQuery("#searchName input").val();
        var emailBox = jQuery("#emailField").val();
        findSemiColon();
        if (searchName.trim().length == 0) {
            jQuery('#searchNameFail').show();
            jQuery('#searchNameField').select().val('');
            CB.Tally('newSaveSearch', 'saveSearch', 'noSearchNameError');
        }

        else if (jQuery("#NewSavedSearch input:checkbox").attr('checked') && emailBox.trim().length == 0) {
            jQuery('#invalidEmail').hide();
            jQuery('#searchNameFail').hide();
            jQuery('#noEmail').show();
            jQuery('#emailField').select().val('');
            CB.Tally('newSaveSearch', 'saveSearch', 'noEmailError');
        }

        else if (jQuery("#NewSavedSearch input:checkbox").attr('checked') && !validateMail(emailBox) && findSemiColon()) {
            jQuery('#noEmail').hide();
            jQuery('#invalidEmail').hide();
            jQuery('#invalidEmails').show();
            jQuery('#emailField').focus();
            CB.Tally('newSaveSearch', 'saveSearch', 'someInvalidEmailError');
        }

        else if (jQuery("#NewSavedSearch input:checkbox").attr('checked') && !validateMail(emailBox)) {
            jQuery('#noEmail').hide();
            jQuery('#invalidEmails').hide();
            jQuery('#invalidEmail').show();
            jQuery('#emailField').focus();
            CB.Tally('newSaveSearch', 'saveSearch', 'invalidEmailError');
        }

        else {
            hideErrorMessages();
            jQuery("#indent :not(:first-child)").hide();
            jQuery("#saveCircle").show();
            jQuery("#saving").show();
            //insert ajax stuff here
            addSavedSearch();
        }
    });
    function validateMail(mailList) {

        var splitMails = mailList.split(';');
        var aux;

        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        for (var i = 0; i < splitMails.length; i++) {
            aux = jQuery.trim(splitMails[i]);
            if (aux.length > 0 && !filter.test(aux))
                return false;
        }
        return true;
    }

    function getSo() {
        var searchOptionString = jQuery.param(jQuery('.frmSearchOptions ').serializeArray());
        var searchOptionObject = jQuery.deparam(searchOptionString);

        if (searchOptionObject != null) {
            var locationArray = searchOptionObject["LOC"];
            if (locationArray != undefined) {
                var formattedLocationArray = [];
                var formattedItem = "";

                jQuery.each(locationArray, function (i, item) {
                    if (item != "") {
                        formattedItem = item + "|";
                        formattedLocationArray.push(formattedItem);
                    }
                });

                searchOptionObject["LOC"] = formattedLocationArray;
            }
            if (typeof serializeTerms != 'undefined') {
                searchOptionObject["RAWWORDS"] = encodeURIComponent($('#resumesearch').val().trim());

                //if (getFromStrcrit("semantic") != null) {
                //    g_strcrit = removeFromStrcrit('semantic');
                //}
                //g_strcrit += ";semantic=" + encodeURIComponent(serializeTerms());
                if (ScriptVariables.Get('Matching_ResumeDID') != "")
                    g_strcrit += ";Matching_ResumeDID=" + ScriptVariables.Get('Matching_ResumeDID');

                var locs = $('.loc-selected');
                if (locs.length >= 1) {
                    var locationArray = [];
                    for (var i = 0; i < locs.length; i++) {
                        locationArray.push($(locs[i]).text().trim() + "|");
                    }
                    searchOptionObject["LOC"] = locationArray;
                    searchOptionObject["RAD"] = $('.distance-selected').text().trim();
                    if( $('.distance-units-selected').text().trim() == "Miles")
                        searchOptionObject["RADU"] = "MI";
                    else 
                        searchOptionObject["RADU"] = "KM";
                }
                
            }
            g_formattedSearchOptions = getFormattedSearchOptions(searchOptionObject);
        }

        return g_formattedSearchOptions;
    }

    function addSavedSearch() {

        var emailBox = encodeURIComponent(jQuery("#emailField").val());
        var freqField = encodeURIComponent(jQuery("#freqField").val());
        var searchName = jQuery("#searchName input").val();
        var encodedSearchName = encodeURIComponent(searchName);
        var resumeDID = "";
        var g_formattedSearchOptions = getSo();
        var semanticcrit = "";
        var matchingResumeDid = "";
        if (typeof semanticSearchBuilder != 'undefined') {
            if (!g_SemanticSearchEnable)
                semanticcrit = '&semanticcrit={"off":"true"}';
            else     
                semanticcrit = semanticSearchBuilder();
        }
        if (ScriptVariables.Contains('Matching_ResumeDID'))
            matchingResumeDid = 'Matching_ResumeDID=' + ScriptVariables.Get('Matching_ResumeDID') + ';';
        // Appending datastoredid and searchcriteriadid in strcrit to enable datastore tracking through RSA
        if (ScriptVariables.Get('bEnabDataStoreUsingRSA') && ScriptVariables.Get('NWDataStoreLabel_DID') != "" && g_auditID!= "")
        { var dataparams = "drl=savedsearchdata" + "&rrl=" + resumeDID + "&searchname=" + encodedSearchName + "&emailbox=" + emailBox + "&freqfield=" + freqField + "&so=" + g_formattedSearchOptions + "&strcrit=" + encodeURIComponent(g_strcrit + ";NWDataStoreLabel_DID=" + ScriptVariables.Get('NWDataStoreLabel_DID') + ";MXAuditSearchCriteria_CriteriaDID=" + g_auditID) + matchingResumeDid + semanticcrit; }
        else
        { var dataparams = "drl=savedsearchdata" + "&rrl=" + resumeDID + "&searchname=" + encodedSearchName + "&emailbox=" + emailBox + "&freqfield=" + freqField + "&so=" + g_formattedSearchOptions + "&strcrit=" + encodeURIComponent(g_strcrit) + matchingResumeDid + semanticcrit; }

        jQuery.ajax({
            type: "POST",
            url: "../Resumes/AJAX/" + "SavedSearchAction.aspx",
            data: dataparams,
            timeout: 40000,
            dataType: 'json',
            success: function (msg) {
                var response = msg;

                if (response == null) {
                    jQuery("#saveCircle").hide();
                    jQuery("#saving").hide();
                    jQuery("#saveFailMessage").show();
                    jQuery("#closeWindow").show();
                    CB.Tally('newSaveSearch', 'saveSearch', 'saveFailed');
                    return;
                }

                if (response.Status == 'Ok') {
                    jQuery("#saveCircle").hide();
                    jQuery("#saving").hide();
                    jQuery("#saveSuccessMessage").show();
                    jQuery("#closeWindow").show();
                    jQuery("#searchNameField").val('');
                    jQuery("#emailField").val('');
                    disableEmail();
                    CB.Tally('newSaveSearch', 'saveSearch', 'save');
                    return;
                }
            },
            error: function (xhr, status, error) {
                CB.Tally('newSaveSearch', 'saveSearch', 'saveFailed');
                if (xhr.status === 403) {
                    CB.Tally('newSaveSearch', 'saveSearch', 'saveFailed');
                    sessionTimeout();
                }
            }
        });
    }


    //closes layover
    jQuery("#popUpCloser").on('click', function () {
        jQuery('#NewSavedSearch').hide();
        clearDisplay();
        disableEmail();
    });

});