// Use this file for any setting any static data, either from AJAX or LUCache

function setStaticData(response) {

    if (response.SalaryStaticData != null) {
        setSalaryStaticData(response.SalaryStaticData);
    }

    if (response.EmploymentTypeStaticData != null) {
        setEmpTypeStaticData(response.EmploymentTypeStaticData);
    }

        if (response.DriversLicenseStaticData != null) {
            setDriverLicenseStaticData(response.DriversLicenseStaticData);
        }

    if (response.MilitaryExpStaticData != null) {
        setMilitaryExpStaticData(response.MilitaryExpStaticData);
    }

    if (response.ClearanceLevelStaticData != null) {
        setClearanceLevelStaticData(response.ClearanceLevelStaticData);
    }

    if (response.GenderStaticData != null) {
        setGenderStaticData(response.GenderStaticData);
    }

    if (response.GraduationStaticData != null) {
        setGraduationStaticData(response.GraduationStaticData);
    }

    if (response.JobCategoryStaticData != null) {
        setJobCategoryStaticData(response.JobCategoryStaticData);
    }

    if (response.ResumeDegreeStaticData != null) {
        setResumeDegreeStaticData(response.ResumeDegreeStaticData);
    }

    if (response.CountryStaticData != null) {
        setCountryStaticData(response.CountryStaticData);
    }

    if (response.SoftwareStaticData != null) {
        setSoftwareStaticData(response.SoftwareStaticData);
    }

    if (response.SectorStaticData != null) {
        setSectorStaticData(response.SectorStaticData);
    }

	if (response.RegionStaticData != null) {
		setRegionStaticData(response.RegionStaticData);
	}
	
	if (response.RegionFRStaticData != null) {
		setFRRegionStaticData(response.RegionFRStaticData);
	}

	if (response.TechnoDatabaseStaticData != null) {
		setTechnoDatabaseStaticData(response.TechnoDatabaseStaticData);
	}

	if (response.SFCountriesStaticDatas != null) {
		setSFLocationCountriesStaticData(response.SFCountriesStaticDatas);
	}

	if (response.SFCountyStaticDatas != null) {
		setSFLocationCountyStaticData(response.SFCountyStaticDatas);
	}

	if (response.SFAreaStaticDatas != null) {
		setSFLocationAreaStaticData(response.SFAreaStaticDatas);
	}

	if (response.TechnoLanguageStaticData != null) {
		setTechnoLanguageStaticData(response.TechnoLanguageStaticData);
	}

	if (response.AvailabilityStaticData != null) {
		setAvailabilityStaticData(response.AvailabilityStaticData);
	}
	
	if (response.TechnoSystemStaticData != null) {
		setTechnoSystemStaticData(response.TechnoSystemStaticData);
	}

	if (response.TechnoMethodStaticData != null) {
		setTechnoMethodStaticData(response.TechnoMethodStaticData);
	}
	
	if (response.TechnoNetworkStaticData != null) {
		setTechnoNetworkStaticData(response.TechnoNetworkStaticData);
	}
    
	if (response.TechnoOthersStaticData != null) {
		setTechnoOthersStaticData(response.TechnoOthersStaticData);
	}
	
    if (response.SoftwareLevelStaticData != null) {
        setSoftwareLevelStaticData(response.SoftwareLevelStaticData);
    }

    if (response.LanguageProficiency1StaticData != null && response.LanguageProficiency2StaticData != null) {
        setLanguageProficiencyStaticData(response.LanguageProficiency1StaticData, response.LanguageProficiency2StaticData);
    }

    setLocationStaticData();

    if (response.LocationAutocompleteData != null) {
        setLocationAutocomplete(response.LocationAutocompleteData);
    }

    if (response.OutsideCountriesStaticData != null) {
        setOutsideCountriesStaticData(response.OutsideCountriesStaticData);
    }

    setRelocationStaticData(response);

    if (response.SchoolAutocompleteData != null) {
        setSchoolAutocomplete(response.SchoolAutocompleteData);
    }
	
	if (response.CareerLevelStaticData != null) {
		setCareerLevelStaticData(response.CareerLevelStaticData);
	}

	if (response.SpecialismStaticData != null) {
		setSpecialismStaticData(response.SpecialismStaticData);
	}	
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
************ salary static data
*/

function setSalaryStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    g_SalaryQSVar = response.QSVar;

    if (response.DataList != null && response.DataList != '') {
        jQuery("#salarytypelist").setTemplate(jQuery("#jTemplateHolder_SalaryType").html());
        jQuery("#salarytypelist").processTemplate({ "salarytype": response.DataList });
        if (response.DataList.length == 1) {
            jQuery("#salarytypelist").find('input').css({ display: 'none' });
        }
    }
    
}

