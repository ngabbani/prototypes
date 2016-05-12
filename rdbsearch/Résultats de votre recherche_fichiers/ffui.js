var LastJobTitle = "";
var LastJobDID = "";

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

function inheritPrototype(childObject, parentObject){
	var copyOfParent = Object.create(parentObject.prototype);
	copyOfParent.constructor = childObject;
	childObject.prototype = copyOfParent;
}

var _myFFUI = null;
var exclusionListGlobal = [];
var clickedNext = 2;
var changingPage = 0;
var updateExclusion = 0;
var tninvitedresumeindices = [];
var tnjoinedresumeindices = [];
var emaiIdClick = false
//Can add any more key, value pairs to this list and the code will take care of everything else. One of the keys in the var below will always be checked. Key = id of checkbox, value = true
var oneMustBeUnchecked = [
	{"key": "TNJoined", "value": "False"},
	{"key": "TNInvited", "value": "False"},
	{"key": "TNAvailable", "value": "False"}
];
var oneMustBeUncheckedCount = 0;

var firstEncounter = 1;
var wasChecked = [
    { "key": "Viewed", "value": "False" },
    { "key": "Emailed", "value": "False" },
    { "key": "Forwarded", "value": "False" },
    { "key": "Saved", "value": "False" },
    { "key": "Coworker", "value": "False" },
	{ "key": "TNJoined", "value": "False" },
	{ "key": "TNInvited", "value": "False" },
	{ "key": "TNAvailable", "value": "False" }
];

RegExp.escape = function (s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
};
	
jQuery.fn.highlight = function (pattern) {

    //Escape pattern before passing to RegExp method
    
        pattern = RegExp.escape(pattern);
    
    var regex = typeof (pattern) === "string" ? new RegExp(pattern, "i") : pattern; // assume very LOOSELY pattern is regexp if not string



    function innerHighlight(node, pattern) {
        var skip = 0;
        if (node.nodeType === 3) { // 3 - Text node
            var pos = node.data.search(regex);
            if (pos >= 0 && node.data.length > 0) { // .* matching "" causes infinite loop
                var match = node.data.match(regex); // get the match(es), but we would only handle the 1st one, hence /g is not recommended
                var spanNode = document.createElement('span');
                spanNode.className = 'highlight'; // set css
                var middleBit = node.splitText(pos); // split to 2 nodes, node contains the pre-pos text, middleBit has the post-pos
                var endBit = middleBit.splitText(match[0].length); // similarly split middleBit to 2 nodes
                var middleClone = middleBit.cloneNode(true);
                spanNode.appendChild(middleClone);
                // parentNode ie. node, now has 3 nodes by 2 splitText()s, replace the middle with the highlighted spanNode:
                middleBit.parentNode.replaceChild(spanNode, middleBit);
                skip = 1; // skip this middleBit, but still need to check endBit
            }
        } else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) { // 1 - Element node
            for (var i = 0; i < node.childNodes.length; i++) { // highlight all children
                i += innerHighlight(node.childNodes[i], pattern); // skip highlighted ones
            }
        }
        return skip;
    }

    return this.each(function () {
        innerHighlight(this, pattern);
    });
};

jQuery.fn.removeHighlight = function () {
    return this.find("span.highlight").each(function () {
        this.parentNode.firstChild.nodeName;
        with (this.parentNode) {
            replaceChild(this.firstChild, this);
            normalize();
        }
    }).end();
};


//bug fix for jQueryUI where Chrome and Safari could not scroll during FastFlip
(function( jQuery, undefined ) {
  if (jQuery.ui && jQuery.ui.dialog) {
    jQuery.ui.dialog.overlay.events = jQuery.map('focus,keydown,keypress'.split(','), function(event) { return event + '.dialog-overlay'; }).join(' ');
  }
}(jQuery));


if (ScriptVariables.Get('EnableTagsInFlip') == "true") {
    function populateTagList(did) {
        $("#resumeFlipTagList").html("");
        $("#viewCoworkerFlipTags").hide();
        jQuery("#coworkerFlipTagList").hide();
        jQuery(".addFlipTagLabel").show();

        //Grab tags that are already on the results page.  Saves us from making another AJAX call since we already have access to that info.
        var numberOfTags = jQuery("#" + did + "_resumetaglist").children('.tagName').length;

        if (numberOfTags === 5) {
            jQuery(".addFlipTagLabel").hide();
        }

        var tagsFromResults = jQuery("#" + did + "_resumetaglist").html();
        $("#resumeFlipTagList").html(tagsFromResults);
        $("#resumeFlipTagList .publicTagEnd, #resumeFlipTagList .privateTagEnd").after("<br>");


        var isCoworkerVisible = jQuery("#" + did + ".coworkerTagButton").length;

        if (isCoworkerVisible === 1) {
            $("#viewCoworkerFlipTags").show();
        }
    }
}


