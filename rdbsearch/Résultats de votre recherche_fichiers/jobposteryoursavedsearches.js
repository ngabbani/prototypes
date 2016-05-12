var count;
var nameClicks;
var modClicks;
var execClicks;

jQuery(document).ready(function () {
	nameClicks=0;
	modClicks=1;
	execClicks=0;
	count=0;
	//alert('#'+count);
	if(ScriptVariables.Get("YourSavedSearches") == true){
		jQuery("#YourSavedSearches").show();
	}
	addRow('.net searchhhhhhhhhhh', 'Sep 12, 2012 9:40a', 'Sep 12, 2012 9:50a');
	addRow('.net searchhhhhhhh', 'Sep 12, 2012 9:40a', 'Sep 12, 2012 9:50a');
	addRow('.net searchhhhhh', 'Sep 12, 2012 9:40a', 'Sep 12, 2012 9:50a');
	addRow('.net searchhhhh', 'Sep 12, 2012 9:40a', 'Sep 12, 2012 9:50a');
	addRow('.net searchhh', 'Sep 12, 2012 9:40a', 'Sep 12, 2012 9:50a');
	addRow('.net search', 'Sep 12, 2012 9:40a', 'Sep 12, 2012 9:50a');

	addRow('.net searchhhh longgggggg', 'Sep 12, 2012 9:40a', 'Sep 12, 2012 9:50a');
	addRow('.net searchhhh longgggggg', 'Sep 12, 2012 9:40a', 'Sep 12, 2012 9:50a');
	addRow('.net searchhhh longgggggg', 'Sep 12, 2012 9:40a', 'Sep 12, 2012 9:50a');
	addRow('.net searchhhh longgggggg', 'Sep 12, 2012 9:40a', 'Sep 12, 2012 9:50a');
	addRow('.net searchhhh longgggggg', 'Sep 12, 2012 9:40a', 'Sep 12, 2012 9:50a');
	addRow('.net searchhhh longgggggg', 'Sep 12, 2012 9:40a', 'Sep 12, 2012 9:50a');
	addRow('.net searchhhh longgggggg', 'Sep 12, 2012 9:40a', 'Sep 12, 2012 9:50a');
	addRow('.net searchhhh longgggggg', 'Sep 12, 2012 9:40a', 'Sep 12, 2012 9:50a');
	
			jQuery("#YourSavedSearches #closer").on('click', function(){
			jQuery('#YourSavedSearches').hide();
			});
			
			jQuery("#YourSavedSearches .row").on('dblclick', function(){
			jQuery('#YourSavedSearches').hide();
			});
		
	//triangle logic
			jQuery("#YourSavedSearches #searchNamesTitle").on('click', function(){
			if(nameClicks%2==0){
				modClicks=0;
				execClicks=0;
				jQuery('#YourSavedSearches #triangle').css('-webkit-transform', 'rotate(0deg)');
				jQuery('#YourSavedSearches #triangle').css('-moz-transform', 'rotate(0deg)');
				jQuery('#YourSavedSearches #triangle').css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=0)');
				jQuery('#YourSavedSearches #triangle').css('left', '8.45%');
				nameClicks++;
				
			}
			
			else {
				jQuery('#YourSavedSearches #triangle').css('-webkit-transform', 'rotate(180deg)');
				jQuery('#YourSavedSearches #triangle').css('-moz-transform', 'rotate(180deg)');
				jQuery('#YourSavedSearches #triangle').css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=2)');
				nameClicks++;
			}
			});
			
			jQuery("#YourSavedSearches #searchModifiedTitle").on('click', function(){
			if(modClicks%2==0){
				nameClicks=0;
				execClicks=0;
				jQuery('#YourSavedSearches #triangle').css('-webkit-transform', 'rotate(0deg)');
				jQuery('#YourSavedSearches #triangle').css('-moz-transform', 'rotate(0deg)');
				jQuery('#YourSavedSearches #triangle').css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=0)');
				jQuery('#YourSavedSearches #triangle').css('left', '44.6%');
				modClicks++;
			}
			
			else{
				jQuery('#YourSavedSearches #triangle').css('-webkit-transform', 'rotate(180deg)');
				jQuery('#YourSavedSearches #triangle').css('-moz-transform', 'rotate(180deg)');
				jQuery('#YourSavedSearches #triangle').css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=2)');
				modClicks++;
				}
			});
			
			jQuery("#YourSavedSearches #searchExecutedTitle").on('click', function(){
			if(execClicks%2==0){
				nameClicks=0;
				modClicks=0;
				jQuery('#YourSavedSearches #triangle').css('-webkit-transform', 'rotate(0deg)');
				jQuery('#YourSavedSearches #triangle').css('-moz-transform', 'rotate(0deg)');
				jQuery('#YourSavedSearches #triangle').css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=0)');
				jQuery('#YourSavedSearches #triangle').css('left', '71.85%');
				execClicks++;
			}
			else {
				jQuery('#YourSavedSearches #triangle').css('-webkit-transform', 'rotate(180deg)');
				jQuery('#YourSavedSearches #triangle').css('-moz-transform', 'rotate(180deg)');
				jQuery('#YourSavedSearches #triangle').css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=2)');
				execClicks++;
			}
			});

});
	

	
	
function addRow(name, modified, executed){
	var row = jQuery('<div class="row" id="searchRow'+count+'"></div>');
	var yourSavedNames = jQuery('<span class="truncate" id="yourSavedNames">'+name+'</span>');
	var lastModified = jQuery('<span id="lastModified">'+modified+'</span>');
	var lastExecuted = jQuery('<span id="lastExecuted">'+executed+'</span>');
	var btns = jQuery('<span id="btnYourSearches"></span>');
	var editButton = jQuery('<input name="editButton'+count+'" class="editButton" type="button" id="editButton'+count+'" value="Edit">');
	var runButton = jQuery('<input name="runButton'+count+'" class="runButton" type="button" id="runButton'+count+'" value="Run">');
	
	editButton.appendTo(btns);
	runButton.appendTo(btns);
	
	yourSavedNames.appendTo(row);
	lastModified.appendTo(row);
	lastExecuted.appendTo(row);
	btns.appendTo(row);
	
	row.appendTo(jQuery('#searchBox'));
	
	//jQuery('#searchRow'+count+' #yourSavedNames').html(name);
	
	//jQuery('#searchRow'+count+" #yourSavedNames").attr("title", jQuery("#yourSavedNames").html());
	
	//jQuery('#searchRow'+count+' #lastModified').html(modified);
	//jQuery('#searchRow'+count+' #lastExecuted').html(executed);
	count++;
}

	
	