function getSalaryQSVar() {
    return g_SalaryQSVar;
}

/*
************ employment type static data
*/

function setEmpTypeStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    g_EmpTypeQSVar = response.QSVar;

    if (response.DataList != null && response.DataList != '') {
        jQuery("#emptypelist").setTemplate(jQuery("#jTemplateHolder_EmploymentType").html());
        jQuery("#emptypelist").processTemplate({ "employmenttype": response.DataList });
    }
}

function getEmpTypeQSVar() {
    return g_EmpTypeQSVar;
}

/*
************ military experience static data
*/

function setMilitaryExpStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    g_MilitaryExpQSVar = response.QSVar;

    if (response.DataList != null && response.DataList != '') {
        jQuery("#militaryexplist").setTemplate(jQuery("#jTemplateHolder_MilitaryExp").html());
        jQuery("#militaryexplist").processTemplate({ "militaryexp": response.DataList });
    }
}

function getMilitaryExpQSVar() {
    return g_MilitaryExpQSVar;
}

/*
************ clearance level static data
*/
function setClearanceLevelStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    g_ClearanceLevelQSVar = response.QSVar;

    jQuery('#clearancelevel').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#clearancelevel').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });

    for (i = 2; i <= 3; i++) {
        jQuery.each(response.DataList, function (j, item) {
            jQuery('#clearancelevel' + i).append(jQuery('<option></option>').val(item.Key).html(item.Value));
        });
    }

    jQuery('#listitem_clearancelevel').css({ display: 'block' });
}

/*
************ gender static data
*/
function setGenderStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }
    jQuery('#genderlist').attr('name', response.QSVar);

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#genderlist').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });

    jQuery('#listitem_gender').css({ display: 'block' });
}

/*
************ graduation static data
*/

function setGraduationStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#mingraduationmonthlist').attr('name', response.QSVar + "MONTHL");
    jQuery('#maxgraduationmonthlist').attr('name', response.QSVar + "MONTHH");

    jQuery('#mingraduationmonthlist').append(jQuery('<option></option>').val('').html('Min Month'));
    jQuery('#maxgraduationmonthlist').append(jQuery('<option></option>').val('').html('Max Month'));

    jQuery.each(response.MonthList, function (i, item) {
        jQuery('#mingraduationmonthlist').append(jQuery('<option></option>').val(item.Key).html(item.Value));
        jQuery('#maxgraduationmonthlist').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });

    jQuery('#mingraduationyearlist').attr('name', response.QSVar + "YEARL");
    jQuery('#maxgraduationyearlist').attr('name', response.QSVar + "YEARH");

    jQuery('#mingraduationyearlist').append(jQuery('<option></option>').val('').html('Min Year'));
    jQuery('#maxgraduationyearlist').append(jQuery('<option></option>').val('').html('Max Year'));

    jQuery.each(response.YearList, function (i, item) {
        jQuery('#mingraduationyearlist').append(jQuery('<option></option>').val(item).html(item));
        jQuery('#maxgraduationyearlist').append(jQuery('<option></option>').val(item).html(item));
    });

    jQuery('#facets_graduationrange').css({ display: 'block' });
}

/*
************ degree static data
*/

function setResumeDegreeStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#education').empty();
    jQuery('#maxeducation').empty();

    jQuery('#education').attr('name', response.QSVar);
    jQuery('#maxeducation').attr('name', 'MAX' + response.QSVar);

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#education').append(jQuery('<option></option>').val(item.Key).html(item.Value));
        jQuery('#maxeducation').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });

    jQuery('#listitem_education').css({ display: 'block' });
    jQuery('#facets_mne').css({ display: 'block' });
    jQuery('#facets_mxe').css({ display: 'block' });
}

