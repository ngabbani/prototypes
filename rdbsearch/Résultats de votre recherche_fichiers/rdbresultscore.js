var g_viewOption = 'Details';
    var max_relocate = 3;
var max_sector = 3;
var max_software = 3;
var max_spokenlanguages = 3;
var max_careerlevel = 3;
var coworkerActionPopup;
var coworkerTagPopup;
var g_r2location = "";
var g_auditID = '';
var g_SalaryQSVar = '';
var g_EmpTypeQSVar = '';
var g_DrvLicQSVar = '';
var g_viewSimilar = "";
var g_filterTab = false;
var g_searchTab = false;
var g_filterSelectionType = 'checkbox'
var g_quicksearch = "";
var filters_hidden = "";
var moresearch_open = false;
var g_resumeTitle = "";
var g_resumeTitleUse = "";

var g_tagObjectsList = [];
var g_tagNamesList = [];
var IsFacetFilterTriggered = false;
var g_semanticFilterString = .5;
var g_semanticSearchAll = "";
var g_shadowFormattedSearchOptions = "";
var g_RawwordsChanged = false;
var g_InitialSliderValue = -1;
var g_FinalSliderValue = -1;
var g_SemanticSearchEnable = true;
var g_SemanticSearchLengthFlag = true;
var g_QID = null;
var countemailcandidateLike = 0;
/*
************************************** initialization start
*/

jQuery(document).ready(function () {

    jQuery("#_ResResultList_cbhlViewAll").empty().append('<img text="Details" src="http://img.icbdr.com/images/jp/employerui/icon_view-long.png" border="0" class="viewoptionhighlight">');
    jQuery("#_ResResultList_cbhlViewTitle").empty().append('<img text="Title" src="http://img.icbdr.com/images/jp/employerui/icon_view-short.png" border="0" class="viewoptionhover">');

    $.cb.Timing("test1", "test11", "test111", 50);
    jQuery("#loc").watermark(ScriptVariables.Get("locationWatermark"), { className: 'inputWatermark', useNative: false });
    jQuery("#smn").watermark("Min", { className: 'inputWatermark', useNative: false });
    jQuery("#smx").watermark("Max", { className: 'inputWatermark', useNative: false });
    jQuery("#company").watermark(ScriptVariables.Get("companyWatermark"), { className: 'inputWatermark', useNative: false });
    jQuery("#school").watermark(ScriptVariables.Get("schoolWatermark"), { className: 'inputWatermark', useNative: false });
    jQuery("#ExperienceLow").watermark("Min", { className: 'inputWatermark', useNative: false });
    jQuery("#ExperienceHigh").watermark("Max", { className: 'inputWatermark', useNative: false });

    if (ScriptVariables.Get('UpdateTagsRDBResults')) {

        jQuery(".legendTag").show();
        jQuery("#tags").hide();
        jQuery("#frmTagFacets").hide();
        jQuery(".cbui").css({ 'clear': 'both', 'padding-top': '7px' });
    }
    else {
        jQuery("#facetTabs").tabs();
    }

    if (ScriptVariables.Get('UpdateTagsHeaderRDBResults')) {
        jQuery(".searchedTagsList").css("width", "175%");
    }

    jQuery("#searchoptionscontainer").css("display", "none");
    jQuery("#quicksearchborder").css("display", "none");
    jQuery("#facetcontainer").css("display", "none");
    jQuery("#facets .facet").css("display", "none");
    jQuery("#filterfacetstab").css("display", "none");
    jQuery("#frmFilterFacets").css("display", "none");
    jQuery("#frmSearchOptions").css("display", "none");
    jQuery("#moresearchoptiontab").css("display", "none");
    jQuery("#tagfacettab").css("display", "none");
    jQuery("#frmTagFacets").css("display", "none");
    jQuery("#rdbmessage").hide();
    jQuery("#divDuplicateAndBlockCount").hide();
    jQuery("#Pagination").hide();
    jQuery("#Pagination2").hide();
    jQuery("#checkAllBatchAction").hide();
    jQuery("#gotopage").hide();
    jQuery("#resTabs").hide();
    jQuery("#controlsearchwrapper").hide();
    jQuery("#searchresults").hide();
    jQuery("#rrLegendWrapper").hide();
    jQuery("#frmTagFacets input").prop("disabled", false);
    jQuery('#facets_mne').css({ display: 'none' });
    jQuery('#facets_mxe').css({ display: 'none' });

    if (ScriptVariables.Get('RDBIndiaDefaultDistance') == 'true') {
        if (g_radiusUnitsListLUCache != null && g_radiusUnitsListLUCache != '') {
            jQuery.each(g_radiusUnitsListLUCache, function (i, item) {
                jQuery('#facets_lut').append(jQuery('<option></option>').val(item.Key).html(item.Value));

            });
        }
    }

    replaceCommasWithOrs('#resumesearch');
    bindSearchButton('#btnFacetSearch');

    jQuery("#searchresults").on("keypress", ".resumetaginput", function (e) {
        var key;
        if (e.which)
            key = e.which;
        else if (e.keyCode)
            key = e.keyCode;
        else
            return true;

        if (key == 13) {
            jQuery(this).parent().parent().children(".saveTag").click();
            return false;
        } else {
            return true;
        }

    });



    if ($('#ddlarea') != undefined) {
        $('#ddlarea').change(function (e) {
            SetSFLocationsFields();
        });
    }

    jQuery("#bulkTagsWrapper").on("keypress", ".resumetaginput", function (e) {
        var key;
        if (e.which)
            key = e.which;
        else if (e.keyCode)
            key = e.keyCode;
        else
            return true;

        if ((key > 64 && key < 91) || (key > 47 && key < 58) || (key > 96 && key < 123)) {
            return true;
        } else if (key == 13) {
            jQuery(this).parent().parent().children(".saveTag").click();
            return false;
        } else if (key == null || key == 0 || key == 8 || key == 9 || key == 27) {
            return true;
        } else {
            return false;
        }

    });

    jQuery("#searchresults").on("autocompleteselect", ".resumetaginput", function (event, ui) {
        if ((event.which && event.which == 9) || (event.keyCode && event.keyCode == 9)) {
            event.preventDefault();
            jQuery(this).focus();
        }
    });

    jQuery("#searchresults").on("click", "a.seeallrel", function () {
        jQuery(this).siblings("span.relocationsshowall").show();
        jQuery(this).hide();
    });

    jQuery("#gotopage .ddlGoToPage").on("change", function () {
        g_reload = 'true';
        g_curSetPage = jQuery(this).val();
        jQuery(window).trigger('hashchange');

        //tallying
        console.log('inpagegroup:' + 'pagination_dropdown');
        console.log('pagination_dropdown:' + g_curSetPage);
    });

    jQuery("#sortby .ddlSortBy").on("change", function () {
        g_reload = 'true';
        g_curSetPage = 1;
        g_curSortBy = jQuery(this).val();
        jQuery(window).trigger('hashchange');
    });

    //This doesn't appear to be used
    jQuery(".ddlPerPage").bind("change", function () {
        g_reload = 'true';
        g_curSetPage = 1;
        g_numberOfDocsPerPage = jQuery(this).val();
        jQuery(window).trigger('hashchange');
    });

    jQuery("#_ResResultList_cbhlViewAll img").on('click', function () {
        ViewAll();
        g_reload = 'false';
    });

    jQuery("#_ResResultList_cbhlViewTitle img").on('click', function () {
        ViewTitle();
        g_reload = 'false';
    });

    jQuery("#_ResResultList_cbhlViewAll img").on('mouseenter mouseleave', function () {
        if (g_viewOption != 'Details')
            jQuery(this).toggleClass('viewoptionhover');
    });

    jQuery("#_ResResultList_cbhlViewTitle img").on('mouseenter mouseleave', function () {
        if (g_viewOption != 'Title')
            jQuery(this).toggleClass('viewoptionhover');
    });



    jQuery("#resTabs").on('tabsselect', function (event, ui) {
        var qt = jQuery(ui.tab).attr('id');
        if (qt != "") {
            g_st = qt;
            g_reload = "true";
            g_curSetPage = 1;
            jQuery(window).trigger('hashchange');
        }
    });

    jQuery("#resultpane").on("click", ".coworkerActionIcon", function () {
        showCoworkerAction(this);
    });

    jQuery("#resultpane").on("click", ".coworkerTagIcon", function () {
        getCoworkerTagList(this);
    });

    jQuery("#resultpane .checkAllBox").on("click", function () {
        jQuery(this).blur();

        if (jQuery(this).is(":checked")) {
            CheckAll();
            jQuery("#resultpane .checkAllBox").attr("checked", "checked");

            jQuery("#resultpane .checkAllBox").map(function () {
                jQuery(this).attr("title", "Select None")
            }).get();
        }
        else {
            UnCheckAll();
            jQuery("#resultpane .checkAllBox").removeAttr("checked");

            jQuery("#resultpane .checkAllBox").map(function () {
                jQuery(this).attr("title", "Select All")
            }).get();
        }
    });

    jQuery("#resultpane").on("click", ".saveResume", function (evt) {
        evt.preventDefault();
        setupSaveToFolderLink(jQuery(this).attr("id"), jQuery(this).attr("name"));
    });

    jQuery("#ddlbatchAction, #ddlbatchActionTop").on("change", function () {
        if (jQuery(this).val() == 'saveToFolder') {
            saveBatchToFolder(this);
        }

        if (jQuery(this).val() == 'saveToTag') {

            var tagNumber = jQuery("#searchresults input[type='checkbox']:checked").length;

            if (tagNumber > 0) {

                if (ScriptVariables.Get("UpdateBulkTagsOnResults") == "true") {
                    $("#BulkAddTagPopup").dialog("open");
                }

                else {
                    var windowWidth = document.documentElement.clientWidth;
                    var windowHeight = document.documentElement.clientHeight;
                    var popupHeight = $(".bulkTagsPopup").height();
                    var popupWidth = $(".bulkTagsPopup").width();

                    jQuery(".bulkTagsPopup").css("top", windowHeight / 2 - popupHeight / 2);
                    jQuery(".bulkTagsPopup").css("left", windowWidth / 2 - popupWidth / 2);

                    jQuery(".bulkTagsPopup").show();
                }
            }
        }

        if (jQuery(this).val() == "bulkUnlock") {
            if (jQuery("#searchresults input[type='checkbox']:checked").length > 0) {
                bulkUnlockResume();
            }
        }
        jQuery(this).val("");
    });

    /*Bulk Tags */

    if (ScriptVariables.Get("LJNewLocalizationFields")) {
        jQuery("#resumebulktaginput").val(jQuery.trim(jQuery("#bulkTagsTip").text()));
        jQuery("#bulkTagsTip").hide();
    }

    jQuery('.bulkTagPopupCloser').on('click', function () {
        jQuery(".bulkTagsPopup").hide();
    });

    jQuery('#saveBulkTag').on('click', function () {
        addBulkResumeTag(this);
    });

    /* bulk unlock resume, call ajax to unlock, then update dom */
    function bulkUnlockResume() {
        var resumeInfo = jQuery("#searchresults input[type='checkbox']:checked")
        var data = "";
        for (var i = 0; i < jQuery(resumeInfo).length; i++) {
            data = data + jQuery((resumeInfo)[i]).attr("name").split("_")[0] + ",";
        }
        var resumedids = data.substring(0, data.length - 1);
        data = "resumedidlist=" + resumedids;
        var unlockdids = resumedids.split(",");
        var loadText = "<span class='unlockStatus'" +
					"style='display:block;float:right;" +
					"margin:6px 0 0 6px;color:green;" +
					"font-weight:bold'>Unlocking......</span>";

        for (var i = 0; i < unlockdids.length; i++) {
            var path = '"input[name=' + "'" + unlockdids[i] + '_resumeResultsCheckBox' + "'" + ']"';
            jQuery(eval(path)).parent("li").find('.recordaffordancecontainer').append(loadText);
            ajaxCallToBulkUnlockResume("resumedidlist=" + unlockdids[i]);
        }
    }

    function ajaxCallToBulkUnlockResume(data) {
        //add this for test block feature in production with SCP flag off.
        if (url.indexOf("blockwhenrequest=true") > 0) {
            data += "&blockwhenrequest=true";
        }

        jQuery.ajax({
            type: "GET",
            url: "../../JC/AJAX/BulkUnlockResume.aspx",
            data: data,
            timeout: 40000,
            dataType: 'text',
            success: function (msg) {
                var pendingPattern = "<div id='shadowPending' style='position:absolute;top:0;left:0;width:100%;height:100%;background:#666;opacity:0.3;filter:alpha(opacity=30);'></div><div id='waterMakerPending' style='position:absolute;top:0;left:0;color: #fff;font-size:32px;padding: 60px 0 0 200px;font-style: italic;text-shadow: 1px 1px 1px #666;line-height:130%;'>Pending</div>";
                var unlockPicture = "<span style='float:left; display:block' class='unlockedicon'><img imagealign='Middle' id='unlockedimg' title='Resume is unlocked' src='http://img.icbdr.com/images/sharedintl/jp/icons/icon-unlocked.gif' alt='Resume is unlocked' border='0' style='height: 14px; width: 17px;'></span>";
                var message = jQuery.parseJSON(msg);

                //need to display pending status
                var requestdids = message.requestdids.split(";");
                for (var i = 0; i < requestdids.length; i++) {
                    var finder = "#searchresults input[name='" + requestdids[i] + "_resumeResultsCheckBox" + "']";
                    jQuery(finder).parent('li').append(pendingPattern);
                    jQuery(finder).parent('li').find(".unlockStatus").remove();
                }

                //need to display a lock status
                var unlockdids = message.unlockdids.split(";");
                for (var i = 0; i < unlockdids.length; i++) {
                    var finder = "#searchresults input[name='" + unlockdids[i] + "_resumeResultsCheckBox" + "']";
                    if (jQuery(finder).parent('li').find(".actionicons").length == 0) { // there is no action icon
                        jQuery(finder).parent('li').find(".recordaffordanceicons").prepend("<div class='actionicons'" + unlockPicture + "</div>");
                    } else if (jQuery(finder).parent('li').find(".unlockedicon").length == 0) {
                        jQuery(finder).parent('li').find(".actionicons").append(unlockPicture);
                    }
                    jQuery(finder).parent('li').find(".unlockStatus").remove();
                }
                jQuery("#searchresults input[type='checkbox']").removeAttr("checked")

                //need to analyze the error did callback
                var errordids = message.errordids.split(";");
                for (var i = 0; i < requestdids.length; i++) {
                    var finder = "#searchresults input[name='" + errordids[i] + "_resumeResultsCheckBox" + "']";
                    jQuery(finder).parent('li').find(".unlockStatus").remove();
                }
            }
        });
    }



    function addBulkResumeTag(selection) {

        var tagName = jQuery(selection).parent().children("form").children("#resumebulktaginput").val();
        var resumeDID = "";

        jQuery("#searchresults input[type='checkbox']:checked").each(function () {
            resumeDID += jQuery(this).attr("name").split("_")[0] + ";";
        });

        if (tagName == undefined || tagName == "") {
            jQuery(".bulkTagsPopup").hide();
            return;
        }

        if (resumeDID == undefined || resumeDID == "") {
            jQuery(".bulkTagsPopup").hide();
            return;
        }

        var encodedTagName = encodeURIComponent(tagName);
        var drlPart = "drl=tagactionadd;tagmanagementadd";

        var dataparams = drlPart + "&rrl=" + resumeDID + "&tag=" + encodedTagName;

        showLoadingSpinner();

        jQuery.ajax({
            type: "POST",
            url: "../Resumes/AJAX/" + "TagAction.aspx",
            data: dataparams,
            timeout: 40000,
            dataType: 'json',
            success: function (msg) {
                var response = msg;

                hideLoadingSpinner();
                jQuery(".bulkTagsPopup").hide();

                if (response == null) {
                    return;
                }

                if (response.Status == 'No Locked License') {
                    location.href = 'LockRDBLicense.aspx';
                    return;
                }

                if (response.TagActionAdd == undefined) {
                    return;
                }

                if (response.TagActionAdd.Status != "Ok" && response.TagActionAdd.Status != "Tag already exist for resume") {
                    jQuery("#" + resumeDID + "_tagmessage").text(response.TagActionAdd.Status);
                    jQuery("#" + resumeDID + "_tagmessage").show();
                    return;
                }

                jQuery(selection).parent().children("form").children(".resumetaginput").val("");

                if (response.TagActionAdd.Status != "Tag already exist for resume") {

                    jQuery("#searchresults input[type='checkbox']:checked").each(function () {
                        resumeDID = jQuery(this).attr("name").split("_")[0];
                        jQuery("#" + resumeDID + "_usertaglist").append('<div id=\"' + encodedTagName + '_usertag\" class=\"resumeresultusertags\"><p class="tagNameLabel" title="' + tagName + '">' + tagName + ' </p> <img class="xfortag" src="http://img.icbdr.com/images/images/jpimages/xfortag.png" /> </div>');
                    });

                    incrementUserTag(tagName);
                    addTagToGlobalList(tagName);
                }

                if (jQuery("#" + resumeDID + "_usertaglist").children('.resumeresultusertags').length < 5) {
                    jQuery("#" + resumeDID + "_addlabel").show();
                }
            },
            error: function (xhr, status, error) {
                hideLoadingSpinner();
                if (xhr.status === 403) {
                    sessionTimeout();
                }
            }
        });
    }

    jQuery('#filterfacets').on('click', ".facetwrapper input", function (evt) {
        if (g_numberOfResults == 0) {
            return;
        }
        IsFacetFilterTriggered = true;
        if (allFilterOptionDeselected(evt.target)) {
            jQuery(evt.target).attr("checked", "checked");
            return;
        }

        g_facet = getFilterFacetJson(evt.target);

        jQuery("#frmFilterFacets input").prop("disabled", true);

        g_reload = 'true';
        g_curSetPage = 1;
        jQuery(window).trigger('hashchange');
    });


    $("#btnFacetSearch").click(function () {
        facetSearch();
    });

    // jQuery("#facets").on('click', ".btn-action input", function () {
    //if (jQuery.watermark != null) {
    //    jQuery.watermark.hideAll();
    //}

        //if (g_searchOptionObject != null && searchOptionObject != null && g_searchOptionObject['RAWWORDS'] != searchOptionObject['RAWWORDS'])
        //    g_RawwordsChanged = true;

        //if (typeof searchOptionObject != "undefined" && searchOptionObject != null)
        //    g_searchOptionObject = searchOptionObject;

        //if (searchOptionObject != null) {

    //var searchOptionObject = jQuery.deparam(searchOptionString);
           
    //if (searchOptionObject != null) {


    //        if (searchOptionObject["SF_AREA"] != undefined && searchOptionObject["SF_AREA"] != "" && searchOptionObject["SF_AREA"] != null)
    //        { searchOptionObject["LOC"] = undefined; }
  

    //      var locationArray = searchOptionObject["LOC"];            

    //    if (locationArray != undefined) {
    //        var formattedLocationArray = [];
    //        var formattedItem = "";

    //        var region = "";

    //        //pop the region from locationArray if the Region field is active
    //        if (jQuery("#listitem_region").is(":visible")) {
    //            region = locationArray.pop();
    //        }

    //        jQuery.each(locationArray, function (i, item) {
    //            if (item != "") {
    //                if (region != "") {
    //                    formattedItem = item + "," + region + "|";
    //                }
    //                else {
    //                    formattedItem = item + "|";
    //                }
    //                formattedLocationArray.push(formattedItem);
    //            }
    //        });

    //        if (formattedLocationArray.length == 0 && region != "") {
    //            formattedLocationArray.push(region + "|");
    //        }

    //        searchOptionObject["LOC"] = formattedLocationArray;

    //        if (searchOptionObject["MRC"] != null && searchOptionObject["MRC"] == "on") {
    //            searchOptionObject["MRC"] = searchOptionObject["CMPN"];
    //        }
    //    }

    //    g_formattedSearchOptions = getFormattedSearchOptions(searchOptionObject);

        //g_strcrit = '';
        //if (!ScriptVariables.Contains('Matching_ResumeDID') && g_RawwordsChanged == true) {
        //    g_semanticFilterString = '0.5';
        //    g_RawwordsChanged = false;
        //}
        //if (ScriptVariables.Get('bNewViewSimilar') == 'true') {
        //    g_viewSimilar = "";
        //}

    //g_facet = '';
    //g_reload = 'true';
    //g_curSetPage = 1;
    //g_tagSelection = "";

    //g_strcrit = '';        

    //if (ScriptVariables.Get('bNewViewSimilar') == 'true') {
    //    g_viewSimilar = "";
    //}

    //jQuery(window).trigger('hashchange');
    //});

    jQuery('#tags').on('click', ".facetwrapper input", function (evt) {
        g_tagSelection = getTagFacetSelection(evt.target);

        if (g_tagSelection == "") {
            jQuery("#facets .btn-action input").click();
            return;
        }

        jQuery("#frmTagFacets input").prop("disabled", true);

        g_reload = 'true';
        g_curSetPage = 1;

        g_strcrit = '';

        jQuery(window).trigger('hashchange');
    });

    jQuery("input:radio[name=DATETYPE]").on("change", function () {
        g_curSortBy = 'RELV';
        jQuery('#ddlSortBy').val(g_curSortBy);
        jQuery('#btnFacetSearch').click();
    });

    jQuery(document).on("click", '#searchresults .addLabel', function () {
        jQuery(this).parent().children('.addLabel').hide();
        jQuery(this).parent().children("form").children(".resumetaginput").show();
        jQuery(this).parent().children("form").children(".resumetaginput").focus();
        jQuery(this).parent().children(".saveTag").show();
        jQuery(this).parent().children(".cancelTag").show();
    });

    jQuery(document).on("click", '#searchresults .cancelTag', function () {
        jQuery(this).parent().children('.addLabel').show();
        jQuery(this).parent().children("form").children(".resumetaginput").hide();
        jQuery(this).parent().children(".saveTag").hide();
        jQuery(this).parent().children(".cancelTag").hide();
        jQuery(this).parent().parent().children(".tagmessage").hide();
    });


    jQuery("#btnFacetSearch").click(function () {
        IsFacetFilterTriggered = false;
        onSearchButtonClick();
    });

    jQuery(document).on("click", '#searchresults .saveTag', function () {
        addResumeTag(this);
    });

    jQuery(document).on("click", '#searchresults .resumeresultusertags img', function () {
        deleteResumeTag(this);
    });

    jQuery(document).on("click", '#searchresults .viewsimilarresumes', function () {
        if (ScriptVariables.Get('bNewViewSimilar') == 'true') {
            g_viewSimilar = getViewSimilar(this);

            g_facet = '';
            g_reload = 'true';
            g_curSetPage = 1;
            g_tagSelection = "";

            jQuery(window).trigger('hashchange');
            jQuery(window).scrollTop(0);
        }
    });

    jQuery("#facets").on('click', ".facet-toggle", function (evt) {
        evt.preventDefault();

        jQuery(this).nextAll(".facetplaceholder").slideToggle('normal', function () {
            if (jQuery(this).is(":hidden")) {
                jQuery(this).closest("fieldset").find("a.facet-toggle").css("background-position", "0px -11px");
                jQuery(this).closest("li.facet").removeClass("openfacet");
            }
            else {
                jQuery(this).closest("fieldset").find("a.facet-toggle").css("background-position", "0px 0px");
                jQuery(this).closest("li.facet").addClass("openfacet");
            }

        });

        g_reload = 'false';
    });

    jQuery("#listitem_moresearch").hide();

    jQuery("ul#moresearchoptionscontainer li.facet").on('click', function () {
        var this$ = jQuery(this);
        jQuery("#listitem_moresearch").slideToggle('fast', function () {
            if (jQuery(this).is(":hidden")) {
                jQuery("#moresearchicon").css("background-position", "0px -11px");
                jQuery(this$).removeClass("sectionUnderline");
            }
            else {
                jQuery("#moresearchicon").css("background-position", "0px 0px");
                jQuery(this$).addClass("sectionUnderline");
            }
        });
    });

    jQuery(window).bind('hashchange', function (e) {
        if (g_reload != 'true') {
            return;
        }

        if (g_curXHR != null)
            g_curXHR.abort();

        if (ScriptVariables.Get("AddRawWordDocToDoc") == "false" && ScriptVariables.Contains('Matching_JobDID')) {
                g_strcrit = "";
        }

        var bbqStrCrit = e.getState("strcrit");

        if (g_init == true) {
            g_strcrit = ScriptVariables.Get("strcrit");
            g_viewOption = ScriptVariables.Get("viewoption");
            g_resumedid = ScriptVariables.Get("Resume_DID");
            g_curSetPage = ScriptVariables.Get("pg");
            g_curSortBy = ScriptVariables.Get("sb");
            g_quicksearch = ScriptVariables.Get("quickSearch");
            var bbqViewOption = e.getState("viewoption");
            var bbqResumeDID = e.getState("resumedid");
            var bbqPageNo = e.getState("pg");
            var bbqSortBy = e.getState("sb");

            if (bbqStrCrit != undefined) {
                g_strcrit = bbqStrCrit;
            }

            if (bbqViewOption != undefined) {
                g_viewOption = bbqViewOption;
            }

            if (bbqResumeDID != undefined) {
                g_resumedid = bbqResumeDID;
            }

            if (bbqPageNo != undefined) {
                g_curSetPage = bbqPageNo;
            }

            if (bbqSortBy != undefined) {
                g_curSortBy = bbqSortBy;
            }

            g_tagSelection = ScriptVariables.Get("tag");
            var bbqTagSelection = e.getState("tag");
            if (bbqTagSelection != undefined) {
                g_tagSelection = bbqTagSelection;
            }


            g_auditID = ScriptVariables.Get("MXAuditSearchCriteria_CriteriaDID");
            var bbqAuditID = e.getState("auditid");
            if (bbqAuditID != undefined) {
                g_auditID = bbqAuditID;
            }

        }

        getResumeResults(displayResumeResults);
    });

    g_init = true;
    jQuery(window).trigger('hashchange');

    if (ScriptVariables.Get("UpdateTagsHeaderRDBResults") == "true") {
        // Tags header
        var searchedTagsList = jQuery(".searchedTagsList");
        if (searchedTagsList != undefined && searchedTagsList.length > 0) {
            var tagsArray = searchedTagsList.html().split(": &nbsp;").pop().split(","); 	// grab the list of tags from header
            tagsArray.pop(); 	// remove the empty element

            var tagTypesArray = getUrlVars()["tagtypes"].split(",");

            for (var i = 0; i < tagsArray.length; i++) {
                tagsArray[i] = tagify(tagsArray[i], tagTypesArray[i]);
            }

            var newSearchedTagsList = searchedTagsList.html().split(": &nbsp;")[0] + ": &nbsp;" + tagsArray.join("");
            searchedTagsList.html(newSearchedTagsList);
        }
        var tagDisplayText = jQuery("#tagDisplayText");
        if (tagDisplayText != undefined && tagDisplayText.length > 0) {
            tagDisplayText.append("&nbsp;&nbsp;&nbsp;&nbsp;[" + ScriptVariables.Get("RDBSliceName") + "]");
        }

        if (jQuery("#newTagDisplayText") != undefined && jQuery("#newTagDisplayText").length > 0) {		//keep this one, delete one above oncleanup
            jQuery("#newTagDisplayText").html(jQuery("#newTagDisplayText").html().replace("NUM_RESULTS", "<span id=\"tagResultsCount\"></span>"))
        }
    }

});


