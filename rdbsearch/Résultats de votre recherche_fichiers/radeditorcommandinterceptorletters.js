<!--
 function ClientLoad(editor)
{
    var filter = editor.FiltersManager.GetFilterByName("FixUlBoldItalic");
    if (filter) {
		filter.Enabled = false;
	}
}
 
function ClientCommandExecuting(editor, commandName, tool) {

        if (commandName == 'Paste' || commandName == 'PastePlainText' 
          || commandName == 'PasteFromWord' || commandName == 'PasteAsHtml'
          || commandName == 'PasteFromWordNoFontsNoSizes'){
          
			if (navigator.appName.indexOf('Microsoft') != -1) {

               if (commandName == 'Paste') {
					return HandlePasteIE(editor);
			   } else {
					alert("Please use Ctrl+V to Paste");
					return false;
			   }
			   
			} else {
			
               if(commandName == 'Paste') {
                    if (tool != null){
                       alert("Please use Ctrl+V to Paste");
                       return false;
                    } else {
					   return HandlePasteOther(editor);
                    }
                } else {
                    alert("Please use Ctrl+V to Paste");
                    return false;
                }
				
			}
			
        } else {
            return true;
        }
		
	} 
	 
function HandlePasteIE(editor) {

	window.setTimeout(function() {
		var oScrubHTML = new CB.ScrubHTML('paste');
        oScrubHTML.getScrubbedForEditor(editor, editor.get_html());
    }, 80);
		
    return true;
}
	
function HandlePasteOther(editor) {

	window.setTimeout(function() {
		oTool = new Object();
		oTool.GetSelectedValue = function() { return "WORD_ALL"; }
		editor.Fire("FormatStripper", oTool);
			
		var oScrubHTML = new CB.ScrubHTML('paste');
        oScrubHTML.getScrubbedForEditor(editor, editor.get_html());
    }, 80);
		
    return true;
}
    
function ClientModeChange(editor) {
	
	//var mode = editor.get_mode();
	//if (mode == 2) {
	//	var oScrubHTML = new CB.ScrubHTML('mode');
	//	oScrubHTML.getScrubbedForEditor(editor, editor.get_html());
	//}          
}        

function OnClientSubmit(editor, args) {
	//this is a firefox bug we are tackling - unwanted <br> if its empty, lets strip it
	if(editor.get_html() == '<br>')
		editor.set_html('');
}
	
-->