// Functions of naming convention display<feature>()

/*
************************************** rdb summary
*/

function displayRDBSummary(response) {
    if (g_init != true) {
        return;
    }

    jQuery('#rdbsummary').empty();

	if (response.RDBSummaryList != null && response.RDBSummaryList != '') {
		jQuery.each(response.RDBSummaryList, function (i, item) {
			jQuery('#rdbsummary').append(jQuery('<option></option>').val(i).html(item));
		});
	}
	jQuery('#rdbsummary').val(response.RDBSummarySelection);
	
	BindSearchFieldTally("#rdbsummary", "change", "rdbsummary (slice) changed");
}

function getRDBSummary(rdbSummary) {
    var dataparams = "NWRDBLicenseControlSummary_Country=" + rdbSummary + "&RDBSliceCode=" + rdbSummary;
	
	jQuery.ajax({			// surprisingly, we don't care about the datatype of the response
        type: "POST",
        url: "../Resumes/AJAX/" + "GetRDBSummary.aspx",
        data: dataparams,
        timeout: 40000,
        success: function (msg) {
            var response = msg;
            if (response == null) {
                jQuery("#rdbmessage").text("An ajax error occurred.  If the problem persists, please contact Customer Service.");
            }
        },
        error: function (xhr, status, error) {
            if (xhr.status === 403) {
                sessionTimeout();
            }
        }
    }).done(function () {
        location.href = "SearchResume.aspx";
    });
}
/*
************ salary search option
*/
function displaySalary(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery("#" + response.CompensationType).attr("checked", "checked");
    jQuery("#" + response.CompensationType).siblings().removeAttr("checked");
    jQuery("#payl").val(response.PayLow);
    jQuery("#payh").val(response.PayHigh);

    if (response.ExcludeResumesWithNoSalary == "True") {
        jQuery("#excludesal").attr("checked", "checked");
    }
    else {
        jQuery("#excludesal").removeAttr("checked");
    }

    if (response.FacetOpen) {
        openFacet("salaryheader");
    }
    else {
        closeFacet("salaryheader");
    }

    jQuery("#listitem_salary").show();
	
	BindSearchFieldTally("#salarytypelist", "change", "salary type");
	BindSearchFieldTally("#payl", "change", "lower salary");
	BindSearchFieldTally("#payh", "change", "upper salary");
	BindSearchFieldTally("#excludesal", "change", "exclude resumes with no salary toggle");
}

/*
************ distance search option
*/

function displayDistance(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery("#dis").val(response.Radius);
    jQuery("#facets_lut").val(response.RadiusUnits);
	
	BindSearchFieldTally("#dis", "change", "distance changed");
	BindSearchFieldTally("#facets_lut", "change", "distance units changed");
}

/*
************ country search option
*/

function displayCountry(response) {
    if (response.Status != "Ok") {
        return;
    }

    if (response.SelectedCountryList.length == 0 || (response.SelectedCountryList.length == (jQuery('#country option').size() - 1))) {
        jQuery('#country option:first-child');
    }
    else {
        jQuery('#country').val(response.SelectedCountryList);
    }

	BindSearchFieldTally("#country", "change", "country changed");
}

/*
************ FR Regions search option
*/

function displayFRRegion(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery("#FRRegion option:selected").removeAttr("selected");

    jQuery("#FRRegion").val(response.SelectedRegionList);

    if (response.SelectedRegionList.length == 0) {
        jQuery("#FRRegion").val("").attr('selected', 'selected');
    }
	
	BindSearchFieldTally("#FRRegion", "change", "FRRegion changed");
}

/*
************ Region search option
*/

function displayRegion(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery("#Region option:selected").removeAttr("selected");

    jQuery("#Region").val(response.SelectedRegionList);

    if (response.SelectedRegionList.length == 0) {
        jQuery("#Region").val("").attr('selected', 'selected');
    }
	
	BindSearchFieldTally("#Region", "change", "Region changed");
}

/*
************ location type search option
*/