function newTagTagify(tagName, tagType, ownerDID) {

    var tagLevel;

    //Determine if you are the tag owner.  If so then we need to determine public or private
    if (ScriptVariables.Get('UserDID') === ownerDID) {

        if (tagType == "public") {
            tagLevel = "<span class=\"publicTagEnd\">X</span>";
        }
        else if (tagType == "private") {
            tagLevel = "<span class=\"privateTagEnd\">X</span>";
        }
        else {
            // something went wrong
        }

    }

    else {
        //If you are not the owner of the tag then you are using a coworker's shared public tag
        tagLevel = "<span class=\"publicCoworkerTagEnd\">X</span>";
    }

    return "<span class=\"tagName\" title=\"" + tagName + "\">" + tagName + "</span>" + tagLevel;
}


function tagify(tagName, tagType) {

    var tagLevel;

    if (tagType == "coworkerTag") {
	    tagLevel = "<span class=\"publicCoworkerTagEnd\">X</span>";
	}
    else if (tagType == "publicTag") {
		tagLevel = "<span class=\"publicTagEnd\">X</span>";
	}
    else if (tagType == "privateTag") {
        tagLevel = "<span class=\"privateTagEnd\">X</span>";
	}
	else {
		// something went wrong
	}
	
	return "<span class=\"tagName\" title=\"" + tagName + "\">" + tagName + "</span>" + tagLevel;
}

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

/*
************************************** initialization end
*/

/*
************************************** get resume result data
*/

function getResumeResults(resultCallBack) {

    var dataRequestList = "";
    var dataparams = "";

    if (g_init) {
        dataRequestList = "resumeresultinit";
    }
    else {
        dataRequestList = "resumeresultnoninit";
    }
	    
    dataparams = "drl=" + dataRequestList + "&strcrit=" + encodeURIComponent(g_strcrit) + "&pg=" + g_curSetPage + "&ppg=" + g_numberOfDocsPerPage + "&sb=" + g_curSortBy + "&fc=" + g_facet + "&st=" + g_st + "&so=" + g_shadowFormattedSearchOptions + "&tag=" + encodeURIComponent(g_tagSelection) + "&sc_cmp1=" + g_SiteCatalyst;

	var tagsList = getUrlVars()["tag"]
    if (tagsList != undefined && tagsList.length > 0) {
        if (dataRequestList == "resumeresultnoninit") {
			dataparams += "&tag=" + tagsList;
		}
	}

	if (ScriptVariables.Get('LastActivityQSVar') == 'true') {
	    dataparams = dataparams + "&lastactivity=true";
	}


    dataparams = dataparams + "&datetype=true";

	//always include, even on first run
	var dataStoreLabel = ScriptVariables.Get('NWDataStoreLabel_DID');
	dataparams += "&datastorelabel=" + dataStoreLabel;

    if (ScriptVariables.Get('bNewViewSimilar') == 'true') {
        dataparams = dataparams + "&viewsimilar=" + g_viewSimilar;
    }

    if (ScriptVariables.Contains('ResumeDIDForSearching')) {
        dataparams += "&ResumeDIDForSearching=" + ScriptVariables.Get('ResumeDIDForSearching');
    }

    if (ScriptVariables.Contains('Matching_ResumeDID')) {        
        dataparams += "&Matching_ResumeDID=" + ScriptVariables.Get('Matching_ResumeDID');
    }    

    if (ScriptVariables.Contains('semanticsearch')) {
        dataparams += "&semanticsearch=" + ScriptVariables.Get('semanticsearch');
    }

    if (ScriptVariables.Contains('bRDBSemanticsearchchanges')) {
        dataparams += "&NewSemanticUI=" + ScriptVariables.Get('bRDBSemanticsearchchanges');
    }

	if (ScriptVariables.Contains('Matching_JobDID')) {
        dataparams += "&Matching_JobDID=" + ScriptVariables.Get('Matching_JobDID');
	}

	if (ScriptVariables.Contains('MXNWResumeSavedSearch_DID')) {
	    dataparams += "&MXNWResumeSavedSearch_DID=" + ScriptVariables.Get('MXNWResumeSavedSearch_DID');
	}
	
	if (typeof addSemanticTermsToSearch != 'undefined')
	    dataparams += addSemanticTermsToSearch(dataparams);

	if (!ScriptVariables.Contains('Matching_ResumeDID'))
	{
	    var res = null;	    
	    if (typeof g_strcrit != 'undefined' && g_strcrit != null && g_strcrit != '')
        {
	        var searchKeywords = "";	        
	        searchKeywords = getFromStrcrit("RAWWORDS=", g_strcrit);
	        if (searchKeywords != null && searchKeywords != "")
	            res = searchKeywords.split(" ");
	    }
        else
	    if ($('#resumesearch').val() != null && $('#resumesearch').val() != '')
	        res = $('#resumesearch').val().split(" ");

	    if (res != null)
	    {
	        if (res.length > 10 && g_SemanticSearchLengthFlag == true && ScriptVariables.Get("bRDBSemanticsearchchanges") != "true")
	            g_SemanticSearchLengthFlag = false;
	        else
	            if (res.length <= 10)
	                g_SemanticSearchLengthFlag = true;
	    }
	}

	if (g_SemanticSearchEnable == false || g_SemanticSearchLengthFlag == false)
	    dataparams += "&semanticsearchoff=1"

	showLoadingSpinner();
	if (typeof showSliderOverlay != 'undefined')
	    showSliderOverlay(); //4.28.15 OneSearchUX - CH

    var callType = "GET";
    if (ScriptVariables.Get("ChangeToPost") == true) {
        callType = "POST";
    }

    var ajaxPage = "";
    ajaxPage = "GetResumeResultData.aspx";

    if (ScriptVariables.Get("debugmode")) {
        var link = "";
        if (g_init) {
            link = "<a href=\"" + "../Resumes/AJAX/" + ajaxPage + "?" + dataparams + "&reveal=g$" + "\">" + "here" + "</a>";
        }
        else {
            var encodedParams = dataparams.replace(/["]/gi, "&quot;")
            link = "<a href=\"" + "../Resumes/AJAX/" + ajaxPage + "?" + encodedParams + "&reveal=g$" + "\">" + "here" + "</a>";
        }

        jQuery("#rdbdebugdiv").html("Hi developer! The solr query you are looking for is in another reveal: " + link);
        jQuery("#rdbdebugdiv").show();
    }

    //Setting the like count to zero for Outlook mails
    countemailcandidateLike = 0

    jQuery.ajax({
        type: callType,
        url: "../Resumes/AJAX/" + ajaxPage,
        data: dataparams,
        timeout: 80000,
        dataType: 'json',
        success: function (msg) {
            var response = msg;

            if (response == null) {
                jQuery("#rdbmessage").text("An ajax error occurred.  If the problem persists, please contact Customer Service.");
                jQuery("#rdbmessage").show();
                jQuery("#controlsearchwrapper").hide();
                hideLoadingSpinner();
                return;
            }

            if (response.Status == 'No Locked License') {
                hideLoadingSpinner();
                location.href = 'LockRDBLicense.aspx';
                return;
            }

            if (response.Status != 'Ok') {
                jQuery("#rdbmessage").text(response.Status);
                jQuery("#rdbmessage").show();
                jQuery("#controlsearchwrapper").hide();
                hideLoadingSpinner();
                jQuery(window).scrollTop(0);
                return;
            }

            if (response.SearchCriteria.Status != 'null' && response.SearchCriteria.Status != 'Ok') {
                jQuery("#rdbmessage").text(response.SearchCriteria.Status);
                jQuery("#rdbmessage").show();
                hideLoadingSpinner();
                jQuery(window).scrollTop(0);
                if (typeof hideSliderOverlay != 'undefined') {
                    hideSliderOverlay(); //4.28.15 OneSearchUX - KB
                    $('#loc2').parent().parent().remove();
                }
                return;
            }

            g_gettingResults = false;
            if (typeof FastFlipGateway != 'undefined' && FastFlipGateway != null)
                FastFlipGateway.updateDocumentCollection(response, 'resume');

            var processedKeywords = processKeywordsForHighlighting(response.KeywordData.Keyword);        
            document.getElementById("_FastFlip_hdnHighlightKeywords").value = processedKeywords;

            
            var searchOptionString = jQuery.param(jQuery('.frmSearchOptions').serializeArray());

            g_searchOptionObject = jQuery.deparam(searchOptionString);


            if (typeof updateStrcritOnViewSimilar !== 'undefined' && typeof response.LocationData !== 'undefined')
                updateStrcritOnViewSimilar(response.LocationData.LocationList);

            if (typeof createSemanticSlider !== 'undefined')
                createSemanticSlider(response);


            if (typeof g_QID != 'undefined' &&  getFromStrcrit("QID=", response.SearchCriteria.NewStrCrit) !== "")
                g_QID = getFromStrcrit("QID=", response.SearchCriteria.NewStrCrit);

            if (ScriptVariables.Get('bsvSaveSearchKeywordZeroResult_CSI277182') && g_strcrit == ''){
                g_strcrit = response.SearchCriteria.NewStrCrit;
            }

            resultCallBack(response);
          
            if (response.SemanticSearchCriteria != null && response.SemanticSearchCriteria.SemanticSearchQuery != null) {
                $('#debuggingInfoQueryValue').html(response.SemanticSearchCriteria.SemanticSearchQuery);
            }

            if (response.SemanticSearchCriteria != null && response.SemanticSearchCriteria.SemanticSearchAPIVersion != null) {
                if ($('#debuggingInfoSemanticAPIVersionValue').html() == '') {
                    $('#debuggingInfoSemanticAPIVersionValue').html(response.SemanticSearchCriteria.SemanticSearchAPIVersion);
                }
            }

            if (typeof hideSliderOverlay != 'undefined')
                hideSliderOverlay(); //4.28.15 OneSearchUX - CH

            if (!ScriptVariables.Contains('Matching_ResumeDID')) {
                if (g_SemanticSearchLengthFlag == false && g_SemanticSearchEnable == true &&  typeof turnSemanticOff != 'undefined')
                    turnSemanticOff();
                else
                    if (g_SemanticSearchLengthFlag == true && g_SemanticSearchEnable == true && typeof turnSemanticOn != 'undefined')
                        turnSemanticOn();
                    else
                        if (g_SemanticSearchEnable == false && typeof showSemanticDisabledPanel != 'undefined')
                            showSemanticDisabledPanel();
            }

            if (typeof updateMatrix != 'undefined') {
                if (g_strcrit == '')
                    g_strcrit = response.SearchCriteria.NewStrCrit;
                updateMatrix();
            }
        },
        error: function (xhr, status, error) {
            g_gettingResults = false;
            hideLoadingSpinner();
            if (xhr.status === 403) {
                sessionTimeout();
            }
            if (typeof hideSliderOverlay != 'undefined')
                hideSliderOverlay(); //4.28.15 OneSearchUX - CH
        }
    });
}

/*
************************************** process ajax response
*/

function displayResumeResults(response) {
    
    setDataStore(response);

    if (g_init) {
        setStaticData(response);
        LJLocations(response);

		if (response.RDBSummary != null) {
			displayRDBSummary(response.RDBSummary);
		}
    }

    if (response.ResumeResultCount == null || response.ResumeResultCount.Status != "Ok" || response.ResumeResultCount.TotalCount == "0") {
        jQuery("#spnResultCount").html("0");
        if (typeof createSemanticSlider != 'undefined') {
            jQuery(".resultCount").html(0);
        }
        jQuery("#topsearch").show();
        jQuery("#rdbmessage").hide();
        jQuery("#divDuplicateAndBlockCount").hide();
        jQuery("#Pagination").hide();
        jQuery("#Pagination2").hide();
        jQuery("#checkAllBatchAction").hide();
        jQuery("#gotopage").hide();
        jQuery("#resTabs").hide();
        jQuery("#controlsearchwrapper").hide();
        jQuery("#searchresults").hide();
        jQuery("#frmTagFacets input").prop("disabled", false);

        if (ScriptVariables.Get('UpdateTagsHeaderRDBResults') == 'true') {
            if (jQuery("#tagResultsCount") != undefined) {
				jQuery("#tagResultsCount").html("0");
			}
		}
    }
	
	displayModifySearchLink();    

    if (response.RelocationList != null) {
        displayRelocationTab(response.RelocationList);
    }

    if (response.RelocationCNList != null) {
        displayRelocationTab(response.RelocationCNList);
    }
	
	displaySaveSearchLink();

	//There might be additional messaging just for tags later
	if (ScriptVariables.Get('UpdateRDBZeroResults') == 'true') {

	    if (response.ResumeResultCount.TotalCount === "0") {
	        jQuery("#zeroResultsText").show();
	        jQuery("#locationTips").show();
	        jQuery("#freshnessTips").show();

	        if (ScriptVariables.Get('UpdateRDBZeroTagResults') == 'true') {
	            jQuery("#zeroTagsResultsText").show();
	        }

	        jQuery('a.load-local').cluetip({ local: true, activation: 'click', height: 226, cursor: 'pointer', sticky: true, closePosition: 'title' });

	        jQuery("#freshnessTips").on("click", '.zeroResultsTips', function () {
	            $("#lastact option:selected").removeProp('selected').next('option').prop('selected', 'selected');
	            jQuery("#btnFacetSearch").trigger("click");
	        });

            /*
	        jQuery(document).on("click", '#BooleanTipsResults.zeroResultsTips', function () {
	            var keywordValue = $("#resumesearch").val();
                
                //need a regular expression here to determine if valid

	        });
            */

	        jQuery("#locationTips").on("click", '.zeroResultsTips', function () {
	            $("#dis option:selected").removeProp('selected').next('option').prop('selected', 'selected');
	            jQuery("#btnFacetSearch").trigger("click");
	        });

	        jQuery("#freshnessTipsResults").on("click", '.zeroResultsTips', function () {
	            $("#lastact option:selected").removeProp('selected').next('option').prop('selected', 'selected');
	            jQuery("#btnFacetSearch").trigger("click");
	        });

	        jQuery("#locationTipsResults").on("click", '.zeroResultsTips', function () {
	            $("#dis option:selected").removeProp('selected').next('option').prop('selected', 'selected');
	            jQuery("#btnFacetSearch").trigger("click");
	        });
	    }
	    else {
	        jQuery("#resTabs_wrapper").show();

	        jQuery("#zeroTagsResultsText").hide();
	        jQuery("#zeroResultsText").hide();
	        jQuery("#locationTips").hide();
	        jQuery("#freshnessTips").hide();
	    }   
	}

    if (response.ResumeResultCount != null && response.ResumeResultCount.TotalCount != null && response.ResumeResultCount.TotalCount != "0") {
        jQuery("#rdbmessage").hide();

        if (response.ResumePodViewSimilarData != null) {
            setResumePodViewSimilar(response.ResumePodViewSimilarData)
        }

        if (response.SearchCriteria != null) {
            if (response.SearchCriteria.NewStrCrit != null) {
                updateStrCrit(response.SearchCriteria.NewStrCrit);
            }
        }

        if (response.ResumeResultCount != null) {
            setPageCounts(response.ResumeResultCount);
        }

        if (response.ResumeResultList != null) {
            displayResumeResultList(response.ResumeResultList);
        }

        if (response.BulkResumeTagStaticData != null) {
            displaySaveToTagBatchAction(response.BulkResumeTagStaticData);
        }        

        displayModifySearchLink();

        g_st = "";

        if (ScriptVariables.Get('UpdateTagsRDBResults') != "true") {
            displayResumeResultTags();
        }
       
    }

    if (response.CEFilterStaticData != null) {
        hideFiltersList(response.CEFilterStaticData);
    }

    if (response.FRFilterStaticData != null) {
        hideFiltersList(response.FRFilterStaticData);
    }


    if (response.LJFilterStaticData != null) {
        hideFiltersList(response.LJFilterStaticData);
    }

	if (response.SFFilterStaticData != null) {
		hideFiltersList(response.SFFilterStaticData);
	}

    if (response.FilterFacet != null) {
        displayFilterFacets(response.FilterFacet);
    }

    displaySearchOptions(response);
    displayTagFacet(response);

    if (response.FastFlipData != null) {
        displayFastFlip(response.FastFlipData);
    }
    if (response.DownloadLinkData != null) {
        displayDownloadLink(response.DownloadLinkData);
    }
    if (response.ForwardLinkData != null) {
        displayForwardLink(response.ForwardLinkData);
    }
    if (response.HideNewWindowData != null) {
        hideNewWindow(response.HideNewWindowData);
    }
    if (response.HideSaveResumeData != null) {
        hideSaveResume(response.HideSaveResumeData);
    }
    if (response.HidePrintData != null) {
        hidePrint(response.HidePrintData);
    }
    if (response.HideSaveToFolderData != null) {
        hideSaveToFolder(response.HideSaveToFolderData);
    }
    if (response.HideRadiusSearchResultsData != null) {
        hideRadiusResultPage(response.HideRadiusSearchResultsData);
    }
    if (response.CustomFacetOrder != null) {
        reorderFacetOrder(response.CustomFacetOrder);
    }

	if (response.CoworkerTagList != null && response.UserTagList != null && response.UserTagList != "") {

		g_tagObjectsList = response.CoworkerTagList.CoworkerTagList.concat(response.UserTagList.Items);

		for (var i = 0; i < g_tagObjectsList.length; i++) {
			var taglist = g_tagObjectsList[i].TagList;
			if (taglist != null && taglist != "") {
				for (var j = 0; j < taglist.length; j++) {
					g_tagNamesList.push(taglist[j].TagName);
				}
			}
		}

		// remove any duplicates
		var uniqueTags = [];
		jQuery.each(g_tagNamesList, function (i, el) {
			if ($.inArray(el, uniqueTags) === -1) uniqueTags.push(el);
		});
		g_tagNamesList = uniqueTags;

		jQuery(".AddTagPopupText [name='addTag']").autocomplete({ source: g_tagNamesList });
		jQuery("#BulkAddTagPopup .BulkAddTagPopupText input").autocomplete({ source: g_tagNamesList });
	}
	
    moveToResumePosition();
    resetInitialization();
    hideLoadingSpinner();

    g_reload = 'false';

    //Flag protect the changes to avoid API request when the Filter is Checked/UnChecked
    if (ScriptVariables.Get('bDisableWidgetRequestForFilters') == false) {
        IsFacetFilterTriggered = false;
    }

    if (ScriptVariables.Get('bFlipV1RightRail') == true) {
        if (!IsFacetFilterTriggered) {
            FlipV1RightRail(response);
        }
    }
    else {
        //Setting to update Widget only on the UpdateResults button Click. Avoid calling Widget API on Fliter change.
        if (!IsFacetFilterTriggered) {
            if ((ScriptVariables.Get('bEnableSDWidget') == true) || (ScriptVariables.Get('bEnableMySupplyWidget') == true)) { InvokeSupplyDemandWidgetScript(response); }
        }
    }
}

/*
************************************** page count
*/

function setPageCounts(response) {
    if (response.Status != 'Ok') {
        return;
    }

    if (response.TotalCount != null) {
        g_numberOfResults = parseInt(response.TotalCount);
    }
    else {
        g_numberOfResults = 0;
    }

    g_numberOfDocsPerPage = parseInt(g_numberOfDocsPerPage);
    g_numberOfPages = parseInt(response.TotalPages);

    jQuery("#spnResultCount").html(numberWithCommas(g_numberOfResults));
    if (typeof createSemanticSlider != 'undefined') {
        jQuery(".resultCount").html(numberWithCommas(g_numberOfResults));
    }
    if (ScriptVariables.Get('UpdateTagsHeaderRDBResults') == 'true') {
        if (jQuery("#tagResultsCount") != undefined) {
			jQuery("#tagResultsCount").html(g_numberOfResults);
		}
	}


    if (response.TotalDuplicateAndBlockCount != null && response.TotalDuplicateAndBlockCount != "0") {
        jQuery("#spnDuplicateAndBlockCount").html(response.TotalDuplicateAndBlockCount);
    }
    else {
        jQuery("#divDuplicateAndBlockCount").hide();
    }

    jQuery("#topsearch").show();
}

function displayCount(totalCount, totalDupBlockCount) {
    jQuery("#spnResultCount").html(numberWithCommas(totalCount));
    if (typeof createSemanticSlider != 'undefined') {
        jQuery(".resultCount").html(numberWithCommas(totalCount));
    }
    if (ScriptVariables.Get('UpdateTagsHeaderRDBResults') == 'true') {
        if (jQuery("#tagResultsCount") != undefined) {
			jQuery("#tagResultsCount").html(g_numberOfResults);
		}
	}


    if (totalDupBlockCount != "0") {
        jQuery("#spnDuplicateAndBlockCount").html(totalDupBlockCount);
    }
    else {
        jQuery("#divDuplicateAndBlockCount").hide();
    }
}

/*
************************************** static data
*/

/*
************ job category static data
*/

function setJobCategoryStaticData(response) {
    //alert("loading");
    if (response.Status != 'Ok') {
        return;
    }

    if (response.DataList == null) {
        
        return;
    }
    //alert(response.DataList.count());
    jQuery('#jobcat').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#jobcat').append(jQuery('<option></option>').val(item.Key).html(item.Value));
        //jQuery('#jobcat').val("");
        
    });

    for (i = 2; i <= 5; i++) {
        jQuery.each(response.DataList, function (j, item) {
            jQuery('#jobcat' + i).append(jQuery('<option></option>').val(item.Key).html(item.Value));
           
        });
    }

    jQuery("#jobcat").val("");

    for (i = 2; i <= 5; i++) {
        jQuery("#jobcat" + i).val("");
        
        jQuery("#jobcat" + i + "set").hide();
    }

    jQuery('#facets_jct').css({ display: 'block' });
    jQuery('#listitem_jobcategory').css({ display: 'block' });
}