/*
************ country static data
*/

function setCountryStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#country').attr('name', response.QSVar);

    jQuery('#country').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#country').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });

    //openFacet("countryheader");

    if (response.DataList.length > 1) {
        jQuery('#listitem_country').css({ display: 'block' });
    }
}

/*
************ driver license static data
*/

function setDriverLicenseStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    g_DrvLicQSVar = response.QSVar;

    if (response.DataList != null && response.DataList != '') {
        jQuery("#driverlicenselist").setTemplate(jQuery("#jTemplateHolder_DriversLicense").html());
        jQuery("#driverlicenselist").processTemplate({ "driverslicense": response.DataList });
    }
}

function getDrvLicQSVar() {
    return g_DrvLicQSVar;
}

/*
************ software static data
*/
function setSoftwareStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#software').attr('name', response.QSVar);

    jQuery('#software').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#software').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });

    if (response.DataList.length > 0) {
        jQuery('#listitem_software').css({ display: 'block' });
    }
}

function setSFLocationCountriesStaticData(response) {

    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#ddlSFCountries').attr('name', response.QSVar);

    jQuery('#ddlSFCountries').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#ddlSFCountries').append(jQuery('<option></option>').val(item.Key).html(item.Value).attr("title", item.Value));
    });

    if (response.DataList.length > 0) {
        jQuery('#sfLocationDiv').css({ display: 'block' });
    }
}

function setSFLocationAreaStaticData(response) {

    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#ddlarea').attr('name', response.QSVar);

    jQuery('#ddlarea').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#ddlarea').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });
}

function setSFLocationCountyStaticData(response) {

    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#ddlSFCounty').attr('name', response.QSVar);

    jQuery('#ddlSFCounty').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#ddlSFCounty').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });
}

function setAvailabilityStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#availability').attr('name', response.QSVar);

    jQuery('#availability').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#availability').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });

    if (response.DataList.length > 0) {
        jQuery('#listitem_availability').css({ display: 'block' });
    }
}

/*
************ sector static data
*/

function setSectorStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#sector').attr('name', response.QSVar);

    jQuery('#sector').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#sector').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });

    if (response.DataList.length > 0) {
        jQuery('#listitem_sector').css({ display: 'block' });
    }
}

/*
************ French regions static data
*/

function setFRRegionStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#FRRegion').attr('name', response.QSVar);

    jQuery('#FRRegion').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#FRRegion').append(jQuery('<option></option>').val(item.Key).html(item.Value).addClass("locations").attr("title", item.Value));
    });

    if (response.DataList.length > 0) {
        jQuery('#listitem_regionFR').css({ display: 'block' });
    }
}

/*
************ Regions static data
*/
function setRegionStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#Region').attr('name', response.QSVar);

    jQuery('#Region').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#Region').append(jQuery('<option></option>').val(item.Key).html(item.Value).addClass("locations").attr("title", item.Value));
    });

    if (response.DataList.length > 0) {
        jQuery('#listitem_region').css({ display: 'block' });
    }
}

/*
************ software level static data
*/

function setSoftwareLevelStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#softwarelevel').empty();

    jQuery('#softwarelevel').attr('name', response.QSVar);

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#softwarelevel').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });

    for (i = 2; i <= 4; i++) {
        jQuery('#softwarelevel' + i).attr('name', response.QSVar);
        jQuery.each(response.DataList, function (j, item) {
            jQuery('#softwarelevel' + i).append(jQuery('<option></option>').val(item.Key).html(item.Value));
        });
    }

    jQuery('#listitem_softwarelevel').css({ display: 'block' });
}

/*
************ language proficiency static data
*/