function displayLocationType(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery("#" + response.SelectedLocationType).attr("checked", "checked");

    displayMultiLocation(response.SelectedLocationType.replace("LJGEOTYPE", ""));
	
	BindSearchFieldTally("#regiontypelist", "change", "regiontypelist changed");
	BindSearchFieldTally("#OutsideCountries", "change", "OutsideCountries changed");
}


function displayMultiRelocation(relocationSearchType) {
    if (relocationSearchType == 'FR') {
        jQuery("#relocation").show();
        jQuery("#OtherCountries").hide();
        jQuery("#relocation").val('').attr('selected', 'selected');
    }

    if (relocationSearchType == 'NFR') {
        jQuery("#relocation").hide();
        jQuery("#OtherCountries").show();
        jQuery("#OtherCountries").val('').attr('selected', 'selected');
    }

    if (relocationSearchType == 'ALL') {
        jQuery("#relocation").hide();
        jQuery("#OtherCountries").hide();
    }
}


/*
************ Display CV title search option - SF
*/
function displayCVTitleSearchOption(response) {
    if (response.Status != "Ok") return;

    jQuery("#listitem_titleKeywordSearch").show();
}

///////////////////////////////////////////////////////////////////////////////
//
// "More search" options
//
///////////////////////////////////////////////////////////////////////////////

function displayJobCategory(response) {
    if (response.Status != "Ok") {
        return;
    }

    g_jobcatid = 1;

    jQuery.each(response.SelectedJobCategoryList, function (i, item) {
        if (i == 0) {
            jQuery("#jobcat").val(item);
        }
        else {
            g_jobcatid += 1;
            jQuery("#jobcat" + g_jobcatid).val(item);
            jQuery("#jobcat" + g_jobcatid + "set").show();
        }
    });

    if (g_jobcatid == 5) {
        jQuery("#addjobcategory").hide();
    }
    else {
        jQuery("#addjobcategory").show();
    }

    if (response.FacetOpen) {
        openFacet("jobtcategoryheader");
    }
    else {
        closeFacet("jobtcategoryheader");
    }
	
	BindSearchFieldTally("#jobcat", "change", "jobcategory changed");
	BindSearchFieldTally("#jobcat2set", "change", "jobcategory2 changed");
	BindSearchFieldTally("#jobcat3set", "change", "jobcategory3 changed");
	BindSearchFieldTally("#jobcat4set", "change", "jobcategory4 changed");
	BindSearchFieldTally("#jobcat5set", "change", "jobcategory5 changed");
	
	BindSearchFieldTally("#addjobcategory", "click", "jobcategory added");
	BindSearchFieldTally("img[class='removejobcat']", "click", "jobcategory removed");
}
    function viewJobCategory(response) {

        if (response.Status != "Ok") {
            return;
        }
        g_jobcatid = 1;
        var x = jQuery("#InputsWrapper").length;
        var MaxInputs = 4;
        var totalComboBox = response.SelectedJobCategoryList.length;
        jQuery("#InputsWrapper").empty();
        jQuery.each(response.SelectedJobCategoryList, function (i, item) {
            if (i == 0) {
                jQuery("#jobcat").val(item);
          
            }
            else {

                g_jobcatid += 1;
                jQuery("#InputsWrapper").append('<div id="jobcat' + g_jobcatid + 'set"><select id="jobcat' + g_jobcatid + '" class="jobcat' + g_jobcatid + '" name="CAT">' + $('#jobcat').html() + '</select>&nbsp;<img class="removeclass" width="12" height="12" border="0" src="http://clib.icbdr.com/images/images/jpimages/remminus.gif" title="Remove this field" style="cursor: pointer;"></div>')
                jQuery("#jobcat" + g_jobcatid).val(item);
                x++;
            }
            if (x == 5) {
                jQuery("#AddMoreFileBox").hide();
            }
        });

        $("body").on("click", ".removeclass", function (e) { //user click on remove text

            if (x > 1) {
                $(this).parent('div').remove(); //remove text box
                x--; //decrement textbox
                jQuery("#AddMoreFileBox").show();
            }
            return false;
        });
        if (response.FacetOpen) {
            openFacet("jobtcategoryheader");
        }
        else {
            closeFacet("jobtcategoryheader");
        }

    }
