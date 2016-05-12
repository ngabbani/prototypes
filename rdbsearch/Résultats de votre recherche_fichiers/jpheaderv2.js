var AcctManagerEmail = '';
var AcctExecEmail = '';
var INTL = false;
var HeaderInfo = "";
var HostSiteHasMultiLanguage = false;

jQuery(document).ready(function () {

    var subMenuItems = new Array("utilAcctExec", "utilAcctManager", "utilUserName", "utilLang");

    INTL = ScriptVariables.Get("INTL");
    HostSiteHasMultiLanguage = ScriptVariables.Get("HostSiteHasMultiLanguage");
    HeaderInfo = ScriptVariables.Get("HeaderInformation");

    jQuery('#utilAcctExec').click(function () {
        highlightHeader(this.id);
        showMySubMenu(this.id, subMenuItems);
        changeArrowDown(this.id);
    });
    jQuery('#utilAcctExec').mouseleave(function () {
        removehighlightHeader(this.id);
        hideMySubMenu(this.id, subMenuItems);
        changeArrowUp(this.id);
    });
    jQuery('#utilAcctManager').click(function () {
        highlightHeader(this.id);
        showMySubMenu(this.id, subMenuItems);
        changeArrowDown(this.id);
    });
    jQuery('#utilAcctManager').mouseleave(function () {
        removehighlightHeader(this.id);
        hideMySubMenu(this.id, subMenuItems);
        changeArrowUp(this.id);
    });
    jQuery('#utilUserName').click(function () {
        highlightHeader(this.id);
        showMySubMenu(this.id, subMenuItems);
        changeArrowDown(this.id);
    });
    jQuery('#utilUserName').mouseleave(function () {
        removehighlightHeader(this.id);
        hideMySubMenu(this.id, subMenuItems);
        changeArrowUp(this.id);
    });

    jQuery('#utilLang').click(function () {
        highlightHeader(this.id);
        showMySubMenu(this.id, subMenuItems);
        changeArrowDown(this.id);
    });
    jQuery('#utilLang').mouseleave(function () {
        removehighlightHeader(this.id);
        hideMySubMenu(this.id, subMenuItems);
        changeArrowUp(this.id);
    });

    if (HostSiteHasMultiLanguage == true) {
        if (document.documentElement.offsetWidth >= 610) {
            jQuery('#utilLang').show();
        }
    }

    if (INTL == true) {

        jQuery('#AcctManagerSupport').click(function () {
            var qsVar = window.location.search;
            url = ScriptVariables.Get('aURLPrefix') + 'INTL/Share/Help/Faq.aspx';
            window.open(url);
        });

        jQuery('#AcctManagerSupport').hide();
    }
    else {
        jQuery('#AcctManagerSupport').click(function () {
            var qsVar = window.location.search;
            url = ScriptVariables.Get('aURLPrefix') + 'jobposter' + jQuery('#AcctManagerSupport').attr("name") + qsVar;
            window.open(url);
        });
    }

    jQuery('#AcctExecSupport').click(function () {
        var qsVar = window.location.search;
        url = ScriptVariables.Get('aURLPrefix') + jQuery('#AcctExecSupport').attr("name") + qsVar;
        window.open(url);
    });

    jQuery('#AcctExecName').click(function (e) {
        if (INTL != true) {
            var qsVar = window.location.search;
            url = "";
            url = ScriptVariables.Get('aURLPrefix') + jQuery('#AcctExecName').attr("name") + qsVar;

            window.open(url);
        }
    });

    jQuery('#AcctManagerName').click(function (e) {
        if (INTL != true) {
            var qsVar = window.location.search;
            var url = ScriptVariables.Get('aURLPrefix') + jQuery('#AcctManagerName').attr("name") + qsVar;
            if (ScriptVariables.Get('bUpdateContactInformation')) {
                var Pop = jQuery('<div/>').attr('class', 'messagepop pop').appendTo('.utilityBar');
                var Close = jQuery('<div/>').attr('class', 'Close').appendTo(Pop);
                var Title = jQuery('<div/>').attr('class', 'Title').appendTo(Pop);
                var Body = jQuery('<div/>').attr('class', 'msg-body').appendTo(Pop);
                jQuery('.messagepop.pop').fadeIn('fast');
                Body.html('Loading... Please wait');
                jQuery.ajax({
                    url: ScriptVariables.Get('ContactWeb2CaseDataURL'),
                    type: 'GET',
                    success: function (data) {
                        Body.html(data)
                        jQuery('[name="retURL"]').val(window.location.href);
                    },
                    error: function (RequestObject, TextStatus, ErrorThrown) { window.location.href = url; },
                });
                Title.html('Submit Issue');
                jQuery('.messagepop .Close').on('click', function () {
                    jQuery('.messagepop.pop').fadeOut('fast');
                });
            }
            else {
                window.open(url);
            }
        }
    });

    if (jQuery('#accountdsDDL').is(':visible') || jQuery('#AccountDropdown').length > 0) {
        if (HeaderInfo != "") {
            buildDropDown(HeaderInfo);
        }
        else {
            getAccountsList();
        }
    }

    jQuery('#accountdsDDL').change(function (event) {
        changeAccount();
        //alert("hello");
    });

    jQuery('#ClickOnDemand').click(function () {
        CB.Tally('CVOnDemand', 'ClickOnDemand', 'ClickOnDemand');
    });

    //NAV TRACKING
    jQuery("#JPTopNav a").bind("click", function () {
        SCLinkTrackingNav(jQuery(this).html(), true, 'JPTopNav');
    });
    jQuery("#JPLeftNav a").bind("click", function () {
        SCLinkTrackingNav(jQuery(this).html(), true, 'JPLeftNav');
    });
    jQuery("#JPBreadcrumb a").bind("click", function () {
        SCLinkTrackingNav(jQuery(this).html(), true, 'JPBreadcrumb');
    });
    jQuery("#JobPosterNavBar a.expanddown").bind("click", function () {
        SCLinkTrackingNav(jQuery(this).children('div').html(), true, 'JPPosterNavBarHeaderItems');
    });
    jQuery("#JobPosterNavBar a.expandnone").bind("click", function () {
        SCLinkTrackingNav(jQuery(this).children('div').html(), true, 'JobPosterNavBarDropDownItems');
    });
});