function setLanguageProficiencyStaticData(response1, response2) {
    if (response1.Status != 'Ok' || response2.Status != 'Ok') {
        return;
    }

    jQuery('#ddllanguage1').empty();
    jQuery('#ddlprof1').empty();
    jQuery('#ddllanguage2').empty();
    jQuery('#ddlprof2').empty();

    if (response1.DataList.length > 0 && response1.DataList2.length > 0) {
        if (response2.DataList.length > 0 && response2.DataList2.length > 0) {
            jQuery('#listitem_languageprof').css({ display: 'block' });
        }
    }

    if (response1.DataList != null && response1.DataList2 != null) {
        jQuery.each(response1.DataList, function (i, item) {
            jQuery('#ddllanguage1').append(jQuery('<option></option>').val(item.Key).html(item.Value));
        });
        jQuery.each(response1.DataList2, function (i, item) {
            jQuery('#ddlprof1').append(jQuery('<option></option>').val(item.Key).html(item.Value));
        });
    }
    if (response2.DataList != null && response2.DataList2 != null) {
        jQuery.each(response2.DataList, function (i, item) {
            jQuery('#ddllanguage2').append(jQuery('<option></option>').val(item.Key).html(item.Value));
        });
        jQuery.each(response2.DataList2, function (i, item) {
            jQuery('#ddlprof2').append(jQuery('<option></option>').val(item.Key).html(item.Value));
        });
    }
}

/*
************ location static data
*/

function setLocationStaticData(response) {
    for (i = 2; i <= 3; i++) {
        jQuery("#loc" + i).attr('name', 'LOC');
    }
}

/*
************ location autocomplete
*/

function setLocationAutocomplete(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery("input.location").each(autocompleteLocation);
}

/*
************ school autocomplete
*/

function setSchoolAutocomplete(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery("input.school").each(autocompleteSchoolName);
}

/*
************ careerlevel static data
*/

function setCareerLevelStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#careerlevel').attr('name', response.QSVar);

    jQuery('#careerlevel').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#careerlevel').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });

    if (response.DataList.length > 0) {
        jQuery('#listitem_careerlevel').css({ display: 'block' });
    }
}

/*
************ specialism static data
*/

function setSpecialismStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#specialism').attr('name', response.QSVar);

    jQuery('#specialism').empty();

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#specialism').append(jQuery('<option></option>').val(item.Key).html(item.Value));
    });

    if (response.DataList.length > 0) {
        jQuery('#listitem_specialism').css({ display: 'block' });
    }
}

function setOutsideCountriesStaticData(response) {
    if (response.Status != 'Ok') {
        return;
    }

    jQuery('#OutsideCountries').attr('name', response.QSVar);

    jQuery.each(response.DataList, function (i, item) {
        jQuery('#OutsideCountries').append(jQuery('<option></option>').val(item.Key).html(item.Value).addClass("outsidecountries").attr("title", item.Value));
    });

    jQuery('#facets_regiontype').css({ display: 'block' });

    openFacet("regionFRheader");
}

function setLUCache() {
    if (ScriptVariables.Get('freshnessListLUCache') != '') {
        g_freshnessListLUCache = jQuery.parseJSON(ScriptVariables.Get('freshnessListLUCache'));
    }

    if (ScriptVariables.Get('radiusUnitsListLUCache') != '') {
        g_radiusUnitsListLUCache = jQuery.parseJSON(ScriptVariables.Get('radiusUnitsListLUCache'));
    }

    if (ScriptVariables.Get('useListLUCache') != '') {
        g_useListLUCache = jQuery.parseJSON(ScriptVariables.Get('useListLUCache'));
    }

    if (ScriptVariables.Get('educationLUCache') != '') {
        g_educationLUCache = jQuery.parseJSON(ScriptVariables.Get('educationLUCache'));
    }

    if (ScriptVariables.Get('languageLUCache') != '') {
        g_languageLUCache = jQuery.parseJSON(ScriptVariables.Get('languageLUCache'));
    }

    if (ScriptVariables.Get('workStatusLUCache') != '') {
        g_workStatusLUCache = jQuery.parseJSON(ScriptVariables.Get('workStatusLUCache'));
    }

	if (ScriptVariables.Get('nationalityLUCache') != '') {
        g_nationalityLUCache = jQuery.parseJSON(ScriptVariables.Get('nationalityLUCache'));
    }
	
	if (ScriptVariables.Get('jchighestDegreeLUCache') != '') {
        g_jchighestdegreeLUCache = jQuery.parseJSON(ScriptVariables.Get('jchighestDegreeLUCache'));
    }
	
    if (ScriptVariables.Get('securityClearanceLUCache') != '') {
        g_securityClearanceLUCache = jQuery.parseJSON(ScriptVariables.Get('securityClearanceLUCache'));
    }
}
