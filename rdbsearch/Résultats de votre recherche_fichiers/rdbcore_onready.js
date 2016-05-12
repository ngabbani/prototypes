// Use this file for any general assignments / event bindings shared between 
// SearchResume and ResumeResults that need to be called on document ready

jQuery(document).ready(function () {
    g_sliceCode = ScriptVariables.Get("RDBSliceCode");

    setLUCache();

    jQuery("input:radio[name=LJGEOTYPE]").on("change", function () {
        var locationSearchType = jQuery('input:radio[name=LJGEOTYPE]:checked').val();

        displayMultiLocation(locationSearchType);
    });

    jQuery("input:radio[name=LJRELGEOTYPE]").on("change", function () {
        var relocationSearchType = jQuery('input:radio[name=LJRELGEOTYPE]:checked').val();

        displayMultiRelocation(relocationSearchType);
    });

    jQuery("#addlocation").on('click', function () {
        addLocation();
    });

    jQuery("#addjobcategory").on('click', function () {
        addJobCategory();
    });

    jQuery("#addlanguage").on('click', function () {
        addLanguage();
    });

    jQuery("#addclearancelevel").on('click', function () {
        addClearanceLevel();
    });

    jQuery("#addsoftwarelevel").on('click', function () {
        addSoftwareLevel();
    });

    jQuery(".removelocation").on('click', function () {
        var parentid = jQuery(this).parent().attr("id");
        var fieldid = parentid.replace("set", "");
        removeLocation(parentid, fieldid);
    });

    jQuery("#facets .removejobcat").on('click', function () {
        var parentid = jQuery(this).parent().attr("id");
        var fieldid = parentid.replace("set", "");
        removeJobCategory(parentid, fieldid);
    });

           jQuery("#facets .removetopjobcat").on('click', function () {
            var parentid = jQuery(this).parent().attr("id");
            var fieldid = parentid.replace("set", "");
            RemoveTopDropBox(parentid, fieldid);
        });

   
        jQuery("#facets .ResetTopLanguage").on('click', function () {
            var parentid = jQuery(this).parent().attr("id");
            var fieldid = parentid.replace("set", "");
            ResetTopLanguage(parentid, fieldid);
        });
    

    jQuery("#facets .removelanguage").on('click', function () {
        var parentid = jQuery(this).parent().attr("id");
        var fieldid = parentid.replace("set", "");
        removeLanguage(parentid, fieldid);
    });

    jQuery("#facets .removeclearancelevel").on('click', function () {
        var parentid = jQuery(this).parent().attr("id");
        var fieldid = parentid.replace("set", "");
        removeClearanceLevel(parentid, fieldid);
    });

    jQuery("#facets .removesoftwarelevel").on('click', function () {
        var parentid = jQuery(this).parent().attr("id");
        var fieldid = parentid.replace("set", "");
        removeSoftwareLevel(parentid, fieldid);
    });

    jQuery(document).on('click', '.recordaffordance.tninvite.available', function () {
        var resumeDID = jQuery(this).find('a').attr('id');
        resumeDID = resumeDID.substring(0, resumeDID.indexOf('_'));
        sendTNInvitation(this, resumeDID);
    });

    if (ScriptVariables.Get('EnableRDBMajorAutoSuggest') == 'true') {
        var sRelativeRootPrefix = ScriptVariables.Get('sURLPrefix');
        if (sRelativeRootPrefix == "") {
            sRelativeRootPrefix = "/";
        }
        jQuery("input#educationmajor").autocomplete1_1(sRelativeRootPrefix + "ajax/majors.aspx", {
            scroll: false,
            formatItem: function (data, i, n, value) {
                var formattedItem = "<div class='majoritem'>" + value + "</div>";
                return formattedItem;
            },
            formatResult: function (data, value) {
                var curString = jQuery("input#educationmajor").val().split(/ or /i);
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
});