/*
* Generic static data, untemplated
*/
function setGenericStaticData(response, domElementName, facetName, listName, cssName) {
    if (response.Status != 'Ok') {
        return;
    }

    var element = jQuery("#" + domElementName);
    element.attr('name', response.QSVar).empty();

    var listName = jQuery("#" + listName); // sometimes the same as element, sometimes not (due to case sensitivity)
    jQuery.each(response.DataList, function (i, item) {
        listName.append(jQuery('<option></option>').val(item.Key).html(item.Value).addClass("locations").attr("title", item.Value));
    });

    if (facetName != "") {
        openFacet(facetName);
    }

    if (response.DataList.length > 0 && cssName != "") {
        jQuery('#listitem_' + cssName).css({ display: 'block' });
    }
}

/*
* Generic static data, templated
*/
function setGenericTemplatedStaticData(response, domElementName, templateHolderName, templateName) {
    if (response.Status != 'Ok') {
        return;
    }

    var element = jQuery("#" + domElementName);
    //var template = { "salarytype" : response.DataList };
    var template = { templateName: response.DataList };
    if (response.DataList != null && response.DataList != '') {
        element.setTemplate(jQuery("#jTemplateHolder_" + templateHolderName).html());
        element.processTemplate(template);
    }

    return response.QSVar;
}

/*
************ relocation static data
*/

function setRelocationStaticData(response) {
    if (response.RegionFRStaticData == null || response.OutsideCountriesStaticData == null || response.RelocationStaticData == null) {
        return;
    }

    if (response.RegionFRStaticData.Status != 'Ok' || response.OutsideCountriesStaticData.Status != 'Ok' || response.RelocationStaticData.Status != 'Ok') {
        return;
    }

    jQuery('#relocation').attr('name', response.RelocationStaticData.QSVar);
    jQuery('#OtherCountries').attr('name', response.RelocationStaticData.QSVar);

    jQuery('#relocation').empty();
    jQuery('#OtherCountries').empty();

    jQuery.each(response.RegionFRStaticData.DataList, function (i, item) {
        jQuery('#relocation').append(jQuery('<option></option>').val(item.Key).html(item.Value).addClass("relocations").attr("title", item.Value));
    });

    jQuery.each(response.OutsideCountriesStaticData.DataList, function (i, item) {
        jQuery('#OtherCountries').append(jQuery('<option></option>').val(item.Key).html(item.Value).addClass("outsiderelocationcountries").attr("title", item.Value));
    });

    if (response.RegionFRStaticData.DataList.length > 0) {
        jQuery('#listitem_relocation').css({ display: 'block' });
    }

    openFacet("relocationheader");
}

/*
************ techno database data
*/

function setTechnoDatabaseStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#technodatabase').attr('name', response.QSVar);

    jQuery('#technodatabase').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#technoDatabase').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });

    if (response.DataList.length > 0) {
        jQuery('#listitem_technodatabase').css({ display: 'block' });
    }
}

/*
************ techno language data
*/

function setTechnoLanguageStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#technolanguage').attr('name', response.QSVar);

    jQuery('#technolanguage').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#technoLanguage').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });

    if (response.DataList.length > 0) {
        jQuery('#listitem_technolanguage').css({ display: 'block' });
    }
}

/*
************ techno method data
*/

function setTechnoMethodStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#technomethod').attr('name', response.QSVar);

    jQuery('#technomethod').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#technoMethod').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });

    if (response.DataList.length > 1) {
        jQuery('#listitem_technomethod').css({ display: 'block' });
    }
}

/*
************ techno network data
*/

function setTechnoNetworkStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#technonetwork').attr('name', response.QSVar);

    jQuery('#technonetwork').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#technoNetwork').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });

    if (response.DataList.length > 1) {
        jQuery('#listitem_technonetwork').css({ display: 'block' });
    }
}

/*
************ techno others data
*/

function setTechnoOthersStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#technoothers').attr('name', response.QSVar);

    jQuery('#technoothers').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#technoOthers').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });

    if (response.DataList.length > 1) {
        jQuery('#listitem_technoothers').css({ display: 'block' });
    }
}

/*
************ techno System data
*/

function setTechnoSystemStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#technoSystem').attr('name', response.QSVar);

    jQuery('#technoSystem').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#technoSystem').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });

    if (response.DataList.length > 1) {
        jQuery('#listitem_technosystem').css({ display: 'block' });
    }
}

/*
************************************** resume legend veteran icon
*/

function setResumeVeteranIconData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery("#resumelegendveteranicon").show();
}

/*
************************************** facet utilities
*/

function openFacet(facetHeaderID) {
    jQuery("#" + facetHeaderID).closest("fieldset").find(".facetplaceholder").css("display", "block");
    jQuery("#" + facetHeaderID).closest("fieldset").find("a.facet-toggle").css("background-position", "0px 0px");
}

function closeFacet(facetHeaderID) {
    jQuery("#" + facetHeaderID).closest("fieldset").find(".facetplaceholder").css("display", "none");
    jQuery("#" + facetHeaderID).closest("fieldset").find("a.facet-toggle").css("background-position", "0px -11px");
}

/*
************************************** search options
*/

function getFormattedSearchOptions(searchOptionObject) {
    
    var searchOptions = '{';
    searchOptions += '\"RAWWORDS\":' + '\"' + escapeChar(encodeURIComponent(eval('searchOptionObject.' + 'RAWWORDS'))) + '\"';
    searchOptions += ',\"USE\":' + '\"' + g_keywordUse + '\"';
    searchOptions += ',\"FRE\":' + '\"' + escapeChar(encodeURIComponent(eval('searchOptionObject.' + 'FRE'))) + '\"';
    searchOptions += ',\"RAD\":' + '\"' + eval('searchOptionObject.' + 'RAD') + '\"';
    searchOptions += ',\"RADU\":' + '\"' + eval('searchOptionObject.' + 'RADU') + '\"';
    searchOptions += ',\"LOC\":' + '\"' + eval('searchOptionObject.' + 'LOC') + '\"';
    searchOptions += ',\"CMTP\":' + '\"' + eval('searchOptionObject.' + 'CMTP') + '\"';
    if (ScriptVariables.Get("bRDBSalaryfiltersearch") && eval('searchOptionObject.' + 'PAYL') == "") {
        searchOptions += ',\"PAYL\":' + '\"' + 0 + '\"';
    }
    else {
        searchOptions += ',\"PAYL\":' + '\"' + eval('searchOptionObject.' + 'PAYL') + '\"';
    }
    searchOptions += ',\"PAYH\":' + '\"' + eval('searchOptionObject.' + 'PAYH') + '\"';
    searchOptions += ',\"POY\":' + '\"' + getValidSelection(eval('searchOptionObject.' + 'POY')) + '\"';
    searchOptions += ',\"CMPN\":' + '\"' + escapeChar(encodeURIComponent(eval('searchOptionObject.' + 'CMPN'))) + '\"';
    searchOptions += ',\"MRC\":' + '\"' + escapeChar(encodeURIComponent(eval('searchOptionObject.' + 'MRC'))) + '\"';
    //CSI276490-Resume Title textbox not binding the data when we click first time in Resume result page
    if (ScriptVariables.Get('bResumetitleIssue_CSI276490')) {
        searchOptions += ',\"RSTL\":' + '\"' + escapeChar(encodeURIComponent(eval('searchOptionObject.' + 'RSTL'))) + '\"';
    }
    else {
        searchOptions += ',\"RSTL\":' + '\"' + escapeChar(encodeURIComponent(g_resumeTitle)) + '\"';
    }
    searchOptions += ',\"RSTLUSE\":' + '\"' + g_resumeTitleUse + '\"';
    searchOptions += ',\"RECENTJOBT\":' + '\"' + getValidSelection(eval('searchOptionObject.' + 'RECENTJOBT')) + '\"';
    searchOptions += ',\"JOBT\":' + '\"' + escapeChar(encodeURIComponent(eval('searchOptionObject.' + 'JOBT'))) + '\"';
    searchOptions += ',\"JOBTUSE\":' + '\"' + eval('searchOptionObject.' + 'JOBTUSE') + '\"';
	searchOptions += ',\"COURSEOFSTUDY\":' + '\"' + escapeChar(encodeURIComponent(eval('searchOptionObject.' + 'COURSEOFSTUDY'))) + '\"';
	searchOptions += ',\"CLIENTACCESS\":' + '\"' + eval('searchOptionObject.' + 'CLIENTACCESS') + '\"';
    searchOptions += ',\"CAT\":' + '\"' + eval('searchOptionObject.' + 'CAT') + '\"';
    searchOptions += ',\"EMT\":' + '\"' + eval('searchOptionObject.' + 'EMT') + '\"';
    searchOptions += ',\"WST\":' + '\"' + eval('searchOptionObject.' + 'WST') + '\"';
    searchOptions += ',\"MIL\":' + '\"' + eval('searchOptionObject.' + 'MIL') + '\"';
    searchOptions += ',\"LG\":' + '\"' + eval('searchOptionObject.' + 'LG') + '\"';
    searchOptions += ',\"GV\":' + '\"' + eval('searchOptionObject.' + 'GV') + '\"';
    searchOptions += ',\"SCHL\":' + '\"' + escapeChar(encodeURIComponent(eval('searchOptionObject.' + 'SCHL'))) + '\"';    
    searchOptions += ',\"EDUDEGREES\":' + '\"' + getEducationDegreeDropdownValues() + '\"';
    searchOptions += ',\"EDU\":' + '\"' + eval('searchOptionObject.' + 'EDU') + '\"';
    searchOptions += ',\"MAXEDU\":' + '\"' + eval('searchOptionObject.' + 'MAXEDU') + '\"';
    searchOptions += ',\"EXPL\":' + '\"' + eval('searchOptionObject.' + 'EXPL') + '\"';
    searchOptions += ',\"EXPH\":' + '\"' + eval('searchOptionObject.' + 'EXPH') + '\"';
    searchOptions += ',\"TVL\":' + '\"' + eval('searchOptionObject.' + 'TVL') + '\"';
    searchOptions += ',\"CE\":' + '\"' + eval('searchOptionObject.' + 'CE') + '\"';
    searchOptions += ',\"MGE\":' + '\"' + eval('searchOptionObject.' + 'MGE') + '\"';
    searchOptions += ',\"MGC\":' + '\"' + eval('searchOptionObject.' + 'MGC') + '\"';
    searchOptions += ',\"DATETYPE\":' + '\"' + getValidSelection(eval('searchOptionObject.' + 'DATETYPE')) + '\"';
    searchOptions += ',\"SC\":' + '\"' + eval('searchOptionObject.' + 'SC') + '\"';
    searchOptions += ',\"GND\":' + '\"' + eval('searchOptionObject.' + 'GND') + '\"';
    searchOptions += ',\"AGEL\":' + '\"' + eval('searchOptionObject.' + 'AGEL') + '\"';
    searchOptions += ',\"AGEH\":' + '\"' + eval('searchOptionObject.' + 'AGEH') + '\"';
    searchOptions += ',\"MAJOR\":' + '\"' + eval('searchOptionObject.' + 'MAJOR') + '\"';
    searchOptions += ',\"GRADMONTHH\":' + '\"' + eval('searchOptionObject.' + 'GRADMONTHH') + '\"';
    searchOptions += ',\"GRADMONTHL\":' + '\"' + eval('searchOptionObject.' + 'GRADMONTHL') + '\"';
    searchOptions += ',\"GRADYEARH\":' + '\"' + eval('searchOptionObject.' + 'GRADYEARH') + '\"';
    searchOptions += ',\"GRADYEARL\":' + '\"' + eval('searchOptionObject.' + 'GRADYEARL') + '\"';
    searchOptions += ',\"NLC\":' + '\"' + eval('searchOptionObject.' + 'NLC') + '\"';
    searchOptions += ',\"NLC\":' + '\"' + eval('searchOptionObject.' + 'NLC') + '\"';
    searchOptions += ',\"CID\":' + '\"' + eval('searchOptionObject.' + 'CID') + '\"';
    searchOptions += ',\"LOCCID\":' + '\"' + ScriptVariables.Get("HostSiteEnum") + '\"';
	searchOptions += ',\"NATIONALITY\":' + '\"' + eval('searchOptionObject.' + 'NATIONALITY') + '\"';
	searchOptions += ',\"JCHIGHESTDEGREE\":' + '\"' + eval('searchOptionObject.' + 'JCHIGHESTDEGREE') + '\"';
    searchOptions += ',\"DRV\":' + '\"' + eval('searchOptionObject.' + 'DRV') + '\"';

    searchOptions += ',\"CESoftware\":' + '\"' + eval('searchOptionObject.' + 'CESoftware') + '\"';


    searchOptions += ',\"LJTechnoDatabase\":' + '\"' + eval('searchOptionObject.' + 'LJTECHDB') + '\"';
	searchOptions += ',\"LJTechnoLanguage\":' + '\"' + eval('searchOptionObject.' + 'LJTECHLANG') + '\"';
	searchOptions += ',\"Availability\":' + '\"' + eval('searchOptionObject.' + 'AVAIL') + '\"';
	searchOptions += ',\"LJTechnoMethodology\":' + '\"' + eval('searchOptionObject.' + 'LJTECHMETH') + '\"';
	searchOptions += ',\"LJTechnoOtherKnowledge\":' + '\"' + eval('searchOptionObject.' + 'LJTECHOK') + '\"';
	searchOptions += ',\"LJTechnoNetwork\":' + '\"' + eval('searchOptionObject.' + 'LJTECHNET') + '\"';
	searchOptions += ',\"LJTechnoSystem\":' + '\"' + eval('searchOptionObject.' + 'LJTECHSYS') + '\"';
    searchOptions += ',\"Reference\":' + '\"' + eval('searchOptionObject.' + 'RDID') + '\"';
    searchOptions += ',\"ContactName\":' + '\"' + eval('searchOptionObject.' + 'CNAME') + '\"';
    searchOptions += ',\"CELevelSoftware\":' + '\"' + eval('searchOptionObject.' + 'CELevelSoftware') + '\"';
    searchOptions += ',\"Language1\":' + '\"' + eval('searchOptionObject.' + 'LANG1') + '\"';
    searchOptions += ',\"Language2\":' + '\"' + eval('searchOptionObject.' + 'LANG2') + '\"';
    searchOptions += ',\"LanguageProf1\":' + '\"' + eval('searchOptionObject.' + 'LANGPROF1') + '\"';
    searchOptions += ',\"LanguageProf2\":' + '\"' + eval('searchOptionObject.' + 'LANGPROF2') + '\"';
    
    if (ScriptVariables.Get("bRDBFRRegionSearch")) {
        if (ScriptVariables.Get("RDBSliceCode") == "CE" || ScriptVariables.Get("RDBSliceCode") == "ER") {
            searchOptions += ',\"CTY\":' + '\"ALL\"';
        }
    }

    if (eval('searchOptionObject.' + 'LJGEOTYPE') != undefined) {
        searchOptions += ',\"LJGEOTYPE\":' + '\"' + eval('searchOptionObject.' + 'LJGEOTYPE') + '\"';
        searchOptions += ',\"LJRELGEOTYPE\":' + '\"' + eval('searchOptionObject.' + 'LJRELGEOTYPE') + '\"';

        
            searchOptions += ',\"CTY\":\"\"';
       

        var locationArray = [];

        if (eval('searchOptionObject.' + 'LOC') != null) {
            locationArray = eval('searchOptionObject.' + 'LOC');
        }
        
        var formattedLocationArray = [];
        var formattedItem = "";
        
        jQuery.each(locationArray, function (i, item) {
            if (item != "") {
                formattedItem = item.replace("|", "");
                formattedLocationArray.push(formattedItem);
            }
        });

        var relocationArray = [];

        if (eval('searchOptionObject.' + 'RELOC') != null) {
            relocationArray = eval('searchOptionObject.' + 'RELOC');
            if (relocationArray.length == 1) {		// if only one is selected, it's a string and not an array
				relocationArray = relocationArray.split("");
			}
        }
        if (!$.isArray(relocationArray)) {
			relocationArray = [relocationArray];
		}

        var formattedRelocationArray = [];

        jQuery.each(relocationArray, function (i, item) {
            if (item != "") {
                formattedRelocationArray.push(item);
            }
        });
        
        if (eval('searchOptionObject.' + 'LJGEOTYPE') != 'ALL') {
                searchOptions += ',\"LJGEO\":' + '\"' + formattedLocationArray + '\"';
        }
        
        if (eval('searchOptionObject.' + 'LJRELGEOTYPE') != 'NFR' || formattedRelocationArray.length == 0) {
            searchOptions += ',\"LOCCID\":' + '\"FR\"';
            searchOptions += ',\"CID\":' + '\"FR\"';
        }
        else {
            searchOptions += ',\"LOCCID\":' + '\"FR,' + formattedRelocationArray + '\"';
            searchOptions += ',\"CID\":' + '\"FR,' + formattedRelocationArray + '\"';
        }
        
        if (eval('searchOptionObject.' + 'LJRELGEOTYPE') == 'FR') {
                searchOptions += ',\"SID\":' + '\"' + formattedRelocationArray + '\"';
        }
        
        if (eval('searchOptionObject.' + 'LJRELGEOTYPE') == 'FR') {
                searchOptions += ',\"QT\":' + '\"RS\"';
        }


        if (eval('searchOptionObject.' + 'LJRELGEOTYPE') == 'NFR') {
            searchOptions += ',\"QT\":' + '\"RN\"';
        }

        if (eval('searchOptionObject.' + 'LJRELGEOTYPE') == 'ALL') {
            searchOptions += ',\"QT\":' + '\"RSN\"';
        }

        var ljPROV = "LJ";  // get 'CE' or 'LJ' based on slicecode                                   
        searchOptions += ',\"PROV\":' + '\"' + ljPROV + '\"'; // set if 'CE' or 'LJ' slicecode
        searchOptions += ',\"CVT\":' + '\"FR\"'; // set if 'CE' or 'LJ' is the slicecode                                   
        searchOptions += ',\"CE\":' + '\"ALL\"';
    }
    else if (eval('searchOptionObject.' + 'SFCID') != undefined || eval('searchOptionObject.' + 'SF_AREA') != undefined) {
        searchOptions += ',\"LOCCID\":' + '\"' + SetSFArea('CID') + '\"';
        if ($('#ddlarea').val().length > 0) {
            //IMPORTANT we use this 'AREA' parameter to set the ddlarea in the result page
            searchOptions += ',\SF_AREA:\"' + eval('searchOptionObject.SF_AREA') + '\"';
            searchOptions += ',\AREA:\"' + eval('searchOptionObject.SF_AREA') + '\"';

            searchOptions += ',\"CID\":' + '\"' + SetSFArea('CID') + '\"';

            if (SetSFArea('CID').split(',').length > 1) {

                if (containsSFLocationParameter('SID')) {
                    searchOptions += ',\"SID\":' + '\"' + SetSFArea('SID') + '\"';
                }

                if (containsSFLocationParameter('CTY')) {
                    searchOptions += ',\"CTY\":' + '\"' + SetSFArea('CTY') + '\"';
                    searchOptions += ',\"ZIP\":' + '\"' + SetSFArea('CTY') + '\"';
                }
            }
            else {

                var values = $('#ddlarea').val().split(';');

                for (i = 0; i < values.length - 1; i++) {

                    var qryParams = values[i].split('=');

                    searchOptions += ',\"' + qryParams[0] + '\":' + '\"' + qryParams[1] + '\"';

                    if (values[i].indexOf('CTY') != -1) {
                        searchOptions += ',\" ZIP\":' + '\"' + qryParams[1] + '\"';
                    }
                }
            }

        }
        else {
            searchOptions += ',\"CID\":' + '\"' + eval('searchOptionObject.' + 'SFCID') + '\"';
            searchOptions += ',\"SID\":' + '\"' + eval('searchOptionObject.' + 'SFSID') + '\"';
            searchOptions += ',\"CTY\":' + '\"' + eval('searchOptionObject.' + 'CTY') + '\"';
            searchOptions += ',\"ZIP\":' + '\"' + eval('searchOptionObject.' + 'CTY') + '\"';
        }

		if (eval('searchOptionObject.' + 'sortLocation') != undefined) {
			if (eval('searchOptionObject.' + 'sortLocation') == 0) {

				if (eval('searchOptionObject.' + 'SID') != undefined ||
				eval('searchOptionObject.' + 'SFSID') != undefined ||
				($('#ddlarea').val().length > 0 && !isCountryArea($('#ddlarea').val()))) {
					searchOptions += ',\"QT\":' + '\"RCS\"';
				}
				else {
					searchOptions += ',\"QT\":' + '\"RN\"';
				}
			}
			else {
				searchOptions += ',\"QT\":' + '\"N\"';
			}
		}
    }
    else {
        searchOptions += ',\"LOC\":' + '\"' + eval('searchOptionObject.' + 'LOC') + '\"';
        searchOptions += ',\"CID\":' + '\"' + eval('searchOptionObject.' + 'CID') + '\"';
        searchOptions += ',\"LOCCID\":' + '\"' + ScriptVariables.Get("HostSiteEnum") + '\"';

    }
	
	searchOptions += ',\"SFNMC\":' + '\"' + eval('searchOptionObject.' + 'SFNMC') + '\"';
	searchOptions += ',\"SFCL\":' + '\"' + eval('searchOptionObject.' + 'SFCL') + '\"';

	searchOptions += ',\"SFSP\":' + '\"' + eval('searchOptionObject.' + 'SFSP') + '\"';
	searchOptions += ',\"SCHOOLFLAG\":' + '\"' + eval('searchOptionObject.' + 'SCHOOLFLAG') + '\"';
	searchOptions += '}';
	
    return searchOptions;
}