var SCLinkTrackingNav = function (name, delayForNextRequest, extraParam) {
    if (typeof s_gi == 'function' && s_account && s_cb) {
        var prefix = (s_cb.pageName || 'NOPREFIX') + ' : ';
        var s = s_gi(s_account);

        if (extraParam != 'JPLeftNav')
            prefix = '';

        if (s) {
            if (delayForNextRequest) {
                s.tl(this, 'o', 'EmpNav-' + extraParam + ' : ' + prefix + name);
            }
            else {
                s.tl(true, 'o', 'EmpNav-' + extraParam + ' : ' + prefix + name);
            }
        }
    }
};

function changeAccount() {
    var did = jQuery('#accountdsDDL option:selected').val();

    if (did != "0") {
        jQuery.ajax({
            async: true,
            type: "POST",
            data: { 'accountDID': did },
            url: ScriptVariables.Get('aURLPrefix') + "JobPoster/Ajax/UtilityBarAJAX.aspx",
            success: function (msg) {
                var sURL = ScriptVariables.Get('aURLPrefix') + "JobPoster/MyCB.aspx?Sc_Cmp2=JP_UtilityBar_ChangeAccount";
                window.location.href = sURL;
            },

            error: function (xhr, status, error) {
                return error + " " + status;
            }
        });
    }

}

function getAccountsList() {
    var returnVal = '';
    jQuery.ajax({
        async: true,
        cache: false,
        type: "GET",
        url: ScriptVariables.Get('aURLPrefix') + "JobPoster/Ajax/UtilityBarAJAX.aspx",
        success: function (msg) {
            var objectType = typeof (msg)
            if (objectType == "object") {
                msg = "";
            }
            returnVal = msg;
            buildDropDown(returnVal);
        },

        error: function (xhr, status, error) {
            return error + " " + status;
        }
    });
}

function buildDropDown(jsonString) {
    var data = jsonString.split("$*$");
    var json = jQuery.parseJSON(data[0]);
    jQuery.each(json, function () {
        var did = this.DID;
        var name = this.Name;
        jQuery('#accountdsDDL, #AccountDropdown').append(jQuery("<option></option>").attr("value", did).text(name));
    });

    var currentAccount = data[2];
    jQuery('#accountdsDDL, #AccountDropdown').val(currentAccount);

    var accountInfoJSON = data[1];
    buildAccountInfo(accountInfoJSON);
}