function processKeywordsForHighlighting(keywords) {

    if (keywords == "") return "";

    if (ScriptVariables.Get('ReplacePharentesesKeywordsFastFlipHiglighting') == "true") {
        keywords = keywords.replace(/[()]/g, ",") //replaces parentheses spaces with ,
    }

    keywords = keywords.replace(/\s/g, ",");//replaces blank spaces with ,
    
    var arr = keywords.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    //nurse,and,"registered,nurse" becomes [nurse, and, "registered,nurse"]

    //replaces commas between tokens in quotes
    for (var i=0;i<arr.length;i++){
        if (arr[i].indexOf('"') != -1) {
            arr[i] = arr[i].replace(/,/g, " ");
        }
    }

    //replaces quotes and pharentesis
    for (i = 0; i < arr.length; i++) {
        arr[i] = arr[i].replace(/[()]/g, ''); //pharentesis
        arr[i] = arr[i].replace(/["']/g, ""); //quotes 
    }

    var newString = "";
    var token = ""

    if (arr.length == 1) { return arr[0].toUpperCase(); }

    //converts the array to string
    for (i = 0; i < arr.length; i++) {
        token = arr[i].toUpperCase();
        if (token != "AND" && token != "OR" && token != "ANDNOT" && token != "NOT") {
            newString = newString + token + ",";
        }
    }

    if (newString.charAt(newString.length - 1) == ',')
        newString = newString.substring(0, newString.length-1);//remove last comma

    return newString;
}

function startFF(did_optional)
{
	if(_myFFUI == null){
		_myFFUI = new FFUI(DocumentType.Resume, false);
		_myFFUI.loadUIEvents();
	}		  
	
	//needed to bind keyboard events each time fastflip is loaded
	_myFFUI.setupKeyboardEvents();
	
	if(did_optional != null && did_optional != '')
		CB.Tally('mvcresumeclicks', 'fastflip', 'fastflip');
	if(did_optional != null && did_optional != '' && ScriptVariables.Get('Product') == "viewbased")
	{	
		CB.Tally('mvcresumeclicksviewbased', 'fastflip', 'fastflip');
	}
	_myFFUI.startupFastFlip(did_optional);
	
	
		$('#exclusions input[type=checkbox]:not(:checked)').each(function () {
			$(this).removeAttr("checked");
			$(this).removeAttr("disabled", "disabled");
		});
		
		$('#exclusions input[type=checkbox]:checked').each(function () {
			$(this).removeAttr("checked");
			$(this).removeAttr("disabled", "disabled");
		});
		
		oneMustBeUncheckedCount = 0;
		window.exclusionListGlobal = [];
		for (var i = 0; i < oneMustBeUnchecked.length; i++)
		{
			oneMustBeUnchecked[i].value = "False";
		}
	


	    firstEncounter = 0;
	    for (var i = 0; i < wasChecked.length; i++) {
	        wasChecked[i].value = "False";
	    }
        
	    //site castalyst stuff
	    var s = s_gi('cbglobal');
	    s_cb.linkTrackVars = 'prop21';
	    s.prop21 = 'ResumeFlip Started';
	    s_cb.tl(this, 'o', 'On flip');
	

}

jQuery(document).ready(function () {
    //ScriptVariables.Get('FastFlipType') 

    /*jQuery(window.document).bind("keyup", function (event) {
    if (event.keyCode == '76') {
    startFF();
    }
    });*/
    jQuery('#LoadMore').on("click", function () {
         $('#loadspinnerforJobs').show();
        jQuery('html, body').css("cursor", "wait");
        setTimeout(function () { Load1000Jobs() }, 500);
        
        jQuery('html, body').css("cursor", "auto");
    });

    if (ScriptVariables.Get('EnableExclusionFilters') == "true") {
        jQuery("#exclusionsPanel").show();
		
       
            $("#exclusionsPanel").children("h3").text("Exclude");
            $('#exclusions input[type=checkbox]:checked').each(function () {
                $(this).removeAttr("checked");
            });
       


        //Sets values of what's initially checked when flip is first opened
        var exclusionList = [];
        $('#exclusions input[type=checkbox]:checked').each(function () {
            exclusionList.push($(this).val());
        });
        window.exclusionListGlobal = exclusionList;


        jQuery("#exclusions").change(function () {

            //Reset list then update with what's currently checked
            exclusionList = [];
            $('#exclusions input[type=checkbox]:checked').each(function () {
                exclusionList.push($(this).val());
            });

            //Compare lists and set tally
            var CheckedStatus = "";
            var ExcludeAction = "";
            var Difference = [];
            var i = 0;

            
                if (firstEncounter == 0) {
                    firstEncounter = 1;

                    //site castalyst stuff
                    var s = s_gi('cbglobal');
                    s_cb.linkTrackVars = 'prop5';
                    s_cb.linkTrackVars = 'event36';
                    s.events = 'event36';
                    s.prop5 = 'First Check';
                    s_cb.tl(this, 'o', 'First Check');
                }
           

            if (exclusionList.length > window.exclusionListGlobal.length && exclusionList.length != window.exclusionListGlobal.length) {

                CheckedStatus = "checked";

                jQuery.grep(exclusionList, function (el) {
                    if (jQuery.inArray(el, window.exclusionListGlobal) == -1) Difference.push(el);
                    i++;
                });
                
                for (var i = 0; i < Difference.length; i++)
                {
                    for (var j = 0; j < oneMustBeUnchecked.length; j++)
                    {
                        if (oneMustBeUnchecked[j].key == Difference[i])
                        {
                            oneMustBeUnchecked[j].value = "True";
                            oneMustBeUncheckedCount = oneMustBeUncheckedCount + 1;
                        }
                    }
                }
               
                for (var i = 0; i < Difference.length; i++)
                {
                    for (var j = 0; j < wasChecked.length; j++)
                    {
                        if (wasChecked[j].key == Difference[i])
                        {
                            if (wasChecked[j].value == "False")
                            {
                                //site castalyst stuff
                                var s = s_gi('cbglobal');
                                s_cb.linkTrackVars = 'prop5';
                                s.prop5 = Difference[0];
                                s_cb.tl(this, 'o', "fastflip " + Difference[0]);

                                wasChecked[j].value = "True";
                            }
                        }
                    }
                }
            }

            else if (window.exclusionListGlobal.length > exclusionList.length && exclusionList.length != window.exclusionListGlobal.length) {

                CheckedStatus = "unchecked";

                jQuery.grep(window.exclusionListGlobal, function (el) {
                    if (jQuery.inArray(el, exclusionList) == -1) Difference.push(el);
                    i++;
                });

                for (var i = 0; i < Difference.length; i++)
                {
                    for (var j = 0; j < oneMustBeUnchecked.length; j++)
                    {
                        if (oneMustBeUnchecked[j].key == Difference[i])
                        {
                            oneMustBeUnchecked[j].value = "False";
                            oneMustBeUncheckedCount = oneMustBeUncheckedCount - 1;
                        }
                    }
                }
               
            }
			

           
            if (oneMustBeUncheckedCount == oneMustBeUnchecked.length - 1)
            {
                for (var i = 0; i < oneMustBeUnchecked.length; i++)
                {
                    if (oneMustBeUnchecked[i].value == "False")
                    {
                        checkboxToGrayOut = oneMustBeUnchecked[i].key;
                        $('#exclusions input[type=checkbox]:not(:checked)').each(function () {
                            if (checkboxToGrayOut== $(this).val())
                            {
                                $(this).attr("disabled", "disabled");
                            }
                        });
                    }
                }
            }
            else
            {
                $('#exclusions input[type=checkbox]:not(:checked)').each(function () {
                    $(this).removeAttr("disabled", "disabled");
                });
            }

            CB.Tally('FastFlipExclusion', Difference, CheckedStatus);

            var FlipEventLogData = "difference=" + Difference + "&checkedStatus=" + CheckedStatus;

            //event logging
            jQuery.ajax({
                type: "POST",
                url: "../AJAX/" + "ResumeFlipStats.aspx",
                data: FlipEventLogData,
                //dataType: 'json',
                timeout: 40000,
                success: function (msg) {
                    var response = msg;

                    if (response == null) {
                        return;
                    }

                }
            });
           
            window.exclusionListGlobal = exclusionList;
            window.updateExclusion = 1;
            jQuery("#resumeHolder2 #flip_next img#arrow_next").trigger('click');
        });
    }


    jQuery("#FastFlipDialog").dialog({
        autoOpen: false,
        position: 'top',
        modal: true,
        width: 848,
        draggable: false,
        resizable: false,
        height: 'auto',
        dialogClass: 'mt',
        zIndex: 300000
    });


    //wiring up event tracking for SiteCatalyst - tkristjansson 10/30/2013

    //SEARCH OPTIONS TRACKING
    jQuery("#compwrapper").on("focus", "#searchoptionscontainer input[type='text']", function () {        
        var facetContainer = (jQuery(this).closest("li").attr("id") || jQuery(this).closest("li").parent().closest("li").attr("id"));
        var facetItem = (jQuery(this).val() || jQuery(this).attr("name"));
        SCLinkTracking('facetgroup:' + facetContainer);
        SCLinkTracking(facetContainer + ':' + facetItem);
    });
    jQuery("#compwrapper").on("change", "#searchoptionscontainer select, #searchoptionscontainer input[type='radio'], #searchoptionscontainer input[type='checkbox']", function () {
        var facetContainer = (jQuery(this).closest("li").attr("id") || jQuery(this).closest("li").parent().closest("li").attr("id") );
        var facetItem = (jQuery(this).val() || jQuery(this).attr("name"));
        SCLinkTracking('facetgroup:' + facetContainer);
        SCLinkTracking(facetContainer + ':' + facetItem);
    });

    //FACET TRACKING
    jQuery("#compwrapper").on("change", "#facetcontainer input[type='checkbox']", function () {
        var facetContainer = jQuery(this).attr("name");
        var facetItem = jQuery(this).val();
        SCLinkTracking('facetgroup' + ':' + facetContainer); //facet type only
        SCLinkTracking(facetContainer + ':' + facetItem); //facet type and item
    });

    //IN-PAGE TRACKING
    jQuery("#searchresults").on("click", "a, span.addTagLabel, span.publicTagEnd", function () {
        var item;
        if (jQuery(this).attr('class') == 'resumetitle')
            item = 'resumetitle';
        else
            item = (jQuery(this).attr("title") || jQuery(this).html());

        if (this.nodeName == 'A')
            SCLinkTracking('inpagegroup:' + item, true);
        else
            SCLinkTracking('inpagegroup:' + item);
    });

    jQuery("#controlsearchwrapper, #checkAllBatchAction").on("change", "select", function () {
        var item = jQuery(this).attr("id");
        var itemval = jQuery(this).val();
        SCLinkTracking('inpagegroup:' + item);
        SCLinkTracking(item + ':' + itemval);
    });

    jQuery("#controlsearchwrapper").on("click", "a", function () {
        var item = jQuery(this).attr("id");
        SCLinkTracking('inpagegroup:' + item);
    });

    jQuery("#resTabs").on("click", "a", function () {
        var item = jQuery(this).closest("div").attr("id");
        var itemval = jQuery(this).attr('id');
        SCLinkTracking('inpagegroup:' + item);
        SCLinkTracking(item + ':' + itemval);
    });

    //Testing how showing Additional Search Options as open initially will affect interaction rate/usage.
    //jQuery("#listitem_moresearch").show();
    //jQuery("#moresearchicon").css("background-position", "0px 0px");
    //jQuery("ul#moresearchoptionscontainer li.facet").addClass("sectionUnderline");
   
});


var DocumentType = function () {
   return {
		Resume : function() { return "resume" },
		App : function() { return "app" }
	}
}();

var FastFlipGateway = function() {
	var _documentCollection = null;
	var _documentType;
	
	return {
		updateDocumentCollection : function(collection, doctype) { _documentCollection = collection; _documentType = doctype;},
		getDocumentCollection : function(){return _documentCollection;},
		getDocumentType : function(){return _documentType;}
	}
}();

var Utilities = function() {
	return {
		NumberWithCommas : function(x) {return x.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",")},
		SessionTimeout : function(){    
			//IF we are getting the login page, it means that we run out of session time on ajax server
			//lets detect this and have the whole page refresh and it will be kicked to login page.
			location.href = ScriptVariables.Get('LoginURL');
		},
		ShowLoadingFFSpinner: function() {
			var cssObj = {
				'opacity': 0.94
			}
			jQuery("#loadingFFSpinner").css(cssObj).center().show();
		},
		HideLoadingFFSpinner: function() {
			jQuery("#loadingFFSpinner").hide();
		},
		QueryStringEdit: function(url, param) {
			if (url.indexOf(param + '=') != -1) {
				param = param.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

				var regexS = "[\\?&]" + param + "=([^&]*)";
				var regex = new RegExp(regexS);
				var result = regex.exec(url);

				return result;
			}

			return false;
		}
	}
}();

var FFIndex = function(doctype, showIndex)
{
	var _docType = doctype; //USE DocumentType
	var _documents = [];
	var _documentsLiked = [];
	
	var _isLoaded = false;
	var _curSetPage = 1;
	var _showIndexPage = showIndex;
	var _showIndexPageOriginalSetting = showIndex;
	
	var _grandTotalResumeCount = 0;
	var _numberOfPages = 0;
	var _numberOfDocsPerPage = 0;
	
	var _curIndexXHR = null;
	var _stringCrit = ScriptVariables.Get('strcrit');
	var _showingLikesResumes = false;

	var _originalResumeIndexBookmark;
	
	this.getDocumentType = function(){return _docType;};
	this.getDocuments = function(){return _documents;};
	this.setDocuments = function(arr){_documents = arr;};
	
	this.getDocumentsLiked = function(){return _documentsLiked;};
	this.setDocumentsLiked = function(arr){_documentsLiked = arr;};
	
	this.isLoaded = function(){return _isLoaded;};
	this.setIsLoaded = function(data){_isLoaded = data};
	
	this.setCurrentPage = function(data){_curSetPage = data;};
	this.getCurrentPage = function(){return _curSetPage;};
	
	this.setShowIndexPage = function(data){_showIndexPage = data;};
	this.getShowIndexPage = function(){return _showIndexPage;};
	this.setShowIndexPageOriginalSetting = function(){_showIndexPage = _showIndexPageOriginalSetting;};
	
	this.getStringCrit = function(){return _stringCrit;};
	
	this.getTotalResumeCount = function(){if(this.getShowingLikesResumes()){return _documentsLiked.length;}else{return _documents.length;}};
	
	this.getGrandTotalResumeCount = function(){return _grandTotalResumeCount;};
	this.getNumberOfPages = function(){return _numberOfPages;};
	this.getNumberOfDocsPerPage = function(){return _numberOfDocsPerPage;};
	
	this.setGrandTotalResumeCount = function(data){_grandTotalResumeCount = data;};
	this.setNumberOfPages = function(data){_numberOfPages = data;};
	this.setNumberOfDocsPerPage = function(data){_numberOfDocsPerPage = data;};
	
	this.getOriginalResumeIndexBookmark = function(){return _originalResumeIndexBookmark};
	this.setOriginalResumeIndexBookmark = function(data){_originalResumeIndexBookmark = data};
	
	this.getCurIndexXHR = function(){return _curIndexXHR;};
	
	this.getShowingLikesResumes = function(){return _showingLikesResumes;};
	this.setShowingLikesResumes = function(data){_showingLikesResumes = data;};
	
	this.getCurrentWorkingStack = function(){
		if (this.getShowingLikesResumes()) {
			return _documentsLiked;
		}
		else {
			return _documents;
		}
	};
	
	
	this.setupIndexPage = function() {
		var curResumes = this.getCurrentWorkingStack();
		
		if (jQuery("#jTemplateWrapper").size() == 0) {
				jQuery("#jTemplateLikes").append("<div id='jTemplateWrapper'></div>");
		}
		jQuery("#jTemplateWrapper").setTemplate(jQuery("#jTemplateHolder").html());
		jQuery("#jTemplateWrapper").processTemplate({ "resumes": curResumes });

		if (this.getShowingLikesResumes()) {
			jQuery("#indexheader").html(ScriptVariables.Get('LikeIndexCaption'));
			jQuery("#_FastFlip_tbTopActions").show();
			jQuery("#_FastFlip_tbBottomActions").show();
			jQuery(".thumb").remove();
		}
		else {
			if (ScriptVariables.Get('FastFlipType') == DocumentType.App) {
				jQuery("#_FastFlip_tbTopActions").show();
				jQuery("#_FastFlip_tbBottomActions").show();	        	
			}    
			else {
				jQuery(".bulk").remove();        
			}		
			jQuery("#indexheader").html(ScriptVariables.Get('ResumeIndexCaption'));
		}

		jQuery.each(this.getDocumentsLiked(), function (i, item) {
			if (item.getLiked() == true) {
				jQuery("#like_" + item.DID).attr("src", "http://img.icbdr.com/images/images/jpimages/ffthumbsup_on.gif");
				jQuery("#like_" + item.DID).closest("tr").css("background-color", "#faf3da");
				jQuery("#like_" + item.DID).attr("title", ScriptVariables.Get('UnlikeThisResume'));
			}
		});
		

		
		//if (ScriptVariables.Get('IsResumeScoreFeatureEnable')) {
		//	ResumeScoreMatchEngine.loadIndexPageResumeScore();
		//}   
	}
	
	this.clearLikedResumes = function() {
		jQuery("div#actionPanel ul li#like").attr("class", "").attr("title", ScriptVariables.Get('ClickToLike')).children("#spnLike").html(ScriptVariables.Get('locLike'));

		jQuery.each(_documents, function (i, item) {
			item.setLiked(false);
		});

		jQuery.each(_documentsLiked, function (i, item) {
			item.setLiked(false);
			_documentsLiked = [];
		});
		jQuery("#spnLikeCount").html(_documentsLiked.length);
	}

	this.clearResumes = function() {
		_documents = [];
	}
	
	this.isDocumentLiked = function(did){
		var doc = jQuery.grep(this.getDocumentsLiked(), function (res, i) { return res.getDid() == did; });
		return (doc != null && doc.length > 0);
	}
	
}

var FFResumeIndex = function(showIndex)
{
	FFIndex.call(this, DocumentType.Resume, showIndex);
	
	this.findResume = function(did){
		return jQuery.grep(this.getDocuments(), function (res, i) { return res.getDid() == did; });
	}
	
	this.findResumeIndex = function(did){
		for(var i=0; i<this.getDocuments().length; i++)
		{
			if(this.getDocuments()[i].getDid() == did)
				return i;
		}
		
		return -1;
	}
	
	this.LoadProfileContent = function(html, did){
		var myResume = this.findResume(did);
		if(myResume != null && myResume.length == 1)
		{
			myResume[0].setProfileContent(html);
		}
	};
	
	this.Load = function(callbackfunc, obj, did_optional){

		this.setShowIndexPage(showIndex);
	    		
		//FROM MAIN RESUME PAGE
		if(FastFlipGateway.getDocumentCollection() == null)
		{
			//for some reason the stack of resumes from the main page is not available at this time
			jQuery.CBMessageBox('show', {'message': ScriptVariables.Get('ErrorMsg'), 'caption':ScriptVariables.Get('ResumeFlip'), 'confirmString':ScriptVariables.Get('DialogOK')});
			return;
		}
		
		this.clearResumes();
		var resume = null;
		for(var i=0; i<FastFlipGateway.getDocumentCollection().ResumeResultList.Items.length; i++)
		{
			resume = new FFResume(FastFlipGateway.getDocumentCollection().ResumeResultList.Items[i].DID);
			resume.setName(FastFlipGateway.getDocumentCollection().ResumeResultList.Items[i].ContactName);
			resume.setCompany(FastFlipGateway.getDocumentCollection().ResumeResultList.Items[i].RecentCompany);
			if (ScriptVariables.Get('EnableExclusionFilters') == "true")
			{
				var actions = "";
				if (FastFlipGateway.getDocumentCollection().ResumeResultList.Items[i].showUserViewIcon)
				{
					actions += "Viewed;" 
				}
				if (FastFlipGateway.getDocumentCollection().ResumeResultList.Items[i].showUserSaveResume)
				{
					actions += "Saved;" 
				}
				if (FastFlipGateway.getDocumentCollection().ResumeResultList.Items[i].showUserForwardCandidate)
				{
					actions += "Forwarded;" 
				}
				if (FastFlipGateway.getDocumentCollection().ResumeResultList.Items[i].showUserEmailCandidate)
				{
					actions += "Emailed;" 
				}
				if (FastFlipGateway.getDocumentCollection().ResumeResultList.Items[i].showCoworkerActionIcon)
				{
					actions += "Coworker;" 
				}
	            if (ScriptVariables.Get('ShowTNOptions'))
                {
                    if (FastFlipGateway.getDocumentCollection().ResumeResultList.Items[i].IsTNJoined) {
                        actions += "TNJoined;"
                    }
                    else if (FastFlipGateway.getDocumentCollection().ResumeResultList.Items[i].IsTNInvited) {
                        actions += "TNInvited;"
                    }
                    else {
                        actions += "TNAvailable;"
                    }
                }
				resume.setAllActions(actions);
			}
			//resume.setDocDid('');
			//resume.setDocumentTitle('');
			resume.setPosition(FastFlipGateway.getDocumentCollection().ResumeResultList.Items[i].RecentJobTitle);
			resume.setLastModified(FastFlipGateway.getDocumentCollection().ResumeResultList.Items[i].LastActivityDT);
			
			//we need to transfer liked status over to the newly populated list
			if(this.isDocumentLiked(resume.getDid()))
				resume.setLiked(true);
			else
				resume.setLiked(false);
			
			resume.setLoaded(false);
			//resume.setContent('');
			this.getDocuments().push(resume);
		}
		
		this.setGrandTotalResumeCount(parseInt(FastFlipGateway.getDocumentCollection().ResumeResultCount.TotalCount));
		this.setNumberOfPages(FastFlipGateway.getDocumentCollection().ResumeResultCount.TotalPages);
		this.setNumberOfDocsPerPage(25);
		this.setIsLoaded(true);
		this.setCurrentPage(FastFlipGateway.getDocumentCollection().ResumeResultCount.PageNo);

		if(this.getShowIndexPage() == true)
			this.setupIndexPage();
		
		//callback
		if(callbackfunc != null)
			callbackfunc(obj, did_optional);
				
	};
	
	this.loadUpResumeInIndex = function(resume)
	{
		var oneres = this.findResume(resume.getDid())
						if (oneres.length == 1) {
							oneres[0].setContent(resume.getContent());
							//oneres[0].setDocumentType(this.DocumentType());
							oneres[0].setContentType(resume.getContentType());
							oneres[0].setDocDid(resume.getDocDid());				
							oneres[0].setLoaded(true);
							oneres[0].setCandidateLastViewedDate(resume.getCandidateLastViewedDate());													
							oneres[0].setAccountLastAction(resume.getAccountLastAction());
							oneres[0].setAccountLastActionDate(resume.getAccountLastActionDate());
							oneres[0].setLocked(resume.getLocked());
							oneres[0].setFFSetEmailTo(resume.getFFSetEmailTo());
							oneres[0].setFFResumeEmailID(resume.getFFResumeEmailID());
						}
	}
	
	this.LikeResume = function(resumedid) {
    
		var docs = this.getDocuments();
		var docsliked = this.getDocumentsLiked();
		
		jQuery.each(docs, function (i, item) {
			if (item.getDid() == resumedid) {
			    docs[i].setLiked(true);
			    if (docs[i].getFFSetEmailTo() == 'True') {
			        countemailcandidateLike = countemailcandidateLike + 1;
			    }
			    docsliked.push(docs[i]);        
				return false;
			}
		});
		
		//mark it liked			
		jQuery("#spnLikeCount").html(this.getDocumentsLiked().length);

		jQuery("#like_" + resumedid).attr("src", "http://img.icbdr.com/images/images/jpimages/ffthumbsup_on.gif");
		jQuery("#like_" + resumedid).closest("tr").css("background-color", "#faf3da");
		jQuery("#like_" + resumedid).attr("title", ScriptVariables.Get('UnlikeThisResume'));

		MarkmyLike(resumedid, "true");

	}

	this.UnlikeResume = function(resumedid) {    
		var resumeUnlikeArray = resumedid.split("*");    
		var workingResumeLikeArray =[];    
		var newResumeLikeArray = [];
		var resumeLiked = true;
		
		jQuery.each(this.getDocumentsLiked(), function (i, item) {    
			workingResumeLikeArray.push(item);
		});
		
		var docs = this.getDocuments();
		
		jQuery.each(workingResumeLikeArray, function (i, likeitem) {    
			resumeLiked = true;
			jQuery.each(resumeUnlikeArray, function (ii, unlikeitem) {    
				if (likeitem.getDid() == unlikeitem) {
					jQuery.each(docs, function(iii, resitem) {
					    if (resitem.getDid() == unlikeitem) {
					        docs[iii].setLiked(false);
					        if (docs[iii].getFFSetEmailTo() == 'True') {
					            countemailcandidateLike = countemailcandidateLike - 1;
					        }
					    }
						});
					resumeLiked = false;
				}
			});
		
			if (resumeLiked) {
				newResumeLikeArray.push(likeitem);
			}
		});
		
		this.setDocumentsLiked(newResumeLikeArray);

		MarkmyLike(resumedid, "false");

		if (this.getShowingLikesResumes()) {
			jQuery("#spnLikeCount").html(this.getDocumentsLiked().length);
			
			//g_totalResumeCount -= 1;			
			
			if (this.getDocumentsLiked().length == 0) {
				_myFFUI.NoMoreResumesToShow();
				return;
			}

			this.setupIndexPage();
			if (_myFFUI.getCurrentResumeIndex() != 0)
				this.flipToResume(_myFFUI.setCurrentResumeIndex(_myFFUI.getCurrentResumeIndex()-1));        
		}
		else {	
			jQuery("#like_" + resumedid).attr("src", "http://img.icbdr.com/images/images/jpimages/ffthumbsup_off.gif");
			jQuery("#like_" + resumedid).closest("tr").css("background-color", "transparent");
			jQuery("#like_" + resumedid).attr("title", ScriptVariables.Get('LikeThisResume'));
			jQuery("#spnLikeCount").html(this.getDocumentsLiked().length);
		}
	}
	
	function MarkmyLike(ResumeDID, MyLike) {
		var dataforEmail = "";

		if (MyLike == "true") {
			updateActionForResumes(ResumeDID, "like");
		}
		else {
			updateActionForResumes(ResumeDID, "unlike");
		}
	}
	
	this.RemoveResume = function(resumedid) {	
		var delindex = -1;
		jQuery.each(this.getDocuments(), function (i, item) {
			if (item.getDid() == resumedid) {
				delindex = i;
				return false;
			}
		});

		if (delindex >= 0)
			this.getDocuments().splice(delindex, 1);

		//this.setTotalResumeCount(this.getTotalResumeCount() - 1);
		jQuery("#spnLikeCount").html(this.getDocumentsLiked().length);

		if (!this.getShowingLikesResumes()){
			jQuery("#spnTotal").html(Utilities.NumberWithCommas(this.getGrandTotalResumeCount()));
			jQuery("#spnTotal2").html(Utilities.NumberWithCommas(this.getGrandTotalResumeCount()));
		}

	}
	
	function updateActionForResumes(resumedid, action) {
		var dataforupdate = "resumedid=" + resumedid;
		dataforupdate += "&action=" + action;
		dataforupdate += "&activity=updateaction";

		dataforupdate += "&SearchCrit=" + ScriptVariables.Get("MXAuditSearchCriteria_CriteriaDID");
	if (ScriptVariables.Get("NWDataStoreLabel_DID") != '')
			dataforupdate += "&NWDataStoreLabel_DID=" + ScriptVariables.Get("NWDataStoreLabel_DID");
	
	if (g_auditID != undefined && g_auditID != null && g_auditID != '')
	    dataforupdate += "&MXAuditCriteriaDIDValue=" + g_auditID;

		jQuery.ajax({
			type: "POST",
			url: "../AJAX/" + "GetResumesForFastFlip.aspx",
			data: dataforupdate,
			success: function (msg) {
				if (msg.toString().indexOf("true") >= 0) {
					jQuery("#resumeContainer").html(ScriptVariables.Get('Actiondeniedtext'));
					jQuery("#resumeContainer").addClass("error");
				}
			},
			error: function (xhr, status, error) {
				if (xhr.status === 403) {
					Utilities.SessionTimeout();
				}
				else {
				    if (ScriptVariables.Get('AjaxErrorLog') == "true") {
				        CB.Tally('JobPoster\UserControls\ResumeResults\ResumeFastFlip', 'AjaxCallErrorLog', xhr.status.toString());
				    }
					jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('timeouterror'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });

				}
			}
		});

	}


	
}

//FFResumeIndex.prototype = new FFIndex();
//FFResumeIndex.prototype.constructor = FFResumeIndex;
inheritPrototype(FFResumeIndex, FFIndex);

var FFDocument = function (did) {
    var _did = did;
    var _company = '';
    var _docDid = '';
    var _documentTitle = '';
    var _lastModified;
    var _liked = false;
    var _loaded = false;
    var _name = '';
    var _position = '';
    var _content = '';
    var _contentType = '';
    var _candidateLastViewedDate;
    var _accountLastAction;
    var _allActions;
    var _accountLastActionDate;
    var _locked = false;
    var _isTNInvited = false;
    var _isTNJoined = false;
    var _ffSetEmailTo = false;
    var _ffResumeEmailID = '';

    this.setDid = function (data) { _did = data; };
    this.setCompany = function (data) { _company = data; };
    this.setDocDid = function (data) { _docDid = data; };
    this.setDocumentTitle = function (data) { _documentTitle = data; };
    this.setLastModified = function (data) { _lastModified = data; };
    this.setLiked = function (data) { _liked = data };
    this.setLoaded = function (data) { _loaded = data; };
    this.setName = function (data) { _name = data; };
    this.setPosition = function (data) { _position = data; };
    this.setContent = function (data) { _content = data; };
    this.setContentType = function (data) { _contentType = data; };
    this.setCandidateLastViewedDate = function (data) { _candidateLastViewedDate = data; };
    this.setAccountLastAction = function (data) { _accountLastAction = data; };
    this.setAllActions = function (data) { _allActions = data };
    this.setAccountLastActionDate = function (data) { _accountLastActionDate = data; };
    this.setLocked = function (data) { _locked = data };
    this.setIsTNInvited = function (data) { _isTNInvited = data };
    this.setIsTNJoined = function (data) { _isTNJoined = data };
    this.setFFSetEmailTo = function (data) { _ffSetEmailTo = data };
    this.setFFResumeEmailID = function (data) { _ffResumeEmailID = data };

    this.getDid = function () { return _did; };
    this.getCompany = function () { return _company; };
    this.getDocDid = function () { return _docDid; };
    this.getDocumentTitle = function () { return _documentTitle; };
    this.getLastModified = function () { return _lastModified; };
    this.getLiked = function () { return _liked };
    this.isLoaded = function () { return _loaded; };
    this.getName = function () { return _name; };
    this.getContentType = function () { return _contentType; };
    this.getPosition = function () { return _position; };
    this.getContent = function () { return _content; };
    this.getCandidateLastViewedDate = function () { return _candidateLastViewedDate; };
    this.getAccountLastAction = function () { return _accountLastAction; };
    this.getAllActions = function () { return _allActions; };
    this.getAccountLastActionDate = function () { return _accountLastActionDate; };
    this.getLocked = function () { return _locked };
    this.getIsTNInvited = function () { return _isTNInvited };
    this.getIsTNJoined = function () { return _isTNJoined };
    this.getFFSetEmailTo = function () { return _ffSetEmailTo };
    this.getFFResumeEmailID = function () { return _ffResumeEmailID };

    this.Load = function () { };
}