function displaySearchOptions(response) {
    //g_searchOptionObject = null;
    var displayMoreSearchOptionTab = false;
    var displayQuickSearchOption = false;

    g_formattedSearchOptions = "";
    g_searchTab = false;

    if (response.KeywordData != null) {
        displayKeyword(response.KeywordData);
    }

    if (response.FreshnessData != null && response.FreshnessData.SelectedFreshnessText != null) {
        displayFreshness(response.FreshnessData.SelectedFreshnessText);
        displayQuickSearchOption = true;
    }

    if (response.SFFreshnessso != null && response.SFFreshnessso.SelectedFreshnessText != null) {
        displayFreshness(response.SFFreshnessso.SelectedFreshnessText);
        displayQuickSearchOption = true;
    }

    if (response.DateTypeData != null) {
        displayDateType(response.DateTypeData);
        displayQuickSearchOption = true;
    }
    
    if (response.LocationData != null) {
        displayLocation(response.LocationData);
        displayQuickSearchOption = true;
    }

    if (response.CountryData != null) {
        displayCountry(response.CountryData);
        displayQuickSearchOption = true;
    }

    if (response.SalaryData != null) {
        displaySalary(response.SalaryData);
        displayQuickSearchOption = true;
    }

    if (displayQuickSearchOption == true) {
        jQuery("#searchoptionscontainer").css("display", "block");
        jQuery("#topbtnaction").show();
    }

    if (response.CompanyData != null) {
        displayCompany(response.CompanyData);
        displayMoreSearchOptionTab = true;
    }
	
    if (response.CourseOfStudyData != null) {
        displayCourseOfStudy(response.CourseOfStudyData);
        displayMoreSearchOptionTab = true;
    }

	if (response.BulkUnlockResumeDomainData != null) {
		processBulkUnlockResume(response.BulkUnlockResumeDomainData);
	}
	
    if (response.ResumeTitleData != null) {
        displayResumeTitle(response.ResumeTitleData);
        displayMoreSearchOptionTab = true;
    }

    if (response.JobTitleData != null) {
        displayJobTitle(response.JobTitleData);
        displayMoreSearchOptionTab = true;
    }

    if (response.JobCategoryData != null) {
        displayJobCategory(response.JobCategoryData);
        displayMoreSearchOptionTab = true;
    }
    if (response.JobCategoryData != null) {
            viewJobCategory(response.JobCategoryData);
            displayMoreSearchOptionTab = true;
        }
    if (response.EmploymentTypeData != null) {
        displayEmploymentType(response.EmploymentTypeData);
        displayMoreSearchOptionTab = true;
    }

    if (response.EducationData != null) {
        displayEducation(response.EducationData);
        displayMoreSearchOptionTab = true;
    }

    if (response.ExperienceData != null) {
        displayExperience(response.ExperienceData);
        displayMoreSearchOptionTab = true;
    }

    if (response.ExperienceMinData != null) {
        displayExperienceMin(response.ExperienceMinData);
        displayMoreSearchOptionTab = true;
    }

    if (response.LanguageData != null) {
        displayLanguage(response.LanguageData);
        displayMoreSearchOptionTab = true;
    }

    if (response.WorkStatusData != null) {
        displayWorkStatus(response.WorkStatusData);
        displayMoreSearchOptionTab = true;
    }

	if (response.NationalityData != null) {
        displayNationality(response.NationalityData, response.NationalityStaticData);
        displayMoreSearchOptionTab = true;
    }

        if (response.JCSchoolStaticData != null) {
            displaySchoolFlag(response.JCSchoolFlagData, response.JCSchoolStaticData);
            displayMoreSearchOptionTab = true;
        }

	if (response.JCHighestDegreeData != null) {
        displayJCHighestDegree(response.JCHighestDegreeData, response.JCHighestDegreeStaticData);
        displayMoreSearchOptionTab = true;
    }
	
    if (response.SecurityClearanceData != null) {
        displaySecurityClearance(response.SecurityClearanceData);
        displayMoreSearchOptionTab = true;
    }

    if (response.MilitaryExpData != null) {
        displayMilitaryExp(response.MilitaryExpData);
        displayMoreSearchOptionTab = true;
    }

    if (response.ClearanceLevelData != null) {
        displayClearanceLevel(response.ClearanceLevelData);
        displayMoreSearchOptionTab = true;
    }

    if (response.GenderData != null) {
        displayGender(response.GenderData);
        displayMoreSearchOptionTab = true;
    }

    if (response.AgeData != null) {
        displayAge(response.AgeData);
        displayMoreSearchOptionTab = true;
    }

    if (response.EducationMajorData != null) {
        displayEducationMajor(response.EducationMajorData);
        displayMoreSearchOptionTab = true;
    }

    if (response.GraduationData != null) {
        displayGraduation(response.GraduationData);
        displayMoreSearchOptionTab = true;
    }

    if (response.NurseLicenseData != null) {
        displayNurseLicense(response.NurseLicenseData);
        displayMoreSearchOptionTab = true;
    }

    if (response.SoftwareData != null) {
        displaySoftware(response.SoftwareData);
        displayMoreSearchOptionTab = true;
    }

    if (response.DriversLicenseData != null) {
          displayDriverLicense(response.DriversLicenseData);
    }

    if (response.TechnoDatabaseData != null) {
        displayTechnoDatabase(response.TechnoDatabaseData);
        displayMoreSearchOptionTab = true;
    }

    if (response.SFCountries != null) {
        displaySFCountries(response.SFCountries);
    }

    if ($('#sfLocationDiv').css('display') == 'block') {
        hideBasicLocation();
    }

    if (response.SFCounty != null) {
        displaySFCounty(response.SFCounty);
    }

    if (response.SFPostalCode != null) {
        displaySFPostalCode(response.SFPostalCode);
    }

    if (response.SearchCriteria.NewStrCrit.indexOf('SF_AREA') != -1) {
        displaySFArea(response);
    }
    
    if (response.TechnoLanguageData != null) {
        displayTechnoLanguage(response.TechnoLanguageData);
        displayMoreSearchOptionTab = true;
    }
    if (response.AvailabilityData != null) {
        displayAvailability(response.AvailabilityData);
        displayMoreSearchOptionTab = true;
    }
    else {
        if (ScriptVariables.Get("HideAvailability")) {
            $(".availability").css("display", "none");
        }
    }
    

    if (response.TechnoSystemData != null) {
        displayTechnoSystem(response.TechnoSystemData);
        displayMoreSearchOptionTab = true;
    }


    if (response.TechnoMethodData != null) {
        displayTechnoMethod(response.TechnoMethodData);
        displayMoreSearchOptionTab = true;
    }

    if (response.TechnoNetworkData != null) {
        displayTechnoNetwork(response.TechnoNetworkData);
        displayMoreSearchOptionTab = true;
    }
	
	if (response.TechnoOthersData != null) {
		displayTechnoOthers(response.TechnoOthersData);
		displayMoreSearchOptionTab = true;
	}

    if (response.SectorData != null) {
        displaySector(response.SectorData);
        displayMoreSearchOptionTab = true;
    }
  

    if (response.SoftwareLevelData != null) {
        displaySoftwareLevel(response.SoftwareLevelData);
        displayMoreSearchOptionTab = true;
    }

    if (response.LanguageProficiency1 != null && response.LanguageProficiency2 != null) {
        displayLanguageProficiency(response.LanguageProficiency1, response.LanguageProficiency2);
        displayMoreSearchOptionTab = true;
    }

    if (displayMoreSearchOptionTab == true) {
        jQuery("#searchoptionscontainer").css("display", "block");
        jQuery("#facetcontainer").css("display", "block");
        jQuery("#frmSearchOptions").css("display", "block");
        jQuery("#moresearchoptiontab").css("display", "block");
        jQuery("#bottombtnaction").show();
        jQuery("#quicksearchborder").show();

        if (g_filterTab == false) {
            jQuery("#moresearchoptiontab").attr("class", "ui-state-default ui-corner-top ui-tabs-selected ui-state-active");
            jQuery("#moresearch").attr("class", "ui-tabs-panel ui-widget-content ui-corner-bottom");
        }

        g_searchTab = true;
    }

    if (response.CustomKeywordsContactData != null) {
        displayContactName(response.CustomKeywordsContactData);
        displayMoreSearchOptionTab = true;
    }

    if (response.CustomKeywordsReferenceData != null) {
        displayReference(response.CustomKeywordsReferenceData);
        displayMoreSearchOptionTab = true;
    }

    if (ScriptVariables.Get('RDBIndiaDefaultDistance') == 'true') {
        if (response.DistanceData != null) {
            displayDistance(response.DistanceData);
        }
    }
  
	if (response.sfnmccheckboxData != null) {
		displaySFNMCCheckbox(response.sfnmccheckboxData);
		displayMoreSearchOptionTab = true;
	}

    if (response.CareerLevelData != null) {
		displayCareerLevel(response.CareerLevelData);
		displayMoreSearchOptionTab = true;
	}

	if (response.SpecialismData != null) {
		displaySpecialism(response.SpecialismData);
		displayMoreSearchOptionTab = true;
	}

    if (response.CurrentSearchTextData != null) {
        displayCurrentSearchText(response.CurrentSearchTextData);
    }

	if (response.RadioRelocationData != null) {
		displayRadioRelocation(response.RadioRelocationData);
	}

    if (response.ResumePermissionData != null) {
        displayResumePermission(response.ResumePermissionData);
        displayMoreSearchOptionTab = true;
    }

    if (ScriptVariables.Get("RDBSliceCode") == 'LJ' && ScriptVariables.Get("HideControlsForLJ") == "true") {
        jQuery('#facets_edu').css({ display: 'none' });
        jQuery('#facets_cem').css({ display: 'none' });
        jQuery('#facets_tra').css({ display: 'none' });
        jQuery('#facets_mge').css({ display: 'none' });
        jQuery('#facets_mnm').css({ display: 'none' });
    }
}

/*
************ keyword search option
*/

function displayKeyword(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery("#resumesearch").val(response.Keyword);

    g_keywordUse = response.KeywordUse;

    jQuery("#listitem_keyword").show();

    if (ScriptVariables.Get('RDBMVCUseBoolean') == 'true') {
        g_keywordUse = "BOO";
    }
    else {
        g_keywordUse = response.KeywordUse;
    }
	
	BindSearchFieldTally("#resumesearch", "change", "keyword");
}

/*
************ freshness search option
*/

function displayFreshness(selectedFreshness) {
    jQuery('#lastact').empty();

    if (g_freshnessListLUCache != null && g_freshnessListLUCache != '') {
        jQuery.each(g_freshnessListLUCache, function (i, item) {
            jQuery('#lastact').append(jQuery('<option></option>').val(item.Key).html(item.Value));
        });
    }

    jQuery("#lastact").val(selectedFreshness);
    jQuery("#listitem_freshness").show();
	
	BindSearchFieldTally("#lastact", "change", "'freshness'");
}


function displayFreshnessOld(selectedFreshness) {
    jQuery('#lastact').empty();
    jQuery('#mod').empty();
    if (g_freshnessListLUCache != null && g_freshnessListLUCache != '') {
        jQuery.each(g_freshnessListLUCache, function (i, item) {
            jQuery('#lastact').append(jQuery('<option></option>').val(item.Key).html(item.Value));
        });
    }
  
    jQuery("#lastact").val(selectedFreshness);
    jQuery("#LASTACT").parent().attr("title", ScriptVariables.Get('lastActivityToolTip'));
    jQuery("#LASTMOD").parent().attr("title", ScriptVariables.Get('lastModifiedToolTip'));
    jQuery("#listitem_freshness").show();
}

/*
************ date type search option
*/

function displayDateType(response) {
    if (response.Status != "Ok") {
        return;
    }
    if (response.DateType == "LASTACT") {
        setLastActivityDateTypeControls();
    }
    else {
        setLastModifiedDateTypeControls();
    }

    jQuery("#" + response.DateType).attr("checked", "checked");
    jQuery("#" + response.DateType).siblings().removeAttr("checked");

    jQuery("#datetype").show();
	
	BindSearchFieldTally("#datetype", "change", "'freshness' type");
}

function setLastActivityDateTypeControls() {
   
    jQuery("#lastactsort").removeAttr("disabled");
    jQuery("#lastmodsort").attr("disabled", "disabled");
    jQuery("#searchresults .lastactivitydate").show();
    jQuery("#searchresults .lastmodifieddate").hide();
    jQuery("#searchresults .date").attr("title", ScriptVariables.Get('lastActivityToolTip'));
    jQuery("#LASTACT").parent().attr("title", ScriptVariables.Get('lastActivityToolTip'));
    jQuery("#LASTMOD").parent().attr("title", ScriptVariables.Get('lastModifiedToolTip'));
    jQuery("#lastactivityheader").text(ScriptVariables.Get('lastActivityLabel'));
}