function displayGraduation(response) {
    if (response.Status != "Ok") {
        return;
    }

    jQuery("#mingraduationmonthlist").val(response.SelectedGraduationMonthLow);
    jQuery("#mingraduationyearlist").val(response.SelectedGraduationYearLow);
    jQuery("#maxgraduationmonthlist").val(response.SelectedGraduationMonthHigh);
    jQuery("#maxgraduationyearlist").val(response.SelectedGraduationYearHigh);

    if (response.SelectedGraduationMonthLow != '0' || response.SelectedGraduationYearLow != '0' || response.SelectedGraduationMonthHigh != '0' || response.SelectedGraduationYearHigh != '0') {
        openFacet("educationheader");
    }
	
    BindSearchFieldTally("#mingraduationmonthlist", "change", "lower minimum graduation month changed");
    BindSearchFieldTally("#mingraduationyearlist", "change", "upper minimum graduation year changed");
    BindSearchFieldTally("#maxgraduationmonthlist", "change", "lower maximum graduation month changed");
    BindSearchFieldTally("#maxgraduationyearlist", "change", "upper maximum graduation year changed");
}

    function displayMilitaryExp(response) {

        if (response.Status != "Ok") {
            return;
        }

        jQuery("#facets_mex").children().removeAttr("checked");

        jQuery.each(response.SelectedMilitaryExpList, function (i, item) {
            if (item) {
                jQuery("#" + item).attr("checked", "checked");
            }
        });

        if (response.FacetOpen) {
            openFacet("militaryexpheader");
        }
        else {
            closeFacet("militaryexpheader");
        }

        jQuery("#listitem_militaryexp").show();
	
        BindSearchFieldTally("#facets_mex", "change", "military experience type changed");		//tallies per checkbox ticked
    }

    function displayEmploymentType(response) {
        if (response.Status != "Ok") {
            return;
        }

        jQuery("#facets_etp").children().removeAttr("checked");

        jQuery.each(response.SelectedEmploymentTypeList, function (i, item) {
            if (item) {
                jQuery("#" + item).attr("checked", "checked");
            }
        });

        if (response.FacetOpen) {
            openFacet("employmenttypeheader");
        }
        else {
            closeFacet("employmenttypeheader");
        }

        jQuery("#listitem_emptype").show();
	
        BindSearchFieldTally("#facets_etp", "change", "employment type changed");		//tallies per checkbox ticked
    }

    function displaySecurityClearance(response) {
        if (response.Status != "Ok") {
            return;
        }

        if (g_securityClearanceLUCache != null && g_securityClearanceLUCache != '') {
            jQuery("#securityclearancelist").setTemplate(jQuery("#jTemplateHolder_SecurityClearance").html());
            jQuery("#securityclearancelist").processTemplate({ "securityclearance": g_securityClearanceLUCache });
        }

        jQuery("#GV" + response.SelectedSecurityClearance).siblings().removeAttr("checked");
        jQuery("#GV" + response.SelectedSecurityClearance).attr("checked", "checked");

        if (response.FacetOpen) {
            openFacet("securityclearanceheader");
        }
        else {
            closeFacet("securityclearanceheader");
        }

        jQuery("#listitem_securityclearance").show();
	
        BindSearchFieldTally("#securityclearancelist", "change", "security clearance changed");		//tallies per checkbox ticked
    }

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

    function displayMultiLocation(locationSearchType) {
        if (locationSearchType == 'FR') {
            jQuery("#FRRegion").show();
            jQuery("#OutsideCountries").hide();
            jQuery("#FRRegion").val('').attr('selected', 'selected');
        }

        if (locationSearchType == 'NFR') {
            jQuery("#FRRegion").hide();
            jQuery("#OutsideCountries").show();
            jQuery("#OutsideCountries").val('').attr('selected', 'selected');
        }

        if (locationSearchType == 'ALL') {
            jQuery("#FRRegion").hide();
            jQuery("#OutsideCountries").hide();
        }
    }

    function displayJCHighestDegree(response,staticDataResponse){
        if (response.Status != "Ok" || staticDataResponse.Status != "Ok") {
            return;
        }	
        var highestDegreeLUCache = staticDataResponse.DataList;
        if (highestDegreeLUCache != null && highestDegreeLUCache != '') {
            jQuery("#jchighestdegreelist").setTemplate(jQuery("#jTemplateHolder_JCHighestDegree").html());
            jQuery("#jchighestdegreelist").processTemplate({ "jchighestdegree": highestDegreeLUCache });
        }
        jQuery("#facets_jchdg").children().removeAttr("checked");

        jQuery.each(response.SelectedHighestDegreeList, function (i, item) {
            if (item) {
                jQuery("#jchighestdegree_" + item).attr("checked", "checked");
            }
        });

        if (response.FacetOpen) {
            openFacet("jchighestdegreeheader");
        }
        else {
            closeFacet("jchighestdegreeheader");
        }

        jQuery("#listitem_jchighestdegree").show();
	
        BindSearchFieldTally("#facets_jchdg", "change", "JobCentral highest degree type changed");		//tallies per checkbox ticked
    }

    function displayNationality(response,staticDataResponse) {
        if (response.Status != "Ok" || staticDataResponse.Status != "Ok") {
            return;
        }	
        var nationalityDataList = staticDataResponse.DataList;
        if (nationalityDataList != null && nationalityDataList != '') {
            jQuery("#nationalitylist").setTemplate(jQuery("#jTemplateHolder_Nationality").html());
            jQuery("#nationalitylist").processTemplate({ "nationality": nationalityDataList });
        }
        jQuery("#facets_nat").children().removeAttr("checked");

        jQuery.each(response.SelectedNationalityList, function (i, item) {
            if (item) {
                jQuery("#jcnationality_" + item).attr("checked", "checked");
            }
        });

        if (response.FacetOpen) {
            openFacet("nationalityheader");
        }
        else {
            closeFacet("nationalityheader");
        }

        jQuery("#listitem_nationality").show();
	
        BindSearchFieldTally("#facets_nat", "change", "nationality type changed");		//tallies per checkbox ticked
    }

    function displaySchoolFlag(response,staticDataResponse) {

        if (response.Status != "Ok" || staticDataResponse.Status != "Ok") {
            return;
        }
        var schoolFlagDataList = staticDataResponse.DataList;
        if (schoolFlagDataList != null && schoolFlagDataList != '') {

            jQuery("#schoolflagslist").setTemplate(jQuery("#jTemplateHolder_SchoolFlag").html());
            jQuery("#schoolflagslist").processTemplate({ "schoolflag": schoolFlagDataList });
        }

        jQuery("#facets_sflags").children().removeAttr("checked");

        //There are different lists that exist for school flags.  Instead of creating a whole new table we are just showing the 12 we need.  
        //If JobCentral decides to add more later they will not need to be hidden which is an added bonus.
      
        jQuery("#schoolflagslist li").hide();
        jQuery("#jcschoolflags_NTU").parent("li").show();
        jQuery("#jcschoolflags_NUS").parent("li").show();
        jQuery("#jcschoolflags_SMU").parent("li").show();
        jQuery("#jcschoolflags_SIT").parent("li").show();
        jQuery("#jcschoolflags_OVERSEAS").parent("li").show();
        jQuery("#jcschoolflags_ITE").parent("li").show();
        jQuery("#jcschoolflags_NP").parent("li").show();
        jQuery("#jcschoolflags_NYP").parent("li").show();
        jQuery("#jcschoolflags_RP").parent("li").show();
        jQuery("#jcschoolflags_SP").parent("li").show();
        jQuery("#jcschoolflags_TP").parent("li").show();
        jQuery("#jcschoolflags_SUTD").parent("li").show();
        

        jQuery.each(response.SelectedSchoolFlagList, function (i, item) {
            if (item) {
                jQuery("#jcschoolflags_" + item).attr("checked", "checked");
            }
        });

   
        if (response.FacetOpen) {
            openFacet("schoolflagheader");
        }
        else {
            closeFacet("schoolflagheader");
        }
    

        jQuery("#listitem_schoolflag").show();

        BindSearchFieldTally("#facets_sflags", "change", "school flag type changed"); 	//tallies per checkbox ticked
    }


    function displayContactName(response) {

        if (response.Status != "Ok") {
            return;
        }

        jQuery('#listitem_contactname').css({ display: 'block' });

        jQuery("#contactname").val(response.ContactName);

        if (response.ContactName != '') {
            openFacet("contactnameheader");
        }
        else {
            closeFacet("contactnameheader");
        }
	
        BindSearchFieldTally("#contactname", "change", "contactname changed");
    }

    function displayReference(response) {

        if (response.Status != "Ok") {
            return;
        }

        jQuery('#listitem_reference').css({ display: 'block' });

        jQuery("#reference").val(response.Reference);

        if (response.Reference != '') {
            openFacet("referenceheader");
        }
        else {
            closeFacet("referenceheader");
        }
	
        BindSearchFieldTally("#reference", "change", "reference changed");
    }

    function displayGender(response) {
        if (response.Status != "Ok") {
            return;
        }

        jQuery("#genderlist").val(response.SelectedGender);

        if (response.FacetOpen) {
            openFacet("genderheader");
        }
        else {
            closeFacet("genderheader");
        }
	
        BindSearchFieldTally("#genderlist", "change", "gender changed");
    }

    function displayAge(response) {
        if (response.Status != "Ok") {
            return;
        }

        jQuery("#AGEL").val(response.SelectedAgeLow);
        jQuery("#AGEH").val(response.SelectedAgeHigh);

        if (response.FacetOpen) {
            openFacet("ageheader");
        }
        else {
            closeFacet("ageheader");
        }

        jQuery("#listitem_age").show();
	
        BindSearchFieldTally("#AGEL", "change", "lower age changed");
        BindSearchFieldTally("#AGEH", "change", "upper age changed");
    }

    function displayNurseLicense(response) {
        if (response.Status != "Ok") {
            return;
        }

        if (response.NurseLicenseSelection == true) {
            jQuery("#nurselicense").attr("checked", "checked");
        }
        else {
            jQuery("#nurselicense").removeAttr("checked");
        }

        jQuery('#facets_nurselicense').css({ display: 'block' });

        if (response.NurseLicenseSelection == true) {
            openFacet("nlcheader");
        }
        else {
            closeFacet("nlcheader");
        }

        jQuery('#listitem_nlc').css({ display: 'block' });
	
        BindSearchFieldTally("#nurselicense", "change", "nurselicense changed");
    }

    function displaySoftware(response) {
        if (response.Status != "Ok") {
            return;
        }

        jQuery("#software").val(response.SelectedSoftware);

        if (response.SelectedSoftware != '') {
            openFacet("softwareheader");
        }
        else {
            closeFacet("softwareheader");
        }
	
        BindSearchFieldTally("#software", "change", "software changed");
    }

    function displaySFCounty(response) {
        if (response.Status != "Ok") {
            return;
        }

        jQuery("#ddlSFCounty").val(response.SelectedCountyList);
        BindSearchFieldTally("#ddlSFCounty", "change", "SFCounty dropdown changed");
    }

    function displaySFPostalCode(response) {
        if (response.Status != "Ok") {
            return;
        }
        jQuery("#txtSFPostalCode").val(response.SFPostalCode);
        BindSearchFieldTally("#txtSFPostalCode", "change", "SFPostalCode changed");
    }

    function displaySFArea(response) {
        var areaValues;
        var i;
        var j;

        if (response.Status != "Ok") {
            return;
        }

        if (response.SearchCriteria.NewStrCrit.indexOf('SF_AREA') != -1) {
            i = response.SearchCriteria.NewStrCrit.indexOf('SF_AREA');
            j = response.SearchCriteria.NewStrCrit.indexOf(';;');

            areaValues = response.SearchCriteria.NewStrCrit.substring(i + 8, j);
        }
        jQuery("#ddlarea").val(areaValues + ";");

        SetSFLocationsFields();
	
        BindSearchFieldTally("#ddlarea", "change", "SFArea changed");		//doesn't work, displaySFArea() never gets called
    }

    function displaySFNMCCheckbox(response) {
        if (response.Status != "Ok") {
            return;
        }
        jQuery('#listitem_SfNMCCheckbox').css({ display: 'block' });
        if (response.NMC == "True") {
            jQuery("#SFNMC").attr("checked", "checked");
        }
        else {
            jQuery("#SFNMC").removeAttr("checked");
        }
	
        BindSearchFieldTally("#SFNMC", "change", "NMC registered candidates only toggle");
    }

    function displayCareerLevel(response) {
        if (response.Status != "Ok") {
            return;
        }

        jQuery("#careerlevel").val(response.SelectedCareerLevel);

        if (response.SelectedCareerLevel != '') {
            openFacet("careerlevelheader");
        }
        else {
            closeFacet("careerlevelheader");
        }
	
        BindSearchFieldTally("#careerlevel", "change", "careerlevel changed");
    }

    function displaySpecialism(response) {
        if (response.Status != "Ok") {
            return;
        }

        jQuery("#specialism").val(response.SelectedSpecialism);

        if (response.SelectedSpecialism != '') {
            openFacet("specialismheader");
        }
        else {
            closeFacet("specialismheader");
        }
	
        BindSearchFieldTally("#specialism", "change", "specialism changed");
    }

    function displayTechnoDatabase(response) {
        if (response.Status != "Ok") {
            return;
        }

        jQuery("#technoDatabase").val(response.SelectedTechno);

        if (response.SelectedTechno != '') {
            openFacet("technodatabaseheader");
        }
        else {
            closeFacet("technodatabaseheader");
        }
	
        BindSearchFieldTally("#technoDatabase", "change", "technoDatabase changed");	//tallies each selection change; e.g. ctrl+click N selections registers N tallies
    }

    function displayTechnoLanguage(response) {

        if (response.Status != "Ok") {
            return;
        }

        jQuery("#technoLanguage").val(response.SelectedTechno);

        if (response.SelectedTechno != '') {
            openFacet("technolanguageheader");
        }
        else {
            closeFacet("technolanguageheader");
        }
	
        BindSearchFieldTally("#technoLanguage", "change", "technoLanguage changed");	//tallies each selection change; e.g. ctrl+click N selections registers N tallies
    }

    function displayAvailability(response) {

        if (response.Status != "Ok") {
            return;
        }

        jQuery("#availability").val(response.SelectedValue);

        if (response.SelectedValue != '') {
            openFacet("availabilityheader");
        }
        else {
            closeFacet("availabilityheader");
        }
	
        BindSearchFieldTally("#availability", "change", "availability changed");
    }

    function displayTechnoSystem(response) {

        if (response.Status != "Ok") {
            return;
        }

        jQuery("#technoSystem").val(response.SelectedTechno);

        if (response.SelectedTechno != '') {
            openFacet("technosystemheader");
        }
        else {
            closeFacet("technosystemheader");
        }
	
        BindSearchFieldTally("#technoSystem", "change", "technoSystem changed");	//tallies each selection change; e.g. ctrl+click N selections registers N tallies
    }

    function displayTechnoMethod(response) {

        if (response.Status != "Ok") {
            return;
        }

        jQuery("#technoMethod").val(response.SelectedTechno);

        if (response.SelectedTechno != '') {
            openFacet("technomethodheader");
        }
        else {
            closeFacet("technomethodheader");
        }
	
        BindSearchFieldTally("#technoMethod", "change", "technoMethod changed");	//tallies each selection change; e.g. ctrl+click N selections registers N tallies
    }

    function displayTechnoNetwork(response) {

        if (response.Status != "Ok") {
            return;
        }

        jQuery("#technoNetwork").val(response.SelectedTechno);

        if (response.SelectedTechno != '') {
            openFacet("technonetworkheader");
        }
        else {
            closeFacet("technonetworkheader");
        }
	
        BindSearchFieldTally("#technoNetwork", "change", "technoNetwork changed");	//tallies each selection change; e.g. ctrl+click N selections registers N tallies
    }

    function displayTechnoOthers(response) {

        if (response.Status != "Ok") {
            return;
        }

        jQuery("#technoOthers").val(response.SelectedTechno);

        if (response.SelectedTechno != '') {
            openFacet("technoothersheader");
        }
        else {
            closeFacet("technoothersheader");
        }
	
        BindSearchFieldTally("#technoOthers", "change", "technoOthers changed");	//tallies each selection change; e.g. ctrl+click N selections registers N tallies
    }

    function displaySector(response) {
        if (response.Status != "Ok") {
            return;
        }

        jQuery("#sector").val(response.SelectedSector);

        if (response.SelectedSector != '') {
            openFacet("sectorheader");
        }
        else {
            closeFacet("sectorheader");
        }
	
        BindSearchFieldTally("#sector", "change", "sector changed");
    }

    function displaySoftwareLevel(response) {
        if (response.Status != "Ok") {
            return;
        }

        jQuery("#softwarelevel").val("");
        for (i = 2; i <= 4; i++) {
            jQuery("#softwarelevel" + i).val("");
            jQuery("#softwarelevel" + i + "set").hide();
        }

        g_softwarelevelid = 1;

        jQuery.each(response.SelectedSoftwareLevelList, function (i, item) {
            if (i == 0) {
                jQuery("#softwarelevel").val(item);
                if (item != '') {
                    openFacet("softwarelevelheader");
                }
            }
            else {
                if (item != "") {
                    openFacet("softwarelevelheader");
                    g_softwarelevelid += 1;
                    jQuery("#softwarelevel" + g_softwarelevelid).val(item);
                    jQuery("#softwarelevel" + g_softwarelevelid + "set").show();
                }
            }
        });

        if (g_softwarelevelid == 3) {
            jQuery("#addsoftwarelevel").hide();
        }
        else {
            jQuery("#addsoftwarelevel").show();
        }        
    
        BindSearchFieldTally("#softwarelevel", "change", "softwarelevel changed");
        BindSearchFieldTally("#softwarelevel2set", "change", "softwarelevel2 changed");
        BindSearchFieldTally("#softwarelevel3set", "change", "softwarelevel3 changed");
        BindSearchFieldTally("#softwarelevel4set", "change", "softwarelevel4 changed");
	
        BindSearchFieldTally("#addsoftwarelevel", "click", "softwarelevel added");
        BindSearchFieldTally("img[class='removesoftwarelevel']", "click", "softwarelevel removed");
    }

    function addSoftwareLevel() {
        g_softwarelevelid += 1;
        jQuery("#softwarelevel" + g_softwarelevelid + "set").show();
        jQuery("#softwarelevel" + g_softwarelevelid).focus();

        previousLevel = parseInt(g_softwarelevelid) - 1;

        jQuery("#softwarelevel" + previousLevel + "set").find("img").hide();

        if (g_softwarelevelid == 4) {
            jQuery("#addsoftwarelevel").hide();
        }
    }

    function removeSoftwareLevel(parentid, fieldid) {
        jQuery("#" + fieldid).val("");
        jQuery("#" + parentid).hide();
        jQuery("#addsoftwarelevel").show();
        g_softwarelevelid -= 1;

        jQuery("#softwarelevel" + g_softwarelevelid + "set").find("img").show();
    }

    ///////////////////////////////////////////////////////////////////////////////
    //
    // LUCache-dependent
    //
    ///////////////////////////////////////////////////////////////////////////////

    function displayWorkStatus(response) {
        if (response.Status != "Ok") {
            return;
        }

        if (g_workStatusLUCache != null && g_workStatusLUCache != '') {
            jQuery("#workstatuslist").setTemplate(jQuery("#jTemplateHolder_WorkStatus").html());
            jQuery("#workstatuslist").processTemplate({ "workstatus": g_workStatusLUCache });
        }

        jQuery("#facets_wst").children().removeAttr("checked");

        jQuery.each(response.SelectedWorkStatusList, function (i, item) {
            if (item) {
                jQuery("#" + item).attr("checked", "checked");
            }
        });

        if (response.FacetOpen) {
            openFacet("workstatusheader");
        }
        else {
            closeFacet("workstatusheader");
        }

        jQuery("#listitem_workstatus").show();
	
        BindSearchFieldTally("#facets_wst", "change", "work status type changed");		//tallies per checkbox ticked
    }

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

    function displayClearanceLevel(response) {
        if (response.Status != "Ok") {
            return;
        }

        jQuery("#clearancelevel").val("");
        for (i = 2; i <= 3; i++) {
            jQuery("#clearancelevel" + i).val("");
            jQuery("#clearancelevel" + i + "set").hide();
        }

        g_clearancelevelid = 1;

        jQuery.each(response.SelectedClearanceLevelList, function (i, item) {
            if (i == 0) {
                jQuery("#clearancelevel").val(item);
            }
            else {
                if (item != "") {
                    g_availableClearanceLevels.shift();
                    g_clearancelevelid += 1;
                    jQuery("#clearancelevel" + g_clearancelevelid).val(item);
                    jQuery("#clearancelevel" + g_clearancelevelid + "set").show();
                }
            }
        });

        if (g_availableClearanceLevels.length == 0) {
            jQuery("#addclearancelevel").hide();
        }
        else {
            jQuery("#addclearancelevel").show();
        }


        if (response.FacetOpen) {
            openFacet("clearancelevelheader");
        }
        else {
            closeFacet("clearancelevelheader");
        }
	
        BindSearchFieldTally("#clearancelevel", "change", "clearancelevel changed");
        BindSearchFieldTally("#clearancelevel2set", "change", "clearancelevel2 changed");
        BindSearchFieldTally("#clearancelevel3set", "change", "clearancelevel3 changed");
	
        BindSearchFieldTally("#addclearancelevel", "click", "language added");
        BindSearchFieldTally("img[class='removeclearancelevel']", "click", "language removed");
    }

    function displayResumeTitle(response) {
        if (response.Status != "Ok") {
            return;
        }

        jQuery("#resumetitle").val(response.ResumeTitle);

        jQuery('#resumetitleuse').empty();

        if (g_useListLUCache != null && g_useListLUCache != '') {
            jQuery.each(g_useListLUCache, function (i, item) {
                jQuery('#resumetitleuse').append(jQuery('<option></option>').val(item.Key).html(item.Value));
            });
        }

        if (ScriptVariables.Get('bShowResumeTitleUseFacet') == 'true') {
            jQuery("#resumetitleuse").val(response.ResumeTitleUse);
        } else {
            jQuery("#resumetitleuse").val("BOO");
            jQuery("#divresumetitleuse").hide();
        }

        if (response.FacetOpen) {
            openFacet("resumetitleheader");
        }
        else {
            closeFacet("resumetitleheader");
        }

        jQuery("#listitem_resumetitle").show();
	
        BindSearchFieldTally("#resumetitle", "change", "resumetitle changed");
        BindSearchFieldTally("#resumetitleuse", "change", "resumetitleuse changed");
    }

    ///////////////////////////////////////////////////////////////////////////////
    //
    //	Links
    //
    ///////////////////////////////////////////////////////////////////////////////

    function displaySaveSearchLink() {
        if (ScriptVariables.Get("savedSearch") == true) {
            jQuery("#saveSearch").show();
            jQuery("#_savedSearch").attr("href", getSaveSearchLink());
        }
    }