function highlightHeader(id) {
    jQuery('#' + id).addClass("UtilityHighlight");
}

function removehighlightHeader(id) {
    jQuery('#' + id).removeClass("UtilityHighlight");
}

function showMySubMenu(id, subMenuItems) {
    if (jQuery.inArray(id, subMenuItems) > -1) {
        showSubMenu(id);
    }
}

function showSubMenu(id) {
    jQuery('#' + id + 'Sub').show();
}

function hideMySubMenu(id, subMenuItems) {
    if (jQuery.inArray(id, subMenuItems) > -1) {
        hideSubMenu(id);
    }
}

function hideSubMenu(id) {
    jQuery('#' + id + 'Sub').hide();
}

function changeArrowDown(id) {
    jQuery('#' + id + 'Image').addClass('arrowdown');
}

function changeArrowUp(id) {
    jQuery('#' + id + 'Image').removeClass('arrowdown');
}

function buildAccountInfo(accountInfoJSON) {
    if (needToFillAccountInfo() == true) {
        populateAccountInfo(accountInfoJSON);
        hideConnectIfNotPopulated(accountInfoJSON);
    }
}

function needToFillAccountInfo() {
    var needToFillInfo = false;

    if (jQuery('#AcctExecName').empty()) {
        needToFillInfo = true;
    }
    else if (jQuery('#AcctExecPhone').empty()) {
        needToFillInfo = true;
    }
    else if (jQuery('#AcctExecSupport').empty()) {
        needToFillInfo = true;
    }
    else if (jQuery('#AcctManagerName').empty()) {
        needToFillInfo = true;
    }
    else if (jQuery('#AcctManagerPhone').empty()) {
        needToFillInfo = true;
    }
    else if (jQuery('#AcctManagerSupport').empty()) {
        needToFillInfo = true;
    }

    return needToFillInfo
}

function populateAccountInfo(data) {
    var JSON = jQuery.parseJSON(data);

    jQuery('#AcctExecHeader').html(JSON.Account[0].AcctExecHeader);
    jQuery('#AcctExecName').text(JSON.Account[0].AcctExecName);
    jQuery('#AcctExecPhone').text(JSON.Account[0].AcctExecPhone);
    jQuery('#AcctExecName').attr("name", JSON.Account[0].AcctExecConnect);
    AcctExecEmail = JSON.Account[0].AcctExecEmail;

    jQuery('#AcctManagerHeader').html(JSON.Account[0].AcctManagerHeader);
    jQuery('#AcctManagerName').text(JSON.Account[0].AcctManagerName);
    jQuery('#AcctManagerName').attr("name", JSON.Account[0].AcctManagerConnect);

    jQuery('#AcctManagerPhone').text(JSON.Account[0].AcctManagerPhone);
    jQuery('#AcctManagerSupport').text(JSON.Account[0].AcctManagerSupport);
    jQuery('#AcctManagerSupport').attr("name", JSON.Account[0].AcctManagerHelp);
    AcctManagerEmail = JSON.Account[0].AcctManagerEmail;

    if (INTL == true) {
        jQuery("#AcctExecName").removeClass("link");
        jQuery("#AcctExecName").css("color", "black");
        jQuery("#AcctExecName").css("font-size", "12px");
        jQuery("#AcctExecName").css("font-weight", "bold");

        jQuery("#AcctManagerName").removeClass("link");
        jQuery("#AcctManagerName").css("color", "black");
        jQuery("#AcctManagerName").css("font-size", "12px");
        jQuery("#AcctManagerName").css("font-weight", "bold");
    }
    else {
        jQuery("#AcctExecName").css("color", "blue");
        jQuery("#AcctManagerName").css("color", "blue");
    }
}

function hideConnectIfNotPopulated(data) {
    var JSON = jQuery.parseJSON(data);
    if (JSON.Account[0].AcctExecConnect = '') {
        jQuery('#AcctExecSupport').hide();
    }

    if (JSON.Account[0].AcctManagerHelp = '') {
        jQuery('#AcctManagerSupport').hide();
    }
}