function setLastModifiedDateTypeControls() {
    
    jQuery("#lastmodsort").removeAttr("disabled");
    jQuery("#lastactsort").attr("disabled", "disabled");
    jQuery("#searchresults .lastmodifieddate").show();
    jQuery("#searchresults .lastactivitydate").hide();
    jQuery("#searchresults .date").attr("title", ScriptVariables.Get('lastModifiedToolTip'));
    jQuery("#LASTACT").parent().attr("title", ScriptVariables.Get('lastActivityToolTip'));
    jQuery("#LASTMOD").parent().attr("title", ScriptVariables.Get('lastModifiedToolTip'));
    jQuery("#lastactivityheader").text(ScriptVariables.Get('lastModifiedLabel'));
}


/*
************ display RadioRelocation 
*/
function displayRadioRelocation(response) {
    if (response.Status != "Ok") {
        return;
    }

    if (response.RadioRelocation == '0') {
        $('#rbrelocation').prop('checked', true);
    }
    else {
        $('#reblocation').prop('checked', true);
    }

    jQuery("#listitem_radioRelocation").show();
	
	BindSearchFieldTally("#rbrelocation", "change", "relocation type");
	BindSearchFieldTally("#reblocation", "change", "relocation type");
}

/*
************ location search option
*/

function displayLocation(response) {
    if (response.Status != "Ok") {
        return;
    }

    if (ScriptVariables.Get('RDBIndiaDefaultDistance') != 'true') {
        jQuery('#facets_lut').empty();

        if (g_radiusUnitsListLUCache != null && g_radiusUnitsListLUCache != '') {
            jQuery.each(g_radiusUnitsListLUCache, function (i, item) {
                jQuery('#facets_lut').append(jQuery('<option></option>').val(item.Key).html(item.Value));

            });
        }

        jQuery("#dis").val(response.Radius);
        jQuery("#facets_lut").val(response.RadiusUnits);
    }

    jQuery("#loc").val("");
    for (i = 2; i <= 3; i++) {
        jQuery("#loc" + i).val("");
        jQuery("#loc" + i + "set").hide();
    }

    g_locid = 1;

    jQuery.each(response.LocationList, function (i, item) {
        if (i == 0) {
            jQuery("#loc").val(item);
        }
        else {
            g_availableLocIDs.shift();

            g_locid += 1;
            jQuery("#loc" + g_locid).val(item);
            jQuery("#loc" + g_locid + "set").show();
        }
    });


    if (g_availableLocIDs.length == 0) {
        jQuery("#addlocation").hide();
    }
    else {
        jQuery("#addlocation").show();
    }

    jQuery("#listitem_location").show();

	BindSearchFieldTally("#addlocation", "click", "location added");
	BindSearchFieldTally("#rem_loc2", "click", "location2 removed");
	BindSearchFieldTally("#rem_loc3", "click", "location3 removed");
	
	BindSearchFieldTally("#loc", "change", "location1 changed");
	BindSearchFieldTally("#loc2", "change", "location2 changed");
	BindSearchFieldTally("#loc3", "change", "location3 changed");
}

/*
************ FR Location search option
*/

function displayFRLocationData(response) {

    var locationType = "";
    var listToUpdate = "";

    if (response.FRLocationData.Status != "Ok") {
        return;
    }
    
    if (response.LocationType.Status != "Ok") {
        return;
    }

    if (response.LocationType != null && response.LocationType != undefined) {
        locationType = response.LocationType.SelectedLocationType.replace("LJGEOTYPE", "");
    }

    if (locationType == "FR") {
        listToUpdate = "FRRegion";
    }
    else {
        listToUpdate = "OutsideCountries";
    }

    jQuery("#" + listToUpdate + " option:selected").removeAttr("selected");

    //no matter if we've selected a location inside or outside the country, the FRLocation is the object used to store
    // the selected values.
    if (response.FRLocationData.SelectedLocationList.length > 0) {
        jQuery("#" + listToUpdate).val(response.FRLocationData.SelectedLocationList);
    }
    else {
        jQuery("#" + listToUpdate).val("").attr('selected', 'selected');
    }
}

/*
************ FR Relocation search option
*/

function displayFRRelocationData(response) {

    if (response.RegionFRData == null || response.CountryData == null) {
        return;
    }

    if (response.RegionFRData.Status != "Ok" || response.CountryData.Status != "Ok") {
        return;
    }

    jQuery("#relocation option:selected").removeAttr("selected");

        if (response.RegionFRData.SelectedRegionList.length > 0) {
            jQuery("#relocation").val(response.RegionFRData.SelectedRegionList);
        }
        else {
            jQuery("#OtherCountries").val(response.CountryData.SelectedCountryList);
        }
    

    if (response.RegionFRData.SelectedRegionList.length == 0 && (response.CountryData.SelectedCountryList.join(", ") == "FR" || response.CountryData.SelectedCountryList.join(", ") == "")) {
        jQuery("#relocation").val("").attr('selected', 'selected');
    }

	BindSearchFieldTally("#relocation", "change", "relocation changed");
}

/*
************ relocation type search option
*/

function displayRelocationType(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery("#" + response.SelectedRelocationType).attr("checked", "checked");

    displayMultiRelocation(response.SelectedRelocationType.replace("LJRELGEOTYPE", ""));
	
	BindSearchFieldTally("#regiontypelist", "change", "regiontypelist changed");
	BindSearchFieldTally("#OtherCountries", "change", "OutsideCountries changed");
}

function displayCourseOfStudy(response) {
    if (response.Status != "Ok") {
        return;
    }
    jQuery("#courseofstudy").val(response.Course);

    if (response.FacetOpen) {
        openFacet("courseofstudyheader");
    }
    else {
        closeFacet("courseofstudyheader");
    }
    jQuery("#listitem_courseofstudy").show();
}


/*
************************************** process bulk unlock resume
*/
function processBulkUnlockResume(response) {
    if (response.Status != "OK") {
		return;
	}
    if (jQuery("#ddlbatchActionTop option[value='bulkUnlock']").length == 0) {
        jQuery("#ddlbatchActionTop").append(jQuery("<option></option>").attr("value", "bulkUnlock").text("Bulk Unlock"));
        jQuery("#ddlbatchAction").append(jQuery("<option></option>").attr("value", "bulkUnlock").text("Bulk Unlock"));
	}
}


/*
************************************** filter facets
*/

function displayFilterFacets(response) {
    g_facet = '';
    g_filterTab = false;

    if (response.Status != "Ok") {
        jQuery("#filterfacetstab").hide();
        jQuery("#moresearch").attr("class", "ui-tabs-panel ui-widget-content ui-corner-bottom");
        jQuery("#tags").attr("class", "ui-tabs-panel ui-widget-content ui-corner-bottom");

        return;
    }

    if (ScriptVariables.Get('UpdateTagsRDBResults') != "true") {
        jQuery("#filterfacetstab").show();
    }
    else {
        jQuery("#filterHeader").show();   
    }

    jQuery("#filterfacets").setTemplate(jQuery("#jTemplateHolder_FilterFacets").html());

    if (response.SelectionType == "Single") {
        g_filterSelectionType = 'radio';
    }

    jQuery("#filterfacets").processTemplate({ "filterfacets": response.DataList });

    jQuery("#searchoptionscontainer").css("display", "block");
    jQuery("#quicksearchborder").show();
    jQuery("#facetcontainer").css("display", "block");

    if (ScriptVariables.Get('UpdateTagsRDBResults') != "true") {
        jQuery("#filterfacetstab").css("display", "block");
    }

    jQuery("#frmFilterFacets").css("display", "block");
    g_filterTab = true;
}

function getFilterFacetJson(filter) {
    var filterName = filter.name;
    var filterValue = jQuery(filter).val();
    var filterFormString = jQuery.param(jQuery('#frmFilterFacets').serializeArray());
    var filterFormObject = jQuery.deparam(filterFormString);
    var json = "";

    if (filterValue == filterName) {
        json = '{\"' + filterName + '\":' + '\"' + filterValue + '\"}';
    }
    else {
        if (g_filterSelectionType == 'radio') {
            var array = eval('filterFormObject.' + filterName).split(':');

            var key = ''
            var value = '';

            if (array[0].length > 0) {
                key = array[0];
            }

            if (array[1].length > 0) {
                value = encodeURIComponent(array[1]);
            }

            json = '{\"' + filterName + '\":' + '\"' + key + ':' + value + '\"}';
            //Temporary code for RDB monitoring -- will be deleted on 2/15/2013
            $.cb.Tally(location.hostname + 'ResumeResults', 'userclick', 'SearchBy' + filterName);
        }
        else {
            json = '{\"' + filterName + '\":' + '\"' + eval('filterFormObject.' + filterName) + '\"}';
        }
    }

    CB.Tally(g_sliceCode + 'ResumeResults', g_filterSelectionType, filterName);
	
    return json;
}

function allFilterOptionDeselected(filter) {
    if (filter.name == jQuery(filter).val() && !jQuery(filter).is(":checked")) {
        return true;
    }

    return false;
}

function getFilterSelectionType() {
    return g_filterSelectionType;
}

function hideFiltersList(response) {
    if (response.Status = "Ok") {
        jQuery.each(response.DataList, function (i, item) {
            if (item == "false") {
                filters_hidden += ";" + i;
            }
        });
    }
}

function reorderFacetOrder(response) {
    if (response.Status = "Ok") {
        jQuery.each(response.DataList, function (i, item) {
            var arr = i.split(";");

            jQuery.each(arr, function (index, val) {
                var e = document.getElementById("listitem_" + val);

                if (item == "true") {	//upper facets
                    jQuery("#upperfacets").append(e);
                }
                else {
                    jQuery(e).insertBefore("#bottombtnaction");
                }
            });
        });
    }
}




/*
************************************** more search options
*/

/*
************ company name search option
*/

function displayCompany(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery("#company").val(response.CompanyName);

    jQuery('#companyuse').empty();

    if (g_useListLUCache != null && g_useListLUCache != '') {
        jQuery.each(g_useListLUCache, function (i, item) {
            jQuery('#companyuse').append(jQuery('<option></option>').val(item.Key).html(item.Value));
        });
    }

    if (response.RecentCompanyOnly) {
        jQuery("#recentcompany").attr("checked", "checked");
    }
    else {
        jQuery("#recentcompany").removeAttr("checked");
    }

    jQuery("#companyuse").val(response.CompanyUse);

    if (response.FacetOpen) {
        openFacet("companyheader");
    }
    else {
        closeFacet("companyheader");
    }

    jQuery("#listitem_company").show();
	
	BindSearchFieldTally("#company", "change", "company changed");
}

/*
************ job title search option
*/

function displayJobTitle(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery("#jobtitle").val(response.JobTitle);

    jQuery('#jobtitleuse').empty();

    if (g_useListLUCache != null && g_useListLUCache != '') {
        jQuery.each(g_useListLUCache, function (i, item) {
            jQuery('#jobtitleuse').append(jQuery('<option></option>').val(item.Key).html(item.Value));
        });
    }

    if (response.RecentJobTitleOnly) {
        jQuery("#jobtitlerecent").attr("checked", "checked");
    }
    else {
        jQuery("#jobtitlerecent").removeAttr("checked");
    }

    jQuery("#jobtitleuse").val(response.JobTitleUse);

    if (response.FacetOpen) {
        openFacet("jobtitleheader");
    }
    else {
        closeFacet("jobtitleheader");
    }

    jQuery("#listitem_jobtitle").show();
	
	BindSearchFieldTally("#jobtitle", "change", "jobtitle changed");
	BindSearchFieldTally("#jobtitlerecent", "change", "only search most recent jobtitle toggle");
}

/*
************ education search option
*/

function displayEducation(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery("#school").val(response.SchoolName);
    jQuery("#education").val(response.Education);
    jQuery("#maxeducation").val(response.MaxEducation);

    if (response.FacetOpen) {
        openFacet("educationheader");
    }
    else {
        closeFacet("educationheader");
    }

    jQuery("#listitem_education").show();
	
	BindSearchFieldTally("#school", "change", "school changed");
	BindSearchFieldTally("#education", "change", "lower degree changed");
	BindSearchFieldTally("#maxeducation", "change", "upper degree changed");
}

/*
************ experience search option
*/

function displayExperience(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery("#experiencelow").val(response.ExperienceLow);
    jQuery("#experiencehigh").val(response.ExperienceHigh);
    jQuery("#travelrequirement").val(response.TravelRequirement);

    jQuery("#CE" + response.Employed).siblings().removeAttr("checked");
    jQuery("#CE" + response.Employed).attr("checked", "checked");

    jQuery("#MGE" + response.ManagedOthers).siblings().removeAttr("checked");
    jQuery("#MGE" + response.ManagedOthers).attr("checked", "checked");

    jQuery("#managedcount").val(response.ManagedCount);

    if (response.FacetOpen) {
        openFacet("experienceheader");
    }
    else {
        closeFacet("experienceheader");
    }

    jQuery("#listitem_experience").show();
	
	BindSearchFieldTally("#experiencelow", "change", "lower experience changed");
	BindSearchFieldTally("#experiencehigh", "change", "upper experience changed");
	BindSearchFieldTally("#travelrequirement", "change", "travel requirement changed");
	BindSearchFieldTally("#managedcount", "change", "managed count changed");
	
	BindSearchFieldTally("#facets_cem", "change", "currently employed changed");
	BindSearchFieldTally("#facets_mge", "change", "management experience changed");
}


/*
************ experience min search option
*/

function displayExperienceMin(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery('#listitem_experience').css({ display: 'block' });
    jQuery('#facets_tra').css({ display: 'none' });
    jQuery('#facets_cem').css({ display: 'none' });

    if (g_init == true) {
        jQuery("#ExperienceLow").watermark("Min", { className: 'inputWatermark', useNative: false });
        jQuery("#ExperienceHigh").watermark("Max", { className: 'inputWatermark', useNative: false });
    }

    jQuery("#experiencelow").val(response.ExperienceLow);
    jQuery("#experiencehigh").val(response.ExperienceHigh);


    jQuery("#MGE" + response.ManagedOthers).siblings().removeAttr("checked");
    jQuery("#MGE" + response.ManagedOthers).attr("checked", "checked");

    jQuery("#managedcount").val(response.ManagedCount);

    BindSearchFieldTally("#experiencelow", "change", "lower experience changed");
    BindSearchFieldTally("#experiencehigh", "change", "upper experience changed");
    BindSearchFieldTally("#managedcount", "change", "managed count changed");
    BindSearchFieldTally("#facets_mge", "change", "management experience changed");
}




function displayResumePermission(response) {
    if (response.Status != "Ok") {
        return;
    }

    if (response.FacetOpen) {
        openFacet("resumepermissionheader");
    }
    else {
        closeFacet("resumepermissionheader");
    }

	var item = response.SelectedResumePermission;
	if (item.toLowerCase().indexOf("ask") != -1 && item.toLowerCase().indexOf("yes") != -1)
		jQuery("#resumepermission_any").trigger("click");
	else if (item.toLowerCase().indexOf("yes") != -1)
		jQuery("#resumepermission_yes").trigger("click");
	else if (item.toLowerCase().indexOf("ask") != -1)
		jQuery("#resumepermission_ask").trigger("click");
	
	if (item != "")
		jQuery("#listitem_resumepermission a").trigger("click");
	
    jQuery("#resumepermission_any").val(getPrefixbySliceCode() + "yes " + getPrefixbySliceCode() + "ask");
    jQuery("#resumepermission_yes").val(getPrefixbySliceCode() + "yes ");
    jQuery("#resumepermission_ask").val(getPrefixbySliceCode() + "ask ");

    jQuery("#listitem_resumepermission").show();
    jQuery(".askmefirstIcons").show();
    BindSearchFieldTally("#facets_rp", "change", "Resume Permission type changed"); 	//tallies per checkbox ticked
}

function getPrefixbySliceCode() {
    var prefix = "";
    switch (jQuery("#_FastFlip_hdnrdbslice").attr("value")) {
        case "SGFP":
            prefix = "fa";
            break;
        case "SGDE":
            prefix = "emp";
            break;
        case "SGEA":
            prefix = "ea";
    }
    return prefix;
}

/*
************ language search option
*/

function displayLanguage(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery('#language').empty();

    if (g_languageLUCache != null && g_languageLUCache != '') {
        jQuery.each(g_languageLUCache, function (i, item) {
            jQuery('#language').append(jQuery('<option></option>').val(item.Key).html(item.Value));
        });

        for (i = 2; i <= 3; i++) {
            jQuery.each(g_languageLUCache, function (j, item) {
                jQuery('#language' + i).append(jQuery('<option></option>').val(item.Key).html(item.Value));
            });
        }
    }

    jQuery("#language").val("");
    for (i = 2; i <= 3; i++) {
        jQuery("#language" + i).val("");
        jQuery("#language" + i + "set").hide();
    }

    g_langid = 1;

    jQuery.each(response.SelectedLanguageList, function (i, item) {
        if (i == 0) {
            jQuery("#language").val(item);
        }
        else {
            g_langid += 1;
            jQuery("#language" + g_langid).val(item);
            jQuery("#language" + g_langid + "set").show();
        }
    });

    if (g_langid == 3) {
        jQuery("#addlanguage").hide();
    }
    else {
        jQuery("#addlanguage").show();
    }

    if (response.FacetOpen) {
        openFacet("languageheader");
    }
    else {
        closeFacet("languageheader");
    }

    jQuery("#listitem_language").show();
	
	BindSearchFieldTally("#language", "change", "jobcategory changed");
	BindSearchFieldTally("#language2set", "change", "jobcategory2 changed");
	BindSearchFieldTally("#language3set", "change", "jobcategory3 changed");
	
	BindSearchFieldTally("#addlanguage", "click", "language added");
	BindSearchFieldTally("img[class='removelanguage']", "click", "language removed");
}

/*
************ education major search option
*/

function displayEducationMajor(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery('#facets_educationmajor').css({ display: 'block' });

    if (g_init == true) {
        jQuery("#educationmajor").watermark(ScriptVariables.Get("educationMajorWatermark"), { className: 'inputWatermark', useNative: false });
        jQuery("input.educationmajor").each(autocompleteMajorName);
    }

    jQuery('#educationmajor').empty();

    jQuery("#educationmajor").val(response.MajorName);

    if (response.MajorName != '') {
        openFacet("educationheader");
    }
	
	BindSearchFieldTally("#educationmajor", "change", "major changed");
}

function displaySFCountries(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery("#ddlSFCountries").val(response.SelectedCountry);
   
	BindSearchFieldTally("#ddlSFCountries", "change", "SFCountries dropdown changed");
}

/*
************ driver license search option
*/
function displayDriverLicense(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery('#listitem_driverlicense').css({ display: 'block' });

    jQuery("#facets_drlic").children().removeAttr("checked");

    jQuery.each(response.SelectedDriversLicenseList, function (i, item) {
        jQuery("#" + item).attr("checked", "checked");
    });

    if (response.SelectedDriversLicenseList != '') {
        openFacet("driverlicenseheader");
    }
    else {
        closeFacet("driverlicenseheader");
    }
	
	BindSearchFieldTally("#facets_drlic", "change", "drivers license type changed");		//tallies per checkbox ticked
}

/*
************ language proficiency search option
*/

function displayLanguageProficiency(response1, response2) {
    if (response1.Status != "Ok" || response2.Status != "Ok") {
        return;
    }
    jQuery('#listitem_languageprof').css({ display: 'block' });
    var open = false;
    if (response1.SelectedLanguage1 != "" || response1.SelectedLanguageProficiency1 != "" || response2.SelectedLanguage2 != "" || response2.SelectedLanguageProficiency2 != "") {
        open = true;
    }
    jQuery("#ddllanguage1").val(response1.SelectedLanguage1);
    jQuery("#ddlprof1").val(response1.SelectedLanguageProficiency1);
    jQuery("#ddllanguage2").val(response2.SelectedLanguage2);
    jQuery("#ddlprof2").val(response2.SelectedLanguageProficiency2);

    if (open) {
        openFacet("languageprofheader");
    }
    else {
        closeFacet("languageprofheader");
    }
}

/*
************ current search text display
*/

function displayCurrentSearchText(response) {
    if (response.Status != "Ok") {
        return;
    }

    if (response.CurrentSearchText != '') {
        jQuery("#lblcurrentsearch").html(response.CurrentSearchText);
        jQuery("#currentsearch").show();
    }
}

/*
************************************** resume result list
*/