var FFResume = function (did) {
    FFDocument.call(this, did);

    var _profileContent = '';
    this.setProfileContent = function (data) { _profileContent = data; };
    this.getProfileContent = function () { return _profileContent };

    var _curIndexXHR = null;

    this.Load = function (callback, myIndexReference, index, activity) {
        Utilities.ShowLoadingFFSpinner();

        //reset tag list each time.  This is where we will populate the initial list of tags as well
        //This might need to be its own function called when you press forward, back or change the exclusion list
        if (ScriptVariables.Get('EnableTagsInFlip') == "true") {
            populateTagList(did);
        }

        var postData = '';
        postData += 'action=view';
        postData += '&fastflip=true';
        postData += '&activity=' + activity;
        postData += '&did=' + this.getDid();
        postData += '&highlightKeyword=' + jQuery("#_FastFlip_hdnHighlightKeywords").val();

        if (g_strcrit != '')
            postData += "&SearchCrit=" + ScriptVariables.Get("MXAuditSearchCriteria_CriteriaDID");

        if (ScriptVariables.Get("NWDataStoreLabel_DID") != '')
            postData += "&NWDataStoreLabel_DID=" + ScriptVariables.Get("NWDataStoreLabel_DID");
        if (ScriptVariables.Contains("Matching_ResumeDID"))
            postData += "&Matching_ResumeDID=" + ScriptVariables.Get("Matching_ResumeDID");

        

        if (g_semanticSearchAll == "semanticsearchall" && !ScriptVariables.Contains('Matching_ResumeDID')) 
            postData += "&semanticsearchall=1" ;
        
        if (typeof g_semanticID != 'undefined' && g_semanticID != null)
            postData += "&semanticID=" + g_semanticID;

        if (typeof g_QID != 'undefined' && g_QID != null)
            postData += "&QID=" + g_QID;

        if (typeof getRelativeResumePosition !== 'undefined' && getRelativeResumePosition(did) >= 0) {
            var resumeLocInList = getRelativeResumePosition(did);
            if (getFromStrcrit('RPP=') !== "")
                postData += '&absoluteresumeloc=' + (resumeLocInList + 1 + ((g_curSetPage - 1) * getFromStrcrit('RPP=')));

            postData += '&relativeresumeloc=' + 'pg:' + g_curSetPage + "|loc:" + (resumeLocInList + 1);
        }


        if (g_auditID != '')
            postData += "&MXAuditCriteriaDIDValue=" + g_auditID;

        var this$ = this;

        _curIndexXHR = jQuery.ajax({
            type: "POST",
            url: "../AJAX/" + "GetResumesForFastFlip.aspx",
            data: postData,
            dataType: "json",
            timeout: 40000,
            success: function (msg) {
                Utilities.HideLoadingFFSpinner();
                if (msg.DID == 'RDBArchivedResume') {
                    jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('RDBArchivedResume'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
                }
                if (ScriptVariables.Get('Product') == "viewbased") {
                    _myFFUI.UpdateKeys(msg.RemainingQuota);
                }
                if (msg.DID == 'RDBLimitReached') {
                    //myIndexReference.setCurrentResumeIndex(index-1);
                    jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('Actiondeniedtext'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
                }
                else if (msg.DID == 'ResumeNotLoaded2' || msg.DID == 'ResumeNotLoaded' || msg.DID == 'ResumeNotLoaded1') {
                    jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('ResumeNotLoaded') + '  Code: 2', 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
                }
                else {
                    if (ScriptVariables.Get('Product') == "viewbased") {
                        if (msg.DID == 'ViewBasedLocked' || (msg.LockStatus && msg.LockStatus == 'locked')) {
                            _myFFUI.AddLocks();
                            this$.setLocked(true);
                            if (!_myFFUI.getShowProfile())
                                $('#profileFormat').trigger("click");
                        }
                        if (msg.LockStatus && msg.LockStatus == 'unLocked') {
                            _myFFUI.RemoveLocks();
                            _myFFUI.getResumeProfile(msg.DID);
                            this$.setLocked(false);
                        }
                    }

                    this$.setContent(msg.Content);
                    //this$.setDocumentType(msg.DocumentType);
                    this$.setContentType(msg.DocumentType);
                    this$.setDocDid(msg.DocDID);
                    this$.setLoaded(true);
                    this$.setCandidateLastViewedDate(msg.CandidateLastViewedDate);
                    this$.setAccountLastAction(msg.AccountLastAction);
                    this$.setAccountLastActionDate(msg.AccountLastActionDate);
                    $('#talentnetworkjoined').hide();
                    $('#talentnetworkinvited').hide();
                    $('#talentnetworkavailable').hide();
                    if (ScriptVariables.Get('ShowTNOptions')) {
                        if (msg.IsTNJoined == "True") {
                            tnjoinedresumeindices.push(_myFFUI.getCurrentResumeIndex());
                            $('#talentnetworkjoined').show();
                        }
                        else if (msg.IsTNInvited == "True") {
                            tninvitedresumeindices.push(_myFFUI.getCurrentResumeIndex());
                            $('#talentnetworkinvited').show();
                        }
                        else {
                            $('#talentnetworkavailable').show();
                        }
                    }
                    //Setting the value in Object level, because we need this property value when user view Previous resume.
                    //Since they are storing on an Array[object] format we need to persist the value we are retrieving from AJAX call
                    //Once I set this property, below loadUpResumeInIndex method will update the same in Array of curResumes i.e. _myIndexRef.getCurrentWorkingStack()
                    this$.setFFSetEmailTo(msg.FFSetEmailTo);
                    this$.setFFResumeEmailID(msg.FFResumeEmailID);

                    //place eyeball
                    if (ScriptVariables.Get('ViewIconText') == 'true' && typeof placeEyeball == 'function')
                        placeEyeball(this$.getDid(), FastFlipGateway.getDocumentCollection().ViewIconTextData.ViewIconText);
                    myIndexReference.loadUpResumeInIndex(this$);
                    callback(index);
                }
            },
            error: function (xhr, status, error) {
                Utilities.HideLoadingFFSpinner();
                if (xhr.status === 403) {
                    Utilities.SessionTimeout();
                }
                else if (xhr.status != 0) {
                    if (ScriptVariables.Get('AjaxErrorLog') == "true") {
                        CB.Tally('JobPoster\UserControls\ResumeResults\ResumeFastFlip', 'AjaxCallErrorLog', xhr.status.toString());
                    }
                    jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('timeouterror'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
                }
            }
        });
    }


}

inheritPrototype(FFResume, FFDocument);
//FFResume.prototype = new FFDocument();
//FFResume.prototype.constructor = FFResume;

var FFUI = function (doctype, showIndex) {
    var DOCUMENTSLIKED_LIMIT = 24;
    var _myIndexRef = null; //reference to FFIndex object
    var _showIndex = showIndex;

    var _showSplashScreen = true;
    var _curResumeIndex = 0;
    var _resumeDetailFF = false;
    var _curIndexXHR = null;

    var _stickyHeight = 213;
    var _padding = 227;
    var _topOffset = 200;
    var _footerHeight = 0;
    var _leftfix = 0;

    var _pollRunning = null;

    var _listsLoaded = [];

    var _showProfile = false;
    var _bypassemailcandidate = false;
    var _candidateemailID = "";
    var _bLikeEmailClick = false;
    var _msgBox;
    var _errBox;
    var _mainArea;
    var _fromEmail

    this.getMsgBox = function () { return _msgBox; };
    this.getErrBox = function () { return _errBox; };
    this.getMainArea = function () { return _mainArea; };
    this.getFromEmail = function () { return _fromEmail; };

    var _transitionPref = ScriptVariables.Get('UserPrefValue');
    if (_transitionPref != null && _transitionPref == "false")
        _showSplashScreen = false;

    this.getIndex = function () { return _myIndexRef; };
    this.getShowSplashScreen = function () { return _showSplashScreen; };
    this.getCurrentResumeIndex = function () { return _curResumeIndex; };
    this.setCurrentResumeIndex = function (data) { _curResumeIndex = data; };

    this.getShowProfile = function () { return _showProfile; };

    this.getShowIndexPage = function () { return _showIndex; };

    function afterIndexLoad(myObj, did_optional) {
        //callback function called after loading the index within the index obj.
        myObj.setupSearchInfo();

        if (!myObj.getShowSplashScreen()) {
            if (myObj.getShowIndexPage()) {
                //myObj.setCurrentResumeIndex(0);
                myObj.startShowingResumes(0);
            }
            else {
                //myObj.setCurrentResumeIndex(1);
                if (did_optional != null && did_optional != '') {
                    var index = _myIndexRef.findResumeIndex(did_optional);
                    if (index >= 0)
                        myObj.startShowingResumes(index + 1)
                    else
                        myObj.startShowingResumes(1);
                }
                else
                    myObj.startShowingResumes(1);
            }
        }
        else {
            jQuery("#splashLoading").hide();
            jQuery("#btnStart").show();
        }

        Utilities.HideLoadingFFSpinner();

        //load letters and jobs for email popup
        getEmailList('letters', 'ddlEmailLetterList', ScriptVariables.Get('DefaulttextforLetters'));
        getEmailList('jobs', 'ddlEmailJobList', ScriptVariables.Get('DefaulttextforJobs'));
    }

    function getEmailList(type, dropdownid, firstoptiontext) {
        if (type == 'jobs' && jQuery('#ddlEmailJobList option').length == 0) 
            $('#loadspinnerforJobs').show();       
       
        //check if lists have already been loaded
        if (jQuery.inArray(type, _listsLoaded) >= 0)
            return;

        var thedata = 'type=' + type;
        var listItems;
        jQuery.ajax({
            type: "GET",
            dataType: "json",
            url: "../AJAX/" + "ListsForFastFlip.aspx",
            data: thedata,
            timeout: 40000,
            success: function (msg) {
                if (type == 'jobs')
                {
                    $('#loadspinnerforJobs').hide();
                    if (msg.obj.length == 1000)
                    { LastJobTitle = msg.obj[msg.obj.length - 1].name;
                        LastJobDID = msg.obj[msg.obj.length - 1].did;
                        jQuery('#LoadMore').show();
                        jQuery('#jobsCount').show();
                        jQuery('#jobsCount').html('( Loaded :' + 1000 + ' )');
                    }
                }
                if (msg.obj.length > 0) {
                    for (var i = 0; i < msg.obj.length; i++) {
                        listItems += "<option value='" + msg.obj[i].did + "'>" + msg.obj[i].name + "</option>";
                    }
                    jQuery("#" + dropdownid).html(listItems);
                    jQuery("#" + dropdownid).prepend(jQuery('<option></option>').val('').html(firstoptiontext));
                    jQuery("#" + dropdownid).get(0).selectedIndex = 0;
                }
                else {
                    jQuery("#" + dropdownid).html(jQuery('<option></option>').val('').html(firstoptiontext));
                    jQuery("#" + dropdownid).get(0).selectedIndex = 0;
                }

                _listsLoaded.push(type);
            },
            error: function (xhr, status, error) {
                if (type == 'jobs')
                    $('#loadspinnerforJobs').hide();
                if (xhr.status === 403) {
                    Utilities.SessionTimeout();
                }
                else {
                    if (ScriptVariables.Get('AjaxErrorLog') == "true") {
                        CB.Tally('JobPoster\UserControls\ResumeResults\ResumeFastFlip', 'AjaxCallErrorLog', xhr.status.toString());
                    }
                    jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('ErrorMsg'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
                }
            }
          
        });
    }

    function setupFastFlipHeader() {
        if (doctype != DocumentType.App) {
            jQuery("#basicview").show();
            jQuery("#switchToBasicResDetailView").show();
            jQuery("#resumeflipsplitter").show();
        }
    }

    function positionActionPanel() {
        var resoffset = jQuery("#HTMLResumeContainer").offset();
        jQuery("#actionPanel").css("left", Math.round(resoffset.left + jQuery("#HTMLResumeContainer").width() + 14) + "px");
    }

    function postionExclusionPanel() {
        var resoffset = jQuery("#HTMLResumeContainer").offset();
        jQuery("#exclusionsPanel").css("left", Math.round(resoffset.left - jQuery("#exclusionsPanel").width() - 8) + "px");
    }

    function postionTagsPanel() {
        var resoffset = jQuery("#HTMLResumeContainer").offset();
        jQuery("#resumeFlipTags").css("left", Math.round(resoffset.left + jQuery("#HTMLResumeContainer").width() + 14) + "px");
    }

    function positionUnlockPanel() {
        var resoffset = jQuery("#HTMLResumeContainer").offset();
        jQuery("#unlockPanel").css("left", Math.round(resoffset.left - jQuery("#unlockPanel").width() - 8) + "px");
    }

    this.UILikeIt = function (resumedid) {
        //we like it!
        if (_myIndexRef.getDocumentsLiked().length > DOCUMENTSLIKED_LIMIT) {
            //weve reached the limit
            jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('LikeLimitReached'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
        }
        else {
            jQuery("#actionPanel li#like").attr("class", "unlike").attr("title", "Click to Unlike").children("#spnLike").html(ScriptVariables.Get('locLiked'));
            _myIndexRef.LikeResume(resumedid);
        }
    }

    this.UIUnlikeIt = function (resumedid) {
        jQuery("#actionPanel li#like").attr("class", "").attr("title", "Click to Like").children("#spnLike").html("Like");
        _myIndexRef.UnlikeResume(resumedid);
    }

    function positionTopBar() {
        var resoffset = jQuery("#HTMLResumeContainer").offset();
        jQuery("#topBar").css("left", Math.round(resoffset.left - 12) + "px");
    }

    function setLeftFix() {
        var temp = jQuery(window).width();
        temp = temp - 814;
        temp = Math.round(temp / 2);
        g_leftfix = temp;
    }

    function showSplash() {
        jQuery(window).scrollTop(0);
        jQuery("#HTMLResumeContainer").css("background-image", "none");
        jQuery("#HTMLResumeContainer").css("border-bottom", "none");
        jQuery("#splashContainer").show();
        jQuery("#resumeContainer").hide();
    }

    function hideSplash() {
        jQuery("#splashContainer").hide();
        jQuery("<div style='clear:both; padding-top:210px;'></div>").appendTo("#resumeContainer");
        jQuery("#splashLoading").appendTo("#resumeContainer");
    }

    function scrollArrows() {
        if (jQuery(window).height() >= _stickyHeight) {

            if (jQuery(document).height() - _footerHeight - _padding < jQuery(window).scrollTop() + _stickyHeight) {
                var top = jQuery(document).height() - _stickyHeight - _footerHeight - _padding;
                jQuery("#flip_prev").css("position", "absolute");
                jQuery("#flip_next").css("position", "absolute");
            }
            else {
                jQuery('#flip_prev').css('position', 'fixed');
                jQuery('#flip_next').css('position', 'fixed');
                //if (ScriptVariables.Get('IsResumeScoreFeatureEnable')) {
                //	jQuery('#flip_prev').css('left', (_leftfix - 92) + 'px');
                //} else {
                //	jQuery('#flip_prev').css('left', _leftfix + 'px');
                //}
            }
        }
    }

    function setupExitLink() {
        jQuery("#ffheader a.lnkBack").html(ScriptVariables.Get('ExitResumeFlip') + '<img src="http://img.icbdr.com/images/images/jpimages/ffclose.jpg" style="vertical-align:middle; padding-top:5px; padding-left:3px;" width="21" height="22" border="0" />');
        jQuery("#resumeFlipLnkBack").css("padding-top", "4px");
        jQuery("#resumeflipsplitter").css("border-left", "1px solid #5A719B;");
    }

    this.AddLocks = function () {
        jQuery(".lockedpanel").show();
        jQuery("#unlockPanel").show();
        jQuery("#btnUnlockButton").css("background-position", "0 0");
        jQuery("#btnUnlockButton").val(ScriptVariables.Get('sbUnlcokButton'));
        jQuery("#btnUnlockButton").css("color", "#333333");
        jQuery("#btnUnlockButton").removeAttr("disabled");
        jQuery("#btnUnlockButton").css("cursor", "pointer");
        jQuery("#lockedLikePanel").show();
        var curResumes = _myIndexRef.getCurrentWorkingStack();
        var resumedid = curResumes[_myFFUI.getCurrentResumeIndex() - 1].getDid();
        jQuery(".lockImg").on("click", function (event) {
            jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('sbUnlcokMessage'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': 'Yes', 'cancelString': 'No', 'confirmCallback': function () { _myFFUI.unlockResume(resumedid, _myFFUI.getCurrentResumeIndex()); } })
        });
        if (jQuery('#lockedLikePanel')[0] == null)
            jQuery("<div id='lockedLikePanel' style='display:block;'></div>").insertAfter("#actionPanel .lockedpanel");
    }

    this.RemoveLocks = function () {
        jQuery(".lockedpanel").hide()
        jQuery("#btnUnlockButton").css("background-position", "0 -60px")
        jQuery("#btnUnlockButton").css("color", "#FFFFFF")
        jQuery("#btnUnlockButton").val(ScriptVariables.Get('sbUnlcokedButton'))
        jQuery("#btnUnlockButton").attr({ "disabled": "disabled" })
        jQuery("#btnUnlockButton").css("cursor", "default")
        jQuery("#resumeFormat").css("cursor", "pointer")
        jQuery("#lockedLikePanel").hide();
    }

    this.UpdateKeys = function (remainKeys) {
        jQuery(".keysLeft").text(remainKeys + " " + ScriptVariables.Get('sbLeft'))
    }

    this.NoMoreResumesToShow = function () {
        jQuery("#resumeContainer.Section2").empty();

        var exitmsg = '';
        if (_myIndexRef.getShowingLikesResumes())
            exitmsg = ScriptVariables.Get('ExitingLiked');
        else
            exitmsg = ScriptVariables.Get('ExitingFlipView');

        jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('NoResumestoView') + '\n' + exitmsg, 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
        this.exitViewer();
    }

    this.exitViewer = function (event) {
        if (_myIndexRef.getShowingLikesResumes()) {
            jQuery(window).scrollTop(0);
            _myIndexRef.setShowIndexPageOriginalSetting();
            this.showOriginalResumes();
        } else {
            jQuery("#FastFlipDialog").dialog("close");

            //Fix for persisting FF email window blocking Results page
            if (jQuery("#popupIframe").length) {
                hideFFActionLayer(event);
            }

            //lets give them the res list location from the res results they came from, or where they are currently at (scroll back to place)
            //only run this if they are leaving during a resume view, not during index view.
            if (this.getCurrentResumeIndex() > 0) {
                var curResumes = _myIndexRef.getCurrentWorkingStack();
                if (curResumes[this.getCurrentResumeIndex() - 1] != null) { var resumedid = curResumes[this.getCurrentResumeIndex() - 1].getDid(); }
                else { var resumedid = curResumes[curResumes.length - 1].getDid(); }
                if (resumedid != null || resumedid != '') {
                    var offset = jQuery("#" + resumedid + "_Title").offset();
                    if (offset != null)
                        jQuery(window).scrollTop(offset.top);
                }
            }

            jQuery("body").append(jQuery("#ffheader").hide());
            jQuery("#resumeContainer").empty("");
            _myIndexRef.clearLikedResumes();
            _myIndexRef.clearResumes();

            this.unbindKeyboardEvents();
        }

        _myIndexRef.setIsLoaded(false);

    }

    this.cleanKeyword = function (sKeyword) {
        var newKeyword = '';
        var keywordCount = 0;
        var lastCharacter = '';
        sKeyword = sKeyword.replace(/\*/g, "");
        newKeyword = sKeyword;
        keywordCount = sKeyword.split(',,').length;

        for (i = 0; i < keywordCount - 1; i++) {
            newKeyword = newKeyword.replace(',,', ',').replace(',,', ',');
        }

        lastCharacter = newKeyword.substring(newKeyword.length - 1, newKeyword.length);
        if (lastCharacter == ',') {
            newKeyword = newKeyword.substring(0, newKeyword.length - 1);
        }

        return newKeyword;

    }

    this.getCurrentResumeNumber = function () {
        if (_myIndexRef.getShowingLikesResumes())
            return this.getCurrentResumeIndex();
        else
            return ((_myIndexRef.getCurrentPage() - 1) * _myIndexRef.getNumberOfDocsPerPage()) + this.getCurrentResumeIndex();
    }

    this.startShowingResumes = function (i) {
        //var i = this.getCurrentResumeIndex();
        this.flipToResume(i);
        //this.flipToResume();
        scrollArrows();
    }

    jQuery.fn.extend({
        center: function () {
            return this.each(function () {
                var top = (jQuery(window).height() - jQuery(this).outerHeight()) / 2;
                var left = (jQuery(window).width() - jQuery(this).outerWidth()) / 2;
                jQuery(this).css({ position: 'absolute', margin: 0, top: (top > 0 ? top : 0) + 'px', left: (left > 0 ? left : 0) + 'px' });
            });
        }
    });

    function FFPopup(popupDivID) {
        var _popup = CB.object(CB.AJAX.Popup);
        _popup.initialize(document.getElementById(popupDivID), { documentClickCloses: false });

        return {
            Show: function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                _popup.show(evt.target);
            },
            Hide: function (evt) {
                _popup.hide();
            }
        }
    }

    this.ForwardResume = function () {

        var dataforforward = "";
        dataforforward = "FastFlip=true";

        if (this.getCurrentResumeIndex() == 0) {
            //this is a bulk action, they are clicking from the index page				
            var resumesforbulkaction = '';

            jQuery("input[type='checkbox']:checked", "#fastflipindex").each(function (index, value) {
                if (resumesforbulkaction.length > 0)
                    resumesforbulkaction += '*';

                resumesforbulkaction += this.id.split("_")[1];
            });

            dataforforward += "&ResumeDID=" + resumesforbulkaction;
            dataforforward += "&bulkresumes=true";            
        }
        else {
            //this is a single resume action - they are on a resume page
            var curResumes = _myIndexRef.getCurrentWorkingStack();
            dataforforward += "&ResumeDID=" + curResumes[this.getCurrentResumeIndex() - 1].getDid();
        }

        if (ScriptVariables.Contains('Matching_ResumeDID'))
            dataforforward += '&Matching_ResumeDID=' + ScriptVariables.Get('Matching_ResumeDID');

        if (g_semanticSearchAll == "semanticsearchall" && !ScriptVariables.Contains('Matching_ResumeDID')) {
            dataforforward += "&semanticsearchall=1";
        }
       
        if (typeof g_semanticID != 'undefined' && g_semanticID != null)
            dataforforward += "&semanticID=" + g_semanticID;
        if (typeof g_QID != 'undefined' && g_QID != null)
            dataforforward += "&QID=" + g_QID;

        dataforforward += "&ForwardResume_ToAddresses=" + encodeURIComponent(jQuery("#_FastFlip_tbToAddressesXavierTest").val());
        dataforforward += "&ForwardResume_AttachResumeWorddoc=true";
        dataforforward += "&ForwardResume_Notes=" + jQuery("#txtNotes").val();
        // CSI272504 - Fix special character issue in email subject
        if (ScriptVariables.Get("FixEmailSubjectEncodeIssue_CSI272504")) {
            dataforforward += "&ForwardResume_Subject=" + encodeURIComponent(jQuery("#txtFwdSubject").val());
        }
        else {
            dataforforward += "&ForwardResume_Subject=" + jQuery("#txtFwdSubject").val();
        }

        if (ScriptVariables.Get("ForwardResumeFastFlipType") == "true") {
            dataforforward += "&ForwardResume_EmailFormat=" + jQuery("#_FastFlip_ddlFwdType").val();
        } else {
            dataforforward += "&ForwardResume_EmailFormat=" + jQuery("#ddlType").val();
        }

        dataforforward += "&ForwardResume_FromAddress=" + jQuery("#txtFwdFrom").val();
        dataforforward += "&ForwardAction=true";

        if (ScriptVariables.Get("NWDataStoreLabel_DID") != '')
            dataforforward += "&NWDataStoreLabel_DID=" + ScriptVariables.Get("NWDataStoreLabel_DID");

        if (g_strcrit != '')
            dataforforward += '&SearchCrit=' + ScriptVariables.Get("MXAuditSearchCriteria_CriteriaDID");

        if (jQuery("#_FastFlip_tbToAddressesXavierTest").val() != "" & jQuery("#txtFwdFrom").val() != "" & jQuery("#txtFwdSubject").val() != "") {

            var sCCAddressValue = jQuery("#_FastFlip_tbToAddressesXavierTest").val();
            if ((sCCAddressValue.split(';')).length > 10) {
                jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('CCAddressLimit'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
                return;
            }
            var URLForForwardResume = ""
            if (ScriptVariables.Get("bFixRecordActionsForDataStore")) {
                URLForForwardResume = "../AJAX/" + "AjaxForwardResume.aspx?NWDataStoreLabel_DID=" + ScriptVariables.Get("NWDataStoreLabel_DID") + "&MXAuditSearchCriteria_CriteriaDID=" + g_auditID;
            }
            else {
                URLForForwardResume = "../AJAX/" + "AjaxForwardResume.aspx";
            }            

            if (typeof curResumes != 'undefined' && curResumes != null) {
                var resumedid = curResumes[this.getCurrentResumeIndex() - 1].getDid();
                var resumeLocInList = getRelativeResumePosition(resumedid);
                if (getFromStrcrit('RPP=') !== "")
                    URLForForwardResume += '&absoluteresumeloc=' + (resumeLocInList + 1 + ((g_curSetPage - 1) * getFromStrcrit('RPP=')));
                URLForForwardResume += '&relativeresumeloc=' + 'pg:' + g_curSetPage + "|loc:" + (resumeLocInList + 1);
            }
            
            if (typeof curResumes != 'undefined' && curResumes != null) { //qijaz HOTFIX 10/20/2015- Bulk Forward Resumes. curResumes is undefined for bulk forward
                var resumedid = curResumes[this.getCurrentResumeIndex() - 1].getDid();
                var resumeLocInList = getRelativeResumePosition(resumedid);
                if (getFromStrcrit('RPP=') !== "")
                    URLForForwardResume += '&absoluteresumeloc=' + (resumeLocInList + 1 + ((g_curSetPage - 1) * getFromStrcrit('RPP=')));
                URLForForwardResume += '&relativeresumeloc=' + 'pg:' + g_curSetPage + "|loc:" + (resumeLocInList + 1);
            }

            jQuery.ajax({
                type: "POST",
                url: URLForForwardResume,
                data: dataforforward,
                success: function (msg) {
                    if (msg = "success") {
                        jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('ForwardSuccess'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
                        hideFFActionLayer(null);
                    }
                    else {
                        if (ScriptVariables.Get('AjaxErrorLog') == "true") {
                            CB.Tally('JobPoster\UserControls\ResumeResults\ResumeFastFlip', 'AjaxCallErrorLog', msg.toString());
                        }
                        jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('ErrorMsg'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
                    }
                },
                error: function (xhr, status, error) {
                    if (ScriptVariables.Get('AjaxErrorLog') == "true") {
                        CB.Tally('JobPoster\UserControls\ResumeResults\ResumeFastFlip', 'AjaxCallErrorLog', xhr.status.toString());
                    }
                    jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('ErrorMsg'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });

                }
            });
        }

        else {
            var errMsg = '';
            errMsg += ScriptVariables.Get('Requiredfields');
            if (jQuery("#_FastFlip_tbToAddressesXavierTest").val() == "")
                errMsg += "\n" + ScriptVariables.Get('ToField');
            if (jQuery("#txtFwdFrom").val() == "")
                errMsg += "\n" + ScriptVariables.Get('FromField');
            if (jQuery("#txtFwdSubject").val() == "")
                errMsg += "\n" + ScriptVariables.Get('SubjectField')

            jQuery.CBMessageBox('show', { 'message': errMsg, 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });

        }
    }

    this.EmailCandidate = function () {

        var dataforEmail = "";
        dataforEmail = "FastFlip=true";

        if (this.getCurrentResumeIndex() == 0) {
            //this is a bulk action, they are clicking from the index page				
            var resumesforbulkaction = '';

            jQuery("input[type='checkbox']:checked", "#fastflipindex").each(function (index, value) {
                if (resumesforbulkaction.length > 0)
                    resumesforbulkaction += '*';

                resumesforbulkaction += this.id.split("_")[1];
            });

            dataforEmail += "&ResumeDID=" + resumesforbulkaction;
            dataforEmail += "&bulkresumes=true";
        }
        else {
            //this is a single resume action - they are on a resume page
            dataforEmail += "&ResumeDID=" + _myIndexRef.getDocuments()[this.getCurrentResumeIndex() - 1].getDid();
        }

        if (ScriptVariables.Contains('Matching_ResumeDID'))
            dataforEmail += '&Matching_ResumeDID=' + ScriptVariables.Get('Matching_ResumeDID');

        if (g_semanticSearchAll == "semanticsearchall" && !ScriptVariables.Contains('Matching_ResumeDID')) {
            dataforEmail += "&semanticsearchall=1";
        }
        if (typeof g_semanticID != 'undefined' && g_semanticID != null)
            dataforEmail += "&semanticID=" + g_semanticID;
        if (typeof g_QID != 'undefined' && g_QID != null)
            dataforEmail += "&QID=" + g_QID;

        dataforEmail += "&SendCandEmail_FromAddress=" + jQuery("#_FastFlip__txtFromAddressXavier").val();
        dataforEmail += "&SendCandEmail_CCAddresses=" + encodeURIComponent(jQuery("#_FastFlip__txtCCAddressesXavier").val());
        // CSI272504- Fix special character issue in email subject
        if (ScriptVariables.Get("FixEmailSubjectEncodeIssue_CSI272504")) {
            dataforEmail += "&SendCandEmail_Subject=" + encodeURIComponent(jQuery("#txtEmailSubject").val());
        } else {
            dataforEmail += "&SendCandEmail_Subject=" + jQuery("#txtEmailSubject").val();
        }
        dataforEmail += "&SendCandEmail_JobDID=" + jQuery("#ddlEmailJobList").val();
        dataforEmail += "&SendCandEmail_AutoResponseDID=" + jQuery("#ddlEmailLetterList").val();
        var editor = $find('_FastFlip_mxreLetter_mxRadEditor');
        var sHtml = editor.get_html(true);
        if (ScriptVariables.Get("bRDBjavascripturlvalidation")) {
            sHtml = sHtml.replace('&lt;', '<').replace('&gt;', '>');
            jQuery(sHtml).find('a').each(function () {
                var aFormatedAry = jQuery(this).attr('href');
                if (aFormatedAry.match('javascript:WriteMailPopUp')) {
                    var removespcialchar = aFormatedAry.replace("javascript:WriteMailPopUp", "mailto:").replace(/[\(\'|\'\)|\(\"|\"\)\;]/g, '');//Regular Exp(removing special char like (' ') and (" ")
                    sHtml = sHtml.replace(aFormatedAry, removespcialchar);
                }
            });
        }
        editor.set_html(sHtml);
        dataforEmail += "&SendCandEmail_AutoResponseText=" + escape(sHtml);
        dataforEmail += "&EmailAction=true";

        if (ScriptVariables.Get("NWDataStoreLabel_DID") != '')
            dataforEmail += "&NWDataStoreLabel_DID=" + ScriptVariables.Get("NWDataStoreLabel_DID");

        if (g_strcrit != '')
            dataforEmail += '&SearchCrit=' + ScriptVariables.Get("MXAuditSearchCriteria_CriteriaDID");

        if (jQuery("#_FastFlip__txtCCAddressesXavier").val() != "") {
            var sCCAddressValue = jQuery("#_FastFlip__txtCCAddressesXavier").val();
            if ((sCCAddressValue.split(';')).length > 10) {
                jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('CCAddressLimit'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
                return;
            }

        }
        var URLForEmailResume = ""
        if (ScriptVariables.Get("bFixRecordActionsForDataStore")) {
            URLForEmailResume = "../AJAX/" + "AjaxForwardResume.aspx?NWDataStoreLabel_DID=" + ScriptVariables.Get("NWDataStoreLabel_DID") + "&MXAuditSearchCriteria_CriteriaDID=" + g_auditID;
        }
        else {
            URLForEmailResume = "../AJAX/" + "AjaxForwardResume.aspx";
        }

        if (typeof _myIndexRef != 'undefined' && _myIndexRef != null) {
            if (typeof this.getCurrentResumeIndex != 'undefined' && this.getCurrentResumeIndex != null) {
                var index = this.getCurrentResumeIndex() - 1;
                if (index >= 0) {
                    var resumedid = _myIndexRef.getDocuments()[index].getDid();
                    var resumeLocInList = getRelativeResumePosition(resumedid);
                    if (getFromStrcrit('RPP=') !== "")
                        URLForEmailResume += '&absoluteresumeloc=' + (resumeLocInList + 1 + ((g_curSetPage - 1) * getFromStrcrit('RPP=')));
                    URLForEmailResume += '&relativeresumeloc=' + 'pg:' + g_curSetPage + "|loc:" + (resumeLocInList + 1);
                }
            }
        }

        if (jQuery("#_FastFlip__txtFromAddressXavier").val() != "" & jQuery("#txtEmailSubject").val() != "" & sHtml != "") {
            jQuery.ajax({
                type: "POST",
                url: URLForEmailResume,
                data: dataforEmail,
                success: function (msg) {
                    if (msg = "success") {
                        jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('ForwardSuccess'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
                        hideFFActionLayer(null);
                    }
                    else {
                        if (ScriptVariables.Get('AjaxErrorLog') == "true") {
                            CB.Tally('JobPoster\UserControls\ResumeResults\ResumeFastFlip', 'AjaxCallErrorLog', msg.toString());
                        }
                        jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('ErrorMsg'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
                    }
                },
                failure: function (xhr, status, error) {
                    if (xhr.status === 403) {
                        Utilities.SessionTimeout();
                    }
                    else {
                        if (ScriptVariables.Get('AjaxErrorLog') == "true") {
                            CB.Tally('JobPoster\UserControls\ResumeResults\ResumeFastFlip', 'AjaxCallErrorLog', xhr.status.toString());
                        }
                        jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('ErrorMsg'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
                    }
                }
            });
        }

        else {
            var errMsg = '';
            errMsg += ScriptVariables.Get('Requiredfields');
            if (jQuery("#_FastFlip__txtFromAddressXavier").val() == "")
                errMsg += "\n" + ScriptVariables.Get('FromField')

            if (jQuery("#txtEmailSubject").val() == "")
                errMsg += "\n" + ScriptVariables.Get('SubjectField')
            if (sHtml == "")
                errMsg += "\n" + ScriptVariables.Get('LetterField')

            jQuery.CBMessageBox('show', { 'message': errMsg, 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });

        }
    }

    //To make flag protected
    if (ScriptVariables.Get('Trackuseremailaction') == "true") {
        this.UserEmailCandidate = function (param) {
            var dataforEmail = "UserEmailAction=true" + param;
            if (this.getCurrentResumeIndex() == 0) {
                //this is a bulk action, they are clicking from the index page				
                var resumesforbulkaction = '';

                jQuery("input[type='checkbox']:checked", "#fastflipindex").each(function (index, value) {
                    if (resumesforbulkaction.length > 0)
                        resumesforbulkaction += '*';

                    resumesforbulkaction += this.id.split("_")[1];
                });
                dataforEmail += "&ResumeDID=" + resumesforbulkaction;
                dataforEmail += "&bulkresumes=true";
            }
            else {
                //this is a single resume action - they are on a resume page
                dataforEmail += "&ResumeDID=" + _myIndexRef.getDocuments()[this.getCurrentResumeIndex() - 1].getDid();
            }
            var URLForEmailResume = "../AJAX/" + "AjaxForwardResume.aspx";


            dataforEmail += "&EnableUserEmailTracking=true"


            jQuery.ajax({
                type: "POST",
                url: URLForEmailResume,
                data: dataforEmail,
                success: function (msg) {
                    CB.Tally('UserEmailRecorder', 'FastFlipui', 'FastFlipui');
                },
                failure: function (xhr, status, error) {
                    CB.Tally('UserEmailRecorderFailed', 'FastFlipui', 'FastFlipui');
                }
            });
        }
    }

    function movesavetofolderdialog() {
        var shadower = jQuery("#shadowAJAX");
        jQuery(window).scrollTop(0);
        jQuery(shadower).css("top", "115px");
        jQuery(shadower).css("left", "335px");
        jQuery("#FastFlipDialog").append(shadower);
        jQuery("#popupIframe").css("left", "300px");
    }

    this.showFFActionLayer_SaveToFolder = function (event) {
        var ResumesLiked = '';

        jQuery("input[type='checkbox']:checked", "#fastflipindex").each(function (index, value) {
            if (ResumesLiked.length > 0)
                ResumesLiked += '*';

            ResumesLiked += this.id.split("_")[1];
        });
        //We pass in multiple resumedids delimited with an asterisk (*)

        var resumeTitle = ScriptVariables.Get('ResumeTitle') + getSelectedResumesCount() + ")";

        showResumeFolderDialog(ResumesLiked, resumeTitle, '', '', '', '', event.target.id, -200, 35, '', '', function () { jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('ResumeSaved'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') }); }, null, null);

        setTimeout(function () { movesavetofolderdialog() }, 100);
    }

    this.showFFActionLayer_Unlike = function (event) {
        var ResumesUnliked = '';

        jQuery("input[type='checkbox']:checked", "#fastflipindex").each(function (index, value) {
            if (ResumesUnliked.length > 0)
                ResumesUnliked += '*';

            ResumesUnliked += this.id.split("_")[1];
        });

        //We pass in multiple resumedids delimited with an asterisk (*)
        _myIndexRef.UnlikeResume(ResumesUnliked)
    }

    this.showFFActionLayer_ReportResume = function (event, resumedid) {
        jQuery("#EmailSection").hide();
        jQuery("#ForwardSection").hide();
        jQuery("#ReportResumeFeedbackPopupWrapper").hide();
        jQuery("#resumefeedback").show();
        jQuery(".FFPopupStyle").css("height", "300px");
        jQuery(".FFPopupStyle").css("width", "300px");

        FFPopup.Show(event);
        jQuery("#ReportResumeFeedbackPopupWrapper").show();

        var forwardform = jQuery("#FFForm");
        var shadower = jQuery(forwardform).parents("#shadowAJAX");
        jQuery(window).scrollTop(0);
        jQuery(shadower).css("height", "300px");
        jQuery(shadower).css("width", "335px");
        jQuery(shadower).css("top", "115px");
        jQuery(shadower).css("left", "435px");
        jQuery("#FastFlipDialog").append(shadower);
        jQuery("#popupIframe").css("left", "300px");

        jQuery(this.getMainArea()).show();
        jQuery(this.getMsgBox).hide();
        jQuery(this.getErrBox).hide();
        var params = 'Resume_DID=' + resumedid;
        jQuery.ajax({
            url: ScriptVariables.Get('sURLPrefix') + 'JobPoster/Resumes/Ajax/ReportResumeFeedback.aspx',
            type: 'GET',
            data: params,
            cache: false,
            success: function (msg) {
                jQuery("#ReportResumeFeedbackPopupWrapper").html(msg);
            }
        });

    }


    this.showFFActionLayer_Email = function (event) {
        if (ScriptVariables.Get('BulkEmailIssue_CSI270478'))
        {
            if (this._bLikeEmailClick == true && ScriptVariables.Get('LikeResumeForFastFlip') == 'true') {
                                
                if (countemailcandidateLike > 0) {
                    var emailid = ""
                    //get the documents liked list
                    var documentsLiked = _myIndexRef.getDocumentsLiked();
                    var _userCount = 0
                    jQuery("#fastflipindex input[type='checkbox']:checked").each(function (index, value) {
                        resumeDID = this.id.split("_")[1];
                        //loop through each liked resume to get only the selected resume(s).
                        jQuery.each(documentsLiked, function (i, item) {
                            if (item.getDid() == resumeDID) {
                                emailid = emailid + item.getFFResumeEmailID() + ';';
                                _userCount++;
                            }

                        });
                    });
                    var strEmailToLikedUsers = '';
                    if (ScriptVariables.Get('Trackuseremailaction') == "true") {
                        _myFFUI.UserEmailCandidate("&userbulkresumes=true");
                    }
                    if (_userCount == 1) {
                        strEmailToLikedUsers = "mailto:" + emailid;
                    }
                    else {
                        strEmailToLikedUsers = "mailto:?bcc=" + emailid;
                    }
                    location.href = strEmailToLikedUsers;
                    emaiIdClick = false;
                    return;
                }
            }
         }
     else
       {
        if (this._bLikeEmailClick == true && countemailcandidateLike > 0 && ScriptVariables.Get('LikeResumeForFastFlip') == 'true') {
            var emailid = ""
            //get the documents liked list
            var documentsLiked = _myIndexRef.getDocumentsLiked();
            var _userCount = 0
            jQuery("#fastflipindex input[type='checkbox']:checked").each(function (index, value) {
                resumeDID = this.id.split("_")[1];
                //loop through each liked resume to get only the selected resume(s).
                jQuery.each(documentsLiked, function (i, item) {
                    if (item.getDid() == resumeDID) {
                        emailid = emailid + item.getFFResumeEmailID() + ';';
                        _userCount++;
                    }
                    
                });
            });
            var strEmailToLikedUsers = '';
            if (ScriptVariables.Get('Trackuseremailaction') == "true") {
                _myFFUI.UserEmailCandidate("&userbulkresumes=true");
            }
            if (_userCount == 1) {
                strEmailToLikedUsers = "mailto:" + emailid;
            }
            else {
                strEmailToLikedUsers = "mailto:?bcc=" + emailid;
            }
            location.href = strEmailToLikedUsers;
            emaiIdClick = false;
            return;
        }
    
        }
        
        if (this._bypassemailcandidate && emaiIdClick == true) {
            
            if (ScriptVariables.Get('Trackuseremailaction') == "true") {
                _myFFUI.UserEmailCandidate("&FastFlip=true");
            }
            var strEmailTo = "mailto:" + _myFFUI._candidateemailID;
            location.href = strEmailTo;
            emaiIdClick = false;
            return;
        }
        
        jQuery("#EmailSection").hide();
        jQuery("#ForwardSection").hide();
        jQuery("#ReportResumeFeedbackPopupWrapper").hide();
        jQuery(".FFPopupStyle").css("height", "600px");
        //Fix-(CSI259003)- Email pop up layout issue
        jQuery(".FFPopupStyle").css("width", "650px");      

        jQuery(this.getMainArea()).show();
        jQuery(this.getMsgBox).hide();
        jQuery(this.getErrBox).hide();

        if (this.getCurrentResumeIndex() == 0) {
            jQuery("#spnEmailCandidateCount").html(getSelectedResumesCount());
            jQuery("#spnCandidateCount").html(getSelectedResumesCount());
        }
        else {
            jQuery("#spnEmailCandidateCount").html("1");
            jQuery("#spnCandidateCount").html("1");
        }

        jQuery("#_FastFlip__txtFromAddressXavier").val(this.getFromEmail());
        jQuery("#_FastFlip__txtCCAddressesXavier").val('');
        jQuery("#txtEmailSubject").val('');
        jQuery("#ddlEmailJobList").get(0).selectedIndex = 0;
        jQuery("#ddlEmailLetterList").get(0).selectedIndex = 0;

        document.getElementById("_FastFlip_mxreLetter_mxRadEditor").value = '';
        var editor = $find('_FastFlip_mxreLetter_mxRadEditor');
        editor.set_html('');

        FFPopup.Show(event);
        setTimeout(function () {
            $find("_FastFlip_mxreLetter_mxRadEditor").onParentNodeChanged();
        }, 10);

        jQuery("#EmailSection").show();

        var forwardform = jQuery("#FFForm");
        var shadower = jQuery(forwardform).parents("#shadowAJAX");
        jQuery(window).scrollTop(0);
        jQuery(shadower).css("height", "622px");
        //Fix-(CSI259003)- Email pop up layout issue        
            jQuery(shadower).css("width", "680px");
            jQuery(shadower).css("left", "78px");
        
        jQuery(shadower).css("top", "115px");
        
        jQuery("#FastFlipDialog").append(shadower);
        jQuery("#popupIframe").css("left", "300px");

    }

    this.sendBlockRequest = function (resumedid, datastoreparam) {

        if (ScriptVariables.Contains('Matching_ResumeDID'))
            datastoreparam += '&Matching_ResumeDID=' + ScriptVariables.Get('Matching_ResumeDID');

        if (g_semanticSearchAll == "semanticsearchall" && !ScriptVariables.Contains('Matching_ResumeDID')) {
            datastoreparam += "&semanticsearchall=1";
        }
        if (typeof g_semanticID != 'undefined' && g_semanticID != null)
            datastoreparam += "&semanticID=" + g_semanticID;
        if (typeof g_QID != 'undefined' && g_QID != null)
            datastoreparam += "&QID=" + g_QID;

        var resumeLocInList = getRelativeResumePosition(resumedid);
        if (getFromStrcrit('RPP=') !== "")
            datastoreparam += '&absoluteresumeloc=' + (resumeLocInList + 1 + ((g_curSetPage - 1) * getFromStrcrit('RPP=')));
        datastoreparam += '&relativeresumeloc=' + 'pg:' + g_curSetPage + "|loc:" + (resumeLocInList + 1);

        datastoreparam += "&fastflip=true";

        jQuery.ajax({
            type: "GET",
            url: "BlockResume.aspx?Resume_DID=" + resumedid + "&ResultsPATH=True&strcrit=&V2=1" + datastoreparam,
            success: function (msg) {
                //do nothing for now
            },
            error: function (xhr, status, error) {
                if (ScriptVariables.Get('AjaxErrorLog') == "true") {
                    CB.Tally('JobPoster\UserControls\ResumeResults\ResumeFastFlip', 'AjaxCallErrorLog', xhr.status.toString());
                }
                jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('CannotBlock'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });

            }
        });
    }

    this.showFFActionLayer_Forward = function (event) {
        jQuery("#EmailSection").hide();
        jQuery("#ForwardSection").hide();
        jQuery("#ReportResumeFeedbackPopupWrapper").hide();
        jQuery(".FFPopupStyle").css("height", "360px");
        jQuery(".FFPopupStyle").css("width", "510px");
        jQuery(this.getMainArea()).show();
        jQuery(this.getMsgBox).hide();
        jQuery(this.getErrBox).hide();
        FFPopup.Show(event);

        if (this.getCurrentResumeIndex() == 0)
            jQuery("#spnFwdCandidateCount").html(getSelectedResumesCount());
        else
            jQuery("#spnFwdCandidateCount").html("1");

        jQuery("#_FastFlip_tbToAddressesXavierTest").val('');
        jQuery("#txtNotes").val('');
        jQuery("#txtFwdFrom").val(this.getFromEmail());
        jQuery("#txtFwdSubject").val(ScriptVariables.Get('Subjecttext'));
        jQuery("#ForwardSection").show();

        var forwardform = jQuery("#FFForm");
        var shadower = jQuery(forwardform).parents("#shadowAJAX");
        jQuery(window).scrollTop(0);
        jQuery(shadower).css("top", "115px");
        jQuery(shadower).css("left", "225px");
        jQuery(shadower).css("height", "392px");
        jQuery(shadower).css("width", "545px");
        jQuery("#FastFlipDialog").append(shadower);
        jQuery("#popupIframe").css("left", "300px");
    }

    function pollForUpdatedCollection(callback, myObj, showLastDoc) {
        if (_pollRunning != null)
            return;

        Utilities.ShowLoadingFFSpinner();

        var prevColl = FastFlipGateway.getDocumentCollection();
        var maxNoTries = 60;  //timeout increased to 60 seconds

        _pollRunning = setInterval(function () {
            if (maxNoTries == 0) {
                clearInterval(_pollRunning);
                Utilities.HideLoadingFFSpinner();
                jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('ErrorMsg'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
            }

            maxNoTries -= 1;
            if (FastFlipGateway.getDocumentCollection() != prevColl) {

                if (showLastDoc) {
                    var newDocIndex = _myIndexRef.getNumberOfDocsPerPage() - parseInt(FastFlipGateway.getDocumentCollection().ResumeResultCount.TotalDuplicateAndBlockCount);
                    myObj.setCurrentResumeIndex(newDocIndex - 1);
                }
                else
                    myObj.setCurrentResumeIndex(0);

                clearInterval(_pollRunning);
                _pollRunning = null;
                myObj.loadFastFlip(callback);
            }
        }, 1000);
    }

    this.loadUIEvents = function () {
        FFPopup = new FFPopup('FFForm');
        _msgBox = jQuery('#pnlFFMessage');
        _errBox = jQuery('#pnlFFError');
        _main = jQuery('#FFOuterWrapper');
        _fromEmail = jQuery("#_FastFlip_hdnFFSenderEmail").val();

        setupActionPanel();
        setupFlipArrows(this);
        setupBackLink(this);
        setupResumeTabs();
        setupViewLikeLink(this);
        setupIndexLinks();

        setupActionFormEvents();
    }

    this.unlockResume = function (did, index) {
        if (jQuery(".keysLeft").text() == "0 Left")
            jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('sbRemainingKeysZero'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
        else {
            this.loadOneResume(did, this.displayResume, index, 'unlockResume');
            CB.Tally('fastflip', 'unlock', 'unlock');
        }
    }

    this.showLikedResumes = function () {
        //we now turn around and store the original stack and extract the likes resume and display them.
        _myIndexRef.setShowingLikesResumes(true);
        _myIndexRef.setShowIndexPage(true);
        //_myIndexRef.setTotalDocumentsCount(_myIndexRef.getDocumentsLiked().length);
        _myIndexRef.setOriginalResumeIndexBookmark(this.getCurrentResumeIndex());

        _myIndexRef.setupIndexPage();

        //hide stuff
        jQuery("#basicview").hide();
        jQuery("#switchToBasicResDetailView").hide();
        jQuery("#resumeflipsplitter").hide();
        jQuery("#profileOption").hide();
        jQuery("#resumeFlipLnkBack").hide();
        //if (ScriptVariables.Get('IsResumeScoreFeatureEnable')) {
        //	ResumeScoreMatchEngine.showResumeFlipContent();
        //}        

        this.flipToResume(0);

        //change the header
        jQuery("#ffheader").css("background-image", "url('http://img.icbdr.com/images/images/jpimages/ffheaderbg_likes.png')");
        jQuery("#ffheader a.lnkBack").html(ScriptVariables.Get('BackToStack'));
        jQuery("#resumeFlipLnkBack").css("padding-top", "8px");
        jQuery("#resumeflipsplitter").css("border-left", "1px solid #396139");
        jQuery("#ffheader #FFLogo img").attr("src", "http://img.icbdr.com/images/images/jpimages/fflogo3_likes.gif");
        jQuery("#ffheader #FFLogo").css("width", "auto");

        jQuery("#hlLikes").hide();
        jQuery("#likelinks").append(jQuery(".lnkBack").clone(true));
    }

    function setupViewLikeLink(myObj) {
        jQuery("#hlLikes").on("click", function () {
            if (_myIndexRef.getDocumentsLiked().length > 0) {
                jQuery(window).scrollTop(0);
                jQuery("#resumeContainer").empty();
                jQuery("<div style='clear:both; padding-top:210px;'></div>").appendTo("#resumeContainer");
                jQuery("#likesLoading").clone().show().appendTo("#resumeContainer");
                emaiIdClick = false;
                setTimeout(function () { myObj.showLikedResumes() }, 1000);
            }
            else {
                jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('noResumesLiked'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
            }
        });
    }

    this.SetHtmlTextToEditor = function (theTextToAdd) {
        var editor = $find('_FastFlip_mxreLetter_mxRadEditor');
        var sEditorText = editor.get_html(true);
        if (document.selection) //IE support
        {
            editor.set_html(sEditorText + theTextToAdd);
        }
        else
            editor.pasteHtml(theTextToAdd);
    }

    var keyup_handler = function (event) {

        if (event.which == '27') {
            //Exit fast flip using esc.
            event.preventDefault();
            _myFFUI.exitViewer();
        }
        else if (event.which == '37') {
            //PREVIOUS RESUME
            event.preventDefault();
            if (ScriptVariables.Get('EnableExclusionFilters') == "true") {
                jQuery("#resumeHolder2 #flip_prev img#arrow_prev").trigger('click');
            }
            else {
                _myFFUI.flipToResume(_myFFUI.getCurrentResumeIndex() - 1);
            }
        }
        else if (event.which == '39') {
            //NEXT RESUME
            event.preventDefault();
            if (ScriptVariables.Get('EnableExclusionFilters') == "true") {
                jQuery("#resumeHolder2 #flip_next img#arrow_next").trigger('click');
            }
            else {
                _myFFUI.flipToResume(_myFFUI.getCurrentResumeIndex() + 1);
            }
        }
        else if (event.which == '76') {
            //LIKE IT/Unlike it!
            var curResumes = _myIndexRef.getCurrentWorkingStack();
            var resumedid = curResumes[_myFFUI.getCurrentResumeIndex() - 1].getDid();
            event.preventDefault();
            if (!curResumes[_myFFUI.getCurrentResumeIndex() - 1].getLiked()) {
                if (resumedid)
                    _myFFUI.UILikeIt(resumedid);
            }
            else {
                if (resumedid)
                    _myFFUI.UIUnlikeIt(resumedid);
            }

        }
    }

    var keypress_handler = function (event) {
        if (event.which == '38') {
            //scroll up
            jQuery(window).scrollTop(jQuery(window).scrollTop() - 40);
        }
        else if (event.which == '40') {
            //scroll down
            jQuery(window).scrollTop(jQuery(window).scrollTop() + 40);
        }
        else if (event.which == '33') {
            //page up
            jQuery(window).scrollTop(jQuery(window).scrollTop() - jQuery(window).height());
        }
        else if (event.which == '34') {
            //page down
            jQuery(window).scrollTop(jQuery(window).scrollTop() + jQuery(window).height());
        }
    }

    this.setupKeyboardEvents = function () {
        jQuery(document.documentElement).bind("keyup", keyup_handler);
        jQuery(document.documentElement).bind("keypress", keypress_handler);
    }

    this.unbindKeyboardEvents = function () {
        //unbind keyboard events because it interferes with parent page
        jQuery(document.documentElement).unbind("keyup", keyup_handler);
        jQuery(document.documentElement).unbind("keypress", keypress_handler);
    }


    //Add tag popup
    $("#ResumeFlipAddTagPopup").dialog({
        autoOpen: false,
        height: 210,
        width: 240,
        modal: true,
        open:
			function () {	// hides the x in the upper right corner
			    $(this).parent().children(':first').children('a').remove();
			},
        buttons: {
            "Save Tag": function () {

                addNewFlipResumeTag();
                $("#ffheader").css("z-index", "4000000");
                $(this).dialog("close");

            },
            Cancel: function () {
                $("#ffheader").css("z-index", "4000000");
                $(this).dialog("close");
            }
        },
        close: function () {
            //allFields.val("").removeClass("ui-state-error");
        }
    });


    //Appears if you close resume flip with resumes still liked
    $("#ResumeFlipWaitPopup").dialog({
        autoOpen: false,
        height: 210,
        width: 320,
        modal: true,
        buttons: {
            "Exit anyway": function () {

                _myFFUI.exitViewer();

                $(this).dialog("close");

            },
            "Go to Liked Resumes": function () {
                // $("#ffheader").css("z-index", "4000000");
                $(this).dialog("close");
                $("#hlLikes").trigger('click');
            }
        },
        close: function () {
            //allFields.val("").removeClass("ui-state-error");
        }
    });


    //Bulk Add tag popup
    $("#ResumeFlipBulkAddTagPopup").dialog({
        autoOpen: false,
        height: 210,
        width: 240,
        modal: true,
        buttons: {
            "Save Tag": function () {

                addNewFlipResumeBulkTag();
                $("#ffheader").css("z-index", "4000000");
                $(this).dialog("close");

            },
            Cancel: function () {
                $("#ffheader").css("z-index", "4000000");
                $(this).dialog("close");
            }
        },
        close: function () {
            //allFields.val("").removeClass("ui-state-error");
        }
    });


    if (ScriptVariables.Get('EnableTagsInFlip') == "true") {
        jQuery("#resumeFlipTags").show();

        jQuery("#resumeFlipTags").on("click", '.addFlipTagLabel', function (event) {
            var curResumes = _myIndexRef.getCurrentWorkingStack();
            var resumedid = curResumes[_myFFUI.getCurrentResumeIndex() - 1].getDid();
            $(".addFlipTagLabel").attr("resume", resumedid);
            $("#ffheader").css("z-index", "1");
            $("#ResumeFlipAddTagPopup").dialog("open");
        });


        jQuery("#resumeFlipTags").on("click", '.publicTagEnd, .privateTagEnd, .publicCoworkerTagEnd', function (event) {

            var curResumes = _myIndexRef.getCurrentWorkingStack();
            var resumedid = curResumes[_myFFUI.getCurrentResumeIndex() - 1].getDid();
            var tagName = jQuery(this).prev('.tagName').attr("title");
            var tagDID = jQuery(this).prev('.tagName').attr("tag");
            var taggedBy = jQuery(this).prev('.tagName').attr("taggedBy");
            var ajaxPage = "DeleteTag.aspx";
            var dataparams = "TagDID=" + tagDID + "&ResumeDID=" + resumedid + "&taggedBy=" + taggedBy + "&DeleteType=single";

            jQuery(".addFlipTagLabel").show();

            //Remove row from resume flip list
            jQuery(this).prev('.tagName').remove();
            jQuery(this).next("br").remove();
            jQuery(this).remove();


            //This also needs to be removed from the results list


            jQuery.ajax({
                type: "POST",
                url: "../Resumes/AJAX/" + ajaxPage,
                data: dataparams,
                timeout: 80000,
                dataType: 'json',
                success: function (msg) {
                    var response = msg;
                }
            });


        });

        jQuery(document).on("click", '#viewCoworkerFlipTags', function (event) {

            var curResumes = _myIndexRef.getCurrentWorkingStack();
            var resumedid = curResumes[_myFFUI.getCurrentResumeIndex() - 1].getDid();

            getCoworkerFlipTags(resumedid);
        });
    }


    function addNewFlipResumeBulkTag() {

        var tagName = jQuery("#ResumeFlipBulkAddTagPopup .AddTagPopupText input").val();
        var tagType = jQuery("#ResumeFlipBulkAddTagPopup .AddTagType input:checked").val();
        var resumeDIDList = "";
        var resumeDID = "";
        var existingTags = "";
        var createTagType = "";
        var tagExists = false;

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
        jQuery("#fastflipindex input[type='checkbox']:checked").each(function (index, value) {

            resumeDID = this.id.split("_")[1];

            tagExists = false
            existingTags = jQuery("#" + resumeDID + "_resumetaglist").children('.tagName');
            existingTagsLength = jQuery("#" + resumeDID + "_resumetaglist").children('.tagName').length;

            if (existingTagsLength >= 5) {
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

                //Add the new tag to the results page.  This will most likely be moved to a loop in the success part of the AJAX call.
                var newTag = tagify(tagName, createTagType);
                jQuery("#" + resumeDID + "_resumetaglist").append(newTag);

                //Hide add tag link if there are 5 tags
                if (jQuery("#" + resumeDID + "_resumetaglist").children('.tagName').length >= 5) {
                    jQuery("#" + resumeDID + "_resumetaglist").siblings('.addTagLabel').hide();
                }
            }

        });


        var encodedTagName = encodeURIComponent(tagName);
        var drlPart = "drl=tagmanagementadd";
            drlPart += ";tagactionadd";

        var dataparams = drlPart + "&rrl=" + resumeDIDList + "&tagType=" + tagType + "&tag=" + encodedTagName;
        
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

                //Clear out popup input after tag has been added
                jQuery("#ResumeFlipBulkAddTagPopup .AddTagPopupText input").val("");

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


            },
            error: function (xhr, status, error) {
                hideLoadingSpinner();
                if (xhr.status === 403) {
                    sessionTimeout();
                }
            }

        });


        //Add new dialog box here to confirm
        jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('FastFlip') + "The tag [" + tagName + "] has been added to these resumes", 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': 'Exit Viewer'  });

    }



    function addNewFlipResumeTag() {

        var resumeDID = jQuery(".addFlipTagLabel").attr("resume");
        var tagName = jQuery("#ResumeFlipAddTagPopup .AddTagPopupText input").val();
        var tagType = jQuery("#ResumeFlipAddTagPopup .AddTagType input:checked").val();
        var tagExists = false;


        if (tagName == undefined || tagName == "") {
            return;
        }


        //check if already exists
        var existingTags = jQuery("#resumeFlipTagList").children('.tagName');

        existingTags.each(function () {

            var existingTag = $(this).attr("title");
            var privacyLevel = $(this).next("img").attr("class");

            if (privacyLevel === "xfortag_green") {
                privacyLevel = "public";
            }
            else if (privacyLevel === "xfortag_red") {
                privacyLevel = "private";
            }

            if (existingTag === tagName) {
                tagExists = true;

                //if same privacy level. 
                if (tagType === privacyLevel) {
                    jQuery.CBMessageBox('show', { 'message': 'This tag already exists on this resume.', 'caption': 'Tag already exists', 'confirmString': ScriptVariables.Get('DialogOK') });
                }
                else {
                    jQuery.CBMessageBox('show', { 'message': 'You already have a tag with that name, but with a different privacy setting (shared/private). Please reuse that tag or create a new tag with a different name.', 'caption': 'Tag already exists', 'confirmString': ScriptVariables.Get('DialogOK') });

                }
                return;
            }

        });

        if (tagExists === true) {
            return;
        }

        var encodedTagName = encodeURIComponent(tagName);
        var drlPart = "drl=tagmanagementadd";
            drlPart += ";tagactionadd";        

       var semanticID = '';
       var QID = '';

       if (typeof g_semanticID != 'undefined' && g_semanticID != null)
        semanticID = 1;
       if (typeof g_QID != 'undefined' && g_QID != null)
        QID += g_QID;

        var dataparams = drlPart + "&rrl=" + resumeDID + "&tagType=" + tagType + "&tag=" + encodedTagName;

        if (semanticID == 1)
            dataparams += '&semanticID=' + g_semanticID;
        if (QID != '')
            dataparams += '&QID=' + QID;

        var resumeLocInList = getRelativeResumePosition(resumeDID);
        if (getFromStrcrit('RPP=') !== "")
            dataparams += '&absoluteresumeloc=' + (resumeLocInList + 1 + ((g_curSetPage - 1) * getFromStrcrit('RPP=')));
        dataparams += '&relativeresumeloc=' + 'pg:' + g_curSetPage + "|loc:" + (resumeLocInList + 1);

        dataparams += "&fastflip=true";
        //showLoadingSpinner();

        jQuery.ajax({
            type: "POST",
            url: "../Resumes/AJAX/" + "TagAction.aspx",
            data: dataparams,
            timeout: 40000,
            dataType: 'json',
            success: function (msg) {
                var response = msg;

                //hideLoadingSpinner();


                if (response.TagManagementAdd.OwnerDID != "") {
                    ownerDID = response.TagManagementAdd.OwnerDID;
                }

                var newTag = newTagTagify(tagName, tagType, ownerDID);

                //We need to add the tag to resume results also
                jQuery("#" + resumeDID + "_resumetaglist").append(newTag);

                //Add the new tag to the flip list
                newTag += "<br>"
                jQuery("#resumeFlipTagList").append(newTag);

                //Clear out popup input after tag has been added
                jQuery("#ResumeFlipAddTagPopup .AddTagPopupText input").val("");

                //Hide add tag link if there are 5 tags
                if (jQuery("#resumeFlipTagList").children('.tagName').length >= 5) {
                    jQuery(".addFlipTagLabel").hide();
                }

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

                //if (response.TagActionAdd.Status != "Ok" && response.TagActionAdd.Status != "Tag already exist for resume") {
                //jQuery("#" + resumeDID + "_tagmessage").text(response.TagActionAdd.Status);
                //jQuery("#" + resumeDID + "_tagmessage").show();
                //return;
                //}

            },
            error: function (xhr, status, error) {
                hideLoadingSpinner();
                if (xhr.status === 403) {
                    sessionTimeout();
                }
            }

        });

    }


    function getCoworkerFlipTags(did) {

        var resumeDID = did;

        jQuery("#coworkerFlipTagList").toggle();

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

                displayCoworkerFlipTags(response.ResumeCoworkerTagList, resumeDID);
            }
        });
    }

    function displayCoworkerFlipTags(response, resumeDID) {
        if (response.Status != "Ok") {
            return;
        }

        jQuery("#coworkerFlipTagList").setTemplate(jQuery("#coworkerTagDropdownTemplateHolder").html());
       
            jQuery("#coworkerFlipTagList").processTemplate({ "Item": response.TagList });
       
        //if (jQuery("#coworkertagdropdown").is(':visible')) {
        // jQuery("#coworkertagdropdown").hide();
        // }
        // else {
        // alert("not hidden");
        //coworkerTagPopup.show(document.getElementById(resumeDID), null, 0, -13);
        // }
    }

    function setupActionFormEvents() {
        jQuery("#btnUnlockButton").on("click", function (event) {
            //triggered when the user clicks Unlock button
            var curResumes = _myIndexRef.getCurrentWorkingStack();
            var resumedid = curResumes[_myFFUI.getCurrentResumeIndex() - 1].getDid();
            _myFFUI.unlockResume(resumedid, _myFFUI.getCurrentResumeIndex());
        });

        jQuery(".FFPopupCloser").on("click", function (event) {
            hideFFActionLayer(event);

            _myFFUI.setupKeyboardEvents();
        });

        jQuery("#btnFFSendEmail").on("click", function () {
            _myFFUI.EmailCandidate();

            _myFFUI.setupKeyboardEvents();
        });

        jQuery("#txtFwdFrom").bind("blur", function () {
            if (jQuery(this).val() == '')
                jQuery("#txtFwdFrom").val(fromEmail);
        });

        jQuery("#txtFwdSubject").bind("blur", function () {
            if (jQuery(this).val() == '')
                jQuery("#txtFwdSubject").val(ScriptVariables.Get('Subjecttext'));
        });

        jQuery("#btnFFForwardCandidate").on("click", function () {
            _myFFUI.ForwardResume();

            _myFFUI.setupKeyboardEvents();
        });

        jQuery("#_FastFlip_ddlDataTags").bind("change", function () {
            if (jQuery(this).val() != '') {
                var theTextToAdd = jQuery(this).val().replace('&lt;', '<').replace('&gt;', '>');
                _myFFUI.SetHtmlTextToEditor(theTextToAdd);
                jQuery(this).get(0).selectedIndex = 0;
            }
        });

        jQuery("#ddlEmailLetterList").bind("change", function () {
            var thedata = jQuery(this).val();

            if (thedata != '') {

                Utilities.ShowLoadingFFSpinner();

                jQuery.ajax({
                    type: "POST",
                    url: "../AJAX/" + "GetLetterData.aspx",
                    data: 'MXLetter_ResponseDID=' + thedata,
                    success: function (msg) {
                        Utilities.HideLoadingFFSpinner();
                        document.getElementById("_FastFlip_mxreLetter_mxRadEditor").value = msg;
                        var editor = $find('_FastFlip_mxreLetter_mxRadEditor');
                        editor.set_html(msg);
                    },
                    error: function (xhr, status, error) {

                        Utilities.HideLoadingFFSpinner();
                        if (xhr.status === 403) {
                            Utilities.SessionTimeout();
                        }
                        else {
                            if (ScriptVariables.Get('AjaxErrorLog') == "true") {
                                CB.Tally('JobPoster\UserControls\ResumeResults\ResumeFastFlip', 'AjaxCallErrorLog', xhr.status.toString());
                            }
                            jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('ErrorMsg'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
                        }
                    }
                });
            }
            else {
                document.getElementById("_FastFlip_mxreLetter_mxRadEditor").value = '';
                var editor = $find('_FastFlip_mxreLetter_mxRadEditor');
                editor.set_html('');
            }

        });
    }

    function setupResumeTabs() {
        jQuery("#resumeFormat").on("click", function (event) {

            var curResumes = _myIndexRef.getCurrentWorkingStack();
            var curResume = curResumes[_myFFUI.getCurrentResumeIndex() - 1];
            if ((ScriptVariables.Get('Product') == "viewbased") && curResume.getLocked()) {
                jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('sbUnlcokMessage'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': 'Yes', 'cancelString': 'No', 'confirmCallback': function () { _myFFUI.unlockResume(resumedid, _myFFUI.getCurrentResumeIndex()); } })
            } else {
                jQuery("#resumeFormat").css({ backgroundPosition: "0 -22px" });
                jQuery("#profileFormat").css({ backgroundPosition: "0 -22px" });
                jQuery("#resumeFormatName").css("color", "#fff");
                jQuery("#profileFormatName").css("color", "#333");
                _showProfile = false;
                _myFFUI.flipToResume(_myFFUI.getCurrentResumeIndex());
            }
        });

        jQuery("#profileFormat").on("click", function (event) {
            jQuery("#profileFormat").css({ backgroundPosition: "0 0" });
            jQuery("#resumeFormat").css({ backgroundPosition: "0 0" });
            jQuery("#profileFormatName").css("color", "#fff");
            jQuery("#resumeFormatName").css("color", "#333");
            _showProfile = true;
            _myFFUI.flipToResume(_myFFUI.getCurrentResumeIndex());
        });
    }

    function setupBackLink(myObj) {
        jQuery(".headercontent .lnkBack").on("click", function () {
            if (_myIndexRef.getShowingLikesResumes() == false && _myIndexRef.getDocumentsLiked().length > 0) {
                if (ScriptVariables.Get('EnableTagsInFlip') == "true") {

                    $("#ResumeFlipWaitPopup").dialog("open");
                }
                else {
                    jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('ExitFastFlip') + "\n" + ScriptVariables.Get('SaveYourLikes') + "<br/><strong>" + ScriptVariables.Get('Confirmexiting') + "</strong>", 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': 'Exit Viewer', 'cancelString': 'Cancel', 'confirmCallback': function () { myObj.exitViewer(); } });
                }

            } else {
                myObj.exitViewer();
            }
        });
    }

    function setupFlipArrows(myObj) {
        jQuery("#resumeHolder2 #flip_next img#arrow_next").on("click", function () {
            /*if(ScriptVariables.Get('Product') == "viewbased"){
            _myFFUI.AddLocks();
            myObj.flipToResume(myObj.getCurrentResumeIndex() + 1);
            RemoveLocksIfUnlockedForViewBased();
            }else
            myObj.flipToResume(myObj.getCurrentResumeIndex() + 1);*/

            if (ScriptVariables.Get('EnableExclusionFilters') == "true") {
                window.clickedNext = 1;
                var found = 0;
                var currentStack = _myIndexRef.getCurrentWorkingStack();
                var index = 1;
                var currentPage = _myIndexRef.getCurrentPage();
                var flip = 1;
                var currentIndex = myObj.getCurrentResumeIndex();
                var iterationCount = 0;
                if (updateExclusion == 1) {
                    currentIndex = currentIndex - 1;
                    window.updateExclusion = 0;
                }

                while (found == 0) {
                    iterationCount++;
                    if (currentIndex == currentStack.length || currentIndex + index > currentStack.length) {
                        if (currentPage == _myIndexRef.getNumberOfPages) {
                            jQuery('#flip_next').hide();
                            flip = 0;
                        }
                        found = 1;
                    }
                    else {
                        var actions = currentStack[currentIndex - 1 + index].getAllActions();
                        if (actions == "" || actions == null) {
                            found = 1;
                        }
                        else {
                            var actionsArray = actions.split(';').slice(0, -1);
							
								found = 1;
								for (var i = 0; i < actionsArray.length; i++)
								{
									for (var j = 0; j < exclusionListGlobal.length; j++)
									{
										if (actionsArray[i] == exclusionListGlobal[j])
										{
											found = 0;
											j = exclusionListGlobal.length;
											i = actionsArray.length;
										}
									}
								}
							
					
							if (found == 0) {
								index++;
							}
                        }
                        if (found == 1 && iterationCount == 1) {
                            Utilities.ShowLoadingFFSpinner()
                            window.setTimeout("Utilities.HideLoadingFFSpinner()", 750);
                        }
                    }
                }

                if (flip) {
                    myObj.flipToResume(currentIndex + index)
                }
            }
            else {
                myObj.flipToResume(myObj.getCurrentResumeIndex() + 1);
            }

        });

        jQuery("#resumeHolder2 #flip_prev img#arrow_prev").on("click", function () {
            /*if(ScriptVariables.Get('Product') == "viewbased"){
            _myFFUI.AddLocks();
            myObj.flipToResume(myObj.getCurrentResumeIndex() - 1, true);
            RemoveLocksIfUnlockedForViewBased();
            }else
            myObj.flipToResume(myObj.getCurrentResumeIndex() - 1, true);*/


            if (ScriptVariables.Get('EnableExclusionFilters') == "true") {
                window.clickedNext = 0;
                var found = 0;
                var currentStack = _myIndexRef.getCurrentWorkingStack();
                var index = 1;
                var currentPage = _myIndexRef.getCurrentPage();
                var flip = 1;
                var currentIndex = myObj.getCurrentResumeIndex();
                if (changingPage == 1) {
                    currentIndex += 2;
                }


                while (found == 0) {
                    if (currentIndex == 1 || currentIndex - index <= 0) {
                        if (currentPage == 1) {
                            jQuery('#flip_prev').hide();
                            flip = 0;
                        }
                        found = 1;
                    }
                    else {
                        var actions = currentStack[currentIndex - 1 - index].getAllActions();
                        if (actions == "" || actions == null) {
                            found = 1;
                        }
                        else {
                            var actionsArray = actions.split(';').slice(0, -1);
							
								found = 1;
								for (var i = 0; i < actionsArray.length; i++)
								{
									for (var j = 0; j < exclusionListGlobal.length; j++)
									{
										if (actionsArray[i] == exclusionListGlobal[j])
										{
											found = 0;
											j = exclusionListGlobal.length;
											i = actionsArray.length;
										}
									}
								}
							
							
                            if (found == 0) {
                                index++;
                            }
                        }
                    }
                }
                if (flip) {
                    window.changingPage = 0;
                    myObj.flipToResume(currentIndex - index, true)
                }
            }
            else {
                myObj.flipToResume(myObj.getCurrentResumeIndex() - 1, true);
            }

        });

        //Add or Remove locks if it is view based product
        /*function RemoveLocksIfUnlockedForViewBased(){
        var curResumes = _myIndexRef.getCurrentWorkingStack();
        var curResume = curResumes[_myFFUI.getCurrentResumeIndex() - 1];
			
        //Handle the resume which is loaded
        if(curResume.isLoaded()){
        if(curResume.getLocked())
        $('#profileFormat').trigger("click");
        else
        _myFFUI.RemoveLocks();
        }
        }*/
    }

    function setupIndexLinks() {
        jQuery(document).on("click", "#lnkSelectAll, #lnkSelectAll2", function () {
            jQuery(this).blur();

            if (jQuery("#chkAllResumes, #chkAllResumes2").is(":checked")) {
                jQuery("#chkAllResumes, #chkAllResumes2").removeAttr("checked");
                jQuery("input[type='checkbox']", "#fastflipindex").removeAttr("checked");
                jQuery("#lnkSelectAll, #lnkSelectAll2").html(ScriptVariables.Get('SelectAll'));
            }
            else {
                jQuery("#chkAllResumes, #chkAllResumes2").attr("checked", "checked");
                jQuery("input[type='checkbox']", "#fastflipindex").attr("checked", "checked");
                jQuery("#lnkSelectAll, #lnkSelectAll2").html(ScriptVariables.Get('UnselectAll'));
            }
        });

        jQuery(document).on("change", "#chkAllResumes", function () {
            jQuery(this).blur();

            if (jQuery("#chkAllResumes").is(":checked")) {
                    jQuery("#chkAllResumes2").prop('checked', true);
                    jQuery("input[type='checkbox']", "#fastflipindex").prop('checked', true);
                     jQuery("#lnkSelectAll, #lnkSelectAll2").html(ScriptVariables.Get('UnselectAll'));
            }
            else {
                jQuery("#chkAllResumes2").removeAttr("checked");
                jQuery("input[type='checkbox']", "#fastflipindex").removeAttr("checked");
                jQuery("#lnkSelectAll, #lnkSelectAll2").html(ScriptVariables.Get('SelectAll'));
            }

        });

        jQuery(document).on("change", "#chkAllResumes2", function () {
            jQuery(this).blur();

            if (jQuery("#chkAllResumes2").is(":checked")) {
                    jQuery("#chkAllResumes").prop('checked', true);
                    jQuery("input[type='checkbox']", "#fastflipindex").prop('checked', true);
                jQuery("#lnkSelectAll, #lnkSelectAll2").html(ScriptVariables.Get('UnselectAll'));
                jQuery("#lnkSelectAll2").html(ScriptVariables.Get('UnselectAll'));
            }
            else {
                jQuery("#chkAllResumes").removeAttr("checked");
                jQuery("input[type='checkbox']", "#fastflipindex").removeAttr("checked");
                jQuery("#lnkSelelectAll #lnkSelectAll2").html(ScriptVariables.Get('SelectAll'));
                jQuery("#lnkSelectAll2").html(ScriptVariables.Get('SelectAll'));
            }

        });
        
        jQuery(document).on("click", "#_FastFlip_lnkEmailAll, #_FastFlip_lnkEmailAll2", function (event) {

            _myFFUI.unbindKeyboardEvents();
            _myFFUI._bLikeEmailClick = true;
            if (getSelectedResumesCount() > 0)
                _myFFUI.showFFActionLayer_Email(event);
            else
                jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('MustSelectResume'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
        });

        jQuery(document).on("click", "#_FastFlip_lnkTNInviteAll, #_FastFlip_lnkTNInviteAll2", function (event) {
            var likedResumeDIDs = [];
            var likedResumes = _myFFUI.getIndex().getDocumentsLiked();
            for (var i = 0; i < likedResumes.length; i++) {
                var did = likedResumes[i].getDid();
                
                if (jQuery.inArray(did,tninvitedresumeindices) < 0) { // avoid sending duplicate invite requests
                    likedResumeDIDs.push(likedResumes[i].getDid());
                    tninvitedresumeindices.push(likedResumes[i].getDid()); // reuse this array for dids too, why not
                }
            }
            sendBulkTNInvitations(likedResumeDIDs.toString());
        });

        jQuery(document).on("click", "#_FastFlip_lnkFwdAll, #_FastFlip_lnkFwdAll2", function (event) {

            _myFFUI.unbindKeyboardEvents();

            if (getSelectedResumesCount() > 0)
                _myFFUI.showFFActionLayer_Forward(event);
            else
                jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('MustSelectResume'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
        });

        jQuery(document).on("click", "#_FastFlip_lnkSaveAll, #_FastFlip_lnkSaveAll2", function (event) {

            if (getSelectedResumesCount() > 0) {
                _myFFUI.showFFActionLayer_SaveToFolder(event);
            }
            else {
                jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('MustSelectResume'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
            }

        });

        jQuery(document).on("click", "#_FastFlip_lnkUnlikeAll, #_FastFlip_lnkUnlikeAll2", function (event) {

            if (getSelectedResumesCount() > 0) {
                _myFFUI.showFFActionLayer_Unlike(event);
            }
            else {
                jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('MustSelectResume'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
            }

        });

        if (ScriptVariables.Get('EnableTagsInFlip') == "true") {

            jQuery(document).on("click", "#_FastFlip_lnkTagResume, #_FastFlip_lnkTagResume2", function (event) {

                if (getSelectedResumesCount() > 0) {
                    $("#ResumeFlipBulkAddTagPopup").dialog("open");
                }
                else {
                    jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('MustSelectResume'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
                }

            });
        }

    }

    function getSelectedResumesCount() {
        return jQuery("input[type='checkbox']:checked", "#fastflipindex").size();
    }

    function hideFFActionLayer(event) {
        if (FFPopup) FFPopup.Hide(event);
    }

    function setupActionPanel() {

        jQuery("#actionPanel li").on("click", function (event) {
            var curResumes = _myIndexRef.getCurrentWorkingStack();
            var resumedid = curResumes[_myFFUI.getCurrentResumeIndex() - 1].getDid();
            if (resumedid != null) {

                var datastoreparam = '';
                var matchingdid = '';
                var semanticall = '';
                var semanticID = '';
                var QID = '';
                if (ScriptVariables.Get('NWDataStoreLabel_DID') != '')
                    datastoreparam = '&NWDataStoreLabel_DID=' + ScriptVariables.Get('NWDataStoreLabel_DID');
               
                if (ScriptVariables.Contains('Matching_ResumeDID')) {
                    matchingdid = ScriptVariables.Get('Matching_ResumeDID');
                }

                if (g_semanticSearchAll == "semanticsearchall" && !ScriptVariables.Contains('Matching_ResumeDID')) {
                    semanticall = "1";
                }
                if (typeof g_semanticID != 'undefined' && g_semanticID != null)
                    semanticID = 1;
                if (typeof g_QID != 'undefined' && g_QID != null)
                    QID += g_QID;

                switch (jQuery(this).attr("id")) {
                    case 'like':
                        if (jQuery(this).attr("class") != 'unlike') {
                            //we Like!
                            _myFFUI.UILikeIt(resumedid);
                        } else {
                            //we Unlike!
                            _myFFUI.UIUnlikeIt(resumedid);
                        }
                        break;
                    case 'fullprofile':
                        var resdetails = "";

                        resdetails = 'ResumeDetails.aspx?pg=' + ScriptVariables.Get('Current_Page') + '&strcrit=' + encodeURIComponent(g_strcrit) + '&V2=1&ResDetailsOpenNewWin=True&hl=1&MXAuditSearchCriteria_CriteriaDID=' + ScriptVariables.Get("MXAuditSearchCriteria_CriteriaDID") + '&fastflip=1' + '&Resume_DID=' + resumedid;

                        if (matchingdid != '')
                            resdetails += '&Matching_ResumeDID=' + matchingdid;
                        if (semanticall == "1")
                            resdetails += '&semanticsearchall=1';
                        if (semanticID == 1)
                            resdetails += '&semanticID=' + g_semanticID;
                        if (QID != '')
                            resdetails += '&QID=' + QID;

                        var resumeLocInList = getRelativeResumePosition(resumedid);
                        if (getFromStrcrit('RPP=') !== "")
                            resdetails += '&absoluteresumeloc=' + (resumeLocInList + 1 + ((g_curSetPage - 1) * getFromStrcrit('RPP=')));
                        resdetails += '&relativeresumeloc=' + 'pg:' + g_curSetPage + "|loc:" + (resumeLocInList + 1);

                        window.open(resdetails, 'fullprofile_' + resumedid);
                        break;
                    case 'print':
                        var printurl = 'PrintResume.aspx?Resume_DID=' + resumedid + '&V2=1' + datastoreparam + '&fastflip=true';
                        if (matchingdid != '')
                            printurl += '&Matching_ResumeDID=' + matchingdid;
                        if (semanticall == "1")
                            printurl += '&semanticsearchall=1';
                        if (semanticID == 1)
                            printurl += '&semanticID=' + g_semanticID;
                        if (QID != '')
                            printurl += '&QID=' + QID;
                                                                            
                            window.open(printurl, '', 'status=yes,height=500,width=700,scrollbars=yes,resizable=yes');
                        break;
                    case 'printv2':
                        var printurl = ""
                        if (ScriptVariables.Get("bFixRecordActionsForDataStore")) {
                            printurl = 'PrintResumeV2.aspx?Resume_DID=' + resumedid + '&V2=1' + datastoreparam + '&fastflip=true' + "&MXAuditSearchCriteria_CriteriaDID=" + g_auditID;
                        }
                        else {
                            printurl = 'PrintResumeV2.aspx?Resume_DID=' + resumedid + '&V2=1' + datastoreparam + '&fastflip=true';
                        }
                        if (matchingdid != '')
                            printurl += '&Matching_ResumeDID=' + matchingdid;
                        if (semanticall == "1")
                            printurl += '&semanticsearchall=1';
                        if (semanticID == 1)
                            printurl += '&semanticID=' + g_semanticID;
                        if (QID != '')
                            printurl += '&QID=' + QID;
                       
                        var resumeLocInList = getRelativeResumePosition(resumedid);
                        if (getFromStrcrit('RPP=') !== "")
                            printurl += '&absoluteresumeloc=' + (resumeLocInList + 1 + ((g_curSetPage - 1) * getFromStrcrit('RPP=')));
                        printurl += '&relativeresumeloc=' + 'pg:' + g_curSetPage + "|loc:" + (resumeLocInList + 1);

                        window.open(printurl, '', 'status=yes,height=500,width=700,scrollbars=yes,resizable=yes');
                        break;
                    case 'block':
                        _myFFUI.sendBlockRequest(resumedid, datastoreparam);
                        _myIndexRef.RemoveResume(resumedid);
                        _myFFUI.flipToResume(_myFFUI.getCurrentResumeIndex());
                        break;
                    case 'forward':
                        _myFFUI.unbindKeyboardEvents();
                        _myFFUI.showFFActionLayer_Forward(event);
                        break;
                    case 'email':
                            emaiIdClick = true;
                            _myFFUI.unbindKeyboardEvents();
                            _myFFUI.showFFActionLayer_Email(event);
                             break;

                    case 'Report':
                        _myFFUI.unbindKeyboardEvents();
                        _myFFUI.showFFActionLayer_ReportResume(event, resumedid);
                        break;

                    case 'download':
                        var worddocdid = curResumes[_myFFUI.getCurrentResumeIndex() - 1].getDocDid();
                        var worddocurl = ScriptVariables.Get('urlroot') + 'JobPoster/Resumes/ResumeWordDocSave.aspx' + '?Resume_DID=' + resumedid + '&fastflip=true&MXResumeWordDoc_DID=' + worddocdid;
                        if (worddocdid != '') {
                            if (matchingdid != '')
                                worddocurl += '&Matching_ResumeDID=' + matchingdid;
                            if (semanticall == "1")
                                worddocurl += '&semanticsearchall=1';
                            if (semanticID == 1)
                                worddocurl += '&semanticID=' + g_semanticID;
                            if (QID != '')
                                worddocurl += '&QID=' + QID;

                            var resumeLocInList = getRelativeResumePosition(resumedid);
                            if (getFromStrcrit('RPP=') !== "")
                                worddocurl += '&absoluteresumeloc=' + (resumeLocInList + 1 + ((g_curSetPage - 1) * getFromStrcrit('RPP=')));
                            worddocurl += '&relativeresumeloc=' + 'pg:' + g_curSetPage + "|loc:" + (resumeLocInList + 1);

                            window.open(worddocurl);
                        }
                        else {
                            jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('NotunWordFormat'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
                        }

                        break;
                    case 'talentnetworkavailable':
                        
                        if (jQuery.inArray(_myFFUI.getCurrentResumeIndex(),tninvitedresumeindices) >= 0) {
                            jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('TNAlreadyInvited'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
                        }
                        else {
                            sendTNInvitation(jQuery(this), resumedid);
                            tninvitedresumeindices.push(_myFFUI.getCurrentResumeIndex());
                        }
                        break;
                    case 'talentnetworkinvited':
                        break;
                    case 'talentnetworkjoined':
                        break;
                    default:
                        alert(jQuery(this).attr("id"));
                }
            }

        });
    }

    this.setupSearchInfo = function () {
        var search = jQuery("#resumesearch").val();
        var location = jQuery("#loc").val();
        if(typeof createSemanticSlider != 'undefined'){
            location = jQuery('.loc-selected').text();
        }

        if (location == '')
            location = ScriptVariables.Get('locAllLocations');

        if (search == '')
            search = ScriptVariables.Get('locAllKeywords')

        jQuery("#ffheader .headercontent #searchterm").html(search + ' ' + ScriptVariables.Get('locIn') + ' ' + location);
    }

    this.showOriginalResumes = function () {
        //change the header
        _myIndexRef.setShowingLikesResumes(false);

        //show stuff
        jQuery("#ffheader #FFLogo").css("width", "115px");
        jQuery("#basicview").show();
        jQuery("#switchToBasicResDetailView").show();
        jQuery("#resumeflipsplitter").show();
        jQuery("#resumeFlipLnkBack").show();

        jQuery("#ffheader").css("background-image", "url('http://img.icbdr.com/images/images/jpimages/ffheaderbg.png')");
        setupExitLink();
        jQuery("#ffheader #FFLogo img").attr("src", "http://img.icbdr.com/images/images/jpimages/fflogo3.gif");

        //if (!_resumeDetailFF)
        //_myIndexRef.setupIndexPage();

        //g_totalResumeCount = resumesjson.length;

        jQuery("#hlLikes").show();
        jQuery("#likelinks .lnkBack").remove();

        this.flipToResume(_myIndexRef.getOriginalResumeIndexBookmark());

    }

    this.loadFastFlip = function (callback, did_optional) {
        if (_myIndexRef == null)
            _myIndexRef = new FFResumeIndex(_showIndex);

        _myIndexRef.Load(callback, this, did_optional);

    }

    this.getResumeProfile = function (newResDID) {
        Utilities.ShowLoadingFFSpinner();

        //before we try to load the profile, lets see if we have it in cache


        var ProfileDataURL = jQuery('#_FastFlip_pnlProfileURLStaging input[type = hidden]').val();
        var strCrit = Utilities.QueryStringEdit(ProfileDataURL, 'strcrit');

        if (strCrit != false) {
            var strCritEncoded = "strcrit=" + encodeURIComponent(strCrit[1]);
            ProfileDataURL = ProfileDataURL.replace(/(strcrit=)[^\&]+/, strCritEncoded);
        }

        ProfileDataURL = ProfileDataURL + '&Resume_DID=' + newResDID;

        jQuery.ajax({
            type: "GET",
            url: ProfileDataURL,
            data: 'html',
            success: function (response) {
                Utilities.HideLoadingFFSpinner();
                var responseHTML = jQuery(response);
                //jQuery('#resumeContainer').html(responseHTML.find('#resumeDetailResume'));	                
                var profilehtml = responseHTML.find('#detailslbl');
                jQuery('#resumeProfileContainer').html(profilehtml);
                jQuery('#divCEFixe').remove();
                _myIndexRef.LoadProfileContent(profilehtml, newResDID);

                if (profilehtml.find('.lockImg')[0] != null && ScriptVariables.Get('Product') == "viewbased")
                    _myFFUI.AddLocks();
            },
            error: function (obj) {
                Utilities.HideLoadingFFSpinner();
                if (ScriptVariables.Get('AjaxErrorLog') == "true") {
                    CB.Tally('JobPoster\UserControls\ResumeResults\ResumeFastFlip', 'AjaxCallErrorLog', obj.toString());
                }
                jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('ErrorMsg'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
            }
        });
    }

    function afterFastFlipLoad(myObj) {
        if (myObj.getShowIndexPage())
            myObj.flipToResume(myObj.getCurrentResumeIndex());
        else
            if (ScriptVariables.Get('EnableExclusionFilters') == "true") {
                if (clickedNext == 1) {
                    jQuery("#resumeHolder2 #flip_next img#arrow_next").trigger('click');
                }
                else if (clickedNext == 0) {
                    window.changingPage = 1;
                    jQuery("#resumeHolder2 #flip_prev img#arrow_prev").trigger('click');
                }
                else {
                    myObj.flipToResume(myObj.getCurrentResumeIndex() + 1);
                }
            }
            else {
                myObj.flipToResume(myObj.getCurrentResumeIndex() + 1);
            }
    }

    this.startupFastFlip = function (did_optional) {
        //if (ScriptVariables.Get('IsResumeScoreFeatureEnable')) {
        //	jQuery("#FastFlipDialog").dialog('option', 'width', '1032');
        //	jQuery("#HTMLResumeContainer").css("width", "858px");
        //	jQuery("#HTMLResumeContainer").css("background-repeat", "repeat-x");
        //	jQuery("#topBar").css("width", "884px");
        //	jQuery("#NameAndLastViewed").css("width", "337px");
        //	jQuery("#FFResume").css("background-image", "url('http://img.icbdr.com/images/images/jpimages/resbg_884x1.gif')");
        //}

        jQuery(window).scrollTop(0);
        jQuery("#FastFlipDialog").dialog('open');

        //if not firststime
        //if (!this.getShowSplashScreen())    	
        Utilities.ShowLoadingFFSpinner();

        jQuery("#resumeFlipCandidateName").hide();
        jQuery("#resumeFlipLastActionBar").hide();
        jQuery("#resumeFlipLastAction").hide();

        setLeftFix();
        setupExitLink();

        setupFastFlipHeader();

        if (_myIndexRef == null || _myIndexRef.isLoaded() == false) {
            //_myIndexRef = new FFResumeIndex(_showIndex);
            //_myIndexRef.Load(0, afterIndexLoad, this);

            this.loadFastFlip(afterIndexLoad, did_optional);
        }
        else {
            this.afterIndexLoad(this, did_optional);
        }

        jQuery(window).scrollTop(0);


        jQuery("#resumeflipsplitter").css("border-left", "1px solid #5A719B;");
        jQuery(".ui-widget-overlay").after(jQuery("#ffheader").show());
        positionActionPanel();

        if (ScriptVariables.Get('EnableExclusionFilters') == "true") {
            postionExclusionPanel();
        }


        if (ScriptVariables.Get('EnableTagsInFlip') == "true") {
            postionTagsPanel();
        }

        positionTopBar();

        if (ScriptVariables.Get('Product') == "viewbased")
            positionUnlockPanel();

        if (this.getShowSplashScreen())
            showSplash();
        else
            hideSplash();

        if (ScriptVariables.Get('Product') == "viewbased") {
            this.AddLocks();
            jQuery("#unlockPanel").show();
        } else {
            this.RemoveLocks();
            jQuery("#unlockPanel").hide();
        }
    };

    this.loadOneResume = function (did, callback, index, activity) {
        var myFFResume = new FFResume(did);
        myFFResume.Load(callback, _myIndexRef, index, activity);
    }

    this.flipToResume = function (index, leftarrowpressed) {
        if (_pollRunning != null)
            return;
        
        this.setCurrentResumeIndex(index);

        jQuery("#spnCur").html(Utilities.NumberWithCommas(this.getCurrentResumeNumber()));

        
            if (_myIndexRef == null ) {
                this.NoMoreResumesToShow();
                return;
            }
        
       
        var endCount = -1

        if (_myIndexRef.getShowingLikesResumes())
            endCount = _myIndexRef.getTotalResumeCount();
        else
            endCount = _myIndexRef.getGrandTotalResumeCount();

        if (index == 0) {
            //show them index page - in most cases!

            if (!_myIndexRef.getShowingLikesResumes() && leftarrowpressed == true && _myIndexRef.getCurrentPage() > 1) {
                //in this case we want to go back to the last resume of the pageset before the current one
                //so we need to load the index for that pageset as well

                if (_pollRunning != null)
                    return;

                jQuery("#Pagination").trigger('setPage', _myIndexRef.getCurrentPage() - 2);
                pollForUpdatedCollection(afterFastFlipLoad, this, true);
                return;
            }

            if (_myIndexRef.getShowingLikesResumes()) {
                jQuery("#infoBar").hide();
                jQuery("#tbTopActions").show();
                jQuery(".thumb").remove();
                jQuery("#resumeFlipLastActionBar").hide();
            }
            else {
                jQuery("#infoBar").show().children("#infoBar_Resumes").hide().end().children("#infoBar_Index").show();
            }

            jQuery(window).scrollTop(0);
            jQuery("#actionPanel").show();
            jQuery("#actions").hide();
            jQuery("#like").css("visibility", "hidden");

            jQuery("#exclusionsPanel").hide()

            if (ScriptVariables.Get('EnableTagsInFlip') == "true") {
                jQuery("#resumeFlipTags").hide();
                jQuery(".bulkFlipAddTag").show();
            }

            jQuery("#spnTotal2").html(Utilities.NumberWithCommas(_myIndexRef.getGrandTotalResumeCount()));
            jQuery("#spnFirstResumeNumber").html((_myIndexRef.getCurrentPage() - 1) * _myIndexRef.getNumberOfDocsPerPage() + 1);
            jQuery("#spnLastResumeNumber").html((_myIndexRef.getCurrentPage() - 1) * _myIndexRef.getNumberOfDocsPerPage() + _myIndexRef.getTotalResumeCount());

            jQuery("#FastFlipPages").css("display", "none");

            jQuery("#resumeFlipCandidateName").hide();
            jQuery("#resumeFlipLastAction").hide();
            jQuery("#resumeProfileContainer").hide();
            jQuery("#resumeContainer").show();
            jQuery("#resumeContainer").html(jQuery("#jTemplateWrapper"));
            if (ScriptVariables.Get('Product') == "viewbased") {//Remove the locks for viewbased
                _myFFUI.RemoveLocks();
                jQuery("#unlockPanel").hide();
            }
        }
        else if (index > 0 && index <= endCount) {

            //if (_resumeDetailFF) {
            jQuery("#actionPanel").show();
            jQuery("#backToIndex").hide();
            jQuery("#arrowBackHome").hide();
            jQuery("#infoBar").show().children("#infoBar_Index").hide().end().children("#infoBar_Resumes").show();
            //}
            //else {  
            //jQuery("#infoBar").show().children("#infoBar_Index").hide().end().children("#infoBar_Resumes").show();
            //}

            if (!_myIndexRef.getShowingLikesResumes() && _myIndexRef.getTotalResumeCount() < index && _myIndexRef.getCurrentPage() < _myIndexRef.getNumberOfPages()) {
                //we have reached out of index - we need to load the next set of resume-index.
                //we pass in 1 as an extraParameter to signal to the pagination to show the 1st resume
                //instead of the index once the index is done loading.

                //if (!_resumeDetailFF) {						
                if (_pollRunning != null)
                    return;

                jQuery("#Pagination").trigger('setPage', _myIndexRef.getCurrentPage());
                pollForUpdatedCollection(afterFastFlipLoad, this, false);
                return;
            }

            //Add locks if it is viewbased product, locks would be removed if the resume is unlocked after loading..
            if (ScriptVariables.Get('Product') == "viewbased") {
                _myFFUI.AddLocks();
            }

            //see if we need to load this resume...	
            var curResumes = _myIndexRef.getCurrentWorkingStack();

            //if the index is higher tan curResumes length, there are no more resumes to show
            if (curResumes.length < index) {
                jQuery('#flip_next').hide();
                jQuery.CBMessageBox('show', { 'message': ScriptVariables.Get('NoResumestoView'), 'caption': ScriptVariables.Get('ResumeFlip'), 'confirmString': ScriptVariables.Get('DialogOK') });
                return;
            }


            var did = curResumes[index - 1].getDid();

            if (ScriptVariables.Get('EnableTagsInFlip') == "true") {
                populateTagList(did);
            }

            if (curResumes[index - 1].isLoaded() == false) {
                if (_myIndexRef.getCurIndexXHR() != null)
                    _myIndexRef.getCurIndexXHR().abort();

                if (ScriptVariables.Get('FastFlipType') == DocumentType.App)
                    did = did + "~" + curResumes[index - 1].getLastModified();

                this.loadOneResume(did, this.displayResume, index);
            }
            else {
                //document is already loaded - we just display it!
                this.displayResume(index);
                // If viewbased product, check if locks should be removed
                if (ScriptVariables.Get('Product') == "viewbased") {
                    if (curResumes[index - 1].getLocked()) {
                        if (!_myFFUI.getShowProfile())
                            $('#profileFormat').trigger("click");
                    }
                    else
                        _myFFUI.RemoveLocks();
                }
            }
        }

        //hide arrows if we are on the end of spectrums
        var firstPage = 0;
        if (_myIndexRef.getShowIndexPage() == false)
            firstPage = 1;

        jQuery('#flip_prev').show();
        jQuery('#flip_next').show();

        if (!_resumeDetailFF && ScriptVariables.Get('FastFlipType') == DocumentType.App) {
            jQuery('#backToIndex').show();
            jQuery('#arrowBackHome').show();
        }

        if (this.getCurrentResumeIndex() == 0 || ((this.getCurrentResumeIndex() == firstPage) && _myIndexRef.getCurrentPage() == 1)) {
            jQuery('#flip_prev').hide();
            jQuery('#backToIndex').hide();
            jQuery('#arrowBackHome').hide();

        }

        if (_myIndexRef.getShowingLikesResumes() && endCount == this.getCurrentResumeIndex()) {
            jQuery('#flip_next').hide();
        }
        else if (_myIndexRef.getCurrentPage() == _myIndexRef.getNumberOfPages() && this.getCurrentResumeIndex() >= _myIndexRef.getDocuments().length) {
            jQuery('#flip_next').hide();
        }


        //if (ScriptVariables.Get('IsResumeScoreFeatureEnable')) {
        //	 ResumeScoreMatchEngine.showResumeFlipContent();
        //}

    };

    this.displayResume = function (index) {
        if (jQuery("#jTemplateLikes").is(':empty')) {
            jQuery("#jTemplateLikes").html(jQuery("#resumeContainer #jTemplateWrapper"));
        }

        if (_myIndexRef.getShowingLikesResumes()) {
            jQuery("#spnTotal").html(Utilities.NumberWithCommas(_myIndexRef.getTotalResumeCount()));
            jQuery("#spnTotal2").html(Utilities.NumberWithCommas(_myIndexRef.getTotalResumeCount()));
        } else {
            jQuery("#spnTotal").html(Utilities.NumberWithCommas(_myIndexRef.getGrandTotalResumeCount()));
            jQuery("#spnTotal2").html(Utilities.NumberWithCommas(_myIndexRef.getGrandTotalResumeCount()));
        }

        jQuery("#spnFirstResumeNumber").html(Utilities.NumberWithCommas((_myIndexRef.getCurrentPage() - 1) * _myIndexRef.getNumberOfDocsPerPage() + 1));
        jQuery("#spnLastResumeNumber").html(Utilities.NumberWithCommas((_myIndexRef.getCurrentPage() - 1) * _myIndexRef.getNumberOfDocsPerPage() + _myIndexRef.getTotalResumeCount()));

        jQuery(window).scrollTop(0);

        jQuery("#FastFlipPages").show();

        if (ScriptVariables.Get('EnableExclusionFilters') == "true") {
            jQuery("#FastFlipPages").hide();
        }

        jQuery("#like").css("visibility", "visible");
        jQuery("#actions").show();

        jQuery("#exclusionsPanel").show();

        if (ScriptVariables.Get('EnableTagsInFlip') == "true") {
            jQuery("#resumeFlipTags").show();
        }

        var curResumes = _myIndexRef.getCurrentWorkingStack();
        var docs = _myIndexRef.getDocuments();
        var did = curResumes[index - 1].getDid();
        var contype = curResumes[index - 1].getContentType();

        var name = curResumes[index - 1].getName();
        var candidateLastViewedDate = curResumes[index - 1].getCandidateLastViewedDate();
        var accountLastActionBar = false;
        var accountLastAction = curResumes[index - 1].getAccountLastAction();
        var accountLastActionDate = curResumes[index - 1].getAccountLastActionDate();

        

        jQuery("#resumeFlipCandidateName").text(name);
        jQuery("#resumeFlipCandidateName").show();

        if (ScriptVariables.Get("fastFlipProfile") == "True") {
            if (ScriptVariables.Get('FastFlipType') == DocumentType.App) {
                jQuery("#profileOption").hide();
                jQuery("#ResumesInfo").show();
            }
            else {
                jQuery("#profileOption").show();
                jQuery("#ResumesInfo").hide();
            }
        }

        if (ScriptVariables.Get('FastFlipType') != DocumentType.App) {
            if (candidateLastViewedDate != '') {
                jQuery("#resumeFlipLastAction").text(ScriptVariables.Get('locLastViewed') + ' ' + candidateLastViewedDate);
                jQuery("#resumeFlipLastAction").show();
            }
            else {
                jQuery("#resumeFlipLastAction").hide();
            }
        }

        if (ScriptVariables.Get('FastFlipType') != DocumentType.App) {
            if (accountLastActionDate != '' && accountLastActionDate != null) {
                accountLastActionBar = true;
            }

            if (accountLastActionBar) {
                jQuery("#resumeFlipLastActionBarAction").text(accountLastAction);
                jQuery("#resumeFlipLastActionBarDate").text(accountLastActionDate);
                jQuery("#resumeFlipLastActionBar").show();
            }
            else {
                jQuery("#resumeFlipLastActionBar").hide();
            }
        }

        if (contype == 'plain-text') {
            jQuery("#FFResume").attr("class", "resumecontent");
            if (ScriptVariables.Get("CSI273765_Flipviewnextbtnissue")) {
                jQuery("#flip_next").parent('div').css("position", "absolute").css("margin-left", "762px");
                jQuery("div#HTMLResumeContainer").css("z-index", "1000");
            }
        }
        else {
            jQuery("#FFResume").attr("class", "htmlcontent");
            if (ScriptVariables.Get("CSI273765_Flipviewnextbtnissue")) {
                jQuery("#flip_next").parent('div').css("position", "absolute").css("margin-left", "762px");
                jQuery("div#HTMLResumeContainer").css("z-index", "1000");
            }
        }



        //Changes to handle the last activity check when user clicks the Email candidate option
        if (curResumes[index - 1].getFFSetEmailTo() != undefined && curResumes[index - 1].getFFSetEmailTo() == "True" && curResumes[index - 1].getFFResumeEmailID() != '') {
            _myFFUI._bypassemailcandidate = true;
            _myFFUI._candidateemailID = curResumes[index - 1].getFFResumeEmailID();
        }
        else {
            _myFFUI._bypassemailcandidate = false;
        }

        //Store email id to the document list
       
        jQuery.each(docs, function (i, item) {
            if (item.getDid() == curResumes[index - 1].getDid()) {
                docs[i].setFFSetEmailTo(curResumes[index - 1].getFFSetEmailTo());
                docs[i].setFFResumeEmailID(curResumes[index - 1].getFFResumeEmailID());
            }
        });
        _myIndexRef.setDocuments(docs);
        
        
        //showProfile
        if (_myFFUI.getShowProfile() == true) {
            //if (g_curResumeDID != did) {
            //g_curResumeDID = did;
            var profilehtml = curResumes[index - 1].getProfileContent();
            if (profilehtml != null && profilehtml != '') {
                jQuery('#resumeProfileContainer').html(profilehtml);
                jQuery('#divCEFixe').remove();
            }
            else
                _myFFUI.getResumeProfile(did);
            //}

            if (accountLastActionBar) {
                jQuery("#resumeProfileContainer").css('padding-top', '76px');
            }
            else {
                jQuery("#resumeProfileContainer").css('padding-top', '53px');
            }

            jQuery('#resumeProfileContainer').show();
            jQuery('#resumeContainer').hide();
        }
        else {
            var reshtml = curResumes[index - 1].getContent();
            jQuery("#resumeContainer").html(reshtml);

            if (accountLastActionBar) {
                jQuery("#resumeContainer").css('padding-top', '90px');
            }
            else {
                jQuery("#resumeContainer").css('padding-top', '67px');
            }

            //if (ScriptVariables.Get('IsResumeScoreFeatureEnable')) {
            //	if (ResumeScoreMatchEngine.IsRSScoreTabVisible()) {
            //		ResumeScoreMatchEngine.showResumeScoreContent();
            //	} else {
            //		ResumeScoreMatchEngine.showResumeFlipContent();
            //	}
            //} else {
            //	jQuery('#resumeContainer').show();
            //}
            jQuery('#resumeContainer').show();
            jQuery('#resumeProfileContainer').hide();
        }

        var searchKeywords = jQuery("#_FastFlip_hdnHighlightKeywords").val();
        var originalKeyWords = searchKeywords;

        if (searchKeywords.length > 0) {
            searchKeywords = _myFFUI.cleanKeyword(searchKeywords);
            //searchKeywords = '\java[a-zA-Z]*';
            
            jQuery.each(searchKeywords.split(','), function (index, value) {
                if (ScriptVariables.Get('HighlightRegularExpression') == "true") {
                    
                    if (originalKeyWords.indexOf(value + "*") != -1) {
                        
                            jQuery("#resumeContainer").highlight("\\" + RegExp.escape(value) + "[a-zA-Z]*");
                    }
                    else if (ScriptVariables.Get('Searchkeywordsupportspecialchar') == true && value.indexOf('-') !== -1) {
                        value = value.split('-');
                        value = value[0];
                        jQuery("#resumeContainer").highlight(value);
                      
                    }
                    else {
                        
                        //For searching whole word I am adding space here
                        jQuery("#resumeContainer").highlight(value);
                        jQuery("#resumeContainer").highlight(" " + value + " ");
                        jQuery("#resumeContainer").highlight(value + " ");
                        jQuery("#resumeContainer").highlight(" " + value);

                    }
                   
                } else {
                   
                    var options = { keyword: value };
                    jQuery("#resumeContainer").highlight(value);
                }
            });
        }

        if (curResumes[index - 1].getLiked() == true) {
            jQuery("#actionPanel li#like").attr("class", "unlike").attr("title", ScriptVariables.Get('ClickToUnlike')).children("#spnLike").html(ScriptVariables.Get('locLiked'));
        }
        else {
            jQuery("#actionPanel li#like").attr("class", "").attr("title", ScriptVariables.Get('ClickToLike')).children("#spnLike").html(ScriptVariables.Get('locLike2'));
        }


        $('#talentnetworkjoined').hide();
        $('#talentnetworkinvited').hide();
        $('#talentnetworkavailable').hide();
        if (ScriptVariables.Get('ShowTNOptions')) {
            if (tnjoinedresumeindices.toString().indexOf(_myFFUI.getCurrentResumeIndex()) >= 0) {
                $('#talentnetworkjoined').show();
            }
            else if (tninvitedresumeindices.toString().indexOf(_myFFUI.getCurrentResumeIndex()) >= 0) {
                $('#talentnetworkinvited').show();
            }
            else {
                $('#talentnetworkavailable').show();
            }
        }

    };
}

function Load1000Jobs() {
  
    jQuery.ajax({
        type: "GET",
        url: "../AJAX/GetJobsList.aspx",
        async: false,
        data: "LastLoadedJobDID=" + LastJobDID + "&sLastJobTitle=" + LastJobTitle,
        timeout: 40000,
        dataType: "json",
        success: function (msg) {
            
            $('#loadspinnerforJobs').hide();
            jQuery('html, body').css("cursor", "auto");
            jQuery(msg.Jobs).each(function () {
               
                var option = $('<option />');
                option.attr('value', this.did).text(this.name);

                jQuery('#ddlEmailJobList').append(option);
            });
            var showCount = jQuery('#ddlEmailJobList option').length - 1;
                        
                if (msg.Jobs.length == 1000) {
                    jQuery('#jobsCount').html('( Loaded :' + showCount + ' )');
                }
                else {
                    jQuery('#LoadMore').hide();
                    jQuery('#jobsCount').css({ "color": "red", "font-size": "10px"}).html('All ' + showCount + ' jobs loaded ');
                    jQuery('#jobsCount').fadeOut(7000);
                }
           
            LastJobTitle = msg.Jobs[msg.Jobs.length - 1].title;
            LastJobDID = msg.Jobs[msg.Jobs.length - 1].did;
        },
        error: function (xhr, status, error) {
            $('#loadspinnerforJobs').hide();
            jQuery('html, body').css("cursor", "auto");
            console.log(error);
        }
        
    });



}