function displayResumeResultList(response) {
    if (response.Status != 'Ok') {
        return;
    }

    if (response.Items == null) {
        return;
    }

    jQuery("#searchresults").setTemplate(jQuery("#jTemplateHolder_Results").html());
    jQuery("#searchresults").processTemplate({ "resumes": response.Items });

    jQuery("#searchresults").show();

    displayShowSimilar();

    jQuery("#searchresults .date").attr("title", ScriptVariables.Get('lastActivityToolTip'));

    displayPagination();
    displayGoToPage();
    displaySortBy();
    displayViewOptions();

    if (ScriptVariables.Get('UpdateTagsRDBResults') == 'true') {
        $(".myTags").show();
        $(".coworkerTags").show();       
        $(".AddTagPopup").show();

        //Add tag popup
        $(".AddTagPopup").dialog({
            autoOpen: false,
            height: 210,
            width: 240,
            modal: true,
            buttons: {
                "Save Tag": function () {

                    addNewResumeTag();
                    $(this).dialog("close");

                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            },
            close: function () {
                //allFields.val("").removeClass("ui-state-error");
            }
        });


        //Add tag popup
        $("#BulkAddTagPopup").dialog({
            autoOpen: false,
            height: 210,
            width: 240,
            modal: true,
            buttons: {
                "Save Tag": function () {

                    bulkAddNewResumeTag();
                    $(this).dialog("close");

                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            },
            close: function () {
                //allFields.val("").removeClass("ui-state-error");
            }
        });
    }

    jQuery(".checkAllBatchAction").show();
    jQuery("#controlsearchwrapper").show();
    jQuery("#rrLegendWrapper").show();
}

function displayResumeResultListOld(items) {
    jQuery("#searchresults").setTemplate(jQuery("#jTemplateHolder_Results").html());
    jQuery("#searchresults").processTemplate({ "resumes": items });

    displayShowSimilar();

    jQuery("#searchresults .date").attr("title", ScriptVariables.Get('lastActivityToolTip'));
}

function scrollToTopAfterFilter() {
    jQuery(window).scrollTop(0);
}

/*
********************* resume result list controls
*/

function displayGoToPage() {
    jQuery("select[id=ddlGoToPage] > option").remove();

    for (i = 1; i <= g_numberOfPages; i++) {
        jQuery('#ddlGoToPage').append(jQuery('<option></option>').val(i).html(i));
    }

    if (g_curSetPage != '')
        jQuery('.ddlGoToPage').val(g_curSetPage);
    else
        jQuery('.ddlGoToPage option:eq(0)').attr('selected', 'selected');

    jQuery("#gotopage").show();
}

/*
************ pagination control
*/

function displayPagination() {
    initPagination();
    jQuery("#Pagination, #Pagination2").show();
}

function initPagination() {

    //This is to prevent multiple instances of the pagination plugin
    jQuery("#Pagination").replaceWith('<div id=Pagination></div>');
    jQuery("#Pagination2").replaceWith('<div id=Pagination2></div>');

    jQuery("#Pagination, #Pagination2").pagination(g_numberOfPages, {
        num_edge_entries: 1,
        num_display_entries: 5,
        callback: pageselectCallback,
        items_per_page: 1,
        prev_text: "<",
        next_text: ">",
        current_page: g_curSetPage - 1
    });
}

/**
* Gets called every time the user clicks on a pagination link.
*
* @param {int}page_index New Page index
* @param {jQuery} jq the container with the pagination links as a jQuery object
*/
function pageselectCallback(page_index, jq, extraParam) {
    if (typeof extraParam == "undefined") {
        extraParam = 0;
    }
    jQuery(window).scrollTop(0);
    setPage(page_index, extraParam);

    //tallying
    //alert('heyyy');
    SCLinkTracking('inpagegroup:' + 'pagination');
    SCLinkTracking('pagination:' + (page_index + 1));

    return false;
}

function setPage(index, extraParam) {
    g_curSetPage = index + 1;
    g_reload = 'true';
    jQuery(window).trigger('hashchange');
}

/*
************ view option control
*/


var SCLinkTracking = function (name, delayForNextRequest) {
    s = s_gi(s_account);

    if (delayForNextRequest) {
        s.tl(this, 'o', name);
    }
    else {
        s.tl(true, 'o', name);
    }
}

function ViewAll() {
    jQuery("#_ResResultList_cbhlViewAll img").addClass('viewoptionhighlight');
    jQuery("#_ResResultList_cbhlViewTitle img").removeClass('viewoptionhighlight');
    jQuery("#_ResResultList_cbhlViewAll img").removeClass('viewoptionhover');
    jQuery("#searchresults .extraData").show();
    g_viewOption = 'Details';
}

function ViewTitle() {
    jQuery("#_ResResultList_cbhlViewTitle img").addClass('viewoptionhighlight');
    jQuery("#_ResResultList_cbhlViewAll img").removeClass('viewoptionhighlight');
    jQuery("#_ResResultList_cbhlViewTitle img").removeClass('viewoptionhover');
    jQuery("#searchresults .extraData").hide();
    g_viewOption = 'Title';
}

function displayViewOptions() {
    if (g_viewOption == 'Details') {
        ViewAll();
    }

    if (g_viewOption == 'Title') {
        ViewTitle();
    }
}

/*
************ sort by control
*/

function displaySortBy() {
    if (g_init != true) {
        return;
    }

    jQuery('#ddlSortBy').val(g_curSortBy);
    jQuery("#ddlSortBy").show();
}

/*
************ batch actions
*/

function displaySaveToTagBatchAction(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery('#ddlbatchActionTop').append(jQuery('<option></option>').val("saveToTag").html(response.Text));
    jQuery('#ddlbatchAction').append(jQuery('<option></option>').val("saveToTag").html(response.Text));
}

function CheckAll() {
    jQuery("#searchresults input[type='checkbox']").map(function () {
        jQuery(this).attr("checked", "checked");
        if (ScriptVariables.Get('AddCheckedPropSelecTasks') == 'true') {
            jQuery(this).prop("checked", true);
        }
		//bulk unlock not check the resumes in shadow
        if (jQuery(this).parent("li").find("#shadowPending").length != 0 || jQuery(this).parent("li").find("#shadowRejected").length != 0) {
			jQuery(this).removeAttr("checked");
		}
    }).get();
}

function UnCheckAll() {
    jQuery("#searchresults input[type='checkbox']").map(function () {
        jQuery(this).removeAttr("checked");
        if (ScriptVariables.Get('AddCheckedPropSelecTasks') == 'true') {
            jQuery(this).prop("checked", false);
        }
    }).get();
}

/*
************************************** relocation tabs
*/

function displayRelocationTab(response) {
    if (response.Status != "Ok") {
        return;
    }

	var resTabs = jQuery("#resTabs");

	if (!resTabs.data('tabs')) resTabs.tabs();

	resTabs.removeClass();
	resTabs.removeAttr("class");
	resTabs.empty();
	resTabs.hide();

	resTabs.setTemplate(jQuery("#jTemplateHolder_RelocationTab").html());
	resTabs.processTemplate({ "tabs": response.Items });

	resTabs.tabs("destroy");
	resTabs.tabs({
		selected: response.SelectedIndex
	});

	addBreak();
	jQuery("#resTabs_wrapper").show();

	resTabs.show();
}

function addBreak() {
    jQuery('#resTabs .relocTab').each(function () {
        var words, str;

        words = jQuery(this).text().split(':');
        str = words[0] + ":" + "<br/>" + "<center>" + words[1] + "</center>";

        jQuery(this).html(str);
    });
}

/*
************************************** coworker resume tags
*/
function getCoworkerTagList(link) {
    var resumeDID = jQuery(link).attr('id');

    if (resumeDID == "") {
        return;
    }

    var dataparams = "drl=resumecoworkertaglist" + "&rrl=" + resumeDID;

    jQuery.ajax({
        type: "POST",
        url: "../Resumes/AJAX/" + "GetResumeCoworkerTagList.aspx",
        data: dataparams,
        timeout: 40000,
        dataType: 'json',
        success: function (msg) {
            var response = msg;

            if (response == null) {
                jQuery("#topsearchwrapper").text("An ajax error occurred.  If the problem persists, please contact Customer Service.");

                hideLoadingSpinner();
                return;
            }

            if (response.ResumeCoworkerTagList == null) {
                return;
            }

            displayCoworkerTagList(response.ResumeCoworkerTagList, resumeDID);
        }
    });
}

function displayCoworkerTagList(response, resumeDID) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery("#coworkerTagPopup").setTemplate(jQuery("#coworkerTagTemplateHolder").html());
    jQuery("#coworkerTagPopup").processTemplate({ "Item": response.TagList });

    if (!coworkerTagPopup) {
        var div = document.getElementById('coworkerTagPopup');
        coworkerTagPopup = CB.object(CB.AJAX.Popup);
        coworkerTagPopup.initialize(div);
        coworkerTagPopup.halign = 'flush';
    }

    coworkerTagPopup.show(document.getElementById(resumeDID), null, 5, -22);
}

function closecoworkerTagPopup() {
    if (coworkerTagPopup) {
        coworkerTagPopup.hide();
    }
}


/*
************************************** coworker resume tags from new tables
*/
function getCoworkerTags(link) {
    var resumeDID = jQuery(link).attr('id');

    if (resumeDID == "") {
        return;
    }

    var dataparams = "drl=resumecoworkertaglist" + "&rrl=" + resumeDID;

    jQuery.ajax({
        type: "POST",
        url: "../Resumes/AJAX/" + "GetResumeCoworkerTagList.aspx",
        data: dataparams,
        timeout: 40000,
        dataType: 'json',
        success: function (msg) {
            var response = msg;

            if (response == null) {
                jQuery("#topsearchwrapper").text("An ajax error occurred.  If the problem persists, please contact Customer Service.");

                hideLoadingSpinner();
                return;
            }

            if (response.ResumeCoworkerTagList == null) {
                return;
            }

            displayCoworkerTags(response.ResumeCoworkerTagList, resumeDID);
        }
    });
}

function displayCoworkerTags(response, resumeDID) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery("#coworkerTagsDropdown").setTemplate(jQuery("#coworkerTagDropdownTemplateHolder").html());
    jQuery("#coworkerTagsDropdown").processTemplate({ "Item": response.TagList });

    if (!coworkerTagPopup) {
        var div = document.getElementById('coworkerTagsDropdown');
        coworkerTagPopup = CB.object(CB.AJAX.Popup);
        coworkerTagPopup.initialize(div);
        coworkerTagPopup.halign = 'flush';
    }

    //if (jQuery("#coworkertagdropdown").is(':visible')) {
       // jQuery("#coworkertagdropdown").hide();
   // }
   // else {
      // alert("not hidden");
        coworkerTagPopup.show(document.getElementById(resumeDID), null, 0, -13);
  // }
}

function closecoworkerTagPopup() {
    if (coworkerTagPopup) {
        coworkerTagPopup.hide();
    }
}

/*
************************************** coworker resume actions
*/

function getCoworkerActionList(link, resumeDID) {
    var dataparams = "drl=coworkeractionlist" + "&rrl=" + resumeDID;

    jQuery.ajax({
        type: "POST",
        url: "../Resumes/AJAX/" + "GetCoWorkerActionList.aspx",
        data: dataparams,
        timeout: 40000,
        dataType: 'json',
        success: function (msg) {
            var response = msg;

            if (response == null) {
                jQuery("#topsearchwrapper").text("An ajax error occurred.  If the problem persists, please contact Customer Service.  Code: 1");

                hideLoadingSpinner();
                return;
            }
            else {
                if (response.CoworkerActionList != null && response.CoworkerActionList.Status == "Ok") {
                    jQuery("#coworkerActionPopup").setTemplate(jQuery("#coWorkerActionTemplateHolder").html());
                    jQuery("#coworkerActionPopup").processTemplate({ "Item": response.CoworkerActionList.DataList });
                    DisplayCoworkerActionList(resumeDID);
                }
            }
        }
    });
}

function showCoworkerAction(link) {
    var id = jQuery(link).attr('id');
    if (id != "") {
        getCoworkerActionList(link, id);
    }
}

function DisplayCoworkerActionList(link) {
    if (!coworkerActionPopup) {
        var div = document.getElementById('coworkerActionPopup');
        coworkerActionPopup = CB.object(CB.AJAX.Popup);
        coworkerActionPopup.initialize(div);
        coworkerActionPopup.halign = 'flush';
    }
    coworkerActionPopup.show(document.getElementById(link), null, 5, -22);
}

function closecoworkerActionPopup() {
    if (coworkerActionPopup) coworkerActionPopup.hide();
}

/*
************************************** save to folder
*/

function saveBatchToFolder(actionElement) {
    if (jQuery("#searchresults input[type='checkbox']:checked").size() == 0)
        return;

    var link1 = ScriptVariables.Get("urlroot") + "JobPoster/Jobs/AppDetails.aspx?view=all";
    var title = ScriptVariables.Get("sbSaveToBatch");
    var title2 = title.replace("'", "\'");
    var anchor = jQuery(actionElement).attr("id") + "Anchor";

    var resumeDIDs = "";
    jQuery("#searchresults input[type='checkbox']:checked").each(function () {
        resumeDIDs += jQuery(this).attr("name").split("_")[0] + "*";
    });


    if (resumeDIDs != "") {
        showResumeFolderDialog(resumeDIDs, title, '', '', ScriptVariables.Get('NWDataStoreLabel_DID'), g_auditID, anchor, 30, -120, '', '', function () { CB.CandidateDetails.RedirectToAppDetails(g_folderdlg_SaveResponseArray, link1) }, null, null);
    }
}

function setupSaveToFolderLink(id, title) {
    link = ScriptVariables.Get("urlroot") + "JobPoster/Jobs/AppDetails.aspx?view=all";
    var ids = id.split("_");
    if (ids.length == 2) {
        var title2 = title.replace("'", "\'");


        showResumeFolderDialog(ids[0], title2, '', '', ScriptVariables.Get('NWDataStoreLabel_DID'), g_auditID, id, 5, -27, '', '', function () { CB.CandidateDetails.RedirectToAppDetails(g_folderdlg_SaveResponseArray, link) }, null, null);

    }
}

function folderdlg_addingNewFolder() {
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

function folderdlg_saveToFolder() {
    if (g_folderdlg_curSelFolderDid != "") {
        folderdlg_showLoading(ScriptVariables.Get('sbSavingResume'));
        if (ScriptVariables.Get("bBatchSave")) {

            if ((g_folderdlg_curSelResumeDID.lastIndexOf("*") > -1) && (g_folderdlg_curSelResumeDID.lastIndexOf("*") == (g_folderdlg_curSelResumeDID.length - 1)))
            { g_folderdlg_curSelResumeDID = g_folderdlg_curSelResumeDID.substring(0, (g_folderdlg_curSelResumeDID.length - 1)); }
            var array = g_folderdlg_curSelResumeDID.split("*");
            for (var i = 0; i < array.length; i++) {
                var title = ScriptVariables.Get("sbSaveToBatch");

                //alert(array[i]);
                folderdlg_saveResToFolderWithAjax(array[i], g_folderdlg_curSelFolderDid, g_folderdlg_curSavedAppDid, g_folderdlg_curSavedAppDate, g_folderdlg_curTrackingDID, g_folderdlg_curAuditDID);
                if (i !== (array.length - 1))
                    showResumeFolderDialog(array[i], title, '', '', ScriptVariables.Get('NWDataStoreLabel_DID'), g_auditID, 'ddlbatchActionTopAnchor', 30, -120, '', '', function () {

                        CB.CandidateDetails.RedirectToAppDetails(g_folderdlg_SaveResponseArray, link1)
                    }, null, null);
            }
        }
    else 
    {folderdlg_saveResToFolderWithAjax(g_folderdlg_curSelResumeDID, g_folderdlg_curSelFolderDid, g_folderdlg_curSavedAppDid, g_folderdlg_curSavedAppDate, g_folderdlg_curTrackingDID, g_folderdlg_curAuditDID);
    }
    }
    else {
        alert(ScriptVariables.Get('sbSelectFolder'));
    }
}

/*
************************************** tags
*/

function getTagFacetSelection(tagOption) {
    var tagFormString = jQuery.param(jQuery('#frmTagFacets').serializeArray());
    var tagFormObject = jQuery.deparam(tagFormString);

    var tagFacetSelection = eval('tagFormObject.' + tagOption.name);
    if (tagFacetSelection == undefined) {
        tagFacetSelection = "";
    }

    return tagFacetSelection;
}

function displayTagFacet(response) {
    jQuery("#frmTagFacets input").prop("disabled", false);

    if (response.Status != "Ok") {
        return;
    }

    if (response.UserTagList != null) {
        displayUserTagFacetSection(response.UserTagList);
    }

    if (response.CoworkerTagList != null) {
        displayCoworkerTagFacetSection(response.CoworkerTagList);
    }

    if (response.TagSelectionList != null) {
        displayTagSelections(response.TagSelectionList);
    }
}

function setUserTagList(response) {
    g_userTags = [];
    var tags;
    if (response.UserTagList != undefined && response.UserTagList.Items != undefined) {
        tags = response.UserTagList.Items;
        for (var i = 0; i < tags.length; i++) {
            g_userTags.push(tags[i].TagName);
        }
    }
}

function displayTagSelections(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery.each(response.SelectedTagList, function (index, value) {
        jQuery("#tag" + value.toLowerCase()).attr("checked", "checked");
    });
}

function displayUserTagFacetSection(response) {
    if (response.Status != "Ok") {
        return;
    }

    if (response.Items == null) {
        return;
    }

    jQuery("#usertagfacetsection").show();
    jQuery("#usertagfacetsection").setTemplate(jQuery("#jTemplateHolder_UserTagFacetSection").html());
    jQuery("#usertagfacetsection").processTemplate({ tagfacetsection: response.Items });

    g_userTags = [];
    var tags;
    if (response.Items != undefined && response.Items != undefined) {
        tags = response.Items;
        for (var i = 0; i < tags.length; i++) {
            g_userTags.push(tags[i].TagName);
        }
    }

    jQuery("#searchresults .resumetaginput").autocomplete({
        source: g_userTags,
        appendTo: "#searchresults",
        minLength: 0
    });

    jQuery("#searchoptionscontainer").css("display", "block");
    jQuery("#facetcontainer").css("display", "block");
    jQuery("#tagfacettab").css("display", "none");
    jQuery("#frmTagFacets").css("display", "none");

    if (g_searchTab == false) {
        jQuery("#tagfacettab").attr("class", "ui-state-default ui-corner-top ui-tabs-selected ui-state-active");
        jQuery("#tags").attr("class", "ui-tabs-panel ui-widget-content ui-corner-bottom");
    }
}

function displayCoworkerTagFacetSection(response) {
    if (response.Status != "Ok") {
        return;
    }

    if (response.CoworkerTagList == null) {
        return;
    }

    jQuery("#coworkertagfacetsection").show();
    jQuery("#coworkertagfacetsection").setTemplate(jQuery("#jTemplateHolder_CoworkerTagFacetSection").html());
    jQuery("#coworkertagfacetsection").processTemplate({ tagfacetsection: response.CoworkerTagList });

    jQuery("#searchoptionscontainer").css("display", "block");
    jQuery("#quicksearchborder").show();
    jQuery("#facetcontainer").css("display", "block");
    jQuery("#tagfacettab").css("display", "block");
    jQuery("#frmTagFacets").css("display", "block");
}

function displayResumeResultTags() {
    jQuery("#searchresults .resumeresulttag").show();

    displayAddLabel();
}

function displayAddLabel() {
    jQuery("#searchresults .tagsingleresume").show();
}


function addNewResumeTag(selection) {

    var resumeDID = jQuery(".AddTagPopup:visible").attr("id");
    var tagName = jQuery("#" + resumeDID + " .AddTagPopupText input").val();

    var selector = "tagType_" + resumeDID;
    var tagType = jQuery("[name='" + selector + "']:checked").val();

    var ownerDID = "";
    var tagExists = false;

    if (tagName == undefined || tagName == "") {
        return;
    }

    var semanticID = '';
    var QID = '';

    if (typeof g_semanticID != 'undefined' && g_semanticID != null)
        semanticID = 1;
    if (typeof g_QID != 'undefined' && g_QID != null)
        QID += g_QID;

    var encodedTagName = encodeURIComponent(tagName);
    var drlPart = "drl=tagactionadd;tagmanagementadd";
    var dataparams = drlPart + "&rrl=" + resumeDID + "&tagType=" + tagType + "&tag=" + encodedTagName;

    if (semanticID == 1)
        dataparams += '&semanticID=' + g_semanticID;
    if (QID != '')
        dataparams += '&QID=' + QID;

    var resumeLocInList = getRelativeResumePosition(resumeDID);
    if (getFromStrcrit('RPP=') !== "")
        dataparams += '&absoluteresumeloc=' + (resumeLocInList + 1 + ((g_curSetPage - 1) * getFromStrcrit('RPP=')));
    dataparams += '&relativeresumeloc=' + 'pg:' + g_curSetPage + "|loc:" + (resumeLocInList + 1);

    showLoadingSpinner();

    jQuery.ajax({
        type: "POST",
        url: "../Resumes/AJAX/" + "TagAction.aspx",
        data: dataparams,
        timeout: 40000,
        dataType: 'json',
        success: function (response) {

            jQuery("#loadingSpinner").hide();

            if (response == null) {
                return;
            }

            if (response.Status == 'No Locked License') {
                location.href = 'LockRDBLicense.aspx';
                return;
            }

            if (response.TagActionAdd == undefined) {
                return;
            }

            if (response.TagManagementAdd.Status != "Ok") {
                jQuery("#AddTagErrorPopup .AddTagErrorPopupText").text(response.TagManagementAdd.Status);
                jQuery("#AddTagErrorPopup").show();
                jQuery("#AddTagErrorPopup").dialog({
                    autoOpen: true,
                    height: 210,
                    width: 240,
                    modal: true
                });

                return;
            }


            if (response.TagManagementAdd.OwnerDID != "") {
                ownerDID = response.TagManagementAdd.OwnerDID;
            }


            var newTag = newTagTagify(tagName, tagType, ownerDID);
            jQuery("#" + resumeDID + "_resumetaglist").append(newTag);

            //Clear out popup input after tag has been added
            jQuery("#" + resumeDID + " .AddTagPopupText input").val("");

            jQuery("[name='" + selector + "']").removeAttr("checked");
            jQuery("[name='" + selector + "']:eq(0)").prop("checked", true);


            //Hide add tag link if there are 5 tags
            if (jQuery("#" + resumeDID + "_resumetaglist").children('.tagName').length >= 5) {
                jQuery("#" + resumeDID + "_resumetaglist").siblings('.addTagLabel').hide();
            }
        },
        error: function (xhr, status, error) {
            hideLoadingSpinner();
            if (xhr.status === 403) {
                sessionTimeout();
            }
        }
    });
}


function bulkAddNewResumeTag(selection) {

    var resumeDID = "";
    var resumeDIDList = "";
    var existingTags = "";
    var tagName = jQuery("#BulkAddTagPopup .BulkAddTagPopupText input").val();
    var tagType = jQuery("#BulkAddTagPopup .BulkTagType input:checked").val();
    var createTagType = "";
    var tagExists = false;
    var existingTagsLength = "";
    var ownerDID = "";


    if (tagType === "public") {
        createTagType = "publicTag"
    }
    else if (tagType === "private") {
        createTagType = "privateTag"
    }

    if (tagName == undefined || tagName == "") {
        return;
    }
	
    //Loop through all checked resume DIDs to ensure they are valid
    jQuery("#searchresults input[type='checkbox']:checked").each(function () {

        resumeDID = jQuery(this).attr("name").split("_")[0];
        tagExists = false
        existingTags = jQuery("#" + resumeDID + "_resumetaglist").children('.tagName');
        existingTagsLength = jQuery("#" + resumeDID + "_resumetaglist").children('.tagName').length;

        if (existingTagsLength === 5) {
            return;
        }

        existingTags.each(function () {
            var existingTag = $(this).attr("title");

            if (existingTag === tagName) {
                tagExists = true;
            }
        });

        if (tagExists === false) {
            resumeDIDList += resumeDID + ";";
        }
    });

   
    var encodedTagName = encodeURIComponent(tagName);
    var drlPart = "drl=tagactionadd;tagmanagementadd";
    var dataparams = drlPart + "&rrl=" + resumeDIDList + "&tagType=" + tagType + "&tag=" + encodedTagName;

    showLoadingSpinner();

    jQuery.ajax({
        type: "POST",
        url: "../Resumes/AJAX/" + "TagAction.aspx",
        data: dataparams,
        timeout: 40000,
        dataType: 'json',
        success: function (response) {

           jQuery("#loadingSpinner").hide();

            if (response == null) {
                return;
            }

            if (response.Status == 'No Locked License') {
                location.href = 'LockRDBLicense.aspx';
                return;
            }

            if (response.TagActionAdd == undefined) {
                return;
            }

            if (response.TagManagementAdd.Status != "Ok") {
                jQuery("#BulkAddTagErrorPopup .BulkAddTagErrorPopupText").text(response.TagManagementAdd.Status);
                jQuery("#BulkAddTagErrorPopup").show();
                jQuery("#BulkAddTagErrorPopup").dialog({
                    autoOpen: true,
                    height: 210,
                    width: 240,
                    modal: true
                });

                return;
            }

            //Clear out popup input after tag has been added
            jQuery("#BulkAddTagPopup .BulkAddTagPopupText input").val("");

            jQuery("#BulkAddTagPopup .BulkTagType input").removeAttr("checked");;
            jQuery("#BulkAddTagPopup .BulkTagType input:eq(0)").prop("checked", true);

            //Loop through all checked resume DIDs to ensure they are valid
            jQuery("#searchresults input[type='checkbox']:checked").each(function () {

                resumeDID = jQuery(this).attr("name").split("_")[0];
                tagExists = false
                existingTags = jQuery("#" + resumeDID + "_resumetaglist").children('.tagName');
                existingTagsLength = jQuery("#" + resumeDID + "_resumetaglist").children('.tagName').length;

                if (existingTagsLength === 5) {
                    return;
                }

                existingTags.each(function () {

                    var existingTag = $(this).attr("title");

                    if (existingTag === tagName) {
                        tagExists = true;
                    }

                });

                if (response.TagManagementAdd.OwnerDID != "") {
                    ownerDID = response.TagManagementAdd.OwnerDID;
                }


                if (tagExists === false) {
                    var newTag = newTagTagify(tagName, tagType, ownerDID);
                    jQuery("#" + resumeDID + "_resumetaglist").append(newTag);

                    //Hide add tag link if there are 5 tags. 
                    if (jQuery("#" + resumeDID + "_resumetaglist").children('.tagName').length >= 5) {
                        jQuery("#" + resumeDID + "_resumetaglist").siblings('.addTagLabel').hide();
                    }
                }

            });
        },
        error: function (xhr, status, error) {
            hideLoadingSpinner();
            if (xhr.status === 403) {
                sessionTimeout();
            }
        }
    });
    
}

function addResumeTag(selection) {
    var resumeDID = jQuery(selection).closest('.resumeresulttag').attr('id').split('_Tag')[0];
    var tagName = jQuery(selection).parent().children("form").children(".resumetaginput").val();

    if (tagName == undefined || tagName == "") {
        return;
    }

    var encodedTagName = encodeURIComponent(tagName);

    var drlPart = "drl=tagactionadd;tagmanagementadd";

	
    var dataparams = drlPart + "&rrl=" + resumeDID + "&tag=" + encodedTagName;

    showLoadingSpinner();

    jQuery.ajax({
        type: "POST",
        url: "../Resumes/AJAX/" + "TagAction.aspx",
        data: dataparams,
        timeout: 40000,
        dataType: 'json',
        success: function (msg) {
            var response = msg;

            hideLoadingSpinner();

            if (response == null) {
                return;
            }

            if (response.Status == 'No Locked License') {
                location.href = 'LockRDBLicense.aspx';
                return;
            }

            if (response.TagActionAdd == undefined) {
                return;
            }

            if (response.TagActionAdd.Status != "Ok" && response.TagActionAdd.Status != "Tag already exist for resume") {
                jQuery("#" + resumeDID + "_tagmessage").text(response.TagActionAdd.Status);
                jQuery("#" + resumeDID + "_tagmessage").show();
                return;
            }

            jQuery(selection).parent().children("form").children(".resumetaginput").hide();
            jQuery(selection).parent().children("form").children(".resumetaginput").val("");
            jQuery(selection).parent().children(".saveTag").hide();
            jQuery(selection).parent().children(".cancelTag").hide();
            jQuery("#" + resumeDID + "_tagmessage").hide();

            if (response.TagActionAdd.Status != "Tag already exist for resume") {
                jQuery("#" + resumeDID + "_usertaglist").append('<div id=\"' + encodedTagName + '_usertag\" class=\"resumeresultusertags\"><p class="tagNameLabel" title="' + tagName + '">' + tagName + ' </p><img class="xfortag" src="http://img.icbdr.com/images/images/jpimages/xfortag.png" /></div>');
                incrementUserTag(tagName);
                addTagToGlobalList(tagName);
            }

            if (jQuery("#" + resumeDID + "_usertaglist").children('.resumeresultusertags').length < 5) {
                jQuery("#" + resumeDID + "_addlabel").show();
            }
        },
        error: function (xhr, status, error) {
            hideLoadingSpinner();
            if (xhr.status === 403) {
                sessionTimeout();
            }
        }
    });
}

function addTagToGlobalList(tagName) {
    var isThere = false;
    if (tagName != undefined) {
        for (var i = 0; i < g_userTags.length; i++) {
            if (g_userTags[i] != undefined) {
                if (g_userTags[i].toLowerCase() == tagName.toLowerCase()) {
                    isThere = true;
                }
            }
        }
        if (isThere == false) {
            g_userTags.push(tagName);
            jQuery("#searchresults .resumetaginput").autocomplete('option', 'source', g_userTags)
        }
    }
}

function incrementUserTag(tagName) {
    var count;
    var tag;
    var begin;
    var tmp;

    tag = jQuery("#usertagfacetsection fieldset .facetplaceholder .facetwrapper ul li input").filter(function () {
        return this.value.toLowerCase().endsWith("-" + tagName.toLowerCase());
    });
      
    if (tag.length == 0) {
        //add new tag in the list
        var inputId = ScriptVariables.Get('UserDIDForTag') + "-" + tagName;       
        var newTag = '<input value="' + inputId + '" id="tag' + inputId.toLowerCase() + '" name="Tags" type="checkbox"><label for="tag' + inputId.toLowerCase() + '"> ' + tagName + ' (1)</label> ';
        var newTagNode = document.createElement('li');
        newTagNode.innerHTML = newTag;
        tag = jQuery("#usertagfacetsection fieldset .facetplaceholder .facetwrapper ul");
        tag.append(newTagNode);
    }
    else {
        //increase count
        count = jQuery(tag).parent('li').find('label').text();
        begin = count.substring(0, (count.lastIndexOf("(") + 1));
        count = count.substring((count.lastIndexOf("(") + 1), count.lastIndexOf(")"));
        count = parseInt(count);
        count = count + 1;
        count = begin + count + ")";
        jQuery(tag).parent('li').find('label').text(count);
    }
}

function deleteResumeTag(selection) {
    var resumeDID = jQuery(selection).closest('.resumeresulttag').attr('id').split('_Tag')[0];
    var tagName = jQuery(selection).parent().attr('id').split('_usertag')[0];
    if (tagName == undefined) {
        tagName = "";
    }
    var decodedTagName = decodeURIComponent(tagName); //to avoid double encoding
    var encodedTagName = encodeURIComponent(decodedTagName);
    var dataparams = "drl=tagactiondelete" + "&rrl=" + resumeDID + "&tag=" + encodedTagName;

    showLoadingSpinner();

    jQuery.ajax({
        type: "POST",
        url: "../Resumes/AJAX/" + "TagAction.aspx",
        data: dataparams,
        timeout: 40000,
        dataType: 'json',
        success: function (msg) {
            var response = msg;

            hideLoadingSpinner();

            if (response == null) {
                return;
            }

            if (response.Status == 'No Locked License') {
                location.href = 'LockRDBLicense.aspx';
                return;
            }

            if (response.TagActionDelete == undefined) {
                return;
            }

            if (response.TagActionDelete.Status != "Ok") {
                return;
            }

            jQuery(selection).parent().remove();
            jQuery("#" + resumeDID + "_addlabel").show();
            decrementUserTag(decodedTagName);

        },
        error: function (xhr, status, error) {
            hideLoadingSpinner();
            if (xhr.status === 403) {
                sessionTimeout();
            }
        }
    });
}

function decrementUserTag(tagName) {
    var count;
    var tag;
    var begin;
    var tmp;

    jQuery("#usertagfacetsection fieldset .facetplaceholder .facetwrapper ul li").each(function () {

        tag = jQuery(this).children("input").attr("value");
        tmp = tag.split("-");
        if (tmp != undefined && tmp.length >= 2) {
            tag = tmp[1];
        } else {
            tag = "";
        }
        tag = tag.toLowerCase();
        if (tag == tagName.toLowerCase()) {
            count = jQuery(this).children("label").text();
            begin = count.substring(0, (count.lastIndexOf("(") + 1));
            count = count.substring((count.lastIndexOf("(") + 1), count.lastIndexOf(")"));
            count = parseInt(count);
            count = count - 1;
            if (count == 0) {
                jQuery(this).hide();
            }
            count = begin + count + ")";
            jQuery(this).children("label").text(count);
            return false;
        }
    });
}

function getTagFacetValue(id, tagname) {
    var value = id + "-" + tagname;
    return value;
}

function getTagFacetID(id, tagname) {
    var value = convertToLowerCase(id) + "-" + convertToLowerCase(tagname);
    return value;
}

function onSearchButtonClick() {
    if (g_resumeTitleUse == "ALL")
        g_resumeTitle = jQuery("#txtKeywords").val();  //Staff Nurse
    else
        g_resumeTitle = jQuery("#resumetitle").val(); // Les Juedis

    if (!jQuery("#payl").val().length > 0 && jQuery("#excludesal").is(":checked")) 
        jQuery("#payl").val("0");
}

/*
************************************** datastore
*/

function setDataStore(response) {
    if (response.DataStore != null && response.DataStore.AuditID != null && response.DataStore.AuditID != '') {
        g_auditID = response.DataStore.AuditID;
    }
}

/*
************************************** eyeBalls
*/

function placeEyeball(resumeDid, viewDate) {
    var targetLi = jQuery('input[name = "' + resumeDid + '_resumeResultsCheckBox"]').parent();
    if (jQuery(targetLi).find('.iconViewed').size() == 0) {
        var eyeball = jQuery('<img class="iconViewed" imagealign="Middle" title="' + viewDate + '" src="http://img.icbdr.com/images/sharedintl/JP/icons/app2_viewed.gif" alt="' + viewDate + '" border="0" style="height: 14px; width: 17px;">');
        var targets = jQuery(eyeball).wrap('<span style="float:left; display:block"></span>');
        jQuery(targetLi).find('.actionicons').prepend(targets);
    }
}

/*
************************************** view similar
*/

function displayShowSimilar() {
    if (g_r2location != '') {
        jQuery("#searchresults .divViewLink").css("display", "block");
    }
}

function setResumePodViewSimilar(response) {
    g_r2location = '';

    if (response.Status != 'Ok') {
        return;
    }

    g_r2location = response.Location;
}

function getViewSimilar(selection) {
    var onet = jQuery(selection).attr('id').split('_')[0];
    var location = jQuery(selection).attr('id').split('_')[1];

    var ret = '{ \"LOC\":' + '\"' + location + '\", \"ONET\":\"' + onet + '\"}'

    return ret;
}

function getViewSimilarFlag() {
    return ScriptVariables.Get('bNewViewSimilar');
}

/*
************************************** fast flip
*/

function displayFastFlip(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery("#searchresults .rdbmvcfastflip").css("display", "block");
}

/*
************************************** download link
*/

function displayDownloadLink(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery("#searchresults .downloadresume").css("display", "block");
}

/*
************************************** forward link
*/

function displayForwardLink(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery("#searchresults .forwardresume").css("display", "block");
}

/*
************************************** New Window
*/

function hideNewWindow(response) {
    if (response.Status = 'Ok') {
        jQuery("#searchresults .shownewwindow").css("display", "none");
    }
    else { return; }

}

/*
************************************** Radius 
*/

function hideRadiusResultPage(response) {
    if (response.Status = 'Ok') {
        jQuery("#facets_dis").css("display", "none");
    }
    else { return; }

}

/*
************************************** Save Resume
*/

function hideSaveResume(response) {
    if (response.Status = 'Ok') {
        jQuery("#searchresults .showsaveresume").css("display", "none");
    }
    else { return; }

}

/*
************************************** Print 
*/

function hidePrint(response) {
    if (response.Status = 'Ok') {
        jQuery("#searchresults .showprintv2").css("display", "none");
    }
    else { return; }

}

/*
************************************** Save To Folder 
*/

function hideSaveToFolder(response) {
    if (response.Status = 'Ok') {
        jQuery("#batchAction #ddlbatchAction option[value='saveToFolder'],#batchActionTop #ddlbatchActionTop option[value='saveToFolder']").css("display", "none");
    }
    else { return; }

}

/*
************************************** links
*/

function getViewSimilarResumeLink(resumeDID) {
    var additionalFlags = "";
    if (typeof createSemanticSlider != 'undefined') {
        additionalFlags += '&semanticsearch=2';
        //Adding Semantic Query String when clicked on View Similar.
        if (ScriptVariables.Get("bRDBSemanticsearchchanges") == "true") {
            additionalFlags += '&NewSemanticUI=True';
        }
    }

    if (ScriptVariables.Contains("UseNewViewSimilarLogic")) {
       
        return ScriptVariables.Get("urlroot") + "JobPoster/Resumes/ResumeResults.aspx?ResumeDIDForSearching=" + resumeDID + "&Matching_ResumeDID=" + resumeDID + "&strcrit=" + encodeURIComponent(g_strcrit) + additionalFlags;
        }
    
        //Fix CSI238072 Retaining of Keyword using query string
    return ScriptVariables.Get("urlroot") + "JobPoster/Resumes/ResumeResults.aspx?Matching_ResumeDID=" + resumeDID + "&strcrit=" + encodeURIComponent(g_strcrit) + additionalFlags;
           
}

function getBlockResumeLink(resumeDID, resumeLocInList) {
    var blockResumeLink = '';

    blockResumeLink = ScriptVariables.Get("urlroot") + "JobPoster/Resumes/BlockResume.aspx?Resume_DID=" + resumeDID + "&strcrit=" + encodeURIComponent(g_strcrit) + "&pg=" + g_curSetPage + "&ppg=" + g_numberOfDocsPerPage + "&sb=" + g_curSortBy + '&viewoption=' + g_viewOption + "&tag=" + g_tagSelection + "&ResultsPath=True&v2=1";


    blockResumeLink += '&NWDataStoreLabel_DID=' + ScriptVariables.Get('NWDataStoreLabel_DID') + '&MXAuditSearchCriteria_CriteriaDID=' + g_auditID;

    if (ScriptVariables.Contains('Matching_ResumeDID')) {
        blockResumeLink += '&Matching_ResumeDID=' + ScriptVariables.Get('Matching_ResumeDID');
    }

    if (g_semanticSearchAll == "semanticsearchall" && !ScriptVariables.Contains('Matching_ResumeDID') && !ScriptVariables.Contains('doctodocsearch')) {
        blockResumeLink += "&semanticsearchall=1";
    }

    if (typeof g_semanticID != 'undefined' && g_semanticID != null)
        blockResumeLink += "&semanticID=" + g_semanticID;

    if (typeof g_QID != 'undefined' && g_QID != null)
        blockResumeLink += "&QID=" + g_QID;

    if(getFromStrcrit('RPP=') !== "")
        blockResumeLink += '&absoluteresumeloc=' + (resumeLocInList + 1 + ((g_curSetPage - 1) * getFromStrcrit('RPP=')));

    blockResumeLink += '&relativeresumeloc=' + 'pg:' + g_curSetPage + "|loc:" + (resumeLocInList+1);


    return blockResumeLink;
}

function getPrintResumeLink(resumeDID, resumeLocInList) {
    var printResumeLink = ScriptVariables.Get("urlroot") + "JobPoster/Resumes/PrintResumeV2.aspx?Resume_DID=" + resumeDID + "&v2=1&vip=1";
    
    printResumeLink += '&NWDataStoreLabel_DID=' + ScriptVariables.Get('NWDataStoreLabel_DID') + '&MXAuditSearchCriteria_CriteriaDID=' + g_auditID;

    if (g_quicksearch != "") {
        printResumeLink += '&sc_cmp1=' + g_quicksearch;
    }

    if (ScriptVariables.Contains('Matching_ResumeDID')) {
        printResumeLink += '&Matching_ResumeDID=' + ScriptVariables.Get('Matching_ResumeDID');
    }

    if (g_semanticSearchAll == "semanticsearchall" && !ScriptVariables.Contains('Matching_ResumeDID')) {
        printResumeLink += "&semanticsearchall=1";
    }
    if (typeof g_semanticID != 'undefined' && g_semanticID != null)
        printResumeLink += "&semanticID=" + g_semanticID;
    if (typeof g_QID != 'undefined' && g_QID != null)
        printResumeLink += "&QID=" + g_QID;
    if(getFromStrcrit('RPP=') !== "")
        printResumeLink += '&absoluteresumeloc=' + (resumeLocInList + 1 + ((g_curSetPage - 1) * getFromStrcrit('RPP=')));

    printResumeLink += '&relativeresumeloc=' + 'pg:' + g_curSetPage + "|loc:" + (resumeLocInList+1);

    return printResumeLink;
}

function getNewWindowToViewResumeLink(resumeDID) {

    var newWindowToViewResumeLink = '';
    
    if (ScriptVariables.Get("bFixCSI243659") == true) {
        newWindowToViewResumeLink = ScriptVariables.Get("urlroot") + "JobPoster/Resumes/ResumeDetails.aspx?Resume_DID=" + resumeDID + "&strcrit=" + GetNewStrcrit(g_strcrit) + "&pg=" + g_curSetPage + "&ppg=" + g_numberOfDocsPerPage + "&sb=" + g_curSortBy + '&viewoption=' + g_viewOption + "&tag=" + g_tagSelection + "&ResDetailsOpenNewWin=True&hl=1&V2=1";
    }
    else {
        newWindowToViewResumeLink = ScriptVariables.Get("urlroot") + "JobPoster/Resumes/ResumeDetails.aspx?Resume_DID=" + resumeDID + "&strcrit=" + encodeURIComponent(g_strcrit) + "&pg=" + g_curSetPage + "&ppg=" + g_numberOfDocsPerPage + "&sb=" + g_curSortBy + '&viewoption=' + g_viewOption + "&tag=" + g_tagSelection + "&ResDetailsOpenNewWin=True&hl=1&V2=1";
    }

    newWindowToViewResumeLink += '&NWDataStoreLabel_DID=' + ScriptVariables.Get('NWDataStoreLabel_DID') + '&MXAuditSearchCriteria_CriteriaDID=' + g_auditID;

    if (ScriptVariables.Contains("ResumeDIDForSearching")) {
        newWindowToViewResumeLink += "&ResumeDIDForSearching=" + ScriptVariables.Get("ResumeDIDForSearching");
    } else {
        newWindowToViewResumeLink += "&VIP=1";
    }
    if (ScriptVariables.Get('ReturnToReccomendedResumes') == 'true') {
        if (ScriptVariables.Contains('Matching_JobDID')) {
            newWindowToViewResumeLink += '&Matching_JobDID=' + ScriptVariables.Get('Matching_JobDID');
        }
    }
    if (typeof createSemanticSlider != 'undefined')
        newWindowToViewResumeLink += '&semanticsearch=2';

    return newWindowToViewResumeLink;
}

function getForwardResumeLink(resumeDID) {
    var forwardLink = ScriptVariables.Get("urlroot") + "JobPoster/Resumes/ForwardResume.aspx?Resume_DID=" + resumeDID + "&strcrit=" + encodeURIComponent(g_strcrit) + "&pg=" + g_curSetPage + "&ppg=" + g_numberOfDocsPerPage + "&sb=" + g_curSortBy + '&viewoption=' + g_viewOption + "&tag=" + g_tagSelection;
    return forwardLink;
}

function getModifySearchLink() {
    var modifySearchLink = '';

        modifySearchLink = ScriptVariables.Get("urlroot") + "JobPoster/Resumes/SearchResume.aspx?strcrit=" + encodeURIComponent(g_strcrit);



    modifySearchLink += '&NWDataStoreLabel_DID=' + ScriptVariables.Get('NWDataStoreLabel_DID') + '&MXAuditSearchCriteria_CriteriaDID=' + g_auditID;

    return modifySearchLink;
}

function getSaveSearchLink() {
    var saveSearchLink = ScriptVariables.Get("urlroot") + "JobPoster/Searches/SaveSearch.aspx?strcrit=" + encodeURIComponent(g_strcrit);


    saveSearchLink += '&NWDataStoreLabel_DID=' + ScriptVariables.Get('NWDataStoreLabel_DID') + '&MXAuditSearchCriteria_CriteriaDID=' + g_auditID;


    return saveSearchLink;
}

function getCiscoResumeLink(resumeDID) {
    var ciscoResumeLink = ScriptVariables.Get("urlroot") + "JobPoster/Resumes/CiscoLogoClicks.aspx?Resume_DID=" + resumeDID + "&SrchHist=1&Path=ResumeResults";


    ciscoResumeLink += '&NWDataStoreLabel_DID=' + ScriptVariables.Get('NWDataStoreLabel_DID') + '&MXAuditSearchCriteria_CriteriaDID=' + g_auditID;


    return ciscoResumeLink;
}

function displayModifySearchLink() {
    jQuery("#_modifySearch").attr("href", getModifySearchLink());
    if (typeof createSemanticSlider != 'undefined') {
        jQuery("#_SearchBar__modifySearch").attr("href", getModifySearchLink());
    }
}

function showResumeDetails(resumeDID) {
    g_reload = false;

    jQuery.bbq.pushState({ strcrit: g_strcrit, resumedid: resumeDID, viewoption: g_viewOption, pg: g_curSetPage, sb: g_curSortBy, tag: g_tagSelection, auditid: g_auditID });

}

function getResumeDetailsURL(resumeDID, resumeLocInList) {
    var scparam = '';
    var resDetailsURL = '';

    if (g_curSortBy != 'RELV') {
        if (g_curSortBy == 'RECENTYEARLYPAY') {
            scparam = '3';
        }
        else {
            scparam = '0';
        }
    }
    
    if (ScriptVariables.Get("bFixCSI243659") == true) {
        resDetailsURL = 'ResumeDetails.aspx?Resume_DID=' + resumeDID + '&strcrit=' + GetNewStrcrit(g_strcrit) + '&pg=' + g_curSetPage + '&sb=' + g_curSortBy + '&viewoption=' + g_viewOption + '&sc=' + scparam + "&tag=" + g_tagSelection + '&V2=1&hl=1'
    }
    else {
        resDetailsURL = 'ResumeDetails.aspx?Resume_DID=' + resumeDID + '&strcrit=' + encodeURIComponent(g_strcrit) + '&pg=' + g_curSetPage + '&sb=' + g_curSortBy + '&viewoption=' + g_viewOption + '&sc=' + scparam + "&tag=" + g_tagSelection + '&V2=1&hl=1'
    }

    resDetailsURL += '&NWDataStoreLabel_DID=' + ScriptVariables.Get('NWDataStoreLabel_DID') + '&MXAuditSearchCriteria_CriteriaDID=' + g_auditID;

    if (ScriptVariables.Contains("ResumeDIDForSearching")) {
        resDetailsURL += "&ResumeDIDForSearching=" + ScriptVariables.Get("ResumeDIDForSearching");
    } else {
        resDetailsURL += "&VIP=1";
    }

    if (g_quicksearch != "") {
        resDetailsURL += '&sc_cmp1=' + g_quicksearch;
    }

    //Temporary code for viewbased RDB monitoring
    if (ScriptVariables.Get('Product') == "viewbased") {
        resDetailsURL += "&RegularView=1";
    }

    if (ScriptVariables.Get('ReturnToReccomendedResumes') == 'true') {
        if (ScriptVariables.Contains('Matching_JobDID')) {
            resDetailsURL += '&Matching_JobDID=' + ScriptVariables.Get('Matching_JobDID');
        }
    }

    if (ScriptVariables.Contains('Matching_ResumeDID')) {
        resDetailsURL += '&Matching_ResumeDID=' + ScriptVariables.Get('Matching_ResumeDID');
    }

    if (g_semanticSearchAll == "semanticsearchall" && !ScriptVariables.Contains('Matching_ResumeDID')) {
        resDetailsURL += "&semanticsearchall=1";
    }
    if (typeof g_semanticID != 'undefined' && g_semanticID != null)
        resDetailsURL += "&semanticID=" + g_semanticID;
    if (typeof g_QID != 'undefined' && g_QID != null)
        resDetailsURL += "&QID=" + g_QID;
    if (ScriptVariables.Contains('semanticsearch')) {
        resDetailsURL += '&semanticsearch=2';
    }
    if (ScriptVariables.Get("bRDBSemanticsearchchanges") == "true") {
            resDetailsURL += '&NewSemanticUI=True';
    }
    if(getFromStrcrit('RPP=') !== "")
        resDetailsURL += '&absoluteresumeloc=' + (resumeLocInList + 1 + ((g_curSetPage - 1) * getFromStrcrit('RPP=')));

    resDetailsURL += '&relativeresumeloc=' + 'pg:' + g_curSetPage + "|loc:" + (resumeLocInList+1);

    return resDetailsURL;
}

/*
************************************** move to resume position
*/

function moveToResumePosition() {
    if (g_init != true) {
        return;
    }

    if (g_resumedid == "") {
        return;
    }

    var offset = jQuery("#" + g_resumedid + "_Title").offset();
    if (offset != null) {
        jQuery(window).scrollTop(offset.top);
    }
}

/*
************************************** loading message
*/

function hideLoadingSpinner() {
    jQuery("#loadingSpinner").hide();

    if (ScriptVariables.Get('UpdateRDBResultsPageLoad') == 'true') {
        jQuery(".CBResumeResultsSearchLinks").show();
        jQuery("#facets").show();
    }
	
	if (g_init && typeof window.optimizely !== 'undefined')
		window.optimizely.push(["activate", 239508888]);
}

function showLoadingSpinner() {
    jQuery("#loadingSpinner").center().show();
}




jQuery.fn.extend({
    loadpos: function (obj, toppadding) {
        return this.each(function () {
            var top;
            var left;
            top = jQuery(obj).position().top + toppadding;
            left = jQuery(obj).position().left + ((jQuery(obj).width() - jQuery(this).outerWidth()) / 2);

            jQuery(this).css({ position: 'fixed', margin: 0, top: (top > 0 ? top : 0) + 'px', left: (left > 0 ? left : 0) + 'px' });
        });
    }
});

/*
************************************** hide filters
*/

function displayIntlFilterData(id) {
    var response = "true";
    if (filters_hidden != null) {
        if (filters_hidden != "") {
            jQuery.each(filters_hidden.split(";"), function (i, item) {
                if (item == id) {
                    response = "false";
                }
            });
        }
    }
    return response;
}

function LJLocations(response) {
    
    if (response.RegionFRData != null) {
        displayFRRegion(response.RegionFRData);
        displayMoreSearchOptionTab = true;
    }

	if (response.RegionData != null) {
		displayRegion(response.RegionData);
		displayMoreSearchOptionTab = true;
	}

    if (response.LocationType != null) {
        displayLocationType(response.LocationType);
    }

    if (response.FRLocationData != null) {
        //we pass the 'response' object instead of the 'response.FRLocationData' because 
        //we need more information to handle the display of the relocation listBox;
        displayFRLocationData(response);
    }

    if (response.RelocationType != null) {
        displayRelocationType(response.RelocationType);
    }
    //We use "KM" in France so there's no need to protect this with a flag
    //basically we didn't even used the radius on this site so there's no problem
    $("#facets_lut").val("KM");
    displayFRRelocationData(response);
}

/*
************************************** utilities
*/

function isCountryArea(value) {
    var isCountry = false;

    if (value.indexOf('CID') != -1 && value.indexOf('SID') == -1 && value.indexOf('CTY') == -1) {
        isCountry = true;
    }

    return isCountry;
}

if (ScriptVariables.Get('UpdateTagsRDBResults') == 'true') {
    jQuery(document).on("click", '#searchresults .addTagLabel', function () {

        var tagDID = jQuery(this).attr("resume");
        var tagDIDSelector = "#" + tagDID + ".AddTagPopup";
        $(tagDIDSelector).dialog("open");

    });


    jQuery(document).on("click", '.coworkerTagButton', function () {

        var className = jQuery("#coworkerTagsDropdown").attr("class");

        if (className === "hidden") {
            jQuery("#coworkerTagsDropdown").toggleClass("hidden");
            jQuery("#coworkerTagsDropdown").show();
            getCoworkerTags(this);
        }
        else {
            jQuery("#coworkerTagsDropdown").toggleClass("hidden");
            jQuery("#coworkerTagsDropdown").hide();

        }

    });


    jQuery(document).on("click", '#searchresults .publicTagEnd, #searchresults .publicCoworkerTagEnd, #searchresults .privateTagEnd', function () {

        var resumeDID = jQuery(this).parents(".resumetaglist").attr("id").split("_")[0];
        var tagName = jQuery(this).prev('.tagName').attr("title");
        var tagDID = jQuery(this).prev('.tagName').attr("tag");
        var taggedBy = jQuery(this).prev('.tagName').attr("taggedBy");
        var ajaxPage = "DeleteTag.aspx";
        var dataparams = "TagDID=" + tagDID + "&ResumeDID=" + resumeDID + "&taggedBy=" + taggedBy + "&DeleteType=single";

        //Remove row from list
        jQuery(this).prev('.tagName').remove();
        jQuery(this).parents().siblings('.addTagLabel').show();
        jQuery(this).remove();

        //using the Intl delete tag page.
        var decodedTagName = decodeURIComponent(tagName); //to avoid double encoding
        var encodedTagName = encodeURIComponent(decodedTagName);

        var dataparams = "drl=tagactiondelete" + "&rrl=" + resumeDID + "&tag=" + encodedTagName;
        jQuery.ajax({
            type: "POST",
            url: "../Resumes/AJAX/" + "TagAction.aspx",
            data: dataparams,
            timeout: 40000,
            dataType: 'json',
            success: function (msg) {
                var response = msg;
                if (response == null) {
                    return;
                }

                if (response.Status == 'No Locked License') {
                    location.href = 'LockRDBLicense.aspx';
                    return;
                }

                if (response.TagActionDelete == undefined) {
                    return;
                }

                if (response.TagActionDelete.Status != "Ok") {
                    return;
                }
                jQuery("#" + resumeDID + "_addlabel").show();

            },
            error: function (xhr, status, error) {
                if (xhr.status === 403) {
                    sessionTimeout();
                }
            }
        });
    });
}


//Temporary code for RDB monitoring-- will be deleted on 2/15/2013
$(document).on("click", '#btnFacetSearch', function () {
	$.cb.Tally(location.hostname + 'ResumeResults', 'userclick', 'clickOnSearch');
});

$(document).on("change", '#facet_country #country', function () {
	$.cb.Tally(location.hostname + 'ResumeResults', 'userclick', 'SearchByCountryDropDownList');
});

$(document).on("click", '#tagfacettab', function () {
	$.cb.Tally(location.hostname + 'ResumeResults', 'userclick', 'clickOnTags');
});

$(document).on("click", '.viewsimilarresumes', function () {
	$.cb.Tally(location.hostname + 'ResumeResults', 'userclick', 'clickOnViewSimilarResumes');
});

function BindSearchFieldTally(selector, browserEvent, tallyText) {
	jQuery(document).on(browserEvent, selector, function () {
        CB.Tally(g_sliceCode + 'ResumeResults', browserEvent, tallyText);
	});
}


$.fn.center = function (options) {

    var opt = {
        forceAbsolute: false,
        container: window,    // selector of element to center in
        completeHandler: null
    };
    $.extend(opt, options);

    return this.each(function (i) {
        var el = $(this);
        var jWin = $(opt.container);
        var isWin = opt.container == window;

        // force to the top of document to ENSURE that 
        // document absolute positioning is available
        if (opt.forceAbsolute) {
            if (isWin)
                el.remove().appendTo("body");
            else
                el.remove().appendTo(jWin.get(0));
        }

        // have to make absolute
        el.css("position", "absolute");

        // height is off a bit so fudge it
        var heightFudge = isWin ? 2.0 : 1.8;

        var x = (isWin ? jWin.width() : jWin.outerWidth()) / 2 - el.outerWidth() / 2;
        var y = (isWin ? jWin.height() : jWin.outerHeight()) / heightFudge - el.outerHeight() / 2;

        el.css("left", x + jWin.scrollLeft());
        el.css("top", y + jWin.scrollTop());

        // if specified make callback and pass element
        if (opt.completeHandler)
            opt.completeHandler(this);
    });
}


function GetNewStrcrit(g_strcrit) {

    var strc = g_strcrit.split(";");

    var arrayLength = strc.length;
    var newstrcrit = '';
    var i = 0;
    for (i = 0; i < arrayLength; i++) {
        if (!(strc[i].indexOf("RDID") > -1)) {
            newstrcrit += strc[i] + ';';
        }
    }
    return encodeURIComponent(newstrcrit);
}

function facetSearch() {
    if (jQuery.watermark != null) {
        jQuery.watermark.hideAll();
    }

    var searchOptionString = jQuery.param(jQuery('.frmSearchOptions').serializeArray());

    if (typeof createSemanticSlider != 'undefined')
        searchOptionString = "RAWWORDS=" + encodeURIComponent($("#resumesearch").val()) + getLocString() + searchOptionString;


    var searchOptionObject = jQuery.deparam(searchOptionString);

    if (g_searchOptionObject != null && searchOptionObject != null && g_searchOptionObject['RAWWORDS'] != searchOptionObject['RAWWORDS'])
        g_RawwordsChanged = true;

    if (typeof searchOptionObject != "undefined" && searchOptionObject != null)
        g_searchOptionObject = searchOptionObject;


    if (searchOptionObject != null) {
        
            if (searchOptionObject["SF_AREA"] != undefined && searchOptionObject["SF_AREA"] != "" && searchOptionObject["SF_AREA"] != null)
            { searchOptionObject["LOC"] = undefined; }
      

        var locationArray = searchOptionObject["LOC"];

        if (locationArray != undefined) {
            var formattedLocationArray = [];
            var formattedItem = "";

            var region = "";

            //pop the region from locationArray if the Region field is active
            if (jQuery("#listitem_region").is(":visible")) {
                region = locationArray.pop();
            }

            jQuery.each(locationArray, function (i, item) {
                if (item != "") {
                    if (region != "") {
                        formattedItem = item + "," + region + "|";
                    }
                    else {
                        formattedItem = item + "|";
                    }
                    formattedLocationArray.push(formattedItem);
                }
            });

            if (formattedLocationArray.length == 0 && region != "") {
                formattedLocationArray.push(region + "|");
            }

            searchOptionObject["LOC"] = formattedLocationArray;

            if (searchOptionObject["MRC"] != null && searchOptionObject["MRC"] == "on") {
                searchOptionObject["MRC"] = searchOptionObject["CMPN"];
            }
        }

        g_formattedSearchOptions = getFormattedSearchOptions(searchOptionObject);
        g_shadowFormattedSearchOptions = g_formattedSearchOptions;

        g_SiteCatalyst = "JP_Res_Search_From_RR";
    }

    g_facet = '';
    g_reload = 'true';
    g_curSetPage = 1;
    g_tagSelection = "";

    g_strcrit = '';

    if (!ScriptVariables.Contains('Matching_ResumeDID') && g_RawwordsChanged == true) {
        g_semanticFilterString = '0.5';
        g_RawwordsChanged = false;
    }
    if (ScriptVariables.Get('bNewViewSimilar') == 'true') {
        g_viewSimilar = "";
    }

    if (ScriptVariables.Get('bNewViewSimilar') == 'true') {
        g_viewSimilar = "";
    }

    jQuery(window).trigger('hashchange');


};

function getLocString() {
    var RADU = "";
    if ($(".distance-units-selected").text().trim() == "Miles")
        RADU = "MI"
    else
        RADU = "KM"

    //TODO:: multiple locations should be added
    var locs = $('.loc-selected');
    if (locs.length == 1) {
        var CTY = "&CTY=", SID = "&SID=";
        var ctysidarr = $(locs).text().split(', ');
        if (ctysidarr.length == 1) {
            SID += ctysidarr[0].trim();
        } else if (ctysidarr.length > 1) {
            SID += ctysidarr[0].trim();
            CTY += ctysidarr[1].trim();
        }
        return "&RAD=" + $(".distance-selected").text().trim() + "&RADU=" + RADU + "&LOC=" + $('.loc-selected').text().trim() + "&LOC=&LOC=" + CTY + SID + "&sortLocation=1&"
    }
    else {
        var j = 0, locstring = '';
        var CTY = "&CTY=", SID = "&SID=";
        for (var i = 0; i < locs.length; i++) {
            var t = locs[i];

            locstring += "&LOC=" + $(t).text().trim();
            var ctysidarr = $(t).text().split(', ');
            if (ctysidarr.length == 1) {
                SID += ctysidarr[0].trim() + ',';
            } else if (ctysidarr.length > 1) {
                SID += ctysidarr[1].trim() + ',';
                CTY += ctysidarr[0].trim() + ',';
            }
        }

        return "&RAD=" + $(".distance-selected").text().trim() + "&RADU=" + RADU + locstring + CTY + SID + "&sortLocation=1&";
    }



}


function getRelativeResumePosition(resumeDID) {
    var saveFolderID = '#' + resumeDID + '_cbhlSaveResume';
    var index;
    if (ScriptVariables.Get("bSaveFFCrossPage")) {
        index = 1;
        if ($(saveFolderID).data() != undefined) {
            index = $(saveFolderID).data().indexnumber;
        }
    }
    else
        {
     index = $(saveFolderID).data().indexnumber;
    }
    return index;
}

function updateStrcritOnViewSimilar(locationDataArr) {
    if (g_init && document.URL.indexOf("Matching_ResumeDID") > 0 && locationDataArr.length > 0) {

        $('.oneCity').remove();


        g_strcrit = removeFromStrcrit('LOC=');


        g_strcrit += 'LOC=';

        for (var i = 0; i < locationDataArr.length; i++)
            g_strcrit += locationDataArr[i] + '|,';

        g_strcrit = g_strcrit.slice(0, -1);
        g_strcrit += ';';

        if (typeof addLocationsToPanel !== 'undefined')
            addLocationsToPanel();

    }
}
